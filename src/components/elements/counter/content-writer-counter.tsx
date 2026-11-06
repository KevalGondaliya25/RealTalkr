"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  counter: {
    data: {
      title: string;
      details: string;
      image: string;
      action_btn: ActionBtnType;
      counters: {
        number: number;
        unit: string;
        text: string;
      }[];
    };
  };
};

const ContentWriterCounter = ({ counter }: Props) => {
  const { title, details, image, action_btn, counters } = counter.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_top3">
      <div className="container" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-x-[60px] gap-y-[40px] justify-between items-center lg:items-start">
          <div
            className="max-w-[460px] lg:max-w-[630px] has_fade_anim"
            data-fade-offset="0"
          >
            {image && (
              <Image width={630} height={549} src={image} alt="gallery image" />
            )}
          </div>
          <div className="max-w-full lg:max-w-[460px] xl:max-w-[520px]">
            <Title1 text={title} className="has_fade_anim" />
            <p className="mt-[19px] has_fade_anim">{details}</p>
            {action_btn && action_btn.enable && (
              <div className="mt-[40px] has_fade_anim">
                <Link
                  href={action_btn.link}
                  className={cn(
                    buttonVariants({ variant: "primary5", size: "lg" })
                  )}
                >
                  <span className="btn-span" data-text={action_btn.label}>
                    {action_btn.label}
                  </span>
                </Link>
              </div>
            )}
            {counters && counters.length && (
              <div className="mt-[52px] grid grid-cols-[repeat(2,150px)] gap-x-[80px] gap-y-[30px]">
                {counters.map((item, i) => (
                  <div key={`counter_item-${i}`} className="has_fade_anim">
                    <h3 className="text-[36px] xl:text-[50px] 2xl:text-[60px] leading-none">
                      <span>{item.number}</span>
                      {item.unit}
                    </h3>
                    <p className="mt-[8px] text-white text-[16px] xl:text-[18px]">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentWriterCounter;
