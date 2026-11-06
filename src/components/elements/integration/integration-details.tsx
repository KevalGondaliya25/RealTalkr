"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import siteConfig from "@/config/siteConfig.json";

// icons
import { ChevronRight, Plus } from "lucide-react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// shardcn components
import { buttonVariants } from "@/components/ui/button";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  integration: {
    data: {
      title: string;
      short_description: string;
      image: string;
      action_btn: ActionBtnType;
    };
    content: string;
  };
  children?: React.ReactNode;
};

const IntegrationDetails = ({ integration, children }: Props) => {
  const { title, short_description, image, action_btn } = integration.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[25px] md:pt-[35px] xl:pt-[65px] 2xl:pt-[135px] relative">
      <div className="container" ref={containerRef}>
        <div className="relative z-10">
          <TitleSection2
            title={`Real Talkr + ${title}`}
            details={short_description}
            heading
            titleClassName="max-w-full"
          />
          {action_btn && action_btn.enable && (
            <div className="has_fade_anim" data-delay="0.45">
              <Link
                href={action_btn.link}
                className={cn(
                  buttonVariants({ variant: "normal", size: "auto" }),
                  "mt-[32px] lg:mt-[42px] xl:mt-[52px] 2xl:mt-[62px] flex text-primary hover:text-theme text-[18px] md:text-[21px]"
                )}
              >
                <span data-text={action_btn.label}>{action_btn.label}</span>
                <span className="rtl_y">
                  <ChevronRight />
                </span>
              </Link>
            </div>
          )}
        </div>
        <div className="has_fade_anim" data-delay="0.60">
          <div className="-mt-[65px] md:-mt-[165px] lg:-mt-[245px] xl:-mt-[285px] 2xl:-mt-[335px] bg-[url(/assets/imgs/integration/main/line.png)] bg-no-repeat bg-cover bg-[top_center]">
            <div className="pt-[120px] md:pt-[210px] lg:pt-[325px] xl:pt-[430px] pb-[50px] md:pb-[90px] lg:pb-[150px] xl:pb-[180px] flex justify-center items-center ">
              <div className="w-[112px] xl:w-[142px] h-[112px] xl:h-[142px] flex justify-center items-center -me-[20px] lg:-me-[22px] xl:-me-[30px] bg-white rounded-full drop-shadow-[10px_20px_60px_rgba(0,0,0,0.05)]">
                <Image
                  width={60}
                  height={60}
                  style={{
                    maxHeight: "60px",
                    minHeight: "40px",
                    width: "auto",
                  }}
                  src={siteConfig?.site_info?.logo_icon}
                  alt="Brand Logo"
                />
              </div>
              <div className="w-[50px] xl:w-[60px] h-[50px] xl:h-[60px] flex justify-center items-center z-10 bg-white rounded-full drop-shadow-[10px_20px_60px_rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.03)]">
                <Plus />
              </div>
              <div className="w-[112px] xl:w-[142px] h-[112px] xl:h-[142px] flex justify-center items-center -ms-[20px] lg:-ms-[22px] xl:-ms-[30px] bg-white rounded-full drop-shadow-[10px_20px_60px_rgba(0,0,0,0.05)]">
                <Image
                  width={60}
                  height={60}
                  style={{
                    maxHeight: "60px",
                    minHeight: "40px",
                    width: "auto",
                  }}
                  src={image}
                  alt="Brand Logo"
                />
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
};

export default IntegrationDetails;
