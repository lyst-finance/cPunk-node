const { connectionString } = require('./config.js')
const { MongoClient } = require("mongodb");

const updateDatabase = async (event, isBid) => {

    console.log(connectionString)
    
    const uri = "mongodb+srv://richard-melko:q7dz5fPhdBrTjFwl@cluster0.zzn2y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    const client = new MongoClient(uri, {
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

const createBidListing = async (client, newListing) => {
    const result = await client.db("cryptopunks-tests").collection("bids").insertOne(newListing);
    console.log(`New Bid listing created with id : ${result.insertedId}`)
}

const createBoughtListing = async (client, newListing) => {
    const result = await client.db("cryptopunks-tests").collection("buys").insertOne(newListing);
    console.log(`New Bought listing created with id : ${result.insertedId}`)
}

module.exports = { updateDatabase }