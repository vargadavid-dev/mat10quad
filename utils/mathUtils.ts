
export const parseNumber = (input: string): number => {
    if (!input) return NaN;
    // Normalize decimal separator
    let clean = input.trim().replace(',', '.');

    // Check for fraction
    if (clean.includes('/')) {
        const parts = clean.split('/');
        if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const den = parseFloat(parts[1]);
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
                return num / den;
            }
        }
    }

    return parseFloat(clean);
};

export const areValuesEqual = (userInput: string, correctInput: string, epsilon = 0.0001): boolean => {
    // Try parsing both as numbers
    const userNum = parseNumber(userInput);
    const correctNum = parseNumber(correctInput);

    if (!isNaN(userNum) && !isNaN(correctNum)) {
        return Math.abs(userNum - correctNum) < epsilon;
    }

    // Fallback to normalized string comparison
    return userInput.trim().replace(',', '.').toLowerCase() ===
        correctInput.trim().replace(',', '.').toLowerCase();
};
