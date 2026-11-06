"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// icons
import { FaPlay } from "react-icons/fa6";

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
import VideoModal from "@/components/tools/video-modal";
import RattingStar from "../rating/ratting-star";

type Props = {
  hero: {
    data: {
      title: string;
      details: string;
      video: string;
      video_label: string;
      image1: string;
      image2: string;
      image3: string;
      shape: string;
      action_btn: ActionBtnType;
      review: {
        enable: boolean;
        number: number;
        text: string;
        image: string;
      };
    };
  };
};

const StartupHero = ({ hero }: Props) => {
  const {
    title,
    details,
    video,
    video_label,
    image1,
    image2,
    image3,
    shape,
    action_btn,
    review,
  } = hero.data;

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  const closeDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="bg-[#EEF3E9] pt-[120px] pb-[50px] md:pt-[125px] lg:pb-[120px] xl:pt-[230px]">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-y-[25px] md:gap-y-[50px]">
          <div className="col-span-1 xl:col-span-5">
            <h1 className="pb-5 md:pb-[30px] text-[35px] md:text-[60px] xl:text-[100px] !leading-[0.9] has_fade_anim">
              {title}
            </h1>
            <p className="pb-5 md:pb-[40px] has_fade_anim" data-delay="0.30">
              {details}
            </p>
            <div
              className="pb-5 lg:pb-[35px] xl:pb-[50px] flex items-center gap-[20px] has_fade_anim"
              data-delay="0.45"
            >
              {action_btn && action_btn.enable && (
                <Link
                  href={action_btn.link}
                  className={cn(buttonVariants({ variant: "primary2" }))}
                >
                  {action_btn.label}
                </Link>
              )}
              {video && (
                <div className="flex items-center gap-[10px]">
                  <div
                    className="w-[50px] md:w-[56px] h-[50px] md:h-[56px] flex justify-center items-center border md:border-[1.5px] border-primary hover:border-theme rounded-full transition-all duration-500 text-primary hover:text-theme"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <FaPlay />
                  </div>
                  <p className="text-[16px] font-bold text-primary">
                    {video_label}
                  </p>
                </div>
              )}
            </div>

            {review && review.enable && (
              <div
                className="flex items-center gap-[15px] has_fade_anim"
                data-delay="0.60"
              >
                <Image width={55} height={55} src={review.image} alt="Brand" />
                <div>
                  <div className="flex gap-[8px] justify-center items-center">
                    <h3 className="text-[36px]">{review.number}</h3>
                    <RattingStar number={review.number} />
                  </div>
                  <p className="text-[16px] text-primary">{review.text}</p>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-1 xl:col-span-7">
            <div className="relative grid gap-[10px] lg:gap-[20px] grid-cols-2 xl:grid-cols-[310px_300px] justify-end items-center lg:items-start max-w-full lg:max-w-[500px] xl:max-w-full pb-[30px] md:pb-0 z-[2]">
              {shape && (
                <Image
                  width={700}
                  height={606}
                  src={shape}
                  className="hidden lg:block absolute -top-[7px] start-[90px] -z-[2] rtl_y"
                  alt="intro-thumb"
                />
              )}
              {image1 && (
                <Image
                  width={310}
                  height={505}
                  src={image1}
                  data-speed="0.8"
                  alt="robot image"
                />
              )}
              <div className="flex flex-col gap-[10px] lg:gap-[20px] pt-[50px]">
                {image2 && (
                  <Image
                    width={300}
                    height={230}
                    src={image2}
                    className="rounded-theme"
                    alt="robot image"
                    data-speed="1.1"
                  />
                )}
                {image3 && (
                  <Image
                    width={300}
                    height={309}
                    src={image3}
                    className="rounded-theme"
                    alt="robot image"
                    data-speed="1.1"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <VideoModal link={video} isOpen={isOpen} close={closeDialog} />
    </section>
  );
};

export default StartupHero;
