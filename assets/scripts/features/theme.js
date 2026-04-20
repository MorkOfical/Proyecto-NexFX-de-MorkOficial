import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';

export function applyTheme() {
  document.body.classList.toggle('light', !state.dark);
  const ic = state.dark ? '🌙' : '☀️';
  ['tB', 'tB2'].forEach((id) => {
    const e = document.getElementById(id);
    if (e) e.textContent = ic;
  });
  const m = document.getElementById('tMI');
  if (m) m.textContent = ic;
  if (state.chartInst)
    ((state.chartInst.options.plugins.legend.labels.color = state.dark ? '#8faac8' : '#475569'),
      state.chartInst.update());
}

export function initTheme() {
  state.dark = localStorage.getItem('nfx_t') !== 'light';
}

export function toggleTheme() {
  state.dark = !state.dark;
  localStorage.setItem('nfx_t', state.dark ? 'dark' : 'light');
  applyTheme();
  showToast(state.dark ? '🌙 Modo oscuro' : '☀️ Modo claro');
}
