const fetch = require('node-fetch');
const ethers = require('ethers');
const historicalPunkData = require('../database/historical-punk-data.json')
const punkAttributes = require('../database/punk-attributes.json');
const fs = require('fs');

const addAttribute = () => {

    historicalPunkData.forEach(event => {
        punkAttributes.forEach(punk => {
            if(event.punkIndex === punk.id){
                event.type = punk.type;
                event.count = punk.count
            }
        })
    })

    try{
        fs.writeFileSync('historical-punk-data-attributes.json', JSON.stringify(historicalPunkData))
    }catch(err){
        console.log(err)
    }
}

addAttribute();

