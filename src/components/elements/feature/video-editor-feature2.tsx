"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { delayTime2 } from "@/lib/helper/delayTime";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import FeatureCard2 from "./card/featureCard2";

type Props = {
  feature2: {
    data: {
      title: string;
      details: string;
      items: {
        name: string;
        details: string;
        icon: string;
      }[];
    };
  };
};

const VideoEditorFeature2 = ({ feature2 }: Props) => {
  const { title, details, items } = feature2.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_top4">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[630px]"
          detailsClassName="max-w-[630px]"
        />
        {items && items.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-[60px]">
            {items.map((item, i) => (
              <div
                key={`feature2_item-${i}`}
                className="has_fade_anim"
                data-delay={delayTime2(i + 1)}
              >
                <FeatureCard2 feature={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoEditorFeature2;
