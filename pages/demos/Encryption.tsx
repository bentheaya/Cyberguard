import React, { useState } from 'react';
import { Lock, RefreshCw, ArrowRight } from '../../components/Icons';

const EncryptionDemo: React.FC = () => {
  const [input, setInput] = useState('Hello World');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'caesar' | 'base64'>('caesar');

  // Caesar Cipher Logic
  const encryptCaesar = (text: string, s: number) => {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + s) % 26) + base);
      }
      return char;
    }).join('');
  };

  const encrypted = mode === 'caesar' 
    ? encryptCaesar(input, shift) 
    : btoa(input); // Base64 encoding for demo

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Lock className="w-8 h-8 text-cyber-400" /> Encryption Lab
        </h2>
        <p className="text-slate-400 mt-2">Visualize how plaintext is transformed into ciphertext.</p>
      </div>

      <div className="grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
        {/* Input */}
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 h-full flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Plaintext</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-cyber-900 rounded-lg p-4 text-slate-300 font-mono text-sm resize-none focus:ring-2 focus:ring-cyber-500 outline-none flex-1 min-h-[150px]"
            placeholder="Enter text to encrypt..."
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 p-4 bg-cyber-800/30 rounded-xl border border-cyber-700/50">
          <div className="flex gap-2 p-1 bg-cyber-900 rounded-lg">
            <button
              onClick={() => setMode('caesar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === 'caesar' ? 'bg-cyber-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Caesar
            </button>
            <button
              onClick={() => setMode('base64')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === 'base64' ? 'bg-cyber-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Base64
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-cyber-700 rounded-full">
              <ArrowRight className="w-6 h-6 text-cyber-400" />
            </div>
            <span className="text-xs font-mono text-cyber-400">TRANSFORM</span>
          </div>

          {mode === 'caesar' && (
            <div className="w-full text-center">
              <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">Shift Key: {shift}</label>
              <input
                type="range"
                min="1"
                max="25"
                value={shift}
                onChange={(e) => setShift(Number(e.target.value))}
                className="w-full accent-cyber-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Output */}
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 h-full flex flex-col relative overflow-hidden">
          <h3 className="text-lg font-semibold text-white mb-4">Ciphertext</h3>
          <div className="w-full bg-cyber-950 rounded-lg p-4 text-green-400 font-mono text-sm break-all flex-1 min-h-[150px] relative">
            {encrypted}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-800 via-transparent to-transparent pointer-events-none opacity-20"></div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-cyber-800/50 rounded-xl border border-cyber-700/50 text-center">
        <h4 className="text-white font-semibold mb-2">What is happening?</h4>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          {mode === 'caesar' 
            ? "The Caesar Cipher is a simple substitution technique where each letter is shifted by a fixed number of positions down the alphabet. It is very weak by modern standards."
            : "Base64 is an encoding scheme, NOT encryption. It translates binary data into ASCII characters. It provides no security but is useful for data transmission."}
        </p>
      </div>
    </div>
  );
};

export default EncryptionDemo;