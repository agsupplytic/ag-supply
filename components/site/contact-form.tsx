"use client";

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

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    const body = [
      `Nombre: ${values.nombre}`,
      `Empresa: ${values.empresa}`,
      `Teléfono: ${values.telefono}`,
      `Email: ${values.email}`,
      "",
      values.mensaje,
    ].join("\n");
    const href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      `Contacto web — ${values.empresa}`,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
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

      <Button type="submit" size="lg">
        Enviar mensaje
      </Button>

      {isSubmitSuccessful && (
        <p className="text-sm text-body">
          Se abrió tu aplicación de correo con el mensaje listo para enviar. Si
          no ocurrió, escríbenos directamente a {siteConfig.email}.
        </p>
      )}
      <p className="text-xs text-muted">
        El formulario abre tu correo con los datos. Próximamente se conectará un
        envío directo.
      </p>
    </form>
  );
}
