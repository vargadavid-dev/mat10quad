import { CurriculumItem } from '../../../types';
import { generateSummaryQuiz } from '../../../utils/QuizGenerator';
import { circleBasicsCurriculum } from './circle_basics';

const circleFormulasContent: CurriculumItem[] = [
    // ═══════════════════════════════════════════════
    // SZINT 4: Kerület, Terület és π
    // ═══════════════════════════════════════════════
    {
        id: 'circle-formulas-theory',
        type: 'theory',
        chapter: 'Kör alapfogalmai',
        title: '4. Kerület, Terület és a π',
        content: `
A kör számításaihoz a $\\pi$ (**pi**) számot használjuk. Értéke körülbelül $3{,}14159...$, a gyakorlatban $\\pi \\approx 3{,}14$-gyel számolunk.

### A kör kerülete ($K$)
A kör "kerítésének" hossza — vagyis a körvonal teljes hossza:

$$K = 2 \\pi r = d \\cdot \\pi$$

### A kör területe ($T$)
A körlap "mérete" — vagyis a körvonal által bezárt terület:

$$T = r^2 \\cdot \\pi$$

### 💡 Példa
Ha $r = 5$ cm:
- Kerület: $K = 2 \\cdot 3{,}14 \\cdot 5 = 31{,}4$ cm
- Terület: $T = 5^2 \\cdot 3{,}14 = 25 \\cdot 3{,}14 = 78{,}5$ cm²

<InteractiveComponent type="CircleFormulasVisualizer" />
        `,
    },

    // --- Szint 4 Feladatok ---
    {
        id: 'circle-formulas-q1',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'matching',
        question: '**Párosítsd a képleteket a mennyiségekkel!**',
        matchPairs: [
            { left: 'Kerület ($K$)', right: '$2 \\pi r$' },
            { left: 'Terület ($T$)', right: '$r^2 \\cdot \\pi$' },
            { left: 'Átmérő ($d$)', right: '$2r$' }
        ],
        correctAnswer: 'implied',
        hint: 'A kerületnél a sugarat szorozzuk, a területnél a sugár négyzetét...',
        successMessage: 'Pontosan! A három legfontosabb képlet a körrel kapcsolatban.'
    },
    {
        id: 'circle-formulas-q2',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'numeric',
        question: 'Mekkora a **kerülete** egy $r = 7$ cm sugarú körnek? *(Számolj $\\pi \\approx 3{,}14$-gyel! Az eredményt **két tizedesjegyre** kerekítve add meg!)*',
        correctAnswer: '43,96',
        hint: 'Használd a képletet: $K = 2 \\cdot \\pi \\cdot r$',
        explanation: '$K = 2 \\cdot 3{,}14 \\cdot 7 = 43{,}96$ cm.',
        successMessage: 'Helyes! $K = 2 \\cdot 3{,}14 \\cdot 7 = 43{,}96$ cm.',
        generate: () => {
            const r = Math.floor(Math.random() * 10) + 3; // 3 to 12
            const k = 2 * 3.14 * r;
            const kFormatted = k.toFixed(2).replace('.', ',');
            return {
                question: `Mekkora a **kerülete** egy $r = ${r}$ cm sugarú körnek? *(Számolj $\\pi \\approx 3{,}14$-gyel! Az eredményt **két tizedesjegyre** kerekítve add meg!)*`,
                correctAnswer: kFormatted,
                hint: 'Használd a képletet: $K = 2 \\cdot \\pi \\cdot r$',
                explanation: `$K = 2 \\cdot 3{,}14 \\cdot ${r} = ${kFormatted}$ cm.`,
                successMessage: `Helyes! $K = 2 \\cdot 3{,}14 \\cdot ${r} = ${kFormatted}$ cm.`
            };
        }
    },
    {
        id: 'circle-formulas-q3',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'numeric',
        question: 'Mekkora a **területe** egy $r = 5$ cm sugarú körnek? *($\\pi \\approx 3{,}14$, két tizedesjegyre kerekítve)*',
        correctAnswer: '78,50',
        hint: 'Használd a képletet: $T = r^2 \\cdot \\pi$',
        explanation: '$T = 5^2 \\cdot 3{,}14 = 25 \\cdot 3{,}14 = 78{,}50$ cm².',
        successMessage: 'Pontos! $T = 25 \\cdot 3{,}14 = 78{,}50$ cm².',
        generate: () => {
            const r = Math.floor(Math.random() * 8) + 3; // 3 to 10
            const area = r * r * 3.14;
            const areaFormatted = area.toFixed(2).replace('.', ',');
            return {
                question: `Mekkora a **területe** egy $r = ${r}$ cm sugarú körnek? *($\\pi \\approx 3{,}14$, két tizedesjegyre kerekítve)*`,
                correctAnswer: areaFormatted,
                hint: 'Használd a képletet: $T = r^2 \\cdot \\pi$',
                explanation: `$T = ${r}^2 \\cdot 3{,}14 = ${r * r} \\cdot 3{,}14 = ${areaFormatted}$ cm².`,
                successMessage: `Pontos! $T = ${r * r} \\cdot 3{,}14 = ${areaFormatted}$ cm².`
            };
        }
    },
    {
        id: 'circle-formulas-q4',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'numeric',
        question: 'Ha az átmérő $d = 10$ cm, mennyi a kör **kerülete**? *(Két tizedesjegyre kerekítve, $\\pi \\approx 3{,}14$)*',
        correctAnswer: '31,40',
        hint: '$K = d \\cdot \\pi$, és $d = 10$.',
        explanation: '$K = d \\cdot \\pi = 10 \\cdot 3{,}14 = 31{,}40$ cm.',
        successMessage: 'Helyes! $K = 10 \\cdot 3{,}14 = 31{,}40$ cm.',
        generate: () => {
            const d = Math.floor(Math.random() * 16) + 5; // 5 to 20
            const k = d * 3.14;
            const kFormatted = k.toFixed(2).replace('.', ',');
            return {
                question: `Ha az átmérő $d = ${d}$ cm, mennyi a kör **kerülete**? *(Két tizedesjegyre kerekítve, $\\pi \\approx 3{,}14$)*`,
                correctAnswer: kFormatted,
                hint: `$K = d \\cdot \\pi$, és $d = ${d}$.`,
                explanation: `$K = d \\cdot \\pi = ${d} \\cdot 3{,}14 = ${kFormatted}$ cm.`,
                successMessage: `Helyes! $K = ${d} \\cdot 3{,}14 = ${kFormatted}$ cm.`
            };
        }
    },
    {
        id: 'circle-formulas-q5',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: 'Melyik képlet adja meg a kör **területét**?',
        options: ['$K = 2\\pi r$', '$T = r^2 \\cdot \\pi$', '$T = d \\cdot \\pi$', '$K = d^2 \\cdot \\pi$'],
        correctAnswer: '$T = r^2 \\cdot \\pi$',
        hint: 'A területnél a sugarat négyzeteljük és szorozzuk π-vel.',
        successMessage: 'Helyes! $T = r^2 \\cdot \\pi$ a terület képlete.'
    },

    // ═══════════════════════════════════════════════
    // SZINT 5: Szögek a körben
    // ═══════════════════════════════════════════════
    {
        id: 'circle-angles-theory',
        type: 'theory',
        chapter: 'Kör alapfogalmai',
        title: '5. Szögek a körben',
        content: `

### Középponti szög ($\\alpha$)
A szög **csúcsa a kör középpontjában** ($O$) van, **szárai sugarak**. A középponti szög és a hozzá tartozó körív fokban kifejezett mértéke megegyezik.

### Kerületi szög ($\\beta$)
A szög **csúcsa a körvonalán** van, **szárai húrok**.

### 🔑 A legfontosabb összefüggés

> **Ugyanazon ívhez tartozó középponti szög kétszer akkora, mint a kerületi szög:**
> $$\\alpha_{kp} = 2 \\cdot \\beta_{ker}$$

Más szóval: a kerületi szög mindig fele a középpontinak!

### Thálész tétele (speciális eset)
Ha a középponti szög $180°$ (egyenesszög), akkor a hozzá tartozó kerületi szög $\\frac{180°}{2} = 90°$.

> **Tehát:** Ha egy kör átmérőjének két végpontját összekötjük a körvonal bármely más pontjával, a kapott szög mindig **derékszög** (90°).

### Interaktív Vizsgálat
Mozgasd az **A**, **B** és **C** pontokat a köríven! Figyeld meg, ahogy a **C** pont mozog, a kerületi szög mérete **nem változik** (amíg ugyanazon az íven marad).

<InteractiveComponent type="CircleAngleVisualizer" />
        `,
    },

    // --- Szint 5 Feladatok ---
    {
        id: 'circle-angles-q1',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'matching',
        question: '**Párosítsd a szögtípusokat a definícióikkal!**',
        matchPairs: [
            { left: 'Középponti szög', right: 'Csúcsa a középpontban, szárai sugarak' },
            { left: 'Kerületi szög', right: 'Csúcsa a körvonalán, szárai húrok' }
        ],
        correctAnswer: 'implied',
        hint: 'Hol van a szög csúcsa és mik a szárai?',
        successMessage: 'Helyes! A csúcs elhelyezkedése és a szárak típusa határozza meg.'
    },
    {
        id: 'circle-angles-q2',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: 'Ha egy kerületi szög $35°$, mekkora a hozzá tartozó **középponti szög**?',
        options: ['17,5°', '35°', '70°', '105°'],
        correctAnswer: '70°',
        hint: 'A középponti szög a kerületi szög kétszerese!',
        explanation: 'A tétel szerint: $\\alpha_{kp} = 2 \\cdot \\beta_{ker} = 2 \\cdot 35° = 70°$.',
        successMessage: 'Helyes! A középponti szög a kerületi duplája: $2 \\cdot 35° = 70°$.',
        generate: () => {
            const beta = (Math.floor(Math.random() * 13) + 3) * 5; // 15 to 75 in steps of 5
            const alpha = 2 * beta;
            // Generate plausible wrong options
            const options = [
                `${beta / 2}°`,
                `${beta}°`,
                `${alpha}°`,
                `${alpha + beta}°`
            ].sort(() => Math.random() - 0.5);

            return {
                question: `Ha egy kerületi szög $${beta}°$, mekkora a hozzá tartozó **középponti szög**?`,
                options: options,
                correctAnswer: `${alpha}°`,
                hint: 'A középponti szög a kerületi szög kétszerese!',
                explanation: `A tétel szerint: $\\alpha_{kp} = 2 \\cdot \\beta_{ker} = 2 \\cdot ${beta}° = ${alpha}°$.`,
                successMessage: `Helyes! A középponti szög a kerületi duplája: $2 \\cdot ${beta}° = ${alpha}°$.`
            };
        }
    },
    {
        id: 'circle-angles-q3',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'numeric',
        question: 'Ha a középponti szög $110°$, mekkora a hozzá tartozó **kerületi szög**? *(Írd be a fokban mért értéket!)*',
        correctAnswer: '55',
        hint: 'A kerületi szög a középponti szög fele.',
        explanation: 'A kerületi szög a középponti szög fele: $\\frac{110°}{2} = 55°$.',
        successMessage: 'Pontos! $110° / 2 = 55°$.',
        generate: () => {
            const alpha = (Math.floor(Math.random() * 12) + 4) * 10; // 40 to 150 in steps of 10
            const beta = alpha / 2;
            return {
                question: `Ha a középponti szög $${alpha}°$, mekkora a hozzá tartozó **kerületi szög**? *(Írd be a fokban mért értéket!)*`,
                correctAnswer: beta.toString(),
                hint: 'A kerületi szög a középponti szög fele.',
                explanation: `A kerületi szög a középponti szög fele: $\\frac{${alpha}°}{2} = ${beta}°$.`,
                successMessage: `Pontos! $${alpha}° / 2 = ${beta}°$.`
            };
        }
    },
    {
        id: 'circle-angles-q4',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'numeric',
        question: 'Ha a háromszög egyik oldala egy kör **átmérője**, és a szemben lévő csúcs a körvonalán van, mekkora a szög a csúcsnál? *(Thálész tétele!)*',
        correctAnswer: '90',
        hint: 'Ez Thálész tétele! Az átmérő feletti kerületi szög mindig...',
        explanation: 'Thálész tétele: az átmérő felett lévő kerületi szög mindig $90°$ (derékszög).',
        successMessage: 'Helyes! Thálész tétele: átmérő feletti kerületi szög = 90°.'
    },
    {
        id: 'circle-angles-q5',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: 'Változik-e egy ívhez tartozó **kerületi szög** nagysága, ha a csúcsát elmozdítjuk a köríven (de az ív ugyanaz marad)?',
        options: ['Igen, folyamatosan változik', 'Nem, mindenhol ugyanakkora', 'Csak az ív felénél a legnagyobb'],
        correctAnswer: 'Nem, mindenhol ugyanakkora',
        hint: 'Nézd meg, melyik ívhez tartozik a szög!',
        detailedHint: 'A 40 fokos szög a köré írt kör középponti szöge, vagy kerületi szöge? A feladatban kerületi szögekről van szó. Kerületi szögek tétele: Ugyanazon ívhez tartozó kerületi szögek egyenlők.',
        explanation: 'Mivel a C és D pontoknál lévő szögek ugyanahhoz az AB ívhez tartoznak, ezért nagyságuk megegyezik. Tehát ha a C-nél lévő szög 40°, akkor a D-nél lévő is 40°.',
        successMessage: 'Igen! Ugyanazon ívhez tartozó kerületi szögek mindig egyenlők.',
        generate: () => {
            const variations = [
                {
                    question: 'Változik-e egy ívhez tartozó **kerületi szög** nagysága, ha a csúcsát elmozdítjuk a köríven?',
                    options: ['Igen', 'Nem', 'Csak néha'],
                    correctAnswer: 'Nem',
                    explanation: 'Ugyanahhoz az ívhez tartozó összes kerületi szög egyenlő.',
                },
                {
                    question: '**Igaz vagy hamis:** Ugyanazon ívhez végtelen sok különböző nagyságú kerületi szög tartozik.',
                    options: ['Igaz', 'Hamis'],
                    correctAnswer: 'Hamis',
                    explanation: 'A kerületi szögek nagysága az íven fix, mind egyenlő.',
                },
                {
                    question: 'Mekkora a különbség két, ugyanazon ívhez tartozó **kerületi szög** között?',
                    options: ['0°', '180°', 'Változó'],
                    correctAnswer: '0°',
                    explanation: 'Mivel egyenlők, a különbségük 0.',
                }
            ];
            const selected = variations[Math.floor(Math.random() * variations.length)];
            return {
                question: selected.question,
                options: selected.options,
                correctAnswer: selected.correctAnswer,
                explanation: selected.explanation,
                hint: 'Kerületi szögek tétele...',
                successMessage: 'Helyes válasz!'
            };
        }
    },
];

// ═══════════════════════════════════════════════
// OPCIONÁLIS ÖSSZEFOGLALÓ KVÍZ
// ═══════════════════════════════════════════════

// Generate quiz dynamically based on the questions above

const allCircleContent = [...circleBasicsCurriculum, ...circleFormulasContent];
const quiz = generateSummaryQuiz(allCircleContent, 'circle-summary-quiz', 'Kör alapfogalmai');

export const circleFormulasCurriculum: CurriculumItem[] = [
    ...circleFormulasContent,
    quiz
];
