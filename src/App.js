// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ColoringPad from './ColoringPad';
import OptionPage from './pages/OptionPage';
import MemoryPage from './pages/MemoryPage';
import CompletePage from './pages/CompletePage';
import DrawMyDayPad from './pages/DrawMyDayPad';
import { ImageProvider } from './pages/ImageContext';

function App() {
  return (
    <Router>
      <ImageProvider> {/* ImageProvider를 Router 안으로 이동 */}
        <Routes>
          <Route path="/option" element={<OptionPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/coloring" element={<ColoringPad />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/DrawMyDay" element={<DrawMyDayPad />} />
          <Route path="/complete" element={<CompletePage />} />
        </Routes>
      </ImageProvider>
    </Router>
  );
}

export default App;
