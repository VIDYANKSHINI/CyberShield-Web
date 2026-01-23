// "use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAV_ITEMS } from "@/content/nav";
import { LogoBlack, LogoIcon, LogoText } from "./ui/logo-text-copyright";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // We use a ref to track scroll state without triggering re-renders
  const isScrolledRef = useRef(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // --- 1. HANDLE SCROLL (Pure GSAP, no React Renders) ---
  useGSAP(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;

      // Only animate if the scroll state changed AND menu is closed
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;

        if (!isOpen && menuRef.current) {
          gsap.to(menuRef.current, {
            height: scrolled ? 52 : 60,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]); // Re-bind if open state changes to ensure correct logic

  // --- 2. MAIN ANIMATION TIMELINE ---
  useGSAP(
    () => {
      if (!menuRef.current || !overlayRef.current || !contentRef.current)
        return;

      // Create a context for responsive animations
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };

          // Set initial states explicitly to avoid FOUC or conflicts
          gsap.set(contentRef.current, { autoAlpha: 0 });
          gsap.set(overlayRef.current, { autoAlpha: 0 });
          gsap.set(".nav-link-item", { y: 20, opacity: 0 });
          gsap.set([".nav-media-card", ".nav-footer"], { y: 20, opacity: 0 });

          // Init Timeline
          tl.current = gsap
            .timeline({
              paused: true,
              onReverseComplete: () => {
                // Ensure we land on the correct height (scrolled vs not) when fully closed
                gsap.set(menuRef.current, {
                  height: isScrolledRef.current ? 52 : 60,
                  clearProps: "width,borderRadius", // Clear width so CSS media queries take over if needed
                });
                document.body.style.overflow = ""; // Unlock scroll
              },
            })
            .to(menuRef.current, {
              width: isMobile ? "100%" : "clamp(700px, 75vw, 1200px)",
              height: isMobile ? "100dvh" : "min(72vh, 600px)",
              borderRadius: isMobile ? "0px" : "16px",
              duration: 0.55,
              ease: "power3.inOut",
            })
            .to(
              overlayRef.current,
              {
                autoAlpha: 1,
                duration: 0.4,
                ease: "power2.out",
              },
              "<",
            )
            .to(
              contentRef.current,
              {
                autoAlpha: 1,
                duration: 0.3,
              },
              "-=0.2",
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
              "-=0.2",
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

      return () => mm.revert(); // Cleanup matchMedia
    },
    { scope: containerRef },
  );

  // --- 3. TOGGLE LOGIC ---
  const toggleMenu = () => {
    if (!tl.current) return;

    if (!isOpen) {
      setIsOpen(true);
      document.body.style.overflow = "hidden"; // Lock scroll
      tl.current.play();
    } else {
      setIsOpen(false);
      // Don't unlock scroll yet; wait for onReverseComplete in timeline
      tl.current.reverse();
    }
  };

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
  }, [isOpen]); // Only attach when open

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 right-0 z-50 flex justify-center p-0 md:p-6 pointer-events-none"
    >
      {/* OVERLAY */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm opacity-0 pointer-events-auto"
        aria-hidden="true"
        onClick={toggleMenu}
      />

      {/* MAIN NAVBAR CONTAINER */}
      {/* Note: No dynamic style={{}} props here! We use defaults and let GSAP handle changes. */}
      <div
        ref={menuRef}
        className="pointer-events-auto relative overflow-hidden bg-white/80 backdrop-blur-2xl border border-black/10 shadow-sm transition-none ease-out origin-top md:rounded-xl w-full md:w-[720px] h-[60px]"
      >
        {/* --- HEADER (Always Visible) --- */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-1 h-[60px] z-20">
          {/* LOGO ICON */}
          <a
            href="/"
            aria-label="Home"
            className="flex items-center justify-center p-2 w-[60px] h-[60px] group"
          >
            <LogoIcon />
          </a>

          {/* LOGO TEXT (Fades out on open) */}
          <div
            className={`transition-opacity duration-300 ${isOpen ? "opacity-0 md:opacity-100" : "opacity-100"}`}
          >
            <LogoBlack />
          </div>

          {/* MENU BUTTON */}
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

        {/* --- DROPDOWN CONTENT --- */}
        <div
          id="sunday-nav-content"
          ref={contentRef}
          className="absolute inset-0 pt-[80px] px-6 pb-6 flex flex-col justify-between opacity-0 invisible"
        >
          {/* GRID: Links & Video */}
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
                {/* Video Overlay Button */}
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

          {/* FOOTER */}
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
