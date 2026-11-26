/* Green Somdej — ระบบลงทะเบียนกิจกรรมสิ่งแวดล้อม (PWA) */
(function () {
  'use strict';

  const APP_VERSION = '2.5.3'; // ให้ตรงกับ ?v= ใน index.html และ sw.js
  const CONFIG = window.APP_CONFIG || {};
  const PRIVACY = Object.assign({ VERSION: '1', CONTROLLER: '-', CONTACT: '-', RETENTION_YEARS: 3 }, CONFIG.PRIVACY || {});
  const MIN_PW = 8; // ให้ตรงกับ MIN_PASSWORD_LENGTH ใน Api.gs
  const DEMO = !CONFIG.API_URL;
  const view = document.getElementById('view');

  /* ============================ ICONS ============================ */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="17" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    calCheck: '<rect x="3" y="4.5" width="18" height="17" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><path d="m9 15 2 2 4-4"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM20.5 14v.01M14 20.5h.01M17 20.5h3.5V17"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    logout: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17-5-5 5-5"/><path d="M5 12h12"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2A6.5 6.5 0 0 1 21.5 20"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',
    monitor: '<rect x="2" y="3.5" width="20" height="13" rx="2.5"/><path d="M8 21h8M12 16.5V21"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    chevR: '<path d="m9 6 6 6-6 6"/>',
    chevL: '<path d="m15 6-6 6 6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    install: '<path d="M12 3v11"/><path d="m7.5 9.5 4.5 4.5 4.5-4.5"/><rect x="3" y="15" width="18" height="6" rx="2"/>',
    book: '<path d="M2 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
    megaphone: '<path d="M3 11v3a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12"/>',
    present: '<path d="M3 4h18M5 4v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4"/><path d="m9 21 3-5 3 5"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.1 4M6.6 6.6A17.6 17.6 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    plusCal: '<rect x="3" y="4.5" width="18" height="17" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M12 13v5M9.5 15.5h5"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrowDown: '<path d="M12 4v15"/><path d="m6 13 6 6 6-6"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13a1.5 1.5 0 0 0 1.5 1.4h7A1.5 1.5 0 0 0 17 20l1-13"/><path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    scan: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="M4 12h16"/>',
    star2: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>'
  };
  const ic = (name, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  const TYPES = {
    'อบรม': { cls: 't-train', icon: 'book', color: '#4f46e5' },
    'กิจกรรมรณรงค์': { cls: 't-camp', icon: 'megaphone', color: '#f59e0b' },
    'กิจกรรมสิ่งแวดล้อม': { cls: 't-env', icon: 'leaf', color: '#10a37f' },
    'ประชุม/สัมมนา': { cls: 't-meet', icon: 'present', color: '#8b5cf6' }
  };
  const typeInfo = (t) => TYPES[t] || { cls: 't-other', icon: 'star', color: '#0d9488' };

  /* =========================== HELPERS =========================== */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LS = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };
  const MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const MON_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const DOW = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const DOW_S = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  const parseD = (s) => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const fmtD = (s) => { const d = parseD(s); return d ? `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear() + 543}` : '-'; };
  const fmtDShort = (s) => { const d = parseD(s); return d ? `${DOW_S[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}` : '-'; };
  const fmtDLong = (s) => { const d = parseD(s); return d ? `วัน${DOW[d.getDay()]}ที่ ${d.getDate()} ${MON_FULL[d.getMonth()]} ${d.getFullYear() + 543}` : '-'; };
  const timeLabel = (s) => (s && s.start ? `${s.start}–${s.end} น.` : 'ทั้งวัน');
  const dateRange = (a) => {
    const first = a.slots && a.slots.length ? a.slots[0].date : a.date;
    const last = a.lastDate || first;
    if (!first) return '-';
    if (first === last) return fmtD(first);
    const d1 = parseD(first), d2 = parseD(last);
    if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) return `${d1.getDate()}–${fmtD(last)}`;
    return `${fmtD(first)} – ${fmtD(last)}`;
  };
  const daysUntil = (s) => Math.round((parseD(s) - parseD(todayStr())) / 86400000);
  const relDay = (s) => { const n = daysUntil(s); return n === 0 ? 'วันนี้' : n === 1 ? 'พรุ่งนี้' : n > 1 ? `อีก ${n} วัน` : ''; };
  const initials = (name) => { const p = String(name || '?').trim().split(/\s+/); return (p[0] ? p[0][0] : '?') + (p[1] ? p[1][0] : ''); };
  const firstName = (name) => String(name || '').trim().split(/\s+/)[0] || '';
  const safeFile = (s) => String(s || 'file').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, '_').slice(0, 60);
  const actUrl = (id) => `${location.origin}${location.pathname}?act=${encodeURIComponent(id)}`;
  const slotOf = (a, id) => (a.slots || []).find((s) => String(s.id) === String(id));

  /* ประเภทผู้ใช้ — ให้ตรงกับ USER_TYPES ใน Api.gs */
  const USER_TYPES = [
    { id: 'staff', label: 'พนักงาน/เจ้าหน้าที่', short: 'พนักงาน', icon: 'shield', desc: 'บุคลากรของโรงพยาบาล ใช้รหัสพนักงาน 7 หลัก' },
    { id: 'public', label: 'ประชาชนทั่วไป', short: 'ประชาชน', icon: 'users', desc: 'ผู้ที่สนใจร่วมกิจกรรมสิ่งแวดล้อมของโรงพยาบาล' },
    { id: 'volunteer', label: 'จิตอาสาภายนอก รพ.', short: 'จิตอาสา', icon: 'leaf', desc: 'อาสาสมัคร กลุ่ม มูลนิธิ หรือชมรมจากภายนอก' },
    { id: 'intern', label: 'นักศึกษาฝึกงาน', short: 'นักศึกษา', icon: 'book', desc: 'นักศึกษาที่ฝึกงาน/ฝึกปฏิบัติในโรงพยาบาล' },
    { id: 'contractor', label: 'บริษัทผู้รับจ้าง', short: 'ผู้รับจ้าง', icon: 'award', desc: 'พนักงานของบริษัทที่รับจ้างงานในโรงพยาบาล' }
  ];
  const utInfo = (id) => USER_TYPES.find((t) => t.id === id) || USER_TYPES[0];
  const isExternalUser = (u) => !!(u && u.userType && u.userType !== 'staff');
  const ORG_LABEL = { volunteer: 'ชื่อกลุ่ม / มูลนิธิ / องค์กร (ถ้ามี)', intern: 'สถาบันการศึกษา', contractor: 'ชื่อบริษัท / ห้างร้าน' };
  const HOST_LABEL = { intern: 'หน่วยงานที่ฝึกงานในโรงพยาบาล', contractor: 'หน่วยงานที่ปฏิบัติงาน / ผู้ว่าจ้างใน รพ.' };
  /** ป้ายกลุ่มที่ลงทะเบียนได้ของกิจกรรม */
  const audienceHtml = (a, glass) => {
    const aud = a.audience && a.audience.length ? a.audience : ['staff'];
    if (glass === 'admin') {   // มุมมองผู้ดูแล: บอกการมองเห็นให้ครบ
      const ext = aud.filter((t) => t !== 'staff');
      return `<span class="pill ${a.isPublic ? 'pill-ok' : 'pill-soft'}">${ic(a.isPublic ? 'eye' : 'lock', 'ic-sm')} ${a.isPublic ? 'สาธารณะ' : 'ต้องเข้าสู่ระบบ'}</span>
        <span class="pill pill-info">${ic('users', 'ic-sm')} พนักงาน${ext.length ? ' + ' + ext.map((t) => esc(utInfo(t).short)).join(' · ') : ' เท่านั้น'}</span>`;
    }
    if (aud.length === USER_TYPES.length) return `<span class="pill ${glass ? 'pill-glass' : 'pill-info'}">${ic('users', 'ic-sm')} เปิดรับทุกกลุ่ม</span>`;
    if (aud.length === 1 && aud[0] === 'staff') return glass ? `<span class="pill pill-glass">${ic('shield', 'ic-sm')} เฉพาะพนักงาน</span>` : '';
    return `<span class="pill ${glass ? 'pill-glass' : 'pill-info'}">${ic('users', 'ic-sm')} ${aud.map((t) => esc(utInfo(t).short)).join(' · ')}</span>`;
  };
  /** ขั้นตอนสำหรับผู้ใช้ใหม่: ครั้งแรกต้องได้รับอนุมัติจากผู้ดูแลก่อน จึงลงทะเบียนเข้าร่วมกิจกรรมได้ (active = ขั้นที่กำลังอยู่) */
  const newUserStepsHtml = (active) => `
    <div class="tip warn" style="margin:12px 0 0">${ic('info')}<div><b>ผู้ใช้ใหม่ — ลงทะเบียนครั้งแรกได้ทันที แต่ต้องได้รับอนุมัติจากผู้ดูแลระบบ</b><br>
      สมัครแล้วเข้าสู่ระบบและลงทะเบียนกิจกรรมได้เลย การลงทะเบียนจะมีสถานะ <b>"รออนุมัติ"</b> จนกว่าผู้ดูแลตรวจสอบและอนุมัติบัญชี
      (แจ้งผลทางอีเมล) · อนุมัติครั้งเดียว ครั้งต่อไปลงทะเบียนได้ทันที</div></div>
    <div class="newuser-steps">
      <div class="${active === 1 ? 'on' : ''}"><b>1. สมัครใช้งาน</b>กรอกข้อมูลตามประเภท</div>
      <div class="${active === 2 ? 'on' : ''}"><b>2. ลงทะเบียนกิจกรรม</b>ได้ทันที · สถานะรออนุมัติ</div>
      <div class="${active === 3 ? 'on' : ''}"><b>3. ผู้ดูแลอนุมัติ</b>ยืนยันการลงทะเบียน · แจ้งทางอีเมล</div>
    </div>`;
  const isPendingUser = () => !!(state.user && state.user.status === 'pending');
  /** แถบแจ้งเตือนทุกหน้า สำหรับบัญชีที่ยังรออนุมัติ */
  function renderPendingBar() {
    let bar = document.getElementById('pending-bar');
    if (!bar) { bar = document.createElement('div'); bar.id = 'pending-bar'; view.parentNode.insertBefore(bar, view); }
    bar.innerHTML = isPendingUser() && state.route !== 'login' ? `<div class="tip warn pending-bar">${ic('clock')}<div>
      <b>บัญชีของคุณรอผู้ดูแลระบบอนุมัติ (ลงทะเบียนครั้งแรก)</b> — ลงทะเบียนกิจกรรมได้ตามปกติ แต่การลงทะเบียนจะยืนยันเมื่อได้รับอนุมัติแล้ว
      ${state.user.email ? `ระบบจะแจ้งผลไปที่ <b>${esc(state.user.email)}</b>` : 'หากรอนานกรุณาติดต่อผู้ดูแลระบบ'}</div></div>` : '';
  }
  /** อัปเดตสถานะบัญชีจากเซิร์ฟเวอร์ (เช่น เพิ่งได้รับอนุมัติ) — ไม่เกินนาทีละครั้ง */
  let lastMeCheck = 0;
  async function refreshMe() {
    if (!state.token || Date.now() - lastMeCheck < 60000) return;
    lastMeCheck = Date.now();
    const wasPending = isPendingUser();
    try {
      const u = await api('me');
      state.user = u; LS.set('gs_user', u);
      if (wasPending && u.status !== 'pending') {
        state.acts = null; state.history = null;
        toast('บัญชีของคุณได้รับการอนุมัติแล้ว — การลงทะเบียนได้รับการยืนยัน', 'ok');
        route();
      } else { renderChrome(); }
    } catch (e) { /* ข้าม */ }
  }
  /** วิธีเช็คอินหน้างานของผู้ใช้คนนี้ */
  const checkinHowHtml = () => {
    const u = state.user;
    if (!u) return 'กรอกรหัสพนักงาน (พนักงาน) หรืออีเมลที่ใช้สมัคร (บุคคลภายนอก)';
    return isExternalUser(u) ? `เลือก <b>บุคคลภายนอก</b> และกรอกอีเมล <b>${esc(u.email || u.loginId)}</b>` : `กรอกรหัสพนักงาน <b>${esc(u.employeeId)}</b>`;
  };

  /* ============================ STATE ============================ */
  const state = {
    token: LS.get('gs_token'),
    user: LS.get('gs_user'),
    depts: LS.get('gs_depts'),
    acts: null,
    history: null,
    current: null,
    route: 'home',
    returnTo: null,
    histFilter: 'all',
    typeFilter: 'all',
    search: ''
  };

  /* ============================= API ============================= */
  async function api(action, params) {
    const body = Object.assign({ action }, params || {});
    if (state.token && !('token' in body)) body.token = state.token;
    let res;
    try {
      if (DEMO) {
        res = await window.MockApi.call(action, body);
      } else {
        const r = await fetch(CONFIG.API_URL, { method: 'POST', body: JSON.stringify(body), redirect: 'follow' });
        res = await r.json();
      }
    } catch (e) {
      throw new Error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่');
    }
    if (!res || !res.ok) {
      const err = new Error((res && res.error) || 'เกิดข้อผิดพลาด');
      err.code = res && res.code;
      if (err.code === 'AUTH') { clearSession(); state.returnTo = location.hash; setTimeout(() => go('login'), 0); }
      throw err;
    }
    return res.data;
  }

  function setSession(token, user) {
    state.token = token; state.user = user;
    LS.set('gs_token', token); LS.set('gs_user', user);
    LS.set('gs_last_emp', user.loginId || user.employeeId); LS.set('gs_last_mode', isExternalUser(user) ? 'external' : 'staff');
    state.acts = null; state.history = null;
  }
  function clearSession() {
    state.token = null; state.user = null; state.history = null; state.acts = null; state.adminActs = null;
    adm.data = null; adm.reg = null;
    LS.del('gs_token'); LS.del('gs_user');
  }

  async function loadActs(force) {
    if (state.acts && !force) return state.acts;
    state.acts = await api('activities');
    return state.acts;
  }
  async function loadHistory(force) {
    if (!state.token) return null;
    if (state.history && !force) return state.history;
    state.history = await api('history');
    return state.history;
  }
  async function loadDepts() {
    if (state.depts && state.depts.length) return state.depts;
    state.depts = await api('departments');
    LS.set('gs_depts', state.depts);
    return state.depts;
  }
  function putAct(a) {
    if (state.acts) {
      const i = state.acts.findIndex((x) => x.id === a.id);
      if (i >= 0) state.acts[i] = a; else state.acts.push(a);
    }
    if (state.current && state.current.id === a.id) state.current = a;
  }

  /* ============================ ROUTER ============================ */
  const AUTH_ROUTES = { history: 1, profile: 1, admin: 1 };
  const go = (path) => { location.hash = '#/' + path; };

  function route() {
    const parts = (location.hash || '#/home').replace(/^#\/?/, '').split('/');
    let name = parts[0] || 'home';
    const arg = decodeURIComponent(parts.slice(1).join('/') || '');
    if (!ROUTES[name]) name = 'home';
    if (AUTH_ROUTES[name] && !state.token) { state.returnTo = location.hash; go('login'); return; }
    if (name === 'login' && state.token) { go('home'); return; }
    state.route = name;
    renderChrome();
    closeModal();
    view.classList.remove('view-enter'); void view.offsetWidth; view.classList.add('view-enter');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    ROUTES[name](arg).catch((e) => {
      view.innerHTML = emptyHtml('alert', 'โหลดข้อมูลไม่สำเร็จ', esc(e.message), `<button class="btn btn-primary" data-action="reload">${ic('history')} ลองใหม่</button>`);
    });
  }

  /* ============================ CHROME ============================ */
  const NAV_BASE = [
    { id: 'home', label: 'หน้าแรก', icon: 'home' },
    { id: 'activities', label: 'กิจกรรม', icon: 'calendar' },
    { id: 'history', label: 'ประวัติของฉัน', short: 'ประวัติ', icon: 'history' },
    { id: 'profile', label: 'บัญชี', icon: 'user' }
  ];

  function renderChrome() {
    renderPendingBar();
    const active = state.route === 'act' ? 'activities' : state.route;
    const NAV = state.user && state.user.isAdmin
      ? NAV_BASE.slice(0, 3).concat([{ id: 'admin', label: 'ผู้ดูแล', icon: 'shield' }], NAV_BASE.slice(3)) : NAV_BASE;
    const links = NAV.map((n) => `<a href="#/${n.id}" class="${active === n.id ? 'active' : ''}">${ic(n.icon)}<span>${n.label}</span></a>`).join('');
    document.getElementById('topnav').innerHTML = links;
    document.getElementById('tabbar').innerHTML = NAV.map((n) =>
      `<a href="#/${n.id}" class="${active === n.id ? 'active' : ''}">${ic(n.icon)}<span>${n.short || n.label}</span></a>`).join('');

    const dark = resolvedTheme() === 'dark';
    let right = '';
    if (!isStandalone()) {
      right += `<button class="icon-btn" data-action="install" title="ติดตั้งแอปลงเครื่อง" aria-label="ติดตั้งแอป">${ic('install')}</button>`;
    }
    right += `<button class="icon-btn" data-action="toggleTheme" title="สลับโหมดสว่าง/มืด" aria-label="สลับธีม">${ic(dark ? 'sun' : 'moon')}</button>`;
    if (state.user) {
      right += `<a class="user-chip" href="#/profile" title="${esc(state.user.name)}"><span class="avatar">${esc(initials(state.user.name))}</span><span>${esc(firstName(state.user.name))}</span></a>`;
    } else {
      right += `<a class="btn btn-primary btn-sm" href="#/login">${ic('user', 'ic-sm')} เข้าสู่ระบบ</a>`;
    }
    document.getElementById('topbar-right').innerHTML = right;
  }

  /* ========================== COMPONENTS ========================== */
  function emptyHtml(icon, title, sub, extra) {
    return `<div class="empty">${ic(icon)}<h3 style="color:var(--ink);font-size:17px">${title}</h3><p style="margin:4px 0 16px">${sub || ''}</p>${extra || ''}</div>`;
  }
  const skeletonGrid = (n) => `<div class="grid">${Array.from({ length: n || 3 }).map(() => '<div class="skeleton" style="height:290px"></div>').join('')}</div>`;

  function statusPill(a, glass) {
    const cls = glass ? 'pill pill-glass' : 'pill';
    if (a.isPast) return `<span class="${cls} ${glass ? '' : 'pill-soft'}">จัดไปแล้ว</span>`;
    if (a.regStatus === 'not_yet') return `<span class="${cls} ${glass ? '' : 'pill-warn'}"><span class="dot"></span>เปิดรับ ${fmtD(a.regStart)}</span>`;
    if (a.regStatus === 'closed') return `<span class="${cls} ${glass ? '' : 'pill-bad'}"><span class="dot"></span>ปิดรับแล้ว</span>`;
    return `<span class="${cls} ${glass ? '' : 'pill-ok'}"><span class="dot"></span>เปิดรับลงทะเบียน</span>`;
  }

  function seatsText(a) {
    const capSum = a.slots.reduce((s, x) => s + (x.cap || 0), 0);
    const allCapped = a.slots.every((x) => x.cap);
    return allCapped && capSum ? `${a.registeredCount}/${capSum} ที่นั่ง` : `${a.registeredCount} คนลงทะเบียน`;
  }

  function cardHtml(a) {
    const t = typeInfo(a.type);
    const first = a.slots[0] || { date: a.date };
    const d = parseD(first.date);
    const rel = relDay(first.date);
    const mine = a.myReg ? slotOf(a, a.myReg.slotId) : null;
    return `
      <article class="act-card" data-action="open" data-id="${esc(a.id)}" tabindex="0" role="link" aria-label="${esc(a.name)}">
        ${a.myReg ? `<span class="mine-ribbon ${a.myReg.pendingApproval ? 'is-pending' : ''}">${ic(a.myReg.pendingApproval ? 'clock' : 'check', 'ic-sm')} ${a.myReg.pendingApproval ? 'ลงทะเบียนแล้ว · รออนุมัติ' : 'ลงทะเบียนแล้ว'}</span>` : ''}
        <div class="act-cover ${t.cls}">
          ${ic(t.icon, 'cover-ic')}
          <div class="cover-top"><span class="pill pill-glass">${esc(a.type || 'กิจกรรม')}</span>${a.myReg ? '' : statusPill(a, true)}</div>
          ${!state.user && a.audience && !(a.audience.length === 1 && a.audience[0] === 'staff') ? `<div class="cover-aud">${audienceHtml(a, true)}</div>` : ''}
          <div class="cover-date">${d ? `<b>${d.getDate()}</b><span>${MON_FULL[d.getMonth()]} ${d.getFullYear() + 543}${rel ? ' · ' + rel : ''}</span>` : ''}</div>
        </div>
        <div class="act-body">
          <h3>${esc(a.name)}</h3>
          <div class="meta">${ic('calendar', 'ic-sm')}<span>${dateRange(a)} · ${a.slots.length} รอบ</span></div>
          ${mine ? `<div class="meta" style="color:var(--brand-600);font-weight:600">${ic('clock', 'ic-sm')}<span>รอบของคุณ: ${fmtDShort(mine.date)} ${timeLabel(mine)}</span></div>
                    ${a.requireCheckIn ? `<div class="meta">${a.myReg.checkedIn ? `<span class="pill pill-ok">${ic('check', 'ic-sm')} เช็คอินแล้ว · เข้าร่วมสำเร็จ</span>` : `<span class="pill pill-warn">${ic('scan', 'ic-sm')} รอเช็คอินหน้างาน</span>`}</div>` : ''}`
                 : (a.slots.length === 1 ? `<div class="meta">${ic('clock', 'ic-sm')}<span>${timeLabel(a.slots[0])}</span></div>` : '')}
          ${a.location ? `<div class="meta">${ic('pin', 'ic-sm')}<span>${esc(a.location)}</span></div>` : ''}
          ${quickRegHtml(a)}
          <div class="act-foot">
            <span class="people">${ic('users', 'ic-sm')} ${seatsText(a)}</span>
            <span style="display:flex;gap:6px">
              <button class="btn btn-ghost btn-sm" data-action="qr" data-id="${esc(a.id)}" title="QR Code ลงทะเบียน (ดาวน์โหลดได้)">${ic('qr', 'ic-sm')} QR</button>
              <span class="btn btn-primary btn-sm">${a.myReg ? 'ดูรายละเอียด' : (a.canRegister ? 'เลือกรอบ' : 'รายละเอียด')} ${ic('chevR', 'ic-sm')}</span>
            </span>
          </div>
        </div>
      </article>`;
  }

  /** ปุ่มลงทะเบียนด่วนบนการ์ด — ไม่ต้องเข้าไปหน้ารายละเอียด */
  function quickRegHtml(a) {
    if (a.myReg || !a.canRegister) return '';
    const avail = a.slots.filter((s) => !s.past && !s.full);
    if (!avail.length) return '';
    const shown = avail.length > 3 ? avail.slice(0, 2) : avail;
    const btn = (s) => `<button class="qbtn" data-action="quickReg" data-id="${esc(a.id)}" data-slot="${esc(s.id)}">
      ${a.slots.length === 1 ? `${ic('zap', 'ic-sm')} ลงทะเบียนทันที <small>${timeLabel(s)}</small>`
        : `<b>${fmtDShort(s.date)}</b><small>${timeLabel(s)}</small>`}</button>`;
    return `<div class="quick-reg">
      <span class="qlabel">${ic('zap', 'ic-sm')} ลงทะเบียนด่วน — แตะรอบที่ต้องการ</span>
      <div class="qbtns ${a.slots.length === 1 ? 'one' : ''}">${shown.map(btn).join('')}
        ${avail.length > shown.length ? `<button class="qbtn more" data-action="open" data-id="${esc(a.id)}"><b>+${avail.length - shown.length} รอบ</b><small>ดูทั้งหมด</small></button>` : ''}</div>
    </div>`;
  }

  async function quickRegister(el) {
    const a = findAct(el.dataset.id);
    if (!a) return;
    if (!state.token) {
      state.returnTo = '#/act/' + encodeURIComponent(a.id);
      toast('กรุณาเข้าสู่ระบบก่อน แล้วระบบจะพากลับมาที่กิจกรรมนี้ (ผู้ใช้ใหม่: สมัครและรอผู้ดูแลอนุมัติครั้งแรกก่อน)'); go('login'); return;
    }
    const html = el.innerHTML;
    el.closest('.qbtns').querySelectorAll('.qbtn').forEach((b) => { b.disabled = true; });
    el.innerHTML = '<span class="spinner" style="width:18px;height:18px"></span>';
    try {
      const res = await api('register', { activityId: a.id, slotId: el.dataset.slot });
      putAct(res.activity); state.current = res.activity; state.history = null;
      const card = el.closest('.act-card');
      if (card) card.outerHTML = cardHtml(res.activity);
      successModal(res.activity, slotOf(res.activity, el.dataset.slot), res.moved);
    } catch (e) {
      toast(e.message, 'err');
      if (document.body.contains(el)) {
        el.innerHTML = html;
        el.closest('.qbtns').querySelectorAll('.qbtn').forEach((b) => { b.disabled = false; });
      }
    }
  }

  function installCardHtml() {
    if (isStandalone()) return '';
    return `
      <div class="install-card">
        <img src="icons/icon-192.png" alt="" width="64" height="64">
        <div><h3>ติดตั้งแอป Green Somdej</h3><p>ใช้งานได้ทั้งคอมพิวเตอร์และมือถือ เปิดเร็ว ไม่ต้องจำลิงก์ มีไอคอนบนหน้าจอ</p></div>
        <button class="btn btn-primary" data-action="install">${ic('download')} ดาวน์โหลดแอป</button>
      </div>`;
  }

  /* ============================= HOME ============================= */
  const mascotHtml = (say) => `
    <div class="hero-mascot" aria-hidden="true">
      <div class="hero-mascot-say">${esc(say)}</div>
      <img src="mascot/leelawadee-wave.jpg" alt="" width="150" height="150">
      <small>น้องลีลาวดี</small>
    </div>`;

  async function renderHome() {
    const u = state.user;
    const hero = u ? `
      <section class="hero has-mascot">
        <svg class="hero-leaf" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1">${ICONS.leaf}</svg>
        ${mascotHtml('วันนี้มีกิจกรรมอะไรบ้างน้า~')}
        <span class="eyebrow">${ic('leaf', 'ic-sm')} ${esc(u.deptName || '')}</span>
        <h1>สวัสดี คุณ${esc(firstName(u.name))}</h1>
        <p>ร่วมกิจกรรมสิ่งแวดล้อม สะสมประวัติการเข้าร่วมได้ที่นี่ แตะเลือกรอบเวลา = ลงทะเบียนทันที</p>
        <div class="hero-stats" id="hero-stats">
          <div class="hero-stat"><b>–</b><span>เข้าร่วมแล้ว</span></div>
          <div class="hero-stat"><b>–</b><span>ปีนี้</span></div>
          <div class="hero-stat"><b>–</b><span>กำลังจะมาถึง</span></div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-white" href="#/activities">${ic('calendar')} ดูกิจกรรมทั้งหมด</a>
          <a class="btn btn-glass" href="#/history">${ic('history')} ประวัติของฉัน</a>
        </div>
      </section>` : `
      <section class="hero has-mascot">
        <svg class="hero-leaf" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1">${ICONS.leaf}</svg>
        ${mascotHtml('สวัสดีค่ะ! มาร่วมกิจกรรมกันนะคะ')}
        <span class="eyebrow">${ic('leaf', 'ic-sm')} Green Somdej Hospital</span>
        <h1>ร่วมสร้างโรงพยาบาลสีเขียว<br>ไปด้วยกัน</h1>
        <p>เข้าสู่ระบบครั้งเดียว แล้วแตะเลือกวันและเวลาเพื่อลงทะเบียนกิจกรรมได้ทันที พร้อมดูประวัติการเข้าร่วมกิจกรรมสิ่งแวดล้อมของคุณ</p>
        <div class="hero-actions">
          <a class="btn btn-white btn-lg" href="#/login">${ic('user')} เข้าสู่ระบบ</a>
          <a class="btn btn-white btn-lg" href="#/login/signup">${ic('users')} สมัครใช้งาน (พนักงาน / บุคคลภายนอก)</a>
          <a class="btn btn-glass btn-lg" href="#/activities">${ic('calendar')} ดูกิจกรรม</a>
        </div>
      </section>
      <section class="section">
        <div class="section-head"><div><h2>สมัครใช้งานตามกลุ่มของคุณ</h2><p>เลือกกลุ่มที่ตรงกับคุณ แล้วลงทะเบียนกิจกรรมได้ทันที</p></div></div>
        <div class="type-picks home-types">${USER_TYPES.map((t) => `
          <a class="type-pick" href="#/login/signup/${t.id}">
            <span class="tp-ic">${ic(t.icon)}</span>
            <span class="tp-txt"><b>${esc(t.label)}</b><small>${esc(t.desc)}</small></span>${ic('chevR', 'ic-sm')}
          </a>`).join('')}</div>
        ${newUserStepsHtml(0)}
      </section>`;

    view.innerHTML = `${hero}
      <section class="section" id="my-upcoming"></section>
      <section class="section">
        <div class="section-head"><div><h2>เปิดรับลงทะเบียนตอนนี้</h2><p>กิจกรรมที่กำลังจะจัดขึ้น</p></div>
          <a class="link-more" href="#/activities">ทั้งหมด ${ic('chevR', 'ic-sm')}</a></div>
        <div id="home-acts">${skeletonGrid(3)}</div>
      </section>
      <section class="section">${installCardHtml()}</section>
      <div class="footer">Green Somdej · ระบบลงทะเบียนกิจกรรมสิ่งแวดล้อม</div>`;

    if (u) {
      loadHistory().then((h) => {
        const el = document.getElementById('hero-stats');
        if (el && h) el.innerHTML = `
          <div class="hero-stat"><b>${h.stats.attended}</b><span>เข้าร่วมแล้ว</span></div>
          <div class="hero-stat"><b>${h.stats.thisYear}</b><span>ปีนี้</span></div>
          <div class="hero-stat"><b>${h.stats.upcoming}</b><span>กำลังจะมาถึง</span></div>`;
      }).catch(() => {});
    }

    const acts = await loadActs();
    if (state.route !== 'home') return;
    const mine = acts.filter((a) => a.myReg && !a.isPast);
    const upEl = document.getElementById('my-upcoming');
    if (mine.length) {
      upEl.innerHTML = `<div class="section-head"><div><h2>กิจกรรมที่คุณลงทะเบียนไว้</h2><p>อย่าลืมไปตามวันและเวลาที่เลือกนะ</p></div></div>
        <div class="hscroll">${mine.map((a) => {
          const s = slotOf(a, a.myReg.slotId) || a.slots[0];
          const t = typeInfo(a.type); const d = parseD(s.date);
          return `<div class="mini-reg" data-action="open" data-id="${esc(a.id)}">
            <div class="tl-date ${t.cls}"><b>${d.getDate()}</b><span>${MON[d.getMonth()]}</span></div>
            <div class="tl-main"><h4>${esc(a.name)}</h4>
              <div class="meta">${ic('clock', 'ic-sm')}<span>${fmtDShort(s.date)} · ${timeLabel(s)}</span></div>
              ${relDay(s.date) ? `<span class="pill pill-info" style="margin-top:4px">${relDay(s.date)}</span>` : ''}
            </div></div>`;
        }).join('')}</div>`;
    } else upEl.remove();

    const open = acts.filter((a) => !a.isPast).slice(0, 6);
    document.getElementById('home-acts').innerHTML = open.length
      ? `<div class="grid">${open.map(cardHtml).join('')}</div>`
      : emptyHtml('calendar', state.user ? 'ยังไม่มีกิจกรรมที่เปิดรับ' : 'ยังไม่มีกิจกรรมที่เปิดให้บุคคลทั่วไปเห็น', state.user ? (state.user.isAdmin ? 'ตั้งค่าว่าใครเห็นกิจกรรมใดได้ที่ปุ่มด้านล่าง' : 'กลับมาตรวจสอบใหม่เร็วๆ นี้') : 'กิจกรรมส่วนใหญ่แสดงเฉพาะผู้ที่เข้าสู่ระบบ — เข้าสู่ระบบเพื่อดูกิจกรรมทั้งหมดที่คุณเข้าร่วมได้',
          state.user ? (state.user.isAdmin ? `<a class="btn btn-primary" href="#/admin">ไปหน้าผู้ดูแล</a> <button class="btn btn-ghost" data-action="admVis">กำหนดการมองเห็นกิจกรรม</button>` : '') : '<a class="btn btn-primary" href="#/login">เข้าสู่ระบบ / สมัครใช้งาน</a>');
  }

  /* ========================== ACTIVITIES ========================== */
  async function renderActivities() {
    view.innerHTML = `
      <div class="section-head" style="align-items:center;flex-wrap:wrap">
        <div><h1 class="page-title">กิจกรรมที่เปิดให้ลงทะเบียน</h1><p class="page-sub">แตะการ์ดเพื่อเลือกวันและเวลา หรือกดไอคอน QR เพื่อดาวน์โหลด QR Code ของกิจกรรม</p></div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0 18px">
        <div class="seg" id="type-seg"></div>
        <div class="input-wrap" style="flex:1;min-width:220px;max-width:360px;margin-left:auto">
          <input class="input" id="act-search" placeholder="ค้นหากิจกรรม / สถานที่" value="${esc(state.search)}" style="padding-left:40px">
          <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted)">${ic('search', 'ic-sm')}</span>
        </div>
      </div>
      <div id="act-list">${skeletonGrid(6)}</div>`;

    const acts = await loadActs();
    if (state.route !== 'activities') return;
    const types = Array.from(new Set(acts.map((a) => a.type).filter(Boolean)));
    const draw = () => {
      document.getElementById('type-seg').innerHTML = ['all'].concat(types).map((t) =>
        `<button class="${state.typeFilter === t ? 'on' : ''}" data-action="filterType" data-v="${esc(t)}">${t === 'all' ? 'ทั้งหมด' : esc(t)}</button>`).join('');
      const q = state.search.trim().toLowerCase();
      const list = acts.filter((a) => (state.typeFilter === 'all' || a.type === state.typeFilter) &&
        (!q || (a.name + ' ' + a.location + ' ' + a.description).toLowerCase().includes(q)));
      document.getElementById('act-list').innerHTML = list.length
        ? `<div class="grid">${list.map(cardHtml).join('')}</div>`
        : emptyHtml('search', 'ไม่พบกิจกรรม', state.user ? 'ลองเปลี่ยนคำค้นหาหรือประเภทกิจกรรม' : 'กิจกรรมบางรายการแสดงเฉพาะผู้ที่เข้าสู่ระบบ', state.user ? '' : '<a class="btn btn-primary" href="#/login">เข้าสู่ระบบ</a>');
    };
    state.redrawActs = draw;
    draw();
    document.getElementById('act-search').addEventListener('input', (e) => { state.search = e.target.value; draw(); });
  }

  /* ============================ DETAIL ============================ */
  async function renderDetail(id) {
    const cached = state.acts && state.acts.find((a) => a.id === id);
    if (cached) drawDetail(cached);
    else view.innerHTML = '<div class="skeleton" style="height:220px"></div><div class="skeleton" style="height:320px;margin-top:20px"></div>';
    let a;
    try { a = await api('activity', { id }); } catch (e) {
      if (state.route !== 'act') return;
      if (e.code === 'LOGIN_REQUIRED') {
        state.returnTo = location.hash;
        view.innerHTML = emptyHtml('lock', 'กรุณาเข้าสู่ระบบเพื่อดูกิจกรรมนี้', esc(e.message),
          `<a class="btn btn-primary" href="#/login">เข้าสู่ระบบ / สมัครใช้งาน</a> <a class="btn btn-ghost" href="#/activities">กิจกรรมสาธารณะ</a>`);
        return;
      }
      if (e.code === 'NOT_FOUND') {
        view.innerHTML = emptyHtml('search', 'ไม่พบกิจกรรม', esc(e.message), `<a class="btn btn-primary" href="#/activities">ดูกิจกรรมที่เข้าร่วมได้</a>`);
        return;
      }
      throw e;
    }
    if (state.route !== 'act') return;
    putAct(a);
    drawDetail(a);
  }

  function drawDetail(a) {
    state.current = a;
    const t = typeInfo(a.type);
    view.innerHTML = `
      <a class="back" href="#/activities">${ic('chevL', 'ic-sm')} กิจกรรมทั้งหมด</a>
      <section class="detail-hero ${t.cls}">
        ${ic(t.icon, 'cover-ic')}
        <div class="chips">
          <span class="pill pill-glass">${ic(t.icon, 'ic-sm')} ${esc(a.type || 'กิจกรรม')}</span>
          ${statusPill(a, true)}
          ${a.requireCheckIn ? (state.user && state.user.isAdmin
            ? `<button class="btn btn-glass btn-sm" data-action="admCiQr" data-id="${esc(a.id)}" title="เปิด/ดาวน์โหลด QR เช็คอินหน้างาน">${ic('scan', 'ic-sm')} QR เช็คอินหน้างาน</button>`
            : `<span class="pill pill-glass">${ic('qr', 'ic-sm')} เช็คอินด้วย QR หน้างาน</span>`) : ''}
          ${audienceHtml(a, true)}
          ${state.user && state.user.isAdmin ? `<button class="btn btn-glass btn-sm" data-action="admVisOne" data-id="${esc(a.id)}">${ic(a.isPublic ? 'eye' : 'lock', 'ic-sm')} ${a.isPublic ? 'สาธารณะ' : 'ไม่แสดงต่อสาธารณะ'} · ตั้งค่าการมองเห็น</button>` : ''}
        </div>
        <h1>${esc(a.name)}</h1>
        <div class="chips" style="gap:16px">
          <span class="meta" style="color:#fff">${ic('calendar', 'ic-sm')} ${dateRange(a)}</span>
          ${a.location ? `<span class="meta" style="color:#fff">${ic('pin', 'ic-sm')} ${esc(a.location)}</span>` : ''}
          <span class="meta" style="color:#fff">${ic('users', 'ic-sm')} ${seatsText(a)}</span>
          <button class="btn btn-glass btn-sm" data-action="scrollQr">${ic('qr', 'ic-sm')} QR Code ลงทะเบียน</button>
        </div>
      </section>
      <div class="detail-grid">
        <div style="display:grid;gap:20px;min-width:0">
          <section class="card card-pad" id="slot-card">${slotCardHtml(a)}</section>
          <section class="card card-pad">
            <h2 class="card-title">${ic('info')} รายละเอียดกิจกรรม</h2>
            <ul class="info-list" style="margin-top:14px">
              <li><span class="ii">${ic('calendar')}</span><div><small>วันที่จัด</small><b>${dateRange(a)}</b> · ${a.slots.length} รอบ</div></li>
              ${a.location ? `<li><span class="ii">${ic('pin')}</span><div><small>สถานที่</small><b>${esc(a.location)}</b></div></li>` : ''}
              <li><span class="ii">${ic('calCheck')}</span><div><small>ช่วงเปิดรับลงทะเบียน</small><b>${regWindow(a)}</b></div></li>
              <li><span class="ii">${ic('user')}</span><div><small>ผู้ที่ลงทะเบียนได้</small><b>${(a.audience && a.audience.length ? a.audience : ['staff']).map((t) => esc(utInfo(t).label)).join(', ')}</b></div></li>
              <li><span class="ii">${ic('users')}</span><div><small>ผู้ลงทะเบียน</small><b>${seatsText(a)}</b></div></li>
            </ul>
            ${a.description ? `<p class="desc">${esc(a.description)}</p>` : ''}
          </section>
        </div>
        <aside class="card card-pad qr-card">${qrPanelHtml(a)}</aside>
      </div>`;
    drawQRInto(document.getElementById('qr-canvas'), actUrl(a.id));
  }

  function regWindow(a) {
    if (!a.regStart && !a.regEnd) return 'เปิดรับตลอดจนถึงวันจัดกิจกรรม';
    if (a.regStart && a.regEnd) return `${fmtD(a.regStart)} – ${fmtD(a.regEnd)}`;
    if (a.regStart) return `ตั้งแต่ ${fmtD(a.regStart)}`;
    return `ถึง ${fmtD(a.regEnd)}`;
  }

  function slotCardHtml(a) {
    const mine = a.myReg;
    const mySlot = mine ? slotOf(a, mine.slotId) : null;
    let notice = '';
    if (mine) {
      const canCancel = !mine.checkedIn && !(mySlot && mySlot.past);
      notice = `<div class="tip ok my-reg">
          <div style="display:flex;gap:10px;align-items:flex-start">${ic('calCheck')}<div>
            <b>คุณลงทะเบียนแล้ว</b>${mine.pendingApproval ? ' <span class="pill pill-warn">รอผู้ดูแลอนุมัติ</span>' : ''}<br>${mySlot ? `${fmtDLong(mySlot.date)} · ${timeLabel(mySlot)}` : esc(mine.slotLabel)}
            ${mine.checkedIn ? `<br>${ic('check', 'ic-sm')} เช็คอินแล้ว ${esc(mine.checkedInAt)}` : ''}
          </div></div>
          <span style="display:flex;gap:8px;flex-wrap:wrap">
            ${mySlot ? `<button class="btn btn-ghost btn-sm" data-action="ics">${ic('plusCal', 'ic-sm')} เพิ่มลงปฏิทิน</button>` : ''}
            ${canCancel ? `<button class="btn btn-danger btn-sm" data-action="cancel">${ic('x', 'ic-sm')} ยกเลิก</button>` : ''}
          </span>
        </div>`;
      if (canCancel && a.canRegister && a.slots.length > 1) notice += `<div class="tip">${ic('info')}<div>ต้องการเปลี่ยนรอบ? แตะรอบใหม่ที่ต้องการได้เลย</div></div>`;
    } else if (a.isPast) {
      notice = `<div class="tip warn">${ic('alert')}<div>กิจกรรมนี้จัดไปแล้ว</div></div>`;
    } else if (state.token && a.forMe === false) {
      notice = `<div class="tip warn">${ic('lock')}<div>กิจกรรมนี้เปิดรับเฉพาะ <b>${(a.audience || []).map((t) => esc(utInfo(t).label)).join(', ')}</b>
        — บัญชีของคุณ (${esc(utInfo(state.user && state.user.userType).label)}) จึงลงทะเบียนกิจกรรมนี้ไม่ได้</div></div>`;
    } else if (a.regStatus === 'not_yet') {
      notice = `<div class="tip warn">${ic('clock')}<div>ยังไม่เปิดรับลงทะเบียน — เปิดรับ ${regWindow(a)}</div></div>`;
    } else if (a.regStatus === 'closed') {
      notice = `<div class="tip warn">${ic('alert')}<div>ปิดรับลงทะเบียนแล้ว</div></div>`;
    } else if (!state.token) {
      notice = `<div class="tip my-reg"><div style="display:flex;gap:10px">${ic('lock')}<div>เข้าสู่ระบบก่อน แล้วแตะรอบที่ต้องการเพื่อลงทะเบียนได้ทันที</div></div>
        <button class="btn btn-primary btn-sm" data-action="gotoLogin">เข้าสู่ระบบ</button></div>${newUserStepsHtml(0)}`;
    }

    const byDate = {};
    a.slots.forEach((s) => { (byDate[s.date] = byDate[s.date] || []).push(s); });
    const days = Object.keys(byDate).sort().map((date) => {
      const d = parseD(date);
      return `<div class="slot-day">
        <h4><span class="day-num">${d ? d.getDate() : '?'}</span>${fmtDLong(date)} ${relDay(date) ? `<span class="pill pill-info">${relDay(date)}</span>` : ''}</h4>
        <div class="slots">${byDate[date].map((s) => slotBtnHtml(a, s)).join('')}</div>
      </div>`;
    }).join('');

    const pickable = a.canRegister && !(mine && mine.checkedIn) && a.slots.some((s) => !s.past && !s.full);
    const prompt = !mine && pickable
      ? `<div class="pick-prompt"><span class="pick-arrow">${ic('arrowDown')}</span>
          <div><b>โปรดเลือกรอบวันและเวลาที่ต้องการ</b><span>แตะปุ่มสีเขียวด้านล่าง 1 ครั้ง = ลงทะเบียนเรียบร้อย</span></div></div>` : '';
    return `<h2 class="card-title">${ic('clock')} เลือกวันและเวลา</h2>
      <p class="muted" style="margin:0;font-size:13.5px">แตะรอบที่ต้องการ = ลงทะเบียนทันที ไม่ต้องกรอกข้อมูลซ้ำ</p>
      ${checkinNoticeHtml(a)}${notice}${prompt}${days}`;
  }

  /** แจ้งเงื่อนไข: การเข้าร่วมจะสำเร็จเมื่อเช็คอินหน้างาน */
  function checkinNoticeHtml(a) {
    if (!a.requireCheckIn) return '';
    if (a.myReg && a.myReg.checkedIn) {
      return `<div class="tip ok">${ic('check')}<div><b>เข้าร่วมกิจกรรมสำเร็จ</b> — เช็คอินหน้างานแล้ว ${esc(a.myReg.checkedInAt || '')}</div></div>`;
    }
    return `<div class="tip checkin-note">${ic('scan')}<div><b>การเข้าร่วมกิจกรรมจะสำเร็จ เมื่อท่านเช็คอินหน้างาน</b><br>
      ในวันจัดกิจกรรม สแกน QR เช็คอินที่จุดลงทะเบียน แล้ว${checkinHowHtml()}
      ${a.myReg ? '<br><span class="pill pill-warn" style="margin-top:6px">สถานะ: ลงทะเบียนแล้ว · รอเช็คอินหน้างาน</span>' : ''}</div></div>`;
  }

  function slotBtnHtml(a, s) {
    const isMine = !!a.myReg && String(a.myReg.slotId) === String(s.id);
    const locked = a.myReg && a.myReg.checkedIn;
    const disabled = !isMine && (s.past || s.full || !a.canRegister || locked);
    const pct = s.cap ? Math.min(100, Math.round((s.count / s.cap) * 100)) : 0;
    let seats;
    if (s.past) seats = 'รอบนี้ผ่านไปแล้ว';
    else if (s.cap) seats = s.full ? 'เต็มแล้ว' : `เหลือ ${s.cap - s.count} ที่ · ${s.count}/${s.cap}`;
    else seats = `${s.count} คน · ไม่จำกัดจำนวน`;
    let cta;
    if (isMine) cta = `${ic('check', 'ic-sm')} ลงทะเบียนรอบนี้แล้ว`;
    else if (s.past) cta = 'ผ่านไปแล้ว';
    else if (s.full) cta = 'เต็มแล้ว';
    else if (!a.canRegister || locked) cta = 'ไม่เปิดรับ';
    else cta = `${a.myReg ? 'เปลี่ยนมารอบนี้' : 'แตะเพื่อลงทะเบียน'} ${ic('chevR', 'ic-sm')}`;
    return `<button class="slot ${isMine ? 'mine' : ''} ${disabled ? '' : 'open'}" data-action="slot" data-slot="${esc(s.id)}" ${disabled ? 'disabled' : ''} aria-pressed="${isMine ? 'true' : 'false'}">
      <span class="time">${timeLabel(s)}</span>
      <span class="seats">${seats}</span>
      ${s.cap ? `<span class="bar"><i style="width:${pct}%"></i></span>` : ''}
      <span class="slot-cta">${cta}</span>
    </button>`;
  }

  function qrPanelHtml(a) {
    return `<h2 class="card-title" style="justify-content:center">${ic('qr')} QR Code ลงทะเบียน</h2>
      <p class="muted" style="margin:0;font-size:13.5px">สแกนเพื่อเปิดหน้าลงทะเบียนกิจกรรมนี้ เหมาะสำหรับติดประกาศหรือส่งต่อ</p>
      <div class="qr-frame"><canvas id="qr-canvas" width="600" height="600" aria-label="QR Code"></canvas></div>
      <div class="qr-url">${esc(actUrl(a.id))}</div>
      <div class="qr-actions">
        <button class="btn btn-primary full" data-action="downloadQr">${ic('download')} ดาวน์โหลด QR (PNG HD)</button>
        <button class="btn btn-ghost" data-action="poster">${ic('image')} โปสเตอร์</button>
        <button class="btn btn-ghost" data-action="copyLink">${ic('copy')} คัดลอกลิงก์</button>
        ${navigator.share ? `<button class="btn btn-ghost full" data-action="share">${ic('share')} แชร์</button>` : ''}
        ${a.requireCheckIn && state.user && state.user.isAdmin ? `<button class="btn btn-ghost full" data-action="admCiQr" data-id="${esc(a.id)}">${ic('scan')} QR เช็คอินหน้างาน (แอดมิน)</button>` : ''}
      </div>`;
  }

  async function onSlot(btn) {
    const a = state.current;
    if (!a) return;
    const slotId = btn.dataset.slot;
    const s = slotOf(a, slotId);
    if (!state.token) { state.returnTo = location.hash; toast('กรุณาเข้าสู่ระบบก่อนลงทะเบียน (ผู้ใช้ใหม่: สมัครและรอผู้ดูแลอนุมัติครั้งแรกก่อน)'); go('login'); return; }
    if (a.myReg && String(a.myReg.slotId) === String(slotId)) return;
    if (a.myReg) {
      const old = slotOf(a, a.myReg.slotId);
      const ok = await confirmModal('เปลี่ยนรอบ?', `ย้ายจาก <b>${old ? fmtDShort(old.date) + ' ' + timeLabel(old) : 'รอบเดิม'}</b><br>ไปเป็น <b>${fmtDShort(s.date)} ${timeLabel(s)}</b>`, 'ยืนยันเปลี่ยนรอบ');
      if (!ok) return;
    }
    btn.classList.add('loading');
    btn.insertAdjacentHTML('beforeend', '<span class="spinner" style="position:absolute;right:12px;bottom:12px;width:18px;height:18px;color:var(--brand-600);z-index:1"></span>');
    try {
      const res = await api('register', { activityId: a.id, slotId });
      putAct(res.activity);
      state.history = null;
      document.getElementById('slot-card').innerHTML = slotCardHtml(res.activity);
      successModal(res.activity, slotOf(res.activity, slotId), res.moved);
    } catch (e) {
      toast(e.message, 'err');
      btn.classList.remove('loading');
      const sp = btn.querySelector('.spinner'); if (sp) sp.remove();
      if (/เต็ม|ผ่านไปแล้ว/.test(e.message)) renderDetail(a.id);
    }
  }

  async function onCancel() {
    const a = state.current;
    const s = slotOf(a, a.myReg.slotId);
    const ok = await confirmModal('ยกเลิกการลงทะเบียน?', `${esc(a.name)}<br><b>${s ? fmtDLong(s.date) + ' · ' + timeLabel(s) : ''}</b>`, 'ยืนยันยกเลิก', true);
    if (!ok) return;
    try {
      const res = await api('cancel', { activityId: a.id });
      putAct(res.activity); state.history = null;
      document.getElementById('slot-card').innerHTML = slotCardHtml(res.activity);
      toast('ยกเลิกการลงทะเบียนแล้ว', 'ok');
    } catch (e) { toast(e.message, 'err'); }
  }

  function successModal(a, s, moved) {
    openModal(`
      <div style="text-align:center">
        <div class="success-ic">${ic('check')}</div>
        <h3>${moved ? 'เปลี่ยนรอบเรียบร้อย' : (a.myReg && a.myReg.pendingApproval ? 'ลงทะเบียนแล้ว — รออนุมัติ' : 'ลงทะเบียนสำเร็จ!')}</h3>
        <p style="margin:6px 0 0"><b>${esc(a.name)}</b></p>
        <p class="muted" style="margin:6px 0 0">${s ? `${fmtDLong(s.date)}<br>${timeLabel(s)}` : ''}${a.location ? `<br>${esc(a.location)}` : ''}</p>
        ${a.myReg && a.myReg.pendingApproval ? `<div class="tip warn" style="text-align:left">${ic('clock')}<div><b>ลงทะเบียนครั้งแรก — รอผู้ดูแลระบบอนุมัติ</b><br>
          บันทึกการลงทะเบียนของคุณแล้ว และจะยืนยันเมื่อผู้ดูแลอนุมัติบัญชี${state.user && state.user.email ? ` ระบบจะแจ้งผลไปที่ <b>${esc(state.user.email)}</b>` : ''}
          · หากไม่อนุมัติ การลงทะเบียนนี้จะถูกยกเลิก</div></div>` : ''}
        ${a.requireCheckIn ? `<div class="tip checkin-note" style="text-align:left">${ic('scan')}<div><b>การเข้าร่วมกิจกรรมจะสำเร็จ เมื่อท่านเช็คอินหน้างาน</b><br>
          วันงานให้สแกน QR เช็คอินที่จุดลงทะเบียน แล้ว${checkinHowHtml()}</div></div>` : ''}
        <div style="display:grid;gap:8px;margin-top:20px">
          <button class="btn btn-primary" data-action="ics">${ic('plusCal')} เพิ่มลงปฏิทิน</button>
          <a class="btn btn-ghost" href="#/history">${ic('history')} ดูประวัติของฉัน</a>
          <button class="btn btn-ghost" data-action="closeModal">ปิด</button>
        </div>
      </div>`);
  }

  function downloadIcs() {
    const a = state.current; if (!a || !a.myReg) return;
    const s = slotOf(a, a.myReg.slotId); if (!s) return;
    const d = s.date.replace(/-/g, '');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Green Somdej//Activity//TH', 'BEGIN:VEVENT',
      `UID:${a.id}-${s.id}@green-somdej`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`];
    if (s.start) {
      lines.push(`DTSTART:${d}T${s.start.replace(':', '')}00`, `DTEND:${d}T${s.end.replace(':', '')}00`);
    } else {
      const nd = parseD(s.date); nd.setDate(nd.getDate() + 1);
      lines.push(`DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${nd.getFullYear()}${pad(nd.getMonth() + 1)}${pad(nd.getDate())}`);
    }
    const icsEsc = (v) => String(v || '').replace(/[\\;,]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
    lines.push(`SUMMARY:${icsEsc(a.name)}`, `LOCATION:${icsEsc(a.location)}`, `DESCRIPTION:${icsEsc(actUrl(a.id))}`,
      'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Reminder', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR');
    saveBlob(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }), `${safeFile(a.name)}.ics`);
  }

  /* ============================== QR ============================== */
  const logoImg = new Image();
  const logoReady = new Promise((res) => { logoImg.onload = res; logoImg.onerror = res; });
  logoImg.src = 'icons/icon-512.png';

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  /** วาด QR ลงแคนวาส ความละเอียดสูง (ค่าเริ่มต้น 1200px) พร้อมโลโก้ตรงกลาง */
  function renderQR(canvas, text, size) {
    if (!window.qrcode) throw new Error('โหลดตัวสร้าง QR ไม่สำเร็จ');
    const q = window.qrcode(0, 'H'); q.addData(text); q.make();
    const n = q.getModuleCount(); const quiet = 3;
    const cell = Math.max(2, Math.floor(size / (n + quiet * 2)));
    const dim = cell * (n + quiet * 2);
    canvas.width = dim; canvas.height = dim;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = '#053b33';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (q.isDark(r, c)) ctx.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell);
    }
    if (logoImg.naturalWidth) {
      const lg = Math.round(n * 0.2) * cell; const x = Math.round((dim - lg) / 2); const padL = cell;
      ctx.fillStyle = '#fff'; roundRect(ctx, x - padL, x - padL, lg + padL * 2, lg + padL * 2, lg * 0.28); ctx.fill();
      ctx.save(); roundRect(ctx, x, x, lg, lg, lg * 0.24); ctx.clip(); ctx.drawImage(logoImg, x, x, lg, lg); ctx.restore();
    }
    return canvas;
  }
  async function drawQRInto(canvas, text) {
    if (!canvas) return;
    await logoReady;
    try { renderQR(canvas, text, 1200); } catch (e) { toast(e.message, 'err'); }
  }

  function saveBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  const canvasToBlob = (c) => new Promise((res) => c.toBlob(res, 'image/png'));

  async function downloadQr(a) {
    await logoReady;
    const c = renderQR(document.createElement('canvas'), actUrl(a.id), 1600);
    saveBlob(await canvasToBlob(c), `QR_${safeFile(a.name)}.png`);
    toast('ดาวน์โหลด QR Code แล้ว', 'ok');
  }

  function wrapText(ctx, text, maxW) {
    let tokens;
    if (window.Intl && Intl.Segmenter) tokens = Array.from(new Intl.Segmenter('th', { granularity: 'word' }).segment(text), (s) => s.segment);
    else tokens = Array.from(text);
    const lines = []; let line = '';
    tokens.forEach((tk) => {
      const test = line + tk;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line.trim()); line = tk.trimStart(); } else line = test;
    });
    if (line.trim()) lines.push(line.trim());
    return lines;
  }

  /* ===================== โปสเตอร์ประชาสัมพันธ์ ===================== */
  // พรีเซ็นเตอร์: น้องลีลาวดี (เปลี่ยนรูปได้ที่ docs/mascot/)
  const MASCOT_SRC = CONFIG.MASCOT_URL || 'mascot/leelawadee-main.jpg';
  const MASCOT_MSG = 'มาร่วมกิจกรรม\nด้วยกันนะคะ!';
  const mascotImg = new Image();
  const mascotReady = new Promise((res) => { mascotImg.onload = res; mascotImg.onerror = res; });
  mascotImg.src = MASCOT_SRC;
  const PF = '"IBM Plex Sans Thai", "Noto Sans Thai", sans-serif';

  async function posterAssets() {
    await Promise.all([logoReady, mascotReady]);
    try { await Promise.all([400, 500, 600, 700].map((w) => document.fonts.load(`${w} 40px ${PF}`))); } catch (e) { /* ignore */ }
  }

  const circle = (ctx, x, y, r, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };

  /** ดอกลีลาวดีเล็กๆ สำหรับตกแต่ง */
  function plumeria(ctx, x, y, r, rot, alpha) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.globalAlpha = alpha == null ? 1 : alpha;
    for (let i = 0; i < 5; i++) {
      ctx.save(); ctx.rotate((i * Math.PI * 2) / 5);
      const g = ctx.createLinearGradient(0, 0, 0, -r);
      g.addColorStop(0, '#ffd43b'); g.addColorStop(0.45, '#fff8dc'); g.addColorStop(1, '#ffffff');
      ctx.fillStyle = g; ctx.strokeStyle = 'rgba(214,170,40,.45)'; ctx.lineWidth = Math.max(1, r * 0.03);
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-r * 0.45, -r * 0.2, -r * 0.55, -r * 0.85, -r * 0.1, -r);
      ctx.bezierCurveTo(r * 0.3, -r * 1.05, r * 0.4, -r * 0.45, 0, 0);
      ctx.fill(); ctx.stroke(); ctx.restore();
    }
    circle(ctx, 0, 0, r * 0.14, '#f5b700');
    ctx.restore();
  }

  function leafShape(ctx, x, y, s, rot, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, 40);
    ctx.bezierCurveTo(-30, 12, -22, -28, 0, -40); ctx.bezierCurveTo(22, -28, 30, 12, 0, 40); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, 34); ctx.lineTo(0, -32); ctx.stroke();
    ctx.restore();
  }

  function shadowed(ctx, blur, offY, color, fn) {
    ctx.save(); ctx.shadowColor = color || 'rgba(5,59,51,.22)'; ctx.shadowBlur = blur; ctx.shadowOffsetY = offY; fn(); ctx.restore();
  }

  /** รูปน้องลีลาวดีในกรอบมุมโค้ง พร้อมขอบขาว */
  function drawMascotCard(ctx, x, y, w, h, r) {
    shadowed(ctx, 40, 16, 'rgba(5,59,51,.28)', () => { ctx.fillStyle = '#fff'; roundRect(ctx, x - 10, y - 10, w + 20, h + 20, r + 10); ctx.fill(); });
    ctx.save(); roundRect(ctx, x, y, w, h, r); ctx.clip();
    if (mascotImg.naturalWidth) {
      const ir = mascotImg.naturalWidth / mascotImg.naturalHeight, br = w / h;
      let sw = mascotImg.naturalWidth, sh = mascotImg.naturalHeight, sx = 0, sy = 0;
      if (ir > br) { sw = sh * br; sx = (mascotImg.naturalWidth - sw) / 2; } else { sh = sw / br; }
      ctx.drawImage(mascotImg, sx, sy, sw, sh, x, y, w, h);
    } else {
      const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#dff7ec'); g.addColorStop(1, '#b8ebd6');
      ctx.fillStyle = g; ctx.fillRect(x, y, w, h); plumeria(ctx, x + w / 2, y + h / 2, Math.min(w, h) * 0.3, 0.2);
    }
    ctx.restore();
  }

  /** กล่องคำพูดของพรีเซ็นเตอร์ (หางชี้ไปที่ tx,ty) */
  function speechBubble(ctx, x, y, w, h, tx, ty, text, size) {
    shadowed(ctx, 24, 10, 'rgba(5,59,51,.22)', () => {
      ctx.fillStyle = '#fff'; roundRect(ctx, x, y, w, h, h * 0.3); ctx.fill();
      const bx = Math.min(Math.max(tx, x + 50), x + w - 50);
      ctx.beginPath(); ctx.moveTo(bx - 26, y + h - 2); ctx.lineTo(tx, ty); ctx.lineTo(bx + 26, y + h - 2); ctx.closePath(); ctx.fill();
    });
    ctx.strokeStyle = '#34c79a'; ctx.lineWidth = 4; roundRect(ctx, x + 8, y + 8, w - 16, h - 16, h * 0.26); ctx.stroke();
    ctx.fillStyle = '#0b6b55'; ctx.font = `700 ${size}px ${PF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const lines = [];
    String(text || '').split('\n').forEach((ln) => wrapText(ctx, ln, w - 60).forEach((l) => lines.push(l)));
    const shown = lines.slice(0, 3); const lh = size * 1.3;
    shown.forEach((l, i) => ctx.fillText(l, x + w / 2, y + h / 2 + (i - (shown.length - 1) / 2) * lh));
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }

  function pill(ctx, x, y, text, size, bg, fg) {
    ctx.font = `600 ${size}px ${PF}`;
    const w = ctx.measureText(text).width + size * 1.6, h = size * 1.9;
    ctx.fillStyle = bg; roundRect(ctx, x, y, w, h, h / 2); ctx.fill();
    ctx.fillStyle = fg; ctx.textBaseline = 'middle'; ctx.fillText(text, x + size * 0.8, y + h / 2 + 1); ctx.textBaseline = 'alphabetic';
    return w;
  }

  function inviteText(a) {
    const t = (a.type || '').trim();
    if (!t || t === 'อื่นๆ') return 'ขอเชิญร่วมกิจกรรม';
    return 'ขอเชิญร่วม' + (t.startsWith('กิจกรรม') ? t : 'กิจกรรม' + t);
  }

  function slotLines(a, max) {
    if (a.slots.length <= max) return a.slots.map((s) => `${fmtDShort(s.date)} · ${timeLabel(s)}`);
    const days = new Set(a.slots.map((s) => s.date)).size;
    return [`${a.slots.length} รอบ ใน ${days} วัน — เลือกรอบที่สะดวกได้`];
  }

  function drawLogoHeader(ctx, x, y, s, dark) {
    if (logoImg.naturalWidth) { ctx.save(); roundRect(ctx, x, y, s, s, s * 0.26); ctx.clip(); ctx.drawImage(logoImg, x, y, s, s); ctx.restore(); }
    ctx.fillStyle = dark ? '#053b33' : '#fff';
    ctx.font = `700 ${s * 0.5}px ${PF}`; ctx.fillText('Green Somdej', x + s * 1.22, y + s * 0.5);
    ctx.fillStyle = dark ? '#5b6b66' : 'rgba(255,255,255,.85)';
    ctx.font = `500 ${s * 0.27}px ${PF}`; ctx.fillText('ร่วมสร้างโรงพยาบาลสีเขียวไปด้วยกัน', x + s * 1.22, y + s * 0.92);
  }

  /** โปสเตอร์แนวตั้ง A4 (1240×1754 ≈ 150dpi) สำหรับพิมพ์ติดบอร์ด */
  function posterA4(a, msg) {
    const W = 1240, H = 1754;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
    bg.addColorStop(0, '#e6fbf1'); bg.addColorStop(0.5, '#f4fcff'); bg.addColorStop(1, '#e3f7ec');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    circle(ctx, W - 60, 120, 300, 'rgba(52,199,154,.16)');
    circle(ctx, 40, 1080, 220, 'rgba(14,165,233,.08)');
    circle(ctx, W - 40, 1180, 170, 'rgba(245,183,0,.10)');
    leafShape(ctx, 1150, 420, 1.3, 0.6, 'rgba(16,163,127,.18)');
    leafShape(ctx, 60, 760, 1.1, -0.5, 'rgba(16,163,127,.14)');
    plumeria(ctx, 1150, 300, 46, 0.3, 0.9);
    plumeria(ctx, 1080, 360, 28, 1.1, 0.8);
    plumeria(ctx, 90, 1180, 34, 0.7, 0.75);

    drawLogoHeader(ctx, 70, 60, 92, true);
    pill(ctx, 70, 196, inviteText(a), 30, '#0e8a6a', '#fff');

    ctx.fillStyle = '#053b33'; ctx.font = `700 76px ${PF}`;
    const title = wrapText(ctx, a.name, W - 160).slice(0, 3);
    title.forEach((l, i) => ctx.fillText(l, 70, 360 + i * 96));
    const titleEnd = 360 + (title.length - 1) * 96 + 30;

    // แถวพรีเซ็นเตอร์ + รายละเอียด
    const bottomY = 1236, heroH = 600;
    const heroY = Math.round(titleEnd + Math.max(30, (bottomY - titleEnd - heroH) / 2));
    const mW = 430, mH = 520, mX = W - 70 - mW, mY = heroY + 80;
    drawMascotCard(ctx, mX, mY, mW, mH, 40);
    speechBubble(ctx, mX - 120, heroY - 30, 400, 120, mX + 120, mY + 40, msg, 36);
    ctx.font = `600 22px ${PF}`;
    pill(ctx, mX + 20, mY + mH - 64, 'น้องลีลาวดี ชวนมาร่วมกิจกรรม', 22, 'rgba(5,59,51,.78)', '#fff');

    // การ์ดรายละเอียด
    const cX = 70, cY = heroY + 110, cW = mX - 120 - 40 - cX + 80, cH = heroH - 110;
    shadowed(ctx, 40, 14, 'rgba(5,59,51,.14)', () => { ctx.fillStyle = '#fff'; roundRect(ctx, cX, cY, cW, cH, 36); ctx.fill(); });
    let y = cY + 74;
    const row = (label, lines, color) => {
      circle(ctx, cX + 48, y - 10, 12, color);
      ctx.fillStyle = '#5b6b66'; ctx.font = `600 26px ${PF}`; ctx.fillText(label, cX + 76, y);
      y += 46; ctx.fillStyle = '#0d1f1a'; ctx.font = `600 32px ${PF}`;
      lines.forEach((l) => wrapText(ctx, l, cW - 110).slice(0, 2).forEach((ln) => { ctx.fillText(ln, cX + 76, y); y += 44; }));
      y += 18;
    };
    row('วันที่จัดกิจกรรม', [dateRange(a)], '#10a37f');
    row('รอบเวลา', slotLines(a, 3), '#0ea5e9');
    if (a.location && y < cY + cH - 90) row('สถานที่', [a.location], '#f59e0b');
    if (a.description && y < cY + cH - 60) {
      ctx.strokeStyle = '#e3ece8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cX + 40, y - 14); ctx.lineTo(cX + cW - 40, y - 14); ctx.stroke();
      y += 22; ctx.fillStyle = '#5b6b66'; ctx.font = `400 26px ${PF}`;
      const maxL = Math.max(1, Math.floor((cY + cH - 30 - y) / 38) + 1);
      const dl = wrapText(ctx, a.description.replace(/\s+/g, ' '), cW - 80);
      dl.slice(0, maxL).forEach((l, i) => ctx.fillText(i === maxL - 1 && dl.length > maxL ? l.replace(/.{0,2}$/, '…') : l, cX + 40, y + i * 38));
    }

    // กล่อง QR + 3 ขั้นตอน
    const qX = 70, qY = bottomY + 10, qW = W - 140, qH = 390;
    shadowed(ctx, 50, 18, 'rgba(5,59,51,.18)', () => { ctx.fillStyle = '#fff'; roundRect(ctx, qX, qY, qW, qH, 40); ctx.fill(); });
    ctx.fillStyle = '#053b33'; ctx.font = `700 40px ${PF}`; ctx.fillText('ลงทะเบียนง่ายๆ ใน 3 ขั้นตอน', qX + 50, qY + 82);
    ['สแกน QR Code ด้วยกล้องมือถือ', 'เข้าสู่ระบบ (รหัสพนักงาน หรืออีเมล)', 'แตะเลือกวันและเวลา = เสร็จเรียบร้อย!'].forEach((t, i) => {
      const sy = qY + 160 + i * 74;
      circle(ctx, qX + 76, sy - 11, 26, ['#10a37f', '#0ea5e9', '#f59e0b'][i]);
      ctx.fillStyle = '#fff'; ctx.font = `700 28px ${PF}`; ctx.textAlign = 'center'; ctx.fillText(String(i + 1), qX + 76, sy - 1); ctx.textAlign = 'left';
      ctx.fillStyle = '#0d1f1a'; ctx.font = `500 31px ${PF}`; ctx.fillText(t, qX + 122, sy);
    });
    const qs = 320, qx = qX + qW - qs - 40, qy = qY + 36;
    const g2 = ctx.createLinearGradient(qx, qy, qx + qs, qy + qs); g2.addColorStop(0, '#34c79a'); g2.addColorStop(1, '#0e8a6a');
    ctx.fillStyle = g2; roundRect(ctx, qx - 14, qy - 14, qs + 28, qs + 28, 30); ctx.fill();
    ctx.fillStyle = '#fff'; roundRect(ctx, qx - 4, qy - 4, qs + 8, qs + 8, 22); ctx.fill();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(renderQR(document.createElement('canvas'), actUrl(a.id), 1200), qx, qy, qs, qs);
    ctx.imageSmoothingEnabled = true;
    pill(ctx, qx + qs / 2 - 92, qY - 30, 'สแกนเลย!', 30, '#f59e0b', '#fff');

    // แถบท้าย
    const fg = ctx.createLinearGradient(0, H - 100, W, H); fg.addColorStop(0, '#053b33'); fg.addColorStop(1, '#0e8a6a');
    ctx.fillStyle = fg; ctx.fillRect(0, H - 96, W, 96);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = `600 26px ${PF}`;
    ctx.fillText('Green Somdej · ลงทะเบียนและดูประวัติกิจกรรมสิ่งแวดล้อมของคุณ', W / 2, H - 54);
    ctx.globalAlpha = 0.7; ctx.font = `400 19px ${PF}`; ctx.fillText(actUrl(a.id), W / 2, H - 22); ctx.globalAlpha = 1; ctx.textAlign = 'left';
    return c;
  }

  /** โปสเตอร์สี่เหลี่ยมจัตุรัส (1080×1080) สำหรับ LINE / Facebook */
  function posterSquare(a, msg) {
    const W = 1080, H = 1080;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#053b33'); bg.addColorStop(0.55, '#0e8a6a'); bg.addColorStop(1, '#0891b2');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    circle(ctx, W - 40, 60, 260, 'rgba(255,255,255,.08)');
    circle(ctx, 120, H - 40, 220, 'rgba(255,255,255,.06)');
    plumeria(ctx, W - 110, 120, 50, 0.4, 0.95);
    plumeria(ctx, W - 190, 190, 26, 1.2, 0.85);
    leafShape(ctx, W - 60, 300, 1, 0.5, 'rgba(255,255,255,.14)');

    drawLogoHeader(ctx, 56, 48, 76, false);
    pill(ctx, 56, 156, inviteText(a), 26, 'rgba(255,255,255,.18)', '#fff');

    ctx.fillStyle = '#fff'; ctx.font = `700 62px ${PF}`;
    const title = wrapText(ctx, a.name, W - 112).slice(0, 2);
    title.forEach((l, i) => ctx.fillText(l, 56, 290 + i * 78));
    let y = 290 + (title.length - 1) * 78 + 66;
    ctx.font = `500 30px ${PF}`; ctx.fillStyle = 'rgba(255,255,255,.95)';
    const info = [`วันที่  ${dateRange(a)}`].concat(slotLines(a, 2).map((s) => `เวลา  ${s}`));
    if (a.location) info.push(`สถานที่  ${a.location}`);
    info.slice(0, 4).forEach((t) => { ctx.fillText(wrapText(ctx, t, W - 112)[0], 56, y); y += 46; });

    const mW = 330, mH = 400, mX = 56, mY = H - mH - 56;
    drawMascotCard(ctx, mX, mY, mW, mH, 34);
    speechBubble(ctx, mX + mW - 20, mY - 10, 300, 112, mX + mW - 40, mY + 110, msg, 30);

    const qs = 300, qx = W - qs - 76, qy = H - qs - 116;
    shadowed(ctx, 40, 14, 'rgba(0,0,0,.25)', () => { ctx.fillStyle = '#fff'; roundRect(ctx, qx - 24, qy - 24, qs + 48, qs + 104, 32); ctx.fill(); });
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(renderQR(document.createElement('canvas'), actUrl(a.id), 1200), qx, qy, qs, qs);
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = '#0b6b55'; ctx.font = `700 30px ${PF}`; ctx.textAlign = 'center';
    ctx.fillText('สแกนลงทะเบียน', qx + qs / 2, qy + qs + 54); ctx.textAlign = 'left';
    return c;
  }

  const POSTER_FORMATS = {
    a4: { label: 'A4 แนวตั้ง', sub: 'พิมพ์ติดบอร์ด', build: posterA4, suffix: 'A4' },
    square: { label: 'สี่เหลี่ยม', sub: 'LINE / Facebook', build: posterSquare, suffix: 'โซเชียล' }
  };
  const poster = { a: null, fmt: 'a4', msg: MASCOT_MSG, blob: null, url: null, timer: null };

  async function openPosterModal(a) {
    poster.a = a; poster.blob = null;
    openModal(`
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div style="display:flex;gap:12px;align-items:center">
          <img src="mascot/leelawadee-wave.jpg" alt="" width="52" height="52" style="border-radius:50%;object-fit:cover;box-shadow:0 0 0 3px var(--brand-100)">
          <div><h3>โปสเตอร์ประชาสัมพันธ์</h3><p class="muted" style="margin:0;font-size:13.5px">พรีเซ็นเตอร์: น้องลีลาวดี · ${esc(a.name)}</p></div>
        </div>
        <button class="icon-btn" data-action="closeModal" aria-label="ปิด">${ic('x')}</button>
      </div>
      <div class="poster-tools">
        <div class="seg" id="poster-seg">${Object.entries(POSTER_FORMATS).map(([k, f]) =>
          `<button class="${poster.fmt === k ? 'on' : ''}" data-action="posterFmt" data-v="${k}">${f.label} <span class="muted">· ${f.sub}</span></button>`).join('')}</div>
        <div class="field" style="margin:0">
          <label for="poster-msg">คำพูดของน้องลีลาวดี</label>
          <textarea class="input" id="poster-msg" rows="2" maxlength="60" style="resize:none">${esc(poster.msg)}</textarea>
        </div>
      </div>
      <div class="poster-preview" id="poster-preview"><span class="spinner" style="color:var(--brand-500)"></span></div>
      <div class="qr-actions" style="margin-top:14px">
        <button class="btn btn-primary ${navigator.canShare ? '' : 'full'}" data-action="posterDownload">${ic('download')} ดาวน์โหลดโปสเตอร์ (PNG)</button>
        ${navigator.canShare ? `<button class="btn btn-ghost" data-action="posterShare">${ic('share')} แชร์ไป LINE / อื่นๆ</button>` : ''}
      </div>`, 'wide');
    document.getElementById('poster-msg').addEventListener('input', (e) => {
      poster.msg = e.target.value;
      clearTimeout(poster.timer); poster.timer = setTimeout(renderPosterPreview, 450);
    });
    renderPosterPreview();
  }

  async function renderPosterPreview() {
    const box = document.getElementById('poster-preview');
    if (!box || !poster.a) return;
    box.classList.add('busy');
    await posterAssets();
    try {
      const canvas = POSTER_FORMATS[poster.fmt].build(poster.a, poster.msg.trim() || MASCOT_MSG);
      poster.blob = await canvasToBlob(canvas);
      if (poster.url) URL.revokeObjectURL(poster.url);
      poster.url = URL.createObjectURL(poster.blob);
      if (!document.body.contains(box)) return;
      box.innerHTML = `<img src="${poster.url}" alt="ตัวอย่างโปสเตอร์" class="${poster.fmt}">`;
    } catch (e) {
      box.innerHTML = `<p class="muted">${esc(e.message)}</p>`;
    }
    box.classList.remove('busy');
  }

  const posterFileName = () => `โปสเตอร์_${POSTER_FORMATS[poster.fmt].suffix}_${safeFile(poster.a.name)}.png`;

  function openQrModal(a) {
    openModal(`
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div><h3>QR Code ลงทะเบียน</h3><p class="muted" style="margin:2px 0 0;font-size:14px">${esc(a.name)}</p></div>
        <button class="icon-btn" data-action="closeModal" aria-label="ปิด">${ic('x')}</button>
      </div>
      <div class="qr-frame"><canvas id="qr-modal-canvas" width="600" height="600"></canvas></div>
      <div class="qr-url" style="text-align:center">${esc(actUrl(a.id))}</div>
      <div class="qr-actions">
        <button class="btn btn-primary full" data-action="downloadQr" data-id="${esc(a.id)}">${ic('download')} ดาวน์โหลด QR (PNG HD)</button>
        <button class="btn btn-ghost" data-action="poster" data-id="${esc(a.id)}">${ic('image')} โปสเตอร์</button>
        <button class="btn btn-ghost" data-action="copyLink" data-id="${esc(a.id)}">${ic('copy')} คัดลอกลิงก์</button>
      </div>`);
    drawQRInto(document.getElementById('qr-modal-canvas'), actUrl(a.id));
  }

  /* ============================ HISTORY ============================ */
  async function renderHistory() {
    view.innerHTML = `<h1 class="page-title">ประวัติการเข้าร่วมกิจกรรม</h1><p class="page-sub">${esc(state.user.name)} · ${esc(state.user.deptName || '')}</p>
      <div class="stats" style="margin-top:20px">${Array.from({ length: 4 }).map(() => '<div class="skeleton" style="height:86px"></div>').join('')}</div>
      <div class="skeleton" style="height:300px;margin-top:20px"></div>`;
    const h = await loadHistory(true);
    if (state.route !== 'history') return;
    const st = h.stats;
    const counts = { all: h.items.length, upcoming: 0, attended: 0, missed: 0 };
    h.items.forEach((i) => { counts[i.status] = (counts[i.status] || 0) + 1; });
    const typeEntries = Object.entries(st.byType || {}).sort((x, y) => y[1] - x[1]);
    const maxType = Math.max(1, ...typeEntries.map((e) => e[1]));

    const draw = () => {
      const f = state.histFilter;
      const list = h.items.filter((i) => f === 'all' || i.status === f);
      document.getElementById('hist-seg').innerHTML = [['all', 'ทั้งหมด'], ['upcoming', 'กำลังจะมาถึง'], ['attended', 'เข้าร่วมแล้ว'], ['missed', 'ไม่ได้เช็คอิน']]
        .filter(([k]) => k === 'all' || counts[k])
        .map(([k, l]) => `<button class="${f === k ? 'on' : ''}" data-action="filterHist" data-v="${k}">${l} <span class="muted">${counts[k] || 0}</span></button>`).join('');
      document.getElementById('hist-list').innerHTML = list.length ? list.map(tlItemHtml).join('')
        : emptyHtml('history', 'ยังไม่มีประวัติในหมวดนี้', 'เริ่มลงทะเบียนกิจกรรมแรกของคุณได้เลย', '<a class="btn btn-primary" href="#/activities">ดูกิจกรรม</a>');
    };

    view.innerHTML = `
      <div class="section-head" style="align-items:center;flex-wrap:wrap">
        <div><h1 class="page-title">ประวัติการเข้าร่วมกิจกรรม</h1><p class="page-sub">${esc(h.user.name)} · ${esc(h.user.deptName || '')}${isExternalUser(h.user) ? '' : ` · รหัส ${esc(h.user.employeeId)}`}</p></div>
        <a class="btn btn-primary" href="#/activities">${ic('calendar')} ลงทะเบียนกิจกรรมเพิ่ม</a>
      </div>
      <div class="stats" style="margin-top:12px">
        <div class="stat"><span class="si si-green">${ic('award')}</span><div><b>${st.attended}</b><span>เข้าร่วมแล้ว</span></div></div>
        <div class="stat"><span class="si si-blue">${ic('calCheck')}</span><div><b>${st.thisYear}</b><span>เข้าร่วมปี ${new Date().getFullYear() + 543}</span></div></div>
        <div class="stat"><span class="si si-amber">${ic('clock')}</span><div><b>${st.upcoming}</b><span>กำลังจะมาถึง</span></div></div>
        <div class="stat"><span class="si si-violet">${ic('history')}</span><div><b>${st.total}</b><span>ลงทะเบียนทั้งหมด</span></div></div>
      </div>
      <div class="detail-grid hist-grid">
        <section>
          <div class="seg" id="hist-seg"></div>
          <div class="timeline" id="hist-list"></div>
        </section>
        <aside class="card card-pad">
          <h2 class="card-title">${ic('leaf')} ตามประเภทกิจกรรม</h2>
          ${typeEntries.length ? `<div class="type-bars">${typeEntries.map(([t, n]) => `
            <div class="type-bar"><span>${esc(t)}</span><span class="track"><i style="width:${Math.round(n / maxType * 100)}%;background:${typeInfo(t).color}"></i></span><b>${n}</b></div>`).join('')}</div>`
            : '<p class="muted" style="font-size:13.5px">ยังไม่มีกิจกรรมที่เข้าร่วมแล้ว</p>'}
          <div class="tip" style="margin-top:18px">${ic('info')}<div>${isExternalUser(h.user) ? 'รวมกิจกรรมที่ลงทะเบียนผ่านแอปนี้ด้วยบัญชีของคุณ' : 'รวมกิจกรรมที่ลงทะเบียนผ่านแอปนี้ หน้าเว็บเดิม และการลงทะเบียนหน้างาน โดยอ้างอิงรหัสพนักงาน'}</div></div>
        </aside>
      </div>`;
    draw();
    state.redrawHist = draw;
  }

  function tlItemHtml(i) {
    const t = typeInfo(i.type); const d = parseD(i.date);
    const pill = i.pendingApproval && !i.checkedIn ? '<span class="pill pill-warn">รอผู้ดูแลอนุมัติ</span>'
      : i.status === 'upcoming' ? `<span class="pill pill-info">${relDay(i.date) || 'ลงทะเบียนแล้ว'}</span>`
      : i.status === 'missed' ? '<span class="pill pill-bad">ไม่ได้เช็คอิน</span>'
      : `<span class="pill pill-ok">${ic('check', 'ic-sm')} ${i.checkedIn ? 'เช็คอินแล้ว' : 'เข้าร่วมแล้ว'}</span>`;
    const time = i.start ? `${i.start}–${i.end} น.` : (i.slotLabel && /\d{2}:\d{2}/.test(i.slotLabel) ? i.slotLabel.replace(/^\S+\s/, '') : '');
    return `<div class="tl-item" data-action="open" data-id="${esc(i.activityId)}">
      <div class="tl-date ${t.cls}"><b>${d ? d.getDate() : '-'}</b><span>${d ? MON[d.getMonth()] + ' ' + String(d.getFullYear() + 543).slice(2) : ''}</span></div>
      <div class="tl-main"><h4>${esc(i.activityName)}</h4>
        <div class="meta">${ic(t.icon, 'ic-sm')}<span>${esc(i.type || 'กิจกรรม')}</span>${time ? ` · ${ic('clock', 'ic-sm')}<span>${esc(time)}</span>` : ''}${i.location ? ` · ${ic('pin', 'ic-sm')}<span>${esc(i.location)}</span>` : ''}</div>
      </div>
      <div class="tl-side">${pill}
        ${i.evalUrl && i.status === 'attended' ? `<a class="btn btn-ghost btn-sm" href="${esc(i.evalUrl)}" target="_blank" rel="noopener" data-stop="1">${ic('star', 'ic-sm')} ประเมิน</a>` : ''}
      </div>
    </div>`;
  }

  /* ============================= ADMIN ============================= */
  const adm = { data: null, filter: 'upcoming', q: '', reg: null, regFilter: 'all', regSlot: 'all', regQ: '', ci: null };
  const statHtml = (icon, cls, n, label) => `<div class="stat"><span class="si ${cls}">${ic(icon)}</span><div><b>${n}</b><span>${label}</span></div></div>`;

  async function loadAdmin(force) {
    if (adm.data && !force) return adm.data;
    adm.data = await api('adminOverview');
    state.adminActs = adm.data.activities;
    return adm.data;
  }
  function putAdminAct(a) {
    if (!state.adminActs) return;
    const i = state.adminActs.findIndex((x) => x.id === a.id);
    if (i >= 0) state.adminActs[i] = Object.assign({}, state.adminActs[i], a); else state.adminActs.unshift(a);
  }

  function adminDenied() {
    view.innerHTML = emptyHtml('lock', 'สำหรับผู้ดูแลระบบเท่านั้น',
      `บัญชีที่เข้าสู่ระบบอยู่ (รหัสพนักงาน <b>${esc(state.user ? state.user.employeeId : '-')}</b>) ยังไม่มีสิทธิ์ผู้ดูแล<br>
       ให้เจ้าของระบบเพิ่มรหัสนี้ที่เมนู <b>"8) จัดการผู้ดูแลระบบ"</b> ใน Google Sheet แล้วกดปุ่มตรวจสอบอีกครั้ง`,
      '<button class="btn btn-primary" data-action="reload">ตรวจสอบสิทธิ์อีกครั้ง</button> <a class="btn btn-ghost" href="#/home">กลับหน้าแรก</a>');
  }

  async function renderAdmin(arg) {
    if (!state.user || !state.user.isAdmin) {
      // อาจเพิ่งได้รับสิทธิ์ — ตรวจสอบกับเซิร์ฟเวอร์อีกครั้ง
      view.innerHTML = '<div class="skeleton" style="height:140px"></div>';
      const u = await api('me');
      state.user = u; LS.set('gs_user', u); renderChrome();
      if (!u.isAdmin) { adminDenied(); return; }
    }
    try {
      const m = /^act\/(.+)$/.exec(arg || '');
      if (m) await renderAdminAct(m[1]); else await renderAdminHome();
    } catch (e) {
      if (e.code === 'FORBIDDEN') { state.user.isAdmin = false; LS.set('gs_user', state.user); renderChrome(); adminDenied(); return; }
      throw e;
    }
  }

  const adminHeadHtml = () => `
    <div class="section-head" style="align-items:center;flex-wrap:wrap">
      <div><span class="pill pill-info">${ic('shield', 'ic-sm')} ผู้ดูแลระบบ</span>
        <h1 class="page-title" style="margin-top:8px">จัดการกิจกรรม</h1>
        <p class="page-sub">เพิ่ม/แก้ไขกิจกรรม ดูรายชื่อผู้ลงทะเบียน เช็คอินแทน และดาวน์โหลด QR / โปสเตอร์</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-ghost" data-action="admPending">${ic('user')} ตรวจสอบบัญชีใหม่${adm.data && adm.data.stats.pendingUsers ? ` <span class="pill pill-warn" style="margin-left:4px">${adm.data.stats.pendingUsers}</span>` : ''}</button>
        <button class="btn btn-ghost btn-vis" data-action="admVis">${ic('eye')} กำหนดการมองเห็นกิจกรรม</button>
        <button class="btn btn-ghost" data-action="admAdmins">${ic('shield')} ผู้ดูแลระบบ</button>
        <button class="btn btn-primary" data-action="admNew">${ic('plus')} เพิ่มกิจกรรม</button>
      </div>
    </div>`;

  async function renderAdminHome() {
    view.innerHTML = `${adminHeadHtml()}<div class="stats" style="margin-top:12px">${Array.from({ length: 4 }).map(() => '<div class="skeleton" style="height:86px"></div>').join('')}</div>
      <div class="skeleton" style="height:360px;margin-top:20px"></div>`;
    const d = await loadAdmin(true);
    if (state.route !== 'admin') return;
    const st = d.stats; const by = Number(st.year) + 543;
    // กิจกรรมที่กำลังจะมาถึงแต่คนนอก/คนที่ยังไม่เข้าสู่ระบบมองไม่เห็นเลย → เตือนให้ตั้งค่า
    const hidden = d.activities.filter((a) => !a.isPast && !a.isPublic && (a.audience || ['staff']).length <= 1);
    view.innerHTML = `${adminHeadHtml()}
      ${hidden.length ? `<div class="tip warn vis-callout">${ic('eye')}<div><b>${hidden.length} กิจกรรมที่กำลังจะมาถึง เห็นได้เฉพาะพนักงานที่เข้าสู่ระบบ</b><br>
        คนที่ยังไม่เข้าสู่ระบบและบุคคลภายนอกจะเห็นว่า "ไม่มีกิจกรรมที่เปิด" — กดปุ่มเพื่อเลือกว่าจะให้กลุ่มใดเห็น หรือติ๊ก "สาธารณะ"</div>
        <button class="btn btn-primary btn-sm" data-action="admVis">${ic('eye', 'ic-sm')} กำหนดการมองเห็น</button></div>` : ''}
      <div class="stats" style="margin-top:12px">
        ${statHtml('calendar', 'si-green', st.activities, `กิจกรรมปี ${by}`)}
        ${statHtml('users', 'si-blue', st.registrations, `ลงทะเบียนปี ${by}`)}
        ${statHtml('check', 'si-amber', st.checkedIn, 'เช็คอินแล้ว')}
        ${statHtml('award', 'si-violet', st.people, 'ผู้เข้าร่วม (คน)')}
      </div>
      <div class="adm-toolbar">
        <div class="seg" id="adm-seg"></div>
        <div class="input-wrap adm-search">
          <input class="input" id="adm-search" placeholder="ค้นหาชื่อกิจกรรม / สถานที่" value="${esc(adm.q)}">
          <span class="search-ic">${ic('search', 'ic-sm')}</span>
        </div>
      </div>
      <div id="adm-list" class="adm-list"></div>`;
    const draw = () => {
      const acts = d.activities;
      const counts = { upcoming: acts.filter((a) => !a.isPast).length, past: acts.filter((a) => a.isPast).length, all: acts.length };
      document.getElementById('adm-seg').innerHTML = [['upcoming', 'กำลังจะมาถึง'], ['past', 'จัดไปแล้ว'], ['all', 'ทั้งหมด']]
        .map(([k, l]) => `<button class="${adm.filter === k ? 'on' : ''}" data-action="admFilter" data-v="${k}">${l} <span class="muted">${counts[k]}</span></button>`).join('');
      const q = adm.q.trim().toLowerCase();
      let list = acts.filter((a) => (adm.filter === 'all' || (adm.filter === 'past') === !!a.isPast) &&
        (!q || (a.name + ' ' + (a.location || '') + ' ' + (a.type || '')).toLowerCase().includes(q)));
      if (adm.filter === 'upcoming') list = list.slice().reverse();
      document.getElementById('adm-list').innerHTML = list.length ? list.map(admRowHtml).join('')
        : emptyHtml('calendar', 'ไม่พบกิจกรรม', adm.filter === 'upcoming' ? 'ยังไม่มีกิจกรรมที่กำลังจะมาถึง' : 'ลองเปลี่ยนตัวกรองหรือคำค้นหา',
          `<button class="btn btn-primary" data-action="admNew">${ic('plus')} เพิ่มกิจกรรม</button>`);
    };
    state.redrawAdmin = draw;
    draw();
    document.getElementById('adm-search').addEventListener('input', (e) => { adm.q = e.target.value; draw(); });
  }

  function admRowHtml(a) {
    const t = typeInfo(a.type);
    const d = parseD((a.slots[0] || {}).date || a.date);
    const id = esc(a.id);
    return `<div class="adm-act">
      <div class="tl-date ${t.cls}"><b>${d ? d.getDate() : '-'}</b><span>${d ? MON[d.getMonth()] + ' ' + String(d.getFullYear() + 543).slice(2) : ''}</span></div>
      <div class="adm-main" data-action="admOpen" data-id="${id}">
        <h4>${esc(a.name)}</h4>
        <div class="meta">${ic(t.icon, 'ic-sm')}<span>${esc(a.type || 'กิจกรรม')}</span> · ${ic('calendar', 'ic-sm')}<span>${dateRange(a)} · ${a.slots.length} รอบ</span></div>
        <div class="adm-nums">
          ${statusPill(a)}
          ${audienceHtml(a, 'admin')}
          <span>${ic('users', 'ic-sm')} ${seatsText(a)}</span>
          ${a.requireCheckIn || a.checkedInCount ? `<span>${ic('check', 'ic-sm')} เช็คอิน ${a.checkedInCount || 0}/${a.registeredCount}</span>` : ''}
        </div>
      </div>
      <div class="adm-actions">
        <button class="btn btn-primary btn-sm" data-action="admOpen" data-id="${id}">${ic('users', 'ic-sm')} รายชื่อ</button>
        <button class="btn btn-ghost btn-sm" data-action="admEdit" data-id="${id}">${ic('edit', 'ic-sm')} แก้ไข</button>
        <button class="btn btn-ghost btn-sm" data-action="admVisOne" data-id="${id}">${ic('eye', 'ic-sm')} การมองเห็น</button>
        <button class="btn btn-ghost btn-sm" data-action="qr" data-id="${id}">${ic('qr', 'ic-sm')} QR</button>
        <button class="btn btn-ghost btn-sm" data-action="poster" data-id="${id}">${ic('image', 'ic-sm')} โปสเตอร์</button>
      </div>
    </div>`;
  }

  /* ---------- รายชื่อผู้ลงทะเบียน ---------- */
  async function renderAdminAct(id) {
    view.innerHTML = '<div class="skeleton" style="height:160px"></div><div class="skeleton" style="height:380px;margin-top:20px"></div>';
    const r = await api('adminRegistrants', { activityId: id });
    if (state.route !== 'admin') return;
    if (!adm.reg || adm.reg.activity.id !== id) { adm.regFilter = 'all'; adm.regSlot = 'all'; adm.regQ = ''; adm.regType = 'all'; }
    adm.reg = r;
    putAdminAct(r.activity);
    drawAdminAct();
  }

  function slotShort(a, slotId, fallback) {
    const s = slotOf(a, slotId);
    return s ? `${fmtDShort(s.date)} · ${timeLabel(s)}` : (fallback || '-');
  }

  function drawAdminAct() {
    const a = adm.reg.activity; const list = adm.reg.registrants;
    const t = typeInfo(a.type);
    const inN = list.filter((x) => x.checkedIn).length;
    const pct = list.length ? Math.round((inN / list.length) * 100) : 0;
    const id = esc(a.id);
    view.innerHTML = `
      <a class="back" href="#/admin">${ic('chevL', 'ic-sm')} จัดการกิจกรรม</a>
      <section class="detail-hero ${t.cls}" style="padding-bottom:22px">
        ${ic(t.icon, 'cover-ic')}
        <div class="chips"><span class="pill pill-glass">${ic(t.icon, 'ic-sm')} ${esc(a.type || 'กิจกรรม')}</span>${statusPill(a, true)}${audienceHtml(a, true)}<span class="pill pill-glass">${ic(a.isPublic ? 'eye' : 'lock', 'ic-sm')} ${a.isPublic ? 'สาธารณะ' : 'ต้องเข้าสู่ระบบ'}</span></div>
        <h1>${esc(a.name)}</h1>
        <div class="chips" style="gap:16px">
          <span class="meta" style="color:#fff">${ic('calendar', 'ic-sm')} ${dateRange(a)} · ${a.slots.length} รอบ</span>
          ${a.location ? `<span class="meta" style="color:#fff">${ic('pin', 'ic-sm')} ${esc(a.location)}</span>` : ''}
        </div>
        <div class="adm-hero-actions">
          <button class="btn btn-white btn-sm" data-action="admEdit" data-id="${id}">${ic('edit', 'ic-sm')} แก้ไขกิจกรรม</button>
          <button class="btn btn-glass btn-sm" data-action="admVisOne" data-id="${id}">${ic('eye', 'ic-sm')} การมองเห็น</button>
          <button class="btn btn-glass btn-sm" data-action="admCiQr" data-id="${id}">${ic('scan', 'ic-sm')} QR เช็คอินหน้างาน</button>
          <button class="btn btn-glass btn-sm" data-action="qr" data-id="${id}">${ic('qr', 'ic-sm')} QR ลงทะเบียน</button>
          <button class="btn btn-glass btn-sm" data-action="poster" data-id="${id}">${ic('image', 'ic-sm')} โปสเตอร์</button>
          <a class="btn btn-glass btn-sm" href="#/act/${encodeURIComponent(a.id)}">${ic('eye', 'ic-sm')} มุมมองผู้ใช้</a>
        </div>
      </section>
      <div class="stats" style="margin-top:18px">
        ${statHtml('users', 'si-blue', list.length, 'ลงทะเบียน')}
        ${statHtml('check', 'si-green', inN, 'เช็คอินแล้ว')}
        ${statHtml('clock', 'si-amber', list.length - inN, 'ยังไม่เช็คอิน')}
        ${statHtml('award', 'si-violet', pct + '%', 'อัตราการเข้าร่วม')}
      </div>
      ${a.slots.length > 1 ? `<div class="adm-slots">${a.slots.map((s) => {
        const n = list.filter((x) => x.slotId === s.id).length;
        return `<div class="adm-slot"><b>${fmtDShort(s.date)}</b><span>${timeLabel(s)}</span><small>${n}${s.cap ? '/' + s.cap : ''} คน</small>
          ${s.cap ? `<span class="bar"><i style="width:${Math.min(100, Math.round(n / s.cap * 100))}%"></i></span>` : ''}</div>`;
      }).join('')}</div>` : ''}
      <section class="card card-pad" style="margin-top:20px">
        <div class="section-head" style="align-items:center;flex-wrap:wrap;margin-bottom:6px">
          <div><h2 class="card-title" style="margin:0">${ic('users')} รายชื่อผู้ลงทะเบียน</h2></div>
          <button class="btn btn-ghost btn-sm" data-action="admCsv" ${list.length ? '' : 'disabled'}>${ic('file', 'ic-sm')} ดาวน์โหลด Excel (CSV)</button>
        </div>
        <div class="adm-toolbar" style="margin:10px 0 14px">
          <div class="seg" id="reg-seg"></div>
          ${a.slots.length > 1 ? `<select class="input adm-select" id="reg-slot"><option value="all">ทุกรอบ</option>${a.slots.map((s) =>
            `<option value="${esc(s.id)}" ${adm.regSlot === s.id ? 'selected' : ''}>${esc(fmtDShort(s.date) + ' ' + timeLabel(s))}</option>`).join('')}</select>` : ''}
          ${new Set(list.map((x) => x.participantType || 'staff')).size > 1 ? `<select class="input adm-select" id="reg-ptype"><option value="all">ทุกกลุ่ม</option>${USER_TYPES
            .filter((t) => list.some((x) => (x.participantType || 'staff') === t.id))
            .map((t) => `<option value="${t.id}" ${adm.regType === t.id ? 'selected' : ''}>${esc(t.label)} (${list.filter((x) => (x.participantType || 'staff') === t.id).length})</option>`).join('')}</select>` : ''}
          <div class="input-wrap adm-search">
            <input class="input" id="reg-search" placeholder="ค้นหาชื่อ / รหัส / หน่วยงาน" value="${esc(adm.regQ)}">
            <span class="search-ic">${ic('search', 'ic-sm')}</span>
          </div>
        </div>
        <div id="reg-list" class="reg-list"></div>
      </section>`;
    drawRegList();
    document.getElementById('reg-search').addEventListener('input', (e) => { adm.regQ = e.target.value; drawRegList(); });
    const sel = document.getElementById('reg-slot');
    if (sel) sel.addEventListener('change', (e) => { adm.regSlot = e.target.value; drawRegList(); });
    const pt = document.getElementById('reg-ptype');
    if (pt) pt.addEventListener('change', (e) => { adm.regType = e.target.value; drawRegList(); });
  }

  function filteredRegs() {
    const q = adm.regQ.trim().toLowerCase();
    return adm.reg.registrants.filter((x) =>
      (adm.regFilter === 'all' || (adm.regFilter === 'in') === x.checkedIn) &&
      (adm.regSlot === 'all' || x.slotId === adm.regSlot) &&
      (!adm.regType || adm.regType === 'all' || (x.participantType || 'staff') === adm.regType) &&
      (!q || (x.name + ' ' + x.employeeId + ' ' + x.deptName).toLowerCase().includes(q)));
  }

  function drawRegList() {
    const all = adm.reg.registrants; const a = adm.reg.activity;
    const c = { all: all.length, in: all.filter((x) => x.checkedIn).length };
    c.out = c.all - c.in;
    document.getElementById('reg-seg').innerHTML = [['all', 'ทั้งหมด'], ['in', 'เช็คอินแล้ว'], ['out', 'ยังไม่เช็คอิน']]
      .map(([k, l]) => `<button class="${adm.regFilter === k ? 'on' : ''}" data-action="regFilter" data-v="${k}">${l} <span class="muted">${c[k]}</span></button>`).join('');
    const list = filteredRegs();
    document.getElementById('reg-list').innerHTML = list.length ? list.map((x, i) => `
      <div class="reg-row ${x.checkedIn ? 'is-in' : ''}">
        <span class="reg-no">${i + 1}</span>
        <span class="avatar">${esc(initials(x.name))}</span>
        <div class="reg-main">
          <b>${esc(x.name)}</b>${x.pendingAccount ? ` <button class="pill pill-warn" style="font-size:11.5px;padding:1px 8px;border:0;cursor:pointer" data-action="admPending" title="บัญชีลงทะเบียนครั้งแรก ยังไม่ได้อนุมัติ — แตะเพื่อตรวจสอบ">${ic('clock', 'ic-sm')} รออนุมัติบัญชี</button>` : ''}${x.participantType && x.participantType !== 'staff' ? ` <span class="pill pill-info" style="font-size:11.5px;padding:1px 8px">${esc(utInfo(x.participantType).short)}</span>` : ''}
          <small>${x.participantType && x.participantType !== 'staff' ? '' : esc(x.employeeId) + ' · '}${esc(x.deptName || '-')}</small>
          <small class="muted">${ic('clock', 'ic-sm')} ${esc(slotShort(a, x.slotId, x.slotLabel))}${/walk-in|หน้างาน/i.test(x.source) ? ' · <b>หน้างาน</b>' : ''}</small>
        </div>
        <div class="reg-side">
          <button class="chk ${x.checkedIn ? 'on' : ''}" data-action="admCheck" data-reg="${esc(x.regId)}" data-v="${x.checkedIn ? 0 : 1}"
            title="${x.checkedIn ? 'แตะเพื่อยกเลิกเช็คอิน' : 'เช็คอินแทนผู้เข้าร่วม'}">
            <span class="chk-l">${ic('check', 'ic-sm')} ${x.checkedIn ? 'เช็คอินแล้ว' : 'เช็คอิน'}</span>${x.checkedIn ? `<small>${esc(x.checkedInAt)}</small>` : ''}</button>
          <button class="icon-btn sm" data-action="admRemove" data-reg="${esc(x.regId)}" title="ลบการลงทะเบียน" aria-label="ลบการลงทะเบียน">${ic('trash', 'ic-sm')}</button>
        </div>
      </div>`).join('')
      : emptyHtml('users', all.length ? 'ไม่พบรายชื่อที่ตรงกับตัวกรอง' : 'ยังไม่มีผู้ลงทะเบียน', all.length ? '' : 'แชร์ QR ลงทะเบียนหรือโปสเตอร์เพื่อประชาสัมพันธ์กิจกรรม');
  }

  async function admToggleCheck(el) {
    const a = adm.reg.activity;
    const checked = el.dataset.v === '1';
    const x = adm.reg.registrants.find((r) => r.regId === el.dataset.reg);
    if (!checked) {
      const ok = await confirmModal('ยกเลิกเช็คอิน?', `${esc(x ? x.name : '')}<br><span class="muted">เวลาเช็คอินเดิมจะถูกลบ</span>`, 'ยกเลิกเช็คอิน', true);
      if (!ok) return;
    }
    el.disabled = true; el.innerHTML = '<span class="spinner" style="width:16px;height:16px"></span>';
    try {
      adm.reg = await api('adminCheckIn', { activityId: a.id, regId: el.dataset.reg, checked });
      adm.data = null;
      drawAdminAct();
      toast(checked ? `เช็คอินให้ ${x ? x.name : ''} แล้ว` : 'ยกเลิกเช็คอินแล้ว', 'ok');
    } catch (e) { toast(e.message, 'err'); drawRegList(); }
  }

  async function admRemoveReg(el) {
    const a = adm.reg.activity;
    const x = adm.reg.registrants.find((r) => r.regId === el.dataset.reg);
    if (!x) return;
    const ok = await confirmModal('ลบการลงทะเบียน?', `<b>${esc(x.name)}</b> (${esc(x.employeeId)})<br>${esc(slotShort(a, x.slotId, x.slotLabel))}<br><span class="muted">ลบแล้วกู้คืนไม่ได้ ผู้ใช้ลงทะเบียนใหม่เองได้</span>`, 'ลบรายการนี้', true);
    if (!ok) return;
    try {
      adm.reg = await api('adminRemoveReg', { activityId: a.id, regId: x.regId });
      adm.data = null; state.acts = null;
      drawAdminAct(); toast('ลบการลงทะเบียนแล้ว', 'ok');
    } catch (e) { toast(e.message, 'err'); }
  }

  function admCsv() {
    const a = adm.reg.activity;
    const cell = (v) => {
      let s = String(v == null ? '' : v);
      if (/^[=+\-@]/.test(s)) s = "'" + s; // กันสูตร Excel
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const head = ['ลำดับ', 'รหัสพนักงาน/รหัสสมาชิก', 'ชื่อ-นามสกุล', 'กลุ่มผู้เข้าร่วม', 'หน่วยงาน/สังกัด', 'รอบ', 'ลงทะเบียนเมื่อ', 'ช่องทาง', 'เช็คอิน', 'เวลาเช็คอิน'];
    const rows = filteredRegs().map((x, i) => [i + 1, null, x.name, utInfo(x.participantType).label, x.deptName, slotShort(a, x.slotId, x.slotLabel),
      x.registeredAt, x.source, x.checkedIn ? 'เช็คอินแล้ว' : 'ยังไม่เช็คอิน', x.checkedInAt]
      .map((v, j) => (j === 1 ? `="${x.employeeId}"` : cell(v))).join(','));
    const csv = '﻿' + [head.map(cell).join(',')].concat(rows).join('\r\n');
    saveBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `รายชื่อ_${safeFile(a.name)}.csv`);
    toast('ดาวน์โหลดรายชื่อแล้ว (เปิดด้วย Excel ได้)', 'ok');
  }

  /* ---------- ฟอร์มเพิ่ม/แก้ไขกิจกรรม ---------- */
  async function openActForm(id) {
    let a = null;
    if (id) a = (state.adminActs || []).find((x) => x.id === id) || (adm.reg && adm.reg.activity.id === id ? adm.reg.activity : null);
    const types = (adm.data && adm.data.types) || ['อบรม', 'กิจกรรมรณรงค์', 'กิจกรรมสิ่งแวดล้อม', 'ประชุม/สัมมนา', 'อื่นๆ'];
    const v = a || { name: '', type: types[0], location: '', description: '', activityDate: '', regStart: '', regEnd: '', requireCheckIn: true, slotsText: '', audience: ['staff'], isPublic: true };
    const aud = v.audience && v.audience.length ? v.audience : ['staff'];
    openModal(`
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div><h3>${a ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}</h3><p class="muted" style="margin:2px 0 0;font-size:13.5px">${a ? esc(a.name) : 'กรอกข้อมูลแล้วกดบันทึก — พนักงานจะเห็นในแอปทันที'}</p></div>
        <button class="icon-btn" data-action="closeModal" aria-label="ปิด">${ic('x')}</button>
      </div>
      <form id="act-form" style="margin-top:16px" novalidate>
        <div class="form-error" id="act-err"></div>
        <div class="field"><label>ชื่อกิจกรรม *</label><input class="input" name="name" value="${esc(v.name)}" maxlength="150" required></div>
        <div class="row2">
          <div class="field"><label>ประเภท</label><select class="input" name="type">${types.map((t) => `<option ${t === v.type ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></div>
          <div class="field"><label>สถานที่</label><input class="input" name="location" value="${esc(v.location)}" placeholder="เช่น ห้องประชุมใหญ่ อาคาร 1"></div>
        </div>
        <div class="field"><label>รายละเอียด</label><textarea class="input" name="description" rows="2">${esc(v.description)}</textarea></div>
        <div class="field">
          <label>รอบวันที่ / เวลา</label>
          <div class="slot-builder">
            <input class="input" type="date" id="sb-date">
            <input class="input" type="time" id="sb-start" value="09:00">
            <input class="input" type="time" id="sb-end" value="12:00">
            <input class="input" type="number" id="sb-cap" min="0" placeholder="รับ (คน)">
            <button type="button" class="btn btn-ghost" data-action="sbAdd">${ic('plus', 'ic-sm')} เพิ่มรอบ</button>
          </div>
          <textarea class="input mono" name="slotsText" rows="4" placeholder="2026-11-20 09:00-12:00 30&#10;2026-11-20 13:00-16:00&#10;2026-11-21">${esc(v.slotsText)}</textarea>
          <span class="hint">บรรทัดละ 1 รอบ: <code>ปปปป-ดด-วว ชช:นน-ชช:นน จำนวนที่รับ</code> · ไม่ใส่จำนวน = ไม่จำกัด · ไม่ใส่เวลา = ทั้งวัน</span>
        </div>
        <div class="row3">
          <div class="field"><label>วันที่จัด <small class="muted">(ถ้าไม่ใส่รอบ)</small></label><input class="input" type="date" name="activityDate" value="${esc(v.activityDate || '')}"></div>
          <div class="field"><label>เปิดรับลงทะเบียน</label><input class="input" type="date" name="regStart" value="${esc(v.regStart || '')}"></div>
          <div class="field"><label>ปิดรับลงทะเบียน</label><input class="input" type="date" name="regEnd" value="${esc(v.regEnd || '')}"></div>
        </div>
        <fieldset class="vis-box">
          <legend>${ic('eye', 'ic-sm')} ใครเห็นกิจกรรมนี้บ้าง</legend>
          <div class="aud-picks">${USER_TYPES.map((t) => t.id === 'staff'
            ? `<label class="aud-pick" title="บุคลากรโรงพยาบาลเห็นทุกกิจกรรมเสมอ"><input type="checkbox" checked disabled><span>${ic(t.icon, 'ic-sm')} ${esc(t.label)} <small class="muted">(เสมอ)</small></span></label>`
            : `<label class="aud-pick"><input type="checkbox" name="aud" value="${t.id}" ${aud.includes(t.id) ? 'checked' : ''}><span>${ic(t.icon, 'ic-sm')} ${esc(t.label)}</span></label>`).join('')}
            <button type="button" class="btn btn-ghost btn-sm" data-action="audAll">เลือกบุคคลภายนอกทั้งหมด</button>
          </div>
          <span class="hint">บุคลากร รพ. เห็นและลงทะเบียนได้ทุกกิจกรรม · บุคคลภายนอกกลุ่มที่ไม่ได้เลือก <b>จะไม่เห็นกิจกรรมนี้เลย</b> (รวมถึงเปิดจากลิงก์/QR) และลงทะเบียนหน้างานไม่ได้</span>
          <label class="check-line" style="margin-top:10px"><input type="checkbox" name="isPublic" ${v.isPublic ? 'checked' : ''}>
            <span><b>แสดงต่อสาธารณะ</b> — ผู้ที่ยังไม่เข้าสู่ระบบเห็นรายละเอียดกิจกรรมนี้ได้ (เหมาะกับโปสเตอร์/QR ประชาสัมพันธ์) · ไม่ติ๊ก = ต้องเข้าสู่ระบบก่อนจึงเห็น</span></label>
        </fieldset>
        <label class="check-line"><input type="checkbox" name="requireCheckIn" ${v.requireCheckIn ? 'checked' : ''}> ต้องเช็คอินหน้างานด้วย QR (นับว่าเข้าร่วมเมื่อเช็คอินแล้ว)</label>
        <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="closeModal">ยกเลิก</button>
          <button class="btn btn-primary">${ic('check')} ${a ? 'บันทึกการแก้ไข' : 'เพิ่มกิจกรรม'}</button></div>
      </form>`, 'wide');
    bindForm('act-form', 'act-err', async (f) => {
      const payload = {
        id: a ? a.id : '', name: f.name.value.trim(), type: f.type.value, location: f.location.value.trim(),
        description: f.description.value.trim(), slotsText: f.slotsText.value.trim(), activityDate: f.activityDate.value,
        regStart: f.regStart.value, regEnd: f.regEnd.value, requireCheckIn: f.requireCheckIn.checked,
        audience: ['staff'].concat(Array.from(f.querySelectorAll('input[name="aud"]:checked')).map((x) => x.value)),
        isPublic: f.isPublic.checked
      };
      if (!payload.name) throw new Error('กรุณาระบุชื่อกิจกรรม');
      if (!payload.slotsText && !payload.activityDate) throw new Error('กรุณาเพิ่มรอบวันที่/เวลา หรือระบุวันที่จัดอย่างน้อย 1 อย่าง');
      const saved = await api('adminSaveActivity', { activity: payload });
      closeModal();
      toast(a ? 'บันทึกการแก้ไขแล้ว' : 'เพิ่มกิจกรรมแล้ว', 'ok');
      state.acts = null; adm.data = null;
      if (a && adm.reg && adm.reg.activity.id === a.id && /^#\/admin\/act\//.test(location.hash)) renderAdminAct(a.id);
      else if (!a) go('admin/act/' + encodeURIComponent(saved.id));
      else route();
    });
  }

  function slotBuilderAdd() {
    const d = document.getElementById('sb-date').value;
    const s = document.getElementById('sb-start').value;
    const e = document.getElementById('sb-end').value;
    const cap = document.getElementById('sb-cap').value;
    if (!d) { toast('เลือกวันที่ของรอบก่อน', 'err'); return; }
    if (s && e && s >= e) { toast('เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด', 'err'); return; }
    const line = d + (s && e ? ` ${s}-${e}` : '') + (Number(cap) > 0 ? ` ${Number(cap)}` : '');
    const ta = document.querySelector('#act-form [name="slotsText"]');
    ta.value = (ta.value.trim() ? ta.value.trim() + '\n' : '') + line;
  }

  /* ---------- QR เช็คอินหน้างาน ---------- */
  /** ลิงก์เช็คอิน → หน้า #/checkin ในแอปนี้ (?ci=TOKEN) แทนหน้า Apps Script (?page=checkin)
   *  เพราะหน้า Apps Script เปิดไม่ได้/ค้างโหลดบนมือถือที่ล็อกอิน Google หลายบัญชี */
  function fixCheckinUrl(url) {
    if (!url) return url;
    try {
      const token = new URL(url).searchParams.get('actoken');
      if (!token) return url;
      return `${location.origin}${location.pathname}?ci=${encodeURIComponent(token)}`;
    } catch (e) { return url; }
  }

  async function openCheckinQr(a) {
    openModal(`<div style="text-align:center;padding:30px 0"><span class="spinner" style="color:var(--brand-500)"></span><p class="muted">กำลังสร้าง QR เช็คอิน...</p></div>`);
    let r;
    try { r = await api('adminCheckinQr', { activityId: a.id }); } catch (e) { closeModal(); toast(e.message, 'err'); return; }
    r.checkinUrl = fixCheckinUrl(r.checkinUrl);
    adm.ci = { url: r.checkinUrl, name: a.name };
    openModal(`
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div><h3>QR เช็คอินหน้างาน</h3><p class="muted" style="margin:2px 0 0;font-size:14px">${esc(a.name)}</p></div>
        <button class="icon-btn" data-action="closeModal" aria-label="ปิด">${ic('x')}</button>
      </div>
      <div class="tip warn">${ic('info')}<div>ใช้ติดที่จุดลงทะเบียน <b>ในวันจัดกิจกรรม</b> ผู้เข้าร่วมสแกนแล้วกรอกรหัสพนักงาน (หรืออีเมล สำหรับบุคคลภายนอก) เพื่อเช็คอิน — ผู้ที่ยังไม่ได้ลงทะเบียนลงหน้างานได้ทันที (คนละตัวกับ QR ลงทะเบียน)</div></div>
      <div class="qr-frame"><canvas id="ci-canvas" width="600" height="600"></canvas></div>
      <div class="qr-url" style="text-align:center">${esc(r.checkinUrl)}</div>
      <div class="qr-actions">
        <button class="btn btn-primary full" data-action="admCiDownload">${ic('download')} ดาวน์โหลด QR เช็คอิน (PNG)</button>
        <button class="btn btn-ghost" data-action="admCiCopy">${ic('copy')} คัดลอกลิงก์</button>
        <a class="btn btn-ghost" href="${esc(r.checkinUrl)}" target="_blank" rel="noopener" data-stop="1">${ic('eye')} เปิดหน้าเช็คอิน</a>
      </div>`);
    drawQRInto(document.getElementById('ci-canvas'), r.checkinUrl);
  }

  /* ---------- ตารางการมองเห็น: กลุ่มใดเห็นกิจกรรมใด ---------- */
  const VIS_COLS = [{ id: 'public_listing', short: 'สาธารณะ', icon: 'eye', hint: 'ผู้ที่ยังไม่เข้าสู่ระบบเห็นได้' }]
    .concat(USER_TYPES.map((t) => ({ id: t.id, short: t.short, icon: t.icon, hint: t.label })));

  async function openVisibilityMatrix(onlyId) {
    if (!adm.data) {
      openModal(`<div style="text-align:center;padding:30px 0"><span class="spinner" style="color:var(--brand-500)"></span></div>`);
      try { await loadAdmin(true); } catch (e) { closeModal(); toast(e.message, 'err'); return; }
    }
    const all = adm.data.activities;
    const list = onlyId ? all.filter((a) => a.id === onlyId) : all.filter((a) => adm.visAll || !a.isPast);
    const cell = (a, c) => {
      if (c.id === 'staff') return `<td class="vis-c"><input type="checkbox" checked disabled title="พนักงานเห็นทุกกิจกรรมเสมอ"></td>`;
      const on = c.id === 'public_listing' ? !!a.isPublic : (a.audience || []).includes(c.id);
      return `<td class="vis-c"><input type="checkbox" data-vis-act="${esc(a.id)}" data-vis-col="${c.id}" ${on ? 'checked' : ''} aria-label="${esc(c.hint)} — ${esc(a.name)}"></td>`;
    };
    openModal(`
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div><h3>กำหนดการมองเห็นกิจกรรม</h3>
          <p class="muted" style="margin:2px 0 0;font-size:13.5px">ติ๊กว่าแต่ละกลุ่มเห็น (และลงทะเบียน) กิจกรรมใดได้ — บันทึกทันทีที่ติ๊ก · พนักงานเห็นทุกกิจกรรมเสมอ</p></div>
        <button class="icon-btn" data-action="closeModal" aria-label="ปิด">${ic('x')}</button>
      </div>
      ${onlyId ? '' : `<div class="seg" style="margin-top:12px">
        <button class="${adm.visAll ? '' : 'on'}" data-action="visScope" data-v="upcoming">กำลังจะมาถึง</button>
        <button class="${adm.visAll ? 'on' : ''}" data-action="visScope" data-v="all">ทั้งหมด</button></div>`}
      <div class="vis-wrap"><table class="vis-table">
        <thead><tr><th class="vis-name">กิจกรรม</th>${VIS_COLS.map((c) => `<th title="${esc(c.hint)}">${ic(c.icon, 'ic-sm')}<span>${esc(c.short)}</span></th>`).join('')}</tr>
          ${list.length > 1 ? `<tr class="vis-bulk"><th class="vis-name"><small class="muted">ติ๊ก/เอาออกทั้งคอลัมน์ →</small></th>${VIS_COLS.map((c) => c.id === 'staff' ? '<th></th>'
            : `<th><button type="button" class="btn btn-ghost btn-sm" data-action="visCol" data-v="${c.id}" title="ติ๊กหรือเอาออกทุกกิจกรรมในรายการ">ทั้งหมด</button></th>`).join('')}</tr>` : ''}</thead>
        <tbody>${list.length ? list.map((a) => `<tr data-vis-row="${esc(a.id)}">
          <td class="vis-name"><b>${esc(a.name)}</b><small class="muted">${dateRange(a)}${a.isPast ? ' · จัดไปแล้ว' : ''}</small></td>
          ${VIS_COLS.map((c) => cell(a, c)).join('')}</tr>`).join('')
          : `<tr><td colspan="${VIS_COLS.length + 1}" class="muted" style="text-align:center;padding:24px">ไม่มีกิจกรรม</td></tr>`}</tbody>
      </table></div>
      <div class="tip" style="margin-top:12px">${ic('info')}<div><b>สาธารณะ</b> = คนที่ยังไม่เข้าสู่ระบบเห็นรายละเอียด (เหมาะกับโปสเตอร์/QR) ·
        กลุ่มบุคคลภายนอกที่ไม่ได้ติ๊ก <b>จะไม่เห็นกิจกรรมนั้นเลย</b> และลงทะเบียน/ลงหน้างานไม่ได้</div></div>`, 'wide');
    document.querySelectorAll('[data-vis-act]').forEach((el) => el.addEventListener('change', () => saveVisibilityRow(el.dataset.visAct, el)));
  }

  /** ซ่อนคำเตือน "กิจกรรมที่คนนอกมองไม่เห็น" เมื่อตั้งค่าครบแล้ว */
  function refreshVisCallout() {
    const el = document.querySelector('.vis-callout');
    if (!el || !adm.data) return;
    const n = adm.data.activities.filter((a) => !a.isPast && !a.isPublic && (a.audience || ['staff']).length <= 1).length;
    if (!n) el.remove(); else { const b = el.querySelector('b'); if (b) b.textContent = `${n} กิจกรรมที่กำลังจะมาถึง เห็นได้เฉพาะพนักงานที่เข้าสู่ระบบ`; }
  }

  /** ติ๊ก/เอาออกทั้งคอลัมน์ ของกิจกรรมที่แสดงอยู่ในตาราง (บันทึกครั้งเดียว) */
  async function visToggleColumn(col) {
    const list = adm.data.activities.filter((a) => adm.visAll || !a.isPast);
    const has = (a) => (col === 'public_listing' ? !!a.isPublic : (a.audience || []).includes(col));
    const turnOn = !list.every(has);
    const colName = (VIS_COLS.find((c) => c.id === col) || {}).hint || col;
    const ok = await confirmModal(turnOn ? 'เปิดทั้งคอลัมน์?' : 'ปิดทั้งคอลัมน์?',
      `${turnOn ? 'ให้' : 'ไม่ให้'} <b>${esc(colName)}</b> ${col === 'public_listing' ? 'เห็นได้โดยไม่ต้องเข้าสู่ระบบ' : 'เห็นกิจกรรม'} — ${list.length} กิจกรรม`, turnOn ? 'เปิดทั้งหมด' : 'ปิดทั้งหมด', !turnOn);
    if (!ok) { openVisibilityMatrix(); return; }
    const items = list.map((a) => {
      let aud = (a.audience || ['staff']).filter((t) => t !== 'staff');
      let pub = !!a.isPublic;
      if (col === 'public_listing') pub = turnOn;
      else aud = turnOn ? Array.from(new Set(aud.concat(col))) : aud.filter((t) => t !== col);
      return { activityId: a.id, audience: ['staff'].concat(aud), isPublic: pub };
    });
    try {
      const res = await api('adminSetVisibilityBulk', { items });
      res.forEach((a) => { const x = adm.data.activities.find((y) => y.id === a.id); if (x) Object.assign(x, { audience: a.audience, isPublic: a.isPublic }); });
      state.acts = null;
      if (state.redrawAdmin) state.redrawAdmin();
      refreshVisCallout();
      toast(`บันทึกการมองเห็น ${res.length} กิจกรรมแล้ว`, 'ok');
    } catch (e) { toast(e.message, 'err'); }
    openVisibilityMatrix();
  }

  async function saveVisibilityRow(actId, changed) {
    const row = document.querySelector(`tr[data-vis-row="${CSS.escape(actId)}"]`);
    const boxes = Array.from(row.querySelectorAll('[data-vis-act]'));
    const audience = ['staff'].concat(boxes.filter((b) => b.checked && b.dataset.visCol !== 'public_listing').map((b) => b.dataset.visCol));
    const isPublic = boxes.some((b) => b.checked && b.dataset.visCol === 'public_listing');
    boxes.forEach((b) => { b.disabled = true; });
    row.classList.add('saving');
    try {
      const a = await api('adminSetVisibility', { activityId: actId, audience, isPublic });
      const i = adm.data.activities.findIndex((x) => x.id === actId);
      if (i >= 0) Object.assign(adm.data.activities[i], { audience: a.audience, isPublic: a.isPublic });
      putAdminAct(Object.assign({}, adm.data.activities[i] || {}, { audience: a.audience, isPublic: a.isPublic }));
      state.acts = null;
      if (state.redrawAdmin) state.redrawAdmin();
      refreshVisCallout();
      toast('บันทึกการมองเห็นแล้ว', 'ok');
    } catch (e) {
      changed.checked = !changed.checked;
      toast(e.message, 'err');
    } finally {
      boxes.forEach((b) => { b.disabled = false; });
      row.classList.remove('saving');
    }
  }

  /* ---------- จัดการผู้ดูแลระบบ ---------- */
  async function openAdminsModal(list) {
    if (!list) {
      openModal(`<div style="text-align:center;padding:30px 0"><span class="spinner" style="color:var(--brand-500)"></span></div>`);
      try { list = await api('adminAdmins'); } catch (e) { closeModal(); toast(e.message, 'err'); return; }
    }
    openModal(`
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div><h3>ผู้ดูแลระบบ</h3><p class="muted" style="margin:2px 0 0;font-size:13.5px">ผู้ที่อยู่ในรายชื่อนี้จะเห็นเมนู "ผู้ดูแล" หลังเข้าสู่ระบบ</p></div>
        <button class="icon-btn" data-action="closeModal" aria-label="ปิด">${ic('x')}</button>
      </div>
      <div class="admin-list">${list.map((x) => `
        <div class="admin-item">
          <span class="avatar">${esc(initials(x.name || '?'))}</span>
          <div style="flex:1;min-width:0"><b>${esc(x.name || 'ไม่พบชื่อ')}</b>${x.isMe ? ' <span class="pill pill-ok">คุณ</span>' : ''}
            <small class="muted" style="display:block">${esc(x.employeeId)}${x.deptName ? ' · ' + esc(x.deptName) : ''}${x.hasAccount ? '' : ' · <span style="color:var(--warn-fg)">ยังไม่ได้สร้างบัญชีในแอป</span>'}</small></div>
          ${x.isMe ? '' : `<button class="btn btn-ghost btn-sm" data-action="admRevoke" data-emp="${esc(x.employeeId)}">ถอนสิทธิ์</button>`}
        </div>`).join('')}</div>
      <form id="adm-add" class="admin-add" novalidate>
        <div class="form-error" id="adm-add-err"></div>
        <label for="adm-add-id" style="font-size:13.5px;font-weight:600">เพิ่มผู้ดูแล (รหัสพนักงาน 7 หลัก)</label>
        <div style="display:flex;gap:8px;margin-top:6px">
          <input class="input" id="adm-add-id" name="emp" inputmode="numeric" maxlength="7" placeholder="0000000" style="flex:1">
          <button class="btn btn-primary">${ic('plus', 'ic-sm')} เพิ่ม</button>
        </div>
        <span class="hint" style="font-size:12.5px;color:var(--muted)">ผู้ดูแลเข้าสู่ระบบด้วยรหัสพนักงานและรหัสผ่านของตนเอง (ถ้ายังไม่มีบัญชี ให้ "สมัครใช้งาน" ประเภทพนักงานก่อน)</span>
      </form>`);
    const inp = document.getElementById('adm-add-id');
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(0, 7); });
    bindForm('adm-add', 'adm-add-err', async (f) => {
      if (!/^\d{7}$/.test(f.emp.value)) throw new Error('กรุณากรอกรหัสพนักงานให้ครบ 7 หลัก');
      const r = await api('adminSetAdmin', { employeeId: f.emp.value, isAdmin: true });
      toast('เพิ่มผู้ดูแลแล้ว', 'ok'); openAdminsModal(r);
    });
  }

  /* ---------- ตรวจสอบบัญชีใหม่ (ยืนยันว่าเป็นเจ้าหน้าที่จริง) ---------- */
  async function openPendingUsers(list) {
    if (!list) {
      openModal(`<div style="text-align:center;padding:30px 0"><span class="spinner" style="color:var(--brand-500)"></span></div>`);
      try { list = await api('adminPendingUsers'); } catch (e) { closeModal(); toast(e.message, 'err'); return; }
    }
    if (adm.data) adm.data.stats.pendingUsers = list.length;
    adm.pending = list;
    const f = adm.pendFilter || 'all';
    const counts = {};
    list.forEach((x) => { counts[x.userType || 'staff'] = (counts[x.userType || 'staff'] || 0) + 1; });
    const shown = list.filter((x) => f === 'all' || (x.userType || 'staff') === f);
    const kv = (k, v) => (v ? `<span><small class="muted">${k}</small> ${esc(v)}</span>` : '');
    const detail = (x) => {
      const t = x.userType || 'staff';
      if (t === 'staff') {
        return `<div class="pend-kv">${kv('รหัสพนักงาน', x.employeeId)}${kv('หน่วยงาน', x.deptName)}${kv('อีเมล', x.email)}</div>
          ${x.previousRegistrations ? `<small class="muted" style="display:block">มีประวัติลงทะเบียนเดิมของรหัสนี้ ${x.previousRegistrations} รายการ${x.previousName && x.previousName !== x.name ? ` · ชื่อในประวัติ: <b style="color:var(--warn-fg)">${esc(x.previousName)}</b>` : ''}</small>` : ''}`;
      }
      const period = x.periodStart || x.periodEnd ? `${x.periodStart ? fmtD(x.periodStart) : '?'} – ${x.periodEnd ? fmtD(x.periodEnd) : '?'}` : '';
      return `<div class="pend-kv">${kv('อีเมล (ใช้เข้าสู่ระบบ)', x.email)}${kv('โทร', x.phone)}
        ${kv(t === 'intern' ? 'สถาบัน' : t === 'contractor' ? 'บริษัท' : 'กลุ่ม/องค์กร', x.org)}${kv('คณะ/สาขา', x.faculty)}
        ${kv(t === 'intern' ? 'ฝึกงานที่' : 'ปฏิบัติงานที่', x.hostDeptName)}${kv(t === 'intern' ? 'ช่วงฝึกงาน' : 'ช่วงสัญญา', period)}</div>`;
    };
    openModal(`
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div><h3>ตรวจสอบบัญชีใหม่</h3><p class="muted" style="margin:2px 0 0;font-size:13.5px">บัญชีใหม่ทุกประเภทเข้าสู่ระบบไม่ได้จนกว่าจะอนุมัติ — พนักงาน: เทียบกับทะเบียนบุคลากร (HR) · นักศึกษา/ผู้รับจ้าง: สอบถามหน่วยงานที่ระบุ</p></div>
        <button class="icon-btn" data-action="closeModal" aria-label="ปิด">${ic('x')}</button>
      </div>
      ${list.length ? `<div class="seg" style="margin-top:12px;flex-wrap:wrap">${[{ id: 'all', short: 'ทั้งหมด' }].concat(USER_TYPES.filter((t) => counts[t.id]))
        .map((t) => `<button class="${f === t.id ? 'on' : ''}" data-action="pendFilter" data-v="${t.id}">${esc(t.short)} <span class="muted">${t.id === 'all' ? list.length : counts[t.id]}</span></button>`).join('')}</div>` : ''}
      <div class="admin-list">${shown.length ? shown.map((x) => `
        <div class="admin-item" style="flex-wrap:wrap;align-items:flex-start">
          <span class="avatar">${esc(initials(x.name || '?'))}</span>
          <div style="flex:1;min-width:220px"><b>${esc(x.name)}</b> <span class="pill ${x.userType && x.userType !== 'staff' ? 'pill-info' : 'pill-soft'}">${esc(utInfo(x.userType).label)}</span>
            ${detail(x)}
            ${(x.pendingRegistrations || []).length ? `<small style="display:block;color:var(--warn-fg)">${ic('calendar', 'ic-sm')} ลงทะเบียนระหว่างรอ ${x.pendingRegistrations.length} กิจกรรม: ${x.pendingRegistrations.map(esc).join(', ')}</small>` : ''}
            <small class="muted" style="display:block">สมัครเมื่อ ${esc(x.createdAt || '-')}</small></div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-primary btn-sm" data-action="admReview" data-ok="1" data-emp="${esc(x.employeeId)}">${ic('check', 'ic-sm')} อนุมัติ</button>
            <button class="btn btn-ghost btn-sm" data-action="admReview" data-ok="0" data-emp="${esc(x.employeeId)}">ไม่อนุมัติ</button>
          </div>
        </div>`).join('') : `<p class="muted" style="text-align:center;padding:24px 0">ไม่มีบัญชีที่รอตรวจสอบ</p>`}</div>`, 'wide');
  }

  async function reviewUser(emp, approve) {
    const x = (adm.pending || []).find((p) => p.employeeId === emp) || { name: emp, userType: 'staff' };
    let reason = '';
    if (!approve) {
      const ok = await new Promise((resolve) => {
        openModal(`<h3>ไม่อนุมัติบัญชีนี้?</h3>
          <p style="margin-top:10px"><b>${esc(x.name)}</b> (${esc(utInfo(x.userType).label)}) — บัญชีจะถูกลบ ผู้สมัครกลับมาสมัครใหม่ได้</p>
          <form id="rej-form" novalidate>
            <div class="form-error" id="rej-err"></div>
            <div class="field"><label>เหตุผล <small class="muted">(ส่งให้ผู้สมัครทางอีเมล${x.email ? '' : ' — บัญชีนี้ไม่มีอีเมล'})</small></label>
              <textarea class="input" name="reason" rows="3" maxlength="300" placeholder="เช่น ไม่พบรายชื่อในทะเบียนบุคลากร / ข้อมูลสถาบันไม่ครบ"></textarea></div>
            <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="closeModal">ยกเลิก</button>
              <button class="btn btn-danger">ไม่อนุมัติ</button></div>
          </form>`);
        modalResolve = resolve;
        document.getElementById('rej-form').addEventListener('submit', (e) => {
          e.preventDefault(); reason = e.target.reason.value.trim();
          const r = modalResolve; modalResolve = null; r(true);
        });
      });
      if (!ok) { openPendingUsers(adm.pending); return; }
    }
    try {
      const list = await api('adminReviewUser', { employeeId: emp, approve: approve, reason: reason });
      toast(approve ? `อนุมัติ ${x.name} แล้ว${x.email ? ' — ส่งอีเมลแจ้งผลแล้ว' : ''}` : 'ไม่อนุมัติและลบบัญชีแล้ว', 'ok');
      openPendingUsers(list);
    } catch (e) { toast(e.message, 'err'); openPendingUsers(); }
  }

  async function admRevoke(el) {
    const emp = el.dataset.emp;
    const ok = await confirmModal('ถอนสิทธิ์ผู้ดูแล?', `รหัสพนักงาน <b>${esc(emp)}</b> จะใช้งานได้แบบพนักงานทั่วไป`, 'ถอนสิทธิ์', true);
    if (!ok) { openAdminsModal(); return; }
    try { const r = await api('adminSetAdmin', { employeeId: emp, isAdmin: false }); toast('ถอนสิทธิ์แล้ว', 'ok'); openAdminsModal(r); }
    catch (e) { toast(e.message, 'err'); }
  }

  /* ============================ PROFILE ============================ */
  async function renderProfile() {
    const u = state.user;
    const theme = LS.get('gs_theme') || 'auto';
    const ext = isExternalUser(u);
    const period = u.periodStart || u.periodEnd ? `${u.periodStart ? fmtD(u.periodStart) : '?'} – ${u.periodEnd ? fmtD(u.periodEnd) : '?'}` : '';
    view.innerHTML = `
      <section class="card card-pad">
        <div class="profile-head">
          <span class="avatar xl">${esc(initials(u.name))}</span>
          <div style="flex:1;min-width:200px">
            <h1 style="font-size:24px">${esc(u.name)}</h1>
            <p class="muted" style="margin:2px 0 8px">${esc(u.deptName || '')}</p>
            <span class="pill ${ext ? 'pill-info' : 'pill-soft'}">${ic(utInfo(u.userType).icon, 'ic-sm')} ${esc(utInfo(u.userType).label)}</span>
            ${ext ? '' : `<span class="pill pill-soft">รหัสพนักงาน ${esc(u.employeeId)}</span>`}
            ${u.isAdmin ? `<a class="pill pill-info" href="#/admin">${ic('shield', 'ic-sm')} ผู้ดูแลระบบ · ไปหน้าจัดการ</a>` : ''}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-ghost" data-action="editProfile">${ic('edit')} แก้ไขข้อมูล</button>
            <button class="btn btn-ghost" data-action="changePw">${ic('lock')} เปลี่ยนรหัสผ่าน</button>
            <button class="btn btn-danger" data-action="logout">${ic('logout')} ออกจากระบบ</button>
          </div>
        </div>
        <dl class="kv">${ext ? `
          <dt>ประเภทผู้ใช้</dt><dd>${esc(utInfo(u.userType).label)}</dd>
          <dt>อีเมล (ชื่อเข้าสู่ระบบ)</dt><dd>${esc(u.email || '-')}</dd>
          <dt>เบอร์โทรศัพท์</dt><dd>${esc(u.phone || '-')}</dd>
          ${u.userType !== 'public' ? `<dt>${esc(ORG_LABEL[u.userType].replace(' (ถ้ามี)', ''))}</dt><dd>${esc(u.org || '-')}</dd>` : ''}
          ${u.userType === 'intern' ? `<dt>คณะ / สาขา</dt><dd>${esc(u.faculty || '-')}</dd>` : ''}
          ${HOST_LABEL[u.userType] ? `<dt>${esc(HOST_LABEL[u.userType])}</dt><dd>${esc(u.hostDeptName || '-')}</dd>` : ''}
          ${HOST_LABEL[u.userType] ? `<dt>${u.userType === 'intern' ? 'ช่วงฝึกงาน' : 'ช่วงสัญญา'}</dt><dd>${esc(period || '-')}</dd>` : ''}` : `
          <dt>หน่วยงาน</dt><dd>${esc(u.deptName || '-')}</dd>
          <dt>อีเมล</dt><dd>${esc(u.email || '-')}</dd>
          <dt>สิทธิ์การใช้งาน</dt><dd>${u.isAdmin
            ? `<a href="#/admin" style="color:var(--brand-600)">${ic('shield', 'ic-sm')} ผู้ดูแลระบบ — ไปหน้าจัดการกิจกรรม</a>`
            : `พนักงานทั่วไป <a href="#/admin" class="muted" style="font-weight:500;font-size:13px">(ตรวจสอบสิทธิ์ผู้ดูแล)</a>`}</dd>`}
        </dl>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>ข้อมูลส่วนบุคคลของฉัน</h2><p>ดูว่าระบบเก็บข้อมูลอะไร และลบบัญชีของตนเองได้ (PDPA)</p></div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-ghost" data-action="privacy">${ic('shield')} ประกาศความเป็นส่วนตัว</button>
          <button class="btn btn-danger" data-action="deleteAccount">${ic('trash')} ลบบัญชีและข้อมูลของฉัน</button>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>ดาวน์โหลดแอปลงเครื่อง</h2><p>ติดตั้งได้ทั้งคอมพิวเตอร์ (Windows / Mac) และมือถือ (Android / iPhone) ไม่ต้องผ่าน App Store</p></div></div>
        ${isStandalone() ? `<div class="tip ok">${ic('check')}<div>คุณกำลังใช้งานแอปที่ติดตั้งแล้ว</div></div>` : installCardHtml()}
        ${platformsHtml()}
      </section>

      <section class="section">
        <div class="section-head"><div><h2>การแสดงผล</h2></div></div>
        <div class="seg">
          ${[['auto', 'ตามระบบ'], ['light', 'สว่าง'], ['dark', 'มืด']].map(([k, l]) => `<button class="${theme === k ? 'on' : ''}" data-action="setTheme" data-v="${k}">${l}</button>`).join('')}
        </div>
        ${DEMO ? `<div style="margin-top:16px"><button class="btn btn-ghost btn-sm" data-action="resetDemo">ล้างข้อมูลโหมดสาธิต</button></div>` : ''}
      </section>
      <div class="footer">Green Somdej · เวอร์ชันเว็บแอป ${APP_VERSION}${DEMO ? ' · โหมดสาธิต' : ''}</div>`;
  }

  function platformsHtml() {
    return `<div class="platforms">
      <div class="platform"><h4>${ic('monitor')} คอมพิวเตอร์</h4><ol>
        <li>เปิดเว็บนี้ด้วย <b>Chrome</b> หรือ <b>Microsoft Edge</b></li>
        <li>กดปุ่ม <b>ดาวน์โหลดแอป</b> ด้านบน หรือไอคอน ${ic('install', 'ic-sm')} ในแถบที่อยู่</li>
        <li>กด <b>ติดตั้ง</b> — ไอคอนจะอยู่บนเดสก์ท็อปและเมนู Start</li></ol></div>
      <div class="platform"><h4>${ic('phone')} Android</h4><ol>
        <li>เปิดด้วย <b>Chrome</b></li>
        <li>กดปุ่ม <b>ดาวน์โหลดแอป</b> หรือเมนู ⋮ → <b>ติดตั้งแอป</b> / <b>เพิ่มลงในหน้าจอหลัก</b></li>
        <li>ไอคอนแอปจะอยู่บนหน้าจอหลัก</li></ol></div>
      <div class="platform"><h4>${ic('phone')} iPhone / iPad</h4><ol>
        <li>เปิดด้วย <b>Safari</b></li>
        <li>แตะปุ่ม <b>แชร์</b> ${ic('share', 'ic-sm')} ด้านล่าง</li>
        <li>เลือก <b>เพิ่มไปยังหน้าจอโฮม</b> แล้วแตะ <b>เพิ่ม</b></li></ol></div>
    </div>`;
  }

  function deptOptions(depts, selected) {
    return '<option value="">— เลือกหน่วยงาน —</option>' +
      depts.map((d) => `<option value="${esc(d.id)}" ${d.id === selected ? 'selected' : ''}>${esc(d.name)}</option>`).join('');
  }

  /** ช่องกรอกเฉพาะของบุคคลภายนอก (ใช้ทั้งหน้าสมัครและแก้ไขข้อมูล) */
  function extFieldsHtml(type, depts, v) {
    v = v || {};
    if (!type || type === 'staff') return '';
    let h = `<div class="field"><label>เบอร์โทรศัพท์มือถือ *</label><input class="input" name="phone" type="tel" inputmode="tel" maxlength="12" autocomplete="tel" placeholder="0812345678" value="${esc(v.phone || '')}"></div>`;
    if (ORG_LABEL[type]) h += `<div class="field"><label>${esc(ORG_LABEL[type])}${type === 'volunteer' ? '' : ' *'}</label><input class="input" name="org" maxlength="150" value="${esc(v.org || '')}" placeholder="${type === 'intern' ? 'เช่น มหาวิทยาลัย…' : type === 'contractor' ? 'เช่น บริษัท … จำกัด' : 'เช่น ชมรมรักษ์สิ่งแวดล้อม…'}"></div>`;
    if (type === 'intern') h += `<div class="field"><label>คณะ / สาขา</label><input class="input" name="faculty" maxlength="150" value="${esc(v.faculty || '')}"></div>`;
    if (HOST_LABEL[type]) {
      h += `<div class="field"><label>${esc(HOST_LABEL[type])} *</label><select class="input" name="hostDeptId">${deptOptions(depts || [], v.hostDeptId || '')}</select></div>
        <div class="row2">
          <div class="field"><label>${type === 'intern' ? 'วันเริ่มฝึกงาน *' : 'เริ่มสัญญา (ถ้ามี)'}</label><input class="input" type="date" name="periodStart" value="${esc(v.periodStart || '')}"></div>
          <div class="field"><label>${type === 'intern' ? 'วันสิ้นสุดฝึกงาน *' : 'สิ้นสุดสัญญา (ถ้ามี)'}</label><input class="input" type="date" name="periodEnd" value="${esc(v.periodEnd || '')}"></div>
        </div>`;
    }
    return h;
  }
  /** อ่านค่าและตรวจช่องของบุคคลภายนอกจากฟอร์ม */
  function readExtFields(type, f) {
    const g = (n) => (f[n] ? f[n].value.trim() : '');
    const p = { phone: g('phone').replace(/[\s-]/g, ''), org: g('org'), faculty: g('faculty'), hostDeptId: g('hostDeptId'), periodStart: g('periodStart'), periodEnd: g('periodEnd') };
    if (!/^0\d{8,9}$/.test(p.phone)) throw new Error('กรุณากรอกเบอร์โทรศัพท์ 9–10 หลัก ขึ้นต้นด้วย 0');
    if ((type === 'intern' || type === 'contractor') && !p.org) throw new Error('กรุณากรอก' + ORG_LABEL[type]);
    if (HOST_LABEL[type] && !p.hostDeptId) throw new Error('กรุณาเลือก' + HOST_LABEL[type]);
    if (type === 'intern' && (!p.periodStart || !p.periodEnd)) throw new Error('กรุณาระบุช่วงวันที่ฝึกงาน');
    if (p.periodStart && p.periodEnd && p.periodStart > p.periodEnd) throw new Error('วันเริ่มต้องไม่เกินวันสิ้นสุด');
    return p;
  }

  async function editProfile() {
    const depts = await loadDepts();
    const u = state.user;
    const ext = isExternalUser(u);
    openModal(`<h3>แก้ไขข้อมูลส่วนตัว</h3>
      <form id="pf-form" style="margin-top:16px" novalidate>
        <div class="form-error" id="pf-err"></div>
        <div class="field"><label>ชื่อ-นามสกุล</label><input class="input" name="name" value="${esc(u.name)}" required></div>
        ${ext ? `${extFieldsHtml(u.userType, depts, u)}
          <div class="tip">${ic('info')}<div>อีเมล <b>${esc(u.email)}</b> ใช้เป็นชื่อเข้าสู่ระบบ หากต้องการเปลี่ยนอีเมลหรือประเภทผู้ใช้ กรุณาติดต่อผู้ดูแลระบบ</div></div>` : `
        <div class="field"><label>หน่วยงาน</label><select class="input" name="deptId">${deptOptions(depts, u.deptId)}</select></div>
        <div class="field"><label>อีเมล (ไม่บังคับ)</label><input class="input" name="email" type="email" value="${esc(u.email)}" placeholder="ใช้รับลิงก์แบบประเมินและผลการอนุมัติ"></div>`}
        <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="closeModal">ยกเลิก</button><button class="btn btn-primary">บันทึก</button></div>
      </form>`);
    bindForm('pf-form', 'pf-err', async (f) => {
      if (!f.name.value.trim()) throw new Error('กรุณากรอกชื่อ-นามสกุล');
      const body = ext ? Object.assign({ name: f.name.value }, readExtFields(u.userType, f))
        : { name: f.name.value, deptId: f.deptId.value, email: f.email.value };
      const user = await api('updateProfile', body);
      state.user = user; LS.set('gs_user', user); state.history = null;
      closeModal(); toast('บันทึกข้อมูลแล้ว', 'ok'); route();
    });
  }

  function changePw() {
    openModal(`<h3>เปลี่ยนรหัสผ่าน</h3>
      <form id="pw-form" style="margin-top:16px">
        <div class="form-error" id="pw-err"></div>
        <div class="field"><label>รหัสผ่านเดิม</label>${pwInput('oldPassword', 'current-password')}</div>
        <div class="field"><label>รหัสผ่านใหม่ (อย่างน้อย ${MIN_PW} ตัวอักษร)</label>${pwInput('newPassword', 'new-password')}</div>
        <div class="field"><label>ยืนยันรหัสผ่านใหม่</label>${pwInput('confirm', 'new-password')}</div>
        <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="closeModal">ยกเลิก</button><button class="btn btn-primary">เปลี่ยนรหัสผ่าน</button></div>
      </form>`);
    bindForm('pw-form', 'pw-err', async (f) => {
      if (f.newPassword.value !== f.confirm.value) throw new Error('รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน');
      const r = await api('changePassword', { oldPassword: f.oldPassword.value, newPassword: f.newPassword.value });
      state.token = r.token; LS.set('gs_token', r.token);
      closeModal(); toast('เปลี่ยนรหัสผ่านแล้ว', 'ok');
    });
  }

  /* ============================= AUTH ============================= */
  const pwInput = (name, ac) => `<div class="input-wrap"><input class="input" type="password" name="${name}" autocomplete="${ac}" required>
    <button type="button" class="eye" data-action="togglePw" aria-label="แสดงรหัสผ่าน">${ic('eye', 'ic-sm')}</button></div>`;
  // ช่องรหัสพนักงาน: ซ่อนตัวเลขขณะพิมพ์ (กดรูปตาเพื่อแสดงได้) ยังรับเฉพาะตัวเลข 7 หลัก
  const idInput = (id, value) => `<div class="input-wrap"><input class="input code" id="${id}" type="password" name="employeeId" inputmode="numeric" maxlength="7" placeholder="0000000" autocomplete="off" value="${esc(value || '')}" required>
    <button type="button" class="eye" data-action="togglePw" aria-label="แสดงรหัสพนักงาน">${ic('eye', 'ic-sm')}</button></div>`;

  /**
   * #/login                 เข้าสู่ระบบ (พนักงาน: รหัสพนักงาน · บุคคลภายนอก: อีเมล)
   * #/login/signup          เลือกประเภทผู้สมัคร
   * #/login/signup/<type>   แบบฟอร์มสมัครตามประเภท
   * #/login/sent            ส่งคำขอแล้ว รอผู้ดูแลอนุมัติ (ยังเข้าสู่ระบบไม่ได้)
   */
  async function renderLogin(arg) {
    const parts = String(arg || '').split('/');
    const mode = parts[0] === 'signup' ? 'signup' : parts[0] === 'sent' ? 'sent' : 'login';
    const suType = mode === 'signup' && USER_TYPES.some((t) => t.id === parts[1]) ? parts[1] : '';
    if (mode === 'sent' && !state.signupDone) { go('login'); return; }
    const loginMode = state.loginMode || LS.get('gs_last_mode') || 'staff';
    const lastId = LS.get('gs_last_mode') === loginMode ? (LS.get('gs_last_emp') || '') : '';

    let right;
    if (mode === 'sent') {
      const d = state.signupDone;
      right = `
        <div style="text-align:center">
          <div class="success-ic">${ic('check')}</div>
          <h2>ส่งคำขอสมัครเรียบร้อย</h2>
          <p class="muted" style="margin:6px 0 0">คุณ${esc(firstName(d.name))} · ${esc(d.userTypeLabel || '')}</p>
        </div>
        ${newUserStepsHtml(2)}
          ผู้ดูแลจะตรวจสอบข้อมูลของคุณ เมื่ออนุมัติแล้วจึงจะเข้าสู่ระบบและลงทะเบียนกิจกรรมได้
          ${d.email ? `<br>ระบบจะแจ้งผลไปที่อีเมล <b>${esc(d.email)}</b>` : '<br>หากรอนานกรุณาติดต่อผู้ดูแลระบบ'}</div></div>
        <dl class="kv" style="margin-top:14px">
          <dt>ชื่อเข้าสู่ระบบของคุณ</dt><dd><b>${esc(d.loginId)}</b></dd>
          <dt>รหัสผ่าน</dt><dd>ตามที่คุณตั้งไว้</dd>
        </dl>
        <div style="display:grid;gap:8px;margin-top:18px">
          <a class="btn btn-primary btn-lg btn-block" href="#/login" data-action="authMode" data-v="login">${ic('user')} ไปหน้าเข้าสู่ระบบ</a>
          <a class="btn btn-ghost btn-block" href="#/activities">${ic('calendar')} ดูกิจกรรมระหว่างรอ</a>
        </div>`;
    } else if (mode === 'login') {
      const staff = loginMode !== 'external';
      right = `
        <h2>ยินดีต้อนรับกลับมา</h2>
        <p class="muted" style="margin:4px 0 0">${staff ? 'พนักงานเข้าสู่ระบบด้วยรหัสพนักงาน 7 หลัก' : 'บุคคลภายนอกเข้าสู่ระบบด้วยอีเมลที่ใช้สมัคร'}</p>
        <div class="tabs2">
          <button class="on" data-action="authMode" data-v="login">เข้าสู่ระบบ</button>
          <button data-action="authMode" data-v="signup">สมัครใช้งาน</button>
        </div>
        <div class="seg seg-block" style="margin-bottom:14px">
          <button class="${staff ? 'on' : ''}" data-action="loginMode" data-v="staff">${ic('shield', 'ic-sm')} พนักงาน รพ.</button>
          <button class="${staff ? '' : 'on'}" data-action="loginMode" data-v="external">${ic('users', 'ic-sm')} บุคคลภายนอก</button>
        </div>
        <form id="login-form" novalidate>
          <div class="form-error" id="auth-err"></div>
          ${staff
            ? `<div class="field"><label for="lg-id">รหัสพนักงาน</label>${idInput('lg-id', lastId)}</div>`
            : `<div class="field"><label for="lg-email">อีเมล</label><input class="input" id="lg-email" name="login" type="email" inputmode="email" autocomplete="username" placeholder="name@example.com" value="${esc(lastId)}" required></div>`}
          <div class="field"><label>รหัสผ่าน</label>${pwInput('password', 'current-password')}</div>
          <button class="btn btn-primary btn-lg btn-block" style="margin-top:6px">${ic('user')} เข้าสู่ระบบ</button>
          <p class="muted" style="font-size:13px;text-align:center;margin-top:14px">ยังไม่มีบัญชี? <a href="#/login/signup" data-action="authMode" data-v="signup"><b>สมัครใช้งาน</b></a> · ลืมรหัสผ่าน ติดต่อผู้ดูแลระบบเพื่อรีเซ็ต</p>
          <div class="tip" style="margin-top:10px">${ic('info')}<div>ผู้ใช้ใหม่ลงทะเบียนกิจกรรมครั้งแรกได้ทันที แต่ <b>ต้องได้รับการอนุมัติจากผู้ดูแลระบบ</b> การลงทะเบียนจึงจะยืนยัน (แจ้งผลทางอีเมล)</div></div>
          ${staff ? `<div class="tip" style="margin-top:10px">${ic('shield')}<div><b>ผู้ดูแลระบบ</b> เข้าสู่ระบบที่นี่ด้วยรหัสพนักงานของตนเอง แล้วจะเห็นเมนู <b>ผู้ดูแล</b> สำหรับจัดการกิจกรรม</div></div>` : ''}
          <p class="muted" style="font-size:13px;text-align:center;margin-top:14px"><a href="#" data-action="privacy">ประกาศความเป็นส่วนตัว</a></p>
        </form>`;
    } else if (!suType) {
      right = `
        <h2>สมัครใช้งาน</h2>
        <p class="muted" style="margin:4px 0 0">เลือกประเภทที่ตรงกับคุณ — ผู้ดูแลระบบจะตรวจสอบและอนุมัติก่อนใช้งาน</p>
        ${newUserStepsHtml(1)}
        <div class="tabs2">
          <button data-action="authMode" data-v="login">เข้าสู่ระบบ</button>
          <button class="on" data-action="authMode" data-v="signup">สมัครใช้งาน</button>
        </div>
        <div class="type-picks">${USER_TYPES.map((t) => `
          <button class="type-pick" data-action="suType" data-v="${t.id}">
            <span class="tp-ic">${ic(t.icon)}</span>
            <span class="tp-txt"><b>${esc(t.label)}</b><small>${esc(t.desc)}</small></span>
            ${ic('chevR', 'ic-sm')}
          </button>`).join('')}</div>`;
    } else {
      const t = utInfo(suType);
      const ext = suType !== 'staff';
      right = `
        <a class="back" href="#/login/signup" style="margin-bottom:6px">${ic('chevL', 'ic-sm')} เปลี่ยนประเภท</a>
        <h2>สมัครใช้งาน</h2>
        <p style="margin:6px 0 14px"><span class="pill pill-info">${ic(t.icon, 'ic-sm')} ${esc(t.label)}</span></p>
        <form id="signup-form" novalidate>
          <div class="form-error" id="auth-err"></div>
          ${ext ? '' : `<div class="field"><label for="su-id">รหัสพนักงาน (7 หลัก)</label>${idInput('su-id', '')}</div>`}
          <div class="field"><label>ชื่อ-นามสกุล *</label><input class="input" name="name" autocomplete="name" maxlength="120" placeholder="เช่น สมชาย ใจดี" required></div>
          ${ext ? `<div class="field"><label>อีเมล * <small class="muted">(ใช้เป็นชื่อเข้าสู่ระบบ และรับแจ้งผลการอนุมัติ)</small></label><input class="input" name="email" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" required></div>
            <div id="su-ext">${extFieldsHtml(suType, state.depts || [], {})}</div>`
          : `<div class="field"><label>หน่วยงาน *</label><select class="input" name="deptId" id="su-dept"><option value="">กำลังโหลด...</option></select></div>
            <div class="field"><label>อีเมล (ไม่บังคับ)</label><input class="input" name="email" type="email" autocomplete="email" placeholder="ใช้รับผลการอนุมัติและลิงก์แบบประเมิน"></div>`}
          <div class="row2">
            <div class="field"><label>ตั้งรหัสผ่าน *</label>${pwInput('password', 'new-password')}</div>
            <div class="field"><label>ยืนยันรหัสผ่าน *</label>${pwInput('confirm', 'new-password')}</div>
          </div>
          <span class="hint" style="display:block;margin:-6px 0 14px;font-size:12.5px;color:var(--muted)">อย่างน้อย ${MIN_PW} ตัวอักษร</span>
          <div class="tip" style="margin:0 0 14px">${ic('info')}<div>สมัครแล้ว <b>ลงทะเบียนกิจกรรมได้ทันที</b> แต่การลงทะเบียนครั้งแรกจะมีสถานะ <b>"รออนุมัติ"</b> จนกว่าผู้ดูแลระบบจะตรวจสอบและอนุมัติบัญชี${ext ? ' (แจ้งผลทางอีเมล)' : ''} · หากไม่อนุมัติ การลงทะเบียนจะถูกยกเลิก</div></div>
          <label style="display:flex;gap:10px;align-items:flex-start;margin:0 0 16px;font-size:14px;cursor:pointer">
            <input type="checkbox" name="ack" style="margin-top:4px;width:18px;height:18px;flex:none">
            <span>ข้าพเจ้าได้อ่านและรับทราบ <a href="#" data-action="privacy"><b>ประกาศความเป็นส่วนตัว</b></a> เกี่ยวกับการเก็บและใช้ข้อมูลส่วนบุคคลของระบบนี้แล้ว</span></label>
          <button class="btn btn-primary btn-lg btn-block">${ic('check')} ส่งคำขอสมัครใช้งาน</button>
        </form>`;
    }

    view.innerHTML = `
      <div class="auth">
        <div class="auth-art">
          <svg class="leaf-bg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width=".8">${ICONS.leaf}</svg>
          <div>
            <span class="pill pill-glass">${ic('leaf', 'ic-sm')} Green Somdej Hospital</span>
            <h1>ลงทะเบียนกิจกรรม<br>สิ่งแวดล้อม ง่ายในคลิกเดียว</h1>
            <p>เปิดให้ทั้งพนักงาน ประชาชนทั่วไป จิตอาสา นักศึกษาฝึกงาน และบริษัทผู้รับจ้าง ระบบจำข้อมูลของคุณไว้ ไม่ต้องกรอกชื่อซ้ำทุกครั้ง</p>
            <div class="features">
              <div class="feat"><i>${ic('clock', 'ic-sm')}</i> แตะเลือกวันและเวลา = ลงทะเบียนทันที</div>
              <div class="feat"><i>${ic('history', 'ic-sm')}</i> ดูประวัติการเข้าร่วมกิจกรรมของตนเอง</div>
              <div class="feat"><i>${ic('shield', 'ic-sm')}</i> ทุกบัญชีผ่านการตรวจสอบโดยผู้ดูแลระบบ</div>
              <div class="feat"><i>${ic('install', 'ic-sm')}</i> ติดตั้งเป็นแอปบนคอมพิวเตอร์และมือถือ</div>
            </div>
          </div>
          <small style="opacity:.7;position:relative">© Green Somdej</small>
        </div>
        <div class="auth-form">${right}</div>
      </div>`;

    view.querySelectorAll('input[inputmode="numeric"]').forEach((el) => el.addEventListener('input', () => { el.value = el.value.replace(/\D/g, '').slice(0, 7); }));

    if (mode === 'login') {
      const f = document.getElementById('login-form');
      const idEl = f.employeeId || f.login;
      (lastId ? f.password : idEl).focus();
      bindForm('login-form', 'auth-err', async (f) => {
        let login;
        if (f.employeeId) {
          login = f.employeeId.value;
          if (!/^\d{7}$/.test(login)) throw new Error('กรุณากรอกรหัสพนักงานให้ครบ 7 หลัก');
        } else {
          login = f.login.value.trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) throw new Error('กรุณากรอกอีเมลให้ถูกต้อง');
        }
        if (!f.password.value) throw new Error('กรุณากรอกรหัสผ่าน');
        try {
          const r = await api('login', { login, password: f.password.value });
          afterLogin(r);
        } catch (e) {
          if (e.code === 'BAD_LOGIN') LS.del('gs_last_emp');
          throw e;
        }
      });
    } else if (mode === 'signup' && suType) {
      const f = document.getElementById('signup-form');
      (f.employeeId || f.name).focus();
      loadDepts().then((d) => {
        const sel = document.getElementById('su-dept');
        if (sel) sel.innerHTML = deptOptions(d, '');
        const host = f.hostDeptId;
        if (host && host.options.length <= 1) host.innerHTML = deptOptions(d, '');
      }).catch((e) => toast(e.message, 'err'));
      bindForm('signup-form', 'auth-err', async (f) => {
        const ext = suType !== 'staff';
        if (!ext && !/^\d{7}$/.test(f.employeeId.value)) throw new Error('กรุณากรอกรหัสพนักงานให้ครบ 7 หลัก');
        if (!f.name.value.trim()) throw new Error('กรุณากรอกชื่อ-นามสกุล');
        const email = f.email.value.trim();
        if (ext && !email) throw new Error('กรุณากรอกอีเมล (ใช้เป็นชื่อเข้าสู่ระบบ)');
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('รูปแบบอีเมลไม่ถูกต้อง');
        if (!ext && !f.deptId.value) throw new Error('กรุณาเลือกหน่วยงาน');
        const extra = ext ? readExtFields(suType, f) : {};
        if (f.password.value.length < MIN_PW) throw new Error(`รหัสผ่านต้องมีอย่างน้อย ${MIN_PW} ตัวอักษร`);
        if (f.password.value !== f.confirm.value) throw new Error('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
        if (!f.ack.checked) throw new Error('กรุณาติ๊กรับทราบประกาศความเป็นส่วนตัวก่อน');
        const r = await api('signup', Object.assign({ userType: suType, employeeId: ext ? '' : f.employeeId.value, name: f.name.value,
          deptId: ext ? '' : f.deptId.value, email, password: f.password.value, ack: true, noticeVersion: PRIVACY.VERSION }, extra));
        if (r.token) { afterLogin(r, true); if (r.pending) setTimeout(openPendingWelcome, 700); return; }
        state.signupDone = r.user;
        state.loginMode = ext ? 'external' : 'staff';
        LS.set('gs_last_mode', state.loginMode); LS.set('gs_last_emp', r.user.loginId);
        go('login/sent');
      });
    }
  }

  /** หลังสมัคร: แจ้งว่าลงทะเบียนกิจกรรมได้เลย แต่ครั้งแรกต้องรอผู้ดูแลอนุมัติ */
  function openPendingWelcome() {
    const u = state.user || {};
    openModal(`<div style="text-align:center"><div class="success-ic">${ic('check')}</div><h3>สมัครใช้งานเรียบร้อย</h3>
        <p class="muted" style="margin:6px 0 0">คุณ${esc(firstName(u.name))} · ${esc(u.userTypeLabel || '')}</p></div>
      ${newUserStepsHtml(2)}
      <dl class="kv" style="margin-top:6px"><dt>ชื่อเข้าสู่ระบบ</dt><dd><b>${esc(u.loginId || '')}</b></dd>
        ${u.email ? `<dt>แจ้งผลการอนุมัติทาง</dt><dd>${esc(u.email)}</dd>` : ''}</dl>
      <div class="modal-actions"><a class="btn btn-primary" href="#/activities" data-action="closeModal">${ic('calendar')} เลือกกิจกรรมที่จะลงทะเบียน</a></div>`);
  }

  function afterLogin(r, isNew) {
    setSession(r.token, r.user);
    toast(isNew ? `สร้างบัญชีเรียบร้อย — คุณ${firstName(r.user.name)}` : `ยินดีต้อนรับกลับ คุณ${firstName(r.user.name)}`, 'ok');
    if (r.user.isAdmin) setTimeout(() => toast('บัญชีนี้มีสิทธิ์ผู้ดูแลระบบ — ดูเมนู "ผู้ดูแล"'), 600);
    const back = state.returnTo && !/login/.test(state.returnTo) ? state.returnTo : '#/home';
    state.returnTo = null;
    location.hash = back;
    setTimeout(maybeAskNotice, 800);
  }

  /* ========================= PDPA: ประกาศความเป็นส่วนตัว ========================= */
  function noticeHtml() {
    const yrs = PRIVACY.RETENTION_YEARS || 3;
    return `
      <p class="muted" style="margin:0 0 12px;font-size:13px">เวอร์ชัน ${esc(PRIVACY.VERSION)}</p>
      <div style="max-height:56vh;overflow:auto;padding-right:6px;font-size:14.5px;line-height:1.65">
        <p><b>ผู้ควบคุมข้อมูลส่วนบุคคล:</b> ${esc(PRIVACY.CONTROLLER)}<br><b>ติดต่อเรื่องข้อมูลส่วนบุคคล:</b> ${esc(PRIVACY.CONTACT)}</p>
        <p><b>1. ข้อมูลที่เก็บ</b><br><u>พนักงาน</u>: รหัสพนักงาน ชื่อ-นามสกุล หน่วยงาน และอีเมล (ถ้าท่านกรอก) · <u>บุคคลภายนอก</u> (ประชาชนทั่วไป จิตอาสา นักศึกษาฝึกงาน บริษัทผู้รับจ้าง): ประเภทผู้ใช้ ชื่อ-นามสกุล อีเมล เบอร์โทรศัพท์ และตามประเภท ได้แก่ ชื่อกลุ่ม/สถาบัน/บริษัท คณะ หน่วยงานที่ฝึกงานหรือปฏิบัติงานในโรงพยาบาล และช่วงเวลาฝึกงาน/สัญญา · <u>ผู้ลงทะเบียนหน้างาน</u>: ชื่อ-นามสกุล หน่วยงานหรือสังกัด และอีเมล (บุคคลภายนอก) · รหัสผ่านที่ท่านตั้ง (เก็บเป็นค่าเข้ารหัสทางเดียว ไม่มีผู้ใดอ่านรหัสผ่านจริงได้) · ประวัติการลงทะเบียนและเช็คอินกิจกรรม · วันเวลาเข้าสู่ระบบล่าสุด · บันทึกว่าท่านรับทราบประกาศนี้เมื่อใด</p>
        <p><b>2. วัตถุประสงค์</b><br>ยืนยันตัวตนผู้ใช้ (ผู้ดูแลระบบตรวจสอบข้อมูลก่อนอนุมัติบัญชี และแจ้งผลทางอีเมล) · ติดต่อผู้เข้าร่วมกรณีจำเป็นเกี่ยวกับกิจกรรม · ลงทะเบียน/ยกเลิก/เช็คอินเข้าร่วมกิจกรรมด้านสิ่งแวดล้อมและการอบรม · จัดทำรายงานสถิติภายในหน่วยงาน · ส่งลิงก์แบบประเมินกิจกรรม · ตรวจสอบย้อนหลังเพื่อความปลอดภัยของระบบ</p>
        <p><b>3. ผู้ที่เข้าถึงข้อมูลได้</b><br>เฉพาะผู้ดูแลระบบที่ได้รับมอบหมาย โดยทุกครั้งที่ผู้ดูแลเปิดดูรายชื่อหรือแก้ไขข้อมูลจะมีบันทึกไว้ตรวจสอบ ไม่เปิดเผยข้อมูลแก่บุคคลภายนอก ข้อมูลจัดเก็บบนบริการ Google (Google Workspace / Apps Script) ซึ่งเซิร์ฟเวอร์อาจอยู่นอกประเทศไทย</p>
        <p><b>4. ระยะเวลาเก็บ</b><br>คำขอสมัครที่ยังไม่ได้รับการพิจารณาภายใน 30 วันจะถูกลบ · คำขอที่ไม่อนุมัติจะถูกลบทันที · ข้อมูลอื่นเก็บไม่เกิน ${yrs} ปีนับจากวันจัดกิจกรรมหรือวันที่ใช้งานล่าสุด หลังจากนั้นระบบจะลบบัญชี และปกปิดตัวตนในประวัติ (เหลือเฉพาะสถิติที่ระบุตัวบุคคลไม่ได้)</p>
        <p><b>5. สิทธิของท่าน</b><br>ขอเข้าถึง แก้ไข ลบ ระงับหรือคัดค้านการใช้ข้อมูล และถอนความยินยอมได้ — แก้ไขข้อมูลและ <b>ลบบัญชีด้วยตนเอง</b> ได้ที่เมนู “โปรไฟล์” หรือติดต่อตามช่องทางด้านบน ท่านมีสิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล</p>
        <p><b>6. การรักษาความปลอดภัย</b><br>ตรวจสอบและอนุมัติบัญชีใหม่โดยผู้ดูแลระบบก่อนเข้าใช้งาน · กิจกรรมภายในแสดงเฉพาะผู้ที่มีสิทธิ์ · หน้าเช็คอินหน้างานแสดงชื่อแบบปกปิดบางส่วนและจำกัดจำนวนครั้งการค้นหา · ซ่อนตัวเลขรหัสพนักงานขณะพิมพ์ · จำกัดจำนวนครั้งที่ใส่รหัสผ่านผิด · จำกัดสิทธิ์ผู้ดูแล · เก็บข้อมูลส่วนบุคคลไว้ในไฟล์แยกที่ไม่แชร์ให้ผู้ใช้ทั่วไป</p>
      </div>`;
  }

  /** #/privacy — หน้าประกาศความเป็นส่วนตัว (เปิดได้โดยไม่ต้องเข้าสู่ระบบ ใช้ลิงก์จากหน้าเช็คอิน/โปสเตอร์) */
  async function renderPrivacy() {
    view.innerHTML = `<section class="card card-pad" style="max-width:760px;margin:0 auto">
      <h1 class="page-title">${ic('shield')} ประกาศความเป็นส่วนตัว</h1>${noticeHtml().replace('max-height:56vh;overflow:auto;', '')}</section>`;
  }

  /**
   * #/checkin/<token> — หน้าเช็คอินหน้างาน (จาก QR เช็คอิน: ?ci=<token>)
   * ไม่ต้องเข้าสู่ระบบ · เรียก API ผ่าน fetch แทนหน้า Apps Script (?page=checkin) ซึ่งเปิดไม่ได้บนมือถือ
   * ที่ล็อกอิน Google หลายบัญชี · ใช้เครื่องเดียวเช็คอินหลายคนต่อกันได้ (ปุ่ม "เช็คอินคนถัดไป")
   */
  async function renderCheckin(token) {
    const ORG_LABEL = { volunteer: 'ชื่อกลุ่ม / มูลนิธิ / องค์กร (ถ้ามี)', intern: 'สถาบันการศึกษา *', contractor: 'ชื่อบริษัท / ห้างร้าน *' };
    const wrap = (inner) => `<section class="card card-pad" style="max-width:520px;margin:0 auto">
      <h1 class="page-title" style="display:flex;gap:8px;align-items:center">${ic('scan')} เช็คอินเข้าร่วมกิจกรรม</h1>${inner}</section>`;
    if (!token) { view.innerHTML = wrap(emptyHtml('alert', 'ไม่พบข้อมูล QR', 'กรุณาสแกน QR เช็คอินของกิจกรรมอีกครั้ง')); return; }
    view.innerHTML = wrap(`<div style="text-align:center;padding:30px 0"><span class="spinner" style="color:var(--brand-500)"></span><p class="muted">กำลังโหลดข้อมูลกิจกรรม...</p></div>`);

    const info = await api('checkinInfo', { actToken: token });
    const a = info.activity;
    if (!a) { view.innerHTML = wrap(emptyHtml('alert', 'ไม่พบกิจกรรมนี้', 'QR Code ไม่ถูกต้อง หรือกิจกรรมถูกลบไปแล้ว')); return; }
    const head = `<div style="text-align:center;margin:4px 0 16px"><b style="font-size:17px">${esc(a.name)}</b>
      <div class="muted" style="font-size:13.5px">${ic('calendar', 'ic-sm')} จัดวันที่ ${esc(a.date)}${a.type ? ' · ' + esc(a.type) : ''}</div></div>`;
    if (!a.canCheckInToday) {
      const msg = a.checkinDateStatus === 'before'
        ? `ยังไม่ถึงวันจัดกิจกรรม — เช็คอินได้เฉพาะวันที่ ${esc(a.date)} เท่านั้น`
        : `กิจกรรมนี้จัดไปแล้วเมื่อวันที่ ${esc(a.date)} ไม่สามารถเช็คอินย้อนหลังได้`;
      view.innerHTML = wrap(head + `<div class="tip warn">${ic('alert')}<div>${msg}</div></div>`);
      return;
    }
    const ext = a.externalTypes || [];
    const staffOk = a.staffAllowed !== false;
    let mode = staffOk ? 'staff' : 'external';
    const ack = `<label class="check-line" style="margin-top:8px"><input type="checkbox" name="ack">
      <span>ข้าพเจ้ารับทราบ<a href="#/privacy" target="_blank">ประกาศความเป็นส่วนตัว</a> และยินยอมให้บันทึกข้อมูลข้างต้น เพื่อบันทึกการเข้าร่วมกิจกรรมและจัดทำสถิติของโรงพยาบาล</span></label>`;

    const showEntry = () => {
      view.innerHTML = wrap(head + `
        ${staffOk && ext.length ? `<div class="seg seg-block" style="margin-bottom:14px">
          <button type="button" class="${mode === 'staff' ? 'on' : ''}" data-ci-mode="staff">${ic('shield', 'ic-sm')} พนักงาน รพ.</button>
          <button type="button" class="${mode === 'external' ? 'on' : ''}" data-ci-mode="external">${ic('users', 'ic-sm')} บุคคลภายนอก</button></div>` : ''}
        <form id="ci-form" novalidate>
          <div class="form-error" id="ci-err"></div>
          ${mode === 'staff'
            ? `<div class="field"><label for="ci-id">กรอกรหัสพนักงาน (7 หลัก) ที่ใช้ตอนลงทะเบียน</label>${idInput('ci-id', '')}</div>`
            : `<div class="field"><label for="ci-email">กรอกอีเมลที่ใช้ลงทะเบียน</label><input class="input" id="ci-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" required></div>`}
          <button class="btn btn-primary btn-lg btn-block">${ic('check')} ยืนยันเข้าร่วม</button>
        </form>`);
      view.querySelectorAll('[data-ci-mode]').forEach((b) => b.addEventListener('click', () => { mode = b.dataset.ciMode; showEntry(); }));
      const inp = document.getElementById(mode === 'staff' ? 'ci-id' : 'ci-email');
      if (inp) inp.focus();
      bindForm('ci-form', 'ci-err', async (f) => {
        if (mode === 'staff') {
          const id = String(f.employeeId.value || '').replace(/\D/g, '');
          if (id.length !== 7) throw new Error('กรุณากรอกรหัสพนักงานให้ครบ 7 หลัก');
          const r = await api('checkinStaff', { actToken: token, employeeId: id });
          if (r.notRegistered) showWalkIn(id); else showResult(r);
        } else {
          const email = String(f.email.value || '').trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('กรุณากรอกอีเมลให้ถูกต้อง');
          const r = await api('checkinEmail', { actToken: token, email });
          if (r.notRegistered) showWalkInExt(r.email || email); else showResult(r);
        }
      });
    };

    const showWalkIn = (empId) => {
      view.innerHTML = wrap(head + `
        <div class="tip warn" style="margin-bottom:12px">${ic('info')}<div><b>ไม่พบการลงทะเบียนล่วงหน้า</b><br>กรอกข้อมูลด้านล่างเพื่อลงทะเบียนหน้างานและเช็คอินได้ทันที</div></div>
        <form id="ci-form" novalidate>
          <div class="form-error" id="ci-err"></div>
          <div class="field"><label>รหัสพนักงาน</label><input class="input code" value="${esc(empId)}" readonly></div>
          <div class="field"><label>ชื่อ-นามสกุล</label><input class="input" name="name" maxlength="120" placeholder="เช่น สมชาย ใจดี" required></div>
          <div class="field"><label>หน่วยงาน</label><select class="input" name="deptId">${deptOptions(info.departments || [], '')}</select></div>
          ${ack}
          <button class="btn btn-primary btn-lg btn-block" style="margin-top:12px">${ic('check')} ลงทะเบียนหน้างาน + เช็คอิน</button>
          <button type="button" class="btn btn-ghost btn-block" id="ci-back" style="margin-top:8px">ยกเลิก / กรอกรหัสใหม่</button>
        </form>`);
      document.getElementById('ci-back').addEventListener('click', showEntry);
      bindForm('ci-form', 'ci-err', async (f) => {
        if (!f.name.value.trim()) throw new Error('กรุณากรอกชื่อ-นามสกุล');
        if (!f.deptId.value) throw new Error('กรุณาเลือกหน่วยงาน');
        if (!f.ack.checked) throw new Error('กรุณาติ๊กรับทราบประกาศความเป็นส่วนตัวก่อน');
        showResult(await api('checkinWalkIn', { actToken: token, employeeId: empId, name: f.name.value.trim(), departmentId: f.deptId.value, ack: true }));
      });
    };

    const showWalkInExt = (email) => {
      view.innerHTML = wrap(head + `
        <div class="tip warn" style="margin-bottom:12px">${ic('info')}<div><b>ไม่พบการลงทะเบียนล่วงหน้า</b><br>กรอกข้อมูลด้านล่างเพื่อลงทะเบียนหน้างานและเช็คอินได้ทันที</div></div>
        <form id="ci-form" novalidate>
          <div class="form-error" id="ci-err"></div>
          <div class="field"><label>อีเมล</label><input class="input" value="${esc(email)}" readonly></div>
          <div class="field"><label>ประเภทผู้เข้าร่วม</label><select class="input" name="userType">
            ${ext.length === 1 ? '' : '<option value="">— เลือกประเภท —</option>'}${ext.map((t) => `<option value="${esc(t.id)}">${esc(t.label)}</option>`).join('')}</select></div>
          <div class="field"><label>ชื่อ-นามสกุล</label><input class="input" name="name" maxlength="120" placeholder="เช่น สมหญิง รักษ์โลก" required></div>
          <div class="field" id="ci-org-wrap"><label id="ci-org-label">สังกัด / องค์กร</label><input class="input" name="org" maxlength="150"></div>
          ${ack}
          <button class="btn btn-primary btn-lg btn-block" style="margin-top:12px">${ic('check')} ลงทะเบียนหน้างาน + เช็คอิน</button>
          <button type="button" class="btn btn-ghost btn-block" id="ci-back" style="margin-top:8px">ยกเลิก / กรอกใหม่</button>
        </form>`);
      const f = document.getElementById('ci-form');
      const syncOrg = () => {
        const t = f.userType.value;
        document.getElementById('ci-org-wrap').style.display = t && t !== 'public' ? '' : 'none';
        document.getElementById('ci-org-label').textContent = ORG_LABEL[t] || 'สังกัด / องค์กร';
      };
      f.userType.addEventListener('change', syncOrg); syncOrg();
      document.getElementById('ci-back').addEventListener('click', showEntry);
      bindForm('ci-form', 'ci-err', async (f) => {
        const t = f.userType.value, name = f.name.value.trim(), org = f.org.value.trim();
        if (!t) throw new Error('กรุณาเลือกประเภทผู้เข้าร่วม');
        if (!name) throw new Error('กรุณากรอกชื่อ-นามสกุล');
        if ((t === 'intern' || t === 'contractor') && !org) throw new Error('กรุณากรอก' + ORG_LABEL[t].replace(' *', ''));
        if (!f.ack.checked) throw new Error('กรุณาติ๊กรับทราบประกาศความเป็นส่วนตัวก่อน');
        showResult(await api('checkinWalkInExt', { actToken: token, email, userType: t, name, org, ack: true }));
      });
    };

    const showResult = (r) => {
      const ok = r.success, again = r.alreadyCheckedIn;
      const bg = ok ? '' : again ? 'background:linear-gradient(135deg,#f59e0b,#fbbf24);box-shadow:0 0 0 10px #fef3c7' : 'background:linear-gradient(135deg,#dc2626,#ef4444);box-shadow:0 0 0 10px #fee2e2';
      view.innerHTML = wrap(head + `<div style="text-align:center">
        <div class="success-ic" style="${bg}">${ic(ok ? 'check' : again ? 'clock' : 'x')}</div>
        <h2 style="margin:0">${ok ? 'เช็คอินสำเร็จ!' : again ? 'เช็คอินไปแล้ว' : 'ไม่สามารถเช็คอินได้'}</h2>
        <p style="margin:8px 0 0">${esc(r.message || '')}</p></div>
        ${r.employeeName ? `<dl class="kv" style="margin-top:14px">
          <dt>ชื่อ-นามสกุล</dt><dd>${esc(r.employeeName)}</dd>
          ${r.deptName ? `<dt>หน่วยงาน/สังกัด</dt><dd>${esc(r.deptName)}</dd>` : ''}
          ${r.checkedInAt ? `<dt>เวลาเช็คอิน</dt><dd>${esc(r.checkedInAt)}</dd>` : ''}</dl>` : ''}
        <button type="button" class="btn btn-primary btn-lg btn-block" id="ci-next" style="margin-top:18px">${ic('users')} เช็คอินคนถัดไป</button>`);
      document.getElementById('ci-next').addEventListener('click', showEntry);
    };

    showEntry();
  }

  function openPrivacy(askAck) {
    openModal(`<h3>ประกาศความเป็นส่วนตัว</h3>${noticeHtml()}
      <div class="modal-actions">${askAck
        ? `<button class="btn btn-primary" data-action="ackNotice">${ic('check')} รับทราบ</button>`
        : `<button class="btn btn-primary" data-action="closeModal">ปิด</button>`}</div>`);
  }

  /** ผู้ใช้เดิมที่ยังไม่เคยรับทราบประกาศฉบับปัจจุบัน → ขอให้รับทราบหลังเข้าสู่ระบบ */
  function maybeAskNotice() {
    if (!state.token || !state.user) return;
    if (state.route === 'checkin') return;   // หน้าเช็คอินหน้างาน: ไม่เด้งกล่องรบกวน
    if (state.user.noticeVersion === PRIVACY.VERSION) return;
    if (document.querySelector('#modal-root .modal')) return;
    openPrivacy(true);
  }

  function openDeleteAccount() {
    openModal(`<h3>ลบบัญชีและข้อมูลของฉัน</h3>
      <div class="tip warn" style="margin:12px 0">${ic('alert')}<div>การลบนี้<b>ย้อนกลับไม่ได้</b> ระบบจะลบบัญชี ยกเลิกการลงทะเบียนกิจกรรมที่ยังไม่ถึงวัน และปกปิดตัวตนในประวัติที่ผ่านมา (เหลือไว้เป็นสถิติที่ระบุตัวท่านไม่ได้) หากต้องการใช้งานอีกต้องสร้างบัญชีใหม่</div></div>
      <form id="del-form">
        <div class="form-error" id="del-err"></div>
        <div class="field"><label>ยืนยันด้วยรหัสผ่านของคุณ</label>${pwInput('password', 'current-password')}</div>
        <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="closeModal">ยกเลิก</button><button class="btn btn-danger">${ic('trash')} ลบบัญชีถาวร</button></div>
      </form>`);
    bindForm('del-form', 'del-err', async (f) => {
      if (!f.password.value) throw new Error('กรุณากรอกรหัสผ่าน');
      await api('deleteAccount', { password: f.password.value });
      closeModal(); clearSession(); LS.del('gs_last_emp');
      toast('ลบบัญชีและข้อมูลของคุณแล้ว', 'ok'); go('home');
    });
  }

  function bindForm(formId, errId, handler) {
    const f = document.getElementById(formId);
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = document.getElementById(errId);
      err.classList.remove('show');
      const btn = f.querySelector('button:not([type="button"])');
      const html = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> กำลังดำเนินการ...';
      try { await handler(f); } catch (ex) {
        err.textContent = ex.message; void err.offsetWidth; err.classList.add('show');
      } finally { if (document.body.contains(btn)) { btn.disabled = false; btn.innerHTML = html; } }
    });
  }

  /* ========================= MODAL / TOAST ========================= */
  let modalResolve = null;
  function openModal(html, cls) {
    document.getElementById('modal-root').innerHTML = `<div class="modal-back" data-action="backdrop"><div class="modal ${cls || ''}" role="dialog" aria-modal="true">${html}</div></div>`;
  }
  function closeModal() {
    document.getElementById('modal-root').innerHTML = '';
    if (modalResolve) { modalResolve(false); modalResolve = null; }
  }
  function confirmModal(title, body, okText, danger) {
    return new Promise((resolve) => {
      openModal(`<h3>${title}</h3><p style="margin-top:10px">${body}</p>
        <div class="modal-actions"><button class="btn btn-ghost" data-action="closeModal">ไม่ใช่ตอนนี้</button>
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-action="confirmOk">${okText}</button></div>`);
      modalResolve = resolve;
    });
  }
  function toast(msg, kind) {
    const root = document.getElementById('toast-root');
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.innerHTML = `${ic(kind === 'err' ? 'alert' : kind === 'ok' ? 'check' : 'info')}<span>${esc(msg)}</span>`;
    root.appendChild(el);
    setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 320); }, kind === 'err' ? 5000 : 3200);
  }

  /* =========================== INSTALL =========================== */
  let deferredPrompt = null;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('ติดตั้งแอปเรียบร้อยแล้ว', 'ok'); renderChrome(); });

  async function doInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (e) { /* ignore */ }
      deferredPrompt = null;
      return;
    }
    openModal(`<div style="display:flex;justify-content:space-between;gap:10px">
        <div style="display:flex;gap:14px;align-items:center"><img src="icons/icon-192.png" width="56" height="56" style="border-radius:16px" alt="">
        <div><h3>ติดตั้งแอป Green Somdej</h3><p class="muted" style="margin:0;font-size:13.5px">${isIOS() ? 'สำหรับ iPhone / iPad' : 'ทำตามขั้นตอนตามอุปกรณ์ของคุณ'}</p></div></div>
        <button class="icon-btn" data-action="closeModal" aria-label="ปิด">${ic('x')}</button></div>
      ${isIOS() ? `<ol style="margin-top:18px;display:grid;gap:8px;padding-left:20px">
          <li>เปิดหน้านี้ด้วย <b>Safari</b></li>
          <li>แตะปุ่ม <b>แชร์</b> ${ic('share', 'ic-sm')} ที่แถบด้านล่าง</li>
          <li>เลื่อนหา <b>เพิ่มไปยังหน้าจอโฮม</b> แล้วแตะ <b>เพิ่ม</b></li></ol>`
        : `<div style="margin-top:6px">${platformsHtml().replace('class="platforms"', 'class="platforms" style="grid-template-columns:1fr"')}</div>`}`);
  }

  /* ============================ THEME ============================ */
  function resolvedTheme() {
    const t = LS.get('gs_theme') || 'auto';
    if (t !== 'auto') return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme() {
    const t = LS.get('gs_theme') || 'auto';
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }

  /* ============================ ACTIONS ============================ */
  const findAct = (id) => (state.current && state.current.id === id ? state.current
    : (state.acts || []).find((a) => a.id === id) || (state.adminActs || []).find((a) => a.id === id)
      || (adm.reg && adm.reg.activity.id === id ? adm.reg.activity : null));
  const ACTIONS = {
    quickReg: (el) => quickRegister(el),
    admNew: () => openActForm(''),
    admEdit: (el) => openActForm(el.dataset.id),
    admOpen: (el) => go('admin/act/' + encodeURIComponent(el.dataset.id)),
    admFilter: (el) => { adm.filter = el.dataset.v; if (state.redrawAdmin) state.redrawAdmin(); },
    regFilter: (el) => { adm.regFilter = el.dataset.v; drawRegList(); },
    admCheck: (el) => admToggleCheck(el),
    admRemove: (el) => admRemoveReg(el),
    admCsv: () => admCsv(),
    sbAdd: () => slotBuilderAdd(),
    admCiQr: (el) => { const a = findAct(el.dataset.id); if (a) openCheckinQr(a); },
    admCiDownload: async () => {
      if (!adm.ci) return;
      await logoReady;
      saveBlob(await canvasToBlob(renderQR(document.createElement('canvas'), adm.ci.url, 1600)), `QR_เช็คอิน_${safeFile(adm.ci.name)}.png`);
      toast('ดาวน์โหลด QR เช็คอินแล้ว', 'ok');
    },
    admCiCopy: async () => {
      if (!adm.ci) return;
      try { await navigator.clipboard.writeText(adm.ci.url); toast('คัดลอกลิงก์แล้ว', 'ok'); } catch (e) { window.prompt('คัดลอกลิงก์นี้', adm.ci.url); }
    },
    admAdmins: () => openAdminsModal(),
    admVis: () => openVisibilityMatrix(),
    admVisOne: (el) => openVisibilityMatrix(el.dataset.id),
    visCol: (el) => visToggleColumn(el.dataset.v),
    visScope: (el) => { adm.visAll = el.dataset.v === 'all'; openVisibilityMatrix(); },
    admRevoke: (el) => admRevoke(el),
    open: (el) => go('act/' + encodeURIComponent(el.dataset.id)),
    qr: (el) => { const a = findAct(el.dataset.id); if (a) openQrModal(a); },
    slot: (el) => onSlot(el),
    cancel: () => onCancel(),
    ics: () => downloadIcs(),
    downloadQr: (el) => { const a = findAct(el.dataset.id) || state.current; if (a) downloadQr(a).catch((e) => toast(e.message, 'err')); },
    poster: (el) => { const a = findAct(el.dataset.id) || state.current; if (a) openPosterModal(a); },
    posterFmt: (el) => {
      poster.fmt = el.dataset.v;
      document.querySelectorAll('#poster-seg button').forEach((b) => b.classList.toggle('on', b.dataset.v === poster.fmt));
      renderPosterPreview();
    },
    posterDownload: async () => {
      if (!poster.blob) await renderPosterPreview();
      if (!poster.blob) return;
      saveBlob(poster.blob, posterFileName());
      toast('ดาวน์โหลดโปสเตอร์แล้ว', 'ok');
    },
    posterShare: async () => {
      if (!poster.blob) await renderPosterPreview();
      const file = new File([poster.blob], posterFileName(), { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: poster.a.name, text: `ร่วมกิจกรรม: ${poster.a.name}\nลงทะเบียน: ${actUrl(poster.a.id)}` }).catch(() => {});
      } else {
        saveBlob(poster.blob, posterFileName());
        toast('อุปกรณ์นี้แชร์ไฟล์ไม่ได้ — ดาวน์โหลดให้แทนแล้ว');
      }
    },
    copyLink: async (el) => {
      const a = findAct(el.dataset.id) || state.current; if (!a) return;
      try { await navigator.clipboard.writeText(actUrl(a.id)); toast('คัดลอกลิงก์แล้ว', 'ok'); }
      catch (e) { window.prompt('คัดลอกลิงก์นี้', actUrl(a.id)); }
    },
    share: () => { const a = state.current; if (a && navigator.share) navigator.share({ title: a.name, text: `ลงทะเบียนกิจกรรม: ${a.name}`, url: actUrl(a.id) }).catch(() => {}); },
    gotoLogin: () => { state.returnTo = location.hash; go('login'); },
    authMode: (el) => go(el.dataset.v === 'signup' ? 'login/signup' : 'login'),
    loginMode: (el) => { state.loginMode = el.dataset.v; renderLogin(''); },
    suType: (el) => go('login/signup/' + el.dataset.v),
    pendFilter: (el) => { adm.pendFilter = el.dataset.v; openPendingUsers(adm.pending); },
    audAll: () => { document.querySelectorAll('#act-form input[name="aud"]:not(:disabled)').forEach((x) => { x.checked = true; }); },
    togglePw: (el) => {
      const input = el.parentElement.querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      el.innerHTML = ic(show ? 'eyeOff' : 'eye', 'ic-sm');
    },
    filterHist: (el) => { state.histFilter = el.dataset.v; if (state.redrawHist) state.redrawHist(); },
    filterType: (el) => { state.typeFilter = el.dataset.v; if (state.redrawActs) state.redrawActs(); },
    install: () => doInstall(),
    toggleTheme: () => { LS.set('gs_theme', resolvedTheme() === 'dark' ? 'light' : 'dark'); applyTheme(); renderChrome(); },
    setTheme: (el) => { LS.set('gs_theme', el.dataset.v); applyTheme(); renderChrome(); renderProfile(); },
    editProfile: () => editProfile().catch((e) => toast(e.message, 'err')),
    changePw: () => changePw(),
    privacy: () => openPrivacy(false),
    admPending: () => openPendingUsers(),
    admReview: (el) => reviewUser(el.dataset.emp, el.dataset.ok === '1'),
    deleteAccount: () => openDeleteAccount(),
    ackNotice: async () => {
      try {
        const u = await api('ackNotice', { noticeVersion: PRIVACY.VERSION });
        state.user = u; LS.set('gs_user', u); closeModal(); toast('บันทึกการรับทราบแล้ว', 'ok');
      } catch (e) { toast(e.message, 'err'); }
    },
    logout: async () => {
      const ok = await confirmModal('ออกจากระบบ?', 'คุณสามารถเข้าสู่ระบบใหม่ได้ทุกเมื่อ', 'ออกจากระบบ', true);
      if (!ok) return;
      clearSession(); toast('ออกจากระบบแล้ว'); go('home');
    },
    resetDemo: () => { window.MockApi.reset(); clearSession(); LS.del('gs_last_emp'); LS.del('gs_depts'); state.depts = null; toast('ล้างข้อมูลสาธิตแล้ว', 'ok'); go('home'); },
    closeModal: () => closeModal(),
    confirmOk: () => { const r = modalResolve; modalResolve = null; closeModal(); if (r) r(true); },
    backdrop: (el, e) => { if (e.target === el) closeModal(); },
    scrollQr: () => { const q = document.querySelector('.qr-card'); if (q) q.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    reload: () => route()
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-stop]')) return;
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const fn = ACTIONS[el.dataset.action];
    if (!fn) return;
    if (el.dataset.action === 'backdrop') { fn(el, e); return; }
    e.preventDefault(); e.stopPropagation();
    fn(el, e);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.act-card')) { e.preventDefault(); e.target.click(); }
  });

  /* ============================= BOOT ============================= */
  const ROUTES = { home: renderHome, activities: renderActivities, act: renderDetail, history: renderHistory, profile: renderProfile, login: renderLogin, admin: renderAdmin, privacy: renderPrivacy, checkin: renderCheckin };

  applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => renderChrome());

  if (DEMO) {
    document.getElementById('demo-bar').innerHTML = `<div class="demo-bar">โหมดสาธิต — ข้อมูลตัวอย่างเก็บในเบราว์เซอร์นี้เท่านั้น · สมัครใหม่ (พนักงาน/บุคคลภายนอก) ต้องให้ผู้ดูแลอนุมัติก่อนจึงเข้าสู่ระบบได้ · ผู้ดูแลทดลอง: <b>9999999</b> / <b>admin1234</b></div>`;
  }

  // ลิงก์จาก QR: ?act=ID → เปิดหน้ากิจกรรมนั้น
  const qs = new URLSearchParams(location.search);
  if (qs.get('act')) {
    history.replaceState(null, '', location.pathname + '#/act/' + encodeURIComponent(qs.get('act')));
  } else if (qs.get('ci')) {
    // ลิงก์จาก QR เช็คอินหน้างาน: ?ci=TOKEN → หน้าเช็คอิน (ไม่ต้องเข้าสู่ระบบ)
    history.replaceState(null, '', location.pathname + '#/checkin/' + encodeURIComponent(qs.get('ci')));
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('hashchange', () => { refreshMe(); });
  setTimeout(refreshMe, 1500);
  route();

  if (state.token) {
    api('me').then((u) => { state.user = u; LS.set('gs_user', u); renderChrome(); maybeAskNotice(); }).catch(() => {});
  }

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
