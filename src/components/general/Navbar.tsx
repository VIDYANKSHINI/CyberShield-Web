import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { NAV_ITEMS } from "@/content/nav";
import { LogoBlack, LogoIcon } from "@/components/ui/logo-text-copyright";
import { useLenis } from "@/providers/lenis-provider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
  const lenis = useLenis();
  const videoRef = useRef<HTMLVideoElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // --- ANIMATION SETUP (preserved) ---
  useGSAP(
    () => {
      if (!menuRef.current || !overlayRef.current || !contentRef.current)
        return;

      const menuEl = menuRef.current;
      const overlayEl = overlayRef.current;
      const contentEl = contentRef.current;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const openWidth = isMobile ? "100%" : "clamp(700px, 75vw, 1200px)";
      const openHeight = isMobile ? "min(85vh, 680px)" : "min(72vh, 600px)";
      const menuDuration = isMobile ? 0.6 : 1.2;
      const menuEase = isMobile ? "power2.out" : "elastic.out(1, 1.2)";
      const staggerTargets = ".nav-link-item, .nav-media-card, .nav-footer";

      gsap.set(contentEl, { autoAlpha: 0 });
      gsap.set(overlayEl, { autoAlpha: 0 });
      gsap.set(staggerTargets, {
        y: 20,
        opacity: 0,
        force3D: true,
        z: 0.01,
      });

      const timeline = gsap.timeline({
        paused: true,
        onStart: () => {
          menuEl.style.willChange = "width, height, transform";
          gsap.set(staggerTargets, { willChange: "transform, opacity" });
        },
        onReverseComplete: () => {
          menuEl.style.willChange = "auto";
          gsap.set(staggerTargets, { willChange: "auto" });
          document.body.style.overflow = "";
          if (lenis) lenis.start();
        },
      });

      timeline
        .to(menuEl, {
          width: openWidth,
          height: openHeight,
          duration: menuDuration,
          ease: menuEase,
        })
        .to(overlayEl, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, "<")
        .to(contentEl, { autoAlpha: 1, duration: 0.3 }, "-=0.6")
        .to(
          staggerTargets,
          {
            y: 0,
            duration: 0.25,
            ease: "power2.out",
            stagger: { each: 0.06, from: "start" },
          },
          "-=0.4",
        )
        .to(
          staggerTargets,
          {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
            stagger: { each: 0.06, from: "start" },
          },
          "-=0.35",
        );

      tl.current = timeline;
    },
    { scope: containerRef },
  );

  // --- TOGGLE LOGIC (with video) ---
  const toggleMenu = () => {
    if (!tl.current) return;
    isOpenRef.current = !isOpenRef.current;
    setIsOpen(isOpenRef.current);

    if (isOpenRef.current) {
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();

      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
        videoRef.current.playbackRate = 0.8;
      }

      tl.current.timeScale(1).play();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }

      tl.current.timeScale(1.5).reverse();
    }
  };

  // --- EVENT LISTENERS (preserved) ---
  useEffect(() => {
    if (!isOpenRef.current) return;
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6 pointer-events-none"
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm opacity-0 pointer-events-auto"
        aria-hidden="true"
        onClick={toggleMenu}
      />
      <div
        ref={menuRef}
        className="pointer-events-auto relative overflow-hidden bg-white/80 backdrop-blur-2xl border border-black/10 shadow-sm rounded-2xl w-full md:w-[720px] h-[60px]"
      >
        {/* Navbar Header */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-1 h-[60px] z-20">
          <a
            href="/"
            aria-label="Home"
            className="flex items-center justify-center p-2 w-[48px] h-[48px] md:w-[60px] md:h-[60px] group"
          >
            <LogoIcon />
          </a>
          <div
            className={`transition-all duration-300 origin-center scale-75 md:scale-100 ${isOpen ? "opacity-0 md:opacity-100" : "opacity-100"}`}
          >
            <LogoBlack />
          </div>
          <button
            onClick={toggleMenu}
            className="w-[48px] h-[48px] md:w-[60px] md:h-[60px] flex items-center justify-center group cursor-pointer"
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
            </div>
          </button>
        </div>

        {/* Content Container */}
        <div
          id="sunday-nav-content"
          ref={contentRef}
          className="absolute inset-0 pt-[80px] px-6 pb-6 flex flex-col justify-between opacity-0 invisible"
        >
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 h-full overflow-hidden">
            {/* Nav Links */}
            <nav className="flex flex-col gap-2 shrink-0">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={toggleMenu}
                  className="nav-link-item block text-3xl md:text-4xl text-black/90 hover:text-black hover:translate-x-2 transition-all duration-200 py-1 font-nav font-extrabold"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Media Card */}
            <div className="flex flex-col nav-media-card h-full min-h-0">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-black group cursor-not-allowed">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-60"
                  autoPlay
                  muted
                  loop
                  playsInline
                  src="/assets/nav-element.mp4"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="nav-footer flex items-end justify-between border-t border-black/10 pt-6 mt-6 shrink-0">
            <div className="hidden md:block text-sm text-neutral-500">
              A community for students.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
