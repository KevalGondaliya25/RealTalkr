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
  about: {
    data: {
      title: string;
      details: string;
      image1: string;
      image2: string;
      shape1_img: string;
      action_btn: ActionBtnType;
    };
  };
};

const MeetingHomeAbout = ({ about }: Props) => {
  const { title, details, image1, image2, shape1_img, action_btn } = about.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[60px] md:pt-[80px] xl:pt-[100px] 2xl:pt-[130px]">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-x-[80px] gap-y-[40px]">
          <div className="relative min-w-[280px]">
            <div className="absolute top-[7%] start-[6%] w-[38%] z-[1] drop-shadow-1">
              {image1 && (
                <Image
                  width={211}
                  height={300}
                  src={image1}
                  data-speed="0.8"
                  alt="app image"
                />
              )}
            </div>
            <div className="absolute bottom-0 end-[6%] w-[82%] drop-shadow-2">
              {image2 && (
                <Image width={456} height={358} src={image2} alt="app image" />
              )}
            </div>
            <div className="shape-main">
              {shape1_img && (
                <Image
                  width={550}
                  height={473}
                  src={shape1_img}
                  alt="gallery image"
                />
              )}
            </div>
          </div>
          <div>
            <Title1 text={title} className="has_fade_anim" />
            <p className="mt-[27px] has_fade_anim">{details}</p>
            {action_btn && action_btn.enable && (
              <div className="mt-[40px] has_fade_anim">
                <Link
                  href={action_btn.link}
                  className={cn(
                    buttonVariants({ variant: "link", size: "auto" })
                  )}
                >
                  <span className="btn-span" data-text={action_btn.label}>
                    {action_btn.label}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingHomeAbout;
