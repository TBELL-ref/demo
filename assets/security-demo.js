// Security pages: security_demo/assets/site.js as it is, minus the demo's own header menu. The diagnosis
// hands its result to the inquiry form through sessionStorage (the demo also put it in ?d=).
function securityPage(key) {
  // 보안 문의 is not a security detail page: it keeps the QA inquiry's design (site.js inquiryPage), which also
  // picks up a self-diagnosis result handed over through sessionStorage.
  if (key === "contact") return inquiryPage("security");
  // 컨설팅 서비스 is the user's final design with its own stylesheet scope (#secs); the rest are security_demo pages.
  if (key === "services") return `<div id="secs" class="secd" data-page="services">${SECURITY_DEMO.services}</div>`;
  // Image paths are written from the site root; pages live at /security/…, so prefix the base.
  const body = SECURITY_DEMO[key].replaceAll('src="assets/', `src="${window.TBELL_BASE || "/"}assets/`);
  return `<div id="secd" class="secd${key === "home" ? "" : " theme-inner"}" data-page="${key}">${body}</div>`;
}

// The final services design's script: the hero's line wave and the six steps that advance on their own.
function wireServicesFinal() {
  if (!document.getElementById("secs")) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var cv = document.getElementById("wave");
  var ctx = cv.getContext && cv.getContext("2d");
  function size() {
    var r = window.devicePixelRatio || 1;
    cv.width = cv.clientWidth * r; cv.height = cv.clientHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  function drawWave(t) {
    var w = cv.clientWidth, h = cv.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (var j = 0; j < 22; j++) {
      ctx.beginPath();
      var hi = j === 11;
      ctx.strokeStyle = hi ? "rgba(39,196,213,.7)" : "rgba(220,220,220," + (0.05 + j * 0.006) + ")";
      ctx.lineWidth = hi ? 1.2 : 1;
      for (var x = 0; x <= w; x += 8) {
        var p = x / w;
        var y = h * 0.62
          + Math.sin(p * 5.2 + t * 0.0006 + j * 0.13) * (26 + j * 1.6) * Math.sin(p * Math.PI)
          + Math.sin(p * 11 - t * 0.0004 + j * 0.05) * 6;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  if (ctx) {
    size(); drawWave(0);
    var onResize = function () { if (!cv.isConnected) { window.removeEventListener("resize", onResize); return; } size(); drawWave(0); };
    window.addEventListener("resize", onResize);
    if (!reduce) (function loop(t) { if (!cv.isConnected) return; drawWave(t); requestAnimationFrame(loop); })(0);
  }

  var data = [
    { d: "대상 조직, 시스템, 적용 기준과 규제 기한을 확정합니다.", docs: ["수행계획서", "범위 정의서", "주 단위 일정표"] },
    { d: "인터뷰와 문서·시스템 검토로 기준 대비 현재 수준을 측정합니다.", docs: ["현황 분석서", "GAP 분석 보고서", "기준 간 매핑표"] },
    { d: "자산과 위협을 평가하고, 경영진과 허용 위험 수준(DoA)을 정합니다.", docs: ["정보자산 목록", "위험평가 보고서", "DoA 결정서"] },
    { d: "위험별 대책과 우선순위를 정하고 정책·지침을 정비합니다.", docs: ["정보보호 대책서", "정책·지침 제·개정안", "이행 로드맵"] },
    { d: "대책이 운영되도록 담당 부서와 함께 증적을 쌓고 교육합니다.", docs: ["증적 체크리스트", "임직원 교육 자료", "내부점검 보고서"] },
    { d: "모의 예비심사로 미흡 사항을 먼저 찾고, 본심사 결함 보완까지 지원합니다.", docs: ["모의심사 결과서", "보완조치 계획·결과", "유지관리 계획"] }
  ];
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var fill = document.getElementById("trackFill");
  var docIcon = '<svg viewBox="0 0 26 32" fill="none" aria-hidden="true"><path d="M2 2h15l7 7v21H2z" stroke="#27c4d5" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 2v7h7M7 16h12M7 21h12M7 26h8" stroke="#8a8a8a" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var cur = 0, timer = null;

  function show(i) {
    cur = i;
    steps.forEach(function (s, k) {
      var on = k === i;
      s.classList.toggle("on", on);
      s.setAttribute("aria-selected", on ? "true" : "false");
      s.tabIndex = on ? 0 : -1;
    });
    fill.style.width = (i / (data.length - 1) * 100) + "%";
    document.getElementById("pNo").textContent = "STEP " + (i + 1);
    document.getElementById("pName").textContent = steps[i].querySelector(".nm").textContent;
    document.getElementById("pDesc").textContent = data[i].d;
    document.getElementById("pDocs").innerHTML = data[i].docs.map(function (t) {
      return '<div class="doc">' + docIcon + "<span>" + t + "</span></div>";
    }).join("");
    document.getElementById("stepPanel").setAttribute("aria-labelledby", steps[i].id);
  }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function start() {
    if (reduce) return;
    stop();
    timer = setInterval(function () { if (!fill.isConnected) { stop(); return; } show((cur + 1) % data.length); }, 3200);
  }

  steps.forEach(function (s, k) {
    s.addEventListener("click", function () { show(k); stop(); });
    s.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        var n = (k + (e.key === "ArrowRight" ? 1 : data.length - 1)) % data.length;
        show(n); steps[n].focus(); stop(); e.preventDefault();
      }
    });
  });
  var sec = document.getElementById("method");
  sec.addEventListener("mouseenter", stop);
  sec.addEventListener("mouseleave", start);

  show(0);
  start();
  if (reduce) Array.prototype.forEach.call(document.querySelectorAll("svg"), function (s) { if (s.pauseAnimations) s.pauseAnimations(); });
}

function wireSecurityDemo() {
  if (!document.querySelector(".secd")) return;
  wireServicesFinal();
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.textContent = "복사됨";
        setTimeout(function () { btn.textContent = "복사"; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, selectMail);
      } else {
        selectMail();
      }
    });
  });

  function selectMail() {
    var el = document.getElementById("mail");
    if (!el) return;
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  var $ = function (id) { return document.getElementById(id); };
  var on = function (id) {
    var el = $(id);
    return !!(el && el.checked);
  };

  var navi = $("navi-form");
  if (navi) {
    var lastOut = [];
    var lastPlan = null;
    var BADGE = {
      must: ["b-must", "의무"],
      soon: ["b-soon", "예정"],
      check: ["b-check", "확인 필요"],
      rec: ["b-rec", "권장"]
    };

    function diagnose() {
      var sector = $("q-sector").value;
      var hasIsms = on("h-isms");
      var hasIsmsp = on("h-ismsp");
      var hasIso = on("h-iso");
      var certified = hasIsms || hasIsmsp;
      var out = [];
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

      var list = $("r-list");
      list.textContent = "";
      if (!out.length) {
        var empty = document.createElement("li");
        empty.className = "r-empty";
        empty.textContent = "선택한 조건으로는 의무 대상이 보이지 않습니다. 개인정보를 처리한다면 개인정보 보호법의 안전성 확보조치 기준은 모든 조직에 적용됩니다.";
        list.appendChild(empty);
      }
      var counts = { must: 0, soon: 0, check: 0, rec: 0 };
      out.forEach(function (row) {
        counts[row[0]]++;
        var li = document.createElement("li");
        li.className = "r-item";
        var badge = document.createElement("span");
        badge.className = "r-badge " + BADGE[row[0]][0];
        badge.textContent = BADGE[row[0]][1];
        var body = document.createElement("div");
        var title = document.createElement("h3");
        title.textContent = row[1];
        var desc = document.createElement("p");
        desc.textContent = row[2];
        body.appendChild(title);
        body.appendChild(desc);
        li.appendChild(badge);
        li.appendChild(body);
        list.appendChild(li);
      });
      $("r-sum").innerHTML = out.length
        ? "의무 <b>" + counts.must + "</b> · 예정 <b>" + counts.soon + "</b> · 확인 필요 <b>" + counts.check + "</b> · 권장 <b>" + counts.rec + "</b>"
        : "";
    }

    /* Week spans mirror certification.html ISMS-P gantt; start `w` drives reverse calc. */
    var PHASES = [
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
    var DAY = 86400000;
    var schedRanges = [];

    function fmt(d) {
      return d.getFullYear() + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + String(d.getDate()).padStart(2, "0");
    }

    function parseIso(value) {
      if (!value) return null;
      var parts = value.split("-");
      return new Date(+parts[0], +parts[1] - 1, +parts[2]);
    }

    function addDays(d, n) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    }

    function buildRanges(target, today) {
      return PHASES.map(function (phase) {
        var start = new Date(target.getTime() + phase.w * 7 * DAY);
        var end = addDays(new Date(target.getTime() + phase.endW * 7 * DAY), -1);
        if (end < start) end = start;
        var weeks = Math.max(1, phase.endW - phase.w);
        return {
          start: start,
          end: end,
          weeks: weeks,
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

    function clear(el) {
      if (el) el.textContent = "";
    }

    // Three figures on one line: the verdict, the recommended start (30 weeks before the audit) and the
    // target audit date. The sentences under them (renderStatus) say why; the chart shows where today is.
    function renderSummary(target, start, today, daysLeft) {
      var host = $("plan-summary");
      if (!host) return;
      clear(host);
      var verdict;
      if (target <= today) verdict = { v: "목표일 경과", s: "다른 심사일을 선택하세요", cls: "is-warn" };
      else if (daysLeft >= 0) verdict = { v: "일정 가능", s: "권장 착수일까지 D-" + daysLeft, cls: "is-ok" };
      else verdict = { v: "약 " + Math.ceil(-daysLeft / 7) + "주 부족", s: "단축·병행 일정이 필요합니다", cls: "is-warn" };
      var stats = [
        { k: "일정 판정", v: verdict.v, s: verdict.s, cls: verdict.cls },
        { k: "준비 시작일", v: fmt(start), s: "목표 심사일 30주 전" + (daysLeft < 0 ? " · 이미 지남" : ""), cls: daysLeft < 0 ? "is-late" : "" },
        { k: "목표 심사일", v: fmt(target), s: "인증심사 시작 기준", cls: "" }
      ];
      stats.forEach(function (st) {
        var art = document.createElement("article");
        art.className = "plan-metric" + (st.cls ? " " + st.cls : "");
        art.innerHTML = "<div class=\"k\">" + st.k + "</div><div class=\"v\">" + st.v + "</div><div class=\"s\">" + st.s + "</div>";
        host.appendChild(art);
      });
    }

    // The phases on a month grid, with today drawn across: what lies left of the line is already behind.
    function renderGantt(today) {
      var host = $("sched-cal");
      if (!host) return;
      clear(host);
      if (!schedRanges.length) return;
      var origin = schedRanges.reduce(function (min, r) { return r.start < min ? r.start : min; }, schedRanges[0].start);
      var finish = schedRanges.reduce(function (max, r) { return r.end > max ? r.end : max; }, schedRanges[0].end);
      var span = Math.max(DAY, finish - origin + DAY);
      var pos = function (d) { return ((d - origin) / span) * 100; };
      var md = function (d) { return String(d.getMonth() + 1).padStart(2, "0") + "." + String(d.getDate()).padStart(2, "0"); };

      var chart = document.createElement("div");
      chart.className = "pg";
      chart.setAttribute("role", "img");
      chart.setAttribute("aria-label", "목표 심사일 기준 역산 준비 일정");

      var head = "<div class=\"pg-head\"><span class=\"pg-head-l\">단계</span><div class=\"pg-months\">";
      var grid = "<div class=\"pg-grid\" aria-hidden=\"true\">";
      var cursor = new Date(origin.getFullYear(), origin.getMonth() + (origin.getDate() > 1 ? 1 : 0), 1);
      var first = true;
      while (cursor <= finish) {
        var left = pos(cursor);
        var label = (first || cursor.getMonth() === 0) ? cursor.getFullYear() + "." + String(cursor.getMonth() + 1).padStart(2, "0") : (cursor.getMonth() + 1) + "월";
        head += "<span style=\"left:" + left + "%\">" + label + "</span>";
        grid += "<i style=\"left:" + left + "%\"></i>";
        first = false;
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      }
      if (today >= origin && today <= finish) {
        grid += "<b class=\"pg-today\" style=\"left:" + pos(today) + "%\"><span>오늘 " + md(today) + "</span></b>";
      }
      head += "</div></div>";
      grid += "</div>";

      var rows = schedRanges.map(function (r) {
        var left = Math.max(0, pos(r.start));
        var width = Math.max(0.8, ((r.end - r.start + DAY) / span) * 100);
        return "<div class=\"pg-row" + (r.key ? " is-key" : "") + (r.past ? " is-past" : "") + "\">" +
          "<div class=\"pg-label\"><b>" + r.name + "</b><span>" + md(r.start) + " – " + md(r.end) + "</span></div>" +
          "<div class=\"pg-track\"><span class=\"pg-bar is-" + r.group + "\" style=\"left:" + left + "%;width:" + width + "%\" title=\"" +
          r.name + " · " + fmt(r.start) + " ~ " + fmt(r.end) + (r.off ? " · " + r.off : "") + "\"></span></div></div>";
      }).join("");

      chart.innerHTML = head + "<div class=\"pg-body\">" + grid + rows + "</div>" +
        "<div class=\"pg-legend\"><span><i class=\"is-prep\"></i>준비·컨설팅 단계</span><span><i class=\"is-ops\"></i>고객 운영 기간</span><span><i class=\"is-audit\"></i>인증기관 일정</span></div>";
      host.appendChild(chart);
    }

    // What the verdict means and what can move, in plain sentences under the figures.
    function renderStatus(target, start, today, daysLeft) {
      var verdict = $("p-verdict");
      if (!verdict) return;
      clear(verdict);
      if (target <= today) {
        verdict.className = "plan-status is-warn";
        verdict.innerHTML = "<p class=\"status-msg\">목표 심사일이 오늘 이전입니다. 날짜를 다시 선택해 주세요.</p>";
        return;
      }
      if (daysLeft >= 0) {
        verdict.className = "plan-status is-ok";
        verdict.innerHTML = "<p class=\"status-msg\">권장 착수일 <b>" + fmt(start) + "</b>까지 착수하면 권장 일정을 유지할 수 있습니다.</p>";
        return;
      }
      var shortWeeks = Math.ceil(-daysLeft / 7);
      var adjustFocus = "현황 분석·GAP ~ 보호대책·정책";
      if (shortWeeks <= 4) adjustFocus = "착수·범위 정의 ~ 현황 분석·GAP";
      else if (shortWeeks >= 12) adjustFocus = "착수 전 범위 축소와 앞 단계 병행";
      verdict.className = "plan-status is-warn";
      var reuse = (on("h-iso") || on("h-isms"))
        ? " 보유 인증 증적을 다시 쓰면 앞 준비 단계를 줄일 수 있습니다."
        : "";
      verdict.innerHTML =
        "<p class=\"status-msg\">착수부터 인증심사까지 권장 일정은 약 30주입니다. 권장 착수일 <b>" + fmt(start) + "</b>이 이미 지나, 지금 착수하면 목표 심사일까지 약 " + shortWeeks + "주가 모자랍니다.</p>" +
        "<p class=\"status-adjust\">우선 조정 구간은 <b>" + adjustFocus + "</b>입니다. 신청 전 관리체계 운영 2개월은 줄이기 어렵습니다.</p>" +
        "<details><summary>가능한 일정 조정 방안</summary>" +
        "<p>범위를 좁히거나 분석·대책 단계를 병행하는 단축 일정이 필요합니다." + reuse +
        " 목표 심사일을 뒤로 미루면 권장 일정으로 다시 맞출 수 있습니다.</p></details>";
    }

    function plan() {
      var value = $("p-target").value;
      var steps = $("p-steps");
      clear(steps);
      clear($("plan-summary"));
      clear($("sched-cal"));
      clear($("p-verdict"));
      var target = parseIso(value);
      if (!value || !target) {
        var verdict = $("p-verdict");
        if (verdict) {
          verdict.className = "plan-status";
          verdict.textContent = "목표 심사 시작일을 선택하세요.";
        }
        lastPlan = null;
        schedRanges = [];
        return;
      }
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      schedRanges = buildRanges(target, today);
      schedRanges.forEach(function (range) {
        if (steps) {
          var li = document.createElement("li");
          li.textContent = fmt(range.start) + " ~ " + fmt(range.end) + " " + range.name;
          steps.appendChild(li);
        }
      });
      var start = new Date(target.getTime() - 30 * 7 * DAY);
      var daysLeft = Math.round((start - today) / DAY);
      lastPlan = { target: target, start: start, late: start < today };
      renderSummary(target, start, today, daysLeft);
      renderGantt(today);
      renderStatus(target, start, today, daysLeft);
    }

    navi.addEventListener("change", function () { diagnose(); plan(); });
    navi.addEventListener("submit", function (e) { e.preventDefault(); });
    $("p-target").addEventListener("change", plan);
    $("p-target").addEventListener("input", plan);
    // The whole date field opens the browser's calendar, not only its small icon.
    $("p-target").addEventListener("click", function () {
      try { if (this.showPicker) this.showPicker(); } catch (err) { /* picker not available here */ }
    });
    diagnose();
    plan();

    var toContact = $("to-contact");
    if (toContact) {
      toContact.addEventListener("click", function () {
        var sel = $("q-sector");
        var lines = ["[셀프 진단 결과]", "업종: " + sel.options[sel.selectedIndex].text];
        var held = [["h-isms", "ISMS"], ["h-ismsp", "ISMS-P"], ["h-iso", "ISO 27001"]].filter(function (pair) {
          return on(pair[0]);
        }).map(function (pair) { return pair[1]; });
        lines.push("보유 인증: " + (held.length ? held.join(", ") : "없음"));
        lastOut.forEach(function (row) {
          lines.push("- [" + BADGE[row[0]][1] + "] " + row[1]);
        });
        if (lastPlan) {
          lines.push("목표 인증심사일: " + fmt(lastPlan.target) + " / 권장 착수일: " + fmt(lastPlan.start) + (lastPlan.late ? " (권장 일정보다 늦음)" : ""));
        }
        var text = lastOut.map(function (row) { return row[1]; }).join(" ");
        var areas = [];
        if (/ISMS/.test(text)) areas.push("c1");
        if (/ISO\/IEC 27001|ISO 27001/.test(text)) areas.push("c2");
        if (/개인정보|ISMS-P/.test(text)) areas.push("c3");
        if (/AI|42001/.test(text)) areas.push("c5");
        var payload = {
          message: lines.join("\n"),
          pii: on("q-pii"),
          areas: areas,
          // the inquiry form (site.js fillConsult) ticks its topics by name
          topics: areas.map(function (id) { return { c1: "ISMS·ISMS-P", c2: "ISO 27001 계열", c3: "개인정보 보호", c5: "AI 거버넌스" }[id]; })
        };
        try { sessionStorage.setItem("tbell-consult-v01", JSON.stringify(payload)); } catch (err) { /* storage unavailable */ }
        go("#inquiry/security");
      });
    }
  }

  var form = $("inquiry");
  if (form) {
    var data = null;
    try {
      var fromUrl = new URLSearchParams(location.search).get("d");
      if (fromUrl) data = JSON.parse(fromUrl);
    } catch (err) { data = null; }
    if (!data) {
      try {
        var raw = sessionStorage.getItem("tbell-consult-v01");
        if (raw) data = JSON.parse(raw);
      } catch (err) { data = null; }
    }
    if (data) {
      if (data.message && !$("f-msg").value) $("f-msg").value = data.message;
      if (data.pii && $("sv-pii") && !$("sv-pii").value) $("sv-pii").value = "100만 명 이상";
      (data.areas || []).forEach(function (id) {
        var box = $(id);
        if (box) box.checked = true;
      });
      var note = $("import-note");
      if (note && data.message) note.hidden = false;
    }

    var msg = $("form-msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.classList.remove("err");
      var name = form.elements.name.value.trim();
      var company = form.elements.company.value.trim();
      var email = form.elements.email.value.trim();
      if (!name || !company) {
        msg.textContent = "이름과 회사명을 입력해 주세요.";
        msg.classList.add("err");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = "이메일 주소 형식을 확인해 주세요.";
        msg.classList.add("err");
        return;
      }
      if (!$("f-agree").checked) {
        msg.textContent = "개인정보 수집·이용에 동의해 주세요.";
        msg.classList.add("err");
        return;
      }
      msg.textContent = "입력이 확인되었습니다. 시안이라 실제로 전송되지는 않습니다.";
      try { sessionStorage.removeItem("tbell-consult-v01"); } catch (err) { /* ignore */ }
    });
  }
}
