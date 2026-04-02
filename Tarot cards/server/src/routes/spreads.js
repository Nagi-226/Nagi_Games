const express = require('express');
const router = express.Router();
const spreadService = require('../services/spreadService');

router.get('/', (req, res) => {
  try {
    const spreads = spreadService.getAllSpreads();
    res.json(spreads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const spread = spreadService.getSpreadById(parseInt(req.params.id));
    if (!spread) {
      return res.status(404).json({ error: 'Spread not found' });
    }
    res.json(spread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
