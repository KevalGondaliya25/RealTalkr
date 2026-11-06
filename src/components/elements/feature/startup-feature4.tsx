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

const StartupFeature4 = ({ feature }: Props) => {
  const { title, details, tab_lists, tab_content } = feature.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_bottom4">
      <div className="container" ref={containerRef} dir="ltr">
        <TitleSection2
          title={title}
          details={details}
          titleClassName="max-w-[770px]"
          detailsClassName="max-w-[695px]"
        />

        {tab_lists && tab_lists.length && tab_content && tab_content.length && (
          <Tabs
            defaultValue={tab_lists[0].key}
            className="mt-[20px] md:mt-[40px] lg:mt-[60px] bg-sec_bg p-[15px] md:p-[30px] rounded-theme"
          >
            <TabsList className="h-full flex w-full overflow-x-auto justify-between gap-[10px] bg-white rounded-theme mb-[50px] p-[15px]">
              {tab_lists.map((tab, i) => (
                <TabsTrigger
                  key={`tab_list-${i}`}
                  value={tab.key}
                  className="data-[state=active]:shadow-none data-[state=active]:bg-[#F6F9F3] cursor-pointer"
                  asChild
                >
                  <div className="flex items-center !justify-start min-w-[200px] lg:min-w-[300px] gap-[20px] ps-4 py-2 pe-6 w-full !rounded-[15px] !whitespace-normal">
                    <div className="rounded-full flex justify-center items-center">
                      <Image
                        width={55}
                        height={55}
                        src={tab.image}
                        alt="icon image"
                      />
                    </div>
                    <p className="text-[14px] md:text-[20px] leading-[1.12] text-primary font-semibold has_fade_anim">
                      {tab.name}
                    </p>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            {tab_content.map((tab, i) => (
              <TabsContent key={`tab_content-${i}`} value={tab.key}>
                <div className="grid grid-cols-1 lg:grid-cols-[auto_450px] 2xl:grid-cols-[auto_550px] gap-[20px] md:gap-[30px] lg:gap-[80px] p-0 2xl:px-[60px]">
                  <div>
                    <h2 className="text-[22px] xl:text-[40px] leading-tight has_fade_anim">
                      {tab.title}
                    </h2>
                    <p className="mt-[20px] has_fade_anim">{tab.content}</p>
                    <div className="mt-[32px] has_fade_anim">
                      <Link
                        href="#"
                        className={cn(
                          buttonVariants({ variant: "primary2" }),
                          "text-[16px]"
                        )}
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                  <div>
                    <Image
                      width={580}
                      height={480}
                      src={tab.image}
                      className="h-full"
                      alt="gallery image"
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default StartupFeature4;
