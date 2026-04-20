import { SK } from '../core/constants.js';
import { state } from '../core/state.js';
import { gU, sU, gS, sS } from '../core/storage.js';
import { closeM, openM } from '../core/modals.js';
import { showToast } from '../core/toast.js';
import { logA } from './analytics.js';

export { gU, sU, gS, sS };

export function openAuth(t) {
  swTab(t);
  openM('authM');
}

export function swTab(t) {
  document.getElementById('lF').style.display = t === 'login' ? 'block' : 'none';
  document.getElementById('rF').style.display = t === 'reg' ? 'block' : 'none';
  document.getElementById('tL').className = 'atab' + (t === 'login' ? ' on' : '');
  document.getElementById('tR').className = 'atab' + (t === 'reg' ? ' on' : '');
  document.getElementById('aE').textContent = '';
}

function sErr(m) {
  document.getElementById('aE').textContent = m;
}

export function doLogin() {
  const email = document.getElementById('lE').value.trim();
  const pass = document.getElementById('lP').value;
  if (!email || !pass) {
    sErr('Completa todos los campos');
    return;
  }
  const u = gU().find((u) => u.email === email && u.pass === pass);
  if (!u) {
    sErr('Correo o contraseña incorrectos');
    return;
  }
  sS(u);
  closeM('authM');
  enterApp(u);
}

export function doReg() {
  const name = document.getElementById('rN').value.trim();
  const email = document.getElementById('rE').value.trim();
  const pass = document.getElementById('rP').value;
  if (!name || !email || !pass) {
    sErr('Completa todos los campos');
    return;
  }
  if (pass.length < 6) {
    sErr('Contraseña mínimo 6 caracteres');
    return;
  }
  const users = gU();
  if (users.find((u) => u.email === email)) {
    sErr('Este correo ya está registrado');
    return;
  }
  const user = {
    name,
    email,
    pass,
    joined: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    sessions: 1,
  };
  users.push(user);
  sU(users);
  sS(user);
  logA('register', { name, email });
  closeM('authM');
  enterApp(user);
}

export function doLogout() {
  localStorage.removeItem(SK);
  document.getElementById('app').classList.remove('on');
  document.getElementById('land').style.display = '';
  showToast('👋 Hasta pronto');
}

/** Asignado desde main.js para evitar dependencia circular con app/init.js */
let _initApp = () => {};

export function setInitApp(fn) {
  _initApp = fn;
}

export function enterApp(u) {
  const users = gU();
  const i = users.findIndex((x) => x.email === u.email);
  if (i >= 0) {
    users[i].lastLogin = new Date().toISOString();
    users[i].sessions = (users[i].sessions || 0) + 1;
    sU(users);
  }
  logA('login', { email: u.email });
  document.getElementById('land').style.display = 'none';
  document.getElementById('app').classList.add('on');
  document.getElementById('aUN').textContent = u.name.split(' ')[0].toUpperCase();
  document.getElementById('pAv').textContent = u.name[0].toUpperCase();
  document.getElementById('pNm').textContent = u.name;
  document.getElementById('pEm').textContent = u.email;
  state.currentUser = u;
  if (!state.appReady) _initApp();
}
