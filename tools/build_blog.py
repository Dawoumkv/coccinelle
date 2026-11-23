# -*- coding: utf-8 -*-
"""Generuje statyczne strony bloga: porady/index.html i porady/<slug>.html.
Uruchom z katalogu głównego repozytorium:  python3 tools/build_blog.py
"""
import html, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from articles import ARTICLES
from legal import LEGAL, UPDATED

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "porady")
BASE = "https://dawoumkv.github.io/coccinelle/"
V = "16"  # wersja CSS/JS (odświeżenie cache)

def img(pid, w, h=None):
    u = f"https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&w={w}&q=80"
    return u + (f"&h={h}" if h else "")

def credit(a, lang):
    by = "Zdjęcie" if lang == "pl" else "Photo"
    on = "na" if lang == "pl" else "sur"
    return (f'{by}: <a href="https://unsplash.com/@{a["user"]}?utm_source=coccinelle&utm_medium=referral" target="_blank" rel="noopener">{html.escape(a["author"])}</a> '
            f'{on} <a href="https://unsplash.com/?utm_source=coccinelle&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>')

def blocks(body):
    out = []
    for kind, val in body:
        if kind == "p":   out.append(f"<p>{html.escape(val)}</p>")
        elif kind == "h2": out.append(f"<h2>{html.escape(val)}</h2>")
        elif kind in ("ul", "ol"):
            out.append(f"<{kind}>" + "".join(f"<li>{html.escape(x)}</li>" for x in val) + f"</{kind}>")
        elif kind == "owner":
            out.append('<p class="legal-owner" data-owner>Coccinelle Suknie Ślubne</p>')
        elif kind == "tip":
            out.append(f'<aside class="tip"><span class="script">C</span><p>{html.escape(val)}</p></aside>')
    return "\n".join(out)

HEAD = """<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="{ogtype}">
<meta property="og:locale" content="pl_PL">
<meta property="og:site_name" content="Coccinelle Suknie Ślubne">
<meta property="og:url" content="{url}">
<link rel="canonical" href="{url}">
<meta name="twitter:card" content="summary_large_image">
{ogimg}<meta name="theme-color" content="#fbf9f6">
<link rel="icon" href="../images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../images/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Pinyon+Script&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css?v={v}">
<script>document.documentElement.classList.add('js')</script>
{ld}</head>
<body class="blog-page">
<a class="skip-link" href="#main" data-i18n="skip">Przejdź do treści</a>

<header class="nav scrolled" id="top">
  <div class="nav-left">
    <button class="nav-toggle" type="button" aria-label="Otwórz menu" aria-expanded="false" aria-controls="nav-links"><span></span><span></span></button>
    <nav class="nav-links" id="nav-links" aria-label="Menu">
      <a href="../index.html#o-nas" data-i18n="nav.about">O nas</a>
      <a href="../index.html#suknie" data-i18n="nav.dresses">Inspiracje</a>
      <a href="../index.html#kreator" data-i18n="nav.creator">Twoja suknia</a>
      <a href="index.html" data-i18n="nav.blog" class="current">Porady</a>
      <a href="../index.html#pytania" data-i18n="nav.faq">Pytania</a>
      <a href="../index.html#kontakt" data-i18n="nav.contact">Kontakt</a>
      <a href="../index.html#wycena" class="nav-mobile-only" data-i18n="nav.quote">Napisz do nas</a>
    </nav>
  </div>
  <a href="../index.html" class="brand" aria-label="Coccinelle Suknie Ślubne">
    <span class="brand-text">Coccinelle<small>Suknie Ślubne</small></span>
  </a>
  <div class="nav-right">
    <a href="../index.html#wycena" class="nav-cta" data-i18n="nav.quote">Napisz do nas</a>
  </div>
</header>

<main id="main">
"""

FOOT = """
</main>

<footer class="footer">
  <p class="footer-brand">Coccinelle<small>Suknie Ślubne</small></p>
  <p data-i18n="foot.1">Autorska pracownia krawiecka · Hrubieszów, województwo lubelskie</p>
  <nav class="footer-links" aria-label="Informacje prawne" data-i18n-aria="foot.legal">
    <a href="../informacje/regulamin.html" data-i18n="foot.terms">Regulamin</a>
    <a href="../informacje/prywatnosc.html" data-i18n="foot.privacy">Polityka prywatności i cookies</a>
    <button type="button" class="cookie-open" data-i18n="foot.cookies" hidden>Ustawienia cookies</button>
  </nav>
  <p class="muted">© <span id="year"></span> Coccinelle. <span data-provisional data-i18n="foot.2">Wersja prezentacyjna: zdjęcia mają charakter poglądowy i nie przedstawiają realizacji pracowni.</span></p>
  <p class="muted made-by" id="made-by" hidden></p>
</footer>

<script src="../i18n.js?v={v}"></script>
<script src="../content.js?v={v}"></script>
<script src="../script.js?v={v}"></script>
<script src="../footer.js?v={v}"></script>
</body>
</html>
"""

def card(a, prefix=""):
    p, f = a["pl"], a["fr"]
    return f"""    <a class="post-card reveal" href="{prefix}{a['slug']}.html">
      <div class="post-card-img"><img src="{img(a['img'], 700, 520)}" alt="" loading="lazy"></div>
      <p class="post-meta"><span data-lang="pl">{html.escape(p['cat'])} · {p['read']}</span><span data-lang="fr" hidden>{html.escape(f['cat'])} · {f['read']}</span></p>
      <h3><span data-lang="pl">{html.escape(p['title'])}</span><span data-lang="fr" hidden>{html.escape(f['title'])}</span></h3>
      <p class="post-excerpt"><span data-lang="pl">{html.escape(p['lead'])}</span><span data-lang="fr" hidden>{html.escape(f['lead'])}</span></p>
      <span class="post-more" data-i18n="blog.more">Czytaj dalej</span>
    </a>"""

def build_index():
    cards = "\n".join(card(a) for a in ARTICLES)
    page = HEAD.format(title="Porady dla Panny Młodej · Coccinelle Suknie Ślubne",
                       desc="Jak zorganizować ślub, wybrać suknię i niczego nie zapomnieć. Praktyczne porady dla Par Młodych od pracowni Coccinelle.",
                       ogtype="website", url=BASE + "porady/", ogimg=f'<meta property="og:image" content="{img(ARTICLES[0]["img"], 1200, 630)}">\n', v=V, ld="")
    page += f"""<section class="blog-hero">
  <p class="eyebrow" data-i18n="blog.eyebrow">Porady</p>
  <h1 data-i18n="blog.title"><span class="script">Ślubny</span> niezbędnik</h1>
  <p class="lead" data-i18n="blog.lead">Organizacja, suknia, wspomnienia i dzień ślubu – wszystko, o czym warto pomyśleć, zanim powiecie sobie „tak”.</p>
</section>

<section class="blog-list">
  <div class="post-grid">
{cards}
  </div>
</section>
"""
    page += FOOT.format(v=V)
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(page)

def build_article(i, a):
    p, f = a["pl"], a["fr"]
    others = [ARTICLES[(i + k) % len(ARTICLES)] for k in (1, 2, 3)]
    ld = ('<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@type": "Article",
          "headline": p["title"], "image": img(a["img"], 1200), "inLanguage": "pl",
          "publisher": {"@type": "Organization", "name": "Coccinelle Suknie Ślubne"}}, ensure_ascii=False) + '</script>\n')
    page = HEAD.format(title=f"{p['title']} · Coccinelle", desc=html.escape(p["lead"]), ogtype="article", url=BASE + "porady/" + a["slug"] + ".html",
                       ogimg=f'<meta property="og:image" content="{img(a["img"], 1200, 630)}">\n', v=V, ld=ld)
    def art(lang, d):
        hid = "" if lang == "pl" else " hidden"
        back = "Wszystkie porady" if lang == "pl" else "Tous les conseils"
        cta_t = "Marzysz o sukni szytej na miarę?" if lang == "pl" else "Vous rêvez d'une robe sur mesure ?"
        cta_p = ("Pokaż nam, o czym marzysz, a my to dla Ciebie uszyjemy." if lang == "pl"
                 else "La robe dont vous rêvez, créée à vos mesures.")
        cta_b = "Napisz do nas" if lang == "pl" else "Écrire à l’atelier"
        return f"""<article class="post" data-lang="{lang}"{hid}>
  <header class="post-head">
    <a class="post-back" href="index.html">← {back}</a>
    <p class="eyebrow">{html.escape(d['cat'])} · {d['read']}</p>
    <h1>{html.escape(d['title'])}</h1>
    <p class="lead">{html.escape(d['lead'])}</p>
  </header>
  <figure class="post-cover">
    <img src="{img(a['img'], 1400, 800)}" alt="{html.escape(d['title'])}">
    <figcaption>{credit(a, lang)}</figcaption>
  </figure>
  <div class="post-body">
{blocks(d['body'])}
  </div>
  <div class="post-cta">
    <h2>{cta_t}</h2>
    <p>{cta_p}</p>
    <a class="btn btn-dark" href="../index.html#wycena">{cta_b}</a>
  </div>
</article>
"""
    page += art("pl", p) + art("fr", f)
    page += f"""
<section class="blog-list related">
  <div class="section-head"><p class="eyebrow" data-i18n="blog.related">Przeczytaj również</p></div>
  <div class="post-grid three">
{chr(10).join(card(o) for o in others)}
  </div>
</section>
"""
    page += FOOT.format(v=V)
    with open(os.path.join(OUT, a["slug"] + ".html"), "w", encoding="utf-8") as fh:
        fh.write(page)

def build_legal(doc):
    out = os.path.join(ROOT, "informacje")
    os.makedirs(out, exist_ok=True)
    p = doc["pl"]
    page = HEAD.format(title=f"{p['title']} · Coccinelle", desc=html.escape(p["lead"]), ogtype="website",
                       url=BASE + "informacje/" + doc["slug"] + ".html",
                       ogimg=f'<meta property="og:image" content="{BASE}images/og-image.jpg">\n', v=V, ld="")
    page = page.replace('href="index.html" data-i18n="nav.blog" class="current"', 'href="../porady/index.html" data-i18n="nav.blog"')
    page = page.replace('<body class="blog-page">', '<body class="blog-page legal-page">')
    for lang in ("pl", "fr"):
        d = doc[lang]
        hid = "" if lang == "pl" else " hidden"
        page += f"""<article class="post legal" data-lang="{lang}"{hid}>
  <header class="post-head">
    <p class="eyebrow">Coccinelle</p>
    <h1>{html.escape(d['title'])}</h1>
    <p class="lead">{html.escape(d['lead'])}</p>
  </header>
  <div class="post-body">
{blocks(d['body'])}
    <p class="legal-updated">{UPDATED[lang]}</p>
  </div>
</article>
"""
    page += FOOT.format(v=V)
    with open(os.path.join(out, doc["slug"] + ".html"), "w", encoding="utf-8") as fh:
        fh.write(page)

def home_cards():
    """Fragment HTML z 3 kartami na stronę główną (wklejany do index.html)."""
    return "\n".join(card(a, "porady/") for a in ARTICLES[:3])

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    build_index()
    for i, a in enumerate(ARTICLES):
        build_article(i, a)
    for doc in LEGAL:
        build_legal(doc)
    # podmiana kart na stronie głównej między znacznikami
    idx = os.path.join(ROOT, "index.html")
    s = open(idx, encoding="utf-8").read()
    a, b = "<!-- BLOG-CARDS:START -->", "<!-- BLOG-CARDS:END -->"
    if a in s and b in s:
        s = s[: s.index(a) + len(a)] + "\n" + home_cards() + "\n    " + s[s.index(b):]
        open(idx, "w", encoding="utf-8").write(s)
    print(f"OK: {len(ARTICLES)} artykułów w porady/")
