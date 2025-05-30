// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArtifactManager from './components/ArtifactManager.js';
import SearchBar from '../src/components/SearchBar.js';


const App = () => {
  return (
    <Router>
      <div
        style={{
          minHeight: '100vh',
          background: '#0b1622', // Nền tổng thể nhẹ nhàng
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artifact-edit" element={<ArtifactManager />} />
          <Route path="/artifact-search" element={<SearchBar />} />
         
        </Routes>
      </div>
    </Router>
  );
};

export default App;