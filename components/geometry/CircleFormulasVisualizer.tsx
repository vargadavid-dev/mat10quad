import React, { useState } from 'react';

const CircleFormulasVisualizer: React.FC = () => {
    const [r, setR] = useState(5);
    const PI = 3.14;

    // Calculate values
    const d = 2 * r;
    const K = 2 * PI * r;
    const T = r * r * PI;

    // Radius range
    const minR = 1;
    const maxR = 10;

    // SVG Layout
    const size = 260; // Slightly smaller to fit better
    const center = size / 2;
    // Scale visuals so max radius (10) fits in the view with some padding
    const scale = 11;
    const visualRadius = r * scale;

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 max-w-3xl mx-auto my-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
                Interaktív Körszámítás
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Left Column: Visual & Controls */}
                <div className="flex flex-col gap-4 h-full">
                    {/* Visual Container - Square-ish */}
                    <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-center p-4 relative overflow-hidden">
                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                                backgroundPosition: 'center center'
                            }}>
                        </div>
                        {/* Subtle Axis Lines */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                            <div className="w-full h-px bg-slate-400 border-t border-dashed border-slate-400"></div>
                            <div className="h-full w-px bg-slate-400 border-l border-dashed border-slate-400 absolute"></div>
                        </div>

                        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10">
                            {/* The Circle */}
                            <circle
                                cx={center}
                                cy={center}
                                r={visualRadius}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="4"
                                className="transition-all duration-300 ease-out"
                            />

                            {/* Radius Line */}
                            <line
                                x1={center}
                                y1={center}
                                x2={center + visualRadius}
                                y2={center}
                                stroke="#f97316"
                                strokeWidth="3"
                                className="transition-all duration-300 ease-out"
                            />

                            {/* Center Point */}
                            <circle cx={center} cy={center} r="4" fill="#64748b" />
                            <text x={center - 15} y={center + 15} className="fill-slate-500 text-xs font-bold">O</text>

                            {/* Radius Label */}
                            <text
                                x={center + visualRadius / 2}
                                y={center - 12}
                                textAnchor="middle"
                                className="fill-orange-500 font-bold text-sm"
                            >
                                r = {r}
                            </text>
                        </svg>
                    </div>

                    {/* Controls - Compact */}
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between mb-2 items-center">
                            <label className="text-sm font-bold text-slate-200">Sugár (r)</label>
                            <span className="text-sm font-mono font-bold text-blue-400">{r} cm</span>
                        </div>
                        <div className="relative h-6 flex items-center">
                            <input
                                type="range"
                                min={minR}
                                max={maxR}
                                step="1"
                                value={r}
                                onChange={(e) => setR(Number(e.target.value))}
                                className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 px-1 mt-1">
                            <span>{minR} cm</span>
                            <span>{maxR} cm</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Calculations */}
                <div className="flex flex-col gap-4 h-full">
                    {/* Circumference - Blue Card */}
                    <div className="flex-1 bg-blue-900/20 rounded-2xl p-6 border border-blue-800/50 flex flex-col justify-center relative overflow-hidden group hover:border-blue-700/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4 z-10">
                            <div className="p-2 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
                            </div>
                            <h4 className="font-bold text-white text-lg">Kerület (K)</h4>
                        </div>

                        <div className="font-mono space-y-3 z-10">
                            <div className="text-blue-300/70 text-sm">K = 2 · π · r</div>
                            <div className="text-blue-200 text-lg">
                                K = 2 · 3,14 · <span className="font-bold text-orange-400">{r}</span>
                            </div>
                            <div className="w-full h-px bg-blue-800/50 my-2"></div>
                            <div className="text-2xl font-bold text-white">
                                K ≈ {K.toFixed(2).replace('.', ',')} cm
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    </div>

                    {/* Area - Emerald Card */}
                    <div className="flex-1 bg-emerald-900/20 rounded-2xl p-6 border border-emerald-800/50 flex flex-col justify-center relative overflow-hidden group hover:border-emerald-700/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4 z-10">
                            <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                            </div>
                            <h4 className="font-bold text-white text-lg">Terület (T)</h4>
                        </div>

                        <div className="font-mono space-y-3 z-10">
                            <div className="text-emerald-300/70 text-sm">T = r² · π</div>
                            <div className="text-emerald-200 text-lg">
                                T = <span className="font-bold text-orange-400">{r}</span>² · 3,14 = <span className="font-bold">{r * r}</span> · 3,14
                            </div>
                            <div className="w-full h-px bg-emerald-800/50 my-2"></div>
                            <div className="text-2xl font-bold text-white">
                                T ≈ {T.toFixed(2).replace('.', ',')} cm²
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-slate-500 mt-6 italic">
                (A számításokban π ≈ 3,14 értékkel számoltunk.)
            </p>
        </div>
    );
};

export default CircleFormulasVisualizer;
