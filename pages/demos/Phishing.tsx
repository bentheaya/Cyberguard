import React, { useState } from 'react';
import { Mail, CheckCircle, XCircle, BrainCircuit, RefreshCw } from '../../components/Icons';
import { PhishingEmail } from '../../types';
import { generatePhishingEmail } from '../../services/geminiService';

const staticEmails: PhishingEmail[] = [
  {
    id: 1,
    sender: "security@paypa1.com",
    subject: "URGENT: Your account has been suspended",
    body: "Dear Customer,\n\nWe noticed suspicious activity on your account. Click the link below to verify your identity immediately or your account will be permanently closed.\n\n[Verify Now: http://bit.ly/secure-paypal-login]",
    isPhishing: true,
    indicators: ["Generic greeting 'Dear Customer'", "Urgency 'URGENT', 'immediately'", "Suspicious Sender 'paypa1.com'", "Shortened URL"]
  },
  {
    id: 2,
    sender: "newsletter@techweekly.io",
    subject: "Your Weekly Tech Digest",
    body: "Hi John,\n\nHere are the top stories this week in the tech world. Check out our new article on quantum computing.\n\nRead more at techweekly.io/blog/quantum",
    isPhishing: false,
    indicators: []
  },
  {
    id: 3,
    sender: "hr-department@company-internal.net",
    subject: "Action Required: Update Direct Deposit",
    body: "Hello,\n\nPlease log in to the new HR portal to update your banking information for the upcoming payroll cycle.\n\nLogin here: http://hr-portal-update.com",
    isPhishing: true,
    indicators: ["Mismatched URL domain", "Request for sensitive info via link", "Generic urgency"]
  }
];

const PhishingDemo: React.FC = () => {
  // We use a list that starts with static emails but can append AI emails
  const [emailList, setEmailList] = useState<PhishingEmail[]>(staticEmails);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [loading, setLoading] = useState(false);

  const currentEmail = emailList[currentEmailIndex];

  const handleGuess = (guessIsPhishing: boolean) => {
    if (guessIsPhishing === currentEmail.isPhishing) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const nextEmail = () => {
    setFeedback(null);
    if (currentEmailIndex < emailList.length - 1) {
      setCurrentEmailIndex(prev => prev + 1);
    } else {
      // Loop back to start if we are at the end
      setCurrentEmailIndex(0);
    }
  };

  const generateNewScenario = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const newEmail = await generatePhishingEmail();
      if (newEmail) {
        setEmailList(prev => [...prev, newEmail]);
        setCurrentEmailIndex(emailList.length); // Move to the new email (index is length before push, but we use length of prev so effectively appending)
      } else {
        alert("Could not generate AI scenario. Check API Key.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Mail className="w-8 h-8 text-cyber-400" /> Phishing Inspector
        </h2>
        <p className="text-slate-400 mt-2">Analyze the email and decide: Legit or Phishing?</p>
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden text-slate-800 relative min-h-[400px] flex flex-col">
        {loading ? (
            <div className="absolute inset-0 z-20 bg-slate-100 flex flex-col items-center justify-center animate-in fade-in">
                <BrainCircuit className="w-12 h-12 text-cyber-500 animate-pulse mb-4" />
                <p className="text-cyber-700 font-semibold">Gemini is writing a new email...</p>
                <p className="text-slate-500 text-sm">Generating sender details, body content, and red flags.</p>
            </div>
        ) : (
            <>
                {/* Email Header */}
                <div className="bg-slate-100 p-4 border-b border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                    <p className="text-sm text-slate-500">From:</p>
                    <p className="font-mono text-sm font-medium break-all">{currentEmail.sender}</p>
                    </div>
                    <div className="text-right">
                    <p className="text-sm text-slate-500">To:</p>
                    <p className="text-sm font-medium">you@company.com</p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-slate-500">Subject:</p>
                    <p className="font-bold">{currentEmail.subject}</p>
                </div>
                </div>

                {/* Email Body */}
                <div className="p-6 whitespace-pre-wrap font-sans text-sm leading-relaxed flex-1">
                {currentEmail.body}
                </div>
            </>
        )}

        {/* Feedback Overlay */}
        {feedback && !loading && (
          <div className={`absolute inset-0 bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in zoom-in-95 ${feedback === 'correct' ? 'bg-cyber-900/90' : 'bg-red-900/90'}`}>
            {feedback === 'correct' ? (
              <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-400 mb-4" />
            )}
            <h3 className="text-2xl font-bold text-white mb-2">
              {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
            </h3>
            <p className="text-slate-200 mb-6">
              {currentEmail.isPhishing 
                ? "This was a phishing attempt." 
                : "This was a legitimate email."}
            </p>
            
            {currentEmail.isPhishing && (
              <div className="bg-black/30 p-4 rounded-lg text-left max-w-sm w-full mb-6 max-h-[150px] overflow-y-auto">
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">Red Flags:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
                  {currentEmail.indicators.map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
                <button
                onClick={nextEmail}
                className="px-6 py-2 bg-white text-cyber-900 font-bold rounded-full hover:bg-slate-200 transition"
                >
                {currentEmailIndex < emailList.length - 1 ? "Next Email" : "Replay First"}
                </button>
                <button
                onClick={generateNewScenario}
                className="px-6 py-2 bg-cyber-500 text-white font-bold rounded-full hover:bg-cyber-400 transition flex items-center gap-2 shadow-lg shadow-cyber-500/20"
                >
                <BrainCircuit className="w-4 h-4" /> New AI Scenario
                </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {!feedback && !loading && (
        <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex gap-4 w-full justify-center">
                <button
                    onClick={() => handleGuess(false)}
                    className="flex-1 max-w-[160px] py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition shadow-lg shadow-green-900/20"
                >
                    Legitimate
                </button>
                <button
                    onClick={() => handleGuess(true)}
                    className="flex-1 max-w-[160px] py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition shadow-lg shadow-red-900/20"
                >
                    Phishing
                </button>
            </div>
            
            <div className="flex items-center gap-4 w-full">
                <div className="h-px bg-cyber-700 flex-1"></div>
                <button 
                    onClick={generateNewScenario}
                    className="text-xs text-cyber-400 hover:text-white flex items-center gap-1 transition"
                >
                    <RefreshCw className="w-3 h-3" /> Skip & Generate AI Scenario
                </button>
                <div className="h-px bg-cyber-700 flex-1"></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PhishingDemo;