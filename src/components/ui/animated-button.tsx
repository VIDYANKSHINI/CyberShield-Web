import React, { useRef, useId } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AnimatedButton: React.FC = () => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const activeTextRef = useRef<HTMLParagraphElement>(null);
  const hoveredTextRef = useRef<HTMLParagraphElement>(null);
  const fillRef = useRef<SVGRectElement>(null);

  const clipId = useId();
  const clipUrl = `url(#${clipId})`;

  const { contextSafe } = useGSAP(
    () => {
      // 1. Initial State:
      // Fill is pushed down (100%) so the button looks transparent initially
      if (fillRef.current) {
        gsap.set(fillRef.current, { yPercent: 100 });
      }
      // Hover text is hidden below
      if (hoveredTextRef.current) {
        gsap.set(hoveredTextRef.current, { y: "100%", opacity: 0 });
      }
    },
    { scope: containerRef }
  );

  const handleMouseEnter = contextSafe(() => {
    // 1. Animate the White Fill Up
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        yPercent: 0,
        duration: 0.5,
        ease: "power4.out", // Snappy but smooth finish
      });
    }

    // 2. Text Animation (White -> Black)
    if (activeTextRef.current && hoveredTextRef.current) {
      // Slide out the White text
      gsap.to(activeTextRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power3.out",
      });
      // Slide in the Black text
      gsap.to(hoveredTextRef.current, {
        y: "0%",
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  });

  const handleMouseLeave = contextSafe(() => {
    // 1. Animate the White Fill Down (Back to transparent)
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        yPercent: 100,
        duration: 0.4,
        ease: "power3.in",
      });
    }

    // 2. Text Animation (Black -> White)
    if (activeTextRef.current && hoveredTextRef.current) {
      // Bring back White text
      gsap.to(activeTextRef.current, {
        y: "0%",
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
      // Hide Black text
      gsap.to(hoveredTextRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  });

  // This path draws the rounded rectangle with the cut corner (chamfer)
  const buttonShapePath =
    "M0,9.8C0,4.4 4.5,0 10,0C10,0 193,0 193,0C198.5,0 203,4.4 203,9.8C203,9.8 203,34.6 203,34.6C203,35 203,35.5 202.9,36C202.9,36 202.2,40.6 202.2,40.6C201.5,45.4 197.3,49 192.4,49C192.4,49 10,49 10,49C4.5,49 0,44.6 0,39.2C0,39.2 0,9.8 0,9.8z";

  return (
    <button
      ref={containerRef}
      className="relative h-[50px] w-[204px] flex flex-row justify-center items-center overflow-hidden bg-transparent cursor-pointer p-0 m-0 border-0 outline-none select-none text-base group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      style={{
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* TEXT LAYERS 
        z-index is high to sit on top of the SVG background
      */}

      {/* 1. Base Text: White (Visible initially) */}
      <p
        ref={activeTextRef}
        className="absolute z-20 pointer-events-none font-medium tracking-wide text-white"
      >
        Start Building
      </p>

      {/* 2. Hover Text: Black (Hidden initially) */}
      <p
        ref={hoveredTextRef}
        className="absolute z-20 pointer-events-none font-medium tracking-wide text-black"
      >
        Start Building
      </p>

      {/* BACKGROUND SVG
       */}
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 203 49"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <defs>
            {/* Define the shape as a clipPath so the fill doesn't spill out */}
            <clipPath id={clipId}>
              <path d={buttonShapePath} />
            </clipPath>
          </defs>

          {/* LAYER 1: The Border (Base State)
            This is always visible. 
          */}
          <path
            d={buttonShapePath}
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            className="opacity-80"
          />

          {/* LAYER 2: The Fill (Hover State) 
            We use the clipPath to constrain the rectangle to the button shape.
          */}
          <g clipPath={clipUrl}>
            <rect
              ref={fillRef}
              width="203"
              height="49"
              fill="white"
              x="0"
              y="0"
              // GSAP will animate this y-position
            />
          </g>
        </svg>
      </div>
    </button>
  );
};

export default AnimatedButton;
