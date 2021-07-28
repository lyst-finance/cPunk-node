const FeedManager = require('./src/subscribers/feedManager');
const DatabaseService = require('./src/services/databaseService');
const punkFeed = require('./src/subscribers/punk-feed');
const express = require('express');
const Websocket = require('ws');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000

const feedManager = new FeedManager;
const databaseService = new DatabaseService;
const wss = new Websocket.Server({ server:server });

const main = async () => {

    app.use(express.json());
    app.use(cors());
    
    server.listen(port, () => console.log('server has started'));  
    
    const quotesRouter = require('./src/api/quotes')
    app.use('/quote', quotesRouter)

    const historicalRouter = require('./src/api/historical')
    app.use('/historical', historicalRouter);
    
    wss.on('connection', async (ws) => {
        ws.isAlive = true;
        ws.on('pong', () => ws.isAlive = true);
        
        //do this via rest API?
        wss.clients.forEach(async (client) => {
            let chartData = await databaseService.getHistoricalFeed();
            client.send(JSON.stringify(chartData));  
        });        
      });

      const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
          if (ws.isAlive === false) return ws.terminate();
      
          ws.isAlive = false;
          ws.ping('', false, true);
        });
      }, 30000);
    
    feedManager.on("Punk_Bid_Entered", (bid, timestamp) => {
        databaseService.saveBid(bid, timestamp)
    });
    
    feedManager.on('Punk_Bought', async (bought, timestamp,) => {
        await databaseService.saveBought(bought, timestamp);
        feedManager.updateClientFeed();
        const cPunkIndex = await databaseService.runTensorflow();
        console.log('INDEX >>>', cPunkIndex);
        databaseService.saveIndex(cPunkIndex);  
    });

    feedManager.on('update_client_feed', async() => {
        //push live feed to
        const newFeedItem = await databaseService.getLastBuy();
        if(newFeedItem.value != "0.0"){
            return wss.clients.forEach(client => client.send(JSON.stringify(newFeedItem)));
        }   
    });

    await punkFeed.logBought(feedManager);
    await punkFeed.logBidEntered(feedManager);    
}

main();

module.exports = feedManager







