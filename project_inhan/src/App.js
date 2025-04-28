import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import BookDetail from './pages/BookDetail';
import Board from './pages/Board';
import BoardWrite from './pages/BoardWrite';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/book/:isbn13" element={<BookDetail />} />
      </Routes>
    </div>
  );
}

export default App;
