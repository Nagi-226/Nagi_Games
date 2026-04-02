const db = require('../database/connection');

class CardService {
  getAllCards() {
    return db.prepare('SELECT * FROM cards ORDER BY id').all();
  }

  getCardById(id) {
    return db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
  }

  getCardsByType(type) {
    return db.prepare('SELECT * FROM cards WHERE type = ? ORDER BY id').all(type);
  }

  getCardsBySuit(suit) {
    return db.prepare('SELECT * FROM cards WHERE suit = ? ORDER BY number').all(suit);
  }

  searchCards(query) {
    const searchTerm = `%${query}%`;
    return db.prepare(`
      SELECT * FROM cards 
      WHERE name LIKE ? OR name_en LIKE ? OR keywords LIKE ? OR upright_meaning LIKE ?
      ORDER BY id
    `).all(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  getRandomCards(count) {
    return db.prepare('SELECT * FROM cards ORDER BY RANDOM() LIMIT ?').all(count);
  }
}

module.exports = new CardService();
