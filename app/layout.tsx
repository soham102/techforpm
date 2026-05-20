/// <reference types="next" />
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react"
import { Providers } from "./providers";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
// @ts-ignore: Allow importing global CSS without type declarations
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "PMverse — Learn APIs & system design visually",
  description:
    "An interactive concept playground that helps non-technical Product Managers understand APIs, databases, and system design — without coding.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Resolve the user on the server so the first paint already knows
  // the auth state (no avatar/nav flicker).
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
      <body className={`${inter.variable} ${mono.variable} font-sans`}>
        <Providers initialUser={user}>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
