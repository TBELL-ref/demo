const BLOG_CATS = [
  {
    id: "qa-insight", name: "QA Insight", modes: ["qa", "all"],
    children: [
      { id: "qa-basic", name: "QA 기본·실무", nos: [22] },
      { id: "auto-tool", name: "테스트 자동화·도구", nos: [23] },
      { id: "ai-data", name: "AI·데이터 품질", nos: [24] },
      { id: "trend", name: "품질 사례·트렌드", nos: [25] }
    ]
  },
  { id: "security", name: "보안", modes: ["security", "all"], nos: [28] },
  { id: "newsletter", name: "NewsLetter", modes: ["qa", "security", "all"], nos: [7] },
  // 블로그 전시·행사는 QA(30)·보안(31)·공통(10)으로 나뉨. 보안 모드는 보안 전용만 보여 줌.
  { id: "event", name: "전시·행사", modes: ["qa"], nos: [30, 10] },
  { id: "event", name: "전시·행사", modes: ["security"], nos: [31] },
  { id: "event", name: "전시·행사", modes: ["all"], nos: [30, 31, 10] },
  { id: "activity", name: "성과·활동", modes: ["qa", "security", "all"], nos: [18] }
];

// One site under one header: QA · 보안 · 블로그 · 회사소개. QA and 보안 keep their own routes (#qa/…,
// #security/…); blog, company and inquiry are shared, in mode "all": #blog, #company/…, #inquiry/qa|security.
const hashBase = (mode) => (mode === "all" ? "#" : "#" + mode + "/");

// Routes are real paths under the site root (…/qa/service/outsourcing/), so each page has its own URL.
// The markup still writes a route as "#qa/service/outsourcing"; pathLinks() turns those links into paths
// once they are in the page, and go() moves between routes without a reload. tools/build_routes.mjs
// writes a copy of index.html at every route so a direct visit or a crawler gets a real page.
// The /re-menu shell sets TBELL_HASH_ROUTES and keeps the "#…" routes.
const HASH_ROUTES = !!window.TBELL_HASH_ROUTES;
const SITE_ROOT = new URL(window.TBELL_BASE || "./", location.href).pathname;
const ROUTE_HEADS = ["qa", "security", "blog", "company", "inquiry"];

function isRoute(href) {
  if (href === "#") return true;
  const head = /^#([a-z]+)(?:\/|$)/.exec(href || "");
  return !!head && ROUTE_HEADS.includes(head[1]);
}

function routeUrl(href) {
  const raw = href.replace(/^#/, "").replace(/\/+$/, "");
  return SITE_ROOT + (raw ? raw + "/" : "");
}

function currentRaw() {
  if (HASH_ROUTES) return (location.hash || "").replace(/^#/, "");
  const path = decodeURIComponent(location.pathname);
  const rest = path.startsWith(SITE_ROOT) ? path.slice(SITE_ROOT.length) : "";
  return rest.replace(/(^|\/)index\.html$/, "").replace(/\/+$/, "");
}

function isHere(href) {
  return HASH_ROUTES ? (location.hash || "#") === href : routeUrl(href) === SITE_ROOT + (currentRaw() ? currentRaw() + "/" : "");
}

function go(href, replace) {
  if (HASH_ROUTES) {
    if (replace) location.replace(href);
    else location.hash = href;
    return;
  }
  history[replace ? "replaceState" : "pushState"](null, "", routeUrl(href));
  onRoute();
}

function pathLinks() {
  if (HASH_ROUTES) return;
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!isRoute(href)) return;
    link.setAttribute("href", routeUrl(href));
    link.dataset.route = href;
  });
}

function blogNodes(mode) {
  return BLOG_CATS.filter((cat) => cat.modes.includes(mode));
}

function blogLocate(mode, id) {
  for (const cat of blogNodes(mode)) {
    if (cat.id === id) return { group: cat, leaf: cat.children ? null : cat };
    const kid = (cat.children || []).find((child) => child.id === id);
    if (kid) return { group: cat, leaf: kid };
  }
  return { group: null, leaf: null };
}

function blogMenu(mode) {
  return {
    id: "blog",
    label: "블로그",
    href: hashBase(mode) + "blog",
    children: blogNodes(mode).map((cat) => ({
      id: cat.id,
      label: cat.name,
      href: hashBase(mode) + "blog/" + cat.id
    }))
  };
}

// The site drops the greeting from 회사소개 (only 티벨 코어 and 찾아오시는 길 remain), so it is "기업 정보" there.
const ABOUT_LABEL = (mode) => (mode === "all" ? "기업 정보" : "회사소개");
const COMPANY_MENU = (mode) => ({
  id: "company",
  label: "회사 소개",
  href: hashBase(mode) + "company",
  children: [
    {
      id: "about", label: ABOUT_LABEL(mode), href: hashBase(mode) + "company/about",
      children: [
        { id: "about", label: ABOUT_LABEL(mode), href: hashBase(mode) + "company/about" },
        { id: "vision", label: "경영철학", href: hashBase(mode) + "company/vision" },
        { id: "history", label: "연혁", href: hashBase(mode) + "company/history" }
      ]
    },
    {
      id: "recruit", label: "채용·복지", href: hashBase(mode) + "company/recruit",
      children: [
        { id: "benefit", label: "복리후생", href: hashBase(mode) + "company/benefit" },
        { id: "recruit", label: "인재채용", href: hashBase(mode) + "company/recruit" }
      ]
    },
    {
      id: "esg", label: "지속가능경영", href: hashBase(mode) + "company/esg",
      children: [
        { id: "ethical", label: "윤리경영", href: hashBase(mode) + "company/ethical" },
        { id: "social", label: "사회경영", href: hashBase(mode) + "company/social" },
        { id: "environmental", label: "환경경영", href: hashBase(mode) + "company/environmental" }
      ]
    }
  ]
});

// QA's own menu groups; the header (MENU) puts them under QA. Every test service and both TestOps pages
// are listed by name, so the menu shows the whole QA offer.
const QA_GROUPS = [
  {
    id: "service", label: "테스트 서비스", href: "#qa/service/outsourcing",
    children: [
      { id: "outsourcing", label: "QA 아웃소싱", href: "#qa/service/outsourcing" },
      { id: "automation", label: "테스트 자동화", href: "#qa/service/automation" },
      { id: "blackbox", label: "블랙박스 테스트", href: "#qa/service/types/blackbox" },
      { id: "whitebox", label: "화이트박스 테스트", href: "#qa/service/types/whitebox" },
      { id: "api", label: "API 테스트", href: "#qa/service/types/api" },
      { id: "performance", label: "성능 테스트", href: "#qa/service/types/performance" }
    ]
  },
  {
    id: "testops", label: "TestOps", href: "#qa/service/automation/testops",
    children: [
      { id: "build", label: "TestOps 구축", href: "#qa/service/automation/testops" },
      { id: "ai", label: "AI 기반 검증 자동화", href: "#qa/service/automation/ai" }
    ]
  },
  {
    id: "solution", label: "솔루션", href: "#qa/solution",
    children: [
      { id: "overview", label: "T 브랜드 솔루션", href: "#qa/solution" },
      { id: "auto", label: "T-AUTO", href: "#qa/solution/auto" },
      { id: "lens", label: "T-LENS", href: "#qa/solution/lens" },
      { id: "gen", label: "T-GEN", href: "#qa/solution/gen" },
      { id: "voc", label: "T-VOC", href: "#qa/solution/voc" }
    ]
  }
];

const MODE_LABEL = { qa: "QA", security: "정보보호", all: "TBELL" };

const content = document.getElementById("content");
const nav = document.getElementById("nav");
const header = document.querySelector(".header");
const menuDrop = document.getElementById("menu-drop");
const logoLink = document.getElementById("logo-link");
const tools = document.querySelector(".tools");
const logoMode = document.getElementById("logo-mode");
const inquire = document.getElementById("inquire");
const navToggle = document.getElementById("nav-toggle");

function parse() {
  const raw = currentRaw();
  let [mode, group, child, page] = raw.split("/");
  const known = ["qa", "security"];
  if (["blog", "company", "inquiry"].includes(mode)) {
    // #blog[/cat][/n] · #company[/child] · #inquiry/qa|security
    let [, a = "", b = ""] = raw.split("/");
    if (mode === "blog" && /^\d+$/.test(a)) { b = a; a = ""; }
    return { mode: "all", group: mode, child: a, page: mode === "blog" ? b : "" };
  }
  if (known.includes(mode) && group === "blog" && child && /^\d+$/.test(child) && !page) {
    page = child;
    child = "";
  }
  return {
    mode: known.includes(mode) ? mode : "",
    group: known.includes(mode) ? (group || "") : "",
    child: known.includes(mode) ? (child || "") : "",
    page: known.includes(mode) ? (page || "") : ""
  };
}

function card(href, en, title, text, external) {
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
  const go = external ? "네이버에서 보기" : "보기";
  return `<a class="card" href="${href}"${attrs}><span class="en">${en}</span><h3>${title}</h3><p>${text}</p><span class="go">${go}</span></a>`;
}

function page(kicker, title, lede, body, jumps) {
  const bar = jumps && jumps.length
    ? `<nav class="subnav" aria-label="이 페이지">${jumps.map(([id, label]) => `<button type="button" data-jump="${id}">${label}</button>`).join("")}</nav>`
    : "";
  const ledeHtml = lede ? `<p class="lede">${lede}</p>` : "";
  return `<section class="detail"><div class="banner"><p class="kicker">${kicker}</p><h1>${title}</h1>${ledeHtml}</div>${bar}<div class="sheet">${body || ""}</div></section>`;
}

// ── Home (design_demo/multi-home-hero-plan.md) ─────────────────────────────
// Hero says what the company does without naming the businesses; right below it, two
// equal entrances into QA and 정보보호 using each home's own h1 and artwork. MISSION and
// 티벨 코어, the milestones and the offices follow. Figures are the published ones.
// Home SINCE 2015: the published figures, then three milestones in one line (the full history is on 연혁).
const MULTI_STEPS = [["2015", "설립"], ["2016", "기업부설연구소"], ["2020", "벤처기업 인증"]];
const MULTI_FIGURES = [[1460, "개", "누적 수행 프로젝트"], [161, "개사", "이용 고객사"], [165, "명", "임직원"], [299, "억 원", "누적 매출"]];

// Door artwork for 정보보호: a still copy of the security home shield.
const BIZ_ART = {
  security: () => `<span class="mb-shield"><img src="${window.TBELL_BASE || ""}assets/shield.png?v=3" alt="" loading="lazy"><i></i><svg viewBox="0 0 1400 1400"><path d="M642 642 L686 686 L766 594"/></svg></span>`
};

// Home hero door: one half of the screen per business, the whole half is the link.
// Copy is that home's own label and h1; artwork is the shared BIZ_ART.
function multiDoor(sec) {
  const qa = sec.id === "qa";
  const art = qa
    ? `<span class="door-art" aria-hidden="true" style="background-image:url('${ORIGIN}banner-main-pc-001.0e1ee99f9660f77d4fe1.png')"></span>`
    : `<span class="door-art" aria-hidden="true">${BIZ_ART.security()}</span>`;
  return `<a class="door door-${sec.id}" href="${sec.href}">
      ${art}
      <span class="door-copy">
        <b>${qa ? "QA 서비스" : "보안 서비스"}</b>
        <span class="door-line">${qa ? "차별화된 테스트 경험을 제공하는 대표 품질 서비스" : "기업의 보안 수준을 높이는 전문 보안 진단 및 컨설팅 서비스"}</span>
        <em>자세히 알아보기<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></em>
      </span>
    </a>`;
}

function multiHome() {
  const base = window.TBELL_BASE || "";
  const core = [["core-test", "QUALITY", "품질에 대한 책임"], ["core-security", "SECURITY", "신뢰할 수 있는 보안"], ["core-customer", "CUSTOMER", "고객 중심의 가치"], ["core-human", "PEOPLE", "사람과 전문성"]];
  const [qaSec, secSec] = MENU;
  return `<div class="mh">
  <section class="mh-doors">
    <h1 class="sr-only">TBELL</h1>
    ${multiDoor(qaSec)}${multiDoor(secSec)}
  </section>
  <section class="mh-core" style="background-image:url('${base}assets/qa/photos/core-building.jpg')">
    <div class="mh-wrap">
      <h2>티벨이 추구하는 가치</h2>
      <p class="mh-mission">기술과 전문성을 바탕으로 <br>고객의 품질과 보안 수준을 높이고, <br>더 나은 비즈니스 가치를 만들어갑니다.</p>
      <ul class="mh-rings">${core.map(([icon, t, ko], i) => `<li style="--i:${i}"><span><img src="${base}assets/qa/icons/${icon}.png" alt=""></span><b>${t}</b><small>${ko}</small></li>`).join("")}</ul>
    </div>
  </section>
  <section class="mh-since" data-count-zone>
    <div class="mh-wrap">
      <p class="qh-label">SINCE 2015</p>
      <h2>고객과 함께 성장해 온 티벨</h2>
      <p class="mh-since-lede">2015년 설립 이후 다양한 산업에서 쌓아온 경험과 신뢰</p>
      <div class="mh-figs">${MULTI_FIGURES.map(([n, u, l]) => `<div><p>${l}</p><strong><span class="count" data-count="${n}">0</span><small>${u}</small></strong></div>`).join("")}</div>
      <div class="mh-steps"><p>주요 발자취</p><ol>${MULTI_STEPS.map(([y, t]) => `<li><b>${y}</b><span>${t}</span></li>`).join("")}</ol></div>
    </div>
  </section>
  <section class="mh-clients">
    <div class="mh-wrap">
      <h2>티벨과 함께하는 고객사</h2>
      <ul>${CLIENT_LOGOS.map((file) => `<li><img src="${base}assets/origin/${file}" alt="" loading="lazy"></li>`).join("")}</ul>
    </div>
  </section>
</div>`;
}

// ── QA home (design_demo/qa-home-plan.md) ────────────────────────────
// Hero, service photo explorer, TestOps flow, T 솔루션 tabs, industries, closing band.
// Client logos: the origin main page's 19 tiles, shown on the company main page (multiHome).
const CLIENT_LOGOS = [
  "01_sk_telecom.ae25244966926033ab37.png", "02_logo.26e3f50ed53544c1c7ac.png", "03_lg.a96d12b90e0b1d8e2a5a.png",
  "04_lgu+.5aa452b3620888b8180c.png", "05_woongjin.4b5f79bcf32c2b52d4c0.png", "06_gs.b4937c30866898d5978d.png",
  "07_olive_young.e63706f5f90bed782755.png", "08_kakaopay.ec0feddaf22e913c7e02.png", "09_tmap_mobility.png",
  "10_logo.903a4c7c9aa13d6268ce.png", "11_theres.78c038692ae02eeeb8b8.png", "12_11street.ce145ee69dde686b285c.png",
  "13_line.png", "14_kt.626d843890e82319cfb2.png", "15_tripstore.35fd24420f22a807102d.png",
  "16_cyberlogitec.21555d984495dfddc26d.png", "17_lig.c81d0240fab7968ff357.png", "18_hmm.18d13a82edd9e11b5231.png",
  "19_nuri.9e846a18d466c945442b.png"
];

// Service explorer: names and copy from the origin service pages (SERVICE_SLIDES / page artwork).
const QA_EXPLORE = [
  ["outsourcing", "아웃소싱 테스트", "기업과 프로젝트의 특성에 맞춘 고객 맞춤형 테스트입니다. 분야별 테스트 전문가가 개발자와 바로 소통합니다."],
  ["automation", "테스트 자동화", "티벨만의 차별화된 자동화 테스트로 더 높은 수준의 품질과 고객 만족을 약속합니다."],
  ["blackbox", "블랙박스 테스트", "개발 명세서를 기반으로 테스트 시나리오를 작성하고 수행해 제품 품질을 개선합니다."],
  ["whitebox", "화이트박스 테스트", "내부 소스 코드를 대상으로 동작의 유효성뿐 아니라 실행 과정까지 살펴봅니다."],
  ["api", "API 테스트", "서로 다른 소프트웨어 시스템 사이의 통신과 연동을 기능·안정성·성능 관점에서 검증합니다."],
  ["perfomance", "성능 테스트", "처리량과 응답시간, 자원 사용 등 성능 측정 지표를 산출해 시스템의 한계와 임계점을 검증합니다."]
];

// Where a service id opens: 아웃소싱 and 자동화 have pages of their own, the four test types share
// 테스트 유형. The ids keep the origin's "perfomance" (its artwork names); the URL spells it right.
function qaServiceHref(id) {
  if (id === "outsourcing" || id === "automation") return "#qa/service/" + id;
  return "#qa/service/types/" + (id === "perfomance" ? "performance" : id);
}

// TestOps on the home: the origin home's own TestOps visual full width; the user's triangle (Group.svg)
// in the middle with one short value on each side (the origin TestOps page's own), then the way in.
const QA_OPS_SIDES = [["지속적인 테스트 자동화", "서비스 신뢰성 향상"], ["반복 테스트 자동화", "업무 효율성 증대"]];
// T 솔루션 on the home (the user's Group 66 design, over a darkened, blurred QA workspace photo): five columns — the overview, then the
// four products. The frosted panel with the teal dot sits on the overview and follows the pointer.
const QA_SOLUTIONS = [
  ["T-솔루션", "AI 기반 품질 검증 자동화", "#qa/solution"],
  ["T-AUTO", "통합 QA 자동화 플랫폼", "#qa/solution/auto"],
  ["T-LENS", "LLM 품질 평가", "#qa/solution/lens"],
  ["T-GEN", "AI 테스트케이스 생성", "#qa/solution/gen"],
  ["T-VOC", "AI 고객 리뷰 분석", "#qa/solution/voc"]
];
const QA_ART = (window.TBELL_BASE || "") + "assets/qa/";

// Hero: the origin QA banner art (its TEST∞OPS lettering removed, design_demo/qa-hero-badge) with a
// live layer drawn in its pixel space — the orbit turns,
// the five printed icons light in turn and their names float out. One click lights a service; a double
// click opens it (like a banner).
const QA_BADGE = {
  pc: { box: "0 0 1920 990", core: [1440, 510, 100], lens: 92, ring: 300, r: 36, nodes: [[1440, 348], [1541, 401], [1330, 388], [1280, 507], [1330, 627]] },
  mobile: { box: "0 0 1440 2376", core: [950, 1535, 190], lens: 185, ring: 450, r: 54, nodes: [[956, 1218], [1155, 1327], [739, 1304], [636, 1539], [742, 1775]] }
};
const QA_BADGE_LINKS = ["outsourcing", "whitebox", "automation", "blackbox", "perfomance"];
const qaBadgeName = (i) => QA_EXPLORE.find(([id]) => id === QA_BADGE_LINKS[i])[1];

function qaBadge(kind) {
  const spec = QA_BADGE[kind];
  const [cx, cy, coreR] = spec.core;
  const pc = kind === "pc";
  const nodes = spec.nodes.map(([x, y], i) => {
    const name = qaBadgeName(i);
    const w = name.length * (pc ? 17 : 50) + (pc ? 40 : 96);
    const h = pc ? 42 : 100;
    const tx = x - spec.r - 18 - w;
    return `<g class="qh-node" data-i="${i}"${pc ? ` role="button" tabindex="0" aria-label="${name}"` : ' aria-hidden="true"'}>
        <line class="qh-node-ray" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>
        <circle class="qh-node-halo" cx="${x}" cy="${y}" r="${spec.r + 10}"/>
        <circle class="qh-node-hit" cx="${x}" cy="${y}" r="${spec.r + 8}"/>
        <g class="qh-tip"><rect x="${tx}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}"/><text x="${tx + w / 2}" y="${y + h * 0.14}" text-anchor="middle">${name}</text></g>
      </g>`;
  }).join("");
  // The emptied lens keeps a quiet core: an inner ring, four marks and a teal point that breathes with the pulse.
  const L = spec.lens;
  const marks = [0, 90, 180, 270].map((deg) => {
    const a = deg * Math.PI / 180;
    const p = (r) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    return `M${p(L * 0.66)}L${p(L * 0.78)}`;
  }).join("");
  const core = `<g class="qh-core" aria-hidden="true">
        <defs><radialGradient id="qh-core-glow-${kind}"><stop offset="0" stop-color="#27c4d5" stop-opacity=".55"/><stop offset="1" stop-color="#27c4d5" stop-opacity="0"/></radialGradient></defs>
        <circle class="qh-core-ring" cx="${cx}" cy="${cy}" r="${(L * 0.58).toFixed(1)}"/>
        <path class="qh-core-marks" d="${marks}"/>
        <circle class="qh-core-glow" cx="${cx}" cy="${cy}" r="${(L * 0.36).toFixed(1)}" fill="url(#qh-core-glow-${kind})" style="transform-origin:${cx}px ${cy}px"/>
        <circle class="qh-core-dot" cx="${cx}" cy="${cy}" r="${(L * 0.09).toFixed(1)}"/>
      </g>`;
  return `<svg class="qh-badge-layer is-${kind}" viewBox="${spec.box}" preserveAspectRatio="${pc ? "xMaxYMid" : "xMidYMax"} slice">
      <g class="qh-orbit" style="transform-origin:${cx}px ${cy}px"><circle cx="${cx}" cy="${cy}" r="${spec.ring}"/></g>
      <circle class="qh-core-pulse" cx="${cx}" cy="${cy}" r="${coreR}" style="transform-origin:${cx}px ${cy}px"/>
      ${nodes}
      ${core}
    </svg>`;
}

function qaHeroArt() {
  return `<div class="qh-art">
      <picture><source media="(max-width: 768px)" srcset="${ORIGIN}banner-main-mobile-notext.png"><img src="${ORIGIN}banner-main-pc-notext.png" alt=""></picture>
      ${qaBadge("pc")}${qaBadge("mobile")}
    </div>`;
}

function qaHome() {
  const list = QA_EXPLORE.map(([id, name], i) =>
    `<li><button type="button" role="tab" id="qx-tab-${i}" aria-selected="${i ? "false" : "true"}" aria-controls="qx-panel" tabindex="${i ? "-1" : "0"}" data-i="${i}"><span class="n">${String(i + 1).padStart(2, "0")}</span>${name}</button></li>`).join("");
  const shots = QA_EXPLORE.map(([id], i) => {
    const slide = SERVICE_SLIDES.find((s) => s.id === id);
    return `<picture class="qx-shot${i ? "" : " is-on"}" data-i="${i}"><source media="(max-width: 768px)" srcset="${ORIGIN}${slide.bg[2]}"><img src="${ORIGIN}${slide.bg[0]}" alt=""${i ? ' loading="lazy"' : ""}></picture>`;
  }).join("");
  const first = QA_EXPLORE[0];
  const firstTags = SERVICE_SLIDES[0].tags.map((t) => `<span>#${t}</span>`).join("");
  const tsCols = QA_SOLUTIONS.map(([name, role, href], i) =>
    `<li${i ? "" : ' class="is-on"'}><a href="${href}"><i class="qh-ts-dot" aria-hidden="true"></i><b>${name}</b><small>${role}</small></a></li>`).join("");
  const industries = DOMAINS.map(([name, image]) =>
    `<li><img src="${ORIGIN}${image}" alt="" loading="lazy"><span>${name}</span></li>`).join("");
  return `<div class="qh s-page dark" id="qh">
  <section class="qh-hero">
    ${qaHeroArt()}
    <div class="s-wrap qh-hero-in">
      <div class="qh-hero-copy">
        <h1>차별화된 테스트 경험으로<br>완성하는 소프트웨어 품질</h1>
        <p class="lede">전문 테스트 인력과 AI 자동화 기술을 결합해<br>프로젝트에 최적화된 QA 서비스를 제공합니다.</p>
        <div class="s-actions">
          <a class="qh-btn" href="#qa" data-jump="qh-services">살펴보기</a>
          <a class="qh-btn" href="#inquiry/qa">문의하기</a>
        </div>
      </div>
    </div>
  </section>

  <section class="s-sec qh-light qh-explore" id="qh-services"><div class="s-wrap">
    <div class="qh-head"><p class="qh-kicker">QA 서비스</p><h2>프로젝트에 최적화된 QA 서비스</h2><p>다양한 플랫폼과 개발 환경에 맞춰 전문적인 테스트 서비스를 제공합니다.</p></div>
    <div class="qx">
      <div class="qx-list"><ul role="tablist" aria-label="테스트 서비스" aria-orientation="vertical">${list}</ul><i class="qx-bar" aria-hidden="true"></i></div>
      <div class="qx-panel" id="qx-panel" role="tabpanel" aria-labelledby="qx-tab-0">
        <div class="qx-stage">${shots}</div>
        <div class="qx-info">
          <div><h3 data-x="name">${first[1]}</h3><p data-x="text">${first[2]}</p><div class="qx-tags" data-x="tags">${firstTags}</div></div>
          <a class="qh-btn" data-x="link" href="${qaServiceHref(first[0])}">자세히 보기</a>
        </div>
      </div>
    </div>
  </div></section>

  <section class="qh-ops" id="qh-testops">
    <picture class="qh-ops-bg"><source media="(max-width: 768px)" srcset="${ORIGIN}sec-main-mobile-002.70747ccffb2ac394fa5b.png"><img src="${ORIGIN}sec-main-002.2e4090c5e8921c5fcc33.png" alt="" loading="lazy"></picture>
    <div class="qh-ops-copy">
      <p class="qh-kicker">TestOps</p>
      <h2>테스트를 개발 흐름 안으로</h2>
      <p>최신 테스트 자동화 기술로 TestOps 환경을 구축합니다.</p>
      <div class="qh-ops-row">
        ${QA_OPS_SIDES.map(([lead, title], i) => `<p class="qh-ops-side${i ? " is-right" : ""}"><small>${lead}</small><b>${title}</b></p>`).join(`<img class="qh-ops-tri" src="${QA_ART}testops-triangle.svg" alt="" width="465" height="408" loading="lazy">`)}
      </div>
      <div class="s-actions"><a class="qh-btn" href="#qa/service/automation/testops">TestOps 구축</a></div>
    </div>
  </section>

  <section class="qh-ts" id="qh-tsol">
    <div class="qh-ts-head">
      <p class="qh-kicker">T-솔루션</p>
      <h2>AI 기술로 확장하는 품질 검증</h2>
      <p>테스트 설계와 실행, AI 평가부터 사용자 피드백 분석까지. 티벨이 직접 만든 품질 기술입니다.</p>
    </div>
    <div class="qh-ts-card">
      <picture class="qh-ts-photo"><source media="(max-width: 768px)" srcset="${QA_ART}photos/tsol-qa-space-m.jpg"><img src="${QA_ART}photos/tsol-qa-space.jpg" alt="" loading="lazy"></picture>
      <ul class="qh-ts-cols" aria-label="T-솔루션">${tsCols}</ul>
    </div>
  </section>

  <section class="s-sec qh-domains" id="industries"><div class="s-wrap">
    <div class="qh-head"><p class="qh-kicker">산업별 경험</p><h2>산업별 환경을 이해하는 QA 전문성</h2><p>산업마다 다른 시스템 환경과 품질 요구사항을 고려해 테스트를 설계하고 수행합니다.</p></div>
    <ul class="s-industries s-body">${industries}</ul>
  </div></section>
</div>`;
}

// List-and-panel explorer shared by the QA and security homes: the next visual wipes in over the
// current one, the bar slides to the active row, ↑↓ keys move. fill(i, slot) writes the panel copy.
function wireExplorer(scope, fill) {
  if (!scope) return;
  const tabs = Array.from(scope.querySelectorAll(".qx-list button"));
  const shots = Array.from(scope.querySelectorAll(".qx-shot"));
  const bar = scope.querySelector(".qx-bar");
  const panel = scope.querySelector(".qx-panel");
  const info = panel.querySelector(".qx-info");
  const slot = (key) => panel.querySelector(`[data-x="${key}"]`);
  let current = 0;
  const moveBar = () => {
    const tab = tabs[current];
    bar.style.transform = `translateY(${tab.offsetTop}px)`;
    bar.style.height = tab.offsetHeight + "px";
  };
  const pick = (i, focus) => {
    if (i === current) return;
    shots.forEach((shot) => shot.classList.remove("was"));
    shots[current].classList.add("was");
    shots[current].classList.remove("is-on");
    shots[i].classList.add("is-on");
    tabs.forEach((tab, k) => {
      tab.setAttribute("aria-selected", k === i ? "true" : "false");
      tab.tabIndex = k === i ? 0 : -1;
    });
    current = i;
    info.classList.remove("swap");
    void info.offsetWidth;
    info.classList.add("swap");
    fill(i, slot);
    panel.setAttribute("aria-labelledby", tabs[i].id);
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
      pick((current + step + tabs.length) % tabs.length, true);
    });
  });
  moveBar();
  if (window.__qxResize) window.removeEventListener("resize", window.__qxResize);
  window.__qxResize = moveBar;
  window.addEventListener("resize", moveBar, { passive: true });
}

function wireQaHome() {
  if (window.__qhTimer) { clearInterval(window.__qhTimer); window.__qhTimer = null; }
  if (window.__qhIo) { window.__qhIo.disconnect(); window.__qhIo = null; }
  const root = document.getElementById("qh");
  if (!root) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero badge: nodes light in turn; pointing at one holds it. A click lights it,
  // a second click on the same node within a moment opens the service. The art leans toward the pointer.
  const hero = root.querySelector(".qh-hero");
  const art = root.querySelector(".qh-art");
  const badgeNodes = Array.from(root.querySelectorAll(".qh-node"));
  let lit = -1;
  let held = false;
  let lastTap = { i: -1, at: 0 };
  const light = (i) => {
    if (i === lit) return;
    lit = i;
    root.querySelectorAll(".qh-node").forEach((node) => node.classList.toggle("is-lit", Number(node.dataset.i) === i));
  };
  const open = (i) => go(qaServiceHref(QA_BADGE_LINKS[i]));
  badgeNodes.forEach((node) => {
    const i = Number(node.dataset.i);
    node.addEventListener("pointerenter", () => { held = true; light(i); });
    node.addEventListener("pointerleave", () => { held = false; });
    node.addEventListener("focus", () => { held = true; light(i); });
    node.addEventListener("blur", () => { held = false; });
    node.addEventListener("click", () => {
      const now = Date.now();
      if (lastTap.i === i && now - lastTap.at < 450) { open(i); return; }
      lastTap = { i, at: now };
      held = true;
      light(i);
    });
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter") { event.preventDefault(); open(i); }
      if (event.key === " ") { event.preventDefault(); light(i); }
    });
  });
  light(0);
  if (!reduce) {
    hero.addEventListener("pointermove", (event) => {
      const box = hero.getBoundingClientRect();
      art.style.setProperty("--px", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      art.style.setProperty("--py", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    });
    hero.addEventListener("pointerleave", () => { held = false; art.style.setProperty("--px", 0); art.style.setProperty("--py", 0); });
  }

  // Service explorer: the chosen service's photo wipes in; copy, tags and link follow.
  wireExplorer(root.querySelector(".qx"), (i, slot) => {
    const [id, name, text] = QA_EXPLORE[i];
    slot("name").textContent = name;
    slot("text").textContent = text;
    slot("tags").innerHTML = (SERVICE_SLIDES.find((s) => s.id === id).tags || []).map((t) => `<span>#${t}</span>`).join("");
    slot("link").setAttribute("href", qaServiceHref(id));
    pathLinks();
  });

  // T 솔루션: the frosted panel follows the pointer (or focus) and returns to the overview when it leaves.
  const tsCols = Array.from(root.querySelectorAll(".qh-ts-cols li"));
  const tsLight = (i) => tsCols.forEach((li, k) => li.classList.toggle("is-on", k === i));
  tsCols.forEach((li, i) => {
    li.addEventListener("pointerenter", () => tsLight(i));
    li.addEventListener("focusin", () => tsLight(i));
  });
  const tsList = root.querySelector(".qh-ts-cols");
  tsList.addEventListener("pointerleave", () => tsLight(0));
  tsList.addEventListener("focusout", (event) => { if (!tsList.contains(event.relatedTarget)) tsLight(0); });

  // Motion runs only while its section is on screen.
  window.__qhIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("play", entry.isIntersecting);
    });
  }, { threshold: 0.35 });
  root.querySelectorAll(".qh-hero, .qh-ops, .qh-ts").forEach((el) => window.__qhIo.observe(el));
  if (reduce) return;
  let tick = 0;
  window.__qhTimer = setInterval(() => {
    if (!document.body.contains(root)) { clearInterval(window.__qhTimer); window.__qhTimer = null; return; }
    tick += 1;
    if (!held && root.querySelector(".qh-hero").classList.contains("play")) light((lit + 1) % QA_BADGE_LINKS.length);
  }, 2400);
}


const ORIGIN = (window.TBELL_BASE || "") + "assets/origin/";

function shot(spec) {
  if (!spec) return "";
  if (typeof spec === "string") return `<img src="${ORIGIN}${spec}" alt="">`;
  const mobile = spec.mobile ? `<source media="(max-width: 768px)" srcset="${ORIGIN}${spec.mobile}">` : "";
  const tablet = spec.tablet ? `<source media="(max-width: 1024px)" srcset="${ORIGIN}${spec.tablet}">` : "";
  return `<picture>${mobile}${tablet}<img src="${ORIGIN}${spec.pc}" alt=""></picture>`;
}

const SERVICE_CARDS = [
  ["01", "WEB/APP", "item-service-001.033d52130f5cb0506725.png", "우리가 매일 접하는 분야로\n업그레이드 주기가 빠른 것이 특징입니다.\n릴리즈 계획에 맞춰 신속하지만 신뢰성이\n높은 테스트를 실행하고 있습니다."],
  ["02", "IoT/APP", "item-service-002.e55a7c00aeee2073014a.png", "최신 트랜드로 주목 받고 있는 분야로\n전문지식을 바탕으로 IoT/AI 관련 제품 및\n시스템을 테스트하고 있습니다."],
  ["03", "Embedded", "item-service-003.648d80fd4604060a0f1d.png", "기계/전자 장치의 효율적인 제어를 위한\n임베디드 적용제품에 다각도의 기법을\n적용하여 테스트 진행을 하고 있습니다."],
  ["04", "Finance", "item-service-004.4108425e68646a28b34f.png", "고도의 신뢰성을 요하는 분야로\n금융산업에 대한 높은 이해와 전문적인 테스트\n기술을 도입하고 있습니다."],
  ["05", "Automotive", "item-service-005.78bd143a4de7f203db4b.png", "복잡하고 다양한 기술이 탑재되어 있으며\n정밀성을 요하는 분야입니다.\n최고의 인재들과 정밀성 높은 테스트 기법으로\n테스트 수행을 하고 있습니다."]
];

const DOMAINS = [
  ["금융", "item-domain-01.657f4accf550f6f53133.png"],
  ["영상", "item-domain-02.310b2adff2480c6bd1c8.png"],
  ["보안", "item-domain-03.2b2f52f82891bf0fd798.png"],
  ["자동차", "item-domain-04.943d20fbfe29b20cf765.png"],
  ["전자", "item-domain-05.768a0a12ce755ab346f1.png"],
  ["임베디드", "item-domain-06.93cca89e281e530f78cc.png"],
  ["전자상거래", "item-domain-07.0961a345935842059296.png"],
  ["통신", "item-domain-08.c7a0bdf21c469ad3834a.png"],
  ["플랫폼", "item-domain-09.5bc39232228fe04a4509.png"],
  ["공공분야", "item-domain-10.d6371b14798b730b7281.png"]
];

function outsourcingBody() {
  const cards = SERVICE_CARDS.map(([id, title, image, desc], index) => `
    <button class="expand-card${index === 0 ? " is-open" : ""}" type="button">
      <img src="${ORIGIN}${image}" alt="">
      <span><strong>${id}<span class="ec-name"> ${title}</span></strong><em>${desc}</em></span>
    </button>`).join("");
  return `
    ${qpOutsourcingAdvantages()}
    <h2 class="qp-h qp-h-solo" data-qp-reveal>테스트 분야</h2>
    <div class="expand-row">${cards}</div>
    <h2 class="qp-h qp-h-solo" data-qp-reveal>테스트 의뢰</h2>
    <div class="contact-row">
      <div><img src="${ORIGIN}icon-mail.svg" alt=""><div><strong>staff@tbell.co.kr</strong><span>이메일로 문의 가능합니다.</span></div></div>
      <div><img src="${ORIGIN}icon-phone.svg" alt=""><div><strong>070.7777.9113</strong><span>월-금요일 09:30-18:00 / 점심 12:00-13:00</span></div></div>
    </div>`;
}





const SERVICE_SLIDES = [
  { id: "outsourcing", title: "Outsourcing Test", desc: "티벨의 아웃소싱 테스트는 기업 및\n프로젝트의 특성에 맞춘 고객 맞춤형 테스트입니다.", tags: ["Web/App", "IoT/AI", "Embedded", "Finance", "Automotive"], bg: ["bg-outsourcing.b46a027c427ae59d3db3.png", "bg-tablet-outsourcing.b7693ae7435210848e2c.png", "bg-mobile-outsourcing.bf9d543859738afb6936.png"], body: outsourcingBody },
  { id: "automation", title: "Test Automation", desc: "티벨만의 차별화된 자동화 테스트 서비스를 통해 보다\n높은 수준의 품질 및 고객 만족 향상을 약속드립니다.", tags: ["안전성", "효율성", "전문성", "비용절감"], bg: ["bg-automation.eebf3b3db228963a7d7e.png", "bg-tablet-automation.42cf3238c4db4de3a5c2.png", "bg-mobile-automation.981f021b70be98f47f4a.png"], body: automationBody },
  { id: "blackbox", title: "Blackbox Test", desc: "제품 개발을 위해 작성된 개발 명세서를 기반으로\n테스트 시나리오를 작성하고 테스트를 수행함으로써\n제품 품질 개선 활동하는 테스트 서비스입니다.", tags: ["Interface Test", "System Test", "Integration Test", "Sanity Test", "Regression Test", "Acceptance Test"], bg: ["bg-blackbox.93002ce8bac79cfd0f1f.png", "bg-tablet-blackbox.08b799c93405378cd9f7.png", "bg-mobile-blackbox.deb03514f8108bd54281.png"], body: blackboxBody },
  { id: "whitebox", title: "Whitebox Test", desc: "화이트박스 테스트(WhiteBox Test)기법은 소프트웨어\n내부 소스 코드를 테스트하는 기법으로써 동작의\n유효성 뿐만아니라 실행 되는 과정을 살펴보는 테스트입니다.", tags: ["Static Test", "Dynamic Test"], bg: ["bg-whitebox.dd0f3a71aa3621b95657.png", "bg-tablet-whitebox.237c155d7035df71b7b8.png", "bg-mobile-whitebox.5a13073380c9706e9e8a.png"], body: whiteboxBody },
  { id: "api", title: "API Test", desc: "서로 다른 소프트웨어 시스템 사이에\n통신과 연동을 위해 API 테스트는 필수적입니다.", tags: ["기능", "안정성", "성능"], bg: ["bg-api.c29a3eb4a94183fda704.png", "bg-tablet-api.0d2bd87a550607f6f885.png", "bg-mobile-api.f4098575a7ef1dc638a9.png"], body: apiBody },
  { id: "perfomance", title: "", desc: "", tags: [], bg: ["bg-perfomance.970f68cd64a2613d1c03.png", "bg-tablet-perfomance.defe2610687b7c8a7569.png", "bg-mobile-perfomance.4b266306d8c200a4bea8.png"], body: perfBody }
];

const TESTOPS_SLIDES = [
  { id: "build", title: "TestOps 구축", desc: "", tags: [], bg: ["bg-testops.b412a1fcc313840bb9b7.png", "bg-tablet-testops.e0fda03c2d2d0074b91c.png", "bg-mobile-testops.f3c4b09515af18daa11a.png"], body: testopsBody },
  { id: "ai", title: "AI 기반 검증 자동화", desc: "", tags: [], bg: ["bg-aitest.18dde154ddf7c65ecd50.png", "bg-tablet-aitest.b9ff500a0f9ed31ee194.png", "bg-mobile-aitest.52fc0ce2a2967e759401.png"], body: aitestBody }
];

function leafNav(items, currentId) {
  if (!items || items.length < 2) return "";
  const links = items.map((entry) => `<a href="${entry.href}"${entry.id === currentId ? ' aria-current="page"' : ""}>${entry.label}</a>`).join("");
  return `<nav class="subnav" aria-label="하위 메뉴">${links}</nav>`;
}

function qaDeck(slides, id, base, leaves) {
  const index = Math.max(0, slides.findIndex((slide) => slide.id === id));
  const current = slides[index];
  const prev = slides[index - 1];
  const next = slides[index + 1];
  const arrow = `<svg viewBox="0 0 32 56" width="32" height="56" aria-hidden="true"><path fill="currentColor" d="M3.44 27.65 29.28 2.69 28.56 2 2 27.65l.72.7L29.28 54l.72-.7L3.44 27.65Z"/></svg>`;
  const slidesHtml = slides.map((slide) => {
    const tags = slide.tags.map((tag) => `<span>#${tag.replace(" Test", "")}</span>`).join("");
    const photo = `<picture class="svc-bg"><source media="(max-width: 768px)" srcset="${ORIGIN}${slide.bg[2]}"><source media="(max-width: 1024px)" srcset="${ORIGIN}${slide.bg[1]}"><img src="${ORIGIN}${slide.bg[0]}" alt=""></picture>`;
    const word = slide.word ? `<strong class="svc-word" aria-hidden="true">${slide.word}</strong>` : "";
    return `<article class="svc-slide">${photo}${word}<div><p>${slide.title}</p><p>${slide.desc}</p><div class="svc-tags">${tags}</div></div></article>`;
  }).join("");
  const nav = (slide, dir, label) => slide
    ? `<a class="svc-nav ${dir}" href="${slide.href || base + slide.id}" aria-label="${label}">${arrow}</a>`
    : `<span class="svc-nav ${dir} is-off" aria-hidden="true">${arrow}</span>`;
  return `<section class="detail svc-page">
    <div class="svc-banner" data-prev="${prev ? prev.href || base + prev.id : ""}" data-next="${next ? next.href || base + next.id : ""}">
      <div class="svc-track" style="transform:translateX(-${index * 100}%)">${slidesHtml}</div>
      ${nav(prev, "prev", "이전")}
      ${nav(next, "next", "다음")}
    </div>
    ${leafNav(leaves, id)}
    <div class="svc-body">${current.body()}</div>
  </section>`;
}

// 서비스: like the origin's /service, the six test services are one deck in the origin's order — the banner
// arrows step through them, and the group's tab strip sits under the banner. TestOps 구축 and AI 기반 검증 자동화 are the origin's
// /testops deck. URLs stay as they are (qa/service/…, qa/service/types/…, qa/service/automation/…).
const svcSlide = (slides, id, extra) => ({ ...slides.find((slide) => slide.id === id), ...extra });
const SERVICE_DECK = SERVICE_SLIDES.map((slide) => ({ ...slide, id: slide.id === "perfomance" ? "performance" : slide.id, href: qaServiceHref(slide.id) }));
const TESTOPS_DECK = [
  svcSlide(TESTOPS_SLIDES, "build", { id: "testops", href: "#qa/service/automation/testops" }),
  svcSlide(TESTOPS_SLIDES, "ai", { href: "#qa/service/automation/ai" })
];

// Under the banner, like 회사소개, a tab strip lists the pages of the same QA menu group.
const qaLeaves = (group) => QA_GROUPS.find((g) => g.id === group).children.map((c) => ({ ...c, id: c.id === "build" ? "testops" : c.id }));

function serviceDeck(child, page) {
  if (child === "automation" && (page === "testops" || page === "ai")) return qaDeck(TESTOPS_DECK, page, "#qa/service/automation/", qaLeaves("testops"));
  if (child === "types") return qaDeck(SERVICE_DECK, SERVICE_DECK.some((slide) => slide.id === page) ? page : "blackbox", "#qa/service/", qaLeaves("service"));
  return qaDeck(SERVICE_DECK, child === "automation" ? "automation" : "outsourcing", "#qa/service/", qaLeaves("service"));
}

// Old QA URLs (테스트 종류 · TestOps · T 솔루션 tauto menus) and where each now lives, so bookmarks keep working.
function legacyQaHash(group, child) {
  if (group === "types") {
    if (child === "automation") return "#qa/service/automation";
    if (["blackbox", "whitebox", "api", "perfomance"].includes(child)) return qaServiceHref(child);
    return "#qa/service/outsourcing";
  }
  if (group === "testops") return "#qa/service/automation/" + (child === "ai" ? "ai" : "testops");
  if (group === "tauto") return "#qa/solution" + (child === "vux" ? "/auto" : T_PAGES[child] && child !== "overview" ? "/" + child : "");
  return "";
}

// ── T 브랜드 솔루션 (copy from the 2026.10.22 T 브랜드 소개서; design_demo/t-solution-content-audit.md) ──
// Five pages as one banner deck like the QA service and company pages: the darkened QA workspace photo with
// the product's name lettered on it, the tab strip, then a white body of centred qp- sections. T-ASSI is
// introduced only under 도입 옵션 on the overview; it has no page of its own.

// Pictures for the API 테스트-style flows (T-LENS · T-GEN · T-VOC): grey device, pale screen, blue-grey
// lines and one cyan accent, each on a 120×96 box.
const TB_G = "#6b6b6b", TB_L = "#d9d9d9", TB_B = "#b7c7d1", TB_S = "#f6f8fa", TB_T = "#27c4d5";
const tbStar = (cx, cy, r, fill) => `<path d="${Array.from({ length: 10 }, (_, i) => {
  const a = Math.PI / 5 * i - Math.PI / 2, d = i % 2 ? r * .45 : r;
  return (i ? "L" : "M") + (cx + d * Math.cos(a)).toFixed(1) + " " + (cy + d * Math.sin(a)).toFixed(1);
}).join("")}z" fill="${fill}"/>`;
const tbPhone = (x, y, w, h, screen = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 6}" fill="${TB_G}"/><rect x="${x + 3}" y="${y + 7}" width="${w - 6}" height="${h - 14}" fill="${TB_S}"/>${screen}`;
const tbLines = (x, y, widths, gap = 10, fill = TB_B) => widths.map((w, i) => `<rect x="${x}" y="${y + i * gap}" width="${w}" height="4" fill="${fill}"/>`).join("");
const TB_ART = {
  chat: `<path d="M14 10h62a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H38L24 66V54H14a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6z" fill="${TB_G}"/>${[30, 45, 60].map((x) => `<circle cx="${x}" cy="32" r="4.5" fill="#fff"/>`).join("")}<path d="M60 46h46a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6h-6v10L90 78H60a6 6 0 0 1-6-6V52a6 6 0 0 1 6-6z" fill="${TB_T}"/>${tbLines(64, 56, [36, 24], 10, "#fff")}`,
  report: `<rect x="12" y="8" width="96" height="80" rx="4" fill="${TB_G}"/><rect x="18" y="14" width="84" height="68" fill="${TB_S}"/><rect x="28" y="52" width="12" height="22" fill="${TB_B}"/><rect x="46" y="40" width="12" height="34" fill="${TB_B}"/><rect x="64" y="30" width="12" height="44" fill="${TB_T}"/><rect x="82" y="44" width="12" height="30" fill="${TB_B}"/><path d="M26 34l20-8 18-6 28 6" stroke="${TB_G}" stroke-width="2.5" fill="none"/>`,
  docs: `<rect x="14" y="16" width="50" height="74" rx="4" fill="${TB_L}"/>${tbLines(22, 30, [32, 26, 34, 20], 10, "#fff")}<rect x="48" y="6" width="56" height="80" rx="4" fill="${TB_G}"/><rect x="54" y="12" width="44" height="68" fill="${TB_S}"/>${tbLines(60, 22, [32, 24, 32, 18])}<rect x="60" y="64" width="32" height="10" fill="${TB_T}"/>`,
  tc: `<rect x="28" y="10" width="64" height="80" rx="5" fill="${TB_G}"/><rect x="34" y="18" width="52" height="66" fill="${TB_S}"/><rect x="48" y="4" width="24" height="12" rx="3" fill="${TB_L}"/>${[26, 40, 54, 68].map((y) => `<rect x="40" y="${y}" width="8" height="8" rx="1.5" fill="${TB_T}"/><rect x="52" y="${y + 2}" width="28" height="4" fill="${TB_B}"/>`).join("")}`,
  review: `<rect x="10" y="8" width="62" height="78" rx="4" fill="${TB_G}"/><rect x="16" y="14" width="50" height="66" fill="${TB_S}"/>${[22, 34, 46, 58].map((y, i) => `<rect x="22" y="${y}" width="${i === 1 ? 30 : 36}" height="5" fill="${i === 1 || i === 2 ? TB_T : TB_B}"/>`).join("")}<circle cx="78" cy="52" r="18" fill="rgba(255,255,255,.7)" stroke="${TB_G}" stroke-width="6"/><path d="M91 65l16 16" stroke="${TB_G}" stroke-width="8" stroke-linecap="round"/>`,
  store: tbPhone(34, 2, 52, 92, [0, 1, 2, 3, 4].map((i) => tbStar(44 + i * 8, 22, 4, i < 4 ? TB_T : TB_L)).join("") + tbLines(42, 34, [36, 28, 34], 9) + `<rect x="42" y="64" width="36" height="12" rx="3" fill="${TB_B}"/>`),
  inbox: `<path d="M60 6v34" stroke="${TB_T}" stroke-width="6" stroke-linecap="round"/><path d="M46 26l14 14 14-14" stroke="${TB_T}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 50h30l6 10h24l6-10h30v30a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5z" fill="${TB_G}"/><path d="M24 50l8-14h12M96 50l-8-14H76" stroke="${TB_L}" stroke-width="4" fill="none"/>`,
  ticket: `<path d="M10 20h100v20a8 8 0 0 0 0 16v20H10V56a8 8 0 0 0 0-16z" fill="${TB_G}"/><rect x="24" y="30" width="22" height="9" rx="2" fill="${TB_T}"/>${tbLines(24, 46, [56, 40], 10, "#fff")}<path d="M88 30v36" stroke="${TB_L}" stroke-width="2" stroke-dasharray="4 4"/>`
};

// Product names (and End-to-End) never break at their hyphens.
const tbNw = (text) => text.replace(/T-(AUTO|LENS|GEN|VOC|ASSI)|End-to-End/g, '<span class="tb-nw">$&</span>');
// Line breaks are for wide screens; phones drop them (qa-pages.css), so each keeps a space before it.
const tbBr = (text) => tbNw(text.replace(/<br>/g, " <br>"));
// One section, one message: a title, an optional lede, then the figure.
const tbSec = (id, title, lede, inner, cls = "") => `
  <section class="qp-sec tb-sec${cls ? " " + cls : ""}" id="${id}" data-qp-reveal>
    <h2 class="qp-h">${tbBr(title)}</h2>
    ${lede ? `<div class="qp-lede"><p>${tbBr(lede)}</p></div>` : ""}
    ${inner}
  </section>`;
// Full-bleed grey or dark band inside .svc-body, for the one section on a page that changes the rhythm.
const tbBand = (id, title, lede, inner, tone = "grey") => `
  <section class="tb-band ${tone}" id="${id}" data-qp-reveal>
    <h2 class="qp-h">${tbBr(title)}</h2>
    ${lede ? `<div class="qp-lede"><p>${tbBr(lede)}</p></div>` : ""}
    ${inner}
  </section>`;
// Short statements side by side on rules.
const tbTrio = (items, cls = "") => `<ul class="tb-trio${cls ? " " + cls : ""}" style="--n:${items.length}">${items.map(([k, t, d], i) =>
  `<li style="--i:${i}">${k ? `<span>${k}</span>` : ""}<b>${t}</b>${d ? `<p>${tbNw(d)}</p>` : ""}</li>`).join("")}</ul>`;
const tbCta = (label) => `<div class="tb-cta"><a class="pill" href="#inquiry/qa">${label}</a></div>`;
// The API 테스트 figure: pictures joined by dotted arrows, a dark { } circle where AI does the work.
const tbAi = (word) => `<span class="qp-api${word.length > 3 ? " sm" : ""}">{ ${word} }</span>`;
const tbFlow = (label, nodes) => `<figure class="qp-flow tb-flowart n${nodes.length}" aria-label="${label}">
      <ol>${nodes.map(([art, text], i) => `<li style="--i:${i}"><div class="qp-flow-art">${art.startsWith("<") ? art : `<svg viewBox="0 0 120 96" aria-hidden="true">${TB_ART[art]}</svg>`}</div><p>${text}</p></li>`).join("")}</ol>
    </figure>`;
// Three values as editorial columns: a large light keyword over its line (the overview intro).
const tbValues = (items, cls = "") => `<ol class="tb-values${cls ? " " + cls : ""}">${items.map(([k, t, d], i) => `<li style="--i:${i}"><strong>${k}</strong><b>${t}</b><p>${tbNw(d)}</p></li>`).join("")}</ol>`;
// Numbered statements in two columns, the number set large and pale (challenges).
const tbNums = (items) => `<ol class="tb-nums">${items.map(([t, d], i) => `<li style="--i:${i}"><span>0${i + 1}</span><div><b>${t}</b><p>${tbNw(d)}</p></div></li>`).join("")}</ol>`;
// Overview portfolio flow: stage, product and role, and a line icon per product (ink strokes, cyan accents).
const TB_PF = [["gen", "01", "설계", "T-GEN", "AI 기반 테스트 케이스 생성"], ["auto", "02", "검증 · 운영", "T-AUTO", "통합 QA 자동화 플랫폼"],
  ["lens", "03", "평가", "T-LENS", "LLM 품질 평가"], ["voc", "04", "피드백", "T-VOC", "고객 리뷰 분석"]];
const TB_INK = "#25313a";
const tbCheck = (x, y, on) => on
  ? `<rect x="${x}" y="${y}" width="11" height="11" rx="2" fill="#e3f6f9" stroke="${TB_T}" stroke-width="2"/><path d="M${x + 2.5} ${y + 5.5}l2.5 2.5 4.5-5" fill="none" stroke="${TB_T}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
  : `<rect x="${x}" y="${y}" width="11" height="11" rx="2" fill="#fff" stroke="${TB_INK}" stroke-width="1.8"/>`;
const TB_PF_ART = {
  gen: `<g fill="#fff" stroke="${TB_INK}" stroke-width="2" stroke-linejoin="round"><rect x="22" y="12" width="54" height="74" rx="4"/><rect x="30" y="18" width="54" height="74" rx="4"/><rect x="40" y="26" width="58" height="76" rx="5"/></g>
    ${tbCheck(49, 40, true)}${tbCheck(49, 60, false)}${tbCheck(49, 80, false)}<g fill="#a9b6bf"><rect x="66" y="43" width="24" height="3" rx="1.5"/><rect x="66" y="49" width="16" height="3" rx="1.5"/><rect x="66" y="63" width="22" height="3" rx="1.5"/><rect x="66" y="83" width="24" height="3" rx="1.5"/></g>`,
  auto: `<rect x="8" y="28" width="142" height="100" rx="6" fill="#fff" stroke="${TB_INK}" stroke-width="2"/><path d="M8 42h142M44 42v86" stroke="${TB_INK}" stroke-width="2"/>
    <g fill="#a9b6bf"><circle cx="17" cy="35" r="2"/><circle cx="24" cy="35" r="2"/><circle cx="31" cy="35" r="2"/>${[56, 70, 84, 98].map((y) => `<circle cx="17" cy="${y}" r="2"/><rect x="23" y="${y - 1.5}" width="14" height="3" rx="1.5"/>`).join("")}</g>
    <rect x="54" y="52" width="82" height="64" rx="4" fill="#f2f6f8" stroke="#c9d3d9" stroke-width="1.5"/><g fill="#c9d3d9"><rect x="62" y="60" width="44" height="4" rx="2"/><rect x="62" y="96" width="60" height="8" rx="2"/></g>
    <rect x="62" y="74" width="46" height="12" rx="3" fill="#bfeaf0" stroke="${TB_T}" stroke-width="2"/>
    <path d="M112 70l3-5M117 76l5-2M110 66l-1-6" stroke="${TB_T}" stroke-width="2" stroke-linecap="round"/>
    <path d="M106 78l14 10-6 1.5 4 7-3.5 2-4-7-4.5 4z" fill="#fff" stroke="${TB_INK}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="144" y="46" width="48" height="84" rx="7" fill="#fff" stroke="${TB_INK}" stroke-width="2"/><rect x="151" y="56" width="34" height="26" rx="2" fill="#eef2f4"/>
    <path d="M154 78l9-10 7 7 5-4 8 7" fill="none" stroke="#a9b6bf" stroke-width="1.8" stroke-linejoin="round"/><circle cx="175" cy="63" r="2.5" fill="#a9b6bf"/>
    <g fill="#c9d3d9"><rect x="151" y="90" width="30" height="3" rx="1.5"/><rect x="151" y="97" width="22" height="3" rx="1.5"/></g><rect x="151" y="110" width="34" height="8" rx="2" fill="${TB_T}"/>
    <circle cx="40" cy="24" r="18" fill="#fff" stroke="${TB_T}" stroke-width="3"/><text x="40" y="31" text-anchor="middle" font-family="Oxanium, sans-serif" font-size="18" font-weight="600" fill="#0788a4">AI</text>`,
  lens: `<rect x="26" y="12" width="58" height="80" rx="4" fill="#fff" stroke="${TB_INK}" stroke-width="2"/><g fill="${TB_T}"><rect x="35" y="24" width="38" height="3" rx="1.5"/><rect x="35" y="32" width="28" height="3" rx="1.5"/><rect x="35" y="40" width="34" height="3" rx="1.5"/></g>
    <g fill="#a9b6bf"><rect x="36" y="70" width="4" height="12"/><rect x="44" y="64" width="4" height="18"/></g><rect x="52" y="56" width="4" height="26" fill="${TB_T}"/><rect x="60" y="62" width="4" height="20" fill="#a9b6bf"/>
    <circle cx="82" cy="70" r="14" fill="rgba(255,255,255,.85)" stroke="${TB_INK}" stroke-width="2.6"/><path d="M92 80l12 12" stroke="${TB_INK}" stroke-width="3.2" stroke-linecap="round"/>`,
  voc: `<g fill="#fff" stroke="${TB_INK}" stroke-width="2" stroke-linejoin="round"><path d="M20 16h56a5 5 0 0 1 5 5v30a5 5 0 0 1-5 5H42l-12 10V56H20a5 5 0 0 1-5-5V21a5 5 0 0 1 5-5z"/>
    <path d="M60 46h42a5 5 0 0 1 5 5v26a5 5 0 0 1-5 5h-6v10l-10-10H60a5 5 0 0 1-5-5V51a5 5 0 0 1 5-5z"/><path d="M16 72h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H30l-8 7v-7h-6a4 4 0 0 1-4-4V76a4 4 0 0 1 4-4z"/></g>
    <g fill="#a9b6bf"><rect x="24" y="26" width="40" height="3" rx="1.5"/><rect x="24" y="34" width="30" height="3" rx="1.5"/><rect x="20" y="81" width="20" height="3" rx="1.5"/></g>${tbStar(81, 64, 10, TB_T)}`,
  assi: `<g fill="#fff" stroke="${TB_INK}" stroke-width="2"><path d="M8 12v26c0 4 8 7 18 7s18-3 18-7V12"/><path d="M8 25c0 4 8 7 18 7s18-3 18-7"/><ellipse cx="26" cy="12" rx="18" ry="7"/></g>
    <circle cx="44" cy="40" r="11" fill="${TB_T}"/><path d="M44 34v12M38 40h12" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`
};
function tOverview() {
  // The quality cycle left to right, one product per stage, T-AUTO at the centre; T-ASSI hangs under it.
  const map = `
    <ol class="tb-pf">${TB_PF.map(([id, no, stage, name, role], i) => `
      <li class="${id === "auto" ? "is-core" : ""}" style="--i:${i}"><a href="#qa/solution/${id}">
        <span class="tb-pf-k"><small>${no}</small>${stage}</span>
        <span class="tb-pf-ico"><svg viewBox="${id === "auto" ? "0 0 200 140" : "0 0 120 110"}" aria-hidden="true">${TB_PF_ART[id]}</svg></span>
        <b>${name}</b><span class="tb-pf-d">${role}</span></a></li>`).join("")}
    </ol>
    <div class="tb-pf-low"><p class="tb-pf-assi"><svg viewBox="0 0 60 56" aria-hidden="true">${TB_PF_ART.assi}</svg><b>T-ASSI</b><span>구독형 QA 서비스</span></p></div>`;
  return tbSec("intro", "AI 기반 통합 품질 검증 자동화", "테스트 설계부터 실행, 평가, 결함 관리까지 연결하는 T 브랜드 QA 솔루션입니다.",
      tbValues([["통합성", "기능 · 성능 · LLM 통합", "하나의 플랫폼에서 품질을 검증합니다."], ["지능화", "AI 코파일럿", "자동화 구현부터 실패 분석까지 AI가 지원합니다."], ["신뢰성", "사람이 승인하는 AI", "AI가 제안하고, 최종 판단은 사람이 합니다."]])) +
    tbSec("why", "QA 자동화, 실행만으로 충분할까요?", "실행 자동화가 늘수록 분석하고 판정해야 할 결과도 함께 늘어납니다.",
      tbNums([
        ["도구 · 데이터 분산", "설계 · 실행 · 결과 · 결함 관리 도구가 나뉘어 이력 추적이 어렵습니다."],
        ["자동화 자산 유지보수", "UI · 환경이 바뀔 때마다 스크립트를 고쳐야 합니다."],
        ["실행 이후의 수작업", "실패 원인 분석과 결함 판정, 재검증에 사람이 반복 투입됩니다."],
        ["검증 대상의 다양화", "웹 · 모바일 · 앱 성능 · LLM마다 실행 방식과 평가 기준이 다릅니다."]
      ])) +
    tbSec("portfolio", "설계부터 피드백까지, 하나의 흐름으로", "T-AUTO를 중심으로 설계 · 검증 · 평가 · 피드백이 연결됩니다.", map, "tb-pf-sec") +
    tbSec("contact", "솔루션 도입 문의", "", `
      <ol class="tb-steps">${["도입 상담 및 요구사항 분석", "핵심 시나리오 검증", "단계적 도입 및 확대"]
        .map((t, i) => `<li style="--i:${i}"><span>${i + 1}</span><b>${t}</b></li>`).join("")}</ol>
      ${tbCta("도입 문의하기")}`);
}

// T-AUTO copilot: a line icon per step (ink strokes, cyan accent) and the centre picture — a person and the
// AI in pale circles, dashed arcs carrying the work across (top) and back for approval (bottom).
const TB_DUO_ICO = {
  input: `<g fill="none" stroke="${TB_INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M10 5h18l9 9v26a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z"/><path d="M28 5v9h9M13 21h12M13 28h8"/></g>
    <circle cx="36" cy="37" r="9" fill="${TB_T}"/><path d="M36 32.5v9M31.5 37h9" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  explore: `<circle cx="20" cy="20" r="13" fill="none" stroke="${TB_INK}" stroke-width="2.6"/><path d="M14 17a7 7 0 0 1 6-4" fill="none" stroke="${TB_T}" stroke-width="2.2" stroke-linecap="round"/><path d="M30 30l11 11" stroke="${TB_T}" stroke-width="4" stroke-linecap="round"/>`,
  build: `<rect x="17" y="5" width="14" height="13" rx="2" fill="${TB_T}"/><g fill="none" stroke="${TB_INK}" stroke-width="2.2" stroke-linejoin="round"><path d="M24 18v7M10 31v-6h28v6"/><rect x="4" y="31" width="13" height="12" rx="2"/><rect x="31" y="31" width="13" height="12" rx="2"/></g>`,
  approve: `<g fill="none" stroke="${TB_INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M12 5h18l9 9v26a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z"/><path d="M30 5v9h9"/></g>
    <path d="M16 28l5 5 10-11" fill="none" stroke="${TB_T}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
};
const TB_DUO_MID = `<defs><clipPath id="tb-duo-c1"><circle cx="100" cy="150" r="78"/></clipPath><clipPath id="tb-duo-c2"><circle cx="300" cy="150" r="78"/></clipPath>
    <marker id="tb-duo-ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1l7 4-7 4" fill="none" stroke="${TB_T}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
  <g transform="translate(-6 21) scale(.86)"><circle cx="100" cy="150" r="78" fill="#eaf6f8"/>
  <g clip-path="url(#tb-duo-c1)"><path d="M48 240c4-40 26-58 52-58s48 18 52 58z" fill="#fff" stroke="#d7e3e8" stroke-width="2"/><path d="M90 160h20v24H90z" fill="#f4d9c6"/>
    <ellipse cx="100" cy="132" rx="26" ry="30" fill="#f8e3d4"/><path d="M73 130c-3-26 12-40 30-40 18 0 30 12 26 32-8-10-20-14-34-12-8 1-14 8-22 20z" fill="${TB_INK}"/></g></g>
  <g transform="translate(62 21) scale(.86)"><circle cx="300" cy="150" r="78" fill="#eaf6f8"/><g clip-path="url(#tb-duo-c2)"><path d="M250 240c2-34 22-50 50-50s48 16 50 50z" fill="#fff" stroke="#d7e3e8" stroke-width="2"/>
    <path d="M300 92v14" stroke="#c9d3d9" stroke-width="3"/><circle cx="300" cy="88" r="6" fill="${TB_T}"/>
    <rect x="258" y="106" width="84" height="70" rx="30" fill="#fff" stroke="#d7e3e8" stroke-width="2"/><rect x="268" y="120" width="64" height="40" rx="20" fill="#1f3340"/>
    <rect x="283" y="132" width="9" height="15" rx="4.5" fill="#5fe0ee"/><rect x="308" y="132" width="9" height="15" rx="4.5" fill="#5fe0ee"/></g></g>
  <text x="200" y="157" text-anchor="middle" font-size="17" font-weight="700" fill="${TB_INK}">사람 <tspan fill="${TB_T}">⟷</tspan> AI</text>
  <g fill="none" stroke="${TB_T}" stroke-width="2.2" stroke-dasharray="6 6" stroke-linecap="round"><path d="M128 72Q200 26 272 72" marker-end="url(#tb-duo-ar)"/><path d="M272 228Q200 274 128 228" marker-end="url(#tb-duo-ar)"/></g>`;
function tAuto() {
  // What it verifies, how it runs, how it automates, where it runs — one diagram each, nothing said twice.
  const areas = [["기능 QA", "Android · iOS · Web · API"], ["앱 성능", "기능 실행과 연계한 구간별 지표"], ["LLM QA", "T-LENS 평가 엔진으로 응답 품질 평가"]];
  const flow = [
    ["테스트 설계", "매뉴얼 TC · 테스트 데이터"],
    ["테스트 실행", "자동 · 수동 · 예약 실행"],
    ["결과 · 증적", "스크린샷 · 영상 · 로그"],
    ["실패 분석", "AI가 원인 · 근거를 분석하고 개선안 제안"],
    ["결함 관리", "등록 · 조치 · 확인, Jira 연계"]
  ];
  // who does each copilot step: h = 사람, a = AI
  const copilot = [["h", "TC 입력", "자연어로 테스트 단계와 기대 결과를 입력", "input"], ["a", "탐색 · 실행", "화면을 분석하고 액션 수행, 필요하면 사용자 확인 요청", "explore"], ["a", "자동화 생성", "실행 경로를 재사용 가능한 자동화 자산으로 구성", "build"], ["h", "검토 · 승인", "결과를 확인해 등록하고, 중요한 변경은 사람이 승인", "approve"]];
  const envs = [["사용자 연결 기기", "사용자 PC에 연결한 기기"], ["사내 전용 디바이스팜", "공유 기기 · 브라우저 병렬 실행"], ["클라우드 디바이스팜", "클라우드 디바이스 기반 LLM 서비스 평가"]];
  return tbSec("platform", "기능 · 성능 · LLM 검증을 하나의 플랫폼에서", "검증 영역은 달라도 자산 · 실행 · 결과 · 결함은 하나의 체계로 관리합니다.", `
      <figure class="tb-stack" aria-label="T-AUTO 플랫폼 구성: 검증 영역과 공통 플랫폼">
        <div class="tb-stack-row areas"><p class="tb-stack-k"><b>검증 영역</b></p>
          <ul>${areas.map(([t, d]) => `<li><b>${t}</b><p>${tbNw(d)}</p></li>`).join("")}</ul></div>
        <div class="tb-stack-row base"><p class="tb-stack-k"><b>공통 플랫폼</b></p>
          <ul>${["테스트 자산", "실행 관리", "결과 · 증적", "결함 관리", "사용자 · 권한"].map((t) => `<li><b>${t}</b></li>`).join("")}</ul></div>
      </figure>`) +
    tbBand("workflow", "설계부터 재검증까지 한 흐름으로", "", `
      <div class="tb-flow">
        <ol>${flow.map(([t, d], i) => `<li${i === 3 ? ' class="is-ai"' : ""} style="--i:${i}"><span>0${i + 1}</span><b>${t}</b><p>${d}</p></li>`).join("")}</ol>
        <div class="tb-flow-loop"><span>06</span><b>재검증 및 결과 비교</b><p>수정 후 다시 실행해 이전 결과와 비교하고, 이력을 누적합니다.</p></div>
      </div>`) +
    tbSec("automation", "AI가 만들고, 사람이 승인합니다", "매뉴얼 TC를 AI 코파일럿이 자동화로 바꾸고, 필요하면 블록이나 코드로 직접 구성합니다.", `
      <div class="tb-duo">
        ${[["h", "사람의 업무"], ["a", "AI의 업무"]].map(([who, k]) => `
        <div class="tb-duo-side ${who}"><p class="tb-duo-k">${k}</p>
          <ul>${copilot.map((c, i) => [...c, i]).filter(([w]) => w === who).map(([, t, d, ico, i]) =>
            `<li><svg viewBox="0 0 48 48" aria-hidden="true">${TB_DUO_ICO[ico]}</svg><div><small>0${i + 1}</small><b>${t}</b><p>${d}</p></div></li>`).join("")}</ul>
          ${who === "a" ? `<p class="tb-duo-ex"><b>실행 실패 시</b>원인과 TC 보완 사항을 제시합니다.</p>` : ""}
        </div>`).join("")}
        <svg class="tb-duo-mid" viewBox="0 0 400 300" role="img" aria-label="사람이 TC를 입력하면 AI가 실행해 자동화를 만들고, 사람이 검토해 승인합니다">${TB_DUO_MID}</svg>
      </div>
      <p class="tb-modes"><b>자동화 방식</b><span class="is-ai">AI 코파일럿<small>TC로 자동 생성</small></span><span>블록 기반<small>조작 기록 · 조건 분기 · 반복</small></span><span>코드 기반<small>스크립트 · 사용자 정의 검증</small></span></p>`) +
    tbSec("execution", "어디서든 실행하고, 성능까지 함께 측정합니다", "", `
      <div class="tb-tree">
        <p class="tb-tree-root">T-AUTO 통합 실행 관리</p>
        <ul>${envs.map(([t, d], i) => `<li style="--i:${i}"><b>${t}</b><p>${d}</p></li>`).join("")}</ul>
      </div>
      <dl class="tb-collect">
        <div><dt>실행과 함께 측정</dt><dd>${["응답 시간", "앱 CPU", "앱 메모리", "배터리 소모(추정)"].map((t) => `<span>${t}</span>`).join("")}</dd></div>
        <div><dt>자동으로 남는 증적</dt><dd>${["스크린샷", "영상", "로그"].map((t) => `<span>${t}</span>`).join("")}</dd></div>
      </dl>
      <p class="tb-note">지원 지표는 OS · 실행 환경에 따라 다를 수 있습니다.</p>`) +
    tbSec("contact", "T-AUTO 도입 문의", "클라우드 · 온프레미스 구축과 CI/CD · Jira 연계는 고객 환경에 맞춰 협의합니다.", tbCta("도입 문의하기"));
}

function tLens() {
  return tbSec("capabilities", "LLM 응답 품질을 정량화하고,<br>변경 전후를 비교합니다", "정답이 고정되지 않는 LLM 서비스의 품질을 일관된 기준으로 평가합니다.",
      tbFlow("LLM 서비스 응답 → LLM-as-a-Judge 통합 채점 → 정성 지표 · 기능 정확성 평가", [
        ["chat", "LLM 서비스<br>응답"],
        [tbAi("judge"), "LLM-as-a-Judge<br>통합 채점"],
        ["report", "정성 지표 · 기능 정확성<br>평가 결과"]
      ]) +
      tbTrio([["", "정성 지표 기반 품질 평가", "응답의 품질을 정성 지표로 채점합니다."], ["", "의미 유사도 기반 기능 정확성 검증", "의미 유사도를 기준으로 기능 정확성을 검증합니다."]], "sm")) +
    tbSec("contact", "T-LENS 도입 문의", "", tbCta("도입 문의하기"));
}

function tGen() {
  return tbSec("intro", "요구사항 분석부터 테스트 케이스 생성까지,<br>AI로 지원합니다", "T-GEN은 기획서 · 요구사항 문서를 분석해 테스트 케이스 초안을 만들고,<br>유사 · 중복 테스트 케이스를 검토해 다시 생성하는 AI 기반 테스트 설계 솔루션입니다.",
      tbFlow("기획서 · 요구사항 문서 → AI 문서 분석 → 테스트 케이스 초안 → 중복 검토 · 재생성", [
        ["docs", "기획서 ·<br>요구사항 문서"],
        [tbAi("AI"), "문서 분석"],
        ["tc", "테스트 케이스<br>초안 생성"],
        ["review", "유사 · 중복 검토<br>및 재생성"]
      ]) +
      tbTrio([["", "문서 기반 TC 자동 생성", "기획서 · 요구사항을 분석해 테스트 케이스 초안을 생성합니다."], ["", "TC 중복 검토 · 재생성", "유사 · 중복 테스트 케이스를 식별하고, 검토 결과를 바탕으로 다시 생성합니다."]], "sm")) +
    tbSec("adoption", "T-GEN 도입 문의", "T-GEN은 T-AUTO 통합 모듈이며, T 브랜드 솔루션의 추가 옵션으로 도입할 수 있습니다.<br>세부 구성은 고객 요구사항에 따라 별도로 제안합니다.", tbCta("T-GEN 도입 문의"));
}

function tVoc() {
  return tbSec("intro", "고객의 목소리를 분석하고,<br>개선 과제로 연결합니다", "T-VOC는 앱 스토어 리뷰를 수집 · 분석하고 VOC를 모니터링하는 솔루션입니다.<br>리뷰를 이슈로 연결하고, AI가 리뷰 유형을 분류하고 답변을 추천합니다.", "") +
    tbSec("collect", "리뷰를 모으고, 이슈로 연결합니다", "앱 스토어 리뷰를 자동으로 수집하고 Jira 티켓을 자동으로 생성 · 연계합니다.",
      tbFlow("앱 스토어 리뷰 → 리뷰 자동 수집 → Jira 티켓 자동 생성 · 연계", [
        ["store", "앱 스토어<br>리뷰"],
        ["inbox", "리뷰<br>자동 수집"],
        ["ticket", "Jira 티켓<br>자동 생성 · 연계"]
      ]), "tb-tight") +
    `<section class="tb-band dark tb-split tb-voc-ai" id="analyze" data-qp-reveal>
      <div>
        <h2 class="qp-h">AI가 분류하고,<br>답변을 추천합니다</h2>
        <div class="qp-lede"><p>모인 리뷰는 AI가 유형별로 자동 분류하고,<br>리뷰에 맞는 답변을 추천해 VOC 대응을 지원합니다.</p></div>
        <ol class="tb-rows sm"><li><b>리뷰 유형 자동 분류</b></li><li><b>AI 기반 답변 추천</b></li></ol>
      </div>
      <img class="tb-voc-art" src="${QA}photos/tvoc-ai-flow.webp" width="1344" height="478" loading="lazy" alt="모인 리뷰를 AI가 분석해 유형을 분류하고, 리뷰에 맞는 답변을 추천합니다">
    </section>` +
    tbSec("adoption", "T-VOC 도입 문의", "T-VOC는 독립적으로 운영하거나 T 브랜드 솔루션과 연계할 수 있으며, 추가 옵션으로 도입합니다.<br>세부 구성은 고객 요구사항에 따라 별도로 제안합니다.", tbCta("T-VOC 도입 문의"));
}

// The deck: banner copy per page, and the title and description the page carries (also written into the
// static copy by tools/build_routes.mjs).
const T_ART = ["../qa/photos/tsol-qa-space.jpg", "../qa/photos/tsol-qa-space.jpg", "../qa/photos/tsol-qa-space-m.jpg"];
const T_SLIDES = [
  { id: "overview", href: "#qa/solution", word: "T BRAND\nSOLUTION", title: "T Brand Solution", desc: "실행 자동화에서 지능형 검증까지\nAI 기반 통합 품질 검증 자동화", tags: ["통합성", "지능화", "신뢰성"], body: tOverview,
    meta: ["T 브랜드 솔루션", "테스트 설계부터 실행, 평가, 결함 관리까지 연결하는 TBELL의 AI 기반 통합 품질 검증 자동화 솔루션입니다. T-AUTO · T-LENS · T-GEN · T-VOC와 도입 방식을 소개합니다."] },
  { id: "auto", word: "T-AUTO", title: "Integrated QA Automation Platform", desc: "기능 · 성능 · LLM 검증을\n하나의 플랫폼에서", tags: ["기능 QA", "앱 성능", "LLM QA", "AI 코파일럿"], body: tAuto,
    meta: ["T-AUTO 통합 QA 자동화 플랫폼", "기능 QA · 앱 성능 · LLM 품질 평가를 하나의 플랫폼에서 운영하고, 테스트 설계부터 실패 분석 · 결함 관리 · 재검증까지 연결하는 T-AUTO를 소개합니다."] },
  { id: "lens", word: "T-LENS", title: "LLM Quality Evaluation", desc: "LLM 응답 품질을 평가하고\n변화까지 검증합니다", tags: ["LLM-as-a-Judge", "멀티턴", "회귀 검증"], body: tLens,
    meta: ["T-LENS LLM 품질 평가 솔루션", "LLM-as-a-Judge 기반으로 LLM 응답 품질을 자동 평가하고, 모델 · 프롬프트 변경에 따른 품질 변화를 비교하는 T-LENS를 소개합니다."] },
  { id: "gen", word: "T-GEN", title: "AI Test Case Generation", desc: "요구사항 문서에서\n테스트 케이스 초안까지", tags: ["문서 기반 생성", "중복 검토", "재생성"], body: tGen,
    meta: ["T-GEN AI 테스트케이스 생성 솔루션", "기획서 · 요구사항 문서를 분석해 테스트 케이스 초안을 생성하고, 중복을 검토해 다시 생성하는 T-GEN을 소개합니다."] },
  { id: "voc", word: "T-VOC", title: "AI Customer Review Analysis", desc: "고객의 목소리를 분석하고\n개선 과제로 연결합니다", tags: ["리뷰 수집", "AI 분류", "답변 추천", "Jira 연계"], body: tVoc,
    meta: ["T-VOC AI 고객 리뷰 분석 솔루션", "앱 스토어 리뷰를 자동으로 수집해 Jira 이슈로 연계하고, AI가 리뷰 유형을 분류하고 답변을 추천하는 T-VOC를 소개합니다."] }
];
const T_PAGES = Object.fromEntries(T_SLIDES.map((slide) => [slide.id, slide]));

function tDeck(child) {
  const slides = T_SLIDES.map((slide) => ({ ...slide, bg: T_ART }));
  return qaDeck(slides, T_PAGES[child] ? child : "overview", "#qa/solution/", qaLeaves("solution"))
    .replace('<section class="detail svc-page">', '<section class="detail svc-page tb-page">');
}

// Title and description for routes that carry their own (the T pages); null keeps the site default.
function pageMeta(mode, group, child) {
  if (mode !== "qa" || group !== "solution") return null;
  const slide = T_PAGES[child || "overview"];
  return slide ? { title: slide.meta[0] + " · TBELL", description: slide.meta[1] } : null;
}

// Security pages on the s- layout (design.md › Security layout).
// Detail pages keep a dark hero over a white body; the mode home is dark throughout.
function sPage(eyebrow, title, lede, body, jumps, extra = "", tone = "light") {
  const bar = jumps && jumps.length
    ? `<nav class="s-subnav" aria-label="이 페이지"><div class="s-wrap">${jumps.map(([id, label]) => `<button type="button" data-jump="${id}">${label}</button>`).join("")}</div></nav>`
    : "";
  const ledeHtml = lede ? `<p class="lede">${lede}</p>` : "";
  return `<div class="s-page ${tone}">
  <section class="s-hero plain"><div class="s-wrap"><div><p class="s-eyebrow">${eyebrow}</p><h1>${title}</h1>${ledeHtml}${extra}</div></div></section>${bar}${body}
</div>`;
}

// Security detail pages (사전 진단 · 컨설팅 · 인증) as one banner deck built by qaDeck, like the QA
// detail pages: origin-format banner art (design_demo/sec-banners), sibling tabs, the page lede as the
// centred intro, then the page's own body. Each page hands over its parts through secPage().
function secPage(eyebrow, title, lede, body) {
  return { eyebrow, title, lede, body };
}

const SECURITY_PAGES = [
  // [id, tab label, intro title, banner title, page, banner tags]
  ["diagnose", "사전 진단", "셀프 진단", "Compliance Navigator", () => diagnose(), ["의무 진단", "일정 역산", "상담 신청"]],
  ["services", "컨설팅", "정보보호 컨설팅", "Security Consulting", () => services(), SVC_DOMAINS.map((d) => d.title)],
  ["cert", "인증", "인증 컨설팅", "Certification", () => cert(), ["ISMS", "ISMS-P", "ISO"]]
];

function securityDeck(id) {
  const art = (key) => ["bg-", "bg-tablet-", "bg-mobile-"].map((pre) => `../security/${pre}${key}.png`);
  const slides = SECURITY_PAGES.map(([key, , intro, banner, page, tags]) => ({
    id: key, title: banner, tags, bg: art(key),
    get desc() { return page().title.replace(/<br>/g, "\n"); },
    body: () => {
      const p = page();
      return `<section class="qp-sec qp-intro"><h2 class="qp-h">${intro}</h2><div class="qp-lede"><p>${p.lede}</p></div></section>${p.body}`;
    }
  }));
  const leaves = SECURITY_PAGES.map(([key, label]) => ({ id: key, label, href: "#security/" + key }));
  return qaDeck(slides, id, "#security/", leaves).replace('<div class="svc-body">', '<div class="svc-body s-page light sec-body">');
}

function sSec(id, [eyebrow, title, lede, icon], inner, alt) {
  const badge = icon ? `<span class="s-badge">${icon}</span>` : "";
  const ledeHtml = lede ? `<p>${lede}</p>` : "";
  return `
  <section class="s-sec${alt ? " alt" : ""}"${id ? ` id="${id}"` : ""}><div class="s-wrap">
    <div class="s-head">${badge}<p class="s-eyebrow">${eyebrow}</p><h2>${title}</h2>${ledeHtml}</div>
    ${inner}
  </div></section>`;
}

const SEC_CLOCK = [
  // [date, title, note, state] — state: past / now / next, relative to 기준일 2026.10
  ["2025.10.31", "ISO/IEC 27001:2013 인증 효력 종료", "2022판 전환 완료 필요", "past"],
  ["2026.01.22", "AI 기본법 시행", "고영향 AI·생성형 AI 사업자 의무", "past"],
  ["2026 하반기", "ISMS·ISMS-P 사후관리 강화", "중대 사고 시 특별 사후심사·인증 취소 근거", "now"],
  ["2027", "ISMS-P 등급제·강화 기준 적용", "간편·표준·강화 3단계, 예비심사·기술심사 도입", "next"],
  ["2027.07 예정", "중요 개인정보처리자 ISMS-P 의무화", "대상 기준은 고시로 확정 예정", "next"]
];

const SEC_DOMAIN_LINES = {
  "domain-a": "ISMS·ISMS-P, ISO 27001 계열의 취득과 유지",
  "domain-b": "처리 흐름, 수탁사, 가명정보, 국외 이전",
  "domain-c": "마스터플랜, 공시, Virtual CISO 자문",
  "domain-d": "AI, 클라우드, 공급망 기술적 진단"
};

function secDomainItems(d) {
  return SEC_DOMAIN_LINES[d.id];
}

// Security home, dark throughout: hero → regulation → start path → four domains → close.
function securityHome() {
  const now = SEC_CLOCK.findIndex((row) => row[3] === "now");
  const fill = (now / (SEC_CLOCK.length - 1)) * 100;
  const clock = SEC_CLOCK.map(([when, title, note, state]) =>
    `<li class="is-${state}"><span class="dot" aria-hidden="true"></span><span class="when">${when}</span><h3>${title}</h3><p>${note}</p></li>`).join("");
  const path = [
    ["셀프 진단", "업종과 규모를 고르면 해당 의무와 목표 심사일 기준 착수일이 바로 나옵니다.", "#security/diagnose", "진단 시작"],
    ["서비스·계약", "관리체계, 개인정보, 거버넌스, 신기술 리스크. 진행 단계와 계약 방식까지 한곳에서 확인합니다.", "#security/services", "서비스 보기"],
    ["인증 컨설팅", "ISMS·ISMS-P·ISO 차이와 2027년 심사 변화, 권장 일정과 인증 이후 3년을 정리했습니다.", "#security/cert", "인증 살펴보기"]
  ].map(([title, text, href, go], i) =>
    `<li><a href="${href}"><span class="sh-no">${String(i + 1).padStart(2, "0")}</span><b>${title}</b><p>${text}</p><span class="sh-go">${go}</span></a></li>`).join("");
  const domains = SVC_DOMAINS.map((d) =>
    `<li><a href="#security/services" data-jump="${d.id}"><span class="sd-key">${d.key}</span><div><b>${d.title}</b><p>${secDomainItems(d)}</p></div><svg class="inq-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></a></li>`).join("");
  return `<div class="sh s-page dark home" id="svc">
  <section class="sk-hero">
    <div class="s-wrap">
      <div class="sk-copy">
        <p class="qh-label">TBELL 정보보호 컨설팅</p>
        <h1>우리 회사에 필요한 보안 인증,<br>2분이면 알 수 있습니다.</h1>
        <p class="lede">어떤 인증이 의무인지, 기한은 언제인지, 오늘 무엇부터 시작해야 하는지. 질문 몇 개에 답하면 바로 확인할 수 있고, 그 결과를 그대로 보내 주시면 티벨이 컨설팅 계획으로 답합니다.</p>
        <div class="s-actions"><a class="pill" href="#security/diagnose">2분 셀프 진단 시작</a><a class="pill ghost" href="#security/services">서비스 보기</a></div>
      </div>
      <div class="sk-art">${secShield()}</div>
    </div>
    <a class="qh-scroll" href="#security" data-jump="clock" aria-label="아래로 이동"><span></span></a>
  </section>

  <section class="s-sec sh-clock2" id="clock"><div class="s-wrap">
    <div class="qh-head center"><p class="qh-label">기준일 2026.10</p><h2>지금 바뀌고 있는 규제</h2></div>
    <div class="s-htl">
      <div class="s-htl-track" aria-hidden="true"><i style="--fill:${fill}%"></i></div>
      <ol>${clock}</ol>
    </div>
    <p class="sh-foot">정부 발표·보도 기준이며 세부 일정은 법령·고시 개정에 따라 바뀔 수 있습니다. <a class="sh-text-link" href="#security/cert">2027 심사 개편 보기</a></p>
  </div></section>

  <section class="s-sec alt sh-path" id="routes"><div class="s-wrap">
    <div class="qh-head center"><p class="qh-label">Start here</p><h2>필요한 만큼만 골라 보세요</h2><p>진단, 서비스 범위, 인증 준비는 서로 다른 질문입니다. 지금 궁금한 것부터 보면 됩니다.</p></div>
    <div class="sh-route"><div class="sh-line" aria-hidden="true"><i></i></div><ol>${path}</ol></div>
  </div></section>

  <section class="s-sec sh-domains" id="domains-home"><div class="s-wrap">
    <div class="qh-head"><p class="qh-label">Services</p><h2>네 가지 영역에서 시작합니다</h2><p>조직의 상황에 맞는 영역을 고르고, 범위는 상담에서 조정합니다.</p></div>
    <ul class="sd-list">${domains}</ul>
  </div></section>

  <section class="qh-close"><div class="s-wrap">
    <h2>진단 결과를 보내 주시면,<br>계획으로 답합니다.</h2>
    <div class="sh-close-actions"><a class="pill" href="#security/diagnose">셀프 진단 시작</a><a class="pill ghost" href="#security/inquiry">바로 상담 신청</a></div>
  </div></section>
</div>`;
}

// Security hero art: a rendered metal shield (assets/shield.png, made by design_demo/hero-options/render_shield.py)
// inside an orbit that carries the four consulting domains. One pulse travels the orbit; the domain it
// reaches lights, and the shield answers with a rim glow turned toward that domain and a pulse of its check.
// Overlay coordinates share the render's 1400px space.
const SX_ANGLES = [45, 135, 225, 315];
const SX_C = [700, 700];
const SX_R = 640;

function sxPoint(deg, r = SX_R) {
  const a = (deg - 90) * Math.PI / 180;
  return [SX_C[0] + r * Math.cos(a), SX_C[1] + r * Math.sin(a)];
}

function secShield() {
  const ticks = [];
  for (let k = 0; k < 120; k++) {
    const [x1, y1] = sxPoint(k * 3, SX_R + 18);
    const [x2, y2] = sxPoint(k * 3, SX_R + (k % 10 ? 28 : 42));
    ticks.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"${k % 10 ? "" : ' class="major"'}/>`);
  }
  const nodes = SVC_DOMAINS.map((d, i) => {
    const [x, y] = sxPoint(SX_ANGLES[i]);
    const right = SX_ANGLES[i] < 180;
    const tx = right ? x + 66 : x - 66;
    const anchor = right ? "start" : "end";
    return `<a class="sx-node" href="#security/services" data-jump="${d.id}" data-i="${i}" aria-label="${d.title}">
        <circle class="sx-node-halo" cx="${x}" cy="${y}" r="52"/>
        <circle class="sx-node-dot" cx="${x}" cy="${y}" r="36"/>
        <text class="sx-node-key" x="${x}" y="${y + 14}" text-anchor="middle">${d.key}</text>
        <text class="sx-node-en" x="${tx}" y="${y - 10}" text-anchor="${anchor}">DOMAIN ${d.key}</text>
        <text class="sx-node-name" x="${tx}" y="${y + 34}" text-anchor="${anchor}">${d.title}</text>
      </a>`;
  }).join("");
  return `<div class="sx" style="--gx:75%;--gy:25%">
      <svg class="sx-orbit" viewBox="0 0 1400 1400" aria-hidden="true">
        <circle class="sx-ring" cx="700" cy="700" r="${SX_R}"/>
        <circle class="sx-ring-in" cx="700" cy="700" r="${SX_R - 46}"/>
        <g class="sx-ticks">${ticks.join("")}</g>
        <g class="sx-pulse"><circle cx="700" cy="${700 - SX_R}" r="12"/><circle class="tail" cx="700" cy="${700 - SX_R}" r="26"/></g>
      </svg>
      <div class="sx-body">
        <img class="sx-shield" src="${window.TBELL_BASE || ""}assets/shield.png?v=3" alt="" width="1000" height="1000">
        <span class="sx-glow" aria-hidden="true"></span>
        <span class="sx-sheen" aria-hidden="true"></span>
        <svg class="sx-mark" viewBox="0 0 1400 1400" aria-hidden="true"><circle class="sx-core" cx="700" cy="640" r="96"/><path class="sx-check" pathLength="100" d="M642 642 L686 686 L766 594"/></svg>
      </div>
      <svg class="sx-links" viewBox="0 0 1400 1400" role="group" aria-label="정보보호 컨설팅 4개 영역">${nodes}</svg>
    </div>
    <a class="sx-caption" href="#security/services" data-jump="${SVC_DOMAINS[0].id}"><span class="k">DOMAIN ${SVC_DOMAINS[0].key}</span><b>${SVC_DOMAINS[0].title}</b><svg class="inq-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></a>`;
}

// One clock drives the whole hero: the pulse moves to the next domain, that domain lights, the shield's
// glow turns toward it and the check pulses. Pointing at a domain sends the pulse there and holds it.
function wireSecHome() {
  if (window.__sxTimer) { clearInterval(window.__sxTimer); window.__sxTimer = null; }
  const root = document.querySelector(".sh");
  if (!root) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sx = root.querySelector(".sx");
  const body = root.querySelector(".sx-body");
  const pulse = root.querySelector(".sx-pulse");
  const nodes = Array.from(root.querySelectorAll(".sx-node"));
  const caption = root.querySelector(".sx-caption");
  let lit = -1;
  let turn = 0;
  let held = false;
  const go = (i) => {
    if (i === lit) return;
    const target = SX_ANGLES[i];
    let delta = (target - (turn % 360) + 360) % 360;
    if (delta === 0 && lit !== -1) delta = 360;
    turn += delta;
    pulse.style.transform = `rotate(${turn}deg)`;
    lit = i;
    nodes.forEach((n, k) => n.classList.toggle("is-lit", k === i));
    // Glow sits on the shield image box (10%..90% of the art); convert the orbit point into it.
    const [x, y] = sxPoint(target, 360);
    sx.style.setProperty("--gx", ((x / 14 - 10) / 0.8).toFixed(1) + "%");
    sx.style.setProperty("--gy", ((y / 14 - 7) / 0.8).toFixed(1) + "%");
    sx.classList.remove("beat");
    void sx.offsetWidth;
    sx.classList.add("beat");
    const d = SVC_DOMAINS[i];
    caption.dataset.jump = d.id;
    caption.querySelector(".k").textContent = `DOMAIN ${d.key}`;
    caption.querySelector("b").textContent = d.title;
  };
  go(0);
  nodes.forEach((n, k) => {
    const hold = () => { held = true; go(k); };
    n.addEventListener("mouseenter", hold);
    n.addEventListener("focus", hold);
    n.addEventListener("mouseleave", () => { held = false; });
    n.addEventListener("blur", () => { held = false; });
  });
  if (reduce) return;
  const hero = root.querySelector(".sk-hero");
  hero.addEventListener("pointermove", (event) => {
    const box = hero.getBoundingClientRect();
    body.style.setProperty("--rx", (((event.clientY - box.top) / box.height - 0.5) * -8).toFixed(2) + "deg");
    body.style.setProperty("--ry", (((event.clientX - box.left) / box.width - 0.5) * 10).toFixed(2) + "deg");
    body.style.setProperty("--sh", (((event.clientX - box.left) / box.width) * 100).toFixed(1) + "%");
  });
  hero.addEventListener("pointerleave", () => {
    body.style.setProperty("--rx", "0deg");
    body.style.setProperty("--ry", "0deg");
  });
  window.__sxTimer = setInterval(() => {
    if (!document.body.contains(root)) { clearInterval(window.__sxTimer); window.__sxTimer = null; return; }
    if (!held) go((lit + 1) % nodes.length);
  }, 2400);
}

function mark(body) {
  return `<svg class="mark" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

const ICO = {
  form: mark(`<rect x="10" y="8" width="28" height="34" rx="3"/><rect x="18" y="4" width="12" height="8" rx="2"/><path d="M18 24h12M18 30h8"/><path d="M16 22l2 2 4-4" stroke="#27c4d5"/>`),
  cal: mark(`<rect x="8" y="10" width="32" height="28" rx="3"/><path d="M8 18h32M16 6v8M32 6v8"/><path d="M17 28h5M26 26v6" stroke="#27c4d5"/>`),
  send: mark(`<rect x="6" y="12" width="36" height="24" rx="3"/><path d="M6 14l18 13L42 14" stroke="#27c4d5"/>`),
  layers: mark(`<path d="M8 16l16-8 16 8-16 8z"/><path d="M8 24l16 8 16-8"/><path d="M8 32l16 8 16-8" stroke="#27c4d5"/>`),
  gate: mark(`<path d="M10 42V16l14-8 14 8v26"/><path d="M20 42V28h8v14"/><path d="M21 32l3 3 5-5" stroke="#27c4d5"/>`),
  scan: mark(`<circle cx="21" cy="21" r="11"/><path d="M29 29l9 9" stroke="#27c4d5"/><path d="M17 21h8M21 17v8"/>`),
  renew: mark(`<path d="M24 6l14 6v10c0 8-6 14-14 18-8-4-14-10-14-18V12z"/><path d="M24 16v8l5 3" stroke="#27c4d5"/>`),
  shield: mark(`<path d="M24 6l14 6v10c0 8-6 14-14 18-8-4-14-10-14-18V12z"/><path d="M17 24l4 4 10-10" stroke="#27c4d5"/>`),
  person: mark(`<circle cx="17" cy="16" r="6"/><path d="M6 38v-2a10 10 0 0 1 10-10h2"/><path d="M30 18l10 4v7c0 6-4 10-10 12-6-2-10-6-10-12v-7z" stroke="#27c4d5"/>`),
  globe: mark(`<circle cx="24" cy="24" r="14"/><ellipse cx="24" cy="24" rx="6" ry="14"/><path d="M10 24h28"/><path d="M13 17h22M13 31h22" stroke="#27c4d5"/>`),
  lock: mark(`<rect x="6" y="8" width="22" height="30" rx="2"/><path d="M12 18h10M12 24h10"/><rect x="24" y="24" width="16" height="14" rx="2" stroke="#27c4d5"/><path d="M28 24v-3a4 4 0 0 1 8 0v3" stroke="#27c4d5"/>`),
  cloud: mark(`<path d="M14 36h20a8 8 0 0 0 1-16 11 11 0 0 0-21 1 8 8 0 0 0 0 15z"/><path d="M20 30h8" stroke="#27c4d5"/>`),
  nodes: mark(`<circle cx="24" cy="24" r="5" stroke="#27c4d5"/><circle cx="10" cy="12" r="3"/><circle cx="38" cy="12" r="3"/><circle cx="10" cy="36" r="3"/><circle cx="38" cy="36" r="3"/><path d="M13 14l7 7M35 14l-7 7M13 34l7-7M35 34l-7-7"/>`),
  flag: mark(`<path d="M16 42V8"/><path d="M16 10h18l-4 6 4 6H16" stroke="#27c4d5"/>`),
  look: mark(`<circle cx="22" cy="22" r="10"/><path d="M30 30l8 8" stroke="#27c4d5"/>`),
  loop: mark(`<path d="M16 18a10 10 0 0 1 17-2"/><path d="M32 30a10 10 0 0 1-17 2" stroke="#27c4d5"/><path d="M30 10v7h7"/><path d="M18 38v-7h-7" stroke="#27c4d5"/>`),
  stamp: mark(`<circle cx="24" cy="22" r="12"/><path d="M18 22l4 4 8-8" stroke="#27c4d5"/><path d="M14 40h20"/>`)
};

// Self-diagnosis, restored to security_demo/diagnose.html: STEP 1 questions beside the live result, then
// STEP 2 at full width (target date, three metrics, verdict, gantt) and the STEP 3 band. Classes carry a
// dz- prefix so the older global .navi / .plan-* rules elsewhere in this file can't leak in.
// design_demo/diagnose-review/README.md lists every difference from the original.
function diagnose() {
  const sectors = [["online", "온라인 서비스·플랫폼"], ["finance", "금융·핀테크"], ["medical", "의료(병원)"], ["univ", "교육(대학)"], ["mfg", "제조"], ["public", "공공기관"], ["etc", "기타"]];
  const items = [
    ["q-rev", "정보통신서비스 부문 전년도 매출 100억 원 이상", true],
    ["q-users", "직전 3개월 일평균 이용자 100만 명 이상", false],
    ["q-infra", "전국 단위 통신망 사업(ISP) 또는 데이터센터(IDC) 운영", false],
    ["q-pii", "개인정보 보유 규모가 100만 명 이상", true],
    ["q-ai", "AI 기능이 들어간 서비스를 제공하거나 준비 중", true],
    ["q-global", "해외 고객사가 있거나 해외 진출 예정", false],
    ["q-cloud", "공공기관에 SaaS·클라우드 서비스를 공급하거나 예정", false],
    ["q-listed", "상장사이거나 연 매출 3,000억 원 이상", false]
  ];
  // Banner and page tabs come from the security deck (securityDeck); the body is security_demo's.
  return secPage("Compliance Navigator", "질문에 답하면 의무와 일정이 바로 나옵니다",
    "STEP 1에서 해당되는 의무를 확인하고, STEP 2에서 목표 심사일을 넣어 착수일을 계산하세요. STEP 3에서 그 결과로 바로 상담을 신청할 수 있습니다.",
    `<div class="dz">
  <section class="dz-section" id="step-1">
    <div class="s-wrap">
      <div class="dz-navi">
        <form class="dz-navi-q" id="navi-form" aria-label="의무 진단 질문">
          <div>
            <div class="dz-panel-k">STEP 1 · 의무 진단</div>
            <h2 class="dz-panel-h">조직 정보를 선택하세요</h2>
          </div>
          <div class="dz-q-group">
            <label class="dz-q-label" for="q-sector">업종</label>
            <select id="q-sector">${sectors.map(([value, label], i) => `<option value="${value}"${i ? "" : " selected"}>${label}</option>`).join("")}</select>
          </div>
          <fieldset class="dz-q-group">
            <legend>해당하는 항목을 모두 고르세요</legend>
            ${items.map(([id, label, on]) => `<label class="dz-check"><input type="checkbox" id="${id}"${on ? " checked" : ""}>${label}</label>`).join("\n            ")}
          </fieldset>
          <fieldset class="dz-q-group">
            <legend>보유 중인 인증</legend>
            <div class="dz-pills">
              <label><input type="checkbox" id="h-isms" checked>ISMS</label>
              <label><input type="checkbox" id="h-ismsp">ISMS-P</label>
              <label><input type="checkbox" id="h-iso">ISO 27001</label>
            </div>
          </fieldset>
        </form>
        <div class="dz-navi-r" aria-live="polite">
          <div>
            <div class="dz-panel-k">결과</div>
            <h2 class="dz-panel-h" id="r-title">검토가 필요한 항목</h2>
          </div>
          <p class="dz-r-sum" id="r-sum"></p>
          <ul class="dz-r-list" id="r-list"></ul>
          <p class="dz-note">처음 화면은 예시 선택 상태입니다. 결과는 공개된 법령·정부 발표를 바탕으로 한 참고용이며, 최종 해당 여부는 상담에서 확인합니다.</p>
        </div>
      </div>

      <div class="dz-planner" id="step-2">
        <div class="dz-plan-top">
          <div>
            <div class="dz-panel-k">STEP 2 · 목표일 역산</div>
            <h2 class="dz-panel-h">언제 인증심사를 받을 계획인가요?</h2>
            <p class="dz-note dz-plan-lede">목표 심사일을 정하면 착수부터 심사까지 약 30주 권장 일정을 날짜에 맞춰 역산합니다.</p>
          </div>
          <div class="dz-plan-in">
            <label for="p-target">목표 인증심사 시작일</label>
            <input type="date" id="p-target" value="2027-05-03">
          </div>
        </div>
        <div class="dz-plan-summary" id="plan-summary" aria-live="polite"></div>
        <div class="dz-status" id="p-verdict" role="status"></div>
        <div class="dz-gantt-wrap" id="sched-cal" aria-live="polite"></div>
        <ol class="sr-only" id="p-steps"></ol>
      </div>

      <div class="dz-step-cta" id="step-3">
        <div class="dz-cta-txt">
          <span class="dz-panel-k">STEP 3 · 상담 신청</span>
          <strong>이 결과로 컨설팅 계획을 받아 보세요</strong>
          <p>진단 결과와 계산한 일정이 상담 신청서에 자동으로 들어갑니다. 이름과 연락처만 더하면 됩니다.</p>
        </div>
        <button type="button" class="pill" id="to-contact">이 결과로 상담 신청</button>
      </div>
    </div>
  </section>
</div>`,
    [["step-1", "의무 진단"], ["step-2", "일정 역산"], ["step-3", "상담 신청"]]);
}

function cert() {
  return secPage("Certification · ISMS / ISMS-P / ISO", "2027년, 인증 심사가 달라집니다", "인증을 받은 기업에서도 대형 유출 사고가 이어지자 정부는 ISMS·ISMS-P를 서면 심사 중심에서 운영 현장과 기술을 확인하는 심사로 바꾸고 있습니다. 문서만 갖춘 준비로는 통과도, 유지도 어려워집니다.",
    sSec("reform", ["", "심사 개편"], `
    <div class="s-cards two s-body">
      <article class="s-card icon"><span class="s-ibox">${ICO.layers}</span><div><p class="s-eyebrow">등급제</p><h3>간편·표준·강화 3단계</h3><p>위험도에 따라 기준을 달리 적용합니다. 통신사와 대형 플랫폼은 강화 등급 대상입니다.</p></div></article>
      <article class="s-card icon"><span class="s-ibox">${ICO.gate}</span><div><p class="s-eyebrow">예비심사</p><h3>핵심 항목 미충족 시 본심사 불가</h3><p>본심사 전에 핵심 통제를 먼저 확인합니다. 준비가 덜 된 상태로는 심사에 들어갈 수 없습니다.</p></div></article>
      <article class="s-card icon"><span class="s-ibox">${ICO.scan}</span><div><p class="s-eyebrow">기술심사</p><h3>취약점 진단·모의침투 적용</h3><p>운영 환경 현장 점검과 함께 취약점 스캐너, 소스코드 진단, 모의침투가 심사에 들어옵니다.</p></div></article>
      <article class="s-card icon"><span class="s-ibox">${ICO.renew}</span><div><p class="s-eyebrow">사후관리</p><h3>사후심사 확대·인증 취소</h3><p>사후심사 인력과 기간이 늘고, 중대 사고나 중대 결함 미조치 시 인증이 취소될 수 있습니다.</p></div></article>
    </div>
    <p class="s-note">출처: 과학기술정보통신부·개인정보보호위원회 발표 보도(바이라인네트워크 2025.12, 뉴시스 2026.03, 보안뉴스). 세부 사항은 고시 개정에 따라 달라질 수 있습니다.</p>`) +
    sSec("certs", ["", "지원하는 인증", "조직이 이미 가진 인증과 앞으로 필요한 인증을 함께 놓고, 가장 적은 작업으로 모두 대응할 수 있는 순서를 제안합니다."], `
    <div class="s-cards two s-body">
      <article class="s-card icon"><span class="s-ibox">${ICO.shield}</span><div><p class="s-eyebrow">인증기준 80개</p><h3>ISMS</h3><p class="who">정보통신서비스 매출 100억 원 이상 또는 일평균 이용자 100만 명 이상, IDC, 전국 ISP 등 의무대상</p><p>관리체계 수립·운영 16개와 보호대책 64개 항목으로 구성됩니다. 의무대상이 인증을 받지 않으면 3,000만 원 이하의 과태료 대상입니다.</p></div></article>
      <article class="s-card icon"><span class="s-ibox">${ICO.person}</span><div><p class="s-eyebrow">인증기준 101개</p><h3>ISMS-P</h3><p class="who">개인정보를 대량 처리하는 기업·기관, 2027년 의무화 대상 예정 조직</p><p>ISMS 80개 항목에 개인정보 처리 단계별 요구사항 21개가 더해집니다. 수집부터 파기까지 처리 흐름 전체를 다룹니다.</p></div></article>
      <article class="s-card icon"><span class="s-ibox">${ICO.globe}</span><div><p class="s-eyebrow">부속서 A 93개</p><h3>ISO/IEC 27001</h3><p class="who">해외 고객사·글로벌 공급망에 보안 수준을 증명해야 하는 기업</p><p>2022년판 기준으로 조직·인력·물리·기술 4개 영역 93개 통제입니다. 위협 인텔리전스, 클라우드 서비스 이용 보안 등 11개 통제가 새로 추가되었습니다.</p></div></article>
      <article class="s-card icon"><span class="s-ibox">${ICO.lock}</span><div><p class="s-eyebrow">개인정보</p><h3>ISO/IEC 27701</h3><p class="who">GDPR 등 해외 개인정보 규제에 대응해야 하는 기업</p><p>개인정보 관리체계 국제 표준입니다. 개인정보 처리자와 수탁자 역할별 요구사항을 다루며, ISMS-P 개인정보 항목과 겹치는 부분이 많습니다.</p></div></article>
      <article class="s-card icon"><span class="s-ibox">${ICO.cloud}</span><div><p class="s-eyebrow">클라우드</p><h3>ISO/IEC 27017·27018</h3><p class="who">SaaS·클라우드 서비스 제공 기업</p><p>27017은 클라우드 보안 통제, 27018은 퍼블릭 클라우드의 개인정보 보호를 다룹니다. 27001 인증 범위에 함께 포함해 받는 경우가 많습니다.</p></div></article>
      <article class="s-card icon"><span class="s-ibox">${ICO.nodes}</span><div><p class="s-eyebrow">AI 경영</p><h3>ISO/IEC 42001</h3><p class="who">AI 서비스를 개발·운영하거나 AI 기본법 대응이 필요한 기업</p><p>AI 경영시스템 국제 표준입니다. AI 위험평가와 영향평가, 데이터 관리, AI 시스템 수명주기 관리를 요구합니다.</p></div></article>
    </div>`, true) +
    sSec("map", ["", "인증 간 통합 매핑", "주요 관리 영역이 각 인증의 어느 조항에 해당하는지 정리한 예시입니다. 같은 영역은 하나의 정책과 증적으로 여러 인증에 대응합니다."], `
    <div class="s-cmp-wrap s-body">
      <table class="s-cmp s-map">
        <caption class="sr-only">인증 간 통제 매핑</caption>
        <thead><tr><th scope="col">관리 영역</th><th scope="col">ISMS-P</th><th scope="col">ISO/IEC 27001:2022</th><th scope="col">ISO/IEC 27701</th><th scope="col">ISO/IEC 42001</th></tr></thead>
        <tbody>
          <tr><th scope="row">정책·조직·경영진 책임</th><td><span class="m-full">●</span> 1.1 관리체계 기반 마련</td><td><span class="m-full">●</span> 5 리더십</td><td><span class="m-full">●</span> 개인정보 관점 확장</td><td><span class="m-full">●</span> 5 리더십 · A.2–A.3</td></tr>
          <tr><th scope="row">위험평가·위험처리</th><td><span class="m-full">●</span> 1.2 위험 관리</td><td><span class="m-full">●</span> 6.1 위험 대응</td><td><span class="m-full">●</span> 개인정보 위험 포함</td><td><span class="m-full">●</span> 6.1 AI 위험 · A.5 영향평가</td></tr>
          <tr><th scope="row">외부자·공급자 관리</th><td><span class="m-full">●</span> 2.3 외부자 보안</td><td><span class="m-full">●</span> A.5.19–5.22</td><td><span class="m-full">●</span> 수탁자 요구사항</td><td><span class="m-full">●</span> A.10 제3자 관계</td></tr>
          <tr><th scope="row">인증·권한·접근통제</th><td><span class="m-full">●</span> 2.5–2.6</td><td><span class="m-full">●</span> A.5.15–5.18, A.8.2–8.5</td><td><span class="m-part">◐</span> 개인정보 접근 제한</td><td><span class="m-none">—</span></td></tr>
          <tr><th scope="row">로그·모니터링</th><td><span class="m-full">●</span> 2.9 운영관리</td><td><span class="m-full">●</span> A.8.15–8.16</td><td><span class="m-part">◐</span> 처리 기록</td><td><span class="m-part">◐</span> A.6 운영 모니터링</td></tr>
          <tr><th scope="row">침해사고 대응</th><td><span class="m-full">●</span> 2.11 사고 예방 및 대응</td><td><span class="m-full">●</span> A.5.24–5.28</td><td><span class="m-full">●</span> 개인정보 유출 대응</td><td><span class="m-part">◐</span> AI 사고 보고</td></tr>
          <tr><th scope="row">개인정보 생명주기</th><td><span class="m-full">●</span> 3 처리 단계별 요구사항</td><td><span class="m-part">◐</span> A.5.34 개인정보 보호</td><td><span class="m-full">●</span> 처리자·수탁자 통제</td><td><span class="m-none">—</span></td></tr>
          <tr><th scope="row">데이터 품질·AI 수명주기</th><td><span class="m-none">—</span></td><td><span class="m-none">—</span></td><td><span class="m-none">—</span></td><td><span class="m-full">●</span> A.6 수명주기 · A.7 데이터</td></tr>
        </tbody>
      </table>
    </div>
    <div class="s-legend"><span><b class="m-full">●</b> 직접 대응</span><span><b class="m-part">◐</b> 부분 대응</span><span><b class="m-none">—</b> 해당 없음</span><span>조직 범위에 맞춰 착수 단계에서 항목 단위로 정밀화합니다</span></div>`) +
    sSec("schedule", ["", "ISMS-P 최초 인증 권장 일정", "인증을 신청하려면 그 전에 관리체계를 2개월 이상 운영해야 합니다. 또 인증기관은 본심사 6~8주 전에 예비점검을 나옵니다. 티벨은 이 두 조건을 거꾸로 맞춰 착수일을 정하고, 신청 전에 내부점검과 모의심사를 거칩니다."], `
    <div class="gantt s-body" role="img" aria-label="ISMS-P 최초 인증 32주 권장 일정">
      <div class="g-row"><div class="g-label">착수·범위 정의<small>W1–2</small></div><div class="g-track"><span class="g-bar" style="grid-column: 1 / 3;"></span></div></div>
      <div class="g-row"><div class="g-label">현황 분석·GAP<small>W3–6</small></div><div class="g-track"><span class="g-bar" style="grid-column: 3 / 7;"></span></div></div>
      <div class="g-row"><div class="g-label">위험평가·DoA 결정<small>W7–10</small></div><div class="g-track"><span class="g-bar" style="grid-column: 7 / 11;"></span></div></div>
      <div class="g-row"><div class="g-label">보호대책·정책 제·개정<small>W9–14</small></div><div class="g-track"><span class="g-bar" style="grid-column: 9 / 15;"></span></div></div>
      <div class="g-row"><div class="g-label">임직원 인증 교육<small>W13–14</small></div><div class="g-track"><span class="g-bar" style="grid-column: 13 / 15;"></span></div></div>
      <div class="g-row"><div class="g-label">관리체계 운영·증적 축적<small>W13~ · 신청 전 2개월 이상</small></div><div class="g-track"><span class="g-bar client" style="grid-column: 13 / 33;"></span></div></div>
      <div class="g-row"><div class="g-label">내부점검·모의심사<small>W19–21</small></div><div class="g-track"><span class="g-bar" style="grid-column: 19 / 22;"></span></div></div>
      <div class="g-row"><div class="g-label">인증 신청<small>W22</small></div><div class="g-track"><span class="g-bar" style="grid-column: 22 / 23;"></span></div></div>
      <div class="g-row"><div class="g-label">인증기관 예비점검<small>W25–26 · 심사 6~8주 전</small></div><div class="g-track"><span class="g-bar audit" style="grid-column: 25 / 27;"></span></div></div>
      <div class="g-row"><div class="g-label">인증심사<small>W31–32</small></div><div class="g-track"><span class="g-bar audit" style="grid-column: 31 / 33;"></span></div></div>
    </div>
    <div class="s-legend"><span><i style="background:#27c4d5"></i>티벨 컨설팅 단계</span><span><i style="background:#2ea090"></i>고객 운영 기간</span><span><i style="background:#969696"></i>인증기관 일정</span><span>심사 후 보완조치(40일 이내, 연장 가능)와 인증위원회 심의를 거쳐 인증서가 발급됩니다. 기간은 조직 규모와 범위에 따라 달라집니다.</span></div>`, true) +
    sSec("cycle", ["", "인증 이후 3년", "인증 유효기간은 3년이고 매년 사후심사를 받습니다. 개편 이후에는 인증을 받는 것보다 유지하는 일이 더 어려워집니다."], `
    <div class="s-cards four s-body">
      <article class="s-card"><span class="s-ibox">${ICO.flag}</span><span class="s-num">YEAR 0</span><h3>최초 인증</h3><ul><li>GAP 분석·위험평가</li><li>정책·지침 제·개정</li><li>모의 예비심사·심사 대응</li></ul></article>
      <article class="s-card"><span class="s-ibox">${ICO.look}</span><span class="s-num">YEAR 1</span><h3>1차 사후심사</h3><ul><li>분기 내부점검</li><li>조직·시스템 변경 영향 분석</li><li>최초 심사 결함 재발 점검</li></ul></article>
      <article class="s-card"><span class="s-ibox">${ICO.loop}</span><span class="s-num">YEAR 2</span><h3>2차 사후심사</h3><ul><li>위험평가 재수행</li><li>신규 서비스 인증 범위 편입</li><li>침해사고 대응 훈련</li></ul></article>
      <article class="s-card"><span class="s-ibox">${ICO.stamp}</span><span class="s-num">YEAR 3</span><h3>갱신심사</h3><ul><li>3년치 운영 증적 정리</li><li>강화된 기준으로 재매핑</li><li>추가 인증(ISO 등) 확장</li></ul></article>
    </div>
    <div class="s-actions">
      <a class="pill" href="#security/diagnose">우리 조직 인증 일정 계산하기</a>
      <a class="pill ghost" href="#security/services" data-jump="plans">계약 방식 보기</a>
    </div>`) +
    sSec("faq", ["FAQ", "자주 묻는 질문"], `
    <div class="s-faq s-body">
      <details open><summary>ISMS-P 인증까지 얼마나 걸리나요?</summary><p>티벨 권장 일정 기준으로 착수부터 인증심사까지 약 7~8개월, 심사 후 보완조치와 인증위원회 심의를 거쳐 인증서 발급까지 약 9~10개월을 잡습니다. 인증 신청 전에 관리체계를 2개월 이상 운영해야 하므로 이 기간은 줄이기 어렵습니다. ISO 27001 등 기존 인증이 있다면 증적을 다시 써서 앞 단계를 줄일 수 있습니다.</p></details>
      <details><summary>이미 인증을 받았는데, 개편에 맞춰 무엇을 준비해야 하나요?</summary><p>예비심사와 기술심사가 도입되면 문서와 실제 운영이 일치하는지가 가장 중요해집니다. 보유 인증의 핵심 통제 항목을 먼저 점검하고, 다음 사후심사 전까지 보완할 항목과 순서를 정하는 것부터 시작합니다.</p></details>
      <details><summary>ISMS-P와 ISO 27001을 함께 받을 수 있나요?</summary><p>가능합니다. 두 인증은 관리체계와 보호대책 상당 부분이 겹칩니다. 매핑표를 기준으로 하나의 위험평가와 정책 체계를 만들어 양쪽 심사에 대응합니다.</p></details>
      <details><summary>AI 서비스를 운영하는데 어떤 준비가 필요한가요?</summary><p>먼저 우리 서비스가 AI 기본법상 고영향 AI나 생성형 AI 의무 대상에 해당하는지 확인합니다. 이어서 AI 위험·영향평가 체계와 데이터 관리 기준을 마련하고, 필요하면 ISO/IEC 42001 인증까지 단계적으로 준비합니다.</p></details>
      <details><summary>주요정보통신기반시설 취약점 분석·평가도 맡길 수 있나요?</summary><p>법정 취약점 분석·평가와 개인정보 영향평가는 정부가 지정한 기관이 수행하도록 정해져 있습니다. 티벨은 그 평가를 앞두고 관리체계를 정비하거나, 평가에서 나온 지적 사항의 보호대책 수립과 이행을 지원하는 역할로 함께할 수 있습니다.</p></details>
      <details><summary>보안 전담 인력이 한 명뿐인 작은 회사도 가능한가요?</summary><p>가능합니다. 범위를 좁힌 프로젝트형으로 시작하거나, Virtual CISO 상시 자문으로 지정된 보안책임자의 판단과 경영진 보고를 지원할 수 있습니다. 정보통신망법상 CISO 지정·신고는 회사가 직접 해야 하며, 외부 자문이 이를 대신하지는 않습니다.</p></details>
    </div>`, true), [
    ["reform", "심사 개편"],
    ["certs", "지원 인증"],
    ["map", "통합 매핑"],
    ["schedule", "권장 일정"],
    ["faq", "FAQ"]
  ]);
}

const OFFICES = [
  ["강남 본사", "서울특별시 강남구 강남대로 354, 9층 (역삼동, 혜천빌딩)", "37.49470173056075", "127.02974046884096"],
  ["가산 사업장", "서울특별시 금천구 가산디지털1로 168, A동 601호 (우림라이온스밸리 A동)", "37.480764409783355", "126.88213997302407"]
];

// 찾아오시는 길: Kakao Map "지도 퍼가기" maps (made on map.kakao.com, labelled 티벨 강남 본사 / 티벨 가산 사업장).
const KAKAO_MAPS = { "강남 본사": ["1793086125333", "3ysattynnkw"], "가산 사업장": ["1793086161933", "3ysbp7wgifn"] };

// Kakao's loader adds its renderer with document.write, which does nothing once the page has loaded (pages
// here are drawn by script), so that one call is caught and turned into a normal script tag.
let kakaoMapLoad = null;
function loadKakaoMaps() {
  if (window.daum && window.daum.roughmap && window.daum.roughmap.Lander) return Promise.resolve();
  if (!kakaoMapLoad) kakaoMapLoad = new Promise((resolve, reject) => {
    const write = document.write;
    document.write = (html) => {
      const src = /src="([^"]+)"/.exec(html);
      if (!src) return;
      document.write = write;
      const lander = document.createElement("script");
      lander.charset = "UTF-8";
      lander.src = src[1];
      lander.onload = resolve;
      lander.onerror = reject;
      document.head.appendChild(lander);
    };
    const loader = document.createElement("script");
    loader.charset = "UTF-8";
    loader.src = "https://t1.kakaocdn.net/kakaomapweb/roughmap/loader/prod/roughmapLoader.js";
    loader.onerror = () => { document.write = write; reject(); };
    document.head.appendChild(loader);
  });
  return kakaoMapLoad;
}

function wireKakaoMaps() {
  const boxes = [...document.querySelectorAll("[data-kakao-map]")];
  if (!boxes.length) return;
  loadKakaoMaps().then(() => boxes.forEach((box) => {
    if (!box.isConnected || box.childElementCount) return;
    const [timestamp, key] = box.dataset.kakaoMap.split(":");
    const width = Math.round(box.clientWidth);
    new window.daum.roughmap.Lander({ timestamp, key, mapWidth: String(width), mapHeight: String(Math.round(width * 0.62)) }).render();
  })).catch(() => {});
}

function aboutBody() {
  const cards = OFFICES.map(([name, address, lat, lng]) => `
    <article>
      <div class="way-map root_daum_roughmap root_daum_roughmap_landing" id="daumRoughmapContainer${KAKAO_MAPS[name][0]}" data-kakao-map="${KAKAO_MAPS[name].join(":")}" aria-label="${name} 지도"></div>
      <h3>${name}</h3>
      <p>${address}</p>
      <a href="https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}" target="_blank" rel="noopener noreferrer">지도 보기</a>
    </article>`).join("");
  return `
    ${qpAboutIntro()}
    <div class="way"><h2>찾아오시는 길</h2><div class="way-grid">${cards}</div></div>`;
}

function recruitBody() {
  return `
    ${qpRecruitIntro()}
    <div class="apply">
      <a class="ghost" href="https://www.saramin.co.kr/zf_user/company-info/view-inner-recruit?csn=K255bFRkQk0ySjZLTVhjVXVqVThIdz09" target="_blank" rel="noopener noreferrer">사람인 지원하기</a>
      <a class="fill" href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/tbellhr?ChkDispType=1" target="_blank" rel="noopener noreferrer">잡코리아 지원하기</a>
    </div>`;
}

function ethicalBody() {
  return `
    ${shot({ pc: "content-ethical.499a3e6c3c4e30f5294c.png", tablet: "content-tablet-ethical.1ee5a7b40bf4c1b4e6d5.png", mobile: "content-mobile-ethical.34213ea9c12006b11ef3.png" })}
    <div class="apply"><a class="fill" href="https://www.tbell.co.kr/files/${encodeURIComponent("윤리경영정책.pdf")}" target="_blank" rel="noopener noreferrer">PDF 다운로드</a></div>`;
}

const ABOUT_SLIDES = [
  { id: "about", title: "기업 정보", desc: "", tags: [], bg: ["bg-info.de3329d4a93fff58c0c9.png", "bg-tablet-info.dfaa0c39c60c825ecbb2.png", "bg-mobile-info.92d953b0346cc509e852.png"], body: aboutBody },
  { id: "vision", title: "경영철학", desc: "", tags: [], bg: ["bg-vision.2e2c550d96ce302bf12d.png", "bg-tablet-vision.657fdee36572fc7cefea.png", "bg-mobile-vision.5aa6cb952f2921958f37.png"], body: visionBody }
];

const RECRUIT_SLIDES = [
  { id: "benefit", title: "복리후생", desc: "", tags: [], bg: ["bg-benefit.980907dc0cae18031e40.png", "bg-tablet-benefit.e31e967d683d2abd1095.png", "bg-mobile-benefit.2a770bc2a5cd8dcfc473.png"], body: benefitBody },
  { id: "recruit", title: "Good Player, Great Work", desc: "티벨은 올바른 생각과 실천을 통해 “우수한 인재를, 일하기 좋은 기업”을 만듭니다.", tags: [], bg: ["bg-recruit.96e2ea0dae220b78e221.png", "bg-tablet-recruit.95364057a4fd3ee61e20.png", "bg-mobile-recruit.89efb893fcee0ae88828.png"], body: recruitBody }
];

// 지속가능경영 opens on the origin's overview slide; like the origin it is not one of the 윤리 · 사회 · 환경 tabs.
// The origin draws it as one long image. Here every block is markup with the origin's own wording, except the
// signed E / S / G statement, which stays the origin's image (cut per screen size).
const MG_GOALS = [
  ["E", "nvironmental", "친환경 ICT 기업 도약", ["환경 경영 추진체계 구축", "친환경 인식강화 교육", "에너지 절약 실천", "친환경 제품 도입"]],
  ["S", "ocial", "위기대응 및 인재육성 강화", ["위기대응 TF(중대재해/정보보안)", "인재육성 프로그램 강화", "인권경영 강화", "사회공헌 확대"]],
  ["G", "overnance", "윤리경영 강화, 투명경영 추진", ["윤리정책 국제가이드 준수", "ESG 정보공개 단계적 추진"]]
];
const MG_ROLES = [
  ["ESG TF", ["ESG 전략/정책 수립", "ESG 규정 제정", "ESG 중장기 로드맵", "활동과제 설정"]],
  ["위기대응 TF", ["정보보안 대응체계 구축", "안전보건(중대재해) 대응체계 구축", "위기대응 체계 실행"]],
  ["경영지원팀", ["ESG 활동과제 모니터링 및 관리"]],
  ["ESG 위원회", ["ESG Agenda 논의", "ESG 성과 및 개선점 논의"]]
];

function managementBody() {
  const node = (label, cls = "") => `<span class="mg-node${cls ? " " + cls : ""}">${label}</span>`;
  const goals = MG_GOALS.map(([cap, rest, aim, items]) => `
      <div class="mg-goal">
        <p class="mg-letter"><b>${cap}</b>${rest}</p>
        <h3>${aim}</h3>
        <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>`).join("");
  const roles = MG_ROLES.map(([name, items]) => `<article><h3>${name}</h3><p>${items.join("<br>")}</p></article>`).join("");
  return `
    ${qpSec("CEO MESSAGE", "<p>티벨 이해 관계자 여러분. 티벨은 기후 변화, 중대 재해, 경제 위기 등 새로운 경영 환경에 대응하고, 기업의 지속가능한 성장을 위해<br class='qp-br'> ESG 경영을 추진하며, 기업의 사회적 책임(CSR)을 다하기 위해 노력할 것입니다. 법과 국제 가이드 라인에 기반한 ESG 경영전략 수립과<br class='qp-br'> 추진 체계를 구축하고, ESG Agenda를 발굴하고 논의하여 실천할 수 있도록 추진해 나가겠습니다.</p>")}
    <picture class="mg-pledge">
      <source media="(max-width: 500px)" srcset="${QA}photos/esg-pledge-mobile.jpg">
      <source media="(max-width: 1023px)" srcset="${QA}photos/esg-pledge-tablet.jpg">
      <img src="${QA}photos/esg-pledge.jpg" alt="Environmental · Social · Governance 경영 방향과 티벨 대표이사 김종균 서명" loading="lazy">
    </picture>
    ${qpSec("지향점", "", `<p class="mg-mark" role="img" aria-label="PLUS ESG"><span>PLUS</span> <b>ESG<img src="${QA}photos/esg-leaf.png" alt=""></b></p><p class="mg-mark-sub">전문성과 신뢰를 바탕으로 지속 가능한 성장</p>`)}
    <section class="mg-goals" data-qp-reveal style="background-image:url('${ORIGIN}bg-management.7c040906499d5d3883e5.png')">
      <h2 class="qp-h">목표 &amp; 주요과제</h2>
      <div class="mg-goal-row">${goals}</div>
    </section>
    ${qpSec("ESG 추진체계", "<p>티벨은 ESG TF를 조직하여 ESG 경영 전략을 수립하고, 위기대응 TF 중심으로 정보 보안과 중대 재해 대응 체계를 구축하겠습니다.<br class='qp-br'> 향후 ESG 위원회를 중심으로 ESG 모든 활동을 총괄하여 관리하는 추진 체계 구축을 목표로 합니다.</p>")}
    ${qpSec("조직도", "", `
      <ul class="mg-org" aria-label="ESG 조직도">
        <li>${node("대표이사", "is-top")}
          <ul>
            <li>${node("ESG 위원회", "is-mid")}</li>
            <li>${node("ESG TF", "is-mid")}<ul><li>${node("경영지원팀")}</li></ul></li>
            <li>${node("위기대응 TF", "is-mid")}<ul><li>${node("STE 1-2실")}</li><li>${node("개발연구소")}</li><li>${node("경영지원팀")}</li></ul></li>
          </ul>
        </li>
      </ul>`)}
    <section class="mg-system" data-qp-reveal style="background-image:url('${QA}photos/esg-paper.jpg')">
      <h2 class="qp-h">추진체계</h2>
      <div class="mg-roles">${roles}</div>
    </section>`;
}

const ESG_SLIDES = [
  { id: "esg", title: "지속가능 경영", desc: "", tags: [], bg: ["bg-management.7c040906499d5d3883e5.png", "bg-tablet-management.29e5be4deabe819673cb.png", "bg-mobile-management.2a770bc2a5cd8dcfc473.png"], body: managementBody },
  { id: "ethical", title: "윤리 경영", desc: "", tags: [], bg: ["bg-ethical.4ee79d2ecc425576aabf.png", "bg-tablet-ethical.3ee09f7000c4ffa90a44.png", "bg-mobile-ethical.6ca0468a4dffddfbd2d7.png"], body: ethicalBody },
  { id: "social", title: "사회 경영", desc: "", tags: [], bg: ["bg-social.18fa9508d7893696bec6.png", "bg-tablet-social.12a02e3c7d934095805f.png", "bg-mobile-social.e1f4c148af28514f5139.png"], body: socialBody },
  { id: "environmental", title: "환경 경영", desc: "친환경 제품 및 서비스, 에너지 소비 분야를 중심으로 친환경 ICT 기업 도약을 추진합니다.", tags: [], bg: ["bg-environ.9fef7398af46aa8d3846.png", "bg-tablet-environmental.b52a1a9ba527c8536088.png", "bg-mobile-environmental.890cbb7f7a60a4853a15.png"], body: envBody }
];
const INQUIRY = {
  qa: {
    title: "QA 서비스 상담",
    lede: "범위와 일정을 알려 주시면 진행 방식을 제안해 드립니다.",
    mail: "staff@tbell.co.kr",
    topics: ["아웃소싱 테스트", "테스트 자동화", "블랙박스", "화이트박스", "API", "성능", "TestOps", "T-AUTO", "T-LENS"],
    extra: ""
  },
  security: {
    kicker: "Contact",
    title: "보안 컨설팅 상담",
    lede: "진단 결과나 목표 일정을 알려 주시면 계획으로 답합니다.",
    mail: "security@tbell.co.kr",
    topics: ["ISMS·ISMS-P", "ISO 27001 계열", "개인정보 보호", "마스터플랜·제로트러스트", "AI 거버넌스", "Virtual CISO 자문"],
    messageLabel: "현재 상황과 목표 일정",
    placeholder: "예) ISMS 보유 중, 2027년 ISMS-P 전환 필요. 내년 상반기 심사 목표",
    agree: "상담을 위한 개인정보(이름, 회사명, 이메일, 연락처) 수집·이용에 동의합니다. 상담 종료 후 파기합니다.",
    button: "상담 신청",
    extra: `<p class="import-note" id="import-note" hidden>셀프 진단 결과가 문의 내용에 들어가 있습니다. 이름과 연락처만 더해 주세요.</p>
    <details class="survey">
      <summary><span class="kicker">사전 조사<small>선택</small></span><span class="survey-toggle" aria-hidden="true"></span></summary>
      <p class="survey-note">대략적인 수량이면 충분합니다. 컨설팅 범위와 기간을 정하는 데 씁니다.</p>
      <div class="survey-counts">
        ${[["server", "서버", "대", "40"], ["db", "DBMS", "개", "6"], ["net", "네트워크·보안장비", "대", "15"], ["apps", "웹·앱 서비스", "개", "3"], ["staff", "임직원", "명", "120"]]
          .map(([name, label, unit, eg]) => `<label><span>${label}</span><span class="unit"><input name="${name}" type="number" min="0" inputmode="numeric" placeholder="${eg}"><em>${unit}</em></span></label>`).join("")}
      </div>
      <div class="survey-selects">
        <label><span>개인정보 보유 규모</span>
          <select name="pii"><option value="">선택</option><option>보유하지 않음</option><option>1만 명 미만</option><option>1만~100만 명 미만</option><option>100만 명 이상</option></select>
        </label>
        <label><span>클라우드 이용</span>
          <select name="cloud"><option value="">선택</option><option>사용 안 함 (자체 전산실·IDC)</option><option>퍼블릭 클라우드 (AWS·Azure·GCP·NCP 등)</option><option>하이브리드 (자체 + 클라우드)</option><option>SaaS 위주</option></select>
        </label>
      </div>
    </details>`
  }
};

// 문의: a short title and one line, the contacts as label / value rows, then the form in three numbered
// steps (관심 분야 · 담당자 정보 · 문의 내용) — underline fields and one bordered message box, no panels.
// Field names and ids are what the submit handler and the self-diagnosis hand-off (fillConsult) read.
const INQ_ICON = {
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
const INQ_LINKS = {
  qa: [["테스트 서비스", "#qa/service/outsourcing"], ["T 솔루션", "#qa/solution"]],
  security: [["2분 셀프 진단", "#security/diagnose"], ["인증 안내", "#security/cert"]]
};

function inquiryPage(mode) {
  const spec = INQUIRY[mode];
  const chips = spec.topics.map((topic) => `<label class="chip"><input type="checkbox" name="topic" value="${topic}"><span>${topic}</span></label>`).join("");
  const field = (name, label, attrs, required) => `<label class="iq-field"><span>${label}${required ? "<i>*</i>" : ""}</span><input name="${name}" ${attrs}${required ? " required" : ""}></label>`;
  const step = (n, label, note = "") => `<p class="iq-step"><b>${n}</b>${label}${note ? `<small>${note}</small>` : ""}</p>`;
  const links = INQ_LINKS[mode].map(([label, href]) => `<a href="${href}">${label}${INQ_ICON.arrow}</a>`).join("");
  return `<section class="detail inq-page"><div class="sheet">
    <div class="iq">
      <aside class="iq-intro">
        <h1>${spec.title}</h1>
        <p class="iq-lede">${spec.lede}</p>
        <ul class="iq-contact">
          <li>${INQ_ICON.mail}<span>${spec.mail}</span></li>
          <li>${INQ_ICON.phone}<span>070-7777-9113 / 070-7777-6368<small>월–금 09:30–18:00 · 점심 12:00–13:00</small></span></li>
          <li>${INQ_ICON.pin}<span>서울특별시 강남구 강남대로 354, 9층</span></li>
        </ul>
        <nav class="iq-links" aria-label="함께 보기">${links}</nav>
      </aside>
      <form class="form iq-form" id="inquiry-form">
        <fieldset class="chips iq-chips"><legend>${step("01", "관심 분야", "복수 선택")}</legend>${chips}</fieldset>
        ${step("02", "담당자 정보")}
        <div class="iq-row">
          ${field("name", "이름", 'autocomplete="name" placeholder="담당자 이름"', true)}
          ${field("company", "회사명", 'autocomplete="organization" placeholder="회사 또는 기관명"', true)}
          ${field("email", "이메일", 'type="email" autocomplete="email" placeholder="name@company.com"', true)}
          ${field("phone", "연락처", 'type="tel" autocomplete="tel" placeholder="010-0000-0000"', false)}
        </div>
        ${spec.extra}
        <label class="iq-msg">${step("03", spec.messageLabel || "문의 내용")}<textarea name="message" required placeholder="${spec.placeholder || "대상 서비스, 일정, 현재 상황을 적어 주세요."}"></textarea></label>
        <div class="iq-send">
          <label class="agree"><input type="checkbox" name="agree" required><span>${spec.agree || "문의 회신을 위한 개인정보(이름, 회사명, 이메일, 연락처) 수집·이용에 동의합니다."}</span></label>
          <button class="iq-submit" type="submit">${spec.button || "문의 보내기"}</button>
        </div>
      </form>
    </div>
    <div class="result" id="inquiry-result" hidden></div>
  </div></section>`;
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function plain(text) {
  const named = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', "#x27": "'", "#39": "'" };
  return String(text)
    .replace(/&(#x27|#39|nbsp|amp|lt|gt|quot);/g, (all, key) => named[key] || all)
    .replace(/\s+/g, " ")
    .trim();
}

// Naver 썸네일 CDN은 ?type= 크기 지정이 없으면 404를 돌려준다.
function blogThumb(url) {
  return /[?&]type=/.test(url) ? url : url + (url.includes("?") ? "&" : "?") + "type=w773";
}

function blogPostsFor(cat) {
  const nos = new Set(cat.children && cat.children.length ? cat.children.flatMap((kid) => kid.nos) : cat.nos);
  return (typeof BLOG_POSTS === "undefined" ? [] : BLOG_POSTS).filter((post) => nos.has(post.categoryNo));
}

function blogList(mode, child) {
  const allowed = blogNodes(mode);
  const { group, leaf } = blogLocate(mode, child);
  const seen = new Set();
  const posts = [];
  (leaf || group ? [leaf || group] : allowed).forEach((cat) => {
    blogPostsFor(cat).forEach((post) => {
      if (seen.has(post.logNo)) return;
      seen.add(post.logNo);
      posts.push(post);
    });
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.logNo - a.logNo));
  const size = 6;
  const pages = Math.max(1, Math.ceil(posts.length / size) || 1);
  let pageNo = Number(parse().page) || 1;
  if (pageNo < 1) pageNo = 1;
  if (pageNo > pages) pageNo = pages;
  const slice = posts.slice((pageNo - 1) * size, pageNo * size);
  const hrefFor = (id, n) => {
    const base = hashBase(mode) + "blog" + (id ? "/" + id : "");
    return n > 1 ? base + "/" + n : base;
  };
  const chip = (id, name, on) => `<a href="${hrefFor(id, 1)}"${on ? ' aria-current="page"' : ""}>${name}</a>`;
  const parents = chip("", "전체", !group) + allowed.map((cat) => chip(cat.id, cat.name, group && cat.id === group.id)).join("");
  const kids = group && group.children
    ? chip(group.id, "전체", !leaf) + group.children.map((cat) => chip(cat.id, cat.name, leaf && leaf.id === cat.id)).join("")
    : "";
  const filterId = leaf ? leaf.id : group ? group.id : "";
  const cards = slice.map((post) => {
    const img = post.thumb ? `<img src="${esc(blogThumb(post.thumb))}" alt="" loading="lazy">` : "";
    const text = plain(post.excerpt);
    const cut = text.length > 36 ? text.slice(0, 36).trim() + "…" : text;
    return `<a class="blog-card" href="${esc(post.url)}" target="_blank" rel="noopener noreferrer">${img}<span class="en">${esc(post.date)} · ${esc(post.category)}</span><h3>${esc(plain(post.title))}</h3><p>${esc(cut)}</p></a>`;
  }).join("");
  const nums = [];
  for (let n = 1; n <= pages; n++) nums.push(`<a href="${hrefFor(filterId, n)}"${n === pageNo ? ' aria-current="page"' : ""}>${n}</a>`);
  const title = !group ? (mode === "all" ? "블로그" : MODE_LABEL[mode] + " 블로그") : leaf ? group.name + " · " + leaf.name : group.name;
  const body = `<div class="blog-level"><span>상위</span><div class="blog-filters">${parents}</div></div>`
    + (kids ? `<div class="blog-level"><span>하위</span><div class="blog-filters">${kids}</div></div>` : "")
    + (cards ? `<div class="blog-grid">${cards}</div>` : `<p class="note">이 분류의 공개 글이 없습니다.</p>`)
    + (pages > 1 ? `<nav class="pager" aria-label="블로그 페이지">${nums.join("")}</nav>` : "");
  return page("Blog", title, "", body);
}

function histLine(line) {
  return esc(String(line).replace(/\\n\\t/g, " ").replace(/\s+/g, " ").trim());
}

function companyHistory(leaves) {
  const groups = typeof HISTORY === "undefined" ? [] : HISTORY;
  const years = groups.map((group, index) => `<button type="button" data-year-index="${index}"${index === 0 ? ' class="is-on"' : ""}>${group.year}</button>`).join("");
  const big = groups.map((group, index) => `<p class="hist-big${index === 0 ? " is-on" : ""}">${group.year}</p>`).join("");
  const blocks = groups.map((group, index) => {
    const items = group.items.map((item) => {
      const lines = item.desc.map((line) => `<p>${histLine(line)}</p>`).join("");
      return `<article><h3>${esc(item.title)}</h3>${lines}</article>`;
    }).join("");
    return `<section class="hist-group${index === 0 ? " is-on" : ""}" id="year${index}" data-index="${index}">${items}</section>`;
  }).join("");
  const stacked = groups.map((group, index) => {
    const items = group.items.map((item) => {
      const lines = item.desc.map((line) => `<p>${histLine(line)}</p>`).join("");
      return `<article><h3>${esc(item.title)}</h3><div class="rule"></div>${lines}</article>`;
    }).join("");
    return `<section class="hist-stack-year${index === 0 ? " is-on" : ""}" data-index="${index}"><p class="hist-stack-num">${group.year}</p>${items}</section>`;
  }).join("");
  const arrow = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M15.4 4.6 14 3.2 6.2 11l7.8 7.8 1.4-1.4L9 11z"/></svg>`;
  return `<section class="detail svc-page hist">
    ${leafNav(leaves, "history")}
    <h1>연혁</h1>
    <div class="hist-bar">
      <button type="button" class="hist-arrow" data-year-step="-1" aria-label="이전 연도">${arrow}</button>
      <div class="hist-years"><div class="hist-year-row">${years}</div></div>
      <button type="button" class="hist-arrow hist-arrow-next" data-year-step="1" aria-label="다음 연도">${arrow}</button>
    </div>
    <div class="hist-split">
      <div class="hist-rail" aria-hidden="true"><div class="hist-rail-track">${big}</div></div>
      <div class="hist-data"><div class="hist-pad"></div>${blocks}<div class="hist-pad"></div></div>
    </div>
    <div class="hist-stack">${stacked}</div>
  </section>`;
}

function companyLeaves(mode, child) {
  const parent = activeChild("company", child);
  const item = COMPANY_MENU(mode).children.find((entry) => entry.id === parent);
  return item && item.children ? item.children : null;
}

function drawCompany(child, mode) {
  const base = hashBase(mode) + "company/";
  const leaves = companyLeaves(mode, child);
  if (child === "history") return companyHistory(leaves);
  if (child === "recruit" || child === "benefit") return qaDeck(RECRUIT_SLIDES, child === "benefit" ? "benefit" : "recruit", base, leaves);
  if (child === "esg" || child === "social" || child === "environmental" || child === "ethical") {
    const id = ["ethical", "social", "environmental"].includes(child) ? child : "esg";
    return qaDeck(ESG_SLIDES, id, base, leaves);
  }
  return qaDeck(ABOUT_SLIDES, child === "vision" ? "vision" : "about", base, leaves);
}

const DRAW = {
  qa: {
    "": qaHome,
    service: (child, mode, page) => serviceDeck(child, page),
    solution: (child) => tDeck(child),
    blog: (child, mode) => blogList(mode, child),
    inquiry: () => inquiryPage("qa"),
    company: drawCompany
  },
  security: {
    "": () => securityPage("home"),
    diagnose: () => securityPage("diagnose"),
    services: () => securityPage("services"),
    cert: () => securityPage("cert"),
    blog: (child, mode) => blogList(mode, child),
    inquiry: () => securityPage("contact"),
    company: drawCompany
  },
  all: {
    "": () => blogList("all", ""),
    blog: (child) => blogList("all", child),
    company: drawCompany,
    inquiry: (child) => multiInquiry(child)
  }
};

// 문의: a QA | 보안 switch above the same inquiry pages as #qa/inquiry and #security/inquiry.
const inquiryMode = (child) => (child === "security" ? "security" : "qa");
function multiInquiry(child) {
  const which = inquiryMode(child);
  const tab = (id, label) => `<a href="#inquiry/${id}"${id === which ? ' aria-current="page"' : ""}>${label}</a>`;
  const body = which === "security" ? securityPage("contact") : inquiryPage(which);
  return `<nav class="s-subnav inq-switch" aria-label="문의 분야"><div class="s-wrap">${tab("qa", "QA 문의")}${tab("security", "보안 문의")}</div></nav>${body}`;
}

// Header: QA and 보안 each open their own menu; 블로그 holds both areas' posts; 회사소개 is shared.
// KOLAS (the /re-menu draft only, for now): two static pages beside the shell, and T-ASSI's own site in a new tab.
const KOLAS_GROUP = {
  id: "kolas", label: "KOLAS", href: "kolas/report/",
  children: [
    { id: "report", label: "시험성적서", href: "kolas/report/" },
    { id: "cert", label: "일반 인증서", href: "kolas/cert/" },
    { id: "tassi", label: "T-ASSI", href: "https://t-assi.co.kr/", external: true }
  ]
};
const MENU = [
  { id: "qa", label: "QA", href: "#qa", groups: [{ id: "", label: "사업 소개", href: "#qa" }, ...QA_GROUPS, ...(HASH_ROUTES ? [KOLAS_GROUP] : [])] },
  { id: "security", label: "보안", href: "#security", groups: [
    { id: "", label: "사업 소개", href: "#security" },
    { id: "diagnose", label: "사전 진단", href: "#security/diagnose" },
    { id: "services", label: "컨설팅", href: "#security/services" },
    { id: "cert", label: "인증", href: "#security/cert" }
  ] },
  blogMenu("all"),
  COMPANY_MENU("all")
];

function menuTop(mode, group) {
  return mode === "qa" || mode === "security" ? mode : group;
}

function fillDrop(mode, group, child) {
  const sub = activeChild(group, child);
  const arrow = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`;
  const link = (href, label, on, cls = "") => `<a href="${href}"${cls ? ` class="${cls}"` : ""}${on ? ' aria-current="page"' : ""}>${label}</a>`;
  // QA · 보안: the area (eyebrow, name, 사업 소개 link) on the left, its menu on the right.
  const EYEBROW = { qa: "SOFTWARE TEST &amp; QUALITY", security: "TBELL 정보보호 컨설팅" };
  const NAME = { qa: "QA", security: "보안 컨설팅" };
  const area = (sec) => {
    const here = mode === sec.id;
    const groups = sec.groups.filter((g) => g.id);
    const nested = groups.some((g) => g.children);
    const body = nested
      ? `<div class="md-groups">${groups.map((g) => `
          <div class="md-group">
            ${link(g.href, g.label, here && (g.children || []).some((k) => isHere(k.href)), "md-gtitle")}
            ${(g.children || []).map((k) => k.external
              ? `<a class="md-leaf" href="${k.href}" target="_blank" rel="noopener noreferrer">${k.label}</a>`
              : link(k.href, k.label, here && isHere(k.href), "md-leaf")).join("")}
          </div>`).join("")}</div>`
      : `<div class="md-rows">${groups.map((g) => link(g.href, `<span>${g.label}</span>${arrow}`, here && group === g.id, "md-row")).join("")}</div>`;
    return `
    <section class="md-sec md-solo md-${sec.id}${here ? " is-here" : ""}" aria-label="${NAME[sec.id]}">
      <header class="md-sec-head">
        <p class="md-eyebrow">${EYEBROW[sec.id]}</p>
        <div class="md-title"><b>${NAME[sec.id]}</b>${link(sec.href, `사업 소개${arrow}`, here && !group, "md-home")}</div>
      </header>
      ${body}
    </section>`;
  };
  const plainCol = (item) => item.children.every((g) => !g.children)
    ? `<div class="md-rows md-flat">${item.children.map((g) => link(g.href, `<span>${g.label}</span>${arrow}`, mode === "all" && group === item.id && activeChild(group, child) === g.id, "md-row")).join("")}</div>`
    : `<div class="md-groups md-plain">${item.children.map((g) => `
    <div class="md-group">
      ${link(g.href, g.label, mode === "all" && group === item.id && activeChild(group, child) === g.id, "md-gtitle")}
      ${(g.children || []).map((k) => link(k.href, k.label, mode === "all" && group === item.id && (child || "about") === k.id, "md-leaf")).join("")}
    </div>`).join("")}</div>`;
  const cols = [
    `<div class="drop-col md-panel" data-id="qa">${area(MENU[0])}</div>`,
    `<div class="drop-col md-panel" data-id="security">${area(MENU[1])}</div>`,
    `<div class="drop-col md-panel" data-id="blog">${plainCol(MENU[2])}</div>`,
    `<div class="drop-col md-panel" data-id="company">${plainCol(MENU[3])}</div>`
  ].join("");
  menuDrop.innerHTML = `<div class="drop-cols">${cols}</div>`;
  menuDrop.style.height = "0px";
  menuDrop.classList.remove("is-open");
}

function navHtml(mode, group, child) {
  const top = menuTop(mode, group);
  // Below 1024 (origin tablet and mobile) the menu opens from ☰ with every item's pages listed, and 문의 last.
  const mobile = window.matchMedia("(max-width: 1023px)").matches;
  const inquiry = mobile ? `<a class="nav-inquiry" href="#inquiry/${mode === "security" ? "security" : "qa"}">문의</a>` : "";
  return MENU.map((item) => {
    const head = `<a href="${item.href}" data-id="${item.id}"${item.id === top ? ' aria-current="page"' : ""}>${item.label}</a>`;
    if (!mobile) return head;
    const kids = item.groups
      ? item.groups.map((g) => `<a href="${g.href}"${mode === item.id && group === g.id ? ' aria-current="page"' : ""}>${g.label}</a>`).join("")
      : item.children.map((g) => `<a href="${g.href}"${item.id === group && activeChild(group, child) === g.id ? ' aria-current="page"' : ""}>${g.label}</a>`).join("");
    return head + `<div class="nav-sub">${kids}</div>`;
  }).join("") + inquiry;
}

function activeChild(group, child) {
  if (group === "service") return child || "outsourcing";
  if (group === "solution") return child || "overview";
  if (group === "blog") {
    const located = blogLocate(parse().mode, child);
    return located.group ? located.group.id : "";
  }
  if (group !== "company") return child || "";
  if (!child || child === "about" || child === "vision" || child === "history") return "about";
  if (child === "benefit" || child === "recruit") return "recruit";
  if (child === "esg" || child === "ethical" || child === "social" || child === "environmental") return "esg";
  return child;
}

function menuFitHeight() {
  return Math.min(menuDrop.querySelector(".drop-cols").offsetHeight, Math.max(0, window.innerHeight - header.offsetHeight));
}

function openMenu(id) {
  if (window.matchMedia("(max-width: 1023px)").matches) return;
  // One panel per item: entering the nav bar (or a gap in it) must not open an empty sheet.
  if (!id) return;
  const opening = !menuDrop.classList.contains("is-open");
  menuDrop.classList.add("is-open");
  menuDrop.querySelectorAll(".drop-col").forEach((col) => col.classList.toggle("is-hover", col.dataset.id === id));
  if (opening) menuDrop.style.height = "0px";
  const next = menuFitHeight() + "px";
  if (opening) requestAnimationFrame(() => { menuDrop.style.height = next; });
  else menuDrop.style.height = next;
}

function closeMenu() {
  menuDrop.style.height = "0px";
  menuDrop.classList.remove("is-open");
  menuDrop.querySelectorAll(".drop-col").forEach((col) => col.classList.remove("is-hover"));
}

function wireHistory() {
  const root = document.querySelector(".hist");
  if (!root) return;
  const buttons = [...root.querySelectorAll("[data-year-index]")];
  const groups = [...root.querySelectorAll(".hist-group")];
  const bigs = [...root.querySelectorAll(".hist-big")];
  const stacks = [...root.querySelectorAll(".hist-stack-year")];
  const data = root.querySelector(".hist-data");
  const stack = root.querySelector(".hist-stack");
  const years = root.querySelector(".hist-years");
  const rail = root.querySelector(".hist-rail-track");
  const narrow = window.matchMedia("(max-width: 1024px)");
  let index = 0;
  let lock = false;
  let lockTimer = 0;

  function scrollIn(scroller, el) {
    if (!scroller || !el) return;
    scroller.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  }

  function apply(next, shouldScroll) {
    if (next < 0 || next >= buttons.length) return;
    index = next;
    buttons.forEach((button, i) => button.classList.toggle("is-on", i === index));
    bigs.forEach((el, i) => el.classList.toggle("is-on", i === index));
    groups.forEach((el, i) => el.classList.toggle("is-on", i === index));
    stacks.forEach((el, i) => el.classList.toggle("is-on", i === index));
    const button = buttons[index];
    if (years && button) {
      const left = button.offsetLeft - (years.clientWidth - button.clientWidth) / 2;
      years.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
    if (rail && bigs[0]) {
      rail.style.transform = `translateY(${(1 - index) * bigs[0].offsetHeight}px)`;
    }
    if (!shouldScroll) return;
    lock = true;
    window.clearTimeout(lockTimer);
    if (narrow.matches) scrollIn(stack, stacks[index]);
    else scrollIn(data, groups[index]);
    lockTimer = window.setTimeout(() => { lock = false; }, 700);
  }

  buttons.forEach((button, i) => button.addEventListener("click", () => apply(i, true)));
  root.querySelectorAll("[data-year-step]").forEach((button) => {
    button.addEventListener("click", () => apply(index + Number(button.dataset.yearStep), true));
  });

  if ("IntersectionObserver" in window) {
    const watch = (scroller, items) => {
      if (!scroller) return;
      const observer = new IntersectionObserver((entries) => {
        if (lock || scroller.offsetParent === null) return;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const next = Number(entry.target.dataset.index);
          if (!Number.isNaN(next) && next !== index) apply(next, false);
        });
      }, { root: scroller, rootMargin: "-10% 0px -80% 0px", threshold: 0 });
      items.forEach((el) => observer.observe(el));
    };
    watch(data, groups);
    watch(stack, stacks);
  }

  apply(0, false);
  if (window.__histResize) window.removeEventListener("resize", window.__histResize);
  window.__histResize = () => apply(index, true);
  window.addEventListener("resize", window.__histResize);
}

function wireJump() {
  document.querySelectorAll("[data-jump]").forEach((el) => {
    el.addEventListener("click", (event) => {
      const id = el.dataset.jump;
      if (el.tagName === "BUTTON") {
        event.preventDefault();
        el.parentElement.querySelectorAll("button").forEach((btn) => btn.classList.toggle("is-on", btn === el));
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const href = el.getAttribute("href") || "";
      if (href && !isHere(el.dataset.route || href)) {
        sessionStorage.setItem("tbell-jump", id);
        return;
      }
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function fillConsult() {
  const form = document.getElementById("inquiry-form");
  const route = parse();
  const security = route.mode === "security" || (route.mode === "all" && route.group === "inquiry" && route.child === "security");
  if (!form || !security) return;
  let data = null;
  try {
    const raw = sessionStorage.getItem("tbell-consult-v01");
    if (raw) data = JSON.parse(raw);
  } catch (err) { data = null; }
  if (!data) return;
  if (data.message && !form.elements.message.value) form.elements.message.value = data.message;
  if (data.pii && form.elements.pii && !form.elements.pii.value) form.elements.pii.value = "100만 명 이상";
  (data.topics || []).forEach((value) => {
    const box = form.querySelector(`input[name="topic"][value="${value}"]`);
    if (box) box.checked = true;
  });
  const note = document.getElementById("import-note");
  if (note && data.message) note.hidden = false;
}

// Ported from security_demo/assets/site.js (diagnose + planner) as is: same rules, copy and markup.
// Only the consultation hand-off differs, because the inquiry form here is #security/inquiry.
function wireDiagnose() {
  const navi = document.getElementById("navi-form");
  if (!navi) return;
  const $ = (id) => document.getElementById(id);
  const on = (id) => !!($(id) && $(id).checked);
  const BADGE = { must: ["b-must", "의무"], soon: ["b-soon", "예정"], check: ["b-check", "확인 필요"], rec: ["b-rec", "권장"] };
  let lastOut = [];
  let lastPlan = null;

  function diagnoseNow() {
    const sector = $("q-sector").value;
    const hasIsms = on("h-isms");
    const hasIsmsp = on("h-ismsp");
    const hasIso = on("h-iso");
    const certified = hasIsms || hasIsmsp;
    const out = [];
    lastOut = out;
    if (on("q-rev") || on("q-users") || on("q-infra")) {
      out.push(certified
        ? ["must", "ISMS 인증 유지(의무대상)", "의무대상에 해당합니다. 매년 사후심사와 3년 주기 갱신심사를 받아야 합니다."]
        : ["must", "ISMS 인증 취득(의무대상)", "정보통신망법상 의무대상으로 보입니다. 인증을 받지 않으면 3,000만 원 이하 과태료 대상입니다."]);
    } else if (sector === "medical" || sector === "univ") {
      out.push(["check", "ISMS 의무대상 여부", "연간 매출액 또는 세입 1,500억 원 이상인 상급종합병원·재학생 1만 명 이상 대학은 의무대상입니다."]);
    }
    if (on("q-pii")) {
      out.push(hasIsmsp
        ? ["soon", "ISMS-P 강화 기준 대비", "2027년 등급제·예비심사·기술심사가 적용됩니다. 다음 심사 전에 핵심 통제 점검이 필요합니다."]
        : ["soon", "ISMS-P 의무화 대상 가능성 (2027.07 예정)", "중요 개인정보처리자 대상 의무화가 예정되어 있습니다. 대상 기준은 고시로 확정될 예정입니다." + (hasIsms ? " 보유 중인 ISMS에 개인정보 21개 항목을 더해 전환할 수 있습니다." : "")]);
    }
    if (certified && !(on("q-pii") && hasIsmsp)) {
      out.push(["soon", "2027 인증 심사 개편 대비", "보유 인증의 다음 심사부터 예비심사·기술심사·사후관리 강화가 적용될 수 있습니다."]);
    }
    if (on("q-ai")) {
      out.push(["must", "AI 기본법 의무 검토 (2026.01.22 시행)", "생성형 AI 결과물 표시, 고영향 AI 해당 여부와 사업자 책무를 검토해야 합니다."]);
      if (on("q-global")) out.push(["rec", "ISO/IEC 42001 (AI 경영시스템)", "해외 고객에게 AI 거버넌스 수준을 증명할 수 있는 국제 인증입니다."]);
    }
    if (on("q-cloud")) {
      out.push(["must", "클라우드 보안인증(CSAP)", "공공기관이 이용하는 클라우드 서비스는 CSAP 인증이 필요합니다. 서비스 유형과 등급에 따라 요건이 다릅니다."]);
    }
    if (hasIso) {
      out.push(["check", "ISO 27001:2022 전환 여부", "2013판 인증은 2025년 10월 31일에 효력이 끝났습니다. 2022판으로 전환되었는지 확인하세요."]);
    } else if (on("q-global")) {
      out.push(["rec", "ISO/IEC 27001" + (on("q-pii") ? "·27701" : ""), "해외 고객사와 계약할 때 보안 수준 증명 자료로 가장 많이 요구됩니다." + (certified ? " 보유 인증과 매핑해 중복 작업을 줄일 수 있습니다." : "")]);
    }
    if (on("q-listed") || on("q-infra") || on("q-users") || sector === "medical") {
      out.push(["check", "정보보호 공시 의무 여부", "매출·이용자 규모와 업종에 따라 정보보호 투자·인력 현황을 매년 공시해야 할 수 있습니다."]);
    }
    if (sector === "finance") {
      out.push(["check", "전자금융 관련 규정", "전자금융거래법·전자금융감독규정에 따른 별도 보안 요구사항과 평가 대상 여부를 확인해야 합니다."]);
    }

    const list = $("r-list");
    list.textContent = "";
    if (!out.length) {
      const empty = document.createElement("li");
      empty.className = "dz-r-empty";
      empty.textContent = "선택한 조건으로는 의무 대상이 보이지 않습니다. 개인정보를 처리한다면 개인정보 보호법의 안전성 확보조치 기준은 모든 조직에 적용됩니다.";
      list.appendChild(empty);
    }
    const counts = { must: 0, soon: 0, check: 0, rec: 0 };
    out.forEach((row) => {
      counts[row[0]] += 1;
      const li = document.createElement("li");
      li.className = "dz-r-item";
      const badge = document.createElement("span");
      badge.className = "dz-r-badge " + BADGE[row[0]][0];
      badge.textContent = BADGE[row[0]][1];
      const body = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = row[1];
      const desc = document.createElement("p");
      desc.textContent = row[2];
      body.appendChild(title);
      body.appendChild(desc);
      li.appendChild(badge);
      li.appendChild(body);
      list.appendChild(li);
    });
    $("r-sum").innerHTML = out.length
      ? `의무 <b>${counts.must}</b> · 예정 <b>${counts.soon}</b> · 확인 필요 <b>${counts.check}</b> · 권장 <b>${counts.rec}</b>`
      : "";
  }

  /* Week spans mirror certification.html ISMS-P gantt; start `w` drives reverse calc. */
  const PHASES = [
    { w: -30, endW: -28, name: "착수·범위 정의", group: "prep", key: true },
    { w: -28, endW: -24, name: "현황 분석·GAP", group: "prep" },
    { w: -24, endW: -20, name: "위험평가·DoA 결정", group: "prep" },
    { w: -22, endW: -16, name: "보호대책·정책 제·개정", group: "prep" },
    { w: -18, endW: 2, name: "관리체계 운영·증적 축적", group: "ops", note: "신청 전 2개월 이상 운영" },
    { w: -18, endW: -16, name: "임직원 인증 교육", group: "ops" },
    { w: -12, endW: -9, name: "내부점검·모의심사", group: "prep" },
    { w: -9, endW: -8, name: "인증 신청", group: "prep", key: true },
    { w: -6, endW: -4, name: "인증기관 예비점검", group: "audit", note: "심사 6~8주 전" },
    { w: 0, endW: 2, name: "인증심사", group: "audit", key: true },
    { w: 10, endW: 12, name: "인증서 발급 예상", group: "audit", note: "보완조치·인증위원회 심의 후" }
  ];
  const DAY = 86400000;
  let schedRanges = [];
  const fmt = (d) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  const parseIso = (value) => {
    if (!value) return null;
    const parts = value.split("-");
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  };
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

  function buildRanges(target, today) {
    return PHASES.map((phase) => {
      const start = new Date(target.getTime() + phase.w * 7 * DAY);
      let end = addDays(new Date(target.getTime() + phase.endW * 7 * DAY), -1);
      if (end < start) end = start;
      return {
        start,
        end,
        weeks: Math.max(1, phase.endW - phase.w),
        name: phase.name,
        note: phase.note || "",
        key: !!phase.key,
        group: phase.group || "prep",
        past: end < today,
        w: phase.w,
        off: (phase.w === 0 ? "심사 주차" : (phase.w < 0 ? "심사 " + (-phase.w) + "주 전 시작" : "심사 " + phase.w + "주 후")) + (phase.note ? " · " + phase.note : "")
      };
    });
  }

  function renderSummary(target, start, today, daysLeft) {
    const host = $("plan-summary");
    host.textContent = "";
    const cards = [
      { k: "준비 시작일", v: fmt(start), s: daysLeft >= 0 ? "권장 착수일 · D-" + daysLeft : "권장 착수일이 지남", cls: daysLeft >= 0 ? "is-focus" : "is-warn" },
      { k: "목표 심사일", v: fmt(target), s: "인증심사 시작 기준", cls: "" },
      daysLeft >= 0
        ? { k: "일정 여유", v: "D-" + daysLeft, s: "권장 일정으로 충분합니다", cls: "is-ok" }
        : { k: "일정 부족", v: "약 " + Math.ceil(-daysLeft / 7) + "주", s: "단축·병행 일정이 필요합니다", cls: "is-warn" }
    ];
    if (target <= today) cards[2] = { k: "일정 상태", v: "목표일 경과", s: "다른 심사일을 선택하세요", cls: "is-warn" };
    cards.forEach((card) => {
      const art = document.createElement("article");
      art.className = "dz-metric" + (card.cls ? " " + card.cls : "");
      art.innerHTML = `<div class="k">${card.k}</div><div class="v">${card.v}</div><div class="s">${card.s}</div>`;
      host.appendChild(art);
    });
  }

  function renderGantt() {
    const host = $("sched-cal");
    host.textContent = "";
    if (!schedRanges.length) return;
    const origin = schedRanges.reduce((min, r) => r.start < min ? r.start : min, schedRanges[0].start);
    const finish = schedRanges.reduce((max, r) => r.end > max ? r.end : max, schedRanges[0].end);
    const span = Math.max(DAY, finish - origin + DAY);

    const gantt = document.createElement("div");
    gantt.className = "dz-gantt";
    gantt.setAttribute("role", "img");
    gantt.setAttribute("aria-label", "목표 심사일 기준 역산 준비 일정 간트 차트");
    const head = document.createElement("div");
    head.className = "dz-gantt-head";
    head.innerHTML = `<div class="spacer"></div>`;
    const months = document.createElement("div");
    months.className = "dz-months";
    let cursor = new Date(origin.getFullYear(), origin.getMonth(), 1);
    const endMonth = new Date(finish.getFullYear(), finish.getMonth(), 1);
    while (cursor <= endMonth) {
      const mark = document.createElement("span");
      mark.className = "dz-month";
      const pct = ((cursor - origin) / span) * 100;
      if (pct >= -2 && pct <= 102) {
        mark.style.left = Math.max(0, Math.min(100, pct)) + "%";
        mark.textContent = cursor.getFullYear() + "." + String(cursor.getMonth() + 1).padStart(2, "0");
        months.appendChild(mark);
      }
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
    head.appendChild(months);
    gantt.appendChild(head);

    schedRanges.forEach((range) => {
      const row = document.createElement("div");
      row.className = "dz-gantt-row";
      const label = document.createElement("div");
      label.className = "dz-label";
      label.innerHTML = `<strong>${range.name}</strong><span>${fmt(range.start)}</span>`;
      const track = document.createElement("div");
      track.className = "dz-track";
      const bar = document.createElement("span");
      bar.className = "dz-bar group-" + range.group + (range.past ? " is-past" : "");
      const left = ((range.start - origin) / span) * 100;
      const width = ((range.end - range.start + DAY) / span) * 100;
      bar.style.left = Math.max(0, left) + "%";
      bar.style.width = Math.max(0.8, width) + "%";
      bar.title = range.name + " · " + fmt(range.start) + " ~ " + fmt(range.end) + (range.off ? " · " + range.off : "");
      track.appendChild(bar);
      row.appendChild(label);
      row.appendChild(track);
      gantt.appendChild(row);
    });
    host.appendChild(gantt);

    const legend = document.createElement("div");
    legend.className = "dz-gantt-legend";
    legend.innerHTML =
      `<span><i class="lg-prep"></i>준비·컨설팅 단계</span>` +
      `<span><i class="lg-ops"></i>고객 운영 기간</span>` +
      `<span><i class="lg-audit"></i>인증기관 일정</span>`;
    host.appendChild(legend);
  }

  function renderStatus(target, start, today, daysLeft) {
    const verdict = $("p-verdict");
    verdict.textContent = "";
    if (target <= today) {
      verdict.className = "dz-status is-warn";
      verdict.innerHTML = `<p class="status-badge">목표일 경과</p><p class="status-msg">목표 심사일이 오늘 이전입니다. 날짜를 다시 선택해 주세요.</p>`;
      return;
    }
    if (daysLeft >= 0) {
      verdict.className = "dz-status is-ok";
      verdict.innerHTML = `<p class="status-badge">일정 가능 · D-${daysLeft}</p><p class="status-msg">권장 착수일 <b>${fmt(start)}</b>까지 착수하면 권장 일정을 유지할 수 있습니다.</p>`;
      return;
    }
    const shortWeeks = Math.ceil(-daysLeft / 7);
    let adjustFocus = "현황 분석·GAP ~ 보호대책·정책";
    if (shortWeeks <= 4) adjustFocus = "착수·범위 정의 ~ 현황 분석·GAP";
    else if (shortWeeks >= 12) adjustFocus = "착수 전 범위 축소와 앞 단계 병행";
    verdict.className = "dz-status is-warn";
    const reuse = (on("h-iso") || on("h-isms")) ? " 보유 인증 증적을 다시 쓰면 앞 준비 단계를 줄일 수 있습니다." : "";
    verdict.innerHTML =
      `<p class="status-badge">부족 약 ${shortWeeks}주</p>` +
      `<p class="status-msg">권장 착수일 <b>${fmt(start)}</b> 기준으로 일정이 부족합니다.</p>` +
      `<p class="status-adjust">우선 조정 구간: <b>${adjustFocus}</b>. 신청 전 관리체계 운영 2개월은 줄이기 어렵습니다.</p>` +
      `<details><summary>가능한 일정 조정 방안</summary>` +
      `<p>범위를 좁히거나 분석·대책 단계를 병행하는 단축 일정이 필요합니다.${reuse} 목표 심사일을 뒤로 미루면 권장 일정으로 다시 맞출 수 있습니다.</p></details>`;
  }

  function plan() {
    const value = $("p-target").value;
    const steps = $("p-steps");
    steps.textContent = "";
    $("plan-summary").textContent = "";
    $("sched-cal").textContent = "";
    $("p-verdict").textContent = "";
    const target = parseIso(value);
    if (!value || !target) {
      const verdict = $("p-verdict");
      verdict.className = "dz-status";
      verdict.textContent = "목표 심사 시작일을 선택하세요.";
      lastPlan = null;
      schedRanges = [];
      return;
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    schedRanges = buildRanges(target, today);
    schedRanges.forEach((range) => {
      const li = document.createElement("li");
      li.textContent = fmt(range.start) + " ~ " + fmt(range.end) + " " + range.name;
      steps.appendChild(li);
    });
    const start = new Date(target.getTime() - 30 * 7 * DAY);
    const daysLeft = Math.round((start - today) / DAY);
    lastPlan = { target, start, late: start < today };
    renderSummary(target, start, today, daysLeft);
    renderGantt();
    renderStatus(target, start, today, daysLeft);
  }

  navi.addEventListener("change", () => { diagnoseNow(); plan(); });
  navi.addEventListener("submit", (event) => event.preventDefault());
  $("p-target").addEventListener("change", plan);
  $("p-target").addEventListener("input", plan);
  diagnoseNow();
  plan();

  $("to-contact").addEventListener("click", () => {
    const sel = $("q-sector");
    const lines = ["[셀프 진단 결과]", "업종: " + sel.options[sel.selectedIndex].text];
    const held = [["h-isms", "ISMS"], ["h-ismsp", "ISMS-P"], ["h-iso", "ISO 27001"]].filter((pair) => on(pair[0])).map((pair) => pair[1]);
    lines.push("보유 인증: " + (held.length ? held.join(", ") : "없음"));
    lastOut.forEach((row) => lines.push(`- [${BADGE[row[0]][1]}] ${row[1]}`));
    if (lastPlan) lines.push(`목표 인증심사일: ${fmt(lastPlan.target)} / 권장 착수일: ${fmt(lastPlan.start)}${lastPlan.late ? " (권장 일정보다 늦음)" : ""}`);
    const text = lastOut.map((row) => row[1]).join(" ");
    const topics = [];
    if (/ISMS/.test(text)) topics.push("ISMS·ISMS-P");
    if (/ISO\/IEC 27001|ISO 27001/.test(text)) topics.push("ISO 27001 계열");
    if (/개인정보|ISMS-P/.test(text)) topics.push("개인정보 보호");
    if (/AI|42001/.test(text)) topics.push("AI 거버넌스");
    try {
      sessionStorage.setItem("tbell-consult-v01", JSON.stringify({ message: lines.join("\n"), pii: on("q-pii"), topics }));
    } catch (err) { /* storage unavailable */ }
    go("#security/inquiry");
  });
}

function wireDeck() {
  document.querySelectorAll(".expand-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.parentElement.querySelectorAll(".expand-card").forEach((el) => el.classList.toggle("is-open", el === card));
    });
  });
  wireHistory();
  const banner = document.querySelector(".svc-banner");
  if (!banner) return;
  let startX = 0;
  banner.addEventListener("touchstart", (event) => { startX = event.changedTouches[0].clientX; }, { passive: true });
  banner.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) < 40) return;
    const href = delta < 0 ? banner.dataset.next : banner.dataset.prev;
    if (href) go(href);
  });
}

function render() {
  const { mode, group, child, page: pageNo } = parse();
  const legacy = mode === "qa" ? legacyQaHash(group, child) : "";
  if (legacy) {
    go(legacy, true);
    return;
  }
  // One blog, one company section and one inquiry page: send the old per-area URLs there.
  if ((mode === "qa" || mode === "security") && ["blog", "company", "inquiry"].includes(group)) {
    const to = group === "inquiry" ? "#inquiry/" + mode : "#" + group + (child ? "/" + child : "") + (pageNo ? "/" + pageNo : "");
    go(to, true);
    return;
  }
  logoLink.href = "#";
  logoLink.setAttribute("aria-label", "TBELL 홈");
  logoMode.textContent = "";
  const meta = pageMeta(mode, group, child);
  document.title = meta ? meta.title : mode && mode !== "all" ? "TBELL · " + MODE_LABEL[mode] : "TBELL";
  let described = document.querySelector('meta[name="description"]');
  if (meta && !described) {
    described = document.createElement("meta");
    described.name = "description";
    document.head.append(described);
  }
  if (meta) described.content = meta.description;
  else if (described) described.remove();
  inquire.hidden = false;
  inquire.textContent = "문의";
  inquire.href = "#inquiry/" + (mode === "security" ? "security" : "qa");
  nav.innerHTML = navHtml(mode, group, child);
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  fillDrop(mode, group, child);
  if (!mode) {
    content.innerHTML = multiHome();
    wireStages();
    wireJump();
    pathLinks();
    window.scrollTo(0, 0);
    return;
  }
  drawContent(mode, group, child, pageNo);
}

const footerYear = document.getElementById("footer-year");
if (footerYear) footerYear.textContent = new Date().getFullYear();

// Home on PC (≥1024, as the origin): one wheel step glides to the next full-height section; past the last one the page scrolls on to the footer.
let homePaging = 0;
window.addEventListener("wheel", (e) => {
  const secs = document.querySelectorAll(".mh > section");
  if (!secs.length || window.innerWidth < 1024 || e.ctrlKey || !e.deltaY) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (Date.now() < homePaging) { e.preventDefault(); return; }
  const head = document.querySelector(".site-head").offsetHeight;
  const view = window.innerHeight - head;
  const tops = [...secs].map((s) => s.getBoundingClientRect().top + window.scrollY - head);
  const y = window.scrollY;
  const last = tops.length - 1;
  let i = tops.length - 1;
  while (i > 0 && tops[i] > y + 2) i--;
  const bottom = tops[i] + secs[i].offsetHeight - view;
  let to = null;
  if (e.deltaY > 0) {
    if (y < bottom - 2) return; // a section taller than the screen scrolls through first
    if (i < last) to = tops[i + 1];
  } else if (y > tops[last] + secs[last].offsetHeight - view + 2) {
    to = tops[last] + secs[last].offsetHeight - view; // from the footer, back to the last section
  } else if (y > tops[i] + 2) {
    return;
  } else if (i > 0) {
    to = tops[i - 1] + Math.max(0, secs[i - 1].offsetHeight - view);
  }
  if (to === null) return;
  e.preventDefault();
  homePaging = Date.now() + 900;
  window.scrollTo({ top: to, behavior: "smooth" });
}, { passive: false });

function drawContent(mode, group, child, pageNo) {
  const bucket = DRAW[mode];
  const draw = bucket[group] || bucket[""];
  content.innerHTML = draw.length ? draw(child, mode, pageNo) : draw();
  wireDeck();
  wireJump();
  wireSecurityDemo();
  if (typeof wireSvcMotion === "function") wireSvcMotion();
  if (typeof wireQaPages === "function") wireQaPages();
  wireQaHome();
  wireSecHome();
  fillConsult();

  const inquiry = document.getElementById("inquiry-form");
  if (inquiry) {
    inquiry.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!inquiry.reportValidity()) return;
      const data = new FormData(inquiry);
      const topics = data.getAll("topic").join(", ") || "선택 없음";
      const box = document.getElementById("inquiry-result");
      box.hidden = false;
      const formMode = mode === "all" ? inquiryMode(child) : mode;
      box.innerHTML = `<p class="kicker">${MODE_LABEL[formMode]} 문의</p><p><strong>${data.get("company")}</strong> ${data.get("name")} · ${data.get("email")}</p><p style="margin-top:8px">관심 분야: ${topics}</p><p style="margin-top:8px">${data.get("message")}</p><p class="note">프로토타입이라 메일은 전송되지 않습니다. 실제 접수는 ${INQUIRY[formMode].mail} 로 받습니다.</p>`;
      try { sessionStorage.removeItem("tbell-consult-v01"); } catch (err) { /* ignore */ }
    });
  }
  wireStages();
  wireKakaoMaps();
  pathLinks();
  const jump = sessionStorage.getItem("tbell-jump");
  window.scrollTo(0, 0);
  if (jump) {
    sessionStorage.removeItem("tbell-jump");
    document.getElementById(jump)?.scrollIntoView({ block: "start" });
  }
}

let stageObserver = null;
function wireStages() {
  if (stageObserver) stageObserver.disconnect();
  stageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("play");
      entry.target.querySelectorAll(".count").forEach((el) => {
        const target = Number(el.dataset.count);
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / 1200);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ko-KR");
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      stageObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-count-zone]").forEach((el) => stageObserver.observe(el));
}

nav.addEventListener("mouseenter", () => openMenu(""));
nav.addEventListener("mouseover", (event) => {
  const link = event.target.closest("a[data-id]");
  if (link) openMenu(link.dataset.id);
});
nav.addEventListener("focusin", (event) => {
  const link = event.target.closest("a[data-id]");
  if (link) openMenu(link.dataset.id);
});
logoLink.addEventListener("mouseenter", closeMenu);
tools.addEventListener("mouseenter", closeMenu);
menuDrop.addEventListener("mouseenter", () => openMenu(menuDrop.querySelector(".drop-col.is-hover")?.dataset.id || ""));
header.addEventListener("mouseleave", closeMenu);
window.addEventListener("resize", () => {
  if (menuDrop.classList.contains("is-open")) menuDrop.style.height = menuFitHeight() + "px";
});

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});
// Moving between pages of one QA deck (테스트 유형, 테스트 자동화, 회사…) morphs the shared pieces — the
// section headings and the box diagram — with a view transition instead of a hard cut.
let lastRoute = parse();
function onRoute() {
  const prev = lastRoute;
  const next = parse();
  lastRoute = next;
  const tab = next.group === "service" && prev.child === next.child && prev.page !== next.page;
  const deck = prev.mode === next.mode && prev.group === next.group && (prev.child !== next.child || tab) && document.querySelector(".svc-page");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!deck || still || !document.startViewTransition) { render(); return; }
  // The transition waits for a painted frame; if none comes (throttled tab), render anyway.
  let done = false;
  const once = () => { if (!done) { done = true; render(); } };
  const vt = document.startViewTransition(once);
  setTimeout(() => { if (!done) { vt.skipTransition(); once(); } }, 400);
}
if (HASH_ROUTES) {
  window.addEventListener("hashchange", onRoute);
} else {
  // An old "#qa/…" link (bookmark, or one drawn after the page was built) becomes its path.
  const fromHash = () => {
    if (!isRoute(location.hash)) return false;
    history.replaceState(null, "", routeUrl(location.hash));
    return true;
  };
  window.addEventListener("hashchange", () => { if (fromHash()) onRoute(); });
  window.addEventListener("popstate", onRoute);
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-route]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (isHere(link.dataset.route)) return;
    go(link.dataset.route);
  });
  if (fromHash()) lastRoute = parse();
}
render();
