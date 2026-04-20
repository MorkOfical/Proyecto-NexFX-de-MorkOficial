export function openM(id) {
  document.getElementById(id).classList.add('open');
}

export function closeM(id) {
  document.getElementById(id).classList.remove('open');
}

export function cOvl(e, id) {
  if (e.target.id === id) closeM(id);
}
