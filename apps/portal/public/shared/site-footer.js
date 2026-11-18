const mountSiteFooter = () => {
  if (document.querySelector('.site-footer')) return;

  Array.from(document.querySelectorAll('.portal-footer')).forEach((el) => el.remove());
  Array.from(document.querySelectorAll('footer.footer')).forEach((el) => el.remove());

  const existingCss = document.querySelector('link[href="/shared/site-footer.css"]');
  if (!existingCss) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/shared/site-footer.css';
    document.head.appendChild(link);
  }

  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  const yearText = currentYear > startYear ? `${startYear}–${currentYear}` : String(startYear);

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="site-footer__inner">
      <p class="site-footer__identity"><span class="site-footer__brand">AIYAZONE</span><span class="site-footer__copyright">© ${yearText} · 设计系统</span></p>
      <a class="site-footer__link" href="/architecture.html">架构<span aria-hidden="true">↗</span></a>
    </div>
  `.trim();

  const slot = document.querySelector('[data-site-footer]');
  if (slot) {
    slot.replaceWith(footer);
    return;
  }

  document.body.appendChild(footer);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountSiteFooter, { once: true });
} else {
  mountSiteFooter();
}
