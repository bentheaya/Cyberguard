import React from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Awareness from './pages/Awareness';
import Quiz from './pages/Quiz';
import PhishingDemo from './pages/demos/Phishing';
import PasswordDemo from './pages/demos/Password';
import EncryptionDemo from './pages/demos/Encryption';
import MalwareDemo from './pages/demos/Malware';

const DemoNavLink = ({ to, label }: { to: string; label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `px-6 py-2 rounded-full text-sm font-medium transition-all ${
        isActive 
          ? 'bg-cyber-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
          : 'bg-cyber-800 text-slate-300 hover:bg-cyber-700'
      }`
    }
  >
    {label}
  </NavLink>
);

const DemosLayout = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Interactive Security Labs</h1>
        <p className="text-slate-400 mt-2">Select a simulation to begin learning.</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <DemoNavLink to="/demos/phishing" label="Phishing" />
        <DemoNavLink to="/demos/password" label="Password Strength" />
        <DemoNavLink to="/demos/encryption" label="Encryption" />
        <DemoNavLink to="/demos/malware" label="Malware Scanner" />
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/demos/phishing" replace />} />
        <Route path="phishing" element={<PhishingDemo />} />
        <Route path="password" element={<PasswordDemo />} />
        <Route path="encryption" element={<EncryptionDemo />} />
        <Route path="malware" element={<MalwareDemo />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/demos/*" element={<DemosLayout />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;