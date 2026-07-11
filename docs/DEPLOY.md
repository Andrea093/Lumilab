# Desplegar LumiLab en Render (gratis)

El repo incluye `render.yaml` en la raíz, que describe un único servicio web: compila el
frontend (Vite) y lo sirve como archivos estáticos desde el mismo backend de Express
(`backend/src/app.js` ya detecta `frontend/dist` y lo sirve si existe). Así se evita
configurar CORS entre dos servicios distintos.

El servicio usa el **plan free** de Render. Ese plan no tiene disco persistente propio,
así que la base de datos vive en **[Turso](https://turso.tech)** (libSQL, compatible con
SQLite, con una capa gratuita persistente) en vez de un archivo local — los datos no se
pierden cuando el servicio se reinicia por inactividad.

## 1. Crear la base de datos en Turso

1. Entra a [turso.tech](https://turso.tech) y crea una cuenta gratuita.
2. Instala su CLI o usa el panel web para crear una base de datos nueva (por ejemplo
   `lumilab`).
3. Obtén dos datos:
   - La **URL** de la base de datos (empieza con `libsql://...`).
   - Un **token de autenticación** (auth token) con permiso de lectura y escritura.

Estos dos valores se usan como `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` en el paso 3.
No hace falta crear tablas a mano: el backend corre la migración (`001_init.sql`)
automáticamente al iniciar.

## 2. Subir el código a GitHub

Render despliega desde un repositorio Git. Si aún no está subido:

```bash
git add -A
git commit -m "Preparar despliegue"
git push origin master
```

## 3. Crear el servicio en Render

1. Entra a [render.com](https://render.com) con tu cuenta (o crea una) — es gratis, no
   pide tarjeta para el plan free.
2. **New → Blueprint**, selecciona el repositorio `Andrea093/Lumilab`. Render detecta
   `render.yaml` automáticamente y propone el servicio `lumilab` en plan `free`.
3. Cuando te pida las variables marcadas `sync: false`, escribe:

| Variable | Qué poner |
|---|---|
| `JWT_SECRET` | Una cadena larga y aleatoria (por ejemplo, generada con `openssl rand -hex 32`). Es la clave que firma las sesiones. |
| `TURSO_DATABASE_URL` | La URL `libsql://...` de tu base de datos en Turso (paso 1). |
| `TURSO_AUTH_TOKEN` | El token de autenticación de esa base de datos (paso 1). |
| `ADMIN_NAME` | Nombre de la persona docente/administradora, ej. `Coordinación Lumilab`. |
| `ADMIN_EMAIL` | Correo con el que esa persona iniciará sesión. |
| `ADMIN_PASSWORD` | Contraseña de esa cuenta (mínimo 6 caracteres). Se escribe solo en Render, nunca se comparte en chats ni se sube al repo. |

## 4. Desplegar y crear la cuenta de administrador

1. Aplica el Blueprint y espera a que termine el primer deploy (build del frontend +
   instalación del backend).
2. Abre la pestaña **Shell** del servicio en Render y ejecuta una sola vez:
   ```bash
   node backend/src/scripts/seedAdmin.js
   ```
   Esto crea (o actualiza) la cuenta con rol `teacher` usando `ADMIN_NAME`,
   `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Con esa cuenta puedes iniciar sesión en
   `/` (login) del sitio desplegado y ver el **Panel docente**.
3. Verifica `https://<tu-servicio>.onrender.com/api/health` → debe responder
   `{"status":"ok"}`.

## Notas

- En **desarrollo local** no hace falta cuenta de Turso: si `TURSO_DATABASE_URL` no está
  definida, el backend usa automáticamente un archivo SQLite local (`DB_PATH`), igual que
  antes. Ver `backend/.env.example`.
- El plan free de Render "duerme" el servicio tras ~15 minutos sin tráfico; la primera
  petición después de eso tarda unos segundos en despertar. Es normal, no es un error.
- El registro público (`/registro`) siempre crea cuentas con rol `student`; el rol
  `teacher`/`admin` solo se asigna vía `seedAdmin.js`, nunca desde el formulario público.
- Para reiniciar la contraseña de la cuenta admin más adelante, vuelve a ejecutar
  `seedAdmin.js` con el mismo `ADMIN_EMAIL` y un `ADMIN_PASSWORD` nuevo.
