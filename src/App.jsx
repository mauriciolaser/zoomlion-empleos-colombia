import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Proceso from './pages/Proceso/Proceso';
import Footer from './components/Footer/Footer';
import ConsentBanner from './components/ConsentBanner/ConsentBanner.jsx';
import TagManagerComponent from './components/TagManagerComponent/TagManagerComponent.jsx';
import TagManagerPageView from './components/TagManagerPageView/TagManagerPageView.jsx';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx';

function App() {
  return (
    <> 
      <TagManagerComponent />
      <TagManagerPageView />
      <ConsentBanner />
      <ScrollToTop />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proceso/:slug" element={<Proceso />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
