import { isConfigured, signIn, signOut, watchAdvice, moderateAdvice, deleteAdvice, resetPassword, friendlyError } from './api.js';
const $ = selector => document.querySelector(selector);
const login = $('#login-form');
const moderation = $('#moderation');
const status = $('#admin-status');
const list = $('#admin-list');
const filter = $('#status-filter');
const search = $('#search');
const deleteDialog = $('#delete-dialog');
const labels = { pending: 'Pendiente', approved: 'Publicado', rejected: 'Rechazado', hidden: 'Oculto' };
let items = [];
let page = 0;
let busy = false;
let target = null;
let stopWatching = () => {};
const PAGE_SIZE = 20;

if (!isConfigured()) {
  $('#setup-notice').hidden = false;
  login.querySelectorAll('button').forEach(button => button.disabled = true);
}

function render() {
  $('#stat-total').textContent = items.length;
  $('#stat-approved').textContent = items.filter(item => item.status === 'approved').length;
  $('#stat-hidden').textContent = items.filter(item => item.status !== 'approved').length;
  const term = search.value.trim().toLocaleLowerCase('es-AR');
  const filtered = items.filter(item => (filter.value === 'all' || item.status === filter.value) && `${item.alias} ${item.message}`.toLocaleLowerCase('es-AR').includes(term));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  page = Math.min(page, pages - 1);
  list.replaceChildren(...filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(card));
  $('#list-status').textContent = filtered.length ? `${filtered.length} consejos · más recientes primero` : 'No hay consejos para mostrar con estos filtros.';
  $('#page-label').textContent = `Página ${page + 1} de ${pages}`;
  $('#previous').disabled = page === 0 || busy;
  $('#next').disabled = page >= pages - 1 || busy;
}
function card(item) {
  const article = document.createElement('article'); article.className = 'admin-item';
  const top = document.createElement('div'); top.className = 'admin-item-top';
  const badge = document.createElement('span'); badge.className = `status-badge status-${item.status}`; badge.textContent = labels[item.status] || item.status;
  const meta = document.createElement('span'); meta.className = 'admin-meta'; meta.textContent = `${item.alias || 'Sin nombre'} · ${new Date(item.created_at).toLocaleString('es-AR')}`;
  top.append(badge, meta);
  const quote = document.createElement('blockquote'); quote.textContent = item.message;
  const actions = document.createElement('div'); actions.className = 'admin-actions';
  for (const [action, label] of [['approved', 'Publicar'], ['hidden', 'Ocultar'], ['delete', 'Eliminar']]) {
    if (action === item.status) continue;
    const button = document.createElement('button'); button.textContent = label; button.disabled = busy;
    button.onclick = () => {
      if (busy) return;
      if (action === 'delete') { target = item.id; $('#delete-preview').textContent = item.message; deleteDialog.showModal(); $('#cancel-delete').focus(); }
      else runAction(item.id, action);
    };
    actions.append(button);
  }
  article.append(top, quote, actions); return article;
}
function lockDashboard() {
  stopWatching(); items = []; moderation.hidden = true; login.hidden = false;
  list.replaceChildren(); $('#admin-email').textContent = '';
}
async function runAction(id, action) {
  if (busy) return;
  busy = true; status.textContent = ''; render();
  try {
    if (action === 'delete') await deleteAdvice(id); else await moderateAdvice(id, action);
    status.textContent = action === 'delete' ? 'Consejo eliminado del tablero.' : action === 'hidden' ? 'Consejo oculto. Podés publicarlo de nuevo cuando quieras.' : 'Consejo publicado.';
  } catch (error) { status.textContent = friendlyError(error); }
  finally { busy = false; render(); }
}
login.onsubmit = async event => {
  event.preventDefault(); const button = login.querySelector('[type=submit]'); button.disabled = true; status.textContent = 'Verificando acceso…';
  try {
    const email = await signIn(login.email.value.trim(), login.password.value);
    login.reset(); login.hidden = true; moderation.hidden = false; $('#admin-email').textContent = email;
    status.textContent = ''; $('#list-status').textContent = 'Cargando consejos…'; page = 0;
    stopWatching();
    stopWatching = watchAdvice(nextItems => { items = nextItems; render(); }, error => {
      lockDashboard(); status.textContent = friendlyError(error); signOut().catch(() => {});
    }, { admin: true });
  } catch (error) { status.textContent = friendlyError(error); }
  finally { button.disabled = false; }
};
$('#reset-password').onclick = async () => {
  const button = $('#reset-password'); button.disabled = true; status.textContent = '';
  try { await resetPassword(login.email.value); status.textContent = 'Si el correo tiene una cuenta, recibirás un enlace para cambiar tu contraseña. Revisá también Spam.'; }
  catch (error) { status.textContent = friendlyError(error); }
  finally { button.disabled = false; }
};
filter.onchange = search.oninput = () => { page = 0; render(); };
$('#previous').onclick = () => { page = Math.max(0, page - 1); render(); };
$('#next').onclick = () => { page++; render(); };
$('#logout').onclick = async () => {
  if (busy) return;
  lockDashboard();
  try { await signOut(); status.textContent = 'Sesión cerrada.'; }
  catch (error) { status.textContent = friendlyError(error); }
  login.email.focus();
};
$('#cancel-delete').onclick = () => { target = null; deleteDialog.close(); };
deleteDialog.addEventListener('cancel', () => { target = null; });
$('#confirm-delete').onclick = () => { const id = target; target = null; deleteDialog.close(); if (id) runAction(id, 'delete'); };

if (isConfigured()) login.querySelectorAll('button').forEach(button => button.disabled = false);
