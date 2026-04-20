import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';
import { logA } from './analytics.js';

export function shareApp() {
  const data = {
    title: 'NexFX',
    text: `💱 Convierte cualquier moneda con IA.\n💵 USD→MXN: $${state.usdMxn ? state.usdMxn.toFixed(2) : '--'} MXN · Por Mork_Oficial`,
    url: window.location.href,
  };
  if (navigator.share) navigator.share(data);
  else {
    navigator.clipboard?.writeText(`${data.text}\n${data.url}`);
    showToast('📋 Link copiado');
  }
  logA('share', {});
}
