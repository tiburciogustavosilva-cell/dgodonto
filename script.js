(function () {
  "use strict";

  /* Header: borda inferior depois de rolar */
  var header = document.querySelector(".header");
  var sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:0;height:12px;width:1px;pointer-events:none";
  document.body.prepend(sentinel);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* "#topo" aponta para o header fixo, que não tem posição no fluxo:
     o navegador não rola sozinho, então rolamos manualmente. */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href="#topo"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      history.pushState(null, "", "#topo");
    });
  });

  /* Menu mobile */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
  }
  navToggle.addEventListener("click", function () {
    setNav(!nav.classList.contains("is-open"));
  });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setNav(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setNav(false);
      navToggle.focus();
    }
  });

  document.getElementById("anoAtual").textContent = String(new Date().getFullYear());

  /* Carrossel de avaliações: setas rolam um card por vez */
  var quotes = document.getElementById("quotes");
  var qBtns = document.querySelectorAll(".quotes__btn");
  function updateQBtns() {
    var max = quotes.scrollWidth - quotes.clientWidth - 2;
    qBtns[0].disabled = quotes.scrollLeft <= 2;
    qBtns[1].disabled = quotes.scrollLeft >= max;
  }
  qBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var step = quotes.firstElementChild.offsetWidth + 16;
      quotes.scrollBy({ left: step * Number(btn.dataset.dir), behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
  quotes.addEventListener("scroll", updateQBtns, { passive: true });
  updateQBtns();

  /* Revelação ao rolar. .reveal só some via CSS com a classe "js"
     (ver <head>), então se este script falhar o conteúdo fica visível. */
  var revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach(function (el) { observer.observe(el); });
})();
