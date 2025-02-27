import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navigation from '@/components/Navigation';
import BootstrapClient from '@/components/BootstrapClient';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestión Académica",
  description: "Sistema de gestión de usuarios, cursos e inscripciones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BootstrapClient />
        <Navigation />
        <main className="container mt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
