import React, { useState, useEffect } from 'react';
import { peerService } from '../../utils/peer-service';
import { soundManager } from '../../utils/SoundManager';
import { generateDuelQuestions } from '../../utils/QuestionGenerator';
import { getNeighbors, getHexId } from '../../utils/hex-grid';
import DuelMode from './modes/DuelMode';
import RelayMode from './modes/RelayMode';
import TerritoryMode from './modes/TerritoryMode';
import { Loader2, AlertCircle, Trophy, User, ArrowRight, Timer, ArrowLeft, Hash, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CARD_DEFINITIONS, GalacticCard } from '../../utils/cards';
import QuestionBlock from '../QuestionBlock';

import PracticeManager from './PracticeManager';

interface GameClientProps {
    onBack: () => void;
}

const GameClient: React.FC<GameClientProps> = ({ onBack }) => {
    const [step, setStep] = useState<'join' | 'waiting' | 'game' | 'practice'>('join');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gameData, setGameData] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    // Relay State
    const [relayTeam, setRelayTeam] = useState<string | null>(null);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [currentTeammate, setCurrentTeammate] = useState<string>('');

    // Territory State
    const [activeCard, setActiveCard] = useState<string | null>(null);
    const [targetingMode, setTargetingMode] = useState<string | null>(null);
    const [cardNotification, setCardNotification] = useState<{ team: string, cardId: string, reason: string } | null>(null);
    const [gameNotification, setGameNotification] = useState<any>(null);
    const [inspectingCard, setInspectingCard] = useState<GalacticCard | null>(null);
    const [territoryInteraction, setTerritoryInteraction] = useState<{ hex: any, question: any, feedback?: boolean } | null>(null);


    const [isAutoReconnecting, setIsAutoReconnecting] = useState(false);

    // 1. Cleanup on unmount
    useEffect(() => {
        return () => {
            // peerService.disconnect(); // Keep connection alive if possible? No, cleanup is good.
        }
    }, []);

    // 2. Initial state restoration & Seamless Reconnect
    useEffect(() => {
        const checkSession = async () => {
            const savedCode = sessionStorage.getItem('mat10_room');
            const savedName = sessionStorage.getItem('mat10_player');

            if (savedCode && savedName) {
                setCode(savedCode);
                setName(savedName);

                // Set auto-reconnect flag to show specific UI
                setIsAutoReconnecting(true);
                setIsConnecting(true); // Also set this for safety

                try {
                    await peerService.joinRoom(savedCode);

                    // Send Join Request
                    peerService.sendToHost({
                        type: 'JOIN_REQUEST',
                        payload: { playerName: savedName }
                    });

                    // Timeout for auto-reconnect response
                    setTimeout(() => {
                        // If we are still in auto-parsing mode (step hasn't changed to game/waiting)
                        // This check is a bit tricky since we can't easily check 'step' current value in timeout closure without ref.
                        // But we can check if isAutoReconnecting is still true.
                        // Actually, we can just force reset if it takes too long.
                        // Ideally checking a ref, but here we can just assume if we are still mounting this component
                        // and haven't transitioned, we should fail.
                        // However, since we can't accept state inside timeout easily without refs, 
                        // let's rely on the user manually cancelling or just showing error.
                        // But wait, the user CANNOT cancel auto-reconnect screen easily (no button).

                        // We must set a fail-safe.
                        // We can use a functional update to check previous state? 
                        setIsAutoReconnecting(prev => {
                            if (prev) {
                                console.warn("Auto-reconnect timed out.");
                                setError("Az automatikus visszacsatalakozás időtúllépés miatt sikertelen.");
                                setIsConnecting(false);
                                return false; // Turn off auto-reconnect
                            }
                            return prev;
                        });
                    }, 5000);

                } catch (err: any) {
                    console.error("Auto-reconnect failed:", err);
                    setError("Nem sikerült automatikusan visszacsatalakozni. Próbáld meg manuálisan.");
                    setIsConnecting(false);
                    setIsAutoReconnecting(false); // Fallback to join screen
                }
            }
        };

        checkSession();
    }, []);

    // 3. Set callbacks with dependencies (to avoid stale closures)
    useEffect(() => {
        peerService.setCallbacks({
            onConnection: (conn) => {
                console.log('Connected to host!');
            },
            onData: (data) => {
                if (data.type === 'JOIN_REJECT') {
                    setError(data.payload.reason || "A csatlakozás elutasítva.");
                    setIsConnecting(false);
                    sessionStorage.removeItem('mat10_room');
                    sessionStorage.removeItem('mat10_player');
                    setStep('join');
                    setIsAutoReconnecting(false);
                } else if (data.type === 'JOIN_ACCEPT') {
                    setIsAutoReconnecting(false);
                    // Save session if joined
                    if (code && name) {
                        sessionStorage.setItem('mat10_room', code);
                        sessionStorage.setItem('mat10_player', name);
                    }

                    const { roomState, gameState } = data.payload;
                    if (gameState) {
                        // Rejoining an active game
                        if (gameState.started) {
                            setGameData({
                                ...gameState,
                                mode: roomState.mode
                            });

                            // Restore Relay/Territory Team on Reconnect
                            if (roomState.mode === 'territory' || roomState.mode === 'relay') {
                                // Try to find team in territoryState or directly in teams
                                const teams = gameState.territoryState?.teams || gameState.teams || {};
                                const myTeamName = Object.keys(teams).find(t =>
                                    teams[t].includes(name)
                                );
                                if (myTeamName) {
                                    console.log('Restored Team on Reconnect:', myTeamName);
                                    setRelayTeam(myTeamName);
                                }
                            }

                            setStep('game');
                        }
                    } else {
                        setStep('waiting');
                    }
                } else if (data.type === 'START_GAME') {
                    const payload = data.payload;
                    console.log('Received START_GAME:', payload);
                    setGameData(payload);
                    setStep('game');
                    setFinished(false);
                    setScore(0);

                    // Relay Init
                    if (payload.mode === 'relay' && payload.relayState) {
                        console.log('Relay State:', payload.relayState);
                        console.log('My Name:', name);

                        const myTeamName = Object.keys(payload.relayState.teams).find(t =>
                            payload.relayState.teams[t].includes(name)
                        );
                        console.log('My Team:', myTeamName);
                        setRelayTeam(myTeamName || null);

                        if (myTeamName) {
                            const currentIdx = payload.relayState.currentTurn[myTeamName];
                            const activePlayer = payload.relayState.teams[myTeamName][currentIdx];
                            console.log('Active Player:', activePlayer);

                            const isTurn = activePlayer === name;
                            setIsMyTurn(isTurn);
                            setCurrentTeammate(activePlayer);
                            console.log('Is My Turn:', isTurn);
                        } else {
                            console.error('Player not found in any team!');
                        }
                    }

                    // Territory Init
                    if (payload.mode === 'territory' && payload.territoryState) {
                        // Find my team
                        const myTeamName = Object.keys(payload.territoryState.teams).find(t =>
                            payload.territoryState.teams[t].includes(name)
                        );
                        setRelayTeam(myTeamName || null); // Reuse relayTeam state for team name
                    }

                } else if (data.type === 'RELAY_UPDATE') {
                    const { team, score: teamScore, nextPlayer } = data.payload;
                    // Check if update is for my team
                    if (relayTeam === team) {
                        setCurrentTeammate(nextPlayer);
                        setScore(teamScore); // Update local score to track progress/question index
                        setIsMyTurn(nextPlayer === name);
                    }
                } else if (data.type === 'UPDATE_STATE') {
                    // Generic state update (used by Territory)
                    setGameData(prev => ({ ...prev, ...data.payload.gameState }));
                } else if (data.type === 'GAME_NOTIFICATION') {
                    setGameNotification(data.payload);
                    setTimeout(() => setGameNotification(null), 3000);
                } else if (data.type === 'CARD_NOTIFICATION') {
                    setCardNotification(data.payload);
                    // Auto-hide after 4 seconds
                    setTimeout(() => setCardNotification(null), 4000);
                }
            },
            onDisconnected: () => {
                setError("Megszakadt a kapcsolat a szerverrel.");
                setStep('join');
            },
            onError: (err) => {
                console.error("Peer error:", err);
                setError("Hiba történt a csatlakozáskor. Ellenőrizd a kódot!");
                setIsConnecting(false);
            }
        });
    }, [name, code, relayTeam, isMyTurn]); // Add dependencies!

    // Helper Functions (Top Level)

    const handleHexClick = (hex: any) => {
        if (!gameData || gameData.mode !== 'territory') return;

        const currentActiveTeam = gameData.activeTeam || gameData.territoryState?.activeTeam;
        if (relayTeam !== currentActiveTeam) return;

        // Card Targeting Mode
        if (targetingMode) {
            const hexId = `${hex.q},${hex.r},${hex.s}`;

            // Special Handling (Wormhole & Supernova trigger an ATTACK, not just a card use)
            if (targetingMode === 'wormhole' || targetingMode === 'supernova') {
                setActiveCard(targetingMode);
                setTargetingMode(null);
                // Fall through to Attack Logic below...
            } else {
                // Standard Target Cards (Asteroid, Force Field)
                peerService.sendToHost({
                    type: 'TERRITORY_ACTION',
                    payload: {
                        playerId: name,
                        action: 'CARD_USE',
                        usedCard: targetingMode,
                        hexId: hexId
                    }
                });
                setTargetingMode(null);
                return;
            }
        }

        // Normal Attack Logic: Select a random question from the pool
        const questions = gameData.questions || [];
        if (questions.length === 0) return;

        // ADJACENCY RULE CHECK
        const hexId = `${hex.q},${hex.r},${hex.s}`;
        const owners = gameData.owners || gameData.territoryState?.owners || {};
        const myTeam = relayTeam; // User's team

        // 1. If I own it, I can defend/buff it (ALWAYS VALID)
        const isMyHex = owners[hexId] === myTeam;

        // 2. If it's not mine, checks if it's adjacent to ANY of my hexes
        let isAdjacent = false;
        if (!isMyHex) {
            const neighbors = getNeighbors(hex);
            isAdjacent = neighbors.some(n => {
                const nId = getHexId(n);
                return owners[nId] === myTeam;
            });
        }

        // Adjacency Bypass (Wormhole or if I already own it)
        const canAttack = isMyHex || isAdjacent || activeCard === 'wormhole' || targetingMode === 'wormhole';

        if (!canAttack) {
            // INVALID MOVE
            soundManager.playError();
            setCardNotification({
                id: Date.now().toString(),
                team: 'System',
                cardId: 'lock',
                reason: "Csak szomszédos mezőt támadhatsz!"
            });
            setTimeout(() => setCardNotification(null), 3000);
            return;
        }

        // Get Hex Difficulty (Default to 2 if missing)
        soundManager.playClick();
        const difficulties = gameData.difficulties || gameData.territoryState?.difficulties || {};

        const difficulty = difficulties[hexId] || 2;

        console.log(`[HexClick] ${hexId} Difficulty: ${difficulty}`);

        // Filter questions by difficulty
        const questionsOfDifficulty = questions.filter((q: any) => q.difficulty === difficulty);

        let pool = questionsOfDifficulty;
        // Fallback if no questions of that difficulty exist
        if (pool.length === 0) {
            console.warn(`[HexClick] No questions found for difficulty ${difficulty}. Falling back to random.`);
            pool = questions;
        }

        const randomIndex = Math.floor(Math.random() * pool.length);
        const question = pool[randomIndex];

        setTerritoryInteraction({ hex, question });
    };

    const handleTerritoryResult = (success: boolean) => {
        if (territoryInteraction) {
            // Send action to host
            peerService.sendToHost({
                type: 'TERRITORY_ACTION',
                payload: {
                    playerId: name,
                    action: 'ATTACK',
                    hexId: `${territoryInteraction.hex.q},${territoryInteraction.hex.r},${territoryInteraction.hex.s}`,
                    isCorrect: success,
                    usedCard: activeCard // Send active card (Wormhole/Supernova)
                }
            });

            // Clear active card effect
            if (activeCard) setActiveCard(null);

            if (success) {
                // If correct, close immediately (or maybe show success briefly? for now keep quick)
                soundManager.playSuccess();
                soundManager.playCapture();
                setTerritoryInteraction(null);
            } else {
                // If wrong, show feedback
                soundManager.playError();
                setTerritoryInteraction(prev => prev ? { ...prev, feedback: false } : null);
                setTimeout(() => {
                    setTerritoryInteraction(null);
                }, 2000);
            }
        }
    };

    const handlePlayCard = (cardId: string) => {
        // Check if card needs target
        // wormhole: Target any hex to attack
        // supernova: Target hex to attack (guaranteed capture)
        // asteroid: Target enemy hex to nuke
        // force_field: Target own hex to buff
        const needsTarget = ['asteroid', 'force_field', 'wormhole', 'supernova'].includes(cardId);

        if (needsTarget) {
            soundManager.playClick();
            setTargetingMode(cardId);
            // No need to close modal anymore
        } else {
            soundManager.playPowerup();
            peerService.sendToHost({
                type: 'TERRITORY_ACTION',
                payload: {
                    playerId: name,
                    action: 'CARD_USE',
                    usedCard: cardId
                }
            });
            // No need to close modal anymore
        }
    };

    const teamCardsData = (gameData?.mode === 'territory' && relayTeam)
        ? (gameData.teamCards?.[relayTeam] || gameData.territoryState?.teamCards?.[relayTeam])
        : null;

    const teamCards = teamCardsData?.hand || [];

    const handleJoin = async () => {
        if (!name.trim() || code.length !== 4) {
            setError("Kérlek tölts ki minden mezőt! A kód 4 karakter.");
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            await peerService.joinRoom(code);
            // Send join request
            peerService.send(peerService.ID_PREFIX + code.toUpperCase(), { // Send to host ID, not broadcast
                type: 'JOIN_REQUEST',
                payload: { playerName: name }
            });
            // Save immediately or wait for accept? Wait for accept in onData callback usually safer, 
            // but we can save here to be sure.
            sessionStorage.setItem('mat10_room', code);
            sessionStorage.setItem('mat10_player', name);
            // Host should respond with JOIN_ACCEPT
        } catch (err) {
            console.error("Join failed:", err);
            setError("Nem sikerült csatlakozni. Ellenőrizd a kódot!");
            setIsConnecting(false);
        }
    };

    // Helper to send correctly to host. 
    // In peer-service we need a way to know WHO is the host.
    // Actually joinRoom resolves when MY peer is open.
    // But we need to send to the host connection.
    // The current peerService.send takes a peerId.
    // We can just use broadcast locally if we only have one connection (to host).
    // Or peerService can track the host connection.

    // FIX: peerService.send needs a specific peerId, but client only knows it connected.
    // We should modify handleJoin to access the connection or peerService should have a sendToHost.
    // For now, let's assume peerService.broadcast works if we only have one connection.
    // BETTER: peerService.joinRoom should probably handle the handshake.

    // Let's refine handleJoin to use broadcast for now, as client only connects to host.
    // Actually, peerService.broadcast sends to ALL connections. Client only has one.

    const safeJoin = async () => {
        if (!name.trim() || code.length !== 4) {
            setError("Kérlek tölts ki minden mezőt! A kód 4 karakter.");
            return;
        }
        setIsConnecting(true);
        setError(null);

        try {
            console.log("Connecting to room:", code);
            // Join room establishes connection to Host
            // This waits for 'open' event on the connection
            await peerService.joinRoom(code);
            console.log("Connection established. Sending JOIN_REQUEST...");

            // Send Join Request immediately (with retry)
            let sent = false;
            for (let i = 0; i < 3; i++) {
                if (peerService.sendToHost({
                    type: 'JOIN_REQUEST',
                    payload: { playerName: name }
                })) {
                    sent = true;
                    break;
                }
                // Wait 500ms before retry
                await new Promise(r => setTimeout(r, 500));
            }

            if (!sent) {
                // If specific sending failed, but connection didn't throw, we might need to fallback or just error
                // Actually if sendToHost returned false, it means logic inside didn't find open host connection.
                // But we just finished joinRoom which sets it?
                // This implies a race condition or connection closed immediately.
                throw new Error("A kapcsolat létrejött, de nem sikerült adatot küldeni a játékmesternek.");
            }

            // Set a timeout for the HOST RESPONSE (JOIN_ACCEPT/REJECT)
            // If we don't get a response in 5 seconds, we assume something went wrong (host busy/crashed)
            const responseTimeout = setTimeout(() => {
                if (isConnecting) { // If still connecting after 5s
                    console.error("Join request timed out (no response from host).");
                    setError("Nem érkezett válasz a játékmestertől. Próbáld újra!");
                    setIsConnecting(false);
                    peerService.disconnect(); // Cleanup
                }
            }, 5000);

            // We need to clear this timeout if we succeed, 
            // but we can't easily access the timeout ID from the event handler.
            // A pattern could be to use a ref for the timeout or just checking state in the timeout callback.
            // The check `if (isConnecting)` inside timeout handles it partially, 
            // but for cleaner code we rely on `onData` setting `isConnecting(false)` on success/failure.

        } catch (err: any) {
            console.error("Csatlakozási hiba:", err);
            setError(err.message || "Hiba a csatlakozáskor.");
            setIsConnecting(false);
        }
    }

    if (step === 'practice') {
        return <PracticeManager onBack={() => setStep('join')} />;
    }

    if (isAutoReconnecting) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4 animate-in fade-in">
                    <Loader2 size={48} className="animate-spin text-indigo-500" />
                    <h2 className="text-xl font-bold">Visszatérés a játékba...</h2>
                    <p className="text-slate-400">Kapcsolat helyreállítása</p>
                </div>
            </div>
        );
    }

    if (step === 'join') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
                <div className="max-w-md mx-auto w-full animate-in zoom-in-95 duration-500">
                    <button
                        onClick={() => {
                            peerService.disconnect();
                            onBack();
                        }}
                        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} /> Vissza
                    </button>

                    <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 shadow-2xl">
                        <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Csatlakozás
                        </h2>

                        <button
                            onClick={() => setStep('practice')}
                            className="w-full mb-6 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            🤖 Gyakorlás (Bot ellen)
                        </button>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wide">
                                    Neved
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                        placeholder="Pl. Gipsz Jakab"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wide">
                                    Szoba Kód
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        maxLength={4}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono text-xl tracking-widest uppercase"
                                        placeholder="Pl. X9Y2"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 text-sm">
                                    <AlertCircle size={20} className="shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={safeJoin}
                                disabled={isConnecting}
                                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Csatlakozás...
                                    </>
                                ) : (
                                    "Gyerünk!"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'waiting') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 animate-in fade-in duration-700">
                <div className="max-w-md mx-auto w-full text-center">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Sikeresen Csatlakoztál!</h2>
                    <p className="text-slate-400 text-lg">
                        Várj, amíg a játékmester elindítja a játékot...
                    </p>
                    <div className="mt-12 flex justify-center gap-2">
                        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'game' && gameData) {
        if (gameData.mode === 'relay') {
            if (isMyTurn) {
                // My Turn - Show Question
                // In relay, we rely on the host to track question index. 
                // But wait, the client needs to know WHICH question to show?
                // The Host tracks `currentTurn` (player index), but also `scores` (which implies question index).
                // Actually, `scores` determines the question index for the team!
                // We need to know the team's score to pick the right question.
                // WE MISSING THIS IN STATE! 
                // `RELAY_UPDATE` sends score, but `START_GAME` only sent initial state (0).
                // We need to track `relayScore` locally to know which question to display.

                // Let's rely on `gameData.questions` and a local `teamScore` state.
                // I need to add `teamScore` to state or derive it.
                // The `RELAY_UPDATE` updates me. 
                // Let's assume `setScore` is used for my team's score in relay mode?
                // Yes, I used `setScore(0)` on start.
                // And `RELAY_UPDATE` provides `score`.

                const questionIndex = score;
                const currentQuestion = gameData.questions[questionIndex];

                if (!currentQuestion) {
                    return (
                        <div className="flex flex-col items-center justify-center min-h-[50vh]">
                            <h2 className="text-3xl font-bold mb-4">Vége a versenynek!</h2>
                            <p className="text-slate-400">Várakozás az eredményre...</p>
                        </div>
                    );
                }

                return (
                    <RelayMode
                        question={currentQuestion}
                        onResult={(points) => {
                            // Send to Host
                            peerService.sendToHost({
                                type: 'SUBMIT_ANSWER',
                                payload: {
                                    playerId: name,
                                    answer: { score: points, finished: false } // Relay doesn't use finished flag this way
                                }
                            });
                            // Optimistic update? No, wait for RELAY_UPDATE to be safe/sync.
                            // But for UI responsiveness, we might want to show "Sending..."
                            // RelayMode handles "Success" animation.
                        }}
                    />
                );
            } else {
                // Waiting for teammate
                return (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
                        <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                            <User size={80} className="text-indigo-400 relative z-10" />
                            <div className="absolute -bottom-2 -right-2 bg-slate-800 p-2 rounded-full border border-slate-600">
                                <Loader2 className="animate-spin text-white" size={24} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Várakozás...</h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-md text-center">
                            A staféta most <span className="font-bold text-indigo-400 text-2xl mx-2">{currentTeammate}</span>-nál van.
                        </p>

                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 max-w-sm w-full">
                            <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Csapat Haladás</div>
                            <div className="text-4xl font-black text-white mb-2">{score} / {gameData.questions.length}</div>
                            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-indigo-500 h-full transition-all duration-500"
                                    style={{ width: `${(score / gameData.questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );
            }
        }


        // Duel Mode
        if (gameData.mode === 'duel' && gameData.questions) {
            return (
                <div className="py-8 animate-in fade-in duration-500">
                    <DuelMode
                        questions={gameData.questions}
                        onScoreUpdate={(currentScore) => {
                            peerService.sendToHost({
                                type: 'SUBMIT_ANSWER',
                                payload: { playerId: name, answer: { score: currentScore, finished: false } }
                            });
                        }}
                        onFinish={(score) => {
                            // Send final score to host
                            peerService.sendToHost({
                                type: 'SUBMIT_ANSWER',
                                payload: { playerId: name, answer: { score, finished: true } }
                            });
                            setStep('waiting');
                        }}
                    />
                </div>
            );
        }

        // Territory Mode
        // Territory Mode


        // Helper to get card details (duplicated from cards.ts for now or move to shared?)
        // We should export CARD_DEFINITIONS from utils/cards.ts and import it.
        // But since I can't easily change imports without reading top of file again, 
        // I'll assume I can import it if I added it to top.
        // Wait, I didn't add import yet. Let me add it in a separate step or just hardcode for this view if it's cleaner.
        // Actually, I can use a quick map here for display if I don't want to mess with imports yet.
        // But real implementation should import.
        // Let's rely on `gameData` providing card details? No, `teamCards` is just IDs usually.
        // Let's import `CARD_DEFINITIONS` in the next step. For now, I'll put a placeholder map.

        return (
            <div className="fixed inset-0 h-[100dvh] w-screen bg-slate-950 overflow-hidden flex flex-col user-select-none touch-none">
                <div className="absolute inset-0 bg-[url('/bg-stars.jpg')] bg-cover bg-center opacity-50 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/80 pointer-events-none"></div>

                {/* Animated Asteroids/Floating Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-10 w-24 h-24 bg-slate-700/30 rounded-full blur-xl animate-[pulse_8s_infinite]"></div>
                    <div className="absolute bottom-40 right-20 w-32 h-32 bg-indigo-900/20 rounded-full blur-2xl animate-[pulse_12s_infinite]"></div>

                    {/* CSS Asteroids */}
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-slate-600 rounded-full animate-[spin_20s_linear_infinite] opacity-60 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
                    <div className="absolute top-2/3 right-1/3 w-6 h-6 bg-slate-500 rounded-full animate-[spin_25s_linear_infinite_reverse] opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.05)]"></div>
                    <div className="absolute bottom-10 left-20 w-3 h-3 bg-slate-400 rounded-full animate-[pulse_5s_infinite] opacity-40"></div>

                    {/* Shooting Star */}
                    <div className="absolute top-10 right-0 w-[200px] h-[1px] bg-gradient-to-l from-transparent via-white to-transparent rotate-[-45deg] animate-[ping_3s_infinite] opacity-0"></div>
                </div>

                {/* Main Game Content - Takes available space */}
                <div className="flex-1 relative z-10 w-full max-w-7xl mx-auto flex flex-col min-h-0">
                    {/* Targeting Banner */}
                    {targetingMode && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-4 animate-in slide-in-from-bottom">
                            <div className="animate-pulse flex items-center gap-2">
                                <span className="text-lg">🎯</span>
                                <span className="font-bold text-sm">Válassz célpontot!</span>
                            </div>
                            <button
                                onClick={() => setTargetingMode(null)}
                                className="bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors"
                            >
                                <XCircle size={16} />
                            </button>
                        </div>
                    )}

                    {/* Card Inspection Modal - Galactic Style */}
                    {inspectingCard && (
                        <div className="absolute inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
                            onClick={() => setInspectingCard(null)}>

                            {/* Modal Container */}
                            <div className="relative max-w-sm w-full group perspective-1000" onClick={e => e.stopPropagation()}>

                                {/* Cosmic Glow Background */}
                                <div className={`absolute -inset-4 rounded-3xl blur-2xl opacity-40 animate-pulse ${inspectingCard.category === 'offensive' ? 'bg-red-600' :
                                    inspectingCard.category === 'defensive' ? 'bg-emerald-600' :
                                        'bg-indigo-600'
                                    }`}></div>

                                <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">

                                    {/* Close Button */}
                                    <button
                                        onClick={() => setInspectingCard(null)}
                                        className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-20"
                                    >
                                        <XCircle size={24} />
                                    </button>

                                    {/* Content */}
                                    <div className="flex flex-col items-center relative z-10">

                                        {/* Icon Ring */}
                                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${inspectingCard.category === 'offensive' ? 'border-red-500/50 bg-red-900/20' :
                                            inspectingCard.category === 'defensive' ? 'border-emerald-500/50 bg-emerald-900/20' :
                                                'border-indigo-500/50 bg-indigo-900/20'
                                            }`}>
                                            <div className="text-5xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-[pulse_3s_infinite]">
                                                {inspectingCard.icon}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white uppercase tracking-widest mb-1 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                            {inspectingCard.name}
                                        </h3>

                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border ${inspectingCard.category === 'offensive' ? 'border-red-500/30 text-red-200 bg-red-500/10' :
                                            inspectingCard.category === 'defensive' ? 'border-emerald-500/30 text-emerald-200 bg-emerald-500/10' :
                                                'border-indigo-500/30 text-indigo-200 bg-indigo-500/10'
                                            }`}>
                                            {inspectingCard.category === 'offensive' ? 'Offenzív' : inspectingCard.category === 'defensive' ? 'Defenzív' : 'Taktikai'}
                                        </div>

                                        <div className="w-full bg-black/40 rounded-xl p-4 mb-6 border border-white/5 backdrop-blur-sm">
                                            <p className="text-slate-300 text-center leading-relaxed">
                                                {inspectingCard.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                handlePlayCard(inspectingCard.id);
                                                setInspectingCard(null);
                                            }}
                                            className="w-full group/btn relative overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                        >
                                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#312E81_50%,#E2E8F0_100%)]" />
                                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-6 py-4 text-sm font-bold text-white backdrop-blur-3xl transition-all group-hover/btn:bg-slate-900">
                                                <span className="uppercase tracking-widest mr-2">Aktiválás</span>
                                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </span>
                                        </button>
                                    </div>

                                    {/* Tech Grid Overlay */}
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Card Notification Toast */}
                    {cardNotification && (
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-10 fade-in duration-300 w-full max-w-sm px-4 pointer-events-none">
                            <div className="bg-slate-900/90 border-2 border-yellow-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>
                                <div className="text-3xl filter drop-shadow-lg">
                                    {(CARD_DEFINITIONS as any)[cardNotification.cardId]?.icon || '🃏'}
                                </div>
                                <div className="flex-1 relative z-10">
                                    <h4 className="font-bold text-yellow-100 text-sm uppercase tracking-wide">
                                        Új Galaktikus Kártya!
                                    </h4>
                                    <p className="text-xs text-yellow-200/80 mb-1">
                                        <span className="font-bold text-white">
                                            {cardNotification.team === 'Piros' ? 'Vörös Csillagköd' :
                                                cardNotification.team === 'Kék' ? 'Kék Nebula' :
                                                    cardNotification.team === 'Zöld' ? 'Zöld Szupernóva' :
                                                        cardNotification.team === 'Sárga' ? 'Arany Napkorona' : cardNotification.team}
                                        </span> csapat szerezte
                                    </p>
                                    <div className="text-xs bg-black/30 p-1.5 rounded text-white font-mono border border-white/10">
                                        {cardNotification.reason}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Generic Game Notification Toast (e.g. Battle Feedback) */}
                    {gameNotification && (
                        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 fade-in duration-300 w-full max-w-sm px-4 pointer-events-none">
                            <div className={`bg-slate-900/95 border-2 ${gameNotification.color === 'red' ? 'border-red-500/50' : 'border-blue-500/50'} rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-4 relative overflow-hidden`}>
                                <div className={`absolute inset-0 ${gameNotification.color === 'red' ? 'bg-red-500/10' : 'bg-blue-500/10'} animate-pulse`}></div>
                                <div className="text-3xl filter drop-shadow-lg">
                                    {gameNotification.icon || '📢'}
                                </div>
                                <div className="flex-1 relative z-10">
                                    <h4 className={`font-bold text-sm uppercase tracking-wide ${gameNotification.color === 'red' ? 'text-red-100' : 'text-blue-100'}`}>
                                        {gameNotification.title}
                                    </h4>
                                    <p className="text-xs text-slate-300">
                                        {gameNotification.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Territory Mode Guard */}
                    {gameData.territoryState ? (
                        <div className="flex-1 overflow-hidden p-4">
                            {/* DEBUG LOGGING */}
                            {(() => {
                                const active = gameData.activeTeam || gameData.territoryState.activeTeam;
                                console.log(`[TerritoryRender] MyTeam: ${relayTeam}, Active: ${active}, Match: ${relayTeam === active}`);
                                return null;
                            })()}
                            <TerritoryMode
                                hexes={gameData.territoryState.hexes}
                                owners={gameData.owners || gameData.territoryState.owners}
                                scores={gameData.scores || gameData.territoryState.scores}
                                tileTypes={gameData.tileTypes || gameData.territoryState.tileTypes}
                                difficulties={gameData.difficulties || gameData.territoryState.difficulties}
                                difficultyVisible={gameData.difficultyVisible || gameData.territoryState.difficultyVisible}
                                onHexClick={handleHexClick}
                                myTeam={relayTeam || undefined}
                                activeTeam={gameData.activeTeam || gameData.territoryState.activeTeam}
                                isMyTurn={relayTeam === (gameData.activeTeam || gameData.territoryState.activeTeam)}
                                isTargeting={!!targetingMode}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white z-10 relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
                            <div className="text-xl font-bold">Terület betöltése...</div>
                        </div>
                    )}
                </div>

                {/* Card Hand - Bottom Fixed Height Area */}
                <div className="h-32 md:h-40 shrink-0 relative z-30 flex justify-center items-end pb-2 md:pb-4 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent pointer-events-none">
                    {/* Hand Container */}
                    <div className="flex items-end -space-x-2 md:-space-x-4 px-4 pointer-events-auto">
                        {/* Render actual cards */}
                        {teamCards.map((cardId: string, idx: number) => {
                            // Use shared definitions, fallback if missing
                            // We need to cast cardId to keyof typeof CARD_DEFINITIONS or just use any for safety if ID is string
                            const def = (CARD_DEFINITIONS as any)[cardId] || {
                                id: cardId,
                                name: 'Ismeretlen',
                                icon: '❓',
                                description: 'Ismeretlen kártya',
                                category: 'tactical',
                                timing: 'passive'
                            };

                            // Simplified Card Design
                            const borderColor = def.category === 'offensive' ? 'border-red-500 bg-red-950' :
                                def.category === 'defensive' ? 'border-green-500 bg-green-950' :
                                    'border-blue-500 bg-blue-950';

                            return (
                                <div key={idx} className="relative w-20 h-32 md:w-28 md:h-40 group hover:-translate-y-4 transition-transform duration-200 cursor-pointer"
                                    onClick={() => setInspectingCard(def)}>
                                    <div className={`absolute inset-0 rounded-lg border-2 ${borderColor} shadow-md flex flex-col p-1`}>
                                        <div className="flex-1 flex items-center justify-center text-4xl mb-1 bg-black/20 rounded">
                                            {def.icon}
                                        </div>
                                        <div className="text-[10px] md:text-xs font-bold text-white text-center leading-tight truncate px-1">
                                            {def.name}
                                        </div>
                                        <div className="text-[8px] text-center uppercase opacity-70 mt-1">
                                            {def.category === 'offensive' ? 'Támadó' : def.category === 'defensive' ? 'Védő' : 'Taktikai'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty Slots to show capacity (max 5) */}
                        {Array.from({ length: Math.max(0, 5 - teamCards.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-20 h-32 md:w-28 md:h-40 rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/50 flex items-center justify-center opacity-50 relative -z-10 ml-[-8px]">
                            </div>
                        ))}
                    </div>
                </div>

                {/* Context-aware helper text or controls could go here if needed */}


                {/* Battle Interface Modal Overlay - Now constrained to game area */}
                {territoryInteraction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 animate-in fade-in duration-200">
                        {/* Full Screen Layout for Mobile Optimization - No Scrolling needed ideally */}
                        <div className="w-full h-full max-w-2xl flex flex-col">

                            {/* Top Bar - Territory Info (Compact) */}
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${gameData.owners?.[`${territoryInteraction.hex.q},${territoryInteraction.hex.r},${territoryInteraction.hex.s}`]
                                        ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                        : 'bg-slate-500'
                                        }`}></div>
                                    <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                                        {gameData.owners?.[`${territoryInteraction.hex.q},${territoryInteraction.hex.r},${territoryInteraction.hex.s}`] || "Senki Földje"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleTerritoryResult(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>

                            {/* Question Area - Maximize space, minimize padding */}
                            <div className="flex-1 relative flex flex-col min-h-0 bg-slate-900">
                                <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                                    <div className="min-h-full flex flex-col p-2 sm:p-4">
                                        <QuestionBlock
                                            data={territoryInteraction.question}
                                            onComplete={() => handleTerritoryResult(true)}
                                            strictMode={true}
                                            onStrictFail={() => handleTerritoryResult(false)}
                                            compact={true} // Ensure formatting is dense
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Wrong Answer Feedback Overlay */}
                            {territoryInteraction.feedback === false && (
                                <div className="absolute inset-0 bg-red-900/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-in zoom-in-95 duration-200">
                                    <XCircle size={64} className="text-red-400 mb-4 animate-[bounce_0.5s_infinite]" />
                                    <h3 className="text-3xl font-bold text-white mb-2">Helytelen Válasz!</h3>
                                    <p className="text-red-200 text-center px-8">
                                        A támadás nem sikerült.<br />
                                        (Próbáld újra a következő körben!)
                                    </p>
                                </div>
                            )}

                            <div className="mt-0 pt-1 border-t border-white/5 flex flex-col gap-1 bg-slate-900/90">
                                {/* Battle Support Cards */}
                                {teamCards && (
                                    <div className="flex gap-2 justify-center">
                                        {teamCards.includes('nav_probe') && (
                                            <button
                                                onClick={() => {
                                                    peerService.sendToHost({
                                                        type: 'TERRITORY_ACTION',
                                                        payload: { playerId: name, action: 'CARD_USE', usedCard: 'nav_probe' }
                                                    });
                                                    setGameNotification({ icon: '🧭', title: 'Navigációs Szonda', message: 'Helyes úton jársz... (Tipp aktiválva)' });
                                                }}
                                                className="bg-purple-900/50 border border-purple-500/30 hover:bg-purple-800/50 p-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold uppercase transition-colors"
                                            >
                                                🧭 Szonda
                                            </button>
                                        )}
                                        {teamCards.includes('hyperspace') && (
                                            <button
                                                onClick={() => {
                                                    peerService.sendToHost({
                                                        type: 'TERRITORY_ACTION',
                                                        payload: { playerId: name, action: 'CARD_USE', usedCard: 'hyperspace' }
                                                    });
                                                    const questions = gameData.questions || [];
                                                    const hexId = `${territoryInteraction.hex.q},${territoryInteraction.hex.r},${territoryInteraction.hex.s}`;
                                                    const difficulty = (gameData.difficulties || gameData.territoryState?.difficulties || {})[hexId] || 2;
                                                    const pool = questions.filter((q: any) => q.difficulty === difficulty);
                                                    const randomQ = pool[Math.floor(Math.random() * pool.length)];
                                                    setTerritoryInteraction(prev => prev ? { ...prev, question: randomQ } : null);

                                                    setGameNotification({ icon: '🚀', title: 'Hipertér Ugrás', message: 'Új feladat generálva!' });
                                                }}
                                                className="bg-blue-900/50 border border-blue-500/30 hover:bg-blue-800/50 p-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold uppercase transition-colors"
                                            >
                                                🚀 Ugrás
                                            </button>
                                        )}
                                        {teamCards.includes('time_dilation') && (
                                            <button
                                                onClick={() => {
                                                    peerService.sendToHost({
                                                        type: 'TERRITORY_ACTION',
                                                        payload: { playerId: name, action: 'CARD_USE', usedCard: 'time_dilation' }
                                                    });
                                                    setGameNotification({ icon: '⏳', title: 'Idődilatáció', message: 'Az idő lelassult... (Bónusz gondolkodási idő)' });
                                                }}
                                                className="bg-amber-900/50 border border-amber-500/30 hover:bg-amber-800/50 p-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold uppercase transition-colors"
                                            >
                                                ⏳ Lassítás
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-center pb-1">
                                    <button
                                        onClick={() => handleTerritoryResult(false)}
                                        className="text-slate-500 hover:text-white text-[10px] md:text-sm font-bold flex items-center gap-1.5 transition-colors py-1 px-3 hover:bg-white/5 rounded-lg"
                                    >
                                        <XCircle size={14} /> Visszavonulás
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    } if (gameData.mode === 'duel' && gameData.questions) {
        return (
            <div className="py-8 animate-in fade-in duration-500">
                <DuelMode
                    questions={gameData.questions}
                    onScoreUpdate={(currentScore) => {
                        peerService.sendToHost({
                            type: 'SUBMIT_ANSWER',
                            payload: { playerId: name, answer: { score: currentScore, finished: false } }
                        });
                    }}
                    onFinish={(score) => {
                        // Send final score to host
                        peerService.sendToHost({
                            type: 'SUBMIT_ANSWER', // Reusing this type or create new 'SCORE_UPDATE'
                            payload: { playerId: name, answer: { score, finished: true } }
                        });
                        setStep('waiting');
                    }}
                />
            </div>
        );
    }

    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Játék Indul!</h1>
            <p className="text-xl text-slate-400">Játékmód: {gameData?.mode}</p>
        </div>
    );
}



export default GameClient;
