/* FenceLine prototype v3 · tour engine. Content lives in tours.js; you should not need to edit this file.
   Start a tour:  #/?tour=main   ·   autoplay: #/?tour=main&autoplay=1   ·   interval: &speed=3 (seconds, default 4) */
(function () {
 "use strict";
 const TOURS = window.FENCELINE_TOURS || {}, HOTSPOTS = window.FENCELINE_HOTSPOTS || [];
 const FL = window.FL;
 const WKEY = "fenceline.v3.welcomed";
 const reduced = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
 const sleep = ms => new Promise(r => setTimeout(r, ms));
 const pathOf = h => (String(h || "").replace(/^#/, "").split("?")[0].replace(/\/+$/, "") || "/");
 const lsGet = k => { try { return localStorage.getItem(k); } catch (_) { return null; } };
 const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* storage unavailable: fine */ } };

 let T = null, E = null, raf = 0, lastKey = "";

 /* targets */
 const sels = st => [].concat(st.target || []);
 function visible(el) {
  if (!el || !el.isConnected || el.closest("[hidden]")) return false;
  const r = el.getBoundingClientRect();
  return r.width >= 1 && r.height >= 1 && getComputedStyle(el).visibility !== "hidden";
 }
 function findTarget(st) { for (const s of sels(st)) for (const el of document.querySelectorAll(s)) if (visible(el)) return el; return null; }
 async function waitFor(st, ms = 3000) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const el = findTarget(st); if (el) return el; await sleep(60); } return null; }
 function navigate(hash) {
  return new Promise(res => {
   if (location.hash === hash) { FL.render(true); res(); return; }
   let done = false;
   const fin = () => { if (done) return; done = true; document.removeEventListener("fl:render", fin); res(); };
   document.addEventListener("fl:render", fin); setTimeout(fin, 1500);
   location.hash = hash;
  });
 }
 const runHook = h => { const f = FL.hooks[h]; if (f) f(); else console.warn(`FenceLine tour: unknown hook "${h}"`); };

 /* overlay */
 function build() {
  if (E) return;
  const root = document.createElement("div");
  root.className = "tour-root noprint"; root.hidden = true;
  root.innerHTML = `<div class="tour-ring" aria-hidden="true"></div>
   <svg class="tour-arrow" aria-hidden="true" focusable="false"><defs><marker id="tour-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs><path class="tour-path" marker-end="url(#tour-head)"/></svg>
   <div class="tour-bubble" role="dialog" aria-modal="false" aria-labelledby="tour-title" aria-describedby="tour-text" tabindex="-1">
    <p class="tour-count" id="tour-count"></p><h2 id="tour-title"></h2><p id="tour-text"></p><p class="tour-hint" id="tour-hint"></p>
    <div class="tour-btns"><button type="button" class="tour-skip" data-t="skip">Skip tour</button><span class="tour-sp"></span>
     <button type="button" class="btn btn-s" data-t="back">Back</button><button type="button" class="btn btn-p" data-t="next">Next</button></div>
   </div>
   <p class="sr" aria-live="polite" id="tour-live"></p>`;
  document.body.appendChild(root);
  const q = s => root.querySelector(s);
  E = { root, ring: q(".tour-ring"), path: q(".tour-path"), bubble: q(".tour-bubble"),
   count: q("#tour-count"), title: q("#tour-title"), text: q("#tour-text"), hint: q("#tour-hint"), back: q('[data-t="back"]'), next: q('[data-t="next"]'), live: q("#tour-live") };
  root.addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (!b) return; const t = b.dataset.t; if (t === "skip") end(true); else if (t === "back") back(); else next(); });
 }
 const box = (el, x, y, w, h) => { el.style.left = x + "px"; el.style.top = y + "px"; el.style.width = Math.max(0, w) + "px"; el.style.height = Math.max(0, h) + "px"; };

 function place(h, bw, bh, pref, vw, vh) {
  const m = 12, g = 24;
  if (!h) return { x: (vw - bw) / 2, y: (vh - bh) / 2, overlap: true };
  const cx = h.left + h.width / 2, cy = h.top + h.height / 2;
  const C = {
   bottom: { x: cx - bw / 2, y: h.bottom + g, ok: h.bottom + g + bh <= vh - m },
   top: { x: cx - bw / 2, y: h.top - g - bh, ok: h.top - g - bh >= m },
   right: { x: h.right + g, y: cy - bh / 2, ok: h.right + g + bw <= vw - m },
   left: { x: h.left - g - bw, y: cy - bh / 2, ok: h.left - g - bw >= m }
  };
  const order = [pref, "bottom", "top", "right", "left"].filter((v, i, a) => v && C[v] && a.indexOf(v) === i);
  let p = null; for (const k of order) if (C[k].ok) { p = C[k]; break; }
  let overlap = false;
  if (!p) { overlap = true; p = { x: cx - bw / 2, y: h.top > vh - h.bottom ? m : vh - bh - m }; }
  const clamp = (v, a, b) => Math.min(Math.max(v, a), Math.max(a, b));
  return { x: clamp(p.x, m, vw - bw - m), y: clamp(p.y, m, vh - bh - m), overlap };
 }
 function edgePoint(r, p, out) {
  const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2, dx = p.x - cx, dy = p.y - cy;
  const hw = (r.right - r.left) / 2 + out, hh = (r.bottom - r.top) / 2 + out;
  if (!dx && !dy) return { x: cx, y: cy };
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity, 1);
  return { x: cx + dx * t, y: cy + dy * t };
 }
 function arrow(h, b, overlap) {
  if (!h || overlap) { E.path.setAttribute("d", ""); return; }
  const s = edgePoint(b, { x: (h.left + h.right) / 2, y: (h.top + h.bottom) / 2 }, 2);
  const e = edgePoint(h, { x: (b.left + b.right) / 2, y: (b.top + b.bottom) / 2 }, 4);
  const dx = e.x - s.x, dy = e.y - s.y;
  if (Math.hypot(dx, dy) < 18) { E.path.setAttribute("d", ""); return; }
  const mx = (s.x + e.x) / 2 - dy * 0.22, my = (s.y + e.y) / 2 + dx * 0.22;
  E.path.setAttribute("d", `M${s.x.toFixed(1)},${s.y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${e.x.toFixed(1)},${e.y.toFixed(1)}`);
 }
 function layout() {
  if (!T || T.hidden) return;
  const st = T.steps[T.i], el = findTarget(st), vw = document.documentElement.clientWidth, vh = window.innerHeight, pad = 6;
  let h = null;
  if (el) {
   const r = el.getBoundingClientRect();
   const top = Math.max(r.top - pad, 0), left = Math.max(r.left - pad, 0), bottom = Math.min(r.bottom + pad, vh), right = Math.min(r.right + pad, vw);
   if (bottom > top && right > left) h = { top, left, bottom, right, width: right - left, height: bottom - top };
  }
  const bw = E.bubble.offsetWidth, bh = E.bubble.offsetHeight;
  const key = [vw, vh, bw, bh].concat(h ? [h.top, h.left, h.width, h.height].map(Math.round) : ["-"]).join(",");
  if (key === lastKey) return; lastKey = key;
  // no dimming: the page stays fully visible and usable; only an outline marks the target
  if (!h) E.ring.style.display = "none";
  else { E.ring.style.display = ""; box(E.ring, h.left, h.top, h.width, h.height); }
  const p = place(h, bw, bh, st.placement, vw, vh);
  E.bubble.style.left = p.x + "px"; E.bubble.style.top = p.y + "px";
  arrow(h, { left: p.x, top: p.y, right: p.x + bw, bottom: p.y + bh }, p.overlap);
 }
 function loop() { raf = requestAnimationFrame(loop); layout(); }

 /* steps */
 function show() {
  const st = T.steps[T.i], n = T.steps.length, last = T.i === n - 1;
  E.count.textContent = `Step ${T.i + 1} of ${n}`;
  E.title.textContent = st.title; E.text.textContent = st.text;
  E.hint.textContent = st.action ? (T.autoplay ? "Playing: the tour clicks it for you." : "Click the highlighted item, or press Enter.") : "";
  E.hint.hidden = !st.action;
  E.back.hidden = T.i === 0;
  E.next.hidden = !!st.action;
  E.next.textContent = last ? "Finish" : "Next";
  E.bubble.style.visibility = "visible";
  T.hidden = false; lastKey = ""; layout();
  E.live.textContent = `Step ${T.i + 1} of ${n}. ${st.title}. ${st.text}${st.action ? " Press Enter to do it." : ""}`;
  E.bubble.focus({ preventScroll: true });
 }
 function scrollToEl(el) {
  const r = el.getBoundingClientRect(), vh = window.innerHeight;
  if (r.top >= 72 && r.bottom <= vh - 8) return;
  el.scrollIntoView({ block: r.height > vh * 0.55 ? "start" : "center", behavior: reduced() ? "auto" : "smooth" });
 }
 async function go(i, dir) {
  if (!T) return;
  const tok = ++T.tok; clearTimeout(T.timer);
  if (i >= T.steps.length) return finish();
  if (i < 0) i = 0;
  const st = T.steps[i];
  T.i = i; T.busy = true; T.hidden = true;
  E.bubble.style.visibility = "hidden"; E.path.setAttribute("d", "");
  const hooks = [].concat(st.before || []); hooks.forEach(runHook);
  if (st.route && pathOf(st.route) !== pathOf(location.hash)) await navigate(st.route);
  else if (hooks.some(h => /^reset:/.test(h))) FL.render(false);
  if (!T || tok !== T.tok) return;
  const el = await waitFor(st);
  if (!T || tok !== T.tok) return;
  if (!el) {
   console.warn(`FenceLine tour "${T.id}": skipped step "${st.id}", target not found: ${sels(st).join(" | ")}`);
   if (dir < 0 && i > 0) return go(i - 1, dir);
   return go(i + 1, 1);
  }
  if (dir >= 0 || !T.snaps[i]) T.snaps[i] = { hash: location.hash, state: FL.snapshot() };
  scrollToEl(el);
  await sleep(reduced() ? 30 : 380);
  if (!T || tok !== T.tok) return;
  T.busy = false; show();
  if (T.autoplay) schedule();
 }
 function next() {
  if (!T || T.busy) return;
  const st = T.steps[T.i];
  if (st.action) return doAction();
  if (T.i === T.steps.length - 1) return finish();
  go(T.i + 1, 1);
 }
 async function back() {
  if (!T || T.busy || T.i === 0) return;
  const j = T.i - 1, s = T.snaps[j];
  T.busy = true; clearTimeout(T.timer);
  if (s) { FL.restore(s.state); if (location.hash !== s.hash) await navigate(s.hash); else FL.render(false); }
  if (!T) return;
  T.busy = false; go(j, -1);
 }
 function ripple(el) {
  const r = el.getBoundingClientRect(), d = document.createElement("div");
  d.className = "tour-ripple noprint"; d.style.left = (r.left + r.width / 2) + "px"; d.style.top = (r.top + r.height / 2) + "px";
  document.body.appendChild(d); setTimeout(() => d.remove(), 700);
 }
 function doAction() {
  const st = T.steps[T.i], el = findTarget(st);
  if (!el) { go(T.i + 1, 1); return; }
  ripple(el);
  setTimeout(() => { if (T && T.steps[T.i] === st && !T.busy) { const t = findTarget(st); if (t) t.click(); } }, reduced() ? 120 : 450);
 }
 function schedule() {
  const st = T.steps[T.i], ms = T.speed * 1000;
  T.timer = setTimeout(() => { if (!T || T.busy) return; if (st.action) doAction(); else next(); }, st.action ? Math.max(900, ms * 0.75) : ms);
 }
 // action steps: the click on the highlighted element (by mouse, keyboard or autoplay) advances the tour
 document.addEventListener("click", e => {
  if (!T || T.busy || T.hidden) return;
  const st = T.steps[T.i];
  if (!st.action || !e.target.closest) return;
  if (sels(st).some(s => e.target.closest(s))) { T.busy = true; clearTimeout(T.timer); setTimeout(() => go(T.i + 1, 1), 40); }
 }, true);
 document.addEventListener("keydown", e => {
  if (!T) return;
  if (e.key === "Escape") { e.preventDefault(); end(true); return; }
  const t = e.target, typing = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
  if (typing) return;
  if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); back(); }
  else if (e.key === "Enter") { if (t !== E.bubble && t.closest && t.closest("button, a, summary, [role='button']")) return; e.preventDefault(); next(); }
 });

 function start(id, o = {}) {
  const tour = TOURS[id || "main"];
  if (!tour) { console.warn(`FenceLine tour: no tour named "${id}"`); return; }
  hideWelcome(true); build();
  if (T) clearTimeout(T.timer);
  T = { id: id || "main", steps: tour.steps, i: 0, tok: 0, snaps: [], busy: false, hidden: true, timer: 0, autoplay: !!o.autoplay, speed: o.speed > 0 ? o.speed : 4 };
  E.root.hidden = false; E.root.classList.toggle("autoplay", T.autoplay);
  E.bubble.style.visibility = "hidden"; lastKey = "";
  document.body.classList.add("touring"); hsRender();
  FL.hooks["menu:close"]();
  [].concat(tour.before || []).forEach(runHook);
  if (!raf) loop();
  go(0, 1);
 }
 function end(skipped) {
  if (!T) return;
  clearTimeout(T.timer); T = null;
  cancelAnimationFrame(raf); raf = 0;
  E.root.hidden = true; document.body.classList.remove("touring");
  hsRender();
  const h = document.querySelector("#view h1"); if (h) h.focus({ preventScroll: true });
  if (skipped) console.info("FenceLine tour skipped.");
 }
 function finish() { const ap = T && T.autoplay; end(false); if (!ap) toast("Tour finished. Restart it any time with the Tour button."); }
 function toast(msg) {
  let t = document.querySelector(".tour-toast");
  if (!t) { t = document.createElement("p"); t.className = "tour-toast noprint"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.textContent = msg; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => { t.hidden = true; }, 5000);
 }

 /* welcome card (first visit to #/) */
 function showWelcome() {
  if (document.querySelector(".tour-welcome")) return;
  const w = document.createElement("div");
  w.className = "tour-welcome noprint"; w.setAttribute("role", "dialog"); w.setAttribute("aria-labelledby", "tw-h"); w.setAttribute("aria-describedby", "tw-p");
  w.innerHTML = `<h2 id="tw-h">New to FenceLine?</h2><p id="tw-p">A short guided tour walks through the brief, the status report and the screens behind them.</p>
   <div class="btns"><button type="button" class="btn btn-p" data-w="tour">${FL.icon("play")}Take the 2-minute tour</button><button type="button" class="btn btn-s" data-w="own">Explore on my own</button></div>`;
  document.body.appendChild(w);
  w.addEventListener("click", e => { const b = e.target.closest("[data-w]"); if (!b) return; lsSet(WKEY, "1"); if (b.dataset.w === "tour") start("main"); else { hideWelcome(true); const h = document.querySelector("#view h1"); if (h) h.focus(); } });
  w.addEventListener("keydown", e => { if (e.key === "Escape") { lsSet(WKEY, "1"); hideWelcome(true); } });
  w.querySelector("button").focus({ preventScroll: true });
 }
 function hideWelcome() { const w = document.querySelector(".tour-welcome"); if (w) w.remove(); }

 /* hotspot mode */
 let hsOn = false, hsLayer = null, hsPending = 0;
 function hsRender() {
  if (hsLayer) { hsLayer.remove(); hsLayer = null; }
  if (!hsOn || T) return;
  const path = FL.parse().path, vw = document.documentElement.clientWidth;
  hsLayer = document.createElement("div"); hsLayer.className = "hs-layer noprint";
  HOTSPOTS.filter(h => h.route === path).forEach((h, i) => {
   const el = document.querySelector(h.target); if (!visible(el)) return;
   const r = el.getBoundingClientRect(), x = Math.min(r.right - 10, vw - 16) + scrollX, y = r.top + 10 + scrollY;
   const s = document.createElement("span"); s.className = "hs" + (r.right > vw - 140 ? " hs-r" : ""); s.style.left = x + "px"; s.style.top = y + "px";
   s.innerHTML = `<button type="button" class="hs-dot" aria-describedby="hs-tip-${i}"><span class="sr">Tip</span></button><span class="hs-tip" role="tooltip" id="hs-tip-${i}">${FL.esc(h.text)}</span>`;
   hsLayer.appendChild(s);
  });
  document.body.appendChild(hsLayer);
 }
 const hsSoon = () => { cancelAnimationFrame(hsPending); hsPending = requestAnimationFrame(hsRender); };
 document.addEventListener("keydown", e => { if (e.key === "Escape" && e.target.classList && e.target.classList.contains("hs-dot")) e.target.parentNode.classList.add("hs-esc"); });
 document.addEventListener("focusout", e => { if (e.target.classList && e.target.classList.contains("hs-dot")) e.target.parentNode.classList.remove("hs-esc"); });
 function toggleTips() { hsOn = !hsOn; const b = document.getElementById("tipsbtn"); if (b) b.setAttribute("aria-pressed", String(hsOn)); hsRender(); }
 window.addEventListener("resize", hsSoon);
 if (window.ResizeObserver) new ResizeObserver(hsSoon).observe(document.body);

 /* URL parameters and wiring */
 function checkParam() {
  const raw = location.hash.replace(/^#/, ""), [p, qs] = raw.split("?"), q = new URLSearchParams(qs || "");
  const id = q.get("tour"); if (!id) return false;
  const ap = /^(1|true|yes)$/i.test(q.get("autoplay") || ""), sp = parseFloat(q.get("speed"));
  ["tour", "autoplay", "speed"].forEach(k => q.delete(k));
  const rest = q.toString();
  history.replaceState(null, "", "#" + (p && p.startsWith("/") ? p : "/") + (rest ? "?" + rest : ""));
  start(id, { autoplay: ap, speed: sp });
  return true;
 }
 window.addEventListener("hashchange", () => { if (checkParam()) return; if (pathOf(location.hash) !== "/") hideWelcome(); });
 document.addEventListener("fl:render", hsSoon);
 document.addEventListener("click", e => {
  if (e.target.closest("#tipsbtn")) { toggleTips(); return; }
  if (e.target.closest("#tourbtn")) { lsSet(WKEY, "1"); start("main"); }
 });

 window.FLTour = { start, end, tipsOn: () => hsOn, toggleTips, active: () => !!T };
 const btn = document.getElementById("tipsbtn"); if (btn) btn.setAttribute("aria-pressed", "false");
 if (!checkParam() && pathOf(location.hash) === "/" && !lsGet(WKEY)) showWelcome();
})();
