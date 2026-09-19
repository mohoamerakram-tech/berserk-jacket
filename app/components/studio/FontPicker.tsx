'use client';

/**
 * Searchable font catalog for customer text embroidery.
 * Imported display fonts come from globals.css instead of next/font so they are not
 * preloaded with the site's core typefaces on every route.
 */

import { useEffect, useRef, useState } from 'react';
import { TextFontId, TEXT_FONTS } from '@/lib/studio';

interface FontPickerProps {
  /** Currently selected embroidery font. */
  value: TextFontId;
  /** Updates the selected font in the parent text section. */
  onChange: (id: TextFontId) => void;
}

export default function FontPicker({ value, onChange }: FontPickerProps) {
  // Open state controls whether the floating font catalog is visible.
  const [isOpen, setIsOpen] = useState(false);
  // Search stays local so the parent does not re-render on every search keystroke.
  const [query, setQuery] = useState('');
  // The root ref distinguishes clicks inside the picker from outside clicks.
  const rootRef = useRef<HTMLDivElement | null>(null);
  // The input ref lets the search receive focus as soon as the panel opens.
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Fall back to the first catalog entry if persisted data contains an unknown ID.
  const selectedFont =
    TEXT_FONTS.find((font) => font.id === value) || TEXT_FONTS[0];

  // Match labels case-insensitively while preserving the catalog order.
  const filtered = TEXT_FONTS.filter((font) =>
    font.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  // Auto-focus lets customers start searching immediately after opening.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // This classic outside-click pattern closes only when the target leaves the root.
    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Escape gives keyboard users a quick, predictable way to dismiss the panel.
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleDocumentKeyDown);

    // Remove both global listeners whenever the dropdown closes or unmounts.
    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [isOpen]);

  // Selecting a font applies it, closes the panel, and resets the next search.
  const handleSelect = (fontId: TextFontId) => {
    onChange(fontId);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={rootRef} className="relative">
      {/* The compact trigger shows the current choice without consuming list height. */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((previous) => !previous)}
        className={`flex h-11 w-full items-center justify-between border-2 border-black bg-white px-3 text-left ${
          isOpen ? 'border-b-[#dc2626]' : ''
        }`}
      >
        <span
          style={{ fontFamily: selectedFont.cssFamily }}
          className="text-base text-black"
        >
          {selectedFont.label}
        </span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-black transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <path
            d="m6 9 6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="2"
          />
        </svg>
      </button>

      {/* The absolute panel floats over later controls, preventing layout shift. */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 border-2 border-black bg-white shadow-[6px_6px_0px_0px_#dc2626]">
          {/* Search narrows the list without changing the chosen font. */}
          <div className="border-b border-black p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="SEARCH FONTS // フォント検索"
              className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
            />
          </div>

          {/* Each name uses its own typeface so customers can preview the choice. */}
          <div className="max-h-[260px] overflow-y-auto bg-white" role="listbox">
            {filtered.length === 0 ? (
              <div className="p-5 text-center font-mono text-xs uppercase text-stone-500">
                NO FONTS MATCH // 該当なし
              </div>
            ) : (
              filtered.map((font) => {
                const isSelected = font.id === value;
                return (
                  <button
                    key={font.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(font.id)}
                    className={`flex w-full items-center justify-between gap-3 border-b border-stone-200 px-3 py-2 text-left transition-colors last:border-b-0 ${
                      isSelected
                        ? 'border-l-4 border-l-[#dc2626] bg-black text-white'
                        : 'bg-white text-black hover:bg-stone-100'
                    }`}
                  >
                    <span
                      style={{ fontFamily: font.cssFamily }}
                      className={`text-base ${
                        isSelected ? 'text-white' : 'text-black'
                      }`}
                    >
                      {font.label}
                    </span>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-widest ${
                        isSelected ? 'text-white' : 'text-stone-400'
                      }`}
                    >
                      {font.category}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* The footer reports the filtered count only while the panel is open. */}
          <p className="border-t border-stone-200 px-3 py-1 font-mono text-[10px] uppercase text-stone-500">
            {filtered.length} / {TEXT_FONTS.length} FONTS
          </p>
        </div>
      )}
    </div>
  );
}
