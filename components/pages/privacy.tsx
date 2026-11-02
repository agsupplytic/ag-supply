import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { ConsentLink } from "@/components/site/consent-link";
import { siteConfig } from "@/lib/site-config";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/seo";

/** Fecha de la última revisión del texto. Cambiarla en cada modificación. */
const UPDATED = { es: "2 de noviembre de 2026", en: "November 2, 2026" };

type Block = { title: string; paras?: string[]; items?: string[] };

const COPY = {
  es: {
    meta: {
      title: "Política de privacidad y cookies",
      description: "Cómo AG Supply SRL trata sus datos y usa cookies en agsupply.com.do: formulario de contacto, lista de cotización, WhatsApp y medición con Google. Cómo rechazar.",
    },
    h1: "Política de privacidad y cookies",
    lead: "Qué datos recogemos en este sitio, para qué los usamos, con quién se comparten y cómo puede ejercer sus derechos.",
    updated: "Última actualización",
    cookieTable: {
      title: "Cookies y almacenamiento en su navegador",
      intro: "Este sitio usa cookies y almacenamiento local. Las de medición pueden rechazarse en cualquier momento (ver «Cómo rechazar la medición»).",
      head: ["Nombre", "Quién la pone", "Para qué sirve", "Duración"],
      rows: [
        ["_ga y _ga_…", "Google Analytics (vía Google Tag Manager)", "Distinguir visitas y medir de forma anónima qué páginas y botones se usan.", "Hasta 2 años, según Google"],
        ["ag-consent", "Este sitio (almacenamiento local)", "Recordar si usted rechazó o aceptó la medición.", "Hasta que usted la borre"],
        ["agsupply_quote_v1", "Este sitio (almacenamiento local)", "Guardar su lista de cotización en su propio navegador. No se envía a ningún servidor.", "Hasta que usted la vacíe o borre"],
        ["Cookies de Google Maps", "Google", "Mostrar el mapa de la página de Contacto. Solo se cargan al abrir esa página.", "Según Google"],
      ],
    },
    blocks: [
      {
        title: "1. Quién es el responsable",
        paras: [
          `${siteConfig.legalName} (en adelante, «AG Supply»), con planta en el ${siteConfig.address.line1}, ${siteConfig.address.city}, República Dominicana, es la responsable del tratamiento de los datos que se recogen en este sitio. Contacto: ${siteConfig.email} y ${siteConfig.phones[0].value}.`,
        ],
      },
      {
        title: "2. Qué datos recogemos y para qué",
        items: [
          "Formulario de contacto: nombre, empresa, teléfono, correo y mensaje. Los usamos solo para responder a su consulta o cotización.",
          "Lista de cotización: se guarda únicamente en su navegador. Solo sale de él si usted pulsa «Enviar por WhatsApp» o la copia, y entonces la recibimos como un mensaje de WhatsApp.",
          "WhatsApp: al pulsar un botón de WhatsApp se abre la aplicación o WhatsApp Web. La conversación posterior queda sujeta a las políticas de WhatsApp.",
          "Medición del sitio: con Google Tag Manager y Google Analytics 4 contamos visitas y el uso de botones (WhatsApp, lista de cotización, formulario, cambio de idioma) para mejorar el sitio. Esos eventos no incluyen su nombre, teléfono, correo ni el contenido de sus mensajes. Según Google, Analytics 4 no registra direcciones IP completas.",
        ],
      },
      {
        title: "3. Con quién se comparten",
        paras: ["No vendemos sus datos. Para prestar el servicio intervienen estos proveedores:"],
        items: [
          "Google (Tag Manager, Analytics y Maps), para la medición y el mapa.",
          "Web3Forms, servicio que entrega a nuestro correo los mensajes del formulario de contacto. Si no está disponible, el formulario abre su programa de correo.",
          "WhatsApp (Meta), cuando usted decide escribirnos por ese medio.",
          "Nuestro proveedor de alojamiento web, que sirve las páginas del sitio.",
        ],
      },
      {
        title: "4. Transferencias fuera del país",
        paras: ["Algunos de estos proveedores pueden tratar datos en servidores fuera de la República Dominicana. Al usar el sitio y sus formularios, usted entiende que esto puede ocurrir."],
      },
      {
        title: "5. Cuánto tiempo conservamos los datos",
        paras: [
          "Los mensajes del formulario y de WhatsApp se conservan el tiempo necesario para atender su solicitud y la relación comercial posterior. Los datos de medición se conservan durante el período configurado en Google Analytics.",
        ],
      },
      {
        title: "6. Sus derechos",
        paras: [
          "Conforme a la Ley núm. 172-13 sobre Protección de Datos de Carácter Personal, usted puede solicitar el acceso, la rectificación, la actualización y la supresión de sus datos. Escríbanos a " + siteConfig.email + " indicando su nombre y qué desea hacer; responderemos a la mayor brevedad.",
        ],
      },
      {
        title: "7. Cómo rechazar la medición",
        paras: [
          "La medición con Google se activa al entrar al sitio y, la primera vez, verá un aviso. Si pulsa «Rechazar», la medición se detiene y no vuelve a cargarse en sus próximas visitas. Puede cambiar su elección en cualquier momento con el botón de abajo o con «Preferencias de medición» en el pie de página.",
          "Si usted visita desde la Unión Europea, el Reino Unido o Suiza (lo detectamos por la zona horaria de su navegador), la medición solo se activa si pulsa «Aceptar». También respetamos la señal «Global Privacy Control» y «No rastrear» de su navegador: si está activada, la medición no se carga. Además puede bloquear o borrar las cookies desde los ajustes de su navegador.",
        ],
      },
      {
        title: "8. Menores de edad",
        paras: ["Este sitio está dirigido a empresas y a personas adultas. No recogemos de forma intencionada datos de menores."],
      },
      {
        title: "9. Cambios en esta política",
        paras: ["Podemos actualizar este texto. La fecha de la última revisión aparece al inicio de la página."],
      },
    ] as Block[],
    contactTitle: "¿Preguntas sobre sus datos?",
    contactText: "Escríbanos y le respondemos.",
    contactBtn: "Ir a contacto",
  },
  en: {
    meta: {
      title: "Privacy and cookies policy",
      description: "How AG Supply SRL handles your data and uses cookies on agsupply.com.do: contact form, quote list, WhatsApp and Google measurement. How to opt out.",
    },
    h1: "Privacy and cookies policy",
    lead: "What data we collect on this site, what we use it for, who it is shared with and how you can exercise your rights.",
    updated: "Last updated",
    cookieTable: {
      title: "Cookies and storage in your browser",
      intro: "This site uses cookies and local storage. Measurement cookies can be declined at any time (see «How to opt out of measurement»).",
      head: ["Name", "Set by", "Purpose", "Duration"],
      rows: [
        ["_ga and _ga_…", "Google Analytics (via Google Tag Manager)", "Tell visits apart and measure, anonymously, which pages and buttons are used.", "Up to 2 years, per Google"],
        ["ag-consent", "This site (local storage)", "Remember whether you declined or accepted measurement.", "Until you delete it"],
        ["agsupply_quote_v1", "This site (local storage)", "Keep your quote list in your own browser. It is not sent to any server.", "Until you empty or delete it"],
        ["Google Maps cookies", "Google", "Show the map on the Contact page. Only loaded when you open that page.", "Per Google"],
      ],
    },
    blocks: [
      {
        title: "1. Who is responsible",
        paras: [
          `${siteConfig.legalName} («AG Supply»), with a plant in ${siteConfig.address.line1}, ${siteConfig.address.city}, Dominican Republic, is responsible for the data collected on this site. Contact: ${siteConfig.email} and ${siteConfig.phones[0].value}.`,
        ],
      },
      {
        title: "2. What data we collect and why",
        items: [
          "Contact form: name, company, phone, email and message. We use them only to answer your inquiry or quote request.",
          "Quote list: it is stored only in your browser. It leaves it only if you press «Send via WhatsApp» or copy it, and then we receive it as a WhatsApp message.",
          "WhatsApp: pressing a WhatsApp button opens the app or WhatsApp Web. The conversation that follows is subject to WhatsApp's policies.",
          "Site measurement: with Google Tag Manager and Google Analytics 4 we count visits and button use (WhatsApp, quote list, form, language switch) to improve the site. These events do not include your name, phone, email or the content of your messages. According to Google, Analytics 4 does not log full IP addresses.",
        ],
      },
      {
        title: "3. Who it is shared with",
        paras: ["We do not sell your data. These providers take part in delivering the service:"],
        items: [
          "Google (Tag Manager, Analytics and Maps), for measurement and the map.",
          "Web3Forms, a service that delivers contact form messages to our email. If it is unavailable, the form opens your email program.",
          "WhatsApp (Meta), when you choose to write to us that way.",
          "Our web hosting provider, which serves the site's pages.",
        ],
      },
      {
        title: "4. Transfers outside the country",
        paras: ["Some of these providers may process data on servers outside the Dominican Republic. By using the site and its forms, you understand this may happen."],
      },
      {
        title: "5. How long we keep data",
        paras: [
          "Form and WhatsApp messages are kept as long as needed to handle your request and the business relationship that follows. Measurement data is kept for the period configured in Google Analytics.",
        ],
      },
      {
        title: "6. Your rights",
        paras: [
          "Under Law No. 172-13 on the Protection of Personal Data, you may request access to, correction, updating and deletion of your data. Write to " + siteConfig.email + " stating your name and what you wish to do; we will reply as soon as possible.",
        ],
      },
      {
        title: "7. How to opt out of measurement",
        paras: [
          "Google measurement starts when you enter the site and, the first time, you will see a notice. If you press «Reject», measurement stops and will not load on your future visits. You can change your choice at any time with the button below or with «Measurement preferences» in the footer.",
          "If you visit from the European Union, the United Kingdom or Switzerland (we detect this from your browser's time zone), measurement only starts if you press «Accept». We also honor your browser's «Global Privacy Control» and «Do Not Track» signals: if either is on, measurement is not loaded. You can also block or delete cookies in your browser settings.",
        ],
      },
      {
        title: "8. Minors",
        paras: ["This site is aimed at businesses and adults. We do not knowingly collect data from minors."],
      },
      {
        title: "9. Changes to this policy",
        paras: ["We may update this text. The date of the latest review appears at the top of the page."],
      },
    ] as Block[],
    contactTitle: "Questions about your data?",
    contactText: "Write to us and we will answer.",
    contactBtn: "Go to contact",
  },
} as const;

export function privacyMetadata(lang: Lang) {
  return pageMetadata({ lang, route: { name: "privacy" }, ...COPY[lang].meta });
}

export function PrivacyPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const t = ui(lang);
  return (
    <>
      <PageHero
        breadcrumb={[{ name: t.home, href: href(lang, { name: "home" }) }, { name: c.h1 }]}
        breadcrumbLabel={t.nav.breadcrumb}
        title={c.h1}
        lead={c.lead}
        meta={`${c.updated}: ${UPDATED[lang]}`}
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-10">
          {c.blocks.slice(0, 2).map((b) => <PolicyBlock key={b.title} block={b} />)}
          <section>
            <h2 className="rule-red">{c.cookieTable.title}</h2>
            <p className="mt-3 text-body">{c.cookieTable.intro}</p>
            <div role="region" aria-label={c.cookieTable.title} tabIndex={0} className="mt-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                <thead className="bg-brand-blue-50 text-brand-blue-dark">
                  <tr>{c.cookieTable.head.map((h) => <th key={h} scope="col" className="label px-3 py-2.5">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {c.cookieTable.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-border align-top">
                      <th scope="row" className="px-3 py-2.5 font-mono text-[0.8125rem] font-semibold text-ink">{row[0]}</th>
                      {row.slice(1).map((cell) => <td key={cell} className="px-3 py-2.5 text-body">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {c.blocks.slice(2).map((b) => (
            <div key={b.title}>
              <PolicyBlock block={b} />
              {b.title.startsWith("7.") && (
                <p className="mt-4">
                  <ConsentLink lang={lang} className="rounded-lg border border-control-border px-4 py-2 font-heading font-bold text-brand-blue-dark hover:bg-brand-blue-50" />
                </p>
              )}
            </div>
          ))}
          <div className="card bg-brand-blue-50 p-6">
            <h2 className="text-xl">{c.contactTitle}</h2>
            <p className="mt-2 text-body">{c.contactText}</p>
            <p className="mt-4">
              <Link href={href(lang, { name: "contact" })} className="link font-bold">{c.contactBtn}</Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

function PolicyBlock({ block }: { block: Block }) {
  return (
    <section>
      <h2 className="rule-red">{block.title}</h2>
      {block.paras?.map((p) => <p key={p} className="mt-3 text-body">{p}</p>)}
      {block.items && (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-body marker:text-brand-blue">
          {block.items.map((i) => <li key={i}>{i}</li>)}
        </ul>
      )}
    </section>
  );
}
