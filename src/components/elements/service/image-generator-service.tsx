"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { delayTime2 } from "@/lib/helper/delayTime";

// types
import { ServiceDetailsType } from "@/types";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import ServiceCard5 from "./card/service-card5";

type Props = {
  service: {
    data: {
      title: string;
      details: string;
    };
  };
  services: {
    data: ServiceDetailsType;
    slug: string;
  }[];
};

const ImageGeneratorService = ({ service, services }: Props) => {
  const { title, details } = service.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[50px] md:pt-[75px] xl:pt-[100px] 2xl:pt-[124px]">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[700px]"
          detailsClassName="max-w-[700px]"
        />

        {services && services.length && (
          <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px]">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-y-[50px] px-[14px] py-[74px] bg-[#121B21] rounded-theme">
              {services.slice(0, 3).map((item, i) => (
                <div
                  key={item.slug}
                  className="has_fade_anim border-s-0 lg:border-s border-[#ffffff14] first:border-s-0"
                  data-delay={delayTime2(i + 1)}
                >
                  <ServiceCard5 service={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageGeneratorService;
