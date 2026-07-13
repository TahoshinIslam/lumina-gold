import type { Metadata } from "next";
import "@/styles/tokens.css";
import "./globals.css";
import "./lumina.css";
import { StoreProvider } from "@/stores/StoreContext";
import PageBeacon from "@/components/analytics/PageBeacon";

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
    <html lang="en">
      <body><StoreProvider>{children}</StoreProvider><PageBeacon /></body>
    </html>
  );
}
