"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// icons
import { ChevronRight } from "lucide-react";

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
  hero: {
    data: {
      title: string;
      details: string;
      image: string;
      shape1_img: string;
      action_btn: ActionBtnType;
    };
    content: string;
  };
};

const IntegrationHero = ({ hero }: Props) => {
  const { title, details, image, shape1_img, action_btn } = hero.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[25px] md:pt-[35px] xl:pt-[65px] 2xl:pt-[135px] relative">
      {shape1_img && (
        <div className="absolute top-[80%] start-0">
          <Image
            width={1105}
            height={826}
            src={shape1_img}
            className="rtl_y"
            alt="shape image"
          />
        </div>
      )}
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          heading
          titleClassName="max-w-full"
        />
        {action_btn && action_btn.enable && (
          <div className="has_fade_anim" data-delay="0.45">
            <Link
              href={action_btn.link}
              className={cn(
                buttonVariants({ variant: "normal", size: "auto" }),
                "mt-[32px] lg:mt-[42px] xl:mt-[52px] 2xl:mt-[62px] flex text-primary hover:text-theme text-[18px] md:text-[21px]"
              )}
            >
              <span data-text={action_btn.label}>{action_btn.label}</span>
              <span className="rtl_y">
                <ChevronRight />
              </span>
            </Link>
          </div>
        )}
        <div
          className="-mt-[65px] md:-mt-[165px] lg:-mt-[245px] xl:-mt-[285px] 2xl:-mt-[335px] relative -z-[1] has_fade_anim"
          data-delay="0.60"
        >
          {image && (
            <Image width={1296} height={722} src={image} alt="gallery image" />
          )}
        </div>
      </div>
    </section>
  );
};

export default IntegrationHero;
