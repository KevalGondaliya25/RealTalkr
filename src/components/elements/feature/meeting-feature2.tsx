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
      feature_items: {
        enable: true;
        label: string;
        items: string[];
      };
    };
  };
};

const MeetingFeature2 = ({ feature }: Props) => {
  const { title, details, image, feature_items } = feature.data;

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
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-x-[80px] gap-y-[40px]">
          <div className="max-w-[468px]">
            <Title1 text={title} html className="has_fade_anim" />
            <p className="mt-[27px] has_fade_anim">{details}</p>
            {feature_items && feature_items.enable && (
              <div className="mt-[26px] has_fade_anim">
                <p className="text-[18px] font-medium text-primary">
                  {feature_items.label}
                </p>
                {feature_items.items && feature_items.items.length && (
                  <ul className="mt-[18px]">
                    {feature_items.items.map((item, i) => (
                      <li
                        key={`feature_item-${i}`}
                        className="text-[18px] font-medium text-primary leading-[1.44] flex items-start gap-[6px] mt-[10px] first:mt-0"
                      >
                        <Image
                          width={18}
                          height={18}
                          src="/assets/imgs/icon/check-2.png"
                          className="mt-[2px]"
                          alt="icon image"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div>
            {image && (
              <Image width={550} height={548} src={image} alt="team image" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingFeature2;
