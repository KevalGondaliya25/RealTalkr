"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// components
import ImageAutoSlider from "@/components/tools/image-auto-slider";

type Props = {
  brand: {
    data: {
      items: string[];
    };
  };
  className?: string;
};

const Brand3 = ({ brand, className }: Props) => {
  const { items } = brand.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <div className={cn("sec_space_top3", className)}>
      <div className="container" ref={containerRef}>
        <div className="has_fade_anim">
          <ImageAutoSlider slides={items} />
        </div>
      </div>
    </div>
  );
};

export default Brand3;
