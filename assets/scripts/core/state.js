/**
 * Estado mutable compartido entre features (tasas, tema, sesión, NORA, etc.).
 * Evita acoplamientos circulares entre módulos que antes compartían `let` globales.
 */
export const state = {
  lang: 'es',

  dark: true,

  rates: {},
  usdMxn: null,
  dailyHigh: null,
  dailyLow: null,
  openRate: null,

  chartInst: null,
  chartRange: 7,

  currentUser: null,
  appReady: false,

  seniorMode: false,
  seniorSignals: 0,
  seniorBannerShown: false,

  selectedType: 'sugerencia',

  aH: [],
  fH: [],
  fOpen: false,
  noraQueryCount: 0,
  zoomCheckDone: false,
};
