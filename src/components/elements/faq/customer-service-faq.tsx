"use client";

import { useRef } from "react";
import Image from "next/image";

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
import Title1 from "@/components/shared/title/title1";

type Props = {
  faq: {
    data: {
      title: string;
      details: string;
      image: string;
      items: {
        question: string;
        answer: string;
      }[];
    };
  };
};

const CustomerServiceFAQ = ({ faq }: Props) => {
  const { title, details, image, items } = faq.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[43px] md:pt-[73px] xl:pt-[103px] 2xl:pt-[173px]">
      <div className="container" ref={containerRef}>
        <div className="flex justify-between gap-x-[80px] gap-y-[40px] flex-col lg:flex-row items-center lg:items-start">
          <div className="max-w-[420px]">
            <Title1 text={title} className="has_fade_anim" />
            <p className="mt-[28px] has_fade_anim">{details}</p>
            <Accordion
              type="single"
              collapsible
              className="w-full mt-[43px] border-t border-border has_fade_anim"
              defaultValue="item-2"
            >
              {items.map((item, i) => (
                <AccordionItem
                  key={`accordion_item-${i}`}
                  value={`item-${i + 1}`}
                  className="border-b border-border overflow-hidden"
                >
                  <AccordionTrigger className="bg-white shadow-none text-lg font-medium leading-[1.44] text-primary pt-[16px] pb-[14px] font-primary hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="bg-white text-lg leading-[1.44] text-secondary pt-1 pb-[23px] lg:pb-7">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="max-w-[587px]">
            {image && (
              <Image width={587} height={550} src={image} alt="gallery image" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerServiceFAQ;
