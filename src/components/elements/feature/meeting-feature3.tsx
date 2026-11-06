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
        name: string;
        text: string;
        image: string;
      }[];
    };
  };
};

const MeetingFeature3 = ({ feature }: Props) => {
  const { title, details, image, feature_items } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[42px] md:pt-[62px] xl:pt-[82px] 2xl:pt-[112px]">
      <div className="container" ref={containerRef}>
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-x-[80px] gap-y-[30px]">
          <Title1 text={title} className="max-w-[596px] has_fade_anim" />
          <div>
            <p className="max-w-[420px] has_fade_anim">{details}</p>
          </div>
        </div>
        <div className="mt-[47px] 2xl:mt-[57px] grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[1.6fr_1fr] 2xl:grid-cols-[1.4fr_1fr] gap-[30px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[39px] xl:gap-[49px] 2xl:gap-[69px] pt-[40px] 2xl:pt-[70px] pb-[33px] 2xl:pb-[63px] px-[40px] 2xl:px-[70px] bg-[#E7F8F0] rounded-theme justify-between">
            {feature_items &&
              feature_items.length &&
              feature_items.map((item, i) => (
                <div key={`feature3_item-${i}`} className="has_fade_anim">
                  <div>
                    <Image
                      width={50}
                      height={50}
                      src={item.image}
                      alt="feature icon"
                    />
                  </div>
                  <div className="mt-[25px] 2xl:mt-[35px]">
                    <h3 className="text-[24px] leading-tight">{item.name}</h3>
                    <p className="mt-[13px] 2xl:mt-[23px]">{item.text}</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="max-w-[520px] hidden lg:block">
            {image && (
              <Image width={520} height={634} src={image} alt="image" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingFeature3;
