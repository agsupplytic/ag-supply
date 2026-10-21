import Link from "next/link";
import { getCategories } from "@/lib/content";
import { localizeCategory } from "@/lib/i18n/content";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FaqJsonLd } from "@/components/site/json-ld";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { textFor } from "@/lib/i18n/site-text";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/seo";

type QA = { q: string; a: string };

const META = {
  es: {
    title: "Preguntas frecuentes sobre AG Supply",
    description: "Respuestas sobre AG Supply: qué fabrica, las marcas Ocean Breeze y Bonche, cómo se cotiza, distribuidores, ubicación de la planta y horario de atención.",
  },
  en: {
    title: "AG Supply frequently asked questions",
    description: "Answers about AG Supply: what it manufactures, the Ocean Breeze and Bonche brands, how to request a quote, distributors, plant location and business hours.",
  },
};

export function faqMetadata(lang: Lang) {
  return pageMetadata({ lang, route: { name: "faq" }, ...META[lang] });
}

export async function FaqPage({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const tt = textFor(lang);
  const categories = (await getCategories()).map((c) => localizeCategory(c, lang));
  const made = categories.filter((c) => c.fabricated).map((c) => c.name.toLowerCase()).join(", ");
  const supplied = categories.filter((c) => !c.fabricated).map((c) => c.name.toLowerCase()).join(", ");
  const { company } = siteConfig;
  const a = tt.address;
  const px = tt.proximity;

  const es = lang === "es";
  const groups: { title: string; items: QA[] }[] = es
    ? [
        {
          title: "La empresa",
          items: [
            { q: "¿Qué es AG Supply?", a: `${siteConfig.legalName} es una convertidora de papel dominicana con planta en el sector Las Palomas, Santiago. Recibe bobinas de papel y las convierte en producto terminado. Nació en ${company.foundedYear} como ${company.formerName} y se reorientó a la conversión de papel en ${company.pivotYear}.` },
            { q: "¿Dónde está la planta?", a: `${a.line1}, ${a.city}. Queda a ${px[0]}, ${px[1]} y ${px[2]}.` },
            { q: "¿Cuál es la capacidad de producción?", a: `La planta tiene capacidad instalada para procesar hasta ${company.capacityTonsMonth} toneladas de papel al mes.` },
            { q: "¿Cuál es el horario de atención?", a: `${tt.hours}.` },
          ],
        },
        {
          title: "Productos y marcas",
          items: [
            { q: "¿Qué productos fabrica AG Supply?", a: `Papel tissue convertido en la planta: ${made}. Además suministra ${supplied}, que no se fabrican en la planta.` },
            { q: "¿Qué son Ocean Breeze y Bonche?", a: "Son las dos marcas propias de AG Supply. Ocean Breeze es la línea para hoteles, restaurantes y cadenas. Bonche es la línea de consumo masivo y uso cotidiano, de precio accesible." },
            { q: "¿Qué significa la presentación, por ejemplo 12/1 o 48/1?", a: "Es la presentación del producto tal como figura en el catálogo y en el sistema de AG Supply. La cantidad que se pide en la cotización se cuenta en esa presentación. Si tiene dudas sobre una referencia, atención comercial la confirma antes de cotizar." },
          ],
        },
        {
          title: "Cotización y entrega",
          items: [
            { q: "¿Por qué no hay precios en el sitio?", a: "El precio depende de la referencia y del volumen de cada pedido, por eso se confirma por pedido. Arme su lista en el catálogo y envíela por WhatsApp." },
            { q: "¿Cómo pido una cotización?", a: "En el catálogo, añada los productos a la lista, ajuste las cantidades y agregue una nota por producto si lo necesita. Al enviar, se genera un mensaje de WhatsApp con su lista. No hace falta registrarse." },
            { q: "¿Pueden fabricar un formato o empaque específico?", a: "Consulte por WhatsApp o por el formulario de contacto indicando producto, formato y volumen; atención comercial evalúa cada caso." },
            { q: "¿Tienen distribuidores autorizados?", a: "Sí, en Santiago, Santo Domingo, Región Este y Puerto Plata. Sus datos están en la página de contacto." },
            { q: "¿Cómo los contacto directamente?", a: `Por teléfono (${siteConfig.phones[0].value} y ${siteConfig.phones[1].value}), por correo (${siteConfig.email}) o por WhatsApp desde cualquier botón del sitio.` },
          ],
        },
      ]
    : [
        {
          title: "The company",
          items: [
            { q: "What is AG Supply?", a: `${siteConfig.legalName} is a Dominican paper converter with a plant in the Las Palomas district of Santiago. It receives paper reels and converts them into finished product. It was founded in ${company.foundedYear} as ${company.formerName} and moved into paper converting in ${company.pivotYear}.` },
            { q: "Where is the plant?", a: `${a.line1}, ${a.city}. It is ${px[0]}, ${px[1]} and ${px[2]}.` },
            { q: "What is the production capacity?", a: `The plant has installed capacity to process up to ${company.capacityTonsMonth} tonnes of paper per month.` },
            { q: "What are the business hours?", a: `${tt.hours}.` },
          ],
        },
        {
          title: "Products and brands",
          items: [
            { q: "What does AG Supply manufacture?", a: `Tissue paper converted at the plant: ${made}. It also supplies ${supplied}, which are not manufactured at the plant.` },
            { q: "What are Ocean Breeze and Bonche?", a: "They are AG Supply's two own brands. Ocean Breeze is the line for hotels, restaurants and chains. Bonche is the mass-consumption, everyday-use line at an affordable price." },
            { q: "What does the pack size, for example 12/1 or 48/1, mean?", a: "It is the product's pack size as it appears in the catalog and in AG Supply's system. The quantity requested in the quote is counted in that pack size. If you have doubts about an item, sales confirms it before quoting." },
          ],
        },
        {
          title: "Quotes and delivery",
          items: [
            { q: "Why are there no prices on the site?", a: "Price depends on the item and the volume of each order, so it is confirmed per order. Build your list in the catalog and send it via WhatsApp." },
            { q: "How do I request a quote?", a: "In the catalog, add products to the list, adjust quantities and add a note per product if needed. When you send it, a WhatsApp message with your list is generated. No registration is required." },
            { q: "Can you make a specific format or packaging?", a: "Ask on WhatsApp or through the contact form with the product, format and volume; sales evaluates each case." },
            { q: "Do you have authorized distributors?", a: "Yes, in Santiago, Santo Domingo, the East region and Puerto Plata. Their details are on the contact page." },
            { q: "How do I contact you directly?", a: `By phone (${siteConfig.phones[0].value} and ${siteConfig.phones[1].value}), by email (${siteConfig.email}) or on WhatsApp from any button on the site.` },
          ],
        },
      ];

  const c2 = es
    ? { title: "Preguntas frecuentes", lead: "Lo que más preguntan los clientes sobre la empresa, las marcas y la cotización.", none: "¿No encuentra su pregunta?", write: "Escríbanos con su caso concreto.", goContact: "Ir a contacto" }
    : { title: "Frequently asked questions", lead: "What customers ask most about the company, the brands and quotes.", none: "Can't find your question?", write: "Write to us with your specific case.", goContact: "Go to contact" };

  return (
    <>
      <FaqJsonLd qa={groups.flatMap((g) => g.items)} lang={lang} />
      <PageHero
        breadcrumb={[{ name: t.home, href: href(lang, { name: "home" }) }, { name: c2.title }]}
        breadcrumbLabel={t.nav.breadcrumb}
        title={c2.title}
        lead={c2.lead}
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="rule-red">{g.title}</h2>
              <div className="mt-4">
                <FaqAccordion items={g.items} idPrefix={g.title} />
              </div>
            </section>
          ))}

          <div className="card bg-brand-blue-50 p-6">
            <h2 className="text-xl">{c2.none}</h2>
            <p className="mt-2 text-body">{c2.write}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <WhatsAppButton size="lg" lang={lang} />
              <Button asChild variant="outline" size="lg">
                <Link href={href(lang, { name: "contact" })}>{c2.goContact}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
