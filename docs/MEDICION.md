# Medición de conversiones

Estado: **apagada**. El código está listo pero no carga nada hasta que el cliente entregue un ID de Google Analytics 4 y autorice activarlo. No hay ningún ID en el repositorio.

## Cómo funciona
- Contenedor de Google Tag Manager: `GTM-5NPH9GL9` (`NEXT_PUBLIC_ANALYTICS_ID` en `.github/workflows/deploy.yml`). El código también acepta un ID de medición de GA4 (`G-XXXXXXXXXX`) si algún día se prefiere cargar gtag.js directo.
- `lib/analytics.ts`: valida el ID, guarda la elección de consentimiento (`localStorage["ag-consent"]`), carga Tag Manager y empuja cada evento al `dataLayer` con `track()`.
- `components/site/analytics.tsx`: aviso de consentimiento (ES/EN) y escucha de clics por delegación.
- Sin ID en el build: no se muestra aviso, no se carga ningún script de terceros, no se guarda nada.
- Modo de consentimiento (`CONSENT_MODE` en `lib/analytics.ts`): hoy **«opt-out»**. La medición arranca al entrar y un aviso informativo ofrece «Entendido» o «Rechazar». Quien rechaza, o tiene activada la señal Global Privacy Control o «No rastrear», no se mide; al rechazar la página se recarga para dejar Tag Manager apagado. El pie tiene «Preferencias de medición» para cambiar la elección y la página `/privacidad/` (`/en/privacy/`) explica qué se recoge.
- Para volver a pedir permiso antes de medir (**«opt-in»**), basta cambiar `CONSENT_MODE` a `"opt-in"`: no se carga nada hasta pulsar «Aceptar».
- Aviso legal de este modo: la ley dominicana de datos (Ley 172-13) exige consentimiento para tratar datos personales, pero no encontré en su texto una regla específica sobre cookies de medición; algunas consultoras interpretan que sí piden consentimiento previo. Que el modo «opt-out» sea suficiente debe confirmarlo un abogado dominicano. Si el sitio se dirige a visitantes de la Unión Europea o de California, el modo «opt-in» es el prudente.

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

## Configurar en Tag Manager (lo hace quien administra el contenedor)
Los eventos llegan al `dataLayer` como `{ event: "whatsapp_click", page_path: "/…" }`. El sitio no envía nada a Analytics por sí solo: hay que crear las etiquetas.
1. **Variables** (Variables definidas por el usuario → Variable de capa de datos): `page_path`, `quantity`, `items`, `result`.
2. **Activadores** (Evento personalizado, coincidencia exacta del nombre): `whatsapp_click`, `quote_add`, `quote_copy`, `quote_whatsapp_send`, `contact_submit`, `language_switch`.
3. **Etiqueta de configuración de Google Analytics 4** con el ID de medición `G-XXXXXXXXXX` de la propiedad, activada en «Todas las páginas» (se dispara solo tras el consentimiento, porque Tag Manager no carga antes).
4. **Una etiqueta de evento GA4 por cada activador**, con el mismo nombre de evento y los parámetros de arriba.
5. En GA4 → Administrar → Eventos, marcar como evento clave `quote_whatsapp_send`, `contact_submit` y `whatsapp_click`.
6. Probar con la Vista previa de Tag Manager (Tag Assistant) sobre el sitio: aceptar el aviso, pulsar un botón de WhatsApp y comprobar que el activador se dispara. Publicar el contenedor solo después.

## Pendiente del cliente
- Aprobar el texto del aviso de consentimiento. Dice que se usan «herramientas de medición de Google»; si Tag Manager carga etiquetas de otros proveedores, hay que reflejarlo.
- El ID de medición `G-XXXXXXXXXX` de GA4 para la etiqueta de configuración dentro de Tag Manager.
- La política de privacidad (`components/pages/privacy.tsx`) es un texto redactado por nosotros a partir de lo que hace el sitio; **debe revisarla un abogado** antes de darla por definitiva.
- Un clic en WhatsApp o un envío de formulario mide la **intención**, no una cotización cerrada: no se debe presentar como ventas.
