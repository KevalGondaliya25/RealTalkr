"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
      details: string;
      image: string;
      image2: string;
      items: string[];
      action_btn: ActionBtnType;
    };
  };
};

const StartupFeature3 = ({ feature }: Props) => {
  const { title, details, image, image2, items, action_btn } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space4">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-y-[60px]">
          <div className="col-span-1 lg:col-span-5 me-0 lg:me-[30px]">
            <TitleSection2
              title={title}
              details={details}
              className="text-start"
              titleClassName="mx-0"
              detailsClassName="mx-0"
            />
            {items && items.length && (
              <ul className="mt-[24px] has_fade_anim">
                {items.map((item, i) => (
                  <li
                    key={`feature_item-${i}`}
                    className="text-[18px] font-medium text-primary leading-[1.44] flex items-start gap-[4px] mt-[10px] first:mt-0"
                  >
                    <Image
                      width={18}
                      height={18}
                      src="/assets/imgs/icon/icon-r-26.png"
                      className="mt-[2px]"
                      alt="icon image"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {action_btn && action_btn.enable && (
              <div className="mt-[20px] md:mt-[46px] has_fade_anim">
                <Link
                  href={action_btn.link}
                  className={cn(buttonVariants({ variant: "primary2" }))}
                >
                  {action_btn.label}
                </Link>
              </div>
            )}
          </div>
          <div className="col-span-1 lg:col-span-6">
            <div className="relative bg-sec_bg max-w-[550px] rounded-theme mb-[30px] md:mb-0 p-[30px] md:p-[7px] lg:p-[30px] ">
              {image && (
                <Image
                  width={448}
                  height={440}
                  src={image}
                  data-speed="1.0"
                  alt="shape"
                />
              )}
              {image2 && (
                <Image
                  width={219}
                  height={300}
                  src={image2}
                  className="absolute end-[30px] bottom-[140px] md:bottom-[60px] lg:bottom-[30px] drop-shadow-[-20px_-19px_50px_rgba(28,37,60,0.05)] max-w-[150px] md:max-w-[219px]"
                  alt="shape"
                  data-speed="0.9"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartupFeature3;
