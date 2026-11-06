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
import Title1 from "@/components/shared/title/title1";
import RattingStar2 from "../rating/ratting-star2";

type Props = {
  testimonial: {
    data: {
      title: string;
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

const CRMTestimonial = ({ testimonial }: Props) => {
  const { title, items } = testimonial.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[60px] md:pt-[100px] xl:pt-[150px] 2xl:pt-[200px]">
      <div className="container" ref={containerRef}>
        <Title1
          text={title}
          className="max-w-[580px] mx-auto text-center has_fade_anim"
        />
        <Carousel
          dir="ltr"
          opts={{
            duration: 60,
          }}
          className="w-full mt-[51px] 2xl:mt-[61px] mx-auto has_fade_anim"
        >
          <CarouselContent className="gap-[14px]">
            {items &&
              items.length &&
              items.map((item, i) => (
                <CarouselItem
                  key={`testimonial_item-${i}`}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-[25px] lg:p-[45px] bg-white border border-border rounded-theme">
                    <div className="flex items-center gap-[20px]">
                      <Avatar className="w-[63px] h-[63px]">
                        <AvatarImage src={item.image} alt="Avatar" />
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-[22px] leading-none">
                          {item.name}
                        </h2>
                        <small className="text-[14px] mt-[9px] leading-none">
                          {item.occupation}
                        </small>
                      </div>
                    </div>
                    <p className="text-[19px] 2xl:text-[22px] leading-[1.36] mt-[36px]">
                      {item.text}
                    </p>
                    <div className="mt-[23px] flex items-center gap-[4px]">
                      <RattingStar2 number={item.rating} />
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default CRMTestimonial;
