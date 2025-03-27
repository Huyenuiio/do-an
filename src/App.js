// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArtifactManager from './components/ArtifactManager.js';


const App = () => {
  return (
    <Router>
      <div
        style={{
          minHeight: '100vh',
          background: '#f5f5f5', // Nền tổng thể nhẹ nhàng
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artifact-edit" element={<ArtifactManager />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;