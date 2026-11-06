"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import { delayTime } from "@/lib/helper/delayTime";

// types
import { PricingCardType } from "@/types";

// shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import PricingCard2 from "./card/pricing-card2";

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

const MeetingPricing = ({ pricing, className }: Props) => {
  const { title, details, monthly, yearly } = pricing.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section
      className={cn(
        "pt-[51px] md:pt-[81px] xl:pt-[111px] 2xl:pt-[181px]",
        className
      )}
    >
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[850px]"
        />
        <Tabs
          defaultValue="monthly"
          className="mt-[33px] xl:mt-[53px] 2xl:mt-[63px]"
        >
          <TabsList className="flex has_fade_anim">
            <div className="bg-[#F0F7F8] rounded-full">
              <TabsTrigger
                value="monthly"
                className="px-[38px] py-[22px] text-[16px] text-primary leading-none data-[state=active]:bg-theme rounded-full transition-all duration-300"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="px-[38px] py-[22px] text-[16px] text-primary leading-none data-[state=active]:bg-theme rounded-full transition-all duration-300"
              >
                Yearly
              </TabsTrigger>
            </div>
          </TabsList>
          <div className="flex justify-center mt-[30px] lg:mt-[50px]">
            <TabsContent value="monthly">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center gap-[30px]">
                {monthly &&
                  monthly.length &&
                  monthly.map((item, i) => (
                    <div
                      key={`monthly_price_table-${i}`}
                      data-delay={delayTime(i + 1)}
                      className="has_fade_anim"
                    >
                      <PricingCard2 price={item} />
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="yearly">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center gap-[30px]">
                {yearly &&
                  yearly.length &&
                  yearly.map((item, i) => (
                    <div
                      key={`yearly_price_table-${i}`}
                      data-delay={delayTime(i + 1)}
                      className="has_fade_anim"
                    >
                      <PricingCard2 price={item} />
                    </div>
                  ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default MeetingPricing;
