import { useState, useCallback, useEffect } from 'react';
import { peerService } from '../utils/peer-service';
import { generateHexGrid } from '../utils/hex-grid';
import { initializeTeamCards, drawRandomCard, isAdjacentToTeamHQ, STREAK_FOR_CARD, CARD_DEFINITIONS, TeamCardState, CardId, MAX_HAND_SIZE } from '../utils/cards';

interface UseTerritoryGameProps {
    onGameStateUpdate: (gameState: any) => void;
}

export const useTerritoryGame = ({ onGameStateUpdate }: UseTerritoryGameProps) => {

    const initializeTerritoryGame = (players: string[], customTeams?: { [team: string]: string[] }) => {
        // TERRITORY MODE INITIALIZATION
        const teamNames = ['Piros', 'Kék', 'Zöld', 'Sárga'];

        let activeTeamNames: string[] = [];
        let gridRadius = 3;
        const teamRosters: { [teamName: string]: string[] } = {};

        if (customTeams && Object.keys(customTeams).length > 0) {
            // Custom Teams Logic
            // Only add non-empty teams to roster
            Object.keys(customTeams).forEach(team => {
                if (customTeams[team].length > 0) {
                    teamRosters[team] = customTeams[team];
                }
            });

            activeTeamNames = Object.keys(teamRosters);
            // Sort active teams by standard order to keep colors consistent if needed
            activeTeamNames.sort((a, b) => teamNames.indexOf(a) - teamNames.indexOf(b));

            gridRadius = activeTeamNames.length > 2 ? 4 : 3;
        } else {
            // Random Logic
            const numTeams = Math.max(2, Math.min(4, Math.floor(players.length / 2)));
            gridRadius = numTeams > 2 ? 4 : 3;

            activeTeamNames = teamNames.slice(0, numTeams);
            activeTeamNames.forEach(t => teamRosters[t] = []);

            const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
            shuffledPlayers.forEach((p, i) => {
                const team = activeTeamNames[i % numTeams];
                teamRosters[team].push(p);
            });
        }

        const hexes = generateHexGrid(gridRadius);


        const owners: { [hexId: string]: string } = {};
        const scores: { [hexId: string]: number } = {};
        const tileTypes: { [hexId: string]: 'normal' | 'energy' | 'relay' | 'research' | 'unstable' } = {};
        const difficulties: { [hexId: string]: 1 | 2 | 3 } = {};
        const difficultyVisible: { [hexId: string]: boolean } = {};

        const shuffledHexes = [...hexes].sort(() => Math.random() - 0.5);

        // Assign HQs
        activeTeamNames.forEach((team, i) => {
            const hq = shuffledHexes[i];
            const id = `${hq.q},${hq.r},${hq.s}`;
            owners[id] = team;
            scores[id] = 5; // Strong Shield for HQ
            tileTypes[id] = 'normal'; // HQs are always normal
        });

        // Assign Special Tiles to remaining
        const remainingHexes = shuffledHexes.slice(activeTeamNames.length);
        remainingHexes.forEach(hex => {
            const id = `${hex.q},${hex.r},${hex.s}`;
            // Assign Difficulty
            // 50% Lvl 1, 30% Lvl 2, 20% Lvl 3
            const diffRand = Math.random();
            const difficulty = diffRand < 0.5 ? 1 : (diffRand < 0.8 ? 2 : 3);
            difficulties[id] = difficulty;

            // Visibility: 40% chance
            difficultyVisible[id] = Math.random() < 0.4;

            const rand = Math.random();
            if (rand < 0.10) tileTypes[id] = 'energy';      // 10%
            else if (rand < 0.15) tileTypes[id] = 'unstable'; // 5%
            else if (rand < 0.20) tileTypes[id] = 'relay';    // 5%
            else if (rand < 0.25) tileTypes[id] = 'research'; // 5%
            else tileTypes[id] = 'normal';
        });

        // Ensure HQs are Lvl 1 (Easy) and Visible
        activeTeamNames.forEach((team, i) => {
            const hq = shuffledHexes[i];
            const id = `${hq.q},${hq.r},${hq.s}`;
            difficulties[id] = 1;
            difficultyVisible[id] = true;
        });

        const teamCardState = initializeTeamCards(activeTeamNames);

        const territoryState = {
            teams: teamRosters,
            hexes,
            owners,
            scores,
            tileTypes,
            difficulties,
            difficultyVisible,
            activeTeam: activeTeamNames[0],
            teamCards: teamCardState,
        };

        return territoryState;
    };

    const processTerritoryAction = (
        currentGameData: any,
        playerId: string,
        action: string,
        hexId: string,
        isCorrect: boolean,
        usedCard?: CardId
    ) => {
        if (!currentGameData || currentGameData.mode !== 'territory') return null;

        const finalGameData = { ...currentGameData };

        // 1. Validate Turn
        const teamName = Object.keys(finalGameData.teams).find(t => finalGameData.teams[t].includes(playerId));
        const teamKeys = Object.keys(finalGameData.teams);
        const currentActiveTeam = finalGameData.activeTeam || teamKeys[0];

        if (teamName !== currentActiveTeam) {
            console.warn(`Player ${playerId} tried to act out of turn (Active: ${currentActiveTeam})`);
            return null;
        }

        // 2. Get card state
        const teamCards: Record<string, TeamCardState> = { ...(finalGameData.teamCards || {}) };
        const myCards = teamCards[teamName!] ? { ...teamCards[teamName!] } : { hand: [], streak: 0, shieldTurns: 0 };

        // 3. Handle used card — remove from hand
        if (usedCard && teamName) {
            const cardIdx = myCards.hand.indexOf(usedCard);
            if (cardIdx >= 0) {
                myCards.hand = [...myCards.hand];
                myCards.hand.splice(cardIdx, 1);
                console.log(`[Cards] ${teamName} used ${CARD_DEFINITIONS[usedCard]?.name || usedCard}`);
            }
        }

        // 4. Check enemy Galactic Shield
        // Only relevant for attacks, not card usage or self-buffs
        const hexOwner = hexId ? finalGameData.owners[hexId] : undefined;
        const newOwners = { ...finalGameData.owners };
        const newScores = { ...finalGameData.scores };
        const enemyCards = hexOwner && hexOwner !== teamName && teamCards[hexOwner];
        const isShielded = enemyCards && enemyCards.shieldTurns > 0;

        // 5. Apply Szupernóva — wrong answer still captures
        const hasSupernovaActive = usedCard === 'supernova';
        const effectiveCorrect = isCorrect || hasSupernovaActive;

        const tileType = (finalGameData.tileTypes?.[hexId]) || 'normal';

        // MAIN ACTION LOGIC
        if (action === 'ATTACK' && hexId) {
            if (effectiveCorrect) {
                if (hexOwner === teamName) {
                    // DEFEND / REINFORCE
                    // Energy tile bonus: +2 instead of +1
                    const reinforceAmount = tileType === 'energy' ? 2 : 1;
                    newScores[hexId] = Math.min((newScores[hexId] || 0) + reinforceAmount, 5);
                } else if (isShielded) {
                    // BLOCKED by Galactic Shield
                    console.log(`[Cards] Attack blocked by ${hexOwner}'s Galaktikus Pajzs!`);
                } else {
                    // ATTACK ENEMY / NEUTRAL
                    const currentShield = newScores[hexId] || 0;

                    // SHIELD BREAKING MECHANIC
                    if (hexOwner && currentShield >= 3 && !hasSupernovaActive) {
                        // Shield Break (Damage only)
                        newScores[hexId] = currentShield - 1;
                        console.log(`[Battle] Shield Broken! ${hexId} decreased to ${newScores[hexId]}`);
                        peerService.broadcast({
                            type: 'GAME_NOTIFICATION',
                            payload: {
                                icon: '🛡️',
                                title: 'Pajzs Gyengült!',
                                message: 'A támadás sikeres, de a pajzs túl erős volt az azonnali foglaláshoz.',
                                color: 'blue'
                            }
                        });
                    } else {
                        // CAPTURE
                        newOwners[hexId] = teamName!;
                        // Unstable tile starts weak
                        newScores[hexId] = tileType === 'unstable' ? 1 : 2;

                        // Check if captured hex is adjacent to enemy HQ -> bonus card
                        if (hexOwner && isAdjacentToTeamHQ(hexId, finalGameData.owners, finalGameData.scores, hexOwner)) {
                            if (myCards.hand.length < 5) {
                                const newCard = drawRandomCard();
                                myCards.hand = [...myCards.hand, newCard];
                                console.log(`[Cards] ${teamName} earned bonus card for HQ-adjacent capture!`);
                                peerService.broadcast({
                                    type: 'CARD_NOTIFICATION',
                                    payload: {
                                        team: teamName!,
                                        cardId: newCard,
                                        reason: 'Elfoglaltál egy Bázis melletti mezőt!'
                                    }
                                });
                            }
                        }
                    }
                }
            } else {
                // PARTIAL FAILURE
                // NO PARTIAL FAILURE
                // If answer is wrong, nothing happens (except streak reset)
                console.log(`[Battle] Attack Failed! No damage dealt.`);

                myCards.streak = 0;
            }

            // 6. Streak tracking (only on questions)
            if (isCorrect) {
                myCards.streak = (myCards.streak || 0) + 1;
                if (myCards.streak >= STREAK_FOR_CARD) {
                    // Start rewarding loop (in case streak is very high, though we reset usually)
                    // Just check once per correct answer
                    if (myCards.hand.length < MAX_HAND_SIZE) {
                        myCards.streak = 0; // Reset only on success
                        const newCard = drawRandomCard();
                        myCards.hand = [...myCards.hand, newCard];
                        console.log(`[Cards] ${teamName} earned streak card!`);
                        peerService.broadcast({
                            type: 'CARD_NOTIFICATION',
                            payload: {
                                team: teamName!,
                                cardId: newCard,
                                reason: `${STREAK_FOR_CARD} helyes válasz sorozat!`
                            }
                        });
                    } else {
                        // Hand is full - Notify user but SAVE streak
                        console.log(`[Cards] ${teamName} streak ${myCards.streak}, but hand is full.`);
                        peerService.broadcast({
                            type: 'CARD_NOTIFICATION',
                            payload: {
                                team: teamName!,
                                cardId: 'galactic_shield', // Placeholder ID or just empty to using generic icon
                                // Actually game client needs a valid ID for icon?
                                // Let's use 'time_dilation' usually safe or just handle error. 
                                // Or use a special "warning" type if I could.
                                // For now, let's just NOT broadcast a "card gained" but maybe a warning toast?
                                // Sending 'CARD_NOTIFICATION' implies card gained.
                                // Let's just NOT reset streak. The user will see their streak high.
                                // Maybe send a "Hand Full" warning?
                                // Let's skip notification to avoid confusion "I got a card... wait no".
                                // Just keeping streak is enough logic fix.
                                reason: "Tele a kezed! Játssz ki egy lapot az újhoz!"
                            }
                        });
                        // Actually, reusing CARD_NOTIFICATION with a specific reason is fine, 
                        // even if no cardId is actually added.
                        // But GameClient expects `cardId` to show icon.
                    }
                }
            } else {
                myCards.streak = 0; // Reset streak on wrong answer
            }
        }

        // 7. Decrement Galactic Shield turns for all teams
        if (action === 'ATTACK' || action === 'CARD_USE') {
            teamKeys.forEach(t => {
                if (teamCards[t] && teamCards[t].shieldTurns > 0) {
                    teamCards[t] = { ...teamCards[t], shieldTurns: teamCards[t].shieldTurns - 1 };
                }
            });
        }

        // 8. Apply card-specific before-question effects that were used
        if (usedCard === 'asteroid' && hexOwner && hexOwner !== teamName) {
            // Aszteroida: enemy shield -2
            const newShield = Math.max((newScores[hexId] || 0) - 2, 0);
            newScores[hexId] = newShield;
            if (newShield === 0 && newOwners[hexId] && newOwners[hexId] !== teamName) {
                delete newOwners[hexId]; // Destroyed — becomes neutral
                delete newScores[hexId];
            }
            console.log(`[Cards] Aszteroida Bombázás on ${hexId}: shield now ${newShield}`);
        }

        if (usedCard === 'force_field' && teamName && hexId) {
            // Force field: own hex shield +3
            console.log(`[Cards] Force Field used by ${teamName} on ${hexId}. Owner: ${newOwners[hexId]}. Current Score: ${newScores[hexId]}`);
            if (newOwners[hexId] === teamName) {
                newScores[hexId] = Math.min((newScores[hexId] || 0) + 3, 5);
                console.log(`[Cards] Erőtér Generátor on ${hexId}: shield now ${newScores[hexId]}`);
            } else {
                console.warn(`[Cards] Force Field failed: Owner mismatch. Hex Owner: ${newOwners[hexId]}, Team: ${teamName}`);
            }
        }

        if (usedCard === 'galactic_shield' && teamName) {
            myCards.shieldTurns = teamKeys.length * 2; // 2 rounds
            console.log(`[Cards] Galaktikus Pajzs active for ${myCards.shieldTurns} turns`);
        }

        teamCards[teamName!] = myCards;

        // 9. Rotate Team
        const currentTeamIdx = teamKeys.indexOf(currentActiveTeam);
        const nextTeam = teamKeys[(currentTeamIdx + 1) % teamKeys.length];

        // RELAY STATION PASSIVE EFFECT
        const nextTeamRelays = Object.keys(newOwners).filter(id =>
            newOwners[id] === nextTeam && finalGameData.tileTypes?.[id] === 'relay' // tileTypes?.[id] handled safely
        );

        nextTeamRelays.forEach(relayId => {
            // Find neighbors
            const [q, r, s] = relayId.split(',').map(Number);
            const directions = [
                { q: 1, r: 0, s: -1 }, { q: 1, r: -1, s: 0 }, { q: 0, r: -1, s: 1 },
                { q: -1, r: 0, s: 1 }, { q: -1, r: 1, s: 0 }, { q: 0, r: 1, s: -1 }
            ];

            directions.forEach(dir => {
                const neighborId = `${q + dir.q},${r + dir.r},${s + dir.s}`;
                // If neighbor is owned by same team, boost shield
                if (newOwners[neighborId] === nextTeam) {
                    newScores[neighborId] = Math.min((newScores[neighborId] || 0) + 1, 5);
                }
            });
        });

        // Broadcast here?? No, return the new state, let host broadcast.
        // Wait, the hook prop onGameStateUpdate can be used.

        const newState = {
            ...finalGameData,
            owners: newOwners,
            scores: newScores,
            activeTeam: nextTeam,
            teamCards,
        };

        if (onGameStateUpdate) {
            onGameStateUpdate(newState);
        }

        return newState;
    };

    return {
        initializeTerritoryGame,
        processTerritoryAction
    };
};
