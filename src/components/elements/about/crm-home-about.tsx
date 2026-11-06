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

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  about: {
    data: {
      title: string;
      details: string;
      image: string;
      action_btn: ActionBtnType;
    };
  };
};

const CRMHomeAbout = ({ about }: Props) => {
  const { title, details, image, action_btn } = about.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[60px] md:pt-[100px] lg:pt-[150px] xl:pt-[200px]">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-6 items-center">
          <div className="order-2 lg:order-1">
            {image && (
              <Image
                width={630}
                height={700}
                src={image}
                className="rounded-[40px]"
                alt="community-thumb"
                data-speed="1.2"
              />
            )}
          </div>
          <div className="order-1 lg:order-2">
            <Title1
              text={title}
              className="has_fade_anim pb-[15px] md:pb-[24px]"
            />
            <p className="has_fade_anim">{details}</p>
            {action_btn && action_btn.enable && (
              <div className="py-[25px] lg:py-[45px] has_fade_anim">
                <Link
                  href={action_btn.link}
                  className={cn(buttonVariants({ variant: "primary2" }))}
                >
                  {action_btn.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CRMHomeAbout;
