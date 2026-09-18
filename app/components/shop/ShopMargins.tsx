/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Renders vertical Japanese editorial lore text running down the left and right
 * margins of the shop manuscript spread.
 *
 * WHY IT EXISTS:
 * Recreates traditional Japanese manga margin notes and philosophical proverbs,
 * framing the product listing inside an authentic print tankobon format.
 *
 * HOW IT CONNECTS:
 * Rendered alongside the main column in `app/shop/page.tsx` as a Server Component.
 * ============================================================================
 */

import React from 'react';

export default function ShopMargins() {
  return (
    <>
      {/* Left Vertical Margin Lore: Craftsmanship Manifesto */}
      <aside
        className="hidden lg:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
        aria-label="Shop Left Margin"
      >
        <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
          ┼ ARCHIVE ┼
        </span>
        <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.3em] leading-none my-auto">
          一針一針に、魂を込めて――
        </div>
        <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
          【 職人魂 】
        </span>
      </aside>

      {/* Right Vertical Margin Lore: Wearer's Purpose */}
      <aside
        className="hidden lg:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
        aria-label="Shop Right Margin"
      >
        <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
          ┼ BERSERK ┼
        </span>
        <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.3em] leading-none my-auto">
          お前の物語を、纏え。
        </div>
        <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
          【 生贄の衣 】
        </span>
      </aside>
    </>
  );
}
