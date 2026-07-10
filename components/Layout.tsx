import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-cyber-900 text-slate-100">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-cyber-700 bg-cyber-900 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} CyberGuard AI. Secure your digital life.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;