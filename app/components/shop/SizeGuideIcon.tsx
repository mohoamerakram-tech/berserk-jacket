/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Inline SVG ruler/measuring-tape icon for the Size Guide modal trigger.
 *
 * WHY IT EXISTS:
 * Inline SVG — no icon library. Size/color come from the parent via className.
 * Keeps bundle footprint minimal and avoids third-party icon dependencies.
 * ============================================================================
 */

import React from 'react';

interface SizeGuideIconProps {
  /** Optional Tailwind class names for custom width, height, or colors */
  className?: string;
}

export default function SizeGuideIcon({ className = 'w-3.5 h-3.5' }: SizeGuideIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {/* Outer ruler body */}
      <path d="M2 7h20v10H2z" />
      {/* Measuring ticks */}
      <line x1="6" y1="7" x2="6" y2="12" />
      <line x1="10" y1="7" x2="10" y2="14" />
      <line x1="14" y1="7" x2="14" y2="12" />
      <line x1="18" y1="7" x2="18" y2="14" />
    </svg>
  );
}
