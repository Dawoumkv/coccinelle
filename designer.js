// Kreator „Wymarz swoją suknię”, kalendarz sukni i „Moja selekcja” (ulubione).
// Wszystko działa w przeglądarce, bez konta. Zapis w localStorage (jeśli dostępny).
(function () {
  const L = (typeof LANG !== 'undefined' && LANG === 'fr') ? 'fr' : 'pl';
  const T = (pl, fr) => (L === 'fr' ? fr : pl);
  const U = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80` + (h ? `&h=${h}` : '');
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- Ikony (dekolt / rękawy) ----------
  const B = 'fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"';
  const bodice = 'M17 30 L14 56 H46 L43 30';
  const ico = p => `<svg viewBox="0 0 60 60" aria-hidden="true"><path ${B} d="${p}"/></svg>`;
  const NECK = {
    serce: ico('M17 30 Q19 20 30 26 Q41 20 43 30 ' + 'M17 30 L14 56 H46 L43 30'),
    v: ico('M20 8 L30 34 L40 8 M20 8 Q18 18 17 30 L14 56 H46 L43 30 Q42 18 40 8'),
    kwadrat: ico('M20 8 V22 H40 V8 M20 8 Q18 18 17 30 L14 56 H46 L43 30 Q42 18 40 8'),
    hiszpanka: ico('M6 22 Q30 30 54 22 M6 22 L8 28 Q14 27 17 30 L14 56 H46 L43 30 Q46 27 52 28 L54 22'),
    wysoki: ico('M25 6 Q30 9 35 6 L40 12 Q42 20 43 30 L46 56 H14 L17 30 Q18 20 20 12 Z')
  };
  const SLEEVE = {
    brak: ico('M17 26 Q30 22 43 26 ' + bodice),
    ramiaczka: ico('M21 26 V8 M39 26 V8 M17 26 Q30 22 43 26 ' + bodice),
    krotkie: ico('M20 10 Q30 14 40 10 L43 30 M20 10 L17 30 M20 10 L10 20 L15 25 L18 20 M40 10 L50 20 L45 25 L42 20 M17 30 L14 56 H46 L43 30'),
    dlugie: ico('M20 10 Q30 14 40 10 L43 30 M20 10 L17 30 M20 10 L8 50 L12 51 L18 24 M40 10 L52 50 L48 51 L42 24 M17 30 L14 56 H46 L43 30')
  };

  // ---------- Kroki kreatora ----------
  const STEPS = [
    { id: 'styl', type: 'img', q: T('Jaki styl jest Ci najbliższy?', 'Quelle ambiance vous ressemble ?'), opts: [
      { v: 'romantyczny', img: '1585241920473-b472eb9ffbae', t: T('Romantyczny', 'Romantique'), d: T('koronki, kwiaty, delikatność', 'dentelles, fleurs, douceur') },
      { v: 'minimalistyczny', img: '1622277430358-f4d134452e2e', t: T('Minimalistyczny', 'Minimaliste'), d: T('czysta linia, gładkie tkaniny', 'ligne pure, tissus lisses') },
      { v: 'klasyczny', img: '1548313093-370cf4ba3892', t: T('Klasyczny', 'Classique'), d: T('ponadczasowa elegancja', 'élégance intemporelle') },
      { v: 'nowoczesny', img: '1769230385611-7d1d1c6b3684', t: T('Nowoczesny', 'Moderne'), d: T('odważnie, z charakterem', 'audacieuse, avec du caractère') }
    ] },
    { id: 'fason', type: 'img', q: T('Jaka sylwetka?', 'Quelle silhouette ?'), opts: [
      { v: 'ksiezniczka', img: '1594552072238-b8a33785b261', t: T('Księżniczka', 'Princesse'), d: T('obszerny, bajkowy dół', 'jupe ample et féerique'), form: 1 },
      { v: 'litera-a', img: '1549417229-7686ac5595fd', t: T('Litera A', 'Trapèze'), d: T('delikatnie rozszerzana', 'légèrement évasée'), form: 2 },
      { v: 'syrenka', img: '1529636273736-fc88b31ea9d9', t: T('Syrenka', 'Sirène'), d: T('podkreśla talię i biodra', 'souligne taille et hanches'), form: 3 },
      { v: 'prosta', img: '1492175742197-ed20dc5a6bed', t: T('Prosta', 'Droite'), d: T('minimalistyczna linia', 'ligne minimaliste'), form: 4 },
      { v: 'kombinezon', img: '1769230385611-7d1d1c6b3684', t: T('Kombinezon', 'Combinaison'), d: T('nowocześnie i wygodnie', 'moderne et confortable'), form: 5 }
    ] },
    { id: 'dekolt', type: 'icon', q: T('Jaki dekolt?', 'Quel décolleté ?'), opts: [
      { v: 'serce', icon: NECK.serce, t: T('Serce', 'Cœur') },
      { v: 'v', icon: NECK.v, t: T('Litera V', 'En V') },
      { v: 'kwadrat', icon: NECK.kwadrat, t: T('Kwadratowy', 'Carré') },
      { v: 'hiszpanka', icon: NECK.hiszpanka, t: T('Odkryte ramiona', 'Épaules dénudées') },
      { v: 'wysoki', icon: NECK.wysoki, t: T('Wysoki', 'Montant') }
    ] },
    { id: 'rekawy', type: 'icon', q: T('A rękawy?', 'Et les manches ?'), opts: [
      { v: 'brak', icon: SLEEVE.brak, t: T('Bez rękawów', 'Sans manches') },
      { v: 'ramiaczka', icon: SLEEVE.ramiaczka, t: T('Ramiączka', 'Bretelles') },
      { v: 'krotkie', icon: SLEEVE.krotkie, t: T('Krótkie', 'Courtes') },
      { v: 'dlugie', icon: SLEEVE.dlugie, t: T('Długie, koronkowe', 'Longues, en dentelle') }
    ] },
    { id: 'tkaniny', type: 'swatch', multi: true, q: T('Jakie tkaniny Cię zachwycają?', 'Quelles matières vous font rêver ?'), hint: T('Możesz wybrać kilka.', 'Plusieurs choix possibles.'), opts: [
      { v: 'koronka', sw: 'sw-lace', t: T('Koronka', 'Dentelle') },
      { v: 'tiul', sw: 'sw-tulle', t: T('Tiul', 'Tulle') },
      { v: 'satyna', sw: 'sw-satin', t: T('Satyna & mikado', 'Satin & mikado') },
      { v: 'krepa', sw: 'sw-crepe', t: T('Krepa', 'Crêpe') },
      { v: 'zdobienia', sw: 'sw-pearl', t: T('Perełki & zdobienia', 'Perles & ornements') }
    ] },
    { id: 'data', type: 'date', q: T('Kiedy ślub?', 'Quand a lieu le mariage ?'), hint: T('Pokażemy orientacyjny kalendarz powstawania sukni. Możesz też dodać kilka słów od siebie.', 'Nous vous montrerons un calendrier indicatif de création de la robe. Vous pouvez aussi ajouter quelques mots.') }
  ];

  // ---------- Kalendarz sukni (orientacyjny) ----------
  const MILESTONES = [
    { m: 8, t: T('Pierwsza konsultacja', 'Première consultation'), d: T('rozmowa o marzeniach, inspiracje, wybór kierunku', 'vos envies, vos inspirations, la direction du projet') },
    { m: 7, t: T('Projekt i tkaniny', 'Projet et tissus'), d: T('szkic, dobór koronek, tiuli i zdobień', 'croquis, choix des dentelles, tulles et ornements') },
    { m: 6, t: T('Pomiar', 'Prise de mesures'), d: T('dokładna miara Twojej sylwetki', 'mesures précises de votre silhouette') },
    { m: 4, t: T('Pierwsza przymiarka', 'Premier essayage'), d: T('konstrukcja i dopasowanie', 'construction et ajustement') },
    { m: 2, t: T('Kolejna przymiarka', 'Essayage suivant'), d: T('detale, długość, zdobienia — weź buty!', 'détails, longueur, ornements : apportez vos chaussures !') },
    { m: 1, t: T('Ostatnia przymiarka', 'Dernier essayage'), d: T('ostatnie poprawki', 'dernières retouches') },
    { m: 0.4, t: T('Odbiór sukni', 'Remise de la robe'), d: T('suknia gotowa na Twój dzień', 'la robe est prête pour votre jour') }
  ];
  const fmtDate = d => d.toLocaleDateString(L === 'fr' ? 'fr-FR' : 'pl-PL', { month: 'long', year: 'numeric' });
  function timeline(dateStr) {
    if (!dateStr) return '';
    const wed = new Date(dateStr + 'T12:00:00');
    if (isNaN(wed)) return '';
    const now = new Date();
    const monthsLeft = (wed - now) / (1000 * 60 * 60 * 24 * 30.4);
    let warn = '';
    if (monthsLeft < 0) return '';
    if (monthsLeft < 4) warn = `<p class="tl-warn">${T('Do ślubu zostało niewiele czasu. Napisz do nas jak najszybciej: sprawdzimy, co możemy zrobić.', 'Le mariage approche ! Écrivez-nous au plus vite : nous verrons ce qu\'il est possible de faire.')}</p>`;
    const items = MILESTONES.map(s => {
      let d = new Date(wed.getTime() - s.m * 30.4 * 864e5);
      const past = d < now;
      if (past) d = null;
      return `<li class="${past ? 'past' : ''}"><span class="tl-date">${d ? fmtDate(d) : T('jak najszybciej', 'au plus vite')}</span><strong>${s.t}</strong><span>${s.d}</span></li>`;
    }).join('');
    return `<div class="timeline"><h4>${T('Twój kalendarz sukni', 'Le calendrier de votre robe')}</h4>${warn}<ol>${items}</ol><p class="tl-note">${T('Kalendarz orientacyjny. Dokładne terminy ustalimy razem podczas konsultacji.', 'Calendrier indicatif. Les dates exactes seront fixées ensemble lors de la consultation.')}</p></div>`;
  }

  // ---------- Kreator ----------
  const root = document.getElementById('kreator-app');
  if (root) {
    let state = store.get('coccinelle-kreator') || {};
    let step = 0;
    try { const h = new URLSearchParams(location.search).get('suknia'); if (h) { state = JSON.parse(decodeURIComponent(escape(atob(h)))); step = STEPS.length; } } catch (e) {}
    if (step === 0 && state.styl && 'data' in state) step = STEPS.length; // wróć do gotowej tablicy
    const save = () => store.set('coccinelle-kreator', state);
    const label = (sid, v) => { const s = STEPS.find(x => x.id === sid); const o = s && s.opts && s.opts.find(x => x.v === v); return o ? o.t : ''; };

    function render() {
      if (step >= STEPS.length) return renderBoard();
      const s = STEPS[step];
      const dots = STEPS.map((x, i) => `<span class="${i < step ? 'done' : i === step ? 'on' : ''}"></span>`).join('');
      let body = '';
      if (s.type === 'date') {
        body = `<div class="k-date"><label><span>${T('Data ślubu', 'Date du mariage')}</span><input type="date" id="k-date" value="${esc(state.data || '')}"></label>
          <label><span>${T('Coś jeszcze? (opcjonalnie)', 'Autre chose ? (facultatif)')}</span><textarea id="k-note" rows="3" placeholder="${T('np. ślub w ogrodzie, marzę o długim trenie…', 'ex. mariage dans un jardin, je rêve d\'une longue traîne…')}">${esc(state.note || '')}</textarea></label></div>`;
      } else {
        const sel = state[s.id];
        body = `<div class="k-opts k-${s.type}">` + s.opts.map(o => {
          const on = s.multi ? (sel || []).includes(o.v) : sel === o.v;
          const vis = s.type === 'img' ? `<span class="k-img"><img src="${U(o.img, 500, 640)}" alt="" loading="lazy"></span>`
            : s.type === 'icon' ? `<span class="k-icon">${o.icon}</span>` : `<span class="swatch ${o.sw}"></span>`;
          return `<button type="button" class="k-opt${on ? ' on' : ''}" data-v="${o.v}" aria-pressed="${on}">${vis}<strong>${o.t}</strong>${o.d ? `<small>${o.d}</small>` : ''}</button>`;
        }).join('') + '</div>';
      }
      const canNext = s.type === 'date' || (s.multi ? (state[s.id] || []).length : state[s.id]);
      root.innerHTML = `<div class="k-step">
        <div class="k-progress">${dots}<em>${step + 1} / ${STEPS.length}</em></div>
        <h3>${s.q}</h3>${s.hint ? `<p class="k-hint">${s.hint}</p>` : ''}
        ${body}
        <div class="k-nav">
          ${step > 0 ? `<button type="button" class="btn btn-ghost" data-act="back">${T('Wstecz', 'Retour')}</button>` : '<span></span>'}
          <button type="button" class="btn btn-dark" data-act="next" ${canNext ? '' : 'disabled'}>${step === STEPS.length - 1 ? T('Zobacz moją inspirację', 'Voir mon inspiration') : T('Dalej', 'Suivant')}</button>
        </div></div>`;
    }

    function summaryText() {
      const lines = [
        T('Moja wymarzona suknia (kreator na stronie):', 'Ma robe rêvée (créateur du site) :'),
        `• ${T('Styl', 'Style')}: ${label('styl', state.styl)}`,
        `• ${T('Sylwetka', 'Silhouette')}: ${label('fason', state.fason)}`,
        `• ${T('Dekolt', 'Décolleté')}: ${label('dekolt', state.dekolt)}`,
        `• ${T('Rękawy', 'Manches')}: ${label('rekawy', state.rekawy)}`,
        `• ${T('Tkaniny', 'Matières')}: ${(state.tkaniny || []).map(v => label('tkaniny', v)).join(', ')}`
      ];
      if (state.note) lines.push(`• ${T('Uwagi', 'Remarques')}: ${state.note}`);
      return lines.join('\n');
    }

    function renderBoard() {
      const st = STEPS[0].opts.find(o => o.v === state.styl) || STEPS[0].opts[0];
      const fa = STEPS[1].opts.find(o => o.v === state.fason) || STEPS[1].opts[0];
      const extra = { romantyczny: ['1525169087805-031a4da0623c', '1515934751635-c81c6bc9a2d8'], minimalistyczny: ['1591221662157-6f62de5508eb', '1532454781337-fc3edff34f91'], klasyczny: ['1524563970700-a302b6888e17', '1550005809-91ad75fb315f'], nowoczesny: ['1622398925373-3f91b1e275f5', '1521543832500-49e69fb2bea2'] }[st.v] || [];
      const imgs = [fa.img, st.img !== fa.img ? st.img : extra[1], extra[0]];
      const chips = [
        [T('Styl', 'Style'), label('styl', state.styl)], [T('Sylwetka', 'Silhouette'), label('fason', state.fason)],
        [T('Dekolt', 'Décolleté'), label('dekolt', state.dekolt)], [T('Rękawy', 'Manches'), label('rekawy', state.rekawy)],
        [T('Tkaniny', 'Matières'), (state.tkaniny || []).map(v => label('tkaniny', v)).join(', ')]
      ].filter(c => c[1]).map(c => `<li><span>${c[0]}</span>${esc(c[1])}</li>`).join('');
      const nk = NECK[state.dekolt] || '', sl = SLEEVE[state.rekawy] || '';
      root.innerHTML = `<div class="board" id="board">
        <div class="board-head"><p class="eyebrow">${T('Twoja tablica inspiracji', 'Votre planche d\'inspiration')}</p>
          <h3><span class="script">${T('Twoja', 'Votre')}</span> ${T('wymarzona suknia', 'robe rêvée')}</h3>
          <p>${T('To inspiracja do rozmowy z naszą projektantką, a nie gotowy projekt. Razem dopracujemy każdy detal.', 'C\'est une inspiration à discuter avec notre créatrice, pas un modèle définitif. Ensemble, nous peaufinerons chaque détail.')}</p></div>
        <div class="board-grid">
          ${imgs.map((id, i) => `<figure class="b-${i}"><img src="${U(id, i === 0 ? 700 : 500, i === 0 ? 900 : 500)}" alt=""></figure>`).join('')}
          <div class="b-sketch">${nk}${sl}</div>
          <div class="b-swatches">${(state.tkaniny || []).map(v => { const o = STEPS[4].opts.find(x => x.v === v); return o ? `<span class="swatch ${o.sw}" title="${esc(o.t)}"></span>` : ''; }).join('')}</div>
        </div>
        <ul class="board-chips">${chips}</ul>
        ${state.note ? `<p class="board-note">„${esc(state.note)}”</p>` : ''}
        ${timeline(state.data)}
        <div class="board-actions">
          <button type="button" class="btn btn-dark" data-act="send">${T('Wyślij do pracowni', 'Envoyer à l\'atelier')}</button>
          <button type="button" class="btn btn-ghost" data-act="print">${T('Zapisz / wydrukuj', 'Enregistrer / imprimer')}</button>
          <button type="button" class="btn btn-ghost" data-act="share">${T('Kopiuj link', 'Copier le lien')}</button>
          <button type="button" class="k-restart" data-act="restart">${T('Zacznij od nowa', 'Recommencer')}</button>
        </div>
        <p class="k-toast" role="status" aria-live="polite"></p>
      </div>`;
    }

    root.addEventListener('click', e => {
      const opt = e.target.closest('.k-opt');
      const act = e.target.closest('[data-act]');
      const s = STEPS[step];
      if (opt && s) {
        if (s.multi) { const a = new Set(state[s.id] || []); a.has(opt.dataset.v) ? a.delete(opt.dataset.v) : a.add(opt.dataset.v); state[s.id] = [...a]; }
        else state[s.id] = opt.dataset.v;
        save(); render();
        if (!s.multi) setTimeout(() => { step++; render(); }, 280);
        return;
      }
      if (!act) return;
      const a = act.dataset.act;
      if (a === 'next') { if (s && s.type === 'date') { state.data = root.querySelector('#k-date').value; state.note = root.querySelector('#k-note').value.trim(); save(); } step++; render(); root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      if (a === 'back') { step = Math.max(0, step - 1); render(); }
      if (a === 'restart') { state = {}; save(); step = 0; render(); }
      if (a === 'print') { document.body.classList.add('print-board'); window.print(); setTimeout(() => document.body.classList.remove('print-board'), 500); }
      if (a === 'share') {
        const url = location.origin + location.pathname + '?' + (L === 'fr' ? 'lang=fr&' : '') + 'suknia=' + btoa(unescape(encodeURIComponent(JSON.stringify(state)))) + '#kreator';
        const toast = root.querySelector('.k-toast');
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => { toast.textContent = T('Link skopiowany! Możesz wysłać go mamie lub przyjaciółce.', 'Lien copié ! Vous pouvez l\'envoyer à votre mère ou à une amie.'); })
          .catch(() => { toast.textContent = url; });
      }
      if (a === 'send') {
        const f = document.getElementById('form');
        if (f) {
          const fa = STEPS[1].opts.find(o => o.v === state.fason);
          if (fa && f.fason) f.fason.selectedIndex = fa.form;
          if (state.data && f.data) f.data.value = state.data;
          f.wiadomosc.value = summaryText() + (f.wiadomosc.value ? '\n\n' + f.wiadomosc.value : '');
          document.getElementById('wycena').scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => f.imie.focus({ preventScroll: true }), 700);
        }
      }
    });
    render();
  }

  // ---------- Moja selekcja (ulubione) ----------
  const items = [...document.querySelectorAll('.g-item')];
  if (!items.length) return;
  let favs = new Set(store.get('coccinelle-fav') || []);
  const shared = new URLSearchParams(location.search).get('fav');
  if (shared) shared.split(',').forEach(i => { if (items[+i - 1]) favs.add(+i); });
  const saveFav = () => store.set('coccinelle-fav', [...favs]);
  const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.5 0 5.4 3.5 4.1 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>';

  items.forEach((it, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'fav-btn'; b.innerHTML = heart;
    b.setAttribute('aria-label', T('Dodaj do mojej selekcji', 'Ajouter à ma sélection'));
    b.addEventListener('click', e => { e.stopPropagation(); favs.has(i + 1) ? favs.delete(i + 1) : favs.add(i + 1); saveFav(); sync(); if (favs.has(i + 1)) pill.classList.add('pulse'); setTimeout(() => pill.classList.remove('pulse'), 600); });
    it.appendChild(b);
  });

  const pill = document.createElement('button');
  pill.type = 'button'; pill.className = 'fav-pill';
  document.body.appendChild(pill);
  const drawer = document.createElement('aside');
  drawer.className = 'fav-drawer'; drawer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(drawer);

  function caption(i) { const c = items[i - 1].querySelector('figcaption'); return c ? c.textContent : ''; }
  function sync() {
    items.forEach((it, i) => { const on = favs.has(i + 1); it.classList.toggle('is-fav', on); it.querySelector('.fav-btn').setAttribute('aria-pressed', on); });
    pill.innerHTML = `${heart}<span>${T('Moja selekcja', 'Ma sélection')}</span><b>${favs.size}</b>`;
    pill.classList.toggle('show', favs.size > 0);
    const list = [...favs].sort((a, b) => a - b);
    drawer.innerHTML = `<div class="fd-head"><h3>${T('Moja selekcja', 'Ma sélection')}</h3><button type="button" class="fd-close" aria-label="×">×</button></div>
      ${list.length ? `<ul class="fd-list">${list.map(i => `<li><img src="${items[i - 1].querySelector('img').src}" alt=""><span>${esc(caption(i))}</span><button type="button" data-rm="${i}" aria-label="${T('Usuń', 'Retirer')}">×</button></li>`).join('')}</ul>`
        : `<p class="fd-empty">${T('Kliknij serduszko przy sukni, aby dodać ją do selekcji.', 'Cliquez sur le cœur d\'une robe pour l\'ajouter à votre sélection.')}</p>`}
      <div class="fd-actions">
        <button type="button" class="btn btn-dark" data-fd="attach" ${list.length ? '' : 'disabled'}>${T('Dołącz do zapytania', 'Joindre à ma demande')}</button>
        <button type="button" class="btn btn-ghost" data-fd="share" ${list.length ? '' : 'disabled'}>${T('Udostępnij bliskiej osobie', 'Partager avec une proche')}</button>
        <p class="fd-toast" role="status" aria-live="polite"></p>
      </div>`;
  }
  pill.addEventListener('click', () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); });
  drawer.addEventListener('click', e => {
    if (e.target.closest('.fd-close')) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); return; }
    const rm = e.target.closest('[data-rm]'); if (rm) { favs.delete(+rm.dataset.rm); saveFav(); sync(); return; }
    const a = e.target.closest('[data-fd]'); if (!a) return;
    const list = [...favs].sort((x, y) => x - y);
    if (a.dataset.fd === 'share') {
      const url = location.origin + location.pathname + '?' + (L === 'fr' ? 'lang=fr&' : '') + 'fav=' + list.join(',') + '#suknie';
      const toast = drawer.querySelector('.fd-toast');
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => { toast.textContent = T('Link skopiowany!', 'Lien copié !'); }).catch(() => { toast.textContent = url; });
    }
    if (a.dataset.fd === 'attach') {
      const f = document.getElementById('form'); if (!f) return;
      const txt = T('Moja selekcja z galerii: ', 'Ma sélection dans la galerie : ') + list.map(caption).join('; ');
      if (!f.wiadomosc.value.includes(txt)) f.wiadomosc.value = (f.wiadomosc.value ? f.wiadomosc.value + '\n\n' : '') + txt;
      drawer.classList.remove('open');
      document.getElementById('wycena').scrollIntoView({ behavior: 'smooth' });
    }
  });
  sync();
  if (shared && favs.size) { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
})();
