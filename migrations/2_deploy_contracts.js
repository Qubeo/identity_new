//const TokenSale = artifacts.require('TokenSale');
//const Token = artifacts.require('Token');
//const MultiSig = artifacts.require('MultiSigWallet');
//const ClaimHolder = artifacts.require('ClaimHolder');
const KeyHolder = artifacts.require('KeyHolder');
const ByteArr = artifacts.require('ByteArr');
const ERC725 = artifacts.require('ERC725');
const ERC725_lite = artifacts.require('ERC725_lite');
const ERC735 = artifacts.require('ERC735');

var ganache = require("ganache-cli");

// Q: Jak tohle funguje? Co je 'Token' např.?

web3.setProvider(ganache.provider());

//var endTime = Math.round(Date.now() / 1000) + 1000;

module.exports = function (deployer) {
    deployer.deploy(ByteArr).then(() => {
        deployer.link(ByteArr, KeyHolder);
    return deployer.deploy(KeyHolder);
    });
};

//module.exports = function (deployer) {
//  deployer.deploy(TokenSale, endTime, '0x8e5b0a71b997d8358169e15c2fed588f708c4278');
//  deployer.link(TokenSale, Token);
//    deployer.deploy(ByteArr);
//
    // Q: Netuším nakolik je tu tohle potřeba. Vyzkoušet.
//    deployer.deploy(KeyHolder);
//};

// Q: Z nějakýho důvodu když jsem tu nechal deploy.deploy(KeyHolder), tak mi to přestalo vypisovat barevné výsledky testů? :o
// Teda pokud to nebylo něčím ještě jiným, ale myslím, že nic dalšího jsem neměnil.

// Q: Jak funguje kompilace / migrace? Jaký kontrakty se kompilujou? Všechny ve složce contracts, nebo jen ty definovaný někde?
// Zatím mám dojem, že všechny v tý složce, protože jsem je odstranil z deploy_contracts a přesto se je to snaží kompilovat.
