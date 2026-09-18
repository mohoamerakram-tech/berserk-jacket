import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/navigation/Navbar";
import CartProvider from "@/lib/cart/CartProvider";
import CartDrawer from "./components/cart/CartDrawer";
import "./globals.css";

// Configure Geist Sans font for modern UI readability
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font for manga metadata, panel tags, and technical specs
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Primary application metadata for SEO and page indexing
export const metadata: Metadata = {
  title: "Berserk Jacket Archive — Official Manga Apparel Experience",
  description: "The official interactive Berserk embroidered jacket experience.",
};

/**
 * RootLayout: The foundational application shell
 * - Injects Google fonts as CSS variables (--font-geist-sans, --font-geist-mono)
 * - Embeds the global persistent Navbar with anime showcase drawer
 * - Wraps entire component tree with CartProvider for global cart state
 * - Mounts single global CartDrawer at the body root level so it sits above all pages
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Global CartProvider: Provides persistent client-side cart state to entire tree */}
        <CartProvider>
          {/* Global sticky navigation bar */}
          <Navbar />
          
          {/* Page content rendered here */}
          {children}

          {/* Global Cart Drawer: Single instance mounted at root, accessible from any page */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
