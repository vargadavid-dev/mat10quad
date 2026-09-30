import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw, Play } from 'lucide-react';


const ViewingAngleConstruction = () => {
    const [step, setStep] = useState(0);
    const [angle, setAngle] = useState(60); // degrees

    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Geometry calculations
    const A = { x: centerX - 100, y: centerY + 50 };
    const B = { x: centerX + 100, y: centerY + 50 };

    // Convert angle to radians
    const alphaRad = (angle * Math.PI) / 180;

    // Step 1: Ray making angle alpha with AB
    // Vector AB = (200, 0) -> angle 0
    // We want a ray from A at angle -alpha (upwards) relative to AB
    const rayLength = 300;
    const rayEnd = {
        x: A.x + rayLength * Math.cos(-alphaRad),
        y: A.y + rayLength * Math.sin(-alphaRad)
    };

    // Step 2: Perpendicular to ray at A
    // Angle is -alpha - 90 degrees
    const perpAngle = -alphaRad - Math.PI / 2;
    const perpEnd = {
        x: A.x + rayLength * Math.cos(perpAngle),
        y: A.y + rayLength * Math.sin(perpAngle)
    };

    // Step 3: Perpendicular bisector of AB
    // Midpoint of AB
    const M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
    // Perpendicular bisector is vertical in this case since AB is horizontal
    const bisectorTop = { x: M.x, y: 0 };
    const bisectorBottom = { x: M.x, y: height };

    // Step 4: Center O calculation
    // Intersection of line(A, perpEnd) and x = M.x
    // Line eq: y - A.y = m(x - A.x) => m = tan(perpAngle)
    // y = m(x - A.x) + A.y -> set x = M.x
    const m = Math.tan(perpAngle);
    const O = {
        x: M.x,
        y: m * (M.x - A.x) + A.y
    };

    const radius = Math.sqrt(Math.pow(O.x - A.x, 2) + Math.pow(O.y - A.y, 2));

    // Calculate start and end angles for the arc
    // atan2(y, x)
    const angleOA = Math.atan2(A.y - O.y, A.x - O.x);
    const angleOB = Math.atan2(B.y - O.y, B.x - O.x);

    // SVG Arc path
    // A to B 
    // Large arc flag depends on whether the center is below or above AB, which depends on alpha
    // Actually simpler: For viewer angle arc, we always draw the "major" or "minor" arc based on alpha?
    // No, the viewing angle arc is the one that contains points P such that APB = alpha.
    // By convention in construction, O is establishing the center.
    // If alpha < 90, O is on the same side as the arc -> Major arc? No.

    // Let's rely on geometric primitives.
    // If we draw circle (O, r), the arc we want is the one "above" AB.
    // SVG path A -> B.
    // Sweep flag: 1 (clockwise) creates the arc "below" AB if O is above?
    // Let's visualize O to check.

    // Drawing the Full Circle or Arc
    // For alpha < 90, O is "above" AB (y is smaller). Arc is the larger one? 
    // Wait, simple geometry:
    // If alpha = 60, triangle AOB is equilateral? No.
    // Angle AOB = 2*alpha at center.

    const steps = [
        {
            title: "1. Szakasz és Szög felvétele",
            description: "Adott az AB szakasz és az α szög.",
        },
        {
            title: "2. Szög felmérése",
            description: "Az A pontba felmérjük az α szöget az AB szakaszhoz képest.",
        },
        {
            title: "3. Merőleges állítása",
            description: "Az A pontban merőlegest állítunk a felmért szögszárra.",
        },
        {
            title: "4. Szakaszfelező merőleges",
            description: "Megszerkesztjük az AB szakasz felezőmerőlegesét.",
        },
        {
            title: "5. A Kör Középpontja",
            description: "A merőleges és a szakaszfelező metszéspontja kijelöli a kör O középpontját.",
        },
        {
            title: "6. Látószögkörív megrajzolása",
            description: "Megrajzoljuk a kört (vagy ívet) O középponttal és OA sugárral. Ennek az ívnek minden pontjából α szög alatt látszik az AB szakasz.",
        },
        {
            title: "7. Teljes megoldás",
            description: "A megoldás két szimmetrikus ívből áll (tükrözés az AB egyenesre).",
        }
    ];

    const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));
    const [selectedCase, setSelectedCase] = useState<'acute' | 'right' | 'obtuse'>('acute');

    // Update angle limits based on case
    const getAngleLimits = () => {
        switch (selectedCase) {
            case 'acute': return { min: 30, max: 89, default: 60 };
            case 'right': return { min: 90, max: 90, default: 90 };
            case 'obtuse': return { min: 91, max: 150, default: 120 };
        }
    };

    const limits = getAngleLimits();

    // Handle case change
    const handleCaseChange = (newCase: 'acute' | 'right' | 'obtuse') => {
        setSelectedCase(newCase);
        const newLimits = newCase === 'acute' ? { min: 30, max: 89, default: 60 } :
            newCase === 'right' ? { min: 90, max: 90, default: 90 } :
                { min: 91, max: 150, default: 120 };
        setAngle(newLimits.default);
        setStep(0); // Reset steps on case change to avoid confusion
    };

    const [zoom, setZoom] = useState(1);

    // Calculate dynamic viewBox based on zoom
    const viewBoxWidth = width / zoom;
    const viewBoxHeight = height / zoom;
    const viewBoxX = (width - viewBoxWidth) / 2;
    const viewBoxY = (height - viewBoxHeight) / 2;

    return (
        <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    Látószögkörív Szerkesztése
                </h3>

                {/* Case Selector */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => handleCaseChange('acute')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${selectedCase === 'acute'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Hegyes (α &lt; 90°)
                    </button>
                    <button
                        onClick={() => handleCaseChange('right')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${selectedCase === 'right'
                            ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Derék (α = 90°)
                    </button>
                    <button
                        onClick={() => handleCaseChange('obtuse')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${selectedCase === 'obtuse'
                            ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Tompa (α &gt; 90°)
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={prevStep} disabled={step === 0}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-mono w-16 text-center">
                        {step + 1} / {steps.length}
                    </span>
                    <button
                        onClick={nextStep} disabled={step === steps.length - 1}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                    <button
                        onClick={() => setStep(0)}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-500 hover:text-blue-500 transition-colors ml-2 border-l border-slate-200 dark:border-slate-700"
                        title="Újrakezdés"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Controls Row: Angle & Zoom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Angle Slider */}
                <div className={`px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg transition-opacity ${selectedCase === 'right' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Látószög (α):</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{angle}°</span>
                    </div>
                    <input
                        type="range"
                        min={limits.min}
                        max={limits.max}
                        step="1"
                        value={angle}
                        onChange={(e) => setAngle(Number(e.target.value))}
                        disabled={selectedCase === 'right'}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                    />
                </div>

                {/* Zoom Slider */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Nagyítás:</span>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-purple-600"
                    />
                </div>
            </div>

            {/* Drawing Area + Description Stacked */}
            <div className="flex flex-col gap-6">
                {/* SVG Container */}
                <div className="w-full relative aspect-[3/2] bg-slate-50 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
                    <svg
                        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
                        className="w-full h-full select-none touch-none"
                    >
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                            </marker>
                        </defs>

                        {/* Step 0: Fixed Elements (AB Segment) */}
                        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#1e293b" strokeWidth="3" className="dark:stroke-slate-200" />
                        <circle cx={A.x} cy={A.y} r="4" fill="#1e293b" className="dark:fill-slate-200" />
                        <text x={A.x - 20} y={A.y + 10} className="fill-slate-700 dark:fill-slate-300 font-bold">A</text>
                        <circle cx={B.x} cy={B.y} r="4" fill="#1e293b" className="dark:fill-slate-200" />
                        <text x={B.x + 10} y={B.y + 10} className="fill-slate-700 dark:fill-slate-300 font-bold">B</text>

                        {/* Step 1: Ray at angle alpha */}
                        {step >= 1 && (
                            <g className="transition-opacity duration-500">
                                {/* Extended ray, no arrow */}
                                <line
                                    x1={A.x} y1={A.y}
                                    x2={A.x + 800 * Math.cos(-alphaRad)}
                                    y2={A.y + 800 * Math.sin(-alphaRad)}
                                    stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5"
                                />
                                {/* Angle arc */}
                                <path
                                    d={`M ${A.x + 40} ${A.y} A 40 40 0 0 0 ${A.x + 40 * Math.cos(-alphaRad)} ${A.y + 40 * Math.sin(-alphaRad)}`}
                                    fill="none" stroke="#f59e0b" strokeWidth="2"
                                />
                                <text x={A.x + 50} y={A.y - 15} fill="#f59e0b" fontSize="14">α</text>
                            </g>
                        )}

                        {/* Step 2: Perpendicular to Ray */}
                        {step >= 2 && (
                            <g>
                                {/* Perpendicular line - ensure it goes "inwards" towards the center O */}
                                {/* The perpendicular direction is -alpha - 90 deg. */}
                                {/* Center O is always "below" the ray in this coord system? */}
                                {/* Let's draw it long enough in both directions or specific direction? */}
                                {/* User said "appropriate direction". Usually towards the center O. */}
                                <line
                                    x1={A.x} y1={A.y}
                                    x2={A.x + 600 * Math.cos(perpAngle + Math.PI)}
                                    y2={A.y + 600 * Math.sin(perpAngle + Math.PI)}
                                    stroke="#3b82f6" strokeWidth="2" opacity="0.6"
                                />
                                <text
                                    x={A.x + 100 * Math.cos(perpAngle + Math.PI) + 10}
                                    y={A.y + 100 * Math.sin(perpAngle + Math.PI)}
                                    fill="#3b82f6" fontSize="12"
                                >
                                    e (merőleges)
                                </text>
                            </g>
                        )}

                        {/* Step 3: Perpendicular Bisector */}
                        {step >= 3 && (
                            <g>
                                <line
                                    x1={bisectorTop.x} y1={bisectorTop.y} x2={bisectorBottom.x} y2={bisectorBottom.y}
                                    stroke="#ec4899" strokeWidth="2" opacity="0.6" strokeDasharray="4"
                                />
                                <text x={M.x + 5} y={height - 20} fill="#ec4899" fontSize="12">f (felező)</text>
                            </g>
                        )}

                        {/* Step 4: Center O */}
                        {step >= 4 && (
                            <g>
                                <circle cx={O.x} cy={O.y} r="5" fill="#ef4444" />
                                <text x={O.x + 10} y={O.y} fill="#ef4444" fontWeight="bold">O</text>

                                {/* Radius OA ghost line */}
                                <line x1={O.x} y1={O.y} x2={A.x} y2={A.y} stroke="#ef4444" strokeWidth="1" strokeDasharray="2" opacity="0.5" />
                            </g>
                        )}

                        {/* Step 5: Arc */}
                        {step >= 5 && (
                            <g>
                                <circle
                                    cx={O.x} cy={O.y} r={radius}
                                    fill="none" stroke="#ef4444" strokeWidth="3"
                                    clipPath={step < 6 ? "url(#clipResult)" : undefined}
                                    opacity={0.3}
                                />

                                {/* Let's draw the MAIN arc specifically */}
                                {/* If angle < 90, arc is Major. If angle > 90, arc is Minor. */}
                                {/* Actually visually, the arc is always "above" AB in our diagram setup? */}
                                {/* Let's construct the path manually to be sure. */}
                                <path
                                    d={`M ${A.x} ${A.y} A ${radius} ${radius} 0 ${angle < 90 ? 1 : 0} 1 ${B.x} ${B.y}`}
                                    fill="none" stroke="#ef4444" strokeWidth="4"
                                />
                            </g>
                        )}

                        {/* Step 6: Symmetric Arc */}
                        {step >= 6 && (
                            <g>
                                <path
                                    d={`M ${A.x} ${A.y} A ${radius} ${radius} 0 ${angle < 90 ? 1 : 0} 0 ${B.x} ${B.y}`}
                                    fill="none" stroke="#ef4444" strokeWidth="4" opacity="0.5"
                                />
                                <circle cx={M.x} cy={A.y + (A.y - O.y)} r="3" fill="#ef4444" opacity="0.5" />
                            </g>
                        )}
                    </svg>
                </div>

                {/* Step Description - Now purely informational below the diagram */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <h4 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2">
                        {steps[step].title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        {steps[step].description}
                    </p>

                    {step === steps.length - 1 && (
                        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm border border-green-200 dark:border-green-800 flex items-center gap-2 font-medium">
                            <span className="text-xl">🎉</span>
                            Kész a szerkesztés! Próbáld változtatni a szöget a fenti csúszkával, vagy használd a nyilakat a lépések visszanézéséhez.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewingAngleConstruction;
