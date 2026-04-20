import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';
import { logA } from './analytics.js';

export function selType(el, type) {
  state.selectedType = type;
  document.querySelectorAll('.ctype-btn').forEach((b) => b.classList.remove('on'));
  el.classList.add('on');
}

export function postComment() {
  const txt = document.getElementById('commentText').value.trim();
  if (!txt) {
    showToast('Escribe algo primero ✏️');
    return;
  }
  if (!state.currentUser) {
    showToast('Inicia sesión para comentar');
    return;
  }
  const comments = JSON.parse(localStorage.getItem('nfx_comments') || '[]');
  const comment = {
    id: Date.now(),
    user: state.currentUser.name,
    email: state.currentUser.email,
    text: txt,
    type: state.selectedType,
    date: new Date().toISOString(),
  };
  comments.unshift(comment);
  localStorage.setItem('nfx_comments', JSON.stringify(comments));
  document.getElementById('commentText').value = '';
  logA('comment', { type: state.selectedType, length: txt.length });
  analyzeCommentSilent(comment);
  renderComments();
  showToast('¡Comentario enviado! 🌟');
}

async function analyzeCommentSilent(comment) {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system:
          'Analiza este comentario de usuario de una app de divisas llamada NexFX. Extrae: 1) sentimiento (positivo/negativo/neutro), 2) tema principal, 3) si hay una acción de mejora sugerida. Responde en JSON solo: {"sentiment":"...","topic":"...","action":"..."}',
        messages: [{ role: 'user', content: `Tipo: ${comment.type}\nComentario: ${comment.text}` }],
      }),
    });
    const d = await r.json();
    const txt = d.content?.[0]?.text || '{}';
    try {
      const analysis = JSON.parse(txt.replace(/```json|```/g, '').trim());
      const comments = JSON.parse(localStorage.getItem('nfx_comments') || '[]');
      const idx = comments.findIndex((c) => c.id === comment.id);
      if (idx >= 0) {
        comments[idx]._analysis = analysis;
        localStorage.setItem('nfx_comments', JSON.stringify(comments));
      }
    } catch {}
  } catch {}
}

export function renderComments() {
  const list = document.getElementById('commentList');
  const comments = JSON.parse(localStorage.getItem('nfx_comments') || '[]');
  if (!comments.length) {
    list.innerHTML = '<div class="no-comments">Sé el primero en comentar 🌟</div>';
    return;
  }
  list.innerHTML = comments
    .map((c) => {
      const d = new Date(c.date);
      const ds = d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
      const tagClass = `tag-${c.type}`;
      const tagEmoji = c.type === 'sugerencia' ? '💡' : c.type === 'pregunta' ? '❓' : '⚠️';
      return `<div class="comment-item"><div class="comment-meta"><div class="comment-avatar">${c.user[0].toUpperCase()}</div><span class="comment-name">${c.user}</span><span class="comment-date">${ds}</span><span class="comment-tag ${tagClass}">${tagEmoji} ${c.type}</span></div><div class="comment-text">${c.text}</div></div>`;
    })
    .join('');
}
