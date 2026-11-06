"use client";

import { useRef } from "react";
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
import { buttonVariants } from "@/components/ui/button";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  hero: {
    data: {
      title: string;
      details: string;
      bg_shape: string;
      action_btn: ActionBtnType;
      users: {
        enable: boolean;
        number: number;
        unit: string;
        text: string;
        items: string[];
      };
      icon: string;
      image: string;
      card1: {
        enable: true;
        image: string;
        shape1: string;
        shape2: string;
      };
      card2: {
        enable: true;
        text: string;
        image: string;
        tag: string;
        shape: string;
      };
    };
  };
};

const ContentWriterHero = ({ hero }: Props) => {
  const {
    title,
    details,
    bg_shape,
    action_btn,
    users,
    icon,
    image,
    card1,
    card2,
  } = hero.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[173px]">
      <div className="container" ref={containerRef}>
        <div className="flex justify-between items-center flex-col lg:flex-row relative z-[1] gap-x-[30px] gap-y-[40px]">
          {bg_shape && (
            <div className="absolute w-[153%] -top-[89%] start-[5%] rotate-[38deg] -z-[1] blur-[40px] rtl:-rotate-[38px]">
              <Image
                width={1977}
                height={1483}
                src={bg_shape}
                className="rtl_y"
                alt="shape image"
              />
            </div>
          )}
          {bg_shape && (
            <div className="absolute w-[42%] top-[90%] -start-[4%] rotate-[135deg] -z-[1] blur-[40px] rtl:-rotate-[135px]">
              <Image
                width={1977}
                height={1483}
                src={bg_shape}
                className="rtl_y"
                alt="shape image"
              />
            </div>
          )}
          <div className="max-w-[601px] lg:max-w-[431px]">
            <Title1
              text={title}
              heading1
              html
              className="[&>span]:text-[30px] [&>span]:xl:text-[50px] [&>span]:2xl:text-[60px] [&>span>span]:text-[40px] [&>span>span]:xl:text-[70px] [&>span>span]:2xl:text-[90px] [&>span>span]:bg-gradient-135-full [&>span>span]:bg-clip-text [&>span>span]:text-transparent has_fade_anim"
            />
            <p className="mt-[14px] has_fade_anim" data-delay="0.3">
              {details}
            </p>
            {action_btn && action_btn.enable && (
              <div className="mt-[33px] has_fade_anim" data-delay="0.45">
                <Link
                  href={action_btn.link}
                  className={cn(
                    buttonVariants({ variant: "primary5", size: "lg" })
                  )}
                >
                  <span className="btn-span" data-text={action_btn.label}>
                    {action_btn.label}
                  </span>
                </Link>
              </div>
            )}
            {users && users.enable && (
              <div
                className="flex gap-[10px] items-center mt-[35px] has_fade_anim"
                data-delay=".6"
              >
                {users.items && users.items.length && (
                  <div className="flex">
                    {users.items.map((item, i) => (
                      <Image
                        key={`users_item-${i}`}
                        width={43}
                        height={43}
                        src={item}
                        className="w-[43px] rounded-full border-[3px] border-[#051119] -ms-[16px] first:ms-0"
                        alt="Clint image"
                      />
                    ))}
                    <div className="bg-white rounded-full w-[43px] border-[3px] border-[#051119] -ms-[16px] flex justify-center items-center text-[#072032] text-[24px] cursor-default">
                      +
                    </div>
                  </div>
                )}
                <p className="text-[16px] leading-[1.06] text-white">
                  <span>{users.number}</span>
                  {users.unit}{" "}
                  <span dangerouslySetInnerHTML={markdownify(users.text)} />
                </p>
              </div>
            )}
          </div>
          <div className="relative w-[327px] lg:w-[517px] xl:w-[627px] 2xl:w-[827px] aspect-[100/111] md:aspect-[100/83]">
            {icon && (
              <div className="hodden md:flex w-[85px] h-[85px] justify-center items-center bg-[#ffffff1f] backdrop-blur-[7.5px] rounded-theme border border-[#ffffff4a] absolute top-0 start-[55%] z-[1]">
                <Image width={46} height={46} src={icon} alt="shape image" />
              </div>
            )}
            {image && (
              <div
                className="hidden md:block absolute top-[23%] start-0 w-[29%] z-[1]"
                data-speed="0.7"
              >
                <Image
                  width={242}
                  height={274}
                  src={image}
                  className="rtl_y"
                  alt="shape image"
                />
              </div>
            )}
            {card1 && card1.enable && (
              <div className="absolute bottom-auto md:bottom-0 top-0 md:top-auto start-0 md:start-[20%] w-[80%] md:w-[70%] bg-[#ffffff1a] backdrop-blur-[10px] rounded-theme border-[1.5px] border-[#ffffff1a]">
                {card1.image && (
                  <Image
                    width={580}
                    height={646}
                    src={card1.image}
                    alt="gallery image"
                  />
                )}
                {card1.shape1 && (
                  <Image
                    width={82}
                    height={2}
                    src={card1.shape1}
                    className="absolute -top-[1px] start-[61px] h-[1.5px]"
                    alt="shape image"
                  />
                )}
                {card1.shape2 && (
                  <Image
                    width={2}
                    height={82}
                    src={card1.shape2}
                    className="absolute bottom-[25px] -end-[1.5px] w-[1.5]"
                    alt="shape image"
                  />
                )}
              </div>
            )}
            {card2 && card2.enable && (
              <div
                className="absolute top-auto md:top-[40%] end-0 bottom-0 md:bottom-auto p-[35px] text-center max-w-[224px] border border-[#ffffff4a] bg-[#ffffff1f] backdrop-blur-[12.5px] rounded-theme"
                data-speed="1.2"
              >
                {card2.image && (
                  <Image
                    width={42}
                    height={42}
                    src={card2.image}
                    alt="gallery image"
                  />
                )}
                <p className="text-[20px] leading-tight font-medium text-white mt-[19px]">
                  {card2.text}
                </p>
                <span className="text-[14px] font-bold uppercase px-[27px] py-[13px] text-white inline-block rounded-full mt-[25px] bg-gradient-105 from-[#ffc58fa6] from-[0.8%] to-[#ff8dbda6] to-[60.89%]">
                  {card2.tag}
                </span>
                {card2.shape && (
                  <Image
                    width={38}
                    height={40}
                    src={card2.shape}
                    className="absolute start-full bottom-[calc(100%-8px)]"
                    alt="shape image"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentWriterHero;
