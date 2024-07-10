import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './pages/Header';
import TossRecommendation from './pages/TossRecommendation';
import CategoryPractice from './pages/Category';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<TossRecommendation />} />
          <Route path="/category" element={<CategoryPractice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
