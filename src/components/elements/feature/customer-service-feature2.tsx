"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
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

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
      image1: string;
      image2: string;
      image3: string;
      shape1_img: string;
      items: string[];
      action_btn: ActionBtnType;
    };
  };
};

const CustomerServiceFeature2 = ({ feature }: Props) => {
  const {
    title,
    details,
    image1,
    image2,
    image3,
    shape1_img,
    items,
    action_btn,
  } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space">
      <div className="container" ref={containerRef}>
        <div className="relative flex gap-[50px] justify-between items-center flex-col lg:flex-row">
          {shape1_img && (
            <div className="absolute top-[167px] end-[calc(100%+47px)] w-[166px]">
              <Image
                width={166}
                height={166}
                src={shape1_img}
                data-speed="1.2"
                alt="shape image"
              />
            </div>
          )}
          <div>
            <div className="relative w-full lg:w-[460px] xl:w-[560px] 2xl:w-[660px] aspect-[100/95]">
              <div className="w-full md:w-[83%] mx-auto">
                {image1 && (
                  <Image
                    width={551}
                    height={629}
                    src={image1}
                    className="h-full"
                    alt="gallery image"
                  />
                )}
              </div>
              <div className="absolute top-[51%] end-0 drop-shadow-4 w-[70%] md:w-auto">
                {image2 && (
                  <Image
                    width={341}
                    height={92}
                    src={image2}
                    alt="gallery image"
                  />
                )}
              </div>
              <div className="absolute top-[68%] end-[6%] drop-shadow-4 w-[70%] md:w-auto">
                {image3 && (
                  <Image
                    width={341}
                    height={92}
                    src={image3}
                    alt="gallery image"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="max-w-[520px]">
            <Title1 text={title} className="has_fade_anim" />
            <p className="mt-[28px] has_fade_anim">{details}</p>
            {items && items.length && (
              <div className="mt-[27px] has_fade_anim">
                {items.map((item, i) => (
                  <div key={`item_${i}`} className="flex gap-[10px]">
                    <Image
                      width={12}
                      height={12}
                      src="/assets/imgs/icon/check-6.png"
                      className="w-[12px] h-[12px] min-w-[12px] mt-[4px]"
                      alt="icon image"
                    />
                    <p
                      className="[&>span]:font-medium [&>span]:text-primary"
                      dangerouslySetInnerHTML={markdownify(item)}
                    />
                  </div>
                ))}
              </div>
            )}
            {action_btn && action_btn.enable && (
              <div className="mt-[43px] has_fade_anim">
                <Link
                  href={action_btn.link}
                  className={cn(buttonVariants({ variant: "primary" }))}
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

export default CustomerServiceFeature2;
