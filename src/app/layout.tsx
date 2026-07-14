import type { Metadata } from "next";
import { Fraunces, Archivo } from "next/font/google";
import "@/styles/tokens.css";
import "./globals.css";
import "./lumina.css";
import { StoreProvider } from "@/stores/StoreContext";
import PageBeacon from "@/components/analytics/PageBeacon";
import WebVitals from "@/components/analytics/WebVitals";
import ScrollToTop from "@/components/layout/ScrollToTop";

// The two brand faces, self-hosted instead of pulled from Google Fonts at
// runtime. They used to be an `@import` at the top of lumina.css — a remote,
// render-path stylesheet, and on a throttled connection the headline first
// painted in a fallback and then RE-painted seconds later when Fraunces finally
// arrived. That late repaint was the home page's 11-second LCP, not the imagery.
// next/font downloads the files at build time, serves them from our own origin,
// and preloads them, so the real font is there for the first paint.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nahar Jewellers — Haute Joaillerie",
  description:
    "Nahar Jewellers — haute joaillerie handcrafted in our Parisian ateliers since 1927.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-scroll-behavior: the stylesheet sets `scroll-behavior: smooth` on
    // <html> on purpose — it is what makes the nav's "#collections" style links
    // glide instead of jump. Next cannot tell a deliberate one from a stray one,
    // so without this it warns, and during a route change it has to leave the
    // smooth scrolling in place: the new page would then ANIMATE its way to the
    // top, through content the reader has not seen. Declaring it lets Next turn
    // smooth off for the duration of a navigation and put it straight back.
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${archivo.variable}`}>
      <body><StoreProvider>{children}</StoreProvider><ScrollToTop /><PageBeacon /><WebVitals /></body>
    </html>
  );
}
