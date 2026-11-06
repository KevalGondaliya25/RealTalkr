"use client";

import { useRef } from "react";
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
  cta: {
    data: {
      title: string;
      details: string;
      action_btn: ActionBtnType;
    };
  };
};

const CTA4 = ({ cta }: Props) => {
  const { title, details, action_btn } = cta.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[66px] md:pt-[89px] xl:pt-[115px] 2xl:pt-[139px] sec_space_bottom3">
      <div className="container" ref={containerRef}>
        <div className="pt-[55px] md:pt-[80px] xl:pt-[106px] 2xl:pt-[131px] border-t border-border">
          <TitleSection2
            title={title}
            details={details}
            titleClassName="max-w-[600px]"
            detailsClassName="max-w-[550px]"
          />
          {action_btn && action_btn.enable && (
            <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] flex justify-center items-center has_fade_anim">
              <Link
                href={action_btn.link}
                className={cn(
                  buttonVariants({ variant: "primary5", size: "lg" })
                )}
              >
                <span className="btn-span" data-text={action_btn.label}>
                  {action_btn.label}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTA4;
