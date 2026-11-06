"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";

// lib
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  process: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      items: {
        text: string;
        icon: string;
      }[];
    };
  };
};

const SEOProcess = ({ process }: Props) => {
  const { title, sub_title, details, items } = process.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space1 bg-primary">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          sub_title={sub_title}
          details={details}
          titleClassName="max-w-[700px] !text-white"
          subTitleClassName="bg-[#1B3242] text-white"
          detailsClassName="max-w-[700px] text-white-2"
        />
        {items && items.length && (
          <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px]">
            <div className="border border-[#ffffff17] rounded-theme px-[20px] xl:px-[40px] py-[25px] xl:py-[45px] flex flex-col md:flex-row justify-center items-center gap-[30px] has_fade_anim">
              {items.slice(0, 3).map((item, i) => (
                <div
                  key={`process_item-${i}`}
                  className="[&>img]:last:hidden flex justify-between items-center gap-[30px]"
                >
                  <div className="flex flex-col lg:flex-row gap-[20px] items-center text-center lg:text-start max-w-[350px]">
                    {item.icon && (
                      <span className="w-[50px] 2xl:w-[70px] min-w-[50px] 2xl:min-w-[70px] h-[50px] 2xl:h-[70px] rounded-[6px] 2xl:rounded-[10px] bg-primary-100 inline-flex justify-center items-center">
                        <Image
                          width={32}
                          height={33}
                          src={item.icon}
                          alt="icon image"
                        />
                      </span>
                    )}
                    <h3 className="text-[18px] 2xl:text-[24px] leading-tight !text-white max-w-[180px] 2xl:max-w-full">
                      {item.text}
                    </h3>
                  </div>
                  <Image
                    width={72}
                    height={15}
                    src="/assets/imgs/shape/shape-s-49.png"
                    className="hidden xl:block rtl_y"
                    alt="shape-image"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SEOProcess;
