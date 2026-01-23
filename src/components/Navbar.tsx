// "use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAV_ITEMS } from "@/content/nav";
import { LogoBlack, LogoIcon, LogoText } from "./ui/logo-text-copyright";
import { useLenis } from "@/providers/lenis-provider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const lenis = useLenis();

  const lenisRef = useRef<any>(null);
  lenisRef.current = lenis;

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isScrolledRef = useRef(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // --- 2. MAIN ANIMATION TIMELINE ---
  useGSAP(
    () => {
      if (!menuRef.current || !overlayRef.current || !contentRef.current)
        return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };

          // Set initial states
          gsap.set(contentRef.current, { autoAlpha: 0 });
          gsap.set(overlayRef.current, { autoAlpha: 0 });
          gsap.set(".nav-link-item", { y: 20, opacity: 0 });
          gsap.set([".nav-media-card", ".nav-footer"], { y: 20, opacity: 0 });

          // Init Timeline
          tl.current = gsap
            .timeline({
              paused: true,
              onReverseComplete: () => {
                gsap.set(menuRef.current, {
                  height: isScrolledRef.current ? 52 : 60,
                });

                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
                if (lenisRef.current) lenisRef.current.start();
              },
            })
            .to(menuRef.current, {
              width: isMobile ? "100%" : "clamp(700px, 75vw, 1200px)",
              height: isMobile ? "100dvh" : "min(72vh, 600px)",
              borderRadius: isMobile ? "0px" : "16px",
              // --- SPRING CONFIGURATION ---
              // Duration needs to be longer for springs to 'settle'
              duration: 1.2,
              // elastic.out(amplitude, period)
              // 1 = full overshoot, 0.85 = somewhat snappy period
              ease: "elastic.out(1, 1.2)",
            })
            .to(
              overlayRef.current,
              {
                autoAlpha: 1,
                duration: 0.4,
                // Keep overlay simple/linear so it doesn't flicker
                ease: "power2.out",
              },
              "<", // Start with menu expansion
            )
            .to(
              contentRef.current,
              {
                autoAlpha: 1,
                duration: 0.3,
              },
              "-=0.6", // Show content earlier during the spring settling
            )
            .to(
              ".nav-link-item",
              {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                duration: 0.4,
                ease: "power2.out",
              },
              "-=0.4",
            )
            .to(
              [".nav-media-card", ".nav-footer"],
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.out",
              },
              "<",
            );
        },
      );

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  // --- 3. TOGGLE LOGIC ---
  const toggleMenu = () => {
    if (!tl.current) return;

    if (!isOpen) {
      setIsOpen(true);
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();

      // Speed up the spring slightly on open if it feels too sluggish
      tl.current.timeScale(1).play();
    } else {
      setIsOpen(false);
      // REVERSE TIP:
      // Springs look weird in reverse (they anticipate/pull back).
      // Increasing timeScale on reverse makes the closing snappy
      // instead of "slurping" back slowly.
      tl.current.timeScale(1.5).reverse();
    }
  };

  // ... (Remainder of your component remains the same)
  // --- 4. OUTSIDE CLICK / ESC ---
  useGSAP(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleMenu();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        toggleMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 right-0 z-50 flex justify-center p-0 md:p-6 pointer-events-none"
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm opacity-0 pointer-events-auto"
        aria-hidden="true"
        onClick={toggleMenu}
      />

      <div
        ref={menuRef}
        className="pointer-events-auto relative overflow-hidden bg-white/80 backdrop-blur-2xl border border-black/10 shadow-sm transition-none ease-out origin-top md:rounded-xl w-full md:w-[720px] h-[60px]"
      >
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-1 h-[60px] z-20">
          <a
            href="/"
            aria-label="Home"
            className="flex items-center justify-center p-2 w-[60px] h-[60px] group"
          >
            <LogoIcon />
          </a>

          <div
            className={`transition-opacity duration-300 ${isOpen ? "opacity-0 md:opacity-100" : "opacity-100"}`}
          >
            <LogoBlack />
          </div>

          <button
            onClick={toggleMenu}
            className="w-[60px] h-[60px] flex items-center justify-center group cursor-pointer"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span
                className={`absolute h-[2px] bg-black transition-all duration-300 ease-out ${isOpen ? "w-5 rotate-45 top-1/2 -translate-y-1/2" : "w-5 -translate-y-1"}`}
              />
              <span
                className={`absolute h-[2px] bg-black transition-all duration-300 ease-out ${isOpen ? "w-5 -rotate-45 top-1/2 -translate-y-1/2" : "w-5 translate-y-1"}`}
              />
              <div className="absolute inset-[-10px] rounded-lg bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
            </div>
          </button>
        </div>

        <div
          id="sunday-nav-content"
          ref={contentRef}
          className="absolute inset-0 pt-[80px] px-6 pb-6 flex flex-col justify-between opacity-0 invisible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={toggleMenu}
                  className="nav-link-item block text-3xl md:text-4xl font-medium text-black/90 hover:text-black hover:translate-x-2 transition-all duration-200 py-1"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex flex-col nav-media-card h-full max-h-[400px]">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-black group cursor-pointer">
                <video
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-60"
                  autoPlay
                  muted
                  loop
                  playsInline
                  src="https://stream.mux.com/2b02N5Y501hFejR2Yas02RZAb8sMOLsWqzE68RX7T8hp3s.m3u8"
                />
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-white transition-colors duration-200 group-hover:bg-white group-hover:text-black">
                  <div className="w-4 h-4 rounded-full bg-current flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-transparent fill-current stroke-none"
                      viewBox="0 0 24 24"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Our story</span>
                </div>
              </div>
            </div>
          </div>

          <div className="nav-footer flex items-end justify-between border-t border-black/10 pt-6 mt-6">
            <div className="hidden md:block text-sm text-neutral-500">
              The helpful robotics company
            </div>
            <div className="text-sm text-neutral-500">Launching 2026</div>
            <a
              href="/beta"
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors"
            >
              Beta Application
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
