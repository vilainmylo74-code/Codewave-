const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ── loader ── */
const loader = document.getElementById('loader');
let loaderHidden = false;
function hideLoader() {
  if (loaderHidden || !loader) return;
  loaderHidden = true;
  loader.classList.add('done');
  setTimeout(() => loader.remove(), 700);
}
window.addEventListener('load', () => setTimeout(hideLoader, reduceMotion ? 0 : 450));
setTimeout(hideLoader, 3000); // sécurité si le chargement traîne

/* ── scroll progress + nav + floating CTA ── */
const sp = document.getElementById('sp');
const nav = document.getElementById('nav');
const fc = document.getElementById('float-cta');
window.addEventListener('scroll', () => {
  const s = document.documentElement.scrollTop;
  const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  sp.style.width = (s / h * 100) + '%';
  nav.classList.toggle('scrolled', s > 60);
  fc.classList.toggle('show', s > 400);
}, { passive: true });

/* ── mot rotatif dans le hero ── */
const rotWord = document.getElementById('rot-word');
if (rotWord && !reduceMotion) {
  const words = ['génèrent des résultats', 'inspirent confiance', 'attirent vos clients', 'travaillent pour vous'];
  let wi = 0;
  setInterval(() => {
    if (document.hidden) return;
    wi = (wi + 1) % words.length;
    rotWord.classList.add('word-fade');
    setTimeout(() => {
      rotWord.textContent = words[wi];
      rotWord.classList.remove('word-fade');
    }, 320);
  }, 3600);
}

/* ── spotlight qui suit le curseur sur le hero ── */
const hero = document.getElementById('hero');
if (hero && finePointer) {
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--sx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--sy', (e.clientY - r.top) + 'px');
  });
}

/* ── boutons magnétiques ── */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.18;
      const dy = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

/* ── reveal on scroll ── */
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── modals ── */
function countUp(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString('fr-FR');
    if (start >= target) clearInterval(timer);
  }, 16);
}

function openModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.classList.add('modal-open');
  overlay.querySelector('.modal-box').scrollTop = 0;
  // Animate counters
  overlay.querySelectorAll('.ms-strip-num[data-count]').forEach(el => {
    countUp(el, parseInt(el.dataset.count), 1400);
  });
}
function closeModal(overlay) {
  overlay.classList.remove('open');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.project-card[data-modal]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.modal));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.modal); }
  });
});

/* CTA démo dans les maquettes → ferme la modale et amène au contact */
document.querySelectorAll('[data-goto-contact]').forEach(btn => {
  btn.addEventListener('click', () => {
    const open = document.querySelector('.modal-overlay.open');
    if (open) closeModal(open);
    const target = document.getElementById('contact');
    setTimeout(() => {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }, 220);
  });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay); });
  overlay.querySelector('.modal-close').addEventListener('click', () => closeModal(overlay));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
});

/* ── burger menu ── */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── smooth anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ── scrollspy — surligne le lien de nav de la section visible ── */
const navMap = {};
document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
  navMap[a.getAttribute('href').slice(1)] = a;
});
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      Object.values(navMap).forEach(a => a.classList.remove('active'));
      const link = navMap[e.target.id];
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
['services', 'projets', 'process', 'contact'].forEach(id => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});

/* ── halo + lueur de bordure qui suivent le curseur sur les cartes services ── */
document.querySelectorAll('.service-card').forEach(card => {
  const glow = card.querySelector('.sc-glow');
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    if (glow) {
      glow.style.left = (e.clientX - r.left - 100) + 'px';
      glow.style.top = (e.clientY - r.top - 100) + 'px';
      glow.style.right = 'auto';
    }
  });
});

/* ── tilt 3D sur les cartes projets ── */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - .5) * -6;
      const ry = ((e.clientX - r.left) / r.width - .5) * 6;
      card.style.transform = `perspective(900px) translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}
