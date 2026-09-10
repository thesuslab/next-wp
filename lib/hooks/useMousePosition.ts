"use client";

import { useEffect, useState, type RefObject } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition(ref?: RefObject<HTMLElement | null>): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0.5,
    normalizedY: 0.5,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const element = ref?.current;

      if (element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition({
          x,
          y,
          normalizedX: x / rect.width,
          normalizedY: y / rect.height,
        });
      } else {
        setPosition({
          x: e.clientX,
          y: e.clientY,
          normalizedX: e.clientX / window.innerWidth,
          normalizedY: e.clientY / window.innerHeight,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [ref]);

  return position;
}
