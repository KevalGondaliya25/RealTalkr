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

// compnents
import Title1 from "@/components/shared/title/title1";

type Props = {
  banner: {
    data: {
      title: string;
      details: string;
      image: string;
      action_btn: ActionBtnType;
    };
  };
};

const VideoEditorBanner = ({ banner }: Props) => {
  const { title, details, image, action_btn } = banner.data;

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
        <div className="bg-[#ABADED] rounded-theme p-[30px] xl:p-[60px] 2xl:p-[80px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center gap-[24px]">
            <div>
              <Title1 text={title} className="has_fade_anim mb-[30px]" />
              <p className="mb-[23px] text-primary has_fade_anim">{details}</p>
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
            </div>
            <div className="col-span-1 xl:col-span-2 flex justify-end">
              {image && (
                <Image
                  width={659}
                  height={500}
                  src={image}
                  className="rounded-theme"
                  alt="video"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoEditorBanner;
