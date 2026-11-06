"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// icons
import { FaStar } from "react-icons/fa6";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

type Props = {
  hero: {
    data: {
      title: string;
      details: string;
      action_btn: ActionBtnType;
      features: string[];
      image1: string;
      image2: string;
      review: {
        enable: true;
        title: string;
        rating: number;
        count: string;
        brand_logo: string;
      };
    };
  };
};

const ChatbotHero = ({ hero }: Props) => {
  const { title, details, action_btn, features, image1, image2, review } =
    hero.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );
  return (
    <section className="pt-[10px]">
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_490px] xl:grid-cols-[1fr_600px] 2xl:grid-cols-[1fr_820px] gap-[20px]"
        ref={containerRef}
      >
        <div className="bg-sec_bg-2 rounded-theme pt-[34px] md:pt-[54px] lg:pt-[64px] xl:pt-[84px] 2xl:pt-[144px] pb-[32px] md:pb-[52px] lg:pb-[62px] xl:pb-[82px] 2xl:pb-[142px] px-[25px] md:px-[30px] lg:px-[50px] xl:px-[70px] 2xl:px-[130px]">
          <h1 className="text-[35px] md:text-[40px] lg:text-[50px] xl:text-[60px] 2xl:text-[90px] max-w-[554px]">
            {title}
          </h1>
          <p className="mt-[22px] text-[18px] xl:text-[20px] leading-[1.4] max-w-[456px]">
            {details}
          </p>
          {action_btn && action_btn.enable && (
            <div className="mt-[38px]">
              <Link
                href={action_btn.link}
                className={cn(
                  buttonVariants({ variant: "primary2" }),
                  "border border-border"
                )}
              >
                <span
                  className="btn-span uppercase"
                  data-text={action_btn.label}
                >
                  {action_btn.label}
                </span>
              </Link>
            </div>
          )}
          {features && features.length && (
            <div className="mt-[44px]">
              <ul>
                {features.map((item, i) => (
                  <li
                    key={`feature_item-${i}`}
                    className="text-[18px] leading-[1.44] flex items-center gap-[10px]"
                  >
                    <Image
                      width={15}
                      height={16}
                      src="/assets/imgs/icon/check-3.png"
                      className="h-[16px] rtl_y"
                      alt="icon image"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          <div
            className="md:col-span-2 has_fade_anim"
            data-delay="0.3"
            data-fade-offset="0"
          >
            {image1 && (
              <Image
                width={820}
                height={530}
                src={image1}
                className="rounded-theme w-full h-full object-cover"
                alt="ai image"
              />
            )}
          </div>
          <div
            className="bg-[#D9EFCC] rounded-theme text-center px-[30px] 2xl:px-[70px] py-[38px] 2xl:py-[48px] has_fade_anim"
            data-delay="0.45"
            data-fade-offset="0"
          >
            {review && review.enable && (
              <>
                <p className="text-[18px] xl:text-[20px] 2xl:text-[24px] text-primary font-medium leading-tight">
                  {review.title}
                </p>
                <div className="mt-[38px] 2xl:mt-[58px]">
                  <h2 className="flex justify-center items-center text-[35px] md:text-[50px] !leading-[0.6] text-primary font-bold font-colasta">
                    {review.rating} <FaStar className="w-[20px] h-[20px]" />
                  </h2>
                  <p className="text-primary font-medium text-[18px] leading-none mt-[6px] mb-[9px]">
                    {review.count}
                  </p>
                  {review.brand_logo && (
                    <Image
                      width={205}
                      height={45}
                      src={review.brand_logo}
                      className="mx-auto mt-[5px]"
                      alt="brand logo"
                    />
                  )}
                </div>
              </>
            )}
          </div>
          <div
            className="relative -mt-[80px] rounded-theme outline-[20px] outline outline-white hidden md:block before:absolute before:content-[url(/assets/imgs/shape/shape-s-14.png)] before:top-[40px] before:end-[calc(100%+20px)] before:rtl_y after:absolute after:content-[url(/assets/imgs/shape/shape-s-14.png)] after:-top-[40px] after:end-0 after:rtl_y has_fade_anim"
            data-delay="0.6"
            data-fade-offset="0"
          >
            {image2 && (
              <Image
                width={400}
                height={450}
                src={image2}
                className="rounded-theme w-full h-full object-cover mask-[url(/assets/imgs/shape/shape-s-13.png)] mask-no-repeat mask-size-[100%_100%]"
                alt="ai image"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotHero;
