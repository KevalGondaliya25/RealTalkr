"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

type Props = {
  testimonial: {
    data: {
      items: {
        name: string;
        role: string;
        text: string;
      }[];
    };
  };
};

const ChatbotTestimonial = ({ testimonial }: Props) => {
  const { items } = testimonial.data;

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
        <Carousel
          dir="ltr"
          opts={{
            duration: 60,
          }}
          setApi={setApi}
          className="max-w-[710px] 2xl:max-w-[800px] mx-auto has_fade_anim"
        >
          <CarouselContent>
            {items &&
              items.length &&
              items.map((item, i) => (
                <CarouselItem key={`testimonial_item-${i}`}>
                  <div className="text-center">
                    <div>
                      <Image
                        width={58}
                        height={48}
                        className="mx-auto"
                        src="/assets/imgs/icon/quote-2.png"
                        alt="icon image"
                      />
                    </div>
                    <p className="mt-[37px] 2xl:mt-[47px] text-[20px] md:text-[25px] xl:text-[26px] 2xl:text-[30px] leading-[1.26]">
                      {item.text}
                    </p>
                    <div className="mt-[34px] xl:mt-[44px]">
                      <h3 className="text-[16px] xl:text-[20px] 2xl:text-[24px]">
                        {item.name}
                      </h3>
                      <span className="text-[16px] inline-block mt-[9px]">
                        {item.role}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious
            variant="default"
            className="hidden xl:flex -left-48 top-[40%] w-[67px] h-[67px] bg-[#FAFAFB] hover:bg-primary [&>svg]:hover:text-white"
          />
          <CarouselNext
            variant="default"
            className="hidden xl:flex -right-48 top-[40%] w-[67px] h-[67px] bg-[#FAFAFB] hover:bg-primary [&>svg]:hover:text-white"
          />
          <div className="flex justify-center mt-[50px] xl:mt-[70px]">
            <div className="flex space-x-2">
              {Array.from({ length: count }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "block h-2 w-2 rounded-full cursor-pointer",
                    current === index + 1 ? "bg-primary" : "bg-[#DEDEDE]"
                  )}
                  onClick={() => onDotButtonClick(index)}
                ></span>
              ))}
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ChatbotTestimonial;
