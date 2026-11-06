"use client";

import Image from "next/image";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// shadcn components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// components
import RattingStar2 from "../rating/ratting-star2";

type Props = {
  testimonial: {
    data: {
      items: {
        name: string;
        occupation: string;
        image: string;
        bg_image: string;
        company_logo: string;
        text: string;
        rating: number;
      }[];
    };
  };
};

const MarketingTestimonial = ({ testimonial }: Props) => {
  const { items } = testimonial.data;

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_bottom2">
      <div className="container" ref={containerRef}>
        {items && items.length && (
          <Carousel
            dir="ltr"
            plugins={[plugin.current as any]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full has_fade_anim"
          >
            <CarouselContent>
              {items.map((item, i) => (
                <CarouselItem
                  key={`testimonial_item-${i}`}
                  className="md:basis-[50%] xl:basis-[33%] ps-[30px]"
                >
                  <div
                    className="rounded-theme p-[30px] bg-no-repeat h-full bg-cover cursor-grab select-none"
                    style={{ backgroundImage: `url(${item.bg_image})` }}
                  >
                    <div className="flex justify-between pb-[25px]">
                      <div>
                        {item.company_logo && (
                          <Image
                            width={111}
                            height={24}
                            src={item.company_logo}
                            className="w-auto h-[24px]"
                            alt="logo"
                          />
                        )}
                      </div>
                      <div className="flex justify-between gap-1">
                        <RattingStar2 number={item.rating} starSize={15} />
                      </div>
                    </div>
                    <div className="pb-[33px]">
                      <p>{item.text}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-[12px] items-center">
                        <div>
                          <Image
                            width={50}
                            height={50}
                            src={item.image}
                            className="rounded-full"
                            alt="star"
                          />
                        </div>
                        <div>
                          <h2 className="text-[18px] font-normal leading-[1.6]">
                            Saia Oliv
                          </h2>
                          <p className="text-[12px]">Chief Operating Officer</p>
                        </div>
                      </div>
                      <div>
                        <Image
                          width={31}
                          height={24}
                          src="/assets/imgs/icon/icon-r-43.png"
                          alt="quote icon"
                        />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default MarketingTestimonial;
