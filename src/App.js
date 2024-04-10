// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ColoringPad from './ColoringPad';
import OptionPage from './pages/OptionPage';
import ExtraPad from './pages/ExtraPad';

//하이
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/option" element={<OptionPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/coloring" element={<ColoringPad />} />
        <Route path="/extra" element={<ExtraPad />} />
      </Routes>
    </Router>
  );
}

export default App;
