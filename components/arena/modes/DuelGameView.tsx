import React from 'react';

interface DuelGameViewProps {
    leaderboard: { [key: string]: { score: number, finished: boolean } };
    isRevealed: boolean;
    onReveal: () => void;
    onBackToLobby: () => void;
}

const DuelGameView: React.FC<DuelGameViewProps> = ({
    leaderboard,
    isRevealed,
    onReveal,
    onBackToLobby
}) => {
    // Sort leaderboard
    const sortedPlayers = Object.entries(leaderboard).sort((a: [string, any], b: [string, any]) => b[1].score - a[1].score);

    return (
        <div className="min-h-screen bg-slate-950 text-white py-8 animate-in fade-in duration-500">
            {/* Host View: Live Leaderboard */}
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">
                        {isRevealed ? 'Végeredmény' : 'Élő Ranglista (Anonim)'}
                    </h2>
                    <div className="flex gap-4">
                        {!isRevealed ? (
                            <button
                                onClick={onReveal}
                                className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-all transform hover:scale-105"
                            >
                                Eredményhirdetés 🏆
                            </button>
                        ) : (
                            <button
                                onClick={onBackToLobby}
                                className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl text-white font-bold transition-colors"
                            >
                                Vissza a Lobbyba
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4">
                    {sortedPlayers.map(([name, data]: [string, { score: number, finished: boolean }], idx: number) => (
                        <div key={name} className={`
                            flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-500
                            ${data.finished
                                ? 'bg-green-900/20 border-green-500/50'
                                : 'bg-slate-800 border-slate-700'}
                        `}>
                            <div className="flex items-center gap-4">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl
                                    ${idx === 0 ? 'bg-yellow-500 text-yellow-950' :
                                        idx === 1 ? 'bg-gray-300 text-gray-900' :
                                            idx === 2 ? 'bg-orange-400 text-orange-900' : 'bg-slate-600 text-slate-300'}
                                `}>
                                    {idx + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-xl">
                                        {isRevealed ? name : `Résztvevő ${idx + 1}`}
                                    </div>
                                    {data.finished && <div className="text-xs text-green-400 font-bold uppercase tracking-wider">Befejezte</div>}
                                </div>
                            </div>
                            <div className="text-3xl font-black font-mono">
                                {data.score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DuelGameView;
