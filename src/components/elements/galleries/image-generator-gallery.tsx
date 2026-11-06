"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

type Props = {
  gallery: {
    data: {
      items: string[];
    };
  };
};

const ImageGeneratorGallery = ({ gallery }: Props) => {
  const { items } = gallery.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <div className="pt-[17px] relative">
      <div className="container 2xl:max-w-[1750px]" ref={containerRef}>
        {items && items.length && (
          <div className="grid gap-[15px] xl:gap-[30px] 2xl:gap-[40px] grid-cols-2 md:grid-cols-4">
            {items.map((item, i) => (
              <div
                key={`gallery_item-${i}`}
                className="rounded-theme overflow-hidden inline-block first:translate-y-0 md:first:-translate-y-[30px] xl:first:-translate-y-[60px] 2xl:first:-translate-y-[90px] last:translate-y-0 md:last:-translate-y-[30px] xl:last:-translate-y-[60px] 2xl:last:-translate-y-[90px] has_fade_anim"
                data-fade-offset="0"
              >
                <Image
                  width={400}
                  height={480}
                  src={item}
                  alt="gallery image"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGeneratorGallery;
