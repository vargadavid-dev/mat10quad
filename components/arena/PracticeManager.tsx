import React, { useState, useEffect, useRef } from 'react';
import { useTerritoryGame } from '../../hooks/useTerritoryGame';
import { generateDuelQuestions } from '../../utils/QuestionGenerator';
import TerritoryMode from './modes/TerritoryMode';
import { ArrowLeft, Bot, RefreshCw, XCircle, Zap, Settings2 } from 'lucide-react';
import { soundManager } from '../../utils/SoundManager';
import QuestionBlock from '../QuestionBlock';
import { getNeighbors, getHexId } from '../../utils/hex-grid';
import { CardId, CARD_DEFINITIONS, GalacticCard, TeamCardState } from '../../utils/cards';
import { DifficultyLevel, setDifficulty as setGlobalDifficulty } from '../../utils/DifficultyConfig';
import DevDashboard from './DevDashboard';

interface PracticeGameManagerProps {
    onBack: () => void;
    playerTopicPreferences?: string[]; // Optional: could be passed from parent
}

const PracticeGameManager: React.FC<PracticeGameManagerProps> = ({ onBack }) => {
    // 1. Local State
    const [gameState, setGameState] = useState<any>(null);
    const [interaction, setInteraction] = useState<{ hex: any, question: any, feedback?: boolean } | null>(null);
    const [targetingMode, setTargetingMode] = useState<string | null>(null);
    const [notification, setNotification] = useState<any>(null);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [cardNotification, setCardNotification] = useState<any>(null);
    const [inspectingCard, setInspectingCard] = useState<GalacticCard | null>(null);

    // We need to track the "active card" for immediate use (wormhole/supernova)
    const [activeCard, setActiveCard] = useState<string | null>(null);
    const [seenQuestionIds, setSeenQuestionIds] = useState<Set<string>>(new Set());
    const [showDevDashboard, setShowDevDashboard] = useState(false);
    const [isDevMode, setIsDevMode] = useState(false);
    const [difficultyOverrides, setDifficultyOverrides] = useState<{ [topic: string]: { [subType: string]: DifficultyLevel } }>({});

    // 2. Logic Hook
    const { initializeTerritoryGame, processTerritoryAction: processActionHook } = useTerritoryGame({
        onGameStateUpdate: (newState) => {
            setGameState(newState);
            // Check for Bot Turn
            checkBotTurn(newState);
        }
    });

    const gameStateRef = useRef(gameState);
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

    // 3. Initialize Game on Mount
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const players = ['Te', 'Robot'];
        // Robot is green, Player is Red? Or random.
        // initializeTerritoryGame uses players list.
        // Let's force specific teams if possible, but the hook assigns randomly or logic.
        // Hook logic: 2 players -> P1=Red/Blue, P2=Blue/Green depending on order.

        // We can pass custom teams to hook if we want?
        // useTerritoryGame takes (players, customTeams).
        const customTeams = {
            'Kék': ['Te'],
            'Piros': ['Robot']
        };

        const initialState = initializeTerritoryGame(players, customTeams);
        // Generate Questions
        const topics = ['quadratic', 'coord_geometry', 'functions'];
        const questions = generateDuelQuestions(topics, 80);

        const fullState = {
            ...initialState,
            mode: 'territory',
            questions,
            activeTeam: 'Kék' // Player starts
        };

        setGameState(fullState);
        setInteraction(null);
        setSeenQuestionIds(new Set());
        setNotification({ title: 'Gyakorló Mód', message: 'Győzd le a robotot!', icon: '🤖', color: 'blue' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleRegenerateQuestions = () => {
        const topics = ['quadratic', 'coord_geometry', 'functions'];
        const questions = generateDuelQuestions(topics, 80);
        setGameState((prev: any) => ({ ...prev, questions }));
        setSeenQuestionIds(new Set());
        setNotification({ title: 'Újragenelás', message: `${questions.length} új kérdés generálva!`, icon: '🔄', color: 'blue' });
        setTimeout(() => setNotification(null), 3000);
    };

    // Debug: Add all cards
    const [debugClicks, setDebugClicks] = useState(0);
    const [devDashboardClicks, setDevDashboardClicks] = useState(0);

    const handleDebugCards = () => {
        setDebugClicks(prev => {
            const newValue = prev + 1;
            if (newValue >= 5) {
                const allCards = Object.keys(CARD_DEFINITIONS);
                setGameState((prev: any) => ({
                    ...prev,
                    teamCards: {
                        ...prev.teamCards,
                        'Kék': {
                            ...prev.teamCards['Kék'],
                            hand: [...prev.teamCards['Kék'].hand, ...allCards]
                        }
                    }
                }));
                soundManager.playPowerup();
                setNotification({ title: 'Debug', message: 'Minden kártya hozzáadva!', icon: '🎴', color: 'blue' });
                setTimeout(() => setNotification(null), 3000);
                return 0;
            }
            return newValue;
        });
    };

    const handleDevDashboardTrigger = () => {
        setDevDashboardClicks(prev => {
            const newValue = prev + 1;
            if (newValue >= 3) {
                setShowDevDashboard(true);
                setIsDevMode(true);
                soundManager.playPowerup();
                return 0;
            }
            return newValue;
        });
    };

    const handleDifficultyChange = (topic: string, subType: string, level: DifficultyLevel) => {
        // Mutate global config so new questions use updated difficulty
        setGlobalDifficulty(topic, subType, level);
        setDifficultyOverrides(prev => ({
            ...prev,
            [topic]: {
                ...(prev[topic] || {}),
                [subType]: level
            }
        }));
    };

    const confirmPlayCard = () => {
        if (!selectedCardId || !gameState) return;

        // Restriction for Hyperspace (Hipertér Ugrás) - Only during active question
        if (selectedCardId === 'hyperspace' && !interaction) {
            soundManager.playError();
            setNotification({
                title: 'Nem használható!',
                message: 'A Hipertér Ugrás csak aktív feladat közben használható!',
                icon: '🚫',
                color: 'red'
            });
            setTimeout(() => setNotification(null), 3000);
            setSelectedCardId(null);
            return;
        }

        const needsTarget = ['asteroid', 'force_field', 'wormhole', 'supernova'].includes(selectedCardId);

        if (needsTarget) {
            if (selectedCardId === 'wormhole' || selectedCardId === 'supernova') {
                // Active Effect for next attack
                setActiveCard(selectedCardId);
                setTargetingMode(selectedCardId); // Visual indicator
                soundManager.playPowerup();
                setNotification({ title: 'Kártya Aktiválva', message: 'Válassz célpontot a támadáshoz!', icon: '✨', color: 'blue' });
                setTimeout(() => setNotification(null), 3000);
            } else {
                setTargetingMode(selectedCardId);
                soundManager.playClick();
                setNotification({ title: 'Célpont Kiválasztása', message: 'Kattints egy mezőre a kártya használatához!', icon: '🎯', color: 'blue' });
                setTimeout(() => setNotification(null), 3000);
            }
        } else if (selectedCardId === 'hyperspace') {
            // Manual handling for Hyperspace to prevent turn skip
            // 1. Remove card
            const newHand = [...(gameState.teamCards['Kék'].hand || [])];
            const cardIndex = newHand.findIndex(c => c === 'hyperspace');
            if (cardIndex > -1) newHand.splice(cardIndex, 1);

            // 2. New Question
            const difficulty = interaction.question.difficulty;
            const currentInputType = interaction.question.inputType;

            // Filter by difficulty and exclude current question AND seen questions
            let pool = gameState.questions.filter((q: any) =>
                q.difficulty === difficulty &&
                q.id !== interaction.question.id &&
                !seenQuestionIds.has(q.id)
            );

            // Try to find a question with a DIFFERENT input type (content type)
            const poolDifferentType = pool.filter((q: any) => q.inputType !== currentInputType);

            if (poolDifferentType.length > 0) {
                pool = poolDifferentType;
            }

            // Fallback: If no unseen questions, try ANY unseen question of that difficulty (ignore input type)
            if (pool.length === 0) {
                pool = gameState.questions.filter((q: any) =>
                    q.difficulty === difficulty &&
                    q.id !== interaction.question.id &&
                    !seenQuestionIds.has(q.id)
                );
            }

            // Fallback 2: If REALLY no unseen questions, allow repeats
            if (pool.length === 0) {
                pool = gameState.questions.filter((q: any) => q.difficulty === difficulty && q.id !== interaction.question.id);
            }

            if (pool.length === 0) pool = gameState.questions; // Ultimate fallback

            const newQuestion = pool[Math.floor(Math.random() * pool.length)];

            // Mark as seen
            setSeenQuestionIds(prev => new Set(prev).add(newQuestion.id));

            setInteraction({ ...interaction, question: newQuestion });

            setGameState((prev: any) => ({
                ...prev,
                teamCards: {
                    ...prev.teamCards,
                    'Kék': {
                        ...prev.teamCards['Kék'],
                        hand: newHand
                    }
                }
            }));

            soundManager.playPowerup();
            setNotification({ title: 'Hipertér Ugrás', message: 'Új kérdést kaptál!', icon: '🔄', color: 'blue' });
            setTimeout(() => setNotification(null), 3000);

        } else {
            // Immediate Effect
            const newState = processActionHook(gameState, 'Te', 'CARD_USE', '', true, selectedCardId as CardId);
            handleActionResult(newState);
            soundManager.playPowerup();
            setNotification({
                title: 'Sikeres kártyahasználat!',
                message: `Kijátszottad: ${(CARD_DEFINITIONS as any)[selectedCardId]?.name || selectedCardId}`,
                type: 'success',
                icon: <Zap size={32} className="text-yellow-400" />,
                color: 'blue'
            });
            setTimeout(() => setNotification(null), 3000);
        }

        setSelectedCardId(null);
    };

    // 4. Bot Logic
    const checkBotTurn = (currentData: any) => {
        if (!currentData) return;
        const activeTeam = currentData.activeTeam;

        // Assuming Robot is always 'Piros' based on our init
        if (activeTeam === 'Piros') {
            // It's Bot's turn
            setTimeout(() => {
                performBotMove(currentData);
            }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
        }
    };

    const performBotMove = (currentData: any) => {
        // Simple Bot AI
        // 1. Get all hexes it can attack
        // For simplicity: Bot attacks random hex, preferably adjacent to own or own to reinforce.

        const owners = currentData.owners;
        const hexIds = currentData.hexes.map((h: any) => getHexId(h));
        const myHexes = hexIds.filter((id: string) => owners[id] === 'Piros');

        // Find adjacent candidates
        let candidates: string[] = [];

        if (myHexes.length === 0) {
            // Should not happen unless eliminated
            return;
        }

        // Get all neighbors of my hexes (that are not mine or allow reinforce)
        myHexes.forEach((myId: string) => {
            const [q, r, s] = myId.split(',').map(Number);
            const neighbors = getNeighbors({ q, r, s });
            neighbors.forEach(n => {
                const nId = getHexId(n);
                if (hexIds.includes(nId)) {
                    candidates.push(nId);
                }
            });
        });

        // Also add my own hexes for reinforcement (small chance)
        // candidates.push(...myHexes);

        // Filter unique
        candidates = [...new Set(candidates)];

        if (candidates.length === 0) return;

        const targetHexId = candidates[Math.floor(Math.random() * candidates.length)];

        // Bot Success Rate (e.g. 70%)
        const isCorrect = Math.random() < 0.7;

        // Execute Action via Hook
        if (gameStateRef.current.activeTeam !== 'Piros') {
            console.warn("Bot tried to act but it is not its turn!");
            return;
        }

        const resultState = processActionHook(
            gameStateRef.current,
            'Robot', // playerId
            'ATTACK',
            targetHexId,
            isCorrect
        );

        if (resultState) {
            setGameState(resultState);
            soundManager.playClick(); // Simulate sound for bot action

            // Notification if Bot captures
            if (isCorrect && resultState.owners[targetHexId] === 'Piros' && gameStateRef.current.owners[targetHexId] !== 'Piros') {
                // Bot made a capture
            }

            checkBotTurn(resultState); // Check if turn rotated (should have)
        }
    };

    // 5. Player Interaction Handlers
    const handleHexClick = (hex: any) => {
        if (!gameState) return;
        if (gameState.activeTeam !== 'Kék') {
            soundManager.playError();
            setNotification({ title: 'Várj a sorodra!', message: 'A robot még gondolkodik...', icon: '⏳', color: 'red' });
            setTimeout(() => setNotification(null), 2000);
            return;
        }

        // Targeting Mode Logic (Cards)
        if (targetingMode && targetingMode !== 'wormhole' && targetingMode !== 'supernova') {
            const hexId = getHexId(hex);
            // ... handle card targeting ...
            // Reuse logic from GameClient
            const newState = processActionHook(
                gameState,
                'Te',
                'CARD_USE',
                hexId, // misuse hexId field or create handling
                true, // card use is "correct"
                targetingMode as CardId // usedCard
            );

            handleActionResult(newState);
            setTargetingMode(null);
            return;
        }

        // Special handling for attack modifiers (wormhole, supernova)
        if (targetingMode === 'wormhole' || targetingMode === 'supernova') {
            setTargetingMode(null);
            // Fall through to attack logic
        }

        // Validate Adjacency
        // ... (reuse logic or trust hook? Hook doesn't validate adjacency strict enough yet, mostly ownership)
        // Let's strictly validate here for the Player.
        const hexId = getHexId(hex);
        const owners = gameState.owners;
        const myTeam = 'Kék';
        const isMyHex = owners[hexId] === myTeam;

        let isAdjacent = false;
        if (!isMyHex) {
            const neighbors = getNeighbors(hex);
            isAdjacent = neighbors.some(n => owners[getHexId(n)] === myTeam);
        }

        const canAttack = isMyHex || isAdjacent || activeCard === 'wormhole';

        if (!canAttack) {
            soundManager.playError();
            setNotification({ title: 'Túl messze!', message: 'Csak szomszédos mezőt támadhatsz.', icon: '🚫', color: 'red' });
            setTimeout(() => setNotification(null), 2000);
            return;
        }

        // Select Question
        const difficulty = gameState.difficulties?.[hexId] || 2;

        // Filter: Difficulty match AND not seen yet
        let pool = gameState.questions.filter((q: any) => q.difficulty === difficulty && !seenQuestionIds.has(q.id));

        // Fallback: If all valid questions seen, allow repeats
        if (pool.length === 0) {
            pool = gameState.questions.filter((q: any) => q.difficulty === difficulty);
        }

        if (pool.length === 0) pool = gameState.questions; // Ultimate fallback

        if (pool.length === 0) {
            console.error("No questions available!");
            return;
        }

        const question = pool[Math.floor(Math.random() * pool.length)];

        // Mark as seen
        setSeenQuestionIds(prev => new Set(prev).add(question.id));

        soundManager.playClick();
        setInteraction({ hex, question });
    };

    const handleAnswer = (success: boolean) => {
        if (!interaction) return;

        // Process Logic
        const newState = processActionHook(
            gameState,
            'Te',
            'ATTACK',
            getHexId(interaction.hex),
            success,
            activeCard as CardId
        );

        handleActionResult(newState, success);

        if (activeCard) setActiveCard(null);
        setInteraction(prev => success ? null : { ...prev!, feedback: false });

        if (!success) {
            soundManager.playError();
            setTimeout(() => setInteraction(null), 2000);
        } else {
            soundManager.playSuccess();
            soundManager.playCapture();
        }
    };

    const handleActionResult = (newState: any, success: boolean = true) => {
        if (newState) {
            setGameState(newState);
            checkBotTurn(newState);
        }
    };

    // Cards Logic (Simplified)
    const handlePlayCard = (cardId: string) => {
        setSelectedCardId(cardId);
    };

    if (!gameState) return <div className="text-white">Betöltés...</div>;

    const myTeamCards = gameState.teamCards?.['Kék']?.hand || [];

    return (
        <div className="fixed inset-0 bg-slate-950 overflow-hidden flex flex-row h-screen w-screen">
            {/* Left Column: Game Map & HUD */}
            <div className="flex-grow relative h-full flex flex-col min-w-0">
                {/* Header (Back button + Title) - Static Top Bar */}
                <div className="p-4 flex justify-between items-center z-30">
                    <div className="flex gap-4 items-center">
                        <button onClick={onBack} className="bg-slate-800 p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex flex-col">
                            <div
                                onClick={handleDevDashboardTrigger}
                                className="bg-blue-900/50 text-blue-100 px-4 py-1.5 rounded-full font-bold flex items-center gap-2 border border-blue-500/30 w-fit cursor-default select-none"
                            >
                                <Bot size={18} />
                                <span>Gyakorlás (vs Robot)</span>
                            </div>
                        </div>
                    </div>

                    {/* Instructions in Header */}
                    <div className="flex items-center gap-2">
                        {isDevMode && (
                            <button
                                onClick={() => setShowDevDashboard(true)}
                                className="p-2 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                                title="Fejlesztői Felület"
                            >
                                <Settings2 size={16} />
                            </button>
                        )}
                        <div className="hidden md:block text-slate-400 text-sm italic mr-4">
                            Válassz egy szomszédos hatszöget a támadáshoz vagy a sajátodat a védekezéshez!
                        </div>
                    </div>
                </div>

                {/* Game Notification - Absolute over Map */}
                {notification && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 fade-in duration-300 w-full max-w-sm px-4 pointer-events-none">
                        <div className={`bg-slate-900/95 border-2 ${notification.color === 'red' ? 'border-red-500/50' : 'border-blue-500/50'} rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-4`}>
                            <div className="text-3xl">{notification.icon}</div>
                            <div>
                                <h4 className={`font-bold text-sm uppercase ${notification.color === 'red' ? 'text-red-100' : 'text-blue-100'}`}>{notification.title}</h4>
                                <p className="text-xs text-slate-300">{notification.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Map Area */}
                <div className="flex-1 relative z-10 w-full h-full min-h-0 bg-slate-950/50">
                    <TerritoryMode
                        hexes={gameState.hexes}
                        owners={gameState.owners}
                        scores={gameState.scores}
                        tileTypes={gameState.tileTypes}
                        difficulties={gameState.difficulties}
                        difficultyVisible={gameState.difficultyVisible}
                        onHexClick={handleHexClick}
                        myTeam="Kék"
                        activeTeam={gameState.activeTeam}
                        isMyTurn={gameState.activeTeam === 'Kék'}
                        targetingType={targetingMode === 'wormhole' ? 'global' : (targetingMode ? 'adjacent' : null)}
                        hideControls={true}
                    />
                </div>

            </div>

            {/* Right Column: Task Panel & Cards */}
            <div className="w-full max-w-md h-[calc(100vh-2rem)] m-4 ml-0 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl z-40 relative overflow-hidden">

                {/* Main Content Area (Task or Placeholder) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
                    {interaction ? (
                        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-transparent">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <span className="bg-indigo-500/20 text-indigo-300 p-1.5 rounded-lg">⚡</span>
                                    Feladat Megoldása
                                </h3>
                                <button onClick={() => setInteraction(null)} className="text-slate-400 hover:text-white transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 relative">
                                <QuestionBlock
                                    data={interaction.question}
                                    onComplete={() => handleAnswer(true)}
                                    strictMode={true}
                                    onStrictFail={() => handleAnswer(false)}
                                    compact={true}
                                />

                                {interaction.feedback === false && (
                                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-50 text-white animate-in fade-in rounded-lg">
                                        <XCircle size={64} className="mb-4 text-red-500 animate-bounce" />
                                        <h3 className="text-2xl font-bold text-red-200">Helytelen Válasz</h3>
                                        <p className="text-slate-400 mt-2">Próbáld újra!</p>
                                        <button
                                            onClick={() => setInteraction(prev => ({ ...prev!, feedback: undefined }))}
                                            className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors"
                                        >
                                            Vissza a kérdéshez
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-[url('/grid.svg')] bg-center opacity-50">
                            <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border-4 border-slate-800">
                                <Bot size={48} className="text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-300 mb-2">Várakozás Lépésre</h3>
                            <p className="max-w-xs mx-auto">
                                Kattints egy mezőre a térképen, hogy feladatot kapj, vagy használj egy kártyát!
                            </p>
                        </div>
                    )}
                </div>

                {/* Card Detail Modal - Absolute over right panel */}
                {selectedCardId && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col items-center text-center relative">
                            <button
                                onClick={() => setSelectedCardId(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <XCircle size={24} />
                            </button>

                            <div className="w-20 h-24 mb-4 rounded-xl border-2 flex items-center justify-center text-4xl bg-slate-800/50 border-white/20">
                                {(CARD_DEFINITIONS as any)[selectedCardId]?.icon || '?'}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{(CARD_DEFINITIONS as any)[selectedCardId]?.name || selectedCardId}</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                {(CARD_DEFINITIONS as any)[selectedCardId]?.description || 'Nincs leírás ehhez a kártyához.'}
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setSelectedCardId(null)}
                                    className="flex-1 py-2 px-4 rounded-lg bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                                >
                                    Mégse
                                </button>
                                <button
                                    onClick={confirmPlayCard}
                                    className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Aktiválás
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dev Dashboard - Absolute over right panel */}
                {showDevDashboard && (
                    <DevDashboard
                        onClose={() => setShowDevDashboard(false)}
                        onRegenerate={handleRegenerateQuestions}
                        difficultyOverrides={difficultyOverrides}
                        onDifficultyChange={handleDifficultyChange}
                    />
                )}

                {/* Cards Footer - Always visible at bottom of right panel */}
                <div className="border-t border-white/5 bg-slate-900/30 p-4 backdrop-blur-sm">
                    <h4 onClick={handleDebugCards} className={`text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2 select-none transition-colors ${debugClicks > 0 ? 'text-slate-300 cursor-pointer' : ''}`}>
                        <span>🎴 Kártyáid</span>
                        <span className="bg-slate-800 text-slate-400 px-1.5 rounded text-[10px]">{myTeamCards.length}</span>
                    </h4>

                    {myTeamCards.length > 0 ? (
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x">
                            {myTeamCards.map((cardId: string, idx: number) => {
                                const def = (CARD_DEFINITIONS as any)[cardId] || { icon: '?', name: cardId, category: 'tactical' };
                                const borderColor = def.category === 'offensive' ? 'border-red-500/50 bg-red-950/20' :
                                    def.category === 'defensive' ? 'border-green-500/50 bg-green-950/20' : 'border-blue-500/50 bg-blue-950/20';

                                return (
                                    <button
                                        key={idx}
                                        className={`relative w-20 h-28 shrink-0 rounded-lg border-2 ${borderColor} hover:border-opacity-100 hover:scale-105 transition-all group snap-start text-left`}
                                        onClick={() => handlePlayCard(cardId)}
                                    >
                                        <div className="absolute top-1 left-1 text-2xl opacity-80 group-hover:opacity-100 transition-opacity">{def.icon}</div>
                                        <div className="absolute bottom-1 right-1 left-1">
                                            <div className="text-[9px] font-bold text-white truncate leading-tight opacity-70 group-hover:opacity-100">{def.name}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-slate-600 text-sm italic border-2 border-dashed border-slate-700/30 rounded-lg">
                            Nincs aktív kártyád
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};



export default PracticeGameManager;
