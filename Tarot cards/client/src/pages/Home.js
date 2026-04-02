import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spreadAPI } from '../services/api';

function Home() {
  const [spreads, setSpreads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    spreadAPI.getAll().then(res => setSpreads(res.data));
  }, []);

  const handleSelectSpread = (spreadId) => {
    navigate(`/reading?spread=${spreadId}`);
  };

  return (
    <div className="home-container">
      <div className="hero-section fade-in">
        <h1>✦ 塔罗牌占卜系统 ✦</h1>
        <p>探索78张标准塔罗牌的奥秘，获取心灵的指引与启示</p>
      </div>

      <div className="spread-selection">
        <h2>选择牌阵</h2>
        <div className="spread-grid">
          {spreads.map(spread => (
            <div 
              key={spread.id} 
              className="spread-card fade-in"
              onClick={() => handleSelectSpread(spread.id)}
            >
              <h3>{spread.name}</h3>
              <p>{spread.description}</p>
              <span className="card-count">{spread.card_count} 张牌</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
