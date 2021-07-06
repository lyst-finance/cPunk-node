const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    privateKey : process.env.PRIVATE_KEY,
    connectionString: process.env.CONNECTION_STRING 
};

