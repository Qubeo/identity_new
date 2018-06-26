// var Web3EthAbi = require('web3-eth-abi');
const truffleAssert = require('truffle-assertions');

var ERC725_lite = artifacts.require('ERC725_lite');
var KeyHolder = artifacts.require('KeyHolder');


const PHASE = [
    'MANAGEMENT_KEY',
    'ACTION_KEY',
    'CLAIM_SIGNER_KEY',
    'ENCRYPTION_KEY'
];


contract('KeyHolder', (accounts) => {

    const owner = accounts[0];
    const deploy = {from: accounts[0]};
    var jsOwnerKey = web3.sha3(owner, {encoding: 'hex'});

    let KH_instance;

    /**
     * Initialization testsf
     * Should test:
     *      - Proper initialization?
     *      -
     */


    it('deploys the contract', async () => {

        KH_instance = await KeyHolder.new(deploy);
        assert.isOk(KH_instance, "instance wasn't created");

    });

    it('is initialized properly', async () => {
        console.log(jsOwnerKey);
        var gotKey = await KH_instance.getKey(jsOwnerKey);

        // Test: mělo by hodit chybu u pure, view fcí.

        console.log("GOOOOT: " + gotKey);

        // Q: Jakto, že nevrací BigNumber objekty tady?

        //assert.equal(gotKey[jsOwnerKey], [1]);
     //   assert.equal(res.keyType, 1)
     //   assert.equal(res.key, jsOwnerKey);
    })

    // Case - execute na nejakej case.

    it('returns account balance properly', async () => {

        let balance;

        try {
            balance = await web3.eth.getBalance(accounts[0]);
        } catch (e) {
            console.log("Error getting the balance.");
        }

        console.log("Balance: " + balance);
    });


    it('should return the ONE results, calling stuff etc.', async function () {

        let TX = await KH_instance.getOne();
        assert.isOk(TX, "didn not get the key" + TX);

         truffleAssert.eventEmitted(TX, 'CallStatus');

       // truffleAssert.eventEmitted(one, 'InternalCalled');

        console.log("Returned from getOne: " + one);
    });

    it('Test generated owner key should be the same as the contract generated one (keccak256)', async () => {

        let jsOwnerKey = web3.sha3(owner, {encoding: 'hex'});
        let got_key = await KH_instance.getOne();

        assert.equal(got_key, jsOwnerKey, "The JS and contract key aren't equal.");
    });



    it('should retrieve owner key', async () => {
        let got_key;

        try {
            got_key = await KH_instance.getKey(jsOwnerKey);
        } catch (e) {
            console.log("Couldn't get the (owner) key.");
        }

        assert.isOk(got_key, "Assert: Didn't retrieve the key.")
        console.log(got_key);

        });


    it('shouldnt accept invalid purpose', async () => {

    });


    /**
     * getKey() tests
     * What needs to be tested:
     *      - Retrieves the key
     *      - Returns error when the key doesn't exist
     *      -
     */

    it('should retrieve the key', async () => {


    });

    /**
     * addKey() tests
     * What needs to be tested:
     *      -
     *      - Allows only sender w/ MANAGEMENT_KEY to add key
     *      - How many added keys can be handled
     *      - Different callers (?)
     */

    describe('ABI stuff testing', () => {
        // Vypadá to, že EVM exception to házelo porušením require() týkající se vlastníka
        // Když jsem ho odkomentoval, vypadá to, že to něco dělá

        it('should call internal function getInternal through execute()', async () => {

            let executionValue = 0;

            // Nemělo by tohle ještě být bytes4(...)? A má to být hex? A nevymazat to 0x předtím?
            // let functionSelectorHex = web3.sha3("getInternal()");
            // TODO: Různé způsoby packování funkce a dat. Co to sežere?

            // var internalCallData = await KH_instance.getInternal.getData();

            // ERR: getData tu nefunguje
            // HPT: Možná je to pro to, že getInternal je internal, a tudíž není přístupná. Aha?
            // TODO: Test: Bude fungovat, když dočasně odstraním internal modifikátor? (DONE)
            // RES: Ne: "KH_instance.getInternal.getData is not a function"
            // TODO: Test: Funguje getData na jiných metodách?

            // let functionSelectorHex = web3.sha3("getInternal()");

            // Q: Který užití je správně?
            // "getInternal()" ~ 0x072e1e757c0c85ab5597d299bb365de57794f61321006a3048d7f6d15929f55e - encoding:hex
            // "getInternal()" ~ 0x078368ea82f77a7979ebc0685413a16465890795eb9cb371fec6cd5c4926b0af - default
            // A: Vypadá to, že bez "encoding: hex".


            //let functionSelectorHex = web3.sha3("getInternal()");
            let functionSelectorHex = "0x078368ea"; // "getInternal()" bytes4 - Jak?



            // let functionSelectorHex = web3.sha3("getInternal()", {encoding: 'hex'});

            // functionSelectorHex = web3.leftPad(functionSelectorHex, 64, 0);

            // HPT: Vypadá to, že v téhle formě to tu funkci zavolalo - InternalCalled(value: 25) emitted
            // RES: Nezavolalo, planej poplach. Viz níže.
            // ERR: Na druhou stranu neproběhl ani console.log s functionSelectorHex, tak jak mohlo dojít k
            //      volání execute(), které následuje až potom??
            // ERR: Navíc to vypadá, že to ten event občas emituje a občas ne, bez změn kódu. Huh?? Nějaký async kouzla?
            // RES: Event byl emitted, když jsem tam měl instance.getInternal().getData(), tím pádem to bylo volané přímo!
            //      Ale pořád nevím, proč někdy jo a někdy ne.

            // ERR: V tom eventu mi to taky hlásí nějaký divný "to:" - možná i (tady) bude kámen úrazu

            console.log("functionSelectorHex: " + functionSelectorHex);
            // console.log("functionSelector from getData(): " + internalCallData);

           // var TX = await KH_instance.execute(jsOwnerKey, executionValue, functionSelectorHex);

           // truffleAssert.eventEmitted(TX, 'InternalCalled');

            console.log(TX.logs);
        });

});

    describe('Adding a key', () => {

        it('should add a key', async () => {

            // Sem dát random vygenerovaný klíč třeba?
            //web3.utils.randomHex();

            let newKeyHex = 0x7f8ea497a7b20ad2704999762781ec6c99623cfc3504240af376ed1354661e5c;

            // Q: V jakém to má být formátu?
            // Jak to mám zabalit? Ty parametry do "data"?
            // Q: Co je, nebo jak se používá value? Jen jako množství čehosi pro transakci? Nebo?

            let executionValue = 0;
            let functionSelectorHex =  0xa820f50a;
            //let dataToExecute = "addKey(bytes32,uint256[],uint256)";

            // Q: Nemá ten selector být string místo hex čísla?
            // !! TEST

            let abiFunction = {
                name: 'addKey',
                type: 'function',
                inputs: [{
                    type: 'bytes32',
                    name: '_key'
                },{
                    type: 'uint256[]',
                    name: '_purposes'
                },{
                    type: 'uint256',
                    name: '_type'
                }],
                outputs: [{
                    type: 'bool',
                    name: 'success'
                }]
            };

            // [res] https://solidity.readthedocs.io/en/v0.4.24/abi-spec.html

            let abiParameters = [['bytes32','uint256[]','uint256'], [newKeyHex, ['1'], '1']];
           // let encodedFunction = Web3EthAbi.encodeFunctionCall(abiFunction, abiParameters);

            // Q: Nefunguje mi npm install web3-eth-abi, píše to, že kvůli tomu, že to nemůže najít Python.EXE. Funguje jinde?

           // var res = await KH_instance.execute(jsOwnerKey, executionValue, encodedFunction);


         //   console.log("Execute result: " + res);

            // Pozor, purposes je pole
           // let out = await KH_instance.addKey(newKeyHex, 1, 1);

            // Vytvorit exekuci, execute a pak approve se spravnyma datama, pak.
            // Volat skr set callu, kterejma k ni.
            // Treba z claimholder.


           // console.log("out.Events " + out.Events);

           // let gotKey = await KH_instance.getKey(newKeyHex);
               // assert.isEqual(gotKey.key, newKeyHex);
        });


        it('should not add an existing key', async () => {

        });

    });

/**
 * approve() tests
 * Should test for:
 *      -
 *      - Someone isn't approving already executed transaction?
 */

/**
 * removeKey() tests
 * Should test for:
 *      - Klíč je odsraněn, ale ne
 *      -
 */

    it('should retrieve owner key', async () => {

    });

    /**
     * getKeysByPurpose() tests
     * Should test for:
     *      - Proper response
     *      -
     */

    it('should get key purpose', async () => {
        let purposes = await KH_instance.getKeyPurposes(jsOwnerKey);
        console.log("Purposes: " + purposes);
        // Měl by být MANAGEMENT_KEY, tedy 1 ?
        //assert.equal(res, 1)
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
     *
     */



});