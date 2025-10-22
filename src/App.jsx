// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer'; 
import Home from './pages/home';
import './styles/global.css';

// Lazy load pages for better performance
const DocsPage = lazy(() => import('./pages/DocsPage'));
const GuidesPage = lazy(() => import('./pages/GuidesPage'));
const SimulationPage = lazy(() => import('./pages/SimulationPage'));
const IntroductionPage = lazy(() => import('./pages/simulations/introduction'));
const DDosPage = lazy(() => import('./pages/simulations/DDosPage'));
const RateLimitPage = lazy(() => import('./pages/simulations/RateLimitPage'));
const CSRFPage = lazy(() => import('./pages/simulations/CSRFPage'));
const CaptchaPage = lazy(() => import('./pages/simulations/CaptchaPage'));
const WAFPage = lazy(() => import('./pages/simulations/WAFPage'));
const TorBlockPage = lazy(() => import('./pages/simulations/TorBlockPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-16">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/simulations" element={<SimulationPage />}>
              <Route path="introduction" element={<IntroductionPage />} />
              <Route path="ddos" element={<DDosPage />} />
              <Route path="rate-limit" element={<RateLimitPage />} />
              <Route path="csrf" element={<CSRFPage />} />
              <Route path="captcha" element={<CaptchaPage />} />
              <Route path="waf" element={<WAFPage />} />
              <Route path="tor-block" element={<TorBlockPage />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
      <Footer /> 
    </Router>
  );
};

export default App;