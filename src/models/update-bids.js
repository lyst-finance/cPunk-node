const { connectionString } = require('./config.js')
const { MongoClient } = require("mongodb");
const { DepthwiseConv2dNativeBackpropFilter } = require('@tensorflow/tfjs');

const uri = "mongodb+srv://richard-melko:q7dz5fPhdBrTjFwl@cluster0.zzn2y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
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

const getHighestBidder = async () => {

    console.log('\n ***** Getting Highest Bidder! ***** \n')

    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

    try {
        await client.connect();
        await findByPunkIndex(client)           
    } finally {
        await client.close();
    }
}

const findByPunkIndex = async (client) => {

    let resultCursor = await client.db("cryptopunks-tests").collection("bids").find().limit(1).sort({$natural:-1});
    let result = await resultCursor.toArray();
    console.log('RESULT >>>>>> ', result)

    // update buy document val 0 with result.value
    
}

const createBidListing = async (client, newListing) => {
    const result = await client.db("cryptopunks-tests").collection("bids").insertOne(newListing);
    console.log(`New Bid listing created with id : ${result.insertedId}`)
}

const createBoughtListing = async (client, newListing) => {
    const result = await client.db("cryptopunks-tests").collection("buys").insertOne(newListing);
    console.log(`New Bought listing created with id : ${result.insertedId}`)
}



module.exports = { updateDatabase, getHighestBidder }