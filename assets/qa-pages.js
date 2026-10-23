// QA detail page bodies in code, replacing the origin's flattened content-*.png mockups.
// Copy is design_demo/qa-content-baseline.md (confirmed); " / " marks the origin's desktop line break.
// Assets: assets/qa/{logos,icons,photos}. Styles: site.css "QA pages (qp-)".
const QA = "assets/qa/";

// " / " → a line break kept on desktop only (phones re-wrap naturally)
const qpBr = (text) => text.split(" / ").join(' <br class="qp-br">');
const qpSec = (title, lede, inner, cls = "") => `
  <section class="qp-sec${cls ? " " + cls : ""}" data-qp-reveal>
    ${title ? `<h2 class="qp-h">${title}</h2>` : ""}
    ${lede ? `<div class="qp-lede">${lede}</div>` : ""}
    ${inner || ""}
  </section>`;
const qpParas = (list) => list.map((p) => `<p>${qpBr(p)}</p>`).join("");
const qpLogos = (names, cols = 3) => `<ul class="qp-logos" style="--cols:${cols}">${names.map((n) => `<li><img src="${QA}logos/${n[0]}.png" alt="${n[1]}"></li>`).join("")}</ul>`;
const qpIcon = (name, alt = "") => `<img class="qp-ico" src="${QA}icons/${name}.png" alt="${alt}">`;
const qpIconList = (items, cols = 2) => `<ul class="qp-ilist" style="--cols:${cols}">${items.map(([icon, title, text]) => `
    <li>${qpIcon(icon)}<div><h3>${title}</h3><p>${qpBr(text)}</p></div></li>`).join("")}</ul>`;
const qpRule = (title, inner) => `<section class="qp-sec qp-ruled" data-qp-reveal><h2 class="qp-h">${title}</h2>${inner}</section>`;

const LOGO = {
  sk: ["sk-telecom", "SK telecom"], lig: ["lig-nex1", "LIG넥스원"], cyber: ["cyberlogitec", "CyberLogitec"], hmm: ["hmm", "HMM"],
  qtest: ["qtest", "qTest"], tmap: ["tmap-mobility", "TMAP MOBILITY"], woongjin: ["woongjin-thinkbig", "웅진씽크빅"],
  nuri: ["nuriflex", "Nuri Flex"], tproject: ["testproject", "TestProject"]
};
const CUSTOMERS_7 = [LOGO.tmap, LOGO.nuri, LOGO.lig, LOGO.woongjin, LOGO.cyber, LOGO.hmm, LOGO.sk];

// ── Test types ─────────────────────────────────────────────
function qpOutsourcingAdvantages() {
  const cards = [
    "고객의 경영환경 / 분석을 통한 / 명확한 비전 제시",
    "분야별 테스트 전문가 / 파견으로 개발자와 / 자유로운 의사소통",
    "고객의 요구사항을 / 고려한 최적의 / 솔루션 제공",
    "고객의 환경에 맞춘 / 실무자 교육 실시",
    "정확성/신뢰성으로 / 제품 경쟁력 확보"
  ];
  return qpSec("아웃소싱 테스트의 장점", "", `<ol class="qp-numcards">${cards.map((t, i) => `<li style="--i:${i}"><b>0${i + 1}</b><p>${qpBr(t)}</p></li>`).join("")}</ol>`);
}

// Input → box → Output. The same SVG serves both pages; the white variant "opens" the box.
function qpBoxDiagram(kind) {
  const white = kind === "white";
  const name = white ? "White Box" : "Black Box";
  return `<figure class="qp-box${white ? " is-white" : ""}" data-box="${kind}" aria-label="${name} Testing: Input → ${name} → Output">
    <figcaption>${name} Testing</figcaption>
    <svg viewBox="0 0 880 300" role="img" aria-hidden="true">
      <text x="70" y="148" class="qp-box-io">Input</text>
      <line class="qp-dash" x1="175" y1="140" x2="290" y2="140"/><path class="qp-head" d="M290 132 l14 8 -14 8z"/>
      <circle class="qp-box-disc" cx="440" cy="140" r="122"/>
      <g class="qp-cube">
        <path class="f-top" d="M440 72 L510 112 L440 152 L370 112z"/>
        <path class="f-left" d="M370 112 L440 152 L440 232 L370 192z"/>
        <path class="f-right" d="M510 112 L440 152 L440 232 L510 192z"/>
      </g>
      <line class="qp-dash" x1="590" y1="140" x2="705" y2="140"/><path class="qp-head" d="M705 132 l14 8 -14 8z"/>
      <text x="740" y="148" class="qp-box-io">Output</text>
    </svg>
    <p class="qp-box-name">${name}</p>
  </figure>`;
}

function qpTypeIntro(title, en, paras, extra = "") {
  return qpSec(`${title}<br>(${en})`, qpParas(paras), extra, "qp-intro");
}

function automationBody() {
  const rows = [
    ["코딩 여부", ["코딩(javascript,python 등)", "<b>No코딩(개발자 불필요)</b>", "<b>No 코딩(변경시 코딩)<br>영어버전</b>", "코딩(javascript 등)", "코딩(C#, javascript)", "코딩"]],
    ["기능 강점", [
      "•고객 요구사항 분석 후,<br>&nbsp;오픈 소스 활용 개발<br>•개발비외 유지비용 없음",
      "<b>•AI학습, 매우 높은 인식률<br>•시나리오 작성 매우쉬움<br>•단말 성능 측정</b>",
      "<b>•AI Vision인식률 높음</b><br>•통합테스트 관리(계획~)<br><b>•RPA 구축</b>",
      "<b>•UI솔루션 인식률 높음<br>•통합단말(은행등) 강점<br>•RPA 구축</b>",
      "•인식률 적정<br><b>•개발L/C 통합 품질관리<br>•RPA구축, 단말 성능측정</b>",
      "•많은 화면에 대한 기능 및<br>대량 데이터 정합성 점검"]],
    ["적용<br>추천<br>채널", ["고객 인프라 활용 맞춤형<br>APP 및 WEB 자동화 강점", "App 및 증권 MTS<br>자동화 특히 강점", "통합품질관리 강점,<br>ERP 적용 강점", "UI솔루션 기술 기반<br>통합단말(C/S환경) 강점", "통합 품질관리 강점,<br>CICD연계 커스터마이징", "차세대프로젝트 추진 시<br>대량 데이터/성능 검증 강점"], "accent"]
  ];
  const sols = [
    ["", `<img class="qp-tbell" src="assets/tbell-logo.svg" alt="TBELL">`],
    ["Ptero, Stego", `<img src="${QA}logos/apptest-ai.png" alt="Apptest.ai">`],
    ["Tosca, Qtest", `<img src="${QA}logos/tricentis.png" alt="Tricentis">`],
    ["3hand", `<img src="${QA}logos/softbase-evolution.png" alt="Softbase EVOLUTION">`],
    ["Checkmate", `<img src="${QA}logos/symation.png" alt="SYMATION">`],
    ["Perfect win", `<img src="${QA}logos/lgcns-perfectwin.png" alt="LG CNS PerfecTwin">`]
  ];
  const record = (title, list) => `<article><h3>${title}</h3><ul>${list.map((t) => `<li>${t}</li>`).join("")}</ul></article>`;
  return `
    ${qpSec("제공 가치", `<p>${qpBr("티벨은 업무 효율성 증대 및 서비스 신뢰성 향상을 위해 테스트 자동화를 지원해 드립니다. / BDD 기반 테스트 자동화로 비즈니스 인력의 폭넓은 참여와 개발팀과 운영 팀 간의 원활한 의사 소통을 통해 생산성 증대를 약속 드립니다.")}</p>`, `
      <div class="qp-records">
        ${record("BDD Test Automation / TestOps", ["TMAP AUTO Speech 테스트 자동화 (‘23)", "TMAP AUTO Core 고도화 및 OEM 테스트 자동화 (‘22)", "TMAP AUTO Core 테스트 자동화 개발 (‘21)", "웅진씽크빅 북클럽 앱 테스트 자동화 (‘22)", "AMI (Advanced Metering Infrastructure) 테스트 자동화 (‘22)"])}
        ${record("DevOps / ITSM", ["TMAP AUTO Issue Sync System 개발 (‘23)", "SKT TDE DevOps Data Migration to TMAP Mobility (‘22)", "LIGex1 DevOps(SLM 시스템) 업그레이드 및 프로세스 개선 (‘21)", "BizDevOps 시스템(EMS) 구축 (‘20)", "HMM 전사 ITSM 구축 (‘20)", "SKT TDE (DevOps) 전사 운영 (‘16 ~ 20)"])}
      </div>`)}
    ${qpSec("티벨의 테스트 자동화", "", `
      <div class="qp-compare">
        <div class="qp-compare-head"><b>테스트 자동화</b><p>${qpBr("TBELL은 고객사 요구사항에 가장 적합한 테스트 자동화/프로세스를 최소비용(Open source)으로 구축/운영 가능하며, 전략적 파트너사로 Apptest AI, Tricentis, / Softbase, Symation, LGCNS와 협업하고 있어, 고객별 자동화 요건에 적합한 최적의 자동화 솔루션을 제안 및 파트너와 협업 구축하여 고객사의 IT품질수준을 제고함")}</p></div>
        <div class="qp-scroll"><table>
          <tr><th scope="row">솔루션<br>[회사]</th>${sols.map(([name, logo]) => `<td class="qp-sol">${name ? `<b>${name}</b>` : ""}${logo}</td>`).join("")}</tr>
          ${rows.map(([head, cells, tone]) => `<tr${tone ? ` class="is-${tone}"` : ""}><th scope="row">${head}</th>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}
        </table></div>
      </div>`)}
    ${qpSec("고객사", "", qpLogos([LOGO.lig, LOGO.cyber, LOGO.sk, LOGO.hmm, LOGO.qtest, LOGO.tmap, LOGO.woongjin, LOGO.nuri, LOGO.tproject], 5))}`;
}

function blackboxBody() {
  const domains = DOMAINS.map(([title, image]) => `<figure><img src="${ORIGIN}${image}" alt=""><figcaption>${title}</figcaption></figure>`).join("");
  return `
    ${qpTypeIntro("블랙박스 테스트", "Black-Box Testing", [
      "소프트웨어의 요구사항과 명세서를 기반으로 테스트 설계 및 테스트를 수행하며, 이 과정에서 입출력 데이터를 분석하여 / 시스템의 적정성을 확인하는 동적 테스트 서비스입니다. 설계 및 구현 단계에 이르기까지 모든 소프트웨어 개발 단계에서 테스트가 가능합니다.",
      "블랙박스 테스트는 소프트웨어의 품질을 보장하는 데 필수적인 방법입니다. 블랙박스 테스트를 통해 소프트웨어의 버그와 / 오류를 발견하고 수정할 수 있습니다. 또한 블랙박스 테스트는 소프트웨어의 사용성을 개선하고 사용자 만족도를 높이는 데에도 도움이 됩니다."
    ], qpBoxDiagram("black"))}
    ${qpSec("업무 도메인", `<p>업무분야 전반에 걸친 업무 경험을 갖춘 티벨만의 품질 전문가들이 프로젝트에 최적화된 테스트 프로세스를 적용하여 최상의 결과를 제공합니다.</p>`, `<div class="domain-row">${domains}</div>`)}
    ${qpSec("티벨과 함께하는 고객사", "", qpLogos(CUSTOMERS_7))}`;
}

function whiteboxBody() {
  const card = (title, sub, photo) => `<article class="qp-photocard" style="background-image:url('${QA}photos/${photo}.jpg')"><h3>${title}</h3><p>${sub}</p></article>`;
  return `
    ${qpTypeIntro("화이트박스 테스트", "White-Box Testing", [
      "소프트웨어의 내부 구조와 동작을 아는 상태에서 테스트를 수행하는 것으로, 코드를 기반으로 한 테스팅 기법입니다. / 코드 검토를 비롯하여 경계조건, 결정, 경로 테스트 등 대상 소프트웨어에 적합한 테스트를 수행할 수 있습니다.",
      "특히 화이트박스 테스트를 통해 소스코드에 잠재되어 있는 결함과 코딩 표준 위배사항 등을 사전에 검출하여, / 소프트웨어의 안정성 강화와 동시에 오류 수정에 소요되는 비용을 절약할 수 있습니다."
    ], qpBoxDiagram("white"))}
    ${qpSec("업무 범위", `<p>${qpBr("티벨의 화이트박스 테스트 전문가는 다양한 업무영역에서의 화이트박스 테스트 경험을 갖추고 있으며, / 특히 고객 맞춤형 도구를 활용하여 최상의 결과를 제공하고 있습니다.")}</p>`, `
      <div class="qp-cards2">${card("정적 테스트", "Coding Rule Check &amp; Report", "whitebox-static")}${card("동적 테스트", "Coding Rule Check &amp; Report", "whitebox-dynamic")}</div>`)}`;
}

function apiBody() {
  const monitor = `<svg viewBox="0 0 120 96" aria-hidden="true"><rect x="4" y="4" width="112" height="66" rx="4" fill="#6b6b6b"/><rect x="10" y="10" width="100" height="54" fill="#f6f8fa"/><rect x="10" y="38" width="100" height="26" fill="#b7c7d1"/><rect x="20" y="16" width="40" height="3" fill="#b7c7d1"/><rect x="20" y="22" width="40" height="3" fill="#b7c7d1"/>${[22, 50, 78].map((x) => `<rect x="${x}" y="42" width="20" height="18" fill="#fff"/><circle cx="${x + 10}" cy="48" r="3" fill="#b7c7d1"/>`).join("")}<rect x="4" y="70" width="112" height="9" fill="#d9d9d9"/><path d="M50 79 h20 l4 10 h-28z" fill="#6b6b6b"/><rect x="38" y="89" width="44" height="4" rx="2" fill="#6b6b6b"/></svg>`;
  const server = `<svg viewBox="0 0 120 96" aria-hidden="true">${[6, 34].map((y) => `<rect x="10" y="${y}" width="100" height="24" rx="2" fill="#d9d9d9"/><circle cx="21" cy="${y + 8}" r="4" fill="#6b6b6b"/><circle cx="32" cy="${y + 8}" r="4" fill="#6b6b6b"/>${[0, 6, 12].map((d) => `<rect x="68" y="${y + 5 + d}" width="34" height="3" fill="#fff"/>`).join("")}`).join("")}<rect x="56" y="58" width="8" height="18" fill="#b0b0b0"/><rect x="24" y="74" width="72" height="12" fill="#b0b0b0"/><circle cx="60" cy="80" r="9" fill="#8f8f8f" stroke="#d9d9d9" stroke-width="2"/></svg>`;
  const api = `<span class="qp-api">{ api }</span>`;
  const nodes = [[monitor, "Application / /Client"], [api, "API / Requests"], [server, "Server/Data / Source"], [api, "API / Response"]];
  return qpTypeIntro("API 테스트", "Application Programming Interface Testing", [
    "서로 다른 소프트웨어 시스템 사이에 통신과 연동을 위해 API 테스트는 필수적입니다. 특히 다양한 오픈 플랫폼이 등장하고 있고, / 많은 기업들이 서로의 서비스를 연동하기 위한 노력을 늦추지 않고 있으므로, API 테스트의 중요도는 날로 부각된다고 할 수 있습니다.",
    "API 테스트는 기능, 안정성, 성능, 보안성 등을 함께 평가합니다."
  ], `<figure class="qp-flow" aria-label="API testing: Application/Client → API Requests → Server/Data Source → API Response">
      <figcaption>API testing</figcaption>
      <ol>${nodes.map(([art, label], i) => `<li style="--i:${i}"><div class="qp-flow-art">${art}</div><p>${label.split(" / ").join("<br>")}</p></li>`).join("")}</ol>
    </figure>`);
}

function perfBody() {
  const scope = [["perf-load", "부하 테스트"], ["perf-scalability", "확장성 테스트"], ["perf-stress", "스트레스 테스트"], ["perf-stability", "안정성 테스트"], ["perf-volume", "볼륨 테스트"], ["perf-configuration", "구성 테스트"]];
  return `
    ${qpTypeIntro("성능 테스트", "Performance Testing", [
      "시스템의 성능을 측정하고 분석하는 성능 테스트는 요구사항을 만족시키는 데 필요한 처리량과 응답시간, 자원 사용 등과 같은 성능 측정 지표를 / 산출하여 시스템의 성능을 평가합니다. 개발된 시스템의 성능 테스트를 통해, 향후 운영 중 발생할 수 있는 문제점을 / 사전에 파악할 수 있으며 시스템의 한계와 임계점을 검증함으로써 안정적인 운영을 위한 기틀을 마련할 수 있습니다."
    ], `<img class="qp-banner" src="${QA}photos/perf-dashboard.jpg" alt="">`)}
    ${qpSec("업무범위", `<p>${qpBr("티벨은 각 분야의 전문가를 활용하여 성능 테스트를 수행하고 있으며, / 특히 개발 연구소를 통해 최적의 도구 선정과 테스트에 이르기까지의 과정에 참여하고 있습니다.")}</p>`,
      `<ul class="qp-rings">${scope.map(([icon, name], i) => `<li style="--i:${i}">${qpIcon(icon)}<span>${name}</span></li>`).join("")}</ul>`)}
    ${qpSec("주요 활동 도구", "", `<ul class="qp-tools"><li><img src="${QA}logos/loadrunner.png" alt="LoadRunner"><span>로드러너</span></li><li><img src="${QA}logos/apache-jmeter.png" alt="Apache JMeter"><span>제이미터 등</span></li></ul>`)}`;
}

// ── TestOps ────────────────────────────────────────────────
function qpPipeline() {
  return `<figure class="qp-pipe" data-links aria-label="TestOps 개요: Jira Cloud(PMS), Bitbucket/Jenkins CICD, Device/Emulator 연동 파이프라인">
    <div class="qp-pipe-col">
      <h4><b>Jira Cloud</b>(PMS)</h4>
      <div class="qp-pipe-jira">
        <p class="qp-t teal"><b>Jira Cloud</b>(PMS)</p>
        <div class="qp-pipe-dash"><p class="qp-t grey" id="pj-tests">Tests</p><p class="qp-t grey" id="pj-plan">Test Plan</p><p class="qp-t light" id="pj-exec">Execution</p></div>
        <p class="qp-t teal" id="pj-defect"><b>Defect Issue</b></p>
      </div>
    </div>
    <div class="qp-pipe-col">
      <h4><b>Bitbucket/Jenkins CICD</b></h4>
      <div class="qp-pipe-mid">
        <p class="qp-pipe-sub">Pipeline</p>
        <p class="qp-t grey" id="pp-plan"><b>Test Plan</b> : TC Load</p>
        <i class="qp-down" aria-hidden="true"></i>
        <div class="qp-t light big" id="pp-exec"><b>Test Execution<br>(With cucumber)</b><span>TC-01<br>TC-03<br>TC-04</span></div>
        <p class="qp-t grey" id="pp-report"><b>Test Report</b></p>
        <i class="qp-down" aria-hidden="true"></i>
        <p class="qp-t grey" id="pp-defect"><b>Create Defect</b></p>
      </div>
    </div>
    <div class="qp-pipe-col">
      <h4><b>Device/Emulator</b></h4>
      <div class="qp-pipe-right">
        <p class="qp-pipe-sub">Device/Emulator</p>
        <div class="qp-devices" id="pd-dev"><span class="tab">Tablet</span><span class="emu">Emulator</span></div>
        <p class="qp-pipe-sub">Cucumber Reports</p>
        <img id="pd-report" src="${QA}photos/cucumber-report.png" alt="Cucumber 리포트 화면 예시">
        <p class="qp-pipe-sub">Auto Create Defect In Jira</p>
        <img id="pd-jira" src="${QA}photos/jira-defect.png" alt="Jira 결함 자동 생성 화면 예시">
      </div>
    </div>
    <svg class="qp-links" aria-hidden="true"
      data-l="pj-tests>pp-plan|pj-plan>pp-plan|pp-exec>pj-exec|pp-exec>pd-dev|pp-report>pd-report|pp-defect>pj-defect|pp-defect>pd-jira:dash"></svg>
  </figure>`;
}

function qpBddStages() {
  return `<figure class="qp-bdd" aria-label="BDD 기반 테스트 자동화 수행 단계">
    <div class="qp-bdd-disc">
      <h4>Discovery</h4>
      <p class="q">자동화 가능여부 판단</p>
      <p class="qp-t grey"><b>Testable</b><br>Test Automation</p>
      <p class="qp-t light"><b>Non-Testable<br>with Automation</b><br>Black Box Test</p>
    </div>
    <div class="qp-bdd-main">
      <div class="qp-bdd-heads"><h4>Formulation</h4><h4>Automation</h4></div>
      <div class="qp-bdd-steps"><p class="qp-t teal"><b>테스트 시나리오 구성</b><br>(Gherkin Scenario)</p><p class="qp-t teal"><b>테스트 자동화 구현</b><br>(Step 기능 개발)</p><p class="qp-t teal"><b>테스트 자동화 수행</b><br>(CICD 연동)</p></div>
      <div class="qp-bdd-work">
        <ol class="qp-bdd-cycle"><li class="grp">Planning</li><li class="grp">Coding</li><li>Building</li><li>Testing</li><li>Reporting</li></ol>
        <div class="qp-bdd-defs">
          <div><p class="qp-t grey"><b>Gherkin Step</b></p><p>TC-01<br>TC-03<br>TC-04</p></div>
          <div><p class="qp-t grey"><b>Step Definition</b></p><p>각 Step의 기능 개발<br>@Given&emsp;@When&emsp;@Then</p></div>
        </div>
      </div>
    </div>
  </figure>`;
}

function testopsBody() {
  const values = [
    ["서비스 신뢰성 향상", "테스트 자동화로 지속적인 테스트 수행 및 서비스 신뢰성 향상"],
    ["업무 효율성 증대", "반복 테스트 자동화를 통한 리소스 절감 / 광범위한 테스트 수행을 위한 시간 및 비용 절감"],
    ["원활한 소통을 통한 생산성", "BDD 기반 테스트 자동화로 비즈니스 인력의 폭넓은 참여 / 개발팀과 운영팀 간의 원활한 의사 소통으로 생산성 증대"],
    ["테스트 프로세스 자동화 제공", "테스트 계획/수행부터 모니터링, 결과 리포트까지 프로세스 자동화 제공 (TestOps) / 모든 OS/디바이스/브라우저 및 다양한 PMS/TMS 지원"]
  ];
  return `
    ${qpSec("TestOps", `<div class="qp-left">${qpParas([
      "티벨은 최신 테스트 자동화 기술을 적용한 TestOps 환경 구축을 통해 고객에게 최적의 가치를 제공하고 있습니다. / BDD(Behavior Driven Development) 기반 스크립트를 CI/CD 파이프라인에 연결하여 테스트를 자동으로 실행하고, 다양한 프로젝트 관리도구 / 및 테스트 관리도구 연동을 통해 관련 프로세스를 자동화할 수 있는 TestOps 환경 구축 서비스를 제공합니다.",
      "또한 테스트 계획부터 설계, 실행, 결함관리, 결과관리 단계를 전반적으로 개선할 수 있는 테스트 관리 프로세스 자동화 가이드를 제공하고 있습니다. / BDD 시나리오를 이용한 비즈니스 인력과의 원활한 소통으로 생산성을 증대시킬 수 있고, UI 및 음성 발화 테스트 등 다양한 영역의 테스트를 자동화 / 할 수 있습니다. 이러한 BDD 기반 테스트 자동화를 Regression Test 또는 반복적인 테스트에 도입하면 전체적인 테스트 수행 속도 및 신뢰성을 / 향상시킬 수 있습니다."
    ])}</div>`)}
    ${qpSec("TestOps 개요", "", qpPipeline())}
    <section class="qp-venn" data-qp-reveal style="background-image:url('${QA}photos/testops-wave.jpg')">
      <h2 class="qp-h">BDD 기반 TestOps 환경 구축</h2>
      <ul><li><b>TestOps<br>환경 구축</b></li><li><b>BDD 지원<br>Test Management 도구</b></li><li><b>PMS &amp; TMS Integration</b></li></ul>
    </section>
    ${qpSec("BDD 기반 테스트 자동화 수행 단계", "", qpBddStages())}
    ${qpSec("제공가치", "", `<ol class="qp-valuebars">${values.map(([t, d], i) => `<li style="--i:${i}"><b>0${i + 1} ${t}</b><p>${qpBr(d)}</p></li>`).join("")}</ol>`)}
    ${qpSec("고객사", "", qpLogos(CUSTOMERS_7))}`;
}

function qpVoiceDiagram() {
  return `<figure class="qp-voice" aria-label="AI 기반 음성 서비스 테스트 프로세스">
    <div class="qp-voice-ai"><h4>AI Solution</h4><div><p class="qp-t grey">STT</p><p class="qp-t grey">TTS</p><p class="qp-t grey">NLP</p></div></div>
    <div class="qp-voice-links"><p class="l"><b>음성 발화/인식</b><br>(Audio Stream 전송)</p><i class="qp-bi" aria-hidden="true"></i><i class="qp-bi" aria-hidden="true"></i><p class="r"><b>문장 유사도 측정</b></p></div>
    <div class="qp-voice-row">
      <div class="qp-voice-proc">
        <h4>음성 처리</h4>
        <div class="qp-voice-two">
          <div><p class="lbl">음성 명령 생성 자동화</p><p class="qp-t teal"><b>스크립트 분석/수행</b></p></div>
          <div><p class="lbl">응답 스크립트 생성 자동화</p><p class="qp-t teal"><b>테스트 결과 판정</b></p></div>
        </div>
      </div>
      <div class="qp-voice-io"><p>음성 명령 <span aria-hidden="true">→</span></p><hr><p><span aria-hidden="true">←</span> 음성 응답</p></div>
      <div class="qp-voice-dev"><b>검증용<br>단말기</b>${qpIcon("ai-speaker")}</div>
    </div>
    <div class="qp-voice-loop">
      <svg viewBox="0 0 1160 120" preserveAspectRatio="none" aria-hidden="true"><path class="arc a1" d="M190 118 C 260 30, 380 18, 510 18"/><path class="arc a2" d="M650 18 C 790 18, 900 40, 970 118"/></svg>
      <span class="qp-voice-sync">${qpIcon("ai-sync")}<b>VUX 기반 검증 수행</b></span>
    </div>
    <div class="qp-voice-jira"><h4>Jira</h4><div><p class="qp-t teal"><b>테스트 시나리오 생성</b></p><p class="qp-t grey"><b>테스트 데이터 관리</b></p><p class="qp-t teal"><b>테스트 수행결과 생성</b></p></div></div>
  </figure>`;
}

function aitestBody() {
  const strategy = [["분석", ["내부 검증체계 분석", "자동화 가능 여부 분석", "QA 관리 도구 분석"]], ["설계", ["분석 결과 기반<br>자동화 프로세스 설계"]], ["구축", ["자동화 프로세스 구축"]], ["운영", ["자동화 운영 체계 수립"]]];
  const strengths = [
    ["ai-reliability", "서비스 신뢰성 향상", "테스트 자동화 구현으로 / 지속적인 테스트를 수행하여 / 고객 서비스의 신뢰성을 향상시킵니다."],
    ["ai-efficiency", "업무 효율성 증대", "반복 테스트의 자동화를 통해 리소스를 / 절감하고, 광범위한 테스트 수행을 / 위한 시간과 비용을 절감합니다."],
    ["ai-communication", "원활한 소통 통한 / 생산성 증대", "BDD 기반 테스트 자동화로 / 비즈니스 인력의 폭넓은 참여가 가능하고, / 개발팀과 운영팀 간의 원활한 / 의사소통으로 생산성이 증대됩니다."],
    ["ai-process", "테스트 프로세스 / 자동화 구현", "테스트 계획 수행부터 모니터링, / 결과 리포트까지 모든 프로세스의 / 자동화(TestOps)를 제공합니다."]
  ];
  return `
    ${qpSec("AI 기반 검증 자동화", `<div class="qp-left">${qpParas([
      "티벨은 고객이 겪고 있는 문제를 정확하게 파악하고, 요구사항을 반영하여 스마트한 자동화 솔루션을 제공하고 있습니다. / BDD(Behavior Driven Development) Gherkin Scenario 기반 검증 자동화를 구축하여 업무 효율성을 증대하고, 테스트 관리 프로세스 자동화를 통해 / 테스트 수행 속도 및 서비스 신뢰성을 크게 향상시킬 수 있습니다.",
      "특히, 독자적 기술력을 바탕으로 STT, TTS, NLP 등 최신 AI 기술을 적용한 VUX(Voice User Experience) 기반 Voice Test를 구현해 음성 서비스 검증 / 자동화를 구축하였습니다. 체계적인 검증 자동화 프로세스와 고객 맞춤 전략을 통해 지금 겪고 계신 문제를 해결해 드립니다."
    ])}</div>`)}
    ${qpSec("AI 기반 음성 서비스 테스트 프로세스", "", qpVoiceDiagram())}
    ${qpSec("음성 서비스 테스트 구축 전략", "", `<ol class="qp-strategy">${strategy.map(([s, boxes], i) => `<li style="--i:${i}"><span class="qp-ring">${s}</span>${boxes.map((b) => `<p>${b}</p>`).join("")}</li>`).join("")}</ol>`)}
    ${qpSec("주요 강점", "", `<ul class="qp-strengths">${strengths.map(([icon, t, d], i) => `<li style="--i:${i}"><span class="qp-disc">${qpIcon(icon)}</span><h3>${qpBr(t)}</h3><p>${qpBr(d)}</p></li>`).join("")}</ul>`)}
    ${qpSec("고객사", "", qpLogos([LOGO.sk, LOGO.tmap], 2))}`;
}

// ── Company ────────────────────────────────────────────────
function qpRingBand(cls, bg, title, rings, titleInside = true) {
  return `<section class="qp-band ${cls}" data-qp-reveal style="background-image:url('${QA}photos/${bg}')">
    ${title && titleInside ? `<h2 class="qp-h">${title}</h2>` : ""}
    <ul class="qp-bandrings">${rings.map((r, i) => `<li style="--i:${i}">${r}</li>`).join("")}</ul>
  </section>`;
}

function qpAboutIntro() {
  return `${qpSec("회사소개", `<div class="qp-left">${qpParas([
    "인재가 자산인 티벨 홈페이지를 방문해 주신 모든 분들께 감사드립니다.",
    "대한민국 IT산업의 SW품질향상에 기여하고자 테스트에 대한 방법론과 서비스를 차별화하여 테스트 서비스의 패러다임 변화를 주도하고 있습니다. / 이런 우리의 철학과 품질 가치를 중심으로 대기업뿐만 아니라 중소기업 및 벤처기업의 Needs에 맞는 테스트 서비스를 제공하고 있으며, 티벨의 고객 / 솔루션이 사용자에게 만족과 안정성을 드릴 수 있게 서비스를 제공하고 있습니다.",
    "최고의 고객 품질을 지향하는 티벨은 차별화된 테스트 경험을 제공하는 대한민국 대표 품질 서비스 기업입니다. 테스트 서비스를 제공하며 DevOps와 / OpenSource 테스트 기술력에 집중하며 성장세를 기록하고 있습니다. / 앞으로도 티벨은 고객이 만족하고 신뢰할 수 있는 테스트 서비스를 제공하기 위해 끊임없이 노력할 것이며, 한국 시장을 넘어 세계 시장에서 인정받는 / 대한민국 대표 테스트 기업이 되겠습니다. / 또한, 새로운 사업인 AI Data 분야를 통해 생활의 편의성을 증가시키고 IT 강국의 이름을 이어갈 수 있도록 최선을 다할 것입니다.",
    "감사합니다."
  ])}</div>`)}
  <h2 class="qp-h qp-h-solo" data-qp-reveal>티벨 코어</h2>
  ${qpRingBand("qp-core", "core-building.jpg", "", [["core-test", "TEST"], ["core-customer", "CUSTOMER"], ["core-human", "HUMAN"]].map(([i, t]) => `<b>${t}</b><span class="qp-ring2">${qpIcon(i, t)}</span>`))}`;
}

// Six wedges of a half ring; they fan out from the centre when the section comes into view.
function qpCsf() {
  const items = [["신뢰", "csf-trust", "#ffffff"], ["전문성", "csf-expertise", "#f3f3f3"], ["고객만족", "csf-satisfaction", "#cfcfcf"], ["신뢰성", "csf-reliability", "#e6e6e6"], ["기업문화", "csf-culture", "#a9a9a9"], ["보안", "csf-security", "#d4d4d4"]];
  const cx = 500, cy = 470, R = 460, r = 280, gap = 1.2;
  const pt = (rad, deg) => [cx + rad * Math.cos(deg * Math.PI / 180), cy - rad * Math.sin(deg * Math.PI / 180)];
  const wedges = items.map(([label, icon, fill], i) => {
    const a0 = 180 - i * 30 - gap / 2, a1 = 180 - (i + 1) * 30 + gap / 2, mid = 180 - i * 30 - 15;
    const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1), [x2, y2] = pt(r, a1), [x3, y3] = pt(r, a0);
    const [lx, ly] = pt((R + r) / 2 + 30, mid), [ix, iy] = pt(r, mid), [ax0, ay0] = pt(150, mid), [ax1, ay1] = pt(220, mid);
    return `<g class="qp-csf-w" style="--i:${i};--rot:${90 - mid}deg">
      <path d="M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 0 0 ${x3} ${y3}Z" fill="${fill}" stroke="#d6d6d6" stroke-width="2"/>
      <text x="${lx}" y="${ly}" text-anchor="middle">${label}</text>
      <line class="qp-csf-arrow" x1="${ax0}" y1="${ay0}" x2="${ax1}" y2="${ay1}" marker-end="url(#qp-csf-head)"/>
      <circle cx="${ix}" cy="${iy}" r="48" fill="#fff" stroke="#e0e0e0" stroke-width="3"/>
      <image href="${QA}icons/${icon}.png" x="${ix - 28}" y="${iy - 28}" width="56" height="56"/>
    </g>`;
  }).join("");
  return `<figure class="qp-csf" aria-label="TBELL 핵심성공요소: ${items.map((x) => x[0]).join(", ")}">
    <svg viewBox="0 0 1000 500" role="img" aria-hidden="true">
      <defs><marker id="qp-csf-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#cfcfcf"/></marker></defs>
      ${wedges}
      <text x="${cx}" y="${cy - 52}" text-anchor="middle" class="qp-csf-c1">TBELL</text>
      <text x="${cx}" y="${cy - 14}" text-anchor="middle" class="qp-csf-c2">핵심성공요소</text>
    </svg>
  </figure>`;
}

function visionBody() {
  return `
    <section class="qp-mission" data-qp-reveal>
      <h2 class="qp-h">MISSION</h2>
      <blockquote>${qpBr("우리는 고객의 소프트웨어 품질 향상을 위해 / 스마트한 솔루션을 제공하며 / 고객의 가치 향상에 기여합니다.")}</blockquote>
    </section>
    ${qpRingBand("qp-vision", "vision-tree.jpg", "비전 2025", [
      "<p><b>전문적인 솔루션</b>을<br>제공하는 선도 기업</p>",
      "<p><b>국내외 테스트센터 구축</b> 및<br>고객이 인정하는<br>SW테스트 전문 기업</p>",
      "<p><b>즐거움과 행복과 성장</b>을<br>나눌 수 있는 기업</p>"])}
    ${qpSec("공유하고 실천하는 핵심성공요소", "", qpCsf())}`;
}

function qpRecruitIntro() {
  const talents = [
    ["talent-initiative", "주도성", "주어진 일에 대해 책임감을 가지고 될 / 때까지 도전하고 실행하는 인재"],
    ["talent-communication", "커뮤니케이션", "합리적인 의사 소통 및 / 공감적 경청이 가능한 인재"],
    ["talent-synergy", "시너지", "상호 존중과 신뢰를 바탕으로 창조적인 / 대안을 이끌어 낼 수 있는 인재"],
    ["talent-innovation", "끊임 없는 쇄신", "적극적인 자기 개선과 지속적인 / 성장을 추구하는 인재"]
  ];
  const tile = (cls, html) => `<article class="qp-mosaic-${cls}" style="background-image:url('${QA}photos/recruit-mosaic.jpg')"><h3>${html}</h3></article>`;
  return `
    ${qpRule("인재상", qpIconList(talents))}
    ${qpSec("인재채용", "<p>티벨은 올바른 생각과 실천을 통해 “우수한 인재를, 일하기 좋은 기업”을 만듭니다.</p>", "", "qp-tight")}
    <div class="qp-mosaic" data-qp-reveal>
      ${tile("a", "[경력] (주)티벨 SW 테스터 대규모 채용")}
      ${tile("b", "[경력] (주)티벨 개발자 채용<small>상시채용</small>")}
      ${tile("c", "인사팀 경력자 채용")}
    </div>
    ${qpSec("지원방법", "<p>티벨은 즐거움과 행복과 성장을 나눌 수 있는 Good Player를 모집합니다.</p>", "", "qp-tight")}`;
}

function benefitBody() {
  const groups = [
    ["행복", [["benefit-hello-baby", "헬로 베이비", "출산 휴가 10일, / 자녀 탄생 축하 선물"], ["benefit-happy-wedding", "해피 웨딩데이", "포상 휴가 지급, / 축하 화환 전달"], ["benefit-filial-support", "효도 지원금", "환갑, 칠순 / 10만원 별도 지급"], ["benefit-holiday-gift", "명절 선물 지원", "명절 선물세트 지급"], ["benefit-bereaved-support", "유가족 위로 지원", "위로 휴가 지급, / 근조 화환 전달"], ["benefit-health-check", "건강검진", "유급 반차 지원"], ["benefit-long-commute", "장거리 교통비 지원", "근무지 거리에 따라 교통비 지원"], ["benefit-night-commute", "외근 및 비상 교통비", "외근 및 야근 시 교통비 지원"]]],
    ["성장", [["benefit-best-employee", "우수사원 선정", "우수사원 포상 / 매년 우수사원 / 선정 및 포상"], ["benefit-long-service", "장기 근속 포상", "5년 이상 장기 근속자 / 선물 증정"], ["benefit-referral", "인재 추천 제도", "경력직 (1년 이상) 인재 추천 / 추천인, 피추천인 포상금 지급"], ["benefit-praise-award", "칭찬사원 포상", "매월 추천을 통해 이달의 티벨러 추천 / 상금 및 상품 증정"]]],
    ["즐거움", [["benefit-birthday-gift", "생일선물", "생일 도서 선물, / 생일 반차 (자유 선택)"], ["benefit-education", "교육 수강비 지원", "On/Off line 교육 수강비 지원 / 우수 학습자 선정 시 포상금 지급"], ["benefit-club-support", "사내 동호회비 지원", "동호회 운영 규칙에 따라 비용 지원"], ["benefit-cert-retry", "자격증 재도전 지원", "CSTS 탈락 시 재도전 지원비 지급"], ["benefit-cert-exam", "자격증 시험비 지원", "ISTQB or CSTS 취득 시 / 100% 시험비 지원"]]]
  ];
  return groups.map(([t, items]) => qpRule(t, qpIconList(items))).join("");
}

function qpPaper(title, inner) {
  return `<section class="qp-paper" data-qp-reveal style="background-image:url('${QA}photos/paper-texture.jpg')"><div class="qp-paper-in">
    <h2 class="qp-h">${title}</h2>${inner}
    <p class="qp-sign"><span>티벨 대표 이사</span><b>김 종 균</b><img src="${QA}raw/ceo-signature.png" alt="서명"></p>
  </div></section>`;
}

function qpEthicalCode() {
  const rows = [
    ["고객에 대한 윤리", ["01 신용과 정직성을 바탕으로 고객으로부터 신뢰를 얻을 수 있도록 최선을 다한다.<br>02 양질의 제품과 서비스를 통하여 고객의 만족을 제고할 수 있도록 한다.<br>03 업무와 관련되어 취득한 고객의 정보를 보호한다."]],
    ["고객에 대한 윤리", ["01 자유 경쟁의 원칙에 따라 공정하고 자유로운 시장경제 질서를 존중하고 경쟁사와 공정하게 <br class=\"qp-br\">경쟁하여 공정거래 관련 법규를 준수한다.", "02 거래처, 협력업체 등과의 거래 관계에 있어서 상호 신뢰와 존중을 바탕으로 공정한 거래를 통한 <br class=\"qp-br\">상생을 추구한다. 또한 거래처, 협력업체 등의 지속적인 동반성장을 지원한다."]],
    ["사회와 국가에 대한 윤리", ["01 효율적인 경영과 혁신을 바탕으로 가치를 창출하여 기업 시민으로서 경제에 기여한다.<br>02 환경 및 보건안전, 인권 등의 국내외 규범 및 법규를 준수한다.<br>03 사회의 일원으로서 사회적 책임을 다하고 건전한 사회 발전에 공헌한다."]]
  ];
  return qpPaper("윤리 규범", `<dl class="qp-code">${rows.map(([t, ps]) => `<dt>${t}</dt><dd>${ps.map((p) => `<p>${p}</p>`).join("")}</dd>`).join("")}</dl>`) +
    qpSec("윤리경영 정책", "<p>윤리경영 정책 파일 다운로드</p>", "", "qp-tight");
}

function socialBody() {
  const fields = [["social-target-group", "주요 대상", "지역사회 청소년 / 대학교 학생 / 여성 / 장애인"], ["social-activity", "활동 분야", "재능 기부 / 나눔 및 기부 / 채용 / 스포츠 지원"], ["social-contribution", "공헌 활동", "간식 기부 / 전자기계 기부 / 질병관련 용품 기부 / 전문지식 나눔 / 훈련비 지원"]];
  const road = [["social-2022", "2022", "사회공헌 체계확립"], ["social-2023-2024", "2023~2024", "사회공헌 체계 고도화"], ["social-2025", "2025", "가치창출 확대"]];
  const steps = [["접수 및 상담", ""], ["접수 내용 검토", "담당자 접수 : 접수된 제보를 담당자가 접수<br>상담 : 상담 내용 기록 및 고충처리 상담<br>내용검토 : 고충 내용을 확인 및 검토"], ["처리 및 결과 통보", "처리 및 결과 통보<br>고충사항 청취의 경우 10일 이내 조치 및<br>처리결과를 해당 근로자에게 통보"], ["개선 활동", ""]];
  return `
    ${qpPaper("안전보건 경영 방침", qpParas([
      "임직원이 안전하고 쾌적하게 일할 수 있는 직업환경 및 근무환경을 조성한다. 안전보건 관련 법규 및 안전보건 관리 규정을 명확히 인지하고 / 철저히 준수한다. 안전보건 경영체계를 구축하여 사전에 유해 위험 요인을 파악 및 제거함으로써 / 기업의 모든 경영 활동 영역에서 안전사고 또는 재해가 발생하지 않도록 노력한다.",
      "안전보건 교육 및 훈련을 통해 임직원의 안전보건 인식을 제고하고, 안전을 중시하는 문화를 형성한다. / 임직원 및 기타 이해 관계자의 의견을 적극 수렴하여 현장 중심의 안전보건 활동을 수립 및 시행한다. / 안전 사고 또는 재해 발생 시 피해를 최소화하기 위해 비상 대응 체계를 마련한다."
    ]))}
    <section class="qp-sec qp-map" data-qp-reveal style="background-image:url('${QA}photos/worldmap.png')">
      <h2 class="qp-h">사회 공헌</h2>
      <ul class="qp-maprings">
        <li><p><b>비전<br>지속적인 인재 발굴을 통한<br>사회 책임경영 실현</b></p></li>
        <li><p><b>경영 이념</b><br>인재 육성 및 사회적<br>가치창출</p></li>
        <li><p><b>실천전략</b><br>지속적인 청년 인재 채용<br>핵심 인재 육성<br>사회적 가치 창출</p></li>
      </ul>
    </section>
    ${qpRule("추진 분야", `<ul class="qp-ilist" style="--cols:3">${fields.map(([i, t, d]) => `<li>${qpIcon(i)}<div><h3>${t}</h3><p>${d.split(" / ").join("<br>")}</p></div></li>`).join("")}</ul>`)}
    <section class="qp-stairs" data-qp-reveal>
      <h2 class="qp-h">중장기 로드맵</h2>
      <ol>${road.map(([i, y, t], n) => `<li style="--i:${n}">${qpIcon(i)}<b>${y}</b><span>${t}</span></li>`).join("")}</ol>
    </section>
    ${qpSec("근로자 고충처리", "", `<ol class="qp-steps">${steps.map(([t, d], i) => `<li style="--i:${i}"><span class="qp-stepno">0${i + 1}</span><h3>${t}</h3>${d ? `<p>${d}</p>` : ""}</li>`).join("")}</ol>`)}
    ${qpSec("신고 방법", "", `<div class="qp-report">
      <h3>익명 및 실명 신고</h3>
      <h4>카카오톡 오픈 채팅을 통해 익명 혹은 실명으로 신고 가능</h4>
      <p>채널 : @티벨_오픈채팅 <a href="https://open.kakao.com/o/sLEzgTue" target="_blank" rel="noopener noreferrer">https://open.kakao.com/o/sLEzgTue</a><br>익명 : 신고자 정보 노출이 우려되시는 분 (단, 제보 내용이 명확하지 않은 경우 조사를 진행하지 않을 수 있음)<br>실명 : 신고자의 신원에 대해서는 철저히 비밀을 보장</p>
      <h3>그 외 제보 방법</h3>
      <p>우편 : (06242)서울특별시 강남구 강남대로 354, 905호 티벨(역삼동, 혜천빌딩)<br>FAX : 070-7610-7540</p>
    </div>`)}`;
}

function envBody() {
  const card = (photo) => `<article class="qp-photocard" style="background-image:url('${QA}photos/${photo}.jpg')"><h3>친환경 제품 및 서비스</h3><p>친환경 제품 사용<br>친환경 서비스 개발</p></article>`;
  const road = [["env-2022", "2022", "환경경영 정책 수립 및 / 추진체계 구축", "down"], ["env-2023", "2023", "환경경영 / Agenda 발굴", "up"], ["env-2024", "2024", "환경경영 / 시스템 구축", "down"], ["env-2025", "2025", "친환경 / ICT 기업 도약", "up"]];
  return `
    ${qpSec("목표", '<p class="qp-goal">친환경 ICT 기업</p>', `<div class="qp-cards2">${card("env-esg")}${card("env-solar")}</div>`)}
    <section class="qp-sec qp-timeline" data-qp-reveal style="background-image:url('${QA}photos/worldmap.png')">
      <h2 class="qp-h">중장기 로드맵</h2>
      <ol>${road.map(([i, y, t, side], n) => `<li class="is-${side}${n % 2 ? " is-fill" : ""}" style="--i:${n}"><span class="qp-node">${qpIcon(i)}</span><div><b>${y}</b><p>${t.split(" / ").join("<br>")}</p></div></li>`).join("")}</ol>
    </section>`;
}

// ── Motion ─────────────────────────────────────────────────
// Sections reveal once; diagrams draw their links; the box diagram morphs black ↔ white when you
// arrive from its sibling page. Everything is static under prefers-reduced-motion.
function wireQaPages() {
  const root = document.querySelector(".svc-body");
  if (!root || !root.querySelector(".qp-sec, .qp-band, .qp-paper, .qp-mosaic, .qp-stairs")) return;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.toggle("qp-js", !still);
  const items = root.querySelectorAll("[data-qp-reveal]");
  if (still || !("IntersectionObserver" in window)) items.forEach((el) => el.classList.add("is-in"));
  else {
    if (window.__qpIo) window.__qpIo.disconnect();
    window.__qpIo = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); window.__qpIo.unobserve(e.target); }
    }), { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    items.forEach((el) => window.__qpIo.observe(el));
  }

  const box = root.querySelector(".qp-box");
  if (box && !still) {
    const from = window.__qpLastBox;
    if (from && from !== box.dataset.box) {
      box.classList.toggle("is-white", from === "white");
      void box.getBoundingClientRect();
      box.classList.toggle("is-white", box.dataset.box === "white");
    }
  }
  if (box) window.__qpLastBox = box.dataset.box;

  root.querySelectorAll("[data-links]").forEach(drawLinks);
  if (window.__qpResize) window.removeEventListener("resize", window.__qpResize);
  window.__qpResize = () => root.querySelectorAll("[data-links]").forEach(drawLinks);
  window.addEventListener("resize", window.__qpResize);
}

// Elbow connectors between boxes of a figure: "from>to[:dash]" pairs, side chosen by relative position.
function drawLinks(fig) {
  const svg = fig.querySelector("svg.qp-links");
  if (!svg) return;
  const fr = fig.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${fr.width} ${fr.height}`);
  if (window.matchMedia("(max-width: 1024px)").matches) { svg.innerHTML = ""; return; }
  const box = (id) => { const r = fig.querySelector("#" + id).getBoundingClientRect(); return { l: r.left - fr.left, r: r.right - fr.left, t: r.top - fr.top, b: r.bottom - fr.top, cy: (r.top + r.bottom) / 2 - fr.top }; };
  const paths = svg.dataset.l.split("|").map((spec) => {
    const [pair, style] = spec.split(":");
    const [a, b] = pair.split(">").map(box);
    const rightward = b.l > a.r;
    const x0 = rightward ? a.r : a.l, x1 = rightward ? b.l - 12 : b.r + 12;
    const mx = rightward ? Math.max(x0 + 20, (x0 + b.l) / 2) : Math.min(x0 - 20, (x0 + b.r) / 2);
    const y0 = a.cy, y1 = b.cy;
    return `<path class="${style === "dash" ? "dash" : ""}" d="M${x0} ${y0} H${mx} V${y1} H${x1}" marker-end="url(#qp-head)"/>`;
  }).join("");
  svg.innerHTML = `<defs><marker id="qp-head" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#8a8a8a"/></marker></defs>${paths}`;
}
