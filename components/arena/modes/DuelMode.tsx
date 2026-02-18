import React, { useState, useEffect } from 'react';
import QuestionBlock from '../../QuestionBlock';
import { Trophy, Timer, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DuelModeProps {
    questions: any[];
    onFinish: (score: number) => void;
}

const DuelMode: React.FC<DuelModeProps> = ({ questions, onFinish }) => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [combo, setCombo] = useState(0);

    // To force re-mount of QuestionBlock when question changes
    const currentQuestion = questions[currentQIndex];

    const handleQuestionComplete = () => {
        // Calculate points based on speed? For now just +100
        const points = 100 + (combo * 10);
        setScore(prev => prev + points);
        setCorrectCount(prev => prev + 1);
        setCombo(prev => prev + 1);

        // Wait a bit then next question
        setTimeout(() => {
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            } else {
                finishGame();
            }
        }, 1500); // 1.5s delay to see success animation
    };

    const finishGame = () => {
        setIsFinished(true);
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
        // Notify parent after a delay or immediately
        // onFinish(score); 
    };

    if (isFinished) {
        return (
            <div className="max-w-xl mx-auto text-center py-20 animate-in zoom-in-95">
                <div className="mb-8 relative inline-block">
                    <Trophy size={120} className="text-yellow-400 drop-shadow-lg animate-bounce" />
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg border-2 border-white">
                        {score > 0 ? 'S' : 'F'}
                    </div>
                </div>

                <h2 className="text-4xl font-extrabold text-white mb-4">Játék Vége!</h2>
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/10 mb-8">
                    <p className="text-slate-400 text-lg uppercase tracking-widest mb-2">Végső Pontszám</p>
                    <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        {score}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400 text-sm">Helyes válaszok</div>
                        <div className="text-2xl font-bold text-green-400">{correctCount} / {questions.length}</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400 text-sm">Max Combo</div>
                        <div className="text-2xl font-bold text-purple-400">{combo}x</div>
                    </div>
                </div>

                <button
                    onClick={() => onFinish(score)}
                    className="bg-white text-indigo-900 font-bold py-4 px-12 rounded-xl hover:bg-indigo-50 transition-colors shadow-xl"
                >
                    Vissza a Lobbyba
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full">
            {/* HUD */}
            <div className="flex items-center justify-between mb-6 bg-slate-800/80 backdrop-blur p-4 rounded-2xl border border-white/5 shadow-lg sticky top-20 z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-lg font-bold">
                        {currentQIndex + 1} / {questions.length}
                    </div>
                    <div className="text-slate-400 text-sm hidden sm:block">
                        Combo: <span className="text-purple-400 font-bold">{combo}x</span>
                    </div>
                </div>

                <div className="text-2xl font-black text-white font-mono tracking-wider">
                    {score}
                </div>
            </div>

            {/* Question Area */}
            <div className="animate-in slide-in-from-bottom-10 duration-500 key={currentQIndex}">
                {/* We use key to force re-animation and re-mount for clean state */}
                <QuestionBlock
                    key={currentQuestion.id}
                    data={currentQuestion}
                    isCompleted={false}
                    onComplete={handleQuestionComplete}
                />
            </div>
        </div>
    );
};

export default DuelMode;
