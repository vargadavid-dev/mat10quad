import React, { useState, useRef } from 'react';

const CircleBasicsVisualizer: React.FC = () => {
    const width = 340;
    const height = 340;
    const center = { x: width / 2, y: height / 2 };
    const [R, setR] = useState(120);
    const R_MIN = 50;
    const R_MAX = 140;

    // State: angles in radians for each draggable point on the circle
    const [radiusAngle, setRadiusAngle] = useState(Math.PI * 0.3);      // radius endpoint
    const [diameterAngle, setDiameterAngle] = useState(0);                // diameter (one end, other is opposite)
    const [chordAngle1, setChordAngle1] = useState(Math.PI * 1.15);      // chord point 1
    const [chordAngle2, setChordAngle2] = useState(Math.PI * 1.65);      // chord point 2

    const [dragging, setDragging] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Polar -> Cartesian (SVG coords, Y-down)
    const getPoint = (angle: number) => ({
        x: center.x + R * Math.cos(angle),
        y: center.y - R * Math.sin(angle),
    });

    // Points
    const radiusEnd = getPoint(radiusAngle);
    const diam1 = getPoint(diameterAngle);
    const diam2 = getPoint(diameterAngle + Math.PI); // opposite side
    const chord1 = getPoint(chordAngle1);
    const chord2 = getPoint(chordAngle2);

    // Calculate chord length for display
    const chordLength = Math.sqrt(
        (chord2.x - chord1.x) ** 2 + (chord2.y - chord1.y) ** 2
    );
    // Radius length is always R
    const diameterLength = 2 * R;

    const handlePointerDown = (id: string) => (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(id);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging || !svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        const x = (e.clientX - rect.left) * scaleX - center.x;
        const y = (e.clientY - rect.top) * scaleY - center.y;

        let angle = Math.atan2(-y, x);
        if (angle < 0) angle += 2 * Math.PI;

        switch (dragging) {
            case 'radius': setRadiusAngle(angle); break;
            case 'diameter': setDiameterAngle(angle); break;
            case 'chord1': setChordAngle1(angle); break;
            case 'chord2': setChordAngle2(angle); break;
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setDragging(null);
    };

    // Label positioning: offset from point, away from center
    const labelOffset = (angle: number, dist: number = 16) => ({
        x: center.x + (R + dist) * Math.cos(angle),
        y: center.y - (R + dist) * Math.sin(angle),
    });

    const radiusLabel = labelOffset(radiusAngle, 20);
    const diam1Label = labelOffset(diameterAngle, 18);
    const diam2Label = labelOffset(diameterAngle + Math.PI, 18);
    const chord1Label = labelOffset(chordAngle1, 18);
    const chord2Label = labelOffset(chordAngle2, 18);

    // Midpoint for chord label
    const chordMid = {
        x: (chord1.x + chord2.x) / 2,
        y: (chord1.y + chord2.y) / 2,
    };
    // Offset chord label slightly towards center
    const chordLabelPos = {
        x: chordMid.x + (center.x - chordMid.x) * 0.25,
        y: chordMid.y + (center.y - chordMid.y) * 0.25 - 8,
    };

    // Midpoint for radius label
    const radiusMid = {
        x: (center.x + radiusEnd.x) / 2,
        y: (center.y + radiusEnd.y) / 2,
    };

    // Draggable point component
    const DraggablePoint = ({ id, point, color, label }: { id: string; point: { x: number; y: number }; color: string; label: string }) => (
        <g
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown(id)}
            onPointerUp={handlePointerUp}
        >
            {/* Larger invisible hit area */}
            <circle cx={point.x} cy={point.y} r="16" fill="transparent" />
            {/* Outer glow */}
            <circle cx={point.x} cy={point.y} r="10" fill={color} opacity={dragging === id ? 0.3 : 0.15} />
            {/* Main dot */}
            <circle cx={point.x} cy={point.y} r="7" fill={color} stroke="white" strokeWidth="2.5" />
        </g>
    );

    return (
        <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg max-w-sm mx-auto my-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Interaktív: A kör elemei</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center italic">
                Húzd a színes pontokat a körvonal mentén! 👆
            </p>

            <div className="relative touch-none w-full" style={{ maxWidth: width }}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto select-none"
                    onPointerMove={handlePointerMove}
                    onPointerUp={() => setDragging(null)}
                >
                    {/* Circle */}
                    <circle
                        cx={center.x} cy={center.y} r={R}
                        fill="none" stroke="#94a3b8" strokeWidth="2"
                    />

                    {/* Center Point O */}
                    <circle cx={center.x} cy={center.y} r="4" fill="#334155" />
                    <text
                        x={center.x + 8} y={center.y + 16}
                        fontSize="14" fontWeight="bold"
                        className="fill-slate-600 dark:fill-slate-300"
                    >O</text>

                    {/* ─── DIAMETER (Orange) ─── */}
                    <line
                        x1={diam1.x} y1={diam1.y}
                        x2={diam2.x} y2={diam2.y}
                        stroke="#f97316" strokeWidth="3" strokeLinecap="round"
                    />
                    {/* Diameter label at midpoint (slightly offset) */}
                    <text
                        x={center.x} y={center.y - 8}
                        fontSize="12" fontWeight="bold" textAnchor="middle"
                        className="fill-orange-500"
                    >d = 2r</text>

                    {/* ─── RADIUS (Blue) ─── */}
                    <line
                        x1={center.x} y1={center.y}
                        x2={radiusEnd.x} y2={radiusEnd.y}
                        stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"
                    />
                    {/* Radius label */}
                    <text
                        x={radiusMid.x + 5} y={radiusMid.y - 8}
                        fontSize="12" fontWeight="bold"
                        className="fill-blue-500"
                    >r</text>

                    {/* ─── CHORD (Green) ─── */}
                    <line
                        x1={chord1.x} y1={chord1.y}
                        x2={chord2.x} y2={chord2.y}
                        stroke="#10b981" strokeWidth="3" strokeLinecap="round"
                    />
                    {/* Chord label */}
                    <text
                        x={chordLabelPos.x} y={chordLabelPos.y}
                        fontSize="12" fontWeight="bold" textAnchor="middle"
                        className="fill-emerald-500"
                    >húr</text>

                    {/* ─── DRAGGABLE POINTS ─── */}
                    {/* Radius endpoint */}
                    <DraggablePoint id="radius" point={radiusEnd} color="#3b82f6" label="R" />

                    {/* Diameter endpoints */}
                    <DraggablePoint id="diameter" point={diam1} color="#f97316" label="D₁" />

                    {/* Chord endpoints */}
                    <DraggablePoint id="chord1" point={chord1} color="#10b981" label="C₁" />
                    <DraggablePoint id="chord2" point={chord2} color="#10b981" label="C₂" />
                </svg>
            </div>

            {/* Radius Slider */}
            <div className="w-full mt-3 px-1">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-500 whitespace-nowrap">r =</span>
                    <input
                        type="range"
                        min={R_MIN}
                        max={R_MAX}
                        value={R}
                        onChange={(e) => setR(Number(e.target.value))}
                        className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-blue-500"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 ${((R - R_MIN) / (R_MAX - R_MIN)) * 100}%, #e2e8f0 ${((R - R_MIN) / (R_MAX - R_MIN)) * 100}%)`
                        }}
                    />
                    <span className="text-xs font-mono text-slate-500 w-8 text-right">{R}</span>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-2 w-full mt-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-lg border border-blue-100 dark:border-blue-800 text-center">
                    <div className="text-[10px] text-blue-500 dark:text-blue-400 font-bold uppercase mb-0.5">Sugár</div>
                    <div className="text-lg font-black text-blue-700 dark:text-blue-300">{R}</div>
                    <div className="text-[10px] text-blue-400">px</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2.5 rounded-lg border border-orange-100 dark:border-orange-800 text-center">
                    <div className="text-[10px] text-orange-500 dark:text-orange-400 font-bold uppercase mb-0.5">Átmérő</div>
                    <div className="text-lg font-black text-orange-700 dark:text-orange-300">{diameterLength}</div>
                    <div className="text-[10px] text-orange-400">= 2r</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-800 text-center">
                    <div className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold uppercase mb-0.5">Húr</div>
                    <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">{Math.round(chordLength)}</div>
                    <div className="text-[10px] text-emerald-400">≤ d</div>
                </div>
            </div>
        </div>
    );
};

export default CircleBasicsVisualizer;
