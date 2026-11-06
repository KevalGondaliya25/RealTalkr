"use client";

import { useRef } from "react";
import Image from "next/image";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

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
import RattingStar from "../rating/ratting-star";

type Props = {
  testimonial: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      icon: string;
      shape: string;
      review: {
        enable: boolean;
        number: number;
        text: string;
        image: string;
      };
      items: {
        name: string;
        role: string;
        text: string;
      }[];
    };
  };
};

const VideoEditorTestimonial = ({ testimonial }: Props) => {
  const { title, details, sub_title, icon, shape, review, items } =
    testimonial.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="relative sec_space_top4">
      {shape && (
        <div className="hidden xl:block absolute left-0 -top-[156px]">
          <Image width={393} height={824} src={shape} alt="shape" />
        </div>
      )}
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-y-[70px]">
          <div className="relative z-[2]">
            <p className="pb-[15px] lg:pb-[25px] flex items-center gap-[10px] has_fade_anim">
              {icon && <Image width={31} height={31} src={icon} alt="icon" />}
              {sub_title}
            </p>
            <Title1
              text={title}
              className="mb-[15px] lg:mb-[30px] has_fade_anim"
            />
            <p className="pb-[15px] lg:pb-[30px] max-w-[450px] has_fade_anim">
              {details}
            </p>
            {review && review.enable && (
              <div className="flex items-center gap-[15px] has_fade_anim">
                <Image width={55} height={55} src={review.image} alt="Brand" />
                <div>
                  <div className="flex gap-[8px] justify-center items-center">
                    <h3 className="text-[36px]">{review.number}</h3>
                    <RattingStar number={review.number} />
                  </div>
                  <p className="text-[16px] text-primary">{review.text}</p>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-1 lg:col-span-2 flex justify-end">
            <Carousel
              dir="ltr"
              opts={{
                duration: 60,
              }}
              className="max-w-full xl:max-w-[80%] left-0 bg-[#F9F9FC] relative text-center rounded-theme p-[30px] md:p-[50px] lg:px-[110px] lg:py-[80px] has_fade_anim"
            >
              <CarouselContent>
                {items &&
                  items.length &&
                  items.map((item, i) => (
                    <CarouselItem key={`testimonial_item-${i}`}>
                      <div className="text-center cursor-grab select-none">
                        <div className="pb-[35px]">
                          <Image
                            width={34}
                            height={28}
                            className="mx-auto"
                            src="/assets/imgs/icon/quote-2.png"
                            alt="icon image"
                          />
                        </div>
                        <p className="pb-[30px] lg:pb-[40px] text-[17px] xl:text-[20px] 2xl:text-[24px]">
                          {item.text}
                        </p>
                        <div>
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
                className="hidden xl:flex -left-[35px] top-[45%] w-[67px] h-[67px] bg-white border border-border hover:bg-primary [&>svg]:hover:text-white"
              >
                <ChevronLeft />
              </CarouselPrevious>
              <CarouselNext
                variant="default"
                className="hidden xl:flex -right-[35px] top-[45%] w-[67px] h-[67px] bg-white border border-border hover:bg-primary [&>svg]:hover:text-white"
              >
                <ChevronRight />
              </CarouselNext>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoEditorTestimonial;
