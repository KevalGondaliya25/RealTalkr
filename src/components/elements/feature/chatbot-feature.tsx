"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { markdownify } from "@/lib/helper/convert";
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
      image1: string;
      image2: string;
      items: string[];
      feature_items: {
        icon: string;
        text: string;
      }[];
      action_btn: ActionBtnType;
    };
  };
};

const ChatbotFeature = ({ feature }: Props) => {
  const { title, details, image1, image2, items, feature_items, action_btn } =
    feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section
      className="grid grid-cols-1 xl:grid-cols-2 gap-[20px]"
      ref={containerRef}
    >
      <div className="bg-sec_bg-2 rounded-theme px-[30px] md:px-[50px] xl:px-[70px] 2xl:px-[130px] pt-[48px] md:pt-[68px] xl:pt-[88px] 2xl:pt-[118px] sec_space_bottom2">
        <Title1 text={title} className="has_fade_anim" />
        <p className="mt-[25px] has_fade_anim">{details}</p>
        {items && items.length && (
          <div className="mt-[27px] has_fade_anim">
            {items.map((item, i) => (
              <div key={`item_${i}`} className="flex gap-[10px]">
                <Image
                  width={12}
                  height={13}
                  src="/assets/imgs/icon/check.png"
                  className="w-[12px] h-[13px] min-w-[12px] mt-[4px]"
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
          <div className="mt-[48px] has_fade_anim">
            <Link
              href={action_btn.link}
              className={cn(buttonVariants({ variant: "primary3" }))}
            >
              <span className="btn-span uppercase" data-text={action_btn.label}>
                {action_btn.label}
              </span>
            </Link>
          </div>
        )}
      </div>
      <div className="bg-[#FBDBDB] rounded-theme px-[30px] md:px-[50px] xl:px-[70px] 2xl:px-[130px] pt-[68px] lg:pt-[80px] pb-5">
        <div className="relative pt-[50px]">
          <div className="absolute top-0 end-[55px]">
            {image2 && (
              <Image
                width={250}
                height={333}
                src={image2}
                data-speed="0.9"
                alt="dialog image"
              />
            )}
          </div>
          <div>
            {image1 && (
              <Image width={660} height={485} src={image1} alt="dialog image" />
            )}
          </div>
        </div>
        {feature_items && feature_items.length && (
          <div className="mt-[40px] 2xl:mt-[80px] flex flex-wrap items-start gap-[10px]">
            {feature_items.map((item, i) => (
              <div
                key={`feature_item-${i}`}
                className="bg-white rounded-[10px] px-[9px] py-[5px] flex gap-[10px]"
              >
                <Image
                  width={14}
                  height={15}
                  src={item.icon}
                  className="h-[15px]"
                  alt="imoji icon"
                />
                <p className="text-[14px]">{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatbotFeature;
