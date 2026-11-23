# Coccinelle Suknie Ślubne — strona demonstracyjna

Strona wizytówka pracowni **Coccinelle Suknie Ślubne** (suknie ślubne szyte na miarę, woj. lubelskie).
Statyczna strona (HTML/CSS/JS), hostowana na GitHub Pages.

## Do uzupełnienia
- **Zdjęcia**: obecnie zdjęcia poglądowe z [Unsplash](https://unsplash.com/license) (darmowe, także do użytku komercyjnego; autorzy wymienieni w stopce i pod artykułami). Gdy pracownia przekaże własne zdjęcia sukni, podmień adresy w galerii w `index.html` (np. na `images/suknia-1.jpg`). Stare grafiki SVG zostają w `images/` jako zapas.
- **Kontakt**: adres pracowni, telefon i e-mail (oznaczone na żółto w sekcji „Kontakt”).
- **Facebook**: dokładny adres strony (obecnie link do wyszukiwarki Facebooka).
- **Formularz wyceny**: obecnie wersja demo (bez wysyłki). Można podłączyć np. Formspree lub mailto.

## Wersja francuska (dla podglądu)
Strona jest domyślnie po polsku. Dodanie `?lang=fr` na końcu adresu pokazuje tłumaczenie francuskie (bez widocznego przełącznika na stronie). Teksty francuskie: `i18n.js`.

## Porady (blog)
10 artykułów dla Par Młodych w folderze `porady/` (PL + FR pod `?lang=fr`).
Treść jest w `tools/articles.py`. Po każdej zmianie uruchom `python3 tools/build_blog.py` – wygeneruje strony i odświeży 3 karty na stronie głównej.
