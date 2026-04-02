import React, { useState, useEffect } from 'react';
import { readingAPI } from '../services/api';

function History() {
  const [readings, setReadings] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readingAPI.getAll().then(res => {
      setReadings(res.data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await readingAPI.delete(id);
    setReadings(readings.filter(r => r.id !== id));
  };

  if (loading) return <div className="loading">Loading</div>;

  return (
    <div className="history-container">
      <h2>占卜历史记录</h2>
      {readings.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>暂无占卜记录</p>
      ) : (
        <div className="history-list">
          {readings.map(reading => (
            <div 
              key={reading.id} 
              className="history-item"
              onClick={() => setSelectedReading(reading)}
            >
              <div className="date">{new Date(reading.created_at).toLocaleString('zh-CN')}</div>
              <div className="spread-name">{reading.spread_name || reading.spread_name_en}</div>
              {reading.question && <div className="question">"{reading.question}"</div>}
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '5px' }}>
                抽取了 {reading.cards_drawn.length} 张牌
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '5px 15px', fontSize: '0.8rem', marginTop: '10px' }}
                onClick={(e) => handleDelete(reading.id, e)}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedReading && (
        <div className="modal-overlay" onClick={() => setSelectedReading(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedReading(null)}>×</button>
            <h3 style={{ color: 'var(--gold)', marginBottom: '15px' }}>
              {selectedReading.spread_name} 详情
            </h3>
            {selectedReading.question && (
              <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>
                问题: {selectedReading.question}
              </p>
            )}
            <div>
              {selectedReading.cards_drawn.map((drawn, index) => (
                <div key={index} style={{ marginBottom: '15px', padding: '10px', background: 'rgba(106, 13, 173, 0.2)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--secondary-color)' }}>
                    {selectedReading.positions ? selectedReading.positions[index] : `位置 ${index + 1}`}
                  </strong>
                  <p style={{ color: 'var(--gold)', margin: '5px 0' }}>
                    {drawn.card_name} {drawn.is_reversed ? '(逆位)' : '(正位)'}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {drawn.is_reversed ? drawn.reversed_meaning : drawn.upright_meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
