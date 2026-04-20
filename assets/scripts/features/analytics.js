import { gU } from '../core/storage.js';

export function logA(ev, data) {
  const logs = JSON.parse(localStorage.getItem('nfx_log') || '[]');
  logs.push({ ev, data, ts: new Date().toISOString() });
  if (logs.length > 500) logs.splice(0, logs.length - 500);
  localStorage.setItem('nfx_log', JSON.stringify(logs));
}

export function showAdminDashboard() {
  const users = gU().map((u) => ({
    name: u.name,
    email: u.email,
    joined: u.joined,
    lastLogin: u.lastLogin,
    sessions: u.sessions,
  }));
  const logs = JSON.parse(localStorage.getItem('nfx_log') || '[]');
  const evs = {};
  logs.forEach((l) => {
    evs[l.ev] = (evs[l.ev] || 0) + 1;
  });
  const comments = JSON.parse(localStorage.getItem('nfx_comments') || '[]');
  console.group('%c NexFX Admin — © Mork_Oficial', 'color:#00f5d4;font-size:16px;font-weight:bold');
  console.log('%c USUARIOS', 'color:#3b82f6;font-weight:bold', users.length);
  console.table(users);
  console.log('%c EVENTOS', 'color:#8b5cf6;font-weight:bold');
  console.table(evs);
  console.log('%c COMENTARIOS (' + comments.length + ')', 'color:#f59e0b;font-weight:bold');
  console.table(comments);
  console.groupEnd();
  return { users, evs, logs, comments };
}
