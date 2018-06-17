var ERC725_lite = artifacts.require('ERC725_lite');
var KeyHolder = artifacts.require('KeyHolder');


const PHASE = [
    'MANAGEMENT_KEY',
    'ACTION_KEY',
    'CLAIM_SIGNER_KEY',
    'ENCRYPTION_KEY'
];


contract('KeyHolder', function (accounts) {

    const owner = accounts[0];
    const deploy = {from: accounts[0]};
    var js_owner_key = web3.sha3(owner, {encoding: 'hex'});

    let KH_instance;

    /**
     * Initialization tests
     * Should test:
     *      - Proper initialization?
     *      -
     */

    it('deploys the contract', async function() {

        KH_instance = await KeyHolder.new(deploy);
        assert.isOk(KH_instance, "instance wasn't created");

    });

    it('is initialized properly', async function() {
        console.log(js_owner_key);
        var gotKey = await KH_instance.getKey(js_owner_key);

        console.log(gotKey);

        //assert.equal(gotKey[js_owner_key], [1]);
     //   assert.equal(res.keyType, 1)
     //   assert.equal(res.key, js_owner_key);
    })

    it('returns account balance properly', async function() {

        let balance;

        try {
            balance = await web3.eth.getBalance(accounts[0]);
        } catch (e) {
            console.log("Error getting the balance.");
        }

        console.log("Balance: " + balance);
    });


    it('should return the ', async function () {

        let one = await
        KH_instance.getOne();
        assert.isOk(one, "didn not get the key" + one);

        console.log("Returned from getOne: " + one);
    });

    it('Test generated owner key should be the same as the contract generated one (keccak256)', async function() {

        let js_owner_key = web3.sha3(owner, {encoding: 'hex'});
        let got_key = await KH_instance.getOne();

        assert.equal(got_key, js_owner_key, "The JS and contract key aren't equal.");
    });

    it('should retrieve owner key', async function() {
        let got_key;

        try {
            got_key = await KH_instance.getKey(js_owner_key);
        } catch (e) {
            console.log("Couldn't get the (owner) key.");
        }

        assert.isOk(got_key, "Assert: Didn't retrieve the key.")
        console.log(got_key);

        });


    it('shouldnt accept invalid purpose', async function() {

    });


    /**
     * getKey() tests
     * What needs to be tested:
     *      - Retrieves the key
     *      - Returns error when the key doesn't exist
     *      -
     */

    it('should retrieve the key', async function() {


    });

    /**
     * addKey() tests
     * What needs to be tested:
     *      -
     *      - Allows only sender w/ MANAGEMENT_KEY to add key
     */

    it('should add a key', async function() {

        // Sem dát random vygenerovaný klíč
        //web3.utils.randomHex();

        let newKeyHex = 0x7f8ea497a7b20ad2704999762781ec6c99623cfc3504240af376ed1354661e5c;

        // Pozor, purposes je pole
        let out = await KH_instance.addKey(newKeyHex, 1, 1);

        console.log("out.Events " + out.Events);

        let gotKey = await KH_instance.getKey(newKeyHex);

        assert.isEqual(gotKey.key, newKeyHex);

    });


    it('should not add an existing key', async function() {

    });

    /**
     * removeKey() tests
     * Should test for:
     *      -
     *      -
     */

    it('should retrieve owner key', async function() {

    });

    /**
     * getKeysByPurpose() tests
     * Should test for:
     *      - Proper response
     *      -
     */

    it('should get key purpose', async function() {
        let purpose = await KH_instance.getKeyPurpose(js_owner_key);
        // Měl by být MANAGEMENT_KEY, tedy 1 ?
        assert.equal(res, 1)
    })

    /**
     * keyHasPurpose() tests
     * Should test for:
     */

    /**
     * getKeyPurposes() tests
     * Should test for:
     */


    /**
     * execute() tests
     * Should test for:
     */



});