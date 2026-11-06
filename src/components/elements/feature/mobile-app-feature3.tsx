"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// shadcn components
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
      shape: string;
      features: {
        title: string;
        details: string;
        image: string;
      }[];
      items: string[];
    };
  };
};

const MobileAppFeature3 = ({ feature }: Props) => {
  const { title, details, shape, features, items } = feature.data;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [baseProgress, setBaseProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  const onScroll = useCallback(() => {
    if (current) {
      setScrollProgress(baseProgress * current);
    }
  }, [current, baseProgress]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    onScroll();
    api.on("reInit", onScroll).on("scroll", onScroll);
  }, [api, onScroll]);

  useEffect(() => {
    if (count) {
      setBaseProgress(100 / count);
    }
  }, [count]);

  return (
    <section className="sec_space4 bg-sec_bg relative z-[2] overflow-hidden">
      {shape && (
        <div className="hidden lg:block absolute top-0 right-0 -z-[2]">
          <Image width={1376} height={925} src={shape} alt="shape image" />
        </div>
      )}
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-[420px_500px] xl:grid-cols-[520px_600px] 2xl:grid-cols-[520px_770px] gap-[20px] md:gap-[60px] text-center lg:text-start">
          <div>
            <TitleSection2
              title={title}
              details={details}
              className="text-start mb-[25px] md:mb-[45px]"
              detailsClassName="!mt-[23px] max-w-full"
              titleClassName="max-w-full"
            />
            {features && features.length && (
              <div>
                {features.map((item, i) => (
                  <div
                    key={`feature_item-${i}`}
                    className="grid grid-cols-[50px_auto] md:grid-cols-[70px_auto] gap-[20px] md:gap-[30px] max-w-[390px] mt-[20px] md:mt-[40px] first:mt-0"
                  >
                    <div>
                      <Image
                        width={70}
                        height={70}
                        src={item.image}
                        alt="icon"
                      />
                    </div>
                    <div>
                      <h3 className="text-[20px] md:text-[24px] mb-[5px] md:mb-[10px] text-start">
                        {item.title}
                      </h3>
                      <p className="text-start">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="hidden lg:block pt-0 md:pt-[60px] 2xl:pt-[100px] has_fade_anim">
              <div className="flex space-x-[10px] rtl:space-x-reverse">
                <span>{current > 9 ? current : `0${current}`}</span>

                <Progress
                  value={scrollProgress}
                  className="w-[70px] h-[1.5px] mt-3 bg-[#B5F1D4] rtl_y"
                />

                <span>{count > 9 ? count : `0${count}`}</span>
              </div>
            </div>
          </div>
          <div>
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
                      <div className="relative">
                        <Image
                          width={630}
                          height={665}
                          src={item}
                          alt="Slider image"
                        />
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
            </Carousel>
            <div className="flex lg:hidden justify-center mt-4 has_fade_anim">
              <div className="flex space-x-[10px] rtl:space-x-reverse">
                <span>{current > 9 ? current : `0${current}`}</span>

                <Progress
                  value={scrollProgress}
                  className="w-[70px] h-[1.5px] mt-3 bg-[#B5F1D4] rtl_y"
                />

                <span>{count > 9 ? count : `0${count}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppFeature3;
