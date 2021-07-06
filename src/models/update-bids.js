const { connectionString } = require('./config.js')
const punkFeed = require("../loaders/punk-feed")
const { MongoClient } = require("mongodb");

const main = async () => {

    console.log(bidEvent)
    
    const uri = connectionString

    const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log(client);
        await createListing(client, )       
    } finally {
        await client.close();
    }
}

const createListing = async (client, newListing) => {
    const result = await client.db("cryptopunks-tests").collection("bids").insertOne(newListing);

    console.log(`New listing created with id : ${result.insertedId}`)
}

main().catch(console.dir);