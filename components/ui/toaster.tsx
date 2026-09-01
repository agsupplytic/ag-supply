"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!font-body !rounded-md !border-border !bg-white !text-ink !shadow-lg",
          title: "!font-heading !font-semibold !text-ink",
          description: "!text-body",
          actionButton: "!bg-brand-blue !text-white !rounded",
        },
      }}
    />
  );
}

export { toast } from "sonner";
