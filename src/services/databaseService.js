const { updateDatabase, getHighestBidder, getBoughtData } = require('../models/update-bids')
const { updateIndex } = require('../models/quotes.js')
const { runModel } = require('./index-model')
class DatabaseService {
    
    saveBid(bid, timestamp) {
        console.log(`Running query: 
        BID PunkIndex : ${bid.punkIndex} \n
        BID value : ${bid.value} \n
        BID usdValue : ${bid.usdValue} \n
        BID usdQuote : ${bid.usdQuote} \n        
        BID fromAddress : ${bid.fromAddress} \n
        BID blockNumber : ${bid.blockNumber} \n           
        TIMESTAMP : ${timestamp} \n`)

        bid.timestamp = timestamp;
        bid.eventType = 'bid'

        updateDatabase(bid, true);
    }

    async saveBought(bought, timestamp){
        console.log(`Running query: 
        BOUGHT PunkID : ${bought.punkIndex} \n
        BOUGHT value : ${bought.value} \n
        BOUGHT usdValue : ${bought.usdValue} \n
        BOUGHT usdQuote : ${bought.usdQuote} \n 
        BOUGHT toAddress : ${bought.toAddress} \n    
        BOUGHT fromAddress :${bought.fromAddress} \n
        BOUGHT blockNumber :${bought.blockNumber} \n           
        TIMESTAMP : ${timestamp} \n`)

        bought.timestamp = timestamp;
        bought.eventType = 'bought'

        if(bought.value === "0.0"){
            getHighestBidder(bought)
        } else {
            updateDatabase(bought, false)
        }      
    }

    async runTensorflow(){
        const result = await getBoughtData();
        return await runModel(result);
    }

    saveIndex(cPunkArray){
        
        const cPunkIndex = {
            timestamp : Date.now(),
            cPunkIndex : cPunkArray
        }
        
        updateIndex(cPunkIndex)
    }
}

module.exports = DatabaseService