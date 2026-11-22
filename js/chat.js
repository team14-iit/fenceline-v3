/* FenceLine prototype v3 · scripted assistant ("Ask about this brief").
   Emulates capability C24 (spec §5.1, §8.1): an idea with no evidence yet.
   Every answer uses only claims and sources already in data.js; anything else gets the no-match reply. */
(function () {
 "use strict";
 const FL = window.FL, D = DATA; // DATA is a top-level const from data.js (shared by classic scripts, not on window)
 const NO_MATCH = "This demo answers only the suggested questions.";
 const cite = (...ids) => ids.map(id => `<button type="button" class="cite" data-src="${id}" aria-label="Source ${id}: ${FL.esc(FL.SRC[id].title)}">[${id}]</button>`).join(" ");

 // Scripted questions and answers. keys: lower-case words matched against free text.
 const QA = [
  { id: "tax-doc", q: "Which tax figures are documented?", keys: ["documented", "which tax", "tax figure", "figures", "tax"],
   a: () => `Only one tax claim is Documented: a county council reviews every tax-break deal each year, and City Council votes on its recommendations within 60 days (B5). Source: Ohio law § 5709.85 ${cite("S21")}, repeated in the city template §3 ${cite("S5")}. The other tax figures, the $352,750 minimum (B3) and the 100% then 75% tax break (B4), come from news only ${cite("S17")}.` },
  { id: "minimum", q: "Is the $352,750 minimum in the signed agreement?", keys: ["352", "minimum", "signed", "agreement", "payment"],
   a: () => `No public source yet: news reports it ${cite("S17")}; the signed agreement is not online. The city template sets a minimum yearly payment (§5a) ${cite("S5")}.` },
  { id: "review", q: "Who reviews the tax break each year?", keys: ["review", "tirc", "each year", "county", "yearly", "who checks"],
   a: () => `The Licking County Tax Incentive Review Council (TIRC) reviews it each year; City Council then votes on its recommendations ${cite("S21", "S5")}. Council agendas list Resolution R-39-2026 on the 2026 Licking County review ${cite("S10", "S29")}.` },
  { id: "jobs", q: "What is the status of jobs and payroll?", keys: ["job", "payroll", "employ", "hire", "hiring"],
   a: () => `Tracked by the city, figures withheld ${FL.SIM()}. The city collects these figures each spring for the county's yearly review; per-company figures are not on city or county sites ${cite("S21", "S5")}. The reported figures, about 105 jobs and $9M payroll, come from news only ${cite("S17")}.` },
  { id: "water", q: "What does the water agreement cover?", keys: ["water", "mou", "memorandum", "36 months", "notice"],
   a: () => `Only the city's template water agreement is public: the city supplies water to the site edge, and the developer gives 36 months' notice before each phase ${cite("S6")}. The template has no cap on use, no reporting and no penalty. The AWS water memorandum (MOU) is not public.` },
  { id: "vote", q: "Should council approve this?", vote: true, keys: ["approve", "approval", "vote", "should", "recommend", "support", "oppose", "reject", "good deal", "worth"],
   a: () => `FenceLine never recommends a vote. Here are the open questions for the hearing:<ol>${D.hearingQuestions.map(x => `<li>${FL.esc(x)}</li>`).join("")}</ol>` }
 ];
 const BY_ID = Object.fromEntries(QA.map(x => [x.id, x]));
 const CITED = ["S17", "S5", "S21", "S10", "S29", "S6"];

 function match(text) {
  const t = " " + text.toLowerCase() + " ";
  const vote = QA.find(x => x.vote);
  if (vote.keys.some(k => t.includes(k))) return vote;
  let best = null, bs = 0;
  QA.forEach(x => { if (x.vote) return; const s = x.keys.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0); if (s > bs) { bs = s; best = x; } });
  return best;
 }

 let S = { open: false, thread: [] }, pending = false, pendingQa = null, timer = 0, panel = null, opener = null, mode = "brief";

 function build() {
  if (panel) return;
  panel = document.createElement("aside");
  panel.id = "fl-chat"; panel.className = "fl-chat noprint"; panel.hidden = true;
  panel.setAttribute("aria-labelledby", "chat-h");
  panel.innerHTML = `<div class="chat-head"><div><p class="idea">Idea we are testing · scripted answers</p><h2 id="chat-h" tabindex="-1">Ask about this brief</h2></div>
   <button type="button" class="chat-x" data-c="close" aria-label="Close the assistant">×</button></div>
   <div class="chat-body">
    <p class="small muted">Answers come only from the brief's signed claims and cited sources. FenceLine never recommends a vote.</p>
    <div class="chat-chips" role="group" aria-label="Suggested questions">${QA.map((x, i) => `<button type="button" class="qchip" data-q="${x.id}"${i === 0 ? ' data-tour="ask-chip"' : ""}>${FL.esc(x.q)}</button>`).join("")}</div>
    <div class="msgs" id="chat-msgs"></div>
    <details class="chat-srcs" id="chat-srcs"><summary>Sources cited in answers (${CITED.length})</summary>
     <ul>${CITED.map(id => `<li id="chat-src-${id}" tabindex="-1"><b>${id}</b> ${FL.srcItem(id)}</li>`).join("")}</ul></details>
   </div>
   <form class="chat-form" id="chat-form"><label class="sr" for="chat-in">Type a question</label>
    <input id="chat-in" type="text" autocomplete="off" placeholder="Type a question">
    <button type="submit" class="btn btn-p">Ask</button></form>
   <p class="sr" aria-live="polite" id="chat-live"></p>`;
  document.body.appendChild(panel);
  panel.addEventListener("click", e => {
   const q = e.target.closest("[data-q]"), c = e.target.closest(".cite"), x = e.target.closest('[data-c="close"]');
   if (x) return close({ focus: true });
   if (q) return ask(BY_ID[q.dataset.q].q, BY_ID[q.dataset.q]);
   if (c) { const d = document.getElementById("chat-srcs"), li = document.getElementById("chat-src-" + c.dataset.src); d.open = true; li.scrollIntoView({ block: "nearest" }); li.focus({ preventScroll: true }); li.classList.add("hit"); setTimeout(() => li.classList.remove("hit"), 1600); }
  });
  panel.querySelector("#chat-form").addEventListener("submit", e => {
   e.preventDefault(); const inp = document.getElementById("chat-in"), v = inp.value.trim(); if (!v) return;
   inp.value = ""; ask(v, match(v));
  });
  panel.addEventListener("keydown", e => { if (e.key === "Escape" && !document.querySelector(".tour-root:not([hidden])")) { e.stopPropagation(); close({ focus: true }); } });
 }

 function msgHtml(m, isLast) {
  if (m.who === "user") return `<p class="m-user"><span class="sr">You asked: </span>${FL.esc(m.text)}</p>`;
  const body = m.id ? BY_ID[m.id].a() : FL.esc(NO_MATCH);
  return `<div class="m-bot"${isLast ? ' data-tour="chat-answer"' : ""}><span class="sr">Scripted answer: </span>${body}</div>`;
 }
 function paint() {
  const box = document.getElementById("chat-msgs"); if (!box) return;
  const n = S.thread.length;
  box.innerHTML = S.thread.map((m, i) => msgHtml(m, i === n - 1)).join("") + (pending ? `<p class="typing" role="status"><span class="sr">Preparing a scripted answer</span><span aria-hidden="true"><i></i><i></i><i></i></span></p>` : "");
 }
 function ask(text, qa) {
  clearTimeout(timer);
  if (pending) S.thread.push({ who: "bot", id: pendingQa ? pendingQa.id : null });
  S.thread.push({ who: "user", text });
  pending = true; pendingQa = qa; paint(); scrollEnd();
  timer = setTimeout(() => {
   pending = false; pendingQa = null; S.thread.push({ who: "bot", id: qa ? qa.id : null }); paint(); scrollEnd();
   const last = document.querySelector('#chat-msgs [data-tour="chat-answer"]');
   document.getElementById("chat-live").textContent = last ? last.textContent : "";
  }, 1000);
 }
 function scrollEnd() { const b = panel.querySelector(".chat-body"); const last = panel.querySelector("#chat-msgs > :last-child"); if (last) last.scrollIntoView({ block: "nearest" }); else b.scrollTop = 0; }
 function syncButtons() { document.querySelectorAll('[data-act="ask"]').forEach(b => b.setAttribute("aria-expanded", String(S.open))); }
 function open(o = {}) {
  build(); S.open = true; panel.hidden = false;
  document.getElementById("chat-h").textContent = `Ask about this ${mode}`;
  syncButtons();
  if (o.focus !== false) { opener = document.activeElement; document.getElementById("chat-h").focus(); }
 }
 function close(o = {}) {
  if (!panel) return; S.open = false; panel.hidden = true; syncButtons();
  if (o.focus) { const b = (opener && opener.isConnected) ? opener : document.querySelector('[data-act="ask"]'); if (b) b.focus(); }
 }
 document.addEventListener("fl:render", e => {
  const m = e.detail && e.detail.chat;
  if (!m) { if (S.open) close({ focus: false }); return; }
  mode = m; if (panel) document.getElementById("chat-h").textContent = `Ask about this ${mode}`;
  syncButtons();
 });
 build(); paint();
 window.FLChat = {
  open, close, isOpen: () => S.open,
  toggle() { S.open ? close({ focus: true }) : open(); },
  snapshot: () => ({ open: S.open, thread: S.thread.map(m => Object.assign({}, m)) }),
  restore(s) { clearTimeout(timer); pending = false; S.thread = s.thread.map(m => Object.assign({}, m)); paint(); s.open ? open({ focus: false }) : close({ focus: false }); },
  questions: QA.map(x => ({ q: x.q, answerText: () => { const d = document.createElement("div"); d.innerHTML = x.a(); return d.textContent; } })),
  noMatch: NO_MATCH
 };
 const p = FL.parse().path; if (p === "/record") mode = "report";
})();
