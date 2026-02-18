import React, { useState } from 'react';
import { Users, Copy, Check, Play, Settings, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { peerService } from '../../../utils/peer-service';

interface LobbyViewProps {
    players: string[];
    roomCode: string | null;
    debugMode: boolean;
    onBack: () => void;
    onStartGame: () => void;
    onAddBot: () => void;
    onDebugClick: () => void;
    copyCode: () => void;
    copySuccess: boolean;
    error?: string | null;

    // New Props
    lobbyTeams?: { [team: string]: string[] };
    onMovePlayer?: (player: string, targetTeam: string) => void;
    onRandomizeTeams?: () => void;
    selectedMode?: string;
}

const LobbyView: React.FC<LobbyViewProps> = ({
    players,
    roomCode,
    debugMode,
    onBack,
    onStartGame,
    onAddBot,
    onDebugClick,
    copyCode,
    copySuccess,
    error,
    lobbyTeams,
    onMovePlayer,
    onRandomizeTeams,
    selectedMode
}) => {

    const isTeamMode = selectedMode === 'territory' || selectedMode === 'relay';

    const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, player: string) => {
        setDraggedPlayer(player);
        e.dataTransfer.setData('text/plain', player);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetTeam: string) => {
        e.preventDefault();
        const player = e.dataTransfer.getData('text/plain');
        if (player && onMovePlayer) {
            onMovePlayer(player, targetTeam);
        }
        setDraggedPlayer(null);
    };

    const getTeamColor = (team: string) => {
        switch (team) {
            case 'Piros': return 'bg-red-900/40 border-red-500/50 text-red-100';
            case 'Kék': return 'bg-blue-900/40 border-blue-500/50 text-blue-100';
            case 'Zöld': return 'bg-green-900/40 border-green-500/50 text-green-100';
            case 'Sárga': return 'bg-yellow-900/40 border-yellow-500/50 text-yellow-100';
            default: return 'bg-slate-700';
        }
    };

    const getNextTeam = (currentTeam: string) => {
        const order = ['Piros', 'Kék', 'Zöld', 'Sárga'];
        const idx = order.indexOf(currentTeam);
        return order[(idx + 1) % 4];
    };

    return (
        <div className="h-screen overflow-hidden bg-slate-950 text-white p-4 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 relative">
            <div className="absolute top-6 left-6 z-20">
                <button
                    onClick={() => { peerService.disconnect(); onBack(); }}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold bg-slate-900/50 px-4 py-2 rounded-lg"
                >
                    <ArrowLeft size={24} /> Vissza
                </button>
            </div>

            <div className="max-w-6xl w-full text-center flex flex-col h-full max-h-full">
                {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-200 p-2 rounded-xl flex items-center justify-center gap-3 animate-in slide-in-from-top-4 flex-shrink-0">
                        <XCircle size={24} />
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                {/* Debug Trigger Header */}
                <h1
                    onClick={onDebugClick}
                    className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 cursor-pointer select-none transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                    title={debugMode ? "Fejlesztői mód aktív" : "Váróterem"}
                >
                    VÁRÓTEREM
                    {debugMode && <span className="ml-3 align-middle text-xs bg-red-600 text-white px-2 py-1 rounded shadow-lg animate-pulse">DEV</span>}
                </h1>

                <div className="mb-6 flex-shrink-0">
                    <h2 className="text-slate-400 text-lg mb-2">Csatlakozási Kód</h2>
                    <div
                        onClick={copyCode}
                        className="inline-flex items-center gap-4 bg-white text-slate-900 px-8 py-4 rounded-3xl font-mono text-5xl font-bold tracking-widest cursor-pointer hover:bg-indigo-50 transition-colors shadow-2xl relative group"
                    >
                        {roomCode}
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                            {copySuccess ? <Check className="text-green-400" /> : <Copy className="text-slate-400" />}
                        </div>
                    </div>
                    <p className="mt-4 text-slate-500">
                        A diákok ezt a kódot írják be a saját készülékükön.
                    </p>
                </div>

                <div className="bg-slate-800/50 rounded-3xl border border-white/5 p-6 flex-1 min-h-0 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 flex-shrink-0">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <Users className="text-indigo-400" />
                            Játékosok ({players.length})
                        </h3>
                        <div className="flex items-center gap-4">
                            {isTeamMode && onRandomizeTeams && (
                                <button
                                    onClick={onRandomizeTeams}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-2"
                                >
                                    🎲 Véletlenszerű Csapatok
                                </button>
                            )}

                            {debugMode && (
                                <button
                                    onClick={onAddBot}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    + BOT HOZZÁADÁSA
                                </button>
                            )}
                            {players.length > 0 && <span className="text-green-400 text-sm font-bold animate-pulse">Várakozás...</span>}
                        </div>
                    </div>

                    {players.length === 0 ? (
                        <div className="text-slate-500 flex-1 flex flex-col items-center justify-center">
                            <div className="animate-bounce mb-4 text-slate-600"><Users size={48} /></div>
                            Még senki nem csatlakozott.
                        </div>
                    ) : isTeamMode && lobbyTeams ? (
                        /* Team Columns View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
                            {['Piros', 'Kék', 'Zöld', 'Sárga'].map(team => (
                                <div
                                    key={team}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, team)}
                                    className={`rounded-xl border flex flex-col overflow-hidden transition-all ${getTeamColor(team)} ${draggedPlayer ? 'border-dashed border-2 bg-opacity-30' : ''}`}
                                >
                                    <div className="p-3 font-bold uppercase tracking-wider text-sm bg-black/20 flex justify-between items-center">
                                        <span>{team}</span>
                                        <span className="bg-black/30 px-2 py-0.5 rounded text-xs">{lobbyTeams[team].length}</span>
                                    </div>
                                    <div className="p-2 space-y-2 min-h-[100px]">
                                        {lobbyTeams[team].map((p, i) => (
                                            <div
                                                key={i}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, p)}
                                                onClick={() => onMovePlayer && onMovePlayer(p, getNextTeam(team))}
                                                className={`bg-black/20 hover:bg-white/10 cursor-grab active:cursor-grabbing p-2 rounded-lg text-sm font-bold transition-all flex items-center justify-between group ${draggedPlayer === p ? 'opacity-50 scale-95' : ''}`}
                                                title="Húzd át másik csapatba vagy kattints"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="cursor-move opacity-50">⋮⋮</span>
                                                    {p}
                                                </span>
                                                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                            </div>
                                        ))}
                                        {lobbyTeams[team].length === 0 && (
                                            <div className="text-center text-xs opacity-50 italic py-4 pointer-events-none">Húzz ide játékost</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Standard List View */
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0 content-start">
                            {players.map((p, i) => (
                                <div key={i} className="bg-slate-700 p-4 rounded-xl font-bold text-lg animate-in fade-in slide-in-from-bottom-2 border border-white/5 flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${p.startsWith('BOT') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                    {p}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 flex gap-4 justify-center flex-shrink-0">
                    <button
                        onClick={() => {
                            peerService.disconnect();
                            onBack();
                        }}
                        className="px-8 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        Mégse
                    </button>
                    <button
                        onClick={onStartGame}
                        disabled={players.length === 0}
                        className="bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-12 py-3 rounded-xl font-bold text-xl shadow-lg shadow-green-900/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        START <Play fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LobbyView;
