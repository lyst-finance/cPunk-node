const FeedManager = require('./subscribers/feedManager');
const DatabaseService = require('./services/databaseService');
const punkFeed = require('./subscribers/punk-feed');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const feedManager = new FeedManager;
const databaseService = new DatabaseService;

const main = async () => {

    app.use(express.json())

    app.listen(3000, () => console.log('server has started'));

    const quotesRouter = require('./api/quotes')
    app.use('/quote', quotesRouter)
    
    feedManager.on("Punk_Bid_Entered", (bid, timestamp) => {
        databaseService.saveBid(bid, timestamp)
    });
    
    feedManager.on('Punk_Bought', async (bought, timestamp) => {
        await databaseService.saveBought(bought, timestamp);
        const cPunkIndex = await databaseService.runTensorflow();
        console.log('INDEX >>>', cPunkIndex);
        databaseService.saveIndex(cPunkIndex);  
    });

    await punkFeed.logBought(feedManager);
    await punkFeed.logBidEntered(feedManager)    
}

main();







