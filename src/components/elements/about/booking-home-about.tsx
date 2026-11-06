"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import { markdownify } from "@/lib/helper/convert";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

// Components
import Title1 from "@/components/shared/title/title1";

type Props = {
  about: {
    data: {
      title: string;
      details: string;
      image: string;
      lists: string[];
      action_btn: ActionBtnType;
      shape1_img: string;
    };
    content: string;
  };
};

const BookingHomeAbout = ({ about }: Props) => {
  const { title, details, image, lists, action_btn, shape1_img } = about.data;

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
        <div className="relative flex flex-col lg:flex-row justify-between items-center gap-x-[80px] gap-y-[40px]">
          <div className="hidden xl:block absolute w-[14%] top-[60%] -start-[24%]">
            {shape1_img && (
              <Image
                width={181}
                height={121}
                src={shape1_img}
                data-speed="0.8"
                alt="shape image"
              />
            )}
          </div>
          <div className="max-w-[500px] xl:max-w-[550px]">
            <Title1 text={title} className="has_fade_anim" />
            <p className="mt-[33px] has_fade_anim">{details}</p>

            {lists && lists.length && (
              <div className="mt-[27px] flex flex-col gap-[15px] has_fade_anim">
                {lists.map((item, i) => (
                  <div
                    key={`list_item-${i}`}
                    className="flex items-start gap-[10px]"
                  >
                    <span className="min-w-3 mt-1">
                      <Image
                        width={12}
                        height={13}
                        src="/assets/imgs/icon/check.png"
                        alt="icon image"
                      />
                    </span>
                    <p
                      className="[&>span]:text-primary [&>span]:font-medium"
                      dangerouslySetInnerHTML={markdownify(item)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-[43px] has_fade_anim">
              {action_btn && action_btn.enable && (
                <Link
                  href={action_btn.link}
                  className={cn(buttonVariants({ variant: "primary" }))}
                >
                  <span className="btn-span" data-text={action_btn.label}>
                    {action_btn.label}
                  </span>
                </Link>
              )}
            </div>
          </div>
          <div className="relative inline-block p-0 z-[1]">
            <div>
              {image && (
                <Image
                  width={550}
                  height={530}
                  style={{ height: "auto" }}
                  src={image}
                  alt="about image"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingHomeAbout;
