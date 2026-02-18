import React from 'react';

interface RelayGameViewProps {
    gameData: any;
    questionCount: number;
    onStopGame: () => void;
}

const RelayGameView: React.FC<RelayGameViewProps> = ({
    gameData,
    questionCount,
    onStopGame
}) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white py-8 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">Váltófutás ({questionCount} pontig)</h2>
                    <button onClick={onStopGame} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-bold">
                        Játék Leállítása
                    </button>
                </div>

                <div className="grid gap-6">
                    {Object.entries(gameData.teams as { [key: string]: string[] }).map(([team, members]) => {
                        const score = gameData.scores[team] || 0;
                        const progress = Math.min(100, (score / questionCount) * 100);
                        const currentMemberIndex = gameData.currentTurn[team] || 0;
                        const currentMember = members[currentMemberIndex];

                        // Color mapping
                        const colorClass = team === 'Piros' ? 'bg-red-500' :
                            team === 'Kék' ? 'bg-blue-500' :
                                team === 'Zöld' ? 'bg-green-500' : 'bg-yellow-500';

                        return (
                            <div key={team} className="bg-slate-800 rounded-2xl p-6 border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className={`text-2xl font-black ${team === 'Piros' ? 'text-red-400' :
                                        team === 'Kék' ? 'text-blue-400' :
                                            team === 'Zöld' ? 'text-green-400' : 'text-yellow-400'
                                        }`}>{team} Csapat</h3>
                                    <div className="text-3xl font-mono font-bold">{score} / {questionCount}</div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-8 bg-slate-900 rounded-full overflow-hidden mb-4 border border-white/10 relative">
                                    <div
                                        className={`h-full ${colorClass} transition-all duration-500 ease-out flex items-center justify-end px-3 font-bold text-black/50`}
                                        style={{ width: `${progress}%` }}
                                    >
                                    </div>
                                </div>

                                {/* Roster & Active Status */}
                                <div className="flex flex-wrap gap-2">
                                    {members.map((member) => (
                                        <div key={member} className={`
                                            px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
                                            ${member === currentMember
                                                ? `${colorClass} text-white scale-110 shadow-lg ring-2 ring-white`
                                                : 'bg-slate-700 text-slate-400'}
                                        `}>
                                            {member}
                                            {member === currentMember && <span className="animate-spin">🏃</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RelayGameView;
