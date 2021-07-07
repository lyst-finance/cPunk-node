const { updateDatabase } = require('../models/update-bids')

class DatabaseService {
    
    saveBid(bid, timestamp) {
        console.log(`Running query: 
        BID PunkID :(${bid.punkIndex} \n
        BID value :(${bid.value} \n
        BID fromAddress :(${bid.fromAddress} \n
        BID blockNumber :(${bid.blocklNumber} \n           
        TIMESTAMP :    ${timestamp})`)

        bid.timestamp = timestamp;
        bid.eventType = 'bid'

        updateDatabase(bid, true);
    }

    saveBought(bought, timestamp){
        console.log(`Running query: 
        BOUGHT PunkID :(${bought.punkIndex} \n
        BOUGHT value :(${bought.value} \n
        BOUGHT toAddress :(${bought.toAddress} \n    
        BOUGHT fromAddress :(${bought.fromAddress} \n
        BOUGHT blockNumber :(${bought.blocslNumber} \n           
        TIMESTAMP :    ${timestamp})`)

        bought.timestamp = timestamp;
        bought.eventType = 'bought'

        updateDatabase(bought, false) 
    }
}

module.exports = DatabaseService