# Guía de Google Search Console

Para hacer **después** de publicar el sitio en `https://agsupply.com.do` (la vista previa lleva `noindex` y no sirve para esto). La verificación de propiedad requiere acceso al DNS o al hosting: lo hace o autoriza el cliente.

## 1. Verificar el dominio
1. Entrar en https://search.google.com/search-console con la cuenta de la empresa y elegir «Dominio» → `agsupply.com.do`.
2. Google da un registro TXT. Añadirlo en el DNS del dominio (panel de Hostinger → Dominios → DNS). No cambiar ningún otro registro.
3. Pulsar «Verificar» (puede tardar de minutos a horas).
Alternativa sin DNS: propiedad «Prefijo de URL» con archivo HTML de verificación en `public/` (requiere un despliegue).

## 2. Enviar el sitemap
- Sitemaps → añadir `sitemap.xml` (URL: `https://agsupply.com.do/sitemap.xml`). Un único sitemap contiene las versiones en español e inglés con `hreflang` alternativos.
- Contiene las páginas indexables; **las fichas de producto delgadas no están** (ver 5).
- Si el sitemap aparece como «No se pudo obtener», comprobar que `https://agsupply.com.do/sitemap.xml` abre en el navegador y que `robots.txt` no bloquea.

## 3. Inspeccionar URLs clave
Inspección de URL → «Probar URL publicada» en: la home, `/productos/`, `/en/`, una ficha con foto y una categoría. Debe decir «La URL está disponible para Google» y el canónico elegido por Google debe coincidir con el declarado. Si hace falta, «Solicitar indexación» (solo para pocas URLs; no es obligatorio).

## 4. Validar datos estructurados
- Prueba de resultados enriquecidos (https://search.google.com/test/rich-results) sobre la home y una ficha. Tipos esperados: `Organization`, `WebSite`, `BreadcrumbList` y `Product` (este sin precio ni valoraciones: no existen en el sitio y no se inventan).
- También https://validator.schema.org para ver avisos. Una ficha `Product` sin `offers` no genera fragmento enriquecido; es esperado.
- Después de unos días: Search Console → Mejoras: revisar errores o avisos.

## 5. Qué es normal ver
- **«Excluida por la etiqueta noindex»**: las fichas delgadas (sin foto ni datos técnicos aparte de la presentación) y `/cotizacion/` y `/en/quote/`. Es intencional. La lista y el criterio están en `docs/CATALOGO-DATOS.md`. Al añadir una foto o datos, la ficha pasa a indexable en el siguiente despliegue.
- **«Descubierta: actualmente sin indexar» / «Rastreada: sin indexar»** en algunas fichas: normal en sitios nuevos; se resuelve con contenido propio (fotos), no solicitando indexación una y otra vez.
- **Páginas con redirección**: los slugs antiguos de producto redirigen con 301 (`public/.htaccess`).
- **hreflang**: Search Console ya no tiene informe de idioma; se comprueba con la inspección de URL (alternativas) y con `npm run check:out` en el repositorio.

## 6. Seguimiento
| Cuándo | Qué revisar |
|---|---|
| Día 1 | Sitemap leído sin errores; home e inspección de una ficha disponibles |
| Semana 1–2 | Informe «Páginas»: cuántas indexadas frente a excluidas; datos estructurados sin errores |
| Mes 1 | Rendimiento: consultas y páginas con impresiones; Experiencia → Core Web Vitals (necesita tráfico real) |
| Cada vez que se suban fotos | Ejecutar `npm run content:curate`, desplegar, y comprobar que el total de fichas indexables sube |

## 7. Qué no se puede prometer
No hay plazos de indexación garantizados ni posiciones concretas. Search Console solo muestra datos reales desde que Google rastrea el sitio; los primeros informes tardan días.
