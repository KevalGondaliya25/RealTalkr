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

type Props = {
  hero: {
    data: {
      title: string;
      details: string;
      action_btn: ActionBtnType;
      shape: string;
      tag: string;
      image: string;
      video: string;
      offer: {
        enable: boolean;
        text: string;
        action_btn: ActionBtnType;
      };
    };
  };
};

const VideoEditorHero = ({ hero }: Props) => {
  const { title, details, action_btn, shape, tag, image, video, offer } =
    hero.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef}>
      <div className="pt-[105px] md:pt-[140px] xl:pt-[180px] 2xl:pt-[218px] pb-[300px] md:pb-[497px] bg-[#C1F4E2] bg-[url('/assets/imgs/shape/shape-r-12.png')] bg-no-repeat">
        <div className="absolute top-0 left-[377px]">
          <Image
            width={853}
            height={575}
            src="/assets/imgs/shape/shape-r-11.png"
            alt="shape"
          />
        </div>
        <div className="container">
          <div className="text-center max-w-[750px] mx-auto relative pb-[40px] md:pb-0">
            <h1 className="mb-[30px] !leading-[0.9] text-[45px] md:text-[55px] xl:text-[75px] 2xl:text-[120px] has_fade_anim">
              {title}
            </h1>
            <p
              className="mb-[20px] md:mb-[35px] lg:mb-[38px] text-primary text-[18px] md:text-[22px] has_fade_anim"
              data-delay="0.30"
            >
              {details}
            </p>
            {action_btn && action_btn.enable && (
              <div className="has_fade_anim" data-delay="0.45">
                <Link
                  href={action_btn.link}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "xxl" }),
                    "border-2 border-theme"
                  )}
                >
                  {action_btn.label}
                </Link>
              </div>
            )}
          </div>
          <div className="hidden lg:block max-w-[150px] text-center ms-0 2xl:-ms-[150px] -mt-[50px] -rotate-[26deg] rtl:rotate-[26deg]">
            <p
              className="text-[18px] text-primary has_fade_anim"
              data-delay="0.60"
            >
              {tag}
            </p>
          </div>
        </div>
      </div>
      <div
        className="relative mx-auto max-w-[90%] md:max-w-[80%] lg:max-w-[90%] xl:max-w-[1290px] -mt-[306px] md:-mt-[500px] has_fade_anim"
        data-delay="0.75"
      >
        {image && (video || (offer && offer.enable)) && (
          <div className="absolute top-[20%] md:top-[82px] right-[3%] md:right-[13px] lg:top-[123px] lg:right-[18px] xl:top-[171px] xl:right-[46px] before:absolute before:top-0 before:left-0 before:z-[1] before:bg-[url('/assets/imgs/hero/video-editor/video-shape.png')] before:w-full before:h-full before:bg-no-repeat before:bg-[length:37vw_100%] md:before:bg-[length:290px_186px] lg:before:bg-[length:440px_275px] xl:before:bg-cover w-[37vw] h-[43%] md:w-[290px] md:h-[186px] lg:w-[440px] lg:h-[275px] xl:w-[588px] xl:h-[390px]">
            {video && (
              <video
                className="h-full object-cover p-[1.5px] md:p-[4px] lg:p-[5px] xl:p-[8px]"
                src={video}
                autoPlay
                loop
                muted
              ></video>
            )}
            {offer && offer.enable && (
              <div className="absolute top-[15px] left-[10px] md:top-[16px] md:left-[20px] lg:top-[20px] lg:left-[30px] xl:top-[91px] xl:left-[57px] z-[3]">
                <h2 className="max-w-[80px] md:max-w-[125px] lg:max-w-[200px] xl:max-w-[220px] !text-white text-[10px] md:text-[22px] lg:text-[36px]">
                  {offer.text}
                </h2>
                {offer.action_btn && offer.action_btn.enable && (
                  <div className="mt-[6px] lg:mt-[15px] xl:mt-[32px]">
                    <Link
                      href={offer.action_btn.link}
                      className="px-[10px] md:px-[15px] lg:px-[25px] py-[5px] md:py-[8px] lg:py-[14px] text-[8px] md:text-[14px] lg:text-[16px] font-bold leading-none text-primary hover:text-primary capitalize transition-all duration-300 bg-[#FFEDBD] hover:bg-[#FFEDBD] rounded-[15px] perspective-1000 overflow-hidden z-[1] gap-[30px] inline-block"
                    >
                      {offer.action_btn.label}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {image && (
          <Image width={1290} height={893} src={image} alt="banner-image" />
        )}
        {shape && (
          <div className="hidden 2xl:block absolute top-[50px] -start-[100px]">
            <Image
              width={67}
              height={122}
              src={shape}
              className="rtl_y"
              alt="shape"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoEditorHero;
