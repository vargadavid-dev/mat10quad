// Galactic Card System for Territory Mode

export type CardId =
    | 'nav_probe'      // 🔭 Navigációs Szonda — hint: eliminate 1 wrong answer
    | 'hyperspace'     // 🔄 Hipertér Ugrás — swap question
    | 'time_dilation'  // ⏳ Idődilatáció — double time
    | 'asteroid'       // ☄️ Aszteroida Bombázás — enemy shield -2
    | 'wormhole'       // 🌀 Féregjárat — attack any hex (no adjacency)
    | 'supernova'      // 💫 Szupernóva — wrong answer still captures
    | 'force_field'    // 🛡️ Erőtér Generátor — own hex shield +3
    | 'galactic_shield'; // 🌐 Galaktikus Pajzs — 2 turn immunity

export type CardCategory = 'tactical' | 'offensive' | 'defensive';

export interface GalacticCard {
    id: CardId;
    name: string;
    icon: string;
    description: string;
    category: CardCategory;
    timing: 'before_question' | 'during_question' | 'passive';
}

export const CARD_DEFINITIONS: Record<CardId, GalacticCard> = {
    nav_probe: {
        id: 'nav_probe',
        name: 'Navigációs Szonda',
        icon: '🔭',
        description: 'Kizár 1 rossz válaszlehetőséget',
        category: 'tactical',
        timing: 'during_question',
    },
    hyperspace: {
        id: 'hyperspace',
        name: 'Hipertér Ugrás',
        icon: '🔄',
        description: 'Új feladatot kap a játékos',
        category: 'tactical',
        timing: 'during_question',
    },
    time_dilation: {
        id: 'time_dilation',
        name: 'Idődilatáció',
        icon: '⏳',
        description: 'Kétszer annyi idő a válaszadásra',
        category: 'tactical',
        timing: 'during_question',
    },
    asteroid: {
        id: 'asteroid',
        name: 'Aszteroida Bombázás',
        icon: '☄️',
        description: 'Ellenséges szektor pajzsa −2',
        category: 'offensive',
        timing: 'before_question',
    },
    wormhole: {
        id: 'wormhole',
        name: 'Féregjárat',
        icon: '🌀',
        description: 'Bármelyik szektort támadhatod',
        category: 'offensive',
        timing: 'before_question',
    },
    supernova: {
        id: 'supernova',
        name: 'Szupernóva',
        icon: '💫',
        description: 'Hibás válasszal is elfoglalod a mezőt',
        category: 'offensive',
        timing: 'passive',
    },
    force_field: {
        id: 'force_field',
        name: 'Erőtér Generátor',
        icon: '🛡️',
        description: 'Saját szektor pajzsa +3 (max 5)',
        category: 'defensive',
        timing: 'before_question',
    },
    galactic_shield: {
        id: 'galactic_shield',
        name: 'Galaktikus Pajzs',
        icon: '🌐',
        description: '2 körön át minden szektorod immunis',
        category: 'defensive',
        timing: 'before_question',
    },
};

export const ALL_CARD_IDS: CardId[] = Object.keys(CARD_DEFINITIONS) as CardId[];

// Card weights for drawing (some cards are rarer)
const CARD_WEIGHTS: Record<CardId, number> = {
    nav_probe: 4,        // Common
    hyperspace: 3,       // Common
    time_dilation: 3,    // Common
    asteroid: 2,         // Uncommon
    wormhole: 2,         // Uncommon
    supernova: 1,        // Rare
    force_field: 2,      // Uncommon
    galactic_shield: 1,  // Rare
};

// Draw a random card using weighted probabilities
export function drawRandomCard(): CardId {
    const entries = Object.entries(CARD_WEIGHTS) as [CardId, number][];
    const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
    let roll = Math.random() * totalWeight;

    for (const [cardId, weight] of entries) {
        roll -= weight;
        if (roll <= 0) return cardId;
    }

    return entries[0][0]; // fallback
}

// Draw N random cards
export function drawCards(count: number): CardId[] {
    return Array.from({ length: count }, () => drawRandomCard());
}

// Max cards a team can hold
export const MAX_HAND_SIZE = 5;

// Streak needed for bonus card
export const STREAK_FOR_CARD = 3;

// Team card state
export interface TeamCardState {
    hand: CardId[];
    streak: number; // consecutive correct answers
    shieldTurns: number; // remaining turns of Galactic Shield (0 = inactive)
}

// Initialize cards for all teams
export function initializeTeamCards(teamNames: string[]): Record<string, TeamCardState> {
    const result: Record<string, TeamCardState> = {};
    teamNames.forEach(team => {
        result[team] = {
            hand: drawCards(2), // Start with 2 random cards
            streak: 0,
            shieldTurns: 0,
        };
    });
    return result;
}

// Add a card to a team's hand (respects max size)
export function addCardToTeam(state: TeamCardState, cardId?: CardId): TeamCardState {
    if (state.hand.length >= MAX_HAND_SIZE) return state; // Hand is full
    const card = cardId || drawRandomCard();
    return { ...state, hand: [...state.hand, card] };
}

// Remove a card from a team's hand by index
export function removeCardFromTeam(state: TeamCardState, cardIndex: number): TeamCardState {
    const newHand = [...state.hand];
    newHand.splice(cardIndex, 1);
    return { ...state, hand: newHand };
}

// Check if a hex is adjacent to any of a team's hexes
export function isAdjacentToTeamHQ(
    hexId: string,
    owners: Record<string, string>,
    scores: Record<string, number>,
    targetTeam: string
): boolean {
    const [q, r, s] = hexId.split(',').map(Number);
    const neighbors = [
        [q + 1, r, s - 1], [q - 1, r, s + 1],
        [q, r + 1, s - 1], [q, r - 1, s + 1],
        [q + 1, r - 1, s], [q - 1, r + 1, s],
    ];

    return neighbors.some(([nq, nr, ns]) => {
        const nId = `${nq},${nr},${ns}`;
        return owners[nId] === targetTeam && scores[nId] === 5; // HQ has shield 5
    });
}
