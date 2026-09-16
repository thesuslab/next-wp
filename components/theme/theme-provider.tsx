"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

// React 19 + Next.js: next-themes renders an inline <script> to prevent theme flickering (FOUC).
// React 19 flags scripts rendered inside client components with a development overlay error.
// We safely suppress this false-positive warning while preserving theme functionality.
if (typeof console !== "undefined") {
  const originalError = console.error;
  const isPatched = (originalError as any).__nextThemesScriptPatched;
  if (!isPatched) {
    const patchedError = (...args: any[]) => {
      const firstArg = typeof args[0] === "string" ? args[0] : "";
      if (
        firstArg.includes("Encountered a script tag while rendering React component") ||
        firstArg.includes("Scripts inside React components are never executed")
      ) {
        return;
      }
      originalError.apply(console, args);
    };
    (patchedError as any).__nextThemesScriptPatched = true;
    console.error = patchedError;
  }
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
