const hre = require("hardhat");
const ethers = require('ethers');
const cryptoPunksMarket_ABI = require('../abis/cryptoPunksMarket_ABI.json')

const address = "0x7ba86a8216b2fd5b3f2a959b692486927482f6ae";
const provider = new ethers.providers.WebSocketProvider("wss://eth-rinkeby.ws.alchemyapi.io/v2/Oq7yS7NdZbdW-beaojb1-8CuN_mjBpFc");
const contract = new ethers.Contract(address, cryptoPunksMarket_ABI, provider);



const logBidEntered = async (feedManager) => {

    contract.on('PunkBidEntered', (...events) => {
        let punkIndex = events[0];
        let value = events[1];
        const fromAddress = events[2];
        const blockNumber = events[3].blockNumber;

        value = ethers.utils.formatUnits(value._hex);
        punkIndex = ethers.utils.formatUnits(punkIndex._hex).replace(/\./g, '');
        punkIndex = parseInt(punkIndex, 10);
        
        console.log(`///// PUNK BID ENTERED /////\n punkIndex : ${punkIndex} value : ${value} from Address : 
        ${fromAddress} blockNumber :${blockNumber}`)

        const bid =  {
            punkIndex : punkIndex,
            value : value,
            fromAddress : fromAddress, 
            blockNumber : blockNumber
        }
        feedManager.updateBid(bid);
    });

}

const logBought = async (feedManager) => {

    contract.on('PunkBought', (...events) => {
        let punkIndex = events[0];
        let value = events[1];
        const fromAddress = events[2];
        const toAddress = events[3];
        const blockNumber = events[4].blockNumber;

        value = ethers.utils.formatUnits(value._hex);
        punkIndex = ethers.utils.formatUnits(punkIndex._hex).replace(/\./g, '');
        punkIndex = parseInt(punkIndex, 10);
        
        console.log(`///// PUNK BOUGHT ///// \n punkIndex : ${punkIndex} value : ${value} from Address : 
        ${fromAddress} toAddress ${toAddress} blockNumber :${blockNumber}`)

        const bought =  {
            punkIndex : punkIndex,
            value : value,
            fromAddress : fromAddress,
            toAddress : toAddress,
            blockNumber : blockNumber
        }
        feedManager.updateBought(bought)
    });
}

module.exports = {logBidEntered, logBought}

