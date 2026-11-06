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
      items: {
        question: string;
        answer: string;
      }[];
      shape_img: string;
    };
    content: string;
  };
};

const FAQ1 = ({ faq }: Props) => {
  const { title, details, items, shape_img } = faq.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="bg-[#F7FAF9] sec_space">
      <div className="container" ref={containerRef}>
        <div className="relative grid grid-cols-1 xl:grid-cols-[1fr_600px] 2xl:grid-cols-[1fr_740px] gap-5">
          {shape_img && (
            <div className="absolute top-[414px] start-[170px] xl:start-[270px] hidden lg:block rtl_y">
              <Image width={60} height={60} src={shape_img} alt="shape image" />
            </div>
          )}
          <div className="max-w-[350px]">
            <Title1 text={title} className="mt-[17px] has_fade_anim" />
            <p className="mt-[29px] has_fade_anim">{details}</p>
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

export default FAQ1;
