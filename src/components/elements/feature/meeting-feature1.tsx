"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { markdownify } from "@/lib/helper/convert";

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
  feature: {
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

const MeetingFeature1 = ({ feature }: Props) => {
  const { title, details, image, items } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[42px] md:pt-[62px] xl:pt-[82px] 2xl:pt-[112px] bg-primary sec_space_bottom2">
      <div className="container" ref={containerRef}>
        <TitleSection2
          title={title}
          details={details}
          titleClassName="!text-white max-w-[829px]"
          detailsClassName="!text-white-2 max-w-[750px] !mt-[27px]"
        />
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1fr] xl:grid-cols-[0.5fr_1fr] mt-[33px] xl:mt-[43px] 2xl:mt-[63px] gap-x-[70px] gap-y-[40px]">
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
                  <AccordionTrigger className="bg-primary-100 xl:text-xl 2xl:text-2xl leading-tight text-white shadow-none text-start font-medium pt-[21px] lg:pt-[31px] pb-[15px] lg:pb-[25px] px-[25px] md:px-[40px] hover:no-underline">
                    <span
                      className="[&>br]:hidden xl:[&>br]:inline"
                      dangerouslySetInnerHTML={markdownify(item.question)}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="bg-primary-100 text-lg leading-[1.44] text-white-2 pt-0 pb-[23px] lg:pb-6 px-[25px] md:px-[30px]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <div className="has_fade_anim">
            {image && (
              <Image
                width={810}
                height={516}
                src={image}
                className="rounded-theme"
                alt="feature image"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingFeature1;
