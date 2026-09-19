'use client';

/**
 * Collects a short phrase and font choice before placing a text embroidery layer.
 * The parent receives only the final trimmed text and selected font.
 */

import { useState } from 'react';
import { TextFontId } from '@/lib/studio/types';
import { MAX_TEXT_LENGTH } from '@/lib/studio/options';
import FontPicker from './FontPicker';
import OptionGroup from './OptionGroup';

interface TextInputSectionProps {
  /** Places the validated text layer on the active jacket side. */
  onAdd: (text: string, fontId: TextFontId) => void;
  /** Prevents additions when the active side has reached its layer limit. */
  canAdd: boolean;
}

export default function TextInputSection({
  onAdd,
  canAdd,
}: TextInputSectionProps) {
  // Draft state stays local because the parent only needs completed layers.
  const [text, setText] = useState('');
  const [fontId, setFontId] = useState<TextFontId>('geist-mono');

  // Whitespace-only copy cannot create an embroidery layer.
  const trimmedText = text.trim();
  const canSubmit = trimmedText.length > 0 && canAdd;

  // Submit the chosen text and reset only the input for fast repeat placement.
  const handleAdd = () => {
    if (!canSubmit) return;
    onAdd(trimmedText, fontId);
    setText('');
  };

  return (
    <OptionGroup label="3. TEXT EMBROIDERY // テキスト刺繍:">
      <div className="space-y-2 select-none">
        {/* Text field and live character count share one bordered row. */}
        <div className="flex items-center border-2 border-black bg-white focus-within:ring-2 focus-within:ring-[#dc2626]">
          <input
            type="text"
            maxLength={MAX_TEXT_LENGTH}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="MAX 16 CHARACTERS // 最大16文字"
            className="min-w-0 flex-1 px-3 py-2.5 font-mono text-xs font-bold uppercase text-black placeholder:text-stone-400 focus:outline-none"
          />
          <span className="shrink-0 border-l-2 border-black px-2 py-2.5 font-mono text-[10px] font-bold text-stone-500">
            {text.length}/{MAX_TEXT_LENGTH}
          </span>
        </div>

        {/* Scrollable font picker lets customers search and preview every typeface. */}
        <FontPicker value={fontId} onChange={setFontId} />

        {/* The hard-shadow action matches the studio's manga panel controls. */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canSubmit}
          className="w-full border-2 border-black bg-black px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_#dc2626] transition-all enabled:cursor-pointer enabled:hover:translate-x-[2px] enabled:hover:translate-y-[2px] enabled:hover:shadow-none disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500 disabled:shadow-none"
        >
          ＋ ADD TEXT
        </button>

        {/* Capacity feedback explains why the action is unavailable. */}
        {!canAdd && (
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#dc2626]">
            LIMIT REACHED ON THIS SIDE // 上限到達
          </p>
        )}
      </div>
    </OptionGroup>
  );
}
