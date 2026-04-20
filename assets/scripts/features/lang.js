import { LANGS } from '../core/constants.js';
import { state } from '../core/state.js';
import { closeM, openM } from '../core/modals.js';
import { showToast } from '../core/toast.js';

export function initLang() {
  state.lang =
    localStorage.getItem('nfx_l') ||
    (LANGS.find((l) => l.code === (navigator.language || 'es').split('-')[0])
      ? (navigator.language || 'es').split('-')[0]
      : 'es');
}

export function openLang() {
  const g = document.getElementById('lgr');
  g.innerHTML = '';
  LANGS.forEach((l) => {
    const d = document.createElement('div');
    d.className = 'lo' + (l.code === state.lang ? ' sel' : '');
    d.innerHTML = `<div class="lf">${l.flag}</div><div class="ln">${l.label}</div>`;
    d.onclick = () => {
      state.lang = l.code;
      localStorage.setItem('nfx_l', l.code);
      closeM('lgM');
      showToast('🌐 ' + l.label);
    };
    g.appendChild(d);
  });
  openM('lgM');
}
