import { CurriculumItem } from '../../../types';
import { generateMappingProblem } from '../../../utils/QuestionGenerator';

export const functionBasicsCurriculum: CurriculumItem[] = [
    // --- 2. FÜGGVÉNYEK BEVEZETÉSE ---
    {
        chapter: 'Függvények bevezetése',
        id: 'func-intro-analogy',
        type: 'theory',
        title: '2. Függvények bevezetése',
        content: `Mielőtt számokkal dolgoznánk, nézzünk egy hétköznapi példát a **függvényekre**!
        
        Képzeljünk el egy **zeneiskolát**!
        
        Van két halmazunk:
        1. **Tanulók (A halmaz)**: Anna, Balázs, Csaba, Dóri, Éva.
        2. **Hangszerek (B halmaz)**: Hegedű, Zongora, Furulya, Dob.
        
        A **hozzárendelési szabály** megmondja, ki milyen hangszeren tanul.`,
        illustration: `<svg viewBox="0 0 450 280" class="w-full h-auto bg-white rounded-lg border border-slate-200">
            <!-- Set A: Students -->
            <ellipse cx="100" cy="140" rx="80" ry="110" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
            <text x="100" y="270" text-anchor="middle" font-weight="bold" fill="#3b82f6">Tanulók (A)</text>
            
            <circle cx="100" cy="60" r="4" fill="#3b82f6"/> <text x="90" y="65" text-anchor="end" font-size="12">Anna</text>
            <circle cx="100" cy="100" r="4" fill="#3b82f6"/> <text x="90" y="105" text-anchor="end" font-size="12">Balázs</text>
            <circle cx="100" cy="140" r="4" fill="#3b82f6"/> <text x="90" y="145" text-anchor="end" font-size="12">Csaba</text>
            <circle cx="100" cy="180" r="4" fill="#3b82f6"/> <text x="90" y="185" text-anchor="end" font-size="12">Dóri</text>
            <circle cx="100" cy="220" r="4" fill="#94a3b8"/> <text x="90" y="225" text-anchor="end" font-size="12" fill="#64748b">Éva</text>

            <!-- Set B: Instruments -->
            <ellipse cx="340" cy="140" rx="80" ry="110" fill="#f0fdf4" stroke="#22c55e" stroke-width="2"/>
            <text x="340" y="270" text-anchor="middle" font-weight="bold" fill="#22c55e">Hangszerek (B)</text>
            
            <circle cx="340" cy="60" r="4" fill="#22c55e"/> <text x="350" y="65" text-anchor="start" font-size="12">Hegedű</text>
            <circle cx="340" cy="100" r="4" fill="#22c55e"/> <text x="350" y="105" text-anchor="start" font-size="12">Zongora</text>
            <circle cx="340" cy="140" r="4" fill="#94a3b8"/> <text x="350" y="145" text-anchor="start" font-size="12" fill="#64748b">Furulya</text>
            <circle cx="340" cy="180" r="4" fill="#22c55e"/> <text x="350" y="185" text-anchor="start" font-size="12">Dob</text>

            <!-- Arrows -->
            <path d="M 104 60 Q 220 40 336 60" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
            <path d="M 104 100 Q 220 100 336 100" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
            <path d="M 104 140 Q 220 100 336 65" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
            <path d="M 104 180 Q 220 200 336 180" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>

            <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
                </marker>
            </defs>
        </svg>`
    },

    // --- 2.1 DEFINÍCIÓK ---
    {
        chapter: 'Függvények bevezetése',
        id: 'func-definitions',
        type: 'theory',
        title: 'Fogalmak',
        content: `Nézzük meg a legfontosabb fogalmakat a zeneiskolás példán keresztül!
        
        - **1. Alaphalmaz** ($A$): A kiindulási halmaz.
           *(A teljes osztály: Anna, Balázs, Csaba, Dóri, Éva)*
        
        - **2. Képhalmaz** ($B$): Az érkezési halmaz.
           *(Az összes választható hangszer: Hegedű, Zongora, Furulya, Dob)*
           
        - **3. Értelmezési tartomány** ($D_f$): Az alaphalmaz azon elemei, akikhez ténylegesen rendeltünk valamit.
           *(Csak az aktív zenészek.* **Éva** *nem tartozik ide, mert ő nem választott hangszert!)*
           
        - **4. Értékkészlet** ($R_f$): A képhalmaz azon elemei, amiket valaki választott.
           *(A hangszerek, amiken játszanak. A* **Furulya** *nem tartozik ide, mert senki nem választotta!)*`,
        illustration: `<svg viewBox="0 0 450 280" class="w-full h-auto bg-white rounded-lg border border-slate-200">
            <!-- Set A: Students -->
            <ellipse cx="100" cy="140" rx="80" ry="110" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
            <text x="100" y="270" text-anchor="middle" font-weight="bold" fill="#3b82f6">Tanulók (A)</text>
            
            <circle cx="100" cy="60" r="4" fill="#3b82f6"/> <text x="90" y="65" text-anchor="end" font-size="12">Anna</text>
            <circle cx="100" cy="100" r="4" fill="#3b82f6"/> <text x="90" y="105" text-anchor="end" font-size="12">Balázs</text>
            <circle cx="100" cy="140" r="4" fill="#3b82f6"/> <text x="90" y="145" text-anchor="end" font-size="12">Csaba</text>
            <circle cx="100" cy="180" r="4" fill="#3b82f6"/> <text x="90" y="185" text-anchor="end" font-size="12">Dóri</text>
            <circle cx="100" cy="220" r="4" fill="#94a3b8"/> <text x="90" y="225" text-anchor="end" font-size="12" fill="#64748b">Éva</text>

            <!-- Set B: Instruments -->
            <ellipse cx="340" cy="140" rx="80" ry="110" fill="#f0fdf4" stroke="#22c55e" stroke-width="2"/>
            <text x="340" y="270" text-anchor="middle" font-weight="bold" fill="#22c55e">Hangszerek (B)</text>
            
            <circle cx="340" cy="60" r="4" fill="#22c55e"/> <text x="350" y="65" text-anchor="start" font-size="12">Hegedű</text>
            <circle cx="340" cy="100" r="4" fill="#22c55e"/> <text x="350" y="105" text-anchor="start" font-size="12">Zongora</text>
            <circle cx="340" cy="140" r="4" fill="#94a3b8"/> <text x="350" y="145" text-anchor="start" font-size="12" fill="#64748b">Furulya</text>
            <circle cx="340" cy="180" r="4" fill="#22c55e"/> <text x="350" y="185" text-anchor="start" font-size="12">Dob</text>

            <!-- Arrows -->
            <path d="M 104 60 Q 220 40 336 60" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
            <path d="M 104 100 Q 220 100 336 100" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
            <path d="M 104 140 Q 220 100 336 65" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
            <path d="M 104 180 Q 220 200 336 180" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
            
            <!-- Labels for outliers -->
            <text x="130" y="225" font-size="10" fill="#ef4444" font-style="italic">Nem választott!</text>
            <text x="310" y="155" font-size="10" fill="#ef4444" font-style="italic" text-anchor="end">Nem választották!</text>

            <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
                </marker>
            </defs>
        </svg>`
    },

    // --- 2.2 EGYÉRTELMŰSÉG ---
    {
        chapter: 'Függvények bevezetése',
        id: 'func-unambiguous',
        type: 'theory',
        title: 'Mikor "függvény" egy hozzárendelés?',
        content: `A matematika szigorú: egy hozzárendelés akkor **függvény**, ha az alaphalmaz minden eleméhez **pontosan egy** képelemet rendelünk.
        
        **Példák:**
        ✅ **Függvény (Egyértelmű):** Anna csak hegedül.
        *(Két diák járhat ugyanarra a hangszerre, de egy diák nem tanulhat egyszerre több hangszeren ebben a modellben.)*
        
        ❌ **Nem függvény (Nem egyértelmű):** Anna hegedül ÉS zongorázik is.
        *(Ha egy bemenethez (Anna) több kimenet (Hegedű, Zongora) tartozik, az nem függvény!)*`,
        illustration: `<svg viewBox="0 0 400 150" class="w-full h-auto bg-white rounded-lg border border-slate-200">
             <text x="200" y="30" text-anchor="middle" font-weight="bold" fill="#ef4444">HIBÁS (Nem függvény)!</text>
             <circle cx="100" cy="80" r="5" fill="#ef4444"/> <text x="90" y="85" text-anchor="end">Anna</text>
             
             <circle cx="300" cy="50" r="5" fill="#22c55e"/> <text x="310" y="55" text-anchor="start">Hegedű</text>
             <circle cx="300" cy="110" r="5" fill="#22c55e"/> <text x="310" y="115" text-anchor="start">Zongora</text>
             
             <!-- Two arrows from Anna -->
             <path d="M 105 80 L 295 50" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-err)"/>
             <path d="M 105 80 L 295 110" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-err)"/>
             
             <defs>
                <marker id="arrow-err" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" />
                </marker>
            </defs>
        </svg>`
    },

    // --- GYAKORLÁS: EGYÉRTELMŰSÉG ---
    {
        chapter: 'Függvények bevezetése',
        id: 'func-real-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Döntsd el!**
        
        Hozzárendelés: **Gyerekek** $\\to$ **Édesanyák**
        *(Minden gyerekhez hozzárendeljük a vér szerinti édesanyját.)*
        
        Függvény-e ez a hozzárendelés?`,
        options: ['Igen, ez függvény.', 'Nem, ez nem függvény.'],
        correctAnswer: 'Igen, ez függvény.',
        successMessage: 'Helyes! Minden gyereknek pontosan egy vér szerinti édesanyja van, tehát ez egy egyértelmű hozzárendelés (függvény).',
        hint: 'Van-e olyan gyerek, akinek 0 vagy 2 vér szerinti édesanyja van? Nincs.'
    },
    {
        chapter: 'Függvények bevezetése',
        id: 'func-real-2',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Döntsd el!**
        
        Hozzárendelés: **Emberek** $\\to$ **Telefonszámok**
        *(Minden emberhez hozzárendeljük a saját telefonszámát.)*
        
        Függvény-e ez a hozzárendelés?`,
        options: ['Igen, ez függvény.', 'Nem, ez nem függvény.'],
        correctAnswer: 'Nem, ez nem függvény.',
        successMessage: 'Helyes! Ez nem egyértelmű, hiszen egy embernek lehet több telefonszáma is (vagy egy sem).',
        hint: 'Lehet-e egy embernek több telefonszáma? Ha igen, akkor egy bemenethez több kimenet tartozik.'
    },
    // --- GYAKORLÁS: EGYÉRTELMŰSÉG ---
    generateMappingProblem('mapping-1'),

    // --- 2.3 KÖLCSÖNÖSEN EGYÉRTELMŰ ---
    {
        chapter: 'Függvények bevezetése',
        id: 'func-bijective',
        type: 'theory',
        title: 'Kölcsönösen egyértelmű',
        content: `Egy hozzárendelés **kölcsönösen egyértelmű**, ha:
        - **1. Egyértelmű** (mindenkinek pontosan egy hangszere van).
        - **2. Különböző elemeknek különböző a képe** (nincs olyan hangszer, amit többen választottak).
        - **3. Ráképezés** (minden hangszeren játszik valaki).
        
        **Példa:**
        Ha minden hangszeren **pontosan egy** diák tanulna.
        
        *(Ez azért fontos, mert csak az ilyen függvényeknek van "inverze" (visszafelé is működik).)*`
    },

    // --- GYAKORLÁS: KÖLCSÖNÖSEN EGYÉRTELMŰ ---
    // --- GYAKORLÁS: KÖLCSÖNÖSEN EGYÉRTELMŰ ---
    generateMappingProblem('mapping-2'),

    // --- FEJEZET KVÍZ ---
    {
        chapter: 'Függvények bevezetése',
        id: 'quiz-function-basics',
        type: 'quiz',
        title: 'Összefoglaló kvíz (opcionális)',
        description: 'Nem kötelező, de segít rögzíteni a tanultakat. Ellenőrizd, mennyire érted a függvények alapfogalmait!',
        minScoreToPass: 2,
        questions: [
            {
                question: 'Mikor nevezünk egy hozzárendelést függvénynek?',
                inputType: 'multiple-choice',
                options: ['Ha minden bemenethez pontosan egy kimenet tartozik', 'Ha minden kimenethez pontosan egy bemenet tartozik', 'Ha van inverze'],
                correctAnswer: 'Ha minden bemenethez pontosan egy kimenet tartozik',
                hint: 'A kulcsszó: EGYÉRTELMŰ hozzárendelés.'
            },
            {
                question: 'Mi az értelmezési tartomány ($D_f$)?',
                inputType: 'multiple-choice',
                options: ['Ahonnan indulunk (bemeneti értékek)', 'Ahová érkezünk (kimeneti értékek)', 'Az összes lehetséges szám'],
                correctAnswer: 'Ahonnan indulunk (bemeneti értékek)',
                hint: 'A "D" a "domain" (tartomány) rövidítése.'
            },
            {
                question: 'Mi az értékkészlet ($R_f$)?',
                inputType: 'multiple-choice',
                options: ['A ténylegesen felvett kimeneti értékek', 'Az összes lehetséges bemenet', 'A függvény képlete'],
                correctAnswer: 'A ténylegesen felvett kimeneti értékek',
                hint: 'Az "R" a "range" (készlet) rövidítése.'
            },
            {
                question: 'Minden emberhez rendeljük a testmagasságát. Ez függvény?',
                inputType: 'multiple-choice',
                options: ['Igen', 'Nem'],
                correctAnswer: 'Igen',
                hint: 'Van-e olyan ember, akinek 2 különböző testmagassága van egyszerre?'
            }
        ]
    }
];
