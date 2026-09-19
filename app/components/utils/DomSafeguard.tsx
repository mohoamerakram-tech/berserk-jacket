'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Global DOM reconciliation safeguard for React 19 / Next.js.
 *
 * WHY IT EXISTS:
 * Protects against runtime crashes caused by Google Chrome's built-in Google
 * Translate, browser translation extensions, and DOM-mutating browser add-ons.
 *
 * THE ROOT CAUSE:
 * When Google Translate translates a page containing Japanese / non-Latin glyphs,
 * Chrome wraps or replaces raw text nodes with `<font><font>...</font></font>` elements.
 * Later, when React 19 performs reconciliation, state updates, or unmounts,
 * React attempts `parent.removeChild(child)` or `parent.insertBefore(newChild, ref)`.
 * Because the DOM was modified outside React's virtual tree, `child.parentNode` is
 * `<font>`, NOT `parent`, causing the browser to throw:
 * "NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
 *
 * THE SOLUTION:
 * Safely monkey-patches `Node.prototype.removeChild` and `Node.prototype.insertBefore`
 * on the client so that if `child.parentNode !== this`, it cleans up from its actual
 * parent (`child.parentNode.removeChild(child)`) rather than throwing a fatal DOMException.
 * ============================================================================
 */

if (typeof window !== 'undefined' && window.Node) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child) as T;
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T;
      }
      return this.appendChild(newNode) as T;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

export default function DomSafeguard() {
  return null;
}
