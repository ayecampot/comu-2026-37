# Comunicación 6toA 2026

HTML, CSS y JavaScript, sin frameworks, npm ni compilación. Se puede subir directamente a GitHub Pages.

- **Guía completa:** [GUIA-FIREBASE.md](GUIA-FIREBASE.md).
- **Dashboard:** `admin/index.html` (en la web, entrar en `admin/`).
- **Configuración pública:** `js/config.js`.
- **Reglas de Firebase Realtime Database:** `firebase/database.rules.json`.
- **Contenido editable:** `js/content.js` (escuela, docente, títulos, portadas y audios).
- **Estilos:** `styles.css`.

Los consejos se guardan en Firebase y aparecen automáticamente para todos los visitantes, sin aprobación previa. El administrador puede buscar, ocultar, volver a publicar y eliminar. El tablero y el dashboard se actualizan en tiempo real. Los contadores incluyen todos los consejos; el dashboard muestra 20 por página y el sitio 30 inicialmente, con un botón para ver más.

Para verlo en tu computadora:

```sh
python3 -m http.server 5173
```

Abrir http://localhost:5173 y http://localhost:5173/admin/. No abrir el HTML con doble clic: los módulos JavaScript necesitan HTTP.

No se creó un proyecto Firebase ni una cuenta real: seguí la guía para crearlos. Sin completar `js/config.js`, el diseño funciona y el tablero informa que todavía no está habilitado. No se simulan envíos. La sesión del admin permanece en memoria y termina al recargar la página.

Guardá portadas y audios en `assets/`, y usá rutas como `assets/episodio-01.mp3` en `js/content.js`. Las rutas funcionan tanto en la raíz de un dominio como dentro de un repositorio de GitHub Pages. Los podcasts permanecen como “Próximamente” hasta recibir material real.
# comu-2026-37
