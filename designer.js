// Kreator „Wymarz swoją suknię” · Créateur « Imaginons votre robe »
// Działa w przeglądarce, bez konta. Odpowiedzi zapisują się w localStorage (jeśli dostępny).
(function () {
  const L = (typeof LANG !== 'undefined' && LANG === 'fr') ? 'fr' : 'pl';
  const T = (pl, fr) => (L === 'fr' ? fr : pl);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  // =================================================================
  //  SZKIC SUKNI (croquis) — jedna sylwetka składana z wybranych części
  //  viewBox 0 0 120 200 · talia na wysokości y=74
  // =================================================================
  const NECKS = {
    serce:     { top: 'M45,47 C46,41 50,38 54,39.5 C57.5,40.5 59.3,43.5 60,46.5 C60.7,43.5 62.5,40.5 66,39.5 C70,38 74,41 75,47', strapless: true },
    v:         { top: 'M45,47 C45,39 46,31 48,24 L54,23 L60,50 L66,23 L72,24 C74,31 75,39 75,47' },
    kwadrat:   { top: 'M45,47 C45,39 46,31 48,24 L53.5,24 L53.5,39 L66.5,39 L66.5,24 L72,24 C74,31 75,39 75,47' },
    hiszpanka: { top: 'M45,48 Q60,50.5 75,48', band: 'M33,40 Q46,45.5 60,45 Q74,45.5 87,40 L87.5,46 Q74,51.5 60,51 Q46,51.5 32.5,46 Z', strapless: true },
    wysoki:    { top: 'M45,47 C45,39 45.5,31 47,26 C51,24.5 54,22 55,15 L65,15 C66,22 69,24.5 73,26 C74.5,31 75,39 75,47', extra: 'M55,15 Q60,17 65,15 M55.3,19 Q60,21 64.7,19' }
  };
  // Wariant z cienkimi ramiączkami · variante à fines bretelles
  const THIN = {
    v: 'M45,47 C45.5,40 47,33 49.5,24 L51.5,24 L60,50 L68.5,24 L70.5,24 C73,33 74.5,40 75,47',
    kwadrat: 'M45,47 C45.5,40 47,33 49.5,24 L51.5,24 L51.5,39 L68.5,39 L68.5,24 L70.5,24 C73,33 74.5,40 75,47'
  };
  const SKIRTS = {
    ksiezniczka: { d: 'M49,74 C40,92 22,148 13,190 Q60,199 107,190 C98,148 80,92 71,74 Z', folds: 'M55,80 C50,120 44,160 40,194 M65,80 C70,120 76,160 80,194 M60,80 L60,196 M52,78 C40,120 28,160 24,192 M68,78 C80,120 92,160 96,192' },
    'litera-a':  { d: 'M49,74 L30,191 Q60,196 90,191 L71,74 Z', folds: 'M55,80 L45,193 M65,80 L75,193 M60,80 L60,195' },
    syrenka:     { d: 'M49,74 C46.5,96 46.5,120 50,141 C45,160 34,179 23,192 Q60,199 97,192 C86,179 75,160 70,141 C73.5,120 73.5,96 71,74 Z', folds: 'M50,141 Q60,144 70,141 M55,145 C51,165 46,180 42,195 M65,145 C69,165 74,180 78,195 M60,145 L60,197' },
    prosta:      { d: 'M49,74 C48,110 46.5,150 45,192 Q60,195 75,192 C73.5,150 72,110 71,74 Z', folds: 'M57,80 L55,193 M63,80 L65,193' },
    kombinezon:  { d: 'M49,74 C46,110 40.5,160 37.5,192 L57.5,192 L60,108 L62.5,192 L82.5,192 C79.5,160 74,110 71,74 Z', folds: 'M60,108 L60,96 M47,192 L48,140 M73,192 L72,140' }
  };
  function sleevePaths(neck, sleeve) {
    const off = neck === 'hiszpanka';
    if (sleeve === 'krotkie') return off
      ? ['M33,40 C30,45 28,51 27,56 L37,58.5 C38.5,54 40,50 42,46 Z', 'M87,40 C90,45 92,51 93,56 L83,58.5 C81.5,54 80,50 78,46 Z']
      : ['M48,24 C42,25.5 38,30 35.5,41 L44.5,44 C45,36 46,30 48,24 Z', 'M72,24 C78,25.5 82,30 84.5,41 L75.5,44 C75,36 74,30 72,24 Z'];
    if (sleeve === 'dlugie') return off
      ? ['M33,40 C29,52 26,80 25,108 L32,110 C34,86 38,62 42,46 Z', 'M87,40 C91,52 94,80 95,108 L88,110 C86,86 82,62 78,46 Z']
      : ['M48,24 C42,25.5 38,31 36.5,42 C34,64 30,86 27,108 L34,110 C38,88 42,66 44.5,47 C45,38 46,30 48,24 Z', 'M72,24 C78,25.5 82,31 83.5,42 C86,64 90,86 93,108 L86,110 C82,88 78,66 75.5,47 C75,38 74,30 72,24 Z'];
    return [];
  }
  const VIEWS = { full: '6 6 108 194', bust: '24 8 72 74', arms: '14 8 92 108' };
  function croquis(o, view) {
    let neck = NECKS[o.neck] || NECKS.serce;
    if (o.sleeve === 'ramiaczka' && THIN[o.neck]) neck = Object.assign({}, neck, { top: THIN[o.neck] });
    const skirt = SKIRTS[o.fason] || SKIRTS['litera-a'];
    const lace = o.lace ? ' style="fill:url(#k-lace)"' : '';
    const sl = sleevePaths(o.neck, o.sleeve);
    const straps = o.sleeve === 'ramiaczka' && neck.strapless
      ? (o.neck === 'hiszpanka' ? '' : '<path class="k-line" d="M50.5,39.6 L49,24 M69.5,39.6 L71,24"/>') : '';
    return `<svg class="croquis" viewBox="${VIEWS[view] || VIEWS.full}" aria-hidden="true" focusable="false">
      <defs><pattern id="k-lace" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><rect width="3.2" height="3.2" fill="#fff"/><circle cx="1.6" cy="1.6" r=".6" fill="#c2b7ab"/></pattern></defs>
      <ellipse cx="60" cy="194" rx="44" ry="3.2" class="k-shadow"/>
      ${sl.map(p => `<path class="k-sleeve"${o.sleeve === 'dlugie' ? ' style="fill:url(#k-lace)"' : ''} d="${p}"/>`).join('')}
      <path class="k-skirt" d="${skirt.d}"/>
      <path class="k-fold" d="${skirt.folds}"/>
      <path class="k-bodice"${lace} d="${neck.top} L71,74 Q60,76 49,74 Z"/>
      ${neck.band ? `<path class="k-bodice" d="${neck.band}"/>` : ''}
      ${neck.extra ? `<path class="k-line" d="${neck.extra}"/>` : ''}
      ${straps}
      <path class="k-line" d="M49,74 Q60,76 71,74"/>
    </svg>`;
  }
  // Udostępnione dla innych skryptów (np. podgląd w galerii) · partagé
  window.CocciCroquis = croquis;

  // =================================================================
  //  KROKI · ÉTAPES
  // =================================================================
  const galleryImg = id => (typeof GALLERY !== 'undefined' ? GALLERY.find(g => g.id === id) : null);
  const styleImg = v => galleryImg((typeof KREATOR_STYLE_IMAGES !== 'undefined' ? KREATOR_STYLE_IMAGES : {})[v]);

  const STEPS = [
    { id: 'styl', short: T('Styl', 'Style'), type: 'photo', q: T('Jaki nastrój jest Ci najbliższy?', 'Quelle ambiance vous ressemble ?'),
      hint: T('Wybierz zdjęcie, które najlepiej oddaje Twój klimat.', 'Choisissez la photo qui vous parle le plus.'), opts: [
      { v: 'romantyczny', t: T('Romantyczny', 'Romantique'), d: T('koronka, tiul, lekkość', 'dentelle, tulle, légèreté') },
      { v: 'minimalistyczny', t: T('Minimalistyczny', 'Minimaliste'), d: T('czysta linia, gładkie tkaniny', 'ligne pure, tissus lisses') },
      { v: 'klasyczny', t: T('Klasyczny', 'Classique'), d: T('ponadczasowa elegancja', 'une élégance intemporelle') },
      { v: 'nowoczesny', t: T('Nowoczesny', 'Moderne'), d: T('odważnie, z charakterem', 'audacieuse, avec du caractère') }
    ] },
    { id: 'fason', short: T('Sylwetka', 'Silhouette'), type: 'sketch', view: 'full', q: T('Jaka sylwetka?', 'Quelle silhouette ?'), opts: [
      { v: 'ksiezniczka', t: T('Księżniczka', 'Princesse'), d: T('dopasowana góra, bardzo szeroki dół', 'buste ajusté, jupe très ample'), form: 1 },
      { v: 'litera-a', t: T('Litera A', 'Trapèze'), d: T('rozszerza się łagodnie od talii', 's’évase doucement depuis la taille'), form: 2 },
      { v: 'syrenka', t: T('Syrenka', 'Sirène'), d: T('dopasowana do kolan, rozkloszowana niżej', 'ajustée jusqu’aux genoux, évasée en bas'), form: 3 },
      { v: 'prosta', t: T('Prosta', 'Droite'), d: T('smukła, kolumnowa linia', 'une ligne fine, en colonne'), form: 4 },
      { v: 'kombinezon', t: T('Kombinezon', 'Combinaison'), d: T('góra jak w sukni, szerokie nogawki', 'un haut de robe, des jambes larges'), form: 5 }
    ] },
    { id: 'dekolt', short: T('Dekolt', 'Décolleté'), type: 'sketch', view: 'bust', q: T('Jaki dekolt?', 'Quel décolleté ?'), opts: [
      { v: 'serce', t: T('Serce', 'Cœur'), d: T('bez ramiączek, w kształcie serca', 'sans bretelles, en forme de cœur') },
      { v: 'v', t: T('Litera V', 'En V'), d: T('wydłuża sylwetkę', 'allonge la silhouette') },
      { v: 'kwadrat', t: T('Kwadratowy', 'Carré'), d: T('prosta, graficzna linia', 'une ligne nette et graphique') },
      { v: 'hiszpanka', t: T('Odkryte ramiona', 'Épaules dénudées'), d: T('tzw. hiszpanka', 'dit « bardot »') },
      { v: 'wysoki', t: T('Wysoki', 'Montant'), d: T('zakryty, przy szyi', 'fermé, près du cou') }
    ] },
    { id: 'rekawy', short: T('Rękawy', 'Manches'), type: 'sketch', view: 'arms', q: T('A rękawy?', 'Et les manches ?'), opts: [
      { v: 'brak', t: T('Bez rękawów', 'Sans manches') },
      { v: 'ramiaczka', t: T('Cienkie ramiączka', 'Fines bretelles') },
      { v: 'krotkie', t: T('Krótkie', 'Courtes') },
      { v: 'dlugie', t: T('Długie, koronkowe', 'Longues, en dentelle') }
    ] },
    { id: 'tkaniny', short: T('Tkaniny', 'Matières'), type: 'swatch', multi: true, q: T('Jakie tkaniny Cię zachwycają?', 'Quelles matières vous font rêver ?'),
      hint: T('Możesz wybrać kilka. Ostateczny dobór omówimy w pracowni, z próbkami w dłoni.', 'Plusieurs choix possibles. Le choix final se fera à l’atelier, échantillons en main.'), opts: [
      { v: 'koronka', sw: 'sw-lace', t: T('Koronka', 'Dentelle') },
      { v: 'tiul', sw: 'sw-tulle', t: T('Tiul', 'Tulle') },
      { v: 'satyna', sw: 'sw-satin', t: T('Satyna i mikado', 'Satin et mikado') },
      { v: 'krepa', sw: 'sw-crepe', t: T('Krepa', 'Crêpe') },
      { v: 'zdobienia', sw: 'sw-pearl', t: T('Perełki i zdobienia', 'Perles et ornements') }
    ] },
    { id: 'data', short: T('Data', 'Date'), type: 'date', q: T('Kiedy ślub?', 'Quand a lieu le mariage ?'),
      hint: T('Na tej podstawie przygotujemy orientacyjny kalendarz powstawania sukni.', 'Nous en tirerons un calendrier indicatif de création de la robe.') }
  ];
  const VALID = Object.fromEntries(STEPS.filter(s => s.opts).map(s => [s.id, s.opts.map(o => o.v)]));

  // Sprawdza dane z linku lub pamięci · Valide les données (lien partagé ou mémoire)
  function clean(raw) {
    const s = {};
    if (!raw || typeof raw !== 'object') return s;
    ['styl', 'fason', 'dekolt', 'rekawy'].forEach(k => { if (VALID[k].includes(raw[k])) s[k] = raw[k]; });
    if (Array.isArray(raw.tkaniny)) s.tkaniny = raw.tkaniny.filter(v => VALID.tkaniny.includes(v));
    if (typeof raw.data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.data)) s.data = raw.data;
    if (typeof raw.note === 'string') s.note = raw.note.slice(0, 600);
    if (raw.done === true) s.done = true;
    return s;
  }

  // =================================================================
  //  KALENDARZ SUKNI (orientacyjny)
  // =================================================================
  const MILESTONES = [
    { m: 8, t: T('Pierwsza konsultacja', 'Première consultation'), d: T('rozmowa o Twoich marzeniach i inspiracjach', 'vos envies et vos inspirations') },
    { m: 7, t: T('Projekt i tkaniny', 'Projet et tissus'), d: T('szkic, wybór koronek, tiuli i zdobień', 'croquis, choix des dentelles, tulles et ornements') },
    { m: 6, t: T('Pomiar', 'Prise de mesures'), d: T('dokładna miara sylwetki', 'des mesures précises') },
    { m: 4, t: T('Pierwsza przymiarka', 'Premier essayage'), d: T('konstrukcja i dopasowanie', 'construction et ajustement') },
    { m: 2, t: T('Kolejna przymiarka', 'Deuxième essayage'), d: T('detale i długość – weź buty ślubne', 'détails et longueur : prenez vos chaussures') },
    { m: 1, t: T('Ostatnia przymiarka', 'Dernier essayage'), d: T('ostatnie poprawki', 'les dernières retouches') },
    { m: 0.4, t: T('Odbiór sukni', 'Remise de la robe'), d: T('suknia gotowa na Twój dzień', 'la robe est prête pour le grand jour') }
  ];
  const DAY = 864e5, MONTH = 30.4 * DAY;
  const fmtMonth = d => d.toLocaleDateString(L === 'fr' ? 'fr-FR' : 'pl-PL', { month: 'long', year: 'numeric' });
  const fmtDay = d => d.toLocaleDateString(L === 'fr' ? 'fr-FR' : 'pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  function timeline(dateStr) {
    if (!dateStr) return `<div class="timeline timeline-empty"><p>${T('Gdy poznasz datę ślubu, wróć do kreatora – pokażemy orientacyjny kalendarz powstawania sukni.', 'Quand vous connaîtrez la date du mariage, revenez ici : nous vous montrerons le calendrier indicatif de votre robe.')}</p></div>`;
    const wed = new Date(dateStr + 'T12:00:00');
    const now = new Date();
    if (isNaN(wed) || wed < now) return '';
    const left = (wed - now) / MONTH;
    const warn = left < 4 ? `<p class="tl-warn">${T('Do ślubu zostało niewiele czasu. Napisz do nas jak najszybciej – sprawdzimy, co da się zrobić.', 'Le mariage approche. Écrivez-nous dès que possible : nous verrons ensemble ce qui est faisable.')}</p>` : '';
    const soon = MILESTONES.filter(s => new Date(wed.getTime() - s.m * MONTH) < now);
    const later = MILESTONES.filter(s => !soon.includes(s));
    let items = '';
    if (soon.length === 1) items += `<li class="soon"><span class="tl-date">${T('jak najszybciej', 'dès que possible')}</span><strong>${soon[0].t}</strong><span>${soon[0].d}</span></li>`;
    if (soon.length > 1) items += `<li class="soon"><span class="tl-date">${T('jak najszybciej', 'dès que possible')}</span><strong>${soon.map(s => s.t).join(' · ')}</strong><span>${T('te etapy zaplanujemy razem w krótszym czasie', 'ces étapes seront planifiées ensemble sur un temps plus court')}</span></li>`;
    items += later.map(s => `<li><span class="tl-date">${fmtMonth(new Date(wed.getTime() - s.m * MONTH))}</span><strong>${s.t}</strong><span>${s.d}</span></li>`).join('');
    return `<div class="timeline"><h4>${T('Kalendarz Twojej sukni', 'Le calendrier de votre robe')}</h4>
      <p class="tl-sub">${T('Ślub', 'Mariage')} · ${fmtDay(wed)}</p>${warn}<ol>${items}</ol>
      <p class="tl-note">${T('To kalendarz orientacyjny. Dokładne terminy ustalimy razem podczas konsultacji.', 'Ce calendrier est indicatif. Les dates exactes seront fixées ensemble lors de la consultation.')}</p></div>`;
  }

  // =================================================================
  //  KREATOR
  // =================================================================
  const root = document.getElementById('kreator-app');
  if (!root) return;
  const KEY = 'coccinelle-kreator';
  let state = clean(store.get(KEY));
  let step = 0, editing = false, timer = null;
  try {
    const h = new URLSearchParams(location.search).get('suknia');
    if (h) { state = clean(JSON.parse(decodeURIComponent(escape(atob(h))))); state.done = true; }
  } catch (e) {}
  if (state.done) step = STEPS.length;
  const save = () => store.set(KEY, state);
  const opt = (sid, v) => { const s = STEPS.find(x => x.id === sid); return s && s.opts ? s.opts.find(o => o.v === v) : null; };
  const label = (sid, v) => (opt(sid, v) || {}).t || '';
  const fabrics = () => (state.tkaniny || []).map((v, i) => { const t = label('tkaniny', v); return i ? t.charAt(0).toLowerCase() + t.slice(1) : t; }).join(', ');
  const answered = i => { const s = STEPS[i]; return s.type === 'date' ? ('data' in state || state.done) : s.multi ? (state[s.id] || []).length > 0 : !!state[s.id]; };
  const sketchOf = (over, view) => croquis({
    fason: over.fason || state.fason || 'litera-a',
    neck: over.neck || state.dekolt || (over.fason ? 'serce' : 'serce'),
    sleeve: over.sleeve !== undefined ? over.sleeve : (state.rekawy || 'brak'),
    lace: (state.tkaniny || []).includes('koronka')
  }, view);

  function focusTitle() {
    const h = root.querySelector('[data-focus]');
    if (h) h.focus({ preventScroll: true });
    const r = root.getBoundingClientRect();
    if (r.top < 0 || r.top > innerHeight * 0.6) root.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  function progress() {
    return `<ol class="k-progress" aria-label="${T('Postęp', 'Progression')}">${STEPS.map((x, i) => {
      const cls = i === step ? 'on' : answered(i) ? 'done' : '';
      const can = i !== step && (answered(i) || i < step);
      return `<li class="${cls}">${can ? `<button type="button" data-go="${i}">` : '<span>'}<b>${i + 1}</b><em>${x.short}</em>${can ? '</button>' : '</span>'}</li>`;
    }).join('')}</ol>`;
  }

  function renderStep() {
    const s = STEPS[step];
    let body = '';
    if (s.type === 'date') {
      body = `<div class="k-date">
        <label for="k-date">${T('Data ślubu', 'Date du mariage')}</label>
        <input type="date" id="k-date" min="${todayISO()}" value="${esc(state.data || '')}" aria-describedby="k-date-err">
        <p class="field-err" id="k-date-err" role="alert"></p>
        <label for="k-note">${T('Coś jeszcze? (opcjonalnie)', 'Autre chose ? (facultatif)')}</label>
        <textarea id="k-note" rows="3" maxlength="600" placeholder="${T('np. ślub w ogrodzie, marzę o długim trenie…', 'ex. : mariage dans un jardin, j’aimerais une longue traîne…')}">${esc(state.note || '')}</textarea>
        <p class="k-small">${T('Nie znasz jeszcze daty? Zostaw puste pole – kalendarz pokażemy później.', 'Pas encore de date ? Laissez le champ vide, le calendrier viendra plus tard.')}</p>
      </div>`;
    } else {
      const sel = state[s.id];
      body = `<div class="k-opts k-${s.type}" role="group" aria-label="${esc(s.q)}">` + s.opts.map(o => {
        const on = s.multi ? (sel || []).includes(o.v) : sel === o.v;
        let vis = '';
        if (s.type === 'photo') { const g = styleImg(o.v); vis = g ? `<span class="k-photo"><img src="${imgUrl(g, 420, 525)}" srcset="${imgSrcset(g, [280, 420, 640], 1.25)}" sizes="(max-width:560px) 45vw, 220px" alt="" loading="lazy" width="420" height="525"></span>` : ''; }
        else if (s.type === 'sketch') {
          const over = s.id === 'fason' ? { fason: o.v, sleeve: 'brak' } : s.id === 'dekolt' ? { neck: o.v, sleeve: 'brak' } : { sleeve: o.v };
          vis = `<span class="k-sketch k-sketch-${s.view}">${sketchOf(over, s.view)}</span>`;
        } else vis = `<span class="swatch ${o.sw}"></span>`;
        return `<button type="button" class="k-opt${on ? ' on' : ''}" data-v="${o.v}" aria-pressed="${on}">${vis}<strong>${o.t}</strong>${o.d ? `<small>${o.d}</small>` : ''}</button>`;
      }).join('') + '</div>';
    }
    const ok = s.type === 'date' || answered(step);
    const nextLabel = editing ? T('Wróć do tablicy', 'Revenir à la planche') : step === STEPS.length - 1 ? T('Zobacz moją suknię', 'Voir ma robe') : T('Dalej', 'Suivant');
    root.innerHTML = `<div class="k-step">
      ${progress()}
      <h3 tabindex="-1" data-focus>${s.q}</h3>${s.hint ? `<p class="k-hint">${s.hint}</p>` : ''}
      ${body}
      <div class="k-nav">
        ${step > 0 && !editing ? `<button type="button" class="btn btn-ghost" data-act="back">← ${T('Wstecz', 'Retour')}</button>` : '<span></span>'}
        <button type="button" class="btn btn-dark" data-act="next" ${ok ? '' : 'disabled aria-disabled="true"'}>${nextLabel}</button>
      </div>
      ${!ok ? `<p class="k-small k-center">${s.multi ? T('Wybierz co najmniej jedną tkaninę.', 'Choisissez au moins une matière.') : T('Wybierz jedną odpowiedź, aby przejść dalej.', 'Choisissez une réponse pour continuer.')}</p>` : ''}
    </div>`;
  }

  function summaryText() {
    const rows = [
      [T('Styl', 'Style'), label('styl', state.styl)],
      [T('Sylwetka', 'Silhouette'), label('fason', state.fason)],
      [T('Dekolt', 'Décolleté'), label('dekolt', state.dekolt)],
      [T('Rękawy', 'Manches'), label('rekawy', state.rekawy)],
      [T('Tkaniny', 'Matières'), fabrics()],
      [T('Data ślubu', 'Date du mariage'), state.data ? fmtDay(new Date(state.data + 'T12:00:00')) : T('jeszcze nieznana', 'pas encore fixée')],
      [T('Uwagi', 'Remarques'), state.note || '']
    ].filter(r => r[1]);
    return T('Moja inspiracja z kreatora na stronie:', 'Mon inspiration (créateur du site) :') + '\n' + rows.map(r => `• ${r[0]}${T(':', ' :')} ${r[1]}`).join('\n');
  }

  function renderBoard() {
    const g = styleImg(state.styl);
    const rows = [
      [0, T('Styl', 'Style'), label('styl', state.styl)],
      [1, T('Sylwetka', 'Silhouette'), label('fason', state.fason)],
      [2, T('Dekolt', 'Décolleté'), label('dekolt', state.dekolt)],
      [3, T('Rękawy', 'Manches'), label('rekawy', state.rekawy)],
      [4, T('Tkaniny', 'Matières'), fabrics()],
      [5, T('Data ślubu', 'Date du mariage'), state.data ? fmtDay(new Date(state.data + 'T12:00:00')) : T('jeszcze nieznana', 'pas encore fixée')]
    ];
    const sw = (state.tkaniny || []).map(v => { const o = opt('tkaniny', v); return o ? `<span class="swatch ${o.sw}" title="${esc(o.t)}"></span>` : ''; }).join('');
    root.innerHTML = `<div class="board" id="board">
      <div class="board-head">
        <p class="eyebrow">${T('Twoja tablica inspiracji', 'Votre planche d’inspiration')}</p>
        <h3 tabindex="-1" data-focus>${T('Szkic Twojej wymarzonej sukni', 'L’esquisse de votre robe rêvée')}</h3>
        <p>${T('To punkt wyjścia do rozmowy z projektantką, a nie gotowy projekt. Każdy detal dopracujemy razem w pracowni.', 'C’est un point de départ pour échanger avec la créatrice, pas un modèle définitif. Chaque détail sera affiné ensemble à l’atelier.')}</p>
      </div>
      <div class="board-grid">
        <figure class="b-sketch">${sketchOf({}, 'full')}<figcaption>${T('Szkic poglądowy', 'Esquisse indicative')}</figcaption></figure>
        ${g ? `<figure class="b-photo"><img src="${imgUrl(g, 560, 760)}" alt="" width="560" height="760"><figcaption>${T('Nastrój: ', 'Ambiance : ')}${esc(label('styl', state.styl))}</figcaption></figure>` : ''}
        <div class="b-details">
          <dl>${rows.map(r => `<div><dt>${r[1]}</dt><dd>${esc(r[2] || '—')}</dd><button type="button" class="b-edit" data-edit="${r[0]}" aria-label="${T('Zmień', 'Modifier')}: ${r[1]}">${T('Zmień', 'Modifier')}</button></div>`).join('')}</dl>
          ${sw ? `<div class="b-swatches" aria-hidden="true">${sw}</div>` : ''}
          ${state.note ? `<p class="board-note">„${esc(state.note)}”</p>` : ''}
        </div>
      </div>
      ${timeline(state.data)}
      <div class="board-actions">
        <button type="button" class="btn btn-dark" data-act="send">${T('Dołącz do wiadomości', 'Joindre à ma demande')}</button>
        <button type="button" class="btn btn-ghost" data-act="print">${T('Zapisz jako PDF', 'Enregistrer en PDF')}</button>
        <button type="button" class="btn btn-ghost" data-act="share">${T('Skopiuj link', 'Copier le lien')}</button>
      </div>
      <p class="board-links"><button type="button" class="link-btn" data-act="review">${T('Przejdź jeszcze raz przez pytania', 'Reprendre les questions')}</button> · <button type="button" class="link-btn" data-act="restart">${T('Zacznij od nowa', 'Tout recommencer')}</button></p>
      <p class="k-toast" role="status" aria-live="polite"></p>
    </div>`;
  }

  function render() { clearTimeout(timer); step >= STEPS.length ? renderBoard() : renderStep(); }
  const go = i => { step = i; render(); focusTitle(); };
  const finish = () => { state.done = true; save(); editing = false; go(STEPS.length); };
  const toast = msg => { const t = root.querySelector('.k-toast'); if (t) { t.textContent = msg; } };

  function readDate() {
    const inp = root.querySelector('#k-date'), err = root.querySelector('#k-date-err');
    const v = inp.value;
    if (v && v < todayISO()) {
      err.textContent = T('Ta data już minęła. Wybierz datę w przyszłości albo zostaw pole puste.', 'Cette date est déjà passée. Choisissez une date à venir ou laissez le champ vide.');
      inp.setAttribute('aria-invalid', 'true'); inp.focus(); return false;
    }
    if (v) state.data = v; else delete state.data;
    state.note = root.querySelector('#k-note').value.trim();
    if (!state.note) delete state.note;
    save(); return true;
  }

  root.addEventListener('click', e => {
    const s = STEPS[step];
    const o = e.target.closest('.k-opt');
    if (o && s) {
      if (s.multi) { const a = new Set(state[s.id] || []); a.has(o.dataset.v) ? a.delete(o.dataset.v) : a.add(o.dataset.v); state[s.id] = s.opts.map(x => x.v).filter(v => a.has(v)); }
      else state[s.id] = o.dataset.v;
      save(); render();
      const again = root.querySelector(`.k-opt[data-v="${o.dataset.v}"]`); if (again) again.focus({ preventScroll: true });
      if (!s.multi) timer = setTimeout(() => (editing ? finish() : go(step + 1)), 420);
      return;
    }
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) { go(+goBtn.dataset.go); return; }
    const ed = e.target.closest('[data-edit]');
    if (ed) { editing = true; go(+ed.dataset.edit); return; }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    const a = act.dataset.act;
    if (a === 'next') {
      if (s && s.type === 'date' && !readDate()) return;
      if (editing || step === STEPS.length - 1) finish(); else go(step + 1);
    }
    if (a === 'back') go(Math.max(0, step - 1));
    if (a === 'review') { editing = false; go(0); }
    if (a === 'restart') { state = {}; save(); editing = false; go(0); }
    if (a === 'print') {
      document.body.classList.add('print-board');
      const done = () => { document.body.classList.remove('print-board'); removeEventListener('afterprint', done); };
      addEventListener('afterprint', done); window.print(); setTimeout(done, 1500);
    }
    if (a === 'share') {
      const data = Object.assign({}, state); delete data.done;
      const url = location.origin + location.pathname + '?' + (L === 'fr' ? 'lang=fr&' : '') + 'suknia=' + btoa(unescape(encodeURIComponent(JSON.stringify(data)))) + '#kreator';
      (navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(url) : Promise.reject())
        .then(() => toast(T('Link skopiowany. Możesz wysłać go mamie albo przyjaciółce.', 'Lien copié. Vous pouvez l’envoyer à votre mère ou à une amie.')))
        .catch(() => { toast(T('Skopiuj ten link:', 'Copiez ce lien :') + ' ' + url); });
    }
    if (a === 'send') {
      if (window.CocciForm) {
        window.CocciForm.attach('board', T('Tablica inspiracji z kreatora', 'Planche d’inspiration du créateur'), summaryText(), {
          fason: (opt('fason', state.fason) || {}).form, data: state.data
        });
        window.CocciForm.reveal(T('Twoja tablica inspiracji jest dołączona do wiadomości.', 'Votre planche d’inspiration est jointe à votre demande.'));
      }
    }
  });
  render();
})();
