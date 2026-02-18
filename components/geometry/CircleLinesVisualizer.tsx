import React, { useState, useRef } from 'react';

const CircleLinesVisualizer: React.FC = () => {
    const width = 340;
    const height = 340;
    // Shift center to left to accommodate the line at max distance
    // center.x = 110, Max dist = 180 => lineX = 290 (well within 340)
    const center = { x: 110, y: height / 2 };
    const R = 100; // Fixed radius

    // State: distance of line from center (in pixels)
    // Default to tangential (distance = R)
    const [distance, setDistance] = useState(R);
    const MAX_DIST = 180;
    // Use state for dragging to trigger re-renders for visual feedback
    const [isDragging, setIsDragging] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    // Determine state based on distance
    let state: 'secant' | 'tangent' | 'external' = 'external';
    let color = '#3b82f6'; // blue (external)
    let label = 'Kívül fekvő';
    let description = 'd > r';

    // Tolerance for "tangent" snap area visually
    const EPSILON = 2; // pixel tolerance

    if (Math.abs(distance - R) <= EPSILON) {
        state = 'tangent';
        color = '#8b5cf6'; // purple
        label = 'Érintő';
        description = 'd = r';
    } else if (distance < R) {
        state = 'secant';
        color = '#ef4444'; // red
        label = 'Szelő';
        description = 'd < r';
    }

    // Line endpoints (vertical line at x = center.x + distance)
    // But let's make it horizontal line at y = center.y - distance for variety?
    // Actually vertical is easier to visualize d on x-axis visually maybe?
    // Let's stick to horizontal line at y = center.y - distance (moves up/down)
    // Or vertical line at x = center.x + distance (moves left/right)
    // Let's do vertical line at x = center.x + distance.
    // Line length needs to cover height.
    const lineX = center.x + distance;
    const lineY1 = 20;
    const lineY2 = height - 20;

    // Intersection calculation
    let intersections: { x: number, y: number }[] = [];
    if (distance <= R) {
        const dx = distance; // x offset from center
        // x^2 + y^2 = R^2  =>  dx^2 + y^2 = R^2  =>  y = +/- sqrt(R^2 - dx^2)
        const dy = Math.sqrt(R * R - dx * dx);
        intersections.push({ x: center.x + dx, y: center.y - dy });
        if (dy > 0.1) { // Avoid duplicate point for tangent
            intersections.push({ x: center.x + dx, y: center.y + dy });
        }
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const scaleX = width / rect.width;
        const x = (e.clientX - rect.left) * scaleX - center.x;

        // Clamp x to [0, MAX_DIST]
        const newDist = Math.max(0, Math.min(MAX_DIST, x));

        // Snap to tangent
        if (Math.abs(newDist - R) < 8) {
            setDistance(R);
        } else {
            setDistance(newDist);
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
        // Immediate move
        const rect = svgRef.current!.getBoundingClientRect();
        const scaleX = width / rect.width;
        const x = (e.clientX - rect.left) * scaleX - center.x;
        const newDist = Math.max(0, Math.min(MAX_DIST, x));
        if (Math.abs(newDist - R) < 8) setDistance(R);
        else setDistance(newDist);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDragging(false);
    };

    return (
        <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg max-w-sm mx-auto my-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Interaktív: Egyenesek és a kör</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center italic">
                Húzd a vonalat vagy a csúszkát! ↔️
            </p>

            <div className="relative touch-none w-full" style={{ maxWidth: width }}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto select-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    {/* Circle */}
                    <circle
                        cx={center.x} cy={center.y} r={R}
                        fill="none" stroke="#94a3b8" strokeWidth="2"
                    />

                    {/* Center */}
                    <circle cx={center.x} cy={center.y} r="3" fill="#334155" />
                    <text x={center.x - 15} y={center.y + 5} fontSize="12" fill="#64748b">O</text>

                    {/* Radius (dashed) - only to visualize R vs d comparison line */}
                    <line
                        x1={center.x} y1={center.y}
                        x2={center.x + R} y2={center.y}
                        stroke="#94a3b8" strokeWidth="1" strokeDasharray="4"
                        opacity="0.5"
                    />

                    {/* Distance line (d) */}
                    <line
                        x1={center.x} y1={center.y}
                        x2={lineX} y2={center.y}
                        stroke="#64748b" strokeWidth="2"
                    />
                    <text
                        x={center.x + distance / 2} y={center.y - 8}
                        fontSize="12" fontWeight="bold" textAnchor="middle" fill="#64748b"
                    >d</text>

                    {/* The Line */}
                    <line
                        x1={lineX} y1={lineY1}
                        x2={lineX} y2={lineY2}
                        stroke={color} strokeWidth="3"
                        className="transition-colors duration-200"
                    />

                    {/* Right Angle Mark (only visible if tangent) */}
                    {state === 'tangent' && (
                        <rect
                            x={lineX - 10} y={center.y - 10}
                            width="10" height="10"
                            fill="none" stroke={color} strokeWidth="1.5"
                        />
                    )}

                    {/* Intersections - Interactive */}
                    {intersections.map((p, i) => (
                        <g
                            key={i}
                            className="cursor-pointer"
                            onPointerDown={handlePointerDown}
                        >
                            {/* Hit area */}
                            <circle cx={p.x} cy={p.y} r="20" fill="transparent" />
                            {/* Visible point */}
                            <circle
                                cx={p.x} cy={p.y} r={isDragging ? 8 : 5}
                                fill={color} stroke="white" strokeWidth="2"
                                className="transition-all duration-200 ease-out"
                            />
                        </g>
                    ))}

                    {/* Drag Handle on Line - styled like points in CircleAngleVisualizer */}
                    <g
                        className="cursor-pointer"
                        onPointerDown={handlePointerDown}
                    >
                        {/* Large invisible hit area */}
                        <circle
                            cx={lineX} cy={center.y} r="30"
                            fill="transparent"
                        />
                        {/* Visual handle */}
                        <circle
                            cx={lineX} cy={center.y} r={isDragging ? 12 : 8}
                            fill={color} stroke="white" strokeWidth="2"
                            className="transition-all duration-200 ease-out"
                        />
                    </g>

                </svg>
            </div>

            {/* Slider Control */}
            <div className="w-full mt-4 px-1 space-y-4">
                <input
                    type="range"
                    min="0"
                    max={MAX_DIST}
                    value={distance}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        // Snap to tangent
                        if (Math.abs(val - R) < 5) setDistance(R);
                        else setDistance(val);
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                {/* State Card */}
                <div
                    className="p-4 rounded-xl border-2 transition-colors duration-300 flex items-center justify-between"
                    style={{
                        borderColor: color,
                        backgroundColor: `${color}15` // 15 = ~8% opacity hex
                    }}
                >
                    <div className="flex flex-col">
                        <span className="text-xs uppercase font-bold tracking-wider opacity-70" style={{ color }}>Viszony</span>
                        <span className="text-xl font-bold" style={{ color }}>{label}</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                            d ≈ {Math.round(distance)}
                        </div>
                        <div className="text-xs mt-1 font-bold" style={{ color }}>{description}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 text-center">
                    <div className={`${state === 'secant' ? 'font-bold text-red-500' : ''}`}>
                        Közös pontok: {state === 'secant' ? 2 : (state === 'tangent' ? 1 : 0)}
                    </div>
                    <div>
                        Sugár: {R}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CircleLinesVisualizer;
