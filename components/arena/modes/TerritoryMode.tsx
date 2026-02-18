import React from 'react';
import HexGrid from '../HexGrid';
import { HexCoord } from '../../../utils/hex-grid';

interface TerritoryModeProps {
    hexes: HexCoord[];
    owners: { [hexId: string]: string };
    scores: { [hexId: string]: number };
    tileTypes?: { [hexId: string]: 'normal' | 'energy' | 'relay' | 'research' | 'unstable' };
    difficulties?: { [hexId: string]: 1 | 2 | 3 };
    difficultyVisible?: { [hexId: string]: boolean };
    onHexClick: (hex: HexCoord) => void;
    selectedHex?: HexCoord | null;
    myTeam?: string; // Player's team
    activeTeam?: string; // Current active team
    isMyTurn?: boolean; // Can player act?
    hideControls?: boolean;
    targetingType?: 'global' | 'adjacent' | null;
}

const TerritoryMode: React.FC<TerritoryModeProps> = ({
    hexes, owners, scores, tileTypes, difficulties, difficultyVisible, onHexClick, selectedHex, myTeam, activeTeam, isMyTurn, targetingType, hideControls
}) => {
    // Calculate stats
    const myHexEntries = Object.entries(owners).filter(([id, owner]) => owner === myTeam);
    const myTerritoryCount = myHexEntries.length;
    const myTotalScore = myHexEntries.reduce((acc, [id]) => acc + (scores[id] || 0), 0);

    return (
        <div className="flex flex-col h-full w-full relative group">
            {/* HUD - Overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
                <div className="flex justify-between items-center p-3 md:p-4 bg-slate-900/80 rounded-xl border border-white/10 backdrop-blur-md gap-4 pointer-events-auto shadow-xl">
                    <div className="flex flex-col shrink min-w-0">
                        <span className="text-[10px] md:text-xs uppercase text-slate-400 font-bold tracking-widest">Csapatod</span>
                        <span className={`text-lg md:text-2xl font-black truncate leading-none ${myTeam === 'Piros' ? 'text-red-500' :
                            myTeam === 'Kék' ? 'text-blue-500' :
                                myTeam === 'Zöld' ? 'text-green-500' :
                                    myTeam === 'Sárga' ? 'text-yellow-500' : 'text-slate-200'
                            }`}>
                            {myTeam === 'Piros' ? 'Vörös Csillagköd' :
                                myTeam === 'Kék' ? 'Kék Nebula' :
                                    myTeam === 'Zöld' ? 'Zöld Szupernóva' :
                                        myTeam === 'Sárga' ? 'Arany Napkorona' :
                                            (myTeam || 'Megfigyelő')}
                        </span>
                        <div className="flex items-center gap-3 mt-1 text-xs md:text-sm font-mono text-slate-300">
                            <span title="Birtokolt területek">🏰 {myTerritoryCount}</span>
                            <span className="text-slate-600">|</span>
                            <span title="Összesített pajzsérték">🛡️ {myTotalScore}</span>
                        </div>
                    </div>

                    {/* Right Side: Turn Indicator + Stats */}
                    <div className="flex flex-col items-end gap-2 shrink-0 pointer-events-auto">
                        {/* Turn Indicator */}
                        {isMyTurn ? (
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full font-bold shadow-lg animate-pulse text-xs md:text-sm whitespace-nowrap">
                                TE JÖSSZ!
                            </div>
                        ) : (
                            <div className="bg-slate-800 text-slate-400 px-2 py-1 md:px-3 md:py-1 rounded-full font-medium text-[10px] md:text-xs whitespace-nowrap border border-white/5 flex items-center gap-1.5">
                                <span className="opacity-70">Most jön:</span>
                                <span className={`font-bold ${activeTeam === 'Piros' ? 'text-red-400' :
                                    activeTeam === 'Kék' ? 'text-blue-400' :
                                        activeTeam === 'Zöld' ? 'text-green-400' :
                                            activeTeam === 'Sárga' ? 'text-yellow-400' : 'text-white'
                                    }`}>
                                    {activeTeam === 'Piros' ? 'Vörös' :
                                        activeTeam === 'Kék' ? 'Kék' :
                                            activeTeam === 'Zöld' ? 'Zöld' :
                                                activeTeam === 'Sárga' ? 'Arany' :
                                                    (activeTeam || '...')}
                                </span>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="text-slate-500 text-[10px] md:text-xs whitespace-nowrap">
                            <span className="font-bold text-slate-400">{Object.keys(owners).length} / {hexes.length}</span> Foglalva
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Board */}
            <div className="absolute inset-0 bg-slate-950/80 overflow-hidden flex items-center justify-center">
                {/* Starfield effect (CSS) */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <HexGrid
                        hexes={hexes}
                        owners={owners}
                        scores={scores}
                        tileTypes={tileTypes}
                        difficulties={difficulties}
                        difficultyVisible={difficultyVisible}
                        onHexClick={onHexClick}
                        selectedHex={selectedHex}
                        myTeam={myTeam}
                        targetingType={targetingType}
                    />
                </div>
            </div>

            {/* Action Bar */}
            {!hideControls && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-slate-400 text-sm bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm pointer-events-none z-10">
                    Válassz egy szomszédos hatszöget a támadáshoz vagy a sajátodat a védekezéshez!
                </div>
            )}
        </div>
    );
};

export default TerritoryMode;
