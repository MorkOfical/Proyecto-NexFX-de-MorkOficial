import { LANGS } from '../core/constants.js';
import { state } from '../core/state.js';
import { logA } from './analytics.js';
import { checkSeniorSignal } from './senior-mode.js';

function bldSys() {
  const seniorTip = state.seniorMode
    ? '\nEl usuario usa Modo Fácil — usa frases simples, claras y sin tecnicismos. Responde como si le hablaras a una persona mayor.'
    : '';
  return `Eres NORA, la asistente financiera de NexFX, plataforma de divisas creada por Mork_Oficial. Experta en finanzas, divisas, crypto y economía global. Idioma: ${LANGS.find((l) => l.code === state.lang)?.label || 'Español mexicano'}. Responde SIEMPRE en ese idioma. Tasa actual: 1 USD = ${state.usdMxn ? state.usdMxn.toFixed(2) : '~17.50'} MXN. NUNCA menciones Claude ni Anthropic — eres NORA de NexFX. Si piden contactar al dev: LinkedIn https://www.linkedin.com/in/daniel-alejandro-mugarte-flores-6178063b6 o GitHub https://github.com/MorkOfical${seniorTip}`;
}

function addMsg(cId, text, type) {
  const c = document.getElementById(cId);
  const el = document.createElement('div');
  el.className = 'msg ' + type;
  if (type.includes('bot') && !type.includes('thinking'))
    el.innerHTML = `<div class="ms">✦ NORA</div>${text}`;
  else el.textContent = text;
  c.appendChild(el);
  c.scrollTop = c.scrollHeight;
  return el;
}

export async function sA() {
  const inp = document.getElementById('aI');
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';
  document.getElementById('aSB').disabled = true;
  state.noraQueryCount++;
  if (state.noraQueryCount >= 3) checkSeniorSignal();
  addMsg('aMs', txt, 'user');
  state.aH.push({ role: 'user', content: txt });
  const tk = addMsg('aMs', '...', 'bot thinking');
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: bldSys(),
        messages: state.aH,
      }),
    });
    const d = await r.json();
    const reply = d.content?.map((b) => b.text || '').join('') || 'Error.';
    tk.remove();
    addMsg('aMs', reply, 'bot');
    state.aH.push({ role: 'assistant', content: reply });
    if (state.aH.length > 20) state.aH = state.aH.slice(-20);
    logA('nora', { lang: state.lang });
  } catch {
    tk.remove();
    addMsg('aMs', 'Error de conexión. Verifica tu internet.', 'bot');
  }
  document.getElementById('aSB').disabled = false;
}

export function togF() {
  state.fOpen = !state.fOpen;
  document.getElementById('fP').classList.toggle('open', state.fOpen);
  document.getElementById('nHi').style.display = 'none';
}

export async function sF() {
  const inp = document.getElementById('fI');
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';
  document.getElementById('fSB').disabled = true;
  state.noraQueryCount++;
  if (state.noraQueryCount >= 3) checkSeniorSignal();
  addMsg('fMs', txt, 'user');
  state.fH.push({ role: 'user', content: txt });
  const tk = addMsg('fMs', '...', 'bot thinking');
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: bldSys(),
        messages: state.fH,
      }),
    });
    const d = await r.json();
    const reply = d.content?.map((b) => b.text || '').join('') || 'Error.';
    tk.remove();
    addMsg('fMs', reply, 'bot');
    state.fH.push({ role: 'assistant', content: reply });
    if (state.fH.length > 16) state.fH = state.fH.slice(-16);
  } catch {
    tk.remove();
    addMsg('fMs', 'Error de conexión.', 'bot');
  }
  document.getElementById('fSB').disabled = false;
}
