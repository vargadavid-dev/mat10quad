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
}

const QuestionBlock: React.FC<Props> = ({ data, onComplete, isCompleted, onRegenerate }) => {
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
    if (data.inputType === 'matching' && data.matchPairs) {
      const shuffled = [...data.matchPairs].sort(() => Math.random() - 0.5);
      setShuffledPairs(shuffled);
      setMatchingSlots(new Array(data.matchPairs.length).fill(null));
      // Shuffle the right side answers for the pool
      const rights = data.matchPairs.map(p => p.right);
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
  }, [data]);

  // Helper to render inline elements: LaTeX, Bold, and Italic
  const renderInline = (text: string) => {
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
              return <strong key={subIndex} className="font-bold">{subPart.slice(2, -2)}</strong>;
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
      return <div key={lineIdx} className="mb-2 leading-relaxed">{renderInline(trimmed)}</div>;
    });
  };

  const getValidSolutions = (): string[][] => {
    if (Array.isArray(data.correctAnswer)) {
      if (data.correctAnswer.length > 0 && Array.isArray(data.correctAnswer[0])) {
        return data.correctAnswer as string[][];
      } else {
        return [data.correctAnswer as string[]];
      }
    } else {
      return [[data.correctAnswer as string]];
    }
  };

  const checkAnswer = () => {
    let isCorrect = false;

    if (data.inputType === 'coefficients' || data.inputType === 'quadratic-equation') {
      const userValues = [rootInputs[0] || '', rootInputs[1] || '', rootInputs[2] || ''];
      const validSolutions = getValidSolutions();

      isCorrect = validSolutions.some(solution =>
        userValues.every((val, idx) => areValuesEqual(val, solution[idx]))
      );

    } else if (data.inputType === 'key-value') {
      const count = data.inputLabels?.length || 0;
      const userValues = [];
      for (let i = 0; i < count; i++) {
        userValues.push(rootInputs[i] || '');
      }

      const validSolutions = getValidSolutions();

      // Exact order match required
      isCorrect = validSolutions.some(solution =>
        userValues.every((val, idx) => areValuesEqual(val, solution[idx]))
      );

    } else if (data.inputType === 'roots-set') {
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
    } else if (data.inputType === 'matching') {
      if (shuffledPairs.length > 0) {
        isCorrect = shuffledPairs.every((pair, idx) => matchingSlots[idx] === pair.right);
        if (matchingSlots.some(s => s === null)) isCorrect = false;
      }
    } else if (data.inputType === 'numeric') {
      const userVal = singleInput;
      // Assume numeric answer is simple string or string[] (alternatives)
      const correctVal = Array.isArray(data.correctAnswer)
        ? (Array.isArray(data.correctAnswer[0]) ? data.correctAnswer[0][0] : data.correctAnswer[0])
        : (data.correctAnswer as string);

      isCorrect = areValuesEqual(userVal, correctVal);

    } else if (data.inputType === 'coordinate-plot') {
      if (data.targetLine && Array.isArray(selectedPoint) && (selectedPoint as any).length === 2) {
        // Validate line: y = mx + b
        const p1 = (selectedPoint as any)[0];
        const p2 = (selectedPoint as any)[1];

        if (p1.x === p2.x) {
          // Vertical line - not supported by functions usually, but let's say we don't expect it here.
          isCorrect = false;
        } else {
          const m = (p2.y - p1.y) / (p2.x - p1.x);
          const b = p1.y - m * p1.x;

          const targetM = data.targetLine.m;
          const targetB = data.targetLine.b;

          // Float comparison tolerance
          const epsilon = 0.001;
          isCorrect = Math.abs(m - targetM) < epsilon && Math.abs(b - targetB) < epsilon;
        }

      } else if (data.targetCoordinates && Array.isArray(selectedPoint)) {
        // Validate set of points (order independent)
        const selectedPointsArray = selectedPoint as { x: number; y: number }[];

        if (selectedPointsArray.length !== data.targetCoordinates.length) {
          isCorrect = false;
        } else {
          // Check if every target point has a match in selected points
          isCorrect = data.targetCoordinates.every(target =>
            selectedPointsArray.some(p => p.x === target.x && p.y === target.y)
          );
        }

      } else if (data.targetCoordinate && selectedPoint && !Array.isArray(selectedPoint)) {
        isCorrect = selectedPoint.x === data.targetCoordinate.x && selectedPoint.y === data.targetCoordinate.y;
      }
    } else {
      // Basic string fallback for others
      const userVal = singleInput.trim();
      const correctVal = Array.isArray(data.correctAnswer)
        ? (Array.isArray(data.correctAnswer[0]) ? data.correctAnswer[0][0] : data.correctAnswer[0])
        : data.correctAnswer as string;
      isCorrect = userVal === correctVal;
    }

    if (isCorrect) {
      setFeedback({ type: 'success', msg: data.successMessage || 'Helyes válasz!' });

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
      setAttempts(prev => prev + 1);
      setFeedback({
        type: 'error',
        msg: attempts >= 0 ? data.hint : 'Próbáld újra!'
      });
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

  return (
    <div id={data.id} className={`scroll-mt-24 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border-l-4 ${isCompleted ? 'border-green-500 dark:border-green-400' : 'border-indigo-500 dark:border-indigo-400'} mb-6 transition-colors duration-300`}>
      <div className="p-6 sm:p-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <HelpCircle className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          Feladat
        </h3>

        <div className="mb-6 text-slate-700 text-lg">
          {renderText(data.question)}
        </div>

        {/* Illustration Area */}
        {data.diagramConfig && data.diagramConfig.type === 'coordinate-system' ? (
          <div className="mb-8 flex justify-center">
            <CoordinateSystem
              isInteractive={false}
              width={300}
              height={300}
              range={5}
              initialPoints={data.diagramConfig.points}
              showGrid={true}
              showLabels={true}
            />
          </div>
        ) : data.illustration ? (
          <div className="mb-8 flex justify-center bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
            <div
              dangerouslySetInnerHTML={{ __html: data.illustration }}
              className="w-full max-w-md 
                [&_.grid-path]:stroke-slate-200 dark:[&_.grid-path]:stroke-slate-700 
                [&_.axis-marker]:fill-slate-400 dark:[&_.axis-marker]:fill-slate-500 
                [&_.axis-line]:stroke-slate-400 dark:[&_.axis-line]:stroke-slate-500 
                [&_.axis-text_text]:fill-slate-500 dark:[&_.axis-text_text]:fill-slate-400
                [&_.point-group_text]:fill-red-500 dark:[&_.point-group_text]:fill-red-400
                [&_.point-group_circle]:fill-red-500 dark:[&_.point-group_circle]:fill-red-400
                [&_.point-group_line]:stroke-red-500 dark:[&_.point-group_line]:stroke-red-400
                [&_.axis-label-text]:fill-slate-600 dark:[&_.axis-label-text]:fill-slate-400
              "
            />
          </div>
        ) : null}

        {/* Input Area */}
        <div className="space-y-6">

          {data.inputType === 'multiple-choice' && data.options && (
            <div className="grid grid-cols-1 gap-3">
              {data.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={!isInteractive}
                  onClick={() => setSingleInput(opt)}
                  className={`p-4 rounded-lg border-2 text-left transition-all text-lg ${singleInput === opt
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-200'
                    } ${!isInteractive && singleInput !== opt ? 'opacity-50' : ''}`}
                >
                  {renderInline(opt)}
                </button>
              ))}
            </div>
          )}

          {data.inputType === 'numeric' && (
            <div className={`flex items-center gap-3 ${data.inputPrefix ? 'flex-row' : 'flex-col sm:flex-row'}`}>
              {data.inputPrefix && (
                <div className="text-xl text-slate-800 font-serif">
                  {renderInline(data.inputPrefix)}
                </div>
              )}
              <input
                type="text"
                value={singleInput}
                onChange={(e) => setSingleInput(e.target.value)}
                disabled={!isInteractive}
                placeholder={data.inputPrefix ? "" : "Írd ide a választ..."}
                className={`${data.inputPrefix ? 'w-32 text-center font-bold' : 'w-full md:w-2/3'} p-3 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg transition-colors`}
              />
            </div>
          )}

          {data.inputType === 'key-value' && data.inputLabels && (
            <div className={`flex flex-wrap gap-x-8 gap-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100 ${data.layout === 'coordinate' ? 'justify-center' : ''}`}>

              {data.layout === 'coordinate' ? (
                <div className="flex items-center gap-2 text-2xl font-serif text-slate-800">
                  {data.inputPrefix && <span className="font-bold mr-1">{renderInline(data.inputPrefix)}</span>}
                  <span>(</span>
                  <input
                    type="text"
                    value={rootInputs[0] || ''}
                    onChange={(e) => handleRootInputChange(0, e.target.value)}
                    disabled={!isInteractive}
                    className="w-16 p-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-xl"
                    placeholder="x"
                  />
                  <span className="mx-1">;</span>
                  <input
                    type="text"
                    value={rootInputs[1] || ''}
                    onChange={(e) => handleRootInputChange(1, e.target.value)}
                    disabled={!isInteractive}
                    className="w-16 p-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-xl"
                    placeholder="y"
                  />
                  <span>)</span>
                </div>
              ) : (
                data.inputLabels.map((label, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="text-lg text-slate-700 font-medium">{renderInline(label)}</div>
                    <input
                      type="text"
                      value={rootInputs[idx] || ''}
                      onChange={(e) => handleRootInputChange(idx, e.target.value)}
                      disabled={!isInteractive}
                      className="w-20 p-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-lg"
                      placeholder="?"
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {data.inputType === 'coefficients' && (
            <div className="flex flex-wrap gap-4 items-center justify-start bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl text-slate-700"><Latex>a =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[0] || ''}
                  onChange={(e) => handleRootInputChange(0, e.target.value)}
                  disabled={!isInteractive}
                  className="w-20 p-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-lg"
                  placeholder="?"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl text-slate-700"><Latex>b =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[1] || ''}
                  onChange={(e) => handleRootInputChange(1, e.target.value)}
                  disabled={!isInteractive}
                  className="w-20 p-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-lg"
                  placeholder="?"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl text-slate-700"><Latex>c =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[2] || ''}
                  onChange={(e) => handleRootInputChange(2, e.target.value)}
                  disabled={!isInteractive}
                  className="w-20 p-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-center font-bold text-lg"
                  placeholder="?"
                />
              </div>
            </div>
          )}

          {data.inputType === 'quadratic-equation' && (
            <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-700 font-serif text-xl border-slate-800 dark:text-slate-200">
              <input
                type="text"
                value={rootInputs[0] || ''}
                onChange={(e) => handleRootInputChange(0, e.target.value)}
                disabled={!isInteractive}
                className="w-16 p-2 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold"
                placeholder="a"
              />
              <Latex>x^2 +</Latex>
              <input
                type="text"
                value={rootInputs[1] || ''}
                onChange={(e) => handleRootInputChange(1, e.target.value)}
                disabled={!isInteractive}
                className="w-16 p-2 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold"
                placeholder="b"
              />
              <Latex>x +</Latex>
              <input
                type="text"
                value={rootInputs[2] || ''}
                onChange={(e) => handleRootInputChange(2, e.target.value)}
                disabled={!isInteractive}
                className="w-16 p-2 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 outline-none text-center font-bold"
                placeholder="c"
              />
              <Latex>= 0</Latex>
            </div>
          )}

          {data.inputType === 'roots-set' && (
            <div className="flex flex-col sm:flex-row gap-6 items-center bg-slate-50 p-4 rounded-xl border border-slate-100 w-fit">
              <div className="flex items-center gap-3">
                <span className="text-lg text-slate-700"><Latex>x_1 =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[0] || ''}
                  onChange={(e) => handleRootInputChange(0, e.target.value)}
                  disabled={!isInteractive}
                  className="w-24 p-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-center text-lg"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg text-slate-700"><Latex>x_2 =</Latex></span>
                <input
                  type="text"
                  value={rootInputs[1] || ''}
                  onChange={(e) => handleRootInputChange(1, e.target.value)}
                  disabled={!isInteractive}
                  className="w-24 p-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-center text-lg"
                />
              </div>
            </div>
          )}

          {data.inputType === 'matching' && shuffledPairs.length > 0 && (
            <div className="space-y-8">
              {/* Slots Area */}
              <div className="space-y-3">
                {shuffledPairs.map((pair, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="sm:w-1/3 text-lg font-medium pl-2">
                      {renderInline(pair.left)}
                    </div>
                    <div className="flex-1">
                      <button
                        disabled={!isInteractive}
                        onClick={() => handleSlotClick(idx)}
                        className={`w-full p-3 rounded-lg border-2 border-dashed transition-all flex items-center justify-center sm:justify-between min-h-[3.5rem]
                                        ${matchingSlots[idx]
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold border-solid'
                            : selectedPoolItem
                              ? 'border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50'
                              : 'border-slate-300 bg-white text-slate-400 hover:border-slate-400'
                          }`}
                      >
                        <span>
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
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Választható elemek:</p>
                  <div className="flex flex-wrap gap-3">
                    {matchingPool.filter(item => !matchingSlots.includes(item)).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePoolItemClick(item)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm md:text-base font-medium transition-all transform active:scale-95
                                        ${selectedPoolItem === item
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg scale-105'
                            : 'border-slate-200 hover:border-indigo-300 hover:text-indigo-700 bg-white text-slate-700'
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

          {data.inputType === 'coordinate-plot' && (
            <div className="flex justify-center">
              <CoordinateSystem
                isInteractive={isInteractive}
                targetPoint={data.targetCoordinate}
                width={300}
                height={300}
                range={5}
                onPointSelect={(points) => {
                  // Handle both single point and array
                  if (Array.isArray(points)) {
                    setSelectedPoint(points[0]); // Keep backward compatibility for state type if simple, but we really need array state
                    // Actually, we need to adapt state. 
                    // Let's cast to any to store array or single object in selectedPoint state variable 
                    // or better, use a Ref or check type.
                    // Simplest for now: store array in selectedPoint (as any)
                    setSelectedPoint(points as any);
                  } else {
                    setSelectedPoint(points);
                  }
                }}
                maxPoints={data.maxPoints || 1}
                drawMode={data.drawMode || 'point'}
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
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 animate-fade-in border ${feedback.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
            }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 mt-0.5 shrink-0" />
            )}
            <div>
              <span className="font-bold block mb-1 text-lg">
                {feedback.type === 'success' ? 'Helyes!' : 'Segítség:'}
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