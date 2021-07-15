const { connectionString } = require('./config.js')
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://richard-melko:q7dz5fPhdBrTjFwl@cluster0.zzn2y.mongodb.net/cryptopunks-tests?retryWrites=true&w=majority"
let client;

const getData = async () => {

    console.log('getData fired')

    let cPunkData;

    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

        try {
            await client.connect();
            let resultCursor = await client.db("cPunk-prototype").collection("quotes").find().limit(1).sort({$natural:-1});
            cPunkData = await resultCursor.toArray();
        } finally {
            await client.close();
        }
    return cPunkData    
}

const updateIndex = async(cPunkIndex) => {

    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

        try {
            await client.connect();
            await client.db("cPunk-prototype").collection("quotes").insertOne(cPunkIndex);
          
        } finally {
            await client.close();
        }
}

const getBuys = async() => {
    let resultCursor = await client.db("cPunk-prototype").collection("buys").find({});
    return  await resultCursor.toArray();
}

module.exports = { getData, updateIndex }