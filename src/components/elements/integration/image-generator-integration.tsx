"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  integration: {
    data: {
      title: string;
      details: string;
      image1: string;
      image2: string;
      items: string[];
    };
  };
};

const ImageGeneratorIntegration = ({ integration }: Props) => {
  const { title, details, image1, image2, items } = integration.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[50px] md:pt-[75px] xl:pt-[100px] 2xl:pt-[124px]">
      <div className="container" ref={containerRef}>
        <Title1 text={title} className="max-w-[550px] has_fade_anim" />
        <div className="mt-[36px] xl:mt-[46px] 2xl:mt-[56px] ps-0 xl:ps-[110px] grid gap-x-[60px] gap-y-[40px] justify-between items-start grid-cols-1 md:grid-cols-[auto_320px] lg:grid-cols-[auto_440px]">
          <div>
            {image1 && (
              <div className="inline-block rounded-theme overflow-hidden">
                <Image
                  width={550}
                  height={700}
                  src={image1}
                  className="has_fade_anim"
                  alt="gallery image"
                />
              </div>
            )}
          </div>
          <div className="mt-0 xl:-mt-[198px]">
            {image2 && (
              <div className="inline-block rounded-theme overflow-hidden">
                <Image
                  width={440}
                  height={510}
                  src={image2}
                  className="has_fade_anim"
                  alt="gallery image"
                />
              </div>
            )}
            <p className="mt-[44px] 2xl:mt-[74px] has_fade_anim">{details}</p>
            {items && items.length && (
              <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[53px] flex gap-[20px] flex-wrap has_fade_anim">
                {items.map((item, i) => (
                  <div
                    key={`integration_item-${i}`}
                    className="w-[100px] aspect-square flex justify-center items-center rounded-theme bg-[#ffffff08] border border-[#ffffff17]"
                  >
                    <Image
                      width={47}
                      height={47}
                      src={item}
                      className="w-auto"
                      alt="app icon"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGeneratorIntegration;
