"use client";

import { ErrorView } from "@/components/pages/status";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView lang="en" reset={reset} />;
}
