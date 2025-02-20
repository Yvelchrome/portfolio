"use client";

import { useState, useEffect } from "react";

export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
