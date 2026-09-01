"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const schema = z.object({
  nombre: z.string().min(2, "Escribe tu nombre"),
  empresa: z.string().min(2, "Escribe el nombre de tu empresa"),
  telefono: z.string().min(7, "Escribe un teléfono válido"),
  email: z.string().email("Escribe un correo válido"),
  mensaje: z.string().min(10, "Cuéntanos qué necesitas (mínimo 10 caracteres)"),
});

type FormValues = z.infer<typeof schema>;

/**
 * Set NEXT_PUBLIC_WEB3FORMS_KEY (free key from web3forms.com, verified to
 * siteConfig.email) to send the form straight to the inbox. Without it the form
 * falls back to opening the visitor's mail client with the message pre-filled.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

function mailtoHref(v: FormValues) {
  const body = [
    `Nombre: ${v.nombre}`,
    `Empresa: ${v.empresa}`,
    `Teléfono: ${v.telefono}`,
    `Email: ${v.email}`,
    "",
    v.mensaje,
  ].join("\n");
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    `Contacto web — ${v.empresa}`,
  )}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [status, setStatus] = useState<"idle" | "sent" | "mail" | "error">(
    "idle",
  );

  async function onSubmit(values: FormValues) {
    if (WEB3FORMS_KEY) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Contacto web — ${values.empresa}`,
            from_name: values.nombre,
            nombre: values.nombre,
            empresa: values.empresa,
            telefono: values.telefono,
            email: values.email,
            mensaje: values.mensaje,
          }),
        });
        if (res.ok) {
          setStatus("sent");
          reset();
          return;
        }
        setStatus("error");
        return;
      } catch {
        setStatus("error");
        return;
      }
    }
    window.location.assign(mailtoHref(values));
    setStatus("mail");
  }

  const field =
    "mt-1.5 w-full rounded-md border border-control-border bg-white px-3 py-2.5 text-ink placeholder:text-muted";
  const labelCls = "font-heading text-sm font-semibold text-ink";
  const errCls = "mt-1 text-xs font-medium text-brand-red-dark";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="nombre">
            Nombre
          </label>
          <input id="nombre" className={field} {...register("nombre")} />
          {errors.nombre && <p className={errCls}>{errors.nombre.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="empresa">
            Empresa
          </label>
          <input id="empresa" className={field} {...register("empresa")} />
          {errors.empresa && <p className={errCls}>{errors.empresa.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="telefono">
            Teléfono
          </label>
          <input
            id="telefono"
            inputMode="tel"
            className={field}
            {...register("telefono")}
          />
          {errors.telefono && (
            <p className={errCls}>{errors.telefono.message}</p>
          )}
        </div>
        <div>
          <label className={labelCls} htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            inputMode="email"
            className={field}
            {...register("email")}
          />
          {errors.email && <p className={errCls}>{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor="mensaje">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          rows={5}
          className={cn(field, "resize-y")}
          {...register("mensaje")}
        />
        {errors.mensaje && <p className={errCls}>{errors.mensaje.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Enviando…" : "Enviar mensaje"}
      </Button>

      {status === "sent" && (
        <p className="text-sm font-medium text-brand-blue-dark">
          Mensaje enviado. Te responderemos a la brevedad.
        </p>
      )}
      {status === "mail" && (
        <p className="text-sm text-body">
          Se abrió tu aplicación de correo con el mensaje listo para enviar. Si no
          ocurrió, escríbenos a {siteConfig.email}.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-brand-red-dark">
          No se pudo enviar. Escríbenos directamente a {siteConfig.email} o por
          WhatsApp.
        </p>
      )}
    </form>
  );
}
