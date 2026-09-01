# Seguridad y privacidad de datos

## Odoo (nunca expuesto al navegador)

- La conexión a Odoo vive **solo** en `scripts/import-from-odoo.mjs`, un script
  que se corre a mano en local/CI. **No** se importa desde ningún componente de
  `app/` ni `lib/` — no entra al bundle del cliente ni al runtime del servidor.
- Las credenciales (`ODOO_URL`, `ODOO_DB`, `ODOO_USER`, `ODOO_API_KEY`) solo
  existen en `.env` / variables de entorno de CI. `.env*` está en `.gitignore`
  (excepto `.env.example`, que no tiene valores).
- `scripts/odoo-raw.json` (volcado intermedio con datos de producto, sin
  credenciales) está en `.gitignore`. Lo que se publica es `content/*.json`,
  ya normalizado y curado.
- El sitio en producción **no habla con Odoo**. Lee `content/*.json` (o Sanity,
  si se activa `CONTENT_SOURCE=sanity`).

## Sanity (cuando se conecte)

- Token de **lectura** (`SANITY_API_READ_TOKEN`) solo del lado servidor.
- Token de **escritura** (`SANITY_API_WRITE_TOKEN`) solo para `scripts/seed-sanity.mjs`.
- Secreto del webhook ISR (`SANITY_REVALIDATE_SECRET`) valida cada POST a
  `/api/revalidate`.

## Imágenes

- `components/site/protect-images.tsx` bloquea el menú contextual y el arrastre
  sobre imágenes; `Figure` / `ProductImage` / `CategoryCard` marcan sus
  contenedores con `data-protected` (capa transparente que impide "Guardar
  imagen como" y drag-to-desktop) y `draggable={false}`.
- Esto es **fricción, no DRM**: las imágenes se sirven por HTTP y un usuario
  decidido puede obtenerlas. Para producto se añade una marca de agua discreta
  del logo en la esquina.

## Antes de subir a git

- [ ] Confirmar que `.env` / `.env.local` **no** están trackeados.
- [ ] `git init` y primer commit sin `scripts/odoo-raw.json` ni `node_modules`.
- [ ] Variables sensibles cargadas en Vercel (Project → Settings → Env Vars),
      no en el repo.
