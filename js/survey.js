const app = document.getElementById("app");
const A = {}; let step = 0;
const core = () => A.A3 && A.A3 !== "Anggota";
const steps = () => SEC.filter(s => !s.core || core());
const SKIP = ["J2", "J3", "J4", "J5"];
const vis = q => !(SKIP.includes(q.id) && A.J1 === "Tidak");

function itemHTML(q) {
  let h = `<div class="q nb-card" id="q-${q.id}"><p class="qt">${q.id === "Z1" ? "" : `<b>${q.id}.</b> `}${q.t}${q.opt ? " <i>(opsional)</i>" : ""}${q.type === "m" && q.max < 99 ? ` <i>(pilih maksimal ${q.max})</i>` : ""}</p>`;
  const chip = (v, l, c = "") => `<button type="button" class="chip ${c}" data-id="${q.id}" data-v="${v}">${l}</button>`;
  const LB = { 1: ["Sangat Tidak Setuju", "STS"], 2: ["Tidak Setuju", "TS"], 3: ["Setuju", "S"], 4: ["Sangat Setuju", "SS"] };
  const sc = n => chip(n, `<span class="n">${n}</span><span class="c"><span class="cf">${LB[n][0]}</span><span class="cs">${LB[n][1]}</span></span>`);
  if (q.type === "s") h += `<div class="sc">${[1, 2, 3, 4].map(sc).join("")}${chip("TT", "Tidak tahu", "tt")}</div>`;
  else if (q.type === "c" || q.type === "m") h += `<div class="ch">${q.o.map(x => chip(x, x)).join("")}</div>`;
  else h += `<textarea class="form-control" data-id="${q.id}" placeholder="Tulis jawabanmu di sini...">${A[q.id] || ""}</textarea>`;
  return h + "</div>";
}
function sync() {
  document.querySelectorAll(".chip").forEach(c => {
    const a = A[c.dataset.id];
    c.classList.toggle("on", Array.isArray(a) ? a.includes(c.dataset.v) : a === c.dataset.v);
  });
}
function render() {
  const st = steps(), s = st[step], pct = Math.round(((step + 1) / st.length) * 100);
  app.innerHTML = `<div class="nb-progress progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${pct}%"></div></div>
  <div class="d-flex justify-content-between fw-bold small mt-2 mb-4"><span>Bagian ${step + 1} dari ${st.length}</span><span>${pct}%</span></div>
  <h1 class="h3 mb-3">${s.title}</h1>
  ${s.id === "Z" ? `<div class="nb-card s mb-4">Angket ini anonim, sukarela, dan tidak ada jawaban benar atau salah. Jika kamu aktif di beberapa organisasi, pilih satu yang paling aktif dan jawab seluruh angket untuk organisasi itu saja.</div>` : ""}
  ${s.q.some(q => q.type === "s") ? `<div class="nb-note"><b>Petunjuk skala:</b> ${SCALE_LEGEND}</div>` : ""}
  ${s.note ? `<div class="nb-note">${s.note}</div>` : ""}
  ${s.q.filter(vis).map(itemHTML).join("")}
  <div id="err" class="msg" role="alert"></div>
  <div class="d-flex justify-content-between gap-3"><button class="btn btn-nb w" id="prev" ${step ? "" : "disabled"}>Kembali</button>
  <button class="btn btn-nb" id="next">${step === st.length - 1 ? "Kirim Jawaban" : "Lanjut"}</button></div>`;
  sync(); window.scrollTo({ top: 0 });
  document.getElementById("prev").onclick = () => { step--; render(); };
  document.getElementById("next").onclick = next;
}
function next() {
  const st = steps(), s = st[step];
  const miss = s.q.filter(q => vis(q) && !q.opt && q.type !== "t" && !(Array.isArray(A[q.id]) ? A[q.id].length : A[q.id]));
  document.querySelectorAll(".q").forEach(e => e.classList.remove("err"));
  if (miss.length) {
    miss.forEach(q => document.getElementById("q-" + q.id).classList.add("err"));
    document.getElementById("err").textContent = `Masih ada ${miss.length} pertanyaan yang belum dijawab (ditandai merah).`;
    document.getElementById("q-" + miss[0].id).scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (s.id === "Z" && A.Z1 === "Tidak") return end("Terima kasih", "Kamu memilih tidak mengisi. Tidak apa-apa, terima kasih sudah mampir.");
  if (step === st.length - 1) return submit();
  step++; render();
}
function end(t, m) {
  app.innerHTML = `<div class="nb-card s text-center mt-4"><h1 class="h3 mb-2">${t}</h1><p class="mb-4">${m}</p><a class="btn btn-nb w" href="index.html">Kembali ke Beranda</a></div>`;
}
async function submit() {
  const btn = document.getElementById("next"), err = document.getElementById("err");
  if (!CONFIG.SCRIPT_URL) { err.textContent = "Angket belum terhubung ke spreadsheet (SCRIPT_URL di js/config.js masih kosong)."; return; }
  const ids = [], answers = {};
  steps().filter(s => s.id !== "Z").forEach(s => s.q.filter(vis).forEach(q => {
    ids.push(q.id); const a = A[q.id];
    answers[q.id] = Array.isArray(a) ? a.join(" | ") : (a || "");
  }));
  const allIds = SEC.filter(s => s.id !== "Z").flatMap(s => s.q.map(q => q.id));
  btn.disabled = true; btn.textContent = "Mengirim...";
  try {
    const r = await fetch(CONFIG.SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "submit", ids: allIds, answers }) });
    const j = await r.json(); if (!j.ok) throw new Error(j.error);
    end("Terima kasih!", "Jawabanmu sudah tersimpan dan sangat membantu buku ini menjawab kebutuhan ormawa yang sebenarnya.");
  } catch (e) { err.textContent = "Gagal mengirim. Periksa koneksi lalu coba lagi."; btn.disabled = false; btn.textContent = "Kirim Jawaban"; }
}
app.addEventListener("click", e => {
  const c = e.target.closest(".chip"); if (!c) return;
  const id = c.dataset.id, v = c.dataset.v, q = Q[id];
  if (q.type === "m") {
    const a = A[id] || [], i = a.indexOf(v);
    if (i > -1) a.splice(i, 1); else if (a.length < q.max) a.push(v);
    A[id] = a;
  } else A[id] = v;
  document.getElementById("q-" + id).classList.remove("err");
  if (id === "J1") { const y = scrollY; render(); scrollTo(0, y); } else sync();
});
app.addEventListener("input", e => { if (e.target.dataset.id) A[e.target.dataset.id] = e.target.value; });
render();
