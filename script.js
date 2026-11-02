// ===== FAQ アコーディオン =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ===== スムーズスクロール =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
    // モバイルメニューを閉じる
    nav.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ===== ハンバーガーメニュー =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
});

// ===== スクロール時ヘッダー =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

// ===== トップページ専用 =====
// 動きは「表示時にふわっと出る」だけに限定（チカチカする演出は入れない）
if (document.querySelector('.hero')) {
  const syncMenu = () => hamburger?.setAttribute('aria-expanded', hamburger.classList.contains('open'));
  hamburger?.addEventListener('click', syncMenu);
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); hamburger?.classList.remove('open'); syncMenu();
  }));
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-q').forEach(b => b.setAttribute('aria-expanded', b.parentElement.classList.contains('open')));
    });
  });

  const head = document.getElementById('header');
  window.addEventListener('scroll', () => head?.classList.toggle('is-solid', window.scrollY > 20), { passive: true });

  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }
}
