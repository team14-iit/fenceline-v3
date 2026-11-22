/* FenceLine prototype v3 · routes, views and in-memory state. Data lives in data.js. */
"use strict";
/* icons: inline SVG, 24px grid, stroke = currentColor */
const ICONS = {
 doc: '<path d="M6 2.5h8l4 4V21.5H6z"/><path d="M14 2.5v4h4M9 12h6M9 16h6"/>',
 forecast: '<path d="M3 20.5h18"/><path d="M4 16l5-5 4 3 7-7"/><path d="M15 7h5v5"/>',
 question: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.6"/><path d="M12 16.8v.1"/>',
 hall: '<path d="M3 9.5 12 4l9 5.5"/><path d="M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20.5h18"/>',
 bldg: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10.5 21v-2.5h3V21"/>',
 coin: '<ellipse cx="12" cy="6.5" rx="7" ry="3"/><path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/><path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
 sound: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
 thermo: '<path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
 drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
 shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
 lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',
 xcirc: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
 chev: '<path d="M9 6l6 6-6 6"/>',
 vote: '<path d="M4 12h16v9H4z"/><path d="M7.5 12V4h9v8"/><path d="M9.5 8l2 2 3.5-3.5"/>',
 check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 chat: '<path d="M4 5h16v11H10l-6 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
 play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/>',
 pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
 users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.5-5 6.5-5s5.7 1.5 6.5 5"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 15.3c1.8.8 3 2.4 3.5 4.7"/>',
 gavel: '<path d="M14 4l6 6M11 7l6 6M12.5 5.5l-4 4M17.5 10.5l-4 4M10.5 11.5 4 18"/><path d="M3 21h9"/>'
};const icon = (n, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[n]}</svg>`;

/* helpers (from v2) */
const D = DATA;
const SRC = Object.fromEntries(D.sources.map(s => [s.id, s]));
const CM = Object.fromEntries(D.commitments.map(c => [c.id, c]));
const CL = Object.fromEntries(D.claims.map(c => [c.id, c]));
const LBL = {
 "Documented": { cls: "c-doc", icon: "shield", key: "documented" },
 "Forecast": { cls: "c-fc", icon: "forecast", key: "forecast" },
 "No public source yet": { cls: "c-nps", icon: "question", key: "no-public-source" },
 "Not yet due": { cls: "c-nyd", icon: "cal", key: "not-yet-due" },
 "Evidence missing": { cls: "c-miss", icon: "question", key: "evidence-missing" },
 "Tracked by the city, figures withheld": { cls: "c-trk", icon: "hall", key: "tracked-withheld" },
 "Redacted (proprietary)": { cls: "c-red", icon: "lock", key: "redacted" },
 "Disputed": { cls: "c-disp", icon: "xcirc", key: "disputed" },
 "Verified (specialist)": { cls: "c-ver", icon: "shield", key: "verified-specialist" }
};
const STATUSES = ["Not yet due", "Evidence missing", "Tracked by the city, figures withheld", "Redacted (proprietary)", "Disputed", "Verified (specialist)"];
const CLAIM_LABELS = ["Documented", "Forecast", "No public source yet"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const SIM = (t = "Simulated") => `<span class="sim" title="${esc(D.texts.simTip)}">${t}</span>`;
const MOCKB = () => `<span class="mock" title="${esc(D.texts.simTip)}">${esc(MOCK.badge)}</span>`;
const chip = l => { const m = LBL[l]; return `<span class="chip ${m.cls}">${icon(m.icon)}${esc(l)}</span>`; };
function fmtDate(s) {
 let m;
 if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/))) return `${MON[+m[2] - 1]} ${+m[3]}, ${m[1]}`;
 if ((m = s.match(/^(\d{4})-(\d{2})$/))) return `${MON[+m[2] - 1]} ${m[1]}`;
 return s;
}
const extH = (u, html, title) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer"${title ? ` title="${esc(title)}"` : ""}>${html}<span aria-hidden="true">&nbsp;↗</span><span class="sr"> (opens in new tab)</span></a>`;
function srcRef(r) {
 if (typeof r === "string") r = { id: r };
 const s = SRC[r.id];
 let h = s.links.length === 1 ? extH(s.links[0].u, esc(r.id), s.title) : `${r.id} (${s.links.map(l => extH(l.u, esc(l.label), s.title)).join(", ")})`;
 const note = r.note || (s.secondary ? "secondary" : "") || r.loc;
 if (note) h += ` <span class="muted">(${esc(note)})</span>`;
 return `<span>${h}</span>`;
}
const refs = arr => arr.map(srcRef).join(", ");
const hostOf = u => u.split("/")[2];
function srcItem(id) {
 const s = SRC[id];
 return `${esc(s.title)}${s.secondary ? " (secondary)" : ""}: ${s.links.map(l => extH(l.u, esc(l.label ? l.label + ", " + hostOf(l.u) : hostOf(l.u)), s.title)).join(" and ")}`;
}
function funding(kind, tour) {
 return `<aside class="fund" aria-labelledby="fund-${kind}"${tour ? ` data-tour="${tour}"` : ""}>
  <h2 id="fund-${kind}">Who paid for this ${kind}: simulated example ${SIM()}</h2>
  <dl>
   <dt>Paid by</dt><dd>The applicant, through an escrow account the town controls</dd>
   <dt>Amount</dt><dd>Disclosed here in a real ${kind}</dd>
   <dt>Chose the reviewer, controls publication</dt><dd>The town</dd>
   <dt>Conflicts</dt><dd>Not assessed (simulated example)</dd>
  </dl></aside>`;
}
const fundStrip = kind => `<aside class="fstrip" aria-label="Who paid for this ${kind}"><span class="fh">Who paid: simulated example ${SIM()}</span><span>The developer, through an escrow account the town controls</span><span>The town chose the reviewer and controls publication</span><span>Amount disclosed in a real ${kind}</span><span>Conflicts not assessed (simulated example)</span></aside>`;
const dueHtml = c => `${esc(c.due)}${c.dueNote ? ` <span class="muted">(${esc(c.dueNote)})</span>` : ""}`;
const latest = c => { const d = c.evidence.filter(e => /^\d{4}/.test(e.date)).map(e => e.date).sort().pop(); return d ? fmtDate(d) : "None"; };
const nextBar = (back, next) => `<div class="nextbar noprint"><span>${back || ""}</span>${next || ""}</div>`;
const openClaims = new Set();

/* ---- v3: in-memory state for the mockup screens (resets on reload; spec §7.3 lifecycles) ---- */
function freshState() {
 const wb = {};
 D.claims.forEach(c => { wb[c.id] = { state: "Validated", label: null, by: c.by, ask: c.ask, version: 1 }; });
 return {
  wb, wbSel: queueOrder()[0], wbMsg: "",
  release: { state: "Ready", aud: { staff: true, council: true, consultant: false, developer: false, public: false }, approver: MOCK.console.approvers[0], msg: "", at: "" },
  dispute: null, disputeReason: MOCK.dispute.reasonSample, disputeEvidence: MOCK.dispute.evidenceSample, disputeMsg: "",
  tracerDiff: false
 };
}
function queueOrder() { return D.claims.map(c => c.id).sort((a, b) => MOCK.confidence[a] - MOCK.confidence[b]); }
let STATE = freshState();
const statusOf = c => (STATE.dispute && STATE.dispute.id === c.id ? "Disputed" : c.status);
const disputeCorrection = () => STATE.dispute ? [{ date: "2026-11-22", id: STATE.dispute.id, what: `Status shown as Disputed; previous status ${STATE.dispute.prior} kept as history`, why: "The developer challenged the status with a reason and evidence (dispute open)", by: "Developer, through the response channel", sim: true }] : [];
const allCorrections = () => D.corrections.concat(disputeCorrection());

/* views */
const jstep = ([t, d, k, ic]) => `<li class="${k ? "on" : ""}"><span class="jic" aria-hidden="true">${icon(ic)}</span><b>${esc(t)}</b><span class="d">${esc(d)}</span>${k ? `<span class="here">${icon(k === "brief" ? "doc" : "cal")}${k === "brief" ? "Hearing brief" : "Status report"}</span>` : ""}</li>`;
function aboutSection() {
 return `<section class="about" id="about" aria-labelledby="about-h">
  <h2 id="about-h" tabindex="-1">About FenceLine</h2>
  <p class="lede">We organise and track evidence. We don't rate projects or recommend votes. The developer pays into an account the town controls, and the town sets scope and publication.</p>
  <div class="acols two">
   <section aria-labelledby="m-h"><h3 id="m-h">${icon("doc")}How the status report works</h3>
    <ol class="steps">${D.methodSteps.map(([t, d]) => `<li><span><b>${esc(t)}.</b> ${esc(d)}</span></li>`).join("")}</ol></section>
   <section aria-labelledby="ind-h"><h3 id="ind-h">${icon("shield")}Independence rules</h3>
    <ul class="rules">${D.independence.map(x => { const k = x.indexOf(":"); return `<li><b>${esc(x.slice(0, k))}.</b> ${esc(x.slice(k + 1).trim().replace(/^./, c => c.toUpperCase()))}</li>`; }).join("")}</ul></section>
  </div>
  <div class="acols two">
   <section class="panel" aria-labelledby="idea-h"><h3 id="idea-h">Model code <span class="idea">An idea we are testing</span></h3><p>${esc(D.texts.modelCode)}</p></section>
   <section class="panel" aria-labelledby="who-h"><h3 id="who-h">${icon("user")}Who we are</h3><p>${esc(D.texts.studentLine)}</p></section>
  </div>
  <details class="srcs"><summary>${icon("chev")}All sources (${D.sources.length})</summary>
   <ul class="srclist" style="list-style:none;padding:0">${D.sources.map(s => `<li><b>${s.id}</b> ${srcItem(s.id)} <span class="muted">(accessed ${D.accessed[s.acc]})</span></li>`).join("")}</ul></details>
 </section>`;
}
function heroPreview(C) {
 const row = id => { const c = CL[id]; return `<div class="pvrow">${chip(c.label)}<span class="pvt">${esc(c.claim)}</span><span class="pvby">By: ${esc(c.by)}</span></div>`; };
 return `<figure class="preview">
  <a class="pvlink" href="#/brief" aria-label="Open the sample hearing brief">
   <div class="pvdoc" aria-hidden="true">
    <p class="pvk">Staff report attachment · pre-vote brief</p>
    <p class="pvh">AWS data-center campus, New Albany, Ohio</p>
    <p class="pvvote">${icon("cal")}Vote that sets binding terms: Sept 19, 2023, R-41-2023</p>
    <p class="pvsec">1 · Fiscal and tax claims</p>
    ${["B3", "B5", "B2"].map(row).join("")}
    <p class="pvq"><b>Question for the applicant:</b> ${esc(CL.B3.ask)}</p>
    <p class="pvfund">Who paid for this brief: simulated example ${SIM()}</p>
   </div>
  </a>
  <figcaption class="small muted">${esc(C.sampleLine)} ${SIM()}</figcaption>
 </figure>`;
}
function vStart() {
 const C = D.copy;
 return { title: "Start", crumb: null, tab: "start", html: `<div class="page hero">
  <div class="nudge" aria-hidden="true"><span>It only takes 3 minutes</span><svg viewBox="0 0 120 70" focusable="false"><path d="M6 62 C 40 64, 82 52, 104 14"/><path d="M93 18 L104 12 L107 25"/></svg></div>
  <div class="herogrid">
   <div class="herotext">
    <p class="kicker">${esc(C.startKicker)}</p>
    <h1 tabindex="-1" data-tour="headline">${esc(C.startH1).replace(C.startH1Em, `<em>${C.startH1Em}</em>`)}</h1>
    <p class="lede">${esc(C.startLede)}</p>
    <div class="herocta"><a class="btn btn-p" href="#/brief" data-tour="open-brief">${icon("doc")}Read the sample brief</a>
     <a class="mfeed" href="#/feedback">Give feedback · it only takes 3 minutes →</a></div>
    <ul class="trust" aria-label="How independence works">${C.trust.map(([ic, t]) => `<li>${icon(ic)}${esc(t)}</li>`).join("")}</ul>
   </div>
   ${heroPreview(C)}
  </div>
  <section class="journey" aria-labelledby="j-h" data-tour="journey">
   <h2 id="j-h">Where it fits in a data-center approval</h2>
   <div class="jtrack">
    <div class="band before"><p class="bl" id="jb1">Before the vote</p><ol class="jsteps" aria-labelledby="jb1">${D.journey.slice(0, 3).map(jstep).join("")}</ol>
     <a class="prod " href="#/brief"><span class="pic">${icon("doc")}</span><span class="pbody"><span class="ptitle">Hearing brief</span><span class="ptext">${esc(C.briefCard)}</span><span class="pgo">Read the sample brief →</span></span></a></div>
    <div class="jvote" role="presentation"><span>${icon("vote")}Vote</span></div>
    <div class="band after"><p class="bl" id="jb2">After the vote · every year</p><ol class="jsteps" start="4" aria-labelledby="jb2">${D.journey.slice(3).map(jstep).join("")}</ol>
     <a class="prod " href="#/record"><span class="pic">${icon("cal")}</span><span class="pbody"><span class="ptitle">Commitment status report</span><span class="ptext">${esc(C.recordCard)}</span><span class="pgo">Open the sample report →</span></span></a></div>
   </div>
  </section>
  ${aboutSection()}
 </div>` };
}

/* footnote order used by the brief (section order, then vote source); shared with the assistant */
function briefSourceOrder() {
 const order = [];
 D.sections.forEach(s => s.claims.forEach(id => CL[id].sources.forEach(sid => { if (!order.includes(sid)) order.push(sid); })));
 D.project.voteSources.forEach(id => { if (!order.includes(id)) order.push(id); });
 return order;
}
const askBtn = what => `<button type="button" class="btn btn-s askbtn" data-act="ask" data-tour="ask-open" aria-controls="fl-chat" aria-expanded="${!!(window.FLChat && FLChat.isOpen())}">${icon("chat")}Ask about this ${what}</button>`;

function vBrief(q) {
 const P = D.project, lab = q.get("label") || "all";
 const counts = Object.fromEntries(CLAIM_LABELS.map(l => [l, D.claims.filter(c => c.label === l).length]));
 const match = c => lab === "all" || LBL[c.label].key === lab;
 const shown = D.claims.filter(match).length;
 const order = briefSourceOrder();
 const num = id => order.indexOf(id) + 1;
 const fn = arr => arr.map(id => `<a href="${esc(SRC[id].links[0].u)}" target="_blank" rel="noopener noreferrer" title="${esc(SRC[id].title)} (opens in new tab)">[${num(id)}]</a>`).join(" ");
 const fbtn = (v, n, inner, lbl, tour) => `<button type="button" class="fbtn" data-act="lab" data-v="${v}" aria-pressed="${lab === v}" aria-label="${esc(lbl)}"${tour ? ` data-tour="${tour}"` : ""}><span class="n">${n}</span>${inner}</button>`;
 const firstId = D.sections[0].claims[0];
 const card = c => { const open = openClaims.has(c.id);
  return `<article class="claim lab-${{"Documented":"doc","Forecast":"fc","No public source yet":"nps"}[c.label]}${match(c) ? "" : " out"}" aria-labelledby="ct-${c.id}"${c.id === firstId ? ' data-tour="claim-card"' : ""}>
   <div class="chead">${chip(c.label)}<span class="tag">${icon(D.topicIcon[c.topic])}${esc(c.topic)}</span></div>
   <h3 id="ct-${c.id}">${esc(c.claim)}</h3>
   <p class="cnote">${esc(c.note)} <span class="fnp">${fn(c.sources)}</span></p>
   <p class="by">${icon("user")}<span><span class="byl">Prepared by: </span><b>${esc(c.by)}</b></span></p>
   <p class="ask"><b>Question for the applicant:</b> ${esc(c.ask)}</p>
   <button type="button" class="more" data-act="tog" data-id="${c.id}" aria-expanded="${open}" aria-controls="cp-${c.id}">${icon("chev")}Sources and who prepared them</button>
   <div class="cpanel${open ? " open" : ""}" id="cp-${c.id}">
    <dl>
     <dt>Prepared by</dt><dd class="pby">${esc(c.byFull)}</dd>
     <dt class="psrc">Sources</dt><dd class="psrc"><ul>${c.sources.map(id => `<li>[${num(id)}] ${srcItem(id)} <span class="muted">(accessed ${D.accessed[SRC[id].acc]})</span></li>`).join("")}</ul></dd>
    </dl>
   </div>
  </article>`; };
 return { title: "Hearing brief", crumb: null, tab: "brief", print: "brief", chat: "brief", html: `<div class="page">
 <div class="toolbar noprint"><button type="button" class="linkbtn jump" data-act="jump">Jump to claims ↓</button><a class="linkbtn behind" href="#/workbench" data-tour="open-workbench">${icon("pen")}Behind the brief: how each claim is signed</a>${askBtn("brief")}<button type="button" class="btn btn-s" data-act="print">${icon("doc")}Print / Save as PDF</button></div>
 <article class="doc">
  <header class="dochead">
   <p class="kicker">Staff report attachment · pre-vote brief · sample</p>
   <h1 tabindex="-1">${esc(P.project)}, ${esc(P.town).replace(/ /g, " ")}</h1>
   <dl class="facts4">
    <div><dt>${icon("hall")}Prepared for</dt><dd>${esc(P.board)}</dd></div>
    <div class="vote" data-tour="vote"><dt>${icon("cal")}The vote that sets binding terms</dt><dd>${esc(P.vote)}: ${esc(P.voteWhat)} ${fn(P.voteSources)}</dd></div>
    <div><dt>${icon("user")}Passed to council by</dt><dd>${esc(P.passedBy)}</dd></div>
    <div><dt>${icon("doc")}Yearly review after the vote</dt><dd>${esc(P.county_reviewer)}</dd></div>
   </dl>
   <p class="forwho">${esc(D.texts.forCouncil)}</p>
   <p class="callout">${esc(D.texts.timeframe)}</p>
  </header>
  <section class="pos" aria-label="How this brief relates to your staff report">
   <div><h2>${icon("shield")}What this adds to your staff report</h2><p>${esc(D.position.adds)}</p></div>
   <div><h2>${icon("doc")}What it repeats</h2><p>${esc(D.position.repeats)}</p></div>
   <div><h2>${icon("xcirc")}What it can't support</h2><p>${esc(D.position.cannot)}</p></div>
   <p class="posfoot">${icon("user")}${esc(D.position.foot)}</p>
  </section>
  <div class="docgrid">
   <div>
    <div id="claims" tabindex="-1"></div>
    <div class="filter noprint" role="group" aria-label="Filter claims by label">
     ${fbtn("all", D.claims.length, "All claims", `All claims, ${D.claims.length}`)}
     ${CLAIM_LABELS.map(l => fbtn(LBL[l].key, counts[l], chip(l), `${l}, ${counts[l]}`, l === "No public source yet" ? "label-filter" : "")).join("")}
    </div>
    <p class="glance printonly">${icon("doc")}At a glance: ${D.claims.length} claims · ${CLAIM_LABELS.map(l => `${counts[l]} ${l.toLowerCase()}`).join(" · ")} · ${D.hearingQuestions.length} open questions for the hearing.</p>
    <p class="fnote noprint" aria-live="polite">${lab !== "all" ? (shown ? `Showing ${shown} of ${D.claims.length} claims. ` : `No ${esc(CLAIM_LABELS.find(l => LBL[l].key === lab) || "").toLowerCase()} claims in this sample. `) + `<button type="button" class="linkbtn" data-act="lab" data-v="all">Show all</button>` : `${D.claims.length} claims: ${CLAIM_LABELS.filter(l => counts[l]).map(l => `${counts[l]} ${l.toLowerCase()}`).join(" · ")}.`}</p>
    ${D.sections.map((s, i) => { const cs = s.claims.map(id => CL[id]); const vis = cs.some(match);
     return `<section class="csec"${vis ? "" : " data-empty"} aria-labelledby="sec-${s.id}"${vis ? "" : ' style="display:none"'}>
      <h2 id="sec-${s.id}"><span class="ord" aria-hidden="true">${i + 1}</span>${esc(s.title)}</h2>
      ${s.introKey ? `<p class="sintro">${icon(s.icon)}<span>${esc(D.texts[s.introKey])}</span></p>` : ""}
      ${cs.map(card).join("")}</section>`; }).join("")}
   </div>
   <div class="side">
    ${funding("brief", "funding")}
    <section aria-labelledby="hq-h"><h2 id="hq-h">${icon("question")}Open questions for the hearing</h2>
     <ol class="qlist">${D.hearingQuestions.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
     <p class="neutral">${esc(D.texts.neutrality)}</p></section>
    <section aria-labelledby="key-h"><h2 id="key-h">What the labels mean</h2>
     <ul class="keylist">${CLAIM_LABELS.map(l => `<li>${chip(l)}<br>${esc(D.labels[l])}${counts[l] ? "" : " <span class=\"muted\">None in this sample.</span>"}</li>`).join("")}</ul></section>
    <section aria-labelledby="c5-h"><h2 id="c5-h">${icon("cal")}After the vote: items to follow up</h2>
     <ul class="mini">${D.commitments.filter(c => c.group === "aws").map(c => `<li><span class="id">${c.id}</span><a href="#/record/${c.id}">${esc(c.title)}</a></li>`).join("")}</ul>
     <p class="small muted" style="margin:4px 0 0">Also tracked: ${D.commitments.filter(c => c.group === "near").map(c => `<a href="#/record/${c.id}">${c.id} ${esc(c.title)}</a>`).join("")}.</p></section>
   </div>
  </div>
  <section class="reply" aria-labelledby="rp-h">
   <h2 id="rp-h">Help us test this: reply to <a href="mailto:${esc(CONFIG.contactEmail)}?subject=${encodeURIComponent("FenceLine brief feedback")}">${esc(CONFIG.contactEmail)}</a></h2>
   <ol>${D.feedbackQuestions.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
     </section>
  <section class="sec" aria-labelledby="src-h"><h2 id="src-h">Sources</h2>
   <ol class="srclist">${order.map(id => `<li id="src-${id}">${srcItem(id)}</li>`).join("")}</ol>
   <p class="small muted srcnote" style="margin:4px 0 0">News and city templates accessed Nov 12, 2026; Ohio law and Council agenda accessed Nov 17, 2026. <span class="printonly" style="display:none">For council's receipt and filing with the staff report.</span></p></section>
 </article>
 ${nextBar(`<button type="button" class="btn btn-s" data-act="print">${icon("doc")}Print brief</button>`, `<a class="btn btn-p" href="#/record">Next: Commitment status report →</a>`)}
 </div>` };
}

function vRecord(q) {
 const st = q.get("status") || "all";
 const used = STATUSES.filter(s => D.commitments.some(c => statusOf(c) === s));
 const counts = Object.fromEntries(used.map(s => [s, D.commitments.filter(c => statusOf(c) === s).length]));
 const match = c => st === "all" || LBL[statusOf(c)].key === st;
 const shown = D.commitments.filter(match).length;
 const seg = (v, n, inner, lbl) => `<button type="button" class="fbtn" data-act="f" data-k="status" data-v="${v}" aria-pressed="${st === v}" aria-label="${esc(lbl)}"><span class="n">${n}</span>${inner}</button>`;
 const items = D.commitments.slice().sort((a, b) => a.dueKey.localeCompare(b.dueKey) || a.id.localeCompare(b.id));
 const item = c => { const s = statusOf(c), d = STATE.dispute && STATE.dispute.id === c.id;
  return `<li class="${match(c) ? "" : "out"}">
   <span class="when">${esc(c.due.replace(/, Council vote.*$/, ""))}${c.dueNote ? `<small>${esc(c.dueNote)}</small>` : ""}${c.dueSim ? ` ${SIM()}` : ""}</span>
   <span class="node" aria-hidden="true"></span>
   <a class="tcard s-${{"c-miss":"miss","c-nyd":"nyd","c-trk":"trk","c-disp":"disp"}[LBL[s].cls] || "x"}" href="#/record/${c.id}">
    <span class="thead">${chip(s)} ${SIM()}${d ? ` <span class="prior">Previous: ${esc(STATE.dispute.prior)}</span>` : ""}${c.group === "near" ? ` <span class="grp">${esc(D.groups.near)}</span>` : ""}</span>
    <h3><span class="cid">${c.id}</span>${esc(c.title)}</h3>
    <span class="meta"><span>${esc(c.type)}</span><span>${icon("user")}${esc(c.owner)}</span><span>${icon("doc")}Latest evidence ${esc(latest(c))}</span><span>${icon("cal")}Status as of ${esc(D.lastChecked)}, set by a FenceLine reviewer (simulated)</span></span>
   </a></li>`; };
 return { title: "Commitment status report", crumb: null, tab: "record", print: "record", chat: "report", html: `<div class="page">
   <div class="pagehead"><div><p class="kicker"><span class="noprint">Commitment status report · sample</span><span class="printonly" style="display:none">Annual commitment status report to Council · sample</span></p><h1 tabindex="-1">${esc(D.copy.recordH1)}</h1></div><div class="btns noprint">${askBtn("report")}<button type="button" class="btn btn-s" data-act="print">${icon("doc")}Print annual report</button></div></div>
   <dl class="facts4 four">
    <div><dt>${icon("doc")}Covers</dt><dd>${esc(D.recordFacts.covers)}</dd></div>
    <div><dt>${icon("shield")}Real</dt><dd>${esc(D.recordFacts.real)}</dd></div>
    <div><dt>${icon("question")}Simulated</dt><dd>${esc(D.recordFacts.simulated)}<br><span class="muted">As of ${esc(D.recordUpdated)}</span></dd></div>
    <div><dt>${icon("lock")}Publication</dt><dd>${esc(D.recordFacts.publication)}</dd></div>
   </dl>
   ${fundStrip("record")}
 <section class="section" aria-labelledby="list-h">
  <h2 id="list-h">Commitments by next due date</h2>
  <p class="note2">Due dates are simulated estimates, except C4's, which is real.</p>
  <p class="statuskey printonly"><b>${D.commitments.length} commitments:</b> ${used.map(s => `<b>${counts[s]}</b> ${chip(s)}`).join(" ")} ${SIM()}</p>
  <div class="strip noprint" role="group" aria-label="Filter by status">
   ${seg("all", D.commitments.length, "All", `All commitments, ${D.commitments.length}`)}
   ${used.map(s => seg(LBL[s].key, counts[s], chip(s), `${s}, ${counts[s]}`)).join("")}
  </div>
  <p class="fnote noprint" aria-live="polite">${st !== "all" ? `Showing ${shown} of ${D.commitments.length}. <button type="button" class="linkbtn" data-act="clear">Show all</button>` : ""}</p>
  <ol class="tline" data-tour="timeline">${items.map(item).join("")}</ol>
 </section>
 <section class="section" aria-labelledby="leg-h">
  <h2 id="leg-h">What the statuses mean</h2>
  <dl class="legend">${STATUSES.map(s => `<div><dt>${chip(s)}</dt><dd>${esc(D.labels[s])}${D.statusExamples[s] ? ` ${esc(D.statusExamples[s])} ${SIM()}` : ""}</dd></div>`).join("")}</dl>
 </section>
 <section class="section" aria-labelledby="cor-h" data-tour="corrections">
  <h2 id="cor-h">Corrections</h2>
  <p class="small muted">Every change is dated and explained. Nothing is deleted.</p>
  <table class="tbl">
   <caption class="sr">Corrections, oldest first</caption>
   <thead><tr><th scope="col">Date</th><th scope="col">Commitment</th><th scope="col">What changed</th><th scope="col">Why</th><th scope="col">By whom</th></tr></thead>
   <tbody>${allCorrections().map(x => `<tr>
    <td data-label="Date"><span style="white-space:nowrap">${esc(fmtDate(x.date))}</span>${x.sim ? " " + SIM() : ""}</td>
    <td data-label="Commitment"><span>${x.ids ? x.ids.map(i => `<a href="#/record/${i}">${i}</a>`).join(", ") : `<a href="#/record/${x.id}">${x.id}</a>`}</span></td>
    <td data-label="What changed"><span>${esc(x.what)}</span></td>
    <td data-label="Why"><span>${esc(x.why)}${x.src ? " " + srcRef(x.src) : ""}</span></td>
    <td data-label="By whom"><span>${esc(x.by)}</span></td></tr>`).join("")}</tbody>
  </table>
 </section>
 ${nextBar(`<button type="button" class="btn btn-s" data-act="print">${icon("doc")}Print annual report</button>`, `<a class="btn btn-p" href="#/feedback" data-tour="feedback-next">Next: Give feedback →</a>`)}
 </div>` };
}

function vDetail(id) {
 const c = CM[id], i = D.commitments.indexOf(c), prev = D.commitments[i - 1], next = D.commitments[i + 1];
 const s = statusOf(c), d = STATE.dispute && STATE.dispute.id === id;
 const cors = allCorrections().filter(x => x.id === id || (x.ids && x.ids.includes(id)));
 const sc = { "c-nyd": "s-nyd", "c-trk": "s-trk", "c-disp": "s-disp" }[LBL[s].cls] || "";
 return { title: `${c.id} ${c.title}`, crumb: [["Commitment status report", "#/record"], `${c.id} ${c.title}`], tab: "record", html: `<div class="page">
 <div class="layout">
  <div>
   <p class="idline">${c.id} · ${esc(c.type)}${c.group === "near" ? " · nearby project, test item" : ""}</p>
   <h1 tabindex="-1">${esc(c.title)}</h1>
   <div class="statuscard ${sc}">
    <div class="statusline"><span class="sr">Status:</span>${chip(s)} ${SIM()}</div>
    ${d ? `<p style="font-size:1.0625rem">The developer challenged this status on ${esc(STATE.dispute.at)} (simulated). It shows Disputed until the reviewer decides.</p>
    <p class="small"><b>Previous status, kept as history:</b> ${chip(STATE.dispute.prior)} ${esc(c.reason)}</p>` : `<p style="font-size:1.0625rem">${esc(c.reason)}${c.reasonSources ? ` <span class="small muted">Source: ${refs(c.reasonSources)}</span>` : ""}</p>`}
    ${s === "Evidence missing" ? `<p class="muted small">${esc(D.texts.evidenceMissing)}</p>` : ""}
    <p class="small"><b>What would change it:</b> ${esc(d ? "The reviewer upholds or does not uphold the challenge; every step is dated." : c.change)}</p>
   </div>
   <p class="small muted" style="margin:30px 0 0">What was promised</p>
   <blockquote class="promise" style="margin-left:0">${esc(c.promised)}</blockquote>
   <p class="small muted">Sources: ${refs(c.promisedSources)}</p>
   ${c.note ? `<p class="note"><b>Why it is here:</b> ${esc(c.note)}</p>` : ""}
   <section class="section" aria-labelledby="ev-h"><h2 id="ev-h">Evidence</h2>
        ${cors.length ? `<div class="corr"><h3 class="small">Corrections to this item</h3><ul>${cors.map(x => `<li><b>${esc(fmtDate(x.date))}</b> ${esc(x.what)}${x.sim ? " " + SIM() : ""}</li>`).join("")}</ul></div>` : ""}
    <ul class="tl">${c.evidence.map(e => `<li><span class="d">${esc(fmtDate(e.date))}</span><span>${esc(e.item)}<br><span class="src">Source: ${srcRef(e.src)}</span></span></li>`).join("")}</ul></section>
   <section class="qbox" aria-labelledby="qy-h"><h2 id="qy-h">Two questions for you</h2>
    <ol>${D.detailQuestions.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
    <a href="#/feedback">Answer on the feedback page →</a></section>
  </div>
  <div class="side">
   <dl class="facts">
    <div><dt>Project</dt><dd>${esc(c.project)}</dd></div>
    <div><dt>Type</dt><dd>${esc(c.type)}<br><span class="small muted">Basis: ${esc(c.basis)}</span></dd></div>
    <div><dt>Owner</dt><dd>${esc(c.owner)}</dd></div>
    <div><dt>Who checks</dt><dd>${esc(c.checks)}${c.checksSim ? " " + SIM() : ""}</dd></div>
    <div><dt>Cadence</dt><dd>${esc(c.cadence)}</dd></div>
    <div><dt>Next due</dt><dd>${dueHtml(c)}${c.dueSim ? " " + SIM() : ""}</dd></div>
    <div><dt>Status set by</dt><dd>${esc(D.statusSetBy)} ${SIM()}</dd></div>
    <div><dt>Status as of</dt><dd>${esc(D.lastChecked)} ${SIM()}</dd></div>
   </dl>
   ${funding("record")}
  </div>
 </div>
 <nav class="prevnext" aria-label="Other commitments">
  <span>${prev ? `<a href="#/record/${prev.id}">‹ ${prev.id} ${esc(prev.title)}</a>` : ""}</span>
  <a href="#/record">Back to status report</a>
  <span class="n">${next ? `<a href="#/record/${next.id}">${next.id} ${esc(next.title)} ›</a>` : ""}</span>
 </nav></div>` };
}

function vFeedback() {
 const qs = D.feedbackQuestions.concat(["Anything else? (optional)"]);
 return { title: "Feedback", crumb: null, tab: "feedback", html: `<div class="page">
 <h1 tabindex="-1">Two short questions</h1>
 <p class="lede">Short answers are fine. “We already get this” is a useful answer.</p>
 <div class="layout" style="margin-top:28px"><div>
 <form id="fb" novalidate>
  ${qs.map((x, i) => `<div class="fq"><label for="fq${i + 1}"><span class="qn">${i + 1}.</span>${esc(x)}</label><textarea id="fq${i + 1}" rows="3"></textarea></div>`).join("")}
  <div class="btns">
   <button type="button" class="btn btn-p" data-act="mail">Email my answers</button>
   <button type="button" class="btn btn-s" data-act="copy">Copy answers</button>
  </div>
  <p class="msg" id="fbmsg" role="status" aria-live="polite"></p>
  <textarea id="fbcopy" aria-label="Your answers as text" hidden readonly></textarea>
 </form>
 </div>
 <div class="side">
  <aside class="panel"><h2>${icon("lock")}Where your answers go</h2><p style="margin:0" class="small">Only to the research team at ${esc(CONFIG.contactEmail)}. We quote no one without permission. This page sends nothing by itself.</p></aside>
  <p class="callout">${esc(D.texts.offer)}</p>
 </div></div>
 </div>` };
}

/* ---- v3 mockup screens (spec §4.3–4.4): live HTML, simulated values ---- */
const mockHead = (kicker, h1, sub) => `<div class="mhead"><p class="kicker">${esc(kicker)} ${MOCKB()}</p><h1 tabindex="-1">${h1}</h1>${sub ? `<p class="lede">${sub}</p>` : ""}</div>`;
const lc = s => `<span class="lc lc-${s.toLowerCase().replace(/\s+/g, "-")}">${esc(s)}</span>`;
const lcSteps = (steps, cur, label) => `<ol class="lcsteps" aria-label="${esc(label)}">${steps.map((s, i) => { const ci = steps.indexOf(cur); return `${i ? '<li class="arr" aria-hidden="true">→</li>' : ""}<li class="${i < ci ? "done" : i === ci ? "cur" : ""}"${i === ci ? ' aria-current="step"' : ""}>${esc(s)}</li>`; }).join("")}</ol>`;

function vWorkbench() {
 const order = queueOrder(), sel = STATE.wbSel, c = CL[sel], w = STATE.wb[sel];
 const s0 = SRC[c.sources[0]];
 const cmp = MOCK.comparables[sel];
 const byOpts = [w.by].concat(MOCK.preparedBy.filter(x => x !== w.by));
 return { title: "Analyst workbench", crumb: null, tab: "behind", html: `<div class="page">
  ${mockHead("Analyst workbench · claim review (gate G1)", "AWS data-center campus, New Albany, Ohio")}
  <p class="note2" style="margin-top:8px">AI drafts each claim; an analyst signs it. Only signed claims can appear in a brief.</p>
  <div class="wbgrid">
   <section class="panel wbq" aria-labelledby="wbq-h">
    <div data-tour="wb-queue">
    <h2 id="wbq-h">Review queue · ${order.length} claims</h2>
    <ul class="queue">${order.map(id => { const x = STATE.wb[id], cf = MOCK.confidence[id];
     return `<li><button type="button" class="qitem" data-act="wb-sel" data-id="${id}" aria-pressed="${id === sel}"><span class="qid">${id} · ${esc(CL[id].topic)}</span><span class="conf${cf < 0.8 ? " low" : ""}">conf. ${cf.toFixed(2)}</span>${lc(x.state)}</button></li>`; }).join("")}</ul>
    <p class="small muted" style="margin:8px 0 0">Low confidence first. Confidence values ${SIM()}</p>
    </div>
    <div class="rej" data-tour="wb-rejected">
     <h3>Rejected by the validator (1)</h3>
     <p>${lc("Rejected")} <b>${MOCK.rejectedDraft.id} · ${esc(MOCK.rejectedDraft.topic)}:</b> “${esc(MOCK.rejectedDraft.claim)}”. ${esc(MOCK.rejectedDraft.reason)}. It never reaches the brief. ${SIM()}</p>
    </div>
   </section>
   <section class="panel wbp" aria-labelledby="wbc-h">
    <p class="wbtag">Claim ${sel} · ${esc(c.topic)} · AI draft · version ${w.version} <span data-tour="wb-state">${lc(w.state)}</span></p>
    <h2 id="wbc-h" class="wbclaim">${esc(c.claim)}</h2>
    <div class="srcbox" data-tour="wb-source">
     <p><b>Source ${s0.id}</b> · ${esc(s0.title)}, page and paragraph shown here</p>
     <p class="muted">Quote highlighted in the stored text of the page: <mark>‹stored quote shown here›</mark></p>
     <p class="okline">${icon("check")}Quote found on page · ${icon("check")}number found in quote ${SIM()}</p>
    </div>
    <div class="wbrow"><span class="wbl" id="wbl-l">Label</span>
     <div class="lblpick" role="group" aria-labelledby="wbl-l" data-tour="wb-label">${CLAIM_LABELS.map(l => `<button type="button" class="pick" data-act="wb-label" data-v="${esc(l)}" aria-pressed="${w.label === l}" data-tour="wb-label-${LBL[l].key}">${chip(l)}</button>`).join("")}</div></div>
    <div class="wbrow"><label class="wbl" for="wb-by">Prepared by</label>
     <select id="wb-by" class="field" data-field="by">${byOpts.map(o => `<option${o === w.by ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></div>
    <div class="wbrow"><label class="wbl" for="wb-ask">Question</label>
     <input id="wb-ask" class="field" data-field="ask" type="text" value="${esc(w.ask)}"></div>
    <div class="cmp"><h3>Comparables ${SIM()}</h3>
     ${cmp ? `<div class="cbar" aria-hidden="true"><span class="crange" style="left:${cmp.from * 100}%;width:${(cmp.to - cmp.from) * 100}%"></span><span class="cmark" style="left:${cmp.marker * 100}%"></span></div>
     <p class="small">Shaded: range of yearly payments in ${cmp.n} comparable public Ohio deals. Marker: this claim, outside the range. Wording in the brief: “within / outside the range of N public deals”.</p>`
      : `<p class="small muted" style="margin:6px 0 0">Comparables are shown for yearly payment claims only in this mockup.</p>`}
    </div>
    <div class="wbbtns">
     <button type="button" class="btn btn-s" data-act="wb-reject">${w.state === "Rejected" ? "Reopen" : "Reject"}</button>
     <button type="button" class="btn btn-s" data-act="wb-save">Save draft</button>
     <button type="button" class="btn btn-p" data-act="wb-sign" data-tour="wb-sign"${w.state === "Signed" ? ' aria-disabled="true"' : ""}>${icon("pen")}Sign claim · G1</button>
    </div>
    <p class="msg" role="status" aria-live="polite">${esc(STATE.wbMsg)}</p>
   </section>
  </div>
  ${nextBar(`<a href="#/brief">‹ Back to the hearing brief</a>`, `<a class="btn btn-p" href="#/tracer" data-tour="open-tracer">Next: What council is locking in →</a>`)}
 </div>` };
}

function vTracer() {
 const T = MOCK.tracer, O = MOCK.outcomes;
 const oc = (k, extra) => `<span class="oc ${O[k].cls}">${icon(O[k].icon)}${esc(O[k].label)}${extra ? `; ${esc(extra)}` : ""}</span>`;
 return { title: "What council is locking in", crumb: null, tab: "behind", html: `<div class="page">
  ${mockHead("Promise-to-condition tracer · before the binding vote", "What council is locking in", `AWS data-center campus, New Albany · compared with ${esc(T.draft)} ${SIM()}`)}
  <div class="tblwrap" data-tour="tracer-table">
  <table class="tbl trc">
   <caption class="sr">Hearing claims and their outcome in the draft terms (simulated)</caption>
   <thead><tr><th scope="col">Claim made at hearing</th><th scope="col">Outcome in the draft terms</th><th scope="col">Where</th></tr></thead>
   <tbody>${T.rows.map(r => `<tr><td data-label="Claim"><span><span class="cid">${r.claim}</span> ${esc(r.text)}</span></td><td data-label="Outcome"><span>${oc(r.outcome, r.extra)} ${SIM()}</span></td><td data-label="Where"><span>${r.where ? esc(r.where) : '<span aria-label="none">—</span>'}</span></td></tr>`).join("")}</tbody>
  </table></div>
  <div class="since" data-tour="tracer-since"><p><b>Since draft v2:</b> ${esc(T.since)} ${SIM()}</p>
   <button type="button" class="btn btn-s" data-act="tr-diff" aria-expanded="${STATE.tracerDiff}" aria-controls="trdiff">${STATE.tracerDiff ? "Hide changes" : "View changes"}</button></div>
  <div id="trdiff" class="panel trdiff"${STATE.tracerDiff ? "" : " hidden"}><h2>Changes since draft v2</h2>
   <ul>${T.changes.map(x => `<li><b>${x.claim}</b> ${esc(CL[x.claim].claim)}: ${oc(x.from)} → ${oc(x.to)}. ${esc(x.note)}. ${SIM()}</li>`).join("")}</ul></div>
  <p class="neutral">We show where each figure ended up. We never recommend a vote.</p>
  <section class="section" aria-labelledby="oc-h"><h2 id="oc-h">What the outcomes mean</h2>
   <dl class="legend">${Object.keys(O).map(k => `<div><dt>${oc(k)}</dt><dd>${esc(O[k].def)}</dd></div>`).join("")}</dl></section>
  ${nextBar(`<a href="#/workbench">‹ Analyst workbench</a>`, `<a class="btn btn-p" href="#/record">Next: Commitment status report →</a>`)}
 </div>` };
}

function audienceText(aud) {
 const xs = MOCK.console.audiences.filter(([k]) => aud[k]).map(([k]) => MOCK.console.audienceShort[k]);
 return xs.length <= 1 ? xs.join("") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
}
function vConsole() {
 const R = STATE.release, C = MOCK.console, rel = R.state === "Released";
 return { title: "Town console", crumb: null, tab: "behind", html: `<div class="page">
  ${mockHead("Town console · release (gate G3)", `Hearing brief, version ${C.version}`, "AWS data-center campus, New Albany, Ohio")}
  <div class="relstate" data-tour="console-status">
   ${lcSteps(["Draft", "Ready", "Released", "Superseded"], R.state, "Release status")}
   ${rel ? `<p class="released">${icon("check")}Released to ${esc(audienceText(R.aud))} · approved by ${esc(R.approver)} · ${esc(R.at)} ${SIM()}</p>
   <p class="small muted" style="margin:6px 0 0">A released version never changes. Corrections produce a new version.</p>` : ""}
  </div>
  <div class="tiles" data-tour="console-results">
   <div class="tile"><h2>Factual review (G2)</h2><p>${esc(C.factual)} ${SIM()}</p></div>
   <div class="tile"><h2>Accessibility</h2><p>${icon("check")}${esc(C.access)} ${SIM()}</p></div>
   <div class="tile"><h2>Withheld items</h2><p>${esc(C.withheld)} ${SIM()}</p></div>
  </div>
  <section class="panel relpanel" aria-labelledby="aud-h">
   <div data-tour="console-audience">
   <h2 id="aud-h">Who can see this version</h2>
   <fieldset class="aud"${rel ? " disabled" : ""}><legend class="sr">Audience for version ${C.version}</legend>
    ${C.audiences.map(([k, t]) => `<label><input type="checkbox" data-aud="${k}"${R.aud[k] ? " checked" : ""}> ${esc(t)}</label>`).join("")}</fieldset>
   </div>
   <div class="wbrow"><label class="wbl" for="rel-by">Approved by</label>
    <select id="rel-by" class="field" data-rfield="approver"${rel ? " disabled" : ""}>${C.approvers.map(a => `<option${a === R.approver ? " selected" : ""}>${esc(a)}</option>`).join("")}</select></div>
   <p class="small muted" style="margin:12px 0 0">Release footer: who paid and how much · version · history fingerprint of the change log.</p>
   <div class="wbbtns">
    <button type="button" class="btn btn-s" data-act="rel-hold"${rel ? " disabled" : ""}>Hold</button>
    <button type="button" class="btn btn-p" data-act="rel-go" data-tour="console-release"${rel ? " disabled" : ""}>Release version ${C.version}</button>
   </div>
   <p class="msg" role="status" aria-live="polite">${esc(R.msg)}</p>
  </section>
  ${nextBar(`<a href="#/brief">‹ Hearing brief</a>`, `<a class="btn btn-p" href="#/record">Next: Commitment status report →</a>`)}
 </div>` };
}

function vDispute() {
 const c = CM[MOCK.dispute.id], d = STATE.dispute, s = statusOf(c);
 return { title: "Developer response", crumb: null, tab: "behind", html: `<div class="page">
  ${mockHead("Developer response · challenge a status", `${c.id} ${esc(c.title)}`)}
  <div class="statuscard ${d ? "s-disp" : ""}" data-tour="dispute-status">
   <div class="statusline">Current status: ${chip(s)} ${SIM()}</div>
   <p class="small">As of ${esc(D.lastChecked)} · set by a FenceLine reviewer</p>
   ${d ? `${lcSteps(["Open", "Under review", "Upheld or Not upheld", "Closed"], "Open", "Dispute status")}
   <h2 class="small" style="margin-top:14px">Status history</h2>
   <ol class="hist">
    <li><span class="d">${esc(D.lastChecked)}</span> ${chip(d.prior)} Set by a FenceLine reviewer. Previous status, kept as history. ${SIM()}</li>
    <li><span class="d">${esc(d.at)}</span> ${chip("Disputed")} Dispute opened by the developer; shown until the reviewer decides. ${SIM()}</li>
   </ol>` : ""}
  </div>
  <form class="panel dform" data-tour="dispute-form" novalidate>
   <div class="wbrow"><span class="wbl">Your role</span><span>Developer (project owner)</span></div>
   <div class="wbrow"><label class="wbl" for="dp-reason">Reason</label>
    <textarea id="dp-reason" class="field" data-dfield="disputeReason" rows="3" placeholder="Explain why the status should change and point to the evidence."${d ? " disabled" : ""}>${esc(STATE.disputeReason)}</textarea></div>
   <div class="wbrow"><label class="wbl" for="dp-ev">Evidence</label>
    <input id="dp-ev" class="field" type="text" data-dfield="disputeEvidence" value="${esc(STATE.disputeEvidence)}" placeholder="Attach file · shared with the town, not published"${d ? " disabled" : ""}></div>
   <p class="small" style="margin:14px 0 0">The status shows ${chip("Disputed")} until the reviewer decides. Every step is dated in the corrections log. Sample text is filled in for the demo.</p>
   <div class="wbbtns"><button type="button" class="btn btn-p" data-act="dp-submit" data-tour="dispute-submit"${d ? " disabled" : ""}>Submit</button></div>
   <p class="msg" role="status" aria-live="polite">${STATE.disputeMsg}</p>
  </form>
  ${nextBar(`<a href="#/record/${c.id}">‹ ${c.id} in the status report</a>`, `<a class="btn btn-p" href="#/record">Next: Commitment status report →</a>`)}
 </div>` };
}

function vQuestions() {
 return { title: "Resident questions", crumb: null, tab: "behind", html: `<div class="page">
  ${mockHead("Resident questions · released by the town", "Questions raised at the hearing", "Each question is linked to the claim it concerns and answered from a public source, or marked “No public source yet”. Names are not shown.")}
  <div class="qcards" data-tour="questions-list">${MOCK.questions.map((x, i) => `<section class="panel qcard" aria-labelledby="rq-${i}">
   <p class="tag">${icon(D.topicIcon[x.topic])}${esc(x.topic)}</p>
   <h2 id="rq-${i}">${esc(x.q)}</h2>
   ${x.answers.map(a => `<div class="linked"><p>Linked claim ${a.claim}: <i>${esc(CL[a.claim].claim)}</i></p>
    <p>${chip(a.label)} ${esc(a.text)}${a.sim ? " " + SIM() : ""} <span class="small muted">Source: ${refs(a.sources)}</span></p></div>`).join("")}
  </section>`).join("")}</div>
  <p class="small muted" style="margin-top:16px">The town decides what appears here. FenceLine organises questions; it takes no side. Sample questions ${SIM()}</p>
  ${nextBar(`<a href="#/brief">‹ Hearing brief</a>`, `<a class="btn btn-p" href="#/feedback">Next: Give feedback →</a>`)}
 </div>` };
}

/* shell + router */
const TABS = [["brief", "#/brief", "Hearing brief"], ["record", "#/record", "Commitment status"]];
const BEHIND = [["/workbench", "Analyst workbench", "Gate G1"], ["/tracer", "What council is locking in", "Before the binding vote"], ["/console", "Town console", "Gate G3"], ["/dispute", "Developer response", "Challenge a status"], ["/questions", "Resident questions", "Released by the town"]];
function parse() {
 let h = location.hash.replace(/^#/, "");
 try { h = decodeURI(h); } catch (_) { h = "/"; }
 if (!h.startsWith("/")) h = "/";
 const [path, qs] = h.split("?");
 return { path: path.replace(/\/+$/, "") || "/", q: new URLSearchParams(qs || "") };
}
function pick({ path, q }) {
 let m;
 if (path === "/brief") return vBrief(q);
 if (path === "/record") return vRecord(q);
 if ((m = path.match(/^\/record\/(C[1-5])$/i))) return vDetail(m[1].toUpperCase());
 if (path === "/about" || path === "/method" || path === "/log") return Object.assign(vStart(), { title: "About", tab: "about", anchor: "#about-h" });
 if (path === "/feedback") return vFeedback();
 if (path === "/workbench") return vWorkbench();
 if (path === "/tracer") return vTracer();
 if (path === "/console") return vConsole();
 if (path === "/dispute") return vDispute();
 if (path === "/questions") return vQuestions();
 return vStart();
}
function navHtml(tab, path) {
 const tips = !!(window.FLTour && FLTour.tipsOn());
 return TABS.map(([k, h, t]) => `<li><a href="${h}"${k === tab ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")
  + `<li class="sub"><button type="button" class="subbtn" id="subbtn" aria-expanded="false" aria-controls="submenu"${tab === "behind" ? " data-current" : ""}>Behind the brief${icon("chev")}</button>
   <ul class="submenu" id="submenu" hidden>${BEHIND.map(([p, t, d]) => `<li><a href="#${p}"${p === path ? ' aria-current="page"' : ""}><span>${esc(t)}</span><small>${esc(d)} · mockup</small></a></li>`).join("")}</ul></li>`
  + `<li><button type="button" class="navbtn" id="tipsbtn" aria-pressed="${tips}" title="Show tips on key elements">Tips</button></li>`
  + `<li class="cta"><a href="#/feedback" data-tour="feedback-nav"${tab === "feedback" ? ' aria-current="page"' : ""}>Give feedback</a></li>`;
}
function render(moveFocus, refocus) {
 const where = parse();
 const r = pick(where);
 const view = document.getElementById("view");
 view.innerHTML = r.html;
 if (moveFocus) { view.classList.remove("fade"); void view.offsetWidth; view.classList.add("fade"); }
 document.title = `${r.title} · FenceLine prototype ${CONFIG.version}`;
 const cr = document.getElementById("crumb");
 if (r.crumb) {
  const crumbs = [["Home", "#/"]].concat(r.crumb);
  cr.innerHTML = "<ol>" + crumbs.map((c, i) => { const last = i === crumbs.length - 1;
   if (Array.isArray(c) && !last) return `<li><a href="${c[1]}">${esc(c[0])}</a></li>`;
   return `<li${last ? ' aria-current="page"' : ""}>${esc(Array.isArray(c) ? c[0] : c)}</li>`; }).join("") + "</ol>";
  cr.hidden = false;
 } else { cr.innerHTML = ""; cr.hidden = true; }
 document.getElementById("tabs").innerHTML = navHtml(r.tab, where.path);
 document.documentElement.className = r.print ? `page-${r.print}` : "";
 document.getElementById("foot").innerHTML = `<p>${esc(D.texts.disclaimer)} <a class="noprint" href="#/about">About FenceLine</a></p><p><span class="vtag">${esc(CONFIG.versionTag)}</span> ${esc(D.texts.aiUse)}</p>`;
 closeMenu();
 if (refocus) { const el = document.querySelector(refocus); if (el) el.focus(); }
 else if (r.anchor) { const a = document.querySelector(r.anchor); if (a) { a.scrollIntoView(); a.focus({ preventScroll: true }); } }
 else if (moveFocus) { window.scrollTo(0, 0); const h = document.querySelector("#view h1"); if (h) h.focus({ preventScroll: true }); }
 document.dispatchEvent(new CustomEvent("fl:render", { detail: { path: where.path, chat: r.chat || null } }));
}
function setQuery(k, v) {
 const { path, q } = parse();
 if (v === null || v === "all" || v === "") q.delete(k); else q.set(k, v);
 const qs = q.toString();
 history.replaceState(null, "", "#" + path + (qs ? "?" + qs : ""));
}
function setSub(open) { const b = document.getElementById("subbtn"), m = document.getElementById("submenu"); if (!b || !m) return; b.setAttribute("aria-expanded", String(open)); m.hidden = !open; }
function closeMenu() { document.getElementById("nav").classList.remove("open"); document.getElementById("menubtn").setAttribute("aria-expanded", "false"); setSub(false); }
document.getElementById("menubtn").addEventListener("click", e => {
 const n = document.getElementById("nav"), open = !n.classList.contains("open");
 n.classList.toggle("open", open); e.currentTarget.setAttribute("aria-expanded", String(open));
});
document.getElementById("nav").addEventListener("click", e => {
 if (e.target.closest("#subbtn")) { setSub(document.getElementById("submenu").hidden); return; }
});
document.addEventListener("click", e => { if (!e.target.closest(".sub")) setSub(false); });
document.getElementById("nav").addEventListener("keydown", e => { if (e.key === "Escape" && !document.getElementById("submenu").hidden) { setSub(false); document.getElementById("subbtn").focus(); } });

function wbNewVersion(w) { w.version++; w.state = "Validated"; STATE.wbMsg = `Edited after signing: version ${w.version}, back to Validated. Sign it again to use it in a brief.`; }
document.getElementById("view").addEventListener("click", e => {
 const b = e.target.closest("[data-act]");
 if (!b) return;
 const act = b.dataset.act;
 if (act === "tog") { const id = b.dataset.id, p = document.getElementById("cp-" + id), open = !p.classList.contains("open");
  p.classList.toggle("open", open); b.setAttribute("aria-expanded", String(open)); open ? openClaims.add(id) : openClaims.delete(id); return; }
 if (act === "lab") { setQuery("label", b.dataset.v); render(false, `.fbtn[data-act="lab"][data-v="${b.dataset.v}"]`); return; }
 if (act === "f") { setQuery(b.dataset.k, b.dataset.v); render(false, `.fbtn[data-act="f"][data-v="${b.dataset.v}"]`); return; }
 if (act === "clear") { setQuery("status", null); render(false, '.fbtn[data-act="f"][data-v="all"]'); return; }
 if (act === "print") { window.print(); return; }
 if (act === "jump") { const t = document.getElementById("claims"); t.scrollIntoView(); t.focus({ preventScroll: true }); return; }
 if (act === "mail") { mailAnswers(); return; }
 if (act === "copy") { copyAnswers(); return; }
 if (act === "ask") { if (window.FLChat) FLChat.toggle(); return; }
 // workbench (G1): Validated → Signed; any edit after signing returns it to Validated (spec §7.3)
 const w = STATE.wb[STATE.wbSel];
 if (act === "wb-sel") { STATE.wbSel = b.dataset.id; STATE.wbMsg = ""; render(false, `.qitem[data-id="${b.dataset.id}"]`); return; }
 if (act === "wb-label") {
  if (w.state === "Rejected") STATE.wbMsg = "Rejected claims cannot be labelled. Reopen it first.";
  else if (w.label !== b.dataset.v) { if (w.state === "Signed") wbNewVersion(w); else STATE.wbMsg = ""; w.label = b.dataset.v; }
  render(false, `.pick[data-v="${b.dataset.v}"]`); return; }
 if (act === "wb-sign") {
  if (w.state === "Rejected") STATE.wbMsg = "Rejected claims cannot be signed. Reopen it first.";
  else if (w.state === "Signed") STATE.wbMsg = "Already signed.";
  else if (!w.label) STATE.wbMsg = "Choose a label first.";
  else { w.state = "Signed"; STATE.wbMsg = `Signed by the analyst (simulated). ${STATE.wbSel} can now appear in a brief.`; }
  render(false, '[data-act="wb-sign"]'); return; }
 if (act === "wb-reject") { if (w.state === "Rejected") { w.state = "Validated"; STATE.wbMsg = "Reopened: back to Validated."; } else { w.state = "Rejected"; STATE.wbMsg = "Rejected with a reason. It will not reach the brief."; } render(false, '[data-act="wb-reject"]'); return; }
 if (act === "wb-save") { STATE.wbMsg = "Draft saved in memory. It resets on reload."; render(false, '[data-act="wb-save"]'); return; }
 // town console (G3): Ready → Released
 if (act === "rel-hold") { STATE.release.msg = `Held. Version ${MOCK.console.version} stays Ready; nothing is released.`; render(false, '[data-act="rel-hold"]'); return; }
 if (act === "rel-go") {
  const R = STATE.release;
  if (R.state === "Released") return;
  if (!Object.values(R.aud).some(Boolean)) { R.msg = "Choose at least one audience first."; render(false, '[data-act="rel-go"]'); return; }
  R.state = "Released"; R.at = MOCK.asOf; R.msg = `Released to ${audienceText(R.aud)}.`;
  render(false, '[data-tour="console-status"] .released'); return; }
 if (act === "tr-diff") { STATE.tracerDiff = !STATE.tracerDiff; render(false, '[data-act="tr-diff"]'); return; }
 // developer response: opens a dispute; displayed status becomes Disputed, prior status kept
 if (act === "dp-submit") {
  if (STATE.dispute) return;
  if (!STATE.disputeReason.trim()) { STATE.disputeMsg = "Write a reason first."; render(false, "#dp-reason"); return; }
  const c = CM[MOCK.dispute.id];
  STATE.dispute = { id: c.id, prior: c.status, at: MOCK.asOf, state: "Open" };
  STATE.disputeMsg = `Dispute submitted. ${c.id} now shows Disputed in the <a href="#/record">status report</a>.`;
  render(false, '[data-tour="dispute-status"]'); return; }
});
document.getElementById("view").addEventListener("input", e => {
 const t = e.target;
 if (t.dataset.dfield) STATE[t.dataset.dfield] = t.value;
 if (t.dataset.field === "ask") { const w = STATE.wb[STATE.wbSel]; if (w.state !== "Signed") w.ask = t.value; }
});
document.getElementById("view").addEventListener("change", e => {
 const t = e.target;
 if (t.dataset.aud) { STATE.release.aud[t.dataset.aud] = t.checked; return; }
 if (t.dataset.rfield) { STATE.release[t.dataset.rfield] = t.value; return; }
 if (t.dataset.field) { const w = STATE.wb[STATE.wbSel]; if (w[t.dataset.field] !== t.value) { if (w.state === "Signed") wbNewVersion(w); w[t.dataset.field] = t.value; render(false, "#" + t.id); } }
});
document.getElementById("skip").addEventListener("click", e => { e.preventDefault(); (document.querySelector("#view h1") || document.getElementById("main")).focus(); });
window.addEventListener("hashchange", () => render(true));

/* start page: keep the "It only takes 3 minutes" arrow pointing at the Give feedback button, wherever the header puts it */
function placeNudge() {
 const n = document.querySelector(".nudge"), btn = document.querySelector('#nav li.cta a'), hero = document.querySelector(".page.hero");
 if (!n || !btn || !hero || !btn.offsetWidth) return;
 const svg = n.querySelector("svg"), hr = hero.getBoundingClientRect(), br = btn.getBoundingClientRect();
 const tipFromRight = parseFloat(getComputedStyle(svg).marginRight) + svg.getBoundingClientRect().width * (1 - 104 / 120); // arrow tip sits at x=104 of the 120-wide viewBox
 n.style.right = Math.max(0, hr.right - (br.left + br.width / 2) - tipFromRight) + "px";
}
document.addEventListener("fl:render", placeNudge);
window.addEventListener("resize", placeNudge);

/* feedback */
function answersText() {
 const qs = D.feedbackQuestions.concat(["Anything else?"]);
 const vals = qs.map((_, i) => (document.getElementById("fq" + (i + 1)).value || "").trim());
 return { any: vals.some(Boolean), text: `FenceLine prototype ${CONFIG.version} feedback\n\n` + qs.map((x, i) => `${i + 1}. ${x}\n${vals[i] || "(no answer)"}`).join("\n\n") };
}
function say(t) { document.getElementById("fbmsg").textContent = t; }
function mailAnswers() {
 const { any, text } = answersText();
 if (!any) { say("Write at least one answer first."); return; }
 const href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent("FenceLine v3 feedback")}&body=${encodeURIComponent(text)}`;
 if (href.length > 1800) { say("Your answers are long. Use Copy answers and paste them into an email."); return; }
 say(`Opening your email app with a draft to ${CONFIG.contactEmail}. If nothing opens, use Copy answers.`);
 window.location.href = href;
}
function copyAnswers() {
 const { any, text } = answersText();
 if (!any) { say("Write at least one answer first."); return; }
 const done = () => say(`Answers copied. Paste them into an email to ${CONFIG.contactEmail}.`);
 const fallback = () => { const ta = document.getElementById("fbcopy"); ta.hidden = false; ta.value = text; ta.focus(); ta.select();
  let ok = false; try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
  if (ok) done(); else say("Your answers are selected below. Press Ctrl+C or Cmd+C to copy them."); };
 if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
}

/* API for chat.js and tour.js */
const clone = o => JSON.parse(JSON.stringify(o));
window.FL = {
 render, parse, esc, chip, icon, SIM, srcItem, refs, SRC, CL, briefSourceOrder,
 snapshot: () => ({ app: clone(STATE), chat: window.FLChat ? FLChat.snapshot() : null }),
 restore(s) { STATE = clone(s.app); if (s.chat && window.FLChat) FLChat.restore(s.chat); },
 hooks: {
  "assistant:open": () => window.FLChat && FLChat.open({ focus: false }),
  "assistant:close": () => window.FLChat && FLChat.close({ focus: false }),
  "reset:wb": () => { const f = freshState(); STATE.wb = f.wb; STATE.wbSel = f.wbSel; STATE.wbMsg = ""; },
  "reset:release": () => { STATE.release = freshState().release; },
  "reset:dispute": () => { const f = freshState(); STATE.dispute = null; STATE.disputeReason = f.disputeReason; STATE.disputeEvidence = f.disputeEvidence; STATE.disputeMsg = ""; },
  "menu:close": () => closeMenu()
 }
};
render(false);
placeNudge();
