import React, { useState, useEffect, useRef } from 'react';
import { XCircle, Users, Shield, Zap, Trophy, Crosshair, Activity, Clock, Flame, Sparkles, Layers, Compass } from 'lucide-react';
import HexGrid from '../HexGrid';
import { CARD_DEFINITIONS, CardId } from '../../../utils/cards';

interface TerritoryGameViewProps {
    gameData: any;
    players: string[];
    onStopGame: () => void;
    onHexClick?: (hex: any) => void;
    roomCode: string;
}

interface BattleEvent {
    id: string;
    timestamp: string;
    team: string;
    message: string;
    type: 'capture' | 'defense' | 'card' | 'turn';
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

    // Live Battle Feed state
    const [battleEvents, setBattleEvents] = useState<BattleEvent[]>(() => [
        {
            id: 'init-1',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            team: activeTeam,
            message: 'A csillagközi harc megkezdődött. Védelmi pajzsok aktívak.',
            type: 'turn'
        }
    ]);

    // Track previous owners to generate dynamic live feed events
    const prevOwnersRef = useRef<{ [hexId: string]: string }>({});

    useEffect(() => {
        if (!gameData?.owners) return;
        const prevOwners = prevOwnersRef.current;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        Object.entries(gameData.owners).forEach(([hexId, owner]) => {
            const prevOwner = prevOwners[hexId];
            if (prevOwner !== undefined && prevOwner !== owner) {
                const teamName = getTeamDisplayName(owner as string);
                const eventMsg = prevOwner
                    ? `${teamName} visszafoglalta a [${hexId}] szektort ${getTeamDisplayName(prevOwner)}-tól!`
                    : `${teamName} sikeresen kolonizálta a [${hexId}] szektort!`;

                setBattleEvents(prev => [
                    {
                        id: `event-${Date.now()}-${Math.random()}`,
                        timestamp: now,
                        team: owner as string,
                        message: eventMsg,
                        type: 'capture'
                    },
                    ...prev.slice(0, 14) // Keep last 15
                ]);
            }
        });

        prevOwnersRef.current = { ...gameData.owners };
    }, [gameData?.owners]);

    // Turn change event in feed
    const prevActiveTeamRef = useRef<string>(activeTeam);
    useEffect(() => {
        if (prevActiveTeamRef.current !== activeTeam) {
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setBattleEvents(prev => [
                {
                    id: `turn-${Date.now()}`,
                    timestamp: now,
                    team: activeTeam,
                    message: `Kör átadva: ${getTeamDisplayName(activeTeam)} van lépésen.`,
                    type: 'turn'
                },
                ...prev.slice(0, 14)
            ]);
            prevActiveTeamRef.current = activeTeam;
        }
    }, [activeTeam]);

    const getTeamGlowClass = (team: string) => {
        switch (team) {
            case 'Piros': return 'shadow-[0_0_25px_rgba(239,68,68,0.35)]';
            case 'Kék': return 'shadow-[0_0_25px_rgba(59,130,246,0.35)]';
            case 'Zöld': return 'shadow-[0_0_25px_rgba(16,185,129,0.35)]';
            case 'Sárga': return 'shadow-[0_0_25px_rgba(245,158,11,0.35)]';
            default: return '';
        }
    };

    const getTeamTextColor = (team: string) => {
        switch (team) {
            case 'Piros': return 'text-red-400';
            case 'Kék': return 'text-blue-400';
            case 'Zöld': return 'text-emerald-400';
            case 'Sárga': return 'text-amber-400';
            default: return 'text-slate-400';
        }
    };

    const getTeamBorderColor = (team: string) => {
        switch (team) {
            case 'Piros': return 'border-red-500/50';
            case 'Kék': return 'border-blue-500/50';
            case 'Zöld': return 'border-emerald-500/50';
            case 'Sárga': return 'border-amber-500/50';
            default: return 'border-slate-700/50';
        }
    };

    const getTeamBgColor = (team: string) => {
        switch (team) {
            case 'Piros': return 'bg-red-500/10';
            case 'Kék': return 'bg-blue-500/10';
            case 'Zöld': return 'bg-emerald-500/10';
            case 'Sárga': return 'bg-amber-500/10';
            default: return 'bg-slate-800/20';
        }
    };

    const getTeamBarGradient = (team: string) => {
        switch (team) {
            case 'Piros': return 'from-red-600 via-rose-500 to-red-400';
            case 'Kék': return 'from-blue-600 via-cyan-500 to-blue-400';
            case 'Zöld': return 'from-emerald-600 via-teal-500 to-emerald-400';
            case 'Sárga': return 'from-amber-600 via-yellow-500 to-amber-300';
            default: return 'from-slate-600 to-slate-400';
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

    const getTeamIcon = (team: string) => {
        switch (team) {
            case 'Piros': return '🔴';
            case 'Kék': return '🔵';
            case 'Zöld': return '🟢';
            case 'Sárga': return '🟡';
            default: return '⚪';
        }
    };

    // Calculate Faction Standings
    const factionStandings = teamKeys
        .map(t => {
            const count = Object.values(gameData.owners).filter(o => o === t).length;
            const score = Object.entries(gameData.owners)
                .filter(([id, owner]) => owner === t)
                .reduce((acc, [id]) => acc + (gameData.scores[id] || 0), 0);
            const percentage = Math.round((count / totalHexes) * 100);
            return {
                team: t,
                count,
                score,
                percentage
            };
        })
        .sort((a, b) => b.count - a.count || b.score - a.score);

    const occupiedCount = Object.keys(gameData.owners).length;
    const neutralCount = totalHexes - occupiedCount;
    const neutralPercentage = Math.round((neutralCount / totalHexes) * 100);

    return (
        <div className="fixed inset-0 bg-[#060a17] text-slate-100 flex flex-col overflow-hidden select-none" style={{ zIndex: 50 }}>
            {/* Deep Space Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(59,130,246,0.12),rgba(0,0,0,0))] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_60%,rgba(239,68,68,0.08),rgba(0,0,0,0))] pointer-events-none"></div>

            {/* Sci-Fi Decorative Corner Brackets */}
            <div className="absolute top-2 left-2 w-16 h-16 border-l-2 border-t-2 border-cyan-400/40 rounded-tl-xl pointer-events-none z-40"></div>
            <div className="absolute top-2 right-2 w-16 h-16 border-r-2 border-t-2 border-purple-400/40 rounded-tr-xl pointer-events-none z-40"></div>
            <div className="absolute bottom-2 left-2 w-16 h-16 border-l-2 border-b-2 border-cyan-400/40 rounded-bl-xl pointer-events-none z-40"></div>
            <div className="absolute bottom-2 right-2 w-16 h-16 border-r-2 border-b-2 border-purple-400/40 rounded-br-xl pointer-events-none z-40"></div>

            {/* TOP BAR / TACTICAL COMMAND HEADER */}
            <header className="relative z-30 px-6 py-3 border-b border-cyan-500/20 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between gap-4">
                {/* Brand & Mode */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-cyan-400">
                            <Compass className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                                MATEKVERZUM
                            </h1>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 tracking-widest font-bold">
                                WAR ROOM
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
                            <Crosshair className="w-3 h-3 text-cyan-400" /> Galaktikus Hódítás // Taktikai Térkép
                        </span>
                    </div>
                </div>

                {/* Central Holo-Turn Beacon */}
                <div className="flex items-center gap-3">
                    {/* Room Code Pill */}
                    <div className="bg-slate-900/80 border border-cyan-500/30 px-4 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-2 shadow-lg shadow-cyan-500/5">
                        <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-bold">Szoba Kód:</span>
                        <span className="font-mono font-black text-lg text-white tracking-[0.2em]">{roomCode}</span>
                    </div>

                    {/* Active Turn Indicator */}
                    <div className={`
                        px-4 py-1.5 rounded-xl border flex items-center gap-3 backdrop-blur-md transition-all duration-500
                        ${getTeamTextColor(activeTeam)}
                        ${getTeamBorderColor(activeTeam)}
                        ${getTeamBgColor(activeTeam)}
                        ${getTeamGlowClass(activeTeam)}
                    `}>
                        <div className="relative flex items-center justify-center">
                            <div className="w-3.5 h-3.5 rounded-full bg-current animate-ping opacity-75"></div>
                            <div className="w-3 h-3 rounded-full bg-current absolute"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-75">Körön van</span>
                            <span className="font-black text-sm tracking-wide flex items-center gap-1.5">
                                {getTeamDisplayName(activeTeam)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Game Controls */}
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
                        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>SZIMULÁCIÓ AKTÍV</span>
                    </div>
                    <button
                        onClick={onStopGame}
                        className="bg-red-500/10 hover:bg-red-500/25 border border-red-500/40 text-red-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-red-500/20 flex items-center gap-2 active:scale-95"
                    >
                        <XCircle className="w-4 h-4 text-red-400" />
                        Játék Leállítása
                    </button>
                </div>
            </header>

            {/* REAL-TIME GALACTIC DOMINANCE BAR */}
            <div className="relative z-20 px-6 py-2 bg-slate-950/90 border-b border-white/5 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                        <Layers className="w-3.5 h-3.5" /> Galaktikus Területi Kontroll
                    </span>
                    <span>Összes szektor: {totalHexes} ({occupiedCount} elfoglalva / {neutralCount} semleges)</span>
                </div>
                {/* Segmented multi-color progress bar */}
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex border border-white/10 shadow-inner p-[1px]">
                    {factionStandings.map(item => (
                        <div
                            key={item.team}
                            className={`h-full bg-gradient-to-r ${getTeamBarGradient(item.team)} transition-all duration-700 relative group`}
                            style={{ width: `${(item.count / totalHexes) * 100}%` }}
                            title={`${getTeamDisplayName(item.team)}: ${item.count} szektor (${item.percentage}%)`}
                        ></div>
                    ))}
                    {neutralCount > 0 && (
                        <div
                            className="h-full bg-slate-800/80 transition-all duration-700"
                            style={{ width: `${(neutralCount / totalHexes) * 100}%` }}
                            title={`Semleges szektorok: ${neutralCount} (${neutralPercentage}%)`}
                        ></div>
                    )}
                </div>
            </div>

            {/* MAIN GAME DASHBOARD / 3-COLUMN TACTICAL HUD */}
            <div className="flex-1 relative flex overflow-hidden">

                {/* 1. LEFT PANEL: EMPIRE COMMAND & UNIFIED LEADERBOARD */}
                <aside className="w-80 p-4 flex flex-col gap-3 z-30 overflow-y-auto custom-scrollbar border-r border-white/5 bg-slate-950/40 backdrop-blur-md">
                    <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                        <div className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <Trophy className="w-3.5 h-3.5 text-cyan-400" /> Birodalmak Ranglistája
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{factionStandings.length} Frakció</span>
                    </div>

                    <div className="flex flex-col gap-2.5 flex-1">
                        {factionStandings.map((item, index) => {
                            const isActive = activeTeam === item.team;
                            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

                            return (
                                <div
                                    key={item.team}
                                    className={`
                                        relative p-3.5 rounded-2xl border transition-all duration-500
                                        ${isActive
                                            ? `bg-slate-900/90 ${getTeamBorderColor(item.team)} ${getTeamGlowClass(item.team)} scale-[1.02] z-10`
                                            : 'bg-slate-900/40 border-white/5 hover:border-white/10 opacity-85'
                                        }
                                    `}
                                >
                                    {/* Top Row: Medal, Name, Active Ring */}
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base select-none">{medal}</span>
                                            <span className="text-sm">{getTeamIcon(item.team)}</span>
                                            <span className={`font-black text-sm tracking-wide ${getTeamTextColor(item.team)}`}>
                                                {getTeamDisplayName(item.team)}
                                            </span>
                                        </div>

                                        {/* Large Territory Count */}
                                        <div className="text-right flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-white font-mono leading-none">{item.count}</span>
                                            <span className="text-[10px] text-slate-400 uppercase font-mono">SZKT</span>
                                        </div>
                                    </div>

                                    {/* Stats Pill Row */}
                                    <div className="grid grid-cols-2 gap-1.5 mb-2.5 text-xs font-mono">
                                        <div className="bg-slate-950/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-white/5">
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Shield className="w-3 h-3 text-cyan-400" /> Pajzserő:
                                            </span>
                                            <span className="font-bold text-white font-mono">{item.score}</span>
                                        </div>
                                        <div className="bg-slate-950/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-white/5">
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Flame className="w-3 h-3 text-amber-400" /> Kontroll:
                                            </span>
                                            <span className="font-bold text-amber-300 font-mono">{item.percentage}%</span>
                                        </div>
                                    </div>

                                    {/* Faction Progress Bar */}
                                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mb-1.5">
                                        <div
                                            className={`h-full bg-gradient-to-r ${getTeamBarGradient(item.team)} transition-all duration-700`}
                                            style={{ width: `${Math.max(5, (item.count / totalHexes) * 100)}%` }}
                                        ></div>
                                    </div>

                                    {/* Active Player Status with Pulse Wave */}
                                    {isActive && (
                                        <div className="mt-2 text-[11px] font-mono text-cyan-300 flex items-center justify-between bg-cyan-950/30 px-2.5 py-1 rounded-lg border border-cyan-500/20 animate-pulse">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                                                {players.find(p => p.startsWith('BOT_') && gameData.teams[item.team]?.includes(p)) || 'Játékos'} számol...
                                            </span>
                                            <Clock className="w-3 h-3 text-cyan-400" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Quick Legend */}
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
                        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Pajzs Mechanika</div>
                        <div className="flex items-center justify-between">
                            <span>🛡️ 3-5 szint:</span>
                            <span className="text-emerald-400 font-semibold">Biztonságos (Védett)</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>🛡️ 1-2 szint:</span>
                            <span className="text-rose-400 font-semibold">Sebezhető (Foglalható)</span>
                        </div>
                    </div>
                </aside>

                {/* 2. CENTER PANEL: TACTICAL HOLOGRAPHIC GALAXY MAP */}
                <main className="flex-1 relative flex flex-col items-center justify-center p-4 lg:p-6 overflow-hidden">
                    {/* Holo Map Glass Frame */}
                    <div className="relative w-full h-full border border-cyan-500/20 bg-slate-950/60 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden shadow-2xl shadow-black/80">

                        {/* Tactical Radar Background Grid (Concentric Circles) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <div className="w-[300px] h-[300px] rounded-full border border-cyan-400/30"></div>
                            <div className="w-[520px] h-[520px] rounded-full border border-cyan-400/20 absolute"></div>
                            <div className="w-[740px] h-[740px] rounded-full border border-cyan-400/10 absolute"></div>
                            {/* Crosshair Lines */}
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent absolute"></div>
                            <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent absolute"></div>
                        </div>

                        {/* Top HUD Coordinates Badge */}
                        <div className="absolute top-4 left-6 right-6 flex justify-between items-center pointer-events-none z-20">
                            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400/80 uppercase tracking-widest bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-md">
                                <Crosshair className="w-3 h-3 text-cyan-400 animate-[spin_8s_linear_infinite]" />
                                <span>GRID // SECTOR-MATRIX-37</span>
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest bg-slate-900/80 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                                <span>NÉZET: TACTICAL-ORBITAL</span>
                            </div>
                        </div>

                        {/* HexGrid Interactive Area */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
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
                                        const id = `${hex.q},${hex.r},${hex.s}`;
                                        console.log('Host clicked hex:', id, gameData.owners[id]);
                                    }
                                }}
                                isInteractive={false}
                            />
                        </div>

                        {/* Bottom HUD Coordinates Badge */}
                        <div className="absolute bottom-4 left-6 flex items-center gap-4 text-[10px] font-mono text-slate-500 pointer-events-none z-20">
                            <span>HEXAGONAL TOPOLOGY // DUAL-TIER SHIELDS</span>
                            <span>•</span>
                            <span>PEER-SYNC: AKTÍV</span>
                        </div>
                    </div>
                </main>

                {/* 3. RIGHT PANEL: TACTICAL ARSENAL & LIVE BATTLE FEED */}
                <aside className="w-80 p-4 flex flex-col gap-3.5 z-30 overflow-y-auto custom-scrollbar border-l border-white/5 bg-slate-950/40 backdrop-blur-md">

                    {/* A. TACTICAL CARDS (Visual Mini-Cards) */}
                    <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20">
                            <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Galaktikus Kártyák
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">Taktikai Arzenál</span>
                        </div>

                        <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                            {teamKeys.map(team => {
                                const cards = gameData.teamCards?.[team]?.hand || [];
                                if (cards.length === 0) return null;

                                // Count duplicates
                                const cardCounts = cards.reduce((acc: { [id: string]: number }, cardId: string) => {
                                    acc[cardId] = (acc[cardId] || 0) + 1;
                                    return acc;
                                }, {});

                                return (
                                    <div key={team} className="bg-slate-950/70 rounded-xl p-2.5 border border-white/5">
                                        <div className={`text-[11px] font-bold mb-1.5 flex items-center gap-1.5 ${getTeamTextColor(team)}`}>
                                            <span>{getTeamIcon(team)}</span>
                                            <span>{getTeamDisplayName(team)}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {Object.entries(cardCounts).map(([cardId, count]) => {
                                                const def = CARD_DEFINITIONS[cardId as CardId];
                                                if (!def) return null;
                                                return (
                                                    <div
                                                        key={cardId}
                                                        className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 rounded-lg p-1.5 flex items-center justify-between gap-1 shadow-sm transition-all"
                                                        title={`${def.name}: ${def.description}`}
                                                    >
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <span className="text-base select-none">{def.icon}</span>
                                                            <span className="text-[10px] font-bold text-white truncate">{def.name}</span>
                                                        </div>
                                                        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/40">
                                                            x{count as number}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Empty cards fallback hint */}
                            {teamKeys.every(team => (gameData.teamCards?.[team]?.hand || []).length === 0) && (
                                <div className="text-center py-4 px-2 text-slate-500 text-xs font-mono">
                                    <p className="mb-1">Nincsenek aktív kártyák.</p>
                                    <p className="text-[10px] text-slate-600">3 egymást követő jó válasszal kártya szerezhető!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* B. LIVE BATTLE FEED / COMBAT TICKER */}
                    <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between pb-2 border-b border-purple-500/20 mb-2">
                            <span className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-purple-400" /> Taktikai Eseménynapló
                            </span>
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                        </div>

                        {/* Scrolling Log Feed */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 font-mono text-xs">
                            {battleEvents.map((ev, i) => (
                                <div
                                    key={ev.id}
                                    className={`
                                        p-2 rounded-xl border text-[11px] leading-relaxed transition-all
                                        ${i === 0
                                            ? 'bg-purple-950/30 border-purple-500/40 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                                            : 'bg-slate-950/50 border-white/5 text-slate-300'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between text-[9px] text-slate-500 mb-1">
                                        <span className="flex items-center gap-1 font-bold text-slate-400">
                                            {getTeamIcon(ev.team)} {getTeamDisplayName(ev.team)}
                                        </span>
                                        <span>{ev.timestamp}</span>
                                    </div>
                                    <div className="text-slate-200">
                                        {ev.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* C. GALACTIC SENSORS & SYSTEM STATUS MATRIX */}
                    <div className="bg-slate-900/80 rounded-2xl p-3 border border-white/10 text-xs font-mono">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-slate-950/70 p-2 rounded-lg border border-white/5 flex flex-col">
                                <span className="text-[10px] text-slate-400">ÖSSZES MEZŐ</span>
                                <span className="text-base font-bold text-white font-mono">{totalHexes}</span>
                            </div>
                            <div className="bg-slate-950/70 p-2 rounded-lg border border-white/5 flex flex-col">
                                <span className="text-[10px] text-slate-400">ELFOGLALT</span>
                                <span className="text-base font-bold text-cyan-400 font-mono">{occupiedCount}</span>
                            </div>
                            <div className="bg-slate-950/70 p-2 rounded-lg border border-white/5 flex flex-col">
                                <span className="text-[10px] text-slate-400">SEMLEGES</span>
                                <span className="text-base font-bold text-slate-300 font-mono">{neutralCount}</span>
                            </div>
                            <div className="bg-slate-950/70 p-2 rounded-lg border border-white/5 flex flex-col">
                                <span className="text-[10px] text-slate-400">ÁLLAPOT</span>
                                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ONLINE
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TerritoryGameView;