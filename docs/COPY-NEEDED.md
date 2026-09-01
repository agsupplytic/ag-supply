# Textos del sitio — estado

## ✅ Confirmado e integrado (fuente: NotebookLM del cliente)

- **Slogan**: «Siente la limpieza» — en logo, hero de todas las páginas y footer.
- **Historia**: fundación 2007 como *A.G. Office Supply, S.R.L.* (suministros de
  oficina) → giro 2014 a fabricación/conversión/distribución de desechables de
  papel y cambio a *A.G. Supply, S.R.L.* → nave en Las Palomas, Santiago.
  En `app/nosotros/page.tsx` + `lib/site-config.ts` (`company`).
- **Planta**: 2.000 m² terreno / 1.000 m² construidos (200 oficinas + 800
  producción y almacén). Capacidad **400 t de papel/mes**. Ubicación: 500 m de la
  autopista, 800 m de la circunvalación norte, 3 km del Aeropuerto del Cibao.
  *(Datos económicos / capital social: excluidos a pedido del cliente.)*
- **Misión / Visión / Propuesta de valor**: texto oficial en `lib/site-config.ts`
  y `app/nosotros/page.tsx`.
- **Valores** (6): Servicio, Sentido humano, Eficiencia, Higiene, Integridad,
  Innovación — sección propia en Nosotros.
- **Descripciones de las 8 categorías**: texto oficial en
  `scripts/normalize-odoo.mjs` (`CATEGORIES`, campos `short` + `description`) →
  `content/categories.json`.
- **Posicionamiento de marcas** Ocean Breeze y Bonche: texto oficial en
  `scripts/normalize-odoo.mjs` (`BRANDS`) → `content/brands.json`.

## ⏳ Todavía pendiente

- **Dirección exacta** (calle y número en Las Palomas) — hoy el mapa usa el pin
  «AG SUPPLY» de Google Maps y el texto dice «Sector Las Palomas, Santiago».
- **Correo público**: ✅ confirmado `agsupplycxc@gmail.com` (`lib/site-config.ts`).
- **Teléfonos**: 809-612-2020 (central) y 809-778-9119 (alterno). Confirmar que
  ambos son públicos.
- **Redes**: solo Instagram `@agsupplyrd`. ¿Facebook / LinkedIn / TikTok?
- **Horario de atención comercial**: ✅ Lun–Vie 8:00 a.m.–5:00 p.m.
  (`lib/site-config.ts` → `hours`). Confirmar si abren sábados.
- **Sucursal Santo Domingo**: ¿existe? dirección.
- **Distribuidores autorizados**: cargados del sitio anterior en
  `lib/site-config.ts`. Confirmar nombres, teléfonos y direcciones.
- **Formulario de contacto**: hoy abre el correo (`mailto:`). Falta elegir
  proveedor de envío (Resend / Formspree) y conectar `app/api/contact/route.ts`.
- **Fotografía real** (todas las imágenes son de prueba con el rótulo «AQUÍ VA
  UNA IMAGEN»): hero/inicio, planta y proceso, fachada/equipo, ambientes de marca
  (HORECA y colmado), y foto de producto (168 productos, 33 con foto de Odoo).
- **Nombres comerciales definitivos de producto** (~168, hoy normalizados desde
  Odoo) y **fichas técnicas** de los ~99 con specs inferidas del nombre
  (ver `docs/PENDING-CONTENT.md`).
- **Legales**: política de privacidad / términos, RNC / datos fiscales en footer.
