import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Empleo from './pages/Empleo/Empleo';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empleo/:slug" element={<Empleo />} />

          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer/>
    </>
  );
}

export default App;
