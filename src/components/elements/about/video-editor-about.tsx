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
  about: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      image: string;
      action_btn: ActionBtnType;
      features: string[];
    };
  };
};

const VideoEditorAbout = ({ about }: Props) => {
  const { title, sub_title, details, image, action_btn, features } = about.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_top4">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]">
          <div>
            <p
              className="pb-[15px] [&>span]:text-action has_fade_anim"
              dangerouslySetInnerHTML={markdownify(sub_title)}
            />

            <Title1 text={title} className="mb-[30px] has_fade_anim" />
            <p className="pb-[25px] lg:pb-[40px] has_fade_anim">{details}</p>
            {action_btn && action_btn.enable && (
              <div className="has_fade_anim">
                <Link
                  href={action_btn.link}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "xxl" })
                  )}
                >
                  {action_btn.label}
                </Link>
              </div>
            )}
            {features && features.length && (
              <ul className="mt-[30px]">
                {features.map((item, i) => (
                  <li
                    key={`feature_item-${i}`}
                    className="text-[18px] leading-[1.44] flex items-center gap-[10px]"
                  >
                    <Image
                      width={15}
                      height={16}
                      src="/assets/imgs/icon/check-3.png"
                      className="h-[16px] rtl_y"
                      alt="icon image"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-span-1 xl:col-span-2 flex justify-end">
            {image && (
              <Image
                width={550}
                height={551}
                src={image}
                data-speed="0.9"
                alt="image"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoEditorAbout;
