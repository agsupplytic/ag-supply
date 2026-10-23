"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n/ui";
import type { Lang } from "@/lib/i18n/routes";

const makeSchema = (lang: Lang) => {
  const e = ui(lang).form.errors;
  return z.object({
    nombre: z.string().trim().min(2, e.name).max(80),
    empresa: z.string().trim().min(2, e.company).max(120),
    telefono: z.string().trim().regex(/^[+\d][\d\s().-]{6,19}$/, e.phone),
    email: z.email(e.email).max(120),
    mensaje: z.string().trim().min(10, e.message).max(2000),
    // Señuelo anti-spam: una persona no lo ve ni lo llena.
    botcheck: z.string().max(0).optional(),
  });
};

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

/**
 * NEXT_PUBLIC_WEB3FORMS_KEY (clave gratuita de web3forms.com, verificada al correo de
 * siteConfig.email y restringida a agsupply.com.do) envía el formulario directo a la
 * bandeja. Sin ella, se abre el correo del visitante con el mensaje redactado.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const field =
  "mt-1.5 w-full rounded-md border border-control-border bg-white px-3 py-2.5 text-base text-ink placeholder:text-muted aria-[invalid=true]:border-brand-red-dark";
const labelCls = "font-heading text-sm font-bold text-ink";
const errCls = "mt-1 text-sm font-medium text-brand-red-dark";

export function ContactForm({ lang }: { lang: Lang }) {
  const t = ui(lang).form;
  const schema = useMemo(() => makeSchema(lang), [lang]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [status, setStatus] = useState<"idle" | "sent" | "mail" | "error">("idle");

  function mailtoHref(v: FormValues) {
    const body = [
      `${t.mailLabels.name}: ${v.nombre}`,
      `${t.mailLabels.company}: ${v.empresa}`,
      `${t.mailLabels.phone}: ${v.telefono}`,
      `${t.mailLabels.email}: ${v.email}`,
      "",
      v.mensaje,
    ].join("\r\n");
    return `mailto:${siteConfig.email}?subject=${encodeURIComponent(t.subject(v.empresa))}&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    if (values.botcheck) return;
    if (WEB3FORMS_KEY) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: t.subject(values.empresa),
            from_name: values.nombre,
            replyto: values.email,
            botcheck: "",
            nombre: values.nombre,
            empresa: values.empresa,
            telefono: values.telefono,
            email: values.email,
            mensaje: values.mensaje,
            idioma: lang,
          }),
        });
        const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
        if (res.ok && data?.success) {
          setStatus("sent");
          track("contact_submit", { result: "sent" });
          reset();
        } else {
          setStatus("error");
          track("contact_submit", { result: "error" });
        }
      } catch {
        setStatus("error");
        track("contact_submit", { result: "error" });
      }
      return;
    }
    track("contact_submit", { result: "mail" });
    window.location.assign(mailtoHref(values));
    setStatus("mail");
  }

  const input = (
    name: keyof Omit<FormValues, "botcheck">,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div>
      <label className={labelCls} htmlFor={name}>{label}</label>
      <input
        id={name}
        className={field}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
        {...register(name)}
      />
      {errors[name] && <p id={`${name}-error`} className={errCls}>{errors[name]?.message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {input("nombre", t.name, { autoComplete: "name" })}
        {input("empresa", t.company, { autoComplete: "organization" })}
        {input("telefono", t.phone, { type: "tel", inputMode: "tel", autoComplete: "tel" })}
        {input("email", t.email, { type: "email", inputMode: "email", autoComplete: "email" })}
      </div>
      <div>
        <label className={labelCls} htmlFor="mensaje">{t.message}</label>
        <textarea
          id="mensaje"
          rows={5}
          className={cn(field, "resize-y")}
          aria-invalid={errors.mensaje ? true : undefined}
          aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
          {...register("mensaje")}
        />
        {errors.mensaje && <p id="mensaje-error" className={errCls}>{errors.mensaje.message}</p>}
      </div>

      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="botcheck">{t.honeypot}</label>
        <input id="botcheck" tabIndex={-1} autoComplete="off" {...register("botcheck")} />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? t.sending : t.send}
      </Button>

      <div role="status" aria-live="polite">
        {status === "sent" && <p className="text-base font-bold text-brand-blue-dark">{t.sent}</p>}
        {status === "mail" && (
          <p className="text-base text-body">
            {t.mail} <a className="link" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        )}
        {status === "error" && (
          <p className="text-base font-bold text-brand-red-dark">
            {t.error} {siteConfig.email} {t.errorOr}
          </p>
        )}
      </div>
    </form>
  );
}
