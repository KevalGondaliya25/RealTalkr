"use client";

import { useRef } from "react";
import Image from "next/image";
import siteConfig from "@/config/siteConfig.json";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import Title1 from "@/components/shared/title/title1";
import ResetForm from "./reset-form";

type Props = {};

const MainContact = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const { footer_info } = siteConfig;
  const { address, email } = footer_info;

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="bg-btn-bg-hover">
      <div className="" ref={containerRef}>
        <div className="flex justify-center bg-white">
          <div className="flex flex-col md:flex-row justify-between relative gap-[40px] md:gap-[80px] pt-[60px] md:pt-[90px] xl:pt-[120px] 2xl:pt-[180px] px-3 pb-28 w-full max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1320px]">
            <div className="w-max absolute bottom-6 end-[calc(100%+100px)]">
              <Image
                width={153}
                height={153}
                className="rtl_y"
                src="/assets/imgs/shape/shape-s-57.png"
                data-speed="0.8"
                alt="shape image"
              />
            </div>
            <div className="sm:w-max absolute top-[213px] start-[calc(100%+124px)]">
              <Image
                width={60}
                height={60}
                src="/assets/imgs/shape/shape-s-58.png"
                className="rtl_y"
                data-speed="0.8"
                alt="shape image"
              />
            </div>
            <div className="max-w-full md:max-w-[240px] has_fade_anim">
              <Title1
                text="Let’s <span>connect</span> for better results"
                html
                className="mb-[38px] text-center"
              />
              <div className="hidden md:block w-[1px] h-[120px] bg-primary mx-auto"></div>
              <div className="mt-[41px]">
                <ul>
                  <li className="text-[16px] leading-[1.62] text-center mb-[15px]">
                    <a
                      className="text-[18px] font-semibold underline text-primary"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  </li>
                  {/* <li className="text-[16px] leading-[1.62] text-center">
                  <a
                    className="text-[18px] font-semibold underline text-primary"
                    href={address.link || "#"}
                  >
                    {address.name}
                  </a>
                </li> */}
                </ul>
              </div>
            </div>
            <div
              className="max-w-[530px] xl:max-w-[740px] w-full has_fade_anim"
              data-delay="0.30"
            >
              <h3 className="text-[24px]">Reset the password:</h3>
              <div className="mt-[26px] xl:mt-[56px]">
                <ResetForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainContact;
