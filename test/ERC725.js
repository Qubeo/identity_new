var ERC725 = artifacts.require('ERC725');


const PHASE = [
    'MANAGEMENT_KEY',
    'ACTION_KEY',
    'CLAIM_SIGNER_KEY',
    'ENCRYPTION_KEY'
];

var TOKEN_ERC725;


contract('ERC725', function(accounts) {
    const owner = accounts[0];
    var contract;

    context('Handling ETH and assets', () => {
        let token

        before(async () => {
            const sendAmountEth = web3.toWei(2, 'ether');
            const sendAmountToken = 2000;

            // send ETH to the identity contract
            await token.sendTransaction({
                from: owner,
                value: sendAmountEth
            });

            const balance = Number(web3.eth.getBalance(identity.address));
            assert(balance, sendAmountEth);

            //send ERC20 token to the identity contract
            token = await ERC20Mock.new();
            await token.transfer(identity.address, sendAmountToken, { from: owner });
            const tokenBalance = await token.balanceOf(identity.address);
            assert.equal(Number(tokenBalance), sendAmountToken);
        })


});