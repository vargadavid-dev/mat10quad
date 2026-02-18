# Fejlesztési Célok - Matekverzum

Ez a dokumentum a projekt jövőbeli fejlesztési irányait és tervezett funkcióit tartalmazza.

---

## 1. Tartalom és Tananyag Bővítése
- [ ] **Magasabb fokú egyenletek:** Harmad- és negyedfokú egyenletek megoldási módszerei (Horner-elrendezés).
- [ ] **Szöveges feladatok:** Valós életből vett problémák, gazdasági és fizikai példák.
- [ ] **Paraméteres egyenletek:** Mélyebb elméleti anyag a paraméteres vizsgálatokhoz.
- [ ] **Geometria modul bővítése:** Szerkesztési feladatok és területszámítás integrálása.
- [ ] **Érettségi felkészítő:** Korábbi évek érettségi feladatai témakörökre bontva.
- [x] **Tudástár (Definíciók és Tételek):**
    - [x] Fogalomtár: Minden témakörhöz tartozó pontos definíciók.
    - [x] Tételgyűjtemény: Bizonyítások és tételek rendszerezett gyűjteménye.
    - [x] "Kisokos": Összesítő nézet a legfontosabb képletekkel (Cheatsheet).
    - [ ] Flashcard nézet: Kiválasztott fejezetekhez kártya-alapú tanulási mód (fogalom/definíció párok, lapozható kártyák).

---

## 2. Intelligens Oktatás (AI & Adaptivitás)
- [x] **Dinamikus feladatgenerálás:** `utils/QuestionGenerator.ts` elkészült, véletlenszerű feladatokat generál.
- [x] **Dinamikus függvényábrázolás:** `components/FunctionPlotter.tsx` elkészült, precíz és vázlatos módban.
- [x] **"Mégegyet kérek!" funkció:** Gombnyomással új, hasonló feladat generálása.
- [x] **Összefoglaló kvíz (fejezet végén):** Opcionális "dolgozat" a fejezet végén, ami nem kötelező a továbbhaladáshoz.
- [ ] **AI Tutor:** Chatbot segítség, ami nem mondja meg a megoldást, csak rávezet.
- [ ] **Szintfelmérő rendszer:** A felhasználó tudásszintjéhez igazodó feladatok (adaptív nehézség).
- [ ] **Intelligens hibaelemzés:** A rendszer felismeri a tipikus hibákat és célzott gyakorlást ajánl.
- [ ] **Többszintű segítségnyújtás:**
    - [ ] 1. szint: Csak jelzi a hibát.
    - [ ] 2. szint: Megjelenik a statikus hint.
    - [ ] 3. szint: Részletes levezetés vagy az első lépés megmutatása.
- [ ] **Animált levezetések:** Bonyolultabb elméletnél lépésről-lépésre megjelenő levezetés.
- [ ] **Felfedező matematika (Explorables):** Csúszkákkal/paraméterekkel a diák maga fedezi fel az összefüggéseket.

---

## 3. Gamifikáció és Motiváció
- [ ] **Tapasztalati pontok (XP) és Szintek:** Minden feladat XP-t ér, szintlépéskor jutalmak.
- [ ] **Napi Sorozat (Streak):** Rendszeres tanulásra motiváló funkció.
- [ ] **Virtuális Bolt:** Összegyűjtött pontokból kinézetek, avatárok, színtémák.
- [ ] **Jelvények (Badges):** "Mesterlövész", "Maraton", "Koránkelő" stb.
- [ ] **Boss Fight / Időre menő kvíz:** Fejezet végén időkorláttal, feszültséget adva.
- [ ] **Hanghatások (Audio Feedback):**
    - [ ] Kellemes csilingelés helyes válasznál.
    - [ ] Tompa hang hibás válasznál.
    - [ ] Ünnepélyes fanfár fejezet végén.

---

## 4. Oklevél és Hitelesítés
- [x] **Oklevél generálás (PDF):** A kvíz végén a diák beírhatja a nevét, és letölthet PDF oklevelet (név, fejezet, eredmény, dátum).
- [x] **Hitelesítési kód:** Az oklevélen Base64-kódolt adat, ami tartalmazza a tanuló nevét, fejezetcímet, eredményt és dátumot.
- [x] **Ellenőrző oldal:** A Dashboard láblécéből elérhető oldal, ahol a kóddal visszaellenőrizhetők az oklevél adatai.
- [ ] **QR-kód az oklevélen:** A hosszú szöveges hitelesítési kód helyett QR-kód generálása a PDF-re (`qrcode` npm csomag + jsPDF `.addImage()`). Telefonnal befotózva azonnal kiolvashatók az adatok.

---

## 5. Struktúra és Megjelenés (UX/UI)
- [x] **Témakör-választó Dashboard:** Főoldalon kártyákon kategóriák és alkategóriák.
- [x] **Kategória struktúra:** 7 fő kategória (Algebra, Számelmélet, Analízis, Geometria, stb.).
- [x] **Vissza gomb:** Visszalépés a főoldalra.
- [x] **Breadcrumb navigáció:** A felhasználó mindig tudja, hol jár.
- [x] **Focus Mode:** Eltűnik minden zavaró elem, csak a feladat marad.
- [x] **Branding (Matekverzum):** Rakéta logó, szlogen, egységes arculat.
- [x] **Sötét mód (Dark Mode):** Szemkímélő éjszakai mód.
- [x] **Galaktikus téma:** Animált csillagmező háttér, sci-fi stílusú UI, neon keretek.
- [ ] **Sidebar menü:** Bal oldali, becsukható menü gyors fejezetváltáshoz.
- [ ] **Lebegő képletgyűjtemény:** Mindig elérhető gomb a képernyő sarkában a legfontosabb képletekkel.
- [ ] **Virtuális matematikai billentyűzet:** Mobilon saját gombsor (√, π, x², ± stb.).

---

## 6. Közösségi Funkciók
- [x] **Valós idejű Aréna (Duel & Relay):** PeerJS alapú multiplayer mód.
- [x] **Váltófutás (Relay) mód:** Csapatos játék, soron következő játékos kapja a feladatot.
- [x] **Területszerzés (Galactic Expansion):** Hatszöges játéktér, Logic Shield mechanika, körökre osztott stratégia.
- [ ] **Ranglisták (Leaderboards):** Heti és havi rangsor.
- [ ] **Tanári mód (Classroom):** Saját feladatsorok összeállítása, haladás követése.
- [ ] **Párbaj mód (1v1):** Verseny, ki oldja meg gyorsabban.
- [ ] **Közösségi gondolkodás:** Névtelenített válaszok megosztása közös megbeszéléshez.

---

## 7. Technikai és Platform Fejlesztések
- [x] **GitHub Actions Deployment:** Automatizált deploy GitHub Pages-re.
- [ ] **CI/CD Pipeline:** Automatikus tesztfuttatás minden PR-nél.
- [ ] **Felhasználói fiókok:** Adatbázis integráció (Supabase/Firebase) a haladás mentéséhez.
- [ ] **Offline Mód (PWA):** Telepíthető, internet nélkül is működő alkalmazás.
- [ ] **Mobil App:** React Native verzió natív iOS/Android élményért.
- [ ] **Többnyelvűség (i18n):** Angol és német nyelv.
- [ ] **Analitika:** Látogatói statisztikák (GoatCounter/Plausible).

---

## 8. Akadálymentesítés
- [ ] **Felolvasó mód:** Feladatok és elmélet hangos felolvasása (TTS).
- [ ] **Diszlexia barát betűtípus:** Opcionálisan kapcsolható.
- [ ] **Billentyűzet vezérlés:** Teljes navigáció egér nélkül.

---

## 9. Minőségbiztosítás
- [ ] **Automatizált tesztek:** Unit és E2E tesztek (Vitest, Cypress).
- [ ] **Teljesítmény optimalizálás:** Gyorsabb betöltés, simább animációk.
- [ ] **Visszajelzés:** Hibabejelentő űrlap vagy gomb.

---

## 10. Inspiráció és Pedagógiai Elvek
*A szakirodalom és piacvezető platformok (Khan Academy, Brilliant, Desmos) alapján:*

- [ ] **Micro-learning (Brilliant.org mintára):** Apró, interaktív morzsákra bontott tananyag.
- [ ] **Spaced Repetition:** Automatikus visszahozás régebben tanult, nehezebben menő témáknak.
- [ ] **"Low floor, high ceiling" feladatok:** Könnyű belekezdeni, de mély összefüggésekig vihető.
