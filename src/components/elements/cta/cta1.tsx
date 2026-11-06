"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  cta: {
    data: {
      title: string;
      details: string;
      image: string;
      items: {
        link: string;
        image: string;
      }[];
    };
    content: string;
  };
};

const CTA1 = ({ cta }: Props) => {
  const { title, details, image, items } = cta.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );
  return (
    <section className="sec_space">
      <div className="container" ref={containerRef}>
        <div className="bg-sec_bg rounded-theme flex flex-col md:flex-row justify-between items-center pt-[30px] lg:pt-[40px] 2xl:pt-[50px] px-[20px] lg:px-[50px] 2xl:px-[80px] gap-x-[80px] gap-y-[40px]">
          <div className="mb-0 2xl:mb-[56px] max-w-[320px] lg:max-w-[500px] 2xl:max-w-[550px]">
            <Title1 text={title} className="has_fade_anim" />
            <p className="mt-[33px] has_fade_anim">{details}</p>
            {items && items.length && (
              <div className="mt-[43px] grid grid-cols-2 lg:grid-cols-3 gap-5 has_fade_anim">
                {items.map((item, i) => (
                  <Link key={`cta_item-${i}`} href={item.link}>
                    <div>
                      <Image
                        width={180}
                        height={60}
                        style={{ height: "auto" }}
                        src={item.image}
                        alt="store icon image"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div>
            <Image
              width={384}
              height={430}
              style={{ height: "auto" }}
              src={image}
              alt="app image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA1;
