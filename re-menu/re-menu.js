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

  // QA test pages: the SPA's section reveal and diagram motion (qa-pages.js, loaded before this file).
  if (typeof wireQaPages === "function") wireQaPages();

  // 블랙박스 테스트 기법 (dial): the hand turns the short way to the chosen point and the centre explains it;
  // it steps on by itself until someone picks one.
  document.querySelectorAll("[data-tech]").forEach((dial) => {
    const nodes = [...dial.querySelectorAll(".rb-node")];
    const descs = [...dial.querySelectorAll(".rb-desc")];
    const dots = [...dial.querySelectorAll(".rb-dot")];
    const hand = dial.querySelector(".rb-hand");
    const step = 360 / nodes.length;
    let at = 0;
    let deg = 0;
    let timer = 0;
    const show = (i) => {
      deg += ((((i - at) * step) % 360) + 540) % 360 - 180;
      at = i;
      hand.style.transform = `rotate(${deg}deg)`;
      nodes.forEach((node, k) => node.setAttribute("aria-pressed", String(k === i)));
      descs.forEach((desc, k) => desc.classList.toggle("is-on", k === i));
      dots.forEach((dot, k) => dot.classList.toggle("is-on", k === i));
    };
    const stop = () => { clearInterval(timer); timer = 0; };
    nodes.forEach((node, i) => {
      node.addEventListener("click", () => { stop(); show(i); });
      node.addEventListener("mouseenter", () => { stop(); show(i); });
      node.addEventListener("focus", () => { stop(); show(i); });
    });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => show((at + 1) % nodes.length), 3600);
  });

  // 화이트박스 커버리지: each criterion marks the truth-table rows its minimal test set needs.
  document.querySelectorAll("[data-cov]").forEach((box) => {
    const crits = [...box.querySelectorAll(".rw-crit")];
    const descs = [...box.querySelectorAll(".rw-desc")];
    const rows = [...box.querySelectorAll("tbody tr")];
    let at = 0;
    let timer = 0;
    const show = (i) => {
      at = i;
      const need = crits[i].dataset.need.split(",");
      crits.forEach((c, k) => c.setAttribute("aria-pressed", String(k === i)));
      descs.forEach((d, k) => d.classList.toggle("is-on", k === i));
      rows.forEach((r) => r.classList.toggle("is-need", need.includes(r.dataset.row)));
    };
    const stop = () => { clearInterval(timer); timer = 0; };
    crits.forEach((c, i) => {
      c.addEventListener("click", () => { stop(); show(i); });
      c.addEventListener("mouseenter", () => { stop(); show(i); });
      c.addEventListener("focus", () => { stop(); show(i); });
    });
    show(0);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => show((at + 1) % crits.length), 4200);
  });

  // 테스트 분야 photo cards (site.js wireDeck): the clicked card opens, the others close.
  document.querySelectorAll(".expand-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.parentElement.querySelectorAll(".expand-card").forEach((el) => {
        el.classList.toggle("is-open", el === card);
        el.setAttribute("aria-expanded", String(el === card));
      });
    });
  });

  // 테스트 종류 explorer (site.js wireExplorer, static): the chosen photo wipes in, its info block shows.
  const qx = document.querySelector(".qx");
  if (qx) {
    const tabs = [...qx.querySelectorAll(".qx-list button")];
    const shots = [...qx.querySelectorAll(".qx-shot")];
    const infos = [...qx.querySelectorAll(".qx-info")];
    const bar = qx.querySelector(".qx-bar");
    const panel = qx.querySelector(".qx-panel");
    let at = 0;
    const moveBar = () => {
      bar.style.transform = `translateY(${tabs[at].offsetTop}px)`;
      bar.style.height = tabs[at].offsetHeight + "px";
    };
    const pick = (i, focus) => {
      if (i === at) return;
      shots.forEach((shot) => shot.classList.remove("was"));
      shots[at].classList.replace("is-on", "was");
      shots[i].classList.add("is-on");
      tabs.forEach((tab, k) => {
        tab.setAttribute("aria-selected", String(k === i));
        tab.tabIndex = k === i ? 0 : -1;
      });
      infos.forEach((info, k) => { info.hidden = k !== i; });
      infos[i].classList.remove("swap");
      void infos[i].offsetWidth;
      infos[i].classList.add("swap");
      panel.setAttribute("aria-labelledby", tabs[i].id);
      at = i;
      moveBar();
      if (focus) tabs[i].focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => pick(i));
      tab.addEventListener("mouseenter", () => pick(i));
      tab.addEventListener("keydown", (event) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        pick((at + step + tabs.length) % tabs.length, true);
      });
    });
    moveBar();
    window.addEventListener("resize", moveBar, { passive: true });
  }
})();
