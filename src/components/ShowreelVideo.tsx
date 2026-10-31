"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import BoltMark from "./BoltMark";

/* Safari usa APIs con prefijo para pantalla completa. */
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
};
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => void };
type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m22 9-6 6M16 9l6 6" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
      aria-hidden="true"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M16 21h3a2 2 0 0 0 2-2v-3M8 21H5a2 2 0 0 1-2-2v-3" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
      aria-hidden="true"
    >
      <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

export default function ShowreelVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const onChange = () => {
      const d = document as FsDocument;
      setFullscreen(!!(d.fullscreenElement || d.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Reproduce solo cuando el video está en pantalla (y no hay "reducir movimiento").
  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!reducedMotion) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [reducedMotion]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
    if (!next) {
      if (video.volume === 0) {
        video.volume = 1;
        setVolume(1);
      }
      if (video.paused) video.play().catch(() => {});
    }
  }, []);

  const onVolume = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const video = videoRef.current;
    setVolume(value);
    if (!video) return;
    video.volume = value;
    const isMuted = value === 0;
    video.muted = isMuted;
    setMuted(isMuted);
    if (!isMuted && video.paused) video.play().catch(() => {});
  }, []);

  const toggleFullscreen = useCallback(() => {
    const d = document as FsDocument;
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      if (d.exitFullscreen) d.exitFullscreen().catch(() => {});
      else d.webkitExitFullscreen?.();
      return;
    }
    const frame = frameRef.current as FsElement | null;
    const video = videoRef.current as FsVideo | null;
    if (frame?.requestFullscreen) frame.requestFullscreen().catch(() => {});
    else if (frame?.webkitRequestFullscreen) frame.webkitRequestFullscreen();
    else if (video?.webkitEnterFullscreen) video.webkitEnterFullscreen();
  }, []);

  return (
    <div ref={wrapRef} className="relative mt-12 md:mt-16 group/reel">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -top-10 -bottom-10 -z-10"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 45%, color-mix(in oklab, var(--pr-accent) 28%, transparent) 0%, transparent 70%)",
          filter: "blur(48px)",
          opacity: 0.7,
        }}
      />
      <div
        ref={frameRef}
        className="relative w-full aspect-video overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] md:rounded-[2.25rem] ring-1 ring-black/10"
        style={{ background: "#0A0A0B", boxShadow: "0 40px 90px -30px rgba(10,10,11,0.55)" }}
      >
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          poster="/assets/showreel-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/assets/showreel.webm" type="video/webm" />
          <source src="/assets/showreel.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.62) 100%)",
          }}
        />

        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pausar video" : "Reproducir video"}
          className="absolute inset-0 z-10 flex items-center justify-center focus:outline-none"
        >
          <span
            className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full backdrop-blur-md border text-white transition-all duration-300 ${playing ? "opacity-0 scale-90 group-hover/reel:opacity-100 group-hover/reel:scale-100" : "opacity-100 scale-100"}`}
            style={{
              background: "color-mix(in oklab, var(--pr-accent) 80%, #000 0%)",
              borderColor: "rgba(255,255,255,0.25)",
            }}
          >
            <span className={`block ${playing ? "w-6 h-6 md:w-7 md:h-7" : "w-7 h-7 md:w-8 md:h-8"}`}>
              {playing ? <PauseIcon /> : <PlayIcon />}
            </span>
          </span>
        </button>

        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border"
          style={{ background: "rgba(255,255,255,0.10)", borderColor: "rgba(255,255,255,0.20)" }}
        >
          <span className="relative flex w-[12px] h-[21px]" style={{ color: "var(--pr-accent)" }}>
            <BoltMark className="absolute inset-0 w-full h-full opacity-75 animate-ping" />
            <BoltMark className="relative w-full h-full" />
          </span>
          <span className="font-mono text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.14em] text-white">
            Showreel · Power Rental
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="font-mono text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.14em] text-white/60 mb-1">
              En terreno
            </div>
            <div className="text-[15px] md:text-[20px] font-normal text-white tracking-[-0.01em] truncate">
              Energía y producción, en movimiento.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pausar video" : "Reproducir video"}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center backdrop-blur-md border text-white hover:bg-white/15 transition-colors duration-200"
              style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.18)" }}
            >
              <span className="block w-4 h-4 md:w-[18px] md:h-[18px]">
                {playing ? <PauseIcon /> : <PlayIcon />}
              </span>
            </button>

            <div
              className="group/vol flex items-center rounded-full backdrop-blur-md border text-white"
              style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.18)" }}
            >
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Activar sonido" : "Silenciar"}
                aria-pressed={!muted}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors duration-200 shrink-0"
              >
                <span className="block w-4 h-4 md:w-[18px] md:h-[18px]">
                  {muted ? <MutedIcon /> : <VolumeIcon />}
                </span>
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={onVolume}
                aria-label="Volumen"
                className="h-1 cursor-pointer w-0 opacity-0 group-hover/vol:w-16 group-hover/vol:opacity-100 group-hover/vol:mr-3 group-focus-within/vol:w-16 group-focus-within/vol:opacity-100 group-focus-within/vol:mr-3 transition-all duration-200"
                style={{ accentColor: "var(--pr-accent)" }}
              />
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center backdrop-blur-md border text-white hover:bg-white/15 transition-colors duration-200"
              style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.18)" }}
            >
              <span className="block w-4 h-4 md:w-[18px] md:h-[18px]">
                {fullscreen ? <CollapseIcon /> : <ExpandIcon />}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
