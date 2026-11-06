"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  integration: {
    data: {
      title: string;
      details: string;
      items: string[];
      action_btn?: ActionBtnType;
    };
    content: string;
  };
};

const MeetingIntegration = ({ integration }: Props) => {
  const { title, details, items, action_btn } = integration.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[51px] md:pt-[81px] xl:pt-[111px] 2xl:pt-[181px]">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[700px]"
          html
        />
        {items && items.length && (
          <div className="mt-[33px] xl:mt-[53px] 2xl:mt-[63px] mx-auto max-w-[1140px] flex flex-wrap justify-center gap-5 has_fade_anim">
            {items.map((item, i) => (
              <div
                key={`integration_item-${i}`}
                className="w-[70px] xl:w-[100px] 2xl:w-[125px] rounded-[30px] 2xl:rounded-[30px] aspect-[100/98] bg-white flex justify-center items-center border border-border"
              >
                <Image
                  width={58}
                  height={58}
                  className="w-[35px] lg:w-[45px] xl:w-[58px] h-[35px] lg:h-[45px] xl:h-[58px] object-contain"
                  src={item}
                  alt="app icon"
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-[30px] xl:mt-[50px] 2xl:mt-[70px] has_fade_anim">
          {action_btn && action_btn.enable && (
            <Link
              href={action_btn.link}
              className={cn(buttonVariants({ variant: "primary2" }))}
            >
              <span className="btn-span" data-text={action_btn.label}>
                {action_btn.label}
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default MeetingIntegration;
