"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { delayTime } from "@/lib/helper/delayTime";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import FeatureCard1 from "./card/featureCard1";

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
    };
  };

  features: {
    data: {
      title: string;
      short_description: string;
      image: string;
    };
    slug: string;
  }[];
};

const ContentWriterFeature = ({ feature, features }: Props) => {
  const { title, details } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[55px] md:pt-[80px] xl:pt-[106px] 2xl:pt-[131px]">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[700px]"
          detailsClassName="max-w-[780px]"
        />
        {features && features.length && (
          <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[30px]">
            {features.map((item, i) => (
              <div
                key={item.slug}
                className="has_fade_anim"
                data-delay={delayTime(i + 1)}
              >
                <FeatureCard1 feature={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentWriterFeature;
