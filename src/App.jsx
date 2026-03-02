import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import GameRoom from './views/GameRoom';
import { GameProvider } from './context/GameContext'; // Import your provider

const App = () => {
  return (
    <Router>
      {/* All routes inside here can now access GameContext */}
      <GameProvider> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<GameRoom />} />
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App;