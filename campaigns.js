/*
 * ปฏิทินรณรงค์วันสิ่งแวดล้อม + ตัววาดโปสการ์ด (ใช้ร่วมกันใน index.html และ campaign.html)
 *
 * วิธีเพิ่ม/แก้แคมเปญ: แก้รายการ CAMPAIGNS ด้านล่าง
 *   date  : "MM-DD" สำหรับวันที่ตายตัว หรือใช้ rule (ดูตัวอย่าง Earth Hour / ลอยกระทง)
 *   lead  : ขึ้นแบนเนอร์และโปสการ์ดอัตโนมัติก่อนถึงวันกี่วัน (ค่าเริ่มต้น 7)
 *   grace : แสดงต่อหลังวันจริงอีกกี่วัน (ค่าเริ่มต้น 1)
 *
 * ลอยกระทงเป็นวันตามจันทรคติ ต้องใส่วันที่ของแต่ละปีไว้ใน LOY_KRATHONG
 * ** ตรวจสอบกับปฏิทินทางการก่อนใช้ทุกปี ** ถ้าไม่มีปีนั้นในตาราง แคมเปญลอยกระทงจะไม่ขึ้น
 *
 * ทดสอบล่วงหน้า: เปิด campaign.html?date=2027-06-01 (สมมติว่าวันนี้คือวันนั้น)
 *              หรือ campaign.html?campaign=earthday (บังคับแสดงแคมเปญนั้น)
 */
(function () {
  'use strict';

  const LOY_KRATHONG = {
    2026: '2026-11-24',
    2027: '2027-11-13' // ตรวจสอบอีกครั้ง
  };

  const CAMPAIGNS = [
    {
      id: 'forest', date: '01-14', icon: '🌳',
      name: 'วันอนุรักษ์ทรัพยากรป่าไม้แห่งชาติ',
      slogan: 'ป่าคือบ้านของทุกชีวิต', colors: ['#0f4d2f', '#3f9b5a'],
      hashtag: '#รักษ์ป่า',
      actions: ['ใช้กระดาษสองหน้าก่อนทิ้ง', 'เลือกเอกสารออนไลน์แทนการพิมพ์', 'ปลูกต้นไม้อย่างน้อย 1 ต้น', 'ไม่ซื้อผลิตภัณฑ์จากไม้ผิดกฎหมาย'],
      tips: ['ตั้งค่าเครื่องพิมพ์ให้พิมพ์สองหน้าเป็นค่าเริ่มต้น', 'ส่งเอกสารภายในผ่านไฟล์แทนกระดาษ', 'ร่วมปลูกและดูแลต้นไม้ในพื้นที่โรงพยาบาล']
    },
    {
      id: 'wetlands', date: '02-02', icon: '🦆',
      name: 'วันพื้นที่ชุ่มน้ำโลก',
      slogan: 'พื้นที่ชุ่มน้ำ ฟองน้ำธรรมชาติของโลก', colors: ['#134e5e', '#4f9e8f'],
      hashtag: '#WorldWetlandsDay',
      actions: ['ไม่ทิ้งขยะลงแหล่งน้ำ', 'ลดการใช้สารเคมีในบ้าน', 'ร่วมเก็บขยะริมน้ำ'],
      tips: ['ใช้น้ำยาทำความสะอาดที่ย่อยสลายได้', 'ไม่เทน้ำมันใช้แล้วลงท่อ', 'ชวนครอบครัวไปเรียนรู้ธรรมชาติริมน้ำ']
    },
    {
      id: 'water', date: '03-22', icon: '💧',
      name: 'วันน้ำโลก',
      slogan: 'ทุกหยดมีค่า ใช้อย่างรู้คุณค่า', colors: ['#0b3d6b', '#3a8fd1'],
      hashtag: '#วันน้ำโลก',
      actions: ['ปิดก๊อกขณะแปรงฟัน', 'แจ้งซ่อมก๊อกน้ำรั่วทันที', 'นำน้ำล้างผักไปรดต้นไม้', 'พกขวดน้ำส่วนตัว'],
      tips: ['ก๊อกน้ำรั่วซึมเพียงเล็กน้อยก็สูญน้ำได้มากในหนึ่งวัน', 'อาบน้ำด้วยฝักบัวแทนการตักอาบ', 'รองน้ำใส่แก้วแปรงฟัน']
    },
    {
      id: 'earthhour', icon: '💡', lead: 5,
      rule: y => lastWeekday(y, 2, 6), // เสาร์สุดท้ายของเดือนมีนาคม
      name: 'Earth Hour ปิดไฟ 1 ชั่วโมง',
      slogan: 'ปิดไฟที่ไม่จำเป็น 20:30–21:30 น.', colors: ['#141e30', '#35577d'],
      hashtag: '#EarthHour',
      actions: ['ปิดไฟ 1 ชั่วโมงคืนนี้', 'ถอดปลั๊กเครื่องใช้ไฟฟ้าที่ไม่ใช้', 'ตั้งแอร์ 25–26 องศา'],
      tips: ['ปิดไฟและจอคอมพิวเตอร์ทุกครั้งที่ออกจากห้อง', 'เปลี่ยนเป็นหลอด LED', 'ใช้แสงธรรมชาติในเวลากลางวัน']
    },
    {
      id: 'earthday', date: '04-22', icon: '🌏',
      name: 'วันคุ้มครองโลก (Earth Day)',
      slogan: 'โลกมีใบเดียว ช่วยกันดูแล', colors: ['#14532d', '#2f86a6'],
      hashtag: '#EarthDay',
      actions: ['แยกขยะทุกวัน', 'ปฏิเสธพลาสติกใช้ครั้งเดียว', 'เดินหรือปั่นจักรยานระยะใกล้', 'ปิดไฟเมื่อไม่ใช้'],
      tips: ['แยกขยะเป็น 4 ประเภท: ทั่วไป รีไซเคิล อินทรีย์ อันตราย', 'พกถุงผ้าและแก้วส่วนตัว', 'ซ่อมก่อนซื้อใหม่']
    },
    {
      id: 'biodiversity', date: '05-22', icon: '🦋',
      name: 'วันความหลากหลายทางชีวภาพสากล',
      slogan: 'ทุกชีวิตเชื่อมโยงกัน', colors: ['#3b1f5c', '#7a5fb0'],
      hashtag: '#BiodiversityDay',
      actions: ['ปลูกพืชพื้นถิ่น', 'ไม่ซื้อสัตว์ป่าหรือชิ้นส่วนสัตว์ป่า', 'ลดการใช้ยาฆ่าแมลง'],
      tips: ['ปลูกไม้ดอกที่ผึ้งและผีเสื้อชอบ', 'เลือกอาหารทะเลที่จับอย่างยั่งยืน', 'ไม่ปล่อยสัตว์ต่างถิ่นลงธรรมชาติ']
    },
    {
      id: 'environment', date: '06-05', icon: '🌱', lead: 10,
      name: 'วันสิ่งแวดล้อมโลก',
      slogan: 'เริ่มที่ตัวเรา เพื่อโลกที่ยั่งยืน', colors: ['#0c4a2e', '#4caf50'],
      hashtag: '#WorldEnvironmentDay',
      actions: ['งดใช้หลอดและแก้วพลาสติก', 'แยกขยะก่อนทิ้ง', 'ทานอาหารให้หมดจาน', 'ใช้บันไดแทนลิฟต์ 1–2 ชั้น'],
      tips: ['ลดขยะอาหารด้วยการตักแต่พอดี', 'นำขยะอินทรีย์ไปทำปุ๋ยหมัก', 'เลือกสินค้าที่มีฉลากเขียว']
    },
    {
      id: 'ocean', date: '06-08', icon: '🌊',
      name: 'วันมหาสมุทรโลก',
      slogan: 'ทะเลสะอาด เริ่มจากบนบก', colors: ['#03305a', '#1c8fb8'],
      hashtag: '#WorldOceansDay',
      actions: ['ไม่ทิ้งขยะบนชายหาด', 'ลดขวดพลาสติก', 'ใช้ครีมกันแดดที่เป็นมิตรกับปะการัง'],
      tips: ['ขยะพลาสติกบนบกไหลลงทะเลผ่านท่อและแม่น้ำ', 'ร่วมกิจกรรมเก็บขยะชายหาด', 'ไม่ซื้อของที่ระลึกจากปะการังหรือเปลือกหอยหายาก']
    },
    {
      id: 'plasticbag', date: '07-03', icon: '🛍️',
      name: 'วันปลอดถุงพลาสติกสากล',
      slogan: 'ปฏิเสธถุง พกถุงผ้า', colors: ['#5c2a0c', '#c0703a'],
      hashtag: '#PlasticBagFreeDay',
      actions: ['พกถุงผ้าทุกวัน', 'บอก "ไม่รับถุง" เมื่อซื้อของชิ้นเล็ก', 'ใช้ปิ่นโตหรือกล่องข้าวส่วนตัว'],
      tips: ['ถุงพลาสติกใช้เวลาย่อยสลายนานหลายร้อยปี', 'เก็บถุงผ้าไว้ในกระเป๋าหรือรถ', 'นำถุงพลาสติกที่มีอยู่กลับมาใช้ซ้ำ']
    },
    {
      id: 'ozone', date: '09-16', icon: '☀️',
      name: 'วันโอโซนโลก',
      slogan: 'ปกป้องชั้นโอโซน ปกป้องชีวิต', colors: ['#7a3b00', '#e0a030'],
      hashtag: '#OzoneDay',
      actions: ['ล้างแอร์ตามกำหนด', 'เลือกเครื่องใช้ไฟฟ้าเบอร์ 5', 'ทิ้งตู้เย็นและแอร์เก่าอย่างถูกวิธี'],
      tips: ['สารทำความเย็นรุ่นเก่าทำลายชั้นโอโซน', 'ส่งเครื่องใช้ไฟฟ้าเก่าให้ผู้รับกำจัดที่ได้มาตรฐาน', 'ทาครีมกันแดดเมื่อออกแดด']
    },
    {
      id: 'cleanup', icon: '🧹',
      rule: y => nthWeekday(y, 8, 6, 3), // เสาร์ที่ 3 ของเดือนกันยายน
      name: 'World Cleanup Day วันเก็บขยะโลก',
      slogan: 'เก็บคนละนิด โลกสะอาดขึ้นมาก', colors: ['#1f3d1a', '#6aa84f'],
      hashtag: '#WorldCleanupDay',
      actions: ['เก็บขยะรอบที่ทำงาน 15 นาที', 'แยกขยะที่เก็บได้', 'ชวนเพื่อนร่วมเก็บขยะ'],
      tips: ['สวมถุงมือทุกครั้งที่เก็บขยะ', 'แยกขวดและกระป๋องไปรีไซเคิล', 'ถ่ายภาพก่อน–หลังเพื่อชวนคนอื่น']
    },
    {
      id: 'loykrathong', icon: '🪷', lead: 21, grace: 1, special: 'krathong',
      rule: y => LOY_KRATHONG[y] ? parseISO(LOY_KRATHONG[y]) : null,
      name: 'ลอยกระทงรักษ์โลก',
      slogan: 'ขอขมาแม่น้ำ ด้วยกระทงที่แม่น้ำรับได้', colors: ['#0b1f4a', '#2b5aa0'],
      hashtag: '#ลอยกระทงรักษ์โลก',
      actions: ['ใช้กระทงจากวัสดุธรรมชาติ', '1 ครอบครัว 1 กระทง', 'ใช้ไม้กลัดแทนตะปูและลวดเย็บ', 'ลอยกระทงออนไลน์'],
      tips: ['เลือกกระทงจากหยวกกล้วย ใบตอง ขนมปัง หรือมันสำปะหลัง', 'ไม่ใช้โฟม พลาสติก ตะปู หรือลวดเย็บกระดาษ', 'ลอยกระทงรวมกันครอบครัวละ 1 กระทง ช่วยลดขยะได้มาก', 'กระทงขนมปังเหมาะกับแหล่งน้ำที่มีปลา ไม่ควรลอยจำนวนมากในน้ำนิ่ง']
    },
    {
      id: 'thaienv', date: '12-04', icon: '🍃',
      name: 'วันสิ่งแวดล้อมไทย',
      slogan: 'รักษ์สิ่งแวดล้อม รักษ์บ้านเกิด', colors: ['#0c4a2e', '#7cb342'],
      hashtag: '#วันสิ่งแวดล้อมไทย',
      actions: ['แยกขยะที่บ้านและที่ทำงาน', 'ลดใช้พลาสติกใช้ครั้งเดียว', 'ประหยัดไฟและน้ำ'],
      tips: ['แยกขยะติดเชื้อออกจากขยะทั่วไปในโรงพยาบาล', 'พกแก้วน้ำส่วนตัวมาทำงาน', 'ใช้รถสาธารณะหรือเดินทางร่วมกัน']
    },
    {
      id: 'soil', date: '12-05', icon: '🌾',
      name: 'วันดินโลก',
      slogan: 'ดินดี ชีวิตดี', colors: ['#4a2c12', '#a87a3d'],
      hashtag: '#WorldSoilDay',
      actions: ['ทำปุ๋ยหมักจากเศษอาหาร', 'ลดใช้สารเคมีในสวน', 'ปลูกพืชคลุมดิน'],
      tips: ['เศษผักผลไม้ทำปุ๋ยหมักได้', 'ไม่เผาเศษใบไม้ นำไปคลุมดินแทน', 'ทิ้งถ่านไฟฉายและขยะอันตรายแยกจากขยะทั่วไป']
    }
  ];

  /* ---------------- วันที่ ---------------- */
  const DAY = 86400000;
  function parseISO(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function lastWeekday(y, month, wd) {
    const d = new Date(y, month + 1, 0);
    while (d.getDay() !== wd) d.setDate(d.getDate() - 1);
    return d;
  }
  function nthWeekday(y, month, wd, n) {
    const d = new Date(y, month, 1);
    while (d.getDay() !== wd) d.setDate(d.getDate() + 1);
    d.setDate(d.getDate() + (n - 1) * 7);
    return d;
  }
  function dateOf(c, y) {
    if (c.rule) return c.rule(y);
    const [m, d] = c.date.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function diffDays(a, b) { return Math.round((startOfDay(a) - startOfDay(b)) / DAY); }

  const params = new URLSearchParams(location.search);
  function today() {
    const p = params.get('date');
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) return parseISO(p);
    return startOfDay(new Date());
  }

  /* ครั้งถัดไปของแต่ละแคมเปญ (รวมช่วงที่เพิ่งผ่านไปไม่เกิน grace วัน) */
  function nextOccurrence(c, from) {
    const grace = c.grace ?? 1;
    for (const y of [from.getFullYear(), from.getFullYear() + 1]) {
      const d = dateOf(c, y);
      if (d && diffDays(d, from) >= -grace) return { ...c, when: d, daysLeft: diffDays(d, from), lead: c.lead ?? 7, grace };
    }
    return null;
  }
  function upcoming(from = today()) {
    return CAMPAIGNS.map(c => nextOccurrence(c, from)).filter(Boolean).sort((a, b) => a.when - b.when);
  }
  /* แคมเปญที่อยู่ในช่วงแสดงอัตโนมัติ (ใกล้ที่สุดก่อน) */
  function active(from = today()) {
    const forced = params.get('campaign');
    if (forced) { const c = CAMPAIGNS.find(x => x.id === forced); if (c) return nextOccurrence(c, from) || { ...c, when: from, daysLeft: 0, lead: 7, grace: 1 }; }
    return upcoming(from).find(c => c.daysLeft <= c.lead) || null;
  }
  function featured(from = today()) { return active(from) || upcoming(from)[0]; }

  function thaiDate(d) { return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function countdownText(c) {
    if (c.daysLeft > 1) return `อีก ${c.daysLeft} วัน`;
    if (c.daysLeft === 1) return 'พรุ่งนี้';
    if (c.daysLeft === 0) return 'วันนี้';
    return 'เพิ่งผ่านไป';
  }

  /* ---------------- กระทง ---------------- */
  const BASES = {
    banana: { name: 'หยวกกล้วย', fill: '#dfe9b8', side: '#b9cc7e', edge: '#8ea657', decay: '≈ 14 วัน' },
    bread: { name: 'ขนมปัง', fill: '#e2b06a', side: '#c98a3e', edge: '#9a6424', decay: '≈ 3 วัน' },
    cassava: { name: 'แป้งมันสำปะหลัง', fill: '#f3e6c4', side: '#dcc68f', edge: '#b59d5e', decay: '≈ 30 วัน' }
  };
  const FLOWERS = {
    marigold: { name: 'ดาวเรือง', c1: '#f7a823', c2: '#e2711d' },
    rose: { name: 'กุหลาบ', c1: '#f06d8c', c2: '#c43c62' },
    lotus: { name: 'ดอกบัว', c1: '#f9c4d4', c2: '#e07a9c' },
    orchid: { name: 'กล้วยไม้', c1: '#c79ae6', c2: '#8a4fbf' }
  };

  function petal(ctx, x, base, h, w, fill, rib) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, base);
    ctx.quadraticCurveTo(x - w / 2, base - h * 0.6, x, base - h);
    ctx.quadraticCurveTo(x + w / 2, base - h * 0.6, x + w / 2, base);
    ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = rib; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, base - 2); ctx.lineTo(x, base - h + 8); ctx.stroke();
  }
  function flower(ctx, x, y, r, f, kind) {
    if (kind === 'lotus') {
      for (let i = -2; i <= 2; i++) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(i * 0.42);
        ctx.beginPath(); ctx.ellipse(0, -r * 0.9, r * 0.45, r * 1.05, 0, 0, Math.PI * 2);
        const g = ctx.createLinearGradient(0, -r * 2, 0, 0); g.addColorStop(0, f.c2); g.addColorStop(1, f.c1);
        ctx.fillStyle = g; ctx.fill(); ctx.restore();
      }
      return;
    }
    if (kind === 'orchid') {
      for (let i = 0; i < 5; i++) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(i * Math.PI * 2 / 5);
        ctx.beginPath(); ctx.ellipse(0, -r * 0.55, r * 0.38, r * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = f.c1; ctx.fill(); ctx.restore();
      }
      ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, Math.PI * 2); ctx.fillStyle = f.c2; ctx.fill();
      return;
    }
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = f.c1; ctx.fill();
    ctx.strokeStyle = f.c2; ctx.lineWidth = 3;
    if (kind === 'rose') {
      ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0.3, Math.PI * 1.6); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 2, y, r * 0.25, 1, Math.PI * 2.2); ctx.stroke();
    } else {
      for (let i = 0; i < 10; i++) {
        const a = i * Math.PI / 5;
        ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.18, 0, Math.PI * 2); ctx.fillStyle = f.c2; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(x, y, r * 0.28, 0, Math.PI * 2); ctx.fillStyle = '#f7c948'; ctx.fill();
    }
  }

  /* วาดกระทง จุด (x,y) คือระดับผิวน้ำ */
  function drawKrathong(ctx, x, y, s, k) {
    const b = BASES[k.base] || BASES.banana;
    const f = FLOWERS[k.flower] || FLOWERS.marigold;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);

    if (k.candle) {
      const glow = ctx.createRadialGradient(0, -150, 4, 0, -150, 170);
      glow.addColorStop(0, 'rgba(255,214,120,.55)'); glow.addColorStop(1, 'rgba(255,214,120,0)');
      ctx.fillStyle = glow; ctx.fillRect(-180, -320, 360, 340);
    }
    // ตัวฐาน
    ctx.beginPath(); ctx.moveTo(-160, -12); ctx.bezierCurveTo(-150, 48, 150, 48, 160, -12); ctx.closePath();
    ctx.fillStyle = b.side; ctx.fill();
    ctx.strokeStyle = b.edge; ctx.lineWidth = 2;
    if (k.base === 'banana') for (let i = -140; i <= 140; i += 22) { ctx.beginPath(); ctx.moveTo(i, -4); ctx.lineTo(i * 0.92, 26); ctx.stroke(); }
    if (k.base === 'bread') { ctx.fillStyle = b.edge; for (let i = -120; i <= 120; i += 30) { ctx.beginPath(); ctx.arc(i, 12 + (i % 60 ? 4 : -2), 3, 0, Math.PI * 2); ctx.fill(); } }
    if (k.base === 'cassava') { ctx.beginPath(); for (let i = -150; i <= 150; i += 10) ctx.lineTo(i, 10 + Math.sin(i / 12) * 4); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(0, -12, 160, 26, 0, 0, Math.PI * 2); ctx.fillStyle = b.fill; ctx.fill(); ctx.strokeStyle = b.edge; ctx.stroke();

    // ใบตองแถวหลัง
    for (let i = -4; i <= 4; i++) petal(ctx, i * 34, -16, 78 - Math.abs(i) * 7, 38, '#3e8a3a', '#2c6a2a');

    // ธูปและเทียน
    if (k.incense) {
      ctx.lineWidth = 3; ctx.strokeStyle = '#8a5a2b';
      [-22, 0, 22].forEach((dx, i) => {
        const tx = dx * 1.6, ty = -168 + i % 2 * 8;
        ctx.beginPath(); ctx.moveTo(dx, -60); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.beginPath(); ctx.arc(tx, ty, 4, 0, Math.PI * 2); ctx.fillStyle = '#ff5a36'; ctx.fill();
      });
    }
    if (k.candle) {
      ctx.fillStyle = '#fff3d6'; ctx.fillRect(-8, -132, 16, 70);
      ctx.fillStyle = '#e8d3a8'; ctx.fillRect(4, -132, 4, 70);
      ctx.beginPath(); ctx.moveTo(0, -168); ctx.quadraticCurveTo(11, -146, 0, -136); ctx.quadraticCurveTo(-11, -146, 0, -168);
      ctx.fillStyle = '#ffb627'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, -158); ctx.quadraticCurveTo(5, -146, 0, -140); ctx.quadraticCurveTo(-5, -146, 0, -158);
      ctx.fillStyle = '#fff4c2'; ctx.fill();
    }
    // ดอกไม้
    const spots = k.flower === 'lotus' ? [[0, -50, 30]] : [[-58, -48, 19], [58, -48, 19], [-30, -58, 21], [30, -58, 21], [0, -44, 20]];
    spots.forEach(([fx, fy, r]) => flower(ctx, fx, fy, r, f, k.flower));
    // ใบตองแถวหน้า
    for (let i = -3.5; i <= 3.5; i++) petal(ctx, i * 38, -6, 44 - Math.abs(i) * 4, 36, '#5cae4f', '#3e8a3a');
    ctx.restore();
  }

  /* ---------------- ข้อความหลายบรรทัด (ตัดคำไทย) ---------------- */
  function words(text) {
    if (window.Intl && Intl.Segmenter) return [...new Intl.Segmenter('th', { granularity: 'word' }).segment(text)].map(s => s.segment);
    return [...text];
  }
  function wrap(ctx, text, maxW, maxLines) {
    const lines = []; let line = '';
    for (const w of words(text)) {
      if (ctx.measureText(line + w).width > maxW && line) { lines.push(line.trim()); line = w; }
      else line += w;
    }
    if (line.trim()) lines.push(line.trim());
    if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,2}$/, '…'); }
    return lines;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function rand(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

  let logo = null;
  function loadLogo() {
    if (logo) return logo;
    logo = new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = 'icons/icon-192.png'; });
    return logo;
  }
  async function fontsReady() {
    if (!document.fonts) return;
    await Promise.all(['700 80px Prompt', '600 40px Prompt', '500 36px "IBM Plex Sans Thai"'].map(f => document.fonts.load(f, 'ก'))).catch(() => {});
  }

  /* ---------------- ลายโปสการ์ดแนวธรรมชาติ ----------------
   * water: true = มีผิวน้ำ ใช้กับลอยกระทงได้
   * เพิ่มลายใหม่: เพิ่มรายการใน DESIGNS พร้อมฟังก์ชัน draw(ctx, W, H, r, c)
   */
  const HZ = 880; // เส้นขอบฟ้า / ผิวน้ำ
  function band(ctx, y0, y1, stops) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    ctx.fillStyle = g; ctx.fillRect(0, y0, 1080, y1 - y0);
  }
  function waves(ctx, y0, y1, color, step = 34) {
    ctx.strokeStyle = color; ctx.lineWidth = 3;
    for (let y = y0; y < y1; y += step) { ctx.beginPath(); for (let x = 0; x <= 1080; x += 20) ctx.lineTo(x, y + Math.sin(x / 40 + y) * 5); ctx.stroke(); }
  }
  function glow(ctx, x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function ridge(ctx, base, amp, freq, phase, color) {
    ctx.beginPath(); ctx.moveTo(0, 1350);
    for (let x = 0; x <= 1080; x += 12) ctx.lineTo(x, base - Math.abs(Math.sin(x / freq + phase)) * amp - Math.sin(x / (freq * 2.7)) * amp * 0.4);
    ctx.lineTo(1080, 1350); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  }
  function stars(ctx, r, n, maxY) {
    for (let i = 0; i < n; i++) { ctx.globalAlpha = 0.3 + r() * 0.7; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(r() * 1080, r() * maxY, r() * 2.4 + 0.6, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function lotusFlower(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.ellipse(0, 6, 46, 12, 0, 0, Math.PI * 2); ctx.fillStyle = '#3f7d4a'; ctx.fill();
    for (let i = -2; i <= 2; i++) {
      ctx.save(); ctx.rotate(i * 0.38);
      ctx.beginPath(); ctx.ellipse(0, -22, 11, 26, 0, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? '#f7b6c8' : '#ec8fac'; ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }

  const DESIGNS = [
    {
      id: 'moon', name: 'คืนจันทร์เต็มดวง', water: true, draw(ctx, W, H, r) {
        band(ctx, 0, HZ, ['#081634', '#1b3a78', '#2b5aa0']);
        stars(ctx, r, 90, 760);
        glow(ctx, 860, 250, 260, 'rgba(255,244,204,.45)');
        ctx.beginPath(); ctx.arc(860, 250, 92, 0, Math.PI * 2); ctx.fillStyle = '#fff4cc'; ctx.fill();
        band(ctx, HZ, H, ['#173f78', '#06162e']);
        ctx.fillStyle = 'rgba(255,244,204,.2)';
        for (let i = 0; i < 9; i++) ctx.fillRect(800 + r() * 30 - i * 4, HZ + 20 + i * 22, 110 - i * 8, 4);
        waves(ctx, HZ + 50, HZ + 180, 'rgba(255,255,255,.16)');
      }
    },
    {
      id: 'lotus', name: 'บึงบัวยามเย็น', water: true, draw(ctx, W, H, r) {
        band(ctx, 0, HZ, ['#2a1a4a', '#8c4a86', '#e9867a', '#ffc98f']);
        glow(ctx, 230, HZ - 20, 220, 'rgba(255,214,150,.6)');
        ctx.beginPath(); ctx.arc(230, HZ - 10, 78, Math.PI, 0); ctx.fillStyle = '#ffe2a8'; ctx.fill();
        ridge(ctx, HZ, 40, 160, 1, '#5a3566');
        band(ctx, HZ, H, ['#7a4a78', '#2a1a3e']);
        waves(ctx, HZ + 40, HZ + 200, 'rgba(255,220,200,.16)');
        [[120, 960, 1.4], [930, 990, 1.6], [300, 1030, 0.9], [820, 930, 0.8], [60, 1320, 1.6], [1010, 1320, 1.3]].forEach(([x, y, s]) => lotusFlower(ctx, x, y, s));
      }
    },
    {
      id: 'firefly', name: 'หิ่งห้อยริมน้ำ', water: true, draw(ctx, W, H, r) {
        band(ctx, 0, HZ, ['#041a1a', '#0c3a36', '#1b5a4c']);
        stars(ctx, r, 40, 500);
        ridge(ctx, HZ - 120, 120, 90, 0.4, '#082a26');
        ridge(ctx, HZ, 90, 60, 2, '#03150f');
        band(ctx, HZ, H, ['#0a2f2a', '#020d0b']);
        waves(ctx, HZ + 40, HZ + 200, 'rgba(216,255,122,.08)');
        for (let i = 0; i < 70; i++) {
          const x = r() * W, y = 320 + r() * 760, s = 6 + r() * 10;
          glow(ctx, x, y, s * 3, 'rgba(216,255,122,.55)');
          ctx.beginPath(); ctx.arc(x, y, s / 4, 0, Math.PI * 2); ctx.fillStyle = '#f4ffc2'; ctx.fill();
        }
      }
    },
    {
      id: 'sunrise', name: 'รุ่งอรุณริมน้ำ', water: true, draw(ctx, W, H, r) {
        band(ctx, 0, HZ, ['#3b6fb6', '#b98bb3', '#f5a26b', '#ffd98e']);
        glow(ctx, 800, HZ - 40, 330, 'rgba(255,240,184,.75)');
        ctx.beginPath(); ctx.arc(800, HZ - 30, 110, 0, Math.PI * 2); ctx.fillStyle = '#fff3c4'; ctx.fill();
        ridge(ctx, HZ - 40, 150, 140, 0.2, 'rgba(91,74,122,.85)');
        ridge(ctx, HZ, 80, 90, 1.7, '#3d3460');
        band(ctx, HZ, H, ['#e8956a', '#7a5a86', '#2c2550']);
        ctx.fillStyle = 'rgba(255,243,196,.45)';
        for (let i = 0; i < 12; i++) ctx.fillRect(730 + r() * 40 - i * 3, HZ + 18 + i * 18, 140 - i * 9, 5);
        waves(ctx, HZ + 40, HZ + 200, 'rgba(255,255,255,.14)');
        ctx.strokeStyle = '#2c2550'; ctx.lineWidth = 4;
        [[260, 300], [320, 270], [370, 320]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x - 20, y); ctx.quadraticCurveTo(x - 8, y - 12, x, y); ctx.quadraticCurveTo(x + 8, y - 12, x + 20, y); ctx.stroke(); });
      }
    },
    {
      id: 'forest', name: 'ขุนเขาและป่าเขียว', water: true, draw(ctx, W, H, r) {
        band(ctx, 0, HZ, ['#5aa6c9', '#a9dbe8', '#e9f7f0']);
        ridge(ctx, HZ - 200, 160, 170, 0.8, '#8fbfa0');
        ridge(ctx, HZ - 90, 130, 110, 2.3, '#4f8f62');
        ctx.fillStyle = '#245a3a';
        for (let x = -20; x < W + 40; x += 46) {
          const h = 90 + r() * 90, y = HZ + 4;
          ctx.beginPath(); ctx.moveTo(x - 26, y); ctx.lineTo(x, y - h); ctx.lineTo(x + 26, y); ctx.closePath(); ctx.fill();
        }
        band(ctx, HZ, H, ['#3f8fa8', '#1f5068', '#0d2f40']);
        waves(ctx, HZ + 40, HZ + 200, 'rgba(255,255,255,.18)');
      }
    },
    {
      id: 'meadow', name: 'ทุ่งดอกไม้', water: false, draw(ctx, W, H, r) {
        band(ctx, 0, HZ, ['#4aa3df', '#9fd6f5', '#e8f6fb']);
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        [[200, 330], [760, 420], [930, 300]].forEach(([x, y]) => { [[0, 0, 40], [40, -14, 52], [90, 0, 40], [44, 12, 44]].forEach(([dx, dy, rr]) => { ctx.beginPath(); ctx.arc(x + dx, y + dy, rr, 0, Math.PI * 2); ctx.fill(); }); });
        ridge(ctx, HZ - 60, 90, 200, 0.5, '#9fd27a');
        ridge(ctx, HZ + 60, 70, 150, 2, '#6cb552');
        band(ctx, HZ + 120, H, ['#5aa346', '#3f7d33']);
        const cols = ['#ffd23f', '#ff6b8b', '#ffffff', '#b38cff', '#ff9f43'];
        for (let i = 0; i < 160; i++) {
          const x = r() * W, y = HZ - 20 + r() * (H - HZ + 20), s = 4 + (y - HZ) / 60 + r() * 3;
          ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fillStyle = cols[i % cols.length]; ctx.fill();
        }
      }
    },
    {
      id: 'ocean', name: 'ทะเลยามสาย', water: false, draw(ctx, W, H, r) {
        band(ctx, 0, HZ, ['#2f8fd6', '#7cc8ef', '#d4f0fa']);
        glow(ctx, 900, 200, 200, 'rgba(255,250,210,.7)');
        ctx.beginPath(); ctx.arc(900, 200, 70, 0, Math.PI * 2); ctx.fillStyle = '#fffbe0'; ctx.fill();
        band(ctx, HZ - 40, H, ['#1c8fc4', '#13679a', '#0b3f66']);
        ctx.fillStyle = 'rgba(255,255,255,.5)';
        for (let y = HZ; y < H; y += 46) { ctx.beginPath(); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, y + Math.sin(x / 50 + y / 30) * 8); ctx.lineTo(W, y + 4); ctx.lineTo(0, y + 4); ctx.fill(); }
        ctx.strokeStyle = '#1d3b52'; ctx.lineWidth = 4;
        [[180, 260], [250, 230], [620, 300]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x - 22, y); ctx.quadraticCurveTo(x - 9, y - 14, x, y); ctx.quadraticCurveTo(x + 9, y - 14, x + 22, y); ctx.stroke(); });
      }
    },
    {
      id: 'rain', name: 'ฝนพรำกับสายรุ้ง', water: false, draw(ctx, W, H, r) {
        band(ctx, 0, HZ, ['#4f6478', '#8aa3b8', '#c9d8e2']);
        ['#ff6b6b', '#ffa94d', '#ffe066', '#69db7c', '#4dabf7', '#9775fa'].forEach((col, i) => {
          ctx.beginPath(); ctx.arc(540, HZ + 40, 560 - i * 26, Math.PI, 0); ctx.strokeStyle = col; ctx.globalAlpha = .45; ctx.lineWidth = 26; ctx.stroke();
        });
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2;
        for (let i = 0; i < 140; i++) { const x = r() * W, y = r() * H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 30); ctx.stroke(); }
        ridge(ctx, HZ, 60, 130, 0.9, '#5f9a6a');
        band(ctx, HZ + 50, H, ['#4f8a5a', '#2f5a3c']);
        ctx.beginPath(); ctx.ellipse(300, 1010, 160, 26, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(180,215,235,.6)'; ctx.fill();
      }
    },
    {
      id: 'theme', name: 'สีประจำวันรณรงค์', water: false, draw(ctx, W, H, r, c) {
        const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, c.colors[0]); g.addColorStop(1, c.colors[1]);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(255,255,255,.05)';
        for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(r() * W, r() * H, 40 + r() * 160, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = 'rgba(255,255,255,.18)';
        for (let i = 0; i < 26; i++) {
          ctx.save(); ctx.translate(r() * W, r() * H); ctx.rotate(r() * Math.PI * 2);
          ctx.beginPath(); ctx.ellipse(0, 0, 10, 24, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      }
    }
  ];

  /* ---------------- คำอวยพร (สุ่ม) ---------------- */
  const BLESSINGS = {
    common: [
      'ขอให้ชีวิตงอกงาม เหมือนต้นไม้ที่ได้รับแสงแดด',
      'ขอให้ทุกลมหายใจสดชื่น เหมือนอากาศในป่าใหญ่',
      'ขอให้ใจเย็นสบาย ไหลลื่นเหมือนสายน้ำ',
      'ขอให้ความดีงามเบ่งบาน เหมือนดอกไม้ในทุ่ง',
      'ขอให้สุขภาพแข็งแรง ดั่งต้นไม้ใหญ่ที่หยั่งรากลึก',
      'ดูแลโลกวันนี้ ก็คือดูแลสุขภาพของเราทุกคน',
      'ขอให้โลกใบนี้สดใส ส่งต่อถึงลูกหลาน',
      'ขอให้ทุกวันสดชื่น เหมือนหยดน้ำค้างยามเช้า'
    ],
    loykrathong: [
      'ขอให้สายน้ำใสสะอาด ชีวิตชุ่มชื่นตลอดปี',
      'ขอให้ความทุกข์ลอยไป ความสุขไหลมาเหมือนสายน้ำ',
      'ขอบคุณแม่น้ำที่หล่อเลี้ยงทุกชีวิต',
      'ลอยความทุกข์ ไม่ลอยขยะ',
      'ขอให้แสงจันทร์นำทางสู่สิ่งดีงาม',
      'ขอให้ครอบครัวอบอุ่น สุขภาพแข็งแรงทุกคน'
    ]
  };
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function designsFor(c) { return DESIGNS.filter(d => c.special === 'krathong' ? d.water : true); }
  function randomDesign(c, not) { const l = designsFor(c).filter(d => d.id !== not); return pick(l.length ? l : designsFor(c)); }
  function randomBlessing(c, not) {
    const l = (BLESSINGS[c.id] || []).concat(BLESSINGS.common).filter(b => b !== not);
    return pick(l);
  }

  /* ---------------- โปสการ์ด 1080x1350 (สัดส่วน 4:5 แชร์ได้ทุกแพลตฟอร์ม) ----------------
   * o = { design, message, pledge, name, krathong }
   */
  async function drawPostcard(canvas, c, o = {}) {
    await fontsReady();
    const img = await loadLogo();
    const W = 1080, H = 1350;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    const head = 'Prompt, "IBM Plex Sans Thai", sans-serif', body = '"IBM Plex Sans Thai", sans-serif';
    const ok = designsFor(c);
    const d = ok.find(x => x.id === o.design) || ok[0];
    const r = rand(7 + d.id.length * 13);

    ctx.save(); d.draw(ctx, W, H, r, c); ctx.restore();
    // ไล่เงาด้านบนให้อ่านหัวข้อได้ทุกลาย
    const shade = ctx.createLinearGradient(0, 0, 0, 520);
    shade.addColorStop(0, 'rgba(0,0,0,.42)'); shade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shade; ctx.fillRect(0, 0, W, 520);

    if (c.special === 'krathong') {
      glow(ctx, 540, 960, 300, 'rgba(255,200,100,.35)');
      drawKrathong(ctx, 540, 925, 1.75, o.krathong || { base: 'banana', flower: 'marigold', candle: true, incense: true });
    } else {
      ctx.beginPath(); ctx.arc(540, 690, 200, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fill();
      ctx.beginPath(); ctx.arc(540, 690, 165, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fill();
      ctx.font = '190px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c.icon, 540, 700);
    }

    // หัวข้อ
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = `500 34px ${body}`;
    ctx.fillText(thaiDate(c.when), 80, 110);
    ctx.fillStyle = '#fff'; ctx.font = `700 ${c.name.length > 22 ? 64 : 80}px ${head}`;
    const tLines = wrap(ctx, c.name, 920, 2);
    tLines.forEach((l, i) => ctx.fillText(l, 80, 200 + i * 86));
    ctx.fillStyle = '#ffe9a8'; ctx.font = `600 40px ${head}`;
    const sLines = wrap(ctx, c.slogan, 920, 2);
    sLines.forEach((l, i) => ctx.fillText(l, 80, 200 + tLines.length * 86 + i * 52));
    ctx.shadowColor = 'transparent';

    // ป้ายคำมั่น
    if (o.pledge) {
      ctx.font = `600 30px ${head}`;
      const t = '✓ ' + o.pledge, tw = Math.min(ctx.measureText(t).width, 880);
      const py = 200 + tLines.length * 86 + (sLines.length - 1) * 52 + 34;
      roundRect(ctx, 80, py, tw + 44, 54, 27); ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fill();
      ctx.fillStyle = '#14633f'; ctx.fillText(t, 102, py + 38, 880);
    }

    // การ์ดคำอวยพร
    const cy = 1070, ch = 220;
    ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 8;
    roundRect(ctx, 70, cy, 940, ch, 28); ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#12291f'; ctx.font = `500 36px ${body}`;
    const msg = (o.message || '').trim() || c.actions[0];
    wrap(ctx, `“${msg}”`, 860, 2).forEach((l, i) => ctx.fillText(l, 110, cy + 66 + i * 50));
    ctx.font = `600 30px ${head}`; ctx.fillStyle = '#14633f';
    const who = (o.name || '').trim();
    ctx.fillText(who ? `— ${who.slice(0, 40)}` : c.hashtag, 110, cy + ch - 34);
    ctx.textAlign = 'right'; ctx.font = `500 26px ${body}`; ctx.fillStyle = '#4a5f55';
    ctx.fillText(who ? `${c.hashtag} · Green Hospital` : 'Green Hospital', img ? 900 : 970, cy + ch - 34);
    if (img) ctx.drawImage(img, 914, cy + ch - 84, 64, 64);
    return canvas;
  }

  window.GHCampaign = { CAMPAIGNS, BASES, FLOWERS, DESIGNS, today, upcoming, active, featured, thaiDate, countdownText, drawKrathong, drawPostcard, diffDays, designsFor, randomDesign, randomBlessing };
})();
