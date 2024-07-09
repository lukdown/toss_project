import React from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>ToSS</h1>
        <p>Toeic Smart Speaking</p>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">사진 보고 Toss 추천 받기</Link>|
        <Link to="/category" className="nav-link">카테고리별 연습하기</Link>
      </nav>
    </header>
  );
}

export default Header;