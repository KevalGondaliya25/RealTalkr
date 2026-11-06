"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import VapiButton from "@/components/component/Button/vapiButton";

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
      image1: string;
      image2: string;
      image3: string;
      image4: string;
      shape: string;
      items: {
        name: string;
        details: string;
        icon: string;
      }[];
    };
  };
};

const MarketingFeature2 = ({ feature }: Props) => {
  const { title, details, image1, image2, image3, image4, shape, items } =
    feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="bg-white sec_space1">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-[635px_1fr] gap-[30px] md:gap-[50px] 2xl:gap-[134px]">
          <div className="relative mt-0 lg:mt-[90px] max-w-[706px]">
            <div className="relative pt-0 lg:pt-[70px] z-[2] max-w-[300px] lg:max-w-full">
              {image1 && (
                <Image
                  width={1080}
                  height={1080}
                  src={image1}
                  className="rounded-theme border border-[#EBEDEF] object-cover w-[326px] h-[217px] sm:w-[500px] sm:h-[200px] lg:w-[600px] lg:h-[400px]"
                  data-speed="0.8"
                  alt="gallery-image"
                />
              )}
              {image2 && (
                <div className="absolute top-[40px] -start-[70px] -z-[2]">
                  <Image
                    width={191}
                    height={107}
                    src={image2}
                    alt="shape"
                    className="rtl_y"
                  />
                </div>
              )}
            </div>
            {/* {image3 && (
              <div className="hidden md:block absolute top-0 lg:top-[290px] xl:top-0 end-0">
                <Image
                  width={280}
                  height={190}
                  src={image3}
                  className="rounded-theme border border-[#EBEDEF] rtl_y"
                  alt="gallery-image"
                />
              </div>
            )}
            {image4 && (
              <div className="hidden xl:block absolute top-[300px] 2xl:top-[220px] end-[60px]">
                <Image
                  width={221}
                  height={100}
                  src={image4}
                  className="rounded-theme rtl_y"
                  alt="gallery-image"
                />
              </div>
            )} */}
            {shape && (
              <div className="hidden lg:block absolute bottom-[100px] end-[180px]">
                <Image
                  width={56}
                  height={67}
                  src={shape}
                  alt="gallery-image"
                  className="rtl_y"
                />
              </div>
            )}
            <div className="pt-5 mt-35 flex justify-center relative z-10">
              <VapiButton firstMsg="Start a Conversation Now" className="border-2 border-theme bg-theme text-white hover:text-theme hover:bg-theme-300"
                variant="primary1" />
            </div>
          </div>
          <div>
            <TitleSection2
              title={title}
              details={details}
              className="text-start"
              titleClassName="sec_title2 mx-0"
              detailsClassName="mx-0"
            />
            {items && items.length && (
              <div className="flex flex-col gap-[30px] mt-[35px]">
                {items.map((item, i) => (
                  <div
                    key={`feature_item-${i}`}
                    className="grid grid-cols-[70px_1fr] gap-[30px] has_fade_anim"
                  >
                    <div>
                      <Image
                        width={70}
                        height={70}
                        src={item.icon}
                        className="rounded-full"
                        alt="icon"
                      />
                    </div>
                    <div>
                      <h3 className="text-[21px] pb-[10px]">{item.name}</h3>
                      <p className="max-w-[290px]">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingFeature2;
