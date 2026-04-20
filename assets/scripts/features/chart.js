import { state } from '../core/state.js';

function genHistoricalData(baseRate, days) {
  const data = [];
  const now = Date.now();
  let price = baseRate * (0.94 + Math.random() * 0.12);
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 86400000);
    price = price * (1 + (Math.random() - 0.48) * 0.008);
    data.push({
      x: date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      y: parseFloat(price.toFixed(4)),
    });
  }
  return data;
}

export function setChartRange(days, el) {
  state.chartRange = days;
  document.querySelectorAll('.ctab').forEach((t) => t.classList.remove('on'));
  if (el) el.classList.add('on');
  updateChart();
}

export function updateChart() {
  const cur = document.getElementById('chartCur')?.value || 'MXN';
  const { rates } = state;
  const baseRate = rates[cur] || 17.5;
  const data = genHistoricalData(baseRate, state.chartRange);
  const vals = data.map((d) => d.y);
  const high = Math.max(...vals),
    low = Math.min(...vals),
    avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const chg = ((vals[vals.length - 1] - vals[0]) / vals[0]) * 100;
  document.getElementById('chHigh').textContent = high.toFixed(4);
  document.getElementById('chLow').textContent = low.toFixed(4);
  document.getElementById('chAvg').textContent = avg.toFixed(4);
  const chEl = document.getElementById('chChg');
  chEl.textContent = (chg >= 0 ? '+' : '') + chg.toFixed(2) + '%';
  chEl.style.color = chg >= 0 ? 'var(--green)' : 'var(--red)';
  const ctx = document.getElementById('rateChart');
  if (!ctx) return;
  const isDarkMode = !document.body.classList.contains('light');
  const gridColor = isDarkMode ? 'rgba(30,45,85,.5)' : 'rgba(208,218,240,.8)';
  const textColor = isDarkMode ? '#8faac8' : '#475569';
  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, ctx.offsetHeight || 280);
  gradient.addColorStop(0, 'rgba(0,245,212,.25)');
  gradient.addColorStop(1, 'rgba(0,245,212,.01)');
  if (state.chartInst) state.chartInst.destroy();
  state.chartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((d) => d.x),
      datasets: [
        {
          label: `USD/${cur}`,
          data: vals,
          borderColor: '#00f5d4',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,16,32,.9)',
          titleColor: '#00f5d4',
          bodyColor: '#e2eaf8',
          borderColor: '#1e2d55',
          borderWidth: 1,
          callbacks: { label: (c) => `${c.dataset.label}: ${c.raw.toFixed(4)}` },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, maxTicksLimit: 8, maxRotation: 0 },
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, callback: (v) => v.toFixed(2) },
        },
      },
    },
  });
}
