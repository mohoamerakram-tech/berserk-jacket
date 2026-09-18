/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Reusable layout wrapper providing standardized label headers and spacing for
 * each studio configuration section.
 *
 * WHY IT EXISTS:
 * Guarantees visual consistency across every option group (garment, motif, color,
 * size, placement, customer inputs) without copy-pasting CSS classes.
 *
 * HOW IT CONNECTS:
 * - Used throughout `app/components/studio/StudioPanel.tsx`.
 * ============================================================================
 */

import React from 'react';

interface OptionGroupProps {
  /** Section heading in uppercase mono (e.g. "GARMENT BASE:") */
  label: string;
  /** Child interactive picker or form input */
  children: React.ReactNode;
}

export default function OptionGroup({ label, children }: OptionGroupProps) {
  return (
    <div className="space-y-2">
      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black">
        {label}
      </label>
      {children}
    </div>
  );
}
