import { CurriculumItem } from '../../../types';

export const centralAnglesCurriculum: CurriculumItem[] = [
    // 1. Kártya: Részletes Elmélet - Alapfogalmak és Tétel
    {
        id: 'central-angles-theory-detailed',
        type: 'theory',
        chapter: 'Kerületi és középponti szögek',
        title: '1. Kerületi és Középponti szögek',
        content: `
### Szögek a körben

Két speciális szögfajtát különböztetünk meg attól függően, hogy hol van a csúcsuk:

1.  **Középponti szög** ($\beta$):
    -   Csúcsa a kör **középpontja** ($O$).
    -   Szárai a kör sugarai.
    -   A szárak közrefogják a hozzá tartozó körívet.

2.  **Kerületi szög** ($\alpha$):
    -   Csúcsa a **körvonalon** van (pl. $C$ pont).
    -   Szárai a kör húrjai, amelyek a körívet metszik.

---

### A Kerületi és Középponti Szögek Tétele

**Tétel:** Egy adott körben, adott ívhez tartozó középponti szög nagysága pontosan **kétszerese** az ugyanahhoz az ívhez tartozó bármely kerületi szög nagyságának.

$$ \\beta = 2 \\cdot \\alpha $$

> [!IMPORTANT]
> **Fontos következmény:**
> Ugyanahhoz a körívhez tartozó **összes kerületi szög egyenlő nagyságú**. Nem számít, hol vesszük fel a $C$ pontot a köríven (amíg a másik íven van), az $\\alpha$ szög mindig ugyanakkora marad.

### Interaktív Vizsgálat
Mozgasd a **C** pontot a lenti ábrán! Figyeld meg:
1.  Bárhová húzod $C$-t, az $\\alpha$ szög **nem változik**.
2.  A $\\beta$ szög mindig pontosan a duplája $\\alpha$-nak.

<InteractiveComponent type="CircleAngleVisualizer" />
        `
    },

    // Feladatok - Középponti és Kerületi szögek
    {
        id: 'central-angles-q1-match',
        type: 'question',
        chapter: 'Kerületi és középponti szögek',
        question: '**Párosítsd a szögtípusokat a definícióikkal!**',
        inputType: 'matching',
        matchPairs: [
            { left: 'Középponti szög', right: 'Csúcsa a középpontban, szárai sugarak' },
            { left: 'Kerületi szög', right: 'Csúcsa a körvonalán, szárai húrok' }
        ],
        correctAnswer: 'implied',
        hint: 'Hol van a szög csúcsa és mik a szárai?',
        successMessage: 'Helyes! A csúcs elhelyezkedése és a szárak típusa határozza meg.'
    },
    {
        id: 'central-angles-q2-calc-central',
        type: 'question',
        chapter: 'Kerületi és középponti szögek',
        question: "Mennyi a középponti szög, ha a hozzá tartozó kerületi szög 35°?",
        inputType: 'multiple-choice',
        options: ["17.5°", "35°", "70°", "140°"],
        correctAnswer: "70°",
        hint: "A középponti szög a kerületi kétszerese.",
        explanation: "A tétel szerint: $\\beta = 2 \\cdot \\alpha = 2 \\cdot 35° = 70°$.",
        successMessage: "Helyes! 2 * 35° = 70°."
    },
    {
        id: 'central-angles-q3-calc-inscribed',
        type: 'question',
        chapter: 'Kerületi és középponti szögek',
        question: "Mennyi a kerületi szög, ha a középponti szög 110°?",
        inputType: 'multiple-choice',
        options: ["55°", "110°", "220°", "27.5°"],
        correctAnswer: "55°",
        hint: "A kerületi szög a középponti fele.",
        successMessage: "Helyes! 110° / 2 = 55°."
    },
    {
        id: 'central-angles-q4-property',
        type: 'question',
        chapter: 'Kerületi és középponti szögek',
        question: "Igaz-e, hogy egy ívhez tartozó minden kerületi szög egyenlő?",
        inputType: 'multiple-choice',
        options: ["Igaz", "Hamis"],
        correctAnswer: "Igaz",
        hint: "Gondolj a tétel következményére!",
        successMessage: "Így van! Ez a tétel egyik legfontosabb következménye."
    },

    // 2. Kártya: Látószög Elmélet
    {
        id: 'viewing-angle-concept',
        type: 'theory',
        chapter: 'Kerületi és középponti szögek',
        title: '2. A Látószög Fogalma',
        content: `
A kerületi szögek tételét megfogalmazhatjuk másképpen is, a **látószög** fogalmával. Ez a gyakorlatban (pl. méréseknél, fotózásnál) gyakran használt fogalom.

### Mi az a látószög?
Ha adott egy $AB$ szakasz és egy $P$ pont a síkon, akkor az $APB \\angle$ szöget úgy hívjuk, hogy **a** $P$ **pontból az** $AB$ **szakasz** $\\alpha$ **szög alatt látszik**.

### Látószögkörív (Mértani hely)
Keressük azokat a pontokat a síkon, ahonnan az $AB$ szakasz pontosan $\\alpha$ szög alatt látszik ($0^\\circ < \\alpha < 180^\\circ$).

A kerületi szögek tétele alapján ezek a pontok egy köríven helyezkednek el. Mivel a sík mindkét oldalára szerkeszthetünk ilyen pontokat, ezért a megoldás:
**Két, az** $AB$ **egyenesre szimmetrikusan elhelyezkedő körív.**

Ezeket a köríveket nevezzük **látószögkörívnek**.

> [!NOTE]
> **Megjegyzés:** A szakasz végpontjai ($A$ és $B$) nem tartoznak a mértani helyhez.

### Interaktív Szemléltetés
Mozgasd a **P** pontot a köríven és figyeld meg, hogy a szög **mindig ugyanakkora** marad!

<InteractiveComponent type="ViewingAngleVisualizer" />

### Interaktív Szerkesztés
Az alábbi eszközön lépésről lépésre megnézheted, hogyan kell megszerkeszteni a látószögkörívet.
1.  Felvesszük a szakaszt és a szöget.
2.  Merőlegest állítunk a szerkesztett sugárra.
3.  A felezőmerőleges kimetszi a középpontot.

<InteractiveComponent type="ViewingAngleConstruction" />
    `
    },

    // Feladatok - Látószög
    {
        id: 'viewing-angle-q1-count',
        type: 'question',
        chapter: 'Kerületi és középponti szögek',
        question: "Hány körívből áll a látószög mértani helye a síkon?",
        inputType: 'multiple-choice',
        options: ["Egy", "Kettő", "Négy", "Végtelen sok"],
        correctAnswer: "Kettő",
        hint: "A húr mindkét oldalán van egy.",
        successMessage: "Helyes! Két szimmetrikus körívből áll."
    },
    {
        id: 'viewing-angle-q2-endpoints',
        type: 'question',
        chapter: 'Kerületi és középponti szögek',
        question: "Beletartoznak-e a szakasz végpontjai (A és B) a látószögkörívbe?",
        inputType: 'multiple-choice',
        options: ["Igen", "Nem"],
        correctAnswer: "Nem",
        hint: "Onnan a szakasz nem látszik szög alatt.",
        successMessage: "Helyes! A végpontok nem részei a halmaznak."
    },


    // 3. Kártya: Thalész Tétele (Részletes)
    {
        id: 'thales-theorem',
        type: 'theory',
        chapter: 'Kerületi és középponti szögek',
        title: '3. Thalész Tétele',
        content: `
Thalész tétele a látószögkörív (és a kerületi szögek tételének) legfontosabb **speciális esete**, amikor a látószög **derékszög** ($\\alpha = 90^\\circ$).

### A Tétel
Ha egy kör **átmérőjének** két végpontját összekötjük a körvonal bármely más pontjával, az így kapott szög mindig **derékszög** ($90^\\circ$).

Másképpen fogalmazva:
**Azon pontok halmaza a síkon, amelyekből egy adott szakasz derékszög alatt látszik, a szakaszra mint átmérőre írt kör (kivéve a végpontokat).**

### Bizonyítás (Röviden)
Ha a középponti szög az átmérő miatt $180^\\circ$ (egyenesszög), akkor a kerületi szög tétele alapján:
$$ \\alpha = \\frac{\\beta}{2} = \\frac{180^\\circ}{2} = 90^\\circ $$

> [!IMPORTANT]
> **Alkalmazás:** Ezt a tételt nagyon gyakran használjuk szerkesztéseknél. Ha derékszögű háromszöget kell szerkeszteni, vagy érintőt kell húzni egy körhöz külső pontból, mindig a Thalész-kör segítségével indulunk el.

### Interaktív Vizsgálat
Mozgasd a **C** pontot a félköríven! Bármerre jársz, a szög mindig pontosan **90°**.

<InteractiveComponent type="ThalesVisualizer" />
    `
    },

    // Feladatok - Thalész
    {
        id: 'thales-q1-calc',
        type: 'question',
        chapter: 'Kerületi és középponti szögek',
        question: 'Ha a háromszög egyik oldala egy kör **átmérője**, és a szemben lévő csúcs a körvonalán van, mekkora a szög a csúcsnál? *(Thalész tétele!)*',
        inputType: 'numeric',
        correctAnswer: '90',
        hint: 'Ez Thálész tétele! Az átmérő feletti kerületi szög mindig...',
        explanation: 'Thálész tétele: az átmérő felett lévő kerületi szög mindig $90^\\circ$ (derékszög).',
        successMessage: 'Helyes! Thálész tétele: átmérő feletti kerületi szög = 90°.'
    }
];
