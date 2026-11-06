"use client";

import { useRef } from "react";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";
import hasPinContent from "@/lib/animation/hasPinContent";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import ServiceCard6 from "./card/service-card6";

type Props = {
  service: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      action_btn: ActionBtnType;
    };
  };
  services: {
    data: {
      title: string;
      short_description: string;
      image: string;
    };
    slug: string;
  }[];
};

const SEOService = ({ service, services }: Props) => {
  const { title, sub_title, details, action_btn } = service.data;

  const containerRef = useRef<HTMLDivElement>(null!);
  const pinElement = useRef<HTMLDivElement>(null!);
  const pinArea = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      hasPinContent(pinElement.current, pinArea.current, "top 100px", 1024);
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space1">
      <div className="container" ref={containerRef}>
        <div
          className="flex justify-between flex-col xl:flex-row gap-x-[60px] gap-y-[40px]"
          ref={pinArea}
        >
          <div className="max-w-full xl:max-w-[350px]" ref={pinElement}>
            <TitleSection2
              title={title}
              details={details}
              sub_title={sub_title}
              className="text-start"
              titleClassName="mx-0"
              detailsClassName="mx-0"
            />
            {action_btn && action_btn.enable && (
              <div className="mt-[43px] has_fade_anim">
                <Link
                  href={action_btn.link}
                  className={cn(buttonVariants({ variant: "primary6" }))}
                >
                  <span className="btn-span" data-text={action_btn.label}>
                    {action_btn.label}
                  </span>
                </Link>
              </div>
            )}
          </div>
          <div className="max-w-full xl:max-w-[700px] overflow-hidden">
            {services && services.length && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[50px] md:gap-y-[70px] -mx-[50px]">
                {services.map((service) => (
                  <div
                    key={service.slug}
                    className="border-s border-border has_fade_anim"
                  >
                    <ServiceCard6 service={service} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOService;
