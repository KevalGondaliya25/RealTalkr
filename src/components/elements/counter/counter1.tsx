"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import gsap, { Power1 } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  counter: {
    data: {
      items: {
        number: number;
        unit: string;
        text: string;
      }[];
    };
    content: string;
  };
};

const Counter1 = ({ counter }: Props) => {
  const { items } = counter.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  useGSAP(() => {
    gsap.from(gsap.utils.toArray(`.count`), {
      textContent: 0,
      duration: 1.5,
      ease: Power1.easeIn,
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: ".counter__number",
      },
    });
  }, []);
  return (
    <section className="sec_space_bottom">
      <div className="container" ref={containerRef}>
        {items && items.length && (
          <div className="overflow-hidden counter__number has_fade_anim">
            <div className="flex justify-between flex-wrap mx-0 md:-mx-[10px]">
              {items.map((item, i) => (
                <div
                  key={`counter_item-${i}`}
                  className={cn(
                    "flex-1 text-center border-[0.5px] md:border-b-0 md:border-e-0 border-border border-t border-s p-[20px] md:px-[50px] lg:px-[70px] md:pt-[64px] md:pb-[39px]"
                  )}
                >
                  <h3 className="text-[40px] md:text-[50px] lg:text-[60px] leading-none font-bold font-colasta">
                    <span className="count">{item.number}</span>
                    {item.unit}
                  </h3>
                  <p className="mt-[10px] md:mt-[18px] max-w-[156px] mx-auto">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Counter1;
