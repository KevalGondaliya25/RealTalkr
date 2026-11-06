"use client";

import { useRef, useState } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import hasPinContent from "@/lib/animation/hasPinContent";

// shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// components
import TitleSection1 from "@/components/shared/title-section/title-section1";

type Props = {
  privacy: {
    data: {
      title: string;
      details: string;
      lists: {
        name: string;
        key: string;
      }[];
      items: {
        key: string;
        content: {
          title: string;
          text: string[];
        }[];
      }[];
    };
    content: string;
  };
};

const PrivacyPolicy1 = ({ privacy }: Props) => {
  const { title, details, lists, items } = privacy.data;
  const [tabValue, setTabValue] = useState("");

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
      hasPinContent(pinElement.current, pinArea.current, "top 100px");
    },
    { dependencies: [tabValue], scope: containerRef, revertOnUpdate: true }
  );

  return (
    <section className="pt-[5px] xl:pt-[75px] 2xl:pt-[135px] sec_space_bottom1">
      <div className="container" ref={containerRef}>
        <TitleSection1 title={title} details={details} />
        <div ref={pinArea}>
          <Tabs
            defaultValue={lists && lists.length ? lists[0].key : ""}
            className="w-full grid grid-cols-1 lg:grid-cols-[300px_auto] gap-x-[80px] 2xl:gap-x-[140px] gap-y-[20px]"
          >
            {lists && lists.length && (
              <TabsList
                className="flex flex-row lg:flex-col justify-start gap-[10px] flex-nowrap overflow-x-scroll lg:overflow-x-hidden pb-[10px] lg:pb-0 h-full"
                ref={pinElement}
              >
                {lists.map((list) => (
                  <TabsTrigger
                    key={list.key}
                    value={list.key}
                    onClick={() => setTabValue(list.key)}
                    className="w-full border border-border px-[24px] py-[16px] lg:px-[30px] lg:py-[22px] rounded-[15px] font-bold text-[16px] data-[state=active]:bg-theme data-[state=active]:text-white"
                  >
                    {list.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
            {items &&
              items.length &&
              items.map((item, i) => (
                <TabsContent key={item.key} value={item.key}>
                  {item.content &&
                    item.content.length &&
                    item.content.map((content, j) => (
                      <div key={`content_text-${i}${j}`}>
                        <h2
                          className={cn(
                            "leading-[1.25] mb-[21px]",
                            j === 0 ? "text-[24px]" : "text-[18px] pt-[28px]"
                          )}
                        >
                          {content.title}
                        </h2>
                        {content.text &&
                          content.text.length &&
                          content.text.map((el, k) => (
                            <p
                              key={`text_content-${i}${j}${k}`}
                              className="mb-[23px]"
                            >
                              {el}
                            </p>
                          ))}
                      </div>
                    ))}
                </TabsContent>
              ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy1;
