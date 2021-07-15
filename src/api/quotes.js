const express = require('express');
const router = express.Router();
const quotes = require('../models/quotes')

//GettingAll
router.get('/', async (req, res) => {
    try {
        const data = await quotes.getData()
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

//GettingOne
router.get('/:timestamp', (req, res) => {
    req.params.timestamp
})

module.exports = router;