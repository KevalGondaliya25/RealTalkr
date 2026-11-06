"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import gsap, { Power1 } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import { markdownify } from "@/lib/helper/convert";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

// components
import Title1 from "@/components/shared/title/title1";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  counter: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      image: string;
      items: {
        number: string;
        extra: string;
        text: string;
      }[];
      action_btn: ActionBtnType;
    };
    content: string;
  };
};

const BookingCounter = ({ counter }: Props) => {
  const { title, sub_title, details, image, items, action_btn } = counter.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(() => {
    gsap.from(gsap.utils.toArray(`.count`), {
      textContent: 0,
      duration: 1.5,
      ease: Power1.easeIn,
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: ".counter__number",
      },
    });
  }, []);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );
  return (
    <section className="py-[70px] md:py-[100px] xl:py-[130px] 2xl:py-[200px]">
      <div className="container" ref={containerRef}>
        <div className="flex justify-between items-center flex-col lg:flex-row gap-x-[80px] gap-y-[40px]">
          <div className="inline-block relative z-[1]">
            <div>
              <Image
                width={630}
                height={665}
                style={{ height: "auto" }}
                src={image}
                alt="counter image"
              />
            </div>
          </div>
          <div className="max-w-[500px] 2xl:max-w-[550px]">
            <div className="has_fade_anim">
              <span
                className="text-[18px] [&>span]:text-theme"
                dangerouslySetInnerHTML={markdownify(sub_title)}
              />
            </div>
            <Title1 text={title} className="mt-[32px] has_fade_anim" />
            <p className="mt-[33px] has_fade_anim">{details}</p>
            {items && items.length && (
              <div className="grid grid-cols-1 md:grid-cols-2 mt-[41px] gap-y-[40px] counter__number has_fade_anim">
                {items[0] && (
                  <div className="pe-0 md:pe-[50px]">
                    <h3 className="text-[30px] leading-[0.86]">
                      {items[0].extra}
                      <span className="count">{items[0].number}</span>
                    </h3>
                    <p className="text-[18px] leading-[1.16] mt-[19px]">
                      {items[0].text}
                    </p>
                  </div>
                )}
                {items[1] && (
                  <div className="ps-0 md:ps-[50px] border-s-0 md:border-s border-border">
                    <h3 className="text-[30px] leading-[0.86]">
                      {items[1].extra}
                      <span className="count">{items[1].number}</span>
                    </h3>
                    <p className="text-[18px] leading-[1.16] mt-[19px]">
                      {items[1].text}
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-[46px] has_fade_anim">
              {action_btn && action_btn.enable && (
                <Link
                  href={action_btn.link}
                  className={cn(buttonVariants({ variant: "primary" }))}
                >
                  <span className="btn-span" data-text={action_btn.label}>
                    {action_btn.label}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCounter;
