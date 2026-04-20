import { state } from '../core/state.js';
import { popSel } from '../features/converters.js';
import { fetchR, rL, rA } from '../features/rates.js';
import { renderComments } from '../features/comments.js';
import { checkZoom } from '../features/senior-mode.js';

export function initApp() {
  state.appReady = true;
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
