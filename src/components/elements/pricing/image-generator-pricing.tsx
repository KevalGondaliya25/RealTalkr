"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import { delayTime2 } from "@/lib/helper/delayTime";

// types
import { PricingCardType } from "@/types";

// shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// components
import PricingCard6 from "./card/pricing-card6";
import { Separator } from "@/components/ui/separator";
import Title1 from "@/components/shared/title/title1";

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

const ImageGeneratorPricing = ({ pricing, className }: Props) => {
  const { title, details, monthly, yearly } = pricing.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className={cn("sec_space_top3", className)}>
      <div className="container" ref={containerRef}>
        <Tabs
          defaultValue="monthly"
          className="grid grid-cols-1 xl:grid-cols-[auto_640px] 2xl:grid-cols-[auto_740px] justify-between gap-x-[80px] gap-y-[40px]"
        >
          <div className="text-center xl:text-start">
            <Title1
              text={title}
              className="max-w-[300px] mx-auto xl:mx-0 has_fade_anim"
            />
            <p className="mt-[29px] max-w-[400px] mx-auto xl:mx-0 has_fade_anim">
              {details}
            </p>
            <TabsList className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] has_fade_anim">
              <div className="bg-[#121B21] rounded-full relative">
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
                <div className="hidden md:block absolute bottom-[5px] start-[calc(100%+27px)] w-max">
                  <Image
                    width={76}
                    height={25}
                    src="/assets/imgs/shape/shape-s-36.png"
                    alt="shape image"
                  />
                </div>
                <h3 className="hidden md:block absolute text-[14px] leading-[1.21] text-center start-[calc(100%+64px)] bottom-[38px] w-max rotate-30">
                  Save 20% with <br />
                  annual plans
                </h3>
              </div>
            </TabsList>
          </div>

          <div className="bg-[#121B21] mt-[14px] rounded-theme">
            <TabsContent value="monthly" className="mt-0">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] justify-center gap-[20px] relative">
                {monthly &&
                  monthly.length &&
                  monthly.slice(0, 2).map((item, i) => (
                    <div
                      key={`price_table_monthly-${i}`}
                      data-delay={delayTime2(i + 1)}
                      className="has_fade_anim flex items-center space-x-4"
                    >
                      <div className="flex-1">
                        <PricingCard6 price={item} />
                      </div>
                      {i + 1 === 1 && (
                        <Separator
                          orientation="vertical"
                          className="bg-[#252D33] h-[calc(100%-100px)]"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="yearly" className="mt-0">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] justify-center gap-[20px] relative">
                {yearly &&
                  yearly.length &&
                  yearly.slice(0, 2).map((item, i) => (
                    <div
                      key={`price_table_yearly-${i}`}
                      data-delay={delayTime2(i + 1)}
                      className="has_fade_anim flex items-center space-x-4"
                    >
                      <div className="flex-1">
                        <PricingCard6 price={item} />
                      </div>
                      {i + 1 === 1 && (
                        <Separator
                          orientation="vertical"
                          className="bg-[#252D33] h-[calc(100%-100px)]"
                        />
                      )}
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

export default ImageGeneratorPricing;
