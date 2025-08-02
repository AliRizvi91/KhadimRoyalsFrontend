"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [cursorSize, setCursorSize] = useState(30);
  const [isPointer, setIsPointer] = useState(false);
  
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0)
  };

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.4 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.x.set(e.clientX - cursorSize / 2);
      mouse.y.set(e.clientY - cursorSize / 2);
      setIsVisible(true);
      
      // Check if the element under the cursor is clickable
      const target = e.target;
      const isClickable = 
        target.closest('a, button, [role="button"], [onclick], input, select, textarea, label,button') !== null;
      
      setIsPointer(isClickable);
      setCursorSize(isClickable ? 55 : 30);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouse.x, mouse.y, cursorSize]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
      style={{
        width: cursorSize,
        height: cursorSize,
        borderRadius: "50%",
        backgroundColor: "white",
        x: smoothMouse.x,
        y: smoothMouse.y,
        opacity: isVisible ? 1 : 0,
        transition: "width 0.2s ease, height 0.2s ease",
      }}
    />
  );
}