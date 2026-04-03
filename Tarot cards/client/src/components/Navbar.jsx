import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">✦ 塔罗牌占卜 ✦</Link>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>首页</Link>
        <Link to="/reading" className={isActive('/reading')}>开始占卜</Link>
        <Link to="/cards" className={isActive('/cards')}>牌库</Link>
        <Link to="/history" className={isActive('/history')}>历史记录</Link>
      </div>
    </nav>
  );
}

export default Navbar;
