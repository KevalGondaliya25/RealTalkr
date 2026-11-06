"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import gsap, { Power1 } from "gsap";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

// components
import Title1 from "@/components/shared/title/title1";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  counter: {
    data: {
      title: string;
      details: string;
      image1: string;
      image2: string;
      image3: string;
      items: {
        name: string;
        details: string;
        number: number;
        unit: string;
      }[];
    };
  };
};

const CRMCounter = ({ counter }: Props) => {
  const { title, details, image1, image2, image3, items } = counter.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
      gsap.from(gsap.utils.toArray(`.count`), {
        textContent: 0,
        duration: 1.5,
        ease: Power1.easeIn,
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: ".counter__number",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[60px] md:pt-[100px] lg:pt-[150px] xl:pt-[200px]">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-[24px]">
          <div className="col-md-7 col-lg-5">
            <Title1
              text={title}
              className="pb-[15px] md:pb-[24px] has_fade_anim"
            />
            <p className="pb-[30px] md:pb-[55px] max-w-full lg:max-w-[455px] has_fade_anim">
              {details}
            </p>
            {items && items.length && (
              <div className="flex flex-col gap-[30px] counter__number">
                {items.map((item, i) => (
                  <div
                    key={`counter_item-${i}`}
                    className="flex justify-between max-w-full md:max-w-[456px] pt-[10px] xl:pt-[20px] first:pt-0 gap-[20px] pb-[15px] xl:pb-[33px] border-b border-border last:pb-0 last:border-b-0 has_fade_anim"
                  >
                    <div>
                      <h2 className="text-[30px] lg:text-[35px] xl:text-[50px] leading-none">
                        <span className="count">{item.number}</span>
                        {item.unit}
                      </h2>
                      <h3 className="text-[12px] lg:text-[16px] xl:text-[20px] leading-none">
                        {item.name}
                      </h3>
                    </div>
                    <p className="max-w-[240px]">{item.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="col-md-5 col-lg-7">
            <div className="bg-[#F6F0DF] relative rounded-[40px] max-w-full lg:max-w-[430px] xl:max-w-[530px] 2xl:max-w-[630px] ms-[unset] lg:ms-auto ps-[54px] pe-[45px] pt-[50px] md:pt-[140px]">
              <div className="hidden md:block absolute start-[55px] top-[41px] w-full lg:w-[200px] 2xl:w-[296px]">
                {image3 && (
                  <Image
                    width={296}
                    height={312}
                    src={image3}
                    className="rounded-[30px]"
                    data-speed="0.95"
                    alt="shape"
                  />
                )}
              </div>
              <div className="hidden md:block absolute bottom-[50px] lg:bottom-[140px] -start-[20px] lg:-start-[60px] z-[2] drop-shadow-3 w-full lg:w-[300px] 2xl:w-[386px]">
                {image2 && (
                  <Image
                    width={386}
                    height={174}
                    src={image2}
                    className="rounded-[30px]"
                    data-speed="0.95"
                    alt="shape"
                  />
                )}
              </div>
              <div className="relative flex justify-end">
                {image1 && (
                  <Image width={415} height={559} src={image1} alt="shape" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CRMCounter;
