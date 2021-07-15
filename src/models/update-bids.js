const { connectionString } = require('./config.js');
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://richard-melko:q7dz5fPhdBrTjFwl@cluster0.zzn2y.mongodb.net/cryptopunks-tests?retryWrites=true&w=majority"
let client;

const updateDatabase = async (event, isBid) => {

    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

    if(isBid){
        try {
            await client.connect();
            await createBidListing(client, event)
        } finally {
            await client.close();
        }
    } else {
        try {
            await client.connect();
            await createBoughtListing(client, event)
        } finally {
            await client.close();     
        }
    }  
}

const getHighestBidder = async (bought) => {

    console.log('\n ***** Getting Highest Bidder! ***** \n')

    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

    try {
        await client.connect();
        await createBoughtListing(client, bought);
        await findLastBid(client, bought)           
    } finally {
        await client.close();
    }
}

const getBoughtData = async () => {

    let response;

    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

    try {
        await client.connect();    
        let resultCursor = await client.db("cPunk-prototype").collection("buys").find({});
        response = await resultCursor.toArray();
    } finally {
        await client.close();
    }
    return response
}

const findLastBid = async (client, bought) => {

    let resultCursor = await client.db("cPunk-prototype").collection("bids").find().limit(1).sort({$natural:-1});
    let result = await resultCursor.toArray(); 
    if(result[0].punkIndex === bought.punkIndex){
        console.log('\n+++++++++', result, bought, 'punkIndex should be the same ++++++++\n')
        await updateListingbyTimestamp(client, bought.timestamp, result[0].value, result[0].usdQuote);
    } 
}

const updateListingbyTimestamp = async (client, timestamp, value, quote) => {
    const newUSDValue = value * quote;
    await client.db("cPunk-prototype").collection("buys").updateOne({ "timestamp" : timestamp }, {$set: {"value": value}});
    await client.db("cPunk-prototype").collection("buys").updateOne({ "timestamp" : timestamp }, {$set: {"usdValue": newUSDValue}});
    console.log(`\n updated bought with ${timestamp} timestamp to correct val \n`)
}

const createBidListing = async (client, newListing) => {
    const result = await client.db("cPunk-prototype").collection("bids").insertOne(newListing);
    console.log(`New Bid listing created with id : ${result.insertedId}`)
}

const createBoughtListing = async (client, newListing) => {
    const result = await client.db("cPunk-prototype").collection("buys").insertOne(newListing);
    console.log(`New Bought listing created with id : ${result.insertedId}`)
}

module.exports = { updateDatabase, getHighestBidder, getBoughtData }