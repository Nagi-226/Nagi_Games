const db = require('../database/connection');

class SpreadService {
  getAllSpreads() {
    return db.prepare('SELECT * FROM spreads ORDER BY id').all();
  }

  getSpreadById(id) {
    const spread = db.prepare('SELECT * FROM spreads WHERE id = ?').get(id);
    if (spread) {
      return { ...spread, positions: JSON.parse(spread.positions) };
    }
    return null;
  }
}

module.exports = new SpreadService();
