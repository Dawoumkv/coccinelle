# Coccinelle Suknie Ślubne — strona demonstracyjna

Strona wizytówka pracowni **Coccinelle Suknie Ślubne** (suknie ślubne szyte na miarę, woj. lubelskie).
Statyczna strona (HTML/CSS/JS), hostowana na GitHub Pages.

## Gdzie podmienić treści
Wszystkie zdjęcia, opisy galerii, autorzy zdjęć i dane kontaktowe strony głównej są w **`content.js`**:
- `SITE.contact` – adres, telefon, e-mail, Facebook, czas konsultacji. Puste pola są automatycznie ukrywane.
- `SITE.formEndpoint` – adres usługi wysyłki formularza (np. Formspree). Dopóki jest pusty, formularz uczciwie informuje, że wiadomość nie została wysłana, i pozwala ją skopiować.
- `SITE.provisionalVisuals` – `true` pokazuje dyskretną informację, że zdjęcia są poglądowe. Ustaw `false` po wstawieniu zdjęć pracowni.
- `IMAGES`, `GALLERY`, `MOMENTS` – zdjęcia sekcji, galerii inspiracji i „Wasz dzień”. Własne zdjęcie: `src: 'images/nazwa.jpg'` i `credit: null`.
- `REALIZACJE` – prawdziwe suknie z pracowni. Pusta lista = sekcja ukryta.
Stopka z autorami zdjęć generuje się sama. Zdjęcia poglądowe pochodzą z [Unsplash](https://unsplash.com/license) (licencja pozwala na użycie komercyjne).
Zdjęcia artykułów są w `tools/articles.py`.

## Wersja francuska (dla podglądu)
Strona jest domyślnie po polsku. Dodanie `?lang=fr` na końcu adresu pokazuje tłumaczenie francuskie (bez widocznego przełącznika na stronie). Teksty francuskie: `i18n.js`.

## Porady (blog)
10 artykułów dla Par Młodych w folderze `porady/` (PL + FR pod `?lang=fr`).
Treść jest w `tools/articles.py`. Po każdej zmianie uruchom `python3 tools/build_blog.py` – wygeneruje strony i odświeży 3 karty na stronie głównej.
