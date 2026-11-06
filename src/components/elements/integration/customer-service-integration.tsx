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

// shadch components
import { buttonVariants } from "@/components/ui/button";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  integration: {
    data: {
      title: string;
      details: string;
      bg_shape: string;
      items: string[];
      action_btn: ActionBtnType;
    };
  };
};

const CustomerServiceIntegration = ({ integration }: Props) => {
  const { title, details, bg_shape, items, action_btn } = integration.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[43px] md:pt-[73px] xl:pt-[103px] 2xl:pt-[173px] sec_space_bottom1">
      <div className="container" ref={containerRef}>
        <div className="relative z-[1]">
          {bg_shape && (
            <div className="hidden md:block absolute w-full h-auto -z-[1] left-[50%] -translate-x-[50%] -top-[73px] xl:-top-[103px] 2xl:-top-[173px]">
              <Image
                width={1281}
                height={1007}
                src={bg_shape}
                alt="shape image"
              />
            </div>
          )}

          <TitleSection2
            title={title}
            details={details}
            titleClassName="max-w-[500px]"
          />

          {items && items.length && (
            <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[65px] mx-auto max-w-[1140px] flex flex-wrap justify-center gap-5 has_fade_anim">
              {items.map((item, i) => (
                <div
                  key={`integration_item-${i}`}
                  className="w-[70px] xl:w-[100px] 2xl:w-[125px] rounded-[15px] 2xl:rounded-[30px] aspect-[100/98] bg-white flex justify-center items-center shadow-integration"
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
          {action_btn && action_btn.enable && (
            <div className="mt-[30px] xl:mt-[50px] 2xl:mt-[65px] flex justify-center has_fade_anim">
              <Link
                href={action_btn.link}
                className={cn(
                  buttonVariants({ variant: "link", size: "auto" })
                )}
              >
                <span data-text={action_btn.label}>{action_btn.label}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerServiceIntegration;
