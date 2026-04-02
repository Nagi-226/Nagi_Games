import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { spreadAPI, cardAPI, readingAPI } from '../services/api';
import TarotCard from '../components/TarotCard';

function Reading() {
  const [searchParams] = useSearchParams();
  const [spread, setSpread] = useState(null);
  const [question, setQuestion] = useState('');
  const [deck, setDeck] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [readingComplete, setReadingComplete] = useState(false);

  useEffect(() => {
    const spreadId = searchParams.get('spread') || 1;
    spreadAPI.getById(parseInt(spreadId)).then(res => {
      setSpread(res.data);
      initializeDeck(res.data.card_count);
    });
  }, [searchParams]);

  const initializeDeck = async (cardCount) => {
    const res = await cardAPI.getAll();
    const shuffled = shuffleArray([...res.data]);
    setDeck(shuffled.slice(0, cardCount).map((card, index) => ({
      ...card,
      position: index + 1,
      is_reversed: Math.random() < 0.3
    })));
    setLoading(false);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleDrawCard = useCallback((card) => {
    if (drawnCards.length >= spread.card_count) return;
    
    const newDrawn = [...drawnCards, card];
    setDrawnCards(newDrawn);
    
    if (newDrawn.length === spread.card_count) {
      setReadingComplete(true);
      saveReading(newDrawn);
    }
  }, [drawnCards, spread]);

  const handleFlipCard = (position) => {
    setFlippedCards(prev => ({ ...prev, [position]: true }));
  };

  const saveReading = async (cards) => {
    try {
      const cardsData = cards.map(card => ({
        card_id: card.id,
        position: card.position,
        is_reversed: card.is_reversed
      }));
      await readingAPI.create({
        spread_id: spread.id,
        question,
        cards_drawn: cardsData
      });
    } catch (error) {
      console.error('Failed to save reading:', error);
    }
  };

  const resetReading = () => {
    setDrawnCards([]);
    setFlippedCards({});
    setReadingComplete(false);
    initializeDeck(spread.card_count);
  };

  if (loading) return <div className="loading">Loading</div>;
  if (!spread) return <div className="loading">Spread not found</div>;

  const remainingDeck = deck.filter(c => !drawnCards.find(dc => dc.id === c.id));

  return (
    <div className="reading-container">
      <div className="reading-header">
        <h2>{spread.name} - {spread.name_en}</h2>
        <p>{spread.description}</p>
        <input
          type="text"
          className="question-input"
          placeholder="请输入您的问题（可选）..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div className="card-deck">
        {remainingDeck.map((card, index) => (
          <div
            key={card.id}
            className={`deck-card ${drawnCards.find(dc => dc.id === card.id) ? 'selected' : ''}`}
            onClick={() => handleDrawCard(card)}
            style={{ animationDelay: `${index * 0.05}s` }}
          />
        ))}
      </div>

      <div className={`spread-layout ${spread.card_count === 1 ? 'single-card' : spread.card_count === 3 ? 'three-card' : spread.card_count === 5 ? spread.id === 3 ? 'relationship' : 'five-card' : 'celtic-cross'}`}>
        {spread.positions.map((position, index) => {
          const drawnCard = drawnCards[index];
          return (
            <div key={index} className="spread-position fade-in">
              <div className="position-label">{position}</div>
              {drawnCard ? (
                <TarotCard
                  card={drawnCard}
                  isFlipped={flippedCards[index]}
                  onFlip={() => handleFlipCard(index)}
                  showMeaning={readingComplete}
                />
              ) : (
                <div className="tarot-card">
                  <div className="tarot-card-inner">
                    <div className="tarot-card-back" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {readingComplete && (
        <div className="reading-actions" style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn btn-primary" onClick={resetReading}>重新占卜</button>
        </div>
      )}

      <div className="reading-instructions" style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px' }}>
        <p>点击牌堆中的牌进行抽取，抽取完成后点击牌面翻转查看牌意</p>
        <p>已抽取: {drawnCards.length} / {spread.card_count}</p>
      </div>
    </div>
  );
}

export default Reading;
