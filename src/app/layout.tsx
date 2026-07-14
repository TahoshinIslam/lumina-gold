import type { Metadata } from "next";
import "@/styles/tokens.css";
import "./globals.css";
import "./lumina.css";
import { StoreProvider } from "@/stores/StoreContext";
import PageBeacon from "@/components/analytics/PageBeacon";
import ScrollToTop from "@/components/layout/ScrollToTop";

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
    <html lang="en" data-scroll-behavior="smooth">
      <body><StoreProvider>{children}</StoreProvider><ScrollToTop /><PageBeacon /></body>
    </html>
  );
}
