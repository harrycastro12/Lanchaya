# 🚤 LanchaYa Iquitos
App full stack para consultar y gestionar salidas fluviales desde Iquitos.

**Integrantes:** _(completa aquí tus nombres)_

## Requisitos
Node.js 20+

## Backend (puerto 3000)
```bash
cd backend
npm install
npm run dev
```

## Frontend (puerto 5173)
```bash
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173 (el proxy de Vite redirige `/api` al backend, así que levanta ambos).

## Autenticación (JWT)
- Las **consultas son públicas**; **crear, editar y eliminar** salidas requiere iniciar sesión.
- Al primer arranque, si no hay usuarios, se crea uno inicial: **admin / admin123** (o el de `ADMIN_USER` / `ADMIN_PASS`). Cámbialo antes de publicar.
- Crear más usuarios: `cd backend && npm run crear-usuario -- <usuario> <contraseña>`
- Variables de entorno (ver `backend/.env.example`): `JWT_SECRET` (obligatorio en producción), `JWT_EXPIRA` (por defecto `2h`).
- Contraseñas guardadas con bcrypt en `backend/src/data/usuarios.json`. El token viaja en `Authorization: Bearer <token>`.

## API
| Método | Ruta | Respuesta |
|---|---|---|
| GET | /api/salidas?destino=&fecha=&tipo= | 200 + arreglo |
| GET | /api/salidas/:id | 200 / 404 |
| POST | /api/salidas | 201 / 400 |
| PUT | /api/salidas/:id | 200 / 400 / 404 |
| DELETE | /api/salidas/:id | 204 / 404 |
| GET | /api/destinos | 200 + arreglo |
| POST | /api/auth/login `{usuario, password}` | 200 `{token, usuario}` / 400 / 401 |
| GET | /api/auth/me 🔒 | 200 / 401 |

🔒 = requiere token. Además, `POST`, `PUT` y `DELETE` de `/api/salidas` responden **401** sin token válido.
