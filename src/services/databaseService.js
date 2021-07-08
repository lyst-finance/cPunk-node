const { updateDatabase, getHighestBidder } = require('../models/update-bids')

class DatabaseService {
    
    saveBid(bid, timestamp) {
        console.log(`Running query: 
        BID PunkIndex :${bid.punkIndex} \n
        BID value :(${bid.value} \n
        BID usdValue :(${bid.usdValue} \n
        BID usdQuote :(${bid.usdQuote} \n        
        BID fromAddress :${bid.fromAddress} \n
        BID blockNumber :${bid.blockNumber} \n           
        TIMESTAMP : ${timestamp}`)

        bid.timestamp = timestamp;
        bid.eventType = 'bid'

        updateDatabase(bid, true);
    }

    saveBought(bought, timestamp){
        console.log(`Running query: 
        BOUGHT PunkID :${bought.punkIndex} \n
        BOUGHT value :${bought.value} \n
        BOUGHT usdValue :${bought.usdValue} \n
        BOUGHT usdQuote :(${bought.usdQuote} \n 
        BOUGHT toAddress :${bought.toAddress} \n    
        BOUGHT fromAddress :${bought.fromAddress} \n
        BOUGHT blockNumber :${bought.blockNumber} \n           
        TIMESTAMP :    ${timestamp}`)

        bought.timestamp = timestamp;
        bought.eventType = 'bought'

        if(bought.value === "0.0"){
            getHighestBidder(bought)
        } else {
            updateDatabase(bought, false)
        }
         
    }
}

module.exports = DatabaseService