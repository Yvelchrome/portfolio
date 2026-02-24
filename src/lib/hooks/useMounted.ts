"use client";

import { useState, useEffect } from "react";

export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => {
      clearTimeout(id);
    };
  }, []);

  return isMounted;
}
