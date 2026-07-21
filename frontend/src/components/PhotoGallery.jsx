import React from "react";
import { clubImage } from "../assets";


const images = import.meta.glob('./clubImages/*.{png,jpg,jpeg,svg,webp}', { eager: true });


function Sprockets() {
  return (
    <div
      className="flex h-[220px] w-3.5 shrink-0 flex-col justify-between bg-black px-0 py-1.5 sm:h-[176px]"
      aria-hidden="true"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="mx-auto h-1.5 w-1.5 rounded-sm bg-[#121110]" />
      ))}
    </div>
  );
}

function Reel({ photos, direction, speed, label }) {
  // Photos are duplicated so the strip can loop seamlessly.
  const strip = [...photos, ...photos];
  const animationClass =
    direction === "right" ? "animate-pg-scroll-right" : "animate-pg-scroll-left";

  return (
    <div className="group relative my-6 flex items-stretch">
      <Sprockets />
      <div
        className={`flex gap-3.5 bg-black px-3.5 py-2.5 ${animationClass} [animation-play-state:running] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]`}
        style={{ "--pg-duration": `${speed}s` }}
      >
        {Object.values(images).map((mod, i) => {
          const src = mod.default; 
        
          <figure
            key={`${label}-${i}`}
            className="group/frame relative h-[220px] w-[176px] shrink-0 overflow-hidden border border-[#33302b] bg-[#1a1816] sm:h-[176px] sm:w-[140px]"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              draggable="false"
              className="h-full w-full scale-105 object-cover grayscale brightness-90 contrast-105 transition duration-500 ease-out group-hover/frame:scale-110 group-hover/frame:grayscale-0 group-hover/frame:brightness-100"
            />
            
          </figure>
        })};
      </div>
      <Sprockets />
    </div>
  );
}

export default function PhotoGallery() {
  return (
    <section className="overflow-hidden bg-[#1A1A1A] py-20 text-[#f4efe4]">
      <style>{`
        @keyframes pg-scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pg-scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .animate-pg-scroll-left { animation: pg-scroll-left var(--pg-duration, 42s) linear infinite; }
        .animate-pg-scroll-right { animation: pg-scroll-right var(--pg-duration, 50s) linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-pg-scroll-left, .animate-pg-scroll-right {
            animation: none;
            overflow-x: auto;
          }
        }
      `}</style>

      <header className="mx-auto mb-12 max-w-xl px-8 text-center">
        <span className="font-display text-4xl md:text-5xl font-bold text-white text-center mb-10">
          Gallery
        </span>
      
      </header>

      <Reel photos={images} direction="left" speed={42} label="a" />
      <Reel photos={images} direction="right" speed={50} label="b" />

      
    </section>
  );
}