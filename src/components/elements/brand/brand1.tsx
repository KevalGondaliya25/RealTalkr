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
      title: string;
      items: string[];
    };
  };
  className?: string;
  titleClassName?: string;
};

const Brand1 = ({ brand, className, titleClassName }: Props) => {
  const { title, items } = brand.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <div className={cn("sec_space_bottom", className)}>
      <div className="container" ref={containerRef}>
        <p
          className={cn("text-center mb-[40px] has_fade_anim", titleClassName)}
        >
          {title}
        </p>
        <div className="has_fade_anim">
          <ImageAutoSlider slides={items} />
        </div>
      </div>
    </div>
  );
};

export default Brand1;
