import { CurriculumItem } from '../../../types';

export const numberFunctionsCurriculum: CurriculumItem[] = [
    // --- 3. SZÁMFÜGGVÉNYEK ---
    {
        chapter: 'Valós függvények',
        id: 'num-func-intro',
        type: 'theory',
        title: '3. Valós számokon értelmezett függvények',
        content: `A zeneiskolás példa után térjünk át a matematikára! Itt a halmazok elemei **számok**.
        
        A hozzárendelési szabályt általában egy **képlettel** adjuk meg.
        
        **Jelölés:**
        $$f(x) = 2x + 1$$
        
        Ezt így olvassuk: *"Az f függvény az x-hez a 2x + 1 értéket rendeli."*
        
        **Precíz megadás:**
        A függvény meghatározásának tartalmaznia kell az értelmezési tartományt, a képhalmazt és a hozzárendelési szabályt:
        
        $$f : \\{ \\text{értelmezési tartomány} \\} \\to \\{ \\text{képhalmaz} \\}, x \\mapsto f(x)$$
        
        - $x$: A bemenet (a választott szám).
        - $f(x)$ vagy $y$: A kimenet (a kiszámolt érték).`
    },

    // --- MEGADÁSI MÓDOK ---
    {
        chapter: 'Valós függvények',
        id: 'num-func-repr',
        type: 'theory',
        title: 'Megadási módok',
        content: `Egy függvényt többféleképpen is megadhatunk:
        
        1. **Képlet:** $f(x) = 2x - 1$
        2. **Értéktáblázat:** Néhány pár kiszámolása táblázatban.
        3. **Grafikon:** Ábrázolás a koordinátarendszerben.
        
        *Példa behelyettesítésre:*
        $$f(0) = 2 \\cdot 0 - 1 = -1$$
           
        **Értelmezés:** Ez azt jelenti, hogy a függvény az $x=0$-hoz az $y=-1$ értéket rendeli.
        Pontként leírva: $(0; -1)$.
        
        Nézzük meg, hogyan készítsünk **értéktáblázatot**!`
    },

    // --- ÉRTÉKTÁBLÁZAT GYAKORLÁS 1 ---
    {
        chapter: 'Valós függvények',
        id: 'value-table-1',
        type: 'question',
        inputType: 'key-value',
        question: `**Készítsünk értéktáblázatot!**
        
        A függvényünk: $f(x) = 2x - 3$
        
        Számold ki a függvényértékeket a megadott $x$ helyeken!
        Ne feledd: csak be kell helyettesíteni az $x$-et a képletbe.`,
        inputLabels: [
            '$f(0) =$',
            '$f(2) =$',
            '$f(5) =$'
        ],
        correctAnswer: ['-3', '1', '7'],
        hint: 'Helyettesíts be:\n$2 \\cdot 0 - 3 = ?$\n$2 \\cdot 2 - 3 = ?$\n$2 \\cdot 5 - 3 = ?$',
        successMessage: 'Szuper! Ez az értéktáblázat alapja.'
    },

    // --- ÉRTÉKTÁBLÁZAT GYAKORLÁS 2 (NEGATÍVOKKAL) ---
    {
        chapter: 'Valós függvények',
        id: 'value-table-2',
        type: 'question',
        inputType: 'key-value',
        question: `**Figyelj az előjelekre!**
        
        A függvényünk: $f(x) = -x + 2$
        
        Számold ki az értékeket! Vigyázz a negatív előjellel!`,
        inputLabels: [
            '$f(1) =$',
            '$f(-2) =$',
            '$f(0) =$'
        ],
        correctAnswer: ['1', '4', '2'],
        hint: 'Ha $x = -2$, akkor $-(-2) + 2 = +2 + 2 = 4$.',
        successMessage: 'Remek! Jól bánsz az előjelekkel.'
    },

    // --- ÁBRÁZOLÁSI ÁTMENET ---
    {
        chapter: 'Valós függvények',
        id: 'table-to-graph-intro',
        type: 'theory',
        title: 'Táblázatból Grafikon',
        content: `Mire jó az értéktáblázat?
        
        A táblázatban kapott párok valójában **pontok** a koordinátarendszerben!
        
        $x = 1, y = 1 \\Rightarrow P(1; 1)$ pont.
        $x = -2, y = 4 \\Rightarrow Q(-2; 4)$ pont.
        
        Ha ezeket a pontokat ábrázoljuk, megkapjuk a függvény grafikonját (képét).`
    },

    // --- ÉRTÉKTÁBLÁZAT ÉS ÁBRÁZOLÁS: f(x) = x - 2 ---
    {
        chapter: 'Valós függvények',
        id: 'value-table-3',
        type: 'question',
        inputType: 'key-value',
        question: `**Most rajtad a sor!**
        
        Töltsd ki az értéktáblázatot a következő függvényre:
        $$f(x) = x - 2$$
        
        A kapott pontokat jegyezd meg (vagy írd le), mert a következő lépésben ábrázolnod kell majd őket!`,
        inputLabels: [
            '$f(-2) =$',
            '$f(-1) =$',
            '$f(0) =$',
            '$f(1) =$',
            '$f(2) =$'
        ],
        correctAnswer: ['-4', '-3', '-2', '-1', '0'],
        hint: 'Csak vonj ki minden számból 2-t!',
        successMessage: 'Helyes! Most pedig ábrázoljuk ezeket a pontokat.'
    },
    {
        chapter: 'Valós függvények',
        id: 'plot-points-1',
        type: 'question',
        inputType: 'coordinate-plot',
        question: `**Ábrázold a pontokat!**
        
        Jelöld be az előző feladatban kapott pontokat a koordinátarendszerben!
        $$f(x) = x - 2$$
        
        Pontok: $(-2; -4), (-1; -3), (0; -2), (1; -1), (2; 0)$`,
        targetCoordinates: [
            { x: -2, y: -4 },
            { x: -1, y: -3 },
            { x: 0, y: -2 },
            { x: 1, y: -1 },
            { x: 2, y: 0 }
        ],
        correctAnswer: 'plot', // Not used for coordinate-plot but required by type
        maxPoints: 5,
        hint: 'Keresd meg a párokat: pl. x=-2 és y=-4 metszéspontját.',
        successMessage: 'Szép munka! Látod? A pontok egy egyenesre illeszkednek.'
    },

    // --- FEJEZET KVÍZ ---
    {
        chapter: 'Valós függvények',
        id: 'quiz-number-functions',
        type: 'quiz',
        title: 'Összefoglaló kvíz (opcionális)',
        description: 'Nem kötelező, de segít rögzíteni a tanultakat. Ellenőrizd, mennyire érted a képletes függvényeket!',
        minScoreToPass: 2,
        questions: [
            {
                question: 'Mit jelent az $f(3)$ jelölés?',
                inputType: 'multiple-choice',
                options: ['A függvény értéke, ha $x = 3$', 'A függvény 3-szorosa', 'A függvény 3. pontja'],
                correctAnswer: 'A függvény értéke, ha $x = 3$',
                hint: 'Olvasd így: "f hármon".'
            },
            {
                question: 'Ha $f(x) = 2x + 1$, mennyi $f(0)$?',
                inputType: 'multiple-choice',
                options: ['1', '0', '2'],
                correctAnswer: '1',
                hint: 'Helyettesíts: $2 \\cdot 0 + 1 = ?$'
            },
            {
                question: 'Az értéktáblázatban mit tartalmaz egy sor?',
                inputType: 'multiple-choice',
                options: ['Egy $(x; y)$ párt', 'Csak $x$ értékeket', 'A képletet'],
                correctAnswer: 'Egy $(x; y)$ párt',
                hint: 'Minden sor egy pont a grafikonon.'
            },
            {
                question: 'Ha $f(x) = 3x - 5$, mennyi $f(2)$?',
                inputType: 'numeric',
                inputPrefix: '$f(2) =$',
                correctAnswer: '1',
                hint: '$3 \\cdot 2 - 5 = 6 - 5 = ?$'
            }
        ]
    }
];
