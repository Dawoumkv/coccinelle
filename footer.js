// Stopka, zgoda na cookies i statystyki · Pied de page, consentement cookies et statistiques
// Ustawienia w content.js: SITE.madeBy i SITE.analytics.ga4
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

  // ---------- Cookies i statystyki (tylko gdy ustawiono GA4) ----------
  const id = ((SITE.analytics || {}).ga4 || '').trim();
  if (!/^G-[A-Z0-9]+$/.test(id)) return;            // brak ID = brak banera i brak śledzenia
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
  bar.innerHTML = `<p>${T('Używamy plików cookies do anonimowych statystyk odwiedzin, tylko jeśli się zgodzisz.', 'Nous utilisons des cookies pour des statistiques de visite anonymes, uniquement avec votre accord.')}
    <a href="${policy}">${T('Więcej informacji', 'En savoir plus')}</a></p>
    <div class="cookie-actions">
      <button type="button" class="btn btn-ghost" data-c="no">${T('Odrzuć', 'Refuser')}</button>
      <button type="button" class="btn btn-dark" data-c="yes">${T('Akceptuję', 'Accepter')}</button>
    </div>`;
  document.body.appendChild(bar);

  const open = () => { bar.hidden = false; };
  bar.addEventListener('click', e => {
    const b = e.target.closest('[data-c]'); if (!b) return;
    const yes = b.dataset.c === 'yes';
    set(yes ? 'yes' : 'no');
    bar.hidden = true;
    if (yes) loadGA();
    else if (loaded) location.reload();             // wycofanie zgody · retrait du consentement
  });
  document.querySelectorAll('.cookie-open').forEach(b => { b.hidden = false; b.addEventListener('click', open); });

  const choice = get();
  if (choice === 'yes') loadGA();
  else if (choice !== 'no') open();
})();
