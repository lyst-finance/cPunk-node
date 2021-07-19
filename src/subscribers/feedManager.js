const EventEmitter = require('events');

class FeedManager extends EventEmitter {

    updateBid(bid) {
        this.emit("Punk_Bid_Entered", bid, Date.now());
    }

    updateBought(bought){
        this.emit("Punk_Bought", bought, Date.now())
    }

    updateClientHistorical(){
        this.emit("update_chart");
        console.log('update event emitted');
    }

    updateClientFeed(){
        this.emit("update_client_feed");
        console.log('update client feed emitted');
    }
}

module.exports = FeedManager
