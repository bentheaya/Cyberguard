import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle, BrainCircuit, ArrowRight, Bug } from '../components/Icons';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12 text-center">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center justify-center rounded-full bg-cyber-800 px-4 py-1.5 text-sm font-medium text-cyber-400 ring-1 ring-inset ring-cyber-700/50">
          <span className="mr-2 h-2 w-2 rounded-full bg-cyber-400 animate-pulse"></span>
          AI-Powered Security Training
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Master Cybersecurity with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 to-cyber-accent">Interactive Learning</span>
        </h1>
        <p className="text-lg leading-8 text-slate-400">
          Protect yourself online. Learn to spot phishing attempts, create unbreakable passwords, and understand encryption through hands-on simulations and AI-generated quizzes.
        </p>
        <div className="flex items-center justify-center gap-x-6">
          <Link
            to="/demos"
            className="rounded-lg bg-cyber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyber-400 transition-all"
          >
            Try Demos
          </Link>
          <Link to="/awareness" className="text-sm font-semibold leading-6 text-white flex items-center gap-1 group">
            Start Learning <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-7xl mt-12 px-4">
        <FeatureCard 
          icon={<AlertTriangle className="h-8 w-8 text-danger" />}
          title="Phishing Sim"
          description="Interactive email client to spot fake emails and malicious links."
          link="/demos/phishing"
          color="hover:border-danger/50"
        />
        <FeatureCard 
          icon={<ShieldCheck className="h-8 w-8 text-green-400" />}
          title="Password Audit"
          description="Test password strength against brute-force attack algorithms."
          link="/demos/password"
          color="hover:border-green-400/50"
        />
        <FeatureCard 
          icon={<Lock className="h-8 w-8 text-cyber-accent" />}
          title="Encryption Lab"
          description="Visualize how data is secured with real-time cipher tools."
          link="/demos/encryption"
          color="hover:border-cyber-accent/50"
        />
        <FeatureCard 
          icon={<Bug className="h-8 w-8 text-yellow-500" />}
          title="Malware Scan"
          description="Simulate antivirus heuristics to detect hidden threats in files."
          link="/demos/malware"
          color="hover:border-yellow-500/50"
        />
      </div>

      <div className="w-full max-w-4xl mt-8 p-1 rounded-2xl bg-gradient-to-r from-cyber-800 via-cyber-700 to-cyber-800">
        <div className="bg-cyber-900 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-cyber-400" />
              Ready to test your skills?
            </h3>
            <p className="text-slate-400 mt-1">Take the AI-powered assessment quiz to verify your knowledge.</p>
          </div>
          <Link 
            to="/quiz" 
            className="whitespace-nowrap rounded-lg border border-cyber-600 bg-cyber-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyber-700 transition-all"
          >
            Start Quiz &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, link, color = "hover:border-cyber-500/50" }: { icon: React.ReactNode, title: string, description: string, link: string, color?: string }) => (
  <Link to={link} className={`flex flex-col items-center rounded-2xl bg-cyber-800/50 p-6 text-center border border-transparent ${color} transition-all duration-300 hover:bg-cyber-800 hover:shadow-xl group`}>
    <div className="mb-4 rounded-xl bg-cyber-900 p-4 ring-1 ring-cyber-700 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{description}</p>
  </Link>
);

export default Home;