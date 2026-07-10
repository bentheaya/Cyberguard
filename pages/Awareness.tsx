import React, { useState } from 'react';
import { getSecurityExplanation } from '../services/geminiService';
import { BrainCircuit, ChevronRight } from '../components/Icons';

const topics = [
  {
    id: 'phishing',
    title: 'Phishing Attacks',
    content: 'Phishing is a type of social engineering where attackers deceive users into revealing sensitive information via fake emails or websites.'
  },
  {
    id: 'malware',
    title: 'Malware Types',
    content: 'Malware includes viruses, worms, trojans, ransomware, and spyware designed to damage or gain unauthorized access to systems.'
  },
  {
    id: 'encryption',
    title: 'Encryption Basics',
    content: 'Encryption converts data into a code to prevent unauthorized access. Symmetric uses one key; Asymmetric uses public and private keys.'
  },
  {
    id: 'passwords',
    title: 'Password Hygiene',
    content: 'Strong passwords are long, complex, unique for every site, and stored in a password manager. Multi-factor authentication (MFA) is essential.'
  }
];

const Awareness: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setLoading(true);
    const result = await getSecurityExplanation(aiQuery);
    setAiResponse(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Security Knowledge Base</h2>
        <p className="text-slate-400">Explore core cybersecurity concepts.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {topics.map((topic) => (
          <div key={topic.id} className="relative group overflow-hidden rounded-xl bg-cyber-800 p-6 shadow-lg transition hover:shadow-cyber-500/10 border border-cyber-700">
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyber-400 transition-colors">{topic.title}</h3>
            <p className="text-slate-400">{topic.content}</p>
          </div>
        ))}
      </div>

      {/* AI Assistant Section */}
      <div className="rounded-2xl bg-gradient-to-b from-cyber-800 to-cyber-900 p-1 border border-cyber-700">
        <div className="rounded-xl bg-cyber-900/90 p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyber-500/20 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-cyber-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Ask CyberGuard AI</h3>
          </div>
          
          <form onSubmit={handleAiAsk} className="relative">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="e.g., What is a Man-in-the-Middle attack?"
              className="w-full bg-cyber-800 border border-cyber-600 rounded-lg px-4 py-3 pr-24 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyber-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !aiQuery}
              className="absolute right-2 top-2 bottom-2 bg-cyber-600 hover:bg-cyber-500 text-white px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </form>

          {aiResponse && (
            <div className="mt-6 p-4 rounded-lg bg-cyber-800/50 border border-cyber-700 animate-in fade-in slide-in-from-bottom-2">
              <h4 className="text-sm font-semibold text-cyber-400 mb-1">AI Explanation:</h4>
              <p className="text-slate-300 leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Awareness;