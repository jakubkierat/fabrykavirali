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

// --- FAQ: rozwijane odpowiedzi ---
document.querySelectorAll('[data-faq-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
  });
});

// --- Wysyłka formularza kontaktowego ---
const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');
const submitButton = contactForm?.querySelector('button[type="submit"]');

const setFormStatus = (message, type) => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove('is-success', 'is-error');
  if (type) formStatus.classList.add(`is-${type}`);
};

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const endpoint = contactForm.getAttribute('action');
  if (!endpoint) {
    setFormStatus('Formularz nie jest jeszcze podłączony.', 'error');
    return;
  }

  submitButton?.setAttribute('disabled', 'true');
  setFormStatus('Wysyłanie…', null);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });

    let data = null;
    try {
      data = await response.json();
    } catch (parseError) {
      data = null;
    }

    if (response.ok && (data ? data.success : true)) {
      setFormStatus((data && data.message) || 'Dziękujemy! Wiadomość została wysłana — odezwiemy się najszybciej, jak to możliwe.', 'success');
      contactForm.reset();
      if (count) count.textContent = `0 / ${textarea?.maxLength ?? 600}`;
    } else {
      setFormStatus((data && data.message) || 'Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na biuro@fabrykavirali.pl.', 'error');
    }
  } catch (error) {
    setFormStatus('Brak połączenia z serwerem formularza. Spróbuj ponownie lub napisz na biuro@fabrykavirali.pl.', 'error');
  } finally {
    submitButton?.removeAttribute('disabled');
  }
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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const startTestimonials = () => {
  if (prefersReducedMotion) return;
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

// --- Ładowanie Google Fonts (dopiero po zgodzie użytkownika, zgodnie z polityką cookies) ---
let fontsLoaded = false;
const loadGoogleFonts = () => {
  if (fontsLoaded) return;
  fontsLoaded = true;

  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect1);

  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = '';
  document.head.appendChild(preconnect2);

  const fontStylesheet = document.createElement('link');
  fontStylesheet.rel = 'stylesheet';
  fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap';
  document.head.appendChild(fontStylesheet);
};

cookieAccept?.addEventListener('click', () => {
  saveCookieChoice('accepted');
  loadGoogleFonts();
});
cookieDecline?.addEventListener('click', () => saveCookieChoice('declined'));
privacyOpenButtons.forEach((button) => button.addEventListener('click', openPrivacyModal));
privacyCloseButtons.forEach((button) => button.addEventListener('click', closePrivacyModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePrivacyModal();
});

showCookieBanner();

// Jeśli zgoda była już wcześniej zapisana w tej przeglądarce, załaduj czcionkę od razu
if (localStorage.getItem(COOKIE_STORAGE_KEY) === 'accepted') loadGoogleFonts();
