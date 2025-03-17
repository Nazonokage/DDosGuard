// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar';
import Home from './pages/home';
import DocsPage from './pages/DocsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedbackPage from './pages/FeedbackPage';
import GuidesPage from './pages/GuidesPage';
import SimulationPage from './pages/SimulationPage';
import IntroductionPage from './pages/simulations/introduction';
import DDosPage from './pages/simulations/DDosPage';
import RateLimitPage from './pages/simulations/RateLimitPage';
import CSRFPage from './pages/simulations/CSRFPage';
import CaptchaPage from './pages/simulations/CaptchaPage';
import WAFPage from './pages/simulations/WAFPage';
import TorBlockPage from './pages/simulations/TorBlockPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import './styles/global.css';

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/ddosguard">
        <Navbar />
        <div className="pt-16">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/simulations" element={<SimulationPage />}>
                <Route path="introduction" element={<IntroductionPage />} />
                <Route path="ddos" element={<DDosPage />} />
                <Route path="rate-limit" element={<RateLimitPage />} />
                <Route path="csrf" element={<CSRFPage />} />
                <Route path="captcha" element={<CaptchaPage />} />
                <Route path="waf" element={<WAFPage />} />
                <Route path="tor-block" element={<TorBlockPage />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;