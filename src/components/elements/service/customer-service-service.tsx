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
import Title1 from "@/components/shared/title/title1";
import ServiceCard4 from "./card/service-card4";

type Props = {
  service: {
    data: {
      title: string;
      details: string;
      action_btn: ActionBtnType;
    };
  };
  services: {
    data: {
      title: string;
      sub_title: string;
      image: string;
      bg_color?: string;
      border_color?: string;
    };
    slug: string;
  }[];
};

const CustomerServiceService = ({ service, services }: Props) => {
  const { title, details, action_btn } = service.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[43px] md:pt-[73px] xl:pt-[103px] 2xl:pt-[173px]">
      <div className="container" ref={containerRef}>
        <div className="flex flex-col md:flex-row justify-between gap-x-[50px] gap-y-[20px]">
          <Title1
            text={title}
            className="max-w-[606px] min-w-[310px] has_fade_anim"
          />
          <div className="max-w-[520px] mt-[17px]">
            <p className="text has_fade_anim">{details}</p>
            {action_btn && action_btn.enable && (
              <div className="mt-[37px] has_fade_anim">
                <Link
                  href={action_btn.link}
                  className={cn(
                    buttonVariants({ variant: "link", size: "auto" })
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
        {services && services.length && (
          <div className="mt-[28px] xl:mt-[38px] 2xl:mt-[58px]">
            <div className="grid gap-[30px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.slug} className="has_fade_anim">
                  <ServiceCard4 service={service} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerServiceService;
