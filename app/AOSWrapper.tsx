// app/AOSWrapper.tsx
'use client';

import { useEffect } from "react";
import AOS from "aos";

export default function AOSWrapper() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      delay: 0,
      anchorPlacement: "top-bottom",
    });
  }, []);

  return null;
}
