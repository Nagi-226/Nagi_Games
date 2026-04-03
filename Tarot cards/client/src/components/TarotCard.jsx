import React from 'react';
import { motion } from 'framer-motion';

function TarotCard({ card, isFlipped, onFlip, showMeaning }) {
  return (
    <div>
      <motion.div
        className={`tarot-card ${isFlipped ? 'flipped' : ''} ${card.is_reversed ? 'reversed' : ''}`}
        onClick={onFlip}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="tarot-card-inner">
          <div className="tarot-card-back" />
          <div className="tarot-card-front">
            <span className="card-number">{card.type === 'major' ? `#${card.number}` : `${card.suit} #${card.number}`}</span>
            <span className="card-name">{card.name}</span>
            {card.is_reversed && <span style={{ color: '#e74c3c', fontSize: '0.7rem' }}>逆位</span>}
          </div>
        </div>
      </motion.div>
      {showMeaning && isFlipped && (
        <div className="card-meaning fade-in">
          <h3>{card.name} {card.is_reversed ? '(逆位)' : '(正位)'}</h3>
          <div className="keywords">
            {card.keywords.split(',').map((keyword, i) => (
              <span key={i} className="keyword">{keyword}</span>
            ))}
          </div>
          <div className="meaning">
            <span className="meaning-label">{card.is_reversed ? '逆位含义: ' : '正位含义: '}</span>
            <p>{card.is_reversed ? card.reversed_meaning : card.upright_meaning}</p>
          </div>
          <div className="meaning">
            <span className="meaning-label">象征符号: </span>
            <p>{card.symbolism}</p>
          </div>
          {card.element && (
            <div className="meaning">
              <span className="meaning-label">元素: </span>
              <p>{card.element}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TarotCard;
