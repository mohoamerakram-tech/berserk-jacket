'use client';

import { useRouter } from 'next/navigation';
import { saveBespokeCheckout } from '@/lib/studio/bespoke-checkout';
import { useEffect, useRef, useState } from 'react';
import { JACKET_COLORS, StudioView } from '@/lib/studio';
import JacketColorPicker from './JacketColorPicker';
import ViewToggle from './ViewToggle';
import WhatsAppButton from '@/app/components/shop/WhatsAppButton';

type Artwork = { url: string; name: string; aspect: number };
const MAX_FILE = 10 * 1024 * 1024;
const initialPlacement = { x: 50, y: 48, size: 28, rotation: 0 };
const buttonClass = 'border-2 border-black bg-white text-black px-3 py-2 text-xs font-bold uppercase hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The preview image could not be loaded. Please try again.'));
    image.src = src;
  });
}

export default function BespokeStudio() {
  const router = useRouter();
  const [savingCheckout, setSavingCheckout] = useState(false);
  const [view, setView] = useState<StudioView>('front');
  const [artworks, setArtworks] = useState<Record<StudioView, Artwork | null>>({ front: null, back: null });
  const [placements, setPlacements] = useState<Record<StudioView, typeof initialPlacement>>({ front: { ...initialPlacement }, back: { ...initialPlacement } });
  const artwork = artworks[view];
  const placement = placements[view];
  const setArtwork = (next: Artwork | null) => setArtworks((old) => ({ ...old, [view]: next }));
  const setPlacement = (next: typeof initialPlacement | ((old: typeof initialPlacement) => typeof initialPlacement)) =>
    setPlacements((old) => ({ ...old, [view]: typeof next === 'function' ? next(old[view]) : { ...next } }));
  const [jacketId, setJacketId] = useState('black');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const requestRef = useRef<AbortController | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const jacket = JACKET_COLORS.find((item) => item.id === jacketId) ?? JACKET_COLORS[0];

  useEffect(() => () => requestRef.current?.abort(), []);
  const frontUrl = artworks.front?.url;
  const backUrl = artworks.back?.url;
  useEffect(() => () => { if (frontUrl) URL.revokeObjectURL(frontUrl); }, [frontUrl]);
  useEffect(() => () => { if (backUrl) URL.revokeObjectURL(backUrl); }, [backUrl]);

  async function upload(file: File) {
    requestRef.current?.abort();
    requestRef.current = null;
    setBusy(false);
    setError('');
    setStatus('');
    if (/\.(svg|ai|eps|pdf)$/i.test(file.name) || /svg|postscript|pdf/.test(file.type)) {
      setError('Vector files not supported, please upload PNG/JPG.'); return;
    }
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError('Please choose a PNG or JPG image.'); return;
    }
    if (file.size > MAX_FILE) { setError('Please choose an image smaller than 10 MB.'); return; }
    if (!file.size) { setError('This file is empty. Please choose another image.'); return; }
    const controller = new AbortController();
    requestRef.current = controller;
    const timer = setTimeout(() => controller.abort(), 60_000);
    setBusy(true);
    let url: string | undefined;
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/remove-bg', { method: 'POST', body, signal: controller.signal });
      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        throw new Error(failure?.message ?? 'We could not process this image. Please try again.');
      }
      const blob = await response.blob();
      if (blob.type !== 'image/png' || !blob.size) throw new Error('The processed image was incomplete. Please try again.');
      url = URL.createObjectURL(blob);
      const image = await loadImage(url);
      if (requestRef.current !== controller) return;
      if (controller.signal.aborted) throw new Error('Processing timed out.');
      setArtwork({ url, name: file.name, aspect: image.naturalWidth / image.naturalHeight });
      url = undefined;
      setPlacement(initialPlacement);
      setStatus('Background removed. Your ' + view + ' artwork is ready to place.');
    } catch (failure) {
      if (requestRef.current === controller) {
        setError(controller.signal.aborted
          ? 'Processing took longer than 60 seconds. Please try a smaller image.'
          : failure instanceof Error ? failure.message : 'Background removal is unavailable. Please try again.');
      }
    } finally {
      if (url) URL.revokeObjectURL(url);
      clearTimeout(timer);
      if (requestRef.current === controller) { setBusy(false); requestRef.current = null; }
    }
  }


  return (
    <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-start font-mono text-black" aria-label="Bespoke jacket studio">
      <div className="min-w-0 w-full space-y-3 lg:sticky lg:top-24">
        <ViewToggle view={view} onViewChange={(next) => { drag.current = null; setView(next); }} />
        <div className="flex justify-between text-xs font-bold uppercase"><span>Panel 05 // Your jacket</span><span>Live preview</span></div>
        <div ref={canvasRef} className="relative mx-auto w-full aspect-[4/5] lg:max-w-[calc((100dvh-15rem)*0.8)] overflow-hidden border-[3px] border-black bg-stone-950 shadow-sm">
          {/* Each side keeps its own artwork and placement. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={view === 'front' ? jacket.frontImage : jacket.backImage} alt={`${jacketId} jacket — ${view} preview`} className="absolute inset-0 h-full w-full object-contain" draggable={false} />
          {artwork && (
            <div role="button" tabIndex={0} aria-label="Uploaded artwork. Drag to move, or use arrow keys."
              className="absolute cursor-grab active:cursor-grabbing outline outline-1 outline-dashed outline-red-500 focus:outline-2"
              style={{ left: `${placement.x}%`, top: `${placement.y}%`, width: `${placement.size}%`, aspectRatio: artwork.aspect,
                transform: `translate(-50%, -50%) rotate(${placement.rotation}deg)`, touchAction: 'none' }}
              onPointerDown={(event) => {
                if (!canvasRef.current) return;
                const rect = canvasRef.current.getBoundingClientRect();
                drag.current = {
                  x: event.clientX - rect.left - (placement.x / 100) * rect.width,
                  y: event.clientY - rect.top - (placement.y / 100) * rect.height,
                };
                try {
                  event.currentTarget.setPointerCapture(event.pointerId);
                } catch {
                  // ignore if pointer capture fails
                }
                event.preventDefault();
              }}
              onPointerMove={(event) => {
                const dragOffset = drag.current;
                if (!dragOffset || !canvasRef.current) return;
                const rect = canvasRef.current.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                const nextX = Math.max(0, Math.min(100, ((event.clientX - rect.left - dragOffset.x) / rect.width) * 100));
                const nextY = Math.max(0, Math.min(100, ((event.clientY - rect.top - dragOffset.y) / rect.height) * 100));
                setPlacement((old) => ({
                  ...old,
                  x: nextX,
                  y: nextY,
                }));
              }}
              onPointerUp={(event) => {
                drag.current = null;
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  try {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  } catch {
                    // ignore
                  }
                }
              }}
              onPointerCancel={(event) => {
                drag.current = null;
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  try {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  } catch {
                    // ignore
                  }
                }
              }}
              onLostPointerCapture={() => { drag.current = null; }}
              onKeyDown={(event) => {
                if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
                event.preventDefault();
                setPlacement((old) => ({ ...old,
                  x: Math.max(0, Math.min(100, old.x + (event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0))),
                  y: Math.max(0, Math.min(100, old.y + (event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0))) }));
              }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={artwork.url} alt="Your artwork with background removed" draggable={false} className="block h-full w-full pointer-events-none" />
            </div>
          )}
          <span className="absolute top-3 left-3 pointer-events-none border border-white/40 bg-black px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">Preview // プレビュー</span>
          {!artwork && <p className="absolute bottom-4 inset-x-4 bg-black/80 p-3 text-center text-xs text-stone-200">Upload artwork for the {view} of your jacket.</p>}
        </div>
        <p className="text-[11px] text-stone-500">Illustrative placement preview. Final embroidery details are confirmed with the atelier.</p>
      </div>
      <div className="border-[3px] border-black bg-white p-6 sm:p-8 space-y-6 shadow-sm">
        <header className="border-b-2 border-black pb-3">
          <p className="text-[#dc2626] text-[10px] font-bold tracking-widest">◆ PANEL 05 // BESPOKE ATELIER</p>
          <h2 className="font-sans font-black text-xl uppercase tracking-tight text-black mt-1">Your art. Your jacket.</h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">Upload your logo. We’ll remove the background and place it on your jacket, keeping the original artwork colors. One artwork per side; uploading again replaces that side’s design.</p>
        </header>
        <div>
          <label htmlFor="bespoke-upload" className="block text-xs font-bold uppercase mb-2">1. {artwork ? 'Replace' : 'Upload'} {view} artwork</label>
          <input id="bespoke-upload" type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" aria-describedby="upload-help"
            className="block w-full min-w-0 border-2 border-dashed border-black bg-stone-50 p-3 text-xs file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:font-bold file:text-white file:cursor-pointer"
            onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void upload(file); }} />
          <p id="upload-help" className="text-[11px] text-stone-600 mt-2">PNG or JPG · Up to 10 MB. Export SVG / AI artwork as PNG first.</p>
          {busy && <p role="status" className="mt-3 flex items-center gap-2 text-xs"><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-stone-600 border-t-red-500" />Removing background… this can take up to a minute.</p>}
          {error && <p role="alert" className="mt-3 border-l-2 border-red-500 bg-red-50 p-3 text-xs text-red-700">{error}</p>}
          <p role="status" className="mt-2 text-xs text-stone-600">{status}</p>
          {artwork && <p className="mt-2 text-xs text-stone-600 break-all">Current {view} artwork: {artwork.name}</p>}
          {artwork && <button type="button" disabled={busy} className={buttonClass + ' mt-2'} onClick={() => { setArtwork(null); setPlacement(initialPlacement); setStatus(''); }}>Remove {view} artwork</button>}
          <div className="mt-3 flex gap-4 text-[10px] font-bold uppercase" aria-label="Artwork slots">
            <span>Front: {artworks.front ? '1 / 1' : '0 / 1'}</span>
            <span>Back: {artworks.back ? '1 / 1' : '0 / 1'}</span>
          </div>
        </div>
        <fieldset><legend className="text-xs font-bold uppercase mb-2">2. Jacket color</legend>
          <JacketColorPicker value={jacketId} onChange={setJacketId} />
        </fieldset>
        <fieldset disabled={!artwork} className="space-y-4 disabled:opacity-40"><legend className="text-xs font-bold uppercase mb-3">3. Adjust {view} artwork</legend>
          {([
            ['size', 'Logo size', 8, 65, '%'], ['rotation', 'Rotation', -180, 180, '°'],
            ['x', 'Horizontal position', 0, 100, '%'], ['y', 'Vertical position', 0, 100, '%'],
          ] as const).map(([key, label, min, max, unit]) => <label key={key} className="block text-xs">
            <span className="flex justify-between"><span>{label}</span><span>{Math.round(placement[key])}{unit}</span></span>
            <input type="range" min={min} max={max} value={placement[key]} aria-label={label} className="mt-2 w-full accent-red-500"
              onChange={(event) => setPlacement((old) => ({ ...old, [key]: Number(event.target.value) }))} />
          </label>)}
          <p className="text-[11px] text-stone-600">Drag the artwork on the jacket, or use the position controls.</p>
          <button type="button" className={buttonClass} onClick={() => setPlacement(initialPlacement)}>Reset placement</button>
        </fieldset>
        <div className="space-y-2 border-t border-stone-200 pt-4">
          <WhatsAppButton
            href={`/checkout?source=studio&type=bespoke&jacket=${encodeURIComponent(jacketId)}`}
            disabled={busy || savingCheckout || (!artworks.front && !artworks.back)}
            onClick={async (event) => {
              event.preventDefault();
              if (savingCheckout || busy || (!artworks.front && !artworks.back)) return;
              setSavingCheckout(true);
              try {
                await saveBespokeCheckout({ jacketId, artworks, placements });
                router.push('/checkout?source=studio&type=bespoke&jacket=' + encodeURIComponent(jacketId));
              } catch {
                setError('Could not save your artwork for checkout. Please allow browser storage and try again.');
                setSavingCheckout(false);
              }
            }}
            label="ORDER VIA WHATSAPP"
            className="w-full"
          />
          <p className="text-[11px] text-stone-600">Complete your delivery details on the checkout page, then confirm on WhatsApp.</p>
        </div>
      </div>
    </section>
  );
}
