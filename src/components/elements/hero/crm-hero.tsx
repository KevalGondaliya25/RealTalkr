"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// icons
import { FaStar } from "react-icons/fa6";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { markdownify } from "@/lib/helper/convert";

// shadcn components
import { Button } from "@/components/ui/button";

// components
import Signup from "../signup";
import Signin from "../signin";
import VideoModal from "@/components/tools/video-modal";

type Props = {
  hero: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      video: string;
      feature_1: {
        enable: boolean;
        title: string;
        image: string;
      };
      feature_2: {
        enable: boolean;
        title: string;
        text: string;
        image1: string;
        image2: string;
      };
      feature_3: {
        enable: boolean;
        title: string;
        text: string;
        image: string;
        rating: string;
      };
    };
  };
};

const CRMHero = ({ hero }: Props) => {
  const { title, sub_title, details, video, feature_1, feature_2, feature_3 } =
    hero.data;

  const [isOpen3, setIsOpen3] = useState<boolean>(false);
  const [isOpen2, setIsOpen2] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  const closeDialog3 = () => {
    setIsOpen3(!isOpen3);
  };

  const closeDialog2 = () => {
    setIsOpen2(!isOpen2);
  };

  const closeDialog = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <section className="pt-[150px] lg:pt-[155px] xl:pt-[240px] pb-[50px] xl:pb-[100px] text-center bg-[url('/assets/imgs/background/bg.png')] bg-no-repeat bg-[#F9F6ED] bg-cover">
        <div className="container" ref={containerRef}>
          <div className="pb-[35px] md:pb-[50px] lg:pb-[100px]">
            <div className="max-w-[242px] pb-[22px] mx-auto">
              <h2 className="text-[18px] md:text-[36px] has_fade_anim">
                {sub_title}
              </h2>
            </div>
            <div className="pb-5 has_fade_anim" data-delay="0.30">
              <div className="">
                <h1 className="text-[50px] md:text-[70px] lg:text-[90px] xl:text-[130px] leading-none font-black relative inline">
                  <Image
                    width={60}
                    height={70}
                    src="/assets/imgs/shape/shape-r-2.png"
                    className="max-w-[21px] md:max-w-[60px] absolute -top-[11px] md:-top-[28px] -left-[22px] md:-left-[50px] text-xs"
                    alt="shape"
                  />
                  {title}
                </h1>
              </div>
            </div>
            <div className="pb-5 md:pb-[43px] max-w-[630px] mx-auto">
              <p
                className="text-[16px] md:text-[22px] text-primary leading-[1.36] has_fade_anim"
                data-delay="0.45"
              >
                {details}
              </p>
            </div>
            <div
              className="flex justify-center gap-[20px] has_fade_anim"
              data-delay="0.60"
            >
              <Button variant="primary2" onClick={() => setIsOpen3(true)}>
                Signup now
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-[#07203214]"
                onClick={() => setIsOpen(!isOpen)}
              >
                Watch demo
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px] xl:gap-[30px]">
            {feature_1 && feature_1.enable && (
              <div className="bg-primary w-full rounded-[40px] pt-[56px] grow mx-auto has_fade_anim">
                <div className="max-w-[246px] mx-auto pb-[40px]">
                  <h2 className="text-[24px] !text-white !leading-tight">
                    {feature_1.title}
                  </h2>
                </div>
                <Image
                  width={410}
                  height={217}
                  src={feature_1.image}
                  alt="card img"
                />
              </div>
            )}
            {feature_2 && feature_2.enable && (
              <div
                className="bg-white w-full rounded-[40px] pt-[56px] pb-[40px] grow mx-auto has_fade_anim"
                data-delay="0.25"
              >
                <div className="max-w-[246px] mx-auto pb-[40px]">
                  <h2 className="text-[24px] !leading-tight">
                    {feature_2.title}
                  </h2>
                </div>
                <div className="pb-5 md:pb-[37px] flex justify-center items-center">
                  <Image
                    width={100}
                    height={100}
                    src={feature_2.image1}
                    className="rounded-full"
                    alt="team-image"
                  />
                  <Image
                    width={100}
                    height={100}
                    src={feature_2.image2}
                    className="rounded-full -ms-[20px]"
                    alt="team-image"
                  />
                </div>
                <div>
                  <p
                    className="leading-[1.111]"
                    dangerouslySetInnerHTML={markdownify(feature_2.text)}
                  />
                </div>
              </div>
            )}
            {feature_3 && feature_3.enable && (
              <div
                className="bg-[#C0AAFF] w-full rounded-[40px] pt-[56px] pb-[40px] grow mx-auto flex flex-col justify-between has_fade_anim"
                data-delay="0.35"
              >
                <div className="max-w-[246px] mx-auto pb-[40px]">
                  <h2 className="text-[24px] !leading-tight">
                    {feature_3.title}
                  </h2>
                </div>
                <div>
                  <div className="pb-[3px]">
                    <h2 className="flex justify-center items-center text-[35px] md:text-[50px] !leading-[0.6] text-primary">
                      {feature_3.rating}{" "}
                      <FaStar className="w-[20px] h-[20px]" />
                    </h2>
                  </div>
                  <div>
                    <p
                      className="text-primary leading-[1.66]"
                      dangerouslySetInnerHTML={markdownify(feature_3.text)}
                    />
                  </div>
                  <Image
                    width={204}
                    height={45}
                    src={feature_3.image}
                    className="mx-auto mt-[5px]"
                    alt="image"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* <Signup isOpen={isOpen3} close={closeDialog3} open={closeDialog2} /> */}
      <Signin
        isOpen={isOpen2}
        close={closeDialog2}
        open={closeDialog3}
        forgot={() => {}}
      />
      <VideoModal link={video} isOpen={isOpen} close={closeDialog} />
    </>
  );
};

export default CRMHero;
