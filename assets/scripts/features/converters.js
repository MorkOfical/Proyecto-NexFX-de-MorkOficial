import { CURR, FL } from '../core/constants.js';
import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';

export function cv(amt, fr, to) {
  const { rates } = state;
  if (!rates[fr] || !rates[to]) return null;
  return (amt / rates[fr]) * rates[to];
}

export function popSel(fId, tId, fD = 'USD', tD = 'MXN') {
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

function guestPairLabels() {
  const fr = document.getElementById('gF').value,
    to = document.getElementById('gT').value;
  const { rates } = state;
  if (rates[fr] && rates[to]) {
    const r1 = cv(1, fr, to),
      r2 = cv(1, to, fr);
    if (r1) document.getElementById('gFP').textContent = `1 ${fr} = ${r1.toFixed(4)} ${to}`;
    if (r2) document.getElementById('gTP').textContent = `1 ${to} = ${r2.toFixed(4)} ${fr}`;
  }
}

export function gwC() {
  guestPairLabels();
  gwCF();
}

export function gwCF() {
  const amt = parseFloat(document.getElementById('gA').value);
  const fr = document.getElementById('gF').value,
    to = document.getElementById('gT').value;
  guestPairLabels();
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

export function gwCT() {
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

export function gwSw() {
  const fc = document.getElementById('gF'),
    tc = document.getElementById('gT');
  [fc.value, tc.value] = [tc.value, fc.value];
  gwCF();
  showToast('⇅');
}

export function aCF() {
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

export function aCT() {
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

export function aSw() {
  const fc = document.getElementById('aFr'),
    tc = document.getElementById('aTo');
  [fc.value, tc.value] = [tc.value, fc.value];
  document.getElementById('aFF').textContent = FL[fc.value] || '🏳️';
  document.getElementById('aTF').textContent = FL[tc.value] || '🏳️';
  aCF();
  showToast('⇅');
}
