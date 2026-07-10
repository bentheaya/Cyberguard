import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, BrainCircuit } from './Icons';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-cyber-400 bg-cyber-800/50" : "text-slate-300 hover:text-white hover:bg-cyber-800/30";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyber-700 bg-cyber-900/95 backdrop-blur supports-[backdrop-filter]:bg-cyber-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white transition hover:opacity-80">
          <ShieldCheck className="h-8 w-8 text-cyber-500" />
          <span className="hidden sm:inline-block">CyberGuard AI</span>
        </Link>
        <div className="flex items-center space-x-1 sm:space-x-4">
          <Link to="/awareness" className={`rounded-md px-3 py-2 text-sm font-medium transition ${isActive('/awareness')}`}>
            Learn
          </Link>
          <Link to="/demos" className={`rounded-md px-3 py-2 text-sm font-medium transition ${isActive('/demos')}`}>
            Demos
          </Link>
          <Link to="/quiz" className={`rounded-md px-3 py-2 text-sm font-medium transition ${isActive('/quiz')}`}>
            <span className="flex items-center gap-1">
              <BrainCircuit className="h-4 w-4" /> Quiz
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;