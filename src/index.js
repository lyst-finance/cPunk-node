const punkFeed = require("./loaders/punk-feed")

let bidEvent;

const main = async () => {
    
    bidEvent = await punkFeed.logBidEntered();
    console.log(bidEvent)
    punkFeed.logBought();

    //send bid event to update-bids > Mongo

}

main();

module.exports = { bidEvent }






