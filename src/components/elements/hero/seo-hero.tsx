"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// icons
import { FaPlay } from "react-icons/fa6";

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
import VideoModal from "@/components/tools/video-modal";

type Props = {
  hero: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      video: string;
      video_label: string;
      image: string;
      action_btn: ActionBtnType;
      people: {
        enable: boolean;
        label: string;
        number: string;
        members: string[];
      };
      client: {
        enable: boolean;
        image1: string;
        image2: string;
      };
      users: {
        enable: boolean;
        text: string;
        number: string;
        increment: string;
        image: string;
      };
      spreed: {
        enable: boolean;
        icon: string;
        text: string;
        image: string;
      };
      shape: string;
    };
  };
};

const SEOHero = ({ hero }: Props) => {
  const {
    title,
    sub_title,
    details,
    video,
    video_label,
    image,
    action_btn,
    people,
    client,
    users,
    spreed,
    shape,
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
    <section className="pt-[140px] md:pt-[160px] xl:pt-[180px] 2xl:pt-[220px] pb-[60px] md:pb-[80px] xl:pb-[100px] overflow-hidden bg-[#F2FCF7]">
      <div className="container" ref={containerRef}>
        <div className="relative z-[1]">
          <div className="blur-[200px]">
            <div className="absolute -z-[1] -start-[186px] -top-[274px]">
              <Image
                width={1027}
                height={968}
                src="/assets/imgs/shape/shape-s-45.png"
                className="rtl_y"
                alt="shape image"
              />
            </div>
            <div className="absolute -z-[1] -end-[186px] -top-[274px]">
              <Image
                width={1026}
                height={968}
                src="/assets/imgs/shape/shape-s-46.png"
                className="rtl_y"
                alt="shape image"
              />
            </div>
            <div className="absolute -z-[1] -end-[120px] top-[405px]">
              <Image
                width={726}
                height={686}
                src="/assets/imgs/shape/shape-s-47.png"
                className="rtl_y"
                alt="shape image"
              />
            </div>
          </div>
          <div className="absolute -start-[511px] -top-[387px] w-[1083px] h-[1083px] bg-[linear-gradient(316.41deg,rgba(255,255,255,0.21)15.2%,rgba(255,255,255,0)86.43%)] backdrop-blur-[5px] border-[4px] border-[#ffffff36] rounded-full"></div>
          <div className="absolute start-[351px] top-[675px] w-[1083px] h-[1083px] bg-[linear-gradient(316.41deg,rgba(255,255,255,0.21)15.2%,rgba(255,255,255,0)86.43%)] backdrop-blur-[5px] border-[4px] border-[#ffffff36] rounded-full"></div>
          <div className="relative text-center max-w-[500px] lg:max-w-[660px] xl:max-w-[710px] mx-auto">
            {sub_title && (
              <div>
                <span className="text-[12px] font-bold leading-none uppercase text-primary bg-[#EAFAF2] border border-theme rounded-[10px] px-[17px] py-[8px] inline-flex gap-[3px] has_fade_anim">
                  <Image
                    width={15}
                    height={15}
                    src="/assets/imgs/icon/pen.png"
                    className="me-[3px]"
                    alt="icon image"
                  />
                  {sub_title}
                </span>
              </div>
            )}
            <h1
              className="mt-[27px] text-[40px] md:text-[50px] lg:text-[70px] xl:text-[80px] 2xl:text-[90px] font-bold leading-none [&>span]:text-theme [&>span]:relative [&>span]:inline-block [&>span]:leading-none [&>span]:before:absolute [&>span]:before:content-[url(/assets/imgs/shape/shape-s-50.svg)] [&>span]:before:top-[calc(77%+9px)] [&>span]:before:start-0 [&>span]:before:leading-[0] [&>span]:before:w-full [&>span]:before:rtl_y [&>span]:after:absolute [&>span]:after:content-[url(/assets/imgs/shape/shape-s-51.png)] [&>span]:after:top-[8%] [&>span]:after:start-[99%] [&>span]:after:leading-[0] [&>span]:after:w-[34px] [&>span]:after:rtl_y has_fade_anim"
              data-delay="0.30"
              dangerouslySetInnerHTML={markdownify(title)}
            />

            <p
              className="mt-[46px] text-[18px] xl:text-[22px] max-w-[660px] xl:max-w-[700px] mx-auto text-primary leading-[1.36] has_fade_anim"
              data-delay="0.45"
            >
              {details}
            </p>
            <div
              className="flex justify-center flex-wrap gap-[20px] mt-[43px] has_fade_anim"
              data-delay="0.60"
            >
              {action_btn && action_btn.enable && (
                <Link
                  href={action_btn.link}
                  className={cn(buttonVariants({ variant: "primary6" }))}
                >
                  <span className="btn-span" data-text={action_btn.label}>
                    {action_btn.label}
                  </span>
                </Link>
              )}
              {video && (
                <div className="flex items-center gap-[10px]">
                  <div
                    className="w-[50px] md:w-[56px] h-[50px] md:h-[56px] flex justify-center items-center border md:border-[1.5px] border-primary hover:border-theme rounded-full transition-all duration-500 text-primary hover:text-theme"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <FaPlay />
                  </div>
                  <p className="text-[16px] font-bold text-primary">
                    {video_label}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-[70px]">
            <div className="relative grid grid-cols-1 md:grid-cols-[220px_auto] lg:grid-cols-[220px_auto_220px] xl:grid-cols-[280px_auto_auto] gap-[20px]">
              <div className="flex flex-col gap-[10px]">
                {people && people.enable && (
                  <div className="bg-white rounded-theme pt-[31px] pb-[33px] px-[30px] has_fade_anim">
                    <p className="text-[16px] leading-[1.125] max-w-[185px]">
                      <span
                        className="font-bold text-primary underline"
                        style={{ textDecorationSkipInk: "none" }}
                      >
                        {people.number}
                      </span>{" "}
                      {people.label}
                    </p>
                    <div className="mt-[15px]">
                      {people.members && people.members.length && (
                        <div className="flex">
                          {people.members.map((item, i) => (
                            <Image
                              key={`people_member-${i}`}
                              width={55}
                              height={55}
                              src={item}
                              className={cn(
                                "rounded-full w-[50px] lg:w-[55px] border-[3px] border-white",
                                i !== 0 && "-ms-[20px]"
                              )}
                              alt="People"
                            />
                          ))}

                          <div className="bg-theme rounded-full w-[50px] lg:w-[55px] border-[3px] border-white -ms-[20px] flex justify-center items-center text-white text-[20px] cursor-default">
                            +
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {client && client.enable && (
                  <div className="h-full hidden md:block">
                    <div className="relative bg-theme rounded-theme flex justify-center h-full has_fade_anim">
                      {client.image1 && (
                        <div className="mt-auto">
                          <Image
                            width={242}
                            height={331}
                            src={client.image1}
                            alt="gallery image"
                          />
                        </div>
                      )}
                      {client.image2 && (
                        <div className="absolute start-[6%] top-[53%]">
                          <Image
                            width={146}
                            height={52}
                            src={client.image2}
                            alt="gallery image"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                {image && shape && (
                  <Image
                    width={20}
                    height={40}
                    src={shape}
                    className="hidden md:block absolute end-full top-[calc(170px/2)] -translate-y-[50%]"
                    alt="shape image"
                  />
                )}
                {image && (
                  <div className="h-full has_fade_anim">
                    <div className="h-full flex justify-center items-center bg-white rounded-theme">
                      <Image
                        width={690}
                        height={560}
                        src={image}
                        alt="gallery image"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col md:flex-row lg:flex-col col-span-1 md:col-span-2 lg:col-span-1 gap-[20px]">
                {users && users.enable && (
                  <div className="grow-0 md:grow lg:grow-0 bg-[#072032] rounded-theme pt-[27px] pb-[30px] px-[35px] has_fade_anim">
                    <p className="text-[16px] text-[#7E899C] leading-none">
                      {users.text}
                    </p>
                    <div className="mt-[14px] text-[30px] font-medium text-white flex items-center [&>span]:text-[10px] [&>span]:font-bold [&>span]:p-[5px] [&>span]:inline-block [&>span]:text-primary [&>span]:rounded-theme [&>span]:ms-[7px] [&>span]:bg-[#21E6F1]">
                      {users.number} <span>{users.increment}</span>
                    </div>
                    {users.image && (
                      <Image
                        width={210}
                        height={120}
                        src={users.image}
                        className="mt-[43px]"
                        alt="gallery image"
                      />
                    )}
                  </div>
                )}
                {spreed && spreed.enable && (
                  <div className="grow-0 md:grow lg:grow-0 relative text-center rounded-theme overflow-hidden z-[1] pt-[30px]  pb-[24px] px-[30px] bg-[url(/assets/imgs/shape/shape-s-43.png)] bg-no-repeat bg-cover has_fade_anim">
                    <Image
                      width={49}
                      height={49}
                      src={spreed.icon}
                      className="inline-block"
                      alt="icon image"
                    />
                    <p
                      className="text-[16px] leading-[1.125] font-bold text-white mt-[9px]"
                      dangerouslySetInnerHTML={markdownify(spreed.text)}
                    />
                    <Image
                      width={124}
                      height={104}
                      src={spreed.image}
                      className="mt-[18px] inline-block"
                      alt="gallery image"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <VideoModal link={video} isOpen={isOpen} close={closeDialog} />
    </section>
  );
};

export default SEOHero;
