const { connectionString } = require('./config.js')
const { MongoClient } = require("mongodb");
const { getJsonWalletAddress } = require('ethers/lib/utils');

const uri = "mongodb+srv://richard-melko:q7dz5fPhdBrTjFwl@cluster0.zzn2y.mongodb.net/cryptopunks-tests?retryWrites=true&w=majority"
let client;

const getData = async (event, isBid) => {

    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

        try {
            await client.connect();
            return await getBuys(); 
        } finally {
            await client.close();
        }
} 

const getBuys = async() => {
    let resultCursor = await client.db("cryptopunks-tests").collection("buys").find({});
    return  await resultCursor.toArray();
}

module.exports = { getData }