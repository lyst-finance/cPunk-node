const EventEmitter = require('events');

class FeedManager extends EventEmitter {

    updateBid(bid) {
        this.emit("Punk_Bid_Entered", bid, Date.now());
    }

    updateBought(bought){
        this.emit("Punk_Bought", bought, Date.now())
    }
}

module.exports = FeedManager
