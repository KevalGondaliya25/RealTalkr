"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { delayTime } from "@/lib/helper/delayTime";

// types
import { ServiceDetailsType } from "@/types";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import ServiceCard2 from "./card/service-card2";

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

const CRMService = ({ service, services }: Props) => {
  const { title, details } = service.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[70px] lg:pt-[100px] xl:pt-[185px]">
      <div className="container" ref={containerRef}>
        <div className="mb-[30px] md:mb-[63px]">
          <TitleSection2
            title={title}
            details={details}
            titleClassName="max-w-[710px]"
            detailsClassName="max-w-[710px]"
          />
        </div>
        {services && services.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((item, i) => (
              <div
                key={item.slug}
                className="has_fade_anim"
                data-delay={delayTime(i + 1)}
              >
                <ServiceCard2 service={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CRMService;
