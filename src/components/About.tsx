import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const ctx = gsap.context(() => {
        // Fade Up Animation
        const fadeElements =
          gsap.utils.toArray<HTMLElement>(".animate-fade-up");
        fadeElements.forEach((el) => {
          gsap.fromTo(
            el,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Heavy Numbers Parallax
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
          gsap.fromTo(
            ".heavy-number-left",
            { yPercent: 20 },
            {
              yPercent: -30,
              ease: "none",
              scrollTrigger: {
                trigger: ".heavy-numbers-container",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );

          gsap.fromTo(
            ".heavy-number-right",
            { yPercent: -20 },
            {
              yPercent: 30,
              ease: "none",
              scrollTrigger: {
                trigger: ".heavy-numbers-container",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        });

        // Image Parallax
        const parallaxImages = gsap.utils.toArray<HTMLElement>(
          ".parallax-img-wrapper"
        );
        parallaxImages.forEach((wrapper) => {
          const img = wrapper.querySelector<HTMLImageElement>("img");
          if (!img) return;
          gsap.fromTo(
            img,
            { yPercent: -15, scale: 1.15 },
            {
              yPercent: 15,
              scale: 1.15,
              ease: "none",
              scrollTrigger: {
                trigger: wrapper,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      }, containerRef);

      // Cleanup function
      return () => {
        ctx.revert(); // This kills all animations and ScrollTriggers
      };
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-white text-[#050e27] antialiased overflow-hidden font-sans"
      style={{ fontFamily: "Neuemontreal, sans-serif" }}
    >
      {/* --- Main Padding Wrapper --- */}
      <div className="pt-20 md:pt-[10rem] px-6 md:px-12 lg:px-16 max-w-[1920px] mx-auto pb-20 md:pb-32">
        {/* --- Header Section --- */}
        <div className="mb-16 md:mb-32">
          <h1 className="animate-fade-up text-[3rem] md:text-[5rem] lg:text-[7.5rem] leading-[0.9] tracking-tight">
            <span className="font-bold block">ABOUT</span>
            <span className="text-[#f9a90d] font-light block">
              ELGO BATSCALE
            </span>
          </h1>
        </div>

        {/* --- Intro Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12 mb-16 md:mb-32 relative z-10">
          {/* Left Label */}
          <div className="lg:col-span-3 xl:col-span-4">
            <div className="animate-fade-up text-[#f9a90d] text-xs md:text-sm uppercase tracking-wider font-semibold">
              Leading in
              <br />
              magnetic
              <br />
              tape
              <br />
              production
            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-9 xl:col-span-8">
            <h3 className="animate-fade-up text-[1.25rem] md:text-[1.625rem] leading-[1.3] font-medium max-w-3xl">
              ELGO Batscale AG is a central hub specializing in the development
              and production of magnetic tape used in a wide range of
              applications.
            </h3>
          </div>
        </div>

        {/* --- Heavy Numbers (1998) Section --- */}
        <div className="heavy-numbers-container relative w-full h-[25vh] md:h-[50vh] lg:h-[70vh] flex items-center justify-between pointer-events-none select-none overflow-hidden my-8 md:my-12">
          {/* Left Number "19" */}
          <div className="heavy-number-left w-1/2 flex justify-start pl-[2%] md:pl-[5%]">
            <span
              className="text-[8rem] md:text-[20rem] lg:text-[35rem] leading-none font-bold text-transparent"
              style={{ WebkitTextStroke: "1px #e49700" }}
            >
              19
            </span>
          </div>

          {/* Right Number "98" */}
          <div className="heavy-number-right w-1/2 flex justify-end pr-[2%] md:pr-[5%]">
            <span
              className="text-[8rem] md:text-[20rem] lg:text-[35rem] leading-none font-bold text-transparent"
              style={{ WebkitTextStroke: "1px #e49700" }}
            >
              98
            </span>
          </div>
        </div>

        {/* --- Stats & Image Grid (Founded Info) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12 items-end mb-24 md:mb-48 relative z-10">
          {/* Left: Info List + Small Image */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8 md:gap-10">
            <div className="animate-fade-up w-full max-w-sm">
              {/* List Item 1 */}
              <div className="flex justify-between items-center py-3 border-b border-[#0000001a]">
                <span className="text-[#050e27] font-medium text-sm md:text-base">
                  Founded in
                </span>
                <span className="text-[#f9a90d] font-semibold text-sm md:text-base">
                  1998
                </span>
              </div>
              {/* List Item 2 */}
              <div className="flex justify-between items-center py-3 border-b border-[#0000001a]">
                <span className="text-[#050e27] font-medium text-sm md:text-base">
                  Founded by
                </span>
                <span className="text-[#f9a90d] font-semibold text-sm md:text-base">
                  Helmut Grimm
                </span>
              </div>
              {/* List Item 3 */}
              <div className="flex justify-between items-center py-3 border-b border-[#0000001a] mb-6 md:mb-8">
                <span className="text-[#050e27] font-medium text-sm md:text-base">
                  Location
                </span>
                <span className="text-[#f9a90d] font-semibold text-sm md:text-base">
                  Balzers
                </span>
              </div>

              {/* Small HQ Image */}
              <img
                src="https://cdn.prod.website-files.com/64fee4d928c4095c908ec403/65d5ca3d928ebdfaa2ea0033__A7_4040.jpg"
                alt="Elgo Headquarters"
                className="w-full md:w-[220px] h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Big Stats (6 Million) */}
          <div className="lg:col-span-7 xl:col-span-8 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-12">
              {/* Big Number Block */}
              <div className="animate-fade-up flex items-baseline leading-none text-[#f9a90d] shrink-0">
                <span className="text-[6rem] md:text-[10rem] lg:text-[12rem] font-medium tracking-tighter">
                  6
                </span>
                <div className="flex flex-col text-base md:text-lg lg:text-xl font-bold ml-2 md:ml-4 mb-4 md:mb-8 text-[#f9a90d] tracking-wide">
                  <span>MILLION</span>
                  <span>METERS</span>
                </div>
              </div>

              {/* Description */}
              <div className="animate-fade-up max-w-md mb-4 md:mb-12">
                <p className="text-[#424c5299] text-base md:text-lg leading-relaxed">
                  of magnetic tape leave our production every year to be used in
                  elevator systems and automation technology applications
                  worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Parallax Gallery Section --- */}
        <div className="relative w-full mb-24 md:mb-48 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
          {/* Left Image */}
          <div className="animate-fade-up w-full md:pr-4 lg:pr-12 z-10">
            <div className="parallax-img-wrapper relative overflow-hidden h-[300px] md:h-[450px] lg:h-[560px] w-full">
              <img
                src="https://cdn.prod.website-files.com/64fee4d928c4095c908ec403/6511ab6dfdbb14e1d1013f24_elgo-about-1.jpg"
                alt="Factory Interior"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Image */}
          <div className="animate-fade-up w-full md:pl-4 lg:pl-0 md:mt-24 lg:mt-48 z-20">
            <div className="parallax-img-wrapper relative overflow-hidden h-[250px] md:h-[350px] lg:h-[476px] w-full shadow-xl">
              <img
                src="https://cdn.prod.website-files.com/64fee4d928c4095c908ec403/65d5c93b5670ad9c3a4437e0__A7_4266.jpg"
                alt="Worker with Watch"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* --- Bottom Text & Stats Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12 mt-16 md:mt-32">
          {/* Left Label */}
          <div className="lg:col-span-3 xl:col-span-4">
            <div className="animate-fade-up text-[#f9a90d] text-xs md:text-sm uppercase tracking-wider font-semibold">
              Market leader in
              <br />
              shaft information
              <br />
              systems
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-9 xl:col-span-8">
            <div className="max-w-3xl mb-12 md:mb-24">
              <h3 className="animate-fade-up text-[1.25rem] md:text-[1.625rem] leading-[1.3] font-medium">
                To ensure the safety and reliability of elevator systems, ELGO
                Batscale AG develops and manufactures sensor systems certified
                up to SIL3 standard.
              </h3>
            </div>

            {/* Bottom Stats (950K) */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-12">
              <div className="animate-fade-up flex items-baseline leading-none text-[#f9a90d] shrink-0">
                <span className="text-[6rem] md:text-[10rem] lg:text-[12rem] font-medium tracking-tighter">
                  950
                </span>
                <span className="text-[3rem] md:text-[5rem] lg:text-[6rem] font-medium self-start mt-2 md:mt-8">
                  K
                </span>
                <div className="flex flex-col text-base md:text-lg lg:text-xl font-bold ml-2 md:ml-4 mb-4 md:mb-8 text-[#f9a90d] tracking-wide leading-tight">
                  <span>elevator</span>
                  <span>systems</span>
                </div>
              </div>

              <div className="animate-fade-up max-w-md mb-4 md:mb-12">
                <p className="text-[#424c5299] text-base md:text-lg leading-relaxed">
                  worldwide have been equipped with our shaft information
                  systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
