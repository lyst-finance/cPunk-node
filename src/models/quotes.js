const { connectionString } = require('./config.js')
const { MongoClient } = require("mongodb");
const ma = require('moving-averages');

const uri = process.env.MONGODB_URI;
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
            cPunkData = await applyMovingAverage(client);
            await updateMovingAverage(client, cPunkData);
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

const updateMovingAverage = async (client, cPunkData) => {
    let record = { indexMA: cPunkData }
    await client.db("cPunk-prototype").collection("quotes_MA").insertOne(record)
}

const applyMovingAverage = async (client) => {
    let resultCursor = await client.db("cPunk-prototype").collection("quotes").find({})
    let cPunkData = await resultCursor.toArray();
    let maIndex = cPunkData.map(document => document.cPunkIndex.pop().y)
    return ma.ma(maIndex, 2);
}

module.exports = { getData, updateIndex }