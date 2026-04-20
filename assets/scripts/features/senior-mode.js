import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';

export function initSeniorMode() {
  state.seniorMode = localStorage.getItem('nfx_senior') === '1';
}

export function applySenior() {
  document.body.classList.toggle('senior', state.seniorMode);
  const lbl = document.getElementById('seniorModeLabel');
  if (lbl) lbl.textContent = state.seniorMode ? 'Modo Fácil ACTIVO ✓' : 'Modo Fácil (letra grande)';
}

export function activateSenior() {
  state.seniorMode = true;
  localStorage.setItem('nfx_senior', '1');
  applySenior();
  document.getElementById('seniorBanner').style.display = 'none';
  showToast('👴 Modo Fácil activado');
}

export function toggleSeniorMode() {
  state.seniorMode = !state.seniorMode;
  localStorage.setItem('nfx_senior', state.seniorMode ? '1' : '0');
  applySenior();
  showToast(state.seniorMode ? '👴 Modo Fácil activado' : 'Modo Fácil desactivado');
}

export function checkSeniorSignal() {
  state.seniorSignals++;
  if (state.seniorSignals >= 3 && !state.seniorMode && !state.seniorBannerShown) {
    state.seniorBannerShown = true;
    const b = document.getElementById('seniorBanner');
    if (b) b.style.display = 'flex';
  }
}

export function checkZoom() {
  if (state.zoomCheckDone) return;
  const zoom = window.devicePixelRatio || 1;
  const ww = window.innerWidth;
  if (zoom > 2.2 || ww < 320) {
    checkSeniorSignal();
    state.zoomCheckDone = true;
  }
}
