"use client";

import { useEffect, useRef, useState } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import PricingCard8 from "./card/pricing-card8";

type PricingCardType = {
  name: string;
  price: string;
  price_label: string;
  details: string;
  bg_color: string;
  action_btn: ActionBtnType;
};

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

const MarketingPricing = ({ pricing, className }: Props) => {
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
    <section className={cn("sec_space_bottom2", className)}>
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[630px]"
          detailsClassName="max-w-[630px]"
        />
        <div className="mt-[33px] xl:mt-[53px] 2xl:mt-[63px]">
          <div className="flex justify-center has_fade_anim">
            <div className="relative">
              <div className="flex items-center space-x-5" dir="ltr">
                <Label
                  htmlFor="pricing-mode"
                  className={cn(
                    "text-[18px] font-medium",
                    toggleYear ? "text-[#B5BCC2]" : "text-primary"
                  )}
                >
                  Monthly
                </Label>
                <Switch
                  id="pricing-mode"
                  checked={toggleYear}
                  onCheckedChange={(value) => setToggleYear(value)}
                  className="border border-border [&>span]:bg-primary"
                />
                <Label
                  htmlFor="pricing-mode"
                  className={cn(
                    "text-[18px] font-medium",
                    toggleYear ? "text-primary" : "text-[#B5BCC2]"
                  )}
                >
                  Yearly
                </Label>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-[30px] lg:mt-[50px]">
            {priceContent && priceContent.length > 0 && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-[30px] relative z-[2] has_fade_anim"
                data-delay="0.25"
              >
                {priceContent.map((item, i) => (
                  <div key={`price_table-${i}`}>
                    <PricingCard8
                      price={item}
                      style={{ backgroundColor: item.bg_color }}
                      btnClassName="bg-white hover:bg-primary text-primary hover:text-white"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingPricing;
