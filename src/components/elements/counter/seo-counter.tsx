"use client";

import { useRef } from "react";

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
      sub_title: string;
      details: string;
      items: {
        number: number;
        unit: string;
        text: string;
      }[];
    };
  };
};

const SEOCounter = ({ counter }: Props) => {
  const { title, sub_title, details, items } = counter.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space1">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          sub_title={sub_title}
          details={details}
          html
          titleClassName="max-w-[700px]"
          detailsClassName="max-w-[700px]"
        />
        <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] has_fade_anim">
          <Counter2 counter={items} />
        </div>
      </div>
    </section>
  );
};

export default SEOCounter;
