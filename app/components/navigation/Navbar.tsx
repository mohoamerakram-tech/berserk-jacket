'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimeMarquee from './AnimeMarquee';
import { NAV_LINKS } from './constants';

export default function Navbar() {
  const [showMarquee, setShowMarquee] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-black text-black select-none">
      {/* Primary Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center group cursor-pointer py-1"
          aria-label="Future Stitch Manu"
        >
          <Image
            src="/images/fsm-logo.png"
            alt="Future Stitch Manu"
            width={160}
            height={114}
            priority
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider uppercase">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-stone-700 hover:text-black transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls: Anime Marquee Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowMarquee((prev) => !prev)}
            aria-expanded={showMarquee}
            className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 ${
              showMarquee
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-stone-100'
            }`}
          >
            <span>Anime</span>
            <span className="text-[10px]">{showMarquee ? '▲' : '▼'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-1.5 border border-black text-black cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black bg-white px-4 py-3 flex flex-col gap-2.5 text-xs font-mono uppercase">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-stone-800 hover:text-black font-semibold"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Toggled Anime Marquee Drawer */}
      {showMarquee && <AnimeMarquee />}
    </header>
  );
}
