# Seguridad y privacidad de datos

## Odoo

La conexión vive solo en `scripts/import-from-odoo.mjs` (manual, local o CI). No se importa desde
`app/` ni `lib/`. Credenciales (`ODOO_*`) solo en `.env` o variables de CI; `.env*` está en
`.gitignore` salvo `.env.example` (sin valores). `scripts/odoo-raw.json` (volcado intermedio) también
está ignorado. Producción no habla con Odoo: lee `content/*.json`.

## Sitio

- Exportación estática: no hay servidor, base de datos ni API propia que proteger.
- Formulario de contacto: validación con zod, campo señuelo anti-spam (`botcheck`), envío por
  Web3Forms (clave pública por diseño: restringirla al dominio en su panel) con `mailto:` de respaldo.
- Cabeceras en `.htaccess`: `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
  Falta una CSP: Next inyecta scripts en línea y exigiría nonces; se recomienda evaluarla con el
  hosting.
- JSON-LD: se serializa con `<` escapado.
- La lista de cotización vive solo en `localStorage` del visitante y se valida al leerla.
- Las imágenes se sirven sin bloqueo de clic derecho ni arrastre (la protección anterior no era
  DRM y estorbaba al comprador).

## Despliegue

Secretos FTP en GitHub Actions; el workflow tiene `permissions: contents: read`. No se suben
archivos de entorno. Ver `docs/DEPLOY.md` para FTPS y HSTS.
