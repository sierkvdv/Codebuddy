"use client";

import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_app";
import SuperJSON from "superjson";

const getBaseUrl = () => {
  // In de browser: gebruik relatieve requests naar hetzelfde domein/poort.
  if (typeof window !== 'undefined') return '';
  // In Vercel: VERCEL_URL bevat je deploy‑URL zonder protocol.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Tijdens `npm run dev` op de server: localhost.
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCReact<AppRouter>({
  config() {
    return {
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
});

