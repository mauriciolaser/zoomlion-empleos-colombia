import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Empleo from './pages/Empleo/Empleo';
import Admin from './pages/Admin/Admin';
import ConsentBanner from './components/ConsentBanner/ConsentBanner.jsx'
import TagManagerComponent from './components/TagManagerComponent/TagManagerComponent.jsx'
import TagManagerPageView from './components/TagManagerPageView/TagManagerPageView.jsx'


function App() {
  return (
    <>
      <TagManagerComponent />
      <TagManagerPageView />
      <ConsentBanner />
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
