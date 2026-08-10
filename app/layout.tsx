import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "e-TET | Estratificacao de risco familiar",
  description:
    "Hotsite interativo sobre o funcionamento do e-TET, prototipo de apoio a estratificacao de risco familiar na Atencao Primaria a Saude.",
  metadataBase: new URL("https://e-tet-hotsite.openai.site"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "e-TET | Estratificacao de risco familiar",
    description:
      "Entenda como o e-TET apoia o cadastro, o calculo das sentinelas e a priorizacao das visitas na APS.",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "e-TET | Estratificacao de risco familiar",
    description:
      "Entenda como o e-TET apoia o cadastro, o calculo das sentinelas e a priorizacao das visitas na APS.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
