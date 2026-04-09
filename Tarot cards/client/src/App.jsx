import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Reading from './pages/Reading.jsx';
import History from './pages/History.jsx';
import CardLibrary from './pages/CardLibrary.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/history" element={<History />} />
            <Route path="/cards" element={<CardLibrary />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
