pragma solidity ^0.4.18;
import './ERC725_lite.sol';
import './ByteArr.sol';

contract KeyHolder is ERC725_lite {
    using ByteArr for bytes;
    using ByteArr for bytes32[];
    using ByteArr for uint256[];

    uint256 executionNonce;

    mapping (bytes32 => Key) keys;
    mapping (uint256 => bytes32[]) keysByPurpose;
    mapping (uint256 => Execution) executions;

    // !! Test, odstranit
    bytes32 testKey;

    constructor() public {
        bytes32 _key = keccak256(abi.encodePacked(msg.sender));

        keys[_key].key = _key;
        //keys[_key].purposes = PURPOSES.MANAGEMENT_KEY;
        keys[_key].purposes = [1];

        keys[_key].keyType = 1;
        keysByPurpose[1].push(_key);
        emit KeyAdded(_key, keys[_key].purposes, 1);

        testKey = _key;
    }

    event CallStatus(bool status);
    event InternalCalled(uint256 value);
    event ExecutionFailed(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);

// Offchain, DB, jako "log"
// Vracení polí v Solidity. Off / on chain.

    // !! Test, skeleton
    function getKey(bytes32 _key) public view returns(uint256[] purposes, uint256 keyType, bytes32 key) {
        return (keys[_key].purposes, keys[_key].keyType, keys[_key].key);
    }

    function getOne() public returns(bytes32 one) {

        // Q: address(this) vs. msg.sender()?

        // bool success = msg.sender.call("0x078368ea");
        // bool success = address(this).call("078368ea");
        // bool success = address(this).call(bytes4(keccak256("getInternal()")));

        // bool success = msg.sender.call(0x862642f5, testKey);

        if (!msg.sender.call.gas(500000)(bytes4(keccak256("getInternal()")))) {
            emit CallStatus(false);
        } else {
            emit CallStatus(true);
        }// E's storage is set, D is not modified

        one = testKey;
        return one;

    // RES: Possibly relevant.
    // https://ethereum.stackexchange.com/questions/29267/why-does-it-not-work-if-i-dont-handle-the-return-value-of-call-callcode-delegat?rq=1


    }

    function getInternal() internal returns (uint256 twentyfive) {
        emit InternalCalled(25);
        testKey = 0x12345678;
        return 25;

    }


    // Setters

    function addKey(bytes32 _key, uint256[] _purposes, uint256 _type) internal returns (bool success) {

        require(keys[_key].key != _key);

        keys[_key].key = _key;
        keys[_key].purposes = _purposes;
        keys[_key].keyType = _type;

        for (uint i = 0; i < _purposes.length; i++) {
            keysByPurpose[_purposes[i]].push(_key);
        }

        // Nebude enum, ale separátní registr. Mělo by se pak ověřovat, jestli není mimo hodnoty vymezené specifikace.

        emit KeyAdded(_key, _purposes, _type);
        return true;
    }

    function getKeysByPurpose(uint256 _purpose) public view returns(bytes32[] _keys) {
        return keysByPurpose[_purpose];
    }

    function keyHasPurpose(bytes32 _key, uint256 _purpose) public view returns(bool result) {
        bool isThere;

        // Q: Co to je za syntax? Nemá to ověřovat, zda je _purpose jedním z purposes?
        (,isThere) = keys[_key].purposes.indexOf(_purpose);
        return isThere;
    }

    // !! TODO: vyplnit - skelet
    function getKeyPurposes(bytes32 _key) public view returns(uint256[] purpose) {
        return keys[_key].purposes;
    }

    // Udělá se hash názvu fce, vezmou se 4 bajty

    // Q: Proč by někdo z vnější měl mít možnost volat approve true nebo false?

    function approve(uint256 _id, bool _approve) public returns (bool success) {
        address to = executions[_id].to;
        bytes4 fHash = executions[_id].data.getFuncHash();

    // Q: Neměla by ta .call funkce brát za argument až výsledek getFuncHash na těch datech?
    // A argumenty až v dalších parametrech?

    // Vezme ty první 4b
    // Pokud za data tenhle kontrakt, je to něco s tímhle kontraktem
    // Autoreferenční.
    // Low level volání fcí.


    // Objekt v execution: parametry transakce. Míto jako transakce do EVM, jen zabalí v kontraktu samotným, aby pak mohl rozparsovat, zavolat.
    // První 4b. EVM se podívá na data, první 4b indikuje, co voláš. Pak se podívá do celýho bytecode, co voláš.
    // Kontrakt definován bajtkódem.
    // EVM bere init data, co volat, najde.

    // Hash string fce. Jakej string?

//  "a820f50a": "addKey(bytes32,uint256[],uint256)",
// 	"747442d3": "approve(uint256,bool)",
// 	"b61d27f6": "execute(address,uint256,bytes)",
// 	"862642f5": "removeKey(bytes32)"
//  "078368ea": "getInternal()" ~ 0x078368ea82f77a7979ebc0685413a16465890795eb9cb371fec6cd5c4926b0af




    if (to == address(this)) {
        if (fHash == 0xa820f50a || fHash == 0x862642f5) {
            require(keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1));
        }
        else {
            require(keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 2));
        }
    }
    else {
           // require(keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 2));
        // !!! TODO: Bacha, tady jsem zakomentoval důležitej kus kódu pro otestování volání execute.
        // Q: TEST -> Jak by se odhalila tahle chyba? (Chybějící require.)
        // ...

    }

        // Prpoč by někdo volal approve s "false" approved.
        // ...

        emit Approved(_id, _approve);
        // Tohle bych dal až po if _approve == true, tady je to zavádějící?

        if (_approve == true) {
            executions[_id].approved = true;
            //success = executions[_id].to.call(executions[_id].data, 0);
            //success = executions[_id].to.call(0x078368ea);

            //bytes4 dHash = executions[_id].data.getFuncHash();
            success = msg.sender.call("0x078368ea");
            //success = msg.sender.call(0x078368ea);
            //success = msg.sender.call(dHash);

            // ERR: Deklarujeme tady někde success? Není to chyba? Nebo ho deklarujeme v definici návratové hodnoty fce?


            // !!! TODO: Bacha, tady jsem zakomentoval druhej parametr .call()
            // TODO: Zkusit zavolat nějakou funkci natvrdo
            // Q: Jak pracovat s návratovou hodnotou transakce volaný takhle?

            // TODO: !! Zjistit
            // Nevim, proč je tam ta nula. Maj bejt data, bo parametr... bo něco asi? _value možná, jakožto soubor parametrů pro exekuovanou fci?


            // Na tu adresu udělá ten call.
            // Vezme všechen gas a... ??
            // Q: Zjistit, jak funguje gas v tomhle případě.

            if (success) {
                executions[_id].executed = true;
                emit Executed(_id, executions[_id].to, executions[_id].value, executions[_id].data);
                return;
            } else {
                emit ExecutionFailed(_id, executions[_id].to, executions[_id].value, executions[_id].data);
                return;
            }
        } else {
            executions[_id].approved = false;
        }
        return true;
        // Q: Pro "koho" důleižé cosi.
    }

// Aby approved, musis mit ID execution
// Nejprv execute, specifikujes komu a hodnotu
// Data: v hexu popsanej nejakej iniciator exekuce. Zacina ID fce, dalsi data, odvijej se od parametru.
// Zkusit si v remixu. ID a params.
// Vrati execution ID

    function execute(address _to, uint256 _value, bytes _data) public returns (uint256 executionId) {
        require(!executions[executionNonce].executed);

        executions[executionNonce].to = _to;
        executions[executionNonce].value = _value;
        executions[executionNonce].data = _data;

// Kdyz z uctu MGMT permission.
// Edge case, chyba: z uctu action...

// Flow:
// Můžeš tuhle funkci exekuovat z jakýhokoliv kontraktu
// Muzou lidi nespjati s kontraktem
// Je jen pro usnadneni.
// adresy, nektery neasociovany
// Funkce approve samotna, volat nejcasteji.
// 10 execution requests jakozto majitel, vybiras, ktery potvrditm.

// Internal funkce addKey. Může se volat jen skrz Execute request.
// I ty testy především pro public funkce, ne internal tolik.
// Cokoliv volaný z venčí je bezpečný.


        if (keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1) || keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 2)) {
            approve(executionNonce, true);
        }

        emit ExecutionRequested(executionNonce, _to, _value, _data);

        executionNonce++;
        return executionNonce-1;
    }

    function removeKey(bytes32 _key) internal returns (bool success) {
        require(keys[_key].key == _key);
        emit KeyRemoved(keys[_key].key, keys[_key].purposes, keys[_key].keyType);

        for (uint i = 0; i < keys[_key].purposes.length; i++) {
            uint index;
            (index,) = keysByPurpose[keys[_key].purposes[i]].indexOf(_key);
            keysByPurpose[keys[_key].purposes[i]].removeByIndex(index);
        }

        delete keys[_key];

        return true;
    }


/* LEARNING:
Užití events v rámci Solidity / JS debuggingu:

var voteCast = someContract.voteCast();
voteCast.watch(function(err, result) {/ some callback /});

// Alternately, to get the events all at once.
voteCast.get(function(err, result) / some other callback /)

*/

// Token je aplikace.
// Standard definuje jen interface.

}