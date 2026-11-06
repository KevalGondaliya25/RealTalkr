"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  about: {
    data: {
      title: string;
      details: string;
      image1: string;
      image2: string;
    };
  };
};

const MarketingAbout = ({ about }: Props) => {
  const { title, details, image1, image2 } = about.data;
  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="py-10 bg-white ">
      <div
        className="container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[520px_630px] justify-between gap-[30px]"
        ref={containerRef}
      >
        <div>
          <TitleSection2
            title={title}
            details={details}
            html
            vapiButtonShow
            className="text-start"
            titleClassName="sec_title2"
          />
        </div>
        <div className="grid grid-cols-1 gap-[30px]">
          <div
            className="brand-logo has_fade_anim rounded-3xl overflow-hidden"
            data-delay="0.35"
          >
            {image2 && (
              <Image
                className="object-fill h-full w-full"
                width={300}
                height={420}
                src={image2}
                alt="logo"
                unoptimized
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingAbout;
