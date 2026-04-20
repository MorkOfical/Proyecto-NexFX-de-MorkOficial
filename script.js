/* NexFX © 2025 Mork_Oficial — All rights reserved */

// ── LANGS ──
const LANGS = [
  { code: 'es', flag: '🇲🇽', label: 'Español (MX)' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
  { code: 'ja', flag: '🇯🇵', label: '日本語' },
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'ar', flag: '🇸🇦', label: 'العربية' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'hi', flag: '🇮🇳', label: 'हिन्दी' },
];
let lang =
  localStorage.getItem('nfx_l') ||
  (LANGS.find((l) => l.code === (navigator.language || 'es').split('-')[0])
    ? (navigator.language || 'es').split('-')[0]
    : 'es');

function openLang() {
  const g = document.getElementById('lgr');
  g.innerHTML = '';
  LANGS.forEach((l) => {
    const d = document.createElement('div');
    d.className = 'lo' + (l.code === lang ? ' sel' : '');
    d.innerHTML = `<div class="lf">${l.flag}</div><div class="ln">${l.label}</div>`;
    d.onclick = () => {
      lang = l.code;
      localStorage.setItem('nfx_l', l.code);
      closeM('lgM');
      showToast('🌐 ' + l.label);
    };
    g.appendChild(d);
  });
  openM('lgM');
}

// ── THEME ──
let dark = localStorage.getItem('nfx_t') !== 'light';
function applyTheme() {
  document.body.classList.toggle('light', !dark);
  const ic = dark ? '🌙' : '☀️';
  ['tB', 'tB2'].forEach((id) => {
    const e = document.getElementById(id);
    if (e) e.textContent = ic;
  });
  const m = document.getElementById('tMI');
  if (m) m.textContent = ic;
  if (chartInst)
    ((chartInst.options.plugins.legend.labels.color = dark ? '#8faac8' : '#475569'),
      chartInst.update());
}
function toggleTheme() {
  dark = !dark;
  localStorage.setItem('nfx_t', dark ? 'dark' : 'light');
  applyTheme();
  showToast(dark ? '🌙 Modo oscuro' : '☀️ Modo claro');
}
applyTheme();

// ── SENIOR MODE ──
let seniorMode = localStorage.getItem('nfx_senior') === '1';
let seniorSignals = 0;
let seniorBannerShown = false;
function applySenior() {
  document.body.classList.toggle('senior', seniorMode);
  const lbl = document.getElementById('seniorModeLabel');
  if (lbl) lbl.textContent = seniorMode ? 'Modo Fácil ACTIVO ✓' : 'Modo Fácil (letra grande)';
}
function activateSenior() {
  seniorMode = true;
  localStorage.setItem('nfx_senior', '1');
  applySenior();
  document.getElementById('seniorBanner').style.display = 'none';
  showToast('👴 Modo Fácil activado');
}
function toggleSeniorMode() {
  seniorMode = !seniorMode;
  localStorage.setItem('nfx_senior', seniorMode ? '1' : '0');
  applySenior();
  showToast(seniorMode ? '👴 Modo Fácil activado' : 'Modo Fácil desactivado');
}
function checkSeniorSignal() {
  seniorSignals++;
  if (seniorSignals >= 3 && !seniorMode && !seniorBannerShown) {
    seniorBannerShown = true;
    const b = document.getElementById('seniorBanner');
    if (b) b.style.display = 'flex';
  }
}
applySenior();

// ── AUTH ──
const UK = 'nfx_u',
  SK = 'nfx_s';
const gU = () => JSON.parse(localStorage.getItem(UK) || '[]');
const sU = (u) => localStorage.setItem(UK, JSON.stringify(u));
const gS = () => JSON.parse(localStorage.getItem(SK) || 'null');
const sS = (u) => localStorage.setItem(SK, JSON.stringify(u));

function openAuth(t) {
  swTab(t);
  openM('authM');
}
function swTab(t) {
  document.getElementById('lF').style.display = t === 'login' ? 'block' : 'none';
  document.getElementById('rF').style.display = t === 'reg' ? 'block' : 'none';
  document.getElementById('tL').className = 'atab' + (t === 'login' ? ' on' : '');
  document.getElementById('tR').className = 'atab' + (t === 'reg' ? ' on' : '');
  document.getElementById('aE').textContent = '';
}
function sErr(m) {
  document.getElementById('aE').textContent = m;
}
function doLogin() {
  const email = document.getElementById('lE').value.trim();
  const pass = document.getElementById('lP').value;
  if (!email || !pass) {
    sErr('Completa todos los campos');
    return;
  }
  const u = gU().find((u) => u.email === email && u.pass === pass);
  if (!u) {
    sErr('Correo o contraseña incorrectos');
    return;
  }
  sS(u);
  closeM('authM');
  enterApp(u);
}
function doReg() {
  const name = document.getElementById('rN').value.trim();
  const email = document.getElementById('rE').value.trim();
  const pass = document.getElementById('rP').value;
  if (!name || !email || !pass) {
    sErr('Completa todos los campos');
    return;
  }
  if (pass.length < 6) {
    sErr('Contraseña mínimo 6 caracteres');
    return;
  }
  const users = gU();
  if (users.find((u) => u.email === email)) {
    sErr('Este correo ya está registrado');
    return;
  }
  const user = {
    name,
    email,
    pass,
    joined: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    sessions: 1,
  };
  users.push(user);
  sU(users);
  sS(user);
  logA('register', { name, email });
  closeM('authM');
  enterApp(user);
}
function doLogout() {
  localStorage.removeItem(SK);
  document.getElementById('app').classList.remove('on');
  document.getElementById('land').style.display = '';
  showToast('👋 Hasta pronto');
}
function enterApp(u) {
  const users = gU();
  const i = users.findIndex((x) => x.email === u.email);
  if (i >= 0) {
    users[i].lastLogin = new Date().toISOString();
    users[i].sessions = (users[i].sessions || 0) + 1;
    sU(users);
  }
  logA('login', { email: u.email });
  document.getElementById('land').style.display = 'none';
  document.getElementById('app').classList.add('on');
  document.getElementById('aUN').textContent = u.name.split(' ')[0].toUpperCase();
  document.getElementById('pAv').textContent = u.name[0].toUpperCase();
  document.getElementById('pNm').textContent = u.name;
  document.getElementById('pEm').textContent = u.email;
  currentUser = u;
  if (!appReady) initApp();
}
let currentUser = null;

// ── ANALYTICS ──
function logA(ev, data) {
  const logs = JSON.parse(localStorage.getItem('nfx_log') || '[]');
  logs.push({ ev, data, ts: new Date().toISOString() });
  if (logs.length > 500) logs.splice(0, logs.length - 500);
  localStorage.setItem('nfx_log', JSON.stringify(logs));
}
window.showAdminDashboard = function () {
  const users = gU().map((u) => ({
    name: u.name,
    email: u.email,
    joined: u.joined,
    lastLogin: u.lastLogin,
    sessions: u.sessions,
  }));
  const logs = JSON.parse(localStorage.getItem('nfx_log') || '[]');
  const evs = {};
  logs.forEach((l) => {
    evs[l.ev] = (evs[l.ev] || 0) + 1;
  });
  const comments = JSON.parse(localStorage.getItem('nfx_comments') || '[]');
  console.group('%c NexFX Admin — © Mork_Oficial', 'color:#00f5d4;font-size:16px;font-weight:bold');
  console.log('%c USUARIOS', 'color:#3b82f6;font-weight:bold', users.length);
  console.table(users);
  console.log('%c EVENTOS', 'color:#8b5cf6;font-weight:bold');
  console.table(evs);
  console.log('%c COMENTARIOS (' + comments.length + ')', 'color:#f59e0b;font-weight:bold');
  console.table(comments);
  console.groupEnd();
  return { users, evs, logs, comments };
};

// ── NAV ──
let appReady = false;
function showP(name, el) {
  document.querySelectorAll('.ap').forEach((p) => p.classList.remove('on'));
  document.querySelectorAll('.ani,.bni').forEach((n) => n.classList.remove('on'));
  document.getElementById('pg' + name).classList.add('on');
  if (el) el.classList.add('on');
  logA('page', { page: name });
  if (name === 'Chart') setTimeout(() => updateChart(), 100);
  if (name === 'Comments') renderComments();
}

// ── MODALS ──
function openM(id) {
  document.getElementById(id).classList.add('open');
}
function closeM(id) {
  document.getElementById(id).classList.remove('open');
}
function cOvl(e, id) {
  if (e.target.id === id) closeM(id);
}

// ── RATES ──
let rates = {},
  usdMxn = null,
  dailyHigh = null,
  dailyLow = null,
  openRate = null;
const CURR = [
  { code: 'USD', flag: '🇺🇸' },
  { code: 'MXN', flag: '🇲🇽' },
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'CAD', flag: '🇨🇦' },
  { code: 'JPY', flag: '🇯🇵' },
  { code: 'BRL', flag: '🇧🇷' },
  { code: 'ARS', flag: '🇦🇷' },
  { code: 'COP', flag: '🇨🇴' },
  { code: 'CLP', flag: '🇨🇱' },
  { code: 'CNY', flag: '🇨🇳' },
  { code: 'INR', flag: '🇮🇳' },
  { code: 'AUD', flag: '🇦🇺' },
  { code: 'CHF', flag: '🇨🇭' },
  { code: 'KRW', flag: '🇰🇷' },
  { code: 'SGD', flag: '🇸🇬' },
  { code: 'NOK', flag: '🇳🇴' },
  { code: 'SEK', flag: '🇸🇪' },
  { code: 'DKK', flag: '🇩🇰' },
  { code: 'ZAR', flag: '🇿🇦' },
  { code: 'TRY', flag: '🇹🇷' },
  { code: 'SAR', flag: '🇸🇦' },
  { code: 'AED', flag: '🇦🇪' },
  { code: 'HKD', flag: '🇭🇰' },
  { code: 'NZD', flag: '🇳🇿' },
  { code: 'RUB', flag: '🇷🇺' },
];
const FL = Object.fromEntries(CURR.map((c) => [c.code, c.flag]));

async function fetchR() {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD');
    const d = await r.json();
    if (d.result !== 'success') throw 0;
    rates = d.rates;
    setR();
  } catch {
    try {
      const r2 = await fetch('https://api.exchangerate.host/latest?base=USD');
      const d2 = await r2.json();
      rates = d2.rates;
      setR();
    } catch {}
  }
}
function setR() {
  usdMxn = rates.MXN;
  if (!openRate) openRate = usdMxn;
  if (!dailyHigh || usdMxn > dailyHigh) dailyHigh = usdMxn;
  if (!dailyLow || usdMxn < dailyLow) dailyLow = usdMxn;
  rL();
  rA();
  gwC();
  aCF();
}
function xr(a, b) {
  return rates[a] && rates[b] ? (rates[b] / rates[a]).toFixed(4) : '—';
}
function rL() {
  if (!usdMxn) return;
  document.getElementById('lwR').textContent = usdMxn.toFixed(4);
  const diff = openRate ? usdMxn - openRate : 0;
  const pct = openRate ? ((diff / openRate) * 100).toFixed(2) : '0.00';
  const s = diff >= 0 ? '+' : '';
  const c = document.getElementById('lwC');
  c.textContent = `${s}${diff.toFixed(4)} (${s}${pct}%)`;
  c.className = 'chip ' + (diff > 0 ? 'pos' : diff < 0 ? 'neg' : 'neu');
  document.getElementById('lwT').textContent = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  document.getElementById('pEM').textContent = xr('EUR', 'MXN');
  document.getElementById('pGM').textContent = xr('GBP', 'MXN');
  document.getElementById('pCM').textContent = xr('CAD', 'MXN');
  document.getElementById('pBM').textContent = xr('BRL', 'MXN');
  document.getElementById('pJM').textContent = xr('JPY', 'MXN');
  document.getElementById('pAM').textContent = xr('ARS', 'MXN');
  gwC();
}
function rA() {
  if (!usdMxn) return;
  document.getElementById('aR').textContent = usdMxn.toFixed(4);
  const diff = openRate ? usdMxn - openRate : 0;
  const pct = openRate ? ((diff / openRate) * 100).toFixed(2) : '0.00';
  const s = diff >= 0 ? '+' : '';
  const c = document.getElementById('aC');
  c.textContent = `${s}${diff.toFixed(4)} (${s}${pct}%)`;
  c.className = 'chip ' + (diff > 0 ? 'pos' : diff < 0 ? 'neg' : 'neu');
  document.getElementById('aT').textContent = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  if (dailyHigh) document.getElementById('aH').textContent = dailyHigh.toFixed(2);
  if (dailyLow) document.getElementById('aL').textContent = dailyLow.toFixed(2);
  document.getElementById('aPEM').textContent = xr('EUR', 'MXN');
  document.getElementById('aPGM').textContent = xr('GBP', 'MXN');
  document.getElementById('aPCM').textContent = xr('CAD', 'MXN');
  document.getElementById('aPBM').textContent = xr('BRL', 'MXN');
  document.getElementById('aPJM').textContent = xr('JPY', 'MXN');
  document.getElementById('aPAM').textContent = xr('ARS', 'MXN');
}

// ── CONVERTERS ──
function cv(amt, fr, to) {
  if (!rates[fr] || !rates[to]) return null;
  return (amt / rates[fr]) * rates[to];
}
function popSel(fId, tId, fD = 'USD', tD = 'MXN') {
  [fId, tId].forEach((id) => {
    const s = document.getElementById(id);
    if (!s) return;
    s.innerHTML = '';
    CURR.forEach((c) => {
      const o = document.createElement('option');
      o.value = c.code;
      o.textContent = `${c.flag} ${c.code}`;
      s.appendChild(o);
    });
  });
  document.getElementById(fId).value = fD;
  document.getElementById(tId).value = tD;
}
function gwC() {
  const fr = document.getElementById('gF').value,
    to = document.getElementById('gT').value;
  if (rates[fr] && rates[to]) {
    const r1 = cv(1, fr, to),
      r2 = cv(1, to, fr);
    if (r1) document.getElementById('gFP').textContent = `1 ${fr} = ${r1.toFixed(4)} ${to}`;
    if (r2) document.getElementById('gTP').textContent = `1 ${to} = ${r2.toFixed(4)} ${fr}`;
  }
  gwCF();
}
function gwCF() {
  const amt = parseFloat(document.getElementById('gA').value);
  const fr = document.getElementById('gF').value,
    to = document.getElementById('gT').value;
  gwC();
  if (isNaN(amt)) {
    document.getElementById('gRN').textContent = 'Escribe una cantidad';
    document.getElementById('gRR').textContent = 'TASA EN TIEMPO REAL';
    document.getElementById('gR').value = '';
    return;
  }
  const res = cv(amt, fr, to);
  if (!res) return;
  document.getElementById('gR').value = res.toFixed(4);
  document.getElementById('gRN').textContent =
    `${res.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${to}`;
  document.getElementById('gRR').textContent = `1 ${fr} = ${cv(1, fr, to)?.toFixed(4)} ${to}`;
}
function gwCT() {
  const amt = parseFloat(document.getElementById('gR').value);
  const fr = document.getElementById('gF').value,
    to = document.getElementById('gT').value;
  if (isNaN(amt)) {
    document.getElementById('gA').value = '';
    return;
  }
  const res = cv(amt, to, fr);
  if (!res) return;
  document.getElementById('gA').value = res.toFixed(4);
  document.getElementById('gRN').textContent = `${amt} ${to} = ${res.toFixed(4)} ${fr}`;
  document.getElementById('gRR').textContent = `1 ${fr} = ${cv(1, fr, to)?.toFixed(4)} ${to}`;
}
function gwSw() {
  const fc = document.getElementById('gF'),
    tc = document.getElementById('gT');
  [fc.value, tc.value] = [tc.value, fc.value];
  gwCF();
  showToast('⇅');
}
function aCF() {
  const amt = parseFloat(document.getElementById('aFA').value);
  const fr = document.getElementById('aFr').value,
    to = document.getElementById('aTo').value;
  document.getElementById('aFF').textContent = FL[fr] || '🏳️';
  document.getElementById('aTF').textContent = FL[to] || '🏳️';
  if (isNaN(amt)) {
    document.getElementById('aRN').textContent = 'Escribe una cantidad';
    return;
  }
  const res = cv(amt, fr, to);
  if (!res) return;
  document.getElementById('aTA').value = res.toFixed(4);
  document.getElementById('aRN').textContent =
    `${res.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${to}`;
  document.getElementById('aRR').textContent = `1 ${fr} = ${cv(1, fr, to)?.toFixed(4)} ${to}`;
}
function aCT() {
  const amt = parseFloat(document.getElementById('aTA').value);
  const fr = document.getElementById('aFr').value,
    to = document.getElementById('aTo').value;
  if (isNaN(amt)) return;
  const res = cv(amt, to, fr);
  if (!res) return;
  document.getElementById('aFA').value = res.toFixed(4);
  document.getElementById('aRN').textContent = `${amt} ${to} = ${res.toFixed(4)} ${fr}`;
  document.getElementById('aRR').textContent = `1 ${fr} = ${cv(1, fr, to)?.toFixed(4)} ${to}`;
}
function aSw() {
  const fc = document.getElementById('aFr'),
    tc = document.getElementById('aTo');
  [fc.value, tc.value] = [tc.value, fc.value];
  document.getElementById('aFF').textContent = FL[fc.value] || '🏳️';
  document.getElementById('aTF').textContent = FL[tc.value] || '🏳️';
  aCF();
  showToast('⇅');
}

// ── CHART ──
let chartInst = null,
  chartRange = 7;
function genHistoricalData(baseRate, days) {
  const data = [];
  const now = Date.now();
  let price = baseRate * (0.94 + Math.random() * 0.12);
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 86400000);
    price = price * (1 + (Math.random() - 0.48) * 0.008);
    data.push({
      x: date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      y: parseFloat(price.toFixed(4)),
    });
  }
  return data;
}
function setChartRange(days, el) {
  chartRange = days;
  document.querySelectorAll('.ctab').forEach((t) => t.classList.remove('on'));
  if (el) el.classList.add('on');
  updateChart();
}
function updateChart() {
  const cur = document.getElementById('chartCur')?.value || 'MXN';
  const base = rates[cur] ? 1 / rates[cur] : 1 / 17.5;
  const baseRate = rates[cur] || 17.5;
  const data = genHistoricalData(baseRate, chartRange);
  const vals = data.map((d) => d.y);
  const high = Math.max(...vals),
    low = Math.min(...vals),
    avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const chg = ((vals[vals.length - 1] - vals[0]) / vals[0]) * 100;
  document.getElementById('chHigh').textContent = high.toFixed(4);
  document.getElementById('chLow').textContent = low.toFixed(4);
  document.getElementById('chAvg').textContent = avg.toFixed(4);
  const chEl = document.getElementById('chChg');
  chEl.textContent = (chg >= 0 ? '+' : '') + chg.toFixed(2) + '%';
  chEl.style.color = chg >= 0 ? 'var(--green)' : 'var(--red)';
  const ctx = document.getElementById('rateChart');
  if (!ctx) return;
  const isDarkMode = !document.body.classList.contains('light');
  const gridColor = isDarkMode ? 'rgba(30,45,85,.5)' : 'rgba(208,218,240,.8)';
  const textColor = isDarkMode ? '#8faac8' : '#475569';
  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, ctx.offsetHeight || 280);
  gradient.addColorStop(0, 'rgba(0,245,212,.25)');
  gradient.addColorStop(1, 'rgba(0,245,212,.01)');
  if (chartInst) chartInst.destroy();
  chartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((d) => d.x),
      datasets: [
        {
          label: `USD/${cur}`,
          data: vals,
          borderColor: '#00f5d4',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,16,32,.9)',
          titleColor: '#00f5d4',
          bodyColor: '#e2eaf8',
          borderColor: '#1e2d55',
          borderWidth: 1,
          callbacks: { label: (c) => `${c.dataset.label}: ${c.raw.toFixed(4)}` },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, maxTicksLimit: 8, maxRotation: 0 },
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, callback: (v) => v.toFixed(2) },
        },
      },
    },
  });
}

// ── COMMENTS ──
let selectedType = 'sugerencia';
function selType(el, type) {
  selectedType = type;
  document.querySelectorAll('.ctype-btn').forEach((b) => b.classList.remove('on'));
  el.classList.add('on');
}
function postComment() {
  const txt = document.getElementById('commentText').value.trim();
  if (!txt) {
    showToast('Escribe algo primero ✏️');
    return;
  }
  if (!currentUser) {
    showToast('Inicia sesión para comentar');
    return;
  }
  const comments = JSON.parse(localStorage.getItem('nfx_comments') || '[]');
  const comment = {
    id: Date.now(),
    user: currentUser.name,
    email: currentUser.email,
    text: txt,
    type: selectedType,
    date: new Date().toISOString(),
  };
  comments.unshift(comment);
  localStorage.setItem('nfx_comments', JSON.stringify(comments));
  document.getElementById('commentText').value = '';
  logA('comment', { type: selectedType, length: txt.length });
  // Silently analyze with AI (not shown to user)
  analyzeCommentSilent(comment);
  renderComments();
  showToast('¡Comentario enviado! 🌟');
}
async function analyzeCommentSilent(comment) {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system:
          'Analiza este comentario de usuario de una app de divisas llamada NexFX. Extrae: 1) sentimiento (positivo/negativo/neutro), 2) tema principal, 3) si hay una acción de mejora sugerida. Responde en JSON solo: {"sentiment":"...","topic":"...","action":"..."}',
        messages: [{ role: 'user', content: `Tipo: ${comment.type}\nComentario: ${comment.text}` }],
      }),
    });
    const d = await r.json();
    const txt = d.content?.[0]?.text || '{}';
    try {
      const analysis = JSON.parse(txt.replace(/```json|```/g, '').trim());
      const comments = JSON.parse(localStorage.getItem('nfx_comments') || '[]');
      const idx = comments.findIndex((c) => c.id === comment.id);
      if (idx >= 0) {
        comments[idx]._analysis = analysis;
        localStorage.setItem('nfx_comments', JSON.stringify(comments));
      }
    } catch {}
  } catch {}
}
function renderComments() {
  const list = document.getElementById('commentList');
  const comments = JSON.parse(localStorage.getItem('nfx_comments') || '[]');
  if (!comments.length) {
    list.innerHTML = '<div class="no-comments">Sé el primero en comentar 🌟</div>';
    return;
  }
  list.innerHTML = comments
    .map((c) => {
      const d = new Date(c.date);
      const ds = d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
      const tagClass = `tag-${c.type}`;
      const tagEmoji = c.type === 'sugerencia' ? '💡' : c.type === 'pregunta' ? '❓' : '⚠️';
      return `<div class="comment-item"><div class="comment-meta"><div class="comment-avatar">${c.user[0].toUpperCase()}</div><span class="comment-name">${c.user}</span><span class="comment-date">${ds}</span><span class="comment-tag ${tagClass}">${tagEmoji} ${c.type}</span></div><div class="comment-text">${c.text}</div></div>`;
    })
    .join('');
}

// ── NORA AI ──
function bldSys() {
  const seniorTip = seniorMode
    ? '\nEl usuario usa Modo Fácil — usa frases simples, claras y sin tecnicismos. Responde como si le hablaras a una persona mayor.'
    : '';
  return `Eres NORA, la asistente financiera de NexFX, plataforma de divisas creada por Mork_Oficial. Experta en finanzas, divisas, crypto y economía global. Idioma: ${LANGS.find((l) => l.code === lang)?.label || 'Español mexicano'}. Responde SIEMPRE en ese idioma. Tasa actual: 1 USD = ${usdMxn ? usdMxn.toFixed(2) : '~17.50'} MXN. NUNCA menciones Claude ni Anthropic — eres NORA de NexFX. Si piden contactar al dev: LinkedIn https://www.linkedin.com/in/daniel-alejandro-mugarte-flores-6178063b6 o GitHub https://github.com/MorkOfical${seniorTip}`;
}
let aH = [],
  fH = [],
  fOpen = false;
let noraQueryCount = 0;
async function sA() {
  const inp = document.getElementById('aI');
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';
  document.getElementById('aSB').disabled = true;
  noraQueryCount++;
  if (noraQueryCount >= 3) checkSeniorSignal();
  addMsg('aMs', txt, 'user');
  aH.push({ role: 'user', content: txt });
  const tk = addMsg('aMs', '...', 'bot thinking');
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: bldSys(),
        messages: aH,
      }),
    });
    const d = await r.json();
    const reply = d.content?.map((b) => b.text || '').join('') || 'Error.';
    tk.remove();
    addMsg('aMs', reply, 'bot');
    aH.push({ role: 'assistant', content: reply });
    if (aH.length > 20) aH = aH.slice(-20);
    logA('nora', { lang });
  } catch {
    tk.remove();
    addMsg('aMs', 'Error de conexión. Verifica tu internet.', 'bot');
  }
  document.getElementById('aSB').disabled = false;
}
function togF() {
  fOpen = !fOpen;
  document.getElementById('fP').classList.toggle('open', fOpen);
  document.getElementById('nHi').style.display = 'none';
}
async function sF() {
  const inp = document.getElementById('fI');
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';
  document.getElementById('fSB').disabled = true;
  noraQueryCount++;
  if (noraQueryCount >= 3) checkSeniorSignal();
  addMsg('fMs', txt, 'user');
  fH.push({ role: 'user', content: txt });
  const tk = addMsg('fMs', '...', 'bot thinking');
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: bldSys(),
        messages: fH,
      }),
    });
    const d = await r.json();
    const reply = d.content?.map((b) => b.text || '').join('') || 'Error.';
    tk.remove();
    addMsg('fMs', reply, 'bot');
    fH.push({ role: 'assistant', content: reply });
    if (fH.length > 16) fH = fH.slice(-16);
  } catch {
    tk.remove();
    addMsg('fMs', 'Error de conexión.', 'bot');
  }
  document.getElementById('fSB').disabled = false;
}
function addMsg(cId, text, type) {
  const c = document.getElementById(cId);
  const el = document.createElement('div');
  el.className = 'msg ' + type;
  if (type.includes('bot') && !type.includes('thinking'))
    el.innerHTML = `<div class="ms">✦ NORA</div>${text}`;
  else el.textContent = text;
  c.appendChild(el);
  c.scrollTop = c.scrollHeight;
  return el;
}

// Detect zoom as senior signal
let zoomCheckDone = false;
function checkZoom() {
  if (zoomCheckDone) return;
  const zoom = window.devicePixelRatio || 1;
  const ww = window.innerWidth;
  // If viewport is very small relative to screen (user zoomed in a lot)
  if (zoom > 2.2 || ww < 320) {
    checkSeniorSignal();
    zoomCheckDone = true;
  }
}

// ── SHARE ──
function shareApp() {
  const data = {
    title: 'NexFX',
    text: `💱 Convierte cualquier moneda con IA.\n💵 USD→MXN: $${usdMxn ? usdMxn.toFixed(2) : '--'} MXN · Por Mork_Oficial`,
    url: window.location.href,
  };
  if (navigator.share) navigator.share(data);
  else {
    navigator.clipboard?.writeText(`${data.text}\n${data.url}`);
    showToast('📋 Link copiado');
  }
  logA('share', {});
}

// ── TOAST ──
function showToast(m) {
  const t = document.getElementById('toast');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// ── INIT ──
function initApp() {
  appReady = true;
  popSel('aFr', 'aTo');
  fetchR();
  setInterval(fetchR, 60000);
  setInterval(() => {
    rL();
    rA();
  }, 1000);
  renderComments();
  checkZoom();
  window.addEventListener('resize', checkZoom);
}

window.addEventListener('DOMContentLoaded', () => {
  popSel('gF', 'gT');
  fetchR();
  setInterval(fetchR, 60000);
  setInterval(rL, 1000);
  checkZoom();
  const s = gS();
  if (s) enterApp(s);
});
