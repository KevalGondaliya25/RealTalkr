"use client";

import { useRef } from "react";

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

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  faq: {
    data: {
      title: string;
      details: string;
      items: {
        question: string;
        answer: string;
      }[];
    };
    content: string;
  };
};

const MainFAQ = ({ faq }: Props) => {
  const { title, details, items } = faq.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[5px] md:pt-[35px] xl:pt-[65px] 2xl:pt-[135px] sec_space_bottom1">
      <div className="container" ref={containerRef}>
        <div className="max-w-[1070px] mx-auto">
          <div>
            <TitleSection2
              title={title}
              details={details}
              heading
              titleClassName="max-w-full"
            />
          </div>
          <div className="mt-[33px] md:mt-[43px] 2xl:mt-[63px]">
            {items && items.length && (
              <Accordion
                type="single"
                collapsible
                className="w-full has_fade_anim"
                data-delay="0.45"
                defaultValue="item-2"
              >
                {items.map((item, i) => (
                  <AccordionItem
                    key={`accordion_item-${i}`}
                    value={`item-${i + 1}`}
                    className="border-b-0 mb-[7px] rounded-theme overflow-hidden"
                  >
                    <AccordionTrigger className="bg-[#F7FAF9] text-xl leading-tight text-primary shadow-none text-start font-semibold pt-[21px] lg:pt-[25px] pb-[15px] lg:pb-5 px-[25px] md:px-[30px] hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#F7FAF9] text-lg leading-[1.44] text-secondary pt-0 pb-[23px] lg:pb-6 px-[25px] md:px-[30px]">
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

export default MainFAQ;
