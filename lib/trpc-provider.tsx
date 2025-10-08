"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./trpc-client";
import SuperJSON from "superjson";

const getBaseUrl = () => {
  // In de browser: gebruik relatieve requests naar hetzelfde domein/poort.
  if (typeof window !== 'undefined') return '';
  // In Vercel: VERCEL_URL bevat je deploy‑URL zonder protocol.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Tijdens `npm run dev` op de server: localhost.
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

