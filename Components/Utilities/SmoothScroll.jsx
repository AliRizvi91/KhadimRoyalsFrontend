"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "lenis/dist/lenis.css";

export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis smooth scroll instance only once and store it in window object
    if (typeof window !== "undefined" && !window.lenisInstance) {
      const lenis = new Lenis({
        duration: 1.2, // Optimal duration for smoothness without being too slow
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smoother easing curve
        smoothWheel: true,
        wheelMultiplier: 0.9, // Balanced wheel sensitivity
        touchMultiplier: 1.5, // Better touch responsiveness
        infinite: false,
        smoothTouch: true,
        normalizeWheel: true,
      });

      window.lenisInstance = lenis;

      // Animation frame loop for smooth scrolling
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Save scroll position before page unload
      const handleBeforeUnload = () => {
        sessionStorage.setItem('scrollPosition', lenis.scroll);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup function to remove event listeners and destroy Lenis instance
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        if (window.lenisInstance === lenis) {
          lenis.destroy();
          window.lenisInstance = null;
        }
      };
    }

    // Restore scroll position from session storage when path changes
    const restoreScroll = () => {
      if (window.lenisInstance) {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
          window.lenisInstance.scrollTo(parseFloat(savedPosition), {
            immediate: false,
            lock: false,
            force: false,
          });
          sessionStorage.removeItem('scrollPosition');
        }
      }
    };

    restoreScroll();
  }, [pathname]); // Re-run effect when pathname changes

  return <>{children}</>;
}