"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Link from "next/link";

type FrameType = "banner" | "portrait";

interface ImageDimensions {
  renderedWidth: number;
  renderedHeight: number;
  naturalWidth: number;
  naturalHeight: number;
}

export default function AssetToolkit() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [frameType, setFrameType] = useState<FrameType>("banner");
  
  // Frame position (relative to the image)
  const [framePos, setFramePos] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [frameScale, setFrameScale] = useState<number>(0.8);
  const [imageDims, setImageDims] = useState<ImageDimensions | null>(null);
  
  // Drag state tracking for moving the frame
  const [isDraggingFrame, setIsDraggingFrame] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastFramePos = useRef({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Frame base dimensions
  const baseWidth = frameType === "banner" ? 380 : 150;
  const baseHeight = frameType === "banner" ? 74 : 150;

  // Actual frame size on screen based on slider scale
  const frameWidth = baseWidth * frameScale;
  const frameHeight = baseHeight * frameScale;

  // Reset positioning when frame type or image changes
  const handleReset = () => {
    setFrameScale(0.8);
    setFramePos({ x: 20, y: 20 });
  };

  useEffect(() => {
    handleReset();
  }, [frameType, imageSrc]);

  // When image finishes loading in DOM, measure its rendered size
  const handleImageLoad = () => {
    if (imageElementRef.current) {
      const img = imageElementRef.current;
      setImageDims({
        renderedWidth: img.clientWidth,
        renderedHeight: img.clientHeight,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
      // Center the frame on the image
      const startX = Math.max(0, (img.clientWidth - baseWidth * 0.8) / 2);
      const startY = Math.max(0, (img.clientHeight - baseHeight * 0.8) / 2);
      setFramePos({ x: startX, y: startY });
    }
  };

  // Recalculate dimensions on window resize to keep offsets correct
  useEffect(() => {
    const handleResize = () => {
      if (imageElementRef.current && imageDims) {
        const img = imageElementRef.current;
        setImageDims(prev => prev ? {
          ...prev,
          renderedWidth: img.clientWidth,
          renderedHeight: img.clientHeight,
        } : null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageDims]);

  // Handle image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setImageDims(null); // Reset dims to trigger reload measurement
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop image file handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDraggingFile(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setImageDims(null); // Reset dims to trigger reload measurement
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Dragging the frame overlay
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc || !imageDims) return;
    e.preventDefault();
    setIsDraggingFrame(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastFramePos.current = { ...framePos };
  };

  useEffect(() => {
    if (!isDraggingFrame || !imageDims) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      
      // Constrain frame within the image boundaries
      const targetX = Math.max(0, Math.min(imageDims.renderedWidth - frameWidth, lastFramePos.current.x + dx));
      const targetY = Math.max(0, Math.min(imageDims.renderedHeight - frameHeight, lastFramePos.current.y + dy));
      
      setFramePos({ x: targetX, y: targetY });
    };

    const handleWindowMouseUp = () => {
      setIsDraggingFrame(false);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDraggingFrame, imageDims, frameWidth, frameHeight]);

  // Crop & Download handler
  const handleCropAndDownload = () => {
    if (!imageSrc || !imageElementRef.current || !imageDims) return;

    const img = imageElementRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Output dimensions
    const targetW = frameType === "banner" ? 380 : 200;
    const targetH = frameType === "banner" ? 74 : 200;

    canvas.width = targetW;
    canvas.height = targetH;

    // Clear canvas
    ctx.clearRect(0, 0, targetW, targetH);

    // If circular node, clip it
    if (frameType === "portrait") {
      ctx.beginPath();
      ctx.arc(targetW / 2, targetH / 2, targetW / 2 - 1, 0, Math.PI * 2);
      ctx.clip();
    }

    // Map screen crop coordinates back to original natural image coordinates
    const srcX = (framePos.x / imageDims.renderedWidth) * imageDims.naturalWidth;
    const srcY = (framePos.y / imageDims.renderedHeight) * imageDims.naturalHeight;
    const srcW = (frameWidth / imageDims.renderedWidth) * imageDims.naturalWidth;
    const srcH = (frameHeight / imageDims.renderedHeight) * imageDims.naturalHeight;

    // Draw the sub-rectangle of the image
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);

    // Download PNG
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `cropped_champ_${frameType}_${Date.now()}.png`;
    a.click();
  };

  // Generate cropped preview data url dynamically for mock previews
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageSrc || !imageElementRef.current || !imageDims) {
      setPreviewUrl(null);
      return;
    }

    // Debounce preview rendering slightly for performance during drag/resize
    const timer = setTimeout(() => {
      const img = imageElementRef.current;
      if (!img) return;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const targetW = frameType === "banner" ? 380 : 150;
      const targetH = frameType === "banner" ? 74 : 150;
      canvas.width = targetW;
      canvas.height = targetH;

      ctx.clearRect(0, 0, targetW, targetH);

      const srcX = (framePos.x / imageDims.renderedWidth) * imageDims.naturalWidth;
      const srcY = (framePos.y / imageDims.renderedHeight) * imageDims.naturalHeight;
      const srcW = (frameWidth / imageDims.renderedWidth) * imageDims.naturalWidth;
      const srcH = (frameHeight / imageDims.renderedHeight) * imageDims.naturalHeight;

      try {
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);
        setPreviewUrl(canvas.toDataURL());
      } catch (e) {
        // Image might not be fully ready/drawn
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [framePos, frameScale, frameType, imageSrc, imageDims]);

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col font-sans select-none">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-slate-400 hover:text-[#e5c17d] transition-colors text-sm font-medium">
              &larr; Back to Database
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-semibold text-[#e5c17d] tracking-wide">Asset Toolkit</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
            Asset Pre-compiler
          </span>
        </div>

        {/* Toolkit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center Panel: Editor Viewport (Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="bg-[#0a0f1d]/60 border border-slate-900 px-5 py-4 rounded-2xl">
              <h2 className="text-md font-bold text-[#e5c17d]">Crop Viewport</h2>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Drag the golden frame box around to select the crop area. Use the Frame Size slider on the right to resize it.
              </p>
            </div>

            {/* Editor Workspace Container */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative bg-[#05070c] border-2 rounded-2xl min-h-[420px] flex items-center justify-center overflow-hidden p-6 shadow-inner transition-all duration-300 ${
                isDraggingFile
                  ? "border-[#c29d53] bg-[#c29d53]/5 scale-[1.01]"
                  : "border-slate-900"
              }`}
            >
              {/* Grid guide mesh */}
              <div className="absolute inset-0 bg-[radial-gradient(#c29d53_0.03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-15" />

              {isDraggingFile && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm border-2 border-dashed border-[#c29d53] rounded-2xl flex flex-col items-center justify-center gap-3 z-50 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-[#c29d53]/15 border border-[#c29d53]/45 flex items-center justify-center text-[#e5c17d] shadow-lg animate-pulse">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-[#e5c17d]">Drop image file to import</p>
                  <p className="text-xs text-slate-400 font-medium">Supports PNG, JPG, or WebP</p>
                </div>
              )}

              {imageSrc ? (
                /* Crop Wrapper holding the full image */
                <div
                  ref={imageContainerRef}
                  className="relative max-w-full max-h-[450px] border border-slate-800 rounded shadow-md overflow-hidden bg-slate-950/40 select-none"
                >
                  {/* The full image displayed on screen */}
                  <img
                    ref={imageElementRef}
                    src={imageSrc}
                    onLoad={handleImageLoad}
                    alt="Source"
                    className="max-w-full max-h-[450px] object-contain block pointer-events-none select-none"
                  />

                  {/* Movable Crop Frame Overlay */}
                  {imageDims && (
                    <div
                      onMouseDown={handleMouseDown}
                      style={{
                        left: `${framePos.x}px`,
                        top: `${framePos.y}px`,
                        width: `${frameWidth}px`,
                        height: `${frameHeight}px`,
                        // Box-shadow trick: creates a dark backdrop overlay outside the frame boundaries
                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65)",
                      }}
                      className={`absolute cursor-move select-none border-2 border-[#c29d53] ${
                        frameType === "banner" ? "rounded-xl" : "rounded-full"
                      } shadow-[0_0_15px_rgba(194,157,83,0.3)] flex items-center justify-center transition-[border-color,box-shadow,background-color] duration-75`}
                    >
                      {/* Corner indicators for visual detail */}
                      <span className="absolute top-1 left-1 text-[8px] font-mono text-[#e5c17d]/65 font-bold tracking-tighter pointer-events-none uppercase">
                        {frameType}
                      </span>

                      {/* Face alignment guidelines for banner crop */}
                      {frameType === "banner" && (
                        <>
                          <div className="absolute top-0 bottom-0 left-[50%] border-l-2 border-dashed border-[#c29d53]/50 pointer-events-none" />
                          <div className="absolute top-0 bottom-0 left-[75%] border-l-2 border-dashed border-[#c29d53]/50 pointer-events-none" />
                          <span className="absolute -bottom-5 left-[62.5%] -translate-x-1/2 text-[9px] font-mono text-[#e5c17d]/75 font-bold tracking-wide pointer-events-none uppercase whitespace-nowrap bg-black/80 px-1 rounded border border-slate-900">
                            Face Zone
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Empty Upload prompt state */
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 hover:border-[#c29d53]/55 rounded-2xl transition-all cursor-pointer bg-slate-950/20 group max-w-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#e5c17d] group-hover:border-[#c29d53]/30 transition-all shadow-md mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-slate-350 group-hover:text-slate-100 transition-colors">Import Champion Artwork</h3>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Upload any splash art or character portrait. Supports PNG, JPG, or WebP.
                  </p>
                </button>
              )}
            </div>

            {/* Live Mock UI Previews */}
            {imageSrc && (
              <div className="bg-[#0b0f1a]/40 border border-slate-900 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-900 pb-2">
                  Live UI Component Preview
                </h3>

                <div className="flex flex-col gap-5 items-center justify-center p-6 bg-slate-950/30 rounded-xl border border-slate-900/60">
                  {frameType === "banner" ? (
                    /* Mock Champion List Banner Preview */
                    <div className="w-full max-w-[380px] h-[74px] rounded-xl border border-[#c29d53] flex items-center p-3.5 relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-950 shadow-lg shadow-black/40">
                      {/* Crop Image container representing list view */}
                      {previewUrl && (
                        <div
                          className="absolute top-0 bottom-0 right-0 w-[380px] pointer-events-none opacity-80 mix-blend-lighten z-0 bg-cover"
                          style={{
                            backgroundImage: `url(${previewUrl})`,
                            backgroundPosition: "right center",
                            maskImage: "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                          }}
                        />
                      )}
                      
                      {/* Text contents */}
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-indigo-900 flex items-center justify-center border border-[#c29d53]/45 shadow-inner">
                          <span className="text-md font-bold text-slate-100 font-mono">15</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-md text-[#e5c17d]">Aatrox</h4>
                          <div className="flex items-center gap-0.5 mt-0.5 text-slate-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Mock Circular Node Icon Preview */
                    <div className="w-[80px] h-[80px] rounded-xl border border-slate-800 bg-[#090d16] flex items-center justify-center shadow-lg relative p-0.5">
                      <div className="w-14 h-14 rounded-full border border-[#c29d53] overflow-hidden relative shadow-[0_0_12px_rgba(194,157,83,0.25)] bg-[#04060a]">
                        {previewUrl && (
                          <div
                            className="absolute inset-0 bg-cover scale-110"
                            style={{
                              backgroundImage: `url(${previewUrl})`,
                              backgroundPosition: "center",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Tool Controls (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Control Panel */}
            <div className="bg-[#0b0f1a]/95 border border-slate-900 p-5 rounded-2xl flex flex-col gap-5">
              <h3 className="text-sm font-bold text-[#e5c17d] uppercase tracking-wider border-b border-slate-900 pb-3">
                Transformation Controls
              </h3>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Custom trigger buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-[#c29d53]/15 hover:bg-[#c29d53]/25 text-[#e5c17d] border border-[#c29d53]/45 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload New Image
                </button>
                {imageSrc && (
                  <button
                    onClick={handleReset}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Preset frame options */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Select Target Frame</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFrameType("banner")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                      frameType === "banner"
                        ? "bg-[#c29d53]/10 border-[#c29d53] text-[#e5c17d] shadow-[0_0_12px_rgba(194,157,83,0.15)]"
                        : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Champion Banner
                  </button>
                  <button
                    onClick={() => setFrameType("portrait")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                      frameType === "portrait"
                        ? "bg-[#c29d53]/10 border-[#c29d53] text-[#e5c17d] shadow-[0_0_12px_rgba(194,157,83,0.15)]"
                        : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Champion Portrait
                  </button>
                </div>
              </div>

              {/* Sliders (only if image is loaded) */}
              {imageSrc && imageDims && (
                <div className="flex flex-col gap-4 border-t border-slate-900/60 pt-4 mt-1">
                  {/* Frame Size Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>Frame Size / Zoom Area</span>
                      <span className="font-bold">{Math.round(frameScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.15"
                      max={Math.min(
                        1.5,
                        imageDims.renderedWidth / baseWidth,
                        imageDims.renderedHeight / baseHeight
                      )}
                      step="0.01"
                      value={frameScale}
                      onChange={(e) => {
                        const newScale = parseFloat(e.target.value);
                        setFrameScale(newScale);
                        // Reposition frame if it overflows after scaling
                        const newW = baseWidth * newScale;
                        const newH = baseHeight * newScale;
                        setFramePos(prev => ({
                          x: Math.min(imageDims.renderedWidth - newW, prev.x),
                          y: Math.min(imageDims.renderedHeight - newH, prev.y),
                        }));
                      }}
                      className="w-full h-1.5 bg-[#050810] border border-slate-800 rounded-lg appearance-none cursor-pointer accent-[#c29d53]"
                    />
                  </div>

                  {/* Positional readout */}
                  <div className="flex flex-col gap-1 text-[10px] text-slate-500 font-mono border-t border-slate-900/40 pt-3">
                    <div className="flex justify-between">
                      <span>Frame X: {Math.round(framePos.x)}px</span>
                      <span>Frame Y: {Math.round(framePos.y)}px</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span>Image: {imageDims.naturalWidth}x{imageDims.naturalHeight}</span>
                      <span>Crop Area: {Math.round((frameWidth / imageDims.renderedWidth) * imageDims.naturalWidth)}x{Math.round((frameHeight / imageDims.renderedHeight) * imageDims.naturalHeight)}</span>
                    </div>
                  </div>

                  {/* Export & Crop Trigger Button */}
                  <button
                    onClick={handleCropAndDownload}
                    className="w-full bg-[#c29d53] hover:bg-[#b08d45] text-slate-950 font-black text-xs py-3.5 rounded-lg transition-all cursor-pointer shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 mt-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75h7.5a2.25 2.25 0 012.25 2.25v12.25A2.25 2.25 0 0115.75 20.25h-7.5A2.25 2.25 0 016 18V6a2.25 2.25 0 012.25-2.25z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4.5m0 0l-1.5-1.5M12 13.5l1.5-1.5" />
                    </svg>
                    Compile, Frame & Crop
                  </button>
                </div>
              )}
            </div>

            {/* Instruction Card */}
            <div className="bg-[#0b0f1a]/95 border border-slate-900 p-5 rounded-2xl flex flex-col gap-3.5 text-xs text-slate-400">
              <h4 className="text-xs font-bold text-[#e5c17d] uppercase tracking-wider font-mono">Toolkit Guide</h4>
              <ul className="list-disc pl-4 space-y-1.5 leading-normal">
                <li>Select a target frame profile.</li>
                <li>Drag the golden crop box overlay to position your crop area.</li>
                <li>Use the <strong>Frame Size</strong> slider to expand or shrink the crop window.</li>
                <li>Watch the <strong>Live UI Component Preview</strong> update in real-time.</li>
                <li>Click <strong>Compile, Frame & Crop</strong> to export the framed asset as a PNG.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
