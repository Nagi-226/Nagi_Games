import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Reading from './pages/Reading';
import History from './pages/History';
import CardLibrary from './pages/CardLibrary';
import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
}

export default App;
