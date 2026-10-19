const BLOG_CATS = [
  {
    id: "qa-insight", name: "QA Insight", modes: ["qa"],
    children: [
      { id: "qa-basic", name: "QA 기본·실무", nos: [22] },
      { id: "auto-tool", name: "테스트 자동화·도구", nos: [23] },
      { id: "ai-data", name: "AI·데이터 품질", nos: [24] },
      { id: "trend", name: "품질 사례·트렌드", nos: [25] }
    ]
  },
  { id: "security", name: "보안", modes: ["security"], nos: [28] },
  { id: "newsletter", name: "NewsLetter", modes: ["qa", "security"], nos: [7] },
  { id: "event", name: "전시·행사", modes: ["qa", "security"], nos: [10] },
  { id: "activity", name: "성과·활동", modes: ["qa", "security"], nos: [18] }
];

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
    href: "#" + mode + "/blog",
    children: blogNodes(mode).map((cat) => ({
      id: cat.id,
      label: cat.name,
      href: "#" + mode + "/blog/" + cat.id
    }))
  };
}

const COMPANY_MENU = (mode) => ({
  id: "company",
  label: "회사 소개",
  href: "#" + mode + "/company",
  children: [
    {
      id: "about", label: "회사소개", href: "#" + mode + "/company/about",
      children: [
        { id: "about", label: "회사소개", href: "#" + mode + "/company/about" },
        { id: "vision", label: "경영철학", href: "#" + mode + "/company/vision" },
        { id: "history", label: "연혁", href: "#" + mode + "/company/history" }
      ]
    },
    {
      id: "recruit", label: "인재채용", href: "#" + mode + "/company/recruit",
      children: [
        { id: "benefit", label: "복리후생", href: "#" + mode + "/company/benefit" },
        { id: "recruit", label: "인재채용", href: "#" + mode + "/company/recruit" }
      ]
    },
    {
      id: "esg", label: "지속가능경영", href: "#" + mode + "/company/esg",
      children: [
        { id: "ethical", label: "윤리경영", href: "#" + mode + "/company/ethical" },
        { id: "social", label: "사회경영", href: "#" + mode + "/company/social" },
        { id: "environmental", label: "환경경영", href: "#" + mode + "/company/environmental" }
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
      id: "tauto", label: "T-AUTO", href: "#qa/tauto",
      children: [
        { id: "lens", label: "T-LENS", href: "#qa/tauto/lens" },
        { id: "voc", label: "T-VOC", href: "#qa/tauto/voc" },
        { id: "vux", label: "VUX", href: "#qa/tauto/vux" }
      ]
    },
    {
      id: "tassi", label: "T-ASSI", href: "http://t-assi.co.kr/",
      children: [
        { id: "intro", label: "T-ASSI 소개", href: "http://t-assi.co.kr/service" }
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

const MODE_LABEL = { qa: "QA", security: "정보보호" };

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

function bounce(word) {
  return `<div class="bounce" data-bounce="${word}"></div>`;
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

function originMain() {
  const copy = `<div class="stage-center"><h2>기업 및 프로젝트의 특성에\n최적화된 고객 맞춤형 테스트</h2><p>테스트 아웃소싱 전문 기업 TBELL</p><a class="more" href="#qa/types">VIEW MORE</a></div>`;
  const ops = `<div class="stage-center"><h2>TestOps</h2><p>티벨은 최신 테스트 자동화 기술을 적용한 TestOps\n환경 구축을 통해 고객에게 최적의 가치를 제공하고 있습니다.</p><a class="more" href="#qa/testops">VIEW MORE</a></div>`;
  const label = `<div class="stage-center"><h2>데이터 라벨링 플랫폼</h2><p>데이터 수집에서 정제, 전처리, 분석, 가공, 시각화, 배포, 관리까지!\n원하는 기능을 선택하여 활용 가능합니다.</p>${bounce("SSLO")}</div>`;
  return [
    stagePhoto("shade-a", { pc: "sec-main-001.2becab69b548a8cf401d.png", tablet: "sec-main-tablet-001.81e3f7ea7a2a69dbec77.png", mobile: "sec-main-mobile-001.2a0ff5d2df2b1913eb7a.png" }, copy),
    stagePhoto("shade-b", { pc: "sec-main-002.2e4090c5e8921c5fcc33.png", tablet: "sec-main-tablet-002.1317fc7543a9d207f03d.png", mobile: "sec-main-mobile-002.70747ccffb2ac394fa5b.png" }, ops),
    stage("shade-c", `<div class="stage-split"><div><h2>스타트업 최적화 테스트 플랫폼 T-ASSI</h2><p>스타트업 대상으로 런칭 전 검수를 통해 안정적인 서비스 오픈이\n될 수 있도록 합리적인 가격에 서비스를 제공해 드리고 있습니다.</p><a class="more" href="http://t-assi.co.kr/" target="_blank" rel="noopener noreferrer">바로가기</a></div><img src="assets/origin/sec-main-003.548f73b5613e8f388fa9.png" alt=""></div>`),
    stagePhoto("shade-d", { pc: "sec-main-004.9d90b65a79f55720925e.png", tablet: "sec-main-tablet-004.34894a25d932823369af.png", mobile: "sec-main-mobile-004.7e5a48c3f320661eae16.png" }, label),
    stage("shade-e", `<div class="stage-center"><h2>티벨과 함께하는 고객사</h2></div>`)
  ].join("");
}

function qaHome() {
  return originMain();
}

const ORIGIN = "assets/origin/";

function stagePhoto(kind, spec, inner) {
  return `<section class="stage ${kind} photo">${shot(spec)}<div class="stage-overlay">${inner}</div></section>`;
}

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
      <span><strong>${id} ${title}</strong><em>${desc}</em></span>
    </button>`).join("");
  return `
    ${shot({ pc: "content-outsourcing-01.e7d68115b2bd091842e0.png", tablet: "content-tablet-outsourcing-01.a4966949f2bf68d3b4e9.png", mobile: "content-mobile-outsourcing-01.e9853a0c30a020548304.png" })}
    <div class="expand-row">${cards}</div>
    ${shot({ pc: "content-outsourcing-02.e2618bd66c15e03b421e.png", tablet: "content-outsourcing-02-tablet.png", mobile: "content-outsourcing-02-mobile.png" })}
    <div class="contact-row">
      <div><img src="${ORIGIN}icon-mail.svg" alt=""><div><strong>staff@tbell.co.kr</strong><span>이메일로 문의 가능합니다.</span></div></div>
      <div><img src="${ORIGIN}icon-phone.svg" alt=""><div><strong>070.7777.9113</strong><span>월-금요일 09:30-18:00 / 점심 12:00-13:00</span></div></div>
    </div>`;
}

function imageBody(spec) {
  return shot(spec);
}

function blackboxBody() {
  const domains = DOMAINS.map(([title, image]) => `<figure><img src="${ORIGIN}${image}" alt=""><figcaption>${title}</figcaption></figure>`).join("");
  return `
    ${shot({ pc: "content-blackbox-01.62900f12e2b31f7a30a8.png", tablet: "content-tablet-blackbox-01.1d54b655f647e1c7dbd0.png", mobile: "content-mobile-blackbox-01.576cc606454e2295d031.png" })}
    <div class="domain-row">${domains}</div>
    ${shot({ pc: "content-blackbox-02.5ca02fe35e6a35d34ae4.png", tablet: "content-tablet-blackbox-02.912af858d8134fcc659e.png", mobile: "content-mobile-blackbox-02.a1e63e996b45ecb3bc25.png" })}`;
}

function testopsBody() {
  return `
    ${shot({ pc: "content-testops-01.82c903b0f03221d2a802.png", tablet: "content-tablet-testops-01.bf5267c6b5d517a9dae4.png", mobile: "content-mobile-testops-01.689f9cf0e3ce6bcafabf.png" })}
    <div class="svc-fit desk"><img src="${ORIGIN}item-testops-001.46b4233b27dcbcfd51d7.png" alt=""></div>
    <div class="svc-scroll"><img src="${ORIGIN}item-mobile-testops-001.fe015dfee9aca576993c.png" alt=""></div>
    <h2 class="svc-midtitle">BBD 기반 TestOps 환경 구축</h2>
    ${shot({ pc: "content-testops-02.c917b398ec45e9a0b4c0.png", tablet: "content-tablet-testops-02.3fd0aa58d9866454d414.png", mobile: "content-mobile-testops-02.bf4ba39492f68346ae95.png" })}
    <div class="svc-fit desk"><img src="${ORIGIN}item-testops-002.ba4781e8d62510f503e2.png" alt=""></div>
    <div class="svc-scroll"><img src="${ORIGIN}item-mobile-testops-002.67426c144385d8f87ac3.png" alt=""></div>
    ${shot({ pc: "content-testops-03.23604e113f9c64c69806.png", tablet: "content-tablet-testops-03.00f991688d00b429f643.png", mobile: "content-mobile-testops-03.0046d38078a00622890f.png" })}`;
}

function aitestBody() {
  return `
    <div class="desk">${shot({ pc: "content-aitest.e9447993b4821f5bd125.png", tablet: "content-tablet-aitest.ad8cdb2fab54aa6079c3.png" })}</div>
    <div class="mob-only">
      <img src="${ORIGIN}content-mobile-aitest-01.ed059f58ae0c5e71ba34.png" alt="">
      <div class="svc-scroll"><img src="${ORIGIN}item-mobile-aitest-01.8ab522a53ae9095d625a.png" alt=""></div>
      <img src="${ORIGIN}aitest-mobile-tail.png" alt="">
    </div>`;
}

const SERVICE_SLIDES = [
  { id: "outsourcing", title: "Outsourcing Test", desc: "티벨의 아웃소싱 테스트는 기업 및\n프로젝트의 특성에 맞춘 고객 맞춤형 테스트입니다.", tags: ["Web/App", "IoT/AI", "Embedded", "Finance", "Automotive"], bg: ["bg-outsourcing.b46a027c427ae59d3db3.png", "bg-tablet-outsourcing.b7693ae7435210848e2c.png", "bg-mobile-outsourcing.bf9d543859738afb6936.png"], body: outsourcingBody },
  { id: "automation", title: "Test Automation", desc: "티벨만의 차별화된 자동화 테스트 서비스를 통해 보다\n높은 수준의 품질 및 고객 만족 향상을 약속드립니다.", tags: ["안전성", "효율성", "전문성", "비용절감"], bg: ["bg-automation.eebf3b3db228963a7d7e.png", "bg-tablet-automation.42cf3238c4db4de3a5c2.png", "bg-mobile-automation.981f021b70be98f47f4a.png"], body: () => imageBody({ pc: "content-automation.9594e2423a9ea60bd185.png", tablet: "content-tablet-automation.719d5deaf1e5e74994f9.png", mobile: "content-mobile-automation.13273d2eab8ace9691b5.png" }) },
  { id: "blackbox", title: "Blackbox Test", desc: "제품 개발을 위해 작성된 개발 명세서를 기반으로\n테스트 시나리오를 작성하고 테스트를 수행함으로써\n제품 품질 개선 활동하는 테스트 서비스입니다.", tags: ["Interface Test", "System Test", "Intergration Test", "Sanity Test", "Regression Test", "Acceptanace Test"], bg: ["bg-blackbox.93002ce8bac79cfd0f1f.png", "bg-tablet-blackbox.08b799c93405378cd9f7.png", "bg-mobile-blackbox.deb03514f8108bd54281.png"], body: blackboxBody },
  { id: "whitebox", title: "Whitebox Test", desc: "화이트박스 테스트(WhiteBox Test)기법은 소프트웨어\n내부 소스 코드를 테스트하는 기법으로써 동작의\n유효성 뿐만아니라 실행 되는 과정을 살펴보는 테스트입니다.", tags: ["Static Test", "Dynamic Test"], bg: ["bg-whitebox.dd0f3a71aa3621b95657.png", "bg-tablet-whitebox.237c155d7035df71b7b8.png", "bg-mobile-whitebox.5a13073380c9706e9e8a.png"], body: () => imageBody({ pc: "content-whitebox.23e315717992b132f3f2.png", tablet: "content-tablet-whitebox.8326ffa2ca04cf6eda6b.png", mobile: "content-mobile-whitebox.5a9849a6f5cb181a9eb1.png" }) },
  { id: "api", title: "API Test", desc: "서로 다른 소프트웨어 시스템 사이에\n통신과 연동을 위해 API 테스트는 필수적입니다.", tags: ["기능", "안정성", "성능"], bg: ["bg-api.c29a3eb4a94183fda704.png", "bg-tablet-api.0d2bd87a550607f6f885.png", "bg-mobile-api.f4098575a7ef1dc638a9.png"], body: () => imageBody({ pc: "content-api.4f76bf157990b790291a.png", tablet: "content-tablet-api.18563e61a62f2a226d7b.png", mobile: "content-mobile-api.aebfeaceee9a3b133b0f.png" }) },
  { id: "perfomance", title: "", desc: "", tags: [], bg: ["bg-perfomance.970f68cd64a2613d1c03.png", "bg-tablet-perfomance.defe2610687b7c8a7569.png", "bg-mobile-perfomance.4b266306d8c200a4bea8.png"], body: () => imageBody({ pc: "content-perfomance.f4c2ac0d9b3799f362aa.png", tablet: "content-tablet-perfomance.b9fa35e2c1f3e7541bcf.png", mobile: "content-mobile-perfomance.2e6e983d78728d88b3cc.png" }) }
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

function tautoHome() {
  return page("T-AUTO", "T-AUTO", "소프트웨이브 2024에서 티벨은 소프트웨어 테스트 자동화를 지원하는 T-AUTO를 소개했습니다. 이 메뉴에는 그 자동화 축과, 이어서 공개된 LLM 평가·VOC 자동화·음성 검증을 둡니다.", `
    <div class="grid">
      ${card("#qa/tauto/lens", "2026.01", "T-LENS", "LLM 응답을 점수와 사유로 평가하는 시스템입니다.")}
      ${card("#qa/tauto/voc", "VOC", "T-VOC", "금융사 VOC 관리 자동화로 시작된 구축 서비스입니다.")}
      ${card("#qa/tauto/vux", "VUX", "음성 검증", "TTS·STT로 고객 상담 시나리오를 자동 검증합니다.")}
    </div>
    <p class="note">T-AUTO 명칭 출처: 전자신문, 소프트웨이브 2024 현장 사진 설명.</p>`);
}

function lens() {
  return page("T-LENS", "T-LENS", "TBELL LLM Evaluation and Scoring System. 2026년 1월 13일 전자신문 보도 기준으로, LLM 기반 서비스 품질을 자동으로 평가·검증하는 시스템입니다.", `
    <div class="list">
      <article><h3>평가 방식</h3><p>LLM-as-a-Judge로 평가자 편차를 줄입니다. 챗봇 검증용 질문·응답 데이터셋으로 평가 프롬프트를 만들고, 여러 Judge 모델이 응답 품질을 점수와 사유로 냅니다.</p></article>
      <article><h3>쓰는 범위</h3><p>시나리오 전체의 End-to-End 검증, 버전 변경 전후 비교, 새 모델 적용 시 품질 안정성 확인. 지표는 서비스 특성에 맞게 바꿀 수 있습니다.</p></article>
      <article><h3>실행 환경</h3><p>AWS 기반이며 Device Farm으로 Android, iOS, 웹을 포함한 멀티 디바이스 테스트를 지원합니다. 결과는 대시보드에서 봅니다.</p></article>
      <article><h3>티벨의 설명</h3><p>연구소장 이혜진 이사는 T-LENS를 평가 도구를 넘어 AI 서비스 품질을 관리하고 개선하는 기준으로 소개했습니다. 티벨은 이후 AI 테스트 자동화와 테스트 케이스 자동 생성으로 범위를 넓히겠다고 밝혔습니다.</p></article>
    </div>
    <p class="note">출처: 전자신문, 2026-01-13, 「티벨, LLM 평가·검증 자동화 시스템 T-LENS 공식 런칭」.</p>`);
}

function voc() {
  return page("T-VOC", "T-VOC", "전자신문 보도는 제품명 T-VOC 대신, 2020년 금융사 VOC 관리 자동화 프로세스 구축으로 시작해 10여 개 고객사에 요구사항에 맞춘 자동화 구축을 제공해 온 서비스로 적고 있습니다.", `
    <div class="list">
      <article><h3>공개된 사실</h3><p>고객 요구에 맞춘 자동화 구축으로 서비스 운영을 지원합니다. QA 코리아 컨퍼런스 2025와 SOTEC 2025 기사 모두 이 VOC 자동화를 테스트 자동화 레퍼런스의 출발점으로 함께 소개합니다.</p></article>
      <article><h3>옆에 둔 기술</h3><p>같은 기사들은 고객 발화와 시나리오를 분석하고, 자동화 가능한 케이스를 가려 CI/CD와 검증 자동화 프로세스를 만드는 흐름을 설명합니다. 음성 구간은 VUX 메뉴에서 따로 봅니다.</p></article>
    </div>
    <p class="note">출처: 전자신문, SOTEC 2025 (2025.05), QA 코리아 컨퍼런스 2025 (2025.07).</p>`);
}

function vux() {
  return page("VUX", "VUX 음성 테스트", "Voice User Experience 기반 AI 고객 상담 검증 자동화입니다. SOTEC 2025와 QA 코리아 컨퍼런스 2025, STK 2025에서 공개됐습니다.", `
    <div class="list">
      <article><h3>수행 방식</h3><p>테스터가 직접 말하지 않고 TTS와 STT로 발화합니다. 주변 소음이나 돌발 상황의 영향을 줄이고 상담 시나리오를 반복 검증합니다.</p></article>
      <article><h3>케이스 선별</h3><p>상담 중 가능한 고객 발화와 그 발화에 따른 시나리오를 분석합니다. 전체 케이스를 검증·응답 유형으로 나눈 뒤, 자동화할 수 있는 케이스를 골라 CI/CD 환경에 넣습니다.</p></article>
    </div>
    <p class="note">출처: 전자신문, SOTEC 2025 · STK 2025 · QA 코리아 컨퍼런스 2025.</p>`);
}

function securityHome() {
  return `<section class="detail">
    <div class="banner">
      <p class="kicker">TBELL 정보보호 컨설팅</p>
      <h1>우리 회사에 필요한 보안 인증,<br>2분이면 알 수 있습니다.</h1>
      <p class="lede">어떤 인증이 의무인지, 기한은 언제인지, 오늘 무엇부터 시작해야 하는지. 질문 몇 개에 답하면 바로 확인할 수 있고, 그 결과를 그대로 보내 주시면 티벨이 컨설팅 계획으로 답합니다.</p>
      <div class="actions">
        <a class="pill" href="#security/diagnose">2분 셀프 진단 시작</a>
        <a class="pill ghost" href="#security/services">서비스 보기</a>
      </div>
      <ul class="metrics" aria-label="셀프 진단으로 알 수 있는 것">
        <li><span>WHAT</span><strong>해당되는 의무·인증</strong></li>
        <li><span>WHEN</span><strong>시행·심사 기한</strong></li>
        <li><span>START</span><strong>착수해야 할 날짜</strong></li>
      </ul>
    </div>
    <div class="sheet">
      <div class="sec-block" id="clock">
        <p class="sec-k">기준일 2026.10</p>
        <h2>지금 바뀌고 있는 규제</h2>
        <ol class="timeline">
          <li><span class="when">2025.10.31</span><div><h3>ISO/IEC 27001:2013 인증 효력 종료</h3><p>2022판 전환 완료 필요</p></div></li>
          <li><span class="when">2026.01.22</span><div><h3>AI 기본법 시행</h3><p>고영향 AI·생성형 AI 사업자 의무</p></div></li>
          <li><span class="when">2026 하반기</span><div><h3>ISMS·ISMS-P 사후관리 강화</h3><p>중대 사고 시 특별 사후심사·인증 취소 근거</p></div></li>
          <li><span class="when">2027</span><div><h3>ISMS-P 등급제·강화 기준 적용</h3><p>간편·표준·강화 3단계, 예비심사·기술심사 도입</p></div></li>
          <li><span class="when">2027.07 예정</span><div><h3>중요 개인정보처리자 ISMS-P 의무화</h3><p>대상 기준은 고시로 확정 예정</p></div></li>
        </ol>
        <p class="note">정부 발표·보도 기준이며 세부 일정은 법령·고시 개정에 따라 바뀔 수 있습니다.</p>
        <p><a href="#security/cert">2027 심사 개편 보기</a></p>
      </div>
      <div class="sec-block" id="routes">
        <p class="sec-k">Start here</p>
        <h2>필요한 만큼만 골라 보세요</h2>
        <p>진단, 서비스 범위, 인증 준비는 서로 다른 질문입니다. 지금 궁금한 것부터 보면 됩니다.</p>
        <div class="sec-grid">
          <a href="#security/diagnose"><span class="sec-k">01</span><h3>셀프 진단</h3><p>업종과 규모를 고르면 해당 의무와 목표 심사일 기준 착수일이 바로 나옵니다.</p><span class="go">진단 시작</span></a>
          <a href="#security/services"><span class="sec-k">02</span><h3>서비스·계약</h3><p>관리체계, 개인정보, 거버넌스, 신기술 리스크. 진행 단계와 계약 방식까지 한곳에서 확인합니다.</p><span class="go">서비스 보기</span></a>
          <a href="#security/cert"><span class="sec-k">03</span><h3>인증 컨설팅</h3><p>ISMS·ISMS-P·ISO 차이와 2027년 심사 변화, 권장 일정과 인증 이후 3년을 정리했습니다.</p><span class="go">인증 살펴보기</span></a>
        </div>
      </div>
      <div class="sec-block" id="principles">
        <p class="sec-k">How we work</p>
        <h2>진단 다음은 실행입니다</h2>
        <p>확인한 의무를 실제 인증과 보안 체계로 만드는 과정에서, 보안 담당자들이 이전 컨설팅에서 겪은 세 가지 아쉬움을 이렇게 해결합니다.</p>
        <div class="sec-grid">
          <article><span class="sec-k">01 · 공개</span><h3>일정과 산출물을 먼저 보여 드립니다</h3><p class="pain"><b>아쉬움</b>언제 끝나는지, 무엇을 받는지 계약 후에야 알 수 있었다.</p><p>착수 전에 주 단위 일정표와 단계별 산출물 목록을 확정합니다. 견적은 대상 범위와 투입 인력 기준을 함께 제시합니다.</p></article>
          <article><span class="sec-k">02 · 통합</span><h3>한 번의 진단으로 여러 기준에 대응합니다</h3><p class="pain"><b>아쉬움</b>ISMS-P, ISO 27001, 공시 대응을 할 때마다 같은 자료를 다시 만들었다.</p><p>자산 목록, 위험평가, 정책 문서를 기준 간 매핑표로 연결해 한 번 만든 증적을 여러 인증과 점검에 다시 씁니다.</p></article>
          <article><span class="sec-k">03 · 동행</span><h3>인증서 발급 이후까지 함께합니다</h3><p class="pain"><b>아쉬움</b>인증을 받고 나면 컨설턴트가 떠나고, 사후심사는 혼자 준비했다.</p><p>3년 인증 주기 전체를 하나의 계획으로 설계합니다. 사후심사와 갱신심사, 규제 변경 대응까지 같은 컨설턴트가 이어서 맡습니다.</p></article>
        </div>
      </div>
      <div class="sec-block" id="domains-home">
        <p class="sec-k">Services</p>
        <h2>네 가지 영역에서 시작합니다</h2>
        <p>조직의 상황에 맞는 영역을 고르고, 범위는 상담에서 조정합니다.</p>
        <div class="domain-links">
          <a href="#security/services" data-jump="domain-a"><span>DOMAIN A</span><strong>관리체계·인증</strong><p>ISMS·ISMS-P, ISO 27001 계열의 취득과 유지</p></a>
          <a href="#security/services" data-jump="domain-b"><span>DOMAIN B</span><strong>개인정보 보호</strong><p>처리 흐름, 수탁사, 가명정보, 국외 이전</p></a>
          <a href="#security/services" data-jump="domain-c"><span>DOMAIN C</span><strong>보안 전략·거버넌스</strong><p>마스터플랜, 공시, Virtual CISO 자문</p></a>
          <a href="#security/services" data-jump="domain-d"><span>DOMAIN D</span><strong>신기술 리스크</strong><p>AI, 클라우드, 공급망 기술적 진단</p></a>
        </div>
      </div>
      <div class="sec-block">
        <p class="sec-k">Commitments</p>
        <h2>티벨 컨설팅의 네 가지 약속</h2>
        <div class="items">
          <article><h3>착수 전 일정 확정</h3><p>주 단위 일정표와 산출물 목록을 계약 단계에서 확정하고, 변경이 생기면 사유와 함께 먼저 알립니다.</p></article>
          <article><h3>담당 컨설턴트 고정</h3><p>착수부터 심사 대응, 사후관리까지 같은 책임 컨설턴트가 맡습니다.</p></article>
          <article><h3>인증서 발급까지 지원</h3><p>심사에서 나온 결함의 보완조치를 마치고 인증서가 발급될 때까지 함께 대응합니다.</p></article>
          <article><h3>규제 변경 알림</h3><p>계약 기간 중 고객사에 영향을 주는 법령·고시 변경이 생기면 영향 분석과 함께 안내합니다.</p></article>
        </div>
      </div>
      <div class="sec-block">
        <p class="sec-k">Next</p>
        <h2>진단 결과를 보내 주시면, 계획으로 답합니다.</h2>
        <div class="actions">
          <a class="pill" href="#security/diagnose">셀프 진단 시작</a>
          <a class="pill ghost" href="#security/inquiry">바로 상담 신청</a>
        </div>
      </div>
    </div>
  </section>`;
}

function diagnose() {
  return page("Compliance Navigator", "질문에 답하면 의무와 일정이 바로 나옵니다", "STEP 1에서 해당되는 의무를 확인하고, STEP 2에서 목표 심사일을 넣어 착수일을 계산하세요. STEP 3에서 그 결과로 바로 상담을 신청할 수 있습니다.", `
    <div class="navi" id="step-1">
      <form class="navi-q" id="navi-form" aria-label="의무 진단 질문">
        <div><div class="sec-k">STEP 1 · 의무 진단</div><h2>조직 정보를 선택하세요</h2></div>
        <div class="q-group">
          <label class="q-label" for="q-sector">업종</label>
          <select id="q-sector">
            <option value="online" selected>온라인 서비스·플랫폼</option>
            <option value="finance">금융·핀테크</option>
            <option value="medical">의료(병원)</option>
            <option value="univ">교육(대학)</option>
            <option value="mfg">제조</option>
            <option value="public">공공기관</option>
            <option value="etc">기타</option>
          </select>
        </div>
        <fieldset class="q-group">
          <legend>해당하는 항목을 모두 고르세요</legend>
          <label class="check"><input type="checkbox" id="q-rev" checked>정보통신서비스 부문 전년도 매출 100억 원 이상</label>
          <label class="check"><input type="checkbox" id="q-users">직전 3개월 일평균 이용자 100만 명 이상</label>
          <label class="check"><input type="checkbox" id="q-infra">전국 단위 통신망 사업(ISP) 또는 데이터센터(IDC) 운영</label>
          <label class="check"><input type="checkbox" id="q-pii" checked>개인정보 보유 규모가 100만 명 이상</label>
          <label class="check"><input type="checkbox" id="q-ai" checked>AI 기능이 들어간 서비스를 제공하거나 준비 중</label>
          <label class="check"><input type="checkbox" id="q-global">해외 고객사가 있거나 해외 진출 예정</label>
          <label class="check"><input type="checkbox" id="q-cloud">공공기관에 SaaS·클라우드 서비스를 공급하거나 예정</label>
          <label class="check"><input type="checkbox" id="q-listed">상장사이거나 연 매출 3,000억 원 이상</label>
        </fieldset>
        <fieldset class="q-group">
          <legend>보유 중인 인증</legend>
          <div class="pills">
            <label><input type="checkbox" id="h-isms" checked>ISMS</label>
            <label><input type="checkbox" id="h-ismsp">ISMS-P</label>
            <label><input type="checkbox" id="h-iso">ISO 27001</label>
          </div>
        </fieldset>
      </form>
      <div class="navi-r" aria-live="polite">
        <div><div class="sec-k">결과</div><h2 id="r-title">검토가 필요한 항목</h2></div>
        <p class="r-sum" id="r-sum"></p>
        <ul class="r-list" id="r-list"></ul>
        <p class="note">처음 화면은 예시 선택 상태입니다. 결과는 공개된 법령·정부 발표를 바탕으로 한 참고용이며, 최종 해당 여부는 상담에서 확인합니다.</p>
      </div>
    </div>
    <div class="planner" id="step-2">
      <div class="plan-top">
        <div>
          <div class="sec-k">STEP 2 · 목표일 역산</div>
          <h2>언제 인증심사를 받을 계획인가요?</h2>
          <p class="note">목표 심사일을 정하면 착수부터 심사까지 약 30주 권장 일정을 날짜에 맞춰 역산합니다.</p>
        </div>
        <div class="plan-in">
          <label for="p-target">목표 인증심사 시작일</label>
          <input type="date" id="p-target" value="2027-05-03">
        </div>
      </div>
      <div class="plan-metrics" id="plan-summary" aria-live="polite"></div>
      <div class="plan-status" id="p-verdict" role="status"></div>
      <div id="sched-cal" aria-live="polite"></div>
      <ol class="sr-only" id="p-steps"></ol>
    </div>
    <div class="step-cta" id="step-3">
      <div>
        <span class="sec-k">STEP 3 · 상담 신청</span>
        <h2>이 결과로 컨설팅 계획을 받아 보세요</h2>
        <p>진단 결과와 계산한 일정이 상담 신청서에 자동으로 들어갑니다. 이름과 연락처만 더하면 됩니다.</p>
      </div>
      <button type="button" class="pill" id="to-contact">이 결과로 상담 신청</button>
    </div>`, [
    ["step-1", "의무 진단"],
    ["step-2", "일정 역산"],
    ["step-3", "상담 신청"]
  ]);
}

function services() {
  return page("Services", "네 가지 영역의 정보보호 컨설팅", "관리체계와 인증부터 AI·클라우드 같은 새로운 위험까지, 조직의 상황에 맞는 영역을 골라 시작할 수 있습니다. 진행 단계와 계약 방식은 이 페이지에서 이어서 확인합니다.", `
    <div id="domains">
      <article class="domain" id="domain-a">
        <div class="domain-head"><span class="sec-k">DOMAIN A</span><h2>관리체계·인증</h2><p>국내외 정보보호 인증을 준비하고, 인증을 받은 뒤에도 기준에 맞게 운영되도록 돕습니다.</p></div>
        <div class="items">
          <article><h3>ISMS·ISMS-P 인증 <span class="tag alt">2027 개편</span></h3><p>최초·사후·갱신 심사 대응, 등급제·예비심사 대비</p></article>
          <article><h3>ISO/IEC 27001 계열 인증</h3><p>27001·27701·27017·27018 신규 취득과 통합 운영</p></article>
          <article><h3>인증 유지 관리</h3><p>연간 내부점검, 변경 영향 분석, 사후심사 결함 조치</p></article>
          <article><h3>복수 인증 통합</h3><p>ISMS-P와 ISO 인증 간 통제 매핑, 증적 일원화</p></article>
        </div>
      </article>
      <article class="domain" id="domain-b">
        <div class="domain-head"><span class="sec-k">DOMAIN B</span><h2>개인정보 보호</h2><p>개인정보가 수집되어 파기될 때까지 흐름을 따라가며 법적 요구사항과 실제 운영의 차이를 찾습니다.</p></div>
        <div class="items">
          <article><h3>개인정보 관리수준 진단</h3><p>처리 흐름 분석, 안전성 확보조치 기준 이행 점검</p></article>
          <article><h3>수탁사·위탁 관리 점검</h3><p>위탁 계약·관리감독 체계 수립, 수탁사 현장 점검</p></article>
          <article><h3>가명정보 처리 컨설팅</h3><p>가명처리 절차·적정성 검토, 결합 전후 관리 체계</p></article>
          <article><h3>국외 이전·해외 규제 대응</h3><p>GDPR 등 해외 개인정보 규제 요구사항 갭 분석</p></article>
        </div>
      </article>
      <article class="domain" id="domain-c">
        <div class="domain-head"><span class="sec-k">DOMAIN C</span><h2>보안 전략·거버넌스</h2><p>경영진이 보안 예산과 우선순위를 결정할 수 있도록 현재 수준과 목표, 그 사이의 경로를 그립니다.</p></div>
        <div class="items">
          <article><h3>정보보호 마스터플랜</h3><p>현황 진단, 목표 모델, 3개년 이행 로드맵과 예산안</p></article>
          <article><h3>제로트러스트·N2SF 전환</h3><p>가이드라인 기반 성숙도 진단, 단계별 전환 계획</p></article>
          <article><h3>정보보호 공시 대응</h3><p>공시 항목별 현황 정리, 투자·인력 산정 기준 검토</p></article>
          <article><h3>Virtual CISO 자문 <span class="tag">구독형</span></h3><p>외부 전문가가 정보보호최고책임자(CISO)의 판단과 경영진 보고를 월 단위로 지원</p></article>
        </div>
      </article>
      <article class="domain" id="domain-d">
        <div class="domain-head"><span class="sec-k">DOMAIN D</span><h2>신기술 리스크</h2><p>기존 인증 기준만으로는 다루기 어려운 AI, 클라우드, 공급망 위험을 따로 진단합니다.</p></div>
        <div class="items">
          <article><h3>AI 거버넌스 <span class="tag">AI</span></h3><p>AI 기본법 의무 검토, ISO/IEC 42001 준비, AI 위험·영향평가 체계</p></article>
          <article><h3>클라우드 보안 아키텍처</h3><p>멀티클라우드 보안 설계 검토, 책임공유모델 기반 통제 정의</p></article>
          <article><h3>SW 공급망 보안</h3><p>SBOM 관리 정책, 오픈소스 사용 기준, 협력사 보안 평가 체계</p></article>
          <article><h3>기술적 취약점 진단·모의해킹</h3><p>인프라·웹·모바일 진단으로 관리체계 컨설팅의 기술 근거 확보</p></article>
        </div>
      </article>
    </div>
    <div class="sec-block" id="method">
      <p class="sec-k">How it runs</p>
      <h2>무엇을 받는지, 계약 전에 확인하세요</h2>
      <p>티벨 컨설팅은 6단계로 진행됩니다. 단계마다 받는 문서가 정해져 있어 진행 상황을 직접 확인할 수 있습니다. 실제 범위는 셀프 진단 결과와 상담 내용에 맞춰 조정합니다.</p>
      <div class="method">
        <article><span class="sec-k">STEP 1</span><h3>착수·범위 정의</h3><p>대상 조직, 시스템, 적용 기준과 규제 기한을 확정합니다.</p><ul class="m-out"><li>수행계획서</li><li>범위 정의서</li><li>주 단위 일정표</li></ul></article>
        <article><span class="sec-k">STEP 2</span><h3>현황 분석·GAP</h3><p>인터뷰와 문서·시스템 검토로 기준 대비 현재 수준을 측정합니다.</p><ul class="m-out"><li>현황 분석서</li><li>GAP 분석 보고서</li><li>기준 간 매핑표</li></ul></article>
        <article><span class="sec-k">STEP 3</span><h3>위험평가</h3><p>자산과 위협을 평가하고, 경영진과 허용 위험 수준(DoA)을 정합니다.</p><ul class="m-out"><li>정보자산 목록</li><li>위험평가 보고서</li><li>DoA 결정서</li></ul></article>
        <article><span class="sec-k">STEP 4</span><h3>보호대책·로드맵</h3><p>위험별 대책과 우선순위를 정하고 정책·지침을 정비합니다.</p><ul class="m-out"><li>정보보호 대책서</li><li>정책·지침 제·개정안</li><li>이행 로드맵</li></ul></article>
        <article><span class="sec-k">STEP 5</span><h3>이행 지원</h3><p>대책이 운영되도록 담당 부서와 함께 증적을 쌓고 교육합니다.</p><ul class="m-out"><li>증적 체크리스트</li><li>임직원 교육 자료</li><li>내부점검 보고서</li></ul></article>
        <article><span class="sec-k">STEP 6</span><h3>심사·점검 대응</h3><p>모의 예비심사로 미흡 사항을 먼저 찾고, 본심사 결함 보완까지 지원합니다.</p><ul class="m-out"><li>모의심사 결과서</li><li>보완조치 계획·결과</li><li>유지관리 계획</li></ul></article>
      </div>
    </div>
    <div class="sec-block" id="plans">
      <p class="sec-k">Engagement</p>
      <h2>조직에 맞는 방식으로 계약하세요</h2>
      <p>한 번의 진단부터 3년 인증 주기, 상시 자문까지 필요한 만큼 고를 수 있습니다.</p>
      <div class="plans">
        <article><div class="plan-tag"><span>PROJECT</span><span>프로젝트형</span></div><h3>단일 과제 컨설팅</h3><p>마스터플랜, 개인정보 진단, 제로트러스트 진단처럼 목표가 하나인 과제를 수행합니다.</p><p>표준 기간 6~12주</p><p>산출물: 과제별 보고서, 이행 로드맵, 경영진 보고 자료</p></article>
        <article class="featured"><div class="plan-tag"><span>CERT 3-YEAR</span><span>추천</span></div><h3>인증 3년 패키지</h3><p>최초 인증부터 사후심사 2회, 갱신심사까지 한 계약으로 묶습니다.</p><p>표준 기간: 최초 인증 약 9~10개월 + 연간 유지</p><p>산출물: 인증 산출물 일체, 연간 내부점검 보고서, 매핑표 갱신</p></article>
        <article><div class="plan-tag"><span>ADVISORY</span><span>구독형</span></div><h3>Virtual CISO 상시 자문</h3><p>보안 인력이 부족한 조직에 월 단위로 전담 컨설턴트를 배정해 CISO의 의사결정과 보고를 지원합니다.</p><p>표준 기간: 연간 구독</p><p>산출물: 월간 보안 현황 보고, 규제 변경 알림, 경영진 정례 보고</p></article>
      </div>
      <p class="note">표준 기간은 대상 규모에 따라 달라집니다. 견적은 대상 조직·시스템 범위와 투입 인력 기준을 함께 제시합니다.</p>
      <div class="actions">
        <a class="pill" href="#security/inquiry">이 범위로 상담 신청</a>
        <a class="pill ghost" href="#security/cert">인증 일정 보기</a>
      </div>
    </div>`, [
    ["domains", "영역"],
    ["method", "방법론"],
    ["plans", "계약 방식"]
  ]);
}

function cert() {
  return page("Certification · ISMS / ISMS-P / ISO", "2027년, 인증 심사가 달라집니다", "인증을 받은 기업에서도 대형 유출 사고가 이어지자 정부는 ISMS·ISMS-P를 서면 심사 중심에서 운영 현장과 기술을 확인하는 심사로 바꾸고 있습니다. 문서만 갖춘 준비로는 통과도, 유지도 어려워집니다.", `
    <div class="items" id="reform">
      <article><span class="sec-k">등급제</span><h3>간편·표준·강화 3단계</h3><p>위험도에 따라 기준을 달리 적용합니다. 통신사와 대형 플랫폼은 강화 등급 대상입니다.</p></article>
      <article><span class="sec-k">예비심사</span><h3>핵심 항목 미충족 시 본심사 불가</h3><p>본심사 전에 핵심 통제를 먼저 확인합니다. 준비가 덜 된 상태로는 심사에 들어갈 수 없습니다.</p></article>
      <article><span class="sec-k">기술심사</span><h3>취약점 진단·모의침투 적용</h3><p>운영 환경 현장 점검과 함께 취약점 스캐너, 소스코드 진단, 모의침투가 심사에 들어옵니다.</p></article>
      <article><span class="sec-k">사후관리</span><h3>사후심사 확대·인증 취소</h3><p>사후심사 인력과 기간이 늘고, 중대 사고나 중대 결함 미조치 시 인증이 취소될 수 있습니다.</p></article>
    </div>
    <p class="note">출처: 과학기술정보통신부·개인정보보호위원회 발표 보도(바이라인네트워크 2025.12, 뉴시스 2026.03, 보안뉴스). 세부 사항은 고시 개정에 따라 달라질 수 있습니다.</p>
    <div class="sec-block" id="certs">
      <h2>지원하는 인증</h2>
      <p>조직이 이미 가진 인증과 앞으로 필요한 인증을 함께 놓고, 가장 적은 작업으로 모두 대응할 수 있는 순서를 제안합니다.</p>
      <div class="cert-grid">
        <article><h3>ISMS <span class="sec-k">인증기준 80개</span></h3><p>정보통신서비스 매출 100억 원 이상 또는 일평균 이용자 100만 명 이상, IDC, 전국 ISP 등 의무대상</p><p>관리체계 수립·운영 16개와 보호대책 64개 항목으로 구성됩니다. 의무대상이 인증을 받지 않으면 3,000만 원 이하의 과태료 대상입니다.</p></article>
        <article><h3>ISMS-P <span class="sec-k">인증기준 101개</span></h3><p>개인정보를 대량 처리하는 기업·기관, 2027년 의무화 대상 예정 조직</p><p>ISMS 80개 항목에 개인정보 처리 단계별 요구사항 21개가 더해집니다. 수집부터 파기까지 처리 흐름 전체를 다룹니다.</p></article>
        <article><h3>ISO/IEC 27001 <span class="sec-k">부속서 A 93개</span></h3><p>해외 고객사·글로벌 공급망에 보안 수준을 증명해야 하는 기업</p><p>2022년판 기준으로 조직·인력·물리·기술 4개 영역 93개 통제입니다. 위협 인텔리전스, 클라우드 서비스 이용 보안 등 11개 통제가 새로 추가되었습니다.</p></article>
        <article><h3>ISO/IEC 27701 <span class="sec-k">개인정보</span></h3><p>GDPR 등 해외 개인정보 규제에 대응해야 하는 기업</p><p>개인정보 관리체계 국제 표준입니다. 개인정보 처리자와 수탁자 역할별 요구사항을 다루며, ISMS-P 개인정보 항목과 겹치는 부분이 많습니다.</p></article>
        <article><h3>ISO/IEC 27017·27018 <span class="sec-k">클라우드</span></h3><p>SaaS·클라우드 서비스 제공 기업</p><p>27017은 클라우드 보안 통제, 27018은 퍼블릭 클라우드의 개인정보 보호를 다룹니다. 27001 인증 범위에 함께 포함해 받는 경우가 많습니다.</p></article>
        <article><h3>ISO/IEC 42001 <span class="sec-k">AI 경영</span></h3><p>AI 서비스를 개발·운영하거나 AI 기본법 대응이 필요한 기업</p><p>AI 경영시스템 국제 표준입니다. AI 위험평가와 영향평가, 데이터 관리, AI 시스템 수명주기 관리를 요구합니다.</p></article>
      </div>
    </div>
    <div class="sec-block" id="map">
      <h2>인증 간 통합 매핑</h2>
      <p>주요 관리 영역이 각 인증의 어느 조항에 해당하는지 정리한 예시입니다. 같은 영역은 하나의 정책과 증적으로 여러 인증에 대응합니다.</p>
      <div class="map-wrap">
        <table class="map">
          <caption class="sr-only">인증 간 통제 매핑</caption>
          <thead><tr><th>관리 영역</th><th>ISMS-P</th><th>ISO/IEC 27001:2022</th><th>ISO/IEC 27701</th><th>ISO/IEC 42001</th></tr></thead>
          <tbody>
            <tr><th>정책·조직·경영진 책임</th><td><span class="m-full">●</span> 1.1 관리체계 기반 마련</td><td><span class="m-full">●</span> 5 리더십</td><td><span class="m-full">●</span> 개인정보 관점 확장</td><td><span class="m-full">●</span> 5 리더십 · A.2–A.3</td></tr>
            <tr><th>위험평가·위험처리</th><td><span class="m-full">●</span> 1.2 위험 관리</td><td><span class="m-full">●</span> 6.1 위험 대응</td><td><span class="m-full">●</span> 개인정보 위험 포함</td><td><span class="m-full">●</span> 6.1 AI 위험 · A.5 영향평가</td></tr>
            <tr><th>외부자·공급자 관리</th><td><span class="m-full">●</span> 2.3 외부자 보안</td><td><span class="m-full">●</span> A.5.19–5.22</td><td><span class="m-full">●</span> 수탁자 요구사항</td><td><span class="m-full">●</span> A.10 제3자 관계</td></tr>
            <tr><th>인증·권한·접근통제</th><td><span class="m-full">●</span> 2.5–2.6</td><td><span class="m-full">●</span> A.5.15–5.18, A.8.2–8.5</td><td><span class="m-part">◐</span> 개인정보 접근 제한</td><td><span class="m-none">—</span></td></tr>
            <tr><th>로그·모니터링</th><td><span class="m-full">●</span> 2.9 운영관리</td><td><span class="m-full">●</span> A.8.15–8.16</td><td><span class="m-part">◐</span> 처리 기록</td><td><span class="m-part">◐</span> A.6 운영 모니터링</td></tr>
            <tr><th>침해사고 대응</th><td><span class="m-full">●</span> 2.11 사고 예방 및 대응</td><td><span class="m-full">●</span> A.5.24–5.28</td><td><span class="m-full">●</span> 개인정보 유출 대응</td><td><span class="m-part">◐</span> AI 사고 보고</td></tr>
            <tr><th>개인정보 생명주기</th><td><span class="m-full">●</span> 3 처리 단계별 요구사항</td><td><span class="m-part">◐</span> A.5.34 개인정보 보호</td><td><span class="m-full">●</span> 처리자·수탁자 통제</td><td><span class="m-none">—</span></td></tr>
            <tr><th>데이터 품질·AI 수명주기</th><td><span class="m-none">—</span></td><td><span class="m-none">—</span></td><td><span class="m-none">—</span></td><td><span class="m-full">●</span> A.6 수명주기 · A.7 데이터</td></tr>
          </tbody>
        </table>
      </div>
      <div class="map-legend"><span><b class="m-full">●</b> 직접 대응</span><span><b class="m-part">◐</b> 부분 대응</span><span><b class="m-none">—</b> 해당 없음</span><span>조직 범위에 맞춰 착수 단계에서 항목 단위로 정밀화합니다</span></div>
    </div>
    <div class="sec-block" id="schedule">
      <h2>ISMS-P 최초 인증 권장 일정</h2>
      <p>인증을 신청하려면 그 전에 관리체계를 2개월 이상 운영해야 합니다. 또 인증기관은 본심사 6~8주 전에 예비점검을 나옵니다. 티벨은 이 두 조건을 거꾸로 맞춰 착수일을 정하고, 신청 전에 내부점검과 모의심사를 거칩니다.</p>
      <div class="gantt" role="img" aria-label="ISMS-P 최초 인증 32주 권장 일정">
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
      <div class="g-legend"><span><i style="background:#27c4d5"></i>티벨 컨설팅 단계</span><span><i style="background:#2ea090"></i>고객 운영 기간</span><span><i style="background:#969696"></i>인증기관 일정</span><span>심사 후 보완조치(40일 이내, 연장 가능)와 인증위원회 심의를 거쳐 인증서가 발급됩니다. 기간은 조직 규모와 범위에 따라 달라집니다.</span></div>
      <h2>인증 이후 3년</h2>
      <p>인증 유효기간은 3년이고 매년 사후심사를 받습니다. 개편 이후에는 인증을 받는 것보다 유지하는 일이 더 어려워집니다.</p>
      <div class="cycle">
        <article><span class="yr">YEAR 0</span><h3>최초 인증</h3><ul class="m-out"><li>GAP 분석·위험평가</li><li>정책·지침 제·개정</li><li>모의 예비심사·심사 대응</li></ul></article>
        <article><span class="yr">YEAR 1</span><h3>1차 사후심사</h3><ul class="m-out"><li>분기 내부점검</li><li>조직·시스템 변경 영향 분석</li><li>최초 심사 결함 재발 점검</li></ul></article>
        <article><span class="yr">YEAR 2</span><h3>2차 사후심사</h3><ul class="m-out"><li>위험평가 재수행</li><li>신규 서비스 인증 범위 편입</li><li>침해사고 대응 훈련</li></ul></article>
        <article><span class="yr">YEAR 3</span><h3>갱신심사</h3><ul class="m-out"><li>3년치 운영 증적 정리</li><li>강화된 기준으로 재매핑</li><li>추가 인증(ISO 등) 확장</li></ul></article>
      </div>
      <div class="actions">
        <a class="pill" href="#security/diagnose">우리 조직 인증 일정 계산하기</a>
        <a class="pill ghost" href="#security/services" data-jump="plans">계약 방식 보기</a>
      </div>
    </div>
    <div class="sec-block" id="faq">
      <p class="sec-k">FAQ</p>
      <h2>자주 묻는 질문</h2>
      <div class="faq">
        <details open><summary>ISMS-P 인증까지 얼마나 걸리나요?</summary><p>티벨 권장 일정 기준으로 착수부터 인증심사까지 약 7~8개월, 심사 후 보완조치와 인증위원회 심의를 거쳐 인증서 발급까지 약 9~10개월을 잡습니다. 인증 신청 전에 관리체계를 2개월 이상 운영해야 하므로 이 기간은 줄이기 어렵습니다. ISO 27001 등 기존 인증이 있다면 증적을 다시 써서 앞 단계를 줄일 수 있습니다.</p></details>
        <details><summary>이미 인증을 받았는데, 개편에 맞춰 무엇을 준비해야 하나요?</summary><p>예비심사와 기술심사가 도입되면 문서와 실제 운영이 일치하는지가 가장 중요해집니다. 보유 인증의 핵심 통제 항목을 먼저 점검하고, 다음 사후심사 전까지 보완할 항목과 순서를 정하는 것부터 시작합니다.</p></details>
        <details><summary>ISMS-P와 ISO 27001을 함께 받을 수 있나요?</summary><p>가능합니다. 두 인증은 관리체계와 보호대책 상당 부분이 겹칩니다. 매핑표를 기준으로 하나의 위험평가와 정책 체계를 만들어 양쪽 심사에 대응합니다.</p></details>
        <details><summary>AI 서비스를 운영하는데 어떤 준비가 필요한가요?</summary><p>먼저 우리 서비스가 AI 기본법상 고영향 AI나 생성형 AI 의무 대상에 해당하는지 확인합니다. 이어서 AI 위험·영향평가 체계와 데이터 관리 기준을 마련하고, 필요하면 ISO/IEC 42001 인증까지 단계적으로 준비합니다.</p></details>
        <details><summary>주요정보통신기반시설 취약점 분석·평가도 맡길 수 있나요?</summary><p>법정 취약점 분석·평가와 개인정보 영향평가는 정부가 지정한 기관이 수행하도록 정해져 있습니다. 티벨은 그 평가를 앞두고 관리체계를 정비하거나, 평가에서 나온 지적 사항의 보호대책 수립과 이행을 지원하는 역할로 함께할 수 있습니다.</p></details>
        <details><summary>보안 전담 인력이 한 명뿐인 작은 회사도 가능한가요?</summary><p>가능합니다. 범위를 좁힌 프로젝트형으로 시작하거나, Virtual CISO 상시 자문으로 지정된 보안책임자의 판단과 경영진 보고를 지원할 수 있습니다. 정보통신망법상 CISO 지정·신고는 회사가 직접 해야 하며, 외부 자문이 이를 대신하지는 않습니다.</p></details>
      </div>
    </div>`, [
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
      <h3>${name}</h3>
      <p>${address}</p>
      <p>070-7777-9113 / 070-7777-6368</p>
      <p>staff@tbell.co.kr</p>
      <a href="https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}" target="_blank" rel="noopener noreferrer">지도 보기</a>
    </article>`).join("");
  return `
    ${shot({ pc: "content-info.fc1421f9afb2b1ef4f7b.png", tablet: "content-tablet-info.c7063e23e4e8e1343822.png", mobile: "content-mobile-info.49569bdfa931a27fd22b.png" })}
    <div class="way"><h2>찾아오시는 길</h2><div class="way-grid">${cards}</div></div>`;
}

function recruitBody() {
  return `
    ${shot({ pc: "content-recruit.38d4da4bdc8774b7b4a9.png", tablet: "content-tablet-recruit.b8f0b18c52b29fac09b8.png", mobile: "content-mobile-recruit.7267146c48e819e7e2bf.png" })}
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
  { id: "about", title: "회사 소개", desc: "", tags: [], bg: ["bg-info.de3329d4a93fff58c0c9.png", "bg-tablet-info.dfaa0c39c60c825ecbb2.png", "bg-mobile-info.92d953b0346cc509e852.png"], body: aboutBody },
  { id: "vision", title: "경영철학", desc: "", tags: [], bg: ["bg-vision.2e2c550d96ce302bf12d.png", "bg-tablet-vision.657fdee36572fc7cefea.png", "bg-mobile-vision.5aa6cb952f2921958f37.png"], body: () => shot({ pc: "content-vision.f5a13fbfa6c6198b0a31.png", tablet: "content-tablet-vision.86dede5eb72d6d4d5c25.png", mobile: "content-mobile-vision.b6f89e69d1bb8ae01535.png" }) }
];

const RECRUIT_SLIDES = [
  { id: "benefit", title: "복리후생", desc: "", tags: [], bg: ["bg-benefit.980907dc0cae18031e40.png", "bg-tablet-benefit.e31e967d683d2abd1095.png", "bg-mobile-benefit.2a770bc2a5cd8dcfc473.png"], body: () => shot({ pc: "content-benefit.8c70c1af8a0fc41d19fe.png", tablet: "content-tablet-benefit.7fd7bd50d71cd63e60c4.png", mobile: "content-mobile-benefit.2ae238b17c45ef61d26c.png" }) },
  { id: "recruit", title: "Good Player, Great Work", desc: "티벨은 올바른 생각과 실천을 통해 “우수한 인재를, 일하기 좋은 기업”을 만듭니다.", tags: [], bg: ["bg-recruit.96e2ea0dae220b78e221.png", "bg-tablet-recruit.95364057a4fd3ee61e20.png", "bg-mobile-recruit.89efb893fcee0ae88828.png"], body: recruitBody }
];

const ESG_SLIDES = [
  { id: "ethical", title: "윤리 경영", desc: "", tags: [], bg: ["bg-ethical.4ee79d2ecc425576aabf.png", "bg-tablet-ethical.3ee09f7000c4ffa90a44.png", "bg-mobile-ethical.6ca0468a4dffddfbd2d7.png"], body: ethicalBody },
  { id: "social", title: "사회 경영", desc: "", tags: [], bg: ["bg-social.18fa9508d7893696bec6.png", "bg-tablet-social.12a02e3c7d934095805f.png", "bg-mobile-social.e1f4c148af28514f5139.png"], body: () => shot({ pc: "content-social-01.9d7e25d9e5508740f445.png", tablet: "content-tablet-social-01.7a5073b4f6e570f4863b.png", mobile: "content-mobile-social-01.f68c2567deeef779e297.png" }) + shot({ pc: "content-social-02.23079b9eda512c5c4ba4.png", tablet: "content-tablet-social-02.d0c6eff802b83f15f53e.png", mobile: "content-mobile-social-02.1d70a1432fef8d8776ec.png" }) },
  { id: "environmental", title: "환경 경영", desc: "친환경 제품 및 서비스, 에너지 소비 분야를 중심으로 친환경 ICT 기업 도약을 추진합니다.", tags: [], bg: ["bg-environ.9fef7398af46aa8d3846.png", "bg-tablet-environmental.b52a1a9ba527c8536088.png", "bg-mobile-environmental.890cbb7f7a60a4853a15.png"], body: () => shot({ pc: "content-environmental.47f11988867ea557261a.png", tablet: "content-tablet-environmental.2ea0e8ec9717000430e7.png", mobile: "content-mobile-environmental.f0d643e418aa40254ce7.png" }) }
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
    phone: "070-7777-9113",
    phoneNote: "월–금 09:30–18:00 · 점심 12:00–13:00",
    place: "서울특별시 강남구 강남대로 354, 9층 (혜천빌딩)",
    aside: `<article><h3>진단 전</h3><p><a href="#security/diagnose">아직 진단 전이면, 2분 셀프 진단부터</a></p></article>`,
    topics: ["ISMS·ISMS-P", "ISO 27001 계열", "개인정보 보호", "마스터플랜·제로트러스트", "AI 거버넌스", "Virtual CISO 자문"],
    messageLabel: "현재 상황과 목표 일정",
    placeholder: "예) ISMS 보유 중, 2027년 ISMS-P 전환 필요. 내년 상반기 심사 목표",
    agree: "상담을 위한 개인정보(이름, 회사명, 이메일, 연락처) 수집·이용에 동의합니다. 상담 종료 후 파기합니다.",
    button: "상담 신청",
    extra: `<p class="import-note" id="import-note" hidden>셀프 진단 결과가 문의 내용에 들어가 있습니다. 이름과 연락처만 더해 주세요.</p>
    <div class="survey">
      <p class="kicker">사전 조사 (선택)</p>
      <p class="note">대략적인 수량이면 충분합니다. 컨설팅 범위와 기간을 정하는 데 씁니다.</p>
      <div class="survey-grid">
        <label>서버 (대)<input name="server" type="number" min="0" placeholder="예) 40"></label>
        <label>DBMS (개)<input name="db" type="number" min="0" placeholder="예) 6"></label>
        <label>네트워크·보안장비 (대)<input name="net" type="number" min="0" placeholder="예) 15"></label>
        <label>웹·앱 서비스 (개)<input name="apps" type="number" min="0" placeholder="예) 3"></label>
        <label>임직원 (명)<input name="staff" type="number" min="0" placeholder="예) 120"></label>
        <label>개인정보 보유 규모
          <select name="pii"><option value="">선택</option><option>보유하지 않음</option><option>1만 명 미만</option><option>1만~100만 명 미만</option><option>100만 명 이상</option></select>
        </label>
        <label>클라우드 이용
          <select name="cloud"><option value="">선택</option><option>사용 안 함 (자체 전산실·IDC)</option><option>퍼블릭 클라우드 (AWS·Azure·GCP·NCP 등)</option><option>하이브리드 (자체 + 클라우드)</option><option>SaaS 위주</option></select>
        </label>
      </div>
    </div>`
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
        <article><h3>메일</h3><p>${spec.mail}</p></article>
        <article><h3>전화</h3><p class="num">${phone}</p><p>${phoneNote}</p></article>
        <article><h3>받는 곳</h3><p>${place}</p></article>
        ${spec.aside || ""}
      </div>
      <form class="form" id="inquiry-form">
        <label>이름<input name="name" autocomplete="name" required></label>
        <label>회사명<input name="company" autocomplete="organization" required></label>
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
    const base = "#" + mode + "/blog" + (id ? "/" + id : "");
    return n > 1 ? base + "/" + n : base;
  };
  const chip = (id, name, on) => `<a href="${hrefFor(id, 1)}"${on ? ' aria-current="page"' : ""}>${name}</a>`;
  const parents = chip("", "전체", !group) + allowed.map((cat) => chip(cat.id, cat.name, group && cat.id === group.id)).join("");
  const kids = group && group.children
    ? chip(group.id, "전체", !leaf) + group.children.map((cat) => chip(cat.id, cat.name, leaf && leaf.id === cat.id)).join("")
    : "";
  const filterId = leaf ? leaf.id : group ? group.id : "";
  const cards = slice.map((post) => {
    const img = post.thumb ? `<img src="${esc(post.thumb)}" alt="">` : "";
    const text = plain(post.excerpt);
    const cut = text.length > 36 ? text.slice(0, 36).trim() + "…" : text;
    return `<a class="blog-card" href="${esc(post.url)}" target="_blank" rel="noopener noreferrer">${img}<span class="en">${esc(post.date)} · ${esc(post.category)}</span><h3>${esc(plain(post.title))}</h3><p>${esc(cut)}</p></a>`;
  }).join("");
  const nums = [];
  for (let n = 1; n <= pages; n++) nums.push(`<a href="${hrefFor(filterId, n)}"${n === pageNo ? ' aria-current="page"' : ""}>${n}</a>`);
  const title = !group ? MODE_LABEL[mode] + " 블로그" : leaf ? group.name + " · " + leaf.name : group.name;
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
  const base = "#" + mode + "/company/";
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
    tauto: (child) => child === "lens" ? lens() : child === "voc" ? voc() : child === "vux" ? vux() : tautoHome(),
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
  }
};

function activeChild(group, child) {
  if (group === "types") return child || "outsourcing";
  if (group === "testops") return child || "build";
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
  const columns = [...menuDrop.querySelectorAll(".drop-col")];
  const content = columns.reduce((max, col) => Math.max(max, col.offsetHeight), 0);
  const styles = getComputedStyle(menuDrop);
  const pad = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const cap = Math.max(0, window.innerHeight - header.offsetHeight);
  return Math.min(content + pad, cap);
}

function openMenu(id) {
  if (window.matchMedia("(max-width: 768px)").matches) return;
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
  if (!form || parse().mode !== "security") return;
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

function wireDiagnose() {
  const navi = document.getElementById("navi-form");
  if (!navi) return;
  const $ = (id) => document.getElementById(id);
  const on = (id) => !!($(id) && $(id).checked);
  const BADGE = { must: ["b-must", "의무"], soon: ["b-soon", "예정"], check: ["b-check", "확인 필요"], rec: ["b-rec", "권장"] };
  let lastOut = [];
  let lastPlan = null;
  const PHASES = [
    { w: -30, endW: -28, name: "착수·범위 정의", group: "prep" },
    { w: -28, endW: -24, name: "현황 분석·GAP", group: "prep" },
    { w: -24, endW: -20, name: "위험평가·DoA 결정", group: "prep" },
    { w: -22, endW: -16, name: "보호대책·정책 제·개정", group: "prep" },
    { w: -18, endW: 2, name: "관리체계 운영·증적 축적", group: "ops", note: "신청 전 2개월 이상 운영" },
    { w: -18, endW: -16, name: "임직원 인증 교육", group: "ops" },
    { w: -12, endW: -9, name: "내부점검·모의심사", group: "prep" },
    { w: -9, endW: -8, name: "인증 신청", group: "prep" },
    { w: -6, endW: -4, name: "인증기관 예비점검", group: "audit", note: "심사 6~8주 전" },
    { w: 0, endW: 2, name: "인증심사", group: "audit" },
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
    if (on("q-cloud")) out.push(["must", "클라우드 보안인증(CSAP)", "공공기관이 이용하는 클라우드 서비스는 CSAP 인증이 필요합니다. 서비스 유형과 등급에 따라 요건이 다릅니다."]);
    if (hasIso) out.push(["check", "ISO 27001:2022 전환 여부", "2013판 인증은 2025년 10월 31일에 효력이 끝났습니다. 2022판으로 전환되었는지 확인하세요."]);
    else if (on("q-global")) out.push(["rec", "ISO/IEC 27001" + (on("q-pii") ? "·27701" : ""), "해외 고객사와 계약할 때 보안 수준 증명 자료로 가장 많이 요구됩니다." + (certified ? " 보유 인증과 매핑해 중복 작업을 줄일 수 있습니다." : "")]);
    if (on("q-listed") || on("q-infra") || on("q-users") || sector === "medical") {
      out.push(["check", "정보보호 공시 의무 여부", "매출·이용자 규모와 업종에 따라 정보보호 투자·인력 현황을 매년 공시해야 할 수 있습니다."]);
    }
    if (sector === "finance") out.push(["check", "전자금융 관련 규정", "전자금융거래법·전자금융감독규정에 따른 별도 보안 요구사항과 평가 대상 여부를 확인해야 합니다."]);
    const list = $("r-list");
    list.textContent = "";
    if (!out.length) {
      const empty = document.createElement("li");
      empty.textContent = "선택한 조건으로는 의무 대상이 보이지 않습니다. 개인정보를 처리한다면 개인정보 보호법의 안전성 확보조치 기준은 모든 조직에 적용됩니다.";
      list.appendChild(empty);
    }
    const counts = { must: 0, soon: 0, check: 0, rec: 0 };
    out.forEach((row) => {
      counts[row[0]] += 1;
      const li = document.createElement("li");
      li.className = "r-item";
      const badge = document.createElement("span");
      badge.className = "r-badge " + BADGE[row[0]][0];
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
    $("r-sum").textContent = out.length ? `의무 ${counts.must} · 예정 ${counts.soon} · 확인 필요 ${counts.check} · 권장 ${counts.rec}` : "";
  }

  function buildRanges(target, today) {
    return PHASES.map((phase) => {
      const start = new Date(target.getTime() + phase.w * 7 * DAY);
      let end = addDays(new Date(target.getTime() + phase.endW * 7 * DAY), -1);
      if (end < start) end = start;
      return { start, end, name: phase.name, note: phase.note || "", group: phase.group, past: end < today, w: phase.w };
    });
  }

  function renderSummary(target, start, today, daysLeft) {
    const host = $("plan-summary");
    host.textContent = "";
    const cards = [
      { k: "준비 시작일", v: fmt(start), s: daysLeft >= 0 ? `권장 착수일 · D-${daysLeft}` : "권장 착수일이 지남", cls: daysLeft >= 0 ? "is-ok" : "is-warn" },
      { k: "목표 심사일", v: fmt(target), s: "인증심사 시작 기준", cls: "" },
      daysLeft >= 0
        ? { k: "일정 여유", v: `D-${daysLeft}`, s: "권장 일정으로 충분합니다", cls: "is-ok" }
        : { k: "일정 부족", v: `약 ${Math.ceil(-daysLeft / 7)}주`, s: "단축·병행 일정이 필요합니다", cls: "is-warn" }
    ];
    if (target <= today) cards[2] = { k: "일정 상태", v: "목표일 경과", s: "다른 심사일을 선택하세요", cls: "is-warn" };
    cards.forEach((card) => {
      const art = document.createElement("article");
      art.className = "plan-metric" + (card.cls ? " " + card.cls : "");
      art.innerHTML = `<div class="sec-k">${card.k}</div><div class="v">${card.v}</div><p>${card.s}</p>`;
      host.appendChild(art);
    });
  }

  function renderGantt() {
    const host = $("sched-cal");
    host.textContent = "";
    if (!schedRanges.length) return;
    const origin = schedRanges.reduce((min, range) => range.start < min ? range.start : min, schedRanges[0].start);
    const finish = schedRanges.reduce((max, range) => range.end > max ? range.end : max, schedRanges[0].end);
    const span = Math.max(DAY, finish - origin + DAY);
    const gantt = document.createElement("div");
    gantt.className = "plan-gantt";
    const head = document.createElement("div");
    head.className = "plan-gantt-head";
    head.innerHTML = `<div></div>`;
    const months = document.createElement("div");
    months.className = "plan-months";
    let cursor = new Date(origin.getFullYear(), origin.getMonth(), 1);
    const endMonth = new Date(finish.getFullYear(), finish.getMonth(), 1);
    while (cursor <= endMonth) {
      const mark = document.createElement("span");
      mark.className = "plan-month";
      const pct = ((cursor - origin) / span) * 100;
      if (pct >= -2 && pct <= 102) {
        mark.style.left = Math.max(0, Math.min(100, pct)) + "%";
        mark.textContent = `${cursor.getFullYear()}.${String(cursor.getMonth() + 1).padStart(2, "0")}`;
        months.appendChild(mark);
      }
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
    head.appendChild(months);
    gantt.appendChild(head);
    schedRanges.forEach((range) => {
      const row = document.createElement("div");
      row.className = "plan-gantt-row";
      const label = document.createElement("div");
      label.className = "plan-label";
      label.innerHTML = `<strong>${range.name}</strong><span>${fmt(range.start)}</span>`;
      const track = document.createElement("div");
      track.className = "plan-track";
      const bar = document.createElement("span");
      bar.className = `plan-bar group-${range.group}${range.past ? " is-past" : ""}`;
      bar.style.left = Math.max(0, ((range.start - origin) / span) * 100) + "%";
      bar.style.width = Math.max(0.8, ((range.end - range.start + DAY) / span) * 100) + "%";
      track.appendChild(bar);
      row.appendChild(label);
      row.appendChild(track);
      gantt.appendChild(row);
    });
    host.appendChild(gantt);
  }

  function renderStatus(target, start, today, daysLeft) {
    const verdict = $("p-verdict");
    verdict.textContent = "";
    if (target <= today) {
      verdict.className = "plan-status is-warn";
      verdict.innerHTML = `<p>목표일 경과</p><p>목표 심사일이 오늘 이전입니다. 날짜를 다시 선택해 주세요.</p>`;
      return;
    }
    if (daysLeft >= 0) {
      verdict.className = "plan-status is-ok";
      verdict.innerHTML = `<p>일정 가능 · D-${daysLeft}</p><p>권장 착수일 ${fmt(start)}까지 착수하면 권장 일정을 유지할 수 있습니다.</p>`;
      return;
    }
    const shortWeeks = Math.ceil(-daysLeft / 7);
    let adjustFocus = "현황 분석·GAP ~ 보호대책·정책";
    if (shortWeeks <= 4) adjustFocus = "착수·범위 정의 ~ 현황 분석·GAP";
    else if (shortWeeks >= 12) adjustFocus = "착수 전 범위 축소와 앞 단계 병행";
    const reuse = (on("h-iso") || on("h-isms")) ? " 보유 인증 증적을 다시 쓰면 앞 준비 단계를 줄일 수 있습니다." : "";
    verdict.className = "plan-status is-warn";
    verdict.innerHTML = `<p>부족 약 ${shortWeeks}주</p><p>권장 착수일 ${fmt(start)} 기준으로 일정이 부족합니다.</p><p>우선 조정 구간: ${adjustFocus}. 신청 전 관리체계 운영 2개월은 줄이기 어렵습니다.</p><p>범위를 좁히거나 분석·대책 단계를 병행하는 단축 일정이 필요합니다.${reuse} 목표 심사일을 뒤로 미루면 권장 일정으로 다시 맞출 수 있습니다.</p>`;
  }

  function plan() {
    const value = $("p-target").value;
    const steps = $("p-steps");
    steps.textContent = "";
    $("plan-summary").textContent = "";
    $("sched-cal").textContent = "";
    $("p-verdict").textContent = "";
    const target = parseIso(value);
    if (!target) {
      $("p-verdict").textContent = "목표 심사 시작일을 선택하세요.";
      lastPlan = null;
      schedRanges = [];
      return;
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    schedRanges = buildRanges(target, today);
    schedRanges.forEach((range) => {
      const li = document.createElement("li");
      li.textContent = `${fmt(range.start)} ~ ${fmt(range.end)} ${range.name}`;
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
  const { mode, group, child } = parse();
  document.getElementById("logo-link").href = "#";
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

  const bucket = DRAW[mode];
  const draw = bucket[group] || bucket[""];
  content.innerHTML = draw.length ? draw(child, mode) : draw();
  wireDeck();
  wireJump();
  wireDiagnose();
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
      box.innerHTML = `<p class="kicker">${MODE_LABEL[mode]} 문의</p><p><strong>${data.get("company")}</strong> ${data.get("name")} · ${data.get("email")}</p><p style="margin-top:8px">관심 분야: ${topics}</p><p style="margin-top:8px">${data.get("message")}</p><p class="note">프로토타입이라 메일은 전송되지 않습니다. 실제 접수는 ${INQUIRY[mode].mail} 로 받습니다.</p>`;
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
  document.querySelectorAll("[data-bounce]").forEach((box) => {
    box.innerHTML = [...box.dataset.bounce].map((ch, i) => `<span style="--i:${i + 1}">${ch}</span>`).join("");
  });
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
  document.querySelectorAll(".stage").forEach((el) => stageObserver.observe(el));
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
window.addEventListener("hashchange", render);
render();
