import React, { useState } from 'react';
import { PieChart, Circle, Crop, Disc } from 'lucide-react';

const CirclePartsVisualizer: React.FC = () => {
    // State for interactive parameters
    const [sectorAngle, setSectorAngle] = useState(60);
    const [segmentAngle, setSegmentAngle] = useState(90);
    const [annulusRadius, setAnnulusRadius] = useState(50); // percentage of outer radius

    // Constants for SVG
    const size = 200;
    const center = size / 2;
    const radius = 80;

    // Helper for polar to cartesian
    const getPoint = (angleInDegrees: number, r: number = radius) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: center + (r * Math.cos(angleInRadians)),
            y: center + (r * Math.sin(angleInRadians))
        };
    };

    // Sector Path
    const sectorEnd = getPoint(sectorAngle);
    const sectorLargeArc = sectorAngle > 180 ? 1 : 0;
    const sectorPath = `M ${center} ${center} L ${center} ${center - radius} A ${radius} ${radius} 0 ${sectorLargeArc} 1 ${sectorEnd.x} ${sectorEnd.y} Z`;

    // Segment Path (Chord based)
    const segmentStart = getPoint(-segmentAngle / 2);
    const segmentEnd = getPoint(segmentAngle / 2);
    const segmentLargeArc = segmentAngle > 180 ? 1 : 0;
    const segmentPath = `M ${segmentStart.x} ${segmentStart.y} A ${radius} ${radius} 0 ${segmentLargeArc} 1 ${segmentEnd.x} ${segmentEnd.y} Z`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
            {/* Card 1: Körcikk (Sector) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-orange-50 dark:bg-orange-900/10 flex justify-between items-center">
                    <span className="font-bold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                        <PieChart size={20} /> Körcikk
                    </span>
                    <span className="text-xl">🍕</span>
                </div>
                <div className="p-6 flex-1 flex flex-col items-center">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mb-4">
                        {/* Base Circle Outline */}
                        <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="2" />
                        {/* Sector */}
                        <path d={sectorPath} fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" strokeWidth="2" />
                        {/* Radii labels */}
                        <line x1={center} y1={center} x2={center} y2={center - radius} stroke="#f97316" strokeWidth="2" />
                        <line x1={center} y1={center} x2={sectorEnd.x} y2={sectorEnd.y} stroke="#f97316" strokeWidth="2" />
                        <circle cx={center} cy={center} r={3} fill="#334155" />
                        <text x={center + 10} y={center + 15} fontSize="12" fill="#334155" fontWeight="bold">O</text>
                    </svg>
                    <div className="text-center mb-4 min-h-[60px]">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Olyan síkidom, melyet két <strong className="text-orange-600 dark:text-orange-400">sugár</strong> és egy <strong className="text-orange-600 dark:text-orange-400">körív</strong> határol.
                        </p>
                        {sectorAngle === 180 && (
                            <p className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 py-1 px-2 rounded-full inline-block animate-pulse">
                                Ez egy FÉLKÖR! (Speciális körcikk)
                            </p>
                        )}
                    </div>
                    <div className="w-full mt-auto">
                        <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Nyílásszög: {sectorAngle}°</label>
                        <input
                            type="range"
                            min="10"
                            max="350"
                            step="10"
                            value={sectorAngle}
                            onChange={(e) => setSectorAngle(parseInt(e.target.value))}
                            className="w-full accent-orange-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Card 2: Körszelet (Segment) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/10 flex justify-between items-center">
                    <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        {/* Custom Circular Segment Icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M 4 12 A 10 10 0 0 1 20 12" /> {/* Arc */}
                            <path d="M 4 12 L 20 12" />             {/* Chord */}
                        </svg>
                        Körszelet
                    </span>
                    <span className="text-xl">🍪</span>
                </div>
                <div className="p-6 flex-1 flex flex-col items-center">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mb-4">
                        {/* Base Circle Outline */}
                        <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="2" />
                        {/* Segment */}
                        <path d={segmentPath} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
                        {/* Chord */}
                        <line x1={segmentStart.x} y1={segmentStart.y} x2={segmentEnd.x} y2={segmentEnd.y} stroke="#10b981" strokeWidth="3" />
                        <circle cx={center} cy={center} r={3} fill="#334155" />
                        <text x={center} y={center + 20} fontSize="12" fill="#334155" fontWeight="bold" textAnchor="middle">O</text>
                    </svg>
                    <div className="text-center mb-4 min-h-[60px]">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Egy <strong className="text-green-600 dark:text-green-400">húr</strong> és a tartozó <strong className="text-blue-600 dark:text-blue-400">körív</strong> határolja.
                        </p>
                        {segmentAngle === 180 && (
                            <p className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 py-1 px-2 rounded-full inline-block animate-pulse">
                                Ez egy FÉLKÖR! (Speciális körszelet)
                            </p>
                        )}
                    </div>
                    <div className="w-full mt-auto">
                        <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Ív mérete: {segmentAngle}°</label>
                        <input
                            type="range"
                            min="20"
                            max="340"
                            step="10"
                            value={segmentAngle}
                            onChange={(e) => setSegmentAngle(parseInt(e.target.value))}
                            className="w-full accent-blue-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Card 3: Körgyűrű (Annulus) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-purple-50 dark:bg-purple-900/10 flex justify-between items-center">
                    <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                        <Disc size={20} /> Körgyűrű
                    </span>
                    <span className="text-xl">🍩</span>
                </div>
                <div className="p-6 flex-1 flex flex-col items-center">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mb-4">
                        {/* Outer Circle (filled with color) */}
                        <circle cx={center} cy={center} r={radius} fill="rgba(139, 92, 246, 0.2)" stroke="#8b5cf6" strokeWidth="2" />
                        {/* Inner Circle (hole) */}
                        <circle cx={center} cy={center} r={radius * (annulusRadius / 100)} fill="white" className="dark:fill-slate-800" stroke="#8b5cf6" strokeWidth="2" />

                        <circle cx={center} cy={center} r={3} fill="#334155" />
                        <text x={center - 10} y={center + 5} fontSize="12" fill="#334155" fontWeight="bold">O</text>

                        {/* Dashed radii */}
                        <line x1={center} y1={center} x2={center + radius} y2={center} stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4" />
                        <text x={center + radius / 2} y={center - 5} fontSize="10" fill="#8b5cf6" fontWeight="bold">R</text>

                    </svg>
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4 min-h-[40px]">
                        Két <strong className="text-purple-600 dark:text-purple-400">koncentrikus</strong> kör közötti terület.
                    </p>
                    <div className="w-full mt-auto">
                        <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Belső sugár: {annulusRadius}%</label>
                        <input
                            type="range"
                            min="10"
                            max="90"
                            value={annulusRadius}
                            onChange={(e) => setAnnulusRadius(parseInt(e.target.value))}
                            className="w-full accent-purple-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CirclePartsVisualizer;
