const FeedManager = require('./subscribers/feedManager');
const DatabaseService = require('./services/databaseService');
const punkFeed = require('./subscribers/punk-feed');

const feedManager = new FeedManager;
const databaseService = new DatabaseService;

const main = async () => {
    
    feedManager.on("Punk_Bid_Entered", (bid, timestamp) => {
        console.log('punk bid entered event emitted!')
        databaseService.saveBid(bid, timestamp)
    });
    
    feedManager.on('Punk_Bought', (bought, timestamp) => {
        console.log('punk bought event emitted!')
        databaseService.saveBought(bought, timestamp)
    });

    await punkFeed.logBought(feedManager);
    await punkFeed.logBidEntered(feedManager)    

}

main();







