"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { delayTime2 } from "@/lib/helper/delayTime";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
      shape: string;
      items: {
        name: string;
        details: string;
        image: string;
        border_color: string;
      }[];
    };
  };
};

const MobileAppFeature = ({ feature }: Props) => {
  const { title, details, shape, items } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="relative bg-[#F4FDF9] max-w-[1435px] mx-auto rounded-[30px]">
      {shape && (
        <div
          className="hidden xl:block absolute top-[80px] -end-[45px]"
          data-speed="0.8"
        >
          <Image
            width={115}
            height={86}
            src={shape}
            className="rtl_y"
            alt="shape"
          />
        </div>
      )}
      <div className="container" ref={containerRef}>
        <div className="pt-[60px] md:pt-[113px] px-0 md:px-[10px] pb-[80px]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[auto_400px] gap-[10px] md:gap-[50px] xl:gap-[207px]">
            <Title1 text={title} />
            <p className="has_fade_anim" data-delay="0.25">
              {details}
            </p>
          </div>
          {items && items.length && (
            <div className="pt-[25px] md:pt-[47px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] lg:gap-[30px]">
              {items.map((item, i) => (
                <div
                  key={`feature_item-${i}`}
                  className="rounded-theme p-[20px] md:p-[30px] xl:py-[50px] xl:pr-[40px] xl:pl-[50px] border-[2px] border-transparent has_fade_anim"
                  data-delay={delayTime2(i + 1)}
                  style={{
                    background: `linear-gradient(#F8FEFB, #F8FEFB) padding-box, linear-gradient(145deg, ${item.border_color}, #ffffffa8) border-box`,
                  }}
                >
                  {item.image && (
                    <div className="mb-[20px]">
                      <Image
                        width={70}
                        height={70}
                        src={item.image}
                        alt="icon"
                      />
                    </div>
                  )}
                  <h3 className="text-[18px] md:text-[20px] xl:text-[24px] 2xl:text-[30px] pb-[8px] md:pb-[21px]">
                    {item.name}
                  </h3>
                  <p className="max-w-[315px]">{item.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MobileAppFeature;
