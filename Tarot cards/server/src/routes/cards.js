const express = require('express');
const router = express.Router();
const cardService = require('../services/cardService');

router.get('/', (req, res) => {
  try {
    const { type, suit } = req.query;
    let cards;
    if (type) {
      cards = cardService.getCardsByType(type);
    } else if (suit) {
      cards = cardService.getCardsBySuit(suit);
    } else {
      cards = cardService.getAllCards();
    }
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const card = cardService.getCardById(parseInt(req.params.id));
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/:query', (req, res) => {
  try {
    const cards = cardService.searchCards(req.params.query);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
