import type { Metadata } from "next";
import "./globals.css";
import "./lumina.css";
import { StoreProvider } from "@/stores/StoreContext";

export const metadata: Metadata = {
  title: "LUMINA — Haute Joaillerie",
  description:
    "Maison Lumina — haute joaillerie handcrafted in our Parisian ateliers since 1927.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
