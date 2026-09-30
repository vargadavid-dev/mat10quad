import React from 'react';
import { CurriculumItem } from '../../../types';
import { PolynomialMultiplication } from '../../../components/PolynomialMultiplication';

export const factorizationCurriculum: CurriculumItem[] = [
    // --- 1. KIEMELÉS ---
    {
        id: 'faktor-intro-theory',
        type: 'theory',
        title: '1. Kiemelés',
        content: `Gyakran célszerű egy többtagú kifejezést több kifejezés szorzataként felírnunk. Ha ezt meg tudjuk tenni, akkor azt mondjuk, hogy **szorzattá alakítjuk** a kifejezést.
    
A legegyszerűbb módszer a **kiemelés**. Kiemeléskor az összeget vagy különbséget alakítjuk szorzattá, ami lényegében a beszorzás fordítottja.
    
**Recept:**
1. Vizsgáld meg, van-e közös tényező a kifejezés minden tagjában (pl. szám, változó vagy mindkettő).
2. Írd ki a közös tényezőt, majd zárójelbe a maradékot (az eredeti kifejezés minden tagját oszd el a közös tényezővel).
3. Ellenőrizd, hogy a zárójelben lévő kifejezést helyesen alakítottad-e vissza az eredeti kifejezésre (visszaszorzással).
    
**Példa:**
$$3a^2 + 6ab = 3a \\cdot a + 3a \\cdot 2b = 3a \\cdot (a + 2b)$$`
    },
    {
        id: 'practice-faktor-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `Mit emelhetünk ki a következő kifejezésből a lehető legnagyobb mértékben: $8x - 12$?`,
        options: ['2', '4', '8', 'x'],
        correctAnswer: '4',
        hint: 'Keresd a 8 és a 12 legnagyobb közös osztóját.',
        successMessage: 'Helyes! A 4 a legnagyobb közös osztó, így $4(2x - 3)$ lesz a szorzat alak.'
    },
    {
        id: 'practice-faktor-2',
        type: 'question',
        inputType: 'matching',
        question: `Párosítsd az összegeket a szorzattá alakított alakjukkal!`,
        matchPairs: [
            { left: '$6x^2 + 9x$', right: '$3x(2x + 3)$' },
            { left: '$b - 3b^2 + 5b$', right: '$b(6 - 3b)$' },
            { left: '$4x + 5xy$', right: '$x(4 + 5y)$' }
        ],
        correctAnswer: 'implied',
        hint: 'Gondold végig, mi a közös tényező minden tagban!',
        successMessage: 'Tökéletes! Sikeresen kiemelted a közös tényezőket.'
    },

    // --- 2. KIEMELÉS CSOPORTOSÍTÁSSAL ---
    {
        id: 'grouping-theory',
        type: 'theory',
        title: '2. Kiemelés csoportosítással',
        content: `Előfordulhat, hogy nem minden tagból tudunk kiemelni közös tényezőt, de ügyes csoportosítással mégis eredményre juthatunk.
    
**Példa:**
$$ax + bx + ay + by$$
    
Itt nincs olyan tényező, ami mind a 4 tagban megvan. Azonban ha csoportosítjuk az első kettőt és az utolsó kettőt:
$$(ax + bx) + (ay + by)$$
    
Majd az elsőből $x$-et, a másodikból $y$-t emelünk ki:
$$x(a + b) + y(a + b)$$
    
Most már látható, hogy ismét van egy közös tényező, az $(a + b)$ kifejezés. Ezt kiemelve megkapjuk a végeredményt:
$$(a + b)(x + y)$$`
    },
    {
        id: 'practice-grouping-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `Alakítsd szorzattá csoportosítással: $6ax - 12xb + 2ay - 4by$. Mik lesznek a tényezők?`,
        options: ['$(a - 2b)(6x + 2y)$', '$(a - 4b)(6x + 2y)$', '$(a - 2b)(2x + 6y)$'],
        correctAnswer: '$(a - 2b)(6x + 2y)$',
        hint: 'Emelj ki $6x$-et az első kettőből, és $2y$-t az utolsó kettőből: $6x(a - 2b) + 2y(a - 2b)$.',
        successMessage: 'Helyes! A két tényező az $(a-2b)$ és a $(6x+2y)$.'
    },

    // --- 3. NEVEZETES AZONOSSÁGOK ---
    {
        id: 'identities-intro',
        type: 'theory',
        title: '3. Nevezetes azonosságok (Elméleti alapok)',
        content: `A leggyakoribb hiba, amit a tanulók elkövetnek, hogy azt hiszik: $(a+b)^2 = a^2 + b^2$. **Ez NEM igaz!**
        
Ehelyett a helyes képlet:
$$(a + b)^2 = a^2 + 2ab + b^2$$

*(Szavakkal: Első tag négyzete meg a két tag szorzatának kétszerese meg a második tag négyzete.)*

**Elmélet megértése egy alap példán keresztül:**
Mi is az a négyzetre emelés? Azt jelenti, hogy valamit megszorzunk önmagával. Tehát az $(a + b)^2$ valójában ezt jelenti: $(a + b) \\cdot (a + b)$.
Bontsuk fel a zárójeleket úgy, hogy minden tagot megszorzunk minden taggal:

1. $a \\cdot a = a^2$
2. $a \\cdot b = ab$
3. $b \\cdot a = ba$ (ami ugyanaz, mint az $ab$)
4. $b \\cdot b = b^2$

Ha ezeket összeadjuk: $a^2 + ab + ab + b^2$. Mivel az $ab$-ből kettő van, összevonhatjuk őket, így megkapjuk a végeredményt: $a^2 + 2ab + b^2$. A középső tagot (a $2ab$-t) sosem szabad elfelejteni!`,
        interactiveAnimation: React.createElement(PolynomialMultiplication)
    },
    // --- (a+b)^2 ---
    {
        id: 'calc-steps-intro-1',
        type: 'theory',
        title: 'Gyakorlás lépésről lépésre',
        content: `**1. Két tag összegének négyzete**
Most számoljuk ki alapvető bontással a következőt:
$$(x + 5)^2$$
Haladjunk lépésről lépésre!`
    },
    {
        id: 'id-fwd-sum-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $(x + 5)^2$**
        
1. lépés: Mit jelent valójában az $(x+5)^2$? Ha felbontjuk a négyzetre emelést szorzattá, melyik a helyes alak?`,
        options: ['$x^2 + 5^2$', '$(x+5)(x+5)$', '$2 \\cdot (x+5)$'],
        correctAnswer: '$(x+5)(x+5)$',
        hint: 'A négyzetre emelés azt jelenti, hogy önmagával szorozzuk meg a kifejezést.',
        successMessage: 'Pontosan! Tehát az $(x+5)(x+5)$ szorzatot kell kiszámolnunk.'
    },
    {
        id: 'id-fwd-sum-2',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $(x + 5)(x + 5)$**
        
2. lépés: Végezzük el a szorzást "minden tagot minden taggal"! Mi lesz az eredmény az összevonás előtt?`,
        options: ['$x^2 + 25$', '$x^2 + 5x + 5x + 25$', '$2x + 10$'],
        correctAnswer: '$x^2 + 5x + 5x + 25$',
        hint: 'Szorozd az elsőt az elsővel ($x^2$), az elsőt a másodikkal ($5x$), a másodikat az elsővel ($5x$), és a másodikat a másodikkal ($25$).',
        successMessage: 'Tökéletes! Látod, a középső tagok teljesen egyformák ($5x$ és $5x$).'
    },
    {
        id: 'id-fwd-sum-3',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $x^2 + 5x + 5x + 25$**
        
3. lépés: Vonjuk össze az egynemű tagokat! Mi a végeredmény?`,
        options: ['$x^2 + 10x + 25$', '$x^2 + 25$', '$2x^2 + 10x + 25$'],
        correctAnswer: '$x^2 + 10x + 25$',
        hint: 'Csak add össze a két $5x$-et.',
        successMessage: 'Kész vagyunk! Kiszámoltuk a négyzetre emelést kézzel. Jöhet a szabály!'
    },
    {
        id: 'id-fwd-sum-theory',
        type: 'theory',
        title: 'Szabály: Két tag összegének négyzete',
        content: `Ahogy a példában láttad, a középső tag mindig **megkétszereződik** (amikor összevontuk az $5x$-et az $5x$-szel).
Ebből következik az első (és legfontosabb) nevezetes azonosság általános képlete:
    
$$(a + b)^2 = a^2 + 2ab + b^2$$

Mivel ezt már tudjuk, nem kell a jövőben minden tagot mindennel beszorozni, egyből felírhatjuk a végeredményt!`
    },
    {
        id: 'id-fwd-sum-prac-intro',
        type: 'theory',
        title: 'Összerakás építőkockákból',
        content: `Gyakoroljuk az azonosság közvetlen alkalmazását egy egyszerűbb, lépésről lépésre bontható példán: 
$$(x + 7)^2$$
A képletünk: $a^2 + 2ab + b^2$. Keressük meg a három építőkockát!`
    },
    {
        id: 'id-fwd-sum-prac-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $(x + 7)^2$**
        
1. építőkocka ($a^2$): Mi lesz az első tag négyzete, ha $a = x$?`,
        options: ['$x^2$', '$2x$', '$x$'],
        correctAnswer: '$x^2$',
        hint: '$(x)^2 = x^2$.',
        successMessage: 'Helyes! Az első építőkockánk az $x^2$.'
    },
    {
        id: 'id-fwd-sum-prac-2',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $x^2 + 2ab + b^2$**
        
2. építőkocka ($2ab$): Mennyi a kétszeres szorzat, ha $a = x$ és $b = 7$?`,
        options: ['$7x$', '$14x$', '$14$'],
        correctAnswer: '$14x$',
        hint: 'Szorozd össze őket, majd duplázd meg: $2 \\cdot x \\cdot 7$.',
        successMessage: 'Így van! A második építőkockánk a $14x$.'
    },
    {
        id: 'id-fwd-sum-prac-3',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $x^2 + 14x + b^2$**
        
3. építőkocka ($b^2$): Végül mi lesz a második tag négyzete, ha $b = 7$?`,
        options: ['$14$', '$49$', '$7$'],
        correctAnswer: '$49$',
        hint: '$7^2 = 7 \\cdot 7 = 49$.',
        successMessage: 'Szuper! A harmadik építőkocka a $49$. Ezzel össze is állt a végeredmény egy lépésben: $x^2 + 14x + 49$.'
    },
    {
        id: 'id-fwd-sum-prac-hard-theory',
        type: 'theory',
        title: 'Mi van, ha egy tag többtényezős?',
        content: `Nagyon figyelj oda arra, amikor nem egy egyszerű $x$, hanem például $3x$ van az egyik helyen!
Ilyenkor az egészet (a számot és a betűt is) négyzetre kell emelni:
$$(3x)^2 = 3^2 \\cdot x^2 = 9x^2$$
A kétszeres szorzatnál pedig az ott lévő számot is be kell szorozni:
$$2 \\cdot (3x) \\cdot 4 = 2 \\cdot 3 \\cdot 4 \\cdot x = 24x$$`
    },
    {
        id: 'id-fwd-sum-prac-hard',
        type: 'question',
        inputType: 'multiple-choice',
        question: `Próbáld meg most már egyetlen lépésben, mindezt észben tartva összerakni ezt a kifejezést: $(3x + 4)^2$
Melyik a helyes végeredmény?`,
        options: ['$9x^2 + 16$', '$9x^2 + 24x + 16$', '$3x^2 + 24x + 16$'],
        correctAnswer: '$9x^2 + 24x + 16$',
        hint: 'Első tag négyzete $(3x)^2 = 9x^2$. Kétszeres szorzat: $2 \\cdot 3x \\cdot 4 = 24x$. Második tag négyzete: $4^2 = 16$.',
        successMessage: 'Kiváló alkalmazás! Hibátlanul felírtad egyetlen lépésből a nehezebb tagokkal is.'
    },

    // --- (a-b)^2 ---
    {
        id: 'calc-steps-intro-2',
        type: 'theory',
        title: 'Gyakorlás lépésről lépésre',
        content: `**2. Két tag különbségének négyzete**
Nézzünk meg egy hasonlót, kivonással:
$$(a - b)^2$$
Ez azt jelenti: $(a-b)(a-b)$. Menjünk végig a szorzáson együtt!`
    },
    {
        id: 'id-fwd-diff-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $(a - b)(a - b)$**
        
1. lépés: Végezzük el az $(a-b)(a-b)$ szorzást tagról tagra! Ügyelj az előjelekre. Mi lesz az eredmény?`,
        options: ['$a^2 - ab - ab + b^2$', '$a^2 + ab + ab - b^2$', '$a^2 - b^2$'],
        correctAnswer: '$a^2 - ab - ab + b^2$',
        hint: "Negatívszor negatív az pozitív! ($-b \\cdot -b = +b^2$)",
        successMessage: "Helyes! Az előjelek nagyon fontosak. Figyeld meg a végét: a $-b$ négyzete pozitív $b^2$ lett."
    },
    {
        id: 'id-fwd-diff-theory',
        type: 'theory',
        title: 'Szabály: Két tag különbségének négyzete',
        content: `Összevonva a középső tagokat ($-ab$ és $-ab$), pontosan $-2ab$-t kapunk. A végső $b^2$ viszont a mínusz szor mínusz miatt pozitív marad!

Így az alábbi a második azonosság általános képlete:
$$(a - b)^2 = a^2 - 2ab + b^2$$`
    },
    {
        id: 'id-fwd-diff-prac-intro',
        type: 'theory',
        title: 'Összerakás építőkockákból',
        content: `Gyakoroljuk ezt az azonosságot is lépésről lépésre: 
$$(x - 6)^2$$
A képlet: $a^2 - 2ab + b^2$. Keresük meg a három építőkockát!`
    },
    {
        id: 'id-fwd-diff-prac-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $(x - 6)^2$**
        
1. építőkocka ($a^2$): Mi lesz az első tag négyzete, ha $a = x$?`,
        options: ['$x^2$', '$2x$', '$x$'],
        correctAnswer: '$x^2$',
        hint: '$(x)^2 = x^2$.',
        successMessage: 'Helyes! Az első építőkockánk az $x^2$.'
    },
    {
        id: 'id-fwd-diff-prac-2',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $x^2 - 2ab + b^2$**
        
2. építőkocka ($2ab$): Mennyi a kétszeres szorzat értéke (az előjel nélkül, az már ott van a képletben), ha $a = x$ és $b = 6$?`,
        options: ['$6x$', '$12x$', '$12$'],
        correctAnswer: '$12x$',
        hint: 'Szorozd össze őket, majd duplázd meg: $2 \\cdot x \\cdot 6$.',
        successMessage: 'Így van! A második építőkockánk a $12x$. A képlet miatt ez kivonásként kerül be: $-12x$.'
    },
    {
        id: 'id-fwd-diff-prac-3',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $x^2 - 12x + b^2$**
        
3. építőkocka ($b^2$): Végül mi lesz a második tag négyzete, ha $b = 6$?`,
        options: ['$12$', '$36$', '$6$'],
        correctAnswer: '$36$',
        hint: '$6^2 = 6 \\cdot 6 = 36$.',
        successMessage: 'Szuper! Ezzel össze is állt a végeredmény: $x^2 - 12x + 36$.'
    },
    {
        id: 'id-fwd-diff-prac-hard',
        type: 'question',
        inputType: 'multiple-choice',
        question: `Alkalmazzuk a szabályt ismét, de most egy lépésben: Számítsd ki az $(y - 4)^2$ kifejezést!
Melyik a helyes eredmény?`,
        options: ['$y^2 - 16$', '$y^2 + 8y - 16$', '$y^2 - 8y + 16$'],
        correctAnswer: '$y^2 - 8y + 16$',
        hint: 'A képlet alapján: $y^2 - 2 \\cdot y \\cdot 4 + 4^2$.',
        successMessage: 'Bravó! Sikerült alkalmazni a második szabályt is: $y^2 - 8y + 16$. Ne feledd: a vége mindig pozitív!'
    },

    // --- (a+b)(a-b) ---
    {
        id: 'calc-steps-intro-3',
        type: 'theory',
        title: 'Gyakorlás lépésről lépésre',
        content: `**3. Két tag összegének és különbségének szorzata**
Végül jöjjön az az eset, amikor egy összeget és egy különbséget szorzunk össze:
$$(a + b)(a - b)$$
Ezt is számoljuk ki először a hosszú úton!`
    },
    {
        id: 'id-fwd-prod-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $(a + b)(a - b)$**
        
1. lépés: Szorozzunk be minden tagot minden taggal! Mi lesz az eredménye az $(a+b)(a-b)$ szorzásnak?`,
        options: ['$a^2 - ab + ab - b^2$', '$a^2 - 2ab + b^2$', '$a^2 + ab - ab + b^2$'],
        correctAnswer: '$a^2 - ab + ab - b^2$',
        hint: '$a \\cdot a = a^2$, $a \\cdot (-b) = -ab$, $b \\cdot a = +ab$, $b \\cdot (-b) = -b^2$.',
        successMessage: 'Így van! Figyeld meg a két középső tagot: az egyik pozitív, a másik negatív.'
    },
    {
        id: 'id-fwd-prod-theory',
        type: 'theory',
        title: 'Szabály: Két tag négyzetének különbsége',
        content: `Mivel a két középső tag pontosan kiejti egymást ($-ab + ab = 0$), csak az első és az utolsó tag marad! 

Így kapjuk az utolsó, roppant egyszerű alakot öltő azonosságot:
$$(a + b)(a - b) = a^2 - b^2$$`
    },
    {
        id: 'id-fwd-prod-prac-intro',
        type: 'theory',
        title: 'Összerakás építőkockákból',
        content: `Gyakoroljunk ezzel is lépésről lépésre egy egyszerűbb példán:
$$(x + 8)(x - 8)$$
A képlet: $a^2 - b^2$. Itt csak két építőkocka van!`
    },
    {
        id: 'id-fwd-prod-prac-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $(x + 8)(x - 8)$**
        
1. építőkocka ($a^2$): Mi lesz az első tag négyzete, ha $a = x$?`,
        options: ['$x^2$', '$2x^2$', '$8x^2$'],
        correctAnswer: '$x^2$',
        hint: '$(x)^2 = x^2$.',
        successMessage: 'Helyes! Az első építőkockánk az $x^2$.'
    },
    {
        id: 'id-fwd-prod-prac-2',
        type: 'question',
        inputType: 'multiple-choice',
        question: `**Aktuális kifejezés: $x^2 - b^2$**
        
2. építőkocka ($b^2$): Mi lesz a második tag négyzete, ha $b = 8$?`,
        options: ['$16$', '$64$', '$8$'],
        correctAnswer: '$64$',
        hint: '$8^2 = 8 \\cdot 8 = 64$.',
        successMessage: 'Így van! Ezzel meg is van a gyorsított végeredményünk mindenféle hosszas szorzás nélkül: $x^2 - 64$.'
    },
    {
        id: 'id-fwd-prod-prac-hard',
        type: 'question',
        inputType: 'multiple-choice',
        question: `Alkalmazzuk az elvet itt is egyből a végeredményre: Számítsd ki az $(a + 10)(a - 10)$ szorzatot a szabály segítségével!
Melyik a pontos eredmény?`,
        options: ['$a^2 - 100$', '$a^2 - 20$', '$a^2 + 100$'],
        correctAnswer: '$a^2 - 100$',
        hint: 'Csak emeld négyzetre az elsőt ($a^2$), majd vonj ki belőle a második négyzetét ($10^2$).',
        successMessage: 'Kiváló! Látod, ilyen egyszerű a harmadik azonosság alkalmazása.'
    },
    {
        id: 'practice-identities-1',
        type: 'question',
        inputType: 'matching',
        question: `A végére egy kis gyors gyakorlás: Párosítsd a szorzatalakokat a megfelelő bontott alakkal!`,
        matchPairs: [
            { left: '$(x + y)(x - y)$', right: '$x^2 - y^2$' },
            { left: '$(x - y)^2$', right: '$x^2 - 2xy + y^2$' },
            { left: '$(2x - 3)^2$', right: '$4x^2 - 12x + 9$' }
        ],
        correctAnswer: 'implied',
        hint: 'Figyeld meg a kétszeres szorzatokat (középső tag) és az előjeleket!',
        successMessage: 'Tökéletes! A nevezetes azonosságok felismerése és kifejtése már mesteri szinten megy neked!'
    },
    // --- 4. TELJES NÉGYZETTÉ ALAKÍTÁS ---
    {
        id: 'completing-square-theory',
        type: 'theory',
        title: '4. Teljes négyzetté alakítás - Lépések',
        content: `A teljes négyzetté alakítást akkor szokás alkalmazni, amikor egy másodfokú és egy elsőfokú tag van a kifejezésben. A célunk az $a \\cdot x^2 + b \\cdot x + c$ alakot átalakítani szorzattá.
    
**Módszer ($x^2$ együtthatója 1):**
1. Vegyük az $(x \\pm \\text{valami})^2$ alakot, ahol a "valami" az $x$ együtthatójának a fele.
2. Emeljük négyzetre képzeletben: ebből megkapjuk az $x^2$-es és az $x$-es tagot, valamint egy konstans "felesleget".
3. Vonjuk ki ezt a felesleges konstanst, és adjuk hozzá az eredeti konstanst, ha volt.
4. Használjuk az $A^2 - B^2 = (A-B)(A+B)$ azonosságot a szorzattá alakításhoz.`
    },
    {
        id: 'completing-square-example',
        type: 'theory',
        title: 'Példa teljes négyzetté alakításra',
        content: `Nézzünk egy gyakorlati példát arra, hogyan alakítunk teljes négyzetté egy másodfokú kifejezést, majd hogyan használjuk fel az $A^2 - B^2 = (A-B)(A+B)$ azonosságot a teljes szorzattá alakításhoz!

**Példa:** $x^2 - 2x - 3$
1. Az $x$ együtthatója $-2$, aminek a fele $-1$. Írjuk fel a négyzetet: $(x - 1)^2$
2. Mivel $(x - 1)^2 = x^2 - 2x + 1$, de nekünk eredetileg $-3$ van a végén, ezért le kell vonnunk $1$-et (a felesleget) és utána a $-3$-at is beírni.
3. Tehát: $(x - 1)^2 - 1 - 3 = (x - 1)^2 - 4$
4. Mivel $4 = 2^2$, felírhatjuk a két négyzet különbségét: $(x - 1)^2 - 2^2$
5. Használva az $A^2 - B^2$ azonosságot, ahol $A = (x-1)$ és $B = 2$:
   $[(x - 1) - 2] \\cdot [(x - 1) + 2] = (x - 3)(x + 1)$`
    },
    {
        id: 'sq-step-intro-1',
        type: 'theory',
        title: 'Gyakorlás lépésről lépésre (1/2)',
        content: `Most alakítsuk szorzattá a következő kifejezést közösen, ahogyan az előbb láttuk: $$x^2 + x - 6$$`
    },
    {
        id: 'sq-step1-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `1. lépés: Mivel az $x$ együtthatója 1, minek a négyzetével érdemes kezdeni?`,
        options: ['$(x + 1)^2$', '$(x + 0,5)^2$', '$(x - 0,5)^2$'],
        correctAnswer: '$(x + 0,5)^2$',
        hint: 'Az együttható fele a nyerő.',
        successMessage: 'Helyes! $(x + 0,5)^2 = x^2 + x + 0,25$.'
    },
    {
        id: 'sq-step1-2',
        type: 'question',
        inputType: 'multiple-choice',
        question: `2. lépés: Ha kiindulunk az $(x+0,5)^2$-ből, amiben van egy $+0,25$ "felesleg", és eredetileg $-6$ volt a kifejezésünk, mi lesz az új állás?`,
        options: [
            '$(x + 0,5)^2 - 6$',
            '$(x + 0,5)^2 - 6,25$',
            '$(x + 0,5)^2 + 5,75$'
        ],
        correctAnswer: '$(x + 0,5)^2 - 6,25$',
        hint: 'A felesleges $0,25$-öt és az eredeti $6$-ot is le kell vonni.',
        successMessage: 'Így van! Az új alak $(x + 0,5)^2 - 6,25$.'
    },
    {
        id: 'sq-step1-3',
        type: 'question',
        inputType: 'multiple-choice',
        question: `3. lépés: Látjuk, hogy $6,25 = 2,5^2$. Alkalmazzuk az $a^2 - b^2$ azonosságot a $(x + 0,5)^2 - 2,5^2$ kifejezésre! Mi lesz a szorzatalak?`,
        options: [
            '$(x - 2)(x + 3)$',
            '$(x + 2)(x - 3)$',
            '$(x - 2,5)(x + 2,5)$'
        ],
        correctAnswer: '$(x - 2)(x + 3)$',
        hint: '$A = (x + 0,5)$ és $B = 2,5$. Vagyis $(x + 0,5 - 2,5)(x + 0,5 + 2,5)$.',
        successMessage: 'Kiváló! Észrevetted: $(x - 2)(x + 3)$!'
    },
    {
        id: 'sq-step-intro-2',
        type: 'theory',
        title: 'Gyakorlás lépésről lépésre (2/2)',
        content: `Második közös feladat. Bontsuk fel a következőt: $$x^2 - 4x - 5$$`
    },
    {
        id: 'sq-step2-1',
        type: 'question',
        inputType: 'multiple-choice',
        question: `1. lépés: Mi legyen a zárójelben a négyzeten?`,
        options: ['$(x - 4)^2$', '$(x - 2)^2$', '$(x + 2)^2$'],
        correctAnswer: '$(x - 2)^2$',
        hint: 'Nézd meg az $x$ együtthatóját ($-4$), és vedd a felét!',
        successMessage: 'Tökéletes, $(x - 2)^2 = x^2 - 4x + 4$.'
    },
    {
        id: 'sq-step2-2',
        type: 'question',
        inputType: 'multiple-choice',
        question: `2. lépés: A $(x - 2)^2$-be bekerült egy $+4$ amire nincs szükségünk. Ezt levonva, beírva az eredeti $-5$-öt: mi lesz a kifejezés alakja?`,
        options: [
            '$(x - 2)^2 - 1$',
            '$(x - 2)^2 - 9$',
            '$(x - 2)^2 + 1$'
        ],
        correctAnswer: '$(x - 2)^2 - 9$',
        hint: '$-4$ és $-5$ összevonva -9 lesz a vége.',
        successMessage: 'Így van! Így néz ki: $(x - 2)^2 - 9$.'
    },
    {
        id: 'sq-step2-3',
        type: 'question',
        inputType: 'multiple-choice',
        question: `3. lépés: Alkalmazzuk az $A^2 - B^2$ azonosságot az $(x - 2)^2 - 3^2$ kifejezésre! Mi lesz a végeredmény?`,
        options: [
            '$(x - 5)(x + 1)$',
            '$(x + 5)(x - 1)$',
            '$(x - 6)(x + 2)$'
        ],
        correctAnswer: '$(x - 5)(x + 1)$',
        hint: 'Bontsd fel: $(x - 2 - 3)(x - 2 + 3)$.',
        successMessage: 'Zseniális! A szorzatalak $(x - 5)(x + 1)$.'
    },
    {
        id: 'practice-sq-2',
        type: 'question',
        inputType: 'multiple-choice',
        question: `Önálló gyakorló feladat: Alakítsd szorzattá teljes négyzetté alakítással az $x^2 - 2x - 8$ kifejezést!`,
        options: ['$(x - 4)(x + 2)$', '$(x + 4)(x - 2)$', '$(x - 1)(x - 8)$'],
        correctAnswer: '$(x - 4)(x + 2)$',
        hint: 'A kezdés $(x - 1)^2 - 1 - 8 = (x - 1)^2 - 9$. Ebből vonjunk gyököt és bontsuk két zárójelre az eddigiek alapján.',
        successMessage: 'Szuper! A helyes válasz $(x - 4)(x + 2)$.'
    },
    {
        id: 'practice-sq-3',
        type: 'question',
        inputType: 'multiple-choice',
        question: `Utolsó feladat: Alakítsd szorzattá teljes négyzetté alakítással az $x^2 + 6x + 5$ kifejezést!`,
        options: ['$(x + 5)(x + 1)$', '$(x - 5)(x - 1)$', '$(x + 6)(x - 1)$'],
        correctAnswer: '$(x + 5)(x + 1)$',
        hint: 'Kezdő alak: $(x + 3)^2 - 9 + 5 = (x + 3)^2 - 4$.',
        successMessage: 'Tökéletes! Így van, az eredmény: $(x + 5)(x + 1)$.'
    }
];
