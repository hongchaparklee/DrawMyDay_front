// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ColoringPad from './pages/ColoringPage';
import OptionPage from './pages/OptionPage';
import ExtraPage from './pages/ExtraPage';
//하이
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/coloring" element={<ColoringPad />} />
        <Route path="/option" element={<OptionPage />} />
        <Route path="/extra" element={<ExtraPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
