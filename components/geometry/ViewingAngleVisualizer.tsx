import React, { useState, useRef } from 'react';

/**
 * ViewingAngleVisualizer
 * 
 * Shows: AB segment at the bottom, an arc above it for a given α,
 * a draggable P on that arc, and the angle APB displayed at P.
 * The angle stays constant no matter where P is on the arc.
 */
const ViewingAngleVisualizer: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dragging, setDragging] = useState(false);
    const [alpha, setAlpha] = useState(50);

    // Canvas
    const W = 500, H = 400;

    // AB segment near bottom
    const ax = 150, ay = 310;
    const bx = 350, by = 310;
    const abHalf = (bx - ax) / 2; // 100
    const midX = (ax + bx) / 2;   // 250

    // Circle: inscribed angle theorem => r = AB / (2 sin α)
    const aRad = (alpha * Math.PI) / 180;
    const r = (2 * abHalf) / (2 * Math.sin(aRad)); // = abHalf / sin(α) simplified

    // Center O above AB on perpendicular bisector
    // dist from midpoint of AB to O:
    const h = Math.sqrt(Math.max(r * r - abHalf * abHalf, 1));
    const ox = midX;
    const oy = ay - h; // above AB

    // P on the arc, parameterized by angle from O
    // Start P at top of arc
    const [pAngle, setPAngle] = useState(-Math.PI / 2);

    const px = ox + r * Math.cos(pAngle);
    const py = oy + r * Math.sin(pAngle);

    // Angle APB calculation
    const apx = ax - px, apy = ay - py; // vector P→A
    const bpx = bx - px, bpy = by - py; // vector P→B
    const dotAB = apx * bpx + apy * bpy;
    const crossAB = apx * bpy - apy * bpx;
    const measuredAngle = Math.round(Math.abs(Math.atan2(crossAB, dotAB)) * 180 / Math.PI);

    // Small arc indicator at P
    const drawSmallArc = () => {
        const la = Math.sqrt(apx * apx + apy * apy);
        const lb = Math.sqrt(bpx * bpx + bpy * bpy);
        if (la < 1 || lb < 1) return '';
        const R = 30; // arc indicator radius
        const x1 = px + (apx / la) * R, y1 = py + (apy / la) * R;
        const x2 = px + (bpx / lb) * R, y2 = py + (bpy / lb) * R;
        // sweep direction based on cross product
        const sweep = crossAB > 0 ? 1 : 0;
        return `M ${x1} ${y1} A ${R} ${R} 0 0 ${sweep} ${x2} ${y2}`;
    };

    // SVG arc path: A to B, going ABOVE
    // sweep-flag=0 means counter-clockwise (which goes UP for left-to-right points)
    const largeFlag = alpha < 90 ? 1 : 0;
    const mainArc = `M ${ax} ${ay} A ${r} ${r} 0 ${largeFlag} 0 ${bx} ${by}`;

    // Drag handler
    const onMove = (e: React.PointerEvent) => {
        if (!dragging || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (W / rect.width);
        const my = (e.clientY - rect.top) * (H / rect.height);

        const theta = Math.atan2(my - oy, mx - ox);
        // Only allow if resulting point is above AB line
        const testY = oy + r * Math.sin(theta);
        if (testY < ay - 10) {
            setPAngle(theta);
        }
    };

    return (
        <div className="flex flex-col gap-3 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Slider */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center gap-4">
                <span className="text-sm font-medium whitespace-nowrap">α =</span>
                <input
                    type="range" min="20" max="160" step="1" value={alpha}
                    onChange={e => { setAlpha(+e.target.value); setPAngle(-Math.PI / 2); }}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 w-10 text-right">{alpha}°</span>
            </div>

            {/* Drawing */}
            <div className="relative aspect-[5/4] bg-slate-50 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
                <svg
                    ref={svgRef} viewBox={`0 0 ${W} ${H}`}
                    className="w-full h-full select-none touch-none"
                    onPointerMove={onMove}
                    onPointerUp={() => setDragging(false)}
                    onPointerLeave={() => setDragging(false)}
                >
                    {/* Arc */}
                    <path d={mainArc} fill="none" stroke="#ef4444" strokeWidth="2.5" opacity="0.5" />

                    {/* AB segment */}
                    <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#1e293b" strokeWidth="3" className="dark:stroke-slate-300" />
                    <circle cx={ax} cy={ay} r="5" fill="#1e293b" className="dark:fill-slate-200" />
                    <text x={ax - 5} y={ay + 22} className="fill-slate-700 dark:fill-slate-300" fontWeight="bold" fontSize="16" textAnchor="middle">A</text>
                    <circle cx={bx} cy={by} r="5" fill="#1e293b" className="dark:fill-slate-200" />
                    <text x={bx + 5} y={by + 22} className="fill-slate-700 dark:fill-slate-300" fontWeight="bold" fontSize="16" textAnchor="middle">B</text>

                    {/* PA and PB legs */}
                    <line x1={px} y1={py} x2={ax} y2={ay} stroke="#22c55e" strokeWidth="2" />
                    <line x1={px} y1={py} x2={bx} y2={by} stroke="#22c55e" strokeWidth="2" />

                    {/* Angle arc at P */}
                    <path d={drawSmallArc()} fill="none" stroke="#22c55e" strokeWidth="2.5" />

                    {/* Angle value */}
                    <text
                        x={px}
                        y={py + 50}
                        fill="#22c55e" fontSize="15" fontWeight="bold" textAnchor="middle"
                    >
                        {measuredAngle}°
                    </text>

                    {/* Draggable P */}
                    <circle
                        cx={px} cy={py} r="10"
                        fill="#22c55e" stroke="white" strokeWidth="2"
                        className="cursor-grab"
                        onPointerDown={e => { setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); }}
                    />
                    <text x={px} y={py - 16} fill="#22c55e" fontWeight="bold" fontSize="15" textAnchor="middle">P</text>
                </svg>
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 italic">
                Húzd a <strong className="text-green-500">P</strong> pontot a köríven! A szög mindig <strong className="text-green-500">{measuredAngle}°</strong>.
            </p>
        </div>
    );
};

export default ViewingAngleVisualizer;
