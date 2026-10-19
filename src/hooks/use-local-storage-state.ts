"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalStorageState(key: string, defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    // Reading localStorage must happen post-mount (it doesn't exist during
    // SSR and reading it during the initial client render would mismatch
    // the server-rendered markup), so this one-time sync-from-external-
    // storage effect is the correct tool, not a derived-state anti-pattern.
    try {
      const stored = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored !== null) setValue(stored === "true");
    } catch {
      // localStorage unavailable (private mode, SSR edge cases) — keep default
    }
  }, [key]);

  const update = useCallback(
    (next: boolean) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, String(next));
      } catch {
        // ignore write failures
      }
    },
    [key],
  );

  return [value, update] as const;
}
