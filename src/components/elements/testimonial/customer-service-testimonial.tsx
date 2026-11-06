"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// shadcn components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import RattingStar2 from "../rating/ratting-star2";

type Props = {
  testimonial: {
    data: {
      title: string;
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

const CustomerServiceTestimonial = ({ testimonial }: Props) => {
  const { title, details, items } = testimonial.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section
      className="pt-[43px] md:pt-[73px] xl:pt-[103px] 2xl:pt-[173px] bg-[#FDF9F4]"
      ref={containerRef}
    >
      <div className="container">
        <TitleSection2 title={title} details={details} />
      </div>
      <Carousel
        dir="ltr"
        opts={{
          duration: 60,
        }}
        className="w-full mt-[33px] xl:mt-[43px] 2xl:mt-[63px] mx-auto has_fade_anim"
      >
        <CarouselContent className="gap-[14px]">
          {items &&
            items.length &&
            items.map((item, i) => (
              <CarouselItem
                key={`testimonial_item-${i}`}
                className="md:basis-1/2 lg:basis-[40%] xl:basis-[25%] 2xl:basis-[22%]"
              >
                <div className="p-[25px] 2xl:p-[45px] bg-white rounded-theme flex flex-col justify-between h-full cursor-grab select-none">
                  <div>
                    <div className="flex items-center gap-[4px]">
                      <RattingStar2 number={item.rating} />
                    </div>

                    <p className="text-[19px] 2xl:text-[22px] leading-[1.36] mt-[21px]">
                      {item.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-[20px] pt-[20px] 2xl:pt-[30px] mt-[23px] border-t border-border">
                    <Avatar className="w-[63px] h-[63px]">
                      <AvatarImage src={item.image} alt="Avatar" />
                      <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-[22px] leading-none">{item.name}</h2>
                      <small className="text-[14px] mt-[9px] leading-none">
                        {item.occupation}
                      </small>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default CustomerServiceTestimonial;
