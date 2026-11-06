"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import { delayTime2 } from "@/lib/helper/delayTime";

// types
import { ServiceDetailsType } from "@/types";

// components
import Title1 from "@/components/shared/title/title1";
import ServiceCard1 from "./card/service-card1";

type Props = {
  service: {
    data: {
      title: string;
      description: string;
      shape1_img?: string;
      shape2_img?: string;
    };
    content: string;
  };
  services: {
    data: ServiceDetailsType;
    content: string;
    slug: string;
  }[];
  className?: string;
};

const BookingService = ({ service, services, className }: Props) => {
  const { title, description, shape1_img, shape2_img } = service.data;

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
        "pt-[56px] md:pt-[86px] xl:pt-[116px] 2xl:pt-[186px]",
        className
      )}
    >
      <div className="container" ref={containerRef}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-x-[80px] gap-y-[30px] relative z-[2]">
          <Title1
            text={title}
            className="max-w-[486px] lg:max-w-[586px] has_fade_anim"
          />
          <p className="max-w-[380px] has_fade_anim" data-delay="0.25">
            {description}
          </p>
        </div>
        <div className="relative z-[1]">
          {shape1_img && (
            <Image
              width={1920}
              height={709}
              style={{ height: "auto", width: "100vw" }}
              className="hidden lg:block max-w-[inherit] absolute left-[50%] -top-[36%] -z-[1] -translate-x-2/4 rtl:transform rtl:rotate-y-[180deg] rtl:-translate-x-2/4"
              src={shape1_img}
              alt="shape image"
            />
          )}
          <div className="hidden md:block absolute -start-[10%] top-[66%] -z-[1] rtl_y wc-y-anim">
            {shape2_img && (
              <Image
                width={60}
                height={60}
                src={shape2_img}
                alt="shape image"
              />
            )}
          </div>

          {/* Services  */}
          {services && services.length && (
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] z-[1] mt-[36px] md:mt-[41px] xl:mt-[51px] 2xl:mt-[61px]">
              {services.map((item, i) => (
                <div
                  key={item.slug}
                  className="has_fade_anim"
                  data-delay={delayTime2(i + 1)}
                >
                  <ServiceCard1 service={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingService;
