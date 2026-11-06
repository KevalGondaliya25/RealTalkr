"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import RattingStar from "./ratting-star";

type Props = {
  rating: {
    data: {
      title: string;
      details: string;
      items: {
        number: number;
        text: string;
        image: string;
      }[];
    };
  };
};

const CustomerServiceRatting = ({ rating }: Props) => {
  const { title, details, items } = rating.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[43px] md:pt-[73px] xl:pt-[103px] 2xl:pt-[173px] bg-[#FDF9F4] sec_space_bottom1">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[600px]"
        />
        {items && items.length && (
          <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px]">
            <div className="flex flex-col lg:flex-row justify-center gap-[30px] lg:gap-0 has_fade_anim">
              {items.map((item, i) => (
                <div
                  key={`rating_item-${i}`}
                  className="ps-0 lg:ps-[40px] ms-0 lg:ms-[40px] border-s-0 lg:border-s border-[#E5E8EC] first:ps-0 first:ms-0 first:border-s-0"
                >
                  <div className="flex justify-center items-center gap-[15px]">
                    <Image
                      width={55}
                      height={55}
                      src={item.image}
                      alt="Brand"
                    />
                    <div>
                      <div className="flex gap-[8px] justify-center items-center">
                        <h3 className="text-[36px]">{item.number}</h3>
                        <RattingStar number={item.number} />
                      </div>
                      <p className="text-[16px] text-primary">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerServiceRatting;
