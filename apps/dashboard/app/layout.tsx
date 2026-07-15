import type { Metadata } from "next";

import { Sidebar } from "@/components/sidebar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Canal YouTube AI",
  description: "Control de producción para un canal automatizado con IA",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <Sidebar />
        <main className="px-5 py-8 lg:ml-64 lg:px-10 lg:py-10 xl:px-14">{children}</main>
      </body>
    </html>
  );
}
