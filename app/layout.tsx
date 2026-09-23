import type { Metadata } from "next";
import { Bebas_Neue, Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/navigation/Navbar";
import CartProvider from "@/lib/cart/CartProvider";
import CartDrawer from "./components/cart/CartDrawer";
import DomSafeguard from "./components/utils/DomSafeguard";
import { CatalogProvider } from "@/lib/catalog/client";
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

// Configure Bebas Neue for bold display-style text embroidery.
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

// Primary application metadata for SEO and page indexing
export const metadata: Metadata = {
  title: "Future Stitch | Embroidered Jackets & Custom Studio",
  description: "Shop embroidered jackets or create your own design at Future Stitch.",
  other: {
    google: "notranslate",
  },
};

/**
 * RootLayout: The foundational application shell
 * - Injects Google fonts as CSS variables (--font-geist-sans, --font-geist-mono, --font-bebas)
 * - Embeds the global persistent Navbar with anime showcase drawer
 * - Wraps entire component tree with CartProvider for global cart state
 * - Mounts single global CartDrawer at the body root level so it sits above all pages
 * - Includes translate="no" and DomSafeguard to prevent Chrome auto-translate DOM crashes
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      translate="no"
      className={`notranslate ${geistSans.variable} ${geistMono.variable} ${bebas.variable} h-full antialiased`}
    >
      <head>
        {/* Early inline safeguard to prevent DOMException when browser translation extensions wrap text in <font> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window!=='undefined'&&window.Node){var oR=Node.prototype.removeChild;Node.prototype.removeChild=function(c){if(c.parentNode!==this){return c.parentNode?c.parentNode.removeChild(c):c;}return oR.call(this,c);};var oI=Node.prototype.insertBefore;Node.prototype.insertBefore=function(n,r){if(r&&r.parentNode!==this){return r.parentNode?r.parentNode.insertBefore(n,r):this.appendChild(n);}return oI.call(this,n,r);};}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col notranslate" translate="no" suppressHydrationWarning>
        <DomSafeguard />
        {/* Global CartProvider: Provides persistent client-side cart state to entire tree */}
        <CatalogProvider>
        <CartProvider>
          {/* Global sticky navigation bar */}
          <Navbar />
          
          {/* Page content rendered here */}
          {children}

          {/* Global Cart Drawer: Single instance mounted at root, accessible from any page */}
          <CartDrawer />
        </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
