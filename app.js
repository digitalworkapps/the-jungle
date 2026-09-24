/* The Jungle Throwdown 26 — render y herramientas */

/* ================= Utilidades ================= */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento: seguimos en memoria */ } }
};
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = n => (Math.round(n * 10) / 10).toLocaleString("es-ES");
const numVal = el => { const v = parseFloat(String(el?.value ?? "").replace(",", ".")); return Number.isFinite(v) && v > 0 ? v : 0; };
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const catById = id => CATS.find(c => c.id === id);

/* "2×24/16" → {m:"2×24 kg", f:"2×16 kg", mKg:24, fKg:16} */
function splitLoad(s) {
  const m = String(s).match(/^(\d×)?([\d,]+)\/([\d,]+)$/);
  if (!m) return { m: s, f: s };
  const pre = m[1] || "";
  return { m: `${pre}${m[2]} kg`, f: `${pre}${m[3]} kg`, mKg: parseFloat(m[2].replace(",", ".")), fKg: parseFloat(m[3].replace(",", ".")) };
}

/* ================= Estado ================= */
const state = { cat: store.get("tj-cat", "inter"), wod: 0 };
if (!catById(state.cat)) state.cat = "inter";
const team = store.get("tj-team", [{ name: "", g: "M" }, { name: "", g: "M" }, { name: "", g: "F" }]);
const calc = store.get("tj-calc", {});
const saveCalc = () => store.set("tj-calc", calc);
const saveTeam = () => store.set("tj-team", team);
const who = i => (team[i].name || "").trim() || `Atleta ${i + 1}`;
const sexIcon = g => (g === "F" ? "♀" : "♂");
const nFemales = () => team.filter(t => t.g === "F").length;

function readHash() {
  const [c, w] = location.hash.replace("#", "").split("/");
  if (catById(c)) state.cat = c;
  const n = parseInt(w, 10);
  if (n >= 1 && n <= WODS.length) state.wod = n - 1;
}
function writeHash() {
  history.replaceState(null, "", `#${state.cat}/${state.wod + 1}`);
  store.set("tj-cat", state.cat);
}

/* ================= Navegación ================= */
function renderNav() {
  $("#cats").innerHTML = CATS.map(c => `
    <button class="cat-btn ${c.id === state.cat ? "active" : ""}" style="--c:${c.color}" data-cat="${c.id}" aria-pressed="${c.id === state.cat}">
      <i></i>${c.short || c.label}</button>`).join("");
  $("#wodnav").innerHTML = WODS.map((w, i) => `
    <button class="wod-btn ${i === state.wod ? "active" : ""}" data-wod="${i}" aria-current="${i === state.wod ? "page" : "false"}">
      <b>${w.num}</b><span>${w.name}</span></button>`).join("");
  document.documentElement.style.setProperty("--cat", catById(state.cat).color);
}

document.addEventListener("click", e => {
  const c = e.target.closest("[data-cat]");
  if (c) { state.cat = c.dataset.cat; update(false); return; }
  const w = e.target.closest("[data-wod]");
  if (w) { state.wod = +w.dataset.wod; update(true); return; }
  const go = e.target.closest("[data-go]");
  if (go) { state.wod = clamp(state.wod + +go.dataset.go, 0, WODS.length - 1); update(true); }
});

function update(scrollTop) {
  writeHash();
  renderNav();
  renderWod();
  $(".wod-btn.active")?.scrollIntoView({ block: "nearest", inline: "center" });
  if (scrollTop) window.scrollTo({ top: $("#main").offsetTop - 140, behavior: "smooth" });
}

/* ================= Póster ================= */
function renderPoster(w, cat) {
  const c = catById(cat);
  const blocks = w.poster(cat).map(b => {
    switch (b.t) {
      case "small": return `<p class="p-small">${b.text}</p>`;
      case "big": return `<p class="p-big">${b.text}</p>`;
      case "lines": return `<ul class="p-lines ${b.small ? "small" : ""}">${b.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
      case "h": return `<p class="p-h">${b.text}</p>`;
      case "rounds": return `<dl class="p-rounds">${b.items.map(([k, v]) => `<dt>${k}:</dt><dd>${v}</dd>`).join("")}</dl>`;
      case "points": return `<dl class="p-points">${b.items.map(([k, v]) => `<dt>${k}</dt><dd>= ${v}</dd>`).join("")}</dl>`;
      case "note": return `<p class="p-note">${b.text}</p>`;
      case "weights": return `<p class="p-weights">${b.text}</p>`;
      default: return "";
    }
  }).join("");
  return `
    <article class="poster" aria-label="WOD ${w.num} ${esc(w.name)} — ${c.label}">
      <h2>${w.name}</h2>
      ${blocks}
      <div class="band">WOD ${w.num} – <b>${(c.short || c.label).toUpperCase()}</b></div>
    </article>`;
}

/* ================= Comparativa ================= */
function renderCompare(w) {
  const idx = CATS.findIndex(c => c.id === state.cat);
  const head = CATS.map((c, i) => `<th class="${i === idx ? "on" : ""}" style="--c:${c.color}"><i></i>${c.short || c.label}</th>`).join("");
  const rows = w.compare.map(([label, ...vals]) =>
    `<tr><th scope="row">${label}</th>${vals.map((v, i) => `<td class="${i === idx ? "on" : ""}">${v}</td>`).join("")}</tr>`).join("");
  return `
    <details class="panel" open>
      <summary>Comparar categorías <small>lo que cambia</small></summary>
      <div class="table-wrap"><table class="cmp"><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
    </details>`;
}

/* ================= Briefing + vídeo ================= */
function renderBriefing(w) {
  const cat = state.cat;
  const groups = w.briefing.map(g => {
    const items = g.items
      .filter(it => typeof it === "string" || it.cats.includes(cat))
      .map(it => typeof it === "string" ? `<li>${it}</li>` : `<li class="only">${it.text}</li>`).join("");
    return items ? `<h4>${g.h}</h4><ul>${items}</ul>` : "";
  }).join("");
  return `
    <section class="panel brief">
      <h3>Briefing <small>organización</small></h3>
      <div class="video" id="video">
        <button type="button" data-yt="${w.youtube}" style="background-image:url('https://i.ytimg.com/vi/${w.youtube}/hqdefault.jpg')" aria-label="Reproducir el mini-briefing de ${esc(w.name)}">
          <span class="play"></span><span class="cap">Mini-briefing WOD ${w.num} · ${w.name}</span>
        </button>
      </div>
      <a class="yt-link" href="https://www.youtube.com/watch?v=${w.youtube}" target="_blank" rel="noopener">Abrir en YouTube ↗</a>
      ${groups}
      <p class="hint" style="margin-top:14px">Los puntos con borde de color solo aplican a <span class="tag">${catById(cat).label}</span>.</p>
    </section>`;
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-yt]");
  if (!b) return;
  const id = b.dataset.yt;
  b.parentElement.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Mini-briefing" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
});

/* ================= Jungle Joker ================= */
function renderJoker(w) {
  const v = calc.joker || 80;
  return `
    <details class="panel brief joker">
      <summary>🃏 Jungle Joker <small>+50 %</small></summary>
      <ul style="margin-top:12px">${JOKER.rules.map(r => `<li>${r}</li>`).join("")}<li class="only">WOD ${w.num}: ${w.joker}</li></ul>
      <div class="tool">
        <label class="field">Puntos de clasificación en este WOD<input type="number" inputmode="numeric" min="0" data-joker value="${v}"></label>
        <div class="result" data-joker-out></div>
      </div>
    </details>`;
}
function jokerOut(root) {
  const pts = numVal($("[data-joker]", root));
  calc.joker = pts;
  $("[data-joker-out]", root).innerHTML = `
    <div class="big">${fmt(pts * (1 + JOKER.bonus))}<small>puntos con Joker</small></div>
    <div class="row"><span>${fmt(pts)} + 50 %</span><b>+${fmt(pts * JOKER.bonus)}</b></div>`;
}
document.addEventListener("input", e => {
  if (e.target.matches("[data-joker]")) { jokerOut(e.target.closest(".joker")); saveCalc(); }
});

/* ================= Editor de equipo (compartido) ================= */
function teamEditor() {
  return `
    <div class="team" data-team>
      ${team.map((t, i) => `
        <div class="team-row">
          <span class="n">${i + 1}</span>
          <input type="text" maxlength="24" placeholder="Atleta ${i + 1}" value="${esc(t.name)}" data-tname="${i}" aria-label="Nombre del atleta ${i + 1}">
          <div class="sex" role="group" aria-label="Género del atleta ${i + 1}">
            <button type="button" class="${t.g === "M" ? "on" : ""}" data-tsex="${i}" data-g="M" aria-pressed="${t.g === "M"}">♂</button>
            <button type="button" class="${t.g === "F" ? "on" : ""}" data-tsex="${i}" data-g="F" aria-pressed="${t.g === "F"}">♀</button>
          </div>
        </div>`).join("")}
    </div>`;
}

/* ================= Herramientas ================= */
const TOOLS = {};

/* ---------- WOD 1: puntuación ---------- */
TOOLS.caiman = {
  title: "Calculadora de puntuación",
  render() {
    const v = calc.caiman || (calc.caiman = { m: 40, f: 25, rounds: 4, worm: 0, burp: 0, sn: 0 });
    const wpr = nFemales() >= 2 ? 5 : 7;
    return `
      <h5>Vuestro equipo</h5>${teamEditor()}
      <p class="hint">Con ${nFemales() >= 2 ? "2 chicas" : "2 chicos"} hacéis <b>${wpr}</b> worm por ronda.</p>
      <h5>Peso de las barras (para todo el WOD)</h5>
      <div class="fields">
        <label class="field">Barra chico (kg)<input type="number" inputmode="decimal" min="0" step="2.5" data-k="m" value="${v.m}"></label>
        <label class="field">Barra chica (kg)<input type="number" inputmode="decimal" min="0" step="2.5" data-k="f" value="${v.f}"></label>
      </div>
      <h5>Resultado</h5>
      <div class="fields">
        <label class="field">Rondas completas<input type="number" inputmode="numeric" min="0" step="1" data-k="rounds" value="${v.rounds}"></label>
        <label class="field">+ Worm ronda en curso<input type="number" inputmode="numeric" min="0" max="${wpr}" step="1" data-k="worm" value="${v.worm}"></label>
        <label class="field">+ Burpees<input type="number" inputmode="numeric" min="0" max="7" step="1" data-k="burp" value="${v.burp}"></label>
        <label class="field">+ Snatches<input type="number" inputmode="numeric" min="0" max="5" step="1" data-k="sn" value="${v.sn}"></label>
      </div>
      <div class="result" data-out></div>
      <p class="hint">Suponemos que cada snatch sincronizado suma el peso de las dos barras (la de chico y la de chica). Si en el briefing del viernes dicen otra cosa, lo cambiamos.</p>`;
  },
  compute(root) {
    const v = calc.caiman;
    ["m", "f", "rounds", "worm", "burp", "sn"].forEach(k => { v[k] = numVal($(`[data-k=${k}]`, root)); });
    const wpr = nFemales() >= 2 ? 5 : 7;
    const rounds = Math.floor(v.rounds);
    const worm = clamp(Math.floor(v.worm), 0, wpr), burp = clamp(Math.floor(v.burp), 0, 7), sn = clamp(Math.floor(v.sn), 0, 5);
    const pair = v.m + v.f;
    const snReps = rounds * 5 + sn;
    const snKg = snReps * pair;
    const reps = rounds * (wpr + 7) + worm + burp;
    const bonus = reps * 2;
    const perRound = 5 * pair + 2 * (wpr + 7);
    $("[data-out]", root).innerHTML = `
      <div class="big">${fmt(snKg + bonus)}<small>kg</small></div>
      <div class="row"><span>Snatch: ${snReps} × ${fmt(pair)} kg</span><b>${fmt(snKg)} kg</b></div>
      <div class="row"><span>Worm + burpees: ${reps} reps × 2 kg</span><b>${fmt(bonus)} kg</b></div>
      <div class="row"><span>Desempate (reps worm + burpees)</span><b>${reps}</b></div>
      <div class="row"><span>Cada ronda completa vale</span><b>${fmt(perRound)} kg</b></div>
      <div class="row"><span>+5 kg en cada barra suma por ronda</span><b>+50 kg</b></div>`;
  }
};

/* ---------- WOD 2: quién coge qué ---------- */
TOOLS.ajolote = {
  title: "Reparto del material",
  render() {
    const v = calc.ajolote || (calc.ajolote = { el: ["barra", "kb", "db"] });
    const opts = [["barra", "Barra"], ["kb", "Kettlebells"], ["db", "Mancuernas"]];
    return `
      <h5>Vuestro equipo</h5>${teamEditor()}
      <h5>¿Quién coge qué?</h5>
      <p class="hint">Para front squat, shoulder to overhead, lungesters y bear complex: uno con cada elemento, los tres a la vez.</p>
      <div class="fields">
        ${team.map((t, i) => `
          <label class="field"><span data-name="${i}">${esc(who(i))}</span> ${sexIcon(t.g)}
            <select data-el="${i}">${opts.map(([k, l]) => `<option value="${k}" ${v.el[i] === k ? "selected" : ""}>${l}</option>`).join("")}</select>
          </label>`).join("")}
      </div>
      <div class="result" data-out></div>`;
  },
  compute(root) {
    const v = calc.ajolote;
    $$("[data-el]", root).forEach(s => { v.el[+s.dataset.el] = s.value; });
    const gear = AJOLOTE_GEAR[state.cat];
    const label = { barra: "Barra", kb: "Kettlebells", db: "Mancuernas" };
    const dup = new Set(v.el).size < 3;
    const rows = team.map((t, i) => {
      const l = splitLoad(gear[v.el[i]]);
      return `<div class="row"><span>${esc(who(i))} ${sexIcon(t.g)} · ${label[v.el[i]]}</span><b>${t.g === "F" ? l.f : l.m}</b></div>`;
    }).join("");
    const extra = state.cat === "rx" ? "Handstand walk: 4 tramos de 7,5 m unbroken para repartir."
      : state.cat === "master" ? "Handstand walk: 3 tramos de 7,5 m unbroken para repartir."
      : "Final: sprint + 5 burpees al target, uno detrás de otro.";
    $("[data-out]", root).innerHTML = rows +
      (dup ? `<p class="warn">Tenéis un elemento repetido: tienen que estar los tres (barra, KB y DB) funcionando a la vez.</p>` : `<p class="ok">✓ Los tres elementos cubiertos.</p>`) +
      `<p class="hint">${extra}</p>`;
  }
};

/* ---------- WOD 3: rope climb + choose your poison ---------- */
TOOLS.sanguijuela = {
  title: "Calculadora 3A / 3B",
  render() {
    const v = calc.sang || (calc.sang = { rc: [0, 0, 0, 0], dt: 0, opt: [7, 5, 3], kg: [80, 70, 50], done: [true, true, true], db: [null, null, null, null] });
    const scaled = state.cat === "scaled";
    const rcOpts = [["Single regular", "1 atleta con pinza", 1], ["Single legless", "1 atleta sin pinza", 2], ["Synchro regular", "2 atletas con pinza", 3], ["Synchro legless", "2 atletas sin pinza", 4]];
    const L = SANGUIJUELA_LOADS[state.cat];
    const males = team.map((t, i) => t.g === "M" ? i : -1).filter(i => i >= 0);
    const fems = team.map((t, i) => t.g === "F" ? i : -1).filter(i => i >= 0);
    const mixed = males.length && fems.length;
    const pool = males.length === 2 ? males : fems;
    const rounds = mixed ? L.map((l, r) => {
      const dbIdx = pool.includes(v.db[r]) ? v.db[r] : pool[r % 2];
      return `<div class="rc-row"><span class="lbl">Ronda ${r + 1} · barra ${l[0]} · DB ${l[1]}<small data-sgr="${r}"></small></span>
        <select data-sgdb="${r}" aria-label="Quién va con mancuernas en la ronda ${r + 1}">${pool.map(i => `<option value="${i}" ${i === dbIdx ? "selected" : ""}>DB: ${esc(who(i))}</option>`).join("")}</select></div>`;
    }).join("") : `<p class="warn">El reglamento pide un chico y una chica con barra: el equipo tiene que ser mixto.</p>`;
    return `
      <h5>Vuestro equipo</h5>${teamEditor()}
      <h5>Rondas 1–4: quién va con mancuernas</h5>
      <div>${rounds}</div>
      <h5>WOD 3A · Rope climb</h5>
      <div>
        ${rcOpts.map(([n, d, p], i) => (scaled && i === 3) ? "" : `
          <div class="rc-row"><span class="lbl">${n} · ${p} pt${p > 1 ? "s" : ""}<small>${d}</small></span>
            <div class="stepper"><button type="button" data-rc="${i}" data-d="-1" aria-label="Restar">−</button><output data-rco="${i}">${v.rc[i]}</output><button type="button" data-rc="${i}" data-d="1" aria-label="Sumar">+</button></div></div>`).join("")}
      </div>
      <label class="field">Reps de DT (desempate, máx. 108)<input type="number" inputmode="numeric" min="0" max="108" data-k="dt" value="${v.dt || ""}" placeholder="12 DL + 9 HC + 6 S2OH = 27 por ronda"></label>
      <div class="result" data-out-a></div>
      <h5>WOD 3B · Choose your poison</h5>
      <div class="fields">
        ${team.map((t, i) => `
          <div class="field"><span data-name="${i}">${esc(who(i))}</span> ${sexIcon(t.g)}
            <select data-opt="${i}" aria-label="Opción de ${esc(who(i))}">${[7, 5, 3].map(o => `<option value="${o}" ${v.opt[i] === o ? "selected" : ""}>${o} reps</option>`).join("")}</select>
            <input type="number" inputmode="decimal" min="0" step="2.5" data-kg="${i}" value="${v.kg[i] || ""}" placeholder="kg" aria-label="Kilos de ${esc(who(i))}">
            <label class="check"><input type="checkbox" data-done="${i}" ${v.done[i] ? "checked" : ""}> Completa</label>
          </div>`).join("")}
      </div>
      <div class="result" data-out></div>`;
  },
  compute(root) {
    const v = calc.sang;
    const scaled = state.cat === "scaled";
    const L = SANGUIJUELA_LOADS[state.cat];
    v.dt = numVal($("[data-k=dt]", root));
    $$("[data-opt]", root).forEach(s => { v.opt[+s.dataset.opt] = +s.value; });
    $$("[data-kg]", root).forEach(s => { v.kg[+s.dataset.kg] = numVal(s); });
    $$("[data-done]", root).forEach(s => { v.done[+s.dataset.done] = s.checked; });
    $$("[data-sgdb]", root).forEach(s => {
      const r = +s.dataset.sgdb, dbIdx = +s.value;
      v.db[r] = dbIdx;
      const [bar, db] = [splitLoad(L[r][0]), splitLoad(L[r][1])];
      const txt = team.map((t, i) => i === dbIdx
        ? `${esc(who(i))}: DB ${t.g === "F" ? db.f : db.m}`
        : `${esc(who(i))}: barra ${t.g === "F" ? bar.f : bar.m}`).join(" · ");
      $(`[data-sgr="${r}"]`, root).innerHTML = txt;
    });
    // 3A
    const pts = v.rc.reduce((s, n, i) => s + (scaled && i === 3 ? 0 : n * (i + 1)), 0);
    $("[data-out-a]", root).innerHTML = `
      <div class="big">${pts}<small>puntos</small></div>
      <div class="row"><span>Subidas</span><b>${v.rc.reduce((s, n, i) => s + (scaled && i === 3 ? 0 : n), 0)}</b></div>
      ${v.dt ? `<div class="row"><span>Desempate: reps de DT</span><b>${Math.min(108, Math.floor(v.dt))}</b></div>` : ""}`;
    // 3B
    let total = 0;
    const rows = team.map((t, i) => {
      const raw = v.kg[i] * v.opt[i];
      const val = v.done[i] ? raw * (t.g === "F" ? 1.4 : 1) : 0;
      total += val;
      const f = t.g === "F" ? " × 1,4" : "";
      return `<div class="row"><span>${esc(who(i))}: ${fmt(v.kg[i])} kg × ${v.opt[i]}${f}${v.done[i] ? "" : " (no completa → 0)"}</span><b>${fmt(val)} kg</b></div>`;
    }).join("");
    const dup = new Set(v.opt).size < 3;
    const order = [7, 5, 3].map(o => { const i = v.opt.indexOf(o); return i >= 0 ? `${esc(who(i))} (${o})` : null; }).filter(Boolean).join(" → ");
    const changes = ["M", "F"].map(g => {
      const ks = team.map((t, i) => t.g === g ? v.kg[i] : null).filter(k => k !== null);
      return ks.length === 2 && ks[0] !== ks[1] ? `Hay que cambiar el peso de la barra de ${g === "M" ? "chico" : "chica"} (${fmt(ks[0])} ↔ ${fmt(ks[1])} kg) dentro de los 2'.` : "";
    }).filter(Boolean);
    $("[data-out]", root).innerHTML = `
      <div class="big">${fmt(total)}<small>kg</small></div>${rows}
      ${dup ? `<p class="warn">Cada atleta tiene que hacer una opción distinta: 7, 5 y 3.</p>` : `<p class="hint">Orden en pista: ${order}</p>`}
      ${changes.map(c => `<p class="hint">⚠︎ ${c}</p>`).join("")}`;
  }
};

/* ---------- WOD 4: A/B/C + puntos ---------- */
TOOLS.tarantula = {
  title: "Planificador A/B/C y puntos",
  render() {
    const v = calc.tar || (calc.tar = { role: [0, 1, 2], pts: [[0, 0, 0], [0, 0, 0], [0, 0, 0]] });
    const T = TARANTULA[state.cat];
    return `
      <h5>Vuestro equipo</h5>${teamEditor()}
      <h5>¿Quién es A, B y C?</h5>
      <div class="fields">
        ${["A", "B", "C"].map((r, k) => `
          <label class="field">Atleta ${r}
            <select data-role="${k}">${team.map((t, i) => `<option value="${i}" ${v.role[k] === i ? "selected" : ""}>${esc(who(i))} ${sexIcon(t.g)}</option>`).join("")}</select>
          </label>`).join("")}
      </div>
      <div class="timeline" data-tl></div>
      <h5>Puntos de gimnásticos (reps sincronizadas)</h5>
      ${T.gym.map((g, r) => `
        <p class="hint" style="margin-top:4px"><b>Ronda ${r + 1}</b></p>
        <div class="fields">${g.map(([n, p], m) => `
          <label class="field">${n} (${p} pt${p > 1 ? "s" : ""})<input type="number" inputmode="numeric" min="0" data-pt="${r}-${m}" value="${v.pts[r][m] || ""}" placeholder="0"></label>`).join("")}
        </div>`).join("")}
      <div class="result" data-out></div>`;
  },
  compute(root) {
    const v = calc.tar;
    const T = TARANTULA[state.cat];
    $$("[data-role]", root).forEach(s => { v.role[+s.dataset.role] = +s.value; });
    $$("[data-pt]", root).forEach(s => { const [r, m] = s.dataset.pt.split("-").map(Number); v.pts[r][m] = numVal(s); });
    const [A, B, C] = v.role;
    const dup = new Set(v.role).size < 3;
    const kg = (r, i) => `${team[i].g === "F" ? T.thr[r][2] : T.thr[r][1]} kg`;
    const n = i => `<span class="who">${esc(who(i))}</span>`;
    const buyers = [A, B, C];
    const tl = [0, 1, 2].map(r => {
      const b = buyers[r];
      const buy = `<p>${n(b)} · buy-in: ${T.dp[r]} devil press + ${T.thr[r][0]} thrusters a <b>${kg(r, b)}</b></p>`;
      let rest;
      if (r === 0) rest = `<p>${n(A)} + ${n(B)} → gimnásticos en cuanto ${esc(who(A))} acaba.</p><p>${n(C)} carga la barra de la ronda 2: <b>${kg(1, B)}</b> (para ${esc(who(B))}) y luego releva.</p>`;
      else if (r === 1) rest = `<p>${n(B)} + ${n(C)} → gimnásticos.</p><p>${n(A)} carga la barra de la ronda 3: <b>${kg(2, C)}</b> (para ${esc(who(C))}) y luego releva.</p>`;
      else rest = `<p>Los 3 al rack, relevos libres en sincro de 2.</p>`;
      const gym = T.gym[r].map(([m, p]) => `${m} ${p}`).join(" · ");
      return `<div class="tl"><h6>Ronda ${r + 1}</h6>${buy}${rest}<p class="dim">Gym: ${gym}</p></div>`;
    }).join("");
    $("[data-tl]", root).innerHTML = (dup ? `<p class="warn">Cada atleta tiene que tener un rol distinto.</p>` : "") + tl;
    const per = T.gym.map((g, r) => g.reduce((s, [, p], m) => s + p * Math.floor(v.pts[r][m]), 0));
    $("[data-out]", root).innerHTML = `
      <div class="big">${per.reduce((a, b) => a + b, 0)}<small>puntos</small></div>
      ${per.map((p, r) => `<div class="row"><span>Ronda ${r + 1}</span><b>${p}</b></div>`).join("")}`;
  }
};

/* ---------- WOD 5: reps si no se acaba ---------- */
TOOLS.buey = {
  title: "Contador de reps",
  render() {
    const v = calc.buey || (calc.buey = { series: 0, ex: 0, part: 0 });
    const tbl = BUEY_SCHEME.map(r => `<td>${r}</td>`).join("");
    let acc = 0;
    const cum = BUEY_SCHEME.map(r => { acc += r * 4; return `<td>${acc}</td>`; }).join("");
    const moves = state.cat === "scaled" ? ["Box step over", "KB swing", "OHS", "Traverse"] : ["Box step over", "American KB swing", "OHS", "Dips + traverse"];
    return `
      <p class="hint">4 ejercicios × (4+6+8+10+8+6+4) = <b>184 reps</b>. Si acabáis antes del cap, el resultado es el tiempo.</p>
      <div class="table-wrap"><table class="cmp" style="min-width:0"><thead><tr><th>Serie</th>${BUEY_SCHEME.map((_, i) => `<th>${i + 1}</th>`).join("")}</tr></thead>
        <tbody><tr><th scope="row">Reps</th>${tbl}</tr><tr><th scope="row">Acumulado</th>${cum}</tr></tbody></table></div>
      <h5>¿Dónde os pilló el cap?</h5>
      <div class="fields">
        <label class="field">Series completas
          <select data-k="series">${BUEY_SCHEME.map((_, i) => `<option value="${i}" ${v.series === i ? "selected" : ""}>${i}</option>`).join("")}<option value="7" ${v.series === 7 ? "selected" : ""}>7 (terminado)</option></select></label>
        <label class="field">Ejercicios hechos de la serie en curso
          <select data-k="ex">${[0, 1, 2, 3].map(i => `<option value="${i}" ${v.ex === i ? "selected" : ""}>${i}${i ? ` (hasta ${moves[i - 1]})` : ""}</option>`).join("")}</select></label>
        <label class="field">Reps del ejercicio a medias<input type="number" inputmode="numeric" min="0" data-k="part" value="${v.part || ""}" placeholder="0"></label>
      </div>
      <div class="result" data-out></div>`;
  },
  compute(root) {
    const v = calc.buey;
    v.series = +$("[data-k=series]", root).value;
    v.ex = +$("[data-k=ex]", root).value;
    v.part = numVal($("[data-k=part]", root));
    const done = BUEY_SCHEME.slice(0, v.series).reduce((s, r) => s + r * 4, 0);
    if (v.series >= 7) {
      $("[data-out]", root).innerHTML = `<div class="big">184<small>reps</small></div><p class="ok">✓ WOD terminado: cuenta vuestro tiempo.</p>`;
      return;
    }
    const cur = BUEY_SCHEME[v.series];
    const part = clamp(Math.floor(v.part), 0, cur - 1);
    const total = done + v.ex * cur + part;
    $("[data-out]", root).innerHTML = `
      <div class="big">${total}<small>/ 184 reps</small></div>
      <div class="row"><span>Serie en curso</span><b>${v.series + 1}ª · ${cur} reps</b></div>
      <div class="row"><span>Os faltaban</span><b>${184 - total} reps</b></div>
      <p class="hint">No cuentan la comba ni los thrusters del buy-in. Las reps de la serie a medias cuentan si no se había roto.</p>`;
  }
};

function mountTool(w) {
  const root = $("#tool");
  const tool = TOOLS[w.tool];
  if (!root || !tool) return;
  const draw = () => { root.innerHTML = tool.render(); tool.compute(root); };
  draw();
  root.oninput = e => {
    const t = e.target;
    if (t.dataset.tname !== undefined) {
      team[+t.dataset.tname].name = t.value;
      saveTeam();
      $$(`[data-name="${t.dataset.tname}"]`, root).forEach(el => { el.textContent = who(+t.dataset.tname); });
    }
    tool.compute(root);
    saveCalc();
  };
  root.onchange = e => {
    if (e.target.dataset.tname !== undefined) { draw(); return; } // refresca los nombres en los desplegables
    tool.compute(root);
    saveCalc();
  };
  root.onclick = e => {
    const s = e.target.closest("[data-tsex]");
    if (s) { team[+s.dataset.tsex].g = s.dataset.g; saveTeam(); draw(); saveCalc(); return; }
    const rc = e.target.closest("[data-rc]");
    if (rc) {
      const i = +rc.dataset.rc;
      calc.sang.rc[i] = Math.max(0, calc.sang.rc[i] + +rc.dataset.d);
      $(`[data-rco="${i}"]`, root).textContent = calc.sang.rc[i];
      tool.compute(root);
      saveCalc();
    }
  };
}

/* ================= Vista del WOD ================= */
function renderWod() {
  const w = WODS[state.wod];
  const tool = TOOLS[w.tool];
  $("#main").innerHTML = `
    <div class="wod-view">
      <div class="grid">
        <div class="stack">
          ${renderPoster(w, state.cat)}
          ${renderCompare(w)}
        </div>
        <div class="stack">
          ${renderBriefing(w)}
          ${renderJoker(w)}
          ${tool ? `<details class="panel" open><summary>${tool.title} <small>${catById(state.cat).label}</small></summary><div class="tool" id="tool"></div></details>` : ""}
        </div>
      </div>
      <nav class="pager" aria-label="Cambiar de WOD">
        <button class="btn" data-go="-1" ${state.wod === 0 ? "hidden" : ""}>← WOD ${state.wod}</button>
        <button class="btn" data-go="1" ${state.wod === WODS.length - 1 ? "hidden" : ""}>WOD ${state.wod + 2} →</button>
      </nav>
    </div>`;
  jokerOut($(".joker"));
  mountTool(w);
}

/* ================= Init ================= */
readHash();
window.addEventListener("hashchange", () => { readHash(); renderNav(); renderWod(); });
writeHash();
renderNav();
renderWod();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(err => console.warn("SW no registrado:", err));
  });
}
