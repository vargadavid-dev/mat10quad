import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import Latex from './Latex';

const steps = [
    {
        id: 'start',
        text: 'Így szorozzuk össze a tagokat:',
        mathLabel: null,
        lines: [],
        math: '(a + b) \\cdot (a + b)',
        activeSource: null,
        activeTarget: null
    },
    {
        id: 'step1',
        text: '1. Az első tagot szorozzuk az első taggal:',
        mathLabel: 'a \\cdot a = a^2',
        lines: [{ start: 'a1', end: 'a2', color: 'text-blue-500' }],
        math: 'a^2',
        activeSource: 'a1',
        activeTarget: 'a2',
        colorClass: 'text-blue-500',
        bgColorClass: 'bg-blue-100 dark:bg-blue-900/40'
    },
    {
        id: 'step2',
        text: '2. Az első tagot szorozzuk a második taggal:',
        mathLabel: 'a \\cdot b = ab',
        lines: [
            { start: 'a1', end: 'a2', color: 'text-slate-300 dark:text-slate-600' },
            { start: 'a1', end: 'b2', color: 'text-indigo-500' }
        ],
        math: 'a^2 + ab',
        activeSource: 'a1',
        activeTarget: 'b2',
        colorClass: 'text-indigo-500',
        bgColorClass: 'bg-indigo-100 dark:bg-indigo-900/40'
    },
    {
        id: 'step3',
        text: '3. A második tagot szorozzuk az első taggal:',
        mathLabel: 'b \\cdot a = ba = ab',
        lines: [
            { start: 'a1', end: 'a2', color: 'text-slate-300 dark:text-slate-600' },
            { start: 'a1', end: 'b2', color: 'text-slate-300 dark:text-slate-600' },
            { start: 'b1', end: 'a2', color: 'text-amber-500' }
        ],
        math: 'a^2 + ab + ab',
        activeSource: 'b1',
        activeTarget: 'a2',
        colorClass: 'text-amber-500',
        bgColorClass: 'bg-amber-100 dark:bg-amber-900/40'
    },
    {
        id: 'step4',
        text: '4. A második tagot szorozzuk a második taggal:',
        mathLabel: 'b \\cdot b = b^2',
        lines: [
            { start: 'a1', end: 'a2', color: 'text-slate-300 dark:text-slate-600' },
            { start: 'a1', end: 'b2', color: 'text-slate-300 dark:text-slate-600' },
            { start: 'b1', end: 'a2', color: 'text-slate-300 dark:text-slate-600' },
            { start: 'b1', end: 'b2', color: 'text-emerald-500' }
        ],
        math: 'a^2 + ab + ab + b^2',
        activeSource: 'b1',
        activeTarget: 'b2',
        colorClass: 'text-emerald-500',
        bgColorClass: 'bg-emerald-100 dark:bg-emerald-900/40'
    },
    {
        id: 'final',
        text: '5. Végül vonjuk össze az egynemű tagokat:',
        mathLabel: 'ab + ab = 2ab',
        lines: [
            { start: 'a1', end: 'a2', color: 'text-slate-300 dark:text-slate-600' },
            { start: 'a1', end: 'b2', color: 'text-slate-300 dark:text-slate-600' },
            { start: 'b1', end: 'a2', color: 'text-slate-300 dark:text-slate-600' },
            { start: 'b1', end: 'b2', color: 'text-slate-300 dark:text-slate-600' }
        ],
        math: 'a^2 + 2ab + b^2',
        activeSource: null,
        activeTarget: null,
        colorClass: 'text-green-600 dark:text-green-400',
        bgColorClass: 'bg-green-100 dark:bg-green-900/40'
    }
];

export const PolynomialMultiplication: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 2500); // 2.5s per step
        } else if (currentStep === steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep]);

    const step = steps[currentStep];

    const getArrowPath = (start: string, end: string) => {
        // Approximate SVG coordinates for the arrows relative to the container
        // These are hardcoded based on the layout of "(a + b) * (a + b)"
        const positions = {
            a1: { x: 82, yTop: 30, yBot: 50 },
            b1: { x: 142, yTop: 30, yBot: 50 },
            a2: { x: 218, yTop: 28, yBot: 52 },
            b2: { x: 278, yTop: 28, yBot: 52 }
        };

        const s = positions[start as keyof typeof positions];
        const e = positions[end as keyof typeof positions];

        if (!s || !e) return '';

        // Top arrows for a1 -> a2 and a1 -> b2
        if (start === 'a1') {
            const controlY = s.yTop - (e.x - s.x) * 0.15 - 15;
            return `M ${s.x} ${s.yTop} Q ${(s.x + e.x) / 2} ${controlY} ${e.x} ${e.yTop}`;
        }
        // Bottom arrows for b1 -> a2 and b1 -> b2
        else {
            const controlY = s.yBot + (e.x - s.x) * 0.15 + 15;
            return `M ${s.x} ${s.yBot} Q ${(s.x + e.x) / 2} ${controlY} ${e.x} ${e.yBot}`;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 my-4 max-w-2xl mx-auto font-sans overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">Így szorozzuk össze a tagokat</h3>

            {/* Interactive Equation Area */}
            <div className="relative h-32 flex items-center justify-center text-2xl md:text-3xl font-serif text-slate-700 dark:text-slate-200 mb-4 select-none">

                {/* SVG for Arrows */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 -30 360 140" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <marker id="arrowhead-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <polygon points="0 0, 6 3, 0 6" className="fill-blue-500" />
                        </marker>
                        <marker id="arrowhead-indigo" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <polygon points="0 0, 6 3, 0 6" className="fill-indigo-500" />
                        </marker>
                        <marker id="arrowhead-amber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <polygon points="0 0, 6 3, 0 6" className="fill-amber-500" />
                        </marker>
                        <marker id="arrowhead-emerald" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <polygon points="0 0, 6 3, 0 6" className="fill-emerald-500" />
                        </marker>
                        <marker id="arrowhead-slate" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <polygon points="0 0, 6 3, 0 6" className="fill-slate-300 dark:fill-slate-600" />
                        </marker>
                    </defs>

                    {step.lines.map((line, idx) => {
                        const isCurrent = idx === step.lines.length - 1 && currentStep > 0 && currentStep < 5;
                        const colorMap: Record<string, string> = {
                            'text-blue-500': 'stroke-blue-500',
                            'text-indigo-500': 'stroke-indigo-500',
                            'text-amber-500': 'stroke-amber-500',
                            'text-emerald-500': 'stroke-emerald-500',
                            'text-slate-300 dark:text-slate-600': 'stroke-slate-300 dark:stroke-slate-600'
                        };

                        const markerMap: Record<string, string> = {
                            'text-blue-500': 'url(#arrowhead-blue)',
                            'text-indigo-500': 'url(#arrowhead-indigo)',
                            'text-amber-500': 'url(#arrowhead-amber)',
                            'text-emerald-500': 'url(#arrowhead-emerald)',
                            'text-slate-300 dark:text-slate-600': 'url(#arrowhead-slate)'
                        };

                        return (
                            <path
                                key={idx}
                                d={getArrowPath(line.start, line.end)}
                                fill="none"
                                strokeWidth={isCurrent ? "3" : "2"}
                                className={`${colorMap[line.color]} transition-all duration-500 ease-in-out ${isCurrent ? 'opacity-100' : 'opacity-60'}`}
                                markerEnd={markerMap[line.color]}
                                strokeDasharray={isCurrent ? "100" : "none"}
                                strokeDashoffset={isCurrent ? "0" : "none"}
                            >
                                {isCurrent && (
                                    <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.8s" fill="freeze" />
                                )}
                            </path>
                        );
                    })}
                </svg>

                {/* Equation Text Overlay */}
                <div className="flex items-center gap-1 z-10 w-[360px] justify-center">
                    <span>(</span>
                    <span className={`transition-colors duration-300 px-1 rounded ${step.activeSource === 'a1' ? step.bgColorClass + ' ' + step.colorClass + ' font-bold' : ''}`}>a</span>
                    <span className="text-xl px-1">+</span>
                    <span className={`transition-colors duration-300 px-1 rounded ${step.activeSource === 'b1' ? step.bgColorClass + ' ' + step.colorClass + ' font-bold' : ''}`}>b</span>
                    <span>)</span>
                    <span className="text-xl px-2">&middot;</span>
                    <span>(</span>
                    <span className={`transition-colors duration-300 px-1 rounded ${step.activeTarget === 'a2' ? step.bgColorClass + ' ' + step.colorClass + ' font-bold' : ''}`}>a</span>
                    <span className="text-xl px-1">+</span>
                    <span className={`transition-colors duration-300 px-1 rounded ${step.activeTarget === 'b2' ? step.bgColorClass + ' ' + step.colorClass + ' font-bold' : ''}`}>b</span>
                    <span>)</span>
                </div>
            </div>

            {/* Step Description & Result */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 min-h-[100px] flex flex-col justify-center items-center text-center transition-all duration-300 relative border border-slate-100 dark:border-slate-700/50">
                <p className="text-base text-slate-600 dark:text-slate-300 mb-2 flex flex-col items-center gap-1">
                    <span>{step.text}</span>
                    {step.mathLabel && (
                        <span className={`font-medium ${step.colorClass || ''}`}>
                            <Latex>{step.mathLabel}</Latex>
                        </span>
                    )}
                </p>
                <div className={`text-xl font-bold transition-colors duration-300 ${step.colorClass || 'text-slate-800 dark:text-slate-100'}`}>
                    <Latex>{step.math}</Latex>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-between">
                <button
                    onClick={() => {
                        setCurrentStep(0);
                        setIsPlaying(false);
                    }}
                    disabled={currentStep === 0}
                    className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Vissza az elejére"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                    {steps.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setCurrentStep(idx);
                                setIsPlaying(false);
                            }}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStep === idx
                                ? 'bg-indigo-600 scale-125'
                                : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'}`}
                            title={`Lépés ${idx + 1}`}
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    {!isPlaying && currentStep > 0 && (
                        <button
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                            title="Előző lépés"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${isPlaying
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
                    >
                        {isPlaying ? 'Szünet' : currentStep === steps.length - 1 ? 'Újra' : <><Play className="w-4 h-4" /> Lejátszás</>}
                    </button>
                    {!isPlaying && currentStep < steps.length - 1 && (
                        <button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                            title="Következő lépés"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
