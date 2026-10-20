"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FaqAccordion({
  items,
  idPrefix = "q",
}: {
  items: { q: string; a: string }[];
  idPrefix?: string;
}) {
  return (
    <Accordion type="single" collapsible className="border-t border-border">
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`${idPrefix}-${i}`}>
          <AccordionTrigger className="text-lg">{item.q}</AccordionTrigger>
          <AccordionContent className="text-body">
            <p className="max-w-2xl leading-relaxed">{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
