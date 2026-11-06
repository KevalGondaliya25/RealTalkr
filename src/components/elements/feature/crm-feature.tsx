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
      items: {
        name: string;
        short_description: string;
        image: string;
      }[];
      shape1_img: string;
      shape2_img: string;
    };
  };
};

const CRMFeature = ({ feature }: Props) => {
  const { title, details, image, items, shape1_img, shape2_img } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space2">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_6fr] gap-x-6 gap-y-12 items-center">
          <div>
            <Title1
              text={title}
              className="pb-[15px] md:pb-[24px] max-w-[463px] has_fade_anim"
            />
            <div className="max-w-[520px]">
              <p className="has_fade_anim">{details}</p>
            </div>
            {items && items.length && (
              <div className="mt-[30px] md:mt-[45px] has_fade_anim">
                {items.map((item, i) => (
                  <div
                    key={`feature_item-${i}`}
                    className="mb-[30px] md:mb-[50px] last:mb-0 flex gap-[15px] md:gap-[30px]"
                  >
                    <div>
                      <Image
                        width={70}
                        height={70}
                        src={item.image}
                        alt="icon"
                      />
                    </div>
                    <div>
                      <h2 className="text-[18px] md:text-[24px] pb-0 md:pb-[13px]">
                        {item.name}
                      </h2>
                      <div className="max-w-[330px]">
                        <p>{item.short_description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative max-w-full lg:max-w-[630px] rounded-[40px] mx-auto bg-[#FAFAFA] mt-[50px] md:mt-0 p-0 md:px-[50px] md:py-[60px]">
            {image && (
              <Image
                width={492}
                height={542}
                src={image}
                alt="community-thumb"
              />
            )}
            {shape1_img && (
              <Image
                width={205}
                height={120}
                src={shape1_img}
                data-speed="1.2"
                className="absolute bottom-[142px] left-[23px] "
                alt="community-thumb"
              />
            )}
            {shape2_img && (
              <Image
                width={272}
                height={272}
                src={shape2_img}
                data-speed="0.8"
                className="absolute -right-[60px] top-[48px]"
                alt="community-thumb"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CRMFeature;
