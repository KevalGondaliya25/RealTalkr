"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// icon
import { FaArrowUp } from "react-icons/fa6";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  feature: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      main_feature: {
        enable: boolean;
        title: string;
        details: string;
        image: string;
        counter: {
          text: string;
          number: number;
          unit: string;
          prefix: string;
        }[];
        action_btn: ActionBtnType;
      };
      items: {
        title: string;
        details: string;
        image: string;
      }[];
    };
  };
};

const SEOFeature = ({ feature }: Props) => {
  const { title, sub_title, details, main_feature, items } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_top2">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          sub_title={sub_title}
          details={details}
          titleClassName="max-w-[750px]"
          detailsClassName="max-w-[720px]"
        />
        <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px]">
          {main_feature && main_feature.enable && (
            <div className="grid grid-cols-[auto] lg:grid-cols-[auto_auto] items-center justify-between text-center lg:text-start p-[25px] lg:p-[55px] lg:pe-0 gap-x-[60px] gap-y-[30px] mb-[30px] bg-[#F7FAF9] rounded-theme">
              <div className="max-w-[535px] lg:max-w-[385px] mx-auto lg:mx-0">
                <h3 className="text-[24px] md:text-[30px] has_fade_anim">
                  {main_feature.title}
                </h3>
                <p className="mt-[18px] has_fade_anim">
                  {main_feature.details}
                </p>
                {main_feature.action_btn && main_feature.action_btn.enable && (
                  <div className="mt-[43px] has_fade_anim">
                    <Link
                      href={main_feature.action_btn.link}
                      className={cn(buttonVariants({ variant: "primary6" }))}
                    >
                      <span
                        className="btn-span"
                        data-text={main_feature.action_btn.label}
                      >
                        {main_feature.action_btn.label}
                      </span>
                    </Link>
                  </div>
                )}
                {main_feature.counter && main_feature.counter.length && (
                  <div className="mt-[43px] flex justify-start lg:justify-center has_fade_anim">
                    {main_feature.counter.map((item, i) => (
                      <div
                        key={`counter_item-${i}`}
                        className="last:border-s last:border-[#DFE4E5] last:ps-[40px] last:ms-[40px]"
                      >
                        <p className="text-[18px] leading-none mt-0">
                          {item.text}
                        </p>
                        <div className="flex justify-between items-end">
                          <h3 className="text-[36px] font-bold inline-block mt-[8px] w-[105px]">
                            {item.prefix}
                            <span>{item.number}</span>
                            {item.unit}
                          </h3>
                          <div className="text-theme text-[18px]">
                            <FaArrowUp />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="has_fade_anim">
                {main_feature.image && (
                  <Image
                    width={741}
                    height={463}
                    src={main_feature.image}
                    alt="feature image"
                  />
                )}
              </div>
            </div>
          )}
          {items && items.length && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
              {items.map((item, i) => (
                <div
                  key={`feature_item-${i}`}
                  className="bg-[#F7FAF9] rounded-theme p-[25px] lg:pt-[48px] lg:pb-0 lg:px-[55px] text-center"
                >
                  <div>
                    <h3 className="text-[24px] md:text-[30px] has_fade_anim">
                      {item.title}
                    </h3>
                    <p className="mt-[18px] has_fade_anim">{item.details}</p>
                  </div>
                  {item.image && (
                    <div className="mt-[43px] has_fade_anim">
                      <Image
                        width={520}
                        height={376}
                        src={item.image}
                        data-fade-offset="0"
                        alt="feature image"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SEOFeature;
