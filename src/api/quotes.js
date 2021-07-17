const express = require('express');
const router = express.Router();
const quotes = require('../models/quotes')

router.get('/', async (req, res) => {
    try {
        const data = await quotes.getData();
        let price = data.pop().toFixed(2);
        const result = { price }
        res.json(result)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

module.exports = router;