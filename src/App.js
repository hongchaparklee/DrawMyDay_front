// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ColoringPad from './ColoringPad';
import OptionPage from './pages/OptionPage';
import MemoryPage from './pages/MemoryPage';
import DrawMyDayPad from './pages/DrawMyDayPad';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/option" element={<OptionPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/coloring" element={<ColoringPad />} />
        <Route path="/memory" element={<MemoryPage />} /> 
        <Route path="/DrawMyDay" element={<DrawMyDayPad />} />
      </Routes>
    </Router>
  );
}

export default App;
