"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { markdownify } from "@/lib/helper/convert";

// shadcn components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import RattingStar from "../rating/ratting-star";

type Props = {
  testimonial: {
    data: {
      title: string;
      details: string;
      rating: {
        enable: boolean;
        title: string;
        text: string;
        number: number;
      };
      items: {
        name: string;
        occupation: string;
        company: string;
        text: string;
      }[];
    };
  };
};

const ContentWriterTestimonial = ({ testimonial }: Props) => {
  const { title, details, rating, items } = testimonial.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[55px] md:pt-[74px] xl:pt-[100px] 2xl:pt-[125px]">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[600px]"
          detailsClassName="max-w-[680px]"
        />

        <Carousel
          dir="ltr"
          opts={{
            duration: 60,
          }}
          className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] relative flex flex-col-reverse md:flex-row gap-[20px] lg:gap-[50px] xl:gap-0 rounded-theme border border-border"
        >
          <div className=" p-[20px] lg:p-[40px] xl:p-[60px]">
            <CarouselContent className="max-w-[820px] has_fade_anim">
              {items &&
                items.length &&
                items.map((item, i) => (
                  <CarouselItem
                    key={`testimonial_item-${i}`}
                    className="basis-full xl:basis-[55%] px-[40px] 2xl:px-[80px] border-s first:border-s-0 border-border cursor-grab select-none"
                  >
                    <div className="mb-[30px] md:mb-[40px]">
                      <Image
                        width={50}
                        height={38}
                        src="/assets/imgs/icon/quote-3.png"
                        alt="Quote Icon"
                        className="quote-icon"
                      />
                    </div>
                    <p className="text-[18px] md:text-[20px] leading-[1.4] mb-[35px] lg:mb-[20px] xl:mb-0 mt-[39px]">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-[20px] mt-[27px]">
                      <div>
                        <p className="text-[18px] font-bold text-white">
                          {item.name}
                        </p>
                        <p className="text-[14px] leading-none mt-[8px]">
                          {item.occupation}, {item.company}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </div>
          <div className="text-start xl:text-center basis-auto md:basis-[300px] relative ms-[unset] xl:ms-[60px] border-s border-border p-[20px] lg:py-[40px] lg:ps-0 lg:pe-[40px] xl:px-[50px] xl:py-[60px]">
            {rating && rating.enable && (
              <>
                <p className="text-[18px] font-medium leading-none underline text-primary">
                  {rating.title}
                </p>
                <h2 className="text-[50px] leading-none mt-[29px]">4.9</h2>
                <RattingStar number={rating.number} starBgColor="#525B62" />

                <p
                  className="text-[14px] font-bold leading-none text-primary mt-[13px]"
                  dangerouslySetInnerHTML={markdownify(rating.text)}
                />

                <div className="w-full h-[1px] bg-border mt-[40px] xl:mt-[65px]"></div>
              </>
            )}

            <div className="hidden md:flex justify-center gap-0 mt-[40px] xl:mt-[60px]">
              <CarouselPrevious
                variant="default"
                className="relative mt-0 left-0 w-[50px] h-[50px] rounded-full bg-transparent hover:bg-[#121B21] text-white"
              />
              <CarouselNext
                variant="default"
                className="relative mt-0 right-0 w-[50px] h-[50px] rounded-full bg-transparent hover:bg-[#121B21] text-white"
              />
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ContentWriterTestimonial;
