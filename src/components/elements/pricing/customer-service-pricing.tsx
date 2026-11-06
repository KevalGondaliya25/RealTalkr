"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// types
import { PricingCardType } from "@/types";

// shadcn components
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import PricingCard5 from "./card/pricing-card5";

type Props = {
  pricing: {
    data: {
      title: string;
      details: string;
      monthly: PricingCardType[];
      yearly: PricingCardType[];
    };
  };
  className?: string;
};

const CustomerServicePricing = ({ pricing, className }: Props) => {
  const { title, details, monthly, yearly } = pricing.data;

  const [toggleYear, setToggleYear] = useState<boolean>(false);
  const [priceContent, setPriceContent] = useState<PricingCardType[]>([]);
  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  useEffect(() => {
    toggleYear ? setPriceContent(yearly) : setPriceContent(monthly);
  }, [toggleYear, monthly, yearly]);

  return (
    <section
      className={cn(
        "pt-[43px] md:pt-[73px] xl:pt-[103px] 2xl:pt-[173px] sec_space_bottom1",
        className
      )}
    >
      <div className="container relative" ref={containerRef}>
        <div className="absolute top-[110px] end-full w-[158px]">
          <Image
            width={159}
            height={111}
            src="/assets/imgs/shape/shape-s-30.png"
            data-speed="0.8"
            alt="shape image"
          />
        </div>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[720px]"
          detailsClassName="max-w-[710px]"
        />
        <div className="mt-[33px] xl:mt-[53px] 2xl:mt-[63px]">
          <div className="flex justify-center has_fade_anim">
            <div className="relative">
              <div className="flex items-center space-x-2" dir="ltr">
                <Label
                  htmlFor="pricing-mode"
                  className="text-[18px] text-primary font-normal"
                >
                  Monthly
                </Label>
                <Switch
                  id="pricing-mode"
                  checked={toggleYear}
                  onCheckedChange={(value) => setToggleYear(value)}
                  className="bg-[#DEF2E8]"
                />
                <Label
                  htmlFor="pricing-mode"
                  className="text-[18px] text-primary font-normal"
                >
                  Yearly
                </Label>
              </div>
              <div className="hidden md:block absolute top-full start-[calc(100%-10px)] w-max">
                <Image
                  width={76}
                  height={25}
                  src="/assets/imgs/shape/shape-s-17.png"
                  className="rtl_y"
                  alt="shape image"
                />
              </div>
              <h3 className="hidden md:block absolute text-[14px] leading-[1.21] text-center start-[calc(100%+40px)] bottom-[2px] w-max rotate-30 rtl:-rotate-30">
                Save 20% with <br />
                annual plans
              </h3>
            </div>
          </div>
          <div className="flex justify-center mt-[30px] lg:mt-[50px]">
            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center gap-[30px] has_fade_anim"
              data-delay="0.25"
            >
              {priceContent &&
                priceContent.length > 0 &&
                priceContent.map((item, i) => (
                  <div key={`price_table-${i}`}>
                    <PricingCard5 price={item} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerServicePricing;
