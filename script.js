// Menu mobilne
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open'); toggle.setAttribute('aria-expanded', false);
}));

// Cień nawigacji po przewinięciu
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });

// Animacje pojawiania się
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Filtry galerii
document.querySelectorAll('.filters button').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  document.querySelectorAll('.g-item').forEach(it => {
    it.classList.toggle('hidden', f !== 'all' && it.dataset.cat !== f);
  });
}));

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lb-cap');
document.querySelectorAll('.g-item').forEach(it => it.addEventListener('click', () => {
  const img = it.querySelector('img');
  lbImg.src = img.src; lbImg.alt = img.alt;
  lbCap.textContent = it.querySelector('figcaption').textContent;
  lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
}));
const closeLb = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };
lb.addEventListener('click', e => { if (e.target !== lbImg) closeLb(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

// Formularz (wersja demonstracyjna – brak wysyłki)
const form = document.getElementById('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const note = form.querySelector('.form-note');
  if (!form.imie.value.trim() || !form.email.checkValidity() || !form.email.value) {
    note.textContent = 'Podaj proszę imię i poprawny adres e-mail.';
    note.className = 'form-note err';
    return;
  }
  note.textContent = 'Dziękujemy! To wersja demonstracyjna strony – formularz zostanie podłączony wkrótce.';
  note.className = 'form-note ok';
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
