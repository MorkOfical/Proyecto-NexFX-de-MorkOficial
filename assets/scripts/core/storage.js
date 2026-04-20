import { UK, SK } from './constants.js';

export const gU = () => JSON.parse(localStorage.getItem(UK) || '[]');
export const sU = (u) => localStorage.setItem(UK, JSON.stringify(u));
export const gS = () => JSON.parse(localStorage.getItem(SK) || 'null');
export const sS = (u) => localStorage.setItem(SK, JSON.stringify(u));
