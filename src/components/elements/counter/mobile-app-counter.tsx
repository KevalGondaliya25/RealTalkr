"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

type Props = {
  counter: {
    data: {
      title: string;
      details: string;
      image: string;
      shape: string;
      btn_items: { image: string; link: string }[];
      items: {
        text: string;
        number: number;
        unit: string;
        suffix: string;
        bg_color: string;
        text_color: string;
      }[];
    };
  };
};

const MobileAppCounter = ({ counter }: Props) => {
  const { title, details, image, shape, btn_items, items } = counter.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_bottom2">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] xl:grid-cols-[500px_1fr] 2xl:grid-cols-[630px_auto] gap-[20px] lg:gap-[30px] mt-0 xl:mt-[32px] 2xl:mt-[62px]">
          <div className="bg-[#F4FDF9] rounded-theme p-[20px] md:p-[36px] lg:pb-0 lg:ps-[30px] lg:pe-[15px] 2xl:pt-[56px] 2xl:ps-[60px] 2xl:pe-[30px] flex flex-col justify-between">
            <div className="max-w-full md:max-w-[60%]">
              <h3 className="text-[22px] md:text-[30px] leading-[1.16] has_fade_anim">
                {title}
              </h3>
              <p className="mt-[10px] md:mt-[20px] has_fade_anim">{details}</p>
            </div>
            <div className="grid grid-cols-2 gap-[30px]">
              <div className="mt-[3px] has_fade_anim">
                {shape && (
                  <div className="hidden lg:block ms-[128px]">
                    <Image
                      width={47}
                      height={76}
                      src={shape}
                      className="rtl_y"
                      alt="shape image"
                    />
                  </div>
                )}
                {btn_items && btn_items.length && (
                  <div className="my-[25px] lg:my-[32px]">
                    {btn_items.map((item, i) => (
                      <div
                        key={`btn_item-${i}`}
                        className="mt-[5px] md:mt-[20px] first:mt-0"
                      >
                        {item.image && (
                          <Link href={item.link}>
                            <Image
                              width={180}
                              height={60}
                              src={item.image}
                              className="drop-shadow-[5px_5px_45px_rgba(0,0,0,0.03)]"
                              alt="app image"
                            />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:-mt-[22%]">
                {image && (
                  <Image width={282} height={391} src={image} alt="app image" />
                )}
              </div>
            </div>
          </div>
          {items && items.length && (
            <div className="grid grid-cols-2 gap-[20px] md:gap-x-[30px] rounded-theme justify-between relative">
              {items.map((item, i) => (
                <div
                  key={`counter_item-${i}`}
                  className="p-[16px] md:p-[25px] xl:pt-[37px] xl:pb-[33px] xl:px-[35px] 2xl:py-[52px] 2xl:px-[45px] rounded-theme has_fade_anim"
                  style={{ backgroundColor: item.bg_color }}
                >
                  <h3
                    className="text-[25px] md:text-[40px] 2xl:text-[60px] uppercase"
                    style={{ color: item.text_color }}
                  >
                    <span>{item.number}</span>
                    {item.unit}{" "}
                    <span className="text-[20px] md:text-[40px] -start-[4px] xl:-start-[15px] -top-[8px] md:-top-[15px] relative inline-block bold">
                      {item.suffix}
                    </span>
                  </h3>
                  <p className="text-[13px] md:text-[16px] mt-[15px]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MobileAppCounter;
