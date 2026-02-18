import React, { useState, useRef } from 'react';

const CircleAngleVisualizer: React.FC = () => {
    // Circle properties
    const width = 300;
    const height = 300;
    const center = { x: width / 2, y: height / 2 };
    const radius = 100;

    // State for points (angles in radians)
    // A and B define the arc, C is the point on the circumference
    const [angleA, setAngleA] = useState(Math.PI * 0.8); // ~144 deg
    const [angleB, setAngleB] = useState(Math.PI * 0.2); // ~36 deg
    const [angleC, setAngleC] = useState(Math.PI * 1.5); // ~270 deg (bottom)
    // Track raw angle for C to determine which arc it's on even when snapped
    const [rawAngleC, setRawAngleC] = useState(angleC);

    const [dragging, setDragging] = useState<'A' | 'B' | 'C' | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Convert polar to cartesian
    const getPoint = (angle: number, r = radius) => ({
        x: center.x + r * Math.cos(angle),
        y: center.y - r * Math.sin(angle) // SVG Y is down
    });

    const pointA = getPoint(angleA);
    const pointB = getPoint(angleB);
    const pointC = getPoint(angleC);

    // Normalize angle to [0, 2PI)
    const normalize = (ang: number) => {
        let a = ang % (2 * Math.PI);
        if (a < 0) a += 2 * Math.PI;
        return a;
    };

    const circularDistance = (a: number, b: number) => {
        const diff = Math.abs(normalize(a - b));
        return Math.min(diff, 2 * Math.PI - diff);
    };

    // Determine which arc C is on
    // use rawAngleC if dragging C to preserve "side" information when snapped
    const angleCForCalc = dragging === 'C' ? rawAngleC : angleC;

    // Arc from B to A going counter-clockwise
    const arcBA_ccw = normalize(angleA - angleB);
    // C's position relative to B, going counter-clockwise
    const cPosFromB = normalize(angleCForCalc - angleB);
    // C is on the B→A arc (ccw) if its angular position falls within that arc
    const cOnArcBA = cPosFromB > 0 && cPosFromB < arcBA_ccw;

    // Central angle = the arc NOT containing C
    const centralAngleRad = cOnArcBA
        ? (2 * Math.PI - arcBA_ccw)  // C is on B→A arc, so use the complementary A→B arc
        : arcBA_ccw;                  // C is on A→B arc, so use B→A arc

    // Thales Detection: Is Central Angle ~180 degrees?
    const EPSILON = 0.001;
    const isThales = Math.abs(centralAngleRad - Math.PI) < EPSILON;

    const displayedCentral = Math.round(centralAngleRad * (180 / Math.PI));

    // Inscribed angle at C (using vectors)
    const ca = { x: pointA.x - pointC.x, y: pointA.y - pointC.y };
    const cb = { x: pointB.x - pointC.x, y: pointB.y - pointC.y };
    const dot = ca.x * cb.x + ca.y * cb.y;
    const cross = ca.x * cb.y - ca.y * cb.x;
    let inscribedRad = Math.atan2(cross, dot);
    const displayedInscribed = Math.round(Math.abs(inscribedRad * (180 / Math.PI)));

    // --- Interaction ---
    const handlePointerDown = (point: 'A' | 'B' | 'C') => (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(point);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging || !svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - center.x;
        const y = e.clientY - rect.top - center.y;

        let angle = Math.atan2(-y, x);

        const SNAP_THRESHOLD = 0.15; // radians

        if (dragging === 'A') {
            // SNAP A to be opposite B (Thales)
            const oppositeB = normalize(angleB + Math.PI);
            if (circularDistance(angle, oppositeB) < SNAP_THRESHOLD) {
                setAngleA(oppositeB);
            } else {
                setAngleA(angle);
            }
        }
        if (dragging === 'B') {
            // SNAP B to be opposite A (Thales)
            const oppositeA = normalize(angleA + Math.PI);
            if (circularDistance(angle, oppositeA) < SNAP_THRESHOLD) {
                setAngleB(oppositeA);
            } else {
                setAngleB(angle);
            }
        }
        if (dragging === 'C') {
            // Update raw angle
            setRawAngleC(angle);

            // SNAP C to A or B (Tangent)
            const minDistA = circularDistance(angle, angleA);
            const minDistB = circularDistance(angle, angleB);

            if (minDistA < SNAP_THRESHOLD) {
                setAngleC(angleA);
            } else if (minDistB < SNAP_THRESHOLD) {
                setAngleC(angleB);
            } else {
                setAngleC(angle);
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setDragging(null);
    };

    // Helper: is snapped to tangent?
    const isSnappedToA = circularDistance(angleC, angleA) < EPSILON;
    const isSnappedToB = circularDistance(angleC, angleB) < EPSILON;
    const isTangentCase = isSnappedToA || isSnappedToB;

    // --- Visualization Logic ---

    // ARC VISUALS (Central Angle)
    const centralArcRadius = 30;

    // Determine the start/end angles for the central arc (the arc not containing C)
    let centralArcStart: number, centralArcEnd: number;
    let highlightColor = '#3b82f6'; // Match central angle color (blue)

    // If C is snapped to A or B, the `cOnArcBA` logic might be ambiguous or lead to 0/full circle.
    // However, the central angle calculation `centralAngleRad` is based on A and B,
    // and `cOnArcBA` determines which of the two arcs (A->B or B->A) is "not containing C".
    // This logic remains valid for determining the central angle corresponding to the arc AB.
    // The tangent-chord angle is half of this central angle.
    if (cOnArcBA) {
        // C is on B→A arc, so we draw A→B arc (going counter-clockwise from A to B)
        centralArcStart = angleA;
        centralArcEnd = angleB;
    } else {
        // C is on A→B arc, so we draw B→A arc
        centralArcStart = angleB;
        centralArcEnd = angleA;
    }

    const startPtCentral = { x: center.x + centralArcRadius * Math.cos(centralArcStart), y: center.y - centralArcRadius * Math.sin(centralArcStart) };
    const endPtCentral = { x: center.x + centralArcRadius * Math.cos(centralArcEnd), y: center.y - centralArcRadius * Math.sin(centralArcEnd) };

    const largeArcCentral = centralAngleRad > Math.PI ? 1 : 0;

    // Path: from center → start → arc to end → back to center
    // Sweep 0 in SVG = CCW visual direction = Increasing Math Angle (Start -> End)
    // Sweep 1 in SVG = CW visual direction = Decreasing Math Angle (Start -> End)
    // We calculated centralAngleRad as the positive length of the arc we want.
    // Check if going Start -> End in positive (CCW) direction matches that length.
    const arcLenCCW = normalize(centralArcEnd - centralArcStart);
    const useSweep0 = Math.abs(arcLenCCW - centralAngleRad) < 0.01;
    const sweepCentral = useSweep0 ? 0 : 1;

    // Final large arc flag must match the sweep we chose
    // If sweep0 (CCW), length is arcLenCCW.
    // If sweep1 (CW), length is 2PI - arcLenCCW.
    // centralAngleRad should match one of them.
    const centralLargeArcFinal = centralAngleRad > Math.PI ? 1 : 0;

    const centralPath = `M ${center.x} ${center.y} L ${startPtCentral.x} ${startPtCentral.y} A ${centralArcRadius} ${centralArcRadius} 0 ${centralLargeArcFinal} ${sweepCentral} ${endPtCentral.x} ${endPtCentral.y} Z`;

    // Highlight Arc Path (same geometry as central angle arc but on the circle radius)
    const startPtHighlight = { x: center.x + radius * Math.cos(centralArcStart), y: center.y - radius * Math.sin(centralArcStart) };
    const endPtHighlight = { x: center.x + radius * Math.cos(centralArcEnd), y: center.y - radius * Math.sin(centralArcEnd) };

    const highlightPath = `M ${startPtHighlight.x} ${startPtHighlight.y} A ${radius} ${radius} 0 ${centralLargeArcFinal} ${sweepCentral} ${endPtHighlight.x} ${endPtHighlight.y}`;

    // Inscribed Angle Arc (at C)
    const inscribedArcRadius = 40;
    const angleCA = Math.atan2(-(pointA.y - pointC.y), pointA.x - pointC.x);
    const angleCB = Math.atan2(-(pointB.y - pointC.y), pointB.x - pointC.x);

    // We need to draw the smaller angle between CA and CB
    const absInscribed = Math.abs(inscribedRad);
    // Determine sweep direction: we want the arc that covers the actual inscribed angle
    const diffCA_CB = normalize(angleCA - angleCB);
    const useSmallArcFromCB = diffCA_CB <= Math.PI;
    // If diffCA_CB is the small angle, sweep=0 from endCB to startCA should draw it
    const startCA_pt = { x: pointC.x + inscribedArcRadius * Math.cos(angleCA), y: pointC.y - inscribedArcRadius * Math.sin(angleCA) };
    const endCB_pt = { x: pointC.x + inscribedArcRadius * Math.cos(angleCB), y: pointC.y - inscribedArcRadius * Math.sin(angleCB) };

    // Choose sweep direction to draw the correct (smaller) angle
    const inscribedSweep = useSmallArcFromCB ? 0 : 1;
    const inscribedLargeArc = absInscribed > Math.PI ? 1 : 0;
    const inscribedPath = `M ${pointC.x} ${pointC.y} L ${endCB_pt.x} ${endCB_pt.y} A ${inscribedArcRadius} ${inscribedArcRadius} 0 ${inscribedLargeArc} ${inscribedSweep} ${startCA_pt.x} ${startCA_pt.y} Z`;

    // Label Positions
    // Mid-angle for Central — midpoint of the arc NOT containing C
    const centralMidAngle = centralArcStart + (normalize(centralArcEnd - centralArcStart)) / 2;
    const labelPosCentral = getPoint(centralMidAngle, 50);

    // Mid-angle for Inscribed
    // Use the bisector of the angle at C
    const midAngleC = angleCB + (useSmallArcFromCB ? diffCA_CB / 2 : -(2 * Math.PI - diffCA_CB) / 2);
    const labelPosInscribed = {
        x: pointC.x + 60 * Math.cos(midAngleC),
        y: pointC.y - 60 * Math.sin(midAngleC)
    };

    // Tangent Case Logic
    let tangentLine = null;
    let tangentAngleArc = null;
    let tanLabelPos = { x: 0, y: 0 };

    if (isTangentCase) {
        const snapPt = isSnappedToA ? pointA : pointB;
        const snapAngle = isSnappedToA ? angleA : angleB;
        const otherPt = isSnappedToA ? pointB : pointA;

        // Tangent Line: Perpendicular to radius.
        // Tangent direction is snapAngle + PI/2 (CCW from radius).
        const tanDirAngle = normalize(snapAngle + Math.PI / 2);
        const tx = Math.cos(tanDirAngle);
        const ty = -Math.sin(tanDirAngle); // SVG Y-down

        // Extended line for visual
        tangentLine = {
            x1: snapPt.x - 200 * tx,
            y1: snapPt.y - 200 * ty,
            x2: snapPt.x + 200 * tx,
            y2: snapPt.y + 200 * ty
        };

        const chordAng = Math.atan2(-(otherPt.y - snapPt.y), otherPt.x - snapPt.x); // Math angle of chord

        // Calculate the two possible tangent ray angles
        const tanRay1 = normalize(snapAngle + Math.PI / 2);
        const tanRay2 = normalize(snapAngle - Math.PI / 2);

        // Ambiguity resolution (especially for Thales 90deg case):
        // We want the tangent ray that corresponds to the side "where C came from" (rawAngleC).
        // The vector from snapPt (B) to rawPointC approx aligns with the tangent.
        const rawPointC = getPoint(dragging === 'C' ? rawAngleC : angleC);
        const dirToRawC = Math.atan2(-(rawPointC.y - snapPt.y), rawPointC.x - snapPt.x);

        // Pick the ray closest to the direction of raw C
        const dist1 = circularDistance(dirToRawC, tanRay1);
        const dist2 = circularDistance(dirToRawC, tanRay2);

        let endAng;
        if (dist1 < dist2) {
            endAng = tanRay1;
        } else {
            endAng = tanRay2;
        }

        let startAng = chordAng;
        let sweepFlag;
        const diff = normalize(endAng - startAng);
        sweepFlag = (diff <= Math.PI) ? 0 : 1;

        // Verify if this ray forms the correct angle magnitude with chord?
        // Actually, if we pick the correct "side" (Ray), the angle magnitude is determined by geometry.
        // It should match targetAngle (or supplement).
        // Since inscribed angle is always <= 180, and we are locally consistent, this should work.

        // Generate path for the tangent-chord angle arc
        const r = inscribedArcRadius;
        const p1 = { x: snapPt.x + r * Math.cos(startAng), y: snapPt.y - r * Math.sin(startAng) };
        const p2 = { x: snapPt.x + r * Math.cos(endAng), y: snapPt.y - r * Math.sin(endAng) };

        // For the arc, we want the "small" arc, so large-arc-flag is 0.
        tangentAngleArc = `M ${snapPt.x} ${snapPt.y} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 ${sweepFlag} ${p2.x} ${p2.y} Z`;

        // Label position
        const arcMidAngle = startAng + (sweepFlag === 0 ? normalize(endAng - startAng) : normalize(startAng - endAng) - 2 * Math.PI) / 2;
        tanLabelPos = {
            x: snapPt.x + 60 * Math.cos(arcMidAngle),
            y: snapPt.y - 60 * Math.sin(arcMidAngle)
        };
    }

    // Determine final values to display
    let finalExhibitedAlpha = displayedInscribed;
    let finalInscribedPath = inscribedPath;
    let finalLabelPosInscribed = labelPosInscribed;
    let showRightAngle = false;

    if (isThales) {
        finalExhibitedAlpha = 90;
        showRightAngle = true;
    }
    // If tangent case is ALSO active, we might override path but value is 90 anyway.
    if (isTangentCase) {
        finalExhibitedAlpha = Math.round(centralAngleRad * 180 / Math.PI / 2);
        finalInscribedPath = tangentAngleArc;
        finalLabelPosInscribed = tanLabelPos;
    }

    // Right Angle Marker: Show if Thales is active.
    // Spec: "az alfa szögnek itt derékszögnek kellene lennie" -> If Thales, Alpha is 90.
    // If Tangent AND Thales (snapped to diameter end), Tangent Angle IS 90.
    // The Tangent Angle Arc (quarter circle) represents 90 deg visually.
    // Should we showing the Square marker?
    // User said: "alfa szögnek itt derékszögnek kellene lennie".
    // Tangent arc is a sector. Square marker is for triangle corner.
    // If we are in Tangent Case, we don't have a triangle C corner (C is at A/B).
    // So "Right Angle Marker" (Square) doesn't make geometric sense at A/B relative to diameter?
    // Actually, tangent is perp to diameter. We COULD show a square between Tangent and Diameter?
    // But our existing `thalesMarkerPath` code assumes C != A,B.
    // So let's rely on the `finalInscribedPath` (Tangent Arc) being 90 degrees visually.
    // And ensure text says 90.

    let thalesMarkerPath = '';
    // Only calculate classic Thales marker (triangle corner) if NOT tangent (C separate)
    if (showRightAngle && !isTangentCase) {
        const size = 14;
        const lenCA = Math.hypot(pointA.x - pointC.x, pointA.y - pointC.y);
        const lenCB = Math.hypot(pointB.x - pointC.x, pointB.y - pointC.y);
        const uCA = { x: (pointA.x - pointC.x) / lenCA, y: (pointA.y - pointC.y) / lenCA };
        const uCB = { x: (pointB.x - pointC.x) / lenCB, y: (pointB.y - pointC.y) / lenCB };

        const p1 = { x: pointC.x + uCA.x * size, y: pointC.y + uCA.y * size };
        const p2 = { x: pointC.x + (uCA.x + uCB.x) * size, y: pointC.y + (uCA.y + uCB.y) * size };
        const p3 = { x: pointC.x + uCB.x * size, y: pointC.y + uCB.y * size };

        thalesMarkerPath = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`;
    }

    return (
        <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg max-w-sm mx-auto my-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Interaktív Vizualizáció</h3>

            <div className="relative touch-none">
                <svg
                    ref={svgRef}
                    width={width}
                    height={height}
                    className="cursor-crosshair select-none"
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    {/* Circle */}
                    <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="#94a3b8" strokeWidth="2" />

                    {/* Highlighted Arc */}
                    <path d={highlightPath} fill="none" stroke={highlightColor} strokeWidth="4" strokeLinecap="round" />

                    {/* Central Angle Sector */}
                    <path d={centralPath} fill="rgba(59, 130, 246, 0.2)" stroke="none" />

                    {/* Inscribed Angle Sector (or Tangent-Chord Angle) */}
                    {finalInscribedPath && (
                        <path d={finalInscribedPath} fill="rgba(16, 185, 129, 0.2)" stroke="none" />
                    )}

                    {/* Thales Right Angle Marker (Classic) */}
                    {showRightAngle && !isTangentCase && (
                        <path d={thalesMarkerPath} fill="none" stroke="#ef4444" strokeWidth="2" />
                    )}

                    {/* Tangent Line */}
                    {tangentLine && (
                        <line
                            x1={tangentLine.x1} y1={tangentLine.y1}
                            x2={tangentLine.x2} y2={tangentLine.y2}
                            stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5"
                        />
                    )}

                    {/* Center Point O */}
                    <circle cx={center.x} cy={center.y} r="4" fill="#64748b" />
                    <text x={center.x + 10} y={center.y + 10} className="fill-slate-500 text-xs font-bold">O</text>

                    {/* Lines for Central Angle */}
                    <line x1={center.x} y1={center.y} x2={pointA.x} y2={pointA.y} stroke="#60a5fa" strokeWidth="2" />
                    <line x1={center.x} y1={center.y} x2={pointB.x} y2={pointB.y} stroke="#60a5fa" strokeWidth="2" />

                    {/* Lines for Inscribed Angle */}
                    <line x1={pointC.x} y1={pointC.y} x2={pointA.x} y2={pointA.y} stroke="#34d399" strokeWidth="2" />
                    <line x1={pointC.x} y1={pointC.y} x2={pointB.x} y2={pointB.y} stroke="#34d399" strokeWidth="2" />

                    {/* Angle Labels */}
                    <text x={labelPosCentral.x} y={labelPosCentral.y} textAnchor="middle" alignmentBaseline="middle" className="fill-blue-600 font-bold text-sm">β</text>
                    <text x={finalLabelPosInscribed.x} y={finalLabelPosInscribed.y} textAnchor="middle" alignmentBaseline="middle" className="fill-emerald-600 font-bold text-sm">α</text>

                    {/* Interactive Points */}
                    {['A', 'B', 'C'].map((p) => {
                        const pt = p === 'A' ? pointA : p === 'B' ? pointB : pointC;
                        const color = p === 'C' ? '#10b981' : '#3b82f6';
                        // If C is snapped to A, don't render C separately or make it small?
                        // If C is snapped to A, pointC == pointA.
                        // We should maybe hide C if it's snapped? 
                        // But user needs to drag it away.
                        // Let's keep it but maybe on top?
                        // SVG order matters. C is drawn last, so it's on top.
                        return (
                            <g
                                key={p}
                                className="cursor-grab active:cursor-grabbing"
                                onPointerDown={handlePointerDown(p as any)}
                            >
                                {/* Larger invisible hit area */}
                                <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />
                                {/* Outer glow */}
                                <circle cx={pt.x} cy={pt.y} r="10" fill={color} opacity={dragging === p ? 0.3 : 0.15} />
                                {/* Main dot */}
                                <circle cx={pt.x} cy={pt.y} r="7" fill={color} stroke="white" strokeWidth="2.5" />
                                <text x={pt.x + 15} y={pt.y + 5} className={`fill-${p === 'C' ? 'emerald' : 'blue'}-500 text-sm font-bold select-none pointer-events-none`}>{p}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className={`p-3 rounded-lg border transition-colors duration-300 ${isThales ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'}`}>
                    <div className={`text-xs font-bold uppercase mb-1 ${isThales ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isThales && isTangentCase ? <>THALÉSZ + ÉRINTŐ <span className="normal-case">(α)</span></>
                            : isThales ? <>THALÉSZ TÉTEL <span className="normal-case">(α)</span></>
                                : isTangentCase ? <>ÉRINTŐ SZÁRÚ <span className="normal-case">(α)</span></>
                                    : <>KERÜLETI SZÖG <span className="normal-case">(α)</span></>}
                    </div>
                    <div className={`text-2xl font-black ${isThales ? 'text-indigo-700 dark:text-indigo-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                        {finalExhibitedAlpha}°
                    </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Középponti Szög <span className="normal-case">(β)</span></div>
                    <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{displayedCentral}°</div>
                </div>
            </div>

            <div className="text-xs text-slate-400 mt-2 text-center italic min-h-[1.5em] flex flex-col justify-center">
                {(isThales && isTangentCase) ? (
                    <>
                        <span className="text-indigo-500 font-semibold block">Thalész tétele: az átmérő fölötti kerületi szög derékszög.</span>
                        <span className="text-amber-500 font-semibold block">Az érintő merőleges az érintési ponthoz tartozó sugárra.</span>
                    </>
                ) : isThales ? (
                    <span className="text-indigo-500 font-semibold">Thalész tétele: az átmérő fölötti kerületi szög derékszög.</span>
                ) : isTangentCase ? (
                    <span className="text-amber-500 font-semibold">Az érintő szárú kerületi szög egyenlő a középponti szög felével.</span>
                ) : (
                    "Húzd a pontokat a köríven! (Megfigyelheted: β = 2α)"
                )}
            </div>
        </div>
    );
};

export default CircleAngleVisualizer;
