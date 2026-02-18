import React, { useState, useEffect } from 'react';
import { categories } from '../../data/category_definitions';
import { peerService } from '../../utils/peer-service';
import { generateDuelQuestions } from '../../utils/QuestionGenerator';
import { CardId } from '../../utils/cards';
import LobbyView from './views/LobbyView';
import TerritoryGameView from './modes/TerritoryGameView';
import RelayGameView from './modes/RelayGameView';
import DuelGameView from './modes/DuelGameView';
import { Users, Copy, Check, Play, Settings, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { useTerritoryGame } from '../../hooks/useTerritoryGame';

interface GameHostProps {
    onBack: () => void;
}

const GAME_MODES = [
    { id: 'duel', name: 'Párbaj (1v1)', description: 'Gyorsasági reakcióverseny, ahol minden másodperc számít.' },
    { id: 'relay', name: 'Váltófutás (Csapat)', description: 'Csapatmunka! Csak akkor jöhet a következő, ha az előző kész.' },
    { id: 'territory', name: 'Területszerzés', description: 'Foglald el a pályát helyes válaszokkal. Stratégiai játék.' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

const GameHost: React.FC<GameHostProps> = ({ onBack }) => {
    const [step, setStep] = useState<'setup' | 'lobby' | 'game'>(() => {
        const saved = sessionStorage.getItem('gamehost_step');
        return (saved === 'setup' || saved === 'lobby' || saved === 'game') ? saved : 'setup';
    });
    const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
        try { return JSON.parse(sessionStorage.getItem('gamehost_topics') || '[]'); } catch { return []; }
    });
    const [selectedMode, setSelectedMode] = useState<string>(() => {
        return sessionStorage.getItem('gamehost_mode') || 'duel';
    });
    const [questionCount, setQuestionCount] = useState<number>(10);
    const [roomCode, setRoomCode] = useState<string | null>(() => {
        return sessionStorage.getItem('gamehost_roomCode') || null;
    });
    const [players, setPlayers] = useState<string[]>(() => {
        try { return JSON.parse(sessionStorage.getItem('gamehost_players') || '[]'); } catch { return []; }
    });
    const [gameData, setGameData] = useState<any>(() => {
        try { return JSON.parse(sessionStorage.getItem('gamehost_gamedata') || 'null'); } catch { return null; }
    });
    const [isCreating, setIsCreating] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [gameNotification, setGameNotification] = useState<any>(null); // Generic notification state
    const [cardNotification, setCardNotification] = useState<any>(null); // Card-specific notification state

    // Refs for stale closure prevention in callbacks
    const gameDataRef = React.useRef(gameData);
    const playersRef = React.useRef(players);

    // Sync refs
    useEffect(() => {
        gameDataRef.current = gameData;
    }, [gameData]);

    useEffect(() => {
        playersRef.current = players;
    }, [players]);

    // Live Leaderboard state
    const [leaderboard, setLeaderboard] = useState<{ [key: string]: { score: number, finished: boolean } }>({});
    const [isRevealed, setIsRevealed] = useState(false);

    // Debug Mode State
    const [debugMode, setDebugMode] = useState(false);
    const [debugClicks, setDebugClicks] = useState(0);

    // Lobby Team Management
    const [lobbyTeams, setLobbyTeams] = useState<{ [team: string]: string[] }>({
        'Piros': [],
        'Kék': [],
        'Zöld': [],
        'Sárga': []
    });

    // Sync Players to Teams
    useEffect(() => {
        if (step !== 'lobby') return; // Only sync in lobby

        setLobbyTeams(prev => {
            const newTeams = { ...prev };
            // 1. Remove players who left
            Object.keys(newTeams).forEach(team => {
                newTeams[team] = newTeams[team].filter(p => players.includes(p));
            });

            // 2. Add new players (Round Robin)
            const assignedPlayers = Object.values(newTeams).flat();
            const unassigned = players.filter(p => !assignedPlayers.includes(p));

            unassigned.forEach(p => {
                // Find team with fewest players
                const smallestTeam = Object.keys(newTeams).reduce((a, b) => newTeams[a].length <= newTeams[b].length ? a : b);
                newTeams[smallestTeam] = [...newTeams[smallestTeam], p];
            });

            return JSON.stringify(newTeams) !== JSON.stringify(prev) ? newTeams : prev;
        });
    }, [players, step]);

    const handleMovePlayer = (player: string, targetTeam: string) => {
        setLobbyTeams(prev => {
            const newTeams = { ...prev };
            // Remove from old
            Object.keys(newTeams).forEach(t => {
                newTeams[t] = newTeams[t].filter(p => p !== player);
            });
            // Add to new
            if (newTeams[targetTeam]) {
                newTeams[targetTeam] = [...newTeams[targetTeam], player];
            }
            return newTeams;
        });
    };

    const handleRandomizeTeams = () => {
        setLobbyTeams(prev => {
            const teamNames = ['Piros', 'Kék', 'Zöld', 'Sárga'];
            // Dynamic team count check? For now use all 4 or just 2?
            // Let's use all 4 for distribution or limit based on player count?
            // Use logic similar to territory: max 4 teams.
            const playerList = [...players].sort(() => Math.random() - 0.5);
            const numTeams = Math.max(2, Math.min(4, Math.floor(players.length / 2) || 2)); // fallback 2 if 0

            const newTeams: any = { 'Piros': [], 'Kék': [], 'Zöld': [], 'Sárga': [] };
            const activeTeams = teamNames.slice(0, numTeams);

            playerList.forEach((p, i) => {
                const team = activeTeams[i % numTeams];
                newTeams[team].push(p);
            });
            return newTeams;
        });
    };

    // Persist game state to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('gamehost_step', step);
        sessionStorage.setItem('gamehost_mode', selectedMode);
        if (roomCode) sessionStorage.setItem('gamehost_roomCode', roomCode);
        sessionStorage.setItem('gamehost_topics', JSON.stringify(selectedTopics));
        sessionStorage.setItem('gamehost_players', JSON.stringify(players));
        if (gameData) {
            sessionStorage.setItem('gamehost_gamedata', JSON.stringify(gameData));
        }
    }, [step, selectedMode, roomCode, selectedTopics, players, gameData]);

    // Clear session on back navigation
    const handleHostBack = () => {
        sessionStorage.removeItem('gamehost_step');
        sessionStorage.removeItem('gamehost_mode');
        sessionStorage.removeItem('gamehost_topics');
        sessionStorage.removeItem('gamehost_players');
        sessionStorage.removeItem('gamehost_gamedata');
        onBack();
    };

    const handleDebugClick = () => {
        setDebugClicks(prev => {
            const newCount = prev + 1;
            if (newCount === 5) {
                setDebugMode(true);
                return 0; // Reset or keep it?
            }
            return newCount;
        });
    };

    useEffect(() => {
        if (step === 'game') {
            // Reset leaderboard on game start
            const initial: any = {};
            players.forEach(p => initial[p] = { score: 0, finished: false });
            setLeaderboard(initial);
            setIsRevealed(false);
        }
    }, [step]); // removed players dependency to avoid reset on reconnect? No, players shouldn't change in game step usually.

    // 1. Cleanup on unmount ONLY
    useEffect(() => {
        return () => {
            // Only disconnect if we are navigating away completely?
            // Actually React 18 strict mode might double mount/unmount.
            // For now standard behavior:
            peerService.disconnect();
        }
    }, []);

    // Restore room if code exists but peer is not initialized (e.g. refresh)
    useEffect(() => {
        if (roomCode && !peerService.isInitialized && (step === 'lobby' || step === 'game')) {
            console.log('Restoring session for room:', roomCode);
            peerService.createRoom(roomCode)
                .then(() => {
                    console.log('Session restored successfully');
                    setCopySuccess(true); // visual cue
                    setTimeout(() => setCopySuccess(false), 2000);
                })
                .catch(err => {
                    console.error('Failed to restore session:', err);
                    setError('Nem sikerült helyreállítani a kapcsolatot. Létre kell hoznod egy új szobát.');
                });
        }
    }, [roomCode, step]);

    // Use Custom Hook for Territory Logic
    const { initializeTerritoryGame, processTerritoryAction: processTerritoryActionHook } = useTerritoryGame({
        onGameStateUpdate: (newState) => {
            setGameData(newState);
            // Broadcast update
            peerService.broadcast({
                type: 'UPDATE_STATE',
                payload: {
                    gameState: newState
                }
            });
        }
    });

    const processTerritoryAction = (playerId: string, action: string, hexId: string, isCorrect: boolean, usedCard?: CardId) => {
        // Use Ref to get latest state
        processTerritoryActionHook(gameDataRef.current, playerId, action, hexId, isCorrect, usedCard);
    };

    const handleDataValue = (data: any, conn: any) => {
        console.log('GameHost received data:', data.type, data.payload, 'from', conn.peer);
        // Use refs for current state
        const currentPlayers = playersRef.current;
        const currentGameData = gameDataRef.current;

        if (data.type === 'JOIN_REQUEST') {
            const playerName = data.payload.playerName;
            console.log(`Processing JOIN_REQUEST details: Name=${playerName}, ExistingPlayers=${JSON.stringify(currentPlayers)}`);

            // Handle new or returning player
            if (currentPlayers.includes(playerName)) {
                console.log('Player reconnecting:', playerName);
                // We allow them to "rejoin". The peer connection is new, but the game state knows them.
                // No need to return or reject.
            } else {
                console.log('Adding new player:', playerName);
                setPlayers(prev => {
                    const newState = [...prev, playerName];
                    console.log('New players state will be:', newState);
                    return newState;
                });
            }

            // Prepare response payload
            const responsePayload: any = {
                roomState: { mode: selectedMode, topics: selectedTopics }
            };

            // If game is running, send game state for reconnect
            if (step === 'game' && currentGameData) {
                const gameStateToSend = { ...currentGameData };

                // Reconstruct territoryState if needed for Client compatibility
                if (currentGameData.mode === 'territory' && !currentGameData.territoryState) {
                    gameStateToSend.territoryState = {
                        hexes: currentGameData.hexes,
                        owners: currentGameData.owners,
                        scores: currentGameData.scores,
                        teams: currentGameData.teams,
                        tileTypes: currentGameData.tileTypes,
                        activeTeam: currentGameData.activeTeam,
                        teamCards: currentGameData.teamCards
                    };
                }

                responsePayload.gameState = {
                    ...gameStateToSend,
                    started: true
                };
            }

            console.log('Sending JOIN_ACCEPT to', conn.peer);
            peerService.send(conn.peer, {
                type: 'JOIN_ACCEPT',
                payload: responsePayload
            });

        } else if (data.type === 'SUBMIT_ANSWER') {
            const { playerId, answer } = data.payload;

            if (currentGameData?.mode === 'relay') {
                // Relay Logic
                const teamName = Object.keys(currentGameData.teams).find(t => currentGameData.teams[t].includes(playerId));
                if (teamName) {
                    const isCorrect = answer.score > 0;

                    // Update Score only if correct
                    let newScore = currentGameData.scores[teamName];
                    if (isCorrect) {
                        newScore += 1;
                    }

                    // Rotate Turn
                    const roster = currentGameData.teams[teamName];
                    const currentIdx = currentGameData.currentTurn[teamName];
                    const nextIdx = (currentIdx + 1) % roster.length;

                    // Update Local State
                    const newGameData = {
                        ...currentGameData,
                        scores: { ...currentGameData.scores, [teamName]: newScore },
                        currentTurn: { ...currentGameData.currentTurn, [teamName]: nextIdx }
                    };
                    setGameData(newGameData);

                    // Broadcast Update
                    peerService.broadcast({
                        type: 'RELAY_UPDATE',
                        payload: {
                            team: teamName,
                            score: newScore,
                            nextPlayer: roster[nextIdx]
                        }
                    });
                }

            } else {
                // Duel Logic
                setLeaderboard(prev => ({
                    ...prev,
                    [playerId]: { score: answer.score, finished: answer.finished }
                }));
            }

        } else if (data.type === 'TERRITORY_ACTION') {
            const { playerId, action, hexId, isCorrect, usedCard } = data.payload;
            // Delegate to unified logic
            processTerritoryAction(playerId, action, hexId, isCorrect, usedCard);
        }
    };

    // 2. Update callbacks when state changes
    useEffect(() => {
        peerService.setCallbacks({
            onConnection: (conn) => {
                console.log('New connection:', conn.metadata);
            },
            onData: (data, conn) => {
                handleDataValue(data, conn);
            },

            onDisconnected: () => {
                setError("A kapcsolat megszakadt.");
            },
            onError: (err) => {
                if (err.type !== 'peer-unavailable') {
                    console.error('Peer error:', err);
                }
            }
        });
        // Important: removed gameData and players from deps to prevent re-binding
        // step, selectedMode, selectedTopics probably don't change fast during game, so keeping them is okay-ish.
        // But better safe:
    }, [selectedMode, selectedTopics, step]); // removed players, gameData

    const handleCreateRoom = async () => {
        if (selectedTopics.length === 0) {
            setError("Válassz legalább egy témakört!");
            return;
        }

        setIsCreating(true);
        setError(null);
        try {
            const code = await peerService.createRoom();
            setRoomCode(code);
            setStep('lobby');
        } catch (err) {
            console.error("Failed to create room:", err);
            setError("Nem sikerült létrehozni a szobát. Próbáld újra!");
        } finally {
            setIsCreating(false);
        }
    };

    const copyCode = () => {
        if (roomCode) {
            navigator.clipboard.writeText(roomCode);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const addBot = () => {
        const botNames = ['Albert', 'Bela', 'Cecil', 'David', 'Elemer', 'Feri', 'Gabor', 'Hugo'];
        const existingBots = players.filter(p => p.startsWith('BOT_'));
        const availableNames = botNames.filter(n => !players.includes(`BOT_${n}`));

        if (availableNames.length === 0) return;

        const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
        const botName = `BOT_${randomName}`;

        console.log('Adding BOT player:', botName);
        setPlayers(prev => [...prev, botName]);
    };

    // Bot AI for Territory Mode
    useEffect(() => {
        if (!gameData || gameData.mode !== 'territory') return;

        const currentActiveTeam = gameData.activeTeam;
        if (!currentActiveTeam) return;

        const teamMembers = gameData.teams[currentActiveTeam] || [];
        const botMember = teamMembers.find((m: string) => m.startsWith('BOT_'));

        if (botMember) {
            console.log(`Bot Turn Detected for team ${currentActiveTeam} (Bot: ${botMember})`);

            if (currentActiveTeam) {
                const timer = setTimeout(() => {
                    const hexIds = Object.keys(gameData.hexes);
                    const randomHexId = hexIds[Math.floor(Math.random() * hexIds.length)];
                    const isCorrect = Math.random() > 0.3; // 70% success rate

                    console.log(`Bot attacking ${randomHexId} (Success: ${isCorrect})`);
                    processTerritoryAction(botMember, 'ATTACK', randomHexId, isCorrect);
                }, 3000);

                return () => clearTimeout(timer);
            }
        }
    }, [gameData]);

    const startGame = () => {
        const countToGenerate = selectedMode === 'territory' ? 50 : questionCount;
        const questions = generateDuelQuestions(selectedTopics, countToGenerate);

        if (selectedMode === 'relay') {
            // 1. Assign Teams
            const teamNames = ['Piros', 'Kék', 'Zöld', 'Sárga'];
            let activeTeamNames: string[] = [];
            const teamRosters: { [teamName: string]: string[] } = {};

            // Use Lobby Teams if defined and valid
            const hasLobbyTeams = Object.keys(lobbyTeams).some(key => lobbyTeams[key].length > 0);

            if (hasLobbyTeams) {
                Object.assign(teamRosters, lobbyTeams);
                activeTeamNames = Object.keys(lobbyTeams).filter(t => lobbyTeams[t].length > 0);
                activeTeamNames.sort((a, b) => teamNames.indexOf(a) - teamNames.indexOf(b));
            } else {
                const numTeams = Math.max(2, Math.min(4, Math.floor(players.length / 2)));
                activeTeamNames = teamNames.slice(0, numTeams);
                activeTeamNames.forEach(t => teamRosters[t] = []); // Initialize active teams

                const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
                shuffledPlayers.forEach((p, i) => {
                    const team = activeTeamNames[i % numTeams];
                    teamRosters[team].push(p);
                });
            }

            // 2. Initialize Relay State
            const relayState = {
                teams: teamRosters,
                scores: activeTeamNames.reduce((acc, t) => ({ ...acc, [t]: 0 }), {}),
                currentTurn: activeTeamNames.reduce((acc, t) => ({ ...acc, [t]: 0 }), {} as { [team: string]: number }),
            };

            // 3. Broadcast Start
            peerService.broadcast({
                type: 'START_GAME',
                payload: {
                    mode: 'relay',
                    topics: selectedTopics,
                    questions: questions,
                    relayState
                }
            });

            setGameData({ ...relayState, questions, mode: 'relay' });
            setStep('game');
            setIsRevealed(false);

        } else if (selectedMode === 'territory') {
            // TERRITORY MODE
            const territoryState = initializeTerritoryGame(players, lobbyTeams);
            console.log('Initialized Territory State:', territoryState);
            console.log('Hexes count:', territoryState.hexes ? Object.keys(territoryState.hexes).length : 'undefined');

            const payload = {
                mode: 'territory',
                topics: selectedTopics,
                questions,
                territoryState
            };

            peerService.broadcast({
                type: 'START_GAME',
                payload
            });

            setGameData({ ...territoryState, questions, mode: 'territory' });
            setStep('game');
            setIsRevealed(false);

        } else {
            // DUEL MODE
            const payload = {
                mode: selectedMode,
                topics: selectedTopics,
                questions: questions
            };

            peerService.broadcast({
                type: 'START_GAME',
                payload: payload
            });

            setGameData(payload);
            setStep('game');
            setIsRevealed(false);
        }
    };

    if (step === 'setup') {
        return (
            <div className="h-screen overflow-hidden bg-slate-950 text-white p-4 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="max-w-6xl w-full flex flex-col h-full max-h-full">
                    <button onClick={handleHostBack} className="mb-2 text-slate-400 hover:text-white transition-colors">
                        ← Vissza a választáshoz
                    </button>

                    <h2 className="text-2xl font-bold mb-4">Játék Beállítása</h2>

                    <div className="w-full relative lg:block flex flex-col gap-4 flex-1 min-h-0">
                        {/* Topic Selection */}
                        <div className="lg:absolute lg:inset-y-0 lg:left-0 lg:w-[calc(65%_-_0.5rem)] flex flex-col min-h-0">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 h-full flex flex-col min-h-0">
                                <label className="block text-indigo-300 font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                    1. Válassz Témaköröket (Többet is lehet)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="space-y-2">
                                            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider sticky top-0 bg-slate-900/90 py-1 z-10 backdrop-blur-sm">
                                                {cat.title}
                                            </h3>
                                            <div className="grid gap-2">
                                                {cat.subcategories.map(sub => {
                                                    const isSelected = selectedTopics.includes(sub.id);
                                                    return (
                                                        <button
                                                            key={sub.id}
                                                            onClick={() => {
                                                                if (!sub.isAvailable) return;
                                                                setSelectedTopics(prev =>
                                                                    prev.includes(sub.id)
                                                                        ? prev.filter(t => t !== sub.id)
                                                                        : [...prev, sub.id]
                                                                );
                                                            }}
                                                            disabled={!sub.isAvailable}
                                                            className={`
                                                        flex items-center justify-between p-2 rounded-lg border transition-all text-left
                                                        ${!sub.isAvailable ? 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-900/50' :
                                                                    isSelected
                                                                        ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                                        : 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-700'}
                                                    `}
                                                        >
                                                            <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                                                {sub.title}
                                                            </span>
                                                            {isSelected && <Check size={18} className="text-indigo-400" />}
                                                            {!sub.isAvailable && <span className="text-[10px] uppercase font-bold text-slate-600">Hamarosan</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-sm text-slate-400 flex justify-between items-center">
                                    <span>Kiválasztva: <strong className="text-white">{selectedTopics.length}</strong> db</span>
                                    {selectedTopics.length === 0 && <span className="text-red-400 animate-pulse">Válassz legalább egyet!</span>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:ml-[calc(65%_+_0.5rem)] lg:w-[calc(35%_-_0.5rem)] space-y-3 flex flex-col h-full">
                            {/* Mode Selection */}
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex-shrink-0">
                                <label className="block text-purple-300 font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                    2. Válassz Játékmódot
                                </label>
                                <div className="grid gap-4">
                                    {GAME_MODES.map(mode => (
                                        <div
                                            key={mode.id}
                                            onClick={() => setSelectedMode(mode.id)}
                                            className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${selectedMode === mode.id
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-slate-700 hover:border-slate-600 bg-slate-900'
                                                }`}
                                        >
                                            <div className="font-bold text-base mb-0.5">{mode.name}</div>
                                            <div className="text-slate-400 text-xs">{mode.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Question Count Selection */}
                            <div className={`bg-slate-800/50 p-4 rounded-xl border border-white/5 animate-in fade-in slide-in-from-bottom-2 flex-shrink-0 ${selectedMode === 'territory' ? 'opacity-50 grayscale pointer-events-none' : ''}`}>

                                <label className="block text-blue-300 font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                    <Clock size={16} /> 3. Kérdések Száma
                                    {selectedMode === 'territory' && <span className="text-xs text-slate-400 ml-auto normal-case tracking-normal">(Automatikus)</span>}
                                </label>
                                <div className="flex gap-4">
                                    {QUESTION_COUNTS.map(count => (
                                        <button
                                            key={count}
                                            onClick={() => setQuestionCount(count)}
                                            className={`flex-1 py-2 rounded-lg font-bold text-base border-2 transition-all ${questionCount === count
                                                ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/10'
                                                : 'border-slate-700 hover:border-slate-600 bg-slate-900 text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleCreateRoom}
                                disabled={isCreating}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-auto"
                            >
                                {isCreating ? (
                                    <span className="animate-pulse">Szoba létrehozása...</span>
                                ) : (
                                    <>Szoba Létrehozása <Settings size={20} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (step === 'lobby') {
        return (
            <LobbyView
                players={players}
                roomCode={roomCode}
                debugMode={debugMode}
                onBack={handleHostBack}
                onStartGame={startGame}
                onAddBot={addBot}
                onDebugClick={handleDebugClick}
                copyCode={copyCode}
                copySuccess={copySuccess}
                error={error}

                // Team Management Props
                lobbyTeams={lobbyTeams}
                onMovePlayer={handleMovePlayer}
                onRandomizeTeams={handleRandomizeTeams}
                selectedMode={selectedMode} // Pass mode to conditionals
            />
        );
    }

    if (step === 'game') {
        if (selectedMode === 'relay' && gameData?.teams) {
            return (
                <RelayGameView
                    gameData={gameData}
                    questionCount={questionCount}
                    onStopGame={() => setStep('lobby')}
                />
            );
        }

        if (selectedMode === 'territory' && gameData?.hexes) {
            return (
                <TerritoryGameView
                    gameData={gameData}
                    players={players}
                    onStopGame={() => setStep('lobby')}
                    onHexClick={(hex) => {
                        // Host can click to debug or inspect? 
                        // For now just logging or showing info
                        const id = `${hex.q},${hex.r},${hex.s}`;
                        console.log('Host clicked hex:', id, gameData.owners[id]);
                    }}
                    roomCode={roomCode || ''}
                />
            );
        }

        if (selectedMode === 'duel' && gameData?.questions) {
            return (
                <DuelGameView
                    leaderboard={leaderboard}
                    isRevealed={isRevealed}
                    onReveal={() => setIsRevealed(true)}
                    onBackToLobby={() => setStep('lobby')}
                />
            );
        }

        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-center py-20">
                <h1 className="text-4xl font-bold mb-4">A játék elindult!</h1>
                <p className="text-xl text-slate-400">Játékmód: {selectedMode} (Még nem implementálva)</p>
            </div>
        );
    }

    return null;
};

export default GameHost;
