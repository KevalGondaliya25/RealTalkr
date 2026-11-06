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

type Props = {
  integration: {
    data: {
      title: string;
      image: string;
      action_btn: ActionBtnType;
    };
  };
};

const MarketingIntegration = ({ integration }: Props) => {
  const { title, image, action_btn } = integration.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space1">
      <div className="container" ref={containerRef}>
        <div className="max-w-[568px] mx-auto text-center relative">
          <div className="pb-[15px] md:pb-[35px]">
            <h2 className="sec_title2 has_fade_anim">{title}</h2>
          </div>
          {action_btn && action_btn.enable && (
            <div className="has_fade_anim" data-delay="0.45">
              <Link
                href={action_btn.link}
                className={cn(
                  buttonVariants({ variant: "normal", size: "auto" }),
                  "flex text-primary hover:text-theme text-[18px] md:text-[21px]"
                )}
              >
                <span data-text={action_btn.label}>{action_btn.label}</span>
                <span className="rtl_y">
                  <ChevronRight />
                </span>
              </Link>
            </div>
          )}
        </div>
        {image && (
          <div className="mt-0 lg:-mt-[150px] has_fade_anim">
            <Image width={1350} height={534} src={image} alt="tools-image" />
          </div>
        )}
      </div>
    </section>
  );
};

export default MarketingIntegration;
