"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// shadcn components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  testimonial: {
    data: {
      title: string;
      items: {
        name: string;
        role: string;
        text: string;
      }[];
    };
    content: string;
  };
};

const BookingTestimonial = ({ testimonial }: Props) => {
  const { title, items } = testimonial.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="bg-[#EDF4F3] sec_space_bottom1 pt-[51px] md:pt-[81px] xl:pt-[111px] 2xl:pt-[181px]">
      <div className="container" ref={containerRef}>
        <Title1
          text={title}
          className="max-w-[506px] mx-auto text-center has_fade_anim"
        />
        <Carousel
          dir="ltr"
          opts={{
            duration: 60,
          }}
          className="max-w-[710px] 2xl:max-w-[800px] mt-[51px] 2xl:mt-[61px] mx-auto has_fade_anim"
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
                        src="/assets/imgs/icon/quote.png"
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
          <div className="mt-[47px] xl:mt-[67px] flex justify-center gap-[50px]">
            <CarouselPrevious variant="default" className="static" />
            <CarouselNext variant="default" className="static" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default BookingTestimonial;
