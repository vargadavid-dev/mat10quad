// Hexagon grid math using Cube coordinates (q, r, s)
// Constraint: q + r + s = 0

export interface HexCoord {
    q: number;
    r: number;
    s: number;
}

export interface Point {
    x: number;
    y: number;
}

export const HEX_SIZE = 40; // Pixel radius of a hex

// Directions for neighbors (q, r, s changes)
const HEX_DIRECTIONS: HexCoord[] = [
    { q: 1, r: 0, s: -1 }, { q: 1, r: -1, s: 0 }, { q: 0, r: -1, s: 1 },
    { q: -1, r: 0, s: 1 }, { q: -1, r: 1, s: 0 }, { q: 0, r: 1, s: -1 }
];

export const hexAdd = (a: HexCoord, b: HexCoord): HexCoord => {
    return { q: a.q + b.q, r: a.r + b.r, s: a.s + b.s };
};

export const hexScale = (a: HexCoord, k: number): HexCoord => {
    return { q: a.q * k, r: a.r * k, s: a.s * k };
};

export const hexNeighbor = (hex: HexCoord, direction: number): HexCoord => {
    return hexAdd(hex, HEX_DIRECTIONS[direction]);
};

export const getNeighbors = (hex: HexCoord): HexCoord[] => {
    return HEX_DIRECTIONS.map(dir => hexAdd(hex, dir));
};

// Distance between two hexes
export const hexDistance = (a: HexCoord, b: HexCoord): number => {
    return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(a.s - b.s)) / 2;
};

// Convert Cube coordinate to Pixel coordinate (Flat-topped hex)
export const hexToPixel = (hex: HexCoord, size: number = HEX_SIZE): Point => {
    const x = size * (3 / 2 * hex.q);
    const y = size * (Math.sqrt(3) / 2 * hex.q + Math.sqrt(3) * hex.r);
    return { x, y };
};

// Generate a map of hexes in a spiral shape (radius N)
export const generateHexGrid = (radius: number): HexCoord[] => {
    const hexes: HexCoord[] = [];
    for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius);
        const r2 = Math.min(radius, -q + radius);
        for (let r = r1; r <= r2; r++) {
            hexes.push({ q, r, s: -q - r });
        }
    }
    return hexes;
};

// Create a unique ID for a hex
export const getHexId = (hex: HexCoord): string => `${hex.q},${hex.r},${hex.s}`;

// Parse ID back to HexCoord
export const parseHexId = (id: string): HexCoord => {
    const [q, r, s] = id.split(',').map(Number);
    return { q, r, s };
};
