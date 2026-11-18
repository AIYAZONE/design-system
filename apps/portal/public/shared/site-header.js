import { renderNavigation, bindNavigation } from './site-navigation.js';
function mount() {
  if (document.querySelector('.portal-topbar')) return;
  const slot = document.querySelector('[data-site-header]') || document.getElementById('site-header') || document.body.insertBefore(document.createElement('div'), document.body.firstChild);
  slot.innerHTML = renderNavigation();
  bindNavigation(slot);
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'content';
  main?.setAttribute('tabindex', '-1');
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
else mount();
