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

const CustomerServiceCounter = ({ counter }: Props) => {
  const { title, details, shape_img, items } = counter.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[43px] md:pt-[73px] xl:pt-[103px] 2xl:pt-[173px]">
      <div className="container" ref={containerRef}>
        <div className="relative">
          {shape_img && (
            <div className="absolute bottom-[30px] start-[calc(100%+98px)] w-[96px]">
              <Image
                width={96}
                height={96}
                src={shape_img}
                data-speed="0.8"
                alt="shape image"
              />
            </div>
          )}

          <TitleSection2
            title={title}
            details={details}
            titleClassName="max-w-[700px]"
          />
          <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] has_fade_anim">
            <Counter2 counter={items} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerServiceCounter;
