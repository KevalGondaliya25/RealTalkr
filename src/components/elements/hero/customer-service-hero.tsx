"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import Title1 from "@/components/shared/title/title1";
import Newsletter4 from "../newsletter/newsletter4";

type Props = {
  hero: {
    data: {
      title: string;
      details: string;
      features: string[];
      image1: string;
      image2: string;
      image3: string;
      image4: string;
      shape1_img: string;
      shape2_img: string;
      shape3_img: string;
      shape4_img: string;
      shape5_img: string;
    };
  };
};

const CustomerServiceHero = ({ hero }: Props) => {
  const {
    title,
    details,
    features,
    image1,
    image2,
    image3,
    image4,
    shape1_img,
    shape2_img,
    shape3_img,
    shape4_img,
    shape5_img,
  } = hero.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[110px] md:pt-[185px] xl:pt-[215px] pb-[65px] md:pb-[95px] xl:pb-[125px] bg-sec_bg-3">
      <div className="container" ref={containerRef}>
        <div className="flex justify-between items-center gap-x-[60px] gap-y-[30px] flex-col lg:flex-row">
          <div className="flex-[auto] lg:flex-[0_1_575px]">
            <Title1
              text={title}
              heading1
              className="text-[40px] md:text-[50px] xl:text-[60px] 2xl:text-[90px] !leading-none md:!leading-[0.88] has_fade_anim"
            />

            <p className="mt-[34px] has_fade_anim" data-delay="0.30">
              {details}
            </p>
            <div className="mt-[33px] has_fade_anim" data-delay="0.45">
              <Newsletter4 />
            </div>
            <div className="mt-[44px] has_fade_anim" data-delay="0.60">
              {features && features.length && (
                <ul>
                  {features.map((item, i) => (
                    <li
                      key={`features_item-${i}`}
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
              )}
            </div>
          </div>
          <div className="flex-[0_1_auto] lg:flex-[0_1_650px] relative w-full z-[1] aspect-[100/110]">
            <div className="absolute top-[5%] start-[31px] w-[46%]">
              {image1 && (
                <Image
                  width={300}
                  height={350}
                  src={image1}
                  className="rtl_y"
                  alt="gallery image"
                />
              )}
            </div>
            <div className="absolute bottom-[13%] end-0 w-[46%]">
              {image2 && (
                <Image
                  width={300}
                  height={380}
                  src={image2}
                  className="rtl_y"
                  alt="gallery image"
                />
              )}
            </div>
            <div className="absolute top-[14%] end-[16%] w-[44%]">
              {image3 && (
                <Image
                  width={288}
                  height={115}
                  src={image3}
                  className="rtl_y"
                  alt="gallery image"
                  data-speed="0.85"
                />
              )}
            </div>
            <div className="absolute bottom-[4%] start-[12%] w-[46%]">
              {image4 && (
                <Image
                  width={300}
                  height={333}
                  src={image4}
                  className="rtl_y"
                  alt="gallery image"
                  data-speed="1.15"
                />
              )}
            </div>
            <div className="absolute top-0 end-[1%] w-[5%]">
              {shape1_img && (
                <Image
                  width={35}
                  height={37}
                  src={shape1_img}
                  className="rtl_y"
                  alt="shape image"
                />
              )}
            </div>
            <div className="absolute top-[10%] start-0 w-[77%] -z-[1]">
              {shape2_img && (
                <Image
                  width={508}
                  height={523}
                  src={shape2_img}
                  className="rtl_y"
                  alt="shape image"
                />
              )}
            </div>
            <div className="absolute top-[17%] end-[8%] w-[3%]">
              {shape3_img && (
                <Image
                  width={22}
                  height={21}
                  src={shape3_img}
                  className="rtl_y"
                  alt="shape image"
                />
              )}
            </div>
            <div className="absolute start-[5%] bottom-0 w-[7%]">
              {shape4_img && (
                <Image
                  width={48}
                  height={51}
                  src={shape4_img}
                  className="rtl_y"
                  alt="shape image"
                />
              )}
            </div>
            <div className="absolute -end-[9%] bottom-[8%] w-[12%]">
              {shape5_img && (
                <Image
                  width={80}
                  height={79}
                  src={shape5_img}
                  className="rtl_y"
                  alt="shape image"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerServiceHero;
