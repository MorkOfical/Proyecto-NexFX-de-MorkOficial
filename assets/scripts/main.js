/* NexFX — punto de entrada (ES modules). Expone handlers en `window` para onclick en HTML. */

import { initLang, openLang } from './features/lang.js';
import { initTheme, applyTheme, toggleTheme } from './features/theme.js';
import {
  initSeniorMode,
  applySenior,
  activateSenior,
  toggleSeniorMode,
  checkZoom,
} from './features/senior-mode.js';
import { showAdminDashboard } from './features/analytics.js';
import {
  openAuth,
  swTab,
  doLogin,
  doReg,
  doLogout,
  enterApp,
  setInitApp,
  gS,
} from './features/auth.js';
import { showP } from './features/nav.js';
import { openM, closeM, cOvl } from './core/modals.js';
import { fetchR, rL, rA } from './features/rates.js';
import { popSel, gwC, gwCF, gwCT, gwSw, aCF, aCT, aSw } from './features/converters.js';
import { setChartRange } from './features/chart.js';
import { selType, postComment } from './features/comments.js';
import { sA, togF, sF } from './features/nora.js';
import { shareApp } from './features/share.js';
import { initApp } from './app/init.js';

initLang();
initTheme();
initSeniorMode();
applyTheme();
applySenior();

setInitApp(initApp);

window.showAdminDashboard = showAdminDashboard;

Object.assign(window, {
  openLang,
  toggleTheme,
  openAuth,
  swTab,
  doLogin,
  doReg,
  doLogout,
  showP,
  openM,
  closeM,
  cOvl,
  fetchR,
  rL,
  rA,
  popSel,
  gwC,
  gwCF,
  gwCT,
  gwSw,
  aCF,
  aCT,
  aSw,
  setChartRange,
  sA,
  selType,
  postComment,
  shareApp,
  toggleSeniorMode,
  activateSenior,
  togF,
  sF,
});

window.addEventListener('DOMContentLoaded', () => {
  popSel('gF', 'gT');
  fetchR();
  setInterval(fetchR, 60000);
  setInterval(rL, 1000);
  checkZoom();
  window.addEventListener('resize', checkZoom);
  const s = gS();
  if (s) enterApp(s);
});
