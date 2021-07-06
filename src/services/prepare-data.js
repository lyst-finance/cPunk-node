const ethers = require('ethers');

const format = (event) => {

    console.log('function format from module prepare-data')
    const blockNumber = event.blockNumber;
    let punkIndex = event.args.punkIndex;
    let value = event.args.value;
    value = ethers.utils.formatUnits(value._hex);
    punkIndex = ethers.utils.formatUnits(punkIndex._hex)
    .replace(/\./g, '');
    punkIndex = parseInt(punkIndex, 10);
    console.log({
        block: blockNumber,
        time: '',
        punkIndex : punkIndex,
        priceInETH : value
    })
}

const mapAttributes = (event) => {

    //map attributes to incoming data

}

module.exports = format;