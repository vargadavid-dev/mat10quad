import { CurriculumItem } from '../../../types';

export const coordinateSystemCurriculum: CurriculumItem[] = [
    // --- 1. KOORDINÁTARENDSZER ALAPOK ---
    {
        id: 'coord-intro',
        type: 'theory',
        title: '1. A derékszögű koordinátarendszer',
        content: `A sík pontjait két szám segítségével határozhatjuk meg egy **derékszögű koordinátarendszerben**.
        
        Ez két, egymásra merőleges számegyenesből áll:
        - **x-tengely** (abszcissza): Vízszintes tengely, jobbra mutat a pozitív irány.
        - **y-tengely** (ordináta): Függőleges tengely, felfelé mutat a pozitív irány.
        
        A két tengely metszéspontja az **origó** (O), melynek koordinátái: $(0; 0)$.
        Minden pontot egy rendezett számpárral adunk meg: $P(x; y)$.
        Például $P(2; 3)$ azt jelenti, hogy az origótól 2 egységet lépünk jobbra, majd 3-at fel.`,
        diagramConfig: {
            type: 'coordinate-system',
            points: [{ x: 2, y: 3, label: 'P(2; 3)', color: '#ef4444', showGuides: true }]
        }
    },
    {
        id: 'coord-read-step1',
        type: 'question',
        inputType: 'key-value',
        question: `**Gyakorlás: Koordináták leolvasása**
        
        Nézd meg a grafikonon bejelölt **A** pontot!
        Olvasd le a koordinátáit!`,
        illustration: `<svg viewBox="0 0 350 350" class="w-full h-auto bg-white rounded-lg border border-slate-200">
             <!-- Grid Definition -->
            <defs>
                <pattern id="grid-qs" width="30" height="30" patternUnits="userSpaceOnUse" x="25" y="25">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e0e7ff" stroke-width="1.5"/>
                </pattern>
                <marker id="arrow-qs" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                     <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
                </marker>
            </defs>
            
            <rect x="25" y="25" width="300" height="300" fill="url(#grid-qs)" />
            
            <!-- Axes -->
            <line x1="25" y1="175" x2="335" y2="175" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#arrow-qs)" />
            <line x1="175" y1="325" x2="175" y2="15" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#arrow-qs)" />
            
            <!-- Numbers -->
           <!-- X Axis -->
            <text x="205" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">1</text>
            <text x="235" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">2</text>
            <text x="265" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">3</text>
            <text x="295" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">4</text>
            <text x="325" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">5</text>
            
            <text x="145" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">-1</text>
            <text x="115" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">-2</text>
            <text x="85" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">-3</text>
            <text x="55" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">-4</text>
            <text x="25" y="195" font-size="12" fill="#94a3b8" text-anchor="middle">-5</text>
            
            <!-- Y Axis -->
            <text x="160" y="145" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">1</text>
            <text x="160" y="115" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">2</text>
            <text x="160" y="85" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">3</text>
            <text x="160" y="55" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">4</text>
            <text x="160" y="25" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">5</text>
            
            <text x="160" y="205" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">-1</text>
            <text x="160" y="235" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">-2</text>
            <text x="160" y="265" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">-3</text>
            <text x="160" y="295" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">-4</text>
            <text x="160" y="325" font-size="12" fill="#94a3b8" text-anchor="end" alignment-baseline="middle">-5</text>

            <!-- Point A(3, 2). center 175, 175.
                 x: 175 + 3*30 = 265
                 y: 175 - 2*30 = 115 -->
            <line x1="265" y1="175" x2="265" y2="118" stroke="#ef4444" stroke-width="1" stroke-dasharray="4" />
            <line x1="175" y1="115" x2="262" y2="115" stroke="#ef4444" stroke-width="1" stroke-dasharray="4" />
            
            <circle cx="265" cy="115" r="7" fill="#ef4444" stroke="white" stroke-width="2"/>
            <text x="272" y="110" font-family="sans-serif" font-weight="bold" fill="#ef4444" font-size="16">A</text>
            
            <text x="340" y="195" font-size="14" font-weight="bold" fill="#64748b">x</text>
            <text x="160" y="15" font-size="14" font-weight="bold" fill="#64748b">y</text>
        </svg>`,
        inputLabels: ['$x =$', '$y =$'], // kept for backward compat / validation
        layout: 'coordinate',
        inputPrefix: 'A',
        correctAnswer: ['3', '2'],
        hint: 'Először az x-tengelyen (vízszintes) nézd meg az értéket, utána az y-tengelyen (függőleges). Jobbra 3, fel 2.',
        successMessage: 'Helyes! P(3; 2).',
        onRegenerate: true
    },
    {
        id: 'coord-quadrants-theory',
        type: 'theory',
        title: 'Síknegyedek',
        content: `A koordinátatengelyek négy tartományra (síknegyedre) osztják a síkot.
        
        A számozás az óramutató járásával ellentétes irányban történik, a jobb felső sarokból indulva:
        - **I. síknegyed**: Jobb felső (+, +) -> mindkét koordináta pozitív.
        - **II. síknegyed**: Bal felső (-, +) -> x negatív, y pozitív.
        - **III. síknegyed**: Bal alsó (-, -) -> mindkét koordináta negatív.
        - **IV. síknegyed**: Jobb alsó (+, -) -> x pozitív, y negatív.`,
        layout: 'side-by-side',
        illustration: `<svg viewBox="0 0 300 300" class="w-full h-auto bg-white rounded-lg shadow-sm border border-slate-200">
            <!-- Backgrounds for Quadrants -->
            <rect x="150" y="0" width="150" height="150" fill="#ecfeff" />   <!-- I - Cyan-50 -->
            <rect x="0" y="0" width="150" height="150" fill="#fff1f2" />     <!-- II - Rose-50 -->
            <rect x="0" y="150" width="150" height="150" fill="#f0fff4" />   <!-- III - Green-50 -->
            <rect x="150" y="150" width="150" height="150" fill="#fffbeb" /> <!-- IV - Amber-50 -->

            <!-- Grid Lines (Subtle) -->
            <defs>
                <pattern id="grid-q-compact" width="37.5" height="37.5" patternUnits="userSpaceOnUse">
                    <path d="M 37.5 0 L 0 0 0 37.5" fill="none" stroke="#64748b" stroke-width="0.5" opacity="0.2"/>
                </pattern>
                <marker id="arrow-strong" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                     <path d="M0,0 L0,6 L6,3 z" fill="#334155" />
                </marker>
            </defs>
            <rect width="300" height="300" fill="url(#grid-q-compact)" />

            <!-- Main Axes (Bold) -->
            <line x1="10" y1="150" x2="290" y2="150" stroke="#334155" stroke-width="3" marker-end="url(#arrow-strong)" stroke-linecap="round" />
            <line x1="150" y1="290" x2="150" y2="10" stroke="#334155" stroke-width="3" marker-end="url(#arrow-strong)" stroke-linecap="round" />

            <!-- Quadrant Labels -->
            <!-- I. Quarter -->
            <text x="225" y="75" font-family="sans-serif" font-weight="800" fill="#0e7490" font-size="32" text-anchor="middle" letter-spacing="-1px">I.</text>
            <text x="225" y="105" font-family="monospace" font-weight="bold" fill="#0e7490" font-size="18" text-anchor="middle">(+; +)</text>

            <!-- II. Quarter -->
            <text x="75" y="75" font-family="sans-serif" font-weight="800" fill="#be123c" font-size="32" text-anchor="middle" letter-spacing="-1px">II.</text>
            <text x="75" y="105" font-family="monospace" font-weight="bold" fill="#be123c" font-size="18" text-anchor="middle">(-; +)</text>

            <!-- III. Quarter -->
            <text x="75" y="225" font-family="sans-serif" font-weight="800" fill="#15803d" font-size="32" text-anchor="middle" letter-spacing="-1px">III.</text>
            <text x="75" y="255" font-family="monospace" font-weight="bold" fill="#15803d" font-size="18" text-anchor="middle">(-; -)</text>

            <!-- IV. Quarter -->
            <text x="225" y="225" font-family="sans-serif" font-weight="800" fill="#b45309" font-size="32" text-anchor="middle" letter-spacing="-1px">IV.</text>
            <text x="225" y="255" font-family="monospace" font-weight="bold" fill="#b45309" font-size="18" text-anchor="middle">(+; -)</text>
            
            <!-- Axis Names -->
            <text x="285" y="175" font-size="16" font-weight="900" fill="#334155" font-family="sans-serif">x</text>
            <text x="165" y="25" font-size="16" font-weight="900" fill="#334155" font-family="sans-serif">y</text>
        </svg>`
    },
    {
        id: 'coord-quadrant-q1',
        type: 'question',
        inputType: 'matching',
        question: `**Melyik síknegyedbe esnek a pontok?**
        
        Párosítsd a pontok koordinátáit a megfelelő síknegyeddel!
        Figyeld az előjeleket!`,
        matchPairs: [
            { left: '$P(4; 5)$ (+; +)', right: 'I. negyed' },
            { left: '$Q(-2; 3)$ (-; +)', right: 'II. negyed' },
            { left: '$R(-5; -1)$ (-; -)', right: 'III. negyed' },
            { left: '$S(2; -4)$ (+; -)', right: 'IV. negyed' }
        ],
        correctAnswer: 'implied',
        hint: 'Képzeld el a pont elhelyezkedését! Jobbra/Balra, Fent/Lent?',
        successMessage: 'Ügyes vagy! Az előjelek egyértelműen meghatározzák a síknegyedet.'
    },
    {
        id: 'coord-plot-intro',
        type: 'theory',
        title: 'Gyakorlat: Pontok ábrázolása',
        content: `Most te következel! A következő feladatokban neked kell megkeresned a pontok helyét a koordinátarendszerben.
        
        Kattints a rácspontokra a koordináták megadásához.`
    },
    {
        id: 'coord-plot-p1',
        type: 'question',
        inputType: 'coordinate-plot',
        question: `**Ábrázold a P(2; 3) pontot!**
        
        Kattints a megfelelő helyre a koordinátarendszerben!`,
        targetCoordinate: { x: 2, y: 3 },
        correctAnswer: '2,3', // Used for simple validation check if needed, but component handles it via targetCoordinate logic usually
        hint: 'Indulj az origóból (0;0). Lépj 2-t jobbra, majd 3-at felfelé.',
        successMessage: 'Pontos találat! Ez a (2; 3) pont.'
    },
    {
        id: 'coord-plot-p2',
        type: 'question',
        inputType: 'coordinate-plot',
        question: `**Ábrázold a Q(-3; -2) pontot!**
        
        Figyelj a negatív előjelekre!`,
        targetCoordinate: { x: -3, y: -2 },
        correctAnswer: '-3,-2',
        hint: 'A negatív x balra, a negatív y lefelé jelent lépést. Tehát: 3 balra, 2 le.',
        successMessage: 'Szuper! Megtaláltad a III. síknegyedben lévő pontot.'
    },
    {
        id: 'coord-plot-p3',
        type: 'question',
        inputType: 'coordinate-plot',
        question: `**Ábrázold az R(0; 4) pontot!**
        
        Ez egy speciális pont.`,
        targetCoordinate: { x: 0, y: 4 },
        correctAnswer: '0,4',
        hint: 'Az x koordináta 0, tehát nem lépünk sem jobbra, sem balra. Csak felfelé 4-et.',
        successMessage: 'Helyes! Ez a pont az y-tengelyre esik.'
    }
];
