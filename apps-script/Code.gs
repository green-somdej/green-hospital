/**
 * GREEN HOSPITAL PORTAL — Code.gs (v6)
 * ชีต "หมวด": A=เลขหมวด B=ชื่อ C=คำอธิบาย D=ลิงก์รูป E=สี(ไม่บังคับ) F=ลิงก์เอกสาร PDF/Drive (ไม่บังคับ)
 * ชีต "ลิงก์": A=เลขหมวด B=ชื่อลิงก์ C=URL
 * ชีต "ภาพรวม" (ใหม่): A=เลขหมวด B=ชื่อที่แสดง C=ลิงก์ฝัง / โค้ด <iframe> / ลิงก์ไฟล์ HTML ใน Drive
 *              D=ความสูง px (ไม่บังคับ ค่าเริ่มต้น 640) E=รีเฟรชทุกกี่นาที (ไม่บังคับ) F=แสดงผล(TRUE/FALSE)
 * ชีต "กิจกรรม": A=วันที่ B=แท็ก C=ชื่อ D=รายละเอียด E=URL F=รูป G=แสดงผล(TRUE/FALSE)
 * ชีต "สไลด์" (ใหม่): A=ลำดับ B=ลิงก์รูป (ใส่หลายลิงก์ในเซลล์ได้ หรือใส่ลิงก์โฟลเดอร์ Drive = ทุกรูปในโฟลเดอร์)
 *              C=หัวข้อ D=คำบรรยาย E=ลิงก์ดูเพิ่ม F=แสดงผล(TRUE/FALSE)
 *              ถ้าไม่มีชีตนี้ จะใช้รูปจากชีต "กิจกรรม" ทำสไลด์ให้อัตโนมัติ
 * ชีต "ประชาสัมพันธ์": A=ข้อความตัววิ่ง B=แสดงผล(TRUE/FALSE ไม่บังคับ)
 * ชีต "การตั้งค่า": A=คีย์ B=ค่า (โลโก้ / หัวเว็บ / หน้าเว็บ / มาสคอต)
 */
const CATEGORY_SHEET = 'หมวด';
const ACTIVITY_SHEET = 'กิจกรรม';
const LINK_SHEET = 'ลิงก์';
const SETTINGS_SHEET = 'การตั้งค่า';
const NEWS_SHEET = 'ประชาสัมพันธ์';
const SLIDE_SHEET = 'สไลด์';
const EMBED_SHEET = 'ภาพรวม';
// ถ้าสร้างสคริปต์แบบแยก (ไม่ได้เปิดจาก Sheet) ให้ใส่ ID ของ Sheet (ข้อความระหว่าง /d/ กับ /edit)
const SHEET_ID = '';
const CACHE_KEY = 'all_v6';

function ss_() { return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet(); }

/**
 * มี ?action=... = API ส่ง JSON ให้หน้าเว็บบน GitHub Pages
 * ไม่มี action  = แสดงหน้าเว็บเดิมใน Apps Script (ไฟล์ Index) ลิงก์เดิมจึงยังใช้ได้
 */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action) return ContentService.createTextOutput(JSON.stringify(api_(p))).setMimeType(ContentService.MimeType.JSON);
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Green Hospital')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** คำสั่งที่หน้าเว็บเรียกได้ มีเท่านี้เท่านั้น */
function api_(p) {
  const actions = {
    getAll: () => JSON.parse(getAll()),
    getFileInfo: () => getFileInfo(JSON.parse(p.urls || '[]')),
    getFileData: () => getFileData(p.url),
    getHtmlFile: () => getHtmlFile(p.url),
    getImageData: () => getImageData(p.id, p.w),
    listFolder: () => listFolder(p.url),
    recordVisit: () => recordVisit(p.count === '1'),
    recordClick: () => recordClick(p.row)
  };
  if (!Object.prototype.hasOwnProperty.call(actions, p.action)) return { ok: false, error: 'ไม่รู้จักคำสั่งนี้' };
  try { return { ok: true, data: actions[p.action]() }; }
  catch (err) { return { ok: false, error: String((err && err.message) || err) }; }
}

/**
 * สคริปต์ทำงานด้วยสิทธิ์เจ้าของ จึงต้องจำกัดให้อ่านได้เฉพาะไฟล์ที่ใส่ไว้ในชีต
 * (หรือไฟล์ที่อยู่ในโฟลเดอร์ที่ใส่ไว้ในชีต) ไม่เช่นนั้นคนนอกจะขอไฟล์อื่นใน Drive ได้ด้วยการเดา ID
 */
const ALLOW_KEY = 'allow_v1';
function allowedIds_() {
  const cache = CacheService.getScriptCache();
  let s = null;
  try { s = cache.get(ALLOW_KEY); } catch (e) {}
  if (!s) {
    s = (getAll().match(/[-\w]{25,}/g) || []).join(',');
    try { cache.put(ALLOW_KEY, s, 120); } catch (e) {}
  }
  return s.split(',');
}
function isAllowed_(id) {
  id = String(id || '');
  if (!id) return false;
  const allow = allowedIds_();
  if (allow.indexOf(id) > -1) return true;
  let item;
  try { item = DriveApp.getFileById(id); }
  catch (e) { try { item = DriveApp.getFolderById(id); } catch (e2) { return false; } }
  let level = [item];
  for (let depth = 0; depth < 6 && level.length; depth++) {     // ไล่ขึ้นไปดูโฟลเดอร์แม่
    const next = [];
    for (let i = 0; i < level.length; i++) {
      const it = level[i].getParents();
      while (it.hasNext()) {
        const f = it.next();
        if (allow.indexOf(f.getId()) > -1) return true;
        next.push(f);
      }
    }
    level = next;
  }
  return false;
}
function assertAllowed_(id) {
  if (!isAllowed_(id)) throw new Error('ไฟล์นี้ไม่ได้อยู่ในรายการที่เผยแพร่บนเว็บ');
}

function getAll() {
  const cache = CacheService.getScriptCache();
  try { const hit = cache.get(CACHE_KEY); if (hit) return hit; } catch (e) {}
  const out = { cats: [], acts: [], slides: [], settings: {}, news: [], err: [] };
  try { out.cats = getCategories(); } catch (e) { out.err.push('หมวด: ' + e.message); }
  try { out.acts = getActivities(); } catch (e) { out.err.push('กิจกรรม: ' + e.message); }
  try { out.slides = getSlides(); } catch (e) { out.err.push('สไลด์: ' + e.message); }
  try { out.settings = getSettings(); } catch (e) { out.err.push('ตั้งค่า: ' + e.message); }
  try { out.news = getNews(out.acts); } catch (e) { out.err.push('ข่าว: ' + e.message); }
  const json = JSON.stringify(out, (k, v) => v instanceof Date ? formatDate(v) : v);
  try { if (!out.err.length) cache.put(CACHE_KEY, json, 60); } catch (e) {}
  return json;
}

function findSheet(name) {
  const ss = ss_();
  const norm = s => String(s).normalize('NFC').replace(/\s+/g, '').toLowerCase();
  const t = norm(name);
  return ss.getSheetByName(name)
    || ss.getSheets().filter(s => norm(s.getName()) === t)[0]
    || (name === SETTINGS_SHEET ? ss.getSheets().filter(s => /ตั้งค่า|setting/i.test(s.getName()))[0] : null)
    || null;
}

/** แยกลิงก์หลายอัน ในเซลล์เดียว (คั่นด้วยขึ้นบรรทัดใหม่ , ; หรือเว้นวรรค) + ลิงก์ที่แนบกับข้อความ */
function cellUrls(v, rich) {
  const out = [];
  String(v == null ? '' : v).split(/[\n\r,;\s]+/).forEach(t => {
    t = t.trim(); if (!t) return;
    if (/^[-\w]{25,}$/.test(t)) t = 'https://drive.google.com/file/d/' + t + '/view';
    if (/^(https?:|\/\/)|^[\w-]+(\.[\w-]+)+\//i.test(t)) { const u = normalizeUrl(t); if (u) out.push(u); }
  });
  try { rich.getRuns().forEach(r => { const u = normalizeUrl(r.getLinkUrl()); if (u) out.push(u); }); } catch (e) {}
  return out.filter((u, i) => out.indexOf(u) === i);
}

function getCategories() {
  const sh = findSheet(CATEGORY_SHEET);
  if (!sh) return [];
  const rg = sh.getDataRange(), data = rg.getValues();
  let rich = []; try { rich = rg.getRichTextValues(); } catch (e) {}
  let embeds = {};
  try { embeds = getEmbedsGrouped(); } catch (e) { Logger.log('embeds: ' + e); }
  let links = {};
  try { links = getLinksGrouped(); } catch (e) { Logger.log('links: ' + e); }
  const out = []; let cur = null;
  for (let i = 1; i < data.length; i++) {
    const r = data[i], rr = rich[i] || [];
    if (r[1]) {
      const n = parseInt(String(r[0]).replace(/\D/g, ''), 10) || 0;
      cur = { n: n, name: String(r[1]), desc: String(r[2] || ''), color: String(r[4] || '').trim(),
              images: [], docs: [], links: links[n] || [], embeds: embeds[n] || [] };
      out.push(cur);
    } else if (!cur) continue;               // แถวว่างก่อนหมวดแรก
    const imgUrls = cellUrls(r[3], rr[3]), docUrls = cellUrls(r[5], rr[5]);
   imgUrls.forEach(u => { if (/\/folders\//.test(u)) return; const x = toImageUrl(u); if (cur.images.indexOf(x) < 0) cur.images.push(x); });
    const add = (u, auto) => { if (!cur.docs.some(d => d.url === u)) cur.docs.push({ url: u, auto: auto }); };
    if (docUrls.length) docUrls.forEach(u => add(u, false));
    else imgUrls.filter(u => u.indexOf('drive.google.com') > -1).forEach(u => add(u, true));
  }
  return out.sort((a, b) => a.n - b.n);
}

/** ชื่อและชนิดของไฟล์/โฟลเดอร์ (ไม่โหลดเนื้อหา) */
function getFileInfo(urls) {
  return (urls || []).slice(0, 40).map(u => {
    u = String(u); let name = '', mime = '';
    try {
      const fm = u.match(/folders\/([-\w]{20,})/);
      if (fm) { assertAllowed_(fm[1]); name = DriveApp.getFolderById(fm[1]).getName(); mime = 'folder'; }
      else {
        const m = u.match(/\/d\/([-\w]{20,})/) || u.match(/[?&]id=([-\w]{20,})/);
        if (m) { assertAllowed_(m[1]); const f = DriveApp.getFileById(m[1]); name = f.getName(); mime = f.getMimeType(); }
      }
    } catch (e) {}
    return { name: name, mime: mime };
  });
}

function getLinksGrouped() {
  const sh = findSheet(LINK_SHEET);
  if (!sh) return {};
  const range = sh.getDataRange(), data = range.getValues();
  let rich = []; try { rich = range.getRichTextValues(); } catch (e) {}
  const nameToNum = {}, cs = findSheet(CATEGORY_SHEET);
  if (cs) cs.getDataRange().getValues().slice(1).forEach(r => {
    if (r[1]) nameToNum[String(r[1]).trim()] = parseInt(String(r[0]).replace(/\D/g, ''), 10);
  });
  const g = {};
  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0]).trim();
    let n = parseInt(key.replace(/\D/g, ''), 10);
    if (!n && nameToNum[key]) n = nameToNum[key];
    const name = String(data[i][1] || '').trim();
    let url = normalizeUrl(data[i][2]);
    if (!url && rich[i] && rich[i][2]) url = normalizeUrl(rich[i][2].getLinkUrl());
    if (!url && rich[i] && rich[i][1]) url = normalizeUrl(rich[i][1].getLinkUrl());
    if (!n || !name || !url) continue;
    (g[n] = g[n] || []).push({ name: name, url: url });
  }
  return g;
}

/** ---------- ภาพรวม / แดชบอร์ดฝัง (หลายรายการต่อหมวด) ---------- */
function getEmbedsGrouped() {
  const sh = findSheet(EMBED_SHEET);
  if (!sh) return {};
  const rg = sh.getDataRange(), data = rg.getValues();
  let rich = []; try { rich = rg.getRichTextValues(); } catch (e) {}
  const nameToNum = {}, cs = findSheet(CATEGORY_SHEET);
  if (cs) cs.getDataRange().getValues().slice(1).forEach(r => {
    if (r[1]) nameToNum[String(r[1]).trim()] = parseInt(String(r[0]).replace(/\D/g, ''), 10);
  });
  const g = {};
  for (let i = 1; i < data.length; i++) {
    const r = data[i], rr = rich[i] || [];
    if (r[5] === false) continue;
    const key = String(r[0]).trim();
    let n = parseInt(key.replace(/\D/g, ''), 10);
    if (!n && nameToNum[key]) n = nameToNum[key];
    const raw = String(r[2] == null ? '' : r[2]).trim();
    let url = '';
    const sm = raw.match(/src\s*=\s*["']([^"']+)["']/i);          // วางโค้ด <iframe ...> ทั้งก้อนได้
    if (sm) url = normalizeUrl(sm[1].replace(/&amp;/g, '&'));
    if (!url) url = cellUrls(r[2], rr[2])[0] || '';
    if (!url && rr[1]) { try { url = normalizeUrl(rr[1].getLinkUrl()); } catch (e) {} }
    if (!n || !url) continue;
    (g[n] = g[n] || []).push({
      name: String(r[1] || '').trim(), url: url,
      height: Math.min(2400, Math.max(240, Number(r[3]) || 640)),
      refresh: Math.max(0, Number(r[4]) || 0)
    });
  }
  return g;
}

/** อ่านไฟล์ HTML จาก Drive เพื่อแสดงในหน้าเว็บ (ไฟล์อื่นคืนค่า null) — แก้ไฟล์เดิมใน Drive แล้วหน้าเว็บเปลี่ยนตาม */
function getHtmlFile(url) {
  const m = String(url).match(/\/d\/([-\w]{20,})/) || String(url).match(/[?&]id=([-\w]{20,})/);
  if (!m) return null;
  assertAllowed_(m[1]);
  const f = DriveApp.getFileById(m[1]), mt = String(f.getMimeType()), nm = f.getName();
  if (mt.indexOf('html') < 0 && !/\.html?$/i.test(nm)) return null;
  if (f.getSize() > 8 * 1024 * 1024) throw new Error('ไฟล์ HTML ใหญ่เกิน 8MB');
  return { name: nm, html: f.getBlob().getDataAsString('UTF-8'), updated: f.getLastUpdated().getTime() };
}

function getActivities() {
  const sh = findSheet(ACTIVITY_SHEET);
  if (!sh) return [];
  const data = sh.getDataRange().getValues(), out = [];
  for (let i = 1; i < data.length; i++) {
    const r = data[i];
    if (!r[2] || r[6] === false) continue;
    out.push({
      row: i + 1, clicks: Number(r[7]) || 0,
      raw: r[0] instanceof Date ? r[0].getTime() : 0, date: formatDate(r[0]), tag: String(r[1] || ''),
      title: String(r[2]), desc: String(r[3] || ''), url: normalizeUrl(r[4]), image: toImageUrl(r[5])
    });
  }
  return out.sort((a, b) => b.raw - a.raw);
}

/** ---------- สไลด์ภาพกิจกรรม ---------- */
function getSlides() {
  const sh = findSheet(SLIDE_SHEET);
  if (!sh) return [];
  const rg = sh.getDataRange(), data = rg.getValues();
  let rich = []; try { rich = rg.getRichTextValues(); } catch (e) {}
  const out = [];
  for (let i = 1; i < data.length; i++) {
    const r = data[i], rr = rich[i] || [];
    if (r[5] === false) continue;
    const order = Number(r[0]) || 999;
    const base = { title: String(r[2] || ''), caption: String(r[3] || ''), url: normalizeUrl(r[4]) };
    cellUrls(r[1], rr[1]).forEach(u => {
      const fm = u.match(/folders\/([-\w]{20,})/);
      if (fm) folderImages_(fm[1]).forEach(x => out.push(Object.assign({ order: order, image: x }, base)));
      else out.push(Object.assign({ order: order, image: toImageUrl(u) }, base));
    });
  }
  return out.sort((a, b) => a.order - b.order).slice(0, 60);
}

/** รูปทั้งหมดในโฟลเดอร์ Drive (เรียงตามชื่อไฟล์ สูงสุด 40 รูป) */
function folderImages_(id) {
  const files = [];
  try {
    const it = DriveApp.getFolderById(id).getFiles();
    while (it.hasNext() && files.length < 40) {
      const f = it.next();
      if (String(f.getMimeType()).indexOf('image/') === 0) files.push(f);
    }
  } catch (e) { Logger.log('folder: ' + e); }
  return files.sort((a, b) => a.getName().localeCompare(b.getName(), 'th'))
    .map(f => 'https://lh3.googleusercontent.com/d/' + f.getId() + '=w2560');
}

function getNews(acts) {
  const sh = findSheet(NEWS_SHEET);
  let list = [];
  if (sh) list = sh.getDataRange().getValues().slice(1)
    .filter(r => String(r[0]).trim() && r[1] !== false).map(r => String(r[0]).trim());
  if (!list.length) list = (acts || []).slice(0, 5).map(a => 'กิจกรรม Green Somdej: ' + a.title + (a.date ? ' (' + a.date + ')' : ''));
  return list;
}

function getSettings() {
  const sh = findSheet(SETTINGS_SHEET);
  if (!sh) return {};
  const rg = sh.getDataRange(), vals = rg.getValues(), fx = rg.getFormulas();
  let rich = []; try { rich = rg.getRichTextValues(); } catch (e) {}
  const s = {};
  vals.forEach((row, i) => {
    const key = String(row[0] || '').replace(/\s+/g, '');
    if (!key) return;
    let v = '';
    for (let c = 1; c < row.length && !v; c++) {
      let x = row[c];
      if (x && typeof x === 'object' && !(x instanceof Date)) x = (x.getUrl && x.getUrl()) || '';
      x = String(x == null ? '' : x).trim();
      const m = String((fx[i] && fx[i][c]) || '').match(/IMAGE\(\s*"([^"]+)"/i);
      if (m) x = m[1];
      if (x && !/^(https?:|\/\/)|drive\.google|docs\.google|^[-\w]{25,}$/i.test(x)) x = '';
      if (!x) { try { const lk = rich[i][c].getLinkUrl(); if (lk) x = lk; } catch (e) {} }
      if (x) v = x;
    }
    if (!v) return;
    if (/โลโก้|logo/i.test(key)) s.logo = toImageUrl(v);
    else if (/หัวเว็บ|header|banner/i.test(key)) s.header = toImageUrl(v);
    else if (/หน้าเว็บ|พื้นหลัง|background|bg/i.test(key)) s.page = toImageUrl(v);
    else if (/มาสคอต|mascot/i.test(key)) s.mascot = toImageUrl(v);
  });
  return s;
}

/** นับผู้เข้าชม: เก็บในชีต "สถิติ" (สร้างอัตโนมัติ) A=วันที่ B=จำนวน */
const STATS_SHEET = 'สถิติ';
function recordVisit(count) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = ss_();
    let sh = ss.getSheetByName(STATS_SHEET);
    if (!sh) {
      sh = ss.insertSheet(STATS_SHEET);
      sh.getRange('A:A').setNumberFormat('@');
      sh.appendRow(['วันที่', 'จำนวนผู้เข้าชม']);
    }
    const tz = Session.getScriptTimeZone(), today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    const key = v => v instanceof Date ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : String(v).trim();
    let last = sh.getLastRow(), todayN = 0;
    if (last >= 2 && key(sh.getRange(last, 1).getValue()) === today) {
      todayN = Number(sh.getRange(last, 2).getValue()) || 0;
      if (count) sh.getRange(last, 2).setValue(++todayN);
    } else if (count) { sh.appendRow([today, 1]); todayN = 1; last = sh.getLastRow(); }
    let total = 0;
    last = sh.getLastRow();
    if (last >= 2) sh.getRange(2, 2, last - 1, 1).getValues().forEach(r => total += Number(r[0]) || 0);
    return { today: todayN, total: total };
  } finally { lock.releaseLock(); }
}

function formatDate(d) {
  return d instanceof Date ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'd MMM yyyy') : String(d || '');
}
function normalizeUrl(l) {
  if (!l) return ''; l = String(l).trim();
  if (!l || l === '#') return '';
  if (/^(https?:|mailto:|tel:)/i.test(l)) return l;
  return /^\/\//.test(l) ? 'https:' + l : 'https://' + l;
}
function toImageUrl(l) {
  if (!l) return ''; l = String(l).trim();
  if (/^[-\w]{25,}$/.test(l)) return 'https://lh3.googleusercontent.com/d/' + l + '=w2560';
  if (l.indexOf('drive.google.com') > -1 || l.indexOf('docs.google.com') > -1) {
    const m = l.match(/[-\w]{25,}/);
    if (m) return 'https://lh3.googleusercontent.com/d/' + m[0] + '=w2560';
  }
  return l;
}

/** อ่านไฟล์ Drive ส่งให้หน้าเว็บ (ไม่ต้องแชร์สาธารณะ) */
function getFileData(url) {
  const m = String(url).match(/\/d\/([-\w]{20,})/) || String(url).match(/[?&]id=([-\w]{20,})/);
  if (!m) throw new Error('ไม่พบรหัสไฟล์ในลิงก์');
  assertAllowed_(m[1]);
  const f = DriveApp.getFileById(m[1]), mt = f.getMimeType();
  let blob;
  if (mt.indexOf('application/vnd.google-apps') === 0) blob = f.getAs('application/pdf');
  else if (mt === 'application/pdf' || mt.indexOf('image/') === 0) {
    if (f.getSize() > 25 * 1024 * 1024) throw new Error('ไฟล์ใหญ่เกิน 25MB');
    blob = f.getBlob();
  } else throw new Error('ชนิดไฟล์ ' + mt + ' แสดงในหน้านี้ไม่ได้ (แนะนำแปลงเป็น PDF)');
  return { name: f.getName(), mime: blob.getContentType(), b64: Utilities.base64Encode(blob.getBytes()) };
}

/** รูปจาก Drive แบบ data URI (ไฟล์เล็กใช้ต้นฉบับ ไฟล์ใหญ่ย่อผ่าน thumbnail) */
function getImageData(id, w) {
  id = String(id);
  assertAllowed_(id);
  w = Math.min(4096, Math.max(1600, Number(w) || 2560));
  const f = DriveApp.getFileById(id), size = f.getSize();
  if (size <= 6 * 1024 * 1024) {                       // ไฟล์ไม่ใหญ่มาก: ใช้ต้นฉบับ คมชัดสุด
    const b = f.getBlob();
    return 'data:' + b.getContentType() + ';base64,' + Utilities.base64Encode(b.getBytes());
  }
  try {
    const r = UrlFetchApp.fetch('https://drive.google.com/thumbnail?id=' + id + '&sz=w' + w,
      { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
    if (r.getResponseCode() === 200) {
      const b = r.getBlob();
      return 'data:' + b.getContentType() + ';base64,' + Utilities.base64Encode(b.getBytes());
    }
  } catch (e) { Logger.log('thumb: ' + e); }
  if (size > 12 * 1024 * 1024) throw new Error('รูปใหญ่เกิน 12MB');
  const b2 = f.getBlob();
  return 'data:' + b2.getContentType() + ';base64,' + Utilities.base64Encode(b2.getBytes());
}

function listFolder(url) {
  const m = String(url).match(/folders\/([-\w]{20,})/);
  if (!m) throw new Error('ไม่พบรหัสโฟลเดอร์');
  assertAllowed_(m[1]);
  const root = DriveApp.getFolderById(m[1]), dirs = [], files = [];
  const fs = root.getFolders(), it = root.getFiles();
  while (fs.hasNext() && dirs.length < 50) { const f = fs.next(); dirs.push({ name: '📁 ' + f.getName(), url: f.getUrl() }); }
  while (it.hasNext() && files.length < 100) { const f = it.next(); files.push({ name: f.getName(), url: f.getUrl() }); }
  const cmp = (a, b) => a.name.localeCompare(b.name, 'th');
  return dirs.sort(cmp).concat(files.sort(cmp));
}

/** รันครั้งเดียวจากตัวแก้ไข เพื่ออนุญาตสิทธิ์ Drive/Sheet */
function authorizeAll() {
  Logger.log(ss_().getName()); DriveApp.getRootFolder(); UrlFetchApp.fetch('https://www.google.com'); CacheService.getScriptCache();
  Logger.log('อนุญาตสิทธิ์สำเร็จ');
}
function clearCache() { CacheService.getScriptCache().removeAll([CACHE_KEY, ALLOW_KEY]); }
function testAll() {
  const a = JSON.parse(getAll());
  Logger.log('หมวด ' + a.cats.length + ' | กิจกรรม ' + a.acts.length + ' | สไลด์ ' + (a.slides || []).length + ' | ข่าว ' + a.news.length + ' | err ' + a.err.join(','));
}
function testSettings() {
  ss_().getSheets().forEach(s => Logger.log('ชีต: [' + s.getName() + ']'));
  Logger.log('ผลอ่านค่า: ' + JSON.stringify(getSettings()));
  const sh = findSheet(SETTINGS_SHEET);
  if (!sh) { Logger.log('ไม่พบชีตการตั้งค่า'); return; }
  sh.getDataRange().getValues().forEach(r =>
    Logger.log(JSON.stringify(r.map(x => typeof x === 'object' ? '[object]' : String(x).slice(0, 70)))));
}
/** นับการคลิกการ์ดกิจกรรม: เก็บที่ชีต "กิจกรรม" คอลัมน์ H */
function recordClick(row) {
  row = Number(row);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = findSheet(ACTIVITY_SHEET);
    if (!sh || !(row >= 2) || row > sh.getLastRow()) return null;
    if (!sh.getRange(row, 3).getValue()) return null;       // ต้องเป็นแถวกิจกรรมจริง
    if (!sh.getRange(1, 8).getValue()) sh.getRange(1, 8).setValue('จำนวนคลิก');
    const c = sh.getRange(row, 8), n = (Number(c.getValue()) || 0) + 1;
    c.setValue(n);
    CacheService.getScriptCache().remove(CACHE_KEY);
    return n;
  } finally { lock.releaseLock(); }
}