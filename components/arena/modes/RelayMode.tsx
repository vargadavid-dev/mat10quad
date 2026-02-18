import React, { useState } from 'react';
import QuestionBlock from '../../QuestionBlock';
import { Timer } from 'lucide-react';

interface RelayModeProps {
    question: any;
    onResult: (score: number) => void;
}

const RelayMode: React.FC<RelayModeProps> = ({ question, onResult }) => {
    // We add a key to QuestionBlock to force reset if question changes

    const handleComplete = () => {
        // Correct answer!
        // Show success briefly then notify
        setTimeout(() => {
            onResult(1);
        }, 1000);
    };

    const handleFail = () => {
        // Wrong answer -> 0 points, pass turn immediately
        onResult(0);
    };

    return (
        <div className="max-w-3xl mx-auto w-full animate-in slide-in-from-right duration-500">
            <div className="bg-orange-500 text-white p-4 rounded-xl mb-6 shadow-lg flex items-center justify-between">
                <div className="font-bold text-xl flex items-center gap-2">
                    <Timer className="animate-pulse" />
                    TE JÖSSZ!
                </div>
                <div className="text-sm opacity-90">Oldd meg a feladatot minél gyorsabban!</div>
            </div>

            <QuestionBlock
                key={question.id}
                data={question}
                isCompleted={false}
                onComplete={handleComplete}
                onMistake={handleFail}
            />
        </div>
    );
};

export default RelayMode;
