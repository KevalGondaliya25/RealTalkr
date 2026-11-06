"use client";

import { useEffect, useRef, useState } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// types
import { PricingCardType } from "@/types";

// shadcn components
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// components
import Title1 from "@/components/shared/title/title1";
import PricingCard7 from "./card/pricing-card7";

type Props = {
  pricing: {
    data: {
      title: string;
      monthly: PricingCardType[];
      yearly: PricingCardType[];
    };
  };
};

const ContentWriterPricing = ({ pricing }: Props) => {
  const { title, monthly, yearly } = pricing.data;

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
    <section className="pt-[55px] md:pt-[80px] xl:pt-[106px] 2xl:pt-[131px]">
      <div className="container" ref={containerRef}>
        <Title1
          text={title}
          className="max-w-[700px] mx-auto text-center has_fade_anim"
        />
        <div className="mt-[30px] xl:mt-[40px] 2xl:mt-[50px]">
          <div
            className="flex justify-center items-center space-x-2 has_fade_anim"
            dir="ltr"
          >
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
              className="bg-[#121B21] [&>span]:bg-[#FF856A]"
            />
            <Label
              htmlFor="pricing-mode"
              className="text-[18px] text-primary font-normal"
            >
              Yearly
            </Label>
          </div>
          <div className="flex justify-center mt-[30px] lg:mt-[50px]">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-[30px] has_fade_anim"
              data-delay="0.25"
            >
              {priceContent &&
                priceContent.length > 0 &&
                priceContent.map((item, i) => (
                  <div key={`price_table-${i}`}>
                    <PricingCard7 price={item} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentWriterPricing;
