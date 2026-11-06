"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";

type Props = {
  feature: {
    data: {
      title: string;
      details: string;
      shape1_img: string;
      shape2_img: string;
      shape3_img: string;
      tab_lists: {
        name: string;
        image: string;
        key: string;
      }[];
      tab_content: {
        title: string;
        content: string;
        image: string;
        key: string;
      }[];
    };
  };
};

const CustomerServiceFeature = ({ feature }: Props) => {
  const {
    title,
    details,
    shape1_img,
    shape2_img,
    shape3_img,
    tab_lists,
    tab_content,
  } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[43px] md:pt-[73px] xl:pt-[103px] 2xl:pt-[173px]">
      <div className="container" ref={containerRef} dir="ltr">
        <div className="relative">
          <div className="hidden lg:block absolute top-[8px] end-[calc(100%-8px)] w-[132px]">
            {shape1_img && (
              <Image
                width={132}
                height={132}
                src={shape1_img}
                data-speed="0.8"
                alt="shape image"
              />
            )}
          </div>
          <div className="hidden lg:block absolute top-[87px] end-[calc(100%+31px)] w-[72px]">
            {shape2_img && (
              <Image
                width={72}
                height={90}
                src={shape2_img}
                data-speed="0.8"
                alt="shape image"
              />
            )}
          </div>
          <div className="hidden lg:block absolute -bottom-[50px] xl:-bottom-[90px] lg:start-[calc(100%-50px)] xl:start-[calc(100%-140px)] lg:w-[100px] xl:w-[200px] 2xl:w-[300px]">
            {shape3_img && (
              <Image
                width={300}
                height={300}
                src={shape3_img}
                alt="shape image"
              />
            )}
          </div>
          <TitleSection2
            title={title}
            details={details}
            titleClassName="max-w-[700px]"
          />

          {tab_lists &&
            tab_lists.length &&
            tab_content &&
            tab_content.length && (
              <Tabs
                defaultValue={tab_lists[0].key}
                className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px] bg-sec_bg-3 px-2 rounded-theme"
              >
                <TabsList className="h-full flex w-full overflow-x-auto justify-between border-b border-[#E9EFEC] gap-x-[45px] gap-y-[10px] p-[30px]">
                  {tab_lists.map((tab, i) => (
                    <TabsTrigger
                      key={`tab_list-${i}`}
                      value={tab.key}
                      className="data-[state=active]:shadow-none data-[state=active]:bg-white cursor-pointer"
                      asChild
                    >
                      <div className="flex items-center min-w-[300px] gap-[20px] !p-[10px] lg:!p-[20px] !rounded-theme !whitespace-normal">
                        <div className="w-[50px] lg:w-[70px] min-w-[50px] lg:min-w-[70px] h-[50px] lg:h-[70px] rounded-full flex justify-center items-center">
                          <Image
                            width={70}
                            height={70}
                            src={tab.image}
                            alt="icon image"
                          />
                        </div>
                        <p className="text-[20px] 2xl:text-[24px] leading-[1.12] text-primary has_fade_anim">
                          {tab.name}
                        </p>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                {tab_content.map((tab, i) => (
                  <TabsContent key={`tab_content-${i}`} value={tab.key}>
                    <div className="flex justify-between items-center flex-col lg:flex-row gap-[50px] p-[30px] xl:p-[40px] 2xl:p-[60px] 2xl:pe-[80px]">
                      <div>
                        <Image
                          width={580}
                          height={480}
                          src={tab.image}
                          className="h-full"
                          alt="gallery image"
                        />
                      </div>
                      <div className="max-w-[430px]">
                        <h2 className="text-[30px] xl:text-[40px] leading-tight has_fade_anim">
                          {tab.title}
                        </h2>
                        <p className="mt-[20px] has_fade_anim">{tab.content}</p>
                        <div className="mt-[32px] has_fade_anim">
                          <Link
                            href="#"
                            className={cn(
                              buttonVariants({ variant: "link", size: "auto" })
                            )}
                          >
                            <span
                              className="btn-span text-[16px]"
                              data-text="Learn more"
                            >
                              Learn more
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
        </div>
      </div>
    </section>
  );
};

export default CustomerServiceFeature;
