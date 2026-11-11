import { firebaseConfig } from './config.js';

export const isConfigured = () => ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'].every(key => Boolean(firebaseConfig[key]?.trim()));
let connection;

// Se carga Firebase únicamente al usar el tablero; no hace falta npm.
async function firebase() {
  if (!isConfigured()) throw new Error('El tablero todavía no está habilitado.');
  if (!connection) {
    connection = (async () => {
      const [app, database, auth] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js'),
        import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
      ]);
      const instance = app.initializeApp(firebaseConfig);
      const authentication = auth.getAuth(instance);
      await auth.setPersistence(authentication, auth.inMemoryPersistence);
      return { database, auth, db: database.getDatabase(instance), authentication };
    })().catch(error => { connection = null; throw error; });
  }
  return connection;
}

export function friendlyError(error) {
  const code = String(error.code || '').toLowerCase();
  if (/invalid-credential|wrong-password|user-not-found|invalid-email/.test(code)) return 'El correo o la contraseña no son correctos.';
  if (code.includes('too-many-requests')) return 'Hubo muchos intentos. Esperá unos minutos antes de volver a ingresar.';
  if (/permission.denied|permission_denied/.test(code)) return 'No tenés permiso. Revisá las reglas de Firebase y el permiso de tu cuenta administradora.';
  if (code.includes('operation-not-allowed')) return 'Activá Correo electrónico/Contraseña en Firebase Authentication.';
  if (code.includes('user-disabled')) return 'Esta cuenta está deshabilitada en Firebase.';
  if (code.includes('invalid-api-key')) return 'Revisá la configuración de Firebase en js/config.js.';
  if (/network|fetch|offline/.test(code + error.message)) return 'No hay conexión con Firebase. Revisá tu conexión e intentá nuevamente.';
  return error.code ? 'No pudimos conectar con Firebase. Revisá la configuración e intentá nuevamente.' : error.message;
}

export function validateAdvice(alias, message) {
  const clean = { alias: alias.trim(), message: message.trim() };
  if (clean.alias.length > 40) throw new Error('El nombre puede tener hasta 40 caracteres.');
  if (clean.message.length < 10 || clean.message.length > 500) throw new Error('Escribí un consejo de entre 10 y 500 caracteres.');
  return clean;
}

export async function submitAdvice(alias, message) {
  const clean = validateAdvice(alias, message);
  const { database: d, db } = await firebase();
  await d.set(d.push(d.ref(db, 'advice')), {
    ...clean, status: 'approved', created_at: d.serverTimestamp(),
  });
}

// Devuelve una función que cancela la escucha, incluso si la conexión sigue cargando.
export function watchAdvice(onItems, onError, { admin = false } = {}) {
  let cancelled = false;
  let unsubscribe = () => {};
  firebase().then(({ database: d, db }) => {
    if (cancelled) return;
    const path = d.ref(db, 'advice');
    const source = admin ? path : d.query(path, d.orderByChild('status'), d.equalTo('approved'));
    unsubscribe = d.onValue(source, snapshot => {
      const items = Object.entries(snapshot.val() || {}).map(([id, item]) => ({ ...item, id }));
      items.sort((a, b) => b.created_at - a.created_at || b.id.localeCompare(a.id));
      onItems(items);
    }, onError);
  }).catch(error => { if (!cancelled) onError(error); });
  return () => { cancelled = true; unsubscribe(); };
}

export async function signIn(email, password) {
  const { auth: a, authentication, database: d, db } = await firebase();
  const { user } = await a.signInWithEmailAndPassword(authentication, email, password);
  try {
    const permission = await d.get(d.ref(db, `admins/${user.uid}`));
    if (permission.val() !== true) throw new Error('Esta cuenta no tiene permiso de administración. Seguí el paso 5 de la guía.');
  } catch (error) { await a.signOut(authentication); throw error; }
  return user.email;
}
export async function signOut() {
  const { auth, authentication } = await firebase();
  await auth.signOut(authentication);
}
export async function resetPassword(email) {
  if (!email.trim()) throw new Error('Escribí tu correo para recuperar la contraseña.');
  const { auth, authentication } = await firebase();
  await auth.sendPasswordResetEmail(authentication, email.trim());
}
export async function moderateAdvice(id, status) {
  if (!['approved', 'rejected', 'hidden'].includes(status)) throw new Error('Acción inválida.');
  const { database: d, db } = await firebase();
  await d.update(d.ref(db, `advice/${id}`), { status });
}
export async function deleteAdvice(id) {
  const { database: d, db } = await firebase();
  await d.remove(d.ref(db, `advice/${id}`));
}
