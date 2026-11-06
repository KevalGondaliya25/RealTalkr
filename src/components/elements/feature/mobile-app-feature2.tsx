"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
      action_btn: ActionBtnType;
      items: {
        image1: string;
        image2: string;
      }[];
    };
  };
};

const MobileAppFeature2 = ({ feature }: Props) => {
  const { title, details, action_btn, items } = feature.data;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="sec_space1">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-[auto_400px] xl:grid-cols-[auto_520px] gap-[20px] xl:gap-[80px] justify-end">
          <div className="relative lg:sec_space4 order-2 lg:order-1">
            <Carousel
              dir="ltr"
              opts={{
                duration: 60,
              }}
              setApi={setApi}
              className="w-full mx-auto has_fade_anim"
            >
              <CarouselContent className="gap-[14px]">
                {items &&
                  items.length &&
                  items.map((item, i) => (
                    <CarouselItem key={`testimonial_item-${i}`}>
                      <div className="bg-white max-w-full lg:max-w-[488px] ml-0 lg:ml-auto relative">
                        <div className="relative">
                          <Image
                            width={488}
                            height={560}
                            src={item.image1}
                            className="relative z-[2] filter-none ml-auto lg:ml-0 lg:drop-shadow-[-30px_30px_60px_rgba(31,82,141,0.04)]"
                            alt="Slider image"
                          />
                          <Image
                            width={450}
                            height={320}
                            src={item.image2}
                            className="absolute top-[25%] start-0 lg:-start-[30%] z-[1] rounded-theme filter-none lg:drop-shadow-[5px_5px_60px_rgba(0,0,0,0.03)]"
                            alt="Slider image"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
            </Carousel>
            <div className="flex lg:hidden mt-4 justify-center ">
              <div className="flex space-x-2">
                {Array.from({ length: count }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "block h-2.5 rounded-full cursor-pointer",
                      current === index + 1
                        ? "bg-theme w-[50px]"
                        : "bg-[#E9FAF3] w-2.5"
                    )}
                    onClick={() => onDotButtonClick(index)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative before:hidden md:before:block before:absolute before:content-[' '] before:-left-[220px] before:top-0 before:h-full before:w-[630px] before:bg-[#F4FDF9] before:-z-[1] lg:sec_space4 order-1 lg:order2">
            <div className="pt-[30px] md:pt-[60px]">
              <TitleSection2
                title={title}
                details={details}
                className="text-start"
                html
                titleClassName="max-w-full"
                detailsClassName="max-w-full"
              />
              {action_btn && action_btn.enable && (
                <div className="pt-[20px] md:pt-[43px] has_fade_anim">
                  <Link
                    href={action_btn.link}
                    className={cn(buttonVariants({ variant: "primary2" }))}
                  >
                    {action_btn.label}
                  </Link>
                </div>
              )}
            </div>
            <div className="hidden lg:flex justify-start absolute bottom-[75px] -start-[25%]">
              <div className="flex space-x-2 rtl:space-x-reverse">
                {Array.from({ length: count }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "block h-2.5 rounded-full cursor-pointer",
                      current === index + 1
                        ? "bg-theme w-[50px]"
                        : "bg-[#E9FAF3] w-2.5"
                    )}
                    onClick={() => onDotButtonClick(index)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppFeature2;
