"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import Counter2 from "./counter2";

type Props = {
  counter: {
    data: {
      title: string;
      details: string;
      shape_img: string;
      items: {
        number: number;
        unit: string;
        text: string;
      }[];
    };
  };
};

const MarketingCounter = ({ counter }: Props) => {
  const { title, details, shape_img, items } = counter.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="py-6 relative pt-[15px] bg-white">
      {shape_img && (
        <div className="absolute start-0 xl:start-[236px] md:block hidden xl:-top-[-40px] max-w-[50px] md:max-w-[150px] xl:max-w-full">
          <Image
            width={159}
            height={111}
            src={shape_img}
            data-speed="0.8"
            alt="shape image"
          />
        </div>
      )}

      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[570px] lg:max-w-[660px] sec_title2"
          detailsClassName="max-w-[600px] lg:max-w-[540px]"
        />
        <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] has_fade_anim">
          <Counter2 counter={items} />
        </div>
      </div>
    </section>
  );
};

export default MarketingCounter;
