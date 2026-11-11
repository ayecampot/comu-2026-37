# Configurar Firebase y publicar en GitHub Pages

La web ya está preparada. Vas a crear dos cosas en Firebase: **Realtime Database**, donde se guardan los consejos, y **Authentication**, para que solo vos puedas administrar. No necesitás Firebase Hosting, Firestore, Cloud Functions ni instalar herramientas.

Los consejos se publican al enviarlos. Desde el dashboard podés ocultarlos, volver a mostrarlos o borrarlos.

## 1. Crear el proyecto

1. Entrá en [console.firebase.google.com](https://console.firebase.google.com/) con tu cuenta de Google.
2. Elegí **Crear un proyecto** o **Agregar proyecto**.
3. Poné un nombre, por ejemplo `comunicacion-6toa-2026`.
4. Google Analytics no es necesario para esta web: podés dejarlo desactivado.
5. Terminá el asistente y entrá al proyecto.
6. Mantené el plan **Spark** si querés comenzar sin facturación. Tiene cuotas: revisá **Uso** durante la muestra. No hace falta activar Blaze para implementar esta web.

## 2. Registrar la aplicación web

1. En la descripción general del proyecto, buscá el ícono **Web `</>`**. También se encuentra en **Configuración del proyecto → General → Tus apps → Agregar app**.
2. Poné un nombre como `Muestra escolar`.
3. No actives Firebase Hosting: el alojamiento será GitHub Pages.
4. Registrá la app. Firebase mostrará un objeto llamado `firebaseConfig`.
5. Si aparecen opciones de SDK, elegí la de **etiqueta de script** para ver los valores. No copies sus scripts al HTML: ya están incorporados en el código.
6. Dejá esa pantalla abierta o recuperá los valores después desde **Configuración del proyecto → General → Tus apps → Configuración del SDK**.

## 3. Crear Realtime Database

1. En el menú lateral, entrá en **Compilación / Build → Realtime Database**. Elegí **Realtime Database**, no Cloud Firestore.
2. Presioná **Crear base de datos**.
3. Seleccioná una ubicación disponible adecuada para tu público y continuá. La ubicación no se cambia después para esa instancia.
4. Elegí **modo bloqueado**, no modo de prueba. Publicaremos los permisos específicos en el paso 6.
5. En la pestaña **Datos**, copiá la URL de la base. Puede terminar en `firebaseio.com` o `firebasedatabase.app`; copiá exactamente la que muestra tu proyecto.

## 4. Crear tu usuario y contraseña

1. Entrá en **Build → Authentication → Comenzar**.
2. En **Método de acceso / Sign-in method**, habilitá **Correo electrónico/Contraseña** y guardá. No hace falta habilitar el acceso por enlace de correo.
3. En la pestaña **Usuarios / Users**, elegí **Agregar usuario**.
4. Escribí tu correo y una contraseña que solo conozcas vos. Guardala en un lugar seguro.
5. Copiá el **UID** de ese usuario. Es un identificador diferente del correo.

La contraseña nunca se coloca en los archivos de la web ni en GitHub. No hay una contraseña predeterminada: vas a entrar con la que acabás de crear.

## 5. Darle permiso de administrador a tu cuenta

Crear el usuario no le da automáticamente permiso para borrar consejos. Hay que autorizar su UID.

1. Volvé a **Realtime Database → Datos**.
2. Como la base todavía está vacía, podés usar el menú de tres puntos → **Importar JSON**.
3. En tu computadora, creá un archivo temporal `admin-inicial.json` con esto, reemplazando el texto por el UID real del paso anterior:

   ```json
   {
     "admins": {
       "PEGA_AQUI_TU_UID_REAL": true
     }
   }
   ```

4. Importá ese archivo. `true` tiene que ser un valor booleano, sin comillas.
5. Comprobá que la base muestre `admins → tu UID → true`.

**Importá en la raíz solo cuando la base esté vacía:** una importación reemplaza los datos del lugar seleccionado. Si ya hay consejos, usá los botones **+** de la pestaña Datos para agregar el nodo `admins` y, dentro, tu UID con valor booleano `true`, sin reemplazar la raíz ni el nodo `advice`.

Esta lista de administradores solo se modifica desde la consola de Firebase. Los visitantes no pueden darse permiso a sí mismos.

## 6. Publicar las reglas

1. Abrí el archivo [`firebase/database.rules.json`](firebase/database.rules.json) de este proyecto.
2. Copiá **todo** su contenido.
3. En Firebase, entrá en **Realtime Database → Reglas / Rules**.
4. Reemplazá el contenido del editor por el del archivo y presioná **Publicar**.

Estas reglas permiten enviar consejos nuevos y leer únicamente los publicados. Solo los UID autorizados pueden leer todos, cambiar su estado o eliminarlos. También validan la longitud y los campos permitidos. Los consejos nuevos deben nacer publicados y con fecha del servidor. Ningún visitante puede modificar o borrar uno existente.

No pongas `.read: true` y `.write: true` en la raíz: eso dejaría los datos sin protección.

## 7. Completar la configuración de la web

Abrí [`js/config.js`](js/config.js) y completá los valores reales:

```js
export const firebaseConfig = {
  apiKey: 'VALOR_DE_TU_APP_WEB',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  databaseURL: 'URL_EXACTA_DEL_PASO_3',
  projectId: 'ID_REAL_DEL_PROYECTO',
  appId: 'ID_REAL_DE_LA_APP_WEB',
};
```

Usá los valores que muestra Firebase, no los ejemplos de arriba. Si `databaseURL` no aparece en la configuración de la app, copiala directamente desde Realtime Database. Conservá `export` y el nombre `firebaseConfig`.

Estos identificadores son **configuración pública** y pueden estar en GitHub. La protección está en Authentication y en las reglas. No agregues contraseñas, credenciales de una cuenta de servicio ni claves privadas.

## 8. Probar en tu computadora

1. Abrí una terminal en la carpeta del proyecto.
2. Ejecutá:

   ```sh
   python3 -m http.server 5173
   ```

3. Abrí http://localhost:5173.
4. En el tablero, enviá un consejo de prueba de entre 10 y 500 caracteres.
5. Comprobá que aparezca y que se mantenga después de recargar.
6. Abrí http://localhost:5173/admin/ e ingresá con tu correo y contraseña del paso 4.
7. Comprobá el contador de publicados y buscá el consejo.
8. Presioná **Ocultar**: debe desaparecer de la página pública. Elegí **Publicar** para devolverlo al tablero.
9. Presioná **Eliminar** y confirmá: debe borrarse definitivamente.
10. En un navegador sin iniciar sesión, comprobá que no se pueda entrar al dashboard de datos sin tus credenciales.

La sesión del admin se mantiene solo en memoria. Si recargás la página, vas a tener que ingresar nuevamente. El botón **Olvidé mi contraseña** envía un correo de recuperación mediante Firebase.

## 9. Subir a GitHub Pages

1. Creá un repositorio en GitHub; si usás GitHub Free, elegí uno público para este flujo.
2. Subí el contenido de esta carpeta a la raíz del repositorio. `index.html`, `styles.css`, `.nojekyll` y las carpetas `js`, `assets`, `admin` y `firebase` deben quedar en ese nivel. No subas una carpeta extra que los envuelva.
3. Asegurate de haber subido `js/config.js` con tus valores públicos.
4. En GitHub, entrá en **Settings → Pages**.
5. En **Build and deployment → Source**, elegí **Deploy from a branch**.
6. Elegí tu rama, normalmente **main**, y la carpeta **/ (root)**. Guardá.
7. Esperá a que GitHub indique la URL publicada. Generalmente será:

   ```text
   https://TU_USUARIO.github.io/NOMBRE_DEL_REPOSITORIO/
   ```

8. El dashboard estará en:

   ```text
   https://TU_USUARIO.github.io/NOMBRE_DEL_REPOSITORIO/admin/
   ```

Las rutas ya están preparadas para ese prefijo. No necesitás npm, compilación ni un servidor propio.

## 10. Revisar el dominio y probar con otro dispositivo

1. En Firebase, abrí **Authentication → Configuración / Settings → Dominios autorizados**.
2. Agregá `TU_USUARIO.github.io`, sin `https://` y sin el nombre del repositorio. Si usás un dominio propio, agregalo también. Para pruebas locales, podés agregar `localhost` si no está incluido.
3. Abrí la web publicada desde tu celular y enviá un consejo.
4. Comprobá en tu computadora que aparezca automáticamente, sin recargar.
5. Desde el dashboard, ocultalo y verificá que desaparezca en el celular.
6. Borrá la prueba cuando termines.

## Si algo no funciona

| Lo que ves | Qué revisar |
| --- | --- |
| “Estamos preparando el tablero” | Falta alguno de los cinco valores en `js/config.js`, o no subiste el archivo actualizado. |
| Correo o contraseña incorrectos | Usá la cuenta de Authentication, no tu contraseña de Google salvo que coincidan por decisión tuya. |
| No tiene permiso de administración | El UID de Authentication debe existir exactamente en `admins` y tener el booleano `true`. |
| No tenés permiso / Permission denied | Verificá que publicaste las reglas de Realtime Database en el mismo proyecto y base que usaste en `config.js`. |
| No permite iniciar sesión | Habilitá Correo electrónico/Contraseña y revisá los dominios autorizados. |
| El sitio no carga estilos o imágenes | Conservá la estructura de carpetas y entrá por la URL que muestra Settings → Pages. |
| No aparece un consejo | Revisá la conexión y Realtime Database → Datos → `advice`; solo los de estado `approved` son públicos. |
| No llega la recuperación de contraseña | Revisá Spam y confirmá que el correo exista en Authentication. |
| Funciona hasta que se alcanza la cuota | Revisá Uso de Realtime Database y las cuotas de tu plan. |

Los aportes son públicos y se muestran sin revisión previa. Las reglas protegen la administración y validan los mensajes; no son un filtro contra spam. Revisá el tablero durante la muestra. Firebase ofrece App Check si más adelante necesitás protección adicional contra solicitudes automatizadas.

## Referencias oficiales

- [Configurar una app web de Firebase](https://firebase.google.com/docs/web/setup).
- [Crear Realtime Database](https://firebase.google.com/docs/database/web/start).
- [Autenticación con correo y contraseña](https://firebase.google.com/docs/auth/web/password-auth).
- [Condiciones y permisos de Realtime Database](https://firebase.google.com/docs/database/security/rules-conditions).
- [Cuotas de Realtime Database](https://firebase.google.com/docs/database/usage/limits).
- [Publicar desde una rama en GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
