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
      sub_title: string;
      details: string;
      action_btn1: ActionBtnType;
      action_btn2: ActionBtnType;
    };
  };
};

const CTA6 = ({ cta }: Props) => {
  const { title, sub_title, details, action_btn1, action_btn2 } = cta.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_top2">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          sub_title={sub_title}
          details={details}
          titleClassName="max-w-[670px]"
          detailsClassName="max-w-[700px]"
        />
        <div className="flex gap-5 justify-center flex-col md:flex-row mt-[33px] xl:mt-[43px] has_fade_anim">
          {action_btn1 && action_btn1.enable && (
            <Link
              href={action_btn1.link}
              className={cn(buttonVariants({ variant: "primary6" }))}
            >
              <span className="btn-span" data-text={action_btn1.label}>
                {action_btn1.label}
              </span>
            </Link>
          )}
          {action_btn2 && action_btn2.enable && (
            <Link
              href={action_btn2.link}
              className={cn(
                buttonVariants({ variant: "primary6" }),
                "bg-btn-bg-hover"
              )}
            >
              <span className="btn-span" data-text={action_btn2.label}>
                {action_btn2.label}
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTA6;
