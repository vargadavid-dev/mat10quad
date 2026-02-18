import { CurriculumItem } from '../../../types';

export const centralAnglesCurriculum: CurriculumItem[] = [
    {
        id: 'central-angles-definitions',
        type: 'theory',
        title: '1. Alapfogalmak',
        content: `

A tétel megértéséhez tisztázzuk a legfontosabb fogalmakat.

### A Kör
Azon pontok összessége a síkon, amelyek egy adott ponttól (**középpont**) egyenlő távolságra vannak.

### Távolságok és Szakaszok
- **Sugár (r)**: A középpontot és a körvonal bármely pontját összekötő szakasz.
- **Átmérő (d)**: A középponton áthaladó húr. Hossza $d = 2r$.
- **Húr**: A körvonal két pontját összekötő szakasz.
- **Körív**: A körvonal két pontja közötti rész.

### Egyenesek
- **Szelő**: Két pontban metszi a kört.
- **Érintő**: Egy pontban érinti a kört. *Merőleges az érintési pontba húzott sugárra.*

### Szögek a Körben
- **Középponti Szög**: Csúcsa a kör középpontja, szárai sugarak.
- **Kerületi Szög**: Csúcsa a köríven van, szárai húrok.
        `,
        illustration: `
        <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                </marker>
            </defs>
            
            <!-- BACKGROUNDS -->
            <rect x="10" y="10" width="280" height="260" rx="15" fill="#f8fafc" stroke="#e2e8f0" />
            <rect x="310" y="10" width="280" height="260" rx="15" fill="#f8fafc" stroke="#e2e8f0" />

            <!-- LEFT PANEL: BASIC ELEMENTS -->
            <g transform="translate(150, 150)">
                <text x="-130" y="-120" font-size="16" font-weight="bold" fill="#334155">1. Alapfogalmak</text>
                
                <!-- Main Circle -->
                <circle cx="0" cy="0" r="80" fill="white" stroke="#94a3b8" stroke-width="2" />
                <circle cx="0" cy="0" r="3" fill="#334155" />
                <text x="-10" y="20" font-size="12" font-weight="bold" fill="#334155">O</text>

                <!-- Diameter (Orange) - Diagonal to avoid crowding -->
                <line x1="-75" y1="-27" x2="75" y2="27" stroke="#f97316" stroke-width="2" />
                <text x="-50" y="-35" font-size="11" fill="#f97316" font-weight="bold">d (átmérő)</text>

                <!-- Radius (Blue) - Horizontal Right -->
                <line x1="0" y1="0" x2="80" y2="0" stroke="#3b82f6" stroke-width="2" />
                <text x="35" y="-5" font-size="11" fill="#3b82f6" font-weight="bold">r</text>

                <!-- Chord (Green) - Bottom -->
                <line x1="-50" y1="62" x2="50" y2="62" stroke="#10b981" stroke-width="2" />
                <text x="0" y="75" font-size="11" fill="#10b981" font-weight="bold" text-anchor="middle">húr</text>

                <!-- Tangent (Purple) - Top -->
                <line x1="-70" y1="-80" x2="70" y2="-80" stroke="#8b5cf6" stroke-width="2" />
                <circle cx="0" cy="-80" r="3" fill="#8b5cf6" />
                <text x="0" y="-90" font-size="11" fill="#8b5cf6" font-weight="bold" text-anchor="middle">érintő</text>
                
                <!-- Secant (Gray Dashed) - Left Side -->
                <line x1="-90" y1="30" x2="-40" y2="-100" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4" />
                <text x="-95" y="-80" font-size="11" fill="#64748b" font-style="italic">szelő</text>
            </g>

            <!-- RIGHT PANEL: ANGLES -->
            <g transform="translate(450, 150)">
                <text x="-130" y="-120" font-size="16" font-weight="bold" fill="#334155">2. Szögek</text>

                <!-- Main Circle -->
                <circle cx="0" cy="0" r="80" fill="white" stroke="#94a3b8" stroke-width="2" />
                <circle cx="0" cy="0" r="3" fill="#334155" />
                <text x="0" y="20" font-size="12" font-weight="bold" fill="#334155">O</text>

                <!-- Points on Circle - Positions adjusted for better angle visualization -->
                <!-- A and B at bottom -->
                <circle cx="-50" cy="62" r="4" fill="#334155" /> <!-- A -->
                <text x="-65" y="70" font-size="12" font-weight="bold" fill="#334155">A</text>
                
                <circle cx="50" cy="62" r="4" fill="#334155" /> <!-- B -->
                <text x="60" y="70" font-size="12" font-weight="bold" fill="#334155">B</text>

                <!-- C at top -->
                <circle cx="0" cy="-80" r="4" fill="#334155" /> <!-- C -->
                <text x="0" y="-90" font-size="12" font-weight="bold" fill="#334155">C</text>

                <!-- Central Angle (Blue) -->
                <line x1="0" y1="0" x2="-50" y2="62" stroke="#3b82f6" stroke-width="1.5" opacity="0.4" />
                <line x1="0" y1="0" x2="50" y2="62" stroke="#3b82f6" stroke-width="1.5" opacity="0.4" />
                <!-- Arc for Alpha -->
                <path d="M -10 12 A 15 15 0 0 0 10 12" fill="none" stroke="#3b82f6" stroke-width="2" />
                <text x="0" y="32" font-size="14" fill="#3b82f6" font-weight="bold" text-anchor="middle">α</text>
                <text x="0" y="45" font-size="10" fill="#3b82f6" text-anchor="middle">(középponti)</text>

                <!-- Inscribed Angle (Red) -->
                <line x1="0" y1="-80" x2="-50" y2="62" stroke="#ef4444" stroke-width="2" />
                <line x1="0" y1="-80" x2="50" y2="62" stroke="#ef4444" stroke-width="2" />
                <!-- Arc for Beta -->
                <path d="M -8 -60 Q 0 -50 8 -60" fill="none" stroke="#ef4444" stroke-width="2" />
                <text x="0" y="-40" font-size="14" fill="#ef4444" font-weight="bold" text-anchor="middle">β</text>
                <text x="0" y="-28" font-size="10" fill="#ef4444" text-anchor="middle">(kerületi)</text>

                <!-- Arc Highlighting -->
                <path d="M -50 62 A 80 80 0 0 0 50 62" fill="none" stroke="#334155" stroke-width="4" stroke-linecap="round" />
                <text x="0" y="95" font-size="11" fill="#334155" font-weight="bold" text-anchor="middle">Körív</text>
            </g>
        </svg>
        `
    },
    {
        id: 'circle-concepts-quiz',
        type: 'quiz',
        title: 'Alapfogalmak Kvíz',
        questions: [
            {
                question: "Milyen szöget zár be az érintő az érintési pontba húzott sugárral?",
                inputType: 'multiple-choice',
                options: ["0°", "45°", "90° (derékszög)", "180°"],
                correctAnswer: "90° (derékszög)",
                hint: "Ez a körérintő legfontosabb tulajdonsága.",
                successMessage: "Helyes! Az érintő mindig merőleges a sugárra."
            },
            {
                question: "Mi a kör leghosszabb húrja?",
                inputType: 'multiple-choice',
                options: ["Sugár", "Átmérő", "Kerület", "Nincs ilyen"],
                correctAnswer: "Átmérő",
                hint: "Ez a húr átmegy a középponton.",
                successMessage: "Így van! Az átmérő a leghosszabb húr."
            }
        ]
    },

    {
        id: 'central-angles-theorem',
        type: 'theory',
        title: '3. Középponti és Kerületi Szögek Tétele',
        content: `

A tétel kimondja, hogy egy adott körben, adott ívhez tartozó **középponti szög nagysága pontosan kétszerese** az ugyanahhoz az ívhez tartozó **kerületi szög nagyságának**.

$$ \\alpha_{kp} = 2 \\cdot \\alpha_{ker} $$

Másképpen fogalmazva: ugyanahhoz a körívhez tartozó összes kerületi szög egyenlő nagyságú.

### Interaktív Vizsgálat
Próbáld ki az alábbi eszközt! Mozgasd az **A**, **B** és **C** pontokat a köríven!
- Figyeld meg, hogy a **C** pont mozgatásával a kerületi szög nagysága **NEM VÁLTOZIK** (amíg ugyanazon az íven marad).
- Figyeld meg, hogy a középponti szög mindig duplája a kerületinek.

<InteractiveComponent type="CircleAngleVisualizer" />
    `
    },
    {
        id: 'central-angles-quiz-basic',
        type: 'quiz',
        title: 'Ellenőrző Kérdések',
        questions: [
            {
                question: "Mennyi a középponti szög, ha a hozzá tartozó kerületi szög 35°?",
                inputType: 'multiple-choice',
                options: ["17.5°", "35°", "70°", "140°"],
                correctAnswer: "70°",
                hint: "A középponti szög a kerületi kétszerese.",
                explanation: "A tétel szerint a középponti szög mindig pontosan a kétszerese a hozzá tartozó kerületi szögnek. Mivel a kerületi szög 35°, így a középponti: $2 \\cdot 35° = 70°$.",
                successMessage: "Pontos! A középponti szög a kerületi szög kétszerese: 2 * 35° = 70°."
            },
            {
                question: "Mennyi a kerületi szög, ha a hozzá tartozó középponti szög 110°?",
                inputType: 'multiple-choice',
                options: ["55°", "110°", "220°", "27.5°"],
                correctAnswer: "55°",
                hint: "A kerületi szög a középponti fele.",
                successMessage: "Helyes! A kerületi szög a középponti szög fele: 110° / 2 = 55°."
            },
            {
                question: "Változik-e egy ívhez tartozó kerületi szög nagysága, ha a csúcsát elmozdítjuk a köríven (a szárak által közrefogott íven kívül)?",
                inputType: 'multiple-choice',
                options: ["Igen, folyamatosan változik", "Nem, mindenhol ugyanakkora", "Csak akkor, ha átmegyünk a középponton", "Igen, a távolságtól függően"],
                correctAnswer: "Nem, mindenhol ugyanakkora",
                hint: "Próbáld ki az interaktív eszközön a C pont mozgatását!",
                successMessage: "Így van! A tétel egyik következménye, hogy ugyanahhoz az ívhez tartozó kerületi szögek mind egyenlők."
            }
        ]
    },
    {
        id: 'thales-theorem',
        type: 'theory',
        title: '4. Thalész Tétele (Speciális Eset)',
        content: `

Thalész tétele a középponti és kerületi szögek tételének egy **speciális esete**.

## Mi történik, ha a középponti szög 180°?

Ha az ív egy **félkör**, akkor a hozzá tartozó középponti szög **180°** (egyenesszög). A kerületi szög tétel szerint:

$$ \\alpha = \\frac{\\beta}{2} = \\frac{180°}{2} = 90° $$

Tehát a kerületi szög pontosan **derékszög** (90°)!

## A Tétel Kimondása

**Thalész tétele:** Ha egy kör **átmérőjének** két végpontját összekötjük a körvonal bármely más pontjával, az így kapott szög mindig **derékszög**.

> [!IMPORTANT]
> A tétel megfordítása is igaz: ha egy háromszög egyik szöge 90°, akkor az átfogó felett mint átmérő felett szerkesztett kör áthalad a derékszög csúcsán.

### Próbáld ki!
Húzd a **C** pontot a félkör mentén, és figyeld meg, hogy a szög mindig **90°** marad!

<InteractiveComponent type="ThalesVisualizer" />

### Alkalmazás
Ez a tétel nagyon hasznos **derékszögű háromszögek szerkesztésénél**: ha egy adott szakasz felett félkört rajzolunk, a félkör bármely pontjából derékszögű háromszöget kapunk.
    `
    }
];
