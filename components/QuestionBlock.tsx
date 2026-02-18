import React, { useState, useEffect } from 'react';
import { QuestionBlockData } from '../types';
import Latex from './Latex';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight, RefreshCw, Dices } from 'lucide-react';
import confetti from 'canvas-confetti';
import CoordinateSystem from './CoordinateSystem';
import { areValuesEqual } from '../utils/mathUtils';

interface Props {
  data: QuestionBlockData;
  onComplete: () => void;
  isCompleted: boolean;
  onRegenerate?: () => void;
  onMistake?: () => void;
  // New props for strict mode
  strictMode?: boolean; // If true, one attempt only, no hints
  onStrictFail?: () => void; // Called immediately on wrong answer in strict mode
  compact?: boolean; // If true, removes header and left border for cleaner UI
}

const QuestionBlock: React.FC<Props> = ({ data, onComplete, isCompleted, onRegenerate, onMistake, strictMode, onStrictFail, compact }) => {
  const [dynamicData, setDynamicData] = useState<QuestionBlockData | null>(null);

  // Effective data to use (dynamic or static)
  const effectiveData = dynamicData || data;

  const [singleInput, setSingleInput] = useState('');
  // We use this state array for 'roots-set', 'coefficients', 'quadratic-equation' and 'key-value'
  const [rootInputs, setRootInputs] = useState<string[]>(['', '', '']);

  // Matching specific state
  const [matchingSlots, setMatchingSlots] = useState<(string | null)[]>([]);
  const [matchingPool, setMatchingPool] = useState<string[]>([]);
  const [selectedPoolItem, setSelectedPoolItem] = useState<string | null>(null);
  const [shuffledPairs, setShuffledPairs] = useState<{ left: string; right: string }[]>([]);

  // Coordinate Plot specific state
  const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number } | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'hint'; msg: string } | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Initialize matching state when data changes or component mounts
  useEffect(() => {
    if (!data) return;

    // Handle Dynamic Generation
    let currentData = data;
    if (data.generate) {
      const generated = data.generate();
      currentData = { ...data, ...generated };
      setDynamicData(currentData);
    } else {
      setDynamicData(null);
    }

    initializeState(currentData);
  }, [data]); // Re-run if data prop changes (e.g. from parent regeneration)

  const initializeState = (d: QuestionBlockData) => {
    if (d.inputType === 'matching' && d.matchPairs) {
      const shuffled = [...d.matchPairs].sort(() => Math.random() - 0.5);
      setShuffledPairs(shuffled);
      setMatchingSlots(new Array(d.matchPairs.length).fill(null));
      // Shuffle the right side answers for the pool
      const rights = d.matchPairs.map(p => p.right);
      setMatchingPool([...rights].sort(() => Math.random() - 0.5));
    } else {
      // Reset specific states for other types if needed
      setMatchingSlots([]);
      setMatchingPool([]);
      setShuffledPairs([]);
    }
    // Reset specific states for other types if needed
    setSelectedPoint(null);
    // Reset inputs
    setSingleInput('');
    // Ensure rootInputs has enough slots if we know the count, otherwise default 3 is safe for existing types
    // For key-value, we might need more, but state updates handle expansion.
    setRootInputs(['', '', '']);
    setFeedback(null);
    setAttempts(0);
  };

  // Helper to render inline elements: LaTeX, Bold, and Italic
  const renderInline = (text: string) => {
    if (!text) return null; // Safe guard
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return <Latex key={index} block>{part.slice(2, -2)}</Latex>;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        return <Latex key={index}>{part.slice(1, -1)}</Latex>;
      }

      // Handle Bold (**text**)
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={index}>
          {boldParts.map((subPart, subIndex) => {
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
              return <strong key={subIndex} className="font-bold text-slate-900 dark:text-slate-100">{subPart.slice(2, -2)}</strong>;
            }

            // Handle Italic (*text*) inside non-bold parts
            const italicParts = subPart.split(/(\*[^*]+?\*)/g);
            return (
              <React.Fragment key={subIndex}>
                {italicParts.map((italicPart, iIndex) => {
                  if (italicPart.startsWith('*') && italicPart.endsWith('*') && italicPart.length > 2) {
                    return <em key={iIndex} className="italic text-slate-600 dark:text-slate-400">{italicPart.slice(1, -1)}</em>;
                  }
                  return italicPart;
                })}
              </React.Fragment>
            );
          })}
        </span>
      );
    });
  };

  // Render main question text with paragraphs
  const renderText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={lineIdx} className="h-2" />;
      return <div key={lineIdx} className="mb-2 leading-relaxed text-slate-700 dark:text-slate-300">{renderInline(trimmed)}</div>;
    });
  };

  const getValidSolutions = (): string[][] => {
    if (Array.isArray(effectiveData.correctAnswer)) {
      if (effectiveData.correctAnswer.length > 0 && Array.isArray(effectiveData.correctAnswer[0])) {
        return effectiveData.correctAnswer as string[][];
      } else {
        return [effectiveData.correctAnswer as string[]];
      }
    } else {
      return [[effectiveData.correctAnswer as string]];
    }
  };

  const checkAnswer = () => {
    let isCorrect = false;

    if (effectiveData.inputType === 'coefficients' || effectiveData.inputType === 'quadratic-equation') {
      const userValues = [rootInputs[0] || '', rootInputs[1] || '', rootInputs[2] || ''];
      const validSolutions = getValidSolutions();

      isCorrect = validSolutions.some(solution =>
        userValues.every((val, idx) => areValuesEqual(val, solution[idx]))
      );

    } else if (effectiveData.inputType === 'key-value') {
      const count = effectiveData.inputLabels?.length || 0;
      const userValues = [];
      for (let i = 0; i < count; i++) {
        userValues.push(rootInputs[i] || '');
      }

      const validSolutions = getValidSolutions();

      // Exact order match required
      isCorrect = validSolutions.some(solution =>
        userValues.every((val, idx) => areValuesEqual(val, solution[idx]))
      );

    } else if (effectiveData.inputType === 'roots-set') {
      const userValues = [rootInputs[0] || '', rootInputs[1] || ''].filter(val => val.trim() !== '');

      const validSolutions = getValidSolutions();

      // Check if any valid solution set matches the user input (order independent)
      isCorrect = validSolutions.some(solution => {
        if (userValues.length !== solution.length) return false;

        // Clone and sort logic needs numeric comparison if possible
        // This is tricky with fuzzy matching. 
        // Simplest strategy: Try to find a one-to-one mapping where everything matches.

        let remainingSolutions = [...solution];
        return userValues.every(uVal => {
          const matchIdx = remainingSolutions.findIndex(sVal => areValuesEqual(uVal, sVal));
          if (matchIdx !== -1) {
            remainingSolutions.splice(matchIdx, 1);
            return true;
          }
          return false;
        });
      });
    } else if (effectiveData.inputType === 'matching') {
      if (shuffledPairs.length > 0) {
        isCorrect = shuffledPairs.every((pair, idx) => matchingSlots[idx] === pair.right);
        if (matchingSlots.some(s => s === null)) isCorrect = false;
      }
    } else if (effectiveData.inputType === 'numeric') {
      const userVal = singleInput;
      // Assume numeric answer is simple string or string[] (alternatives)
      const correctVal = Array.isArray(effectiveData.correctAnswer)
        ? (Array.isArray(effectiveData.correctAnswer[0]) ? effectiveData.correctAnswer[0][0] : effectiveData.correctAnswer[0])
        : (effectiveData.correctAnswer as string);

      isCorrect = areValuesEqual(userVal, correctVal);

    } else if (effectiveData.inputType === 'coordinate-plot') {
      if (effectiveData.targetLine && Array.isArray(selectedPoint) && (selectedPoint as any).length === 2) {
        // Validate line: y = mx + b
        const p1 = (selectedPoint as any)[0];
        const p2 = (selectedPoint as any)[1];

        if (p1.x === p2.x) {
          // Vertical line - not supported for function plotting tasks (y = mx+b)
          isCorrect = false;
        } else {
          const targetM = effectiveData.targetLine.m;
          const targetB = effectiveData.targetLine.b;

          // Check if BOTH points satisfy the equation y = mx + b
          // allowing for small floating point errors
          const epsilon = 0.001;
          const val1 = targetM * p1.x + targetB;
          const val2 = targetM * p2.x + targetB;

          const p1Correct = Math.abs(p1.y - val1) < epsilon;
          const p2Correct = Math.abs(p2.y - val2) < epsilon;

          isCorrect = p1Correct && p2Correct;
        }

      } else if (effectiveData.targetCoordinates && Array.isArray(selectedPoint)) {
        // Validate set of points (order independent)
        const selectedPointsArray = selectedPoint as { x: number; y: number }[];

        if (selectedPointsArray.length !== effectiveData.targetCoordinates.length) {
          isCorrect = false;
        } else {
          // Check if every target point has a match in selected points
          isCorrect = effectiveData.targetCoordinates.every(target =>
            selectedPointsArray.some(p => p.x === target.x && p.y === target.y)
          );
        }

      } else if (effectiveData.targetCoordinate && selectedPoint && !Array.isArray(selectedPoint)) {
        isCorrect = selectedPoint.x === effectiveData.targetCoordinate.x && selectedPoint.y === effectiveData.targetCoordinate.y;
      }
    } else {
      // Basic string fallback for others
      const userVal = singleInput.trim();
      const correctVal = Array.isArray(effectiveData.correctAnswer)
        ? (Array.isArray(effectiveData.correctAnswer[0]) ? effectiveData.correctAnswer[0][0] : effectiveData.correctAnswer[0])
        : effectiveData.correctAnswer as string;
      isCorrect = userVal === correctVal;
    }

    if (isCorrect) {
      setFeedback({ type: 'success', msg: effectiveData.successMessage || 'Helyes válasz!' });

      if (!isCompleted) {
        // Reliable confetti from bottom center
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.75 }, // Just slightly up from the bottom edge
          zIndex: 9999, // Force on top of everything
          colors: ['#4f46e5', '#10b981', '#fbbf24', '#e11d48']
        });
        onComplete();
      }
    } else {
      // Strict Mode Handling
      if (strictMode) {
        setFeedback({ type: 'error', msg: 'Helytelen válasz. A köröd véget ért.' });
        if (onStrictFail) onStrictFail();
        return;
      }

      setAttempts(prev => prev + 1);
      const currentAttempts = attempts + 1; // logical attempt count after this failure

      let msg = 'Nem jó válasz, próbáld újra!'; // Default 1st level
      let type: 'error' | 'hint' = 'error';

      if (currentAttempts === 1) {
        // Level 1: Just error
        msg = 'Nem jó válasz, próbáld újra!';
        type = 'error';
      } else if (currentAttempts === 2) {
        // Level 2: Hint
        msg = effectiveData.hint || 'Próbáld újra!';
        type = 'hint';
      } else if (currentAttempts === 3) {
        // Level 3: Detailed Hint (First step or Breakdown)
        if (effectiveData.detailedHint) {
          msg = effectiveData.detailedHint;
          type = 'hint';
        } else if (effectiveData.explanation) {
          // Fallback to explanation if no detailed hint
          msg = effectiveData.explanation;
          type = 'hint';
        } else {
          msg = effectiveData.hint || 'Próbáld újra!';
          type = 'hint';
        }
      } else {
        // Level 4+: Explanation or stick to Level 3
        msg = effectiveData.explanation || effectiveData.detailedHint || effectiveData.hint || 'Próbáld újra!';
        type = 'hint';
      }

      setFeedback({ type, msg });

      if (onMistake) onMistake();
    }
  };

  const handleRootInputChange = (index: number, value: string) => {
    const newInputs = [...rootInputs];
    newInputs[index] = value;
    setRootInputs(newInputs);
  };

  const handlePoolItemClick = (item: string) => {
    setSelectedPoolItem(prev => prev === item ? null : item);
  };

  const handleSlotClick = (index: number) => {
    if (matchingSlots[index]) {
      const itemToRemove = matchingSlots[index];
      const newSlots = [...matchingSlots];
      newSlots[index] = null;
      setMatchingSlots(newSlots);
    } else if (selectedPoolItem) {
      const newSlots = [...matchingSlots];
      newSlots[index] = selectedPoolItem;
      setMatchingSlots(newSlots);
      setSelectedPoolItem(null);
    }
  };

  const isInteractive = !isCompleted;

  if (!effectiveData) {
    return <div className="p-4 text-red-500">Hiba: Nem található feladat adat.</div>;
  }

  return (
    <div id={effectiveData.id || 'question-block'} className={`relative scroll-mt-24 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden ${compact ? '' : `border-t-4 ${isCompleted ? 'border-green-500 dark:border-green-400' : 'border-indigo-500 dark:border-indigo-400'}`} mb-6 transition-colors duration-300`}>

      {/* Type Badge - Only if not compact */}
      {!compact && (
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${isCompleted ? 'bg-green-500 dark:bg-green-400' : 'bg-indigo-500 dark:bg-indigo-400'} text-white text-xs font-bold px-4 py-1 rounded-b-xl uppercase tracking-wider shadow-sm`}>
          ❓ Feladat
        </div>
      )}

      <div className={`${compact ? 'p-2' : 'p-6 sm:p-8 pt-12'}`}>


        <div className="mb-6 text-slate-700 dark:text-slate-200 text-lg">
          {renderText(effectiveData.question)}
        </div>

        {/* Illustration Area */}
        {effectiveData.diagramConfig && effectiveData.diagramConfig.type === 'coordinate-system' ? (
          <div className="mb-8 flex justify-center">
            <CoordinateSystem
              isInteractive={false}
              width={300}
              height={300}
              range={5}
              initialPoints={effectiveData.diagramConfig.points}
              showGrid={true}
              showLabels={true}
            />
          </div>
        ) : effectiveData.illustration ? (
          <div className="mb-8 flex justify-center bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
            <div
              dangerouslySetInnerHTML={{ __html: effectiveData.illustration }}
              className="w-full max-w-md 
                [&_.grid-path]:stroke-slate-200 dark:[&_.grid-path]:stroke-slate-700 
                [&_.axis-marker]:fill-slate-400 dark:[&_.axis-marker]:fill-slate-500 
                [&_.axis-line]:stroke-slate-400 dark:[&_.axis-line]:stroke-slate-500 
                [&_.axis-text_text]:fill-slate-500 dark:[&_.axis-text_text]:fill-slate-400
                [&_.point-group_text]:fill-red-500 dark:[&_.point-group_text]:fill-red-400
                [&_.point-group_circle]:fill-red-500 dark:[&_.point-group_circle]:fill-red-400
                [&_.point-group_line]:stroke-red-500 dark:[&_.point-group_line]:stroke-red-400
                [&_.axis-label-text]:fill-slate-600 dark:[&_.axis-label-text]:fill-slate-400
                [&_text]:fill-slate-700 dark:[&_text]:fill-slate-200
                [&_path]:stroke-slate-700 dark:[&_path]:stroke-slate-200
              "
            />
          </div>
        ) : null}

        {/* Input Area */}
        <div className="space-y-6">

          {effectiveData.inputType === 'multiple-choice' && effectiveData.options && (
            <div className={`grid gap-3 ${effectiveData.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {effectiveData.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={!isInteractive}
                  onClick={() => setSingleInput(opt)}
                  className={`p-4 rounded-lg border-2 text-left transition-all text-lg ${singleInput === opt
                    ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-200 font-medium ring-1 ring-indigo-400'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    } ${!isInteractive && singleInput !== opt ? 'opacity-50' : ''}`}
                >
                  {renderInline(opt)}
                </button>
              ))}
            </div>
          )}

          {effectiveData.inputType === 'numeric' && (
            <div className={`flex items-center gap-3 ${effectiveData.inputPrefix ? 'flex-row' : 'flex-col sm:flex-row'}`}>
              {effectiveData.inputPrefix && (
                <div className="text-xl text-slate-800 dark:text-slate-200 font-serif">
                  {renderInline(effectiveData.inputPrefix)}
                </div>
              )}
              <input
                type="text"
                value={singleInput}
                onChange={(e) => setSingleInput(e.target.value)}
                disabled={!isInteractive}
                placeholder={effectiveData.inputPrefix ? "" : "Írd ide a választ..."}
                className={`${effectiveData.inputPrefix ? 'w-32 text-center font-bold' : 'w-full md:w-2/3'} p-3 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg transition-colors`}
              />
            </div>
          )}

          {effectiveData.inputType === 'key-value' && effectiveData.inputLabels && (
            <div className={`flex flex-wrap gap-x-8 gap-y-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 ${effectiveData.layout === 'coordinate' ? 'justify-center' : ''}`}>

              {effectiveData.layout === 'coordinate' ? (
                <div className="flex items-center gap-2 text-2xl font-serif text-slate-800 dark:text-slate-200">
                  {effectiveData.inputPrefix && <span className="font-bold mr-1">{renderInline(effectiveData.inputPrefix)}</span>}
                  <span>(</span>
                  <input
                    type="text"
                    value={rootInputs[0] || ''}
                    onChange={(e) => handleRootInputChange(0, e.target.value)}
                    disabled={!isInteractive}
                    className="w-16 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-xl"
                    placeholder="x"
                  />
                  <span className="mx-1">;</span>
                  <input
                    type="text"
                    value={rootInputs[1] || ''}
                    onChange={(e) => handleRootInputChange(1, e.target.value)}
                    disabled={!isInteractive}
                    className="w-16 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-xl"
                    placeholder="y"
                  />
                  <span>)</span>
                </div>
              ) : (
                effectiveData.inputLabels.map((label, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="text-lg text-slate-700 dark:text-slate-300 font-medium">{renderInline(label)}</div>
                    <input
                      type="text"
                      value={rootInputs[idx] || ''}
                      onChange={(e) => handleRootInputChange(idx, e.target.value)}
                      disabled={!isInteractive}
                      className="w-20 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-lg"
                      placeholder="?"
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {effectiveData.inputType === 'coefficients' && (
            <div className="flex flex-wrap gap-4 items-center justify-start bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xl text-slate-700 dark:text-slate-300"><Latex>a =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[0] || ''}
                  onChange={(e) => handleRootInputChange(0, e.target.value)}
                  disabled={!isInteractive}
                  className="w-20 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-lg"
                  placeholder="?"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl text-slate-700 dark:text-slate-300"><Latex>b =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[1] || ''}
                  onChange={(e) => handleRootInputChange(1, e.target.value)}
                  disabled={!isInteractive}
                  className="w-20 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-lg"
                  placeholder="?"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl text-slate-700 dark:text-slate-300"><Latex>c =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[2] || ''}
                  onChange={(e) => handleRootInputChange(2, e.target.value)}
                  disabled={!isInteractive}
                  className="w-20 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-lg"
                  placeholder="?"
                />
              </div>
            </div>
          )}

          {effectiveData.inputType === 'quadratic-equation' && (
            <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 font-serif text-xl text-slate-800 dark:text-slate-200">
              <input
                type="text"
                value={rootInputs[0] || ''}
                onChange={(e) => handleRootInputChange(0, e.target.value)}
                disabled={!isInteractive}
                className="w-16 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold"
                placeholder="a"
              />
              <Latex>x^2 +</Latex>
              <input
                type="text"
                value={rootInputs[1] || ''}
                onChange={(e) => handleRootInputChange(1, e.target.value)}
                disabled={!isInteractive}
                className="w-16 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold"
                placeholder="b"
              />
              <Latex>x +</Latex>
              <input
                type="text"
                value={rootInputs[2] || ''}
                onChange={(e) => handleRootInputChange(2, e.target.value)}
                disabled={!isInteractive}
                className="w-16 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold"
                placeholder="c"
              />
              <Latex>= 0</Latex>
            </div>
          )}

          {effectiveData.inputType === 'roots-set' && (
            <div className={`flex flex-col sm:flex-row gap-6 items-center ${compact ? '' : 'bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700'} w-fit`}>
              <div className="flex items-center gap-3">
                <span className="text-lg text-slate-700 dark:text-slate-300"><Latex>x_1 =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[0] || ''}
                  onChange={(e) => handleRootInputChange(0, e.target.value)}
                  disabled={!isInteractive}
                  className="w-24 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-center text-lg"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg text-slate-700 dark:text-slate-300"><Latex>x_2 =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[1] || ''}
                  onChange={(e) => handleRootInputChange(1, e.target.value)}
                  disabled={!isInteractive}
                  className="w-24 p-2 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-center text-lg"
                />
              </div>
            </div>
          )}

          {effectiveData.inputType === 'matching' && shuffledPairs.length > 0 && (
            <div className="space-y-8">
              {/* Slots Area */}
              <div className="space-y-3">
                {shuffledPairs.map((pair, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div className="sm:w-1/3 text-lg font-medium pl-2 text-slate-800 dark:text-slate-200">
                      {renderInline(pair.left)}
                    </div>
                    <div className="flex-1">
                      <button
                        disabled={!isInteractive}
                        onClick={() => handleSlotClick(idx)}
                        onDragOver={(e) => {
                          if (!isInteractive) return;
                          e.preventDefault(); // Allow dropping
                          e.dataTransfer.dropEffect = 'copy';
                        }}
                        onDrop={(e) => {
                          if (!isInteractive) return;
                          e.preventDefault();
                          const item = e.dataTransfer.getData('text/plain');
                          if (item) {
                            const newSlots = [...matchingSlots];
                            newSlots[idx] = item;
                            setMatchingSlots(newSlots);
                            setSelectedPoolItem(null); // Clear selection if any
                          }
                        }}
                        className={`w-full p-3 rounded-lg border-2 border-dashed transition-all flex items-center justify-center sm:justify-between min-h-[3.5rem]
                                        ${matchingSlots[idx]
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold border-solid'
                            : selectedPoolItem
                              ? 'border-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 hover:border-slate-400 dark:hover:border-slate-500'
                          }`}
                      >
                        <span className={matchingSlots[idx] ? '' : 'text-slate-400 dark:text-slate-500'}>
                          {matchingSlots[idx]
                            ? renderInline(matchingSlots[idx]!)
                            : (selectedPoolItem ? "Kattints a beillesztéshez" : "Húzd ide vagy válassz alulról...")}
                        </span>
                        {matchingSlots[idx] && isInteractive && <RefreshCw size={16} className="ml-2" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pool Area */}
              {isInteractive && (
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Választható elemek:</p>
                  <div className="flex flex-wrap gap-3">
                    {matchingPool.filter(item => !matchingSlots.includes(item)).map((item, idx) => (
                      <button
                        key={idx}
                        draggable={isInteractive}
                        onDragStart={(e) => {
                          if (!isInteractive) return;
                          e.dataTransfer.setData('text/plain', item);
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onClick={() => handlePoolItemClick(item)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm md:text-base font-medium transition-all transform active:scale-95 cursor-grab active:cursor-grabbing
                                        ${selectedPoolItem === item
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg scale-105'
                            : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-200'
                          }`}
                      >
                        {renderInline(item)}
                      </button>
                    ))}
                    {matchingPool.filter(item => !matchingSlots.includes(item)).length === 0 && (
                      <span className="text-slate-400 italic text-sm">Minden elemet felhasználtál. Ellenőrizd a megoldást!</span>
                    )}
                  </div>
                </div>
              )}
            </div>

          )}


          {effectiveData.inputType === 'coordinate-plot' && (
            <div className="flex justify-center">
              <CoordinateSystem
                isInteractive={isInteractive}
                targetPoint={effectiveData.targetCoordinate}
                width={300}
                height={300}
                range={5}
                onPointSelect={(points) => {
                  // Handle both single point and array
                  if (Array.isArray(points)) {
                    // Store array in selectedPoint (cast to any to match simple state type for now)
                    setSelectedPoint(points as any);
                  } else {
                    setSelectedPoint(points);
                  }
                }}
                maxPoints={effectiveData.maxPoints || 1}
                drawMode={effectiveData.drawMode || 'point'}
              />
            </div>
          )}

        </div>
        {/* Controls & Feedback */}
        {isInteractive ? (
          <div className="mt-8 pt-2">
            <button
              onClick={checkAnswer}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg active:scale-95 text-lg"
            >
              Ellenőrzés <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="animate-pop-in flex items-center gap-2 text-green-700 font-bold bg-green-100 p-4 rounded-lg border border-green-200 shadow-sm">
              <CheckCircle2 className="w-6 h-6 animate-[bounce_1s_infinite]" />
              Teljesítve
            </div>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="animate-fade-in flex items-center gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-3 px-5 rounded-lg transition-colors"
              >
                <Dices className="w-5 h-5" />
                Még egyet kérek!
              </button>
            )}
          </div>
        )}

        {feedback && !isCompleted && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 animate-fade-in border ${feedback.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
            : feedback.type === 'hint'
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 mt-0.5 shrink-0" />
            ) : feedback.type === 'hint' ? (
              <HelpCircle className="w-6 h-6 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 mt-0.5 shrink-0" />
            )}
            <div>
              <span className="font-bold block mb-1 text-lg">
                {feedback.type === 'success' ? 'Helyes!' : feedback.type === 'hint' ? (attempts >= 3 && data.explanation ? 'Magyarázat:' : 'Segítség:') : 'Hiba:'}
              </span>
              <span className="leading-relaxed">{renderInline(feedback.msg)}</span>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default QuestionBlock;