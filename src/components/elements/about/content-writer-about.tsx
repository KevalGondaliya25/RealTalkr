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
  about: {
    data: {
      title: string;
      details: string;
      card1: {
        enable: true;
        title: string;
        short_description: string;
        image: string;
        action_btn: ActionBtnType;
      };
      card2: {
        enable: true;
        title: string;
        short_description: string;
        image: string;
        action_btn: ActionBtnType;
      };
    };
  };
};

const ContentWriterAbout = ({ about }: Props) => {
  const { title, details, card1, card2 } = about.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[55px] md:pt-[80px] xl:pt-[106px] 2xl:pt-[131px]">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[650px]"
          detailsClassName="max-w-[780px]"
        />
        <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] grid grid-cols-1 md:grid-cols-2 gap-[30px]">
          <div className="bg-[#121B21] border border-border rounded-theme pt-[25px] lg:pt-[45px] pb-[30px] lg:pb-[50px] px-[25px] lg:px-[50px]">
            {card1 && card1.enable && (
              <>
                {card1.image && (
                  <div className="has_fade_anim" data-fade-offset="0">
                    <Image
                      width={530}
                      height={345}
                      src={card1.image}
                      alt="activity image"
                    />
                  </div>
                )}
                <div className="mt-[49px]">
                  <h3 className="text-[26px] lg:text-[36px] has_fade_anim">
                    {card1.title}
                  </h3>
                  <p className="mt-[15px] has_fade_anim">
                    {card1.short_description}
                  </p>
                  {card1.action_btn && card1.action_btn.enable && (
                    <div className="mt-[31px] has_fade_anim">
                      <Link
                        href={card1.action_btn.link}
                        className={cn(
                          buttonVariants({ variant: "link", size: "auto" }),
                          "hover:text-primary"
                        )}
                      >
                        <span
                          className="btn-span"
                          data-text={card1.action_btn.label}
                        >
                          {card1.action_btn.label}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="bg-[#121B21] border border-border rounded-theme pt-[28px] lg:pt-[48px] px-[25px] lg:px-[50px]">
            {card2 && card2.enable && (
              <>
                <div>
                  <h3 className="text-[26px] lg:text-[36px] has_fade_anim">
                    {card2.title}
                  </h3>
                  <p className="mt-[15px] has_fade_anim">
                    {card2.short_description}
                  </p>
                  {card2.action_btn && card2.action_btn.enable && (
                    <div className="mt-[31px] has_fade_anim">
                      <Link
                        href={card2.action_btn.link}
                        className={cn(
                          buttonVariants({ variant: "link", size: "auto" }),
                          "hover:text-primary"
                        )}
                      >
                        <span
                          className="btn-span"
                          data-text={card2.action_btn.label}
                        >
                          {card2.action_btn.label}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
                {card2.image && (
                  <div className="mt-[60px] has_fade_anim" data-fade-offset="0">
                    <Image
                      width={530}
                      height={830}
                      src={card2.image}
                      alt="activity image"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentWriterAbout;
