// /re-menu glue. Two contexts share this file:
//  · the SPA shell (re-menu/index.html, the /multi site): 테스트 종류 links and routes go to the static pages.
//  · the static pages (body[data-rm="static"]): the /multi header behaviour from site.js, without the router.
(() => {
  const ROOT = document.body.dataset.rm === "static" ? "../" : "";

  // #qa/types[/id] (and the local #qa/service/… spelling) → static page path, relative to /re-menu/.
  const LEAF = { outsourcing: "outsourcing", automation: "automation", blackbox: "blackbox", whitebox: "whitebox", api: "api", perfomance: "performance", performance: "performance" };
  function staticPath(hash) {
    const types = hash.match(/^#qa\/(?:service\/)?types(?:\/([a-z]+))?\/?$/);
    if (types) return types[1] ? (LEAF[types[1]] ? LEAF[types[1]] + "/" : null) : "types/";
    const service = hash.match(/^#qa\/service\/(outsourcing|automation)\/?$/);
    return service ? service[1] + "/" : null;
  }

  if (!ROOT) {
    const go = () => {
      const path = staticPath(location.hash);
      if (path) location.replace(path);
    };
    const relink = () => document.querySelectorAll('a[href^="#qa/"]').forEach((a) => {
      const path = staticPath(a.getAttribute("href"));
      if (path) a.setAttribute("href", path);
    });
    go();
    relink();
    window.addEventListener("hashchange", go);
    // site.js rebuilds the header and the page on every route; fix links as they appear.
    new MutationObserver(relink).observe(document.body, { childList: true, subtree: true });
    return;
  }

  const header = document.querySelector(".header");
  const nav = document.getElementById("nav");
  const drop = document.getElementById("menu-drop");
  const toggle = document.getElementById("nav-toggle");
  const phone = () => window.matchMedia("(max-width: 768px)").matches;
  const fit = () => Math.min(drop.querySelector(".drop-cols").offsetHeight, Math.max(0, window.innerHeight - header.offsetHeight));

  function open(id) {
    if (phone() || !id) return;
    const opening = !drop.classList.contains("is-open");
    drop.classList.add("is-open");
    drop.querySelectorAll(".drop-col").forEach((col) => col.classList.toggle("is-hover", col.dataset.id === id));
    if (opening) {
      drop.style.height = "0px";
      requestAnimationFrame(() => { drop.style.height = fit() + "px"; });
    } else drop.style.height = fit() + "px";
  }
  function close() {
    drop.style.height = "0px";
    drop.classList.remove("is-open");
    drop.querySelectorAll(".drop-col").forEach((col) => col.classList.remove("is-hover"));
  }

  nav.addEventListener("mouseover", (event) => {
    const link = event.target.closest("a[data-id]");
    if (link) open(link.dataset.id);
  });
  nav.addEventListener("focusin", (event) => {
    const link = event.target.closest("a[data-id]");
    if (link) open(link.dataset.id);
  });
  document.getElementById("logo-link").addEventListener("mouseenter", close);
  document.querySelector(".tools").addEventListener("mouseenter", close);
  drop.addEventListener("mouseenter", () => open(drop.querySelector(".drop-col.is-hover")?.dataset.id || ""));
  header.addEventListener("mouseleave", close);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  window.addEventListener("resize", () => { if (drop.classList.contains("is-open")) drop.style.height = fit() + "px"; });
  toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", String(nav.classList.toggle("open"))));

  // Centre the current tab inside the tab strip only; scrollIntoView would also scroll the page.
  const current = document.querySelector('.rm-tabs [aria-current="page"]');
  if (current) {
    const strip = current.closest("ul");
    strip.scrollLeft = current.offsetLeft - (strip.clientWidth - current.offsetWidth) / 2;
  }
})();
