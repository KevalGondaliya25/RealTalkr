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

const ImageGeneratorTestimonial = ({ testimonial }: Props) => {
  const { title, details, items } = testimonial.data;

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
          titleClassName="max-w-[600px]"
          detailsClassName="max-w-[700px]"
        />
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
                  className="md:basis-[48%] lg:basis-[32%]"
                >
                  <div className="p-[25px] 2xl:p-[45px] bg-[#121B21] rounded-theme flex flex-col justify-between h-full cursor-grab select-none">
                    <div>
                      <div className="flex items-center gap-[4px]">
                        <RattingStar2 number={item.rating} strokeWidth={0} />
                      </div>

                      <p className="text-[19px] 2xl:text-[22px] leading-[1.36] mt-[21px]">
                        {item.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-[20px] pt-[20px] 2xl:pt-[30px] mt-[23px] border-t border-[#ffffff14]">
                      <Avatar className="w-[63px] h-[63px]">
                        <AvatarImage src={item.image} alt="Avatar" />
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-[22px] leading-none">
                          {item.name}
                        </h2>
                        <small className="text-[14px] text-secondary mt-[9px] leading-none">
                          {item.occupation}
                        </small>
                      </div>
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

export default ImageGeneratorTestimonial;
