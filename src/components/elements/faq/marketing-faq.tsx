"use client";

import Image from "next/image";
import { useRef } from "react";
import parse from "html-react-parser";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// shadcn components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  faq: {
    data: {
      title: string;
      subHeading: string;
      image1: string;
      image2: string;
      items: {
        question: string;
        answer: string;
      }[];
    };
  };
};

const MarketingFAQ = ({ faq }: Props) => {
  const { title, subHeading, image1, image2, items } = faq.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space1">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[auto_660px] gap-[30px] md:gap-[50px] 2xl:gap-[195px]">
          <div>
            <div className="mb-[25px] md:mb-[51px]">
              <h2 className="sec_title2 has_fade_anim">{title}</h2>
            </div>
            <p
              className={
                "mt-[23px] lg:mt-[33px] max-w-[550px] mx-auto has_fade_anim"
              }
            >
              {subHeading}
            </p>
            <div>
              <Accordion
                type="single"
                collapsible
                className="w-full mt-[43px] border-t border-border has_fade_anim"
                defaultValue="item-2"
              >
                {items.map((item, i) => {
                  return (
                    <AccordionItem
                      key={`accordion_item-${i}`}
                      value={`item-${i + 1}`}
                      className="border-b border-border overflow-hidden"
                    >
                      <AccordionTrigger className="shadow-none text-lg font-medium leading-[1.44] text-charcoal pt-[16px] pb-[14px] font-primary hover:no-underline [&>span]:hidden">
                        {i + 1}. {parse(item.question)}
                      </AccordionTrigger>
                      <AccordionContent className="text-lg leading-[1.44] text-charcoal pt-1 pb-[23px] lg:pb-7">
                        {parse(item.answer)}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
          <div className="relative pt-0 md:pt-[50px] max-w-[660px]">
            {image1 && (
              <div>
                <Image
                  width={660}
                  height={485}
                  src={image1}
                  className="rounded-theme border border-[#EBEDEF]"
                  alt="faq-thumb"
                />
              </div>
            )}
            {image2 && (
              <div className="hidden md:block max-w-[150px] lg:max-w-[200px] xl:max-w-full absolute top-0 end-[55px] drop-shadow-[0_30px_50px_rgba(38,59,90,0.1)]">
                <Image
                  width={250}
                  height={333}
                  src={image2}
                  className="rounded-theme"
                  data-speed="0.8"
                  alt="faq-thumb"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingFAQ;
