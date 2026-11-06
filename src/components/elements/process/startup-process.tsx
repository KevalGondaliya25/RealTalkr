"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { delayTime2 } from "@/lib/helper/delayTime";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  process: {
    data: {
      title: string;
      details: string;
      items: {
        name: string;
        details: string;
      }[];
    };
  };
};

const StartupProcess = ({ process }: Props) => {
  const { title, details, items } = process.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="relative sec_space4">
      <div className="hidden lg:block absolute -top-[95px] xl:-top-[125px] 2xl:-top-[173px] left-0  xl:-left-[160px] max-w-[150px] xl:max-w-full">
        <Image
          width={420}
          height={414}
          src="/assets/imgs/shape/shape-r-15.png"
          alt="shape"
        />
      </div>
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[690px]"
          detailsClassName="max-w-[700px]"
        />
        {items && items.length && (
          <div className="mt-[20px] md:mt-[40px] lg:mt-[63px] relative grid grid-cols-1 md:grid-cols-3 gap-x-[60px] gap-y-[20px] before:hidden before:md:block before:absolute before:content-[' '] before:left-0 before:top-[16px] before:border-t before:border-border before:w-full before:h-[1px]">
            {items.slice(0, 3).map((item, i) => (
              <div
                key={`startup_process-${i}`}
                className="p-[25px] md:p-0 border border-border rounded-theme md:border-0 first:ml-0 first:lg:ml-[30px] has_fade_anim"
                data-delay={delayTime2(i + 1)}
              >
                <span className="text-[12px] px-[12px] py-[11px] bg-sec_bg rounded-[16px] inline-block font-medium relative mb-[10px] md:mb-[20px] lg:mb-[42px]">
                  Step-0{i + 1}
                </span>
                <h3 className="text-[18px] md:text-[20px] lg:text-[24px] mb-[5px] md:mb-[10px] lg:mb-[18px] font-semibold max-w-[179px] leading-[1.33]">
                  {item.name}
                </h3>
                <p className="text">{item.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StartupProcess;
