Chart.defaults.font.family = "Arial, Helvetica, sans-serif";
Chart.defaults.font.weight = "bold";
Chart.defaults.color = "#111";
Chart.defaults.layout.padding = 4;
const $ = id => document.getElementById(id);
const COL = { a: "#FF6B35", y: "#FFE27A", b: "#8EE3C8", bd: "#2BA784", l: "#C9B8FF", r: "#FF6B35", g: "#D9D4C7" };
let D = [], charts = {}, HEAD = [];

function mk(id, cfg) {
  charts[id] && charts[id].destroy();
  cfg.options = Object.assign({ responsive: true, maintainAspectRatio: false }, cfg.options);
  (cfg.data.datasets || []).forEach(d => { d.borderColor = "#111"; d.borderWidth = 2; });
  charts[id] = new Chart($(id), cfg);
}
async function api(body) {
  if (!CONFIG.SCRIPT_URL) throw new Error("SCRIPT_URL di js/config.js belum diisi.");
  const r = await fetch(CONFIG.SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) });
  return r.json();
}
async function load(cred) {
  const j = await api({ action: "list", ...cred });
  if (!j.ok) throw new Error(j.error === "auth" ? "Email atau kata sandi salah." : j.error);
  HEAD = j.header;
  D = j.rows.map(r => Object.fromEntries(HEAD.map((h, i) => [h, String(r[i] ?? "")])));
  return j;
}
$("lbtn").onclick = async () => {
  const cred = { email: $("em").value.trim(), pass: $("pw").value };
  $("lbtn").disabled = true; $("lerr").textContent = "";
  try { await load(cred); sessionStorage.setItem("adm", JSON.stringify(cred)); show(); }
  catch (e) { $("lerr").textContent = e.message; }
  $("lbtn").disabled = false;
};
$("pw").addEventListener("keydown", e => e.key === "Enter" && $("lbtn").click());
$("bOut").onclick = () => { sessionStorage.removeItem("adm"); location.reload(); };
$("bRef").onclick = async () => { await load(JSON.parse(sessionStorage.getItem("adm"))); draw(); };
$("bCsv").onclick = () => {
  const rows = filtered(), esc = v => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [HEAD.map(esc).join(",")].concat(rows.map(r => HEAD.map(h => esc(r[h])).join(","))).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv" })); a.download = "angket-ormawa.csv"; a.click();
};

const isCore = r => r.A3 && r.A3 !== "Anggota";
function filtered() {
  const o = $("fOrg").value, p = $("fRole").value;
  return D.filter(r => (!o || r.A1 === o) && (!p || (p === "core" ? isCore(r) : !isCore(r))));
}
const scaleIds = s => s.q.filter(q => q.type === "s").map(q => q.id);
function mean(rows, ids) {
  let t = 0, n = 0;
  rows.forEach(r => ids.forEach(id => { const v = +r[id]; if (v >= 1 && v <= 4) { t += REV.has(id) ? 5 - v : v; n++; } }));
  return n ? +(t / n).toFixed(2) : null;
}
const secs = () => SEC.filter(s => s.id !== "Z" && s.id !== "A" && s.id !== "L");

function show() {
  $("login").classList.add("hide"); $("dash").classList.remove("hide");
  const orgs = Q.A1.o; $("fOrg").innerHTML = '<option value="">Semua jenis organisasi</option>' + orgs.map(o => `<option>${o}</option>`).join("");
  $("sSec").innerHTML = SEC.filter(s => scaleIds(s).length && s.id !== "Z").map(s => `<option value="${s.id}">${s.id} · ${s.title}</option>`).join("");
  const opt = f => SEC.flatMap(s => s.q.filter(f)).map(q => `<option value="${q.id}">${q.id} · ${q.t.slice(0, 70)}</option>`).join("");
  $("sCh").innerHTML = opt(q => (q.type === "c" || q.type === "m") && q.id !== "Z1");
  $("sTx").innerHTML = opt(q => q.type === "t");
  ["fOrg", "fRole", "sSec", "sCh", "sTx"].forEach(id => $(id).onchange = draw);
  draw();
}
function count(arr) { const m = {}; arr.forEach(x => m[x] = (m[x] || 0) + 1); return m; }

function draw() {
  const R = filtered(), core = R.filter(isCore), mem = R.filter(r => !isCore(r));
  const all = mean(R, SEC.flatMap(s => s.id === "Z" || s.id === "A" || s.id === "L" ? [] : scaleIds(s).filter(i => !DESC.has(i))));
  const wawancara = R.filter(r => r.L7 === "Ya").length;
  $("note").textContent = R.length && Math.min(core.length || 99, mem.length || 99) < 5 ? "Catatan: ada kategori dengan kurang dari 5 responden. Sebaiknya digabung dalam laporan agar anonimitas terjaga." : "";
  $("kpis").innerHTML = [["Total responden", R.length, "a"], ["Pengurus inti", core.length, "m"], ["Anggota", mem.length, ""], ["Skor rata-rata (1–4)", all ?? "-", "s"], ["Bersedia diwawancarai", wawancara, "l"]]
    .map(k => `<div class="col"><div class="nb-card kpi ${k[2]} h-100"><b>${k[1]}</b><span>${k[0]}</span></div></div>`).join("");

  const oc = count(R.map(r => r.A1).filter(Boolean));
  mk("cOrg", { type: "doughnut", data: { labels: Object.keys(oc), datasets: [{ data: Object.values(oc), backgroundColor: [COL.a, COL.b, COL.l, COL.y, COL.g] }] }, options: { plugins: { legend: { position: "bottom" } } } });
  const pc = count(R.map(r => r.A3).filter(Boolean));
  mk("cPos", { type: "bar", data: { labels: Object.keys(pc), datasets: [{ data: Object.values(pc), backgroundColor: COL.l }] }, options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } } });

  const S = secs();
  mk("cSec", { type: "bar", data: { labels: S.map(s => s.id + " · " + s.title.replace(" (pengurus inti)", "")), datasets: [
    { label: "Pengurus inti", data: S.map(s => mean(core, scaleIds(s).filter(i => !DESC.has(i)))), backgroundColor: COL.a },
    { label: "Anggota", data: S.map(s => s.core ? null : mean(mem, scaleIds(s).filter(i => !DESC.has(i)))), backgroundColor: COL.b }] },
    options: { indexAxis: "y", scales: { x: { min: 1, max: 4 } }, plugins: { legend: { position: "bottom" } } } });

  const sec = SEC.find(s => s.id === $("sSec").value), items = sec.q.filter(q => q.type === "s");
  $("dWrap").style.height = (items.length * 34 + 110) + "px";
  const cats = ["1", "2", "3", "4", "TT"], names = ["Sangat Tidak Setuju", "Tidak Setuju", "Setuju", "Sangat Setuju", "Tidak tahu"], cols = [COL.r, COL.y, COL.b, COL.bd, COL.g];
  const pct = (id, c) => { const v = R.filter(r => r[id]); return v.length ? +(v.filter(r => r[id] === c).length * 100 / v.length).toFixed(1) : 0; };
  mk("cDist", { type: "bar", data: { labels: items.map(q => q.id + (REV.has(q.id) ? " *" : "")), datasets: cats.map((c, i) => ({ label: names[i], data: items.map(q => pct(q.id, c)), backgroundColor: cols[i] })) },
    options: { indexAxis: "y", scales: { x: { stacked: true, max: 100, ticks: { callback: v => v + "%" } }, y: { stacked: true } },
      plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { title: c => Q[items[c[0].dataIndex].id].t, label: c => `${c.dataset.label}: ${c.raw}%` } } } } });

  const q = Q[$("sCh").value], cnt = {};
  q.o.forEach(x => cnt[x] = 0);
  R.forEach(r => (r[q.id] || "").split(" | ").filter(Boolean).forEach(x => { if (x in cnt) cnt[x]++; }));
  const n = R.filter(r => r[q.id]).length || 1;
  mk("cCh", { type: "bar", data: { labels: q.o, datasets: [{ data: q.o.map(x => +(cnt[x] * 100 / n).toFixed(1)), backgroundColor: COL.b }] },
    options: { indexAxis: "y", plugins: { legend: { display: false }, title: { display: true, text: q.t }, tooltip: { callbacks: { label: c => c.raw + "% responden" } } }, scales: { x: { ticks: { callback: v => v + "%" } } } } });

  const tid = $("sTx").value, tv = R.map(r => r[tid]).filter(Boolean);
  $("tx").innerHTML = tv.length ? tv.map(t => `<p>${t.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]))}</p>`).join("") : "<p>Belum ada jawaban.</p>";
}
const saved = sessionStorage.getItem("adm");
if (saved) load(JSON.parse(saved)).then(show).catch(() => sessionStorage.removeItem("adm"));
