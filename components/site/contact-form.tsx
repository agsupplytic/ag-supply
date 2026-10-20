"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const schema = z.object({
  nombre: z.string().trim().min(2, "Escriba su nombre").max(80),
  empresa: z.string().trim().min(2, "Escriba el nombre de su empresa").max(120),
  telefono: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s().-]{6,19}$/, "Escriba un teléfono válido, solo números"),
  email: z.email("Escriba un correo válido").max(120),
  mensaje: z.string().trim().min(10, "Cuéntenos qué necesita (mínimo 10 caracteres)").max(2000),
  // Señuelo anti-spam: una persona no lo ve ni lo llena.
  botcheck: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

/**
 * NEXT_PUBLIC_WEB3FORMS_KEY (clave gratuita de web3forms.com, verificada al correo de
 * siteConfig.email y restringida a agsupply.com.do) envía el formulario directo a la
 * bandeja. Sin ella, se abre el correo del visitante con el mensaje redactado.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

function mailtoHref(v: FormValues) {
  const body = [
    `Nombre: ${v.nombre}`,
    `Empresa: ${v.empresa}`,
    `Teléfono: ${v.telefono}`,
    `Correo: ${v.email}`,
    "",
    v.mensaje,
  ].join("\r\n");
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(`Contacto web — ${v.empresa}`)}&body=${encodeURIComponent(body)}`;
}

const field =
  "mt-1.5 w-full border border-control-border bg-white px-3 py-2.5 text-base text-ink placeholder:text-muted aria-[invalid=true]:border-brand-red-dark";
const labelCls = "font-heading text-sm font-semibold text-ink";
const errCls = "mt-1 text-sm font-medium text-brand-red-dark";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [status, setStatus] = useState<"idle" | "sent" | "mail" | "error">("idle");

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
            subject: `Contacto web — ${values.empresa}`,
            from_name: values.nombre,
            replyto: values.email,
            botcheck: "",
            nombre: values.nombre,
            empresa: values.empresa,
            telefono: values.telefono,
            email: values.email,
            mensaje: values.mensaje,
          }),
        });
        const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
        if (res.ok && data?.success) {
          setStatus("sent");
          reset();
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
      return;
    }
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
        {input("nombre", "Nombre", { autoComplete: "name" })}
        {input("empresa", "Empresa", { autoComplete: "organization" })}
        {input("telefono", "Teléfono", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
        {input("email", "Correo", { type: "email", inputMode: "email", autoComplete: "email" })}
      </div>
      <div>
        <label className={labelCls} htmlFor="mensaje">Mensaje</label>
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
        <label htmlFor="botcheck">No llenar este campo</label>
        <input id="botcheck" tabIndex={-1} autoComplete="off" {...register("botcheck")} />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Enviando…" : "Enviar mensaje"}
      </Button>

      <div role="status" aria-live="polite">
        {status === "sent" && (
          <p className="text-base font-semibold text-brand-blue-dark">
            Mensaje enviado. Le responderemos en horario comercial.
          </p>
        )}
        {status === "mail" && (
          <p className="text-base text-body">
            Se abrió su aplicación de correo con el mensaje listo. Si no ocurrió, escríbanos a{" "}
            <a className="link" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        )}
        {status === "error" && (
          <p className="text-base font-semibold text-brand-red-dark">
            No se pudo enviar. Escríbanos a {siteConfig.email} o por WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}
