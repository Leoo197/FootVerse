import React, { useState, useEffect } from "react";

export interface Slide {
  id: string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  buttonText: string;
  onAction: () => void;
}

export const PageCarousel: React.FC<{ slides: Slide[] }> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pt-6">
      <div className="relative h-[450px] md:h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl bg-white dark:bg-[#0A0A0A]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            {/* Soft gradient overlay so text is readable, but NO box behind the text */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 dark:from-[#0A0A0A]/90 via-white/30 dark:via-[#0A0A0A]/40 to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="relative z-20 h-full flex flex-col justify-end px-8 pb-16 md:px-16 md:pb-20">
              <div className="max-w-3xl animate-fade-in-up">
                <span className="inline-block bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-black px-4 py-1.5 font-label-mono text-xs font-extrabold tracking-wider rounded-lg mb-4 shadow-md uppercase">
                  {slide.tag}
                </span>
                
                {/* Floating text with drop shadow instead of a glass card */}
                <h2 className="font-display-lg text-5xl md:text-7xl mb-4 leading-none text-slate-900 dark:text-white drop-shadow-xl">
                  {slide.title}
                </h2>
                <p className="font-medium text-lg text-slate-800 dark:text-slate-200 mb-8 max-w-xl drop-shadow-lg">
                  {slide.subtitle}
                </p>
                
                <button
                  onClick={slide.onAction}
                  className="bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-[#0A0A0A] px-8 py-3.5 font-bold text-lg flex items-center gap-2 rounded-2xl shadow-xl transition-transform hover:-translate-y-1"
                >
                  {slide.buttonText} <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Minimal carousel dots — no fading green progress bar */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`carousel-dot ${idx === current ? "carousel-dot-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};