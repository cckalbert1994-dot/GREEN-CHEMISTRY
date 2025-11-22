import React, { useState, useEffect } from 'react';
import { SlideContent } from '../types';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Info, RefreshCw } from 'lucide-react';

interface SlideDeckProps {
  slides: SlideContent[];
  onRegenerate: () => void;
}

const SlideDeck: React.FC<SlideDeckProps> = ({ slides, onRegenerate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const currentSlide = slides[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  // Seed for Picsum to get consistent images per slide content
  const imageUrl = `https://picsum.photos/seed/${currentSlide.imageKeyword}123/1200/800`;

  return (
    <div className={`flex flex-col h-screen w-full bg-slate-900 text-white transition-all duration-500 ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`}>
      
      {/* Top Bar (Only visible if not fullscreen or on hover) */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h1 className="text-emerald-400 font-bold tracking-wider text-sm uppercase">EcoChem Slides</h1>
        <div className="flex gap-2">
          <button onClick={onRegenerate} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-emerald-400 transition" title="Regenerate Deck">
            <RefreshCw size={18} />
          </button>
          <button onClick={() => setShowNotes(!showNotes)} className={`p-2 hover:bg-slate-800 rounded-full transition ${showNotes ? 'text-emerald-400' : 'text-slate-400'}`} title="Speaker Notes">
            <Info size={18} />
          </button>
          <button onClick={toggleFullscreen} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="flex-1 relative flex overflow-hidden rounded-2xl shadow-2xl bg-white text-slate-900">
        
        {/* Slide Content */}
        <div className="flex-1 flex flex-col md:flex-row relative z-10">
          
          {/* Left: Text Content */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-emerald-50 to-white">
            <div className="mb-6">
              <span className="text-emerald-600 font-bold text-xs tracking-widest uppercase mb-2 block">
                Slide {currentIndex + 1} / {slides.length}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-900 leading-tight mb-6">
                {currentSlide.title}
              </h2>
              <div className="w-20 h-1 bg-emerald-500 mb-8 rounded-full"></div>
            </div>

            <ul className="space-y-4 mb-8">
              {currentSlide.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start text-lg text-slate-700 leading-relaxed">
                  <span className="mr-3 mt-1.5 min-w-[8px] h-2 w-2 rounded-full bg-emerald-400 block"></span>
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="mt-auto bg-emerald-100/50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
              <p className="text-emerald-900 font-medium italic">"{currentSlide.highlight}"</p>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="w-full md:w-1/3 lg:w-5/12 relative bg-slate-200 overflow-hidden">
             {/* Loading Skeleton */}
             {!loadedImages[currentIndex] && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
                   <span className="text-sm">Loading Visual...</span>
                </div>
             )}
            <img 
              src={imageUrl} 
              alt={currentSlide.imageKeyword}
              onLoad={() => handleImageLoad(currentIndex)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loadedImages[currentIndex] ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-8">
               <span className="text-white/80 text-sm font-mono uppercase tracking-widest bg-black/30 backdrop-blur-sm px-2 py-1 inline-block w-max rounded">
                 Concept: {currentSlide.imageKeyword}
               </span>
            </div>
          </div>

        </div>

        {/* Speaker Notes Overlay */}
        {showNotes && (
          <div className="absolute bottom-4 right-4 z-20 w-80 max-h-[50%] bg-yellow-50 text-slate-800 p-6 rounded-lg shadow-xl border border-yellow-200 custom-scroll overflow-y-auto transform transition-all">
            <h4 className="font-bold text-yellow-800 mb-2 text-sm uppercase tracking-wider">Speaker Notes</h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{currentSlide.notes}</p>
          </div>
        )}

      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-between items-center px-4">
        <button 
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-white transition-all font-medium"
        >
          <ChevronLeft size={20} /> Previous
        </button>

        {/* Progress Dots */}
        <div className="hidden md:flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700 hover:bg-slate-600'}`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          disabled={currentIndex === slides.length - 1}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-white transition-all font-medium"
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SlideDeck;
