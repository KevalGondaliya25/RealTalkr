"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
      image: string;
      image2: string;
      items: {
        name: string;
        details: string;
        icon: string;
      }[];
    };
  };
};

const StartupFeature = ({ feature }: Props) => {
  const { title, details, image, image2, items } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_bottom4">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-y-[60px] justify-between">
          <div className="col-span-1 lg:col-span-6 order-2 lg:order-1">
            <div className="relative max-w-[250px] md:max-w-[70%] lg:max-w-[350px] xl:max-w-[520px] mb-[20px] md:mb-0">
              {image && (
                <Image width={520} height={560} src={image} alt="img" />
              )}
              {image2 && (
                <Image
                  width={235}
                  height={260}
                  src={image2}
                  className="absolute -end-[50px] md:-end-[115px] bottom-[38px] md:bottom-[90px] max-w-[150px] md:max-w-full drop-shadow-[0_0_100px_#EBEDEF]"
                  alt="image"
                  data-speed="0.85"
                />
              )}
            </div>
          </div>
          <div className="col-span-1 lg:col-span-5 ms-0 lg:ms-[30px] order-1 lg:order-2">
            <TitleSection2
              title={title}
              details={details}
              className="text-start"
              titleClassName="mx-0"
              detailsClassName="mx-0"
            />
            {items && items.length && (
              <div className="flex flex-col gap-[20px] md:gap-[38px] mt-[20px] md:mt-[34px] has_fade_anim">
                {items.map((item, i) => (
                  <div
                    key={`feature_item-${i}`}
                    className="grid grid-cols-[65px_auto] gap-[25px]"
                  >
                    {item.icon && (
                      <Image
                        width={65}
                        height={65}
                        src={item.icon}
                        alt="icon"
                      />
                    )}
                    <div>
                      <h3 className="text-[18px] md:text-[20px] mb-[6px]">
                        {item.name}
                      </h3>
                      <p>{item.details}</p>
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

export default StartupFeature;
