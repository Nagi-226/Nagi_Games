const express = require('express');
const router = express.Router();
const readingService = require('../services/readingService');

router.post('/', (req, res) => {
  try {
    const { spread_id, cards_drawn, question } = req.body;
    const reading = readingService.createReading(spread_id, cards_drawn, question);
    res.status(201).json(reading);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  try {
    const readings = readingService.getAllReadings();
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const reading = readingService.getReadingById(req.params.id);
    if (!reading) {
      return res.status(404).json({ error: 'Reading not found' });
    }
    res.json(reading);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    readingService.deleteReading(req.params.id);
    res.json({ message: 'Reading deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
