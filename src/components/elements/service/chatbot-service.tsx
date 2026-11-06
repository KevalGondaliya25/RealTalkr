"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { delayTime } from "@/lib/helper/delayTime";

// components
import ServiceCard3 from "./card/service-card3";
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  service: {
    data: {
      title: string;
      details: string;
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

const ChatbotService = ({ service, services }: Props) => {
  const { title, details } = service.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[53px] md:pt-[73px] xl:pt-[93px] 2xl:pt-[123px] sec_space_bottom2">
      <div className="container 2xl:max-w-[1630px]" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          html
          titleClassName="max-w-[550px] mx-auto [&>img]:inline-block"
          detailsClassName="max-w-[710px]"
        />
        {services && services.length && (
          <div className="mt-[43px] 2xl:mt-[63px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
            {services.map((item, i) => (
              <div
                key={item.slug}
                className="has_fade_anim"
                data-delay={delayTime(i + 1)}
              >
                <ServiceCard3 service={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatbotService;
