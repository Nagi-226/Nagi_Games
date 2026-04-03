import React, { useState, useEffect } from 'react';
import { cardAPI } from '../services/api';

function CardLibrary() {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cardAPI.getAll().then(res => {
      setCards(res.data);
      setFilteredCards(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredCards(cards);
    } else if (filter === 'major' || filter === 'minor') {
      setFilteredCards(cards.filter(c => c.type === filter));
    } else {
      setFilteredCards(cards.filter(c => c.suit === filter));
    }
  }, [filter, cards]);

  if (loading) return <div className="loading">Loading</div>;

  return (
    <div className="card-library">
      <h2>塔罗牌库</h2>
      
      <div className="filter-bar">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          全部
        </button>
        <button className={`filter-btn ${filter === 'major' ? 'active' : ''}`} onClick={() => setFilter('major')}>
          大阿卡那
        </button>
        <button className={`filter-btn ${filter === 'minor' ? 'active' : ''}`} onClick={() => setFilter('minor')}>
          小阿卡那
        </button>
        <button className={`filter-btn ${filter === 'wands' ? 'active' : ''}`} onClick={() => setFilter('wands')}>
          权杖
        </button>
        <button className={`filter-btn ${filter === 'cups' ? 'active' : ''}`} onClick={() => setFilter('cups')}>
          圣杯
        </button>
        <button className={`filter-btn ${filter === 'swords' ? 'active' : ''}`} onClick={() => setFilter('swords')}>
          宝剑
        </button>
        <button className={`filter-btn ${filter === 'pentacles' ? 'active' : ''}`} onClick={() => setFilter('pentacles')}>
          星币
        </button>
      </div>

      <div className="cards-grid">
        {filteredCards.map(card => (
          <div key={card.id} className="library-card" onClick={() => setSelectedCard(card)}>
            <div className="card-icon">{card.type === 'major' ? '✦' : card.suit === 'wands' ? '🔥' : card.suit === 'cups' ? '💧' : card.suit === 'swords' ? '⚔️' : '⭐'}</div>
            <div className="card-title">{card.name}</div>
            <div className="card-type">{card.type === 'major' ? '大阿卡那' : card.suit === 'wands' ? '权杖' : card.suit === 'cups' ? '圣杯' : card.suit === 'swords' ? '宝剑' : '星币'}</div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCard(null)}>×</button>
            <h3 style={{ color: 'var(--gold)', marginBottom: '10px' }}>{selectedCard.name}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>{selectedCard.name_en}</p>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'var(--secondary-color)' }}>关键词:</strong>
              <div className="keywords" style={{ marginTop: '10px' }}>
                {selectedCard.keywords.split(',').map((keyword, i) => (
                  <span key={i} className="keyword">{keyword}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'var(--secondary-color)' }}>正位含义:</strong>
              <p style={{ marginTop: '5px', lineHeight: '1.6' }}>{selectedCard.upright_meaning}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'var(--secondary-color)' }}>逆位含义:</strong>
              <p style={{ marginTop: '5px', lineHeight: '1.6' }}>{selectedCard.reversed_meaning}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'var(--secondary-color)' }}>象征符号:</strong>
              <p style={{ marginTop: '5px', lineHeight: '1.6' }}>{selectedCard.symbolism}</p>
            </div>

            {selectedCard.element && (
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: 'var(--secondary-color)' }}>元素:</strong>
                <p style={{ marginTop: '5px' }}>{selectedCard.element}</p>
              </div>
            )}

            {selectedCard.astrological && (
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: 'var(--secondary-color)' }}>占星对应:</strong>
                <p style={{ marginTop: '5px' }}>{selectedCard.astrological}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CardLibrary;
