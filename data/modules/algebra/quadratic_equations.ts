import { CurriculumItem } from '../../../types';

export const quadraticCurriculum: CurriculumItem[] = [
  // --- 1. MÁSODFOKÚ EGYENLETEK ---
  {
    id: 'intro-theory',
    type: 'theory',
    title: '1. Másodfokú egyenletek alapjai',
    content: `Üdvözöllek! Kezdjük az alapokkal. Egy másodfokú egyenlet általános alakja:
    $$ax^2 + bx + c = 0$$
    ahol $a \\neq 0$. A megoldóképlet segítségével bármilyen valós együtthatós másodfokú egyenletet meg tudunk oldani:
    $$x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
    A gyök alatti kifejezést, a $b^2 - 4ac$-t **diszkriminánsnak** ($D$) nevezzük. Ez határozza meg a megoldások számát.`
  },
  {
    id: 'discrim-q',
    type: 'question',
    inputType: 'matching',
    question: `Párosítsd a diszkrimináns értékét ($D$) a valós megoldások számával!`,
    matchPairs: [
      { left: '$D > 0$', right: '2 különböző valós gyök' },
      { left: '$D = 0$', right: '1 valós gyök (két egybeeső)' },
      { left: '$D < 0$', right: 'Nincs valós megoldás' }
    ],
    correctAnswer: 'implied',
    hint: 'Gondolj a gyökvonásra! Pozitívból két gyök van (+ és -), nullából csak nulla, negatívból pedig...',
    successMessage: 'Pontosan! A diszkrimináns előjele dönti el a megoldások számát.'
  },
  // LÉPÉSEKRE BONTOTT FELADAT START
  {
    id: 'calc-steps-intro',
    type: 'theory',
    title: 'Gyakorlás lépésről lépésre',
    content: `Most oldjuk meg közösen a következő egyenletet: $$x^2 - 5x + 6 = 0$$
    Haladjunk lépésről lépésre, hogy biztosan ne rontsuk el!`
  },
  {
    id: 'step1-coeffs',
    type: 'question',
    inputType: 'coefficients',
    question: `1. lépés: Olvasd le az együtthatókat ($a, b, c$)! Figyelj az előjelekre!`,
    correctAnswer: ['1', '-5', '6'],
    hint: 'Az $x^2$ előtt álló szám az "a" (ha nincs ott semmi, akkor 1). Az $x$ előtti a "b", a magában álló szám a "c".',
    successMessage: 'Szuper! Az együtthatók: a=1, b=-5, c=6.'
  },
  {
    id: 'step2-discrim',
    type: 'question',
    inputType: 'numeric',
    question: `2. lépés: Számítsd ki a diszkriminánst! $$D = b^2 - 4ac$$`,
    inputPrefix: '$D =$',
    correctAnswer: '1',
    hint: 'Helyettesíts be: $(-5)^2 - 4 \\cdot 1 \\cdot 6$. Figyelj, hogy $(-5)^2$ az +25!',
    successMessage: 'Helyes! $D = 25 - 24 = 1$. Mivel pozitív, két megoldásunk lesz.'
  },
  {
    id: 'step3-roots',
    type: 'question',
    inputType: 'roots-set',
    question: `3. lépés: Számítsd ki a gyököket a megoldóképlettel! $$x_{1,2} = \\frac{-(-5) \\pm \\sqrt{1}}{2 \\cdot 1}$$`,
    correctAnswer: ['2', '3'],
    hint: 'A számlálóban $-(-5)$ az $+5$. $\\sqrt{1}$ az $1$. Tehát $\\frac{5 \\pm 1}{2}$.',
    successMessage: 'Kiváló! Megkaptuk a megoldásokat: 2 és 3.'
  },

  // --- 2. MÁSODFOKÚ EGYENLŐTLENSÉGEK ---
  {
    id: 'inequality-theory',
    type: 'theory',
    title: '2. Másodfokú egyenlőtlenségek',
    content: `Másodfokú egyenlőtlenségeknél a kifejezés előjelét vizsgáljuk. A relációs jel lehet:
- $ > $ (nagyobb, mint 0)
- $ < $ (kisebb, mint 0)
- $ \\ge $ (nagyobb vagy egyenlő, mint 0)
- $ \\le $ (kisebb vagy egyenlő, mint 0)

A grafikus megoldás lépései:
1. **Zérushelyek meghatározása:** Megoldjuk az $ax^2 + bx + c = 0$ egyenletet.
2. **Parabola állása:** Megnézzük az $x^2$ együtthatóját ($a$).
   - Ha $a > 0$: a parabola **felfelé** nyílik (mosolyog).
   - Ha $a < 0$: a parabola **lefelé** nyílik (szomorú).
3. **Leolvasás:**
   - Ha $>0$ vagy $\\ge 0$ a kérdés: a tengely **feletti** részt keressük.
   - Ha $<0$ vagy $\\le 0$ a kérdés: a tengely **alatti** részt keressük.
   - Ha megengedett az egyenlőség ($\\ge$ vagy $\\le$), akkor a zérushelyek is beletartoznak (zárt intervallum: $[x_1, x_2]$).`
  },
  {
    id: 'ineq-orientation',
    type: 'question',
    inputType: 'multiple-choice',
    question: `**Döntsük el a parabola állását!**
    
    Adott a következő függvény: $y = -2x^2 + 4x - 6$.
    Merre nyílik a parabola?`,
    options: ['Felfelé (mosolyog)', 'Lefelé (szomorú)'],
    correctAnswer: 'Lefelé (szomorú)',
    hint: 'Nézd meg az $x^2$ együtthatóját ($a = -2$). Ha ez negatív, akkor a parabola lefelé nyílik.',
    successMessage: 'Helyes! Mivel $a = -2$ (negatív), ezért lefelé nyílik.'
  },
  {
    id: 'ineq-graph-select',
    type: 'question',
    inputType: 'matching',
    question: `**Grafikus megoldás 1. lépés: Elemzés**
    
    Oldjuk meg a $x^2 - x - 2 \\le 0$ egyenlőtlenséget!
    
    Lent láthatod a függvény vázlatát. Párosítsd a jellemzőket a konkrét értékekkel!`,
    illustration: `<svg viewBox="-2.5 -3.5 6 9" class="w-full h-auto mx-auto border bg-white rounded-lg" style="max-width:300px">
      <!-- Grid -->
      <defs>
        <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
          <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#e2e8f0" stroke-width="0.05"/>
        </pattern>
      </defs>
      <rect x="-2.5" y="-3.5" width="6" height="9" fill="url(#grid)" />
      
      <!-- Axis -->
      <!-- X Axis -->
      <line x1="-2.5" y1="0" x2="3.5" y2="0" stroke="#64748b" stroke-width="0.08" />
      <!-- Y Axis -->
      <line x1="0" y1="-3.5" x2="0" y2="5.5" stroke="#64748b" stroke-width="0.08" />
      
      <!-- Parabola: y = x^2 - x - 2 -->
      <!-- Adjusted to open UP (U-shape). Math Y inverted to SVG Y. -->
      <!-- Vertex (math): (0.5, -2.25) -> SVG: (0.5, 2.25) -->
      <!-- Path starts at x=-1.8 (math y=3.04 -> SVG y=-3.04) -->
      <path d="M -1.8 -3.04 Q 0.5 7.54 2.8 -3.04" fill="none" stroke="#4f46e5" stroke-width="0.1" />
      
      <!-- Roots markers -->
      <circle cx="-1" cy="0" r="0.15" fill="#ef4444" />
      <circle cx="2" cy="0" r="0.15" fill="#ef4444" />
      
      <!-- Labels -->
      <text x="-1.3" y="0.6" font-size="0.5" fill="#ef4444" font-weight="bold">-1</text>
      <text x="2.1" y="0.6" font-size="0.5" fill="#ef4444" font-weight="bold">2</text>
      <text x="0.5" y="3.0" font-size="0.5" fill="#4f46e5" text-anchor="middle">Min</text>
    </svg>`,
    matchPairs: [
      { left: 'Parabola állása ($a=1$)', right: 'Felfelé nyílik' },
      { left: 'Zérushelyek', right: '$x_1=-1, x_2=2$' },
      { left: 'Keresett tartomány ($\\le 0$)', right: 'Tengely alatti rész' }
    ],
    correctAnswer: 'implied',
    hint: 'Az "a" pozitív, tehát mosolyog. A gyököket megadtuk (piros pöttyök). A "kisebb" jel jelenti az "alatt"-ot.',
    successMessage: 'Így van! Összeállt a kép a grafikus megoldáshoz.'
  },
  {
    id: 'ineq-solve-interval',
    type: 'question',
    inputType: 'multiple-choice',
    question: `**Grafikus megoldás 2. lépés: Intervallum leolvasása**
    
    Az előző feladat alapján ($x^2 - x - 2 \\le 0$):
    - Parabola: Felfelé nyílik
    - Zérushelyek: -1 és 2
    - Keresett rész: Tengely alatti
    
    Mi a megoldás intervalluma?`,
    options: [
      '$x \\le -1$ vagy $x \\ge 2$ (szélső tartományok)',
      '$-1 \\le x \\le 2$ (a két gyök között)',
      '$-1 < x < 2$ (a két gyök között, határok nélkül)'
    ],
    correctAnswer: '$-1 \\le x \\le 2$ (a két gyök között)',
    hint: 'Mivel a parabola "hasas" része van a tengely alatt, ez a két gyök közötti rész. A $\\le$ jel miatt a határok is beletartoznak (zárt).',
    successMessage: 'Tökéletes! Ez a zárt intervallum a megoldás.'
  },

  // --- 3. NÉGYZETGYÖKÖS EGYENLETEK ---
  {
    id: 'radical-theory',
    type: 'theory',
    title: '3. Négyzetgyökös egyenletek',
    content: `Olyan egyenletek, ahol az ismeretlen a gyökjel alatt szerepel. Példa: $\\sqrt{x+2} = 3$.
    
    **Fontos lépések:**
    1. **Értelmezési tartomány (ÉT):** A gyök alatt csak nemnegatív szám állhat ($x+2 \\ge 0$).
    2. **Négyzetre emelés:** Eltüntetjük a gyökjelet.
    3. **Ellenőrzés:** KÖTELEZŐ! A négyzetre emelés "hamis gyököket" hozhat be.`
  },
  // KIKÖTÉS FELADAT
  {
    id: 'radical-domain-check',
    type: 'question',
    inputType: 'multiple-choice',
    question: `**0. lépés: Kikötés (Értelmezési tartomány)**
    
    Mielőtt megoldanánk a $\\sqrt{2x - 1} = 5$ egyenletet, vizsgáljuk meg, mely számokra értelmezhető.
    Mi a feltétele annak, hogy a gyökös kifejezés létezzen a valós számok halmazán?`,
    options: [
      '$2x - 1 > 0$ (szigorúan pozitív)',
      '$2x - 1 \\ge 0$ (nemnegatív)',
      '$2x - 1 \\neq 0$ (nem nulla)'
    ],
    correctAnswer: '$2x - 1 \\ge 0$ (nemnegatív)',
    hint: 'A négyzetgyök alatt állhat 0 is ($\\sqrt{0}=0$), de negatív szám nem.',
    successMessage: 'Helyes! A kikötés tehát: $2x - 1 \\ge 0$.'
  },
  // KIKÖTÉS KISZÁMOLÁSA (ÚJ LÉPÉS)
  {
    id: 'radical-domain-solve',
    type: 'question',
    inputType: 'numeric',
    question: `**0. lépés (folytatás): A határ meghatározása**
    
    Tudjuk, hogy $2x - 1 \\ge 0$. Rendezd ezt az egyenlőtlenséget x-re!`,
    inputPrefix: '$x \\ge$',
    correctAnswer: '0.5',
    hint: 'Adj hozzá 1-et mindkét oldalhoz ($2x \\ge 1$), majd ossz el 2-vel.',
    successMessage: 'Szuper! Tehát a kikötés: $x \\ge 0,5$.'
  },
  {
    id: 'radical-step1-square',
    type: 'question',
    inputType: 'multiple-choice',
    question: `**Oldjuk meg lépésről lépésre: $\\sqrt{2x - 1} = 5$**
    
    **1. lépés: Négyzetre emelés**
    
    Eltüntetjük a gyökjelet azzal, hogy mindkét oldalt négyzetre emeljük. Melyik egyenletet kapjuk?`,
    options: ['$2x - 1 = 5$', '$2x - 1 = 25$', '$2x - 1 = 10$'],
    correctAnswer: '$2x - 1 = 25$',
    hint: 'A bal oldalon eltűnik a gyökjel. A jobb oldalon $5^2$ lesz. Mennyi 5-nek a négyzete?',
    successMessage: 'Helyes! A gyökjel eltűnt, a jobb oldalon pedig 25 lett.'
  },
  {
    id: 'radical-step2-linear',
    type: 'question',
    inputType: 'numeric',
    question: `**2. lépés: Rendezés**
    
    Az egyenletünk: $2x - 1 = 25$.
    
    Vigyük át a -1-et a másik oldalra (adjunk hozzá mindkét oldalhoz 1-et). Mennyi lesz így a jobb oldal ($2x$ értéke)?`,
    inputPrefix: '$2x =$',
    correctAnswer: '26',
    hint: 'Ha $2x - 1 = 25$ (adjunk hozzá mindkét oldalhoz 1-et), akkor $2x = 25 + 1$.',
    successMessage: 'Így van! $2x = 26$.'
  },
  {
    id: 'radical-step3-solve',
    type: 'question',
    inputType: 'numeric',
    question: `**3. lépés: Az ismeretlen kifejezése**
    
    Ha $2x = 26$, mennyi az $x$?`,
    inputPrefix: '$x =$',
    correctAnswer: '13',
    hint: 'Osszuk el a 26-ot 2-vel.',
    successMessage: 'Tökéletes! Megvan a megoldás: x = 13.'
  },
  // KIKÖTÉS ELLENŐRZÉSE
  {
    id: 'radical-step4-verify',
    type: 'question',
    inputType: 'multiple-choice',
    question: `**4. lépés: Egybevetés a kikötéssel**
    
    A megoldásunk $x = 13$. A feladat elején tett kikötésünk: $x \\ge 0,5$.
    
    Megfelel a kapott eredmény a kikötésnek?`,
    options: ['Igen', 'Nem'],
    correctAnswer: 'Igen',
    hint: 'Vizsgáld meg: a 13 benne van a [0,5; ∞[ intervallumban?',
    successMessage: 'Helyes! Mivel $13 \\ge 0,5$, ezért a megoldás elfogadható (és behelyettesítéssel is ellenőrizhető: $\\sqrt{25}=5$).'
  },
  {
    id: 'radical-check-q',
    type: 'question',
    inputType: 'multiple-choice',
    question: `Miért kötelező az ellenőrzés a négyzetgyökös egyenleteknél?`,
    options: ['Mert a tanár azt kérte', 'Mert a négyzetre emelés nem ekvivalens átalakítás', 'Mert a gyökjel alatt lehet negatív szám'],
    correctAnswer: 'Mert a négyzetre emelés nem ekvivalens átalakítás',
    hint: 'Gondolj arra: ha $x=3$, akkor $x^2=9$. De ha $x=-3$, akkor is $x^2=9$. Visszafelé ez problémát okozhat.',
    successMessage: 'Pontosan! Hamis gyökök keletkezhetnek.'
  },

  // --- 4. EGYENLETRENDSZEREK ---
  {
    id: 'system-theory',
    type: 'theory',
    title: '4. Másodfokú egyenletrendszerek',
    content: `Másodfokú egyenletrendszerekről beszélünk, ha a rendszerben szerepel legalább egy másodfokú egyenlet. A középiskolában leggyakrabban egy elsőfokú és egy másodfokú egyenletből álló rendszereket oldunk meg.

    **A megoldás lépései (Behelyettesítő módszer):**
    
    1. **Kifejezés:** Az egyik (lehetőleg az elsőfokú) egyenletből fejezzük ki az egyik ismeretlent a másikkal (pl. $y$-t $x$-szel).
    2. **Behelyettesítés:** A kapott kifejezést írjuk be a másik (másodfokú) egyenletbe az ismeretlen helyére.
    3. **Megoldás:** Így egy egyismeretlenes egyenletet kapunk. Ezt oldjuk meg (rendezés után megoldóképlettel).
    4. **Visszahelyettesítés:** A kapott gyököket (pl. $x_1, x_2$) helyettesítsük vissza az 1. lépésben kapott képletbe, hogy megkapjuk a másik ismeretlent ($y_1, y_2$).
    5. **Ellenőrzés:** A kapott számpárokat ellenőrizzük az eredeti egyenletekben.`
  },
  {
    id: 'sys-example-intro',
    type: 'theory',
    title: 'Mintapélda megoldása',
    content: `Oldjuk meg közösen a következő egyenletrendszert lépésről lépésre:
    
    $$ \\begin{cases} x + y = -3 \\\\ x \\cdot y = -10 \\end{cases} $$`
  },
  {
    id: 'sys-step1-express',
    type: 'question',
    inputType: 'multiple-choice',
    question: `**1. lépés: Kifejezés**
    
    Az első egyenlet ($x + y = -3$) lineáris, ebből könnyen kifejezhetjük az $y$-t. Melyik a helyes átalakítás?`,
    options: [
      '$y = -3 + x$',
      '$y = -3 - x$',
      '$y = x - 3$'
    ],
    correctAnswer: '$y = -3 - x$',
    hint: 'Vond ki az x-et mindkét oldalból!',
    successMessage: 'Helyes! Tehát $y = -3 - x$. Ezt fogjuk használni a behelyettesítéshez.'
  },
  {
    id: 'sys-step2-coeffs',
    type: 'question',
    inputType: 'quadratic-equation',
    question: `**2. lépés: Behelyettesítés és rendezés**
    
    Helyettesítsük be az $y = -3 - x$ kifejezést a második egyenletbe ($x \\cdot y = -10$):
    $$x \\cdot (-3 - x) = -10$$
    
    Bontsd fel a zárójelet, és rendezd az egyenletet 0-ra ($ax^2 + bx + c = 0$ alakba)! Írd be az együtthatókat a megfelelő helyre!`,
    correctAnswer: [['1', '3', '-10'], ['-1', '-3', '10']],
    hint: 'Zárójelbontás: $-3x - x^2 = -10$. Rendezd az egyenletet 0-ra (vidd át az összes tagot az egyik oldalra).',
    successMessage: 'Pontos! Az egyenlet rendezve: $x^2 + 3x - 10 = 0$ (vagy $-x^2 - 3x + 10 = 0$).'
  },
  {
    id: 'sys-step3-solve',
    type: 'question',
    inputType: 'roots-set',
    question: `**3. lépés: A másodfokú egyenlet megoldása**
    
    Oldd meg az $x^2 + 3x - 10 = 0$ egyenletet! Milyen értékeket kapunk $x$-re?`,
    correctAnswer: ['2', '-5'],
    hint: 'Használd a megoldóképletet vagy a Viéte-formulákat! Szorzatuk -10, összegük -3.',
    successMessage: 'Megvannak az x értékei: 2 és -5.'
  },
  {
    id: 'sys-step4-calc-y',
    type: 'question',
    inputType: 'key-value',
    question: `**4. lépés: Az y értékek kiszámítása**
    
    Tudjuk, hogy $y = -3 - x$. Számítsd ki az y-t mindkét x értékhez!`,
    inputLabels: [
      'Ha $x = 2$, akkor $y =$',
      'Ha $x = -5$, akkor $y =$'
    ],
    correctAnswer: ['-5', '2'],
    hint: 'Helyettesíts be: $-3 - 2$ és $-3 - (-5)$.',
    successMessage: 'Kész! Megkaptuk a megoldáspárokat.'
  },
  {
    id: 'sys-step5-check',
    type: 'question',
    inputType: 'multiple-choice',
    question: `**5. lépés: Ellenőrzés**
    
    A kapott számpárok: $(2; -5)$ és $(-5; 2)$.
    Nézzük meg a második egyenletet: $x \\cdot y = -10$.
    
    Teljesül az egyenlőség mindkét esetben?`,
    options: ['Igen', 'Nem'],
    correctAnswer: 'Igen',
    hint: '$2 \\cdot (-5) = -10$ és $(-5) \\cdot 2 = -10$.',
    successMessage: 'Szuper! Sikeresen megoldottuk az egyenletrendszert.'
  }
];