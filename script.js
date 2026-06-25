const header = document.querySelector('[data-header]');
const burger = document.querySelector('[data-burger]');
const nav = document.querySelector('[data-nav]');

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 10);
});

burger?.addEventListener('click', () => {
  nav?.classList.toggle('is-open');
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => nav?.classList.remove('is-open'));
});

const tabButtons = document.querySelectorAll('[data-tab]');
const panels = document.querySelectorAll('[data-panel]');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((item) => item.classList.remove('is-active'));
    panels.forEach((panel) => panel.classList.remove('is-active'));
    button.classList.add('is-active');
    document.querySelector(`[data-panel="${button.dataset.tab}"]`)?.classList.add('is-active');
  });
});

const textarea = document.querySelector('textarea');
const count = document.querySelector('.count');
textarea?.addEventListener('input', () => {
  if (count) count.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const testimonialSlider = document.querySelector('[data-testimonial-slider]');
const testimonialTrack = document.querySelector('[data-testimonial-track]');
const testimonialPrev = document.querySelector('[data-testimonial-prev]');
const testimonialNext = document.querySelector('[data-testimonial-next]');
let testimonialIndex = 0;
let testimonialTimer = null;

const getVisibleTestimonials = () => {
  if (window.innerWidth <= 860) return 1;
  if (window.innerWidth <= 1120) return 2;
  return 3;
};

const getTestimonials = () => {
  if (!testimonialTrack) return [];
  return Array.from(testimonialTrack.querySelectorAll('.quote-card'));
};

const updateTestimonials = () => {
  const cards = getTestimonials();
  if (!testimonialSlider || !testimonialTrack || cards.length === 0) return;

  const visible = getVisibleTestimonials();
  const maxIndex = Math.max(0, cards.length - visible);
  testimonialIndex = Math.min(Math.max(testimonialIndex, 0), maxIndex);

  const gap = parseFloat(window.getComputedStyle(testimonialTrack).columnGap || window.getComputedStyle(testimonialTrack).gap) || 0;
  const cardWidth = cards[0].offsetWidth;
  const offset = testimonialIndex * (cardWidth + gap);

  testimonialTrack.style.transform = `translate3d(-${offset}px, 0, 0)`;

  const shouldShowControls = cards.length > visible;
  testimonialPrev?.toggleAttribute('disabled', !shouldShowControls);
  testimonialNext?.toggleAttribute('disabled', !shouldShowControls);
};

const moveTestimonials = (direction) => {
  const cards = getTestimonials();
  if (cards.length === 0) return;

  const maxIndex = Math.max(0, cards.length - getVisibleTestimonials());
  testimonialIndex += direction;

  if (testimonialIndex > maxIndex) testimonialIndex = 0;
  if (testimonialIndex < 0) testimonialIndex = maxIndex;

  updateTestimonials();
};

const startTestimonials = () => {
  if (testimonialTimer) clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => moveTestimonials(1), 3500);
};

testimonialPrev?.addEventListener('click', () => {
  moveTestimonials(-1);
  startTestimonials();
});

testimonialNext?.addEventListener('click', () => {
  moveTestimonials(1);
  startTestimonials();
});

testimonialSlider?.addEventListener('mouseenter', () => {
  if (testimonialTimer) clearInterval(testimonialTimer);
});

testimonialSlider?.addEventListener('mouseleave', startTestimonials);

window.addEventListener('resize', updateTestimonials);
window.addEventListener('load', updateTestimonials);
updateTestimonials();
startTestimonials();


const cookieBanner = document.querySelector('[data-cookie-banner]');
const cookieAccept = document.querySelector('[data-cookie-accept]');
const cookieDecline = document.querySelector('[data-cookie-decline]');
const privacyModal = document.querySelector('[data-privacy-modal]');
const privacyDialog = privacyModal?.querySelector('.privacy-modal__dialog');
const privacyOpenButtons = document.querySelectorAll('[data-privacy-open]');
const privacyCloseButtons = document.querySelectorAll('[data-privacy-close]');
const COOKIE_STORAGE_KEY = 'fabrykaViraliCookieConsent';

const showCookieBanner = () => {
  if (!cookieBanner) return;
  const savedConsent = localStorage.getItem(COOKIE_STORAGE_KEY);
  if (!savedConsent) cookieBanner.classList.add('is-visible');
};

const saveCookieChoice = (choice) => {
  localStorage.setItem(COOKIE_STORAGE_KEY, choice);
  cookieBanner?.classList.remove('is-visible');
};

const openPrivacyModal = () => {
  if (!privacyModal) return;
  privacyModal.classList.add('is-open');
  privacyModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  privacyDialog?.focus();
};

const closePrivacyModal = () => {
  if (!privacyModal) return;
  privacyModal.classList.remove('is-open');
  privacyModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

cookieAccept?.addEventListener('click', () => saveCookieChoice('accepted'));
cookieDecline?.addEventListener('click', () => saveCookieChoice('declined'));
privacyOpenButtons.forEach((button) => button.addEventListener('click', openPrivacyModal));
privacyCloseButtons.forEach((button) => button.addEventListener('click', closePrivacyModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePrivacyModal();
});

showCookieBanner();
