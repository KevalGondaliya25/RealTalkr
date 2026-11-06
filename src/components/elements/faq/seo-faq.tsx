"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";
import hasPinContent from "@/lib/animation/hasPinContent";

// shadcn components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  faq: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      items: {
        question: string;
        answer: string;
      }[];
    };
    content: string;
  };
};

const SEOFAQ = ({ faq }: Props) => {
  const { title, sub_title, details, items } = faq.data;

  const containerRef = useRef<HTMLDivElement>(null!);
  const pinElement = useRef<HTMLDivElement>(null!);
  const pinArea = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      hasPinContent(pinElement.current, pinArea.current, "top 100px", 1024);
    },
    { scope: containerRef }
  );

  return (
    <section className="bg-[#F7FAF9] sec_space">
      <div className="container" ref={containerRef}>
        <div
          className=" grid grid-cols-1 xl:grid-cols-[1fr_600px] 2xl:grid-cols-[1fr_740px] gap-5"
          ref={pinArea}
        >
          <div className="mt-[17px] max-w-[350px]" ref={pinElement}>
            <TitleSection2
              title={title}
              sub_title={sub_title}
              details={details}
              className="text-start"
              subTitleClassName="bg-white"
            />
          </div>

          <div>
            {items && items.length && (
              <Accordion
                type="single"
                collapsible
                className="w-full has_fade_anim"
                defaultValue="item-2"
              >
                {items.map((item, i) => (
                  <AccordionItem
                    key={`accordion_item-${i}`}
                    value={`item-${i + 1}`}
                    className="border-b-0 mb-[7px] rounded-theme overflow-hidden"
                  >
                    <AccordionTrigger className="bg-white text-xl leading-tight text-primary shadow-none text-start font-semibold pt-[21px] lg:pt-[25px] pb-[15px] lg:pb-5 px-[25px] md:px-[30px] hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="bg-white text-lg leading-[1.44] text-secondary pt-0 pb-[23px] lg:pb-6 px-[25px] md:px-[30px]">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOFAQ;
