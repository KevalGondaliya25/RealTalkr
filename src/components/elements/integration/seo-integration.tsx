"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// lib
import { cn } from "@/lib/utils";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  integration: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      count: {
        enable: boolean;
        number: number;
        unit: string;
        text: string;
      };
      items: string[];
      action_btn: ActionBtnType;
    };
  };
};

const SEOIntegration = ({ integration }: Props) => {
  const { title, sub_title, details, count, items, action_btn } =
    integration.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space1 bg-[#F7FAF9]">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          sub_title={sub_title}
          details={details}
          titleClassName="max-w-[600px]"
          detailsClassName="max-w-[700px]"
        />
        {items && items.length && (
          <div className="flex flex-col lg:flex-row justify-center items-center gap-[30px] mt-[33px] xl:mt-[43px] 2xl:mt-[63px]">
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-[20px] has_fade_anim">
              {items.slice(0, items.length / 2).map((item, i) => (
                <div
                  key={`integration_item-${i}`}
                  className="w-[70px] xl:w-[100px] 2xl:w-[125px] rounded-[15px] 2xl:rounded-[30px] aspect-[100/98] bg-white flex justify-center items-center shadow-integration"
                >
                  <Image
                    width={58}
                    height={58}
                    className="w-[35px] lg:w-[45px] xl:w-[58px] h-[35px] lg:h-[45px] xl:h-[58px] object-contain"
                    src={item}
                    alt="app icon"
                  />
                </div>
              ))}
            </div>
            <div
              className="w-[250px] lg:w-[300px] min-w-[250px] lg:min-w-[300px] h-[250px] lg:h-[300px] bg-white flex justify-center items-center flex-col rounded-full order-1 lg:order-0 has_fade_anim"
              data-delay="0.25"
            >
              {count && count.enable && (
                <>
                  <h3 className="text-[40px] xl:text-[60px] font-bold leading-none">
                    {count.number}
                    {count.unit}
                  </h3>
                  <p className="text-[18px] font-medium text-primary">
                    {count.text}
                  </p>
                </>
              )}
              {action_btn && action_btn.enable && (
                <div className="mt-[25px]">
                  <Link
                    href={action_btn.link}
                    className={cn(buttonVariants({ variant: "primary6" }))}
                  >
                    <span className="btn-span" data-text={action_btn.label}>
                      {action_btn.label}
                    </span>
                  </Link>
                </div>
              )}
            </div>
            <div
              className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-[20px] order-0 lg:order-1 has_fade_anim"
              data-delay="0.35"
            >
              {items.slice(items.length / 2, items.length).map((item, i) => (
                <div
                  key={`integration_item-${i}`}
                  className="w-[70px] xl:w-[100px] 2xl:w-[125px] rounded-[15px] 2xl:rounded-[30px] aspect-[100/98] bg-white flex justify-center items-center shadow-integration"
                >
                  <Image
                    width={58}
                    height={58}
                    className="w-[35px] lg:w-[45px] xl:w-[58px] h-[35px] lg:h-[45px] xl:h-[58px] object-contain"
                    src={item}
                    alt="app icon"
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

export default SEOIntegration;
