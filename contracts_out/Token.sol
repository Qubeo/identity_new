pragma solidity ^0.4.18;

import '../openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import '../openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol';

contract Token is MintableToken, PausableToken {
    string public constant name = "Token";
    string public constant symbol = "TOK";
    uint256 public constant decimals = 18;

    // Ad hoc limits
    uint public constant MAX_SUPPLY = 1000000000 * 1000000000000000000; //1mld. max cap of all tokens

    function Token(){
        pause();
    }

}