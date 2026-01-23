import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoText } from "./ui/logo-text-copyright";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Setup
      gsap.set(".inview-element", { y: 50, opacity: 0 });
      gsap.set(bgRef.current, { y: -50, opacity: 0 });
      gsap.set(logoRef.current, { y: 100, opacity: 0 });

      // 2. Main Content Reveal
      ScrollTrigger.batch(".inview-element", {
        start: "top 85%",
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
          });
        },
      });

      // 3. Background Parallax/Fade
      gsap.to(bgRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
          scroller: document.documentElement,
        },
        y: 0,
        opacity: 0.4,
        ease: "none",
      });

      // 4. Logo Reveal
      gsap.to(logoRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          scroller: document.documentElement,
        },
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
      });

      // 5. Button Hover Animations
      const btn = document.querySelector(".content_btn");
      if (btn) {
        const icon = btn.querySelector(".btn_icon");
        const label = btn.querySelector(".btn_label");
        const arrow = btn.querySelector(".arrow-svg");

        btn.addEventListener("mouseenter", () => {
          gsap.to(icon, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
          gsap.to(arrow, { x: 2, y: -2, duration: 0.3 });
          gsap.to(label, { x: -2, duration: 0.3 });
        });

        btn.addEventListener("mouseleave", () => {
          gsap.to(icon, { scale: 1, duration: 0.3 });
          gsap.to(arrow, { x: 0, y: 0, duration: 0.3 });
          gsap.to(label, { x: 0, duration: 0.3 });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={containerRef}
      id="footer"
      className="relative w-full h-screen bg-black text-white pt-[clamp(60px,10vh,100px)] pb-6 overflow-hidden z-0 font-sans -mt-0.5"
    >
      <div className="block_inner relative z-10 w-full max-w-381 mx-auto px-6 md:px-12 flex flex-col justify-between h-full">
        {/* === Main Footer Content === */}
        <div className="footer_main flex flex-col lg:flex-row justify-between w-full mb-16 lg:mb-32">
          {/* Left: Heading & CTA */}
          <div className="footer_content w-full lg:w-[55%] mb-16 lg:mb-0">
            <h6 className="content_heading text-[clamp(1.4rem,3vw,2.4rem)] leading-[1.2] font-medium tracking-tight mb-12 max-w-[90%] inview-element">
              Empowering students to secure the digital world through hands-on
              cybersecurity learning and collaboration.
            </h6>

            <div className="button inview-element inline-block">
              <a
                href="/contact"
                className="content_btn group relative inline-flex items-center text-white"
                aria-label="Work with us"
              >
                {/* Button Label Part */}
                <span className="btn_label relative bg-[#222F30] h-12 px-6 flex items-center rounded-l-full text-lg font-medium transition-colors duration-300 group-hover:bg-[#a7e26e] group-hover:text-black">
                  Work with us
                  {/* Corner Smoothing SVG */}
                  <div className="label_corner absolute -right-4.25 top-0 w-4.5 h-full overflow-hidden pointer-events-none">
                    <svg
                      width="18"
                      height="48"
                      viewBox="0 0 18 48"
                      fill="none"
                      className="text-[#222F30] transition-colors duration-300 group-hover:text-[#a7e26e]"
                    >
                      <path
                        fill="currentColor"
                        d="M0 0h5.63c7.808 0 13.536 7.337 11.642 14.91l-6.09 24.359A11.527 11.527 0 0 1 0 48V0Z"
                      />
                    </svg>
                  </div>
                </span>

                {/* Button Icon Part */}
                <i className="btn_icon relative w-12 h-12 flex items-center justify-center rounded-full bg-[#344041] -ml-1 z-10 transition-colors duration-300 group-hover:bg-[#d4ff9e] group-hover:text-black">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="arrow-svg relative z-20"
                  >
                    <path
                      d="M1 13L13 1M13 1H5M13 1V9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </i>
              </a>
            </div>
          </div>

          {/* Right: Info Columns */}
          <div className="footer_info w-full lg:w-[40%] flex flex-wrap lg:justify-end gap-10 lg:gap-24 relative">
            {/* Nav Column 1 */}
            <div className="info_col flex flex-col gap-6">
              <div className="col_label text-[#c9cbbe] font-mono text-xs uppercase tracking-wider inview-element">
                Navigate
              </div>
              <ul className="col_menu flex flex-col gap-2">
                {[
                  { label: "About CyberShield", href: "#about" },
                  { label: "Workshops & Events", href: "#events" },
                  { label: "Resources", href: "#resources" },
                  { label: "Join the Club", href: "#contact" },
                ].map((item, i) => (
                  <li key={i} className="menu_item inview-element">
                    <a
                      href={item.href}
                      className="menu_link text-lg md:text-xl font-normal text-white hover:text-[#a7e26e] transition-colors duration-200 inline-block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nav Column 2 */}
            <div className="info_col flex flex-col gap-6">
              <div className="col_label text-[#c9cbbe] font-mono text-xs uppercase tracking-wider inview-element">
                Connect
              </div>
              <ul className="col_menu flex flex-col gap-2">
                {[
                  {
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/company/104962109/",
                  },
                  { label: "Instagram", href: "https://x.com" },
                ].map((item, i) => (
                  <li key={i} className="menu_item inview-element">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="menu_link text-lg md:text-xl font-normal text-white hover:text-[#a7e26e] transition-colors duration-200 inline-block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* === Footer Bottom === */}
        <div className="footer_bottom flex flex-col-reverse md:flex-row justify-between items-end md:items-center w-full mt-auto pt-8 border-t border-white/10 text-[#777] text-xs font-mono tracking-wide">
          <div className="footer_links flex gap-4">
            {/* Placeholder for privacy links if needed in future */}
          </div>
          <div className="footer_copyright">
            © 2026 CyberShield. All rights reserved.
          </div>
        </div>

        {/* === Giant Logo === */}
        <div className="footer_logo w-full mt-12 mb-4 relative">
          <a
            href="/"
            aria-label="Home"
            className="block w-full text-white hover:opacity-80 transition-opacity duration-500"
          >
            <LogoText />
          </a>
        </div>
      </div>

      {/* === Ambient Background === */}
      <div
        ref={bgRef}
        className="footer_background absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
        aria-hidden="true"
      >
        {/* Abstract Gradient Mesh to simulate the WebGL effect */}
        <div className="absolute inset-0 bg-linear-to-tr from-[#1a2323] via-[#0b1212] to-black"></div>
        <div className="absolute top-1/2 left-1/4 w-150 h-150 bg-[#1a2323] rounded-full blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-[#0d2121] rounded-full blur-[100px] opacity-50"></div>
      </div>
    </footer>
  );
}
