import React from 'react';

interface FunctionPlotterProps {
    a: number;
    b: number;
    c: number;
    mode: 'precise' | 'sketch';
    width?: number;
    height?: number;
    xDomain?: [number, number]; // [min, max]
    yDomain?: [number, number]; // [min, max]
}

const FunctionPlotter: React.FC<FunctionPlotterProps> = ({
    a,
    b,
    c,
    mode,
    width = 300,
    height = 300,
    xDomain = [-5, 5],
    yDomain = [-5, 15],
}) => {
    // Helper to map math coordinates to SVG coordinates
    const mapX = (x: number) => {
        const range = xDomain[1] - xDomain[0];
        return ((x - xDomain[0]) / range) * width;
    };

    const mapY = (y: number) => {
        const range = yDomain[1] - yDomain[0];
        // SVG y is inverted (0 is top)
        return height - ((y - yDomain[0]) / range) * height;
    };

    // Generate points for the quadratic curve
    const generatePath = () => {
        const points: [number, number][] = [];
        const step = (xDomain[1] - xDomain[0]) / 100; // Resolution

        for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
            const y = a * x * x + b * x + c;
            // Clamp y to avoid drawing way outside
            // if (y >= yDomain[0] && y <= yDomain[1]) {
            points.push([mapX(x), mapY(y)]);
            // }
        }

        if (points.length === 0) return '';

        // Construct SVG path command
        const d = points.reduce((acc, point, i) => {
            return acc + `${i === 0 ? 'M' : 'L'} ${point[0].toFixed(1)} ${point[1].toFixed(1)} `;
        }, '');

        return d;
    };

    const pathData = generatePath();
    const xAxisY = mapY(0);
    const yAxisX = mapX(0);

    // Styles based on mode
    const isSketch = mode === 'sketch';
    const strokeWidth = isSketch ? 3 : 2;
    const strokeColor = isSketch ? '#4f46e5' : '#2563eb'; // Indigo vs Blue

    // For sketch mode, we could add some "wiggle" to lines naturally, 
    // but for now we'll simulate it with style properties (e.g. rounded line joins)
    // or simply by having less grid clutter.

    return (
        <div className={`border rounded-lg bg-white overflow-hidden ${isSketch ? 'shadow-sm' : 'shadow-md'}`}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">

                {/* Grid (Precise Mode Only) */}
                {!isSketch && (
                    <g className="grid-lines opacity-20 stroke-slate-400">
                        {/* Vertical grid lines */}
                        {Array.from({ length: xDomain[1] - xDomain[0] + 1 }).map((_, i) => {
                            const xVal = xDomain[0] + i;
                            const xPos = mapX(xVal);
                            return <line key={`v${i}`} x1={xPos} y1={0} x2={xPos} y2={height} strokeWidth="1" />;
                        })}
                        {/* Horizontal grid lines */}
                        {Array.from({ length: yDomain[1] - yDomain[0] + 1 }).map((_, i) => {
                            const yVal = yDomain[0] + i;
                            const yPos = mapY(yVal);
                            return <line key={`h${i}`} x1={0} y1={yPos} x2={width} y2={yPos} strokeWidth="1" />;
                        })}
                    </g>
                )}

                {/* Axes */}
                <g className="axes stroke-slate-800" strokeWidth="2">
                    {/* X Axis */}
                    <line x1={0} y1={xAxisY} x2={width} y2={xAxisY} />
                    {/* Y Axis */}
                    <line x1={yAxisX} y1={0} x2={yAxisX} y2={height} />

                    {/* Arrows (Sketch mode might omit precise arrows, but let's keep them simply) */}
                    <path d={`M ${width - 10} ${xAxisY - 5} L ${width} ${xAxisY} L ${width - 10} ${xAxisY + 5}`} fill="none" />
                    <path d={`M ${yAxisX - 5} 10 L ${yAxisX} 0 L ${yAxisX + 5} 10`} fill="none" />
                </g>

                {/* The Function */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                // Simple dash array for sketch feel? Or just consistent line.
                // strokeDasharray={isSketch ? "5,5" : "none"} // Optional sketch effect
                />

                {/* Labels (Precise Mode Only) */}
                {!isSketch && (
                    <g className="labels text-xs fill-slate-500 font-mono">
                        <text x={width - 20} y={xAxisY + 20}>x</text>
                        <text x={yAxisX + 10} y={20}>y</text>

                        {/* Origin */}
                        <text x={yAxisX - 15} y={xAxisY + 15}>0</text>
                    </g>
                )}
            </svg>
            <div className="p-2 text-center text-sm font-medium text-slate-500 bg-slate-50 border-t">
                {isSketch ? 'Vázlat' : 'Precíz ábrázolás'}
            </div>
        </div>
    );
};

export default FunctionPlotter;
