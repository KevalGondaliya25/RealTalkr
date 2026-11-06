"use client";

// gsap
import { useGSAP } from "@gsap/react";
import gsap, { Power1 } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

// lib
import { cn } from "@/lib/utils";
import { markdownify } from "@/lib/helper/convert";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  counter: {
    number: number;
    unit: string;
    text: string;
  }[];
};

const Counter2 = ({ counter }: Props) => {
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
    <section>
      {counter && counter.length && (
        <div className="overflow-hidden counter__number">
          <div className="flex justify-between flex-wrap mx-0 md:-mx-[10px]">
            {counter.map((item, i) => (
              <div
                key={`counter_item-${i}`}
                className={cn(
                  "flex-1 text-center border-[0.5px] md:border-b-0 md:border-e-0 border-border border-t border-s p-[20px] md:px-[50px] lg:px-[70px] md:pt-[64px] md:pb-[39px]"
                )}
              >
                <h3 className="text-[60px] xl:text-[90px] leading-none">
                  <span className="count">{item.number}</span>
                  {item.unit}
                </h3>
                <p
                  className="mt-[18px]"
                  dangerouslySetInnerHTML={markdownify(item.text)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Counter2;
