import React, { useState, useRef, useEffect } from 'react';

interface CoordinateSystemProps {
    width?: number;
    height?: number;
    range?: number; // +/- range for both axes (e.g. 10 means -10 to 10)
    targetPoint?: { x: number; y: number }; // For "Plot this point" tasks
    lockAfterSuccess?: boolean;
    isInteractive?: boolean;
    onPointSelect?: (p: { x: number; y: number } | { x: number; y: number }[]) => void;
    showGrid?: boolean;
    showLabels?: boolean;
    initialPoints?: { x: number; y: number; label?: string; color?: string; showGuides?: boolean }[];
    initialLines?: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; style?: 'solid' | 'dashed'; label?: string; labelOffset?: { x: number; y: number } }[];
    maxPoints?: number;
    drawMode?: 'point' | 'line';
}

const CoordinateSystem: React.FC<CoordinateSystemProps> = ({
    width = 300,
    height = 300,
    range = 5,
    targetPoint,
    lockAfterSuccess = false,
    isInteractive = true,
    onPointSelect,
    showGrid = true,
    showLabels = true,
    initialPoints = [],
    initialLines = [],
    maxPoints = 1,
    drawMode = 'point'
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [userPoints, setUserPoints] = useState<{ x: number, y: number }[]>([]);
    const [hoverPoint, setHoverPoint] = useState<{ x: number, y: number } | null>(null);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    // Math to SVG helpers
    const mapX = (val: number) => (val + range) / (2 * range) * width;
    const mapY = (val: number) => height - ((val + range) / (2 * range) * height);

    // SVG to Math helpers
    const invMapX = (svgX: number) => {
        const val = (svgX / width) * 2 * range - range;
        return Math.round(val); // Snap to integer
    };
    const invMapY = (svgY: number) => {
        const val = ((height - svgY) / height) * 2 * range - range;
        return Math.round(val); // Snap to integer
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isInteractive || (lockAfterSuccess && checkSuccess())) return;

        if (svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const mathX = invMapX(x);
            const mathY = invMapY(y);

            // Constraint to range
            if (mathX >= -range && mathX <= range && mathY >= -range && mathY <= range) {
                setHoverPoint({ x: mathX, y: mathY });
            }
        }
    };

    const checkSuccess = () => {
        if (targetPoint && userPoints.length === 1 && userPoints[0].x === targetPoint.x && userPoints[0].y === targetPoint.y) return true;
        // Add line check here if needed later, but usually validated in parent
        return false;
    };

    const handleClick = () => {
        if (!isInteractive || !hoverPoint) return;

        // If we reached limit, replace the last point or clear? 
        // Let's toggle points if clicked again, or add if below limit.
        const existingIdx = userPoints.findIndex(p => p.x === hoverPoint.x && p.y === hoverPoint.y);

        let newPoints = [...userPoints];
        if (existingIdx !== -1) {
            // Remove if already selected
            newPoints.splice(existingIdx, 1);
        } else {
            if (newPoints.length >= maxPoints) {
                // If full, remove the first one to act like a queue, or just replace last?
                // Better UX: shift
                newPoints.shift();
            }
            newPoints.push(hoverPoint);
        }

        setUserPoints(newPoints);

        if (onPointSelect) {
            // Pass single point if maxPoints is 1 for backward compatibility in types (though we updated prop type)
            // Actually, parent expects compatible type. 
            // We cast to any to simplify internal logic or check resizing.
            if (maxPoints === 1) {
                onPointSelect(newPoints[0] || hoverPoint); // Fallback to hoverPoint if we just added it
            } else {
                onPointSelect(newPoints);
            }
        }
    };

    const handleMouseLeave = () => {
        setHoverPoint(null);
    };

    const xAxisY = mapY(0);
    const yAxisX = mapX(0);

    // Initial points calculation for line
    const getExtendedLine = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
        // y = mx + b
        // m = (y2 - y1) / (x2 - x1)
        if (p1.x === p2.x) {
            // Vertical line
            return { x1: mapX(p1.x), y1: 0, x2: mapX(p1.x), y2: height };
        }

        const m = (p2.y - p1.y) / (p2.x - p1.x);
        const b = p1.y - m * p1.x;

        // Calculate intersections with viewport boundaries
        // We know range is -range to +range
        // Calculate y at x = -range and x = range
        const yStart = m * (-range) + b;
        const yEnd = m * (range) + b;

        return {
            x1: mapX(-range),
            y1: mapY(yStart),
            x2: mapX(range),
            y2: mapY(yEnd)
        };
    };

    return (
        <div className="flex flex-col items-center select-none">
            <div className="relative border rounded-lg bg-white shadow-sm overflow-hidden cursor-crosshair">
                <svg
                    ref={svgRef}
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                    onMouseLeave={handleMouseLeave}
                    className="block touch-manipulation"
                >
                    {/* Grid */}
                    {showGrid && (
                        <g className="stroke-slate-200" strokeWidth="1">
                            {Array.from({ length: 2 * range + 1 }).map((_, i) => {
                                const val = i - range;
                                if (val === 0) return null; // Skip axes
                                const x = mapX(val);
                                const y = mapY(val);
                                return (
                                    <React.Fragment key={i}>
                                        <line x1={x} y1={0} x2={x} y2={height} />
                                        <line x1={0} y1={y} x2={width} y2={y} />
                                    </React.Fragment>
                                );
                            })}
                        </g>
                    )}

                    {/* Axes */}
                    <g className="stroke-slate-400" strokeWidth="2">
                        <line x1={0} y1={xAxisY} x2={width} y2={xAxisY} />
                        <line x1={yAxisX} y1={0} x2={yAxisX} y2={height} />

                        {/* Arrows */}
                        <path d={`M ${width - 8} ${xAxisY - 4} L ${width} ${xAxisY} L ${width - 8} ${xAxisY + 4}`} fill="none" />
                        <path d={`M ${yAxisX - 4} 8 L ${yAxisX} 0 L ${yAxisX + 4} 8`} fill="none" />
                    </g>

                    {/* Axis Labels */}
                    {showLabels && (
                        <g className="fill-slate-500 font-mono text-[10px]" textAnchor="middle">
                            {Array.from({ length: 2 * range + 1 }).map((_, i) => {
                                const val = i - range;
                                if (val === 0) return null;
                                return (
                                    <React.Fragment key={i}>
                                        <text x={mapX(val)} y={xAxisY + 12}>{val}</text>
                                        <text x={yAxisX - 10} y={mapY(val) + 3}>{val}</text>
                                    </React.Fragment>
                                );
                            })}
                            <text x={width - 10} y={xAxisY + 15} fontWeight="bold">x</text>
                            <text x={yAxisX + 10} y={15} fontWeight="bold">y</text>
                        </g>
                    )}

                    {/* Line Drawing */}
                    {drawMode === 'line' && userPoints.length === 2 && (
                        <line
                            {...getExtendedLine(userPoints[0], userPoints[1])}
                            stroke="#4f46e5"
                            strokeWidth="3"
                            opacity="0.5"
                        />
                    )}

                    {/* Initial Points (Static) */}
                    {initialPoints.map((p, idx) => (
                        <g key={`init-${idx}`}>
                            {p.showGuides && (
                                <>
                                    <line
                                        x1={mapX(p.x)} y1={xAxisY}
                                        x2={mapX(p.x)} y2={mapY(p.y)}
                                        stroke={p.color || "#64748b"}
                                        strokeWidth="3"
                                        opacity="0.3"
                                    />
                                    <line
                                        x1={yAxisX} y1={mapY(p.y)}
                                        x2={mapX(p.x)} y2={mapY(p.y)}
                                        stroke={p.color || "#64748b"}
                                        strokeWidth="3"
                                        opacity="0.3"
                                    />
                                </>
                            )}
                            <circle cx={mapX(p.x)} cy={mapY(p.y)} r={6} fill={p.color || "#64748b"} stroke="white" strokeWidth="2" />
                            {p.label && (
                                <text x={mapX(p.x) + 10} y={mapY(p.y) - 5} className="font-bold fill-slate-700 text-lg">
                                    {p.label}
                                </text>
                            )}
                        </g>
                    ))}

                    {/* Initial Lines (Static) */}
                    {initialLines.map((l, idx) => (
                        <React.Fragment key={`init-line-${idx}`}>
                            <line
                                x1={mapX(l.x1)}
                                y1={mapY(l.y1)}
                                x2={mapX(l.x2)}
                                y2={mapY(l.y2)}
                                stroke={l.color || "#4f46e5"}
                                strokeWidth={l.width || 3}
                                strokeDasharray={l.style === 'dashed' ? "4 4" : "none"}
                            />
                            {l.label && (
                                <text
                                    x={(mapX(l.x1) + mapX(l.x2)) / 2 + (l.labelOffset?.x || 0)}
                                    y={(mapY(l.y1) + mapY(l.y2)) / 2 - 5 + (l.labelOffset?.y || 0)}
                                    textAnchor="middle"
                                    fill={l.color || "#4f46e5"}
                                    fontWeight="bold"
                                    fontSize="12"
                                >
                                    {l.label}
                                </text>
                            )}
                        </React.Fragment>
                    ))}

                    {/* User Plotted Points */}
                    {userPoints.map((p, idx) => (
                        <circle
                            key={`user-${idx}`}
                            cx={mapX(p.x)}
                            cy={mapY(p.y)}
                            r={5}
                            fill="#4f46e5"
                            className="transition-all duration-200"
                        />
                    ))}

                    {/* Hover Indicator */}
                    {isInteractive && hoverPoint && (
                        <circle
                            cx={mapX(hoverPoint.x)}
                            cy={mapY(hoverPoint.y)}
                            r={6}
                            fill="none"
                            stroke={isTouch ? "#f59e0b" : "#6366f1"}
                            strokeWidth="2"
                            strokeDasharray="2,2"
                            opacity={0.8}
                        />
                    )}
                </svg>
            </div>

            {/* Feedback / Reading */}
            {isInteractive && (
                <div className={`mt-2 text-sm font-medium h-6 flex items-center gap-2 ${userPoints.length > 0 ? 'text-indigo-600' : 'text-slate-600'}`}>
                    {userPoints.length > 0 ? (
                        <span>Kiválasztva: <b>{userPoints.map(p => `(${p.x}; ${p.y})`).join(', ')}</b></span>
                    ) : hoverPoint ? (
                        isTouch ? (
                            <span className="text-amber-600 animate-pulse">Érintsd meg újra a kiválasztáshoz! ({hoverPoint.x}; {hoverPoint.y})</span>
                        ) : (
                            <span>({hoverPoint.x}; {hoverPoint.y})</span>
                        )
                    ) : (
                        isTouch ? (drawMode === 'line' ? "Válassz ki két pontot!" : "Érintsd meg a rácspontot!")
                            : (drawMode === 'line' ? "Kattints két pontra az egyenes megrajzolásához!" : "Kattints a megfelelő rácspontra!")
                    )}
                </div>
            )}
        </div>
    );
};

export default CoordinateSystem;
