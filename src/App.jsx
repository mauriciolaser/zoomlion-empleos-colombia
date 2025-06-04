import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Seguimiento from './components/Seguimiento/Seguimiento';
import Empleo from './pages/Empleo/Empleo';
import Admin from './components/Admin/Admin';

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empleo/:slug" element={<Empleo />} />
          <Route path="/seguimiento" element={<Seguimiento />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
