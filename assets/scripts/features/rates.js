import { state } from '../core/state.js';
import { gwC, aCF } from './converters.js';

export async function fetchR() {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD');
    const d = await r.json();
    if (d.result !== 'success') throw 0;
    state.rates = d.rates;
    setR();
  } catch {
    try {
      const r2 = await fetch('https://api.exchangerate.host/latest?base=USD');
      const d2 = await r2.json();
      state.rates = d2.rates;
      setR();
    } catch {}
  }
}

export function setR() {
  state.usdMxn = state.rates.MXN;
  if (!state.openRate) state.openRate = state.usdMxn;
  if (!state.dailyHigh || state.usdMxn > state.dailyHigh) state.dailyHigh = state.usdMxn;
  if (!state.dailyLow || state.usdMxn < state.dailyLow) state.dailyLow = state.usdMxn;
  rL();
  rA();
  gwC();
  aCF();
}

export function xr(a, b) {
  const { rates } = state;
  return rates[a] && rates[b] ? (rates[b] / rates[a]).toFixed(4) : '—';
}

export function rL() {
  if (!state.usdMxn) return;
  document.getElementById('lwR').textContent = state.usdMxn.toFixed(4);
  const diff = state.openRate ? state.usdMxn - state.openRate : 0;
  const pct = state.openRate ? ((diff / state.openRate) * 100).toFixed(2) : '0.00';
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

export function rA() {
  if (!state.usdMxn) return;
  document.getElementById('aR').textContent = state.usdMxn.toFixed(4);
  const diff = state.openRate ? state.usdMxn - state.openRate : 0;
  const pct = state.openRate ? ((diff / state.openRate) * 100).toFixed(2) : '0.00';
  const s = diff >= 0 ? '+' : '';
  const c = document.getElementById('aC');
  c.textContent = `${s}${diff.toFixed(4)} (${s}${pct}%)`;
  c.className = 'chip ' + (diff > 0 ? 'pos' : diff < 0 ? 'neg' : 'neu');
  document.getElementById('aT').textContent = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  if (state.dailyHigh) document.getElementById('aH').textContent = state.dailyHigh.toFixed(2);
  if (state.dailyLow) document.getElementById('aL').textContent = state.dailyLow.toFixed(2);
  document.getElementById('aPEM').textContent = xr('EUR', 'MXN');
  document.getElementById('aPGM').textContent = xr('GBP', 'MXN');
  document.getElementById('aPCM').textContent = xr('CAD', 'MXN');
  document.getElementById('aPBM').textContent = xr('BRL', 'MXN');
  document.getElementById('aPJM').textContent = xr('JPY', 'MXN');
  document.getElementById('aPAM').textContent = xr('ARS', 'MXN');
}
