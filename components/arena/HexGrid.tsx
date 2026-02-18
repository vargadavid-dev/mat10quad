import React, { useMemo } from 'react';
import { HexCoord, hexToPixel, getHexId, HEX_SIZE } from '../../utils/hex-grid';

interface HexGridProps {
    hexes: HexCoord[];
    owners: { [hexId: string]: string }; // 'Piros', 'Kék', etc.
    scores: { [hexId: string]: number }; // Shield/Health of the tile
    tileTypes?: { [hexId: string]: 'normal' | 'energy' | 'relay' | 'research' | 'unstable' };
    difficulties?: { [hexId: string]: 1 | 2 | 3 };
    difficultyVisible?: { [hexId: string]: boolean };
    onHexClick: (hex: HexCoord) => void;
    selectedHex?: HexCoord | null;
    activeTeam?: string; // Currently active team (for highlighting)
    myTeam?: string; // My own team (for reachability)
    className?: string;
    targetingType?: 'global' | 'adjacent' | null;
    isInteractive?: boolean; // New prop to control interactivity/highlighting
}

const TEAM_COLORS: { [key: string]: { stroke: string, fill: string, glow: string, gradient: string[], shieldColor: string } } = {
    'Piros': {
        stroke: '#ef4444',
        fill: 'rgba(239, 68, 68, 0.15)',
        glow: '#ef4444',
        gradient: ['#dc2626', '#ef4444', '#f87171'],
        shieldColor: '#fca5a5',
    },
    'Kék': {
        stroke: '#3b82f6',
        fill: 'rgba(59, 130, 246, 0.15)',
        glow: '#3b82f6',
        gradient: ['#2563eb', '#3b82f6', '#60a5fa'],
        shieldColor: '#93c5fd',
    },
    'Zöld': {
        stroke: '#22c55e',
        fill: 'rgba(34, 197, 94, 0.15)',
        glow: '#22c55e',
        gradient: ['#16a34a', '#22c55e', '#4ade80'],
        shieldColor: '#86efac',
    },
    'Sárga': {
        stroke: '#eab308',
        fill: 'rgba(234, 179, 8, 0.15)',
        glow: '#eab308',
        gradient: ['#ca8a04', '#eab308', '#facc15'],
        shieldColor: '#fde047',
    },
};

const NEUTRAL = {
    stroke: 'rgba(51, 65, 85, 0.4)',
    fill: 'rgba(15, 23, 42, 0.3)',
};

const HexGrid: React.FC<HexGridProps> = ({ hexes, owners, scores, tileTypes, difficulties, difficultyVisible, onHexClick, selectedHex, activeTeam, myTeam, className, targetingType = null, isInteractive = true }) => {
    // Calculate precise grid dimensions to center the SVG
    const { viewBox } = useMemo(() => {
        if (hexes.length === 0) return { viewBox: '0 0 0 0' };

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        hexes.forEach(hex => {
            const p = hexToPixel(hex, HEX_SIZE);
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        });

        const padding = HEX_SIZE * 2.5;
        const w = maxX - minX + padding;
        const h = maxY - minY + padding;

        return {
            viewBox: `${minX - HEX_SIZE * 1.25} ${minY - HEX_SIZE * 1.25} ${w} ${h}`,
        };
    }, [hexes]);

    // Hexagon points generator (flat-topped)
    const getHexPoints = (x: number, y: number, size: number) => {
        const angles = [0, 60, 120, 180, 240, 300];
        return angles.map(angle => {
            const rad = Math.PI / 180 * angle;
            return `${x + size * Math.cos(rad)},${y + size * Math.sin(rad)}`;
        }).join(' ');
    };

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={viewBox}
            className="overflow-visible select-none touch-manipulation"
            style={{ maxHeight: '100%' }}
        >
            <defs>
                {/* Glow filters per team */}
                {Object.entries(TEAM_COLORS).map(([team, colors]) => (
                    <filter key={`glow-${team}`} id={`glow-${team}`} x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feFlood floodColor={colors.glow} floodOpacity="0.6" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                ))}

                {/* Subtle grid glow for unowned */}
                <filter id="grid-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Selection pulse */}
                <filter id="select-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feFlood floodColor="#ffffff" floodOpacity="0.5" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Radial gradients per team for fill */}
                {Object.entries(TEAM_COLORS).map(([team, colors]) => (
                    <radialGradient key={`fill-${team}`} id={`fill-${team}`} cx="40%" cy="35%" r="70%">
                        <stop offset="0%" stopColor={colors.gradient[2]} stopOpacity="0.35" />
                        <stop offset="60%" stopColor={colors.gradient[1]} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={colors.gradient[0]} stopOpacity="0.05" />
                    </radialGradient>
                ))}

                {/* Neutral hex gradient - LIGHTENED for better visibility */}
                <radialGradient id="fill-neutral" cx="50%" cy="45%" r="70%">
                    <stop offset="0%" stopColor="#475569" stopOpacity="0.6" /> {/* slate-600 */}
                    <stop offset="100%" stopColor="#334155" stopOpacity="0.4" /> {/* slate-700 */}
                </radialGradient>
            </defs>

            {/* Connection lines between adjacent hexes (subtle grid overlay) */}
            {hexes.map(hex => {
                const { x, y } = hexToPixel(hex, HEX_SIZE);
                const id = getHexId(hex);
                const owner = owners[id];
                // Draw lines to right-side neighbors only (to avoid duplicates)
                const neighbors = [
                    { q: hex.q + 1, r: hex.r, s: hex.s - 1 },
                    { q: hex.q + 1, r: hex.r - 1, s: hex.s },
                    { q: hex.q, r: hex.r - 1, s: hex.s + 1 },
                ];
                return neighbors.map(n => {
                    const nId = getHexId(n);
                    const nHex = hexes.find(h => getHexId(h) === nId);
                    if (!nHex) return null;
                    const np = hexToPixel(nHex, HEX_SIZE);
                    const nOwner = owners[nId];
                    const sameOwner = owner && owner === nOwner;
                    return (
                        <line
                            key={`line-${id}-${nId}`}
                            x1={x} y1={y}
                            x2={np.x} y2={np.y}
                            stroke={sameOwner ? TEAM_COLORS[owner]?.stroke || '#1e293b' : 'rgba(148, 163, 184, 0.3)'} // Lighters lines
                            strokeWidth={sameOwner ? 1.5 : 0.5}
                            strokeDasharray={sameOwner ? 'none' : '4 4'}
                            opacity={sameOwner ? 0.5 : 0.5}
                        />
                    );
                });
            })}

            {/* Hex nodes */}
            {hexes.map(hex => {
                const id = getHexId(hex);
                const { x, y } = hexToPixel(hex, HEX_SIZE);
                const owner = owners[id];
                const score = scores[id] || 0;
                const isSelected = selectedHex && getHexId(selectedHex) === id;
                const teamColor = owner ? TEAM_COLORS[owner] : null;

                // Reachability Logic
                let isReachable = false;
                if (isInteractive) {
                    if (targetingType === 'global') {
                        isReachable = true; // Always reachable (Wormhole)
                    } else if (myTeam) {
                        if (owner === myTeam) {
                            isReachable = true; // My hexes always reachable
                        } else {
                            // Check neighbors
                            const neighbors = [
                                { q: hex.q + 1, r: hex.r, s: hex.s - 1 },
                                { q: hex.q + 1, r: hex.r - 1, s: hex.s },
                                { q: hex.q, r: hex.r - 1, s: hex.s + 1 },
                                { q: hex.q - 1, r: hex.r, s: hex.s + 1 },
                                { q: hex.q - 1, r: hex.r + 1, s: hex.s },
                                { q: hex.q, r: hex.r + 1, s: hex.s - 1 }
                            ];
                            isReachable = neighbors.some(n => owners[getHexId(n)] === myTeam);
                        }
                    } else {
                        // Bystander/Host/God mode
                        isReachable = true;
                    }
                }

                // If user is HOST (no myTeam), we want to see everything clearly
                // BUT if isInteractive is false, we don't want reachability opacity/filters.
                const isHostView = !myTeam;

                // Visual Styles based on Reachability
                // If not interactive, use full opacity (1) and NO filters (except maybe simple glow for owned)
                const opacityStyle = isInteractive ? (isReachable ? 1 : 0.4) : 1;

                // If not interactive, show ONLY owner glows, not grid glow for neutral
                const filterStyle = isInteractive
                    ? (isReachable
                        ? (isSelected ? 'url(#select-glow)' : (owner ? `url(#glow-${owner})` : 'url(#grid-glow)'))
                        : 'none')
                    : (owner ? `url(#glow-${owner})` : 'none');

                // Reachable Marker (e.g. slight highlight on empty hexes)
                const isAttackableTarget = isReachable && !owner;

                return (
                    <g
                        key={id}
                        onClick={() => isReachable && onHexClick(hex)} // Only click if reachable? Or let GameClient handle msg? Let's allow click but visual cue is here.
                        // Actually, user wants validation on click, so click should fire, but maybe visual cursor change?
                        // Let's keep onClick and visual dimming.
                        className={isReachable ? "cursor-pointer" : "cursor-not-allowed"}
                        style={{
                            filter: filterStyle,
                            opacity: opacityStyle,
                            transition: 'all 0.5s ease',
                        }}
                    >
                        {/* Outer ring for owned hexes (shield indicator) */}
                        {owner && score >= 3 && (
                            <polygon
                                points={getHexPoints(x, y, HEX_SIZE + 3)}
                                fill="none"
                                stroke={teamColor?.shieldColor}
                                strokeWidth="2"
                                opacity="0.6"
                                className="animate-pulse"
                            />
                        )}

                        {/* Main Hexagon */}
                        <polygon
                            points={getHexPoints(x, y, HEX_SIZE - 2)}
                            fill={owner ? `url(#fill-${owner})` : (isAttackableTarget ? 'rgba(255,255,255,0.15)' : 'url(#fill-neutral)')}
                            stroke={owner ? teamColor?.stroke : (isAttackableTarget ? 'rgba(255,255,255,0.5)' : '#94a3b8')} // Lighter stroke for neutral
                            strokeWidth={isSelected ? 3 : (owner ? 2 : (isAttackableTarget ? 2 : 1.5))}
                            strokeOpacity={isReachable ? 1 : 0.3}
                        />

                        {/* Difficulty Indicators (Dots/Stars) */}
                        {/* Always show if strictly visible OR if Host view */}
                        {(difficultyVisible?.[id] || isHostView) && difficulties?.[id] && (
                            <g transform={`translate(${x}, ${y + HEX_SIZE * 0.5})`}>
                                {Array.from({ length: difficulties[id]! }).map((_, i, arr) => (
                                    <circle
                                        key={i}
                                        cx={(i - (arr.length - 1) / 2) * 8}
                                        cy={0}
                                        r={2.5} // Larger dots
                                        fill={owner ? "white" : "#fbbf24"} // Gold for unowned, White for owned
                                        opacity={0.9}
                                        filter="drop-shadow(0 0 2px rgba(0,0,0,0.5))"
                                    />
                                ))}
                            </g>
                        )}

                        {/* Inner hex border accent for owned */}
                        {owner && (
                            <polygon
                                points={getHexPoints(x, y, HEX_SIZE - 8)}
                                fill="none"
                                stroke={teamColor!.stroke}
                                strokeWidth={0.5}
                                opacity={0.2}
                            />
                        )}

                        {/* Shield number */}
                        {owner && score > 0 && (
                            <>
                                {/* Shield background circle */}
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={12}
                                    fill={`${teamColor!.gradient[0]}cc`} // More opaque
                                    stroke={teamColor!.shieldColor}
                                    strokeWidth={1.5}
                                />
                                <text
                                    x={x}
                                    y={y}
                                    dy=".35em"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="13"
                                    fontWeight="900"
                                    fontFamily="monospace"
                                    className="pointer-events-none"
                                    style={{ textShadow: '0 0 6px rgba(0,0,0,0.8)' }}
                                >
                                    {score}
                                </text>
                            </>
                        )}

                        {/* Special Tile Icon - if not HQs (which have score 5 usually) 
                            or just show it for all special types 
                        */}
                        {tileTypes?.[id] && tileTypes[id] !== 'normal' && (
                            <text
                                x={x}
                                y={y - HEX_SIZE * 0.4} // Move to TOP of hex to not overlap with difficulty dots
                                dy=".35em"
                                textAnchor="middle"
                                fontSize="16" // Larger font
                                className="pointer-events-none filter drop-shadow-md select-none"
                            >
                                {tileTypes[id] === 'energy' ? '⚡' :
                                    tileTypes[id] === 'relay' ? '📡' :
                                        tileTypes[id] === 'research' ? '🧪' :
                                            tileTypes[id] === 'unstable' ? '💥' : ''}
                            </text>
                        )}

                        {/* Hover overlay */}
                        <polygon
                            points={getHexPoints(x, y, HEX_SIZE - 2)}
                            fill="white"
                            opacity={0}
                            className="transition-opacity duration-200 hover:opacity-10"
                        />
                    </g>
                );
            })}
        </svg>
    );
};

export default HexGrid;
