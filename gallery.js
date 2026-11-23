// Galeria inspiracji: karty, filtry, fiche (szczegóły) i „Moje inspiracje”.
// Galerie : cartes, filtres, fiche détaillée et « Mes inspirations ».
(function () {
  const grid = document.getElementById('gallery');
  if (!grid || typeof GALLERY === 'undefined') return;
  const { L, T, tr, esc, store, reduced } = window.CocciUtil;
  const CATS = {
    ksiezniczka: T('Księżniczka', 'Princesse'), syrenka: T('Syrenka', 'Sirène'),
    minimal: T('Minimalistyczna', 'Minimaliste'), kombinezon: T('Kombinezon', 'Combinaison')
  };
  const byId = id => GALLERY.find(g => g.id === id);
  const heart = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.5 0 5.4 3.5 4.1 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>';

  // ---------- Ulubione (zapisywane po identyfikatorach) ----------
  const FKEY = 'coccinelle-inspiracje';
  let favs = (store.get(FKEY) || []).filter(byId);
  const shared = new URLSearchParams(location.search).get('fav');
  const sharedIds = shared ? shared.split(',').filter(byId) : [];
  sharedIds.forEach(id => { if (!favs.includes(id)) favs.push(id); });
  const saveFav = () => store.set(FKEY, favs);
  const isFav = id => favs.includes(id);
  function toggleFav(id) {
    favs = isFav(id) ? favs.filter(x => x !== id) : [...favs, id];
    saveFav(); sync();
    if (isFav(id) && !reduced()) { pill.classList.remove('pulse'); void pill.offsetWidth; pill.classList.add('pulse'); }
    announce(isFav(id) ? T('Dodano do Twoich inspiracji.', 'Ajoutée à vos inspirations.') : T('Usunięto z Twoich inspiracji.', 'Retirée de vos inspirations.'));
  }

  // ---------- Karty galerii ----------
  grid.innerHTML = GALLERY.map(g => `
    <figure class="g-item${g.tall ? ' tall' : ''} reveal" data-cat="${g.cat}" data-id="${g.id}">
      <button type="button" class="g-open" data-open="${g.id}">
        <img src="${imgUrl(g, 600, 760)}" srcset="${imgSrcset(g, [360, 600, 900], 1.27)}" sizes="(max-width:560px) 50vw, (max-width:860px) 50vw, 33vw" alt="" loading="lazy" width="600" height="760">
        <span class="sr-only">${T('Zobacz szczegóły', 'Voir le détail')}: </span>
      </button>
      <figcaption><span class="g-cat">${CATS[g.cat] || ''}</span>${esc(tr(g.title))}</figcaption>
      <button type="button" class="fav-btn" data-fav="${g.id}" aria-pressed="false" aria-label="${T('Dodaj do moich inspiracji', 'Ajouter à mes inspirations')}: ${esc(tr(g.title))}">${heart}</button>
    </figure>`).join('');
  // tytuł w przycisku dla czytników ekranu
  grid.querySelectorAll('.g-open').forEach(b => { b.querySelector('.sr-only').textContent += tr(byId(b.dataset.open).title); });

  // ---------- Filtry ----------
  const filters = document.querySelectorAll('.filters button');
  const status = document.getElementById('gallery-status');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.setAttribute('aria-pressed', b === btn));
    const f = btn.dataset.filter;
    let n = 0;
    grid.querySelectorAll('.g-item').forEach(it => { const show = f === 'all' || it.dataset.cat === f; it.hidden = !show; if (show) { n++; it.classList.add('in'); } });
    if (status) status.textContent = n ? T(`Wyświetlono: ${n}`, `${n} inspiration${n > 1 ? 's' : ''} affichée${n > 1 ? 's' : ''}`) : T('Brak inspiracji w tej kategorii.', 'Aucune inspiration dans cette catégorie.');
  }));

  // ---------- Fiche (szczegóły) ----------
  const sheet = document.createElement('dialog');
  sheet.className = 'sheet';
  sheet.setAttribute('aria-labelledby', 'sheet-title');
  document.body.appendChild(sheet);
  let current = null, lastFocus = null;
  const visibleIds = () => [...grid.querySelectorAll('.g-item:not([hidden])')].map(f => f.dataset.id);

  function renderSheet() {
    const g = byId(current); if (!g) return;
    const ids = visibleIds(), i = ids.indexOf(current);
    sheet.innerHTML = `
      <div class="sheet-inner">
        <figure class="sheet-img"><img src="${imgUrl(g, 1100, 1400)}" srcset="${imgSrcset(g, [700, 1100, 1500], 1.27)}" sizes="(max-width:860px) 100vw, 55vw" alt="${esc(tr(g.title))}" width="1100" height="1400"></figure>
        <div class="sheet-body">
          <p class="eyebrow">${T('Inspiracja', 'Inspiration')} · ${CATS[g.cat] || ''}</p>
          <h3 id="sheet-title" tabindex="-1">${esc(tr(g.title))}</h3>
          <p class="sheet-desc">${esc(tr(g.desc))}</p>
          <div class="sheet-actions">
            <button type="button" class="btn btn-ghost fav-toggle" data-fav="${g.id}" aria-pressed="${isFav(g.id)}">${heart}<span>${isFav(g.id) ? T('W moich inspiracjach', 'Dans mes inspirations') : T('Dodaj do moich inspiracji', 'Ajouter à mes inspirations')}</span></button>
            <button type="button" class="btn btn-dark" data-discuss="${g.id}">${T('Porozmawiajmy o tej sukni', 'Discuter de cette robe')}</button>
          </div>
          <p class="sheet-note">${T('Zdjęcie poglądowe, nie realizacja pracowni. Każdą suknię szyjemy od podstaw, na Twoją miarę.', 'Photo d’illustration, pas une création de l’atelier. Chaque robe est cousue de A à Z, à vos mesures.')}
            ${g.credit ? `<br>${T('Fot.', 'Photo :')} <a href="https://unsplash.com/@${esc(g.credit.user)}?utm_source=coccinelle&amp;utm_medium=referral" target="_blank" rel="noopener">${esc(g.credit.name)}</a> / Unsplash` : ''}</p>
          <div class="sheet-nav">
            <button type="button" class="sheet-prev" data-step="-1" ${i <= 0 ? 'disabled' : ''}>← ${T('Poprzednia', 'Précédente')}</button>
            <span>${i + 1} / ${ids.length}</span>
            <button type="button" class="sheet-next" data-step="1" ${i >= ids.length - 1 ? 'disabled' : ''}>${T('Następna', 'Suivante')} →</button>
          </div>
        </div>
        <button type="button" class="sheet-close" aria-label="${T('Zamknij', 'Fermer')}">×</button>
      </div>`;
  }
  function openSheet(id) {
    lastFocus = document.activeElement; current = id; renderSheet();
    if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', '');
    document.body.classList.add('modal-open');
    sheet.querySelector('#sheet-title').focus({ preventScroll: true });
  }
  function closeSheet() {
    if (sheet.open && typeof sheet.close === 'function') sheet.close(); else sheet.removeAttribute('open');
  }
  sheet.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (lastFocus) lastFocus.focus({ preventScroll: true }); });
  sheet.addEventListener('click', e => {
    if (e.target === sheet || e.target.closest('.sheet-close')) return closeSheet();
    const st = e.target.closest('[data-step]');
    if (st) { const ids = visibleIds(); const n = ids[ids.indexOf(current) + +st.dataset.step]; if (n) { current = n; renderSheet(); sheet.querySelector(+st.dataset.step > 0 ? '.sheet-next' : '.sheet-prev').focus(); } return; }
    const f = e.target.closest('[data-fav]');
    if (f) { toggleFav(f.dataset.fav); renderSheet(); sheet.querySelector('.fav-toggle').focus(); return; }
    const d = e.target.closest('[data-discuss]');
    if (d && window.CocciForm) {
      const g = byId(d.dataset.discuss);
      window.CocciForm.attach('suknia-' + g.id, T('Inspiracja', 'Inspiration') + T(': ', ' : ') + tr(g.title), T('Chciałabym porozmawiać o tej inspiracji z galerii', 'J’aimerais parler de cette inspiration de la galerie') + T(': ', ' : ') + tr(g.title) + ` (${CATS[g.cat]})`);
      lastFocus = null; closeSheet();
      window.CocciForm.reveal(T('Inspiracja jest dołączona do wiadomości. Dopisz kilka słów od siebie.', 'L’inspiration est jointe à votre message. Ajoutez quelques mots si vous le souhaitez.'));
    }
  });
  sheet.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const b = sheet.querySelector(e.key === 'ArrowRight' ? '.sheet-next' : '.sheet-prev');
      if (b && !b.disabled && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) b.click();
    }
  });

  grid.addEventListener('click', e => {
    const f = e.target.closest('.fav-btn'); if (f) { toggleFav(f.dataset.fav); return; }
    const o = e.target.closest('[data-open]'); if (o) openSheet(o.dataset.open);
  });

  // ---------- „Moje inspiracje”: przycisk i panel ----------
  const pill = document.createElement('button');
  pill.type = 'button'; pill.className = 'fav-pill';
  pill.setAttribute('aria-haspopup', 'dialog');
  document.body.appendChild(pill);
  const drawer = document.createElement('dialog');
  drawer.className = 'fav-drawer';
  drawer.setAttribute('aria-labelledby', 'fd-title');
  document.body.appendChild(drawer);
  const live = document.createElement('p');
  live.className = 'sr-only'; live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);
  function announce(msg) { live.textContent = ''; setTimeout(() => { live.textContent = msg; }, 30); }

  function sync() {
    grid.querySelectorAll('.g-item').forEach(it => {
      const on = isFav(it.dataset.id);
      it.classList.toggle('is-fav', on);
      const b = it.querySelector('.fav-btn');
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', (on ? T('Usuń z moich inspiracji', 'Retirer de mes inspirations') : T('Dodaj do moich inspiracji', 'Ajouter à mes inspirations')) + T(': ', ' : ') + tr(byId(it.dataset.id).title));
    });
    pill.innerHTML = `${heart}<span>${T('Moje inspiracje', 'Mes inspirations')}</span><b>${favs.length}</b>`;
    pill.setAttribute('aria-label', `${T('Moje inspiracje', 'Mes inspirations')} (${favs.length})`);
    pill.classList.toggle('show', favs.length > 0);
    const attached = window.CocciForm && window.CocciForm.has('inspiracje');
    drawer.innerHTML = `<div class="fd-head"><h3 id="fd-title">${T('Moje inspiracje', 'Mes inspirations')}</h3><button type="button" class="fd-close" aria-label="${T('Zamknij', 'Fermer')}">×</button></div>
      ${favs.length ? `<ul class="fd-list">${favs.map(id => { const g = byId(id); return `<li><button type="button" class="fd-open" data-open="${id}"><img src="${imgUrl(g, 160, 200)}" alt="" width="64" height="80"><span>${esc(tr(g.title))}</span></button><button type="button" class="fd-rm" data-rm="${id}" aria-label="${T('Usuń', 'Retirer')}: ${esc(tr(g.title))}">×</button></li>`; }).join('')}</ul>`
        : `<div class="fd-empty"><p>${T('Nie masz jeszcze zapisanych inspiracji.', 'Vous n’avez pas encore d’inspiration enregistrée.')}</p><p>${T('Kliknij serduszko przy zdjęciu w galerii, a suknia pojawi się tutaj. Lista zostaje w tej przeglądarce także po odświeżeniu strony.', 'Touchez le cœur d’une photo de la galerie : la robe apparaîtra ici. La liste reste dans ce navigateur, même après actualisation.')}</p></div>`}
      <div class="fd-actions">
        <button type="button" class="btn btn-dark" data-fd="attach" ${favs.length ? '' : 'disabled'}>${attached ? T('Zaktualizuj w wiadomości', 'Mettre à jour dans ma demande') : T('Dołącz do wiadomości', 'Joindre à ma demande')}</button>
        <button type="button" class="btn btn-ghost" data-fd="share" ${favs.length ? '' : 'disabled'}>${T('Skopiuj link do listy', 'Copier le lien de la liste')}</button>
        <p class="fd-toast" role="status" aria-live="polite"></p>
      </div>`;
  }
  const openDrawer = () => { sync(); if (typeof drawer.showModal === 'function') drawer.showModal(); else drawer.setAttribute('open', ''); document.body.classList.add('modal-open'); const c = drawer.querySelector('.fd-close'); if (c) c.focus(); };
  const closeDrawer = () => { if (drawer.open && drawer.close) drawer.close(); else drawer.removeAttribute('open'); };
  drawer.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (pill.classList.contains('show')) pill.focus({ preventScroll: true }); });
  pill.addEventListener('click', openDrawer);
  drawer.addEventListener('click', e => {
    if (e.target === drawer || e.target.closest('.fd-close')) return closeDrawer();
    const rm = e.target.closest('[data-rm]');
    if (rm) { toggleFav(rm.dataset.rm); const n = drawer.querySelector('.fd-rm') || drawer.querySelector('.fd-close'); if (n) n.focus(); if (!favs.length && window.CocciForm) window.CocciForm.detach('inspiracje'); return; }
    const op = e.target.closest('[data-open]');
    if (op) { const id = op.dataset.open; closeDrawer(); const card = grid.querySelector(`[data-id="${id}"]`); if (card && card.hidden) document.querySelector('.filters [data-filter="all"]').click(); openSheet(id); return; }
    const a = e.target.closest('[data-fd]'); if (!a) return;
    const toast = drawer.querySelector('.fd-toast');
    if (a.dataset.fd === 'share') {
      const url = location.origin + location.pathname + '?' + (L === 'fr' ? 'lang=fr&' : '') + 'fav=' + favs.join(',') + '#suknie';
      (navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(url) : Promise.reject())
        .then(() => { toast.textContent = T('Link skopiowany. Wyślij go bliskiej osobie.', 'Lien copié. Envoyez-le à une proche.'); })
        .catch(() => { toast.textContent = T('Skopiuj ten link:', 'Copiez ce lien :') + ' ' + url; });
    }
    if (a.dataset.fd === 'attach' && window.CocciForm) {
      const names = favs.map(id => tr(byId(id).title));
      window.CocciForm.attach('inspiracje', `${T('Moje inspiracje', 'Mes inspirations')} (${favs.length})`, T('Moje inspiracje z galerii', 'Mes inspirations de la galerie') + ':\n' + names.map(n => '• ' + n).join('\n'));
      closeDrawer();
      window.CocciForm.reveal(T('Twoje inspiracje są dołączone do wiadomości.', 'Vos inspirations sont jointes à votre demande.'));
    }
  });
  sync();
  if (sharedIds.length) { setTimeout(openDrawer, 400); }
})();
