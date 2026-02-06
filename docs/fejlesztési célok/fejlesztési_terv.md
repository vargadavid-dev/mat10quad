# Fejlesztési Célok - Matematika

Ez a dokumentum a projekt jövőbeli fejlesztési irányait és tervezett funkcióit tartalmazza.

## 1. Tartalom és Tananyag Bővítése
- [ ] **Magasabb fokú egyenletek:** Harmad- és negyedfokú egyenletek megoldási módszerei (Horner-elrendezés).
- [ ] **Szöveges feladatok:** Valós életből vett problémák, gazdasági és fizikai példák.
- [ ] **Paraméteres egyenletek:** Mélyebb elméleti anyag a paraméteres vizsgálatokhoz.
- [ ] **Geometria modul:** Szerkesztési feladatok és területszámítás integrálása.
- [ ] **Érettségi felkészítő:** Korábbi évek érettségi feladatai témakörökre bontva.

## 2. Intelligens Oktatás (AI & Adaptivitás)
- [x] **Dinamikus feladatgenerálás (prototípus):** `utils/QuestionGenerator.ts` elkészült, képes véletlenszerű, egész gyökökkel rendelkező másodfokú egyenleteket generálni.
- [x] **Dinamikus függvényábrázolás:** `components/FunctionPlotter.tsx` elkészült, precíz és vázlatos módban működik.
- [ ] **AI Tutor:** Chatbot segítség, ami nem mondja meg a megoldást, csak rávezet (pl. "Nézd meg a diszkrimináns előjelét!").
- [ ] **Szintfelmérő rendszer:** A felhasználó tudásszintjéhez igazodó feladatok (adaptív nehézség).
- [ ] **Hibaelemzés:** A rendszer felismeri a tipikus típushibákat (pl. előjelhiba) és célzott gyakorlást ajánl.
- [x] **"Mégegyet kérek!" funkció:** Ha a tanuló úgy érzi, szüksége van még gyakorlásra egy adott típusból, egy gombnyomással generálhat új, hasonló feladatot.

## 3. Gamifikáció és Motiváció (Gamification 2.0)
- [ ] **Tapasztalati pontok (XP) és Szintek:** Minden megoldott feladat XP-t ér, szintlépéskor jutalmak.
- [ ] **Napi Sorozat (Streak):** Motiváció a rendszeres tanulásra (pl. "7 napos láng").
- [ ] **Virtuális Bolt:** Az összegyűjtött pontokból kinézeteket (skineket), avatárokat vagy színtémákat lehet venni.
- [ ] **Jelvények (Badges):** "Mesterlövész" (5 hibátlan feladat), "Maraton" (1 óra tanulás), "Koránkelő".

## 4. Struktúra és Megjelenés (UX/UI)
- [x] **Témakör-választó "Dashboard":** `components/Dashboard.tsx` és `data/categories.ts` elkészült. A főoldalon kártyákon jelennek meg a kategóriák (Algebra, Geometria, stb.) és alkategóriák.
- [x] **Kategória struktúra:** 7 fő kategória (Algebra, Számelmélet, Analízis, Geometria, Gondolkodási módszerek, Valószínűségszámítás, Statisztika) és alkategóriáik definiálva.
- [x] **Vissza gomb:** A tananyagból visszalépés a főoldalra.
- [x] **Breadcrumb navigáció:** Hogy a felhasználó mindig tudja, éppen hol jár (pl. Főoldal > Algebra > Másodfokú > Megoldóképlet).
- [ ] **Sidebar menü:** Bal oldali, becsukható menü a gyors fejezetváltáshoz hosszú tananyagoknál.
- [x] **"Focus Mode":** Gombnyomásra eltűnik minden zavaró elem (menü, lábléc), csak a feladat marad a képernyőn.

## 5. Közösségi Funkciók
- [ ] **Ranglisták (Leaderboards):** Heti és havi rangsor a tanulók között.
- [ ] **Tanári mód (Classroom):** Tanárok saját feladatsorokat állíthatnak össze és követhetik a diákok haladását.
- [ ] **Párbaj mód:** Két tanuló versenyezhet ki oldja meg gyorsabban ugyanazt a feladatot.

## 6. Technikai és Platform Fejlesztések
- [x] **GitHub Actions Deployment:** `.github/workflows/deploy.yml` elkészült (kézi indítás).
- [ ] **Felhasználói fiókok és Mentés:** Adatbázis integráció (Supabase/Firebase) a haladás felhőbe mentéséhez.
- [ ] **Offline Mód (PWA):** Az alkalmazás telepíthető legyen és működjön internet nélkül is.
- [ ] **Mobil App:** React Native verzió a natív iOS/Android élményért.
- [ ] **Sötét mód (Dark Mode):** Szemkímélő éjszakai mód.
- [ ] **Többnyelvűség (i18n):** Angol és német nyelv támogatása.

## 7. Akadálymentesítés
- [ ] **Felolvasó mód:** A feladatok és elmélet hangos felolvasása (TTS).
- [ ] **Diszlexia barát betűtípus:** Opcionálisan kapcsolható betűtípus.
- [ ] **Billentyűzet vezérlés:** Teljes navigáció egér nélkül.

## 8. Minőségbiztosítás
- [ ] **Automatizált tesztek:** Unit és E2E tesztek (Vitest, Cypress).
- [ ] **Teljesítmény optimalizálás:** Gyorsabb betöltés és simább animációk gyengébb eszközökön is.
