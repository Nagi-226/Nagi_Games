const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class ReadingService {
  createReading(spread_id, cards_drawn, question = '') {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO readings (id, spread_id, cards_drawn, question)
      VALUES (?, ?, ?, ?)
    `).run(id, spread_id, JSON.stringify(cards_drawn), question);
    return this.getReadingById(id);
  }

  getAllReadings() {
    const readings = db.prepare(`
      SELECT r.*, s.name as spread_name, s.name_en as spread_name_en
      FROM readings r
      LEFT JOIN spreads s ON r.spread_id = s.id
      ORDER BY r.created_at DESC
    `).all();
    return readings.map(r => ({
      ...r,
      cards_drawn: JSON.parse(r.cards_drawn)
    }));
  }

  getReadingById(id) {
    const reading = db.prepare(`
      SELECT r.*, s.name as spread_name, s.name_en as spread_name_en, s.positions
      FROM readings r
      LEFT JOIN spreads s ON r.spread_id = s.id
      WHERE r.id = ?
    `).get(id);
    if (reading) {
      return {
        ...reading,
        cards_drawn: JSON.parse(reading.cards_drawn),
        positions: reading.positions ? JSON.parse(reading.positions) : null
      };
    }
    return null;
  }

  deleteReading(id) {
    db.prepare('DELETE FROM readings WHERE id = ?').run(id);
  }
}

module.exports = new ReadingService();
