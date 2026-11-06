"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";
import hasPinContent from "@/lib/animation/hasPinContent";

// components
import Title1 from "@/components/shared/title/title1";
import RattingStar from "../rating/ratting-star";

type Props = {
  testimonial: {
    data: {
      title: string;
      bg_shape: string;
      shape: string;
      rating: {
        enable: boolean;
        brand: string;
        number: number;
        text: string;
        label: string;
      };
      items: {
        image: string;
        text: string;
        company_logo: string;
        company_name: string;
        shape: string;
        bg_color: string;
      }[];
    };
  };
};

const MobileAppTestimonial = ({ testimonial }: Props) => {
  const { title, bg_shape, shape, rating, items } = testimonial.data;

  const containerRef = useRef<HTMLDivElement>(null!);
  const pinElement = useRef<HTMLDivElement>(null!);
  const pinArea = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      hasPinContent(pinElement.current, pinArea.current, "top 150px");
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space4 bg-sec_bg relative z-[2] overflow-hidden">
      {bg_shape && (
        <div className="absolute -top-[40px] start-0 -z-[2]">
          <Image width={1240} height={1681} src={bg_shape} alt="shape" />
        </div>
      )}
      <div className="container" ref={containerRef}>
        <div
          className="grid grid-cols-1 lg:grid-cols-[auto_560px] gap-[30px] md:gap-[50px] lg:gap-[20px] xl:gap-[220px]"
          ref={pinArea}
        >
          <div ref={pinElement}>
            {rating && rating.enable && (
              <div className="relative max-w-[150px] lg:max-w-[225px] ps-[24px] pe-[26px] py-[23px] flex items-center gap-[15px] border border-border rounded-full">
                {rating.brand && (
                  <Image
                    width={44}
                    height={45}
                    src={rating.brand}
                    alt="Brand"
                  />
                )}
                <div>
                  <div className="flex gap-[2px] justify-center items-center">
                    <h3 className="text-[18px] !font-bold">{rating.number}</h3>
                    <RattingStar number={rating.number} starBgColor="#F3F3F3" />
                  </div>
                  <p className="text-[14px] text-primary">{rating.text}</p>
                </div>
                <div className="absolute -top-[10%] start-[20%] bg-sec_bg">
                  <p className="text-[13px] font-medium text-primary uppercase">
                    {rating.label}
                  </p>
                </div>
              </div>
            )}
            <Title1
              text={title}
              className="has_fade_anim mt-[15px] lg:mt-[22px]"
            />
            {shape && (
              <div className="pt-[20px] lg:pt-[35px] max-w-[100px] lg:max-w-full has_fade_anim">
                <Image width={139} height={72} src={shape} alt="review-icon" />
              </div>
            )}
          </div>
          {items && items.length && (
            <div className="has_fade_anim">
              {items.map((item, i) => (
                <div
                  key={`testimonial_item-${i}`}
                  className="grid grid-cols-1 md:grid-cols-[auto_170px] gap-[20px] lg:gap-[35px] p-[25px] md:p-[15px] rounded-[30px] max-w-[560px] mb-[30px] last:mb-0"
                  style={{ backgroundColor: item.bg_color }}
                >
                  <div className="md:ps-[27px]">
                    <div className="flex justify-between">
                      {item.shape && (
                        <Image
                          width={60}
                          height={60}
                          src={item.shape}
                          className="md:-ms-[27px] w-[60px] h-[60px]"
                          alt="icon"
                        />
                      )}
                      {item.image && (
                        <Image
                          width={70}
                          height={70}
                          src={item.image}
                          className="block md:hidden rounded-theme"
                          alt="thumb"
                        />
                      )}
                    </div>
                    <p className="pt-[18px] md:pt-[30px]">{item.text}</p>
                    <div className="flex gap-[17px] items-center max-w-[150px] pt-[15px] md:pt-[24px]">
                      {item.company_logo && (
                        <Image
                          width={43}
                          height={43}
                          src={item.company_logo}
                          alt="meta-icon"
                        />
                      )}
                      <h3>{item.company_name}</h3>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    {item.image && (
                      <Image
                        width={170}
                        height={235}
                        src={item.image}
                        className="rounded-theme"
                        alt="thumb"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MobileAppTestimonial;
