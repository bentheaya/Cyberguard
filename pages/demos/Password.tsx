import React, { useState, useMemo } from 'react';
import { Lock, CheckCircle, XCircle } from '../../components/Icons';

const PasswordDemo: React.FC = () => {
  const [password, setPassword] = useState('');

  const analysis = useMemo(() => {
    const length = password.length >= 12;
    const number = /\d/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    
    // Simple entropy calculation approximation
    let poolSize = 0;
    if (number) poolSize += 10;
    if (special) poolSize += 32;
    if (upper) poolSize += 26;
    if (lower) poolSize += 26;
    
    const entropy = password.length * Math.log2(poolSize || 1);
    
    // Crack time estimation (very rough)
    // Assuming 10 billion guesses per second for a fast GPU rig
    const guessesPerSecond = 10_000_000_000;
    const combinations = Math.pow(poolSize || 1, password.length);
    const secondsToCrack = combinations / guessesPerSecond;

    return {
      checks: [
        { label: "At least 12 characters", valid: length },
        { label: "Includes numbers", valid: number },
        { label: "Includes special chars", valid: special },
        { label: "Mixed case letters", valid: upper && lower },
      ],
      strength: entropy,
      timeToCrack: secondsToCrack
    };
  }, [password]);

  const getStrengthLabel = (entropy: number) => {
    if (entropy < 40) return { text: "Weak", color: "text-red-500", bg: "bg-red-500" };
    if (entropy < 70) return { text: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500" };
    if (entropy < 100) return { text: "Strong", color: "text-green-500", bg: "bg-green-500" };
    return { text: "Unbreakable", color: "text-cyber-400", bg: "bg-cyber-400" };
  };

  const formatTime = (seconds: number) => {
    if (seconds < 1) return "Instantly";
    if (seconds < 60) return "Few seconds";
    if (seconds < 3600) return "Minutes";
    if (seconds < 86400) return "Hours";
    if (seconds < 31536000) return "Days";
    if (seconds < 31536000 * 100) return "Years";
    return "Centuries";
  };

  const strengthInfo = getStrengthLabel(analysis.strength);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Lock className="w-8 h-8 text-cyber-400" /> Password Strength
        </h2>
        <p className="text-slate-400 mt-2">Test your password against brute-force attacks.</p>
      </div>

      <div className="bg-cyber-800 rounded-xl p-8 shadow-xl border border-cyber-700">
        <div className="relative mb-6">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a password..."
            className="w-full bg-cyber-900 border border-cyber-600 rounded-lg px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyber-500 text-lg tracking-wide"
          />
        </div>

        {password && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-slate-400">Strength Estimate</span>
                <span className={`text-xl font-bold ${strengthInfo.color}`}>{strengthInfo.text}</span>
              </div>
              <div className="h-2 bg-cyber-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${strengthInfo.bg}`} 
                  style={{ width: `${Math.min(100, (analysis.strength / 120) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyber-900/50 p-4 rounded-lg border border-cyber-700">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Time to Crack</p>
                <p className="text-lg font-mono text-white">{formatTime(analysis.timeToCrack)}</p>
              </div>
              <div className="bg-cyber-900/50 p-4 rounded-lg border border-cyber-700">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Entropy</p>
                <p className="text-lg font-mono text-white">{Math.round(analysis.strength)} bits</p>
              </div>
            </div>

            <div className="space-y-2">
              {analysis.checks.map((check, i) => (
                <div key={i} className="flex items-center gap-3">
                  {check.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-600" />
                  )}
                  <span className={`text-sm ${check.valid ? 'text-slate-200' : 'text-slate-500'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordDemo;