const { connectionString } = require('./config.js')
const { MongoClient } = require("mongodb");
const ma = require('moving-averages');

const uri = process.env.MONGODB_URI;

const getHistoricalChartData = async () => {

    console.log('getData fired')

    let response;

    let client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

        try {
            await client.connect();
            let resultCursor = await client.db("cPunk-prototype").collection("quotes").find().limit(1).sort({$natural:-1});
            response = await resultCursor.toArray();
        } finally {
            await client.close();
        }
    return response    
}

module.exports = { getHistoricalChartData }