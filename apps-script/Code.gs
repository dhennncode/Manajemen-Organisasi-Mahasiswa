// Tempel di Google Apps Script (Extensions > Apps Script) pada spreadsheet kamu.
const ADMIN_EMAIL = "bungdedd@gmail.com";
const ADMIN_PASS  = "bungdedasoy";   // disimpan di sisi server, tidak terlihat di web
const SHEET_NAME  = "Jawaban";

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function clean_(v) {
  v = String(v == null ? "" : v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;   // cegah injeksi rumus
}
function doGet() { return out_({ ok: true, info: "Angket Ormawa API aktif" }); }

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.action === "submit") {
      const lock = LockService.getScriptLock();
      lock.waitLock(20000);
      try {
        const sh = sheet_();
        if (sh.getLastRow() === 0) sh.appendRow(["timestamp"].concat(d.ids));
        const head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
        sh.appendRow(head.map(h => h === "timestamp" ? new Date() : clean_(d.answers[h])));
      } finally { lock.releaseLock(); }
      return out_({ ok: true });
    }
    if (d.action === "list") {
      if (d.email !== ADMIN_EMAIL || d.pass !== ADMIN_PASS) return out_({ ok: false, error: "auth" });
      const v = sheet_().getDataRange().getValues();
      return out_({ ok: true, header: v[0] || [], rows: v.slice(1) });
    }
    return out_({ ok: false, error: "aksi tidak dikenal" });
  } catch (err) { return out_({ ok: false, error: String(err) }); }
}
