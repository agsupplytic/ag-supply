# Medición de conversiones

Estado: **apagada**. El código está listo pero no carga nada hasta que el cliente entregue un ID de Google Analytics 4 y autorice activarlo. No hay ningún ID en el repositorio.

## Cómo funciona
- `lib/analytics.ts`: valida el ID, guarda la elección de consentimiento (`localStorage["ag-consent"]`), carga `gtag.js` y envía eventos con `track()`.
- `components/site/analytics.tsx`: aviso de consentimiento (ES/EN) y escucha de clics por delegación.
- Sin `NEXT_PUBLIC_ANALYTICS_ID` (formato `G-XXXXXXXXXX`) en el build: no se muestra aviso, no se carga ningún script de terceros, no se guarda nada.
- Con ID: no se carga nada hasta que la persona pulsa «Aceptar». «Rechazar» no carga nada y no vuelve a preguntar. IP anonimizada; señales de Google y personalización de anuncios desactivadas.

## Eventos
| Evento | Cuándo | Parámetros |
|---|---|---|
| `whatsapp_click` | clic en cualquier enlace a `wa.me` (cabecera, botón flotante, ficha, contacto, cierre) | `page_path` |
| `quote_add` | producto añadido a la lista de cotización | `quantity` |
| `quote_copy` | lista copiada al portapapeles | `items` |
| `quote_whatsapp_send` | clic en «Enviar por WhatsApp» de la lista | `page_path` |
| `contact_submit` | formulario de contacto enviado | `result`: `sent` / `mail` / `error` |
| `language_switch` | cambio ES ⇄ EN | `page_path` |

Nunca se envían nombre, teléfono, correo, texto del mensaje ni contenido de la lista. `page_path` no incluye parámetros de búsqueda.

## Activarla (requiere autorización del cliente)
1. Crear la propiedad GA4 y copiar el ID de medición.
2. Definir `NEXT_PUBLIC_ANALYTICS_ID` como variable del workflow de despliegue (`deploy.yml`) y volver a construir.
3. En GA4 → Administrar → Eventos, marcar como evento clave: `quote_whatsapp_send`, `contact_submit` y `whatsapp_click`.
4. Probar con DebugView: aceptar el aviso, hacer clic en un enlace de WhatsApp y comprobar que llega `whatsapp_click`.

## Pendiente del cliente
- Aprobar el texto del aviso de consentimiento.
- El sitio no tiene página de política de privacidad; conviene publicar una antes de activar la medición (qué se mide, proveedor, cómo rechazar).
- Un clic en WhatsApp o un envío de formulario mide la **intención**, no una cotización cerrada: no se debe presentar como ventas.
