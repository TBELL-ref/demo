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

// /multi (multi/index.html) shares every file with the root site; only the header and three
// combined routes differ. "all" is the mode of those routes: #blog, #company/…, #inquiry/qa|security.
const MULTI = window.TBELL_LAYOUT === "multi";
const hashBase = (mode) => (mode === "all" ? "#" : "#" + mode + "/");

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

// /multi drops the greeting from 회사소개 (only 티벨 코어 and 찾아오시는 길 remain), so it is "기업 정보" there.
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
      id: "recruit", label: "인재채용", href: hashBase(mode) + "company/recruit",
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

const MENUS = {
  qa: [
    {
      id: "types", label: "테스트 종류", href: "#qa/types",
      children: [
        { id: "outsourcing", label: "아웃소싱", href: "#qa/types/outsourcing" },
        { id: "automation", label: "자동화", href: "#qa/types/automation" },
        { id: "blackbox", label: "블랙박스", href: "#qa/types/blackbox" },
        { id: "whitebox", label: "화이트박스", href: "#qa/types/whitebox" },
        { id: "api", label: "API", href: "#qa/types/api" },
        { id: "perfomance", label: "성능", href: "#qa/types/perfomance" }
      ]
    },
    {
      id: "testops", label: "TestOps", href: "#qa/testops",
      children: [
        { id: "build", label: "TestOps 구축", href: "#qa/testops/build" },
        { id: "ai", label: "AI 기반 검증 자동화", href: "#qa/testops/ai" }
      ]
    },
    {
      id: "tauto", label: "T 솔루션", href: "#qa/tauto",
      children: [
        { id: "overview", label: "솔루션 개요", href: "#qa/tauto" },
        { id: "auto", label: "T-AUTO", href: "#qa/tauto/auto" },
        { id: "gen", label: "T-GEN", href: "#qa/tauto/gen" },
        { id: "lens", label: "T-LENS", href: "#qa/tauto/lens" },
        { id: "voc", label: "T-VOC", href: "#qa/tauto/voc" }
      ]
    },
    blogMenu("qa"),
    COMPANY_MENU("qa")
  ],
  security: [
    { id: "diagnose", label: "사전진단", href: "#security/diagnose" },
    { id: "services", label: "컨설팅", href: "#security/services" },
    { id: "cert", label: "인증", href: "#security/cert" },
    blogMenu("security"),
    COMPANY_MENU("security")
  ]
};

const OTHERS = {
  "": [["#qa", "QA"], ["#security", "보안 컨설팅"]],
  qa: [["#security", "보안 컨설팅"]],
  security: [["#qa", "QA"]]
};

const MODE_LABEL = { qa: "QA", security: "정보보호", all: "TBELL" };

const content = document.getElementById("content");
const nav = document.getElementById("nav");
const header = document.querySelector(".header");
const menuDrop = document.getElementById("menu-drop");
const logoLink = document.getElementById("logo-link");
const tools = document.querySelector(".tools");
let activeMenu = [];
const logoMode = document.getElementById("logo-mode");
const inquire = document.getElementById("inquire");
const switchBtn = document.getElementById("switch-btn");
const switchPanel = document.getElementById("switch-panel");
const navToggle = document.getElementById("nav-toggle");

function parse() {
  const raw = (location.hash || "").replace(/^#/, "");
  let [mode, group, child, page] = raw.split("/");
  const known = ["qa", "security"];
  if (MULTI && ["blog", "company", "inquiry"].includes(mode)) {
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

function stage(kind, inner) {
  return `<section class="stage ${kind}">${inner}</section>`;
}

function stats() {
  const items = [
    [1460, "개", "누적 수행 프로젝트 수"],
    [161, "개사", "이용 고객사 수"],
    [165, "명", "임직원 수"],
    [299, "억", "누적 매출"]
  ];
  const cells = items.map(([n, unit, label]) => `<div class="stat"><p>${label}</p><p class="num"><span class="count" data-count="${n}">0</span>${unit}</p></div>`).join("");
  return `<div class="stage-center"><h2>고객과 더불어 성장하는 TBELL</h2><div class="stats">${cells}</div></div>`;
}

function gateHome() {
  return `
    <section class="gate">
      <a class="gate-card" href="#qa"><span class="en">QA</span><h1>QA</h1><p>테스트 아웃소싱, 자동화, TestOps.</p><span class="go">들어가기</span></a>
      <a class="gate-card" href="#security"><span class="en">Consulting</span><h1>보안 컨설팅</h1><p>인증, 개인정보, 보안 체계.</p><span class="go">들어가기</span></a>
    </section>
    ${stage("shade-d", stats())}`;
}

// ── /multi home: what the whole company shares, with no business-area split ─────────
// Copy is company-level only, taken as published: the MISSION (경영철학), 티벨 코어 (회사소개),
// milestones from the history data, and the company figures. No QA- or 보안-specific text.
const MULTI_SINCE = [
  ["2015", "주식회사 티벨 설립"],
  ["2016", "기업부설연구소 설립"],
  ["2018", "SK텔레콤 동반성장 협약 체결"],
  ["2020", "벤처기업 인증"],
  ["2023", "2023년도 SK텔레콤 최우수파트너사 수상"]
];
function multiHome() {
  const base = window.TBELL_BASE || "";
  const years = new Date().getFullYear() - 2015;
  const figures = [[1460, "개", "누적 수행 프로젝트 수"], [161, "개사", "이용 고객사 수"], [165, "명", "임직원 수"]];
  const core = [["core-test", "TEST"], ["core-customer", "CUSTOMER"], ["core-human", "HUMAN"]];
  return `<div class="mh">
  <section class="mh-hero">
    <span class="mh-rope" aria-hidden="true"></span>
    <div class="mh-knot"><small>SINCE</small><b>2015</b><span>TBELL</span></div>
    <p class="qh-label">MISSION</p>
    <h1>우리는 고객의 소프트웨어 품질 향상을 위해 <br>스마트한 솔루션을 제공하며 <br>고객의 가치 향상에 기여합니다.</h1>
    <div class="mh-cta"><a class="pill" href="#company/about">기업 정보</a><a class="pill ghost" href="#inquiry/qa">문의하기</a></div>
  </section>
  <section class="mh-core" style="background-image:url('${base}assets/qa/photos/core-building.jpg')">
    <div class="mh-wrap">
      <p class="qh-label">TBELL CORE</p>
      <h2>티벨 코어</h2>
      <ul class="mh-rings">${core.map(([icon, t], i) => `<li style="--i:${i}"><span><img src="${base}assets/qa/icons/${icon}.png" alt=""></span><b>${t}</b></li>`).join("")}</ul>
    </div>
  </section>
  <section class="mh-since" data-count-zone>
    <div class="mh-wrap">
      <p class="qh-label">SINCE 2015</p>
      <h2><span class="count" data-count="${years}">0</span>년, 하나의 티벨</h2>
      <ol class="mh-line">${MULTI_SINCE.map(([y, t], i) => `<li style="--i:${i}"><b>${y}</b><span>${t}</span></li>`).join("")}</ol>
    </div>
  </section>
  <section class="mh-common" data-count-zone>
    <div class="mh-wrap">
      <p class="qh-label">TBELL</p>
      <h2>고객과 더불어 성장하는 TBELL</h2>
      <div class="mh-figs">${figures.map(([n, u, l]) => `<div><p>${l}</p><strong><span class="count" data-count="${n}">0</span>${u}</strong></div>`).join("")}</div>
      <div class="mh-places"><p><b>강남 본사</b>서울특별시 강남구 강남대로 354, 9층 (역삼동, 혜천빌딩)</p><p><b>가산 사업장</b>서울특별시 금천구 가산디지털1로 168, A동 601호</p></div>
    </div>
  </section>
</div>`;
}

// ── QA home (design_demo/qa-home-plan.md) ────────────────────────────
// Scenes built on the origin artwork: TEST∞OPS badge hero, service photo explorer,
// TestOps office scene, automation-to-AI timeline, industries, clients, closing band.

const CLIENT_LOGOS = [
  "01_sk_telecom.ae25244966926033ab37.png", "02_logo.26e3f50ed53544c1c7ac.png", "03_lg.a96d12b90e0b1d8e2a5a.png",
  "04_lgu+.5aa452b3620888b8180c.png", "05_woongjin.4b5f79bcf32c2b52d4c0.png", "06_gs.b4937c30866898d5978d.png",
  "07_olive_young.e63706f5f90bed782755.png", "08_kakaopay.ec0feddaf22e913c7e02.png", "10_logo.903a4c7c9aa13d6268ce.png",
  "11_theres.78c038692ae02eeeb8b8.png", "12_11street.ce145ee69dde686b285c.png", "14_kt.626d843890e82319cfb2.png",
  "15_tripstore.35fd24420f22a807102d.png", "16_cyberlogitec.21555d984495dfddc26d.png", "17_lig.c81d0240fab7968ff357.png",
  "18_hmm.18d13a82edd9e11b5231.png", "19_nuri.9e846a18d466c945442b.png"
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

// The five icon nodes printed on the origin badge, in image pixels, and the service each one opens.
const QA_BADGE = {
  pc: { box: "0 0 1920 990", core: [1440, 510, 100], ring: 300, r: 36, tip: -1, nodes: [[1440, 348], [1541, 401], [1330, 388], [1280, 507], [1330, 627]] },
  mobile: { box: "0 0 1440 2376", core: [952, 1547, 150], ring: 450, r: 54, tip: -1, nodes: [[958, 1208], [1154, 1329], [739, 1305], [625, 1537], [739, 1771]] }
};
const QA_BADGE_LINKS = [["outsourcing", "아웃소싱 테스트"], ["whitebox", "화이트박스 테스트"], ["automation", "테스트 자동화"], ["blackbox", "블랙박스 테스트"], ["perfomance", "성능 테스트"]];

// T 브랜드 솔루션 on the home: the quality cycle from the leaflet (design → platform → eval → feedback).
const QA_TIMELINE = [
  { year: "DESIGN", kind: "설계", title: "T-GEN", href: "#qa/tauto/gen", demo: "gen",
    text: "기획서·Figma·요구사항 문서를 분석해 테스트 케이스를 자동으로 도출하고, AI 에이전트가 중복을 걸러냅니다." },
  { year: "PLATFORM", kind: "통합 플랫폼", title: "T-AUTO", href: "#qa/tauto/auto", demo: "auto",
    text: "자연어 시나리오만으로 테스트를 자동 수행하는 No-Code 자동화와, UI가 바뀌어도 스스로 복구하는 Self-Healing을 제공합니다." },
  { year: "EVAL", kind: "평가", title: "T-LENS", href: "#qa/tauto/lens", demo: "lens",
    text: "LLM-as-a-Judge로 대화형 AI의 응답 품질을 정량·정성 평가하고, AWS Device Farm으로 여러 기기에서 병렬 검증합니다." },
  { year: "FEEDBACK", kind: "피드백", title: "T-VOC", href: "#qa/tauto/voc", demo: "voc",
    text: "앱 스토어 리뷰를 자동으로 모아 부정 리뷰를 Jira 티켓으로 등록하고, AI가 유형을 분류해 답변을 추천합니다." }
];

function qaBadge(kind) {
  const spec = QA_BADGE[kind];
  const [cx, cy, coreR] = spec.core;
  const nodes = spec.nodes.map(([x, y], i) => {
    const [id, name] = QA_BADGE_LINKS[i];
    const w = name.length * (kind === "pc" ? 17 : 50) + (kind === "pc" ? 36 : 90);
    const h = kind === "pc" ? 40 : 96;
    const tx = x - spec.r - 14 - w;
    return `<a class="qh-node" href="#qa/types/${id}" data-i="${i}" aria-label="${name}">
        <circle class="qh-node-halo" cx="${x}" cy="${y}" r="${spec.r + 10}"/>
        <circle class="qh-node-hit" cx="${x}" cy="${y}" r="${spec.r + 6}"/>
        <g class="qh-tip"><rect x="${tx}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}"/><text x="${tx + w / 2}" y="${y + h * 0.13}" text-anchor="middle">${name}</text></g>
      </a>`;
  }).join("");
  return `<svg class="qh-badge-layer is-${kind}" viewBox="${spec.box}" preserveAspectRatio="${kind === "pc" ? "xMaxYMid" : "xMidYMax"} slice">
      <g class="qh-orbit" style="transform-origin:${cx}px ${cy}px"><circle cx="${cx}" cy="${cy}" r="${spec.ring}"/></g>
      <circle class="qh-core-pulse" cx="${cx}" cy="${cy}" r="${coreR}" style="transform-origin:${cx}px ${cy}px"/>
      ${nodes}
    </svg>`;
}

function qaDemo(kind) {
  if (kind === "voc") {
    return `<div class="qh-demo voc"><div class="qh-voc-in"><span style="--i:0">★★★★☆ 로그인이 자주 풀려요…</span><span style="--i:1">★★☆☆☆ 결제 후 화면이 멈춰요</span><span style="--i:2">★★★★★ 업데이트 후 빨라졌어요</span></div>
      <div class="qh-voc-lanes"><div><b>장애</b><i></i><i></i></div><div><b>기능</b><i></i></div><div><b>칭찬</b><i></i></div></div>
      <p class="qh-ticket">Jira 등록 · VOC-1242 (Critical)</p></div>`;
  }
  if (kind === "gen") {
    return `<div class="qh-demo gen"><div class="qh-docs"><span>기획서.pdf</span><span>Figma</span><span>요구사항.xlsx</span></div>
      <ol>${["TC-001 비밀번호 5회 오류 시 계정 잠금", "TC-002 잠금 해제 메일 발송", "TC-003 임시 비밀번호 재설정"].map((t, i) => `<li style="--i:${i}"><code>${t}</code><em></em></li>`).join("")}</ol></div>`;
  }
  if (kind === "auto") {
    return `<div class="qh-demo auto"><p class="qh-q">“로그인 후 장바구니에 상품을 담고 결제 화면까지 이동”</p><ol>${["로그인 화면 요소 식별", "상품 담기 버튼 식별", "결제 화면 진입 확인"].map((t, i) => `<li style="--i:${i}"><code>${t}</code><em></em></li>`).join("")}</ol></div>`;
  }
  return `<div class="qh-demo lens"><p class="qh-q">Q. 해외 결제 수수료는 얼마인가요?</p>
    ${[["정확성", 92], ["근거 제시", 84], ["어조·안전성", 96]].map(([k, v], i) => `<div class="qh-judge" style="--i:${i};--v:${v}%"><span>${k}</span><i></i><b>${v}</b></div>`).join("")}
    <p class="qh-reason">사유: 수수료율과 적용 조건을 함께 안내함</p></div>`;
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
  const timeline = QA_TIMELINE.map((m, i) =>
    `<li><button type="button" role="tab" id="qt-tab-${i}" aria-selected="${i === QA_TIMELINE.length - 1 ? "true" : "false"}" aria-controls="qt-panel" data-i="${i}"><span class="y">${m.year}</span><b>${m.title}</b><small>${m.kind}</small></button></li>`).join("");
  const industries = DOMAINS.map(([name, image]) =>
    `<li><img src="${ORIGIN}${image}" alt="" loading="lazy"><span>${name}</span></li>`).join("");
  const logos = CLIENT_LOGOS.map((file) => `<li><img src="${ORIGIN}${file}" alt="" loading="lazy"></li>`).join("");
  return `<div class="qh s-page dark" id="qh">
  <section class="qh-hero">
    <div class="qh-art">
      <picture><source media="(max-width: 768px)" srcset="${ORIGIN}banner-main-mobile-001.d743cfc41f203f0522b3.png"><img src="${ORIGIN}banner-main-pc-001.0e1ee99f9660f77d4fe1.png" alt=""></picture>
      ${qaBadge("pc")}${qaBadge("mobile")}
    </div>
    <div class="qh-hero-copy">
      <p class="qh-label">SOFTWARE TEST &amp; QUALITY</p>
      <h1>차별화된 테스트 경험을 제공하는<br>대한민국 대표 품질 서비스 기업</h1>
      <p class="lede">대한민국 IT 산업에 품질로 기여하고자 테스트 방법론과 서비스를 차별화하여, 테스트 서비스의 패러다임 변화를 주도하고 있습니다.</p>
      <div class="s-actions">
        <a class="pill" href="#qa/types">테스트 서비스 보기</a>
        <a class="pill ghost" href="#qa/inquiry">프로젝트 문의</a>
      </div>
    </div>
    <a class="qh-scroll" href="#qa" data-jump="qh-services" aria-label="아래로 이동"><span></span></a>
  </section>

  <section class="s-sec qh-light qh-explore" id="qh-services"><div class="s-wrap">
    <div class="qh-head"><p class="qh-label">TEST SERVICE</p><h2>프로젝트에 맞는 테스트를 고르세요</h2></div>
    <div class="qx">
      <div class="qx-list"><ul role="tablist" aria-label="테스트 서비스" aria-orientation="vertical">${list}</ul><i class="qx-bar" aria-hidden="true"></i></div>
      <div class="qx-panel" id="qx-panel" role="tabpanel" aria-labelledby="qx-tab-0">
        <div class="qx-stage">${shots}</div>
        <div class="qx-info">
          <div><h3 data-x="name">${first[1]}</h3><p data-x="text">${first[2]}</p><div class="qx-tags" data-x="tags">${firstTags}</div></div>
          <a class="pill" data-x="link" href="#qa/types/${first[0]}">자세히 보기</a>
        </div>
      </div>
    </div>
  </div></section>

  <section class="qh-testops" id="qh-testops">
    <picture class="qh-testops-bg"><source media="(max-width: 768px)" srcset="${ORIGIN}sec-main-mobile-002.70747ccffb2ac394fa5b.png"><img src="${ORIGIN}sec-main-002.2e4090c5e8921c5fcc33.png" alt="" loading="lazy"></picture>
    <div class="s-wrap">
      <div class="qh-testops-copy">
        <p class="qh-label">TESTOPS</p>
        <h2>테스트를<br>개발 흐름 안으로</h2>
        <p>티벨은 최신 테스트 자동화 기술을 적용한 TestOps 환경 구축을 통해 고객에게 최적의 가치를 제공하고 있습니다.</p>
        <div class="s-actions"><a class="pill" href="#qa/testops/build">TestOps 구축</a><a class="pill ghost" href="#qa/testops/ai">AI 기반 검증 자동화</a></div>
      </div>
      <div class="qh-loop" aria-label="TestOps 진행 흐름">
        <svg viewBox="100 40 320 180" aria-hidden="true">
          <path class="qh-loop-base" d="M130 130C130 60 230 60 260 130S390 200 390 130 290 60 260 130 130 200 130 130Z"/>
          <path class="qh-loop-draw" pathLength="100" d="M130 130C130 60 230 60 260 130S390 200 390 130 290 60 260 130 130 200 130 130Z"/>
          <circle class="qh-loop-dot" r="7"><animateMotion dur="6s" repeatCount="indefinite" path="M130 130C130 60 230 60 260 130S390 200 390 130 290 60 260 130 130 200 130 130Z"/></circle>
          <text x="260" y="138" text-anchor="middle">TestOps</text>
        </svg>
        <ol>
          <li class="s1" style="--i:0"><b><em>01</em>BDD 시나리오</b><span>비즈니스 언어로 테스트 시나리오 작성</span></li>
          <li class="s2" style="--i:1"><b><em>02</em>CI/CD 자동 실행</b><span>파이프라인에 연결해 변경마다 실행</span></li>
          <li class="s3" style="--i:2"><b><em>03</em>관리 도구 연동</b><span>프로젝트·테스트 관리 도구와 연동</span></li>
          <li class="s4" style="--i:3"><b><em>04</em>결과·결함 관리</b><span>계획부터 결과 관리까지 자동화</span></li>
        </ol>
      </div>
    </div>
  </section>

  <section class="s-sec qh-light qh-timeline" id="qh-tsol"><div class="s-wrap">
    <div class="qh-head"><p class="qh-label">T BRAND SOLUTION</p><h2>AI 기반 품질 검증 자동화</h2><p>T-AUTO를 중심으로 설계부터 평가, 고객 피드백까지 하나로 연결합니다.</p></div>
    <div class="qt">
      <div class="qt-rail"><div class="qt-line" aria-hidden="true"><i class="qt-fill"></i></div><ol role="tablist" aria-label="T 브랜드 솔루션">${timeline}</ol></div>
      <div class="qt-panel" id="qt-panel" role="tabpanel"></div>
    </div>
  </div></section>` +
    sSec("industries", ["INDUSTRIES", "다양한 산업에서 검증했습니다", "업종마다 다른 품질 기준과 규제를 이해하고 테스트를 설계합니다."], `
    <ul class="s-industries s-body">${industries}</ul>`) + `
  <section class="s-sec qh-light qh-clients" id="clients"><div class="s-wrap">
    <div class="s-head"><p class="s-eyebrow">CLIENTS</p><h2>티벨과 함께하는 고객사</h2></div>
    <div class="s-logos s-body"><ul>${logos}</ul><ul aria-hidden="true">${logos}</ul></div>
  </div></section>

  <section class="qh-close"><div class="s-wrap">
    <h2>프로젝트에 맞는 테스트 범위를<br>제안해 드립니다.</h2>
    <p>일정, 대상 플랫폼, 필요한 테스트 종류를 알려 주시면 투입 인력과 진행 방식을 함께 제안합니다.</p>
    <a class="pill" href="#qa/inquiry">프로젝트 문의</a>
  </div></section>
</div>`;
}

function qaTimelinePanel(i) {
  const m = QA_TIMELINE[i];
  return `<div class="qt-copy"><p class="qt-kind"><span>${m.kind}</span>${m.year}</p><h3>${m.title}</h3><p>${m.text}</p><a class="pill ghost" href="${m.href}">${m.title} 보기</a></div>${qaDemo(m.demo)}`;
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
  if (reduce) root.querySelectorAll("svg").forEach((svg) => svg.pauseAnimations && svg.pauseAnimations());

  // Hero: nodes light in turn; pointing at one stops the cycle on it. The art leans toward the pointer.
  const hero = root.querySelector(".qh-hero");
  const art = root.querySelector(".qh-art");
  let lit = 0;
  let held = false;
  const light = (i) => {
    lit = i;
    root.querySelectorAll(".qh-node").forEach((node) => node.classList.toggle("is-lit", Number(node.dataset.i) === i));
  };
  light(0);
  root.querySelectorAll(".qh-node").forEach((node) => {
    const hold = () => { held = true; light(Number(node.dataset.i)); };
    node.addEventListener("mouseenter", hold);
    node.addEventListener("focus", hold);
    node.addEventListener("mouseleave", () => { held = false; });
    node.addEventListener("blur", () => { held = false; });
  });
  if (!reduce) {
    hero.addEventListener("pointermove", (event) => {
      const box = hero.getBoundingClientRect();
      art.style.setProperty("--px", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      art.style.setProperty("--py", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    });
    hero.addEventListener("pointerleave", () => { art.style.setProperty("--px", 0); art.style.setProperty("--py", 0); });
  }

  // Service explorer: the chosen service's photo wipes in; copy, tags and link follow.
  wireExplorer(root.querySelector(".qx"), (i, slot) => {
    const [id, name, text] = QA_EXPLORE[i];
    slot("name").textContent = name;
    slot("text").textContent = text;
    slot("tags").innerHTML = (SERVICE_SLIDES.find((s) => s.id === id).tags || []).map((t) => `<span>#${t}</span>`).join("");
    slot("link").href = `#qa/types/${id}`;
  });

  // Timeline: choosing a milestone fills the rail up to it and swaps in its demo.
  const marks = Array.from(root.querySelectorAll(".qt-rail button"));
  const fill = root.querySelector(".qt-fill");
  const tPanel = root.querySelector("#qt-panel");
  let tCurrent = -1;
  let touched = false;
  const show = (i) => {
    if (i === tCurrent) return;
    tCurrent = i;
    marks.forEach((mark, k) => {
      mark.setAttribute("aria-selected", k === i ? "true" : "false");
      mark.tabIndex = k === i ? 0 : -1;
      mark.parentElement.classList.toggle("is-past", k < i);
    });
    fill.style.width = (i / (marks.length - 1)) * 100 + "%";
    tPanel.innerHTML = qaTimelinePanel(i);
    tPanel.setAttribute("aria-labelledby", marks[i].id);
  };
  marks.forEach((mark, i) => {
    mark.addEventListener("click", () => { touched = true; show(i); });
    mark.addEventListener("keydown", (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      touched = true;
      const n = (tCurrent + step + marks.length) % marks.length;
      show(n);
      marks[n].focus();
    });
  });
  show(0);

  // Scenes start their motion when they come into view; the hero cycle and timeline tour run on one clock.
  window.__qhIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("play", entry.isIntersecting));
  }, { threshold: 0.35 });
  root.querySelectorAll(".qh-testops, .qh-timeline, .qh-hero").forEach((el) => window.__qhIo.observe(el));
  if (!reduce) {
    let tick = 0;
    window.__qhTimer = setInterval(() => {
      if (!document.body.contains(root)) { clearInterval(window.__qhTimer); window.__qhTimer = null; return; }
      tick += 1;
      if (!held) light((lit + 1) % QA_BADGE_LINKS.length);
      const timelineSeen = root.querySelector(".qh-timeline").classList.contains("play");
      if (timelineSeen && !touched && tick % 4 === 0) show((tCurrent + 1) % marks.length);
    }, 1600);
  } else {
    show(marks.length - 1);
  }
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
    return `<article class="svc-slide">${photo}<div><p>${slide.title}</p><p>${slide.desc}</p><div class="svc-tags">${tags}</div></div></article>`;
  }).join("");
  const nav = (slide, dir, label) => slide
    ? `<a class="svc-nav ${dir}" href="${base}${slide.id}" aria-label="${label}">${arrow}</a>`
    : `<span class="svc-nav ${dir} is-off" aria-hidden="true">${arrow}</span>`;
  return `<section class="detail svc-page">
    <div class="svc-banner" data-prev="${prev ? base + prev.id : ""}" data-next="${next ? base + next.id : ""}">
      <div class="svc-track" style="transform:translateX(-${index * 100}%)">${slidesHtml}</div>
      ${nav(prev, "prev", "이전")}
      ${nav(next, "next", "다음")}
    </div>
    ${leafNav(leaves, id)}
    <div class="svc-body">${current.body()}</div>
  </section>`;
}

function serviceDeck(child) {
  return qaDeck(SERVICE_SLIDES, child || "outsourcing", "#qa/types/");
}

function testopsDeck(child) {
  return qaDeck(TESTOPS_SLIDES, child === "ai" ? "ai" : "build", "#qa/testops/");
}

// ── T 브랜드 솔루션 (copy from the 「T브랜드솔루션」 leaflet) ─────────────
// T-AUTO is the platform at the centre; T-GEN, T-LENS, T-VOC and TestOps sit around it by role.
// T-ASSI is part of the leaflet's map but is left out of the QA menu and pages for now.
const T_BRANDS = [
  { id: "gen", name: "T-GEN", role: "설계", en: "DESIGN", icon: "form", href: "#qa/tauto/gen", tag: "AI 기반 테스트 케이스 설계 자동화",
    text: "기획서·Figma·요구사항 문서를 분석해 테스트 케이스를 자동으로 도출하고 중복을 정리합니다." },
  { id: "auto", name: "T-AUTO", role: "플랫폼", en: "PLATFORM", icon: "layers", href: "#qa/tauto/auto", tag: "AI 기반 통합 품질 검증 플랫폼",
    text: "4계층 아키텍처 위에서 No-Code 자동화, AI 자율 테스트, 품질 분석을 한 번에 운영합니다." },
  { id: "testops", name: "TestOps", role: "검증·운영", en: "OPERATIONS", icon: "loop", href: "#qa/testops/build", tag: "멀티모달 테스트 및 품질 운영 자동화",
    text: "CI/CD 연동부터 멀티모달 QA, 안정성 점수 기반 배포 결정까지 품질 운영을 자동화합니다." },
  { id: "lens", name: "T-LENS", role: "평가", en: "EVAL", icon: "scan", href: "#qa/tauto/lens", tag: "대화형 AI(LLM) 품질 평가 플랫폼",
    text: "LLM-as-a-Judge로 평가 프로세스를 표준화하고 정량·정성 평가를 자동화합니다." },
  { id: "voc", name: "T-VOC", role: "피드백", en: "FEEDBACK", icon: "send", href: "#qa/tauto/voc", tag: "앱 스토어 VOC 모니터링 시스템",
    text: "앱 스토어 리뷰를 모아 이슈로 만들고, AI가 유형을 나누고 답변을 추천합니다." }
];

function tBrand(id) {
  return T_BRANDS.find((b) => b.id === id);
}

// T 솔루션 bodies: the white QA-detail language, but each page built from different pieces the way the
// 테스트 종류 pages are (cycle band, chevrons, layer stack, metrics band, conversion, score screen, flow).
// Copy is the leaflet's; no source notes.
const tpBody = (html) => `<div class="svc-body tp">${html}</div>`;
const tpSec = (id, eyebrow, title, lede, inner, cls = "") => `
  <section class="qp-sec tp-sec${cls ? " " + cls : ""}" id="${id}" data-qp-reveal>
    <p class="tp-eyebrow">${eyebrow}</p>
    <h2 class="qp-h">${title}</h2>
    ${lede ? `<div class="qp-lede"><p>${lede}</p></div>` : ""}
    ${inner}
  </section>`;
const tpIco = (name) => `<span class="tp-ico">${ICO[name]}</span>`;

// Product tabs under the hero: switch between the T pages without a footer list on every page.
function tTabs(current) {
  const items = [["overview", "솔루션 개요", "#qa/tauto"], ["auto", "T-AUTO", "#qa/tauto/auto"], ["gen", "T-GEN", "#qa/tauto/gen"], ["lens", "T-LENS", "#qa/tauto/lens"], ["voc", "T-VOC", "#qa/tauto/voc"]];
  return `<nav class="subnav tq-tabs" aria-label="T 솔루션">${items.map(([id, label, href]) => `<a href="${href}"${id === current ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>`;
}
const tPage = (current, eyebrow, title, lede, body) => sPage(eyebrow, title, lede, tTabs(current) + tpBody(body));

function tautoHome() {
  const stages = [["설계", "gen"], ["검증·운영", "auto"], ["평가", "lens"], ["피드백", "voc"]];
  const col = ([stage, id], i) => {
    const b = tBrand(id);
    const extra = id === "auto" ? `<a class="tq-also" href="#qa/testops/build">+ TestOps</a>` : "";
    return `<li class="${id === "auto" ? "is-core" : ""}" style="--i:${i}">
      <p class="tq-stage"><span>${String(i + 1).padStart(2, "0")}</span>${stage}</p>
      <a class="tq-prod" href="${b.href}">${tpIco(b.icon)}<b>${b.name}</b><small>${b.tag}</small></a>${extra}
    </li>`;
  };
  return tPage("overview", "T BRAND SOLUTION", "AI 기반 품질 검증 자동화", "IT 고객을 위한 통합 QA 자동화 포트폴리오입니다. T-AUTO를 중심으로 설계부터 평가, 운영, 고객 피드백까지 하나의 품질 플랫폼 생태계로 연결합니다.",
    tpSec("map", "PORTFOLIO MAP", "설계부터 피드백까지 하나로", "각 솔루션은 품질 주기의 한 단계를 맡고, T-AUTO가 그 사이를 잇습니다.",
      `<ol class="tq-cycle">${stages.map(col).join("")}</ol>`) +
    `<section class="tq-band" data-qp-reveal>
      <div class="tq-band-in">
        <div><p class="tp-eyebrow">VALUE</p><h2 class="qp-h">도입하면 달라지는 것</h2></div>
        <ol class="tq-values">${[["출시 주기 단축", "설계와 실행을 자동화해 Time-to-Market을 앞당깁니다."], ["No-Code 자동화", "LLM이 자연어 시나리오를 읽고 테스트를 만들어 실행합니다."], ["운영·비용 최적화", "필요한 테스트만 골라 구독형으로 운영해 초기 구축 비용을 줄입니다."]]
          .map(([t, d], i) => `<li style="--i:${i}"><span>0${i + 1}</span><div><b>${t}</b><p>${d}</p></div></li>`).join("")}</ol>
      </div>
    </section>` +
    tpSec("next", "NEXT STEP", "이렇게 시작합니다", "", `
      <ol class="tq-chev">${[["PoC / 파일럿 협의", "도입 가능성을 검토하고 요구사항을 분석합니다."], ["우선순위 시나리오 선정", "핵심 기능 위주로 자동화 대상을 고릅니다."], ["통합 및 확대 적용", "CI/CD 파이프라인과 연동하고 전사로 넓힙니다."]]
        .map(([t, d], i) => `<li style="--i:${i}"><b>${t}</b><p>${d}</p></li>`).join("")}</ol>
      <div class="tp-actions"><a class="pill" href="#qa/inquiry">T 솔루션 도입 문의</a></div>`, "tp-last"));
}

function tAuto() {
  const layers = [
    ["L4", "Quality Analytics Layer", "실패 분석 및 릴리즈 의사결정 지원", ["Failure Analysis AI", "Release Stability Score"]],
    ["L3", "AI Intelligence Layer", "AI Agent 기반 자율 테스트", ["TC Gen", "Explorer", "Self-Healing"]],
    ["L2", "Test Automation Layer", "No-Code 및 멀티 플랫폼 실행", ["No-Code AI QA", "One Runner Platform"]],
    ["L1", "Multi-modal QA Layer", "시각·음성 등 다양한 인터페이스 검증", ["Vision (OBS)", "Voice (STT/TTS)"]]
  ];
  return tPage("auto", "T-AUTO · PLATFORM", "AI 기반 통합 품질 검증 플랫폼", "T 브랜드 솔루션의 중심입니다. 4계층 아키텍처 위에서 No-Code 자동화, AI 자율 테스트, 품질 분석을 한 플랫폼으로 운영하고, 설계(T-GEN)·평가(T-LENS)·피드백(T-VOC)과 연결합니다.",
    tpSec("layers", "4-LAYER ARCHITECTURE", "네 개의 계층이 함께 움직입니다", "아래 계층이 다양한 인터페이스를 검증하고, 위로 올라갈수록 AI가 판단과 의사결정을 돕습니다.", `
      <div class="tp-stack">
        <p class="tp-stack-axis" aria-hidden="true"><span>AI 판단·의사결정</span><span>인터페이스 검증</span></p>
        <ol>${layers.map(([no, name, text, chips], i) => `
          <li class="l${4 - i}" style="--i:${i}"><span class="tp-lno">${no}</span><div class="tp-lname"><b>${name}</b><p>${text}</p></div><div class="tp-lchips">${chips.map((c) => `<span>${c}</span>`).join("")}</div></li>`).join("")}</ol>
      </div>
      <p class="tp-note">T-AUTO는 소프트웨이브 2024에서 소프트웨어 테스트 자동화 도구로 처음 소개했습니다.</p>`) +
    tpSec("areas", "PLATFORM", "기능도, 성능도, LLM까지.", "하나의 자산 · 실행 · 결함 체계 위에서 네 가지 검증 영역이 함께 동작합니다.", `
      <ul class="tq-areas">${[["기능 QA", "App · Web · API 기능 검증 자동화"], ["앱 성능", "스텝 · 구간별 지표 수집 · 판정"], ["LLM 평가", "T-LENS 기반 챗봇 품질 평가"], ["실기기 검증", "디바이스 팜 · 클라우드 · 직접 연결"]]
        .map(([t, d], i) => `<li${i === 2 ? ' class="is-key"' : ""}><b>${t}</b><p>${d}</p></li>`).join("")}</ul>
      <p class="tq-envs"><span>Android</span><span>iOS</span><span>Web</span><span>API</span></p>
      <p class="tp-note">실기기 팜 · 클라우드 · 직접 연결 단말 기반 End-to-End 검증 · 2021년부터 축적한 TestOps 운영 경험</p>`) +
    tpSec("how", "HOW IT WORKS", "생성부터 결함 등록까지 한 흐름으로", "", `
      <ol class="tq-pipe">${[["AI 자동화 생성", "TC 입력 → 자동 생성"], ["자동 실행", "실기기 · 스케줄, 성능 측정 동시"], ["실행 중 복구", "화면 변경 감지, 복구 후보 검증"], ["결과 · 실패 분석", "AI 원인 분류"], ["결함 관리", "검토 · 승인 후 결함 등록"]]
        .map(([t, d], i) => `<li${i === 2 ? ' class="is-ai"' : i === 4 ? ' class="is-human"' : ""}><span>${i + 1}</span><b>${t}</b><p>${d}</p></li>`).join("")}</ol>
      <p class="tq-pipe-loop">AI는 실행 중 복구하고, 테스트 자산 변경은 사람의 승인 후 반영합니다</p>`) +
    tpSec("nocode", "NO-CODE", "LLM 기반 No-Code 자동화", "Web 환경 PoC 사례: 시나리오 설정만으로 테스트 전 과정을 자동 수행했습니다.", `
      <div class="tq-split">
        <ol class="tq-vsteps">${[["시나리오 설정", "자연어로 테스트 시나리오를 입력합니다."], ["AI 분석 및 식별 (LLM)", "화면의 UI 요소와 Action을 자동으로 파악합니다."], ["테스트 자동 실행", "식별한 요소를 기준으로 검증을 수행합니다."]]
          .map(([t, d], i) => `<li style="--i:${i}"><span>0${i + 1}</span><div><b>${t}</b><p>${d}</p></div></li>`).join("")}</ol>
        <div class="ts-demo nocode" aria-hidden="true">
          <p class="ts-demo-k">시나리오</p><p class="ts-type">“로그인 후 장바구니에 상품을 담고 결제 화면까지 이동”</p>
          <p class="ts-demo-k">AI 식별</p><div class="ts-found"><span>#login-id</span><span>#login-pw</span><span>button.cart-add</span><span>a.checkout</span></div>
          <p class="ts-demo-k">실행</p><ul class="ts-run"><li>로그인</li><li>상품 담기</li><li>결제 화면 진입</li></ul>
        </div>
      </div>`) +
    tpSec("healing", "SELF-HEALING", "UI가 바뀌어도 테스트가 스스로 복구합니다", "요소 탐색에 실패하면 원인을 분석해 새 경로를 찾아 이어서 실행합니다.", `
      <ol class="tq-ruled">${[["실패 상태 캡처 및 보존", "요소 탐색 실패 시 UI 스크린샷과 DOM 구조를 즉시 저장합니다."], ["데이터 정제 (Token Optimization)", "LLM 효율을 위해 불필요한 스크립트와 마커를 제거합니다."], ["AI 기반 DOM 차이 분석", "기준(V1)과 현재(V2) XML을 비교해 구조 변경을 파악합니다."], ["대체 경로(XPath) 자동 생성", "바뀐 UI에 맞는 새 Locator를 제안하고 복구합니다."]]
        .map(([t, d], i) => `<li style="--i:${i}"><span>STEP 0${i + 1}</span><b>${t}</b><p>${d}</p></li>`).join("")}</ol>`) +
    `<section class="tq-metrics" data-qp-reveal>
      <p class="tp-eyebrow">IMPACT &amp; VALUE</p>
      <div class="tq-metrics-row">
        <div><span>Flaky Test 감소율</span><strong>35% ~ 50%<em>↓</em></strong></div>
        <div><span>자동 복구 성공률</span><strong>75% ~ 90%<em>↑</em></strong></div>
      </div>
      <ul class="tq-chips"><li>테스트 유지보수 비용 절감</li><li>릴리즈 안정성 지표화</li><li>UI 변경 대응 리드타임 단축</li></ul>
    </section>` +
    tpSec("multimodal", "MULTI-MODAL QA", "화면과 음성까지 검증합니다", "", `
      <div class="tq-heads">
        <article><h3 class="grey">VISION · AI Vision (OBS)</h3><div>${tpIco("look")}<p>OBS 기반으로 화면의 이상을 탐지합니다.</p></div></article>
        <article><h3 class="teal">VOICE · Voice (STT/TTS)</h3><div>${tpIco("loop")}<p>테스터 대신 TTS·STT로 발화해 AI 고객 상담 시나리오의 음성 품질을 반복 검증합니다.<small>SOTEC 2025 · STK 2025 · QA 코리아 컨퍼런스 2025에서 음성 테스트 자동화(VUX)로 공개</small></p></div></article>
      </div>
      <div class="tp-actions"><a class="pill ghost" href="#qa/testops/build">TestOps에서 운영하는 방식 보기</a></div>`, "tp-last"));
}

function tGen() {
  return tPage("gen", "T-GEN · DESIGN", "AI 기반 테스트 케이스 설계 자동화", "기획서, Figma, 요구사항 문서를 분석해 테스트 케이스를 자동으로 도출하고, AI 에이전트가 중복을 걸러 설계를 최적화합니다.",
    tpSec("docs", "DOCS → TC", "문서에서 테스트 케이스를 바로 만듭니다", "기획서, Figma 화면, 요구사항 문서를 그대로 넣으면 AI가 기능과 조건을 읽어 테스트 케이스를 도출합니다.", `
      <div class="tq-convert" aria-hidden="true">
        <ul class="tq-files"><li><i>PDF</i>기획서</li><li><i>FIG</i>Figma</li><li><i>XLSX</i>요구사항 문서</li></ul>
        <span class="tq-ai"><b>AI</b></span>
        <div class="ts-demo gen"><p class="ts-demo-k">TEST CASES</p><ul class="ts-tc"><li><b>TC-001</b> 비밀번호 5회 오류 시 계정 잠금</li><li><b>TC-002</b> 잠금 해제 메일 발송</li><li><b>TC-003</b> 임시 비밀번호 재설정</li></ul></div>
      </div>`) +
    tpSec("arch", "ARCHITECTURE", "로컬 SLM과 벡터 DB로 생성합니다", "LLM 기반 자연어 처리와 검색 · 분석 기술을 결합해 요구사항 · 시나리오 · 로그 등 다양한 문서에서 테스트 케이스를 만듭니다.", `
      <ol class="tq-ruled">${[["PDF 문서 파싱", "기획서 · 설명서 등 다양한 문서를 읽어 들입니다."], ["문서 내용 벡터 DB화", "문서 내용을 벡터 DB에 저장해 검색할 수 있게 합니다."], ["Test Case 생성 요청", "로컬 PC의 SLM이 필요한 문서 내용을 찾아 분석합니다."], ["분석 및 TC 생성", "자동 생성 로직이 일관된 형식의 테스트 케이스를 만듭니다."]]
        .map(([t, d], i) => `<li style="--i:${i}"><span>STEP 0${i + 1}</span><b>${t}</b><p>${d}</p></li>`).join("")}</ol>`) +
    `<section class="tq-band light" data-qp-reveal>
      <div class="tq-band-in">
        <div><p class="tp-eyebrow">OPTIMIZE</p><h2 class="qp-h">중복은 줄이고, 판단은 사람과 함께</h2><div class="qp-lede"><p>AI 에이전트가 겹치는 테스트 케이스를 골라내고, 담당자가 확인한 결과로 다시 생성합니다(Human-in-the-loop).</p></div>
          <div class="ts-demo dedupe" aria-hidden="true"><ul><li>로그인 실패 시 오류 문구 표시</li><li class="dup">로그인 실패하면 에러 메시지 노출</li><li>비밀번호 5회 오류 시 계정 잠금</li><li class="dup">5회 연속 실패 시 로그인 차단</li></ul><p class="ts-demo-k">중복 2건 병합 제안 · 검토 대기</p></div></div>
        <ol class="qp-valuebars">${[["중복 TC 선별", "AI 에이전트가 겹치는 테스트 케이스를 골라냅니다."], ["담당자 검토", "사람이 결과를 확인합니다(Human-in-the-loop)."], ["재생성", "검토 결과를 반영해 테스트 케이스를 다시 만듭니다."]]
          .map(([t, d], i) => `<li style="--i:${i}"><b>0${i + 1} ${t}</b><p>${d}</p></li>`).join("")}</ol>
      </div>
    </section>` +
    `<section class="tq-metrics" data-qp-reveal>
      <p class="tp-eyebrow">EXPECTED BENEFITS</p>
      <div class="tq-metrics-row one"><div><span>수십~수백 개 TC 자동 생성으로 작성 속도</span><strong>5~10배<em>↑</em></strong></div></div>
      <ul class="tq-chips"><li>QA 초기 기본 커버리지 보장</li><li>일관된 형식 · 구조의 TC</li><li>신규 인력 빠른 온보딩</li></ul>
    </section>`);
}

function lens() {
  return tPage("lens", "T-LENS · EVAL", "대화형 AI(LLM) 품질 평가 플랫폼", "TBELL LLM Evaluation and Scoring System. LLM-as-a-Judge로 평가 프로세스를 표준화하고 정량·정성 평가를 자동화해 일관성을 확보합니다. 2026년 1월 공식 런칭했습니다.",
    tpSec("judge", "LLM-AS-A-JUDGE", "평가자에 따라 달라지지 않는 평가", "챗봇 검증용 질문·응답 데이터셋으로 평가 프롬프트를 만들고, 여러 Judge 모델이 응답 품질을 점수와 사유로 냅니다. 평가 프로세스를 표준화해 정량·정성 평가의 일관성을 확보합니다.", `
      <div class="ts-demo lens tq-score" aria-hidden="true">
        <div class="ts-score"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="32"/><circle class="v" cx="40" cy="40" r="32" pathLength="100"/></svg><strong>92<small>%</small></strong></div>
        <div><p class="ts-demo-k">EVALUATION SCORE</p><ul class="ts-eval"><li>정확성 <b class="ok">Pass</b></li><li>안전성 <b class="ok">Pass</b></li><li>일관성 <b class="warn">Warning</b></li></ul></div>
        <div class="ts-progress"><span>Total Progress</span><i style="--w:75%"></i><b>75%</b></div>
        <p class="ts-demo-cap">예시 화면</p>
      </div>
      <ul class="tq-tiles">${["시나리오 전체 End-to-End 검증", "버전 변경 전후 비교", "새 모델 적용 시 품질 안정성 확인"].map((t, i) => `<li class="${i === 1 ? "teal" : "grey"}" style="--i:${i}">${t}</li>`).join("")}</ul>`) +
    tpSec("device", "AWS DEVICE FARM", "여러 기기에서 동시에", "", `
      <ul class="tq-cols">${[["cloud", "AWS Device Farm 연동", "Android, iOS, 웹을 포함한 다양한 디바이스 환경에서 병렬로 테스트합니다."], ["layers", "대시보드", "평가 점수와 사유를 대시보드에서 확인합니다."], ["renew", "지표 맞춤", "서비스 특성에 맞게 평가 지표를 바꿀 수 있습니다."]]
        .map(([ic, t, d], i) => `<li style="--i:${i}">${tpIco(ic)}<b>${t}</b><p>${d}</p></li>`).join("")}</ul>`, "tp-last"));
}

function voc() {
  const flow = [["send", "신규 리뷰 자동 수집", "앱 스토어에 올라온 새 리뷰를 자동으로 모읍니다."], ["flag", "부정 리뷰 Jira 티켓 생성", "부정 리뷰는 Jira 티켓으로 자동 등록합니다."], ["layers", "리뷰 유형 자동 분류", "모인 리뷰를 유형별로 자동 분류합니다."], ["form", "AI 추천 답변 생성", "리뷰에 맞는 답변을 AI가 추천해 대응 속도를 높입니다."]];
  return tPage("voc", "T-VOC · FEEDBACK", "앱 스토어 VOC 모니터링 시스템", "앱 스토어 리뷰를 자동으로 모으고, 부정 리뷰는 Jira 티켓으로 등록하며, AI가 리뷰 유형을 분류하고 답변을 추천해 대응 속도를 높입니다.",
    tpSec("collect", "COLLECT → ISSUE → AI", "리뷰가 곧 이슈가 되고, 분류와 답변은 AI가 먼저", "", `
      <ol class="tq-flow">${flow.map(([ic, t, d], i) => `<li style="--i:${i}"><span class="tq-node${i > 1 ? " ai" : ""}">${tpIco(ic)}</span><b>${t}</b><p>${d}</p></li>`).join("")}</ol>
      <div class="tq-demos" aria-hidden="true">
        <div class="ts-demo voc"><p class="ts-demo-k">APP STORE</p><div class="ts-review"><span class="ts-stars">★★★★☆</span><p>로그인이 자주 풀려요…</p></div></div>
        <div class="ts-demo voc"><p class="ts-demo-k">JIRA</p><div class="ts-ticket"><b>이슈 자동 등록 완료</b><span>Ticket: VOC-1242 (Critical)</span></div><p class="ts-demo-cap">예시 화면</p></div>
      </div>
      <p class="tp-note">티벨은 2020년 금융사 VOC 관리 자동화 프로세스 구축을 시작으로 10여 개 고객사에 VOC 자동화를 구축해 왔습니다.</p>`, "tp-last"));
}

const T_PAGES = { auto: tAuto, vux: tAuto, gen: tGen, lens, voc };

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
  // Hero and page tabs are the shared detail-page pieces (sPage); the body is security_demo's.
  return sPage("Compliance Navigator", "질문에 답하면 의무와 일정이 바로 나옵니다",
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
  return sPage("Certification · ISMS / ISMS-P / ISO", "2027년, 인증 심사가 달라집니다", "인증을 받은 기업에서도 대형 유출 사고가 이어지자 정부는 ISMS·ISMS-P를 서면 심사 중심에서 운영 현장과 기술을 확인하는 심사로 바꾸고 있습니다. 문서만 갖춘 준비로는 통과도, 유지도 어려워집니다.",
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

function aboutBody() {
  const cards = OFFICES.map(([name, address, lat, lng]) => `
    <article>
      <iframe class="way-map" src="https://maps.google.com/maps?q=${lat},${lng}&amp;z=16&amp;hl=ko&amp;output=embed" title="${name} 지도" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
  { id: "about", title: MULTI ? "기업 정보" : "회사 소개", desc: "", tags: [], bg: ["bg-info.de3329d4a93fff58c0c9.png", "bg-tablet-info.dfaa0c39c60c825ecbb2.png", "bg-mobile-info.92d953b0346cc509e852.png"], body: aboutBody },
  { id: "vision", title: "경영철학", desc: "", tags: [], bg: ["bg-vision.2e2c550d96ce302bf12d.png", "bg-tablet-vision.657fdee36572fc7cefea.png", "bg-mobile-vision.5aa6cb952f2921958f37.png"], body: visionBody }
];

const RECRUIT_SLIDES = [
  { id: "benefit", title: "복리후생", desc: "", tags: [], bg: ["bg-benefit.980907dc0cae18031e40.png", "bg-tablet-benefit.e31e967d683d2abd1095.png", "bg-mobile-benefit.2a770bc2a5cd8dcfc473.png"], body: benefitBody },
  { id: "recruit", title: "Good Player, Great Work", desc: "티벨은 올바른 생각과 실천을 통해 “우수한 인재를, 일하기 좋은 기업”을 만듭니다.", tags: [], bg: ["bg-recruit.96e2ea0dae220b78e221.png", "bg-tablet-recruit.95364057a4fd3ee61e20.png", "bg-mobile-recruit.89efb893fcee0ae88828.png"], body: recruitBody }
];

const ESG_SLIDES = [
  { id: "ethical", title: "윤리 경영", desc: "", tags: [], bg: ["bg-ethical.4ee79d2ecc425576aabf.png", "bg-tablet-ethical.3ee09f7000c4ffa90a44.png", "bg-mobile-ethical.6ca0468a4dffddfbd2d7.png"], body: ethicalBody },
  { id: "social", title: "사회 경영", desc: "", tags: [], bg: ["bg-social.18fa9508d7893696bec6.png", "bg-tablet-social.12a02e3c7d934095805f.png", "bg-mobile-social.e1f4c148af28514f5139.png"], body: socialBody },
  { id: "environmental", title: "환경 경영", desc: "친환경 제품 및 서비스, 에너지 소비 분야를 중심으로 친환경 ICT 기업 도약을 추진합니다.", tags: [], bg: ["bg-environ.9fef7398af46aa8d3846.png", "bg-tablet-environmental.b52a1a9ba527c8536088.png", "bg-mobile-environmental.890cbb7f7a60a4853a15.png"], body: envBody }
];
const INQUIRY = {
  qa: {
    title: "QA 문의",
    lede: "테스트 범위와 희망 일정을 알려 주시면 QA 담당이 수행 가능 여부와 진행 방식으로 답합니다.",
    mail: "staff@tbell.co.kr",
    topics: ["아웃소싱 테스트", "테스트 자동화", "블랙박스", "화이트박스", "API", "성능", "TestOps", "T-AUTO", "T-LENS"],
    extra: ""
  },
  security: {
    kicker: "Contact",
    title: "진단 결과를 보내 주시면, 계획으로 답합니다",
    lede: "셀프 진단 결과나 준비 중인 인증, 목표 일정을 알려 주세요. 컨설팅 범위와 권장 일정, 단계별로 받으실 문서 목록을 정리해 회신드립니다.",
    mail: "security@tbell.co.kr",
    labels: ["EMAIL", "TEL", "HQ"],
    phone: "070-7777-9113",
    phoneNote: "월–금 09:30–18:00 · 점심 12:00–13:00",
    place: "서울특별시 강남구 강남대로 354, 9층 (혜천빌딩)",
    aside: `<a class="inq-link" href="#security/diagnose"><div><h3>진단 전</h3><p>아직 진단 전이면, 2분 셀프 진단부터</p></div><svg class="inq-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></a>`,
    topics: ["ISMS·ISMS-P", "ISO 27001 계열", "개인정보 보호", "마스터플랜·제로트러스트", "AI 거버넌스", "Virtual CISO 자문"],
    messageLabel: "현재 상황과 목표 일정",
    placeholder: "예) ISMS 보유 중, 2027년 ISMS-P 전환 필요. 내년 상반기 심사 목표",
    agree: "상담을 위한 개인정보(이름, 회사명, 이메일, 연락처) 수집·이용에 동의합니다. 상담 종료 후 파기합니다.",
    button: "상담 신청",
    extra: `<p class="import-note" id="import-note" hidden>셀프 진단 결과가 문의 내용에 들어가 있습니다. 이름과 연락처만 더해 주세요.</p>
    <details class="survey">
      <summary><span class="kicker">사전 조사 (선택)</span><span class="survey-toggle" aria-hidden="true"></span></summary>
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

function inquiryPage(mode) {
  const spec = INQUIRY[mode];
  const chips = spec.topics.map((topic) => `<label class="chip"><input type="checkbox" name="topic" value="${topic}">${topic}</label>`).join("");
  const phone = spec.phone || "070-7777-9113 / 070-7777-6368";
  const phoneNote = spec.phoneNote || "월–금요일 09:30–18:00 · 점심 12:00–13:00";
  const place = spec.place || "강남본사 서울특별시 강남구 강남대로 354, 9층";
  return page(spec.kicker || "Inquiry", spec.title, spec.lede, `
    <div class="inquiry-grid">
      <div class="list">
        <article><h3>${spec.labels ? spec.labels[0] : "메일"}</h3><p>${spec.mail}</p></article>
        <article><h3>${spec.labels ? spec.labels[1] : "전화"}</h3><p class="num">${phone}</p><p>${phoneNote}</p></article>
        <article><h3>${spec.labels ? spec.labels[2] : "받는 곳"}</h3><p>${place}</p></article>
        ${spec.aside || ""}
      </div>
      <form class="form" id="inquiry-form">
        <div class="form-row">
          <label>이름<input name="name" autocomplete="name" required></label>
          <label>회사명<input name="company" autocomplete="organization" required></label>
        </div>
        <label>이메일<input name="email" type="email" autocomplete="email" required></label>
        <label>연락처<input name="phone" type="tel" autocomplete="tel"></label>
        <fieldset class="chips"><legend>관심 분야 (복수 선택)</legend>${chips}</fieldset>
        ${spec.extra}
        <label>${spec.messageLabel || "문의 내용"}<textarea name="message" required placeholder="${spec.placeholder || "대상 서비스, 일정, 현재 상황을 적어 주세요."}"></textarea></label>
        <label class="agree"><input type="checkbox" name="agree" required>${spec.agree || "문의 회신을 위한 개인정보(이름, 회사명, 이메일, 연락처) 수집·이용에 동의합니다."}</label>
        <button class="pill" type="submit">${spec.button || "문의 보내기"}</button>
      </form>
    </div>
    <div class="result" id="inquiry-result" hidden></div>`);
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
    const id = ["ethical", "social", "environmental"].includes(child) ? child : "ethical";
    return qaDeck(ESG_SLIDES, id, base, leaves);
  }
  return qaDeck(ABOUT_SLIDES, child === "vision" ? "vision" : "about", base, leaves);
}

const DRAW = {
  qa: {
    "": qaHome,
    types: (child) => serviceDeck(child),
    testops: (child) => testopsDeck(child),
    tauto: (child) => (T_PAGES[child] || tautoHome)(),
    blog: (child, mode) => blogList(mode, child),
    inquiry: () => inquiryPage("qa"),
    company: drawCompany
  },
  security: {
    "": securityHome,
    diagnose,
    services,
    cert,
    blog: (child, mode) => blogList(mode, child),
    inquiry: () => inquiryPage("security"),
    company: drawCompany
  },
  all: {
    "": () => blogList("all", ""),
    blog: (child) => blogList("all", child),
    company: drawCompany,
    inquiry: (child) => multiInquiry(child)
  }
};

// /multi 문의: a QA | 보안 switch above the same inquiry pages as #qa/inquiry and #security/inquiry.
const inquiryMode = (child) => (child === "security" ? "security" : "qa");
function multiInquiry(child) {
  const which = inquiryMode(child);
  const tab = (id, label) => `<a href="#inquiry/${id}"${id === which ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<nav class="s-subnav inq-switch" aria-label="문의 분야"><div class="s-wrap">${tab("qa", "QA 문의")}${tab("security", "보안 컨설팅 문의")}</div></nav>${inquiryPage(which)}`;
}

// /multi header: 서비스 (QA · 보안 → their own menus), 블로그 (combined), 회사소개.
const MULTI_MENU = [
  {
    id: "service", label: "서비스", href: "#qa",
    sections: [
      { id: "qa", label: "QA", href: "#qa", groups: [
        { id: "", label: "사업 소개", href: "#qa" },
        ...MENUS.qa.filter((item) => ["types", "testops", "tauto"].includes(item.id))
      ] },
      { id: "security", label: "보안", href: "#security", groups: [
        { id: "", label: "사업 소개", href: "#security" },
        { id: "diagnose", label: "사전 진단", href: "#security/diagnose" },
        { id: "services", label: "컨설팅", href: "#security/services" },
        { id: "cert", label: "인증", href: "#security/cert" }
      ] }
    ]
  },
  blogMenu("all"),
  COMPANY_MENU("all")
];

function multiTop(mode, group) {
  if (mode === "qa" || mode === "security") return "service";
  return group;
}

function fillMultiDrop(mode, group, child) {
  const sub = activeChild(group, child);
  const arrow = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`;
  const link = (href, label, on, cls = "") => `<a href="${href}"${cls ? ` class="${cls}"` : ""}${on ? ' aria-current="page"' : ""}>${label}</a>`;
  // 서비스: two framed sections. Each opens with its area (eyebrow, name, 사업 소개 link), then its menu.
  const EYEBROW = { qa: "SOFTWARE TEST &amp; QUALITY", security: "TBELL 정보보호 컨설팅" };
  const NAME = { qa: "QA", security: "보안 컨설팅" };
  const service = MULTI_MENU[0].sections.map((sec) => {
    const here = mode === sec.id;
    const groups = sec.groups.filter((g) => g.id);
    const nested = groups.some((g) => g.children);
    const body = nested
      ? `<div class="md-groups">${groups.map((g) => `
          <div class="md-group">
            ${link(g.href, g.label, here && group === g.id && !child, "md-gtitle")}
            ${(g.children || []).map((k) => link(k.href, k.label, here && group === g.id && sub === k.id, "md-leaf")).join("")}
          </div>`).join("")}</div>`
      : `<div class="md-rows">${groups.map((g) => link(g.href, `<span>${g.label}</span>${arrow}`, here && group === g.id, "md-row")).join("")}</div>`;
    return `
    <section class="md-sec md-${sec.id}${here ? " is-here" : ""}" aria-label="${NAME[sec.id]}">
      <header class="md-sec-head">
        <p class="md-eyebrow">${EYEBROW[sec.id]}</p>
        <div class="md-title"><b>${NAME[sec.id]}</b>${link(sec.href, `사업 소개${arrow}`, here && !group, "md-home")}</div>
      </header>
      ${body}
    </section>`;
  }).join("");
  const plainCol = (item) => item.children.every((g) => !g.children)
    ? `<div class="md-rows md-flat">${item.children.map((g) => link(g.href, `<span>${g.label}</span>${arrow}`, mode === "all" && group === item.id && activeChild(group, child) === g.id, "md-row")).join("")}</div>`
    : `<div class="md-groups md-plain">${item.children.map((g) => `
    <div class="md-group">
      ${link(g.href, g.label, mode === "all" && group === item.id && activeChild(group, child) === g.id, "md-gtitle")}
      ${(g.children || []).map((k) => link(k.href, k.label, mode === "all" && group === item.id && (child || "about") === k.id, "md-leaf")).join("")}
    </div>`).join("")}</div>`;
  const cols = [
    `<div class="drop-col md-panel md-service" data-id="service">${service}</div>`,
    `<div class="drop-col md-panel" data-id="blog">${plainCol(MULTI_MENU[1])}</div>`,
    `<div class="drop-col md-panel" data-id="company">${plainCol(MULTI_MENU[2])}</div>`
  ].join("");
  menuDrop.innerHTML = `<div class="drop-cols">${cols}</div>`;
  menuDrop.style.height = "0px";
  menuDrop.classList.remove("is-open");
}

function multiNav(mode, group, child) {
  const top = multiTop(mode, group);
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  return MULTI_MENU.map((item) => {
    const head = `<a href="${item.href}" data-id="${item.id}"${item.id === top ? ' aria-current="page"' : ""}>${item.label}</a>`;
    if (!mobile) return head;
    const kids = item.sections
      ? item.sections.map((sec) => `<span class="nav-sec">${sec.label}</span>` + sec.groups.map((g) => `<a href="${g.href}"${mode === sec.id && group === g.id ? ' aria-current="page"' : ""}>${g.label}</a>`).join("")).join("")
      : item.children.map((g) => `<a href="${g.href}"${item.id === group && activeChild(group, child) === g.id ? ' aria-current="page"' : ""}>${g.label}</a>`).join("");
    return head + `<div class="nav-sub">${kids}</div>`;
  }).join("");
}

function activeChild(group, child) {
  if (group === "types") return child || "outsourcing";
  if (group === "testops") return child || "build";
  if (group === "tauto") return child === "vux" ? "auto" : child || "overview";
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

function extAttrs(href) {
  return /^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
}

function fillDrop(menu, group, child) {
  const sub = activeChild(group, child);
  const cols = menu.map((item) => {
    const links = (item.children || []).map((entry) => `<a href="${entry.href}"${extAttrs(entry.href)}${item.id === group && entry.id === sub ? ' aria-current="page"' : ""}>${entry.label}</a>`).join("");
    return `<div class="drop-col" data-id="${item.id}">${links}</div>`;
  }).join("");
  menuDrop.innerHTML = `<div class="drop-side"></div><div class="drop-cols">${cols}</div><div class="drop-side"></div>`;
  menuDrop.style.height = "0px";
  menuDrop.classList.remove("is-open");
}

function menuFitHeight() {
  if (MULTI) return Math.min(menuDrop.querySelector(".drop-cols").offsetHeight, Math.max(0, window.innerHeight - header.offsetHeight));
  const columns = [...menuDrop.querySelectorAll(".drop-col")];
  const content = columns.reduce((max, col) => Math.max(max, col.offsetHeight), 0);
  const styles = getComputedStyle(menuDrop);
  const pad = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const cap = Math.max(0, window.innerHeight - header.offsetHeight);
  return Math.min(content + pad, cap);
}

function openMenu(id) {
  if (window.matchMedia("(max-width: 768px)").matches) return;
  // /multi shows one panel per item: entering the nav bar (or a gap in it) must not open an empty sheet.
  if (MULTI && !id) return;
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
      if (href && (location.hash || "#") !== href) {
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
    location.hash = "#security/inquiry";
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
    if (href) location.hash = href;
  });
}

function render() {
  const { mode, group, child, page: pageNo } = parse();
  // /multi keeps one blog, one company section and one inquiry page: send the per-area URLs there.
  if (MULTI && (mode === "qa" || mode === "security") && ["blog", "company", "inquiry"].includes(group)) {
    const to = group === "inquiry" ? "#inquiry/" + mode : "#" + group + (child ? "/" + child : "") + (pageNo ? "/" + pageNo : "");
    location.replace(to);
    return;
  }
  if (MULTI) return renderMulti(mode, group, child);
  // Inside a business area the logo returns to that area's home, not the root gate.
  logoLink.href = mode ? "#" + mode : "#";
  logoLink.setAttribute("aria-label", mode ? `TBELL ${MODE_LABEL[mode]} 홈` : "TBELL 홈");
  if (!mode) {
    activeMenu = [];
    logoMode.textContent = "";
    document.title = "TBELL";
    inquire.hidden = true;
    switchPanel.innerHTML = OTHERS[""].map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
    switchBtn.setAttribute("aria-expanded", "false");
    switchPanel.hidden = true;
    nav.innerHTML = "";
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    fillDrop([], "", "");
    content.innerHTML = gateHome();
    wireStages();
    window.scrollTo(0, 0);
    return;
  }
  const menu = MENUS[mode];
  activeMenu = menu;
  logoMode.textContent = MODE_LABEL[mode];
  document.title = "TBELL · " + MODE_LABEL[mode];
  inquire.hidden = false;
  inquire.textContent = "문의";
  inquire.href = "#" + mode + "/inquiry";

  switchPanel.innerHTML = OTHERS[mode].map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
  switchBtn.setAttribute("aria-expanded", "false");
  switchPanel.hidden = true;

  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const sub = activeChild(group, child);
  nav.innerHTML = menu.map((item) => {
    const top = `<a href="${item.href}" data-id="${item.id}"${extAttrs(item.href)}${item.id === group ? ' aria-current="page"' : ""}>${item.label}</a>`;
    if (!mobile || !item.children) return top;
    const kids = item.children.map((entry) => `<a href="${entry.href}"${extAttrs(entry.href)}${item.id === group && entry.id === sub ? ' aria-current="page"' : ""}>${entry.label}</a>`).join("");
    return top + `<div class="nav-sub">${kids}</div>`;
  }).join("");
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  fillDrop(menu, group, child);

  drawContent(mode, group, child);
}

function renderMulti(mode, group, child) {
  logoLink.href = "#";
  logoLink.setAttribute("aria-label", "TBELL 홈");
  logoMode.textContent = "";
  document.title = mode && mode !== "all" ? "TBELL · " + MODE_LABEL[mode] : "TBELL";
  inquire.hidden = false;
  inquire.textContent = "문의";
  inquire.href = "#inquiry/" + (mode === "security" ? "security" : "qa");
  nav.innerHTML = multiNav(mode, group, child);
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  fillMultiDrop(mode, group, child);
  if (!mode) {
    content.innerHTML = multiHome();
    wireStages();
    window.scrollTo(0, 0);
    return;
  }
  drawContent(mode, group, child);
}

function drawContent(mode, group, child) {
  const bucket = DRAW[mode];
  const draw = bucket[group] || bucket[""];
  content.innerHTML = draw.length ? draw(child, mode) : draw();
  wireDeck();
  wireJump();
  wireDiagnose();
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
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      stageObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll(".stage, [data-count-zone]").forEach((el) => stageObserver.observe(el));
}

switchBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = switchBtn.getAttribute("aria-expanded") === "true";
  switchBtn.setAttribute("aria-expanded", String(!open));
  switchPanel.hidden = open;
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".switch")) {
    switchBtn.setAttribute("aria-expanded", "false");
    switchPanel.hidden = true;
  }
});
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
// Moving between pages of one QA deck (테스트 종류, TestOps, 회사…) morphs the shared pieces — the
// section headings and the box diagram — with a view transition instead of a hard cut.
if (MULTI) document.body.classList.add("is-multi");
let lastRoute = parse();
window.addEventListener("hashchange", () => {
  const prev = lastRoute;
  const next = parse();
  lastRoute = next;
  const deck = prev.mode === next.mode && prev.group === next.group && prev.child !== next.child && document.querySelector(".svc-page");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!deck || still || !document.startViewTransition) { render(); return; }
  // The transition waits for a painted frame; if none comes (throttled tab), render anyway.
  let done = false;
  const once = () => { if (!done) { done = true; render(); } };
  const vt = document.startViewTransition(once);
  setTimeout(() => { if (!done) { vt.skipTransition(); once(); } }, 400);
});
render();
