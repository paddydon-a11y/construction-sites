"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

export default function ScaledPreview({ children, bg }: { children: ReactNode; bg: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / 1000);
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="aspect-[4/3] overflow-hidden rounded-lg relative"
      style={{ backgroundColor: bg }}
    >
      <div
        className="absolute top-0 left-0 w-[1000px] h-[750px]"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          opacity: scale ? 1 : 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
