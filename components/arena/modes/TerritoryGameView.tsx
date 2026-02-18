import React from 'react';
import { XCircle, Users } from 'lucide-react';
import HexGrid from '../HexGrid';
import { CARD_DEFINITIONS, CardId } from '../../../utils/cards';

interface TerritoryGameViewProps {
    gameData: any;
    players: string[];
    onStopGame: () => void;
    // We might need to pass down hex click handlers if not handled inside HexGrid or here
    onHexClick?: (hex: any) => void;
    roomCode: string;
}

const TerritoryGameView: React.FC<TerritoryGameViewProps> = ({
    gameData,
    players,
    onStopGame,
    onHexClick,
    roomCode
}) => {
    if (!gameData?.hexes) return null;

    const teamKeys = Object.keys(gameData.teams || {}).filter(t => gameData.teams[t] && gameData.teams[t].length > 0);
    const totalHexes = gameData.hexes.length;
    const activeTeam = gameData.activeTeam || teamKeys[0];

    const getTeamGlowClass = (team: string) => {
        switch (team) {
            case 'Piros': return 'team-glow-red';
            case 'Kék': return 'team-glow-blue';
            case 'Zöld': return 'team-glow-green';
            case 'Sárga': return 'team-glow-yellow';
            default: return '';
        }
    };

    const getTeamTextColor = (team: string) => {
        switch (team) {
            case 'Piros': return 'text-red-400';
            case 'Kék': return 'text-blue-400';
            case 'Zöld': return 'text-green-400';
            case 'Sárga': return 'text-yellow-400';
            default: return 'text-slate-400';
        }
    };

    const getTeamBorderColor = (team: string) => {
        switch (team) {
            case 'Piros': return 'border-red-500/40';
            case 'Kék': return 'border-blue-500/40';
            case 'Zöld': return 'border-green-500/40';
            case 'Sárga': return 'border-yellow-500/40';
            default: return 'border-slate-700/40';
        }
    };

    const getTeamBarColor = (team: string) => {
        switch (team) {
            case 'Piros': return 'bg-gradient-to-r from-red-600 to-red-400';
            case 'Kék': return 'bg-gradient-to-r from-blue-600 to-blue-400';
            case 'Zöld': return 'bg-gradient-to-r from-green-600 to-green-400';
            case 'Sárga': return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
            default: return 'bg-slate-600';
        }
    };

    const getTeamDisplayName = (team: string) => {
        switch (team) {
            case 'Piros': return 'Vörös Csillagköd';
            case 'Kék': return 'Kék Nebula';
            case 'Zöld': return 'Zöld Szupernóva';
            case 'Sárga': return 'Arany Napkorona';
            default: return team;
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950 starfield nebula-bg flex flex-col overflow-hidden animate-in fade-in duration-700" style={{ zIndex: 50 }}>

            {/* Corner HUD accents */}
            <div className="absolute top-3 left-3 w-24 h-24 border-l-2 border-t-2 border-cyan-500/20 rounded-tl-2xl pointer-events-none z-40"></div>
            <div className="absolute top-3 right-3 w-24 h-24 border-r-2 border-t-2 border-purple-500/20 rounded-tr-2xl pointer-events-none z-40"></div>
            <div className="absolute bottom-3 left-3 w-24 h-24 border-l-2 border-b-2 border-cyan-500/20 rounded-bl-2xl pointer-events-none z-40"></div>
            <div className="absolute bottom-3 right-3 w-24 h-24 border-r-2 border-b-2 border-purple-500/20 rounded-br-2xl pointer-events-none z-40"></div>

            {/* Top decorative line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-40"></div>

            {/* Header */}
            <div className="relative z-30 flex justify-between items-center px-6 py-4">
                <div className="flex flex-col">
                    <h1 className="text-4xl md:text-5xl font-black tracking-wider"
                        style={{
                            background: 'linear-gradient(135deg, #818cf8, #c084fc, #f472b6, #60a5fa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 20px rgba(129, 140, 248, 0.4))',
                        }}>
                        MATEKVERZUM
                    </h1>
                    <span className="text-xs text-slate-500 uppercase tracking-[0.3em] font-bold mt-1">
                        Galaktikus Hódítás
                    </span>
                </div>

                {/* Room Code Display */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 bg-slate-900/80 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md flex flex-col items-center shadow-2xl z-50">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Szoba Kód</span>
                    <span className="text-2xl font-mono font-black text-white tracking-[0.2em]">{roomCode}</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Active Turn Indicator */}
                    <div className={`
                        px-4 py-2 rounded-lg border flex items-center gap-3 backdrop-blur-md transition-all duration-500
                        ${getTeamTextColor(activeTeam)}
                        ${getTeamBorderColor(activeTeam)}
                        ${getTeamGlowClass(activeTeam)}
                        bg-slate-900/60
                    `}>
                        <div className="flex flex-col items-end">
                            <span className="text-xs uppercase opacity-70">Jelenlegi kör</span>
                            <span className="font-bold text-lg">{getTeamDisplayName(activeTeam)}</span>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]"></div>
                    </div>

                    <button onClick={onStopGame} className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                        <XCircle className="w-4 h-4 mr-2 inline" />
                        Leállítás
                    </button>
                </div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 relative flex">
                {/* LEFT: Team Stats */}
                <div className="w-72 p-4 flex flex-col gap-4 z-30 overflow-y-auto custom-scrollbar">
                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 border-l-2 border-cyan-500 pl-2">
                        Birodalmak
                    </div>

                    {teamKeys.map(team => {
                        // const score = gameData.scores[team] || 0; 
                        const territoryCount = Object.values(gameData.owners).filter(o => o === team).length;
                        const totalScore = Object.entries(gameData.owners)
                            .filter(([id, owner]) => owner === team)
                            .reduce((acc, [id]) => acc + (gameData.scores[id] || 0), 0);
                        const isActive = activeTeam === team;

                        return (
                            <div key={team} className={`
                                relative p-4 rounded-xl border transition-all duration-300
                                ${isActive ? `${getTeamGlowClass(team)} scale-105 z-10 bg-slate-800/80` : 'bg-slate-900/40 border-slate-700/30 opacity-80'}
                                ${getTeamBorderColor(team)}
                            `}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${getTeamTextColor(team).replace('text-', 'bg-')}`}></div>
                                        <span className={`font-bold ${getTeamTextColor(team)}`}>
                                            {getTeamDisplayName(team)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black leading-none text-white">{territoryCount}</span>
                                        <div className="text-[10px] text-slate-400 font-mono mt-1" title="Összesített pajzsérték">
                                            🛡️ {totalScore}
                                        </div>
                                    </div>
                                </div>

                                {/* Simple bar visual */}
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${getTeamBarColor(team)}`} style={{ width: `${(territoryCount / totalHexes) * 100}%` }}></div>
                                </div>

                                {/* Active Player in Team? */}
                                {isActive && (
                                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1 animate-pulse">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        {players.find(p => p.startsWith('BOT_') && gameData.teams[team].includes(p)) || 'Játékos'} gondolkodik...
                                    </div>
                                )}

                            </div>
                        );
                    })}
                </div>

                {/* CENTER: Map */}
                <div className="flex-1 relative flex items-center justify-center p-8">
                    {/* Galaxy Map Container - Boxed */}
                    <div className="relative w-full h-full border border-slate-700/50 bg-slate-900/30 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl shadow-black/50">
                        {/* Map Background Glow */}
                        <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10 transform scale-150 transition-transform duration-700">
                            <div className="absolute -top-12 left-0 right-0 text-center text-xs font-mono text-slate-500 tracking-[0.5em] opacity-40">GALAXY MAP</div>
                            <HexGrid
                                hexes={gameData.hexes}
                                owners={gameData.owners}
                                scores={gameData.scores}
                                tileTypes={gameData.tileTypes || gameData.territoryState?.tileTypes || {}}
                                difficulties={gameData.difficulties || gameData.territoryState?.difficulties}
                                difficultyVisible={gameData.difficultyVisible || gameData.territoryState?.difficultyVisible}
                                onHexClick={(hex) => {
                                    if (onHexClick) onHexClick(hex);
                                    else {
                                        // Host defaults
                                        const id = `${hex.q},${hex.r},${hex.s}`;
                                        console.log('Host clicked hex:', id, gameData.owners[id]);
                                    }
                                }}
                                isInteractive={false}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Rankings & Logs */}
                <div className="w-80 p-4 z-30 flex flex-col gap-4">
                    {/* Leaderboard Card */}
                    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-4">
                        <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 border-l-2 border-purple-500 pl-2">
                            Ranglista
                        </div>
                        <div className="space-y-2">
                            {teamKeys
                                .map(t => ({
                                    team: t,
                                    count: Object.values(gameData.owners).filter(o => o === t).length,
                                    score: Object.entries(gameData.owners)
                                        .filter(([id, owner]) => owner === t)
                                        .reduce((acc, [id]) => acc + (gameData.scores[id] || 0), 0)
                                }))
                                .sort((a, b) => b.count - a.count || b.score - a.score)
                                .map((item, idx) => (
                                    <div key={item.team} className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-slate-500 w-4">{idx + 1}</span>
                                            <span className={`font-bold ${getTeamTextColor(item.team)}`}>{getTeamDisplayName(item.team)}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-white block leading-none text-lg">{item.count}</span>
                                            <span className="text-[10px] text-slate-400 font-mono" title="Összesített pajzsérték">
                                                🛡️ {item.score}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* Cards Status Card */}
                    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex-1">
                        <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-3 border-l-2 border-yellow-500 pl-2">
                            Galaktikus Kártyák
                        </div>
                        <div className="space-y-3 overflow-y-auto max-h-60 custom-scrollbar pr-2">
                            {teamKeys.map(team => {
                                const cards = gameData.teamCards?.[team]?.hand || [];
                                if (cards.length === 0) return null;

                                return (
                                    <div key={team} className="bg-black/20 rounded-lg p-2">
                                        <div className={`text-xs font-bold mb-1 ${getTeamTextColor(team)}`}>{getTeamDisplayName(team)}</div>
                                        <div className="flex flex-wrap gap-1">
                                            {cards.map((c: string, i: number) => (
                                                <div key={i} className="w-6 h-6 rounded bg-slate-700 border border-slate-500 flex items-center justify-center text-[10px]" title={c}>
                                                    {CARD_DEFINITIONS[c as CardId]?.icon || '?'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Status Footer */}
                    <div className="mt-auto bg-slate-800/80 rounded-xl p-3 text-xs text-slate-400 grid grid-cols-2 gap-2">
                        <div>Státusz</div>
                        <div className="text-right">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1"></span>
                            Aktív
                        </div>
                        <div>Összes mező</div>
                        <div className="text-right font-bold text-white">{totalHexes}</div>
                        <div>Elfoglalva</div>
                        <div className="text-right font-bold text-white">{Object.keys(gameData.owners).length}</div>
                        <div>Szabad</div>
                        <div className="text-right font-bold text-cyan-400">{totalHexes - Object.keys(gameData.owners).length}</div>
                    </div>
                </div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent z-40"></div>
        </div>
    );
};

export default TerritoryGameView;
