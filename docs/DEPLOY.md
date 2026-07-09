# Desplegar LumiLab en Render

El repo incluye `render.yaml` en la raíz, que describe un único servicio web: compila el
frontend (Vite) y lo sirve como archivos estáticos desde el mismo backend de Express
(`backend/src/app.js` ya detecta `frontend/dist` y lo sirve si existe). Así se evita
configurar CORS entre dos servicios distintos.

## 1. Subir el código a GitHub

Render despliega desde un repositorio Git. Si aún no está subido:

```bash
git add -A
git commit -m "Preparar backend, accesibilidad, avatar y currículo 6°-11° para despliegue"
git push origin master
```

## 2. Crear el servicio en Render

1. Entra a [render.com](https://render.com) con tu cuenta (o crea una).
2. **New → Blueprint**, selecciona el repositorio `Andrea093/Lumilab`. Render detecta
   `render.yaml` automáticamente y propone el servicio `lumilab`.
3. Revisa el plan: el archivo pide `starter` (plan pago económico) porque el plan
   **free no admite disco persistente** — con free, la base de datos SQLite (usuarios,
   progreso) se borraría cada vez que el servicio se reinicia por inactividad. Si solo
   quieres probar la demo sin que los datos persistan, puedes cambiar el plan a `free`
   y quitar el bloque `disk` del `render.yaml` antes de desplegar.

## 3. Variables de entorno

Render te pedirá valores para las variables marcadas `sync: false` en `render.yaml`
(no viajan en el repo, las escribes directamente en el panel de Render):

| Variable | Qué poner |
|---|---|
| `JWT_SECRET` | Una cadena larga y aleatoria (por ejemplo, generada con `openssl rand -hex 32`). Es la clave que firma las sesiones. |
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
   `/` (login) del sitio desplegado.
3. Verifica `https://<tu-servicio>.onrender.com/api/health` → debe responder
   `{"status":"ok"}`.

## Notas

- El backend usa el módulo experimental `node:sqlite` de Node (evita compilar módulos
  nativos). Si Render tuviera problemas con esto, la alternativa es migrar a
  `better-sqlite3` (cambio pequeño, ver `backend/src/db/index.js`).
- El registro público (`/registro`) siempre crea cuentas con rol `student`; el rol
  `teacher`/`admin` solo se asigna vía `seedAdmin.js`, nunca desde el formulario público.
- Para reiniciar la contraseña de la cuenta admin más adelante, vuelve a ejecutar
  `seedAdmin.js` con el mismo `ADMIN_EMAIL` y un `ADMIN_PASSWORD` nuevo.
