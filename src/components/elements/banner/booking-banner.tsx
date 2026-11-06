"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  banner: {
    data: {
      title: string;
      details: string;
      image_lg: string;
      image_sm: string;
      shape1_img: string;
      shape2_img: string;
      shape3_img: string;
      shape4_img: string;
    };
    content: string;
  };
};

const BookingBanner = ({ banner }: Props) => {
  const {
    title,
    details,
    image_lg,
    image_sm,
    shape1_img,
    shape2_img,
    shape3_img,
    shape4_img,
  } = banner.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );
  return (
    <section>
      <div className="container" ref={containerRef}>
        <div className="bg-[#EDF4F3] rounded-[15px] 2xl:rounded-[30px] pt-[51px] md:pt-[81px] xl:pt-[111px] 2xl:pt-[181px]">
          <div className="text-center relative px-5">
            <div className="hidden md:block absolute -start-[70px] 2xl:-start-[100px] top-[38%] w-[140px] 2xl:w-[200px]">
              <Image
                width={200}
                height={100}
                style={{ height: "auto" }}
                src={shape1_img}
                data-speed="1.2"
                alt="shape image"
              />
            </div>
            <div className="hidden md:block absolute start-[82%] -top-[26%] w-[39px] rtl_y">
              <Image
                width={39}
                height={39}
                src={shape2_img}
                data-speed="0.8"
                alt="shape image"
              />
            </div>
            <div className="hidden md:block absolute -end-[13px] xl:-end-[27px] top-[63%] w-[31px] xl:w-[61px] rtl_y">
              <Image
                width={61}
                height={96}
                style={{ height: "auto" }}
                src={shape3_img}
                data-speed="0.8"
                alt="shape image"
              />
            </div>

            <TitleSection2
              title={title}
              details={details}
              titleClassName="max-w-[595px]"
            />
          </div>
          <div className="relative mt-[33px] xl:mt-[53px] 2xl:mt-[63px] has_fade_anim">
            <div className="hidden 2xl:block absolute start-[113%] top-[79%] w-[153px] rtl_y">
              <Image
                width={153}
                height={153}
                src={shape4_img}
                data-speed="0.8"
                alt="shape image"
              />
            </div>
            <div className="flex items-center md:items-end justify-between gap-[30px] flex-col-reverse md:flex-row px-4 lg:px-[40px] xl:px-[80px]">
              <div>
                <Image
                  width={275}
                  height={575}
                  style={{ height: "auto" }}
                  src={image_sm}
                  alt="card image"
                />
              </div>
              <div>
                <Image
                  width={825}
                  height={575}
                  style={{ height: "auto" }}
                  src={image_lg}
                  alt="dashboard image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingBanner;
