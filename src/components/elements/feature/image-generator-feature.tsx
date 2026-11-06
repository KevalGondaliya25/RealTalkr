"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import { ActionBtnType } from "@/types";

// icon
import { Sparkle } from "lucide-react";

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
      shape1_img: string;
      shape2_img: string;
      card1: {
        enable: boolean;
        text: string;
        image1: string;
        image2: string;
      };
      card2: {
        enable: boolean;
        text: string;
        image: string;
        tag: string;
      };
    };
  };
};

const ImageGeneratorFeature = ({ feature }: Props) => {
  const {
    title,
    details,
    items,
    action_btn,
    shape1_img,
    shape2_img,
    card1,
    card2,
  } = feature.data;

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
        <div className="flex justify-between items-center gap-x-[60px] gap-y-[40px] flex-col md:flex-row">
          <div className="max-w-[431px]">
            <Title1 text={title} className="has_fade_anim" />
            <p className="mt-[32px] has_fade_anim">{details}</p>
            {items && items.length && (
              <div className="mt-[25px] has_fade_anim">
                <ul>
                  {items.map((item, i) => (
                    <li
                      key={`feature_item-${i}`}
                      className="text-[18px] font-medium leading-[1.44] text-white flex gap-1"
                    >
                      <span>
                        <Sparkle size={22} fill="white" strokeWidth={0} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {action_btn && action_btn.enable && (
              <div className="mt-[43px] has_fade_anim">
                <Link
                  href={action_btn.link}
                  className={cn(buttonVariants({ variant: "primary4" }))}
                >
                  <span className="btn-span" data-text={action_btn.label}>
                    {action_btn.label}
                  </span>
                </Link>
              </div>
            )}
          </div>
          <div>
            <div className="w-[360px] lg:w-[510px] xl:w-[560px] 2xl:w-[660px] relative aspect-[100/124] lg:aspect-[100/92]">
              {shape1_img && (
                <div className="absolute top-0 end-0 w-[83%]">
                  <Image
                    width={550}
                    height={556}
                    src={shape1_img}
                    className="rtl_y w-full h-full"
                    alt="shape image"
                  />
                </div>
              )}
              {shape2_img && (
                <div className="absolute top-[4%] start-[4%] w-[83%]">
                  <Image
                    width={550}
                    height={550}
                    src={shape2_img}
                    className="rtl_y w-full"
                    alt="shape image"
                  />
                </div>
              )}
              {card1 && card1.enable && (
                <div
                  className="absolute top-[14%] start-0 flex items-center gap-[20px] max-w-[352px] py-[17px] ps-[22px] pe-[18px] bg-[#ffffff0a] backdrop-blur-[7.5px] rounded-theme"
                  data-speed="0.8"
                >
                  {card1.image1 && (
                    <Image
                      width={46}
                      height={46}
                      src={card1.image1}
                      alt="shape image"
                    />
                  )}
                  <p className="text-[18px] font-medium leading-[1.1] text-white">
                    {card1.text}
                  </p>
                  {card1.image2 && (
                    <Image
                      width={25}
                      height={25}
                      src={card1.image2}
                      alt="shape image"
                    />
                  )}
                </div>
              )}
              {card2 && card2.enable && (
                <div
                  className="absolute bottom-0 end-[8%] max-w-[224px] px-[35px] pt-[27px] pb-[35px] text-center bg-[#ffffff17] backdrop-blur-[5px] rounded-theme flex flex-col items-center"
                  data-speed="1.2"
                >
                  {card2.image && (
                    <Image
                      width={71}
                      height={71}
                      src={card2.image}
                      alt="shape image"
                    />
                  )}
                  <p className="text-[20px] leading-tight font-medium text-white mt-[19px]">
                    {card2.text}
                  </p>
                  <span className="text-[14px] font-bold uppercase text-white px-[27px] py-[13px] bg-[#aeffe21a] rounded-full inline-block mt-[25px]">
                    {card2.tag}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGeneratorFeature;
