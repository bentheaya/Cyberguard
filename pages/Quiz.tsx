import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion, QuizResult } from '../types';
import { BrainCircuit, CheckCircle, XCircle, RefreshCw, Mail, AlertTriangle, Lock, ShieldCheck, ArrowRight, ArrowLeft, Clock, Trash } from '../components/Icons';

const TOPICS = [
  { id: 'phishing', label: 'Phishing Defense', icon: Mail, description: 'Learn to spot fake emails and malicious links.' },
  { id: 'passwords', label: 'Password Security', icon: ShieldCheck, description: 'Master authentication and hygiene best practices.' },
  { id: 'encryption', label: 'Encryption Basics', icon: Lock, description: 'Understand how data is protected from prying eyes.' },
  { id: 'malware', label: 'Malware & Viruses', icon: AlertTriangle, description: 'Defend against ransomware, trojans, and worms.' },
];

const HISTORY_KEY = 'cyberguard_quiz_history';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [mode, setMode] = useState<'selection' | 'quiz' | 'history'>('selection');
  const [currentTopic, setCurrentTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (newResult: QuizResult) => {
    const updatedHistory = [newResult, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to delete your quiz history?")) {
      setHistory([]);
      localStorage.removeItem(HISTORY_KEY);
    }
  };

  const startQuiz = async (topic: string) => {
    setLoading(true);
    setMode('quiz');
    setCurrentTopic(topic);
    setQuizFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setQuestions([]);
    setShowResult(false);
    setSelectedOption(null);
    
    try {
        const qs = await generateQuizQuestions(topic, 5);
        setQuestions(qs);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const toggleTopic = (id: string) => {
    setSelectedTopicIds(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const handleStartSelected = () => {
    const labels = TOPICS.filter(t => selectedTopicIds.includes(t.id)).map(t => t.label);
    if (labels.length > 0) {
        startQuiz(labels.join(', '));
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      startQuiz(customTopic);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    
    if (index === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const finishQuiz = () => {
    const result: QuizResult = {
        id: crypto.randomUUID(),
        topic: currentTopic,
        score: score,
        total: questions.length,
        date: new Date().toISOString()
    };
    saveHistory(result);
    setQuizFinished(true);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const restartQuiz = () => {
      startQuiz(currentTopic);
  };
  
  const returnToMenu = () => {
      setMode('selection');
      setCustomTopic('');
      setSelectedTopicIds([]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[50vh]">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-cyber-700 border-t-cyber-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-cyber-500 animate-pulse" />
            </div>
        </div>
        <p className="mt-6 text-lg font-medium text-cyber-400 animate-pulse">
            Generating {currentTopic} challenge...
        </p>
        <p className="text-sm text-slate-500 mt-2">Consulting the AI knowledge base</p>
      </div>
    );
  }

  // Selection Mode UI
  if (mode === 'selection') {
      return (
          <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold text-white">Cybersecurity Challenge</h1>
                  <p className="text-slate-400 max-w-2xl mx-auto">
                      Create a custom quiz by selecting specific topics below, or use the AI to generate a challenge on any subject.
                  </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        Select Topics
                        {selectedTopicIds.length > 0 && <span className="text-sm font-normal text-cyber-400 bg-cyber-900 px-2 py-0.5 rounded-full">{selectedTopicIds.length} selected</span>}
                    </h2>
                    <div className="space-x-4 text-sm">
                        <button onClick={() => setSelectedTopicIds(TOPICS.map(t => t.id))} className="text-cyber-400 hover:text-white transition">Select All</button>
                        <button onClick={() => setSelectedTopicIds([])} className="text-slate-500 hover:text-white transition">Clear</button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {TOPICS.map((topic) => {
                        const isSelected = selectedTopicIds.includes(topic.id);
                        return (
                            <button
                                key={topic.id}
                                onClick={() => toggleTopic(topic.id)}
                                className={`flex items-start gap-4 p-6 rounded-xl border transition-all group text-left relative overflow-hidden ${
                                    isSelected 
                                    ? 'bg-cyber-800 border-cyber-400 shadow-[0_0_15px_rgba(96,165,250,0.15)]' 
                                    : 'bg-cyber-800/50 border-cyber-700 hover:border-cyber-600 hover:bg-cyber-800'
                                }`}
                            >
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected ? 'border-cyber-400 bg-cyber-400 text-cyber-900 scale-110' : 'border-cyber-600 bg-transparent'
                                }`}>
                                    {isSelected && <CheckCircle className="w-4 h-4" />}
                                </div>

                                <div className={`p-3 rounded-lg transition-colors ${isSelected ? 'bg-cyber-900' : 'bg-cyber-900/50'}`}>
                                    <topic.icon className={`w-8 h-8 ${isSelected ? 'text-cyber-400' : 'text-slate-500'}`} />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                        {topic.label}
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1 max-w-[90%]">
                                        {topic.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={handleStartSelected}
                    disabled={selectedTopicIds.length === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                        selectedTopicIds.length > 0
                        ? 'bg-cyber-500 hover:bg-cyber-400 text-white shadow-lg shadow-cyber-500/20 transform hover:-translate-y-1'
                        : 'bg-cyber-900 text-slate-600 cursor-not-allowed border border-cyber-800'
                    }`}
                >
                    {selectedTopicIds.length > 0 
                        ? <><BrainCircuit className="w-6 h-6" /> Start Quiz ({selectedTopicIds.length} topics)</>
                        : "Select at least one topic above to start"}
                </button>
              </div>

              <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-cyber-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                      <span className="bg-cyber-900 px-3 text-sm text-slate-500">OR CUSTOMIZE</span>
                  </div>
              </div>

              <div className="max-w-xl mx-auto space-y-8">
                  <form onSubmit={handleCustomSubmit} className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-500 to-cyber-accent rounded-lg opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
                      <div className="relative flex bg-cyber-900 rounded-lg p-1">
                          <input
                            type="text"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            placeholder="Type any topic (e.g., 'SQL Injection')"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 focus:outline-none"
                          />
                          <button 
                            type="submit"
                            disabled={!customTopic.trim()}
                            className="bg-cyber-700 hover:bg-cyber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                          >
                              Generate <ArrowRight className="w-4 h-4" />
                          </button>
                      </div>
                  </form>
                  <p className="text-center text-xs text-slate-500 mt-3">
                      Powered by Gemini AI. Custom topics may take a moment to generate.
                  </p>
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={() => setMode('history')}
                      className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors border border-cyber-700 hover:border-cyber-500 rounded-full px-6 py-2"
                    >
                      <Clock className="w-4 h-4" /> View Quiz History
                    </button>
                  </div>
              </div>
          </div>
      );
  }

  // History Mode UI
  if (mode === 'history') {
    return (
      <div className="max-w-4xl mx-auto min-h-[50vh]">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setMode('selection')}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </button>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyber-400" />
            <h2 className="text-xl font-bold text-white">Quiz History</h2>
          </div>
          <button 
            onClick={clearHistory}
            disabled={history.length === 0}
            className="text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash className="w-3 h-3" /> Clear History
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-cyber-700 bg-cyber-800/30 border-dashed">
            <Clock className="w-12 h-12 text-cyber-700 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No quiz history found</p>
            <p className="text-sm text-slate-500 mt-1">Complete a quiz to see your results here.</p>
            <button 
              onClick={() => setMode('selection')}
              className="mt-6 text-cyber-400 hover:text-cyber-300 text-sm font-medium"
            >
              Start a Quiz
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4">
            {history.map((result) => (
              <div key={result.id} className="bg-cyber-800/50 border border-cyber-700/50 rounded-xl p-5 hover:border-cyber-600 transition-all hover:shadow-lg hover:shadow-cyber-900/50 group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-white truncate max-w-[70%] group-hover:text-cyber-400 transition-colors">
                    {result.topic}
                  </h3>
                  <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    result.score === result.total ? 'bg-green-500/10 text-green-400' : 
                    result.score > result.total / 2 ? 'bg-cyber-500/10 text-cyber-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {result.score}/{result.total}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                   <span>{new Date(result.date).toLocaleDateString()}</span>
                   <span>&bull;</span>
                   <span>{new Date(result.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Finished Mode UI
  if (quizFinished) {
    return (
      <div className="max-w-md mx-auto text-center py-12 bg-cyber-800 rounded-2xl border border-cyber-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <BrainCircuit className="w-16 h-16 text-cyber-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
        <p className="text-slate-400 mb-8">Topic: <span className="text-cyber-400">{currentTopic}</span></p>
        
        <div className="mb-8">
            <div className="text-6xl font-bold text-white mb-2">
            {score} <span className="text-2xl text-slate-500">/ {questions.length}</span>
            </div>
            <p className="text-sm text-slate-400">
                {score === questions.length ? "Perfect score! You're a security expert." : 
                 score > questions.length / 2 ? "Good job! Keep practicing." : 
                 "Needs improvement. Review the explanations."}
            </p>
        </div>

        <div className="flex flex-col gap-3 px-8">
            <button
            onClick={restartQuiz}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-cyber-500 hover:bg-cyber-400 text-white rounded-lg font-semibold transition shadow-lg shadow-cyber-500/20"
            >
            <RefreshCw className="w-5 h-5" /> Retry This Topic
            </button>
            <button
            onClick={returnToMenu}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-cyber-800 hover:bg-cyber-700 text-slate-200 border border-cyber-700 rounded-lg font-semibold transition"
            >
            <BrainCircuit className="w-5 h-5" /> Choose New Topic
            </button>
            <button
              onClick={() => setMode('history')}
              className="mt-2 text-sm text-slate-400 hover:text-white transition"
            >
              View Quiz History
            </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Active Quiz UI
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
          <button 
            onClick={returnToMenu}
            className="text-sm text-slate-500 hover:text-white transition flex items-center gap-1"
          >
              <ArrowLeft className="w-4 h-4" /> Exit
          </button>
          <span className="text-sm font-medium text-cyber-400 uppercase tracking-wider">{currentTopic}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 bg-cyber-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyber-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-cyber-800 rounded-2xl border border-cyber-700 overflow-hidden shadow-xl relative">
        <div className="p-8">
          <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium relative overflow-hidden ";
              
              if (showResult) {
                if (idx === currentQuestion.correctAnswer) {
                  btnClass += "border-green-500 bg-green-500/10 text-green-400";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-500/10 text-red-400";
                } else {
                  btnClass += "border-cyber-700 bg-cyber-900/50 text-slate-500 opacity-50";
                }
              } else {
                btnClass += "border-cyber-700 bg-cyber-900/50 text-slate-200 hover:border-cyber-500 hover:bg-cyber-800";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showResult}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span>{option}</span>
                    {showResult && idx === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 shrink-0" />}
                    {showResult && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Footer */}
        {showResult && (
          <div className="bg-cyber-900/80 p-6 border-t border-cyber-700 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-300 mb-1">Explanation:</p>
                <p className="text-sm text-slate-400 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-white text-cyber-900 font-bold rounded-lg hover:bg-slate-200 transition whitespace-nowrap self-end sm:self-center"
              >
                {currentIndex === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;