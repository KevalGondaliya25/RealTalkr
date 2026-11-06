"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import { markdownify } from "@/lib/helper/convert";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { Button, buttonVariants } from "@/components/ui/button";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import Contact from "@/components/component/contact";
import VapiButton from "@/components/component/Button/vapiButton";

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
      sub_title: string;
      items: {
        number: string;
        text: string;
      }[];
      image1: string;
      image2: string;
      image3: string;
      shape1: string;
      shape2: string;
      shape3: string;
      action_btn: ActionBtnType;
    };
  };
};

const MarketingFeature = ({ feature }: Props) => {
  const {
    title,
    details,
    sub_title,
    items,
    action_btn,
    image1,
    image2,
    image3,
    shape1,
    shape2,
    shape3,
  } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);
  const [openContactDialog, setOpenContactDialog] = useState<boolean>(false);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space1">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-[650px_1fr] gap-[30px] 2xl:gap-[85px]">
          <div className="relative">
            {image1 && (
              <div className="md:absolute z-[2] rtl_y">
                <Image
                  width={270}
                  height={320}
                  src={image1}
                  className="rounded-theme border border-[#EBEDEF]"
                  data-speed="1.2"
                  alt="thumb-1"
                />
              </div>
            )}
            {image2 && (
              <div className="hidden md:block absolute top-[75px] xl:top-[35px] 2xl:top-0 end-0 lg:end-[105px] xl:end-[174px] 2xl:end-[135px] z-[2]">
                <Image
                  width={220}
                  height={175}
                  src={image2}
                  className="rounded-theme border border-[#EBEDEF] rtl_y"
                  alt="thumb-1"
                />
              </div>
            )}
            {image3 && (
              <div className="hidden xl:block absolute end-0 bottom-[130px] z-[2]">
                <Image
                  width={325}
                  height={195}
                  src={image3}
                  className="rounded-theme border border-[#EBEDEF] rtl_y"
                  alt="thumb-1"
                />
              </div>
            )}
            {shape1 && (
              <div className="hidden md:block absolute top-[45px] end-[50px]">
                <Image
                  width={70}
                  height={80}
                  src={shape1}
                  alt="thumb-1"
                  className="rtl_y"
                />
              </div>
            )}
            {shape2 && (
              <div className="hidden md:block absolute bottom-[150px] end-[350px]">
                <Image
                  width={64}
                  height={50}
                  src={shape2}
                  alt="thumb-1"
                  className="rtl_y"
                />
              </div>
            )}
            {shape3 && (
              <div className="hidden md:block absolute top-[57px] start-[181px] z-[1]">
                <Image
                  width={224}
                  height={224}
                  src={shape3}
                  data-speed="0.8"
                  alt="thumb-1"
                />
              </div>
            )}
          </div>
          <div className="information-content">
            <div className="pb-5 has_fade_anim">
              <span
                className="text-[18px] [&>span]:text-theme [&>span]:underline"
                dangerouslySetInnerHTML={markdownify(sub_title)}
              />
            </div>

            <TitleSection2
              title={title}
              details={details}
              className="text-start"
              titleClassName="sec_title2"
            />
            {items && items.length && (
              <div className="flex flex-col md:flex-row justify-between pt-[25px] xl:pt-[41px] gap-[25px] xl:gap-[100px] has_fade_anim">
                {items.map((item, i) => (
                  <div key={`feature_item-${i}`}>
                    <h3 className="text-[30px] pb-[19px] leading-[0.8]">
                      {item.number}
                    </h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            )}
            {action_btn && action_btn.enable && (
              <div className="pt-[15px] xl:pt-[45px] has_fade_anim">
                <Button
                  type="submit"
                  variant="primary"
                  className={
                    "border-2 border-charcoal bg-transparent text-charcoal hover:text-charcoal hover:bg-charcoal-300"
                  }
                  onClick={() => setOpenContactDialog(true)}
                >
                  <span className="btn-span" data-text={action_btn.label}>
                    {action_btn.label}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Contact
        isOpen={openContactDialog}
        close={() => setOpenContactDialog(false)}
        className="flex flex-col justify-center"
      />
    </section>
  );
};

export default MarketingFeature;
