'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface DynamicGutsProps {
  sequenceFolder: string;
  totalFrames: number;
  label?: string;
  caption?: string;
}

export default function DynamicGuts({
  sequenceFolder,
  totalFrames,
  label,
  caption,
}: DynamicGutsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const sequencerRef = useRef({ frame: 0 });

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Draw a frame index onto the canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const clampedIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1));
    const img = imagesRef.current[clampedIndex];

    if (ctx && img) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  }, [totalFrames]);

  // Preload sequence images
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameIndex = i.toString().padStart(totalFrames > 99 ? 3 : 2, '0');
      const src = `/images/${sequenceFolder}/guts_${frameIndex}.webp`;
      let handled = false;

      const onLoad = () => {
        if (handled || isCancelled) return;
        handled = true;
        loadedCount++;

        setLoadPercent(Math.round((loadedCount / totalFrames) * 100));

        if (loadedCount === totalFrames) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
        }
      };

      img.onload = onLoad;
      img.onerror = () => {
        if (isCancelled) return;
        console.error(`Failed to load: ${src}`);
        setErrorMsg(`Missing image: guts_${frameIndex}.webp`);
      };

      img.src = src;

      // Check if image is already cached
      if (img.complete && img.naturalWidth !== 0) {
        onLoad();
      }

      loadedImages.push(img);
    }

    return () => {
      isCancelled = true;
    };
  }, [sequenceFolder, totalFrames]);

  // Set canvas size and render first frame
  useGSAP(() => {
    if (!imagesLoaded || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const firstImg = imagesRef.current[0];
    if (!firstImg) return;

    canvas.width = firstImg.naturalWidth || firstImg.width || 3840;
    canvas.height = firstImg.naturalHeight || firstImg.height || 2160;

    drawFrame(0);
  }, { dependencies: [imagesLoaded], scope: containerRef });

  // Scrub animation based on horizontal position ratio (0 to 1)
  const scrubToRatio = useCallback((ratio: number, duration: number = 0.2) => {
    if (!imagesLoaded) return;
    const targetFrame = Math.round(Math.max(0, Math.min(1, ratio)) * (totalFrames - 1));

    gsap.to(sequencerRef.current, {
      frame: targetFrame,
      duration,
      ease: 'power1.out',
      overwrite: 'auto',
      onUpdate: () => {
        drawFrame(Math.round(sequencerRef.current.frame));
      },
    });
  }, [imagesLoaded, totalFrames, drawFrame]);

  // Mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    scrubToRatio((e.clientX - left) / width, 0.2);
  };

  const handleMouseLeave = () => {
    scrubToRatio(0, 0.6);
  };

  // Touch interaction (mobile support)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    scrubToRatio((e.touches[0].clientX - left) / width, 0.15);
  };

  const handleTouchEnd = () => {
    scrubToRatio(0, 0.6);
  };

  return (
    <div className="w-full">
      {/* Manga Panel Box */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black border-4 border-black shadow-md overflow-hidden cursor-ew-resize select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading overlay */}
        {!imagesLoaded && !errorMsg && (
          <div className="absolute inset-0 flex items-center justify-center bg-white text-black font-mono text-sm tracking-wider">
            Loading panel... {loadPercent}%
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="absolute inset-0 flex items-center justify-center bg-white text-red-600 font-mono text-xs p-4">
            {errorMsg}
          </div>
        )}

        {/* Canvas animation */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            imagesLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Panel label tag (top left) */}
        {label && (
          <div className="absolute top-2 left-2 bg-white text-black text-[11px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider border border-black pointer-events-none">
            {label}
          </div>
        )}
      </div>

      {/* Manga Panel Caption (simple bottom gutter) */}
      {caption && (
        <p className="mt-2 text-xs font-mono text-stone-600 tracking-wide">
          {caption}
        </p>
      )}
    </div>
  );
}