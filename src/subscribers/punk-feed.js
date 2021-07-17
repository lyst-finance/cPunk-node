const ethers = require('ethers');
const axios = require('axios')
const cryptoPunksMarket_mainnet_ABI = require('../abis/cryptoPunksMarket_mainnet_ABI.json')

const address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";
const provider = new ethers.providers.WebSocketProvider("wss://eth-mainnet.ws.alchemyapi.io/v2/gRR0KK-rRxTfSUdGd_g11RvpjrgCRN8a");
const contract = new ethers.Contract(address, cryptoPunksMarket_mainnet_ABI, provider);

const logBidEntered = async (feedManager) => {

    contract.on('PunkBidEntered', async (...events) => {
        let punkIndex = events[0];
        let value = events[1];
        const fromAddress = events[2];
        const blockNumber = events[3].blockNumber;

        value = ethers.utils.formatUnits(value._hex);
        punkIndex = ethers.utils.formatUnits(punkIndex._hex).replace(/\./g, '');
        punkIndex = parseInt(punkIndex, 10);
        
        console.log(`///// PUNK BID ENTERED /////\n punkIndex : ${punkIndex} value : ${value} from Address : 
        ${fromAddress} blockNumber :${blockNumber}`)

        const usdValue = await getUSDValue(value);
        const usdQuote = await getUSDQuote();

        const bid =  {
            punkIndex : punkIndex,
            value : value,
            usdValue : usdValue,
            usdQuote : usdQuote,
            fromAddress : fromAddress, 
            blockNumber : blockNumber
        }
        feedManager.updateBid(bid);
    });

}

const logBought = async (feedManager) => {

    contract.on('PunkBought', async (...events) => {
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

        const usdValue = await getUSDValue(value);
        const usdQuote = await getUSDQuote();

        const bought =  {
            punkIndex : punkIndex,
            value : value,
            usdValue : usdValue,
            usdQuote : usdQuote,
            fromAddress : fromAddress,
            toAddress : toAddress,
            blockNumber : blockNumber
        }
        feedManager.updateBought(bought)
    });
}

const getUSDValue = async (value) => {
    let response;
        try{
            response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
            console.log("^^^COIN GECKO RESPONSE ^^^ ", response.data.ethereum.usd);
        } catch(error) {
            console.log(error)
        }
    return value * response.data.ethereum.usd    
}

const getUSDQuote = async () => {
    let response;
        try{
            response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
            console.log("^^^COIN GECKO RESPONSE ^^^ ", response.data.ethereum.usd);
        } catch(error) {
            console.log(error)
        }
    return response.data.ethereum.usd    
}

module.exports = {logBidEntered, logBought}

