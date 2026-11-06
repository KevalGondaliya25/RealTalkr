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
  className?: string;
  btnClassName?: string;
  animatedBtn?: boolean;
};

const CTA3 = ({ cta, className, btnClassName, animatedBtn = false }: Props) => {
  const { title, details, action_btn } = cta.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section
      className={cn(
        "sec_space_bottom1 pt-[50px] md:pt-[80px] xl:pt-[110px] 2xl:pt-[180px]",
        className
      )}
    >
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          html
          titleClassName="max-w-[650px]"
        />
        {action_btn && action_btn.enable && (
          <div className="mt-[33px] xl:mt-[43px] flex justify-center items-center has_fade_anim">
            <Link
              href={action_btn.link}
              className={cn(
                buttonVariants({ variant: "outline" }),
                btnClassName
              )}
            >
              {animatedBtn ? (
                <span className="btn-span" data-text={action_btn.label}>
                  {action_btn.label}
                </span>
              ) : (
                action_btn.label
              )}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CTA3;
