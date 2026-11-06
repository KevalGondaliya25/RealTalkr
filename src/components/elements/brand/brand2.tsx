"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import ImageAutoSlider from "@/components/tools/image-auto-slider";

type Props = {
  brand: {
    data: {
      title: string;
      details: string;
      items: string[];
    };
  };
};

const Brand2 = ({ brand }: Props) => {
  const { title, details, items } = brand.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section>
      <div className="container" ref={containerRef}>
        <div className="pt-[42px] md:pt-[62px] xl:pt-[82px] 2xl:pt-[112px] px-[20px] sec_space_bottom2 bg-white-3 rounded-theme ">
          <div className="has_fade_anim">
            <TitleSection2
              title={title}
              details={details}
              titleClassName="max-w-[700px]"
              detailsClassName="max-w-[450px]"
            />
          </div>
          <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] max-w-[1170] mx-auto has_fade_anim">
            <ImageAutoSlider slides={items} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brand2;
