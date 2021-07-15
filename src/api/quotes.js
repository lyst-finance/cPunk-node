const express = require('express');
const router = express.Router();
const quotes = require('../models/quotes')


router.get('/', async (req, res) => {
    try {
        const data = await quotes.getData();
        let point = data[0].cPunkIndex.pop();
        let quote = point.y.toFixed(2);
        quote = parseFloat(quote);
        const result = { price : quote }
        res.json(result)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});


module.exports = router;