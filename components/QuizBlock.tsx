import React, { useState } from 'react';
import { QuizBlockData } from '../types';
import { Trophy, ArrowRight, RotateCcw, CheckCircle, XCircle, Play } from 'lucide-react';
import Latex from './Latex';
import confetti from 'canvas-confetti';
import CertificateGenerator from './CertificateGenerator';

interface QuizBlockProps {
    data: QuizBlockData;
    onComplete: () => void;
    isCompleted?: boolean;
}

const QuizBlock: React.FC<QuizBlockProps> = ({ data, onComplete, isCompleted }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(string | string[] | (string | null)[] | undefined)[]>(new Array(data.questions.length).fill(undefined));
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const [showCertificateInput, setShowCertificateInput] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);

    // State for shuffled pairs map (for matching questions)
    const [shuffledPairsMap, setShuffledPairsMap] = useState<Record<number, { left: string, right: string }[]>>({});
    // State for matching pool (available right-side items)
    const [matchingPoolMap, setMatchingPoolMap] = useState<Record<number, string[]>>({});
    // Selected pool item for matching
    const [selectedPoolItem, setSelectedPoolItem] = useState<string | null>(null);

    const currentQuestion = data.questions[currentQuestionIndex];

    // Helper to render inline LaTeX, Bold, Italic
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
                        // Handle Italic (*text*)
                        const italicParts = subPart.split(/(\*[^*]+?\*)/g);
                        return (
                            <React.Fragment key={subIndex}>
                                {italicParts.map((iPart, iIdx) => {
                                    if (iPart.startsWith('*') && iPart.endsWith('*') && iPart.length > 2) {
                                        return <em key={iIdx} className="italic text-slate-500">{iPart.slice(1, -1)}</em>;
                                    }
                                    return iPart;
                                })}
                            </React.Fragment>
                        );
                    })}
                </span>
            );
        });
    };

    const handleStart = () => {
        setHasStarted(true);
        setCurrentQuestionIndex(0);
        setAnswers(new Array(data.questions.length).fill(undefined));
        setShowResults(false);
        setScore(0);

        // Initialize matching questions
        const newShuffledPairsMap: Record<number, { left: string, right: string }[]> = {};
        const newMatchingPoolMap: Record<number, string[]> = {};

        data.questions.forEach((q, idx) => {
            if (q.inputType === 'matching' && q.matchPairs) {
                // Shuffle the pairs for display order (left side)
                const shuffled = [...q.matchPairs].sort(() => Math.random() - 0.5);
                newShuffledPairsMap[idx] = shuffled;

                // Shuffle the right side answers for the pool
                const rights = q.matchPairs.map(p => p.right);
                newMatchingPoolMap[idx] = [...rights].sort(() => Math.random() - 0.5);
            }
        });
        setShuffledPairsMap(newShuffledPairsMap);
        setMatchingPoolMap(newMatchingPoolMap);
    };

    const handleAnswerSelect = (val: any) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = val;
        setAnswers(newAnswers);
    };

    const handleMatchingSlotClick = (pairIndex: number) => {
        const currentSlots = (answers[currentQuestionIndex] as (string | null)[]) || new Array(shuffledPairsMap[currentQuestionIndex].length).fill(null);

        if (currentSlots[pairIndex]) {
            // Remove item from slot
            const newSlots = [...currentSlots];
            newSlots[pairIndex] = null;
            handleAnswerSelect(newSlots);
        } else if (selectedPoolItem) {
            // Place item into slot
            const newSlots = [...currentSlots];
            newSlots[pairIndex] = selectedPoolItem;
            handleAnswerSelect(newSlots);
            setSelectedPoolItem(null);
        }
    };

    const handlePoolItemClick = (item: string) => {
        setSelectedPoolItem(prev => prev === item ? null : item);
    };

    const isMatchingComplete = () => {
        if (currentQuestion.inputType === 'matching') {
            const currentSlots = answers[currentQuestionIndex] as (string | null)[];
            if (!currentSlots) return false;
            // Check if all slots are filled
            // Actually, we should allow partial answers? No, button disabled until answer provided? 
            // For matching, usually we want full completion.
            // Let's check if array has no nulls and length matches
            return currentSlots.length === shuffledPairsMap[currentQuestionIndex]?.length && currentSlots.every(s => s !== null);
        }
        return !!answers[currentQuestionIndex];
    };

    const handleNext = () => {
        if (currentQuestionIndex < data.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedPoolItem(null); // Reset selection
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        let calculatedScore = 0;
        answers.forEach((ans, idx) => {
            const question = data.questions[idx];
            const correct = question.correctAnswer;
            const inputType = question.inputType;

            if (!ans) return;

            if (inputType === 'matching') {
                // Check matching logic
                const userSlots = ans as (string | null)[];
                const shuffledPairs = shuffledPairsMap[idx];

                if (userSlots && shuffledPairs && userSlots.length === shuffledPairs.length) {
                    // Check if every slot matches the correct pair
                    const isAllCorrect = shuffledPairs.every((pair, pairIdx) => userSlots[pairIdx] === pair.right);
                    if (isAllCorrect) calculatedScore++;
                }
            }
            // For numeric: normalize both answers (remove spaces, compare as numbers if possible)
            else if (inputType === 'numeric' && typeof correct === 'string') {
                const userAnswer = ans.toString().trim();
                const normalizedUser = userAnswer.replace(/\s/g, '').replace(',', '.');
                const normalizedCorrect = correct.replace(/\s/g, '').replace(',', '.');
                if (normalizedUser === normalizedCorrect ||
                    (parseFloat(normalizedUser) === parseFloat(normalizedCorrect) && !isNaN(parseFloat(normalizedUser)))) {
                    calculatedScore++;
                }
            }
            // For multiple-choice: exact string match
            else if (typeof correct === 'string' && ans === correct) {
                calculatedScore++;
            } else if (Array.isArray(correct) && correct.includes(ans as string)) {
                calculatedScore++;
            }
        });

        setScore(calculatedScore);
        setShowResults(true);

        // Check if passed (default 50% if not specified)
        const passed = calculatedScore >= (data.minScoreToPass ?? Math.ceil(data.questions.length / 2));

        if (passed) {
            // if (!isCompleted) {
            //     onComplete();
            // }
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }, 500);
        }
    };

    // Intro Screen
    if (!hasStarted && !showResults) {
        return (
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-t-4 border-purple-500 dark:border-purple-400 overflow-hidden mb-6">

                {/* Type Badge */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-purple-500 dark:bg-purple-400 text-white text-xs font-bold px-4 py-1 rounded-b-xl uppercase tracking-wider shadow-sm">
                    🏆 Kvíz
                </div>

                <div className="p-8 pt-12 text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="text-purple-600 dark:text-purple-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                        {data.title || "Ellenőrizd a tudásod"}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        {data.description || "Egy rövid kvíz a fejezet tartalmából. Nem kötelező, de segít rögzíteni a tanultakat."}
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{data.questions.length}</span> kérdés
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            Nem blokkol
                        </div>
                    </div>
                    <button
                        onClick={handleStart}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
                    >
                        <Play size={20} fill="currentColor" />
                        Kvíz indítása
                    </button>
                </div>
            </div>
        );
    }



    // Import lazily or just at top? At top is fine. 
    // Need to update imports first. 

    // Results Screen
    if (showResults) {
        const percentage = Math.round((score / data.questions.length) * 100);
        const passed = score >= (data.minScoreToPass ?? Math.ceil(data.questions.length / 2));

        // Identify if this is a summary quiz
        const isSummaryQuiz = data.isSummary || data.id.includes('summary'); // Backward compatibility + new flag

        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-8 text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                        {passed ? <Trophy size={40} /> : <RotateCcw size={40} />}
                    </div>

                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                        {passed ? "Szép munka!" : "Gyakorlás teszi a mestert"}
                    </h2>

                    <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2">
                        {percentage}%
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        {score} / {data.questions.length} helyes válasz
                    </p>

                    {/* Certificate Section for Summary Quizzes */}
                    {isSummaryQuiz && !showCertificate && (
                        <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-2">
                                🎓 Oklevél Igénylése
                            </h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                                Töltsd le a névre szóló, hitelesített oklevelet az eredményedről!
                            </p>

                            {!showCertificateInput ? (
                                <button
                                    onClick={() => setShowCertificateInput(true)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors"
                                >
                                    Oklevél készítése
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3 max-w-xs mx-auto animate-fade-in">
                                    <input
                                        type="text"
                                        placeholder="Teljes név az oklevélhez"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600"
                                    />
                                    <button
                                        onClick={() => {
                                            if (studentName.trim().length > 0) setShowCertificate(true);
                                        }}
                                        disabled={studentName.trim().length === 0}
                                        className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors"
                                    >
                                        Generálás és Letöltés
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Render Certificate Generator when requested */}
                    {showCertificate && (
                        <div className="mb-8">
                            <CertificateGenerator
                                studentName={studentName}
                                courseName={data.chapter || "Matematika Modul"}
                                scorePercentage={percentage}
                                completionDate={new Date().toLocaleDateString('hu-HU')}
                                onDownloadComplete={() => {
                                    // Optional: maybe hide inputs after download?
                                }}
                            />
                            <p className="text-xs text-slate-500 mt-2">Kattints a gombra a letöltéshez!</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {data.questions.map((q, idx) => {
                            const isCorrect = answers[idx] === q.correctAnswer;
                            return (
                                <div key={idx} className={`p-3 rounded-lg text-left text-sm flex items-start gap-3 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                                    }`}>
                                    {isCorrect ?
                                        <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={16} /> :
                                        <XCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                                    }
                                    <div>
                                        <div className="font-medium text-slate-800 dark:text-slate-200">{renderInline(q.question)}</div>
                                        {!isCorrect && <div className="text-slate-500 text-xs mt-1">Helyes: {renderInline(q.correctAnswer as string)}</div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <button
                            onClick={handleStart}
                            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium px-4 py-2"
                        >
                            <RotateCcw size={18} />
                            Újra
                        </button>

                        {passed && (
                            <button
                                onClick={onComplete}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95"
                            >
                                Tovább a következő leckére <ArrowRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Question Screen
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-slate-100 dark:bg-slate-700 w-full">
                <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / data.questions.length) * 100}%` }}
                />
            </div>

            <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {currentQuestionIndex + 1}. Kérdés
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                        {currentQuestionIndex + 1} / {data.questions.length}
                    </span>
                </div>

                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-8 leading-relaxed">
                    {renderInline(currentQuestion.question)}
                </h3>

                {/* Answer Options */}
                <div className="space-y-3 mb-8">
                    {currentQuestion.inputType === 'multiple-choice' && currentQuestion.options?.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswerSelect(option)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQuestionIndex] === option
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/60 dark:border-indigo-500'
                                : 'border-slate-100 dark:border-slate-600 bg-white dark:bg-slate-700/50 hover:border-indigo-200 dark:hover:border-slate-500'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[currentQuestionIndex] === option
                                    ? 'border-indigo-600 bg-indigo-600'
                                    : 'border-slate-300 bg-white'
                                    }`}>
                                    {answers[currentQuestionIndex] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="text-slate-700 dark:text-slate-200 font-medium">
                                    {renderInline(option)}
                                </span>
                            </div>
                        </button>
                    ))}

                    {currentQuestion.inputType === 'numeric' && (
                        <div className="flex items-center gap-3">
                            {currentQuestion.inputPrefix && (
                                <span className="text-slate-600 dark:text-slate-400 font-medium">
                                    {renderInline(currentQuestion.inputPrefix)}
                                </span>
                            )}
                            <input
                                type="text"
                                inputMode="numeric"
                                value={(answers[currentQuestionIndex] as string) || ''}
                                onChange={(e) => handleAnswerSelect(e.target.value)}
                                placeholder="Írd be a választ..."
                                className="flex-1 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all"
                            />
                        </div>
                    )}

                    {currentQuestion.inputType === 'matching' && shuffledPairsMap[currentQuestionIndex] && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                {shuffledPairsMap[currentQuestionIndex].map((pair, idx) => {
                                    const currentSlots = (answers[currentQuestionIndex] as (string | null)[]) || [];
                                    const filledItem = currentSlots[idx];

                                    return (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <div className="sm:w-1/3 text-lg font-medium pl-2 text-slate-800 dark:text-slate-200">
                                                {renderInline(pair.left)}
                                            </div>
                                            <div className="flex-1">
                                                <button
                                                    onClick={() => handleMatchingSlotClick(idx)}
                                                    className={`w-full p-3 rounded-lg border-2 border-dashed transition-all flex items-center justify-center sm:justify-between min-h-[3.5rem]
                                                        ${filledItem
                                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold border-solid'
                                                            : selectedPoolItem
                                                                ? 'border-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 hover:border-slate-400 dark:hover:border-slate-500'
                                                        }`}
                                                >
                                                    <span className={filledItem ? '' : 'text-slate-400 dark:text-slate-500'}>
                                                        {filledItem
                                                            ? renderInline(filledItem)
                                                            : (selectedPoolItem ? "Kattints a beillesztéshez" : "Válassz alulról...")}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pool Area */}
                            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Választható elemek:</p>
                                <div className="flex flex-wrap gap-3">
                                    {matchingPoolMap[currentQuestionIndex]?.filter(item => {
                                        const currentSlots = (answers[currentQuestionIndex] as (string | null)[]) || [];
                                        return !currentSlots.includes(item);
                                    }).map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handlePoolItemClick(item)}
                                            className={`px-4 py-3 rounded-lg border-2 text-sm md:text-base font-medium transition-all transform active:scale-95
                                                ${selectedPoolItem === item
                                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg scale-105'
                                                    : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-200'
                                                }`}
                                        >
                                            {renderInline(item)}
                                        </button>
                                    ))}
                                    {matchingPoolMap[currentQuestionIndex]?.filter(item => {
                                        const currentSlots = (answers[currentQuestionIndex] as (string | null)[]) || [];
                                        return !currentSlots.includes(item);
                                    }).length === 0 && (
                                            <span className="text-slate-400 italic text-sm">Minden elemet felhasználtál.</span>
                                        )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={currentQuestion.inputType === 'matching' ? !isMatchingComplete() : !answers[currentQuestionIndex]}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${(currentQuestion.inputType === 'matching' ? isMatchingComplete() : answers[currentQuestionIndex])
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transform hover:translate-y-[-1px]'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {currentQuestionIndex === data.questions.length - 1 ? 'Befejezés' : 'Következő'}
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizBlock;
