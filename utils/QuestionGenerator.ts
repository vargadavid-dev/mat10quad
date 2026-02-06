export interface QuadraticProblem {
    a: number;
    b: number;
    c: number;
    x1: number;
    x2: number;
    questionText: string;
}

/**
 * Generates a random integer between min and max (inclusive)
 */
const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a quadratic equation (ax^2 + bx + c = 0) with integer roots.
 * Currently keeps 'a' = 1 for simplicity (monic interpretation), but can be expanded.
 */
export const generateQuadraticEquation = (): QuadraticProblem => {
    // 1. Generate two random integer roots
    // Avoid 0 to make it non-trivial
    let x1 = randomInt(-10, 10);
    let x2 = randomInt(-10, 10);

    if (x1 === 0) x1 = 1;
    if (x2 === 0) x2 = -1;

    // 2. Calculate coefficients based on Vieta's formulas
    // (x - x1)(x - x2) = x^2 - (x1 + x2)x + (x1 * x2)
    // a = 1
    // b = -(x1 + x2)
    // c = x1 * x2

    const a = 1;
    const b = -(x1 + x2);
    const c = x1 * x2;

    // 3. Construct the question string nicely formatting signs
    // e.g., x^2 + 3x - 10 = 0 instead of x^2 + 3x + -10 = 0
    const signB = b >= 0 ? '+' : '-';
    const signC = c >= 0 ? '+' : '-';

    // Format absolute values for display, handle 1x or -1x specifically if needed
    const absB = Math.abs(b);
    const absC = Math.abs(c);

    // Handle the specific case where b is 1 or -1 to avoid "1x"
    let termB = '';
    if (absB !== 0) {
        termB = ` ${signB} ${absB === 1 ? '' : absB}x`;
    }

    const questionText = `Oldd meg az $x^2${termB} ${signC} ${absC} = 0$ egyenletet!`;

    return {
        a,
        b,
        c,
        x1,
        x2,
        questionText
    };
};

export const generateQuadraticSequence = (baseId: string): any[] => {
    const p = generateQuadraticEquation();

    // 1. Phase: Coefficients
    const step1 = {
        id: `${baseId}-coeffs`,
        type: 'question',
        inputType: 'coefficients',
        question: `**1. lépés: Együtthatók meghatározása**\n\nAdott az egyenlet:\n$$${p.questionText.replace('Oldd meg az ', '').replace(' egyenletet!', '').replace(/\$/g, '')}$$\n\nOlvasd le az együtthatókat ($a, b, c$)! Figyelj az előjelekre!`,
        correctAnswer: [p.a.toString(), p.b.toString(), p.c.toString()],
        hint: 'Az $x^2$ előtt álló szám az "a" (ha nincs ott semmi, akkor 1), az $x$ előtti a "b", az önálló szám a "c". Az előjeleket ne felejtsd el!',
        successMessage: `Szuper! Az együtthatók: a=${p.a}, b=${p.b}, c=${p.c}.`
    };

    // 2. Phase: Discriminant
    const D = (p.b * p.b) - (4 * p.a * p.c);
    const step2 = {
        id: `${baseId}-discrim`,
        type: 'question',
        inputType: 'numeric', // Simple numerical input
        question: `**2. lépés: Diszkrimináns kiszámítása**\n\nSzámítsd ki a diszkriminánst ($D$)!\n$$D = b^2 - 4ac$$\n\nAhol $a=${p.a}$, $b=${p.b}$, $c=${p.c}$.`,
        inputPrefix: '$D =$',
        correctAnswer: D.toString(),
        hint: `Helyettesíts be: $(${p.b})^2 - 4 \\cdot ${p.a} \\cdot (${p.c})$. Ügyelj a negatív számok négyzetére (mindig pozitív)!`,
        successMessage: `Helyes! $D = ${D}$. ${D > 0 ? 'Mivel pozitív, két megoldás lesz.' : (D === 0 ? 'Mivel nulla, egy megoldás lesz.' : 'Mivel negatív, nincs valós megoldás.')}`
    };

    // 3. Phase: Roots
    const step3 = {
        id: `${baseId}-roots`,
        type: 'question',
        inputType: 'roots-set',
        question: `**3. lépés: Gyökök kiszámítása**\n\nVégül határozd meg az egyenlet megoldásait a megoldóképlet segítségével!`,
        correctAnswer: [p.x1.toString(), p.x2.toString()],
        hint: `Használd a képletet: $x_{1,2} = \\frac{-${p.b} \\pm \\sqrt{${D}}}{2 \\cdot ${p.a}}$.`,
        successMessage: `Kiváló! Megkaptuk a megoldásokat: ${p.x1} és ${p.x2}.`,
        onRegenerate: true // This flag signals that "One more" should appear here
    };

    return [step1, step2, step3];
};

export const generateCoordinateReadProblem = (id: string): any => {
    const x = randomInt(-4, 4);
    const y = randomInt(-4, 4);

    return {
        id,
        type: 'question',
        inputType: 'key-value',
        question: `**Gyakorlás: Koordináták meghatározása**\n\nOlvasd le a grafikonról a **P** pont koordinátáit!`,
        diagramConfig: {
            type: 'coordinate-system',
            points: [{ x, y, label: `P`, color: '#ef4444' }]
        },
        inputLabels: ['$x =$', '$y =$'],
        layout: 'coordinate',
        inputPrefix: 'P',
        correctAnswer: [x.toString(), y.toString()],
        hint: 'Nézd meg, mennyit léptünk jobbra/balra (x) és fel/le (y) az origótól!',
        successMessage: `Tökéletes! A pont koordinátái: P(${x}; ${y}).`,
        onRegenerate: true
    };
};

export const generateCoordinatePlotProblem = (id: string): any => {
    const x = randomInt(-4, 4);
    const y = randomInt(-4, 4);

    return {
        id,
        type: 'question',
        inputType: 'coordinate-plot',
        question: `**Ábrázold a P(${x}; ${y}) pontot!**\n\nKattints a megfelelő rácspontra!`,
        targetCoordinate: { x, y },
        correctAnswer: `${x},${y}`,
        hint: `Az első szám (${x}) az x-tengelyen (vízszintes), a második (${y}) az y-tengelyen (függőleges) jelöli az elmozdulást.`,
        successMessage: `Szép munka! Megtaláltad a P(${x}; ${y}) pontot.`,
        onRegenerate: true
    };
};

export const generateLinearPlotProblem = (id: string): any => {
    // Generate valid m and b that fit on the grid (+/- 5)
    // b in [-4, 4]
    const b = randomInt(-3, 3);

    // Choose m such that at least one other point is in range [-5, 5]
    // possible slopes: -3, -2, -1, 1, 2, 3, 0.5, -0.5
    // let's simplify to integers for this generator, or simple fractions.

    const types = ['int', 'frac'];
    const type = Math.random() > 0.3 ? 'int' : 'frac';

    let m = 1;
    let mStr = 'x';

    if (type === 'int') {
        const slopes = [-3, -2, -1, 1, 2, 3];
        m = slopes[randomInt(0, slopes.length - 1)];
        mStr = (m === 1 ? '' : (m === -1 ? '-' : m)) + 'x';
    } else {
        // Simple fractions: 1/2, -1/2, 1/3, -1/3
        const num = Math.random() > 0.5 ? 1 : -1;
        const den = randomInt(2, 3);
        m = num / den;
        mStr = `\\frac{${num}}{${den}}x`;
    }

    // Construct equation string
    let eq = `y = ${mStr}`;
    if (b > 0) eq += ` + ${b}`;
    else if (b < 0) eq += ` - ${Math.abs(b)}`;

    return {
        id,
        type: 'question',
        inputType: 'coordinate-plot',
        question: `**Ábrázold a függvényt!**\n\n$$${eq}$$\n\nRajzold be a tengelymetszetet, majd lépj a meredekség szerint!`,
        targetLine: { m, b },
        correctAnswer: eq, // Valid string for interface
        maxPoints: 2,
        drawMode: 'line',
        hint: `Tengelymetszet (y-tengelyen): ${b}. Meredekség: ${m} (ha tört, akkor lépcsőzz: nevező jobbra, számláló fel/le).`,
        successMessage: 'Kiváló! Az egyenes pontos.',
        onRegenerate: true
    };
};

export const generateMappingProblem = (id: string): any => { // Changed QuestionBlockData to any for consistency
    // 1. Decide logic: 0 = Not Function, 1 = Function (General), 2 = Bijective
    const type = Math.floor(Math.random() * 3);

    // Set sizes (3 or 4 dots)
    const countA = 4;
    const countB = 4;

    // Generate connections
    const connections: { from: number, to: number }[] = [];

    if (type === 0) {
        // NOT A FUNCTION: One element in A has 2 arrows
        // Everyone gets 1 arrow first (or maybe skip one to be messy, but definitions say 'every element assigned'? No, definitions usually strictly require single assignment. 
        // Actually definition of function: Every element of A maps to EXACTLY ONE element of B.
        // Violation 1: Element maps to 2.
        // Violation 2: Element maps to 0 (Partial function). In HS math, usually "Not a function" refers to ambiguous mapping.

        // Let's implement ambiguous mapping (Fork).
        for (let i = 0; i < countA; i++) {
            connections.push({ from: i, to: Math.floor(Math.random() * countB) });
        }
        // Force a double mapping for index 0
        connections.push({ from: 0, to: (connections[0].to + 1) % countB });

    } else if (type === 1) {
        // GENERAL FUNCTION (Not necessarily bijective)
        // Ensure NOT bijective logic (either surfactant or injective missing, or just random non-bijective)
        // Easiest: Map two elements to same B (Not Injective)
        const target = Math.floor(Math.random() * countB);
        connections.push({ from: 0, to: target });
        connections.push({ from: 1, to: target });
        // Fill rest
        for (let i = 2; i < countA; i++) {
            connections.push({ from: i, to: Math.floor(Math.random() * countB) });
        }

    } else {
        // BIJECTIVE (One-to-one)
        // Permutation of 0..3
        const pool = Array.from({ length: countB }, (_, i) => i);
        // Shuffle
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        for (let i = 0; i < countA; i++) {
            connections.push({ from: i, to: pool[i] });
        }
    }

    // Generate SVG
    const width = 300;
    const height = 200;
    const elHeight = 30; // Spacing
    const startY = (height - (countA * elHeight)) / 2 + 10;

    let svgContent = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto bg-white rounded-lg border border-slate-200 mx-auto max-w-sm">
        <defs>
             <marker id="arrow-map" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
            </marker>
        </defs>
        
        <!-- Sets -->
        <ellipse cx="60" cy="${height / 2}" rx="40" ry="80" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
        <text x="60" y="${height / 2 + 95}" text-anchor="middle" font-weight="bold" fill="#3b82f6">A</text>
        
        <ellipse cx="240" cy="${height / 2}" rx="40" ry="80" fill="#f0fdf4" stroke="#22c55e" stroke-width="2"/>
        <text x="240" y="${height / 2 + 95}" text-anchor="middle" font-weight="bold" fill="#22c55e">B</text>
        
        <!-- Points -->
        ${Array.from({ length: countA }).map((_, i) => {
        const y = startY + i * elHeight;
        return `<circle cx="60" cy="${y}" r="4" fill="#3b82f6"/>`;
    }).join('')}
        
        ${Array.from({ length: countB }).map((_, i) => {
        const y = startY + i * elHeight;
        return `<circle cx="240" cy="${y}" r="4" fill="#22c55e"/>`;
    }).join('')}
        
        <!-- Arrows -->
        ${connections.map(c => {
        const y1 = startY + c.from * elHeight;
        const y2 = startY + c.to * elHeight;
        return `<path d="M 64 ${y1} L 236 ${y2}" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow-map)"/>`;
    }).join('')}
    </svg>`;

    return {
        id,
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Elemezd a hozzárendelést!**\n\nMilyen típusú kapcsolatot látsz az ábrán?`,
        illustration: svgContent, // Moved here
        options: [
            'Nem egyértelmű (Nem függvény)',
            'Egyértelmű (Függvény)',
            'Kölcsönösen egyértelmű függvény'
        ].sort(() => Math.random() - 0.5),
        correctAnswer: type === 0 ? 'Nem egyértelmű (Nem függvény)' : (type === 2 ? 'Kölcsönösen egyértelmű függvény' : 'Egyértelmű (Függvény)'),
        successMessage: type === 0
            ? 'Helyes! Mivel az "A" halmaz egyik eleméből több nyíl is indul, ez nem lehet függvény.'
            : (type === 2
                ? 'Helyes! Minden elemhez pontosan egy pár tartozik, és visszafelé is egyértelmű.'
                : 'Helyes! Ez egy függvény, mert minden elemhez pontosan egy nyíl tartozik (de nem kölcsönösen egyértelmű).')
    };
};
