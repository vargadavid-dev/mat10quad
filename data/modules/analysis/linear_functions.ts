import { CurriculumItem } from '../../../types';

export const linearFunctionsCurriculum: CurriculumItem[] = [
    // --- 1. BEVEZETÉS ---
    {
        chapter: 'Lineáris függvények',
        id: 'linear-intro',
        type: 'theory',
        title: '3. Lineáris függvények',
        content: `A koordináta rendszerben az egyeneseket **elsőfokú (lineáris) függvényekkel** írhatjuk le.
        
        Általános alakjuk:
        $$f(x) = mx + b$$
        
        Ahol:
        - **$m$ (meredekség)**: Megmutatja, mennyire "meredek" az egyenes.
          - Ha $m > 0$: az egyenes emelkedő.
          - Ha $m < 0$: az egyenes süllyedő.
        - **$b$ (tengelymetszet)**: Megmutatja, hol metszi az egyenes az y-tengelyt.`,
        diagramConfig: {
            type: 'coordinate-system',
            lines: [
                { x1: -5, y1: -1.5, x2: 5, y2: 3.5, color: '#4f46e5' }
            ],
            points: [
                { x: 0, y: 1, label: 'b', color: '#ef4444' }
            ]
        },
        layout: 'default'
    },

    // --- 2.1 EGYENES ARÁNYOSSÁG ---
    {
        chapter: 'Lineáris függvények',
        id: 'linear-direct-prop',
        type: 'theory',
        title: 'Egyenes arányosság',
        content: `Különleges eset, amikor $b = 0$.
        Ekkor a függvény:
        $$f(x) = mx$$
        
        Ez az **egyenes arányosság**.
        Fontos tulajdonsága, hogy **mindig átmegy az origón** ($0; 0$).`,
        diagramConfig: {
            type: 'coordinate-system',
            lines: [
                { x1: -5, y1: -5, x2: 5, y2: 5, color: '#059669' }
            ],
            points: [
                { x: 0, y: 0, label: 'Origó (0;0)', color: '#ef4444' }
            ]
        }
    },

    // --- 3. MEREDEKSÉG (LÉPCSŐZÉS) ---
    {
        chapter: 'Lineáris függvények',
        id: 'linear-slope-fraction',
        type: 'theory',
        title: 'Meredekség törtként',
        content: `Hogyan ábrázoljuk a törtes meredekséget? Használd a "lépcsőzés" módszert!
        
        $$m = \\frac{\\text{emelkedés}}{\\text{lépés}} = \\frac{\\Delta y}{\\Delta x}$$
        
        Például: $y = \\frac{2}{3}x + 1$
        1. Indulj a tengelymetszetből ($b=1$).
        2. A nevező ($3$) mutatja, mennyit lépj **jobbra**.
        3. A számláló ($2$) mutatja, mennyit lépj **fel**.`,
        diagramConfig: {
            type: 'coordinate-system',
            lines: [
                { x1: -5, y1: -2.33, x2: 5, y2: 4.33, color: '#d946ef' }, // Main line y = 2/3x + 1. Extended to range limits (-5 to 5)
                { x1: 0, y1: 1, x2: 3, y2: 1, color: '#d946ef', style: 'dashed', width: 2, label: 'Δx=3', labelOffset: { x: 0, y: -10 } }, // Horizontal step
                { x1: 3, y1: 1, x2: 3, y2: 3, color: '#d946ef', style: 'dashed', width: 2, label: 'Δy=2', labelOffset: { x: 15, y: 0 } }  // Vertical step
            ],
            points: [
                { x: 0, y: 1, color: '#ef4444' },
                { x: 3, y: 3, color: '#ef4444' }
            ]
        }
    },

    // --- 3.2 NEGATÍV MEREDEKSÉG ---
    {
        chapter: 'Lineáris függvények',
        id: 'linear-slope-negative',
        type: 'theory',
        title: 'Csökkenő meredekség',
        content: `Mi történik, ha a meredekség negatív?
        
        Például: $y = -\\frac{1}{2}x + 2$
        
        A lépcsőzés ugyanúgy működik, de a számláló most **lefelé** mutat!
        
        1. Indulj a tengelymetszetből ($b=2$).
        2. A nevező ($2$) miatt lépj 2-t **jobbra**.
        3. A számláló ($-1$) miatt lépj 1-et **le**.`,
        diagramConfig: {
            type: 'coordinate-system',
            lines: [
                { x1: -5, y1: 4.5, x2: 5, y2: -0.5, color: '#ef4444' }, // y = -0.5x + 2. Range [-5, 5]
                { x1: 0, y1: 2, x2: 2, y2: 2, color: '#ef4444', style: 'dashed', width: 2, label: 'Δx=2' }, // Right
                { x1: 2, y1: 2, x2: 2, y2: 1, color: '#ef4444', style: 'dashed', width: 2, label: 'Δy=-1', labelOffset: { x: 25, y: 5 } } // Down. Offset right
            ],
            points: [
                { x: 0, y: 2, color: '#2563eb' },
                { x: 2, y: 1, color: '#2563eb' }
            ]
        }
    },

    // --- 4. GYAKORLÁS: PARAMÉTEREK ---
    {
        chapter: 'Lineáris függvények',
        id: 'linear-params-kv',
        type: 'question',
        inputType: 'key-value',
        question: `**Határozd meg a paramétereket!**
        
        Adott az alábbi függvény:
        $$y = -2x + 3$$`,
        inputLabels: ['$m =$', '$b =$'],
        correctAnswer: ['-2', '3'],
        hint: 'Az x együtthatója a meredekség (m), a konstans tag a tengelymetszet (b).',
        successMessage: 'Pontos! m = -2, b = 3.'
    },

    // --- 5. GYAKORLÁS: ÁBRÁZOLÁS ---
    {
        chapter: 'Lineáris függvények',
        id: 'linear-plot-basic',
        type: 'question',
        inputType: 'coordinate-plot',
        question: `**Ábrázolás**
        
        Ábrázold az $y = 2x - 1$ függvényt!
        
        1. Jelöld be a tengelymetszetet ($b$)!
        2. Lépj a meredekség szerint ($1$ jobbra, $2$ fel), és jelöld be a második pontot!`,
        targetLine: { m: 2, b: -1 },
        correctAnswer: 'y=2x-1',
        maxPoints: 2,
        drawMode: 'line',
        hint: 'A tengelymetszet b=-1, tehát az y-tengelyen -1-nél kezdj. A meredekség m=2, tehát 1-t jobbra, 2-t fel.',
        successMessage: 'Szép munka! Az egyenes pontos.',
        onRegenerate: true
    },

    // --- 6. GYAKORLÁS: EGYENES ARÁNYOSSÁG ÁBRÁZOLÁSA ---
    {
        chapter: 'Lineáris függvények',
        id: 'linear-plot-direct',
        type: 'question',
        inputType: 'coordinate-plot',
        question: `**Egyenes arányosság**
        
        Ábrázold az $y = -x$ függvényt!
        
        Ne feledd, ez egyenes arányosság!`,
        targetLine: { m: -1, b: 0 },
        correctAnswer: 'y=-x',
        maxPoints: 2,
        drawMode: 'line',
        hint: 'Az egyenes arányosság mindig átmegy az origón (0;0)! A meredekség -1, tehát 1 jobbra, 1 le.',
        successMessage: 'Helyes! Átmegy az origón.',
        onRegenerate: true
    },

    // --- 7. GYAKORLÁS: TÖRTES MEREDEKSÉG ÁBRÁZOLÁSA ---
    {
        chapter: 'Lineáris függvények',
        id: 'linear-plot-fraction',
        type: 'question',
        inputType: 'coordinate-plot',
        question: `**Törtes meredekség**
        
        Ábrázold az $y = \\frac{1}{2}x + 2$ függvényt!`,
        targetLine: { m: 0.5, b: 2 },
        correctAnswer: 'y=0.5x+2',
        maxPoints: 2,
        drawMode: 'line',
        hint: 'Indulj a +2-ről (y-tengely). A törtes meredekség 1/2: 2 lépés jobbra, 1 lépés fel.',
        successMessage: 'Kiváló! Jól alkalmaztad a lépcsőzés módszerét.',
        onRegenerate: true
    },

    // --- FEJEZET KVÍZ ---
    {
        chapter: 'Lineáris függvények',
        id: 'quiz-linear-functions',
        type: 'quiz',
        title: 'Összefoglaló kvíz (opcionális)',
        description: 'Nem kötelező, de segít rögzíteni a tanultakat. Ellenőrizd, mennyire érted a lineáris függvényeket!',
        minScoreToPass: 2,
        questions: [
            {
                question: 'Mi az $y = mx + b$ képletben az "$m$"?',
                inputType: 'multiple-choice',
                options: ['Meredekség', 'Tengelymetszet', 'Zérushely'],
                correctAnswer: 'Meredekség',
                hint: 'Az egyenes "dőlésszöge".'
            },
            {
                question: 'Mi az $y = mx + b$ képletben a "$b$"?',
                inputType: 'multiple-choice',
                options: ['Meredekség', 'Tengelymetszet (hol metszi az y-tengelyt)', 'Zérushely'],
                correctAnswer: 'Tengelymetszet (hol metszi az y-tengelyt)',
                hint: 'Ha $x = 0$, mennyi lesz $y$?'
            },
            {
                question: 'Ha $m < 0$, az egyenes...',
                inputType: 'multiple-choice',
                options: ['Emelkedő (balról jobbra fel)', 'Süllyedő (balról jobbra le)', 'Vízszintes'],
                correctAnswer: 'Süllyedő (balról jobbra le)',
                hint: 'Negatív meredekség = csökkenő függvény.'
            },
            {
                question: 'Az egyenes arányosság ($y = mx$) mindig átmegy...',
                inputType: 'multiple-choice',
                options: ['Az origón (0;0)', 'A (0;1) ponton', 'Az (1;0) ponton'],
                correctAnswer: 'Az origón (0;0)',
                hint: 'Ha $b = 0$, akkor $y(0) = 0$.'
            }
        ]
    }
];
