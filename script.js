// Coccinelle · skrypt główny: zdjęcia z content.js, nawigacja, formularz.
(function () {
  const L = (typeof LANG !== 'undefined' && LANG === 'fr') ? 'fr' : 'pl';
  const T = (pl, fr) => (L === 'fr' ? fr : pl);
  const tr = o => (o && typeof o === 'object' ? (o[L] || o.pl || '') : (o || ''));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  window.CocciUtil = { L, T, tr, esc, store, reduced };
  const hasContent = typeof SITE !== 'undefined';

  // ---------- Zdjęcia z content.js · Images depuis content.js ----------
  if (hasContent) {
    document.querySelectorAll('[data-img]').forEach(img => {
      const item = IMAGES[img.dataset.img]; if (!item) return;
      const w = +img.dataset.w || 1200, h = +img.dataset.h || 0;
      img.src = imgUrl(item, w, h);
      const ws = (img.dataset.widths || '').split(',').filter(Boolean).map(Number);
      if (ws.length) { img.srcset = imgSrcset(item, ws, h ? h / w : 0); img.sizes = img.dataset.sizes || '100vw'; }
      img.alt = tr(item.alt);
    });
    document.querySelectorAll('source[data-img]').forEach(s => {
      const item = IMAGES[s.dataset.img]; if (item) s.srcset = imgUrl(item, +s.dataset.w, +s.dataset.h);
    });

    // „Wasz dzień”
    const mg = document.getElementById('moments-grid');
    if (mg) mg.innerHTML = MOMENTS.map(m => `<figure class="m-item${m.tall ? ' tall' : ''} reveal"><img src="${imgUrl(m, 600, 760)}" srcset="${imgSrcset(m, [400, 600, 900], 1.27)}" sizes="(max-width:860px) 50vw, 25vw" alt="${esc(tr(m.alt))}" loading="lazy" width="600" height="760"></figure>`).join('');

    // Realizacje pracowni: pokazujemy tylko prawdziwe · seulement les vraies créations
    const real = document.getElementById('realizacje');
    if (real && REALIZACJE.length) {
      real.hidden = false;
      real.querySelector('.real-grid').innerHTML = REALIZACJE.map(r => `<figure class="real-item"><img src="${esc(imgUrl(r, 700, 900))}" alt="${esc(tr(r.title))}" loading="lazy"><figcaption><strong>${esc(tr(r.title))}</strong>${r.text ? `<span>${esc(tr(r.text))}</span>` : ''}</figcaption></figure>`).join('');
    }

    // Kontakt: tylko uzupełnione dane · seules les informations renseignées
    const c = SITE.contact;
    const ig = c.instagram ? `https://www.instagram.com/${c.instagram}/` : '';
    document.querySelectorAll('[data-ig]').forEach(a => { if (ig) a.href = ig; });
    const addr = document.getElementById('ct-address');
    if (addr) addr.innerHTML = (c.address ? esc(c.address) + '<br>' : '') + esc(tr(c.region));
    const reach = document.getElementById('ct-reach');
    if (reach) {
      const lines = [];
      if (c.phone) lines.push(`<a href="tel:${esc(c.phone.replace(/\s/g, ''))}">${esc(c.phone)}</a>`);
      if (c.email) lines.push(`<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`);
      if (lines.length) { reach.querySelector('p').innerHTML = lines.join('<br>'); reach.hidden = false; }
    }
    const hours = document.getElementById('ct-hours');
    if (hours && (c.hours || []).length) {
      hours.querySelector('dl').innerHTML = c.hours.map(x => `<div><dt>${esc(tr(x.d))}</dt><dd>${esc(tr(x.h))}</dd></div>`).join('');
      hours.hidden = false;
    }

    // Mapa Google: dopiero po zgodzie na cookies albo po kliknięciu · Carte : après accord ou clic
    const map = document.getElementById('ct-map');
    if (map && c.map) {
      const q = encodeURIComponent(c.map);
      const route = `<a class="btn btn-ghost map-route" href="https://www.google.com/maps/dir/?api=1&amp;destination=${q}" target="_blank" rel="noopener">${T('Wyznacz trasę', 'Itinéraire')}</a>`;
      const showMap = () => {
        if (map.querySelector('iframe')) return;
        map.classList.remove('is-off');
        map.innerHTML = `<iframe src="https://www.google.com/maps?q=${q}&amp;z=16&amp;hl=${L}&amp;output=embed" title="${esc(T('Mapa dojazdu do pracowni', 'Plan d’accès à l’atelier'))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>${route}`;
      };
      let ok = null; try { ok = localStorage.getItem('coccinelle-cookies'); } catch (e) {}
      if (ok === 'yes') showMap();
      else {
        map.classList.add('is-off');
        map.innerHTML = `<div class="map-off">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
          <p class="map-addr">${esc(c.address || '')}</p>
          <p class="muted">${T('Mapa Google zapisuje własne pliki cookies, dlatego wyświetlamy ją dopiero na Twoje życzenie.', 'Google Maps dépose ses propres cookies : la carte ne s’affiche qu’à votre demande.')}</p>
          <div class="map-actions"><button type="button" class="btn btn-dark" data-map-show>${T('Pokaż mapę', 'Afficher la carte')}</button>${route}</div>
        </div>`;
        map.querySelector('[data-map-show]').addEventListener('click', showMap);
      }
      window.addEventListener('cocci-consent', e => { if (e.detail === 'yes') showMap(); });
      map.hidden = false;
    }

    // Opinie Google: dosłownie z content.js · Avis Google tels quels
    const rv = SITE.reviews, rs = document.getElementById('opinie');
    if (rs && rv && (rv.items || []).length) {
      const star = n => `<span class="stars" role="img" aria-label="${esc(T(`Ocena ${n} na 5`, `Note ${n} sur 5`))}">${'★'.repeat(Math.round(n))}${'☆'.repeat(5 - Math.round(n))}</span>`;
      const num = String(rv.rating).replace('.', ',');
      rs.querySelector('.rev-score').innerHTML = `${star(rv.rating)} <strong>${esc(num)}</strong> / 5 · ${esc(T(`${rv.count} opinii w Google`, `${rv.count} avis sur Google`))}`;
      rs.querySelector('.rev-grid').innerHTML = rv.items.map(r => {
        const long = r.text.length > 320;
        return `<figure class="rev-card reveal${long ? ' is-long' : ''}">
          ${star(r.stars)}
          <blockquote lang="pl">${esc(r.text).replace(/\n/g, '<br>')}</blockquote>
          ${long ? `<button type="button" class="link-btn rev-toggle" aria-expanded="false">${T('Czytaj całość', 'Lire la suite')}</button>` : ''}
          <figcaption><strong>${esc(r.name)}</strong><span>Google · ${esc(tr(r.when))}</span></figcaption>
        </figure>`;
      }).join('');
      rs.querySelectorAll('.rev-toggle').forEach(b => b.addEventListener('click', () => {
        const open = b.closest('.rev-card').classList.toggle('open');
        b.setAttribute('aria-expanded', open);
        b.textContent = open ? T('Zwiń', 'Réduire') : T('Czytaj całość', 'Lire la suite');
      }));
      const more = rs.querySelector('.rev-more a');
      if (rv.url) more.href = rv.url; else more.parentElement.hidden = true;
      if (L === 'fr') rs.querySelector('.section-head').insertAdjacentHTML('beforeend', '<p class="muted">Avis publiés en polonais sur Google, reproduits tels quels.</p>');
      rs.hidden = false;
    }

    const fb = document.getElementById('ct-fb');
    if (fb && c.facebook) { fb.href = c.facebook; fb.parentElement.hidden = false; }
    const dur = document.getElementById('cons-time');
    if (dur && tr(c.consultDuration)) { dur.querySelector('dd').textContent = tr(c.consultDuration); dur.hidden = false; }

    document.querySelectorAll('[data-provisional]').forEach(el => { el.hidden = !SITE.provisionalVisuals; });
  }

  // ---------- Nawigacja · Navigation ----------
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    const setOpen = open => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? T('Zamknij menu', 'Fermer le menu') : T('Otwórz menu', 'Ouvrir le menu'));
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && links.classList.contains('open')) { setOpen(false); toggle.focus(); } });
    document.addEventListener('click', e => { if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) setOpen(false); });
  }
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 20);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // ---------- Pojawianie się sekcji · Apparition douce ----------
  const reveal = () => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window) || reduced()) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  };
  window.CocciUtil.reveal = reveal;

  // ---------- Formularz · Formulaire ----------
  const form = document.getElementById('form');
  if (form) {
    const note = form.querySelector('.form-note');
    const attBox = form.querySelector('.attachments');
    const offline = form.querySelector('.form-offline');
    const endpoint = hasContent ? SITE.formEndpoint : '';
    const AKEY = 'coccinelle-zalaczniki';
    let att = store.get(AKEY) || {};
    if (!endpoint) { const d = form.querySelector('.form-demo'); if (d) d.hidden = false; }

    const renderAtt = () => {
      const keys = Object.keys(att);
      attBox.hidden = !keys.length;
      attBox.querySelector('ul').innerHTML = keys.map(k => `<li><span>${esc(att[k].label)}</span><button type="button" class="link-btn" data-detach="${esc(k)}">${T('Usuń', 'Retirer')}<span class="sr-only"> ${esc(att[k].label)}</span></button></li>`).join('');
    };
    attBox.addEventListener('click', e => {
      const b = e.target.closest('[data-detach]'); if (!b) return;
      delete att[b.dataset.detach]; store.set(AKEY, att); renderAtt();
      const first = form.querySelector('input'); if (first && !Object.keys(att).length) first.focus();
    });

    // Publiczne API dla kreatora i galerii · API pour le créateur et la galerie
    window.CocciForm = {
      attach(key, label, text, prefill) {
        att[key] = { label, text }; store.set(AKEY, att); renderAtt();
        if (prefill) {
          if (prefill.fason && form.fason && !form.fason.value) form.fason.selectedIndex = prefill.fason;
          if (prefill.data && form.data && !form.data.value) form.data.value = prefill.data;
        }
      },
      detach(key) { delete att[key]; store.set(AKEY, att); renderAtt(); },
      has(key) { return !!att[key]; },
      reveal(msg) {
        document.getElementById('wycena').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
        note.textContent = msg; note.className = 'form-note info';
        setTimeout(() => form.imie.focus({ preventScroll: true }), reduced() ? 0 : 650);
      }
    };
    renderAtt();

    const fieldErr = (el, msg) => {
      const p = document.getElementById(el.getAttribute('aria-describedby'));
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (p) p.textContent = msg || '';
      return !msg;
    };
    const validate = () => {
      const today = new Date().toISOString().slice(0, 10);
      const okName = fieldErr(form.imie, form.imie.value.trim() ? '' : T('Podaj swoje imię.', 'Indiquez votre prénom.'));
      const okMail = fieldErr(form.email, !form.email.value.trim() ? T('Podaj adres e-mail, abyśmy mogły odpowiedzieć.', 'Indiquez votre e-mail pour que nous puissions vous répondre.')
        : !form.email.checkValidity() ? T('Ten adres e-mail wygląda na niepełny.', 'Cette adresse e-mail semble incomplète.') : '');
      const okDate = fieldErr(form.data, form.data.value && form.data.value < today ? T('Ta data już minęła.', 'Cette date est déjà passée.') : '');
      return okName && okMail && okDate;
    };
    // Błąd znika, gdy pole zostanie poprawione (w trakcie pisania, bez przesuwania przycisku przy kliknięciu)
    ['imie', 'email', 'data'].forEach(n => form[n].addEventListener('input', () => {
      const el = form[n]; if (el.getAttribute('aria-invalid') !== 'true') return;
      const fine = n === 'imie' ? !!el.value.trim() : n === 'email' ? (el.value.trim() && el.checkValidity()) : !(el.value && el.value < new Date().toISOString().slice(0, 10));
      if (fine) fieldErr(el, '');
    }));

    const compose = () => {
      const f = form, C = T(':', ' :');
      const lines = [
        `${T('Imię', 'Prénom')}${C} ${f.imie.value.trim()}`,
        `E-mail${C} ${f.email.value.trim()}`,
        f.telefon.value.trim() ? `${T('Telefon', 'Téléphone')}${C} ${f.telefon.value.trim()}` : '',
        f.data.value ? `${T('Data ślubu', 'Date du mariage')}${C} ${f.data.value}` : '',
        f.fason.value ? `${T('Wymarzony fason', 'Coupe souhaitée')}${C} ${f.fason.options[f.fason.selectedIndex].text}` : '',
        '', f.wiadomosc.value.trim(),
        ...Object.values(att).map(a => '\n' + a.text)
      ];
      return lines.filter((l, i) => l !== '' || i === 5).join('\n').trim();
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      offline.hidden = true;
      if (!validate()) {
        note.textContent = T('Uzupełnij zaznaczone pola.', 'Merci de compléter les champs indiqués.');
        note.className = 'form-note err';
        const bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus();
        return;
      }
      if (!endpoint) {
        // Brak podłączenia: mówimy to wprost, nic nie udajemy · aucune fausse confirmation
        note.textContent = ''; note.className = 'form-note';
        offline.hidden = false;
        offline.querySelector('textarea').value = compose();
        offline.querySelector('h3').focus();
        return;
      }
      const btn = form.querySelector('[type=submit]');
      btn.disabled = true; note.className = 'form-note'; note.textContent = T('Wysyłanie…', 'Envoi en cours…');
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ imie: form.imie.value.trim(), email: form.email.value.trim(), telefon: form.telefon.value.trim(), data: form.data.value, fason: form.fason.value, wiadomosc: compose() }) });
        if (!res.ok) throw new Error(res.status);
        note.textContent = T('Dziękujemy! Wiadomość dotarła do pracowni. Odezwiemy się najszybciej, jak to możliwe.', 'Merci ! Votre message est bien arrivé à l’atelier. Nous vous répondrons très vite.');
        note.className = 'form-note ok';
        form.reset(); att = {}; store.set(AKEY, att); renderAtt();
      } catch (err) {
        note.textContent = T('Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę albo napisz do nas na Instagramie.', 'Le message n’a pas pu être envoyé. Réessayez dans un instant ou écrivez-nous sur Instagram.');
        note.className = 'form-note err';
      } finally { btn.disabled = false; }
    });

    offline.addEventListener('click', e => {
      if (!e.target.closest('[data-copy]')) return;
      const ta = offline.querySelector('textarea'), msg = offline.querySelector('.copy-msg');
      const done = () => { msg.textContent = T('Skopiowano treść wiadomości.', 'Message copié.'); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(ta.value).then(done, () => { ta.select(); });
      else { ta.select(); try { document.execCommand('copy'); done(); } catch (er) {} }
    });
  }

  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  // Uruchamiamy po wyrenderowaniu treści · après le rendu
  addEventListener('DOMContentLoaded', reveal);
  if (document.readyState !== 'loading') setTimeout(reveal, 0);
})();
