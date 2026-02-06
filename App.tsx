import React, { useState, useEffect, useRef } from 'react';
import { curriculumRegistry } from './data/registry';
import { categories } from './data/category_definitions';
import TheoryBlock from './components/TheoryBlock';
import QuestionBlock from './components/QuestionBlock';
import { BookOpen, GraduationCap, Menu, Lock, X, ChevronRight, Settings, Trophy, RotateCcw, PartyPopper, Scan, Moon, Sun } from 'lucide-react';
import confetti from 'canvas-confetti';
import FunctionPlotter from './components/FunctionPlotter';
import Dashboard from './components/Dashboard';
import Breadcrumb from './components/Breadcrumb';
import { generateQuadraticEquation, generateQuadraticSequence, generateCoordinateReadProblem, generateCoordinatePlotProblem, generateLinearPlotProblem, generateMappingProblem } from './utils/QuestionGenerator';

const App: React.FC = () => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [currData, setCurrData] = useState(curriculumRegistry['quadratic']); // Default to quadratic

  useEffect(() => {
    let baseData = curriculumRegistry['quadratic'];
    if (activeCourseId && curriculumRegistry[activeCourseId]) {
      baseData = curriculumRegistry[activeCourseId];
    }

    const hydratedData = baseData.map(item => {
      if (item.type === 'question') {
        if (item.id.startsWith('coord-read')) return generateCoordinateReadProblem(item.id);
        if (item.id.startsWith('coord-plot')) return generateCoordinatePlotProblem(item.id);
        if (item.id.startsWith('linear-plot')) return generateLinearPlotProblem(item.id);
        if (item.id.startsWith('mapping-')) return generateMappingProblem(item.id);
      }
      return item;
    });

    setCurrData(hydratedData);
  }, [activeCourseId]);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false); // Default hidden for students
  const [devClickCount, setDevClickCount] = useState(0); // For secret toggle
  const [isCourseFinished, setIsCourseFinished] = useState(false);
  const [chapterNotification, setChapterNotification] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleBlockComplete = () => {
    const nextIndex = activeBlockIndex + 1;

    if (nextIndex < currData.length) {
      // Check if the NEXT block starts a new numbered chapter
      const nextItem = currData[nextIndex];
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

  // Handle "One more please" request
  // Handle "One more please" request
  const handleRegenerate = (index: number) => {
    const currentItem = currData[index];

    // Check which generator to use based on ID prefix or other prop
    if (currentItem.id.startsWith('coord-read')) {
      // Generate SINGLE new item for reading
      const newItem = generateCoordinateReadProblem(currentItem.id);
      setCurrData(prev => {
        const newData = [...prev];
        newData.splice(index, 1, newItem);
        return newData;
      });
      setActiveBlockIndex(index);
      setIsCourseFinished(false);
    } else if (currentItem.id.startsWith('coord-plot')) {
      // Generate SINGLE new item for plotting
      const newItem = generateCoordinatePlotProblem(currentItem.id);
      setCurrData(prev => {
        const newData = [...prev];
        newData.splice(index, 1, newItem);
        return newData;
      });
      setActiveBlockIndex(index);
      setIsCourseFinished(false);
    } else if (currentItem.id.startsWith('linear-plot')) {
      const newItem = generateLinearPlotProblem(currentItem.id);
      setCurrData(prev => {
        const newData = [...prev];
        newData.splice(index, 1, newItem);
        return newData;
      });
      setActiveBlockIndex(index);
      setIsCourseFinished(false);
    } else if (currentItem.id.startsWith('mapping-')) {
      // Generate SINGLE new item for mapping diagrams
      const newItem = generateMappingProblem(currentItem.id);
      setCurrData(prev => {
        const newData = [...prev];
        newData.splice(index, 1, newItem);
        return newData;
      });
      setActiveBlockIndex(index);
      setIsCourseFinished(false);
    } else {
      // Default to quadratic 3-step sequence
      const newSequence = generateQuadraticSequence(`gen-${Date.now()}`);
      setCurrData(prev => {
        const newData = [...prev];
        newData.splice(index, 1, ...newSequence);
        return newData;
      });
      setActiveBlockIndex(index);
      setIsCourseFinished(false);
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

  // Reset click count if idle for 3 seconds
  useEffect(() => {
    if (devClickCount > 0) {
      const timer = setTimeout(() => setDevClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [devClickCount]);

  // Auto-scroll to the current block when it changes
  useEffect(() => {
    // Wait for render
    setTimeout(() => {
      const currentBlockId = currData[activeBlockIndex]?.id;
      if (currentBlockId) {
        const element = document.getElementById(currentBlockId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 300);
  }, [activeBlockIndex, isCourseFinished, currData]);

  const progressPercentage = Math.round(((activeBlockIndex) / currData.length) * 100);

  // Extract chapters from curriculum (theory blocks with numbered titles)
  const chapters = currData
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === 'theory' && item.title && /^\d+\./.test(item.title));

  const handleChapterClick = (blockIndex: number, blockId: string) => {
    // Always allow navigation
    setActiveBlockIndex(blockIndex);

    // Defer scrolling to allow render loop to update
    setTimeout(() => {
      const element = document.getElementById(blockId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMenuOpen(false);
      }
    }, 100);
  };

  // Render Dashboard if no course is selected
  if (!activeCourseId) {
    return <Dashboard onSelectCourse={setActiveCourseId} />;
  }

  return (
    <>
      <div className={`min-h-screen pb-20 font-sans relative transition-colors duration-300 ${focusMode ? 'pt-4' : ''} ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        {/* Focus Mode Toggle Button */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`fixed z-30 p-2 rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all ${focusMode ? 'top-4 right-4' : 'top-20 right-4'
            }`}
          title={focusMode ? 'Kilépés a fókusz módból' : 'Fókusz mód'}
        >
          {focusMode ? <X size={20} /> : <Scan size={20} />}
        </button>

        {/* Header - hidden in focus mode */}
        {!focusMode && (
          <header className="bg-white dark:bg-slate-800 sticky top-0 z-20 shadow-sm transition-colors duration-300 border-b border-transparent dark:border-slate-700">
            <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveCourseId(null)}
                  className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors mr-1"
                  title="Vissza a főoldalra"
                >
                  <ChevronRight size={24} className="rotate-180" />
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Fejezetek megnyitása"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div
                  onClick={handleSecretDevToggle}
                  className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg text-white shrink-0 cursor-pointer select-none active:scale-95 transition-transform"
                  title="Matematika"
                >
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 leading-tight md:text-xl hidden sm:block">
                    Matematika
                  </h1>
                  <p className="text-sm font-bold text-slate-800 sm:hidden">Matematika</p>
                  <p className="text-xs text-slate-500 font-medium hidden sm:block">Másodfokú és Gyökös Egyenletek</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title={isDarkMode ? "Világos mód" : "Sötét mód"}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

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
            </div>


            {/* Chapter Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 w-full bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
                <div className="max-w-3xl mx-auto p-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fejezetek</h3>
                  <div className="grid gap-2">
                    {chapters.map((chap, i) => {
                      const isUnlocked = true; // Always unlocked
                      const isCurrent = activeBlockIndex >= chap.index &&
                        (i === chapters.length - 1 || activeBlockIndex < chapters[i + 1].index);

                      return (
                        <button
                          key={chap.item.id}
                          onClick={() => handleChapterClick(chap.index, chap.item.id)}
                          className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${isCurrent
                            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                              {i + 1}
                            </span>
                            <span className="font-medium text-slate-800">
                              {chap.item.title}
                            </span>
                          </div>
                          {isCurrent && <ChevronRight size={16} className="text-indigo-500" />}
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
        )
        }

        {/* Breadcrumb Navigation - hidden in focus mode or when menu is open */}
        {
          !focusMode && !isMenuOpen && activeCourseId && (
            <Breadcrumb
              items={[
                { label: 'Főoldal', onClick: () => setActiveCourseId(null) },
                { label: categories.find(c => c.subcategories.some(s => s.id === activeCourseId))?.title || 'Tárgy', onClick: () => setActiveCourseId(null) },
                { label: categories.find(c => c.subcategories.some(s => s.id === activeCourseId))?.subcategories.find(s => s.id === activeCourseId)?.title || 'Téma' },
                { label: currData[activeBlockIndex]?.title || 'Feladat' }
              ]}
            />
          )
        }

        {/* Main Content Area */}
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            {currData.slice(0, activeBlockIndex + 1).map((item, index) => {
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
                    onRegenerate={item.onRegenerate ? () => handleRegenerate(index) : undefined}
                  />
                );
              }
            })}
          </div>

          {/* Invisible element for scroll targeting */}
          <div ref={scrollRef} className="h-4" />

        </main>

        {/* Chapter Completed Toast */}
        {
          chapterNotification && (
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-500">
              <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-indigo-400">
                <PartyPopper size={20} className="animate-bounce" />
                <span className="font-bold">{chapterNotification}</span>
              </div>
            </div>
          )
        }

        {/* Course Completion Modal */}
        {
          isCourseFinished && (
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
          )
        }
      </div>

      {/* Developer Tools - Toggleable via 5 clicks on Graduation Cap */}
      {/* Developer Tools - Toggleable via 5 clicks on Graduation Cap */}
      {showDevTools && (
        <div
          className="fixed bottom-4 right-4 z-[100]"
          style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }}
        >
          <div className="bg-slate-800 text-white p-3 rounded-lg shadow-2xl opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1">
              <Settings size={12} /> Fejlesztői mód
              <button onClick={() => setShowDevTools(false)} className="ml-auto hover:text-white"><X size={12} /></button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveBlockIndex(currData.length - 1);
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
                {currData.map((item, idx) => (
                  <option key={item.id} value={idx}>
                    {idx + 1}. {item.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;