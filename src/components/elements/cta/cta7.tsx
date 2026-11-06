"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  cta: {
    data: {
      title: string;
      details: string;
      action_btn: {
        enable: boolean;
        link: string;
        image: string;
      };
      action_btn2: {
        enable: boolean;
        link: string;
        image: string;
      };
    };
  };
};

const CTA7 = ({ cta }: Props) => {
  const { title, details, action_btn, action_btn2 } = cta.data;

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
        <div className="px-[15px] py-[50px] md:p-[70px] lg:px-0 lg:pt-[80px] lg:pb-[100px] bg-theme flex justify-center items-center text-center rounded-theme relative overflow-hidden">
          <div className="max-w-[695px] mx-auto">
            <TitleSection2
              title={title}
              details={details}
              titleClassName="max-w-full"
              detailsClassName="max-w-full text-primary"
            />
            <div className="mt-[18px] md:mt-[28px] lg:mt-[43px] flex gap-[20px] justify-center has_fade_anim">
              {action_btn && action_btn.enable && (
                <Link href={action_btn.link}>
                  <Image
                    width={180}
                    height={60}
                    src={action_btn.image}
                    alt="gallery"
                  />
                </Link>
              )}
              {action_btn2 && action_btn2.enable && (
                <Link href={action_btn.link}>
                  <Image
                    width={180}
                    height={60}
                    src={action_btn2.image}
                    alt="gallery"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA7;
