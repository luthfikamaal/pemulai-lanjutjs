'use client';
import { SessionProvider } from 'next-auth/react';
import NextProgress from "next-progress";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <>
    <SessionProvider>
      {children}
    </SessionProvider>
  </>;
}