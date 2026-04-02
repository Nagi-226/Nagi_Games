const request = require('supertest');
const app = require('../src/index');
const db = require('../src/database/connection');

describe('Card API', () => {
  test('GET /api/cards should return all cards', async () => {
    const res = await request(app).get('/api/cards');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(78);
  });

  test('GET /api/cards?type=major should return major arcana', async () => {
    const res = await request(app).get('/api/cards?type=major');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(22);
    expect(res.body[0].type).toBe('major');
  });

  test('GET /api/cards?type=minor should return minor arcana', async () => {
    const res = await request(app).get('/api/cards?type=minor');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(56);
  });

  test('GET /api/cards?suit=wands should return wands cards', async () => {
    const res = await request(app).get('/api/cards?suit=wands');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(14);
    expect(res.body[0].suit).toBe('wands');
  });

  test('GET /api/cards/0 should return The Fool', async () => {
    const res = await request(app).get('/api/cards/0');
    expect(res.statusCode).toBe(200);
    expect(res.body.name_en).toBe('The Fool');
  });

  test('GET /api/cards/99 should return 404', async () => {
    const res = await request(app).get('/api/cards/99');
    expect(res.statusCode).toBe(404);
  });

  test('GET /api/cards/search/爱情 should return matching cards', async () => {
    const res = await request(app).get('/api/cards/search/爱情');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('Spread API', () => {
  test('GET /api/spreads should return all spreads', async () => {
    const res = await request(app).get('/api/spreads');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(5);
  });

  test('GET /api/spreads/1 should return a spread', async () => {
    const res = await request(app).get('/api/spreads/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('positions');
    expect(Array.isArray(res.body.positions)).toBe(true);
  });

  test('GET /api/spreads/99 should return 404', async () => {
    const res = await request(app).get('/api/spreads/99');
    expect(res.statusCode).toBe(404);
  });
});

describe('Reading API', () => {
  let readingId;

  test('POST /api/readings should create a reading', async () => {
    const readingData = {
      spread_id: 1,
      question: '今日运势如何？',
      cards_drawn: [
        { card_id: 0, position: 1, is_reversed: false },
        { card_id: 1, position: 2, is_reversed: true },
        { card_id: 2, position: 3, is_reversed: false }
      ]
    };
    const res = await request(app).post('/api/readings').send(readingData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    readingId = res.body.id;
  });

  test('GET /api/readings should return all readings', async () => {
    const res = await request(app).get('/api/readings');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/readings/:id should return a reading', async () => {
    const res = await request(app).get(`/api/readings/${readingId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(readingId);
  });

  test('DELETE /api/readings/:id should delete a reading', async () => {
    const res = await request(app).delete(`/api/readings/${readingId}`);
    expect(res.statusCode).toBe(200);
  });
});

afterAll(() => {
  db.close();
});
