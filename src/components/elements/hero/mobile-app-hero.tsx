"use client";

import { useRef, useState } from "react";
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
import { Button, buttonVariants } from "@/components/ui/button";

// components
import VideoModal from "@/components/tools/video-modal";

type Props = {
  hero: {
    data: {
      title: string;
      details: string;
      image: string;
      video: string;
      video_label: string;
      action_btn: ActionBtnType;
      ticket: {
        enable: boolean;
        text: string;
        image: string;
      };
      badge: {
        enable: boolean;
        text1: string;
        text2: string;
        image: string;
      };
      shape: string;
      bg: string;
      bg_shape1: string;
      bg_shape2: string;
      bg_shape3: string;
    };
  };
};

const MobileAppHero = ({ hero }: Props) => {
  const {
    title,
    details,
    image,
    video,
    video_label,
    action_btn,
    ticket,
    badge,
    shape,
    bg,
    bg_shape1,
    bg_shape2,
    bg_shape3,
  } = hero.data;

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  const closeDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section
      className={cn(
        "relative pt-[120px] md:pt-[100px] xl:pt-[150px] 2xl:pt-[230px] pb-[170px] md:pb-[279px]",
        bg && `bg-no-repeat`
      )}
      style={{ backgroundImage: `url(${bg})` }}
      ref={containerRef}
    >
      {bg_shape1 && (
        <Image
          width={1083}
          height={508}
          src={bg_shape1}
          className="hidden xl:block absolute top-0 start-[170px] z-[1] mix-blend-soft-light rtl_y"
          alt="shape"
        />
      )}
      {bg_shape2 && (
        <Image
          width={887}
          height={516}
          src={bg_shape2}
          className="hidden xl:block absolute top-auto 2xl:top-[484px] end-0 bottom-0 2xl:bottom-auto z-[1] rtl_y"
          alt="shape"
        />
      )}
      {bg_shape3 && (
        <Image
          width={654}
          height={554}
          src={bg_shape3}
          className="hidden xl:block absolute -end-[160px] lg:-end-[32px] xl:end-[124px] 2xl:end-[315px] -bottom-[75px] xl:-bottom-[70px] 2xl:-bottom-[60px] z-[1] rtl_y"
          alt="shape"
        />
      )}
      <div className="container relative z-[2]">
        {badge && badge.enable && (
          <div className="hidden md:grid max-w-[370px] mx-auto grid-cols-[90px_70px_100px] 2xl:grid-cols-[90px_100px_100px] gap-[40px] items-center has_fade_anim">
            <p className="font-medium leading-[1.11]">{badge.text1}</p>
            <div className="p-[20px] xl:p-[15px] 2xl:p-[30px] rounded-[35px] bg-[linear-gradient(135deg,#00FF85_4.35%,#21D37E_95.65%)]">
              {badge.image && (
                <Image
                  width={36}
                  height={32}
                  src={badge.image}
                  alt="site-logo"
                />
              )}
            </div>
            <p className="font-medium leading-[1.11]">{badge.text2}</p>
          </div>
        )}
        <div className="relative pt-0 md:pt-[30px] xl:pt-[54px]">
          {shape && (
            <div data-speed="0.9">
              <Image
                width={138}
                height={82}
                src={shape}
                className="hidden md:block max-w-[70px] xl:max-w-[100px] 2xl:max-w-[138px] absolute start-[5px] rtl_y"
                alt="arrow"
              />
            </div>
          )}
          <h1
            className="text-[40px] md:text-[65px] xl:text-[90px] 2xl:text-[130px] text-center !leading-[0.9] font-semibold max-w-[680px] xl:max-w-[800px] 2xl:max-w-[970px] mx-auto has_fade_anim"
            data-delay="0.30"
          >
            {title}
          </h1>
        </div>
        {ticket && ticket.enable && (
          <div
            className="hidden md:block relative text-center bg-white px-[24px] py-[25px] max-w-[184px] rounded-theme ms-auto me-[96px] -bottom-[5px] -end-[50px] xl:end-0 has_fade_anim"
            data-delay="0.45"
          >
            {ticket.image && (
              <Image
                width={51}
                height={60}
                src={ticket.image}
                className="inline-block"
                alt="logo"
              />
            )}
            <p className="text-[16px] pt-[10px] font-semibold text-primary leading-[1.2]">
              {ticket.text}
            </p>
          </div>
        )}
        {image && (
          <div
            className="unset md:absolute top-[60.5%] start-0 lg:start-[10%] xl:start-0 max-w-[180px] md:max-w-[400px] lg:max-w-[500px] pt-[20px] md:pt-0 pb-[10px] md:pb-0 mx-auto md:mx-0"
            data-speed="1.2"
          >
            <Image
              width={733}
              height={668}
              src={image}
              className="h-full max-w-full xl:h-[668px] xl:w-[733px] xl:max-w-[733px] rtl_y"
              alt="mobile-thumb"
            />
          </div>
        )}
      </div>
      <div className="absolute max-w-full md:max-w-[325px] end-0 md:end-[15px] xl:end-[317px] bottom-[30px] md:bottom-[45px] xl:-bottom-[80px] 2xl:-bottom-[60px] px-[12px] md:px-0 z-[2] ">
        <p className="has_fade_anim">{details}</p>
        <div className="pt-[15px] md:pt-[35px] flex items-center gap-[20px] has_fade_anim">
          {action_btn && action_btn.enable && (
            <Link
              href={action_btn.link}
              className={cn(buttonVariants({ variant: "primary2" }))}
            >
              {action_btn.label}
            </Link>
          )}

          <Button variant="link" size="auto" onClick={() => setIsOpen(!isOpen)}>
            {video_label}
          </Button>
        </div>
      </div>
      <VideoModal link={video} isOpen={isOpen} close={closeDialog} />
    </section>
  );
};

export default MobileAppHero;
