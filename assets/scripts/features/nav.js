import { logA } from './analytics.js';
import { renderComments } from './comments.js';
import { updateChart } from './chart.js';

export function showP(name, el) {
  document.querySelectorAll('.ap').forEach((p) => p.classList.remove('on'));
  document.querySelectorAll('.ani,.bni').forEach((n) => n.classList.remove('on'));
  document.getElementById('pg' + name).classList.add('on');
  if (el) el.classList.add('on');
  logA('page', { page: name });
  if (name === 'Chart') setTimeout(() => updateChart(), 100);
  if (name === 'Comments') renderComments();
}
