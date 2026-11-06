"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import RattingStar2 from "../rating/ratting-star2";

type Props = {
  testimonial: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      items: {
        name: string;
        occupation: string;
        image: string;
        text: string;
        rating: number;
      }[];
    };
  };
};

const SEOTestimonial = ({ testimonial }: Props) => {
  const { title, sub_title, details, items } = testimonial.data;

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
    <section className="bg-primary sec_space1">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          sub_title={sub_title}
          details={details}
          titleClassName="max-w-[700px] !text-white"
          subTitleClassName="bg-[#1B3242] text-white"
          detailsClassName="max-w-[700px] text-white-2"
        />
        <Carousel
          dir="ltr"
          opts={{
            duration: 60,
          }}
          setApi={setApi}
          className="w-full mt-[51px] 2xl:mt-[61px] mx-auto has_fade_anim"
        >
          <CarouselContent className="gap-[14px]">
            {items &&
              items.length &&
              items.map((item, i) => (
                <CarouselItem
                  key={`testimonial_item-${i}`}
                  className="md:basis-1/2 xl:basis-1/3"
                >
                  <div className="p-[25px] lg:p-[45px] bg-primary-100 rounded-theme cursor-grab select-none">
                    <div className="flex items-center gap-[20px]">
                      <Avatar className="w-[63px] h-[63px]">
                        <AvatarImage src={item.image} alt="Avatar" />
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-[22px] !text-white leading-none mb-[9px]">
                          {item.name}
                        </h2>
                        <small className="text-[14px] leading-none text-white-2">
                          {item.occupation}
                        </small>
                      </div>
                    </div>
                    <p className="text-[19px] 2xl:text-[22px] leading-[1.36] mt-[36px] text-white-2">
                      {item.text}
                    </p>
                    <div className="mt-[23px] flex items-center gap-[4px]">
                      <RattingStar2 number={item.rating} />
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <div className="flex justify-center mt-[50px] xl:mt-[70px]">
            <div className="flex space-x-2">
              {Array.from({ length: count }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "block h-2 w-2 rounded-full cursor-pointer",
                    current === index + 1 ? "bg-white" : "bg-[#3B4F5D]"
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

export default SEOTestimonial;
