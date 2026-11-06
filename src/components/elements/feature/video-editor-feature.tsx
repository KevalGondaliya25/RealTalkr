"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
      image: string;
      items: string[];
    };
  };
};

const VideoEditorFeature = ({ feature }: Props) => {
  const { title, details, image, items } = feature.data;

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]">
          <div>
            <Title1 text={title} className="mb-[30px] has_fade_anim" />
            <p className="has_fade_anim">{details}</p>
            {items && items.length && (
              <ul className="flex justify-between pt-[28px] gap-[15px] md:gap-[10px] flex-col lg:flex-row has_fade_anim">
                {items.map((item, i) => (
                  <li
                    key={`feature_item-${i}`}
                    className="flex items-center gap-[10px] text-[18px] text-primary"
                  >
                    <Image
                      width={20}
                      height={20}
                      src="/assets/imgs/icon/icon-r-10.png"
                      alt="check"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-span-1 xl:col-span-2 flex justify-end">
            {image && (
              <Image
                width={630}
                height={410}
                src={image}
                className="rounded-theme"
                alt="feature"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoEditorFeature;
