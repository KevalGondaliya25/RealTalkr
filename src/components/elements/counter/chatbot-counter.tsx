"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { delayTime2 } from "@/lib/helper/delayTime";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type AppType = {
  enable: boolean;
  title: string;
  details: string;
  image: string;
  app_shape: string;
  buttons: {
    image: string;
    link: string;
  }[];
};

type Props = {
  counter: {
    data: {
      title: string;
      details: string;
      apps: AppType;
      counters: {
        number: number;
        unit: string;
        text: string;
      }[];
      shape1_img: string;
    };
  };
};

const ChatbotCounter = ({ counter }: Props) => {
  const { title, details, apps, counters, shape1_img } = counter.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[53px] md:pt-[73px] xl:pt-[93px] 2xl:pt-[123px]">
      <div className="container 2xl:max-w-[1630px]" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          html
          titleClassName="max-w-[650px] mx-auto [&>img]:inline-block"
          detailsClassName="max-w-[710px]"
        />
        <div className="mt-[32px] 2xl:mt-[62px] grid gap-[20px] grid-cols-1 2xl:grid-cols-[auto_785px]">
          <div className="bg-sec_bg-2 rounded-theme grid grid-cols-1 md:grid-cols-2 gap-[30px] justify-between items-end pt-[36px] 2xl:pt-[56px] px-[30px] 2xl:px-[60px] max-w-[795px] mx-auto">
            {apps && apps.enable && (
              <>
                <div className="mb-[10px] md:mb-[60px]">
                  <h3 className="text-[30px] leading-[1.16] has_fade_anim">
                    {apps.title}
                  </h3>
                  <p className="mt-[20px] has_fade_anim">{apps.details}</p>
                  <div className="mt-[3px] has_fade_anim">
                    <div className="hidden lg:block ms-[128px]">
                      {apps.app_shape && (
                        <Image
                          width={47}
                          height={76}
                          src={apps.app_shape}
                          className="rtl_y"
                          alt="shape image"
                        />
                      )}
                    </div>
                    {apps.buttons && apps.buttons.length && (
                      <div className="mt-[32px]">
                        {apps.buttons.map((item, i) => (
                          <div
                            key={`apps_button-${i}`}
                            className="mt-[20px] first:mt-0"
                          >
                            <Link href={item.link}>
                              {item.image && (
                                <Image
                                  width={180}
                                  height={60}
                                  src={item.image}
                                  alt="app image"
                                />
                              )}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="has_fade_anim">
                  {apps.image && (
                    <Image
                      width={286}
                      height={486}
                      src={apps.image}
                      alt="app image"
                    />
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-[20px] rounded-theme w-full md:w-[700px] lg:w-[785px] mx-auto relative justify-center lg:justify-between z-[1]">
            {counters && counters.length && (
              <>
                {counters.slice(0, 3).map((item, i) => (
                  <div
                    key={`counter_item-${i}`}
                    className="rounded-theme relative bg-sec_bg-2 pt-[37px] 2xl:pt-[57px] pb-[33px] 2xl:pb-[53px] px-[35px] 2xl:px-[55px] outline-[20px] outline outline-white first:bg-[#EBE5FD] w-[300px] lg:w-[400px] first:w-[300px] lg:first:w-[365px] lg:[&:nth-child(3)]:!rounded-tr-[0px] lg:[&:nth-child(2)]:!rounded-bl-[0px] rtl:lg:[&:nth-child(3)]:!rounded-tr-[20px] rtl:lg:[&:nth-child(2)]:!rounded-bl-[20px] rtl:lg:[&:nth-child(3)]:!rounded-tl-[0px] rtl:lg:[&:nth-child(2)]:!rounded-br-[0px] [&:nth-child(3)]:before:hidden lg:[&:nth-child(3)]:before:block [&:nth-child(3)]:before:absolute [&:nth-child(3)]:before:content-[url(/assets/imgs/counter/chatbot/joint-shape.png)] [&:nth-child(3)]:before:-end-[19px] [&:nth-child(3)]:before:-top-[20px] [&:nth-child(3)]:before:z-[2] rtl:[&:nth-child(3)]:before:transform rtl:[&:nth-child(3)]:before:rotate-y-[180deg] has_fade_anim"
                    data-delay={delayTime2(i + 1)}
                  >
                    <h3 className="text-[40px] 2xl:text-[60px]">
                      <span>{item.number}</span>
                      {item.unit}
                    </h3>
                    <p className="mt-[15px] max-w-[250px]">{item.text}</p>
                  </div>
                ))}
                <div
                  className="rounded-theme w-[300px] lg:w-[365px] bg-[#D7EFDF] outline-[20px] outline outline-white pt-[37px] 2xl:pt-[57px] flex justify-center items-end has_fade_anim"
                  data-delay="0.45"
                >
                  {shape1_img && (
                    <Image
                      width={375}
                      height={264}
                      src={shape1_img}
                      className="object-cover w-full"
                      alt="Shape Image"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotCounter;
