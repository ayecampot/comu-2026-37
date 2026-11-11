import { content } from './content.js';
import { illustration } from './illustrations.js';
import { watchAdvice, submitAdvice, isConfigured, friendlyError } from './api.js';

function renderPodcast(item) {
  const card = document.createElement('article');
  card.className = `podcast-card theme-${item.theme}`;
  const cover = document.createElement('div');
  cover.className = `card-cover ${item.theme}`;
  if (item.cover) {
    cover.classList.add('has-cover');
    const image = document.createElement('img'); image.src = new URL(item.cover.replace(/^\//, ''), document.baseURI).href; image.alt = `Portada de ${item.title}`; image.loading = 'lazy'; cover.append(image);
  } else {
    cover.innerHTML = illustration(item.illustration);
    const label = document.createElement('span'); label.className = 'cover-label'; label.textContent = item.id.startsWith('puentes') ? 'PROYECTO PUENTES' : 'JÓVENES Y MUNDO LABORAL';
    const corner = document.createElement('span'); corner.className = 'cover-corner'; corner.textContent = '↗'; corner.setAttribute('aria-hidden', 'true'); cover.append(label, corner);
  }
  const body = document.createElement('div'); body.className = 'card-content';
  const meta = document.createElement('div'); meta.className = 'card-meta';
  const label = document.createElement('span'); label.textContent = item.label; meta.append(label);
  if (!item.audio) { const badge = document.createElement('span'); badge.className = 'coming-label'; badge.textContent = 'En preparación'; meta.append(badge); }
  const title = document.createElement('h3'); title.textContent = item.title; body.append(meta, title);
  if (item.audio) { const audio = document.createElement('audio'); audio.controls = true; audio.preload = 'none'; audio.src = new URL(item.audio.replace(/^\//, ''), document.baseURI).href; audio.setAttribute('aria-label', `Escuchar ${item.title}`); body.append(audio); }
  else {
    const placeholder = document.createElement('div'); placeholder.className = 'audio-placeholder';
    placeholder.innerHTML = '<span class="play-placeholder" aria-hidden="true">▶</span><span class="waveform" aria-hidden="true"></span><span class="audio-label">Audio próximamente</span>';
    const wave = placeholder.querySelector('.waveform');
    Array.from({ length: 27 }, (_, i) => { const bar = document.createElement('i'); bar.style.height = `${5 + ((i * 7 + i % 4) % 17)}px`; wave.append(bar); });
    body.append(placeholder);
  }
  card.append(cover, body); return card;
}
for (const [section, items] of Object.entries(content.projects)) document.querySelector(`#${section}-grid`).replaceChildren(...items.map(renderPodcast));
for (const key of ['school', 'teacher', 'year']) document.querySelectorAll(`[data-${key}]`).forEach(el => el.textContent = content[key]);
document.addEventListener('play', event => { if (event.target.tagName === 'AUDIO') document.querySelectorAll('audio').forEach(audio => { if (audio !== event.target) audio.pause(); }); }, true);

const board = document.querySelector('#advice-board');
const emptyBoard = board.firstElementChild.cloneNode(true);
let visibleCount = 30;
let items = [];
let stopWatching = () => {};
const more = document.createElement('button'); more.className = 'secondary-button load-more'; more.textContent = 'Ver más consejos'; more.hidden = true; board.after(more);
function note(item) {
  const el = document.createElement('article'); el.className = 'note';
  const quote = document.createElement('blockquote'); quote.textContent = item.message;
  const author = document.createElement('cite'); author.textContent = `— ${item.alias || 'Una voz de la muestra'}`;
  el.append(quote, author); return el;
}
function renderAdvice() {
  board.replaceChildren(...items.slice(0, visibleCount).map(note));
  if (!items.length) board.append(emptyBoard.cloneNode(true));
  more.hidden = items.length <= visibleCount;
}
function loadAdvice() {
  if (!isConfigured()) return;
  stopWatching();
  board.setAttribute('aria-busy', 'true');
  stopWatching = watchAdvice(nextItems => {
    items = nextItems; renderAdvice(); board.removeAttribute('aria-busy');
  }, () => {
    board.removeAttribute('aria-busy'); more.hidden = true;
    const error = document.createElement('div'); error.className = 'board-error';
    const p = document.createElement('p'); p.textContent = 'No pudimos cargar los consejos. Revisá la conexión e intentá de nuevo.';
    const retry = document.createElement('button'); retry.className = 'secondary-button'; retry.textContent = 'Volver a cargar'; retry.onclick = loadAdvice;
    error.append(p, retry); board.replaceChildren(error);
  });
}
more.onclick = () => { visibleCount += 30; renderAdvice(); };
loadAdvice();
const dialog = document.querySelector('#advice-dialog');
const form = document.querySelector('#advice-form');
const status = document.querySelector('#form-status');
const success = document.querySelector('#form-success');
document.querySelector('#open-advice').onclick = () => {
  form.hidden = false; success.hidden = true; status.textContent = ''; dialog.showModal();
  if (!isConfigured()) status.textContent = 'Estamos preparando el tablero. Pronto vas a poder enviar tu consejo.';
};
document.querySelector('.dialog-close').onclick = () => dialog.close();
document.querySelector('#close-success').onclick = () => dialog.close();
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelector('#message').addEventListener('input', event => { document.querySelector('#message-count').textContent = `${event.target.value.length} / 500`; });
form.addEventListener('submit', async event => {
  event.preventDefault(); const button = form.querySelector('[type=submit]');
  button.disabled = true; button.textContent = 'Enviando…'; status.textContent = '';
  try {
    await submitAdvice(form.alias.value, form.message.value);
    form.reset(); document.querySelector('#message-count').textContent = '0 / 500'; form.hidden = true; success.hidden = false; document.querySelector('#close-success').focus();
  } catch (error) { status.textContent = friendlyError(error); }
  finally { button.disabled = false; button.textContent = 'Enviar mi consejo ↗'; }
});
