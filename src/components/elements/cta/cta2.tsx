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
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  cta: {
    data: {
      title: string;
      details: string;
      action_btn1: ActionBtnType;
      action_btn2: ActionBtnType;
      shape1_img: string;
      shape2_img: string;
    };
    content: string;
  };
};

const CTA2 = ({ cta }: Props) => {
  const { title, details, action_btn1, action_btn2, shape1_img, shape2_img } =
    cta.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_bottom">
      <div className="container" ref={containerRef}>
        <div className="flex justify-center items-center text-center relative overflow-hidden rounded-theme bg-sec_bg px-[15px] py-[50px] md:py-[70px] lg:py-[120px]">
          {shape1_img && (
            <div className="absolute left-0">
              <Image
                width={560}
                height={552}
                style={{ height: "auto" }}
                src={shape1_img}
                alt="shape"
              />
            </div>
          )}
          {shape2_img && (
            <div className="absolute right-[40px] top-[200px]">
              <Image width={180} height={161} src={shape2_img} alt="shape" />
            </div>
          )}
          <div className="max-w-[500px] mx-auto relative z-[2]">
            <TitleSection2
              title={title}
              details={details}
              detailsClassName="mb-[28px] lg:mb-[43px]"
            />
            <div className="flex gap-5 justify-center flex-col md:flex-row has_fade_anim">
              {action_btn1 && action_btn1.enable && (
                <Link
                  href={action_btn1.link}
                  className={cn(buttonVariants({ variant: "primary" }))}
                >
                  {action_btn1.label}
                </Link>
              )}
              {action_btn2 && action_btn2.enable && (
                <Link
                  href={action_btn2.link}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  {action_btn2.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA2;
