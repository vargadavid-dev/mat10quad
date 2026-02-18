
export type KnowledgeType = 'definition' | 'theorem' | 'formula';

export interface KnowledgeItem {
    id: string;
    type: KnowledgeType;
    title: string;
    category: 'algebra' | 'geometry' | 'analysis' | 'number_theory' | 'probability' | 'statistics';
    content: string; // Core definition or theorem statement
    description?: string; // Additional explanation
    notation?: string; // Mathematical notation
    proof?: string; // For theorems (Markdown)
    example?: string; // Concrete example
    related?: string[]; // IDs of related items
    tags: string[];
}

export const knowledgeBase: KnowledgeItem[] = [
    // --- Algebra ---
    {
        id: 'def-quadratic',
        type: 'definition',
        title: 'Másodfokú egyenlet',
        category: 'algebra',
        content: 'Olyan egyenlet, amely $ax^2 + bx + c = 0$ alakra hozható, ahol $a \\neq 0$.',
        description: 'A másodfokú egyenlet grafikonja egy parabola. A megoldások száma a diszkriminánstól függ.',
        notation: '$a, b, c \\in \\mathbb{R}, a \\neq 0$',
        example: 'Példa: $2x^2 - 4x - 6 = 0$. Itt $a=2, b=-4, c=-6$.',
        tags: ['egyenlet', 'polinom', 'másodfokú']
    },
    {
        id: 'thm-quadratic-formula',
        type: 'formula',
        title: 'Megoldóképlet (Másodfokú)',
        category: 'algebra',
        content: '$x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$',
        description: 'Ezzel a képlettel bármilyen valós együtthatós másodfokú egyenlet megoldható.',
        related: ['def-quadratic', 'def-discriminant'],
        tags: ['képlet', 'gyökképlet', 'másodfokú']
    },
    {
        id: 'thm-vieta',
        type: 'theorem',
        title: 'Viète-formulák',
        category: 'algebra',
        content: 'Ha a másodfokú egyenlet gyökei $x_1$ és $x_2$, akkor:\n\n1. $x_1 + x_2 = -\\frac{b}{a}$\n2. $x_1 \\cdot x_2 = \\frac{c}{a}$',
        proof: 'A gyöktényezős alakból kiindulva: $a(x-x_1)(x-x_2) = 0$. Ezt kibontva: $a(x^2 - x_1 x - x_2 x + x_1 x_2) = ax^2 - a(x_1+x_2)x + a(x_1 x_2)$. Ezt összevetve az $ax^2 + bx + c = 0$ egyenlettel, adódik: $b = -a(x_1+x_2)$ és $c = a(x_1 x_2)$.',
        example: 'Ha $x^2 - 5x + 6 = 0$, akkor $x_1+x_2=5$ és $x_1 x_2=6$. A gyökök 2 és 3.',
        tags: ['gyökök', 'összefüggés', 'viete']
    },
    {
        id: 'def-discriminant',
        type: 'definition',
        title: 'Diszkrimináns',
        category: 'algebra',
        content: '$D = b^2 - 4ac$',
        description: 'A diszkrimináns előjele meghatározza a valós gyökök számát:\n- Ha $D > 0$, két különböző valós gyök van.\n- Ha $D = 0$, egy valós gyök van (kétszeres).\n- Ha $D < 0$, nincs valós gyök.',
        related: ['def-quadratic'],
        tags: ['diszkrimináns', 'gyökök száma']
    },
    // ... (rest of the content updates would follow similar pattern)
    {
        id: 'form-identities-1',
        type: 'formula',
        title: 'Nevezetes azonosságok (Négyzet)',
        category: 'algebra',
        content: '1. $(a+b)^2 = a^2 + 2ab + b^2$\n2. $(a-b)^2 = a^2 - 2ab + b^2$\n3. $(a+b)(a-b) = a^2 - b^2$',
        tags: ['azonosság', 'kiemelés', 'szorzattá alakítás']
    },
    {
        id: 'form-identities-2',
        type: 'formula',
        title: 'Nevezetes azonosságok (Köb)',
        category: 'algebra',
        content: '1. $(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$\n2. $(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$\n3. $a^3 + b^3 = (a+b)(a^2 - ab + b^2)$\n4. $a^3 - b^3 = (a-b)(a^2 + ab + b^2)$',
        tags: ['azonosság', 'köb']
    },

    // --- Number Theory ---
    {
        id: 'def-prime',
        type: 'definition',
        title: 'Prímszám',
        category: 'number_theory',
        content: 'Olyan 1-nél nagyobb természetes szám, amelynek pontosan két osztója van: 1 és önmaga.',
        tags: ['prím', 'számelmélet']
    },
    {
        id: 'thm-fund-arithmetic',
        type: 'theorem',
        title: 'Számelmélet alaptétele',
        category: 'number_theory',
        content: 'Minden 1-nél nagyobb összetett szám egyértelműen felbontható prímszámok szorzatára (a tényezők sorrendjétől eltekintve).',
        tags: ['prímtényezős', 'felbontás']
    },
    {
        id: 'form-divisibility-3',
        type: 'formula',
        title: 'Oszthatóság 3-mal és 9-cel',
        category: 'number_theory',
        content: 'Egy szám akkor és csak akkor osztható 3-mal (illetve 9-cel), ha a számjegyeinek összege osztható 3-mal (illetve 9-cel).',
        tags: ['oszthatóság', 'szabály']
    },

    // --- Geometry --- 
    {
        id: 'thm-pythagoras',
        type: 'theorem',
        title: 'Pitagorasz-tétel',
        category: 'geometry',
        content: 'Bármely derékszögű háromszögben a befogók négyzetösszege egyenlő az átfogó négyzetével: $a^2 + b^2 = c^2$.',
        proof: 'Számos bizonyítás létezik. Egyik legismertebb a területi átrendezés, ahol egy $(a+b)$ oldalú négyzet területét kétféleképpen írjuk fel: $(a+b)^2 = 4 \\cdot \\frac{ab}{2} + c^2$, amiből $a^2 + 2ab + b^2 = 2ab + c^2$, tehát $a^2 + b^2 = c^2$.',
        tags: ['háromszög', 'derékszög', 'pitagorasz']
    },
    {
        id: 'thm-thales',
        type: 'theorem',
        title: 'Thalész-tétel',
        category: 'geometry',
        content: 'Ha egy kör átmérőjének két végpontját összekötjük a körív bármely más pontjával, akkor derékszögű háromszöget kapunk.',
        proof: 'A köré írt háromszög tulajdonságaiból következik. A kör középpontjából a csúcsokhoz húzott sugarak egyenlő szárú háromszögeket alkotnak, melyek szögeinek összege kiadja a derékszöget.',
        tags: ['kör', 'derékszög', 'thalész']
    },
    {
        id: 'form-area-circle',
        type: 'formula',
        title: 'Kör területe és kerülete',
        category: 'geometry',
        content: 'Terület: $T = r^2 \\pi$\nKerület: $K = 2r \\pi$',
        tags: ['kör', 'terület', 'kerület']
    },
    {
        id: 'form-triangle-area',
        type: 'formula',
        title: 'Háromszög területe',
        category: 'geometry',
        content: '1. Alap és magasság: $T = \\frac{a \\cdot m_a}{2}$\n2. Két oldal és közbezárt szög: $T = \\frac{ab \\sin \\gamma}{2}$\n3. Hérón-képlet: $T = \\sqrt{s(s-a)(s-b)(s-c)}$, ahol $s = \\frac{a+b+c}{2}$',
        tags: ['háromszög', 'terület']
    },

    // --- Analysis (Functions) ---
    {
        id: 'def-function',
        type: 'definition',
        title: 'Függvény',
        category: 'analysis',
        content: 'Egyértelmű hozzárendelés két halmaz ($A$ és $B$) elemei között. Minden $x \\in A$ (értelmezési tartomány) elemhez pontosan egy $y \\in B$ (értékkészlet) elemet rendelünk.',
        tags: ['függvény', 'hozzárendelés']
    },
    {
        id: 'def-monotonicity',
        type: 'definition',
        title: 'Monotonitás',
        category: 'analysis',
        content: '- **Szigorúan monoton növekvő**: Ha $x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$.\n- **Szigorúan monoton csökkenő**: Ha $x_1 < x_2 \\Rightarrow f(x_1) > f(x_2)$.',
        tags: ['függvény', 'növekvő', 'csökkenő']
    },
    {
        id: 'def-parity',
        type: 'definition',
        title: 'Paritás (Páros/Páratlan)',
        category: 'analysis',
        content: '- **Páros függvény**: $f(-x) = f(x)$. A grafikonja tengelyesen szimmetrikus az $y$ tengelyre.\n- **Páratlan függvény**: $f(-x) = -f(x)$. A grafikonja középpontosan szimmetrikus az origóra.',
        tags: ['függvény', 'szimmetria']
    },
    {
        id: 'form-logy',
        type: 'formula',
        title: 'Logaritmus azonosságok',
        category: 'analysis',
        content: '1. $\\log_a(xy) = \\log_a x + \\log_a y$\n2. $\\log_a(\\frac{x}{y}) = \\log_a x - \\log_a y$\n3. $\\log_a(x^k) = k \\log_a x$',
        tags: ['logaritmus', 'azonosság']
    },

    // ============================
    // KÖR - Bővített tartalom
    // ============================
    {
        id: 'def-circle',
        type: 'definition',
        title: 'Kör',
        category: 'geometry',
        content: 'Azon pontok halmaza a síkban, amelyek egy adott ponttól (középpont) adott távolságra ($r$, sugár) vannak.',
        notation: '$O$ = középpont, $r$ = sugár',
        description: 'A kör a síkgeometria egyik alapfogalma. A középponttól mért távolság mindig egyenlő a sugárral.',
        tags: ['kör', 'definíció', 'alapfogalom']
    },
    {
        id: 'def-chord',
        type: 'definition',
        title: 'Húr',
        category: 'geometry',
        content: 'A kör két pontját összekötő szakasz. A középponton átmenő húr az **átmérő** ($d = 2r$).',
        description: 'A húr a kör belsejében húzódó egyenes szakasz. A leghosszabb húr mindig az átmérő.',
        example: 'Ha $r = 5$ cm, akkor az átmérő $d = 10$ cm.',
        tags: ['kör', 'húr', 'átmérő']
    },
    {
        id: 'def-tangent',
        type: 'definition',
        title: 'Érintő',
        category: 'geometry',
        content: 'Olyan egyenes, amely a kört pontosan egy pontban érinti (nem metszi).',
        description: 'Az érintési pontban az érintő mindig merőleges a sugárra.',
        tags: ['kör', 'érintő']
    },
    {
        id: 'def-secant',
        type: 'definition',
        title: 'Szelő',
        category: 'geometry',
        content: 'Olyan egyenes, amely a kört két pontban metszi.',
        description: 'A szelő a kör belsejében egy húrt határoz meg.',
        tags: ['kör', 'szelő']
    },
    {
        id: 'def-central-angle',
        type: 'definition',
        title: 'Központi szög',
        category: 'geometry',
        content: 'Olyan szög, amelynek csúcsa a kör középpontjában van, szárai pedig sugarak.',
        description: 'A központi szög egyenesen arányos a hozzá tartozó ív hosszával.',
        tags: ['kör', 'szög', 'központi']
    },
    {
        id: 'def-inscribed-angle',
        type: 'definition',
        title: 'Kerületi szög',
        category: 'geometry',
        content: 'Olyan szög, amelynek csúcsa a kör kerületén van, szárai pedig húrok.',
        description: 'Ugyanazon ívhez tartozó kerületi szög mindig fele a központi szögnek.',
        tags: ['kör', 'szög', 'kerületi']
    },
    {
        id: 'thm-inscribed-angle',
        type: 'theorem',
        title: 'Kerületi szög tétel',
        category: 'geometry',
        content: 'Ugyanazon ívhez tartozó kerületi szög az ívhez tartozó központi szög fele.',
        description: '<InteractiveComponent type="CircleAngleVisualizer" />',
        proof: 'Ha az $\\alpha$ központi szöghöz tartozó kerületi szög $\\beta$, akkor $\\beta = \\frac{\\alpha}{2}$. Ez a középpontból húzott sugarak által alkotott egyenlő szárú háromszögek szögeinek vizsgálatával bizonyítható.',
        tags: ['kör', 'tétel', 'kerületi szög']
    },
    {
        id: 'thm-tangent-perpendicular',
        type: 'theorem',
        title: 'Érintő merőlegessége',
        category: 'geometry',
        content: 'Az érintő az érintési pontban merőleges a sugárra.',
        proof: 'Indirekt bizonyítás: ha az érintő nem lenne merőleges a sugárra, akkor a középpontból az egyenesre bocsátott merőleges rövidebb lenne a sugárnál, tehát az egyenes két pontban metszené a kört, ami ellentmondás.',
        tags: ['kör', 'érintő', 'merőleges']
    },
    {
        id: 'def-sector',
        type: 'definition',
        title: 'Körcikk (szelet)',
        category: 'geometry',
        content: 'A kör két sugara és a köztük lévő ív által határolt terület.',
        description: 'Olyan mint egy „pizzaszelet" — két sugár és az ív zárja közre.',
        example: 'Egy $90°$-os körcikk a teljes kör negyede.',
        tags: ['kör', 'körcikk', 'terület']
    },
    {
        id: 'def-segment',
        type: 'definition',
        title: 'Körszelet',
        category: 'geometry',
        content: 'Egy húr és a hozzá tartozó ív által határolt terület.',
        description: 'A körszelet „levágott rész" — a húr felett vagy alatt lévő íves terület.',
        tags: ['kör', 'körszelet']
    },
    {
        id: 'form-arc-length',
        type: 'formula',
        title: 'Ívhossz',
        category: 'geometry',
        content: '$\\ell = \\frac{\\alpha}{360°} \\cdot 2r\\pi$',
        description: 'Az $\\alpha$ fokos központi szöghöz tartozó ív hossza. Ha $\\alpha = 360°$, megkapjuk a teljes kerületet.',
        example: 'Ha $r = 10$ cm és $\\alpha = 90°$, akkor $\\ell = \\frac{90}{360} \\cdot 20\\pi = 5\\pi \\approx 15{,}7$ cm.',
        tags: ['kör', 'ívhossz', 'képlet']
    },
    {
        id: 'form-sector-area',
        type: 'formula',
        title: 'Körcikk területe',
        category: 'geometry',
        content: '$T_{\\text{körcikk}} = \\frac{\\alpha}{360°} \\cdot r^2 \\pi$',
        description: 'Az $\\alpha$ fokos központi szöghöz tartozó körcikk területe. A teljes kör területének arányos része.',
        tags: ['kör', 'körcikk', 'terület', 'képlet']
    },
    {
        id: 'form-segment-area',
        type: 'formula',
        title: 'Körszelet területe',
        category: 'geometry',
        content: '$T_{\\text{körszelet}} = T_{\\text{körcikk}} - T_{\\text{háromszög}} = \\frac{r^2}{2}(\\frac{\\alpha \\pi}{180°} - \\sin \\alpha)$',
        description: 'A körcikk területéből kivonjuk a két sugár és a húr által alkotott háromszög területét.',
        tags: ['kör', 'körszelet', 'terület', 'képlet']
    },

    // ============================
    // FÜGGVÉNYEK - Bővített tartalom
    // ============================
    {
        id: 'def-domain',
        type: 'definition',
        title: 'Értelmezési tartomány',
        category: 'analysis',
        content: 'Azon $x$ értékek halmaza, amelyekre a függvény értelmezve van (be lehet helyettesíteni).',
        notation: '$D_f$ vagy $\\text{dom}(f)$',
        description: 'A függvény „inputjainak" halmaza. Meg kell vizsgálni, hol nem értelmezett (pl. nullával osztás, negatív szám a gyök alatt).',
        example: 'Az $f(x) = \\frac{1}{x}$ függvénynél $D_f = \\mathbb{R} \\setminus \\{0\\}$.',
        tags: ['függvény', 'értelmezési tartomány']
    },
    {
        id: 'def-range',
        type: 'definition',
        title: 'Értékkészlet',
        category: 'analysis',
        content: 'Azon $y$ értékek halmaza, amelyeket a függvény ténylegesen felvesz.',
        notation: '$R_f$ vagy $\\text{ran}(f)$',
        description: 'A függvény „outputjainak" halmaza. Nem feltétlenül egyezik meg a képhalmazzal.',
        example: 'Az $f(x) = x^2$ függvénynél $R_f = [0, +\\infty)$, mert a négyzet soha nem negatív.',
        tags: ['függvény', 'értékkészlet']
    },
    {
        id: 'def-zero',
        type: 'definition',
        title: 'Zérushely (gyök)',
        category: 'analysis',
        content: 'Az $x_0$ érték, amelyre $f(x_0) = 0$. A függvény grafikonja itt metszi az $x$ tengelyt.',
        description: 'A zérushelyek a függvény azon pontjai, ahol a függvény értéke nulla.',
        example: 'Az $f(x) = 2x - 6$ függvény zérushelye $x_0 = 3$, mert $f(3) = 0$.',
        tags: ['függvény', 'zérushely', 'gyök']
    },
    {
        id: 'def-linear-function',
        type: 'definition',
        title: 'Lineáris függvény',
        category: 'analysis',
        content: '$f(x) = mx + b$ alakú függvény, amelynek grafikonja egy egyenes.',
        description: 'Az $m$ a meredekség (iránytangenes): megmutatja, mennyit változik $y$, ha $x$ egyet nő. A $b$ az $y$-tengellyel való metszéspont.',
        example: 'Az $f(x) = 3x - 2$ egy lineáris függvény, ahol $m = 3$ és $b = -2$.',
        tags: ['függvény', 'lineáris', 'egyenes']
    },
    {
        id: 'def-slope',
        type: 'definition',
        title: 'Meredekség (iránytangenes)',
        category: 'analysis',
        content: 'Két pont ismeretében: $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x}$.',
        description: 'Pozitív $m$: emelkedő egyenes. Negatív $m$: csökkenő egyenes. $m = 0$: vízszintes egyenes.',
        example: 'Ha $A(1, 2)$ és $B(3, 8)$, akkor $m = \\frac{8-2}{3-1} = 3$.',
        tags: ['meredekség', 'iránytangenes', 'egyenes']
    },
    {
        id: 'def-extremum',
        type: 'definition',
        title: 'Szélsőérték (minimum, maximum)',
        category: 'analysis',
        content: '- **Lokális maximum**: $f(x_0) \\geq f(x)$ egy környezetben.\n- **Lokális minimum**: $f(x_0) \\leq f(x)$ egy környezetben.',
        description: 'Szélsőértékhelyen a függvény „irányt vált" — növekvőből csökkenőbe vagy fordítva.',
        tags: ['függvény', 'szélsőérték', 'maximum', 'minimum']
    },
    {
        id: 'def-bounded',
        type: 'definition',
        title: 'Korlátosság',
        category: 'analysis',
        content: 'Egy függvény **korlátos**, ha van olyan $K$ szám, amelyre $|f(x)| \\leq K$ minden $x \\in D_f$ esetén.',
        description: 'Felülről korlátos: van felső korlátja. Alulról korlátos: van alsó korlátja. Korlátos: mindkettő teljesül.',
        example: 'A $\\sin(x)$ korlátos, mert $-1 \\leq \\sin(x) \\leq 1$.',
        tags: ['függvény', 'korlátosság']
    },
    {
        id: 'form-line-equation',
        type: 'formula',
        title: 'Egyenes egyenlete',
        category: 'analysis',
        content: '1. Iránytényezős alak: $y = mx + b$\n2. Egy ponton átmenő: $y - y_1 = m(x - x_1)$\n3. Két ponton átmenő: $\\frac{y - y_1}{y_2 - y_1} = \\frac{x - x_1}{x_2 - x_1}$',
        tags: ['egyenes', 'egyenlet', 'képlet']
    },
    {
        id: 'def-direct-proportion',
        type: 'definition',
        title: 'Egyenes arányosság',
        category: 'analysis',
        content: 'Az $f(x) = mx$ alakú függvény ($b = 0$). Grafikonja az origón átmenő egyenes.',
        description: 'Egyenes arányosságnál az arányok megmaradnak: ha az $x$ kétszeresére nő, az $y$ is kétszeresére nő.',
        example: 'Ha $f(x) = 2x$, akkor $f(1) = 2$, $f(2) = 4$, $f(3) = 6$ — mindig dupla.',
        tags: ['függvény', 'arányosság', 'lineáris']
    },
    {
        id: 'def-value-table',
        type: 'definition',
        title: 'Értéktáblázat',
        category: 'analysis',
        content: 'Táblázat, amely $x$ értékekhez hozzárendeli a megfelelő $f(x)$ értékeket. Az ábrázolás alapja.',
        description: 'Az értéktáblázat segít a függvény grafikonjának megrajzolásában: kiszámoljuk néhány pont koordinátáit, majd összekötjük őket.',
        tags: ['függvény', 'értéktáblázat', 'grafikon']
    },
    {
        id: 'def-graph',
        type: 'definition',
        title: 'Függvény grafikonja',
        category: 'analysis',
        content: 'Azon $(x, f(x))$ pontok halmaza a koordináta-rendszerben, amelyek kielégítik a függvény képletét.',
        description: 'A grafikon a függvény vizuális megjelenítése. Minden $x$ értékhez pontosan egy pont tartozik a grafikonon.',
        tags: ['függvény', 'grafikon', 'koordináta-rendszer']
    },
    {
        id: 'def-coordinate-system',
        type: 'definition',
        title: 'Derékszögű koordináta-rendszer',
        category: 'analysis',
        content: 'Két merőleges számegyenes (tengelyek) által meghatározott rendszer, amelyben minden pont egyértelműen megadható egy $(x, y)$ koordinátapárral.',
        notation: 'Vízszintes: $x$-tengely. Függőleges: $y$-tengely. Metszéspont: origó $O(0,0)$.',
        description: 'A síkot négy negyedre osztja. Az I. negyedben $x > 0, y > 0$; a II.-ban $x < 0, y > 0$; stb.',
        tags: ['koordináta-rendszer', 'tengely', 'origó']
    }
];
