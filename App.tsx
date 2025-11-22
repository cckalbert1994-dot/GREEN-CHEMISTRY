import React, { useState, useEffect, useCallback } from 'react';
import { generateSlides } from './services/geminiService';
import SlideDeck from './components/SlideDeck';
import { SlideContent, AppState } from './types';
import { Leaf, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setAppState(AppState.LOADING);
    setError(null);
    try {
      const generatedSlides = await generateSlides();
      setSlides(generatedSlides);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setError(err.message || "Failed to generate presentation. Please try again.");
    }
  }, []);

  // Initial generation on mount
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (appState === AppState.LOADING || appState === AppState.IDLE) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-t-4 border-emerald-300 rounded-full animate-spin flex items-center justify-center">
                <Leaf className="text-emerald-600 animate-pulse" size={32} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Synthesizing Presentation</h2>
            <p className="text-slate-500">
              Consulting Gemini for the latest in Green Chemistry & Energy Efficiency...
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-left text-sm text-slate-400 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Analyzing renewable feedstocks...</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Reviewing China's policy contributions...</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Designing slides for energy efficiency...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appState === AppState.ERROR) {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Generation Failed</h2>
          <p className="text-slate-600">{error}</p>
          <button 
            onClick={handleGenerate}
            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Loader2 size={18} className="animate-spin" style={{ animationDuration: '3s'}} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-900">
      <SlideDeck slides={slides} onRegenerate={handleGenerate} />
    </div>
  );
};

export default App;
