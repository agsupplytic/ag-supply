# Despliegue

Producción es un hosting Hostinger (LiteSpeed/Apache) que sirve `out/`.

## Cómo se publica

`.github/workflows/deploy.yml` se ejecuta **solo al hacer push a `main`** (o a mano con
*Run workflow*): instala, ejecuta `npm run check` (lint + typecheck), `npm run build`,
`npm run check:out` y sube `out/` por FTP a `/domains/agsupply.com.do/public_html/`.
Las ramas de trabajo no despliegan.

Secretos del repositorio: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`,
`NEXT_PUBLIC_WEB3FORMS_KEY`.

## .htaccess (`public/.htaccess`)

Fuerza HTTPS y dominio sin `www`, normaliza a barra final, sirve `404.html`, comprime, define
caché (CSS/JS/fuentes inmutables; imágenes 1 mes; HTML 10 min), `nosniff`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, charset UTF-8 y niega archivos ocultos (incluido el
estado `.ftp-deploy-sync-state.json` del despliegue). El bloque `slug-redirects` lo escribe
`scripts/curate-products.mjs` (301 de las fichas cuyo nombre cambió).

## Pendiente de decisión del cliente

- **FTP cifrado**: la acción usa FTP simple. Si Hostinger admite FTPS/SFTP, añadir
  `protocol: ftps` y probar en una rama. No se cambió sin poder probarlo.
- **HSTS**: recomendado (`Strict-Transport-Security`) una vez confirmado que todo el dominio
  responde por HTTPS; es difícil de revertir, por eso no se activó.
- **GitHub Pages**: si el despliegue antiguo (`agsupplytic.github.io/ag-supply`) sigue activo,
  desactivarlo (Settings → Pages) para evitar un duplicado indexable.

## Sanity (opcional, inactivo)

El adaptador `lib/content/sanity.ts` y `sanity/` existen pero no están conectados. Con
`output: "export"` no hay revalidación (ISR); activar Sanity implicaría volver a un hosting con
servidor o reconstruir el sitio con un webhook de GitHub Actions.
