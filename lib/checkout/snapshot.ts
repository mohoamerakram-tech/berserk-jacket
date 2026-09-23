import { LOGOS, LOGO_COLORS, LOGO_SIZE_SCALE, TEXT_FONTS, Logo, StudioLayer } from '@/lib/studio';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load ' + src));
    img.src = src;
  });
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function drawLetterboxedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
): void {
  const aspect = img.naturalWidth / img.naturalHeight;
  let dw = width;
  let dh = width / aspect;
  if (dh > height) {
    dh = height;
    dw = height * aspect;
  }
  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

/**
 * Composites the garment base and placed embroidery layers onto a canvas for high-res PNG export.
 */
export async function renderCanvasSnapshot(
  jacketSrc: string,
  layers: StudioLayer[],
  width = 600,
  height = 750,
  logos: Logo[] = LOGOS
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Dark background
  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(0, 0, width, height);

  // Garment base photography
  try {
    const jacketImg = await loadImage(jacketSrc);
    drawLetterboxedImage(ctx, jacketImg, width, height);
  } catch {
    throw new Error('Jacket preview could not be loaded');
  }

  // Placed embroidery layers
  for (const layer of layers) {
    const x = (layer.xPercent / 100) * width;
    const y = (layer.yPercent / 100) * height;
    const colorSwatch = LOGO_COLORS.find((c) => c.id === layer.colorId) || LOGO_COLORS[0];
    const scale = LOGO_SIZE_SCALE[layer.size] ?? 22;
    const sizePx = (scale / 100) * width;

    if (layer.type === 'logo') {
      const logo = logos.find((l) => l.id === layer.logoId);
      if (logo?.path) {
        try {
          const logoImg = await loadImage(logo.path);
          const fit = Math.min(sizePx / logoImg.naturalWidth, sizePx / logoImg.naturalHeight);
          const lw = logoImg.naturalWidth * fit;
          const lh = logoImg.naturalHeight * fit;

          if (logo.canRecolor) {
            const off = document.createElement('canvas');
            off.width = sizePx;
            off.height = sizePx;
            const offCtx = off.getContext('2d');
            if (offCtx) {
              offCtx.drawImage(logoImg, (sizePx - lw) / 2, (sizePx - lh) / 2, lw, lh);
              offCtx.globalCompositeOperation = 'source-in';
              offCtx.fillStyle = colorSwatch.hex;
              offCtx.fillRect(0, 0, sizePx, sizePx);
              ctx.drawImage(off, x - sizePx / 2, y - sizePx / 2);
            }
          } else {
            ctx.drawImage(logoImg, x - lw / 2, y - lh / 2, lw, lh);
          }
        } catch {
          throw new Error('Artwork preview could not be loaded');
        }
      }
    } else if (layer.type === 'text') {
      const font = TEXT_FONTS.find((f) => f.id === layer.fontId);
      const fontSize = sizePx * 0.18;
      const computedStyle = getComputedStyle(document.body);
      const family = (font?.cssFamily || 'sans-serif').replace(
        /var\((--[^)]+)\)/g,
        (_, property: string) => computedStyle.getPropertyValue(property).trim() || 'sans-serif'
      );

      try {
        await document.fonts.load(`900 ${fontSize}px ${family}`);
      } catch {
        // font fallback
      }

      ctx.font = `900 ${fontSize}px ${family}`;
      ctx.letterSpacing = fontSize / 20 + 'px';
      ctx.fillStyle = colorSwatch.hex;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(layer.text.toUpperCase(), x, y);
      ctx.shadowColor = 'transparent';
    }
  }

  return canvas.toDataURL('image/png');
}

/**
 * Composites bespoke uploaded artwork onto a canvas for PNG snapshot generation.
 */
export async function renderBespokeSnapshot(
  jacketSrc: string,
  artworkUrl: string | undefined,
  placement: { x: number; y: number; size: number; rotation: number },
  width = 600,
  height = 750
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(0, 0, width, height);

  try {
    const jacketImg = await loadImage(jacketSrc);
    drawLetterboxedImage(ctx, jacketImg, width, height);
  } catch {
    throw new Error('Artwork preview could not be loaded');
  }

  if (artworkUrl) {
    try {
      const artImg = await loadImage(artworkUrl);
      const x = (placement.x / 100) * width;
      const y = (placement.y / 100) * height;
      const sizePx = (placement.size / 100) * width;
      const artAspect = artImg.naturalWidth / artImg.naturalHeight;
      const artHeight = sizePx / artAspect;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((placement.rotation * Math.PI) / 180);
      ctx.drawImage(artImg, -sizePx / 2, -artHeight / 2, sizePx, artHeight);
      ctx.restore();
    } catch {
      throw new Error('Artwork preview could not be loaded');
    }
  }

  return canvas.toDataURL('image/png');
}
