var ERC725_lite = artifacts.require('ERC725_lite');
var KeyHolder = artifacts.require('KeyHolder');
//const KeyHolder  = artifacts.require('./KeyHolder.sol')

var assert = require('chai').assert;

const PHASE = [
    'MANAGEMENT_KEY',
    'ACTION_KEY',
    'CLAIM_SIGNER_KEY',
    'ENCRYPTION_KEY'
];


contract('KeyHolder', function (accounts) {

    const owner = accounts[0];
    const deploy = {from: accounts[0]};

    // Q: KeyHolder.deployed() nefunguje (error: Network/artifact mismatch), new taky ne (error: The contract code couldn't be stored) - jaký je rozdíl?
    // Possible vysvětlení: "It looks like you're deploying an abstract contract (you have functions that aren't fully defined).
    // You can't deploy abstract contracts to the Ethereum blockchain. If you run into any more issues please open a new issue."

    // Q: Co je 'KeyHolder'? V rámci artifacts.require scope? contract() scope? Je to to samé, bo něco jiného?

    // Zkouším si různé assert varianty
    it("creates the contract", async function() {

        let instance = await KeyHolder.new(deploy);
        //assert.isNotNy(instance, "instance wasn't created");
        assert.isOK(instance);


    });

    it("returns balance properly", async function() {

        let balance;

        try {
            balance = await web3.eth.getBalance(accounts[0]);
        } catch (e) {
            console.log("Error getting the balance.");
        }

        console.log("Balance: " + balance);
    });



    it('should retrieve owner key', async function() {
        // Q: Jak v JS získat správný klíč?
        // var key = keccak256(owner), tak něco?
        const got_key = await KeyHolder.getKey(owner).call();
        assert.isNotNull(got_key);
        console.log(got_key);
    });

// beforeEach(async () => {
//    it('gets created', async () => {

//        var deploy = {from: accounts[0]};
//        KEY_HOLDER = await KeyHolder.new(deploy);

//        assert.isError(KEY_HOLDER);

//    });
// });

//    it('exists', async () => {
//       assert.isNotNull(KEY_HOLDER);
//       console.log(KEY_HOLDER);
//    });



    // await KEY_HOLDER.unpause({from: accounts[0]});
    // await KEY_HOLDER.mint(accounts[0], '1000', {from: accounts[0]});

  //   it('should get key'), async () => {
  //     //var res = await KEY_HOLDER.getKey(owner);
  //
  // }

 //   it('should respond to getKeyPurpose', async function() {
 //       var res = await KEY_HOLDER.methods.keyHasPurpose().call();
 //       assert.equal(res, '1')
 //   })



//    it('creation: should not create any tokens when created', async () => {
//            const totalSupply = await KEY_HOLDER.totalSupply.call()
//            assert.strictEqual(totalSupply.toNumber(), 10000)

});