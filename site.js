const nav = document.getElementById('site-nav');
const menu = document.getElementById('nav-menu');

/* The top bar turns beige once the page is scrolled. */
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* The menu is a details element and opens by itself. A tap on one of its links closes it. */
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { menu.open = false; }));

/* Escape closes the menu and puts the focus back on its button. */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});

document.getElementById('footer-year').textContent = new Date().getFullYear();

/* No server and no form service: the button opens the visitor's own email app. */
const CONTACT_EMAIL = 'varun@belaniaccounting.ca';
const FORM_STORE = 'contact-form';
const FORM_FIELDS = ['name', 'phone', 'service', 'message'];

function openEmailApp(url) { window.location.href = url; }

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const field = (id) => document.getElementById(id);

  /* Kept in the visitor's browser so it is still there after the page is closed. Storage can be blocked. */
  try {
    const saved = JSON.parse(localStorage.getItem(FORM_STORE) || '{}');
    FORM_FIELDS.forEach((id) => { if (saved[id]) field(id).value = saved[id]; });
  } catch {}

  contactForm.addEventListener('input', () => {
    const typed = {};
    FORM_FIELDS.forEach((id) => { typed[id] = field(id).value; });
    try { localStorage.setItem(FORM_STORE, JSON.stringify(typed)); } catch {}
  });

  /* A quote button on a service page passes its service, so the list opens on it. */
  const wanted = new URLSearchParams(window.location.search).get('service');
  const wantedOption = Array.from(field('service').options).find((o) => o.dataset.service === wanted);
  if (wantedOption) wantedOption.selected = true;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = field('name').value.trim();
    const service = field('service').value.trim();
    const body = [
      'Name: ' + name,
      'Phone: ' + field('phone').value.trim(),
      'Service: ' + service,
      '',
      field('message').value.trim().replace(/\r?\n/g, '\r\n'),
    ].join('\r\n');
    const subject = 'Website inquiry from ' + name + (service ? ': ' + service : '');
    openEmailApp('mailto:' + CONTACT_EMAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body));
    const status = field('form-status');
    status.hidden = false;
    status.focus();
  });
}
