import React, { useState, useEffect, useRef } from 'react';
import { curriculum } from './data/curriculum';
import TheoryBlock from './components/TheoryBlock';
import QuestionBlock from './components/QuestionBlock';
import { BookOpen, GraduationCap, Menu, Lock, X, ChevronRight, Settings, Trophy, RotateCcw, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false); // Default hidden for students
  const [devClickCount, setDevClickCount] = useState(0); // For secret toggle
  const [isCourseFinished, setIsCourseFinished] = useState(false);
  const [chapterNotification, setChapterNotification] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleBlockComplete = () => {
    const nextIndex = activeBlockIndex + 1;

    if (nextIndex < curriculum.length) {
      // Check if the NEXT block starts a new numbered chapter
      const nextItem = curriculum[nextIndex];
      if (nextItem.type === 'theory' && nextItem.title && /^\d+\./.test(nextItem.title)) {
        setTimeout(() => triggerChapterFireworks(), 500);
        setChapterNotification("Fejezet teljesítve! Szép munka.");
        setTimeout(() => setChapterNotification(null), 4000);
      }

      setActiveBlockIndex((prev) => prev + 1);
    } else {
      // Last block completed
      setIsCourseFinished(true);
      triggerFireworks();
    }
  };

  const triggerChapterFireworks = () => {
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.6 },
      zIndex: 9999,
      colors: ['#818cf8', '#34d399']
    });
  };

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const random = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Secret handler to toggle dev tools (click graduation cap 5 times)
  const handleSecretDevToggle = () => {
    setDevClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setShowDevTools(current => !current);
        return 0; // Reset count
      }
      return newCount;
    });
  };

  // Reset click count if idle for 2 seconds
  useEffect(() => {
    if (devClickCount > 0) {
      const timer = setTimeout(() => setDevClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [devClickCount]);

  // Auto-scroll to the bottom when new block unlocks
  useEffect(() => {
    if (scrollRef.current && !isCourseFinished) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 300); // Slight delay for rendering
    }
  }, [activeBlockIndex, isCourseFinished]);

  const progressPercentage = Math.round(((activeBlockIndex) / curriculum.length) * 100);

  // Extract chapters from curriculum (theory blocks with numbered titles)
  const chapters = curriculum
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === 'theory' && item.title && /^\d+\./.test(item.title));

  const handleChapterClick = (blockIndex: number, blockId: string) => {
    // Allow navigation if the block is already unlocked
    if (blockIndex <= activeBlockIndex) {
      const element = document.getElementById(blockId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 font-sans relative">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Fejezetek megnyitása"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div
              onClick={handleSecretDevToggle}
              className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg text-white shrink-0 cursor-pointer select-none active:scale-95 transition-transform"
              title="Matematika 10."
            >
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight md:text-xl hidden sm:block">
                Matematika 10.
              </h1>
              <p className="text-sm font-bold text-slate-800 sm:hidden">Matematika 10.</p>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Másodfokú és Gyökös Egyenletek</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Haladás</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">{progressPercentage}%</span>
            </div>
          </div>
        </div>
        {/* Mobile progress bar line */}
        <div className="sm:hidden w-full h-1 bg-slate-100">
          <div
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Chapter Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl border-b border-slate-200 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fejezetek</h3>
              <div className="grid gap-2">
                {chapters.map((chap, i) => {
                  const isUnlocked = chap.index <= activeBlockIndex;
                  const isCurrent = activeBlockIndex >= chap.index &&
                    (i === chapters.length - 1 || activeBlockIndex < chapters[i + 1].index);

                  return (
                    <button
                      key={chap.item.id}
                      onClick={() => handleChapterClick(chap.index, chap.item.id)}
                      disabled={!isUnlocked}
                      className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${isCurrent
                          ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                          : isUnlocked
                            ? 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isCurrent ? 'bg-indigo-600 text-white' : isUnlocked ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                          {i + 1}
                        </span>
                        <span className={`font-medium ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                          {chap.item.title}
                        </span>
                      </div>
                      {isUnlocked ? (
                        isCurrent && <ChevronRight size={16} className="text-indigo-500" />
                      ) : (
                        <Lock size={16} className="text-slate-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Backdrop click to close */}
            <div className="fixed inset-0 top-[60px] -z-10 bg-black/20" onClick={() => setIsMenuOpen(false)} />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {curriculum.slice(0, activeBlockIndex + 1).map((item, index) => {
            const isCompleted = index < activeBlockIndex;

            // Render specific block type
            if (item.type === 'theory') {
              return (
                <TheoryBlock
                  key={item.id}
                  data={item}
                  isCompleted={isCompleted}
                  onComplete={handleBlockComplete}
                />
              );
            } else {
              return (
                <QuestionBlock
                  key={item.id}
                  data={item}
                  isCompleted={isCompleted || (index === activeBlockIndex && isCourseFinished)} // Keep completed styling if finished
                  onComplete={handleBlockComplete}
                />
              );
            }
          })}
        </div>

        {/* Invisible element for scroll targeting */}
        <div ref={scrollRef} className="h-4" />

      </main>

      {/* Chapter Completed Toast */}
      {chapterNotification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-indigo-400">
            <PartyPopper size={20} className="animate-bounce" />
            <span className="font-bold">{chapterNotification}</span>
          </div>
        </div>
      )}

      {/* Course Completion Modal */}
      {isCourseFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500"></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600 rounded-b-[50%] scale-150 -translate-y-16 opacity-10"></div>

            <div className="relative mb-6 flex justify-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center shadow-inner">
                <Trophy size={48} className="text-yellow-600 drop-shadow-sm animate-[bounce_2s_infinite]" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-3">Gratulálok!</h2>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              Sikeresen teljesítetted a teljes tananyagot! <br />
              <span className="font-semibold text-indigo-600">Minden feladat megoldva.</span>
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <RotateCcw size={20} />
                Újrakezdés
              </button>
              <button
                onClick={() => setIsCourseFinished(false)}
                className="w-full text-slate-500 font-medium py-3 hover:text-slate-700 transition-colors"
              >
                Vissza a feladatokhoz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Tools - Toggleable via 5 clicks on Graduation Cap */}
      {showDevTools && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-slate-800 text-white p-3 rounded-lg shadow-2xl opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1">
              <Settings size={12} /> Fejlesztői mód
              <button onClick={() => setShowDevTools(false)} className="ml-auto hover:text-white"><X size={12} /></button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveBlockIndex(curriculum.length - 1);
                  setIsCourseFinished(false);
                }}
                className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded"
              >
                Összes feloldása
              </button>
              <select
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded px-1 py-1 w-32"
                value={activeBlockIndex}
                onChange={(e) => {
                  setActiveBlockIndex(Number(e.target.value));
                  setIsCourseFinished(false);
                }}
              >
                {curriculum.map((item, idx) => (
                  <option key={item.id} value={idx}>
                    {idx + 1}. {item.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;