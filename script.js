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
// 動きは控えめに（点滅・繰り返しはなし）。prefers-reduced-motion では動かさない
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

  // ---- 動き：場所ごとに種類を変える。1回だけ・点滅や繰り返しはなし ----
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    const root = document.documentElement;
    root.classList.add('js');

    // ヒーロー：見出しを行ごとに包んで、下からせり上げる
    const title = document.querySelector('.hero__title');
    if (title) {
      title.innerHTML = title.innerHTML.split(/<br\s*\/?>/i)
        .map((h, i) => `<span class="line"><span style="transition-delay:${0.15 + i * 0.12}s">${h}</span></span>`).join('');
    }
    // 実績の数字はカウントアップ
    const countUp = el => {
      const target = parseInt(el.textContent.replace(/,/g, ''), 10);
      if (!target || target < 2) return;
      const start = performance.now(), dur = 1400;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased).toLocaleString('ja-JP');
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.classList.add('is-loaded');
      setTimeout(() => document.querySelectorAll('.numbers .num').forEach(countUp), 800);
    }));

    // スクロールで出てくる要素に、種類ごとのクラスを付ける
    document.querySelectorAll('.head__en, .head__ja, .head__title, .profile__photo').forEach(el => el.setAttribute('data-motion', ''));
    // カードは並び順に少しずつ遅らせる
    document.querySelectorAll('.cards').forEach(group => {
      [...group.children].forEach((c, i) => { c.style.transitionDelay = `${i * 0.09}s`; });
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('is-in'); io.unobserve(el);
        // 出終わったら遅延を外す（ホバー時の反応を遅らせないため）
        if (el.style.transitionDelay) setTimeout(() => { el.style.transitionDelay = ''; }, 1600);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]:not(.hero [data-reveal]), [data-motion]').forEach(el => io.observe(el));
  }

  // スマホ用の追従ボタン：ヒーローを過ぎたら表示し、問い合わせ欄が見えている間は隠す
  const sp = document.getElementById('spCta');
  const heroEl = document.querySelector('.hero');
  const contactEl = document.getElementById('contact');
  if (sp && heroEl && 'IntersectionObserver' in window) {
    let heroVisible = true, contactVisible = false;
    const update = () => {
      const show = !heroVisible && !contactVisible;
      sp.classList.toggle('is-show', show);
      sp.setAttribute('aria-hidden', String(!show));
      sp.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }).observe(heroEl);
    if (contactEl) new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; update(); }).observe(contactEl);
  }
}
