import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/navigation/Navbar";
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
 * - Wraps main page content with full height and antialiased rendering
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
        {/* Global sticky navigation bar */}
        <Navbar />
        
        {/* Page content rendered here */}
        {children}
      </body>
    </html>
  );
}
