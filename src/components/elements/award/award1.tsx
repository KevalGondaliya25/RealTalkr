"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// components
import Title1 from "@/components/shared/title/title1";
import VideoModal from "@/components/tools/video-modal";

type Props = {
  award: {
    data: {
      title: string;
      sub_title: string;
      image: string;
      video: string;
      award_img: string;
      action: {
        enable: boolean;
        icon: string;
        text: string;
      };
      people: string[];
      shape1_video: string;
      shape2_video: string;
      shape1_img: string;
    };
    content: string;
  };
};

const Award1 = ({ award }: Props) => {
  const {
    title,
    sub_title,
    image,
    video,
    award_img,
    action,
    people,
    shape1_img,
    shape1_video,
    shape2_video,
  } = award.data;

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
    <section className="relative pb-[80px]">
      <div className="absolute right-0 bottom-[50px]">
        {shape1_img && (
          <Image
            width={153}
            height={153}
            style={{ height: "auto" }}
            src={shape1_img}
            data-speed="0.8"
            alt="shape-1"
          />
        )}
      </div>
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-[169px_452px] lg:grid-cols-[169px_452px_auto] xl:grid-cols-[230px_574px_auto] gap-5 lg:gap-[15px] xl:gap-[60px]">
          <div>
            <div className="flex">
              <div
                className="relative max-w-[130px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {shape1_video && (
                  <Image
                    width={130}
                    height={130}
                    style={{ height: "auto" }}
                    src={shape1_video}
                    alt="video-icon"
                  />
                )}
                {shape2_video && (
                  <Image
                    width={18}
                    height={19}
                    src={shape2_video}
                    className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
                    alt="video-icon"
                  />
                )}
              </div>
              <Image
                width={130}
                height={130}
                style={{ height: "auto" }}
                src={image}
                className="relative -ms-[39px] rounded-full"
                alt="image"
              />
            </div>
          </div>
          <div>
            {action && action.enable && (
              <div className="flex gap-[7px] items-center mb-[15px]">
                <Image width={30} height={30} src={action.icon} alt="icon" />
                <div className="has_fade_anim">
                  <span className="text-[14px] font-semibold text-theme rounded-[15px] inline-block px-[15px] py-[10px] bg-theme-100 border-[0.5px] border-theme-300">
                    {action.text}
                  </span>
                </div>
              </div>
            )}
            <Title1
              text={sub_title}
              className="!text-[20px] !md:text-[24px] !leading-[2.5] [&>span]:underline [&>span]:underline-offset-[5px] has_fade_anim"
              html
            />
            <Title1
              text={title}
              className="!leading-[1.1] [&>span]:text-theme [&>span]:underline [&>span]:underline-offset-[9px] has_fade_anim"
              html
            />
          </div>
          <div className="max-w-[200px] md:max-w-[300px] ml-0 md:ml-auto text-start md:text-end has_fade_anim">
            {award_img && (
              <Image
                width={300}
                height={118}
                style={{ height: "auto" }}
                src={award_img}
                alt="award-logo"
              />
            )}
            {people && people.length && (
              <div className="flex pt-[10px] md:pt-[25px]">
                {people.slice(0, 3).map((item, i) => (
                  <Image
                    key={`people_item-${i}`}
                    width={55}
                    height={55}
                    src={item}
                    className={cn(
                      "rounded-full w-[50px] lg:w-[55px] border-[3px] border-white",
                      i !== 0 && "-ms-[20px]"
                    )}
                    alt="people"
                  />
                ))}

                <div className="bg-theme rounded-full w-[50px] lg:w-[55px] border-[3px] border-white -ms-[20px] flex justify-center items-center text-white text-[18px] cursor-default">
                  +3k
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <VideoModal link={video} isOpen={isOpen} close={closeDialog} />
    </section>
  );
};

export default Award1;
