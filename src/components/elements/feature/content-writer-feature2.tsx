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
  feature: {
    data: {
      title: string;
      details: string;
      items: string[];
      action_btn: ActionBtnType;
      shape: string;
      image: string;
      card: {
        enable: boolean;
        icon: string;
        text: string;
      };
    };
  };
};

const ContentWriterFeature2 = ({ feature }: Props) => {
  const { title, details, items, action_btn, shape, image, card } =
    feature.data;

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
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[0.9fr_1fr] gap-[40px] items-end rounded-theme border border-border bg-gradient-89 from-[#051119] from-[0.54%] to-[#0D1422] to-[100.66%]">
          <div className="mt-[35px] lg:mt-[55px] xl:mt-[95px] mb-[28px] lg:mb-[58px] xl:mb-[98px] mx-[30px] lg:mx-[40px] xl:mx-[80px]">
            <Title1 text={title} className="has_fade_anim" />
            <p className="mt-[24px] has_fade_anim">{details}</p>
            {items && items.length && (
              <div className="mt-[28px] grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[10px]">
                {items.map((item, i) => (
                  <div
                    key={`feature_item-${i}`}
                    className="flex items-start gap-[10px] has_fade_anim"
                  >
                    <span className="w-[20px] min-w-[20px] mt-[4px]">
                      <Image
                        width={20}
                        height={20}
                        src="/assets/imgs/icon/check-7.png"
                        className="rtl_y"
                        alt="icon image"
                      />
                    </span>
                    <p className="font-medium text-white">{item}</p>
                  </div>
                ))}
              </div>
            )}
            {action_btn && action_btn.enable && (
              <div className="mt-[45px] has_fade_anim">
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
          </div>
          <div>
            <div className="relative aspect-[100/105] min-w-[460px] xl:min-w-[350px] ml-auto xl:ml-0">
              {shape && (
                <div className="absolute start-[7%] top-[10%] w-[27%]">
                  <Image
                    width={179}
                    height={343}
                    src="/assets/imgs/shape/shape-s-40.png"
                    alt="shape image"
                  />
                </div>
              )}
              {image && (
                <div className="absolute w-[87%] h-full top-0 start-[12%]">
                  <Image
                    width={558}
                    height={676}
                    src={image}
                    alt="gallery image"
                  />
                </div>
              )}
              {card && card.enable && (
                <div className="absolute start-0 bottom-[7%] flex items-center gap-[15px] max-w-[300px] py-[17px] ps-[22px] pe-[18px] bg-[#ffffff0a] backdrop-blur-[7.5px] rounded-theme">
                  {card.icon && (
                    <Image
                      width={46}
                      height={46}
                      src={card.icon}
                      alt="shape image"
                    />
                  )}
                  <p className="text-[18px] font-medium leading-[1.1] text-white">
                    {card.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentWriterFeature2;
