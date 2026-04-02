const db = require('../database/connection');
const cardService = require('../services/cardService');

jest.mock('../database/connection');

describe('CardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllCards should return all cards', () => {
    const mockCards = [{ id: 0, name: '愚者' }, { id: 1, name: '魔术师' }];
    db.prepare.mockReturnValue({ all: () => mockCards });

    const result = cardService.getAllCards();

    expect(result).toEqual(mockCards);
    expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM cards ORDER BY id');
  });

  test('getCardById should return a specific card', () => {
    const mockCard = { id: 0, name: '愚者', name_en: 'The Fool' };
    db.prepare.mockReturnValue({ get: () => mockCard });

    const result = cardService.getCardById(0);

    expect(result).toEqual(mockCard);
    expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM cards WHERE id = ?');
  });

  test('getCardsByType should filter by type', () => {
    const mockCards = [{ id: 0, type: 'major' }];
    db.prepare.mockReturnValue({ all: () => mockCards });

    const result = cardService.getCardsByType('major');

    expect(result).toEqual(mockCards);
    expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM cards WHERE type = ? ORDER BY id');
  });

  test('getCardsBySuit should filter by suit', () => {
    const mockCards = [{ id: 22, suit: 'wands' }];
    db.prepare.mockReturnValue({ all: () => mockCards });

    const result = cardService.getCardsBySuit('wands');

    expect(result).toEqual(mockCards);
    expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM cards WHERE suit = ? ORDER BY number');
  });

  test('searchCards should search by query', () => {
    const mockCards = [{ id: 6, name: '恋人' }];
    db.prepare.mockReturnValue({ all: () => mockCards });

    const result = cardService.searchCards('爱情');

    expect(result).toEqual(mockCards);
  });

  test('getRandomCards should return random cards', () => {
    const mockCards = [{ id: 5 }, { id: 10 }];
    db.prepare.mockReturnValue({ all: () => mockCards });

    const result = cardService.getRandomCards(2);

    expect(result).toHaveLength(2);
  });
});
