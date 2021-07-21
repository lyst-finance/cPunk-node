const express = require('express');
const router = express.Router();
const historical = require('../models/historical')
const ma = require('moving-averages');

router.get('/', async (req, res) => {
    try {
        const data = await historical.getHistoricalChartData();
        const points = data[0].cPunkIndex
        const ys = points.map(point => point.y)
        const movingAverage = ma.ma(ys, 2);
        console.log(movingAverage)
        points.forEach((point, index) => console.log(point.y, movingAverage[index]) );
        points.forEach((point, index) => point.y = movingAverage[index]);
        res.json(points)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

module.exports = router;