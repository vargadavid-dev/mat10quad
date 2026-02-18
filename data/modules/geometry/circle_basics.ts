import { CurriculumItem } from '../../../types';

export const circleBasicsCurriculum: CurriculumItem[] = [
    // ═══════════════════════════════════════════════
    // SZINT 1: Mi is az a kör?
    // ═══════════════════════════════════════════════
    {
        id: 'circle-basics-definition',
        type: 'theory',
        chapter: 'Kör alapfogalmai',
        title: '1. Mi is az a kör?',
        content: `

A kör nem csak egy "kerek izé". Matematikailag így definiáljuk:

**A kör** azon pontok halmaza a síkban, amelyek egy adott ponttól (a **középpont**, jele: $O$) egyenlő távolságra vannak. Ez a távolság a **sugár** (jele: $r$).

### Távolságok és Szakaszok

- **Sugár** $r$ — A középpontot és a körvonal bármely pontját összekötő szakasz.
- **Átmérő** $d$ — A körvonal két pontját összekötő szakasz, amely áthalad a középponton. Hossza: $d = 2r$.
- **Húr** — A körvonal két tetszőleges pontját összekötő szakasz. *(Az átmérő a leghosszabb húr!)*

### 💡 Fontos megkülönböztetés
- **Körvonal** — Maga a "vonal", azaz a pontok halmaza, amelyek $r$ távolságra vannak $O$-tól.
- **Körlap** — A körvonal és a belsejében lévő összes pont.

<InteractiveComponent type="CircleBasicsVisualizer" />
        `
    },

    // --- Szint 1 Feladatok ---
    {
        id: 'circle-basics-q1',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: '**Igaz vagy hamis:** Minden átmérő egyben húr is.',
        options: ['Igaz', 'Hamis'],
        correctAnswer: 'Igaz',
        hint: 'Az átmérő a körvonal két pontját köti össze...',
        explanation: 'Az átmérő is a körvonal két pontját összekötő szakasz, ami pont a húr definíciója. Tehát minden átmérő húr, de nem minden húr átmérő!',
        successMessage: 'Helyes! Az átmérő egy speciális húr, ami áthalad a középponton.',
        generate: () => {
            const variations = [
                {
                    question: '**Igaz vagy hamis:** Minden átmérő egyben húr is.',
                    correctAnswer: 'Igaz',
                    explanation: 'Az átmérő a leghosszabb húr, tehát minden átmérő húr.',
                },
                {
                    question: '**Igaz vagy hamis:** Minden húr egyben átmérő is.',
                    correctAnswer: 'Hamis',
                    explanation: 'Csak azok a húrok átmérők, amelyek áthaladnak a középponton.',
                },
                {
                    question: '**Igaz vagy hamis:** A sugár egyben húr is.',
                    correctAnswer: 'Hamis',
                    explanation: 'A sugár a középpontot köti össze a körvonallal, a húr pedig a körvonal két pontját.',
                }
            ];
            const selected = variations[Math.floor(Math.random() * variations.length)];
            return {
                question: selected.question,
                options: ['Igaz', 'Hamis'],
                correctAnswer: selected.correctAnswer,
                explanation: selected.explanation,
                hint: 'Gondolj a fogalmak definíciójára!',
                successMessage: 'Helyes válasz!'
            };
        }
    },
    {
        id: 'circle-basics-q2',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'numeric',
        question: 'Ha a kör sugara $r = 6$ cm, mennyi az **átmérő**? *(Írd be a számot cm-ben!)*',
        correctAnswer: '12',
        hint: 'Emlékezz: $d = 2r$',
        explanation: 'Az átmérő mindig a sugár kétszerese: $d = 2 \\cdot 6 = 12$ cm.',
        successMessage: 'Pontos! $d = 2r = 2 \\cdot 6 = 12$ cm.',
        generate: () => {
            const r = Math.floor(Math.random() * 13) + 3; // 3 to 15
            const d = 2 * r;
            return {
                question: `Ha a kör sugara $r = ${r}$ cm, mennyi az **átmérő**? *(Írd be a számot cm-ben!)*`,
                correctAnswer: d.toString(),
                hint: 'Emlékezz: $d = 2r$',
                explanation: `Az átmérő mindig a sugár kétszerese: $d = 2 \\cdot ${r} = ${d}$ cm.`,
                successMessage: `Pontos! $d = 2r = 2 \\cdot ${r} = ${d}$ cm.`
            };
        }
    },
    {
        id: 'circle-basics-q3',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'matching',
        question: '**Párosítsd a fogalmakat a definícióikkal!**',
        matchPairs: [
            { left: 'Sugár ($r$)', right: 'Középponttól a körvonalra' },
            { left: 'Átmérő ($d$)', right: 'Középponton áthaladó húr' },
            { left: 'Húr', right: 'Körvonal 2 pontját összekötő szakasz' },
            { left: 'Körlap', right: 'Körvonal + belseje' }
        ],
        correctAnswer: 'implied',
        hint: 'Gondolj végig az egyes fogalmak definícióján!',
        successMessage: 'Szuper! Minden fogalmat pontosan párosítottál.'
    },
    {
        id: 'circle-basics-q4',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: 'A kör **középpontja** része a körvonalnak?',
        options: ['Igen, a körvonal része', 'Nem, a kör belsejében van'],
        correctAnswer: 'Nem, a kör belsejében van',
        hint: 'A körvonal pontjai mind $r > 0$ távolságra vannak a középponttól...',
        explanation: 'A középpont 0 távolságra van önmagától, de a körvonal pontjai $r > 0$ távolságra vannak. Tehát a középpont NEM része a körvonalnak.',
        successMessage: 'Így van! A középpont a kör belsejében van.',
        generate: () => {
            const variations = [
                {
                    question: 'A kör **középpontja** része a körvonalnak?',
                    options: ['Igen, a körvonal része', 'Nem, a kör belsejében van'],
                    correctAnswer: 'Nem, a kör belsejében van',
                    explanation: 'A középpont távolsága önmagától 0, a körvonalé pedig r > 0.',
                },
                {
                    question: 'Hány pontja van a **körvonalnak**?',
                    options: ['Egy', 'Véges sok', 'Végtelen sok'],
                    correctAnswer: 'Végtelen sok',
                    explanation: 'A körvonal végtelen sok pontból áll, amelyek r távolságra vannak a középponttól.',
                },
                {
                    question: 'Mekkora távolságra vannak a **körvonal** pontjai a középponttól?',
                    options: ['Különböző távolságra', 'Mind r távolságra', '0 távolságra'],
                    correctAnswer: 'Mind r távolságra',
                    explanation: 'Ez a kör definíciója: azon pontok, amelyek r távolságra vannak a középponttól.',
                }
            ];
            const selected = variations[Math.floor(Math.random() * variations.length)];
            return {
                question: selected.question,
                options: selected.options,
                correctAnswer: selected.correctAnswer,
                explanation: selected.explanation,
                hint: 'Gondolj a kör definíciójára!',
                successMessage: 'Helyes!'
            };
        }
    },

    // ═══════════════════════════════════════════════
    // SZINT 2: Egyenesek és a kör
    // ═══════════════════════════════════════════════
    {
        id: 'circle-lines-theory',
        type: 'theory',
        chapter: 'Kör alapfogalmai',
        title: '2. Egyenesek és a kör',
        content: `

Egy egyenes és egy kör viszonya háromféle lehet (a távolság függvényében):

### 1. Kívül fekvő egyenes
Nincs közös pontjuk. Az egyenes "elmegy" a kör mellett.
Távolsága a középponttól: $d > r$.

### 2. Érintő ($e$)
**Egyetlen** közös pontja van a körrel (ez az *érintési pont*, $E$).
Távolsága a középponttól: $d = r$.

> [!IMPORTANT]
> **Érintő tulajdonsága:**
> Az érintési pontba húzott sugár **merőleges** az érintőre. ($r \\perp e$)

### 3. Szelő ($s$)
**Két** közös pontja van a körrel. A kör belsejébe eső szakasza a **húr**.
Távolsága a középponttól: $d < r$.

<InteractiveComponent type="CircleLinesVisualizer" />
        `
    },

    // --- Szint 2 Feladatok ---
    {
        id: 'circle-lines-q1',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'matching',
        question: '**Párosítsd az egyeneseket a közös pontok számával!**',
        matchPairs: [
            { left: 'Kívül fekvő egyenes', right: '0 közös pont' },
            { left: 'Érintő', right: '1 közös pont' },
            { left: 'Szelő', right: '2 közös pont' }
        ],
        correctAnswer: 'implied',
        hint: 'Gondolj arra, hányszor "érinti" vagy "metszi" az egyenes a kört!',
        successMessage: 'Tökéletes párosítás!'
    },
    {
        id: 'circle-lines-q2',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: 'Milyen szöget zár be az **érintő** az érintési pontba húzott sugárral?',
        options: ['0°', '45°', '90° (derékszög)', '180°'],
        correctAnswer: '90° (derékszög)',
        hint: 'Az érintő és a sugár kapcsolata a legfontosabb tulajdonság!',
        explanation: 'Az érintő mindig merőleges az érintési pontba húzott sugárra: $t \\\\perp r$. Ez 90°-os szöget jelent.',
        successMessage: 'Így van! Az érintő mindig merőleges a sugárra az érintési pontban.',
        generate: () => {
            const variations = [
                {
                    question: 'Milyen szöget zár be az **érintő** az érintési pontba húzott sugárral?',
                    options: ['0°', '45°', '90° (derékszög)', '180°'],
                    correctAnswer: '90° (derékszög)',
                    explanation: 'Az érintő sugara merőleges az érintőre.',
                },
                {
                    question: 'Hány fokos szögben metszi az **érintő** a sugarat?',
                    options: ['He gyes', 'Tompa', 'Derék (90°)', 'Egyenes'],
                    correctAnswer: 'Derék (90°)',
                    explanation: 'Az érintő és a sugár mindig derékszöget zár be.',
                },
                {
                    question: '**Igaz vagy hamis:** Az érintési pontba húzott sugár merőleges az érintőre.',
                    options: ['Igaz', 'Hamis'],
                    correctAnswer: 'Igaz',
                    explanation: 'Ez az érintő egyik legfontosabb tulajdonsága.',
                }
            ];
            const selected = variations[Math.floor(Math.random() * variations.length)];
            return {
                question: selected.question,
                options: selected.options,
                correctAnswer: selected.correctAnswer,
                explanation: selected.explanation,
                hint: 'Az érintő és sugár kapcsolata...',
                successMessage: 'Helyes válasz!'
            };
        }
    },
    {
        id: 'circle-lines-q3',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'numeric',
        question: 'Hány közös pontja van a körrel egy olyan egyenesnek, amely **áthalad a középponton**?',
        correctAnswer: '2',
        hint: 'Ha az egyenes átmegy a középponton, az mindkét irányba eléri a körvonalat.',
        explanation: 'A középponton áthaladó egyenes mindkét irányba metszi a körvonalat → 2 közös pont. Ez egy szelő, és a húrja az átmérő.',
        successMessage: 'Helyes! Ez egy szelő, és a húrja maga az átmérő.'
    },
    {
        id: 'circle-lines-q4',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: 'Mi a **szelőnek** a kör belsejébe eső része?',
        options: ['Sugár', 'Átmérő', 'Húr', 'Érintő'],
        correctAnswer: 'Húr',
        hint: 'A szelő két pontban metszi a kört. A két metszéspont közötti rész...',
        successMessage: 'Helyes! A szelő körbeli szakasza egy húr.'
    },

    // ═══════════════════════════════════════════════
    // SZINT 3: A kör részei
    // ═══════════════════════════════════════════════
    {
        id: 'circle-parts-theory',
        type: 'theory',
        chapter: 'Kör alapfogalmai',
        title: '3. A kör részei',
        content: `

Vágjuk fel a körünket! A kört különféle módon tudjuk részekre osztani: ívekre, cikkekre, szeletekre és gyűrűkre.

### 1. Körív
A **körvonal** egy darabja. Ha két pontot kijelölünk a körvonalon, azok két ívre bontják azt: rendszerint egy **kisebbik ív**re és egy **nagyobbik ív**re (kivéve, ha átellenes pontok, mert akkor két félkörív keletkezik).

### 2. Körcikk (Szeletnyi rész 🍕)
Olyan síkidom, amelyet **két sugár** és a közéjük eső **körív** határol.
- **Analógia:** Egy szelet pizza vagy torta.
- **Területe:** A teljes körlap területének ( $T = r^2\\pi$ ) arányos része a középponti szög ($\alpha$) szerint.

### 3. Körszelet (Levágott darab 🧢)
Olyan síkidom, amelyet egy **húr** és a hozzá tartozó **körív** határol.
- **Analógia:** Egy kerek kekszből egyenesen letört darab (nem központi vágás!).
- **Felépítése:** Ha a kör középpontját összekötjük a húr végpontjaival, akkor a körszelet a körcikk és a keletkező háromszög (húr + 2 sugár) különbsége (vagy összege, ha a középponti szög > 180°).

### 4. Körgyűrű (Fánk-forma 🍩)
Két **közös középpontú** (koncentrikus), de **eltérő sugarú** kör közötti terület.
- **Területe:** A nagyobb kör területéből kivonjuk a kisebb kör területét: $T = R^2\\pi - r^2\\pi = (R^2 - r^2)\\pi$.

> [!IMPORTANT]
> **A Félkör (Speciális eset)**
> A félkör különleges szerepet tölt be, mert egyszerre tekinthető:
> - **Speciális körcikknek**: Ahol a két határoló sugár egy egyenesbe esik (180°-os szöget zárnak be), így átmérőt alkotnak.
> - **Speciális körszeletnek**: Ahol a határoló húr a lehető leghosszabb, vagyis maga az **átmérő**.

Az alábbi interaktív kártyákon megnézheted ezeket a részeket, és a csúszkák segítségével előállíthatod a speciális eseteket is!

<InteractiveComponent type="CirclePartsVisualizer" />
        `,
    },

    // --- Szint 3 Feladatok ---
    {
        id: 'circle-parts-q1',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'matching',
        question: '**Párosítsd a kör részeit az analógiájukkal!**',
        matchPairs: [
            { left: 'Körcikk', right: '🍕 Pizza szelet' },
            { left: 'Körszelet', right: '🍪 Letört keksz' },
            { left: 'Körgyűrű', right: '🍩 Fánk' }
        ],
        correctAnswer: 'implied',
        hint: 'Melyik forma mire hasonlít?',
        successMessage: 'Szuper! Pontosan párosítottad az alakzatokat.'
    },
    {
        id: 'circle-parts-q2',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: 'Hogy hívjuk azt a síkidomot, amelyet egy **húr** választ le a körlapból?',
        options: ['Körcikk', 'Körszelet', 'Körgyűrű', 'Körív'],
        correctAnswer: 'Körszelet',
        hint: 'Gondolj egy kenyérre, amiből levágnak egy "sapkát"...',
        explanation: 'A körszelet az a terület, amelyet egy húr és a hozzá tartozó körív határol.',
        successMessage: 'Helyes! A körszelet = húr + körív által határolt terület.'
    },
    {
        id: 'circle-parts-q3',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: 'Mi határolja a **körcikket**?',
        options: ['2 húr + körív', '2 sugár + körív', '1 húr + 2 sugár', '2 átmérő'],
        correctAnswer: '2 sugár + körív',
        hint: 'Gondolj egy szelet pizzára! 🍕',
        explanation: 'A körcikket két sugár és a közéjük eső körív határolja.',
        successMessage: 'Pontos! Két sugár + a köztük lévő ív = körcikk.'
    },
    {
        id: 'circle-parts-q4',
        type: 'question',
        chapter: 'Kör alapfogalmai',
        inputType: 'multiple-choice',
        question: 'Hogyan nevezzük a két azonos középpontú, de eltérő sugarú kör közötti területet?',
        options: ['körívnek', 'körszeletnek', 'körcikknek', 'körgyűrűnek'],
        correctAnswer: 'körgyűrűnek',
        hint: 'Gondolj egy fánkra! 🍩',
        successMessage: 'Így van! A körgyűrű két koncentrikus kör közötti terület.'
    },
];
