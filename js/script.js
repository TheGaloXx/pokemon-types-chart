const TYPES = [
    "Normal", "Fire", "Water", "Electric", "Grass", "Ice",
    "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug",
    "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"
];

const COLORS = {
    Normal:  "#A8A77A",
    Fire:    "#EE8130",
    Water:   "#6390F0",
    Electric:"#F7D02C",
    Grass:   "#7AC74C",
    Ice:     "#96D9D6",
    Fighting:"#C22E28",
    Poison:  "#A33EA1",
    Ground:  "#E2BF65",
    Flying:  "#A98FF3",
    Psychic: "#F95587",
    Bug:     "#A6B91A",
    Rock:    "#B6A136",
    Ghost:   "#735797",
    Dragon:  "#6F35FC",
    Dark:    "#705746",
    Steel:   "#B7B7CE",
    Fairy:   "#D685AD"
};

const ABBR = {
    Normal:  "NRM", Fire: "FIR", Water: "WTR", Electric: "ELC",
    Grass:   "GRS", Ice:  "ICE", Fighting: "FGT", Poison: "PSN",
    Ground:  "GRD", Flying: "FLY", Psychic: "PSY", Bug: "BUG",
    Rock:    "RCK", Ghost: "GHO", Dragon: "DRN", Dark: "DRK",
    Steel:   "STL", Fairy: "FRY"
};

const CHART = {
    Normal:  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5, 1],
    Fire:    [1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2, 1],
    Water:   [1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1],
    Electric:[1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1],
    Grass:   [1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5, 1],
    Ice:     [1, 0.5, 0.5, 1, 2, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 0.5, 1],
    Fighting:[2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2, 0.5],
    Poison:  [1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0, 2],
    Ground:  [1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 1, 2, 1],
    Flying:  [1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 0.5, 1],
    Psychic: [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5, 1],
    Bug:     [1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 0.5],
    Rock:    [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5, 1],
    Ghost:   [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 1],
    Dragon:  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5, 0],
    Dark:    [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 0.5],
    Steel:   [1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2],
    Fairy:   [1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 1]
};

const EFF = {
    "2":   { label: "×2",   name: "Super Effective",    cls: "eff-2" },
    "1":   { label: "×1",   name: "Neutral",            cls: "eff-1" },
    "0.5": { label: "×0.5", name: "Not Very Effective", cls: "eff-05" },
    "0":   { label: "×0",   name: "Immune",             cls: "eff-0" }
};

const N = TYPES.length;

let NON_NEUTRAL = 0;
for (let a = 0; a < N; a++) {
    for (let d = 0; d < N; d++) {
        if (CHART[TYPES[a]][d] !== 1) NON_NEUTRAL++;
    }
}

const state = {
    answers: {},
    done: false,
    current: null
};

const gridEl = document.getElementById("grid");
const gridScale = document.getElementById("grid-scale");
const gridWrap = document.querySelector(".grid-wrap");
const modal = document.getElementById("modal");
const mAtk = document.getElementById("m-atk");
const mDef = document.getElementById("m-def");
const modalQ = document.getElementById("modal-q");
const resultsEl = document.getElementById("results");
const gridImg = document.getElementById("grid-img");

const NAT_W = 104 + N * 64;
const NAT_H = (N + 1) * 40;
const MIN_SCALE = 0.55;

const cells = [];

const key = (a, d) => a + "-" + d;

function textColor(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const y = (r * 299 + g * 587 + b * 114) / 1000;
    return y >= 140 ? "#0f172a" : "#ffffff";
}

function fitGrid() {
    const availW = gridWrap.clientWidth;
    const top = gridWrap.getBoundingClientRect().top;
    const availH = window.innerHeight - top - 14;
    let scale = Math.min(availW / NAT_W, availH / NAT_H);
    const floor = scale < MIN_SCALE;
    if (floor) scale = MIN_SCALE;
    gridEl.style.transform = "scale(" + scale + ")";
    const w = Math.ceil(NAT_W * scale);
    const h = Math.ceil(NAT_H * scale);
    gridScale.style.width = w + "px";
    gridScale.style.height = h + "px";
    gridWrap.style.height = (h + 2) + "px";
    gridWrap.style.overflow = floor ? "auto" : "hidden";
}

for (let r = 0; r <= N; r++) {
    cells[r] = [];
    for (let c = 0; c <= N; c++) {
        const el = document.createElement("div");
        if (r === 0 && c === 0) {
            el.className = "cell corner";
            el.innerHTML = "Attacker &darr;<br>Defender &rarr;";
        } else if (r === 0) {
            const t = TYPES[c - 1];
            el.className = "cell col-header";
            el.style.background = COLORS[t];
            el.style.color = textColor(COLORS[t]);
            el.textContent = t;
        } else if (c === 0) {
            const t = TYPES[r - 1];
            el.className = "cell row-header";
            el.style.background = COLORS[t];
            el.style.color = textColor(COLORS[t]);
            el.textContent = t;
        } else {
            el.className = "cell play eff-1";
            const a = r - 1;
            const d = c - 1;
            const val = document.createElement("span");
            val.className = "val";
            val.textContent = EFF["1"].label;
            el.appendChild(val);
            state.answers[key(a, d)] = 1;
            el.addEventListener("click", () => openModal(a, d));
        }
        cells[r][c] = el;
        gridEl.appendChild(el);
    }
}

function openModal(a, d) {
    if (state.done) return;
    state.current = { a, d };
    setChip(mAtk, TYPES[a]);
    setChip(mDef, TYPES[d]);
    modalQ.textContent = "How hard does " + TYPES[a] + " hit " + TYPES[d] + "?";
    modal.classList.remove("hidden");
}

function setChip(el, t) {
    el.textContent = t;
    el.style.background = COLORS[t];
    el.style.color = textColor(COLORS[t]);
}

function setAnswer(v) {
    if (!state.current) return;
    const { a, d } = state.current;
    const el = cells[a + 1][d + 1];
    state.answers[key(a, d)] = Number(v);
    el.classList.remove("eff-2", "eff-1", "eff-05", "eff-0");
    el.classList.add(EFF[v].cls);
    el.querySelector(".val").textContent = EFF[v].label;
    closeModal();
}

function reset() {
    state.done = false;
    for (let a = 0; a < N; a++) {
        for (let d = 0; d < N; d++) {
            const el = cells[a + 1][d + 1];
            state.answers[key(a, d)] = 1;
            el.classList.remove("eff-2", "eff-05", "eff-0");
            el.classList.add("eff-1");
            el.querySelector(".val").textContent = EFF["1"].label;
        }
    }
    resultsEl.classList.add("hidden");
    closeModal();
}

function done() {
    if (state.done) return;
    state.done = true;
    buildResults();
    resultsEl.classList.remove("hidden");
}

function scoreComment(pct) {
    const ranges = window.SCORE_COMMENTS;
    if (!ranges) return "";
    for (const r of ranges) {
        if (pct >= r.min && pct <= r.max) return r.text;
    }
    return "";
}

function chip(t) {
    const s = document.createElement("span");
    s.className = "chip sm";
    s.textContent = t;
    s.style.background = COLORS[t];
    s.style.color = textColor(COLORS[t]);
    return s;
}

function multSpan(v) {
    const s = document.createElement("span");
    s.className = "mult " + EFF[String(v)].cls.replace("eff-", "mult-");
    s.textContent = EFF[String(v)].label;
    return s;
}

function buildResults() {
    let correct = 0;
    let x1Wrong = 0;
    const wrong = [];
    for (let a = 0; a < N; a++) {
        for (let d = 0; d < N; d++) {
            const ans = CHART[TYPES[a]][d];
            const user = state.answers[key(a, d)];
            if (ans === 1) {
                if (user !== 1) x1Wrong++;
            } else if (user === ans) {
                correct++;
            }
            if (user !== ans) wrong.push({ a, d, user, ans });
        }
    }

    const score = correct - x1Wrong;
    const pct = Math.round(score / NON_NEUTRAL * 100);
    document.getElementById("res-correct").textContent = score;
    document.getElementById("res-pct").textContent = pct + "% correct";
    document.getElementById("res-comment").textContent = scoreComment(pct);

    const list = document.getElementById("mistakes");
    list.innerHTML = "";
    if (wrong.length === 0) {
        const li = document.createElement("li");
        li.className = "mistake perfect";
        li.textContent = "Everything correct!";
        list.appendChild(li);
    } else {
        for (const w of wrong) {
            const li = document.createElement("li");
            li.className = "mistake";

            const pair = document.createElement("span");
            pair.className = "pair";
            pair.appendChild(chip(TYPES[w.a]));
            const arrow = document.createElement("span");
            arrow.className = "arrow";
            arrow.textContent = "→";
            pair.appendChild(arrow);
            pair.appendChild(chip(TYPES[w.d]));
            li.appendChild(pair);

            const detail = document.createElement("span");
            detail.className = "detail";
            detail.appendChild(document.createTextNode("you said "));
            detail.appendChild(multSpan(w.user));
            detail.appendChild(document.createTextNode(" · correct is "));
            detail.appendChild(multSpan(w.ans));
            li.appendChild(detail);

            list.appendChild(li);
        }
    }

    gridImg.src = renderImage().toDataURL("image/png");
}

function renderImage() {
    const cellSize = 36, rowW = 78, colH = 26;
    const W = rowW + N * cellSize;
    const H = colH + N * cellSize;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d");

    ctx.fillStyle = "#cbc4ab";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#c4ced9";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
        const x = rowW + i * cellSize;
        const y = colH + i * cellSize;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
    }
    ctx.stroke();

    ctx.font = "bold 12px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < N; i++) {
        const t = TYPES[i];
        const x = rowW + i * cellSize;
        ctx.fillStyle = COLORS[t];
        ctx.fillRect(x, 0, cellSize, colH);
        ctx.fillStyle = textColor(COLORS[t]);
        ctx.fillText(ABBR[t], x + cellSize / 2, colH / 2 + 1);
    }

    ctx.textAlign = "left";
    ctx.font = "bold 11px Arial, sans-serif";
    for (let i = 0; i < N; i++) {
        const t = TYPES[i];
        const y = colH + i * cellSize;
        ctx.fillStyle = COLORS[t];
        ctx.fillRect(0, y, rowW, cellSize);
        ctx.fillStyle = textColor(COLORS[t]);
        ctx.fillText(t, 8, y + cellSize / 2 + 1);
    }

    ctx.fillStyle = "#dce4ee";
    ctx.fillRect(0, 0, rowW, colH);
    ctx.fillStyle = "#7c8a9c";
    ctx.font = "bold 10px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Attacker →", rowW / 2, 9);
    ctx.fillText("Defender ↓", rowW / 2, 19);

    ctx.font = "bold 14px Arial, sans-serif";
    for (let a = 0; a < N; a++) {
        for (let d = 0; d < N; d++) {
            const ans = CHART[TYPES[a]][d];
            const v = state.answers[key(a, d)];
            const x = rowW + d * cellSize;
            const y = colH + a * cellSize;
            ctx.fillStyle = "#57503c";
            ctx.fillText(EFF[String(v)].label, x + cellSize / 2, y + cellSize / 2 + 1);
            if (v === ans) continue;
            ctx.strokeStyle = "#a52727";
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);
        }
    }
    return cv;
}

function closeModal() {
    state.current = null;
    modal.classList.add("hidden");
}

document.getElementById("res-total").textContent = NON_NEUTRAL;

modal.querySelectorAll(".opt").forEach(btn => {
    btn.addEventListener("click", () => setAnswer(btn.dataset.v));
});

modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
});

document.getElementById("btn-done").addEventListener("click", done);
document.getElementById("btn-reset").addEventListener("click", reset);
document.getElementById("btn-play-again").addEventListener("click", reset);
document.getElementById("btn-download").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "pokemon-type-chart.png";
    link.href = renderImage().toDataURL("image/png");
    link.click();
});

window.addEventListener("resize", fitGrid);
fitGrid();
