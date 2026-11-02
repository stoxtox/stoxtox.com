// On phones the header's links fold into a menu (menu.css). It's built from the header's own list, so each page keeps
// one list of links; without JavaScript, that list simply stays in the header.
(() => {
  const nav = document.querySelector('.nav');
  const list = nav && nav.querySelector('ul');
  if (!list) return;
  const root = document.documentElement;

  // One line under each name: what's there, in a few words. Section links by their anchor, pages by name.
  const notes = {
    '#inside': 'Any company, in plain words',
    '#xray': 'What your funds really own',
    '#performance': 'How you did against the market',
    '#plus': 'Free for 3 months, then $49.99 a year',
    '#privacy': 'Your numbers stay yours',
    Home: 'Everything you own, one number',
    Help: 'Answers, and how to do things',
    About: 'Who makes Stoxtox, and why',
    Privacy: 'What we collect, and why',
    Terms: 'The rules for using Stoxtox',
    Contact: 'support@stoxtox.com',
  };
  const links = [...list.querySelectorAll('a:not(.pill)')];
  const onHome = location.pathname === '/' || location.pathname === '/index.html';
  if (!onHome) links.unshift(Object.assign(document.createElement('a'), { href: '/', textContent: 'Home' }));
  const cta = list.querySelector('.pill');

  const button = document.createElement('button');
  button.className = 'menu-btn';
  button.type = 'button';
  button.setAttribute('aria-label', 'Menu');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'menu');
  button.innerHTML = '<i></i><i></i>';
  nav.appendChild(button);

  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  sheet.id = 'menu';
  sheet.setAttribute('inert', '');
  const items = links.map((a, i) => {
    const name = a.textContent.trim();
    const note = notes[a.getAttribute('href')] || notes[name] || '';
    const here = a.getAttribute('aria-current') === 'page' ? ' aria-current="page"' : '';
    return `<li style="--i:${i}"><a class="go" href="${a.getAttribute('href')}"${here}><b>${name}</b>${note ? `<span>${note}</span>` : ''}</a></li>`;
  }).join('');
  sheet.innerHTML = `<nav aria-label="Menu"><ol>${items}</ol><div class="end">` +
    (cta ? `<a class="cta" href="${cta.getAttribute('href')}">${cta.textContent.trim()}</a><small>App Store coming soon</small>` : '') +
    // Pages with a Contact row already show the address there.
    `<p class="foot">&copy; 2026 Stoxtox LLC${links.some((a) => a.textContent.trim() === 'Contact') ? '' : ' &middot; <a href="mailto:support@stoxtox.com">support@stoxtox.com</a>'}</p></div></nav>`;
  document.body.appendChild(sheet);
  root.classList.add('has-menu');

  const open = () => root.classList.contains('menu-open');
  const set = (on) => {
    root.classList.toggle('menu-open', on);
    button.setAttribute('aria-expanded', String(on));
    button.setAttribute('aria-label', on ? 'Close menu' : 'Menu');
    sheet.toggleAttribute('inert', !on);
    if (on) sheet.querySelector('a')?.focus({ preventScroll: true });
  };
  button.addEventListener('click', () => set(!open()));
  // A section on this page: close, then let the page scroll there.
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && open()) { set(false); button.focus(); } });
  matchMedia('(min-width: 621px)').addEventListener('change', (e) => { if (e.matches) set(false); });
})();
