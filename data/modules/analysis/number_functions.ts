import { CurriculumItem } from '../../../types';

export const numberFunctionsCurriculum: CurriculumItem[] = [
    // --- 3. SZÁMFÜGGVÉNYEK ---
    {
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
    }
];
