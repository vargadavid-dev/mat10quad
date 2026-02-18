import React, { useState, useRef } from 'react';

const ThalesVisualizer: React.FC = () => {
    const width = 340;
    const height = 340;
    const center = { x: width / 2, y: height / 2 };
    const radius = 120;

    // A and B are fixed at the ends of the diameter (horizontal)
    const pointA = { x: center.x - radius, y: center.y };
    const pointB = { x: center.x + radius, y: center.y };

    // C is draggable on the upper semicircle
    const [angleC, setAngleC] = useState(Math.PI * 0.7); // Start at ~126°

    const [dragging, setDragging] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    // Clamp angle to upper semicircle (0.05π to 0.95π to avoid exact endpoints)
    const clampAngle = (a: number) => {
        let angle = a % (2 * Math.PI);
        if (angle < 0) angle += 2 * Math.PI;
        // Keep in upper semicircle
        if (angle < 0.05 * Math.PI) angle = 0.05 * Math.PI;
        if (angle > 0.95 * Math.PI) angle = 0.95 * Math.PI;
        return angle;
    };

    const pointC = {
        x: center.x + radius * Math.cos(angleC),
        y: center.y - radius * Math.sin(angleC),
    };

    // Calculate angle ACB
    const ca = { x: pointA.x - pointC.x, y: pointA.y - pointC.y };
    const cb = { x: pointB.x - pointC.x, y: pointB.y - pointC.y };
    const dot = ca.x * cb.x + ca.y * cb.y;
    const cross = ca.x * cb.y - ca.y * cb.x;
    const angleCDeg = Math.round(Math.abs(Math.atan2(cross, dot) * (180 / Math.PI)));

    // Right angle marker at C
    const markerSize = 14;
    // Unit vectors from C to A and C to B
    const lenCA = Math.sqrt(ca.x * ca.x + ca.y * ca.y);
    const lenCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
    const uCA = { x: ca.x / lenCA, y: ca.y / lenCA };
    const uCB = { x: cb.x / lenCB, y: cb.y / lenCB };

    const sq1 = { x: pointC.x + uCA.x * markerSize, y: pointC.y + uCA.y * markerSize };
    const sq2 = { x: pointC.x + (uCA.x + uCB.x) * markerSize, y: pointC.y + (uCA.y + uCB.y) * markerSize };
    const sq3 = { x: pointC.x + uCB.x * markerSize, y: pointC.y + uCB.y * markerSize };

    const handlePointerDown = (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging || !svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        const x = (e.clientX - rect.left) * scaleX - center.x;
        const y = (e.clientY - rect.top) * scaleY - center.y;

        let angle = Math.atan2(-y, x);
        setAngleC(clampAngle(angle));
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setDragging(false);
    };

    return (
        <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg max-w-sm mx-auto my-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Interaktív: Thalész tétele</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center italic">
                Húzd a C pontot a félkör mentén! 👆
            </p>

            <div className="relative touch-none w-full" style={{ maxWidth: width }}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto select-none"
                    onPointerMove={handlePointerMove}
                    onPointerUp={() => setDragging(false)}
                >
                    {/* Full circle (faded) */}
                    <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />

                    {/* Upper semicircle (highlighted) */}
                    <path
                        d={`M ${pointA.x} ${pointA.y} A ${radius} ${radius} 0 1 0 ${pointB.x} ${pointB.y}`}
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2.5"
                    />

                    {/* Diameter line AB */}
                    <line x1={pointA.x} y1={pointA.y} x2={pointB.x} y2={pointB.y} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />

                    {/* Triangle sides CA and CB */}
                    <line x1={pointC.x} y1={pointC.y} x2={pointA.x} y2={pointA.y} stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1={pointC.x} y1={pointC.y} x2={pointB.x} y2={pointB.y} stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Right angle marker at C */}
                    <path
                        d={`M ${sq1.x} ${sq1.y} L ${sq2.x} ${sq2.y} L ${sq3.x} ${sq3.y}`}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                    />

                    {/* Center point O */}
                    <circle cx={center.x} cy={center.y} r="4" fill="#64748b" />
                    <text
                        x={center.x} y={center.y + 20}
                        fontSize="13" fontWeight="bold" textAnchor="middle"
                        className="fill-slate-600 dark:fill-slate-300 select-none"
                    >O</text>

                    {/* Point A (fixed) */}
                    <circle cx={pointA.x} cy={pointA.y} r="10" fill="#f97316" opacity="0.15" />
                    <circle cx={pointA.x} cy={pointA.y} r="7" fill="#f97316" stroke="white" strokeWidth="2.5" />
                    <text
                        x={pointA.x - 16} y={pointA.y + 20}
                        fontSize="14" fontWeight="bold"
                        className="fill-orange-500 select-none"
                    >A</text>

                    {/* Point B (fixed) */}
                    <circle cx={pointB.x} cy={pointB.y} r="10" fill="#f97316" opacity="0.15" />
                    <circle cx={pointB.x} cy={pointB.y} r="7" fill="#f97316" stroke="white" strokeWidth="2.5" />
                    <text
                        x={pointB.x + 10} y={pointB.y + 20}
                        fontSize="14" fontWeight="bold"
                        className="fill-orange-500 select-none"
                    >B</text>

                    {/* Point C (draggable) */}
                    <g className="cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown}>
                        <circle cx={pointC.x} cy={pointC.y} r="30" fill="transparent" />
                        <circle cx={pointC.x} cy={pointC.y} r="10" fill="#8b5cf6" opacity={dragging ? 0.3 : 0.15} />
                        <circle cx={pointC.x} cy={pointC.y} r="7" fill="#8b5cf6" stroke="white" strokeWidth="2.5" />
                    </g>
                    <text
                        x={pointC.x + (pointC.x > center.x ? 12 : -20)}
                        y={pointC.y - 12}
                        fontSize="14" fontWeight="bold"
                        className="fill-purple-500 select-none pointer-events-none"
                    >C</text>

                    {/* Angle label */}
                    <text
                        x={pointC.x + (uCA.x + uCB.x) * 32}
                        y={pointC.y + (uCA.y + uCB.y) * 32}
                        fontSize="13" fontWeight="bold" textAnchor="middle"
                        className="fill-red-500 select-none pointer-events-none"
                    >{angleCDeg}°</text>

                    {/* "d = 2r" label on diameter REMOVED as per screenshot simpler look, or kept? Screenshot didn't show it explicitly but I'll leave it or remove it based on 'perfect' visual. Screenshot had '90 deg'. I will keep d=2r but minimal. The user's screenshot of Thales (right side) shows A, B, C, 90 deg, diameter line, triangle lines. It does NOT show d=2r. I will remove it to be cleaner. */}
                </svg>
            </div>

            {/* Info card */}
            <div className="w-full mt-3">
                <div className={`p-4 rounded-lg border text-center transition-colors duration-300 ${angleCDeg === 90
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                    }`}>
                    <div className="text-xs font-bold uppercase mb-1 text-red-500 dark:text-red-400">
                        Szög a C csúcsnál (∠ACB)
                    </div>
                    <div className={`text-4xl font-black transition-colors duration-300 ${angleCDeg === 90
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-purple-700 dark:text-purple-300'
                        }`}>
                        {angleCDeg}°
                    </div>
                    <div className="text-xs mt-1 font-semibold text-slate-500 dark:text-slate-400">
                        {angleCDeg === 90 ? '✅ Mindig derékszög!' : '≈ 90° — mozgasd a pontot!'}
                    </div>
                </div>
            </div>

            {/* Explanation */}
            <div className="w-full mt-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Thalész tétele:</strong> Ha AB egy kör átmérője, és C a kör bármely más pontja, akkor ∠ACB = 90°.
                    Ez a kerületi szög tétel speciális esete: a 180°-os középponti szög fele mindig 90°.
                </p>
            </div>

            <div className="text-xs text-slate-400 mt-2 text-center italic">
                Figyeld meg: bárhová húzod C-t, a szög mindig 90°!
            </div>
        </div>
    );
};

export default ThalesVisualizer;
