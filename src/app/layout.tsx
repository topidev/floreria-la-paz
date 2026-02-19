import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";
import { ThemeProvider } from 'next-themes';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import QueryProvider from "../providers/QueryProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desert Bloom",
  description: "Florería La Paz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <>
          <QueryProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster richColors position="bottom-right" />
                {children}
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        </>
      </body>
    </html>
  );
}
