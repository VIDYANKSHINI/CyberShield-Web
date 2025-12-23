// useScrollNav.ts
import { useState, useEffect } from "react";

export function useScrollNav() {
  const [scrollState, setScrollState] = useState({
    isTop: true,
    isHidden: false,
    direction: "up",
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? "down" : "up";

      setScrollState({
        isTop: currentScrollY < 50,
        // Hide if scrolling down AND past the hero (100px)
        isHidden: direction === "down" && currentScrollY > 100,
        direction,
      });

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollState;
}
