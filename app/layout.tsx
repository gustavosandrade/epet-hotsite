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
  title: "e-TET | Estratificação de risco familiar",
  description:
    "Hotsite interativo sobre o funcionamento do e-TET, protótipo de apoio à estratificação de risco familiar na Atenção Primária à Saúde.",
  metadataBase: new URL("https://e-tet-hotsite.gustavosandrade.chatgpt.site"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "e-TET | Estratificação de risco familiar",
    description:
      "Entenda como o e-TET apoia o cadastro, o cálculo das sentinelas e a priorização das visitas na APS.",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "e-TET | Estratificação de risco familiar",
    description:
      "Entenda como o e-TET apoia o cadastro, o cálculo das sentinelas e a priorização das visitas na APS.",
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
