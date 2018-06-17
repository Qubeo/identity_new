pragma solidity ^0.4.18;

import '../openzeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol';

contract TokenSale is FinalizableCrowdsale {
    using SafeMath for uint256; 
    
    // Define sale
    uint public constant RATE = 7400;
    uint public constant TOKEN_SALE_LIMIT = 50000 * 1000000000000000000;

    uint public constant FIRST_BONUS_RATIO = 100000000 * (1 ether / 1 wei);// +40% bonus
    uint public constant SECOND_BONUS_RATIO = 200000000 * (1 ether / 1 wei);// + 20% bonus

    uint256 public constant TOKENS_FOR_OPERATIONS = 630000000*(10**18);
    uint256 public constant TOKENS_FOR_SALE = 370000000*(10**18);

    enum Phase {
        Created,//Inital phase after deploy
        PresaleRunning, //Presale phase
        Paused, //Pause phase between pre-sale and main token sale or emergency pause function
        ICORunning, //Main token-sale phase
        FinishingICO //Final phase when main token sale is closed and time is up
    }

    Phase public currentPhase = Phase.Created;
    
    event LogPhaseSwitch(Phase phase);

    // Constructor
    function TokenSale(uint256 _end, address _wallet)
             FinalizableCrowdsale()
             Crowdsale(_end, _wallet) {
    }

    /// @dev Lets buy you some tokens.
    function buyTokens(address _buyer) public payable {
        // Available only if presale or ico is running.
        require((currentPhase == Phase.PresaleRunning) || (currentPhase == Phase.ICORunning));
        require(_buyer != address(0));
        require(msg.value > 0);
        require(validPurchase());

        uint256 weiAmount = msg.value;
        weiRaised = weiRaised.add(weiAmount);

        uint newTokens = msg.value * RATE;

        require(weiRaised < TOKEN_SALE_LIMIT);

        newTokens = addBonusTokens(token.totalSupply(), newTokens);

        token.mint(_buyer, newTokens);
        TokenPurchase(msg.sender, _buyer, weiAmount, newTokens);

        forwardFunds();
    }

    // @dev Adds bonus tokens by token supply bought by user
    // @param _totalSupply total supply of token bought during pre-sale/ico
    // @param _newTokens tokens currently bought by user
    function addBonusTokens(uint256 _totalSupply, uint256 _newTokens) internal view returns (uint256) {
         if (_totalSupply + _newTokens <= FIRST_BONUS_RATIO) return _newTokens.add(_newTokens * 40/100); //first 100 000 000 get 40% bonus
         if (_totalSupply + _newTokens <= SECOND_BONUS_RATIO) return _newTokens.add(_newTokens * 20/100); //second 100 000 000 get 20% bonus
         if (_totalSupply + _newTokens > SECOND_BONUS_RATIO) return _newTokens.add(_newTokens * 10/100);  //third 100 000 000 get 10% bonus
    }

    function validPurchase() internal view returns (bool) {
        bool withinPeriod = now <= endTime;
        bool nonZeroPurchase = msg.value != 0;
        bool isRunning = ((currentPhase == Phase.ICORunning) || (currentPhase == Phase.PresaleRunning));
        return withinPeriod && nonZeroPurchase && isRunning;
    }

    function setSalePhase(Phase _nextPhase) public onlyOwner {
        bool canSwitchPhase
        =  (currentPhase == Phase.Created && _nextPhase == Phase.PresaleRunning)
        || (currentPhase == Phase.PresaleRunning && _nextPhase == Phase.Paused)
        || ((currentPhase == Phase.PresaleRunning || currentPhase == Phase.Paused)
        && _nextPhase == Phase.ICORunning)
        || (currentPhase == Phase.ICORunning && _nextPhase == Phase.Paused)
        || (currentPhase == Phase.Paused && _nextPhase == Phase.FinishingICO)//Quick shutdown in case of emergency pause
        || (currentPhase == Phase.ICORunning && _nextPhase == Phase.FinishingICO);

        require(canSwitchPhase);
        currentPhase = _nextPhase;
        LogPhaseSwitch(_nextPhase);
    }

    // Finalize
    function finalization() internal {
        uint256 notSold = TOKENS_FOR_SALE - token.totalSupply();
        uint256 toMint = TOKENS_FOR_OPERATIONS.add(notSold);
        token.mint(wallet, toMint);
        token.finishMinting();
        //token.unpause();
        token.transferOwnership(wallet);
    }

    // Constant functions
    function getCurrentPhase() public view returns (string CurrentPhase) {
        if (currentPhase == Phase.Created) {
            return "Created";
        } else if (currentPhase == Phase.PresaleRunning) {
            return "PresaleRunning";
        } else if (currentPhase == Phase.Paused) {
            return "Paused";
        } else if (currentPhase == Phase.ICORunning) {
            return "ICORunning";
        } else if (currentPhase == Phase.FinishingICO) {
            return "FinishingICO";
        }
    }
}
