/* scroll progress + nav + floating CTA */
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

/* reveal on scroll */
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* modals */
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
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay); });
  overlay.querySelector('.modal-close').addEventListener('click', () => closeModal(overlay));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
});

/* burger menu */
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

/* smooth anchors */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});
