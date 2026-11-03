// アクセス解析（GA4 / Microsoft Clarity）: IDを入れると全ページで有効になる。空のままなら何も読み込まない
(function () {
  var GA4_ID = "";      // 例: G-XXXXXXXXXX
  var CLARITY_ID = "";  // 例: abcd1234ef
  if (GA4_ID) {
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", GA4_ID);
    // 問い合わせフォームへのクリックを計測
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href*="forms.gle"]');
      if (a) gtag("event", "form_click", { link_text: a.textContent.trim() });
    });
  }
  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }
})();
