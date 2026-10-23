// #security/services — 컨설팅 서비스 페이지.
// 레이아웃은 site.css의 s- 클래스(design.md › Security layout), 아이콘은 icons.svg.

const SPRITE = "assets/icons.svg?v=1#";

function use(id, attrs = "") {
  return `<svg class="s-ico" aria-hidden="true"${attrs}><use href="${SPRITE}${id}"/></svg>`;
}

const SVC_DOMAINS = [
  {
    id: "domain-a", key: "A", icon: "d-a", title: "관리체계·인증",
    desc: "국내외 정보보호 인증을 준비하고, 인증을 받은 뒤에도 기준에 맞게 운영되도록 돕습니다.",
    fig: `<rect x="44" y="18" width="104" height="128" fill="#121212" stroke="#bdbdbd" stroke-width="1.5"/>
      <rect x="58" y="36" width="60" height="5" fill="#bdbdbd"/>
      <rect x="58" y="52" width="76" height="3" fill="#5a5a5a"/><rect x="58" y="64" width="70" height="3" fill="#5a5a5a"/><rect x="58" y="76" width="74" height="3" fill="#5a5a5a"/><rect x="58" y="88" width="50" height="3" fill="#5a5a5a"/>
      <g class="s-stamp">
        <circle cx="152" cy="112" r="30" fill="#121212" stroke="#27c4d5" stroke-width="2"/>
        <circle cx="152" cy="112" r="23" fill="none" stroke="#27c4d5" stroke-width="1" stroke-dasharray="3 3"/>
        <path class="s-draw" d="M140 112 L149 121 L166 103" fill="none" stroke="#27c4d5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `,
    items: [
      ["i-cert", "ISMS·ISMS-P 인증", "2027 개편", "최초·사후·갱신 심사 대응, 등급제·예비심사 대비"],
      ["i-iso", "ISO/IEC 27001 계열 인증", "", "27001·27701·27017·27018 신규 취득과 통합 운영"],
      ["i-cycle", "인증 유지 관리", "", "연간 내부점검, 변경 영향 분석, 사후심사 결함 조치"],
      ["i-merge", "복수 인증 통합", "", "ISMS-P와 ISO 인증 간 통제 매핑, 증적 일원화"]
    ]
  },
  {
    id: "domain-b", key: "B", icon: "d-b", title: "개인정보 보호",
    desc: "개인정보가 수집되어 파기될 때까지 흐름을 따라가며 법적 요구사항과 실제 운영의 차이를 찾습니다.",
    fig: `
      <path d="M28 80 H212" fill="none" stroke="#4a4a4a" stroke-width="2"/>
      <path class="s-flowline" d="M28 80 H212" fill="none" stroke="#27c4d5" stroke-width="2"/>
      <g fill="#121212" stroke="#d0d0d0" stroke-width="1.5"><circle cx="28" cy="80" r="14"/><circle cx="89" cy="80" r="14"/><circle cx="151" cy="80" r="14"/><circle cx="212" cy="80" r="14"/></g>
      <g fill="none" stroke="#d0d0d0" stroke-width="1.5" stroke-linecap="round"><path d="M22 80h12M28 74v12"/><circle cx="89" cy="80" r="4"/><path d="M145 80h12M152 75l5 5-5 5"/><path d="M207 75l10 10M217 75l-10 10"/></g>
      <circle class="s-motion-dot" r="5" fill="#27c4d5"><animateMotion dur="4s" repeatCount="indefinite" path="M28 80 H212"/></circle>
      `,
    items: [
      ["i-gauge", "개인정보 관리수준 진단", "", "처리 흐름 분석, 안전성 확보조치 기준 이행 점검"],
      ["i-vendor", "수탁사·위탁 관리 점검", "", "위탁 계약·관리감독 체계 수립, 수탁사 현장 점검"],
      ["i-pseudo", "가명정보 처리 컨설팅", "", "가명처리 절차·적정성 검토, 결합 전후 관리 체계"],
      ["i-transfer", "국외 이전·해외 규제 대응", "", "GDPR 등 해외 개인정보 규제 요구사항 갭 분석"]
    ]
  },
  {
    id: "domain-c", key: "C", icon: "d-c", title: "보안 전략·거버넌스",
    desc: "경영진이 보안 예산과 우선순위를 결정할 수 있도록 현재 수준과 목표, 그 사이의 경로를 그립니다.",
    fig: `<line x1="30" y1="130" x2="214" y2="130" stroke="#6b6b6b" stroke-width="1.5"/>
      <line x1="30" y1="34" x2="214" y2="34" stroke="#d0d0d0" stroke-width="1" stroke-dasharray="5 4"/>
      
      <rect class="s-grow" x="44" y="94" width="26" height="36" fill="none" stroke="#8a8a8a" stroke-width="1.5"/>
      <rect class="s-grow g2" x="88" y="76" width="26" height="54" fill="none" stroke="#bdbdbd" stroke-width="1.5"/>
      <rect class="s-grow g3" x="132" y="56" width="26" height="74" fill="none" stroke="#ffffff" stroke-width="1.5"/>
      <rect class="s-grow g4" x="176" y="38" width="26" height="92" fill="#27c4d5" fill-opacity=".25" stroke="#27c4d5" stroke-width="1.5"/>
      `,
    items: [
      ["i-roadmap", "정보보호 마스터플랜", "", "현황 진단, 목표 모델, 3개년 이행 로드맵과 예산안"],
      ["i-zt", "제로트러스트·N2SF 전환", "", "가이드라인 기반 성숙도 진단, 단계별 전환 계획"],
      ["i-disclose", "정보보호 공시 대응", "", "공시 항목별 현황 정리, 투자·인력 산정 기준 검토"],
      ["i-ciso", "Virtual CISO 자문", "구독형", "외부 전문가가 정보보호최고책임자(CISO)의 판단과 경영진 보고를 월 단위로 지원"]
    ]
  },
  {
    id: "domain-d", key: "D", icon: "d-d", title: "신기술 리스크",
    desc: "기존 인증 기준만으로는 다루기 어려운 AI, 클라우드, 공급망 위험을 따로 진단합니다.",
    fig: `<g stroke="#4a4a4a" stroke-width="1.5"><line x1="120" y1="80" x2="50" y2="40"/><line x1="120" y1="80" x2="190" y2="40"/><line x1="120" y1="80" x2="120" y2="140"/></g>
      <g class="s-flowline" stroke="#27c4d5" stroke-width="1.5"><line x1="120" y1="80" x2="50" y2="40"/><line x1="120" y1="80" x2="190" y2="40"/><line x1="120" y1="80" x2="120" y2="140"/></g>
      <circle class="s-pulse" cx="120" cy="80" r="18" fill="none" stroke="#27c4d5" stroke-width="1.5"/>
      <circle class="s-pulse p2" cx="120" cy="80" r="18" fill="none" stroke="#27c4d5" stroke-width="1.5"/>
      <circle cx="120" cy="80" r="18" fill="#121212" stroke="#d0d0d0" stroke-width="1.5"/>
      <path d="M120 70 L128 73 V80 C128 85 124 88 120 90 C116 88 112 85 112 80 V73 Z" fill="none" stroke="#ffffff" stroke-width="1.8"/>
      <g fill="#121212" stroke="#d0d0d0" stroke-width="1.5"><rect x="26" y="24" width="48" height="30"/><rect x="166" y="24" width="48" height="30"/><rect x="96" y="126" width="48" height="28"/></g>
      `,
    items: [
      ["i-ai", "AI 거버넌스", "AI", "AI 기본법 의무 검토, ISO/IEC 42001 준비, AI 위험·영향평가 체계"],
      ["i-cloud", "클라우드 보안 아키텍처", "", "멀티클라우드 보안 설계 검토, 책임공유모델 기반 통제 정의"],
      ["i-supply", "SW 공급망 보안", "", "SBOM 관리 정책, 오픈소스 사용 기준, 협력사 보안 평가 체계"],
      ["i-pentest", "기술적 취약점 진단·모의해킹", "", "인프라·웹·모바일 진단으로 관리체계 컨설팅의 기술 근거 확보"]
    ]
  }
];

const SVC_STEPS = [
  ["s1", "착수·범위 정의", "대상 조직, 시스템, 적용 기준과 규제 기한을 확정합니다.", ["수행계획서", "범위 정의서", "주 단위 일정표"]],
  ["s2", "현황 분석·GAP", "인터뷰와 문서·시스템 검토로 기준 대비 현재 수준을 측정합니다.", ["현황 분석서", "GAP 분석 보고서", "기준 간 매핑표"]],
  ["s3", "위험평가", "자산과 위협을 평가하고, 경영진과 허용 위험 수준(DoA)을 정합니다.", ["정보자산 목록", "위험평가 보고서", "DoA 결정서"]],
  ["s4", "보호대책·로드맵", "위험별 대책과 우선순위를 정하고 정책·지침을 정비합니다.", ["정보보호 대책서", "정책·지침 제·개정안", "이행 로드맵"]],
  ["s5", "이행 지원", "대책이 운영되도록 담당 부서와 함께 증적을 쌓고 교육합니다.", ["증적 체크리스트", "임직원 교육 자료", "내부점검 보고서"]],
  ["s6", "심사·점검 대응", "모의 예비심사로 미흡 사항을 먼저 찾고, 본심사 결함 보완까지 지원합니다.", ["모의심사 결과서", "보완조치 계획·결과", "유지관리 계획"]]
];

// [code, name, recommended, fit, duration, durationNote, bar%, yearly, deliverables]
const SVC_PLANS = [
  ["PROJECT", "단일 과제 컨설팅", false, "마스터플랜, 개인정보 진단, 제로트러스트 진단처럼 목표가 하나인 과제를 수행합니다.", "6~12주", "", 18, false, ["과제별 보고서", "이행 로드맵", "경영진 보고 자료"]],
  ["CERT 3-YEAR", "인증 3년 패키지", true, "최초 인증부터 사후심사 2회, 갱신심사까지 한 계약으로 묶습니다.", "최초 인증 약 9~10개월 + 연간 유지", "", 100, true, ["인증 산출물 일체", "연간 내부점검 보고서", "매핑표 갱신"]],
  ["ADVISORY", "Virtual CISO 상시 자문", false, "보안 인력이 부족한 조직에 월 단위로 전담 컨설턴트를 배정해 CISO의 의사결정과 보고를 지원합니다.", "연간 구독", "", 62, true, ["월간 보안 현황 보고", "규제 변경 알림", "경영진 정례 보고"]]
];

const SVC_DOC_ICON = '<svg viewBox="0 0 26 32" fill="none" aria-hidden="true"><path d="M2 2h15l7 7v21H2z" stroke="#27c4d5" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 2v7h7M7 16h12M7 21h12M7 26h8" stroke="#8a8a8a" stroke-width="1.5" stroke-linecap="round"/></svg>';

// Radar diagram: four linked nodes around a core glyph. Used only by the /services
// hero (the homes have their own visuals); each node is { href, jump, title, icon(x, y) -> SVG markup }.
function radarSvg(aria, core, label, nodes) {
  const spots = [
    [230, 72, 230, 28, "-0.0s"],
    [388, 210, 388, 266, "-0.3s"],
    [230, 348, 230, 404, "-0.6s"],
    [72, 210, 72, 266, "-0.9s"]
  ];
  const spokes = spots.map(([x, y, , , delay]) =>
    `<line x1="230" y1="210" x2="${x}" y2="${y}" stroke="#3a3a3a" stroke-width="1.5"/>
      <line class="s-flowline" x1="230" y1="210" x2="${x}" y2="${y}" stroke="#27c4d5" stroke-width="1.5" style="animation-delay:${delay}"/>`).join("");
  const links = spots.map(([x, y, tx, ty], i) => {
    const n = nodes[i];
    return `<a href="${n.href}"${n.jump ? ` data-jump="${n.jump}"` : ""} class="node n${i}">
        <circle class="s-halo" cx="${x}" cy="${y}" r="34" fill="none" stroke="#27c4d5" stroke-width="2"/>
        <circle cx="${x}" cy="${y}" r="34" fill="#121212" stroke="#d0d0d0" stroke-width="1.5"/>
        ${n.icon(x - 18, y - 18)}
        <text x="${tx}" y="${ty}" text-anchor="middle">${n.title}</text>
      </a>`;
  }).join("");
  return `<svg class="s-diagram" viewBox="0 0 460 430" role="img" aria-label="${aria}: ${nodes.map((n) => n.title).join(", ")}">
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#27c4d5" stop-opacity=".22"/><stop offset="1" stop-color="#27c4d5" stop-opacity="0"/></linearGradient>
      </defs>
      <circle cx="230" cy="210" r="138" fill="none" stroke="#2e2e2e" stroke-width="1"/>
      <circle cx="230" cy="210" r="112" fill="none" stroke="#4a4a4a" stroke-width="8" stroke-dasharray="1 5"/>
      <g class="s-scan"><path d="M230 210 L230 72 A138 138 0 0 1 327.6 112.4 Z" fill="url(#beam)"/></g>
      ${spokes}
      <circle cx="230" cy="210" r="66" fill="#1a1a1a" stroke="#d0d0d0" stroke-width="2"/>
      ${core}
      <text x="230" y="260" text-anchor="middle" class="ctr">${label}</text>
      <g style="color:#ffffff;--mask:#121212">${links}</g>
    </svg>`;
}

function svcRadar() {
  return radarSvg("정보보호 컨설팅 4개 영역",
    `<path d="M230 168 L258 179 V203 C258 222 246 233 230 240 C214 233 202 222 202 203 V179 Z" fill="none" stroke="#ffffff" stroke-width="2.5"/>
      <path class="s-draw" d="M218 203 L227 212 L244 195" fill="none" stroke="#27c4d5" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    "정보보호 컨설팅",
    SVC_DOMAINS.map((d) => ({
      href: "#security/services", jump: d.id, title: d.title,
      icon: (x, y) => `<use href="${SPRITE}${d.icon}" x="${x}" y="${y}" width="36" height="36"/>`
    })));
}

function svcDomain(d) {
  const items = d.items.map(([icon, title, tag, text]) =>
    `<li><span class="s-ibox">${use(icon)}</span><div><strong>${title}${tag ? `<span class="s-tag">${tag}</span>` : ""}</strong><span class="t">${text}</span></div></li>`).join("");
  return `<article class="s-domain" id="${d.id}">
      <div class="s-fig" aria-hidden="true"><svg viewBox="0 0 240 160">${d.fig}</svg></div>
      <div class="s-domain-body">
        <div class="s-domain-top">
          <span class="s-badge">${use(d.icon)}</span>
          <div><p class="s-eyebrow">DOMAIN ${d.key}</p><h3>${d.title}</h3></div>
        </div>
        <p>${d.desc}</p>
        <ul class="s-items">${items}</ul>
      </div>
    </article>`;
}

function svcPlans() {
  const feat = (p) => (p[2] ? ' class="feat"' : "");
  const head = SVC_PLANS.map((p) =>
    `<th scope="col"${feat(p)}><span class="pt">${p[0]}</span><span class="pn">${p[1]}${p[2] ? '<span class="s-rec">추천</span>' : ""}</span></th>`).join("");
  const fit = SVC_PLANS.map((p) => `<td${feat(p)}>${p[3]}</td>`).join("");
  const dur = SVC_PLANS.map((p) =>
    `<td${feat(p)}><div class="s-dur">${p[4]}${p[5] ? `<small>${p[5]}</small>` : ""}</div><div class="s-bar" aria-hidden="true"><i${p[7] ? ' class="yr"' : ""} style="width:${p[6]}%"></i></div></td>`).join("");
  const docs = SVC_PLANS.map((p) => `<td${feat(p)}><ul>${p[8].map((t) => `<li>${t}</li>`).join("")}</ul></td>`).join("");
  return `<div class="s-cmp-wrap">
      <table class="s-cmp">
        <caption class="sr-only">계약 방식</caption>
        <thead><tr><td></td>${head}</tr></thead>
        <tbody>
          <tr><td></td>${fit}</tr>
          <tr><th scope="row">표준 기간</th>${dur}</tr>
          <tr><th scope="row">산출물</th>${docs}</tr>
        </tbody>
      </table>
    </div>`;
}

function services() {
  const shortcuts = SVC_DOMAINS.map((d) =>
    `<a class="pill ghost sm" href="#security/services" data-jump="${d.id}">${use(d.icon, ' style="--mask:var(--canvas)"')}${d.title}</a>`).join("");
  const steps = SVC_STEPS.map(([icon, name], i) =>
    `<button class="s-step${i ? "" : " on"}" type="button" role="tab" id="st${i + 1}" aria-selected="${i ? "false" : "true"}" aria-controls="stepPanel"${i ? ' tabindex="-1"' : ""}><span class="s-dot">${use(icon)}</span><span class="no s-num">STEP ${i + 1}</span><span class="nm">${name}</span></button>`).join("");
  return `<div class="s-page light" id="svc">
  <section class="s-hero">
    <canvas id="wave" aria-hidden="true"></canvas>
    <div class="s-wrap">
      <div>
        <p class="s-eyebrow">Services</p>
        <h1>네 가지 영역의<br>정보보호 컨설팅</h1>
        <p class="lede">관리체계와 인증부터 AI·클라우드 같은 새로운 위험까지, 조직의 상황에 맞는 영역을 골라 시작할 수 있습니다. 진행 단계와 계약 방식은 이 페이지에서 이어서 확인합니다.</p>
        <div class="pills">${shortcuts}</div>
      </div>
      ${svcRadar()}
    </div>
  </section>

  <nav class="s-subnav" aria-label="페이지 내 이동">
    <div class="s-wrap"><button type="button" data-jump="domains">영역</button><button type="button" data-jump="method">방법론</button><button type="button" data-jump="plans">계약 방식</button></div>
  </nav>

  <section class="s-sec" id="domains">
    <div class="s-wrap">
      <div class="s-domains">${SVC_DOMAINS.map(svcDomain).join("")}</div>
    </div>
  </section>

  <section class="s-sec alt" id="method">
    <div class="s-wrap">
      <div class="s-head">
        <p class="s-eyebrow">How it runs</p>
        <h2>무엇을 받는지, 계약 전에 확인하세요</h2>
        <p>티벨 컨설팅은 6단계로 진행됩니다. 단계마다 받는 문서가 정해져 있어 진행 상황을 직접 확인할 수 있습니다. 실제 범위는 셀프 진단 결과와 상담 내용에 맞춰 조정합니다.</p>
      </div>
      <div class="s-flow">
        <div class="s-track" aria-hidden="true"><i></i></div>
        <div class="s-steps" role="tablist" aria-label="컨설팅 6단계">${steps}</div>
      </div>
      <div class="s-panel" id="stepPanel" role="tabpanel" aria-live="polite">
        <div>
          <p class="s-eyebrow" data-step="no"></p>
          <h3 data-step="name"></h3>
          <p data-step="desc"></p>
        </div>
        <div class="s-docs" data-step="docs"></div>
      </div>
    </div>
  </section>

  <section class="s-sec" id="plans">
    <div class="s-wrap">
      <div class="s-head">
        <p class="s-eyebrow">Engagement</p>
        <h2>조직에 맞는 방식으로 계약하세요</h2>
        <p>한 번의 진단부터 3년 인증 주기, 상시 자문까지 필요한 만큼 고를 수 있습니다.</p>
      </div>
      <div class="s-body">${svcPlans()}</div>
      <p class="s-note">표준 기간은 대상 규모에 따라 달라집니다. 견적은 대상 조직·시스템 범위와 투입 인력 기준을 함께 제시합니다.</p>
      <div class="s-actions">
        <a class="pill" href="#security/inquiry">이 범위로 상담 신청</a>
        <a class="pill ghost" href="#security/cert">인증 일정 보기</a>
      </div>
    </div>
  </section>
</div>`;
}

function wireSvcMotion() {
  if (window.__svcTimer) { clearInterval(window.__svcTimer); window.__svcTimer = null; }
  if (window.__svcWave) { cancelAnimationFrame(window.__svcWave); window.__svcWave = null; }
  if (window.__svcResize) { window.removeEventListener("resize", window.__svcResize); window.__svcResize = null; }
  const root = document.getElementById("svc");
  if (!root) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cv = root.querySelector("#wave");
  const ctx = cv && cv.getContext && cv.getContext("2d");
  function size() {
    const r = window.devicePixelRatio || 1;
    cv.width = cv.clientWidth * r;
    cv.height = cv.clientHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  function drawWave(t) {
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (let j = 0; j < 22; j++) {
      ctx.beginPath();
      const hi = j === 11;
      ctx.strokeStyle = hi ? "rgba(39,196,213,.7)" : "rgba(220,220,220," + (0.05 + j * 0.006) + ")";
      ctx.lineWidth = hi ? 1.2 : 1;
      for (let x = 0; x <= w; x += 8) {
        const p = x / w;
        const y = h * 0.62
          + Math.sin(p * 5.2 + t * 0.0006 + j * 0.13) * (26 + j * 1.6) * Math.sin(p * Math.PI)
          + Math.sin(p * 11 - t * 0.0004 + j * 0.05) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  if (ctx) {
    size();
    drawWave(0);
    window.__svcResize = () => { size(); drawWave(0); };
    window.addEventListener("resize", window.__svcResize);
    if (!reduce) {
      const loop = (t) => {
        if (!document.body.contains(cv)) { window.__svcWave = null; return; }
        drawWave(t);
        window.__svcWave = requestAnimationFrame(loop);
      };
      window.__svcWave = requestAnimationFrame(loop);
    }
  }
  if (reduce) root.querySelectorAll("svg").forEach((svg) => svg.pauseAnimations && svg.pauseAnimations());

  // The security home reuses the hero motion but has no step flow.
  const steps = Array.from(root.querySelectorAll(".s-step"));
  if (!steps.length) return;
  const fill = root.querySelector(".s-track i");
  const panel = root.querySelector("#stepPanel");
  const slot = (name) => panel.querySelector(`[data-step="${name}"]`);
  let cur = 0;

  function show(i) {
    cur = i;
    steps.forEach((step, k) => {
      const on = k === i;
      step.classList.toggle("on", on);
      step.setAttribute("aria-selected", on ? "true" : "false");
      step.tabIndex = on ? 0 : -1;
    });
    if (fill) fill.style.width = (i / (SVC_STEPS.length - 1) * 100) + "%";
    const [, name, desc, docs] = SVC_STEPS[i];
    slot("no").textContent = "STEP " + (i + 1);
    slot("name").textContent = name;
    slot("desc").textContent = desc;
    slot("docs").innerHTML = docs.map((text) => `<div class="s-doc">${SVC_DOC_ICON}<span>${text}</span></div>`).join("");
    panel.setAttribute("aria-labelledby", steps[i].id);
  }
  function stop() { if (window.__svcTimer) { clearInterval(window.__svcTimer); window.__svcTimer = null; } }
  function start() {
    if (reduce) return;
    stop();
    window.__svcTimer = setInterval(() => {
      if (!document.body.contains(root)) { stop(); return; }
      show((cur + 1) % SVC_STEPS.length);
    }, 3200);
  }
  steps.forEach((step, k) => {
    step.addEventListener("click", () => { show(k); stop(); });
    step.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const n = (k + (event.key === "ArrowRight" ? 1 : SVC_STEPS.length - 1)) % SVC_STEPS.length;
      show(n);
      steps[n].focus();
      stop();
      event.preventDefault();
    });
  });
  const method = root.querySelector("#method");
  method.addEventListener("mouseenter", stop);
  method.addEventListener("mouseleave", start);
  show(0);
  start();
}
