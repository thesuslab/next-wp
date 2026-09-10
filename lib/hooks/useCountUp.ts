"use client";

import { useEffect, useState } from "react";

interface UseCountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  enabled?: boolean;
}

export function useCountUp({ end, start = 0, duration = 1500, enabled = true }: UseCountUpOptions): number {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!enabled) {
      setValue(start);
      return;
    }

    const startTime = performance.now();
    const range = end - start;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + range * eased));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, start, duration, enabled]);

  return value;
}
