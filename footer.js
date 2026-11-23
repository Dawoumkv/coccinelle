// Stopka, zgoda na cookies i statystyki · Pied de page, consentement cookies et statistiques
// Ustawienia w content.js: SITE.madeBy, SITE.contact.map i SITE.analytics.ga4
(function () {
  if (typeof SITE === 'undefined') return;
  const L = typeof LANG !== 'undefined' ? LANG : 'pl';
  const T = (pl, fr) => (L === 'fr' ? fr : pl);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // „Strona wykonana przez …” · « Site réalisé par … »
  const mb = document.getElementById('made-by');
  const by = SITE.madeBy || {};
  if (mb && by.name) {
    const name = by.url && /^https:\/\//.test(by.url)
      ? `<a href="${esc(by.url)}" target="_blank" rel="noopener">${esc(by.name)}</a>` : esc(by.name);
    mb.innerHTML = `${T('Strona wykonana przez', 'Site réalisé par')} ${name}`;
    mb.hidden = false;
  }

  // Dane właściciela na stronach prawnych · Identité sur les pages légales
  const o = SITE.owner || {}, c = SITE.contact || {};
  const ownerLines = [o.name, o.company, o.address, o.nip ? 'NIP: ' + o.nip : '', o.email || c.email]
    .filter(Boolean).map(esc);
  if (c.instagram) ownerLines.push(`Instagram: <a href="https://www.instagram.com/${esc(c.instagram)}/" target="_blank" rel="noopener">@${esc(c.instagram)}</a>`);
  document.querySelectorAll('[data-owner]').forEach(el => { el.innerHTML = ownerLines.join('<br>'); });

  // ---------- Telefon: przyciski Zadzwoń / Napisz na dole (tylko mobile) ----------
  // Barre d'appel en bas, sur mobile uniquement
  if (c.phone) {
    const tel = 'tel:' + c.phone.replace(/\s/g, '');
    const ico = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>';
    const inSub0 = /\/(porady|informacje)\//.test(location.pathname);
    const form = (inSub0 ? '../index.html' : '') + '#wycena';
    const cb = document.createElement('nav');
    cb.className = 'callbar';
    cb.setAttribute('aria-label', T('Szybki kontakt', 'Contact rapide'));
    cb.innerHTML = `<a class="cb-call" href="${esc(tel)}">${ico}<span>${T('Zadzwoń', 'Appeler')}</span></a><a class="cb-write" href="${form}">${T('Napisz do nas', 'Nous écrire')}</a>`;
    document.body.appendChild(cb);
    document.body.classList.add('has-callbar');
  }

  // ---------- Zgoda na cookies: mapa Google i (opcjonalnie) statystyki ----------
  // Consentement : carte Google et, si un ID est renseigné, statistiques GA4
  const id = ((SITE.analytics || {}).ga4 || '').trim();
  const hasGA = /^G-[A-Z0-9]+$/.test(id);
  const hasMap = !!(c.map);
  if (!hasGA && !hasMap) return;                   // nic zewnętrznego = brak banera
  const KEY = 'coccinelle-cookies';
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };

  let loaded = false;
  function loadGA() {
    if (loaded) return; loaded = true;
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }

  const inSub = /\/(porady|informacje)\//.test(location.pathname);
  const policy = (inSub ? '../' : '') + 'informacje/prywatnosc.html' + (L === 'fr' ? '?lang=fr' : '');
  const bar = document.createElement('div');
  bar.className = 'cookie-bar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', T('Zgoda na cookies', 'Consentement aux cookies'));
  bar.hidden = true;
  const what = hasGA && hasMap
    ? T('mapy Google i anonimowych statystyk odwiedzin', 'la carte Google et des statistiques de visite anonymes')
    : hasGA ? T('anonimowych statystyk odwiedzin', 'des statistiques de visite anonymes') : T('mapy Google z dojazdem do pracowni', 'la carte Google de l’accès à l’atelier');
  bar.innerHTML = `<p><strong>${T('Pliki cookies', 'Cookies')}</strong> · ${T('Strona działa bez nich. Za Twoją zgodą użyjemy usług zewnętrznych:', 'Le site fonctionne sans eux. Avec votre accord, nous utilisons des services externes :')} ${what}. ${T('Zgodę możesz zmienić w każdej chwili w stopce.', 'Vous pouvez changer d’avis à tout moment en bas de page.')}
    <a href="${policy}">${T('Więcej informacji', 'En savoir plus')}</a></p>
    <div class="cookie-actions">
      <button type="button" class="btn btn-ghost" data-c="no">${T('Odrzuć', 'Refuser')}</button>
      <button type="button" class="btn btn-dark" data-c="yes">${T('Akceptuję', 'Accepter')}</button>
    </div>`;
  document.body.appendChild(bar);

  const open = () => { bar.hidden = false; };
  bar.addEventListener('click', e => {
    const b = e.target.closest('[data-c]'); if (!b) return;
    const yes = b.dataset.c === 'yes', prev = get();
    set(yes ? 'yes' : 'no');
    bar.hidden = true;
    window.dispatchEvent(new CustomEvent('cocci-consent', { detail: yes ? 'yes' : 'no' }));
    if (yes) { if (hasGA) loadGA(); }
    else if (prev === 'yes') location.reload();      // wycofanie zgody · retrait du consentement
  });
  document.querySelectorAll('.cookie-open').forEach(b => { b.hidden = false; b.addEventListener('click', open); });

  const choice = get();
  if (choice === 'yes') { if (hasGA) loadGA(); }
  else if (choice !== 'no') open();
})();
