"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  faq: {
    data: {
      title: string;
      image: string;
      items: {
        question: string;
        answer: string;
      }[];
      action_btn: ActionBtnType;
    };
  };
};

const ChatbotFAQ = ({ faq }: Props) => {
  const { title, image, items, action_btn } = faq.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef}>
      <div className="grid gap-[20px] grid-cols-1 lg:grid-cols-[1fr_395px] xl:grid-cols-[1fr_495px] 2xl:grid-cols-[1fr_695px]">
        <div className="bg-sec_bg-2 rounded-theme pt-[48px] md:pt-[68px] xl:pt-[88px] 2xl:pt-[118px] px-[20px] xl:px-[70px] 2xl:px-[130px] sec_space_bottom2">
          <Title1 text={title} className="max-w-[510px] has_fade_anim" />
          <div className="mt-[35px] 2xl:mt-[55px] has_fade_anim">
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
                    <AccordionTrigger className="bg-white text-xl leading-tight text-primary shadow-none text-start font-normal pt-[21px] lg:pt-[25px] pb-[15px] lg:pb-5 px-[25px] md:px-[30px] hover:no-underline">
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
        <div className="relative rounded-theme rounded-tr-[30px] overflow-hidden">
          {action_btn && action_btn.enable && (
            <div className="absolute end-0 top-0">
              <Image
                width={33}
                height={30}
                className="absolute top-0 end-[calc(100%+9px)] rtl_y"
                src="/assets/imgs/shape/shape-s-18.png"
                alt="shape image"
              />
              <Image
                width={30}
                height={19}
                className="absolute top-[calc(100%+9px)] -end-[1px] rtl_y"
                src="/assets/imgs/shape/shape-s-19.png"
                alt="shape image"
              />
              <Link
                href={action_btn.link}
                className={cn(
                  buttonVariants({ variant: "primary3" }),
                  "outline-[20px] outline outline-white"
                )}
              >
                <span
                  className="btn-span uppercase"
                  data-text={action_btn.label}
                >
                  {action_btn.label}
                </span>
              </Link>
            </div>
          )}
          {image && (
            <Image
              width={695}
              height={923}
              src={image}
              className="object-cover	h-full w-full"
              alt="gallery image"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatbotFAQ;
