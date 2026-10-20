import { CurriculumItem } from '../../../types';

export const pythagorasCurriculum: CurriculumItem[] = [
    // ═══════════════════════════════════════════════
    // 1. ELMÉLET: Pitagorasz-tétel és geometriai jelentése
    // ═══════════════════════════════════════════════
    {
        id: 'pythagoras-theory',
        type: 'theory',
        chapter: 'Pitagorasz-tétel',
        title: 'A Pitagorasz-tétel – A derékszögű háromszögek titka',
        content: `
A **Pitagorasz-tétel** az egyik legfontosabb geometriai összefüggés, amellyel egy derékszögű háromszög bármely ismeretlen oldalát ki tudjuk számítani a másik két oldal ismeretében.

### 📐 Alapfogalmak
- **Befogók ($a$ és $b$):** A $90^\\circ$-os derékszöget közrefogó két oldal.
- **Átfogó ($c$):** A derékszöggel szemközti oldal. **Mindig az átfogó a háromszög leghosszabb oldala!**

### 📜 A tétel kimondása
> Bármely derékszögű háromszögben a két befogó négyzetének összege egyenlő az átfogó négyzetével:
> $$a^2 + b^2 = c^2$$

### 🎨 Geometriai jelentése (lásd az alábbi ábrát)
Ha a derékszögű háromszög mindhárom oldalára négyzetet rajzolunk:
- A befogókra emelt négyzetek területei: $a^2$ és $b^2$.
- Az átfogóra emelt négyzet területe: $c^2$.
- A két befogóra emelt négyzet területe együttesen pontosan megegyezik az átfogóra emelt négyzet területével!

Példa a legismertebb $3 - 4 - 5$ oldalú háromszögre:
$$a = 3, \\quad b = 4, \\quad c = 5$$
$$a^2 + b^2 = 3^2 + 4^2 = 9 + 16 = 25 = 5^2 = c^2$$
        `,
        illustration: `
<svg viewBox="0 0 460 380" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background: transparent;">
  <!-- Top formula banner with explicit high contrast styling -->
  <rect x="30" y="10" width="400" height="38" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="230" y="34" text-anchor="middle" font-size="16" font-weight="bold" style="fill: #0f172a !important; font-family: ui-sans-serif, system-ui, sans-serif;">a² + b² = c²  ➔  9 + 16 = 25</text>

  <!-- Square on leg b (left, 120x120) -->
  <polygon points="180,140 180,260 60,260 60,140" fill="#10b981" fill-opacity="0.22" stroke="#059669" stroke-width="2.5" stroke-dasharray="5 3"/>
  <!-- Area text inside green square -->
  <text x="120" y="195" text-anchor="middle" font-size="18" font-weight="bold" style="fill: #047857 !important; font-family: ui-sans-serif, system-ui, sans-serif;">b² = 16</text>
  <text x="120" y="218" text-anchor="middle" font-size="13" font-weight="600" style="fill: #059669 !important; font-family: ui-sans-serif, system-ui, sans-serif;">(terület: 4²)</text>

  <!-- Square on leg a (bottom, 90x90) -->
  <polygon points="180,260 270,260 270,350 180,350" fill="#6366f1" fill-opacity="0.22" stroke="#4f46e5" stroke-width="2.5" stroke-dasharray="5 3"/>
  <!-- Area text inside blue/purple square -->
  <text x="225" y="300" text-anchor="middle" font-size="18" font-weight="bold" style="fill: #4338ca !important; font-family: ui-sans-serif, system-ui, sans-serif;">a² = 9</text>
  <text x="225" y="323" text-anchor="middle" font-size="13" font-weight="600" style="fill: #4f46e5 !important; font-family: ui-sans-serif, system-ui, sans-serif;">(terület: 3²)</text>

  <!-- Square on hypotenuse c (tilted, 150x150) -->
  <polygon points="180,140 270,260 390,170 300,50" fill="#f59e0b" fill-opacity="0.25" stroke="#d97706" stroke-width="2.5"/>
  <!-- Area text inside amber square -->
  <text x="295" y="145" text-anchor="middle" font-size="20" font-weight="bold" style="fill: #b45309 !important; font-family: ui-sans-serif, system-ui, sans-serif;">c² = 25</text>
  <text x="295" y="170" text-anchor="middle" font-size="14" font-weight="600" style="fill: #d97706 !important; font-family: ui-sans-serif, system-ui, sans-serif;">(terület: 5²)</text>

  <!-- Right Triangle ABC -->
  <polygon points="180,140 180,260 270,260" fill="#3b82f6" fill-opacity="0.28" stroke="#1d4ed8" stroke-width="3"/>

  <!-- Right angle marker at (180, 260) with 90° label -->
  <polyline points="180,242 198,242 198,260" fill="none" stroke="#1d4ed8" stroke-width="2"/>
  <circle cx="189" cy="251" r="2.5" fill="#1d4ed8"/>

  <!-- Leg b label (clean pill inside the triangle, no collision!) -->
  <rect x="186" y="188" width="46" height="24" rx="6" fill="#ffffff" fill-opacity="0.95" stroke="#059669" stroke-width="1.5"/>
  <text x="209" y="205" text-anchor="middle" font-size="14" font-weight="bold" style="fill: #047857 !important; font-family: ui-sans-serif, system-ui, sans-serif;">b = 4</text>

  <!-- Leg a label (clean pill inside the triangle, no collision!) -->
  <rect x="202" y="228" width="46" height="24" rx="6" fill="#ffffff" fill-opacity="0.95" stroke="#4f46e5" stroke-width="1.5"/>
  <text x="225" y="245" text-anchor="middle" font-size="14" font-weight="bold" style="fill: #4338ca !important; font-family: ui-sans-serif, system-ui, sans-serif;">a = 3</text>

  <!-- Hypotenuse c label (clean pill near the hypotenuse) -->
  <rect x="238" y="178" width="48" height="24" rx="6" fill="#ffffff" fill-opacity="0.95" stroke="#d97706" stroke-width="1.5"/>
  <text x="262" y="195" text-anchor="middle" font-size="14" font-weight="bold" style="fill: #b45309 !important; font-family: ui-sans-serif, system-ui, sans-serif;">c = 5</text>
</svg>
        `
    },

    // ═══════════════════════════════════════════════
    // 2. KÉRDÉS: A tétel felismerése (Feleletválasztós)
    // ═══════════════════════════════════════════════
    {
        id: 'pythagoras-q-formula',
        type: 'question',
        chapter: 'Pitagorasz-tétel',
        title: '1. Feladat: A tétel felírása',
        inputType: 'multiple-choice',
        question: 'Egy derékszögű háromszög befogói $x$ és $y$, az átfogója pedig $z$. Melyik egyenlet fejezi ki helyesen a Pitagorasz-tételt?',
        options: [
            '$x^2 + y^2 = z^2$',
            '$x + y = z$',
            '$x^2 + z^2 = y^2$',
            '$x^2 - y^2 = z^2$'
        ],
        correctAnswer: '$x^2 + y^2 = z^2$',
        hint: 'Keresd meg, melyik két oldal a befogó ($x$ és $y$), és melyik az átfogó ($z$)!',
        detailedHint: 'A két befogó négyzetének összege egyenlő az átfogó négyzetével: $x^2 + y^2 = z^2$.',
        explanation: 'A Pitagorasz-tétel szerint mindig a befogók négyzeteinek összege adja meg az átfogó négyzetét: $x^2 + y^2 = z^2$.',
        successMessage: 'Kiváló! Mindig a befogók négyzeteit adjuk össze: $x^2 + y^2 = z^2$.',
        generate: () => {
            const letterSets = [
                { leg1: 'p', leg2: 'q', hyp: 'r' },
                { leg1: 'u', leg2: 'v', hyp: 'w' },
                { leg1: 'k', leg2: 'm', hyp: 'n' }
            ];
            const set = letterSets[Math.floor(Math.random() * letterSets.length)];
            const correct = `$${set.leg1}^2 + ${set.leg2}^2 = ${set.hyp}^2$`;
            const wrong1 = `$${set.leg1} + ${set.leg2} = ${set.hyp}$`;
            const wrong2 = `$${set.leg1}^2 + ${set.hyp}^2 = ${set.leg2}^2$`;
            const wrong3 = `$${set.leg1}^2 - ${set.leg2}^2 = ${set.hyp}^2$`;

            return {
                question: `Egy derékszögű háromszög befogói $${set.leg1}$ és $${set.leg2}$, átfogója pedig $${set.hyp}$. Melyik egyenlet írja le helyesen a tételt?`,
                options: [correct, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5),
                correctAnswer: correct,
                explanation: `A két befogó négyzetének összege az átfogó négyzete: $${set.leg1}^2 + ${set.leg2}^2 = ${set.hyp}^2$.`,
                hint: `A két befogó $${set.leg1}$ és $${set.leg2}$, az átfogó pedig $${set.hyp}$.`
            };
        }
    },

    // ═══════════════════════════════════════════════
    // 3. KÉRDÉS: Átfogó számítása (Numerikus)
    // ═══════════════════════════════════════════════
    {
        id: 'pythagoras-q-hypotenuse',
        type: 'question',
        chapter: 'Pitagorasz-tétel',
        title: '2. Feladat: Átfogó kiszámítása',
        inputType: 'numeric',
        question: 'Egy derékszögű háromszög két befogója $a = 6\\text{ cm}$ és $b = 8\\text{ cm}$. Hány centiméter hosszú az átfogó ($c$)?',
        correctAnswer: '10',
        hint: 'Alkalmazd a képletet: $c^2 = a^2 + b^2 = 6^2 + 8^2$.',
        detailedHint: '$c^2 = 36 + 64 = 100 \\Longrightarrow c = \\sqrt{100} = 10\\text{ cm}$.',
        explanation: 'A számolás levezetése: $c^2 = 6^2 + 8^2 = 36 + 64 = 100 \\Longrightarrow c = \\sqrt{100} = 10\\text{ cm}$.',
        successMessage: 'Nagyszerű munka! $c = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10\\text{ cm}$.',
        generate: () => {
            const triples = [
                { a: 3, b: 4, c: 5 },
                { a: 6, b: 8, c: 10 },
                { a: 5, b: 12, c: 13 },
                { a: 9, b: 12, c: 15 },
                { a: 8, b: 15, c: 17 }
            ];
            const chosen = triples[Math.floor(Math.random() * triples.length)];
            return {
                question: `Egy derékszögű háromszög két befogója $a = ${chosen.a}\\text{ cm}$ és $b = ${chosen.b}\\text{ cm}$. Hány centiméter hosszú az átfogó ($c$)?`,
                correctAnswer: chosen.c.toString(),
                hint: `Írd fel: $c^2 = a^2 + b^2 = ${chosen.a}^2 + ${chosen.b}^2 = ${chosen.a * chosen.a} + ${chosen.b * chosen.b}$.`,
                detailedHint: `$c^2 = ${chosen.c * chosen.c} \\Longrightarrow c = \\sqrt{${chosen.c * chosen.c}} = ${chosen.c}\\text{ cm}$.`,
                explanation: `Levezetés: $c = \\sqrt{${chosen.a}^2 + ${chosen.b}^2} = \\sqrt{${chosen.c * chosen.c}} = ${chosen.c}\\text{ cm}$.`
            };
        }
    },

    // ═══════════════════════════════════════════════
    // 4. KÉRDÉS: Életszerű feladat / Befogó számítása
    // ═══════════════════════════════════════════════
    {
        id: 'pythagoras-q-ladder',
        type: 'question',
        chapter: 'Pitagorasz-tétel',
        title: '3. Feladat: Életszerű probléma (A létra)',
        inputType: 'numeric',
        question: 'Egy $c = 5\\text{ m}$ hosszú létrát támasztunk a függőleges házfalhoz. A létra alja $a = 3\\text{ m}$ távolságra van a fal tövétől. Milyen magasan ($b$) éri el a létra a falat méterben?',
        correctAnswer: '4',
        hint: 'Figyelem! Itt a létra hossza az átfogó ($c = 5\\text{ m}$), a talaj menti távolság az egyik befogó ($a = 3\\text{ m}$). A magasság a másik befogó ($b$).',
        detailedHint: 'Rendezd a tételt a keresett befogóra: $b^2 = c^2 - a^2 = 5^2 - 3^2 = 25 - 9 = 16 \\Longrightarrow b = \\sqrt{16} = 4\\text{ m}$.',
        explanation: 'A derékszög a fal és a talaj találkozásánál van ($90^\\circ$). Így $b = \\sqrt{c^2 - a^2} = \\sqrt{5^2 - 3^2} = \\sqrt{16} = 4\\text{ m}$.',
        successMessage: 'Tökéletes! $b = \\sqrt{5^2 - 3^2} = \\sqrt{16} = 4\\text{ m}$.',
        generate: () => {
            const ladderScenarios = [
                { c: 5, a: 3, b: 4 },
                { c: 10, a: 6, b: 8 },
                { c: 13, a: 5, b: 12 },
                { c: 15, a: 9, b: 12 },
                { c: 17, a: 8, b: 15 }
            ];
            const s = ladderScenarios[Math.floor(Math.random() * ladderScenarios.length)];
            return {
                question: `Egy $c = ${s.c}\\text{ m}$ hosszú létrát támasztunk a házfalhoz. A létra talpa $a = ${s.a}\\text{ m}$ távolságra van a faltól. Hány méter magasan ($b$) éri el a létra a falat?`,
                correctAnswer: s.b.toString(),
                hint: `A létra az átfogó ($c = ${s.c}\\text{ m}$), a távolság az egyik befogó ($a = ${s.a}\\text{ m}$). Számítsd ki: $b^2 = c^2 - a^2 = ${s.c}^2 - ${s.a}^2$.`,
                detailedHint: `$b^2 = ${s.c * s.c} - ${s.a * s.a} = ${s.b * s.b} \\Longrightarrow b = \\sqrt{${s.b * s.b}} = ${s.b}\\text{ m}$.`,
                explanation: `A fal magassága: $b = \\sqrt{${s.c}^2 - ${s.a}^2} = \\sqrt{${s.b * s.b}} = ${s.b}\\text{ m}$.`
            };
        }
    },

    // ═══════════════════════════════════════════════
    // 5. KÉRDÉS: Tétel megfordítása (Feleletválasztós)
    // ═══════════════════════════════════════════════
    {
        id: 'pythagoras-q-converse',
        type: 'question',
        chapter: 'Pitagorasz-tétel',
        title: '4. Feladat: Derékszögű-e a háromszög?',
        inputType: 'multiple-choice',
        question: 'Egy háromszög oldalai $a = 5\\text{ cm}$, $b = 12\\text{ cm}$ és $c = 13\\text{ cm}$. Derékszögű-e ez a háromszög?',
        options: [
            'Igen, mert $5^2 + 12^2 = 25 + 144 = 169 = 13^2$',
            'Nem, mert $5 + 12 \\neq 13$',
            'Nem, mert $13^2 - 12^2 \\neq 5^2$',
            'Nem, mert $5^2 + 12^2 \\neq 13^2$'
        ],
        correctAnswer: 'Igen, mert $5^2 + 12^2 = 25 + 144 = 169 = 13^2$',
        hint: 'Ellenőrizd a két rövidebb oldal négyzetösszegét ($5^2 + 12^2$) a leghosszabb oldal négyzetével ($13^2$)!',
        detailedHint: '$5^2 + 12^2 = 25 + 144 = 169$. A leghosszabb oldal négyzete: $13^2 = 169$. Mivel megegyeznek ($169 = 169$), a háromszög derékszögű!',
        explanation: 'A Pitagorasz-tétel megfordítása kimondja: ha egy háromszög oldalaira teljesül, hogy $a^2 + b^2 = c^2$, akkor a háromszög derékszögű. Mivel $5^2 + 12^2 = 13^2$, a háromszög derékszögű.',
        successMessage: 'Helyes! Ezt hívjuk a Pitagorasz-tétel megfordításának: ha $a^2 + b^2 = c^2$, akkor a háromszög derékszögű.'
    },

    // ═══════════════════════════════════════════════
    // 6. ISKOLABEMUTATÓ ZÁRÓ KVÍZ + DIGITÁLIS OKLEVÉL
    // ═══════════════════════════════════════════════
    {
        id: 'pythagoras-summary-quiz',
        type: 'quiz',
        chapter: 'Pitagorasz-tétel',
        title: 'Összefoglaló kvíz',
        description: 'Válaszolj helyesen a 3 kérdésre, és a teszt végén generáld le a saját, névre szóló digitális okleveledet!',
        isSummary: true,
        minScoreToPass: 2,
        questions: [
            {
                question: 'Melyik a derékszögű háromszög leghosszabb oldala, amely a $90^\\circ$-os derékszöggel szemben fekszik?',
                inputType: 'multiple-choice',
                options: ['Átfogó ($c$)', 'Befogó ($a$ vagy $b$)', 'Középvonal', 'Magasságvonal'],
                correctAnswer: 'Átfogó ($c$)',
                hint: 'A derékszöggel szemközti oldalról van szó ($c$).',
                explanation: 'A derékszögű háromszögben mindig az átfogó ($c$) a leghosszabb oldal.'
            },
            {
                question: 'Egy derékszögű háromszög befogói $a = 3\\text{ cm}$ és $b = 4\\text{ cm}$. Hány centiméter az átfogója ($c$)?',
                inputType: 'numeric',
                correctAnswer: '5',
                hint: '$c = \\sqrt{a^2 + b^2} = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25}$.',
                explanation: '$c = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5\\text{ cm}$.'
            },
            {
                question: 'Ha egy derékszögű háromszög átfogója $c = 10\\text{ cm}$, egyik befogója $a = 6\\text{ cm}$, hány centiméter a másik befogó ($b$)?',
                inputType: 'numeric',
                correctAnswer: '8',
                hint: '$b = \\sqrt{c^2 - a^2} = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = \\sqrt{64}$.',
                explanation: '$b = \\sqrt{10^2 - 6^2} = \\sqrt{64} = 8\\text{ cm}$.'
            }
        ]
    }
];
