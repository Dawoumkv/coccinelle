// =====================================================================
//  TREŚCI DO PODMIANY · CONTENUS À REMPLACER
//  Wszystkie zdjęcia, opisy i dane kontaktowe strony głównej są tutaj.
//  Toutes les images, descriptions et coordonnées de la page d'accueil sont ici.
//
//  Jak podmienić zdjęcie · Remplacer une image :
//    src: 'images/suknia-1.jpg'            ← własne zdjęcie (folder images/)
//    lub unsplash: '1549488497-94b52bddac5d' ← zdjęcie z Unsplash (licencja Unsplash)
//    credit: { name, user }                ← autor (Unsplash) ; pour ses propres photos : credit: null
//  Stopka z autorami generuje się sama · Les crédits du pied de page se génèrent seuls.
// =====================================================================

const SITE = {
  // Wersja prezentacyjna: zdjęcia poglądowe. Ustaw false, gdy pojawią się zdjęcia pracowni.
  // Version de présentation : visuels provisoires. Passer à false avec les vraies photos.
  provisionalVisuals: true,

  // Dane kontaktowe: puste pola są automatycznie ukrywane · Les champs vides sont masqués.
  contact: {
    address: '',            // np. 'ul. Kwiatowa 1, 20-000 Lublin'
    region: { pl: 'województwo lubelskie', fr: 'région de Lublin, Pologne' },
    phone: '',              // np. '+48 600 000 000'
    email: '',              // np. 'kontakt@coccinelle.pl'
    instagram: 'coccinellesuknieslubne',
    facebook: '',           // pełny adres strony na Facebooku · adresse complète de la page Facebook
    consultDuration: { pl: '', fr: '' } // np. { pl: 'ok. 1,5 godziny', fr: 'environ 1 h 30' }
  },

  // Adres, na który formularz wysyła zapytania (np. Formspree: 'https://formspree.io/f/xxxx').
  // Pusty = formularz niepodłączony: strona uczciwie o tym informuje i nic nie udaje.
  // Vide = formulaire non connecté : la page l'indique clairement, sans fausse confirmation.
  formEndpoint: '',

  // Stopka: „Strona wykonana przez …” – puste = ukryte
  // Pied de page : « Site réalisé par … » – vide = masqué
  madeBy: { name: 'DHOWLY', url: 'https://dhowly.com' },

  // Dane właściciela do stron prawnych (regulamin, polityka prywatności).
  // Puste pola są pomijane. · Identité du propriétaire pour les pages légales.
  owner: { name: 'Coccinelle Suknie Ślubne', company: '', address: '', nip: '', email: '' },

  // Statystyki: identyfikator Google Analytics 4 (np. 'G-XXXXXXX').
  // Puste = brak statystyk i brak banera cookies. Statystyki ładują się dopiero po zgodzie.
  // Statistiques : ID Google Analytics 4. Vide = pas de statistiques ni de bandeau cookies.
  analytics: { ga4: '' }
};

// ---------- Zdjęcia sekcji · Images des sections ----------
const IMAGES = {
  hero: { unsplash: '1532712938310-34cb3982ef74', credit: { name: 'Foto Pettine', user: 'fotopettine' },
    alt: { pl: 'Para Młoda na spacerze po wzgórzach', fr: 'Les mariés en promenade dans les collines' } },
  about: { unsplash: '1524563970700-a302b6888e17', credit: { name: 'Wedding Photography', user: 'wedding_photography' },
    alt: { pl: 'Koronkowa suknia ślubna z rzędem guziczków na plecach', fr: 'Robe de mariée en dentelle, rangée de petits boutons dans le dos' } }
};

// ---------- Galeria inspiracji · Galerie d'inspirations ----------
// id: stały identyfikator (zapisany w „Moich inspiracjach”) — nie zmieniaj go po publikacji.
// cat: ksiezniczka | syrenka | minimal | kombinezon
// Opisy dotyczą wyłącznie tego, co widać na zdjęciu · Descriptions limitées à ce que montre la photo.
const GALLERY = [
  { id: 'syrenka-rekawy', cat: 'syrenka', tall: true, unsplash: '1585241920473-b472eb9ffbae', credit: { name: 'Jonathan Borba', user: 'jonathanborba' },
    title: { pl: 'Koronkowa syrenka z rękawami', fr: 'Sirène en dentelle à manches longues' },
    desc: { pl: 'Dopasowana koronkowa suknia, która rozszerza się u dołu. Długie koronkowe rękawy i głęboki dekolt na plecach.', fr: 'Une robe ajustée en dentelle qui s’évase vers le bas, des manches longues en dentelle et un dos largement échancré.' } },
  { id: 'gorset-tiul', cat: 'ksiezniczka', tall: false, unsplash: '1549488497-94b52bddac5d', credit: { name: 'Maria Orlova', user: 'orlovamaria' },
    title: { pl: 'Koronkowy gorset i tiul', fr: 'Bustier en dentelle et tulle' },
    desc: { pl: 'Gorset bez ramiączek z koronkowym wykończeniem i obłok tiulu wokół sylwetki.', fr: 'Un bustier sans bretelles bordé de dentelle, et un nuage de tulle tout autour.' } },
  { id: 'syrenka-welon', cat: 'syrenka', tall: false, unsplash: '1548313093-370cf4ba3892', credit: { name: 'Thomas Christian', user: 'tom_christian' },
    title: { pl: 'Koronkowa syrenka z welonem', fr: 'Sirène en dentelle et voile' },
    desc: { pl: 'Koronkowa suknia bez ramiączek, dopasowana do bioder i rozszerzana ku dołowi. Do tego welon sięgający ziemi.', fr: 'Une robe en dentelle sans bretelles, ajustée sur les hanches puis évasée, avec un voile qui touche le sol.' } },
  { id: 'ksiezniczka-plecy', cat: 'ksiezniczka', tall: false, unsplash: '1622277430358-f4d134452e2e', credit: { name: 'Asdrubal luna', user: 'infectedluna' },
    title: { pl: 'Koronkowe plecy, pełna spódnica', fr: 'Dos en dentelle, jupe ample' },
    desc: { pl: 'Widok od tyłu: koronka na przezroczystym tle i bardzo obszerna, warstwowa spódnica.', fr: 'Vue de dos : de la dentelle sur un fond transparent et une jupe très ample, en plusieurs couches.' } },
  { id: 'kombinezon-golf', cat: 'kombinezon', tall: false, unsplash: '1654512697746-0c7f20924c77', credit: { name: 'Ivan Kazlouskij', user: 'ivankazlouskij' },
    title: { pl: 'Kombinezon z wysokim kołnierzem', fr: 'Combinaison col montant' },
    desc: { pl: 'Gładki biały kombinezon: wysoki kołnierz, długie rękawy i szerokie nogawki.', fr: 'Une combinaison blanche toute simple : col montant, manches longues et jambes larges.' } },
  { id: 'syrenka-wieszak', cat: 'syrenka', tall: true, unsplash: '1529636273736-fc88b31ea9d9', credit: { name: 'Samantha Gades', user: 'srosinger3997' },
    title: { pl: 'Koronkowa syrenka', fr: 'Sirène en dentelle' },
    desc: { pl: 'Suknia bez ramiączek, cała w koronce, zwężana do kolan i rozszerzana ku dołowi.', fr: 'Une robe sans bretelles, entièrement en dentelle, resserrée jusqu’aux genoux puis évasée.' } },
  { id: 'manekin-tren', cat: 'ksiezniczka', tall: false, unsplash: '1594552072238-b8a33785b261', credit: { name: 'Marina Abrosimova', user: 'abrosimova_marina_foto' },
    title: { pl: 'Suknia z długim trenem', fr: 'Robe à longue traîne' },
    desc: { pl: 'Suknia na manekinie: dopasowana góra i zwiewna, przezroczysta warstwa spódnicy zakończona długim trenem.', fr: 'Robe sur mannequin : un buste ajusté et une couche de jupe légère et transparente, terminée par une longue traîne.' } },
  { id: 'syrenka-ramiaczka', cat: 'syrenka', tall: true, unsplash: '1549417229-7686ac5595fd', credit: { name: 'Maria Orlova', user: 'orlovamaria' },
    title: { pl: 'Syrenka na cienkich ramiączkach', fr: 'Sirène à fines bretelles' },
    desc: { pl: 'Koronka dopasowana do sylwetki, cienkie ramiączka i tiulowy dół. Do tego długi welon.', fr: 'Une dentelle qui épouse la silhouette, de fines bretelles et un bas en tulle, avec un long voile.' } },
  { id: 'minimal-rekawy', cat: 'minimal', tall: false, unsplash: '1626008672416-322b4707b86f', credit: { name: 'Karen Willis Holmes', user: 'karenwillisholmes' },
    title: { pl: 'Dekolt V i długie rękawy', fr: 'Décolleté en V et manches longues' },
    desc: { pl: 'Gładka tkanina, dekolt w kształcie litery V i długie rękawy. Prosto i elegancko.', fr: 'Un tissu lisse, un décolleté en V et des manches longues. Simple et élégant.' } },
  { id: 'minimal-ramiona', cat: 'minimal', tall: false, unsplash: '1685531340101-cc469d5224a2', credit: { name: 'aykut bingül', user: 'aykutbingul' },
    title: { pl: 'Odkryte ramiona, prosta linia', fr: 'Épaules dénudées, ligne droite' },
    desc: { pl: 'Gładka suknia z dekoltem odsłaniającym ramiona i prostą, dopasowaną linią.', fr: 'Une robe lisse qui dégage les épaules, avec une ligne droite et près du corps.' } },
  { id: 'kombinezon-dekolt', cat: 'kombinezon', tall: true, unsplash: '1724415980026-8f0d565bd4c1', credit: { name: 'Sueda Dilli', user: 'suedadilli' },
    title: { pl: 'Kombinezon z głębokim dekoltem', fr: 'Combinaison au décolleté plongeant' },
    desc: { pl: 'Biały kombinezon z bardzo głębokim dekoltem w kształcie litery V i odkrytymi ramionami.', fr: 'Une combinaison blanche au décolleté en V très plongeant, épaules dégagées.' } },
  { id: 'minimal-v', cat: 'minimal', tall: true, unsplash: '1641622327741-bcacada475bd', credit: { name: 'Breanna Miller', user: 'goldenpoppyphoto' },
    title: { pl: 'Dopasowana, z dekoltem V', fr: 'Ajustée, décolleté en V' },
    desc: { pl: 'Cienkie ramiączka, dekolt V i gładka tkanina, która lekko rozszerza się u dołu.', fr: 'Fines bretelles, décolleté en V et tissu lisse, légèrement évasé vers le bas.' } },
  { id: 'minimal-guziki', cat: 'minimal', tall: false, unsplash: '1722805739769-b7201151df95', credit: { name: 'Ben Atkins', user: 'benatkinsphotography' },
    title: { pl: 'Satyna i rząd guziczków', fr: 'Satin et rangée de boutons' },
    desc: { pl: 'Odkryte ramiona, gładka satyna i rząd drobnych guziczków wzdłuż pleców.', fr: 'Épaules dénudées, satin lisse et une rangée de petits boutons tout le long du dos.' } }
];

// ---------- „Wasz dzień” · « Votre journée » ----------
const MOMENTS = [
  { unsplash: '1606216794074-735e91aa2c92', credit: { name: 'Jakob Owens', user: 'jakobowens1' }, alt: { pl: 'Para Młoda idzie przez łąkę', fr: 'Les mariés traversent une prairie' } },
  { unsplash: '1537633552985-df8429e8048b', credit: { name: 'Nathan Dumlao', user: 'nate_dumlao' }, tall: true, alt: { pl: 'Para Młoda nad brzegiem morza', fr: 'Les mariés au bord de la mer' } },
  { unsplash: '1606490194859-07c18c9f0968', credit: { name: 'Jakob Owens', user: 'jakobowens1' }, alt: { pl: 'Pocałunek o zachodzie słońca', fr: 'Un baiser au coucher du soleil' } },
  { unsplash: '1606216794079-73f85bbd57d5', credit: { name: 'Jakob Owens', user: 'jakobowens1' }, tall: true, alt: { pl: 'Panna Młoda w białej sukni', fr: 'La mariée en robe blanche' } },
  { unsplash: '1546032996-6dfacbacbf3f', credit: { name: 'Elvis Bekmanis', user: 'bekmanis' }, alt: { pl: 'Chwila Pary Młodej', fr: 'Un moment à deux' } },
  { unsplash: '1595407753234-0882f1e77954', credit: { name: 'Victoria Priessnitz', user: 'victoriapriessnitz' }, alt: { pl: 'Para Młoda przy drewnianej ścianie', fr: 'Les mariés devant un mur en bois' } }
];

// ---------- Kreator: zdjęcia nastroju (krok „Styl”) · Créateur : photos d'ambiance ----------
const KREATOR_STYLE_IMAGES = {
  romantyczny: 'gorset-tiul',
  minimalistyczny: 'minimal-v',
  klasyczny: 'syrenka-welon',
  nowoczesny: 'kombinezon-golf'
};

// ---------- Realizacje pracowni · Créations de l'atelier ----------
// Pusta lista = sekcja ukryta. Liste vide = section masquée.
// Przykład: { src: 'images/realizacja-anna.jpg', title: { pl: '…', fr: '…' }, text: { pl: '…', fr: '…' } }
const REALIZACJE = [];

// ---------- Pomocnicze · Utilitaires ----------
function imgUrl(item, w, h) {
  if (!item) return '';
  if (item.src) return item.src;
  return `https://images.unsplash.com/photo-${item.unsplash}?auto=format&fit=crop&w=${w}&q=75` + (h ? `&h=${h}` : '');
}
function imgSrcset(item, widths, ratio) {
  if (!item || item.src) return '';
  return widths.map(w => `${imgUrl(item, w, ratio ? Math.round(w * ratio) : 0)} ${w}w`).join(', ');
}
