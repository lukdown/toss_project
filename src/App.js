import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './pages/Header';
import TossRecommendation from './pages/TossRecommendation';
import CategoryPractice from './pages/Category';
import Home from './pages/Home'; // Home 컴포넌트 import
import UserInputTxt from './pages/category/UserInput'
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/toss-recommendation" element={<TossRecommendation />} /> 
          <Route path="/category" element={<CategoryPractice />} />
          <Route path="/userinput" element={<UserInputTxt />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;