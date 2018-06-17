var ERC725_lite = artifacts.require('ERC725_lite');
var KeyHolder = artifacts.require('KeyHolder');
//const KeyHolder  = artifacts.require('./KeyHolder.sol')

// var assert = require('chai').assert;

const PHASE = [
    'MANAGEMENT_KEY',
    'ACTION_KEY',
    'CLAIM_SIGNER_KEY',
    'ENCRYPTION_KEY'
];

// Seznam otázek:
// Q: Užití before / beforeEach?
// Q: V Solidity - jak začínají enum? Od nuly nebo od jedničky? Budeme to používat?
// Q: Rozdílná syntax v rámci remixu?

// Q: Syntax
//      var a = await KeyHolder.methods.getKey(acctSha3).call() vs
//      var a = await KeyHolder.getKey(acctSha3)?

// Q: Rozsah testování - zahrnovat i např. testování, zda implementované jednotlivé funkce?

// Q: Používat describe()?

// Q: Proč mi to na jednom místě vrací číslo a na dalším ta samá funkce vrací BigNumber? :O

// Q: Používat samostatné "contract()" či "describe()" bloky?

// "Aby neumožňoval věci, které nechceš."

// Otestovat:
// Přidáš klíč: je fakt přidanej, není přidanej žádnej jinej.
// Odebíráš: je fakt odebranej.
// Z user stories pozice. Co může uživatel volat. Můžu je volat jen jako správnej vlastník.

// Testovat flow funkcí za sebou.

// Claimy:




contract('KeyHolder', function (accounts) {

    const owner = accounts[0];
    const deploy = {from: accounts[0]};
    let KH_instance;

    // Q: Má smysl takle pracovat s "instance"? A nemělo by smysl ji definovat už mimo "contract"?
    // Jak je to vůbec s instanciací? Vztah instancí v rámci JS vs. Solidity/EVM?

    // Q: KeyHolder.deployed() nefunguje (error: Network/artifact mismatch), new taky ne (error: The contract code couldn't be stored) - jaký je rozdíl?
    // Possible vysvětlení: "It looks like you're deploying an abstract contract (you have functions that aren't fully defined).
    // You can't deploy abstract contracts to the Ethereum blockchain. If you run into any more issues please open a new issue."

    // Q: Co je 'KeyHolder'? V rámci artifacts.require scope? contract() scope? Je to to samé, bo něco jiného?

    // Zkouším si různé assert varianty
    it("creates the contract", async function() {

        KH_instance = await KeyHolder.new(deploy);
        assert.isOk(KH_instance, "instance wasn't created");

        // Q: Nevím, proč .isOK "is not a function". Možná se vůbec ten assert nenačítá z chai? Bo?
        // A: Aha, ono je to totiž .isOk s malým k - ne .isOK!

        // Q: .new()? Nebo .deploy{)?

        // Q: Mám volat funkce pomocí KeyHolder.blabla(), nebo instance.blabla()?
        // V čem je rozdíl?


    });

    it("should return one", async function () {

        let one = await KH_instance.getOne();
        assert.isOk(one, "didn't get one: " + one);

        console.log("Returned from getOne: " + one);

        // Q: Jaký je rozdíl mezi těmito dvěmi formami volání? i.e. .getOne() a .getOne().call()?

        // Q: Jaktože tady mi getOne vrací 1, a v po-dalším bloku ta samá funkce vrací BigNumber cosi cosi?? :O
        // Může to být tím, že:
        //      - Tam je to zavřené v "try" bloku?
        //      - Tady mám rovnou "let one = ...", a tam nejprv definuju "let get_key;" prázdný?
        //      - Že je to druhý volání tý funkce?
        // Ani jedno z toho mi ale nedává příliš smysl.
        // Nestalo se to v moment, kdy jsem přidal abi.encodePackaged() do kontraktu náodou? Taky moc nedává smysl?

        // Q: Proč to hází "passed", když je tam chyba a tu funkci se nedaří zavolat?
        // Že by klíčovým kritériem byl výstup z volání "assert" funkce, a ne "try"?
        // Nebo úspěšný volání assert overrides tu chybu z "try"? Nebo mi tam chybí "throw"?
        // Ale někde se zase psalo, že throw je deprecated.
        // Zjistit.

        // Q: A najednou mi to tu .isOk assertion bere, zatraceně, jak to?
        // Je to tím require, co jsem dal na začátek? Ale proč by nefungoval ten implicitní "under the hood of Truffle"?
        // Zjistit.
        // A: Mohlo být též chybou .OK vs .Ok

    });

    // Learning účely. Jak souvisí s tím konkrétním kontraktem?
    it("returns balance properly", async function() {

        let balance;

        try {
            balance = await web3.eth.getBalance(accounts[0]);
        } catch (e) {
            console.log("Error getting the balance.");
        }

        console.log("Balance: " + balance);
    });


    /*@
    Je stejný klíč, který generuju skrze web3.sha3() fci v JS a ten, generovaný v kontraktu skrz keccak256()?
    (Neni to blbost?)
*/
    it('Test generated owner key should be the same as the contract generated one (keccak256)', async function() {

        let js_owner_key = web3.sha3(owner, {encoding: 'hex'});
        let got_key = await KH_instance.getOne();

        assert.equal(got_key, js_owner_key, "The JS and contract key aren't equal.");
    });

    it('should retrieve owner key', async function() {
        // Q: Jak v JS získat správný klíč?
        // var key = keccak256(owner), tak něco?

        // A: You can use web3.utils.soliditySha3()
        // Alternatively:
        // web3.sha3(web3.toHex(string1) + address1, {encoding:"hex"});
        // You need to make sure that the 1st argument that you pass to web3.sha3() function is equal to the
        // tightly packed arguments for keccak256 function in Solidity. The easiest way is to use web3.toHex()
        // for each argument (except addresses as they are already in hex), then concatenate the results
        // and set encoding to hex in the options for web3.sha3() as I've shown in the example.

        let js_owner_key = web3.sha3(owner, {encoding: 'hex'});
        let got_key;

        try {
            got_key = await KH_instance.getKey(js_owner_key);
        } catch (e) {
            console.log("Couldn't get the (owner) key.");
        }

        assert.isOk(got_key, "Assert: Didn't retrieve the key.")
        console.log(got_key);

        // Q: Dává smysl takhle mixovat try a assert?

        //console.log("Owner: " + owner);

        });


       // Q: Proč mi to po tom AssertionError nevypisuje už to console.log()?



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