// src/providers/lenis-provider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 1. Create Context
export const LenisContext = createContext<Lenis | null>(null);

// 2. Custom Hook for easy access
export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis();
    setLenis(lenisInstance); // Store instance

    // Lenis -> ScrollTrigger sync
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Drive Lenis with GSAP ticker
    const update = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenisInstance.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
