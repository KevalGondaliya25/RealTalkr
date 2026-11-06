"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";
import { delayTime2 } from "@/lib/helper/delayTime";

// shadcn components
import { Button } from "@/components/ui/button";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import IntegrationCard1 from "./card/integration-card1";

type Integrations = {
  data: {
    key: string[];
    title: string;
    sub_title: string;
    short_description: string;
    image: string;
  };
  slug: string;
  content: string;
};

type Props = {
  integration: {
    data: {
      title: string;
      details: string;
      title2: string;
      details2: string;
      lists: {
        name: string;
        key: string;
      }[];
      shape1_img: string;
      shape2_img: string;
    };
    content: string;
  };
  integrations: Integrations[];
  detailsPage?: boolean;
  btnText?: string;
};

const MainIntegration = ({
  integration,
  integrations,
  detailsPage = false,
  btnText,
}: Props) => {
  const { title, details, title2, details2, lists, shape1_img, shape2_img } =
    integration.data;

  const [active, setActive] = useState<string>("all");
  const [storeData, setStoreData] = useState<Array<Integrations>>(integrations);
  const [showData, setShowData] = useState<Array<Integrations>>(storeData);

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (storeData && storeData.length) {
      if (active === "all") {
        setShowData(storeData);
      } else {
        let filteredData = storeData.filter((el) =>
          el.data.key.includes(active)
        );
        setShowData(filteredData);
      }
    }
  }, [active, storeData]);

  return (
    <section
      className={cn(
        "sec_space_bottom1",
        detailsPage
          ? "pt-[44px] md:pt-[74px] xl:pt-[104px] 2xl:pt-[174px]"
          : "pt-0 md:pt-[25px] xl:pt-[58px] 2xl:pt-[128px]"
      )}
    >
      <div className="container" ref={containerRef}>
        <div className="relative">
          {shape1_img && (
            <div className="absolute end-[calc(100%+113px)] top-[90%] w-max hidden xl:block">
              <Image
                width={54}
                height={65}
                src={shape1_img}
                className="rtl_y"
                data-speed="0.8"
                alt="shape image"
              />
            </div>
          )}
          {shape2_img && (
            <div className="absolute top-[170px] start-full w-max hidden xl:block">
              <Image
                width={96}
                height={96}
                src={shape2_img}
                className="rtl_y"
                data-speed="0.8"
                alt="shape image"
              />
            </div>
          )}
          <TitleSection2
            title={detailsPage ? title2 : title}
            details={detailsPage ? details2 : details}
            html
            titleClassName="max-w-[800px]"
          />

          <div className="mt-[43px]">
            {lists && lists.length && (
              <div className="flex justify-center flex-wrap gap-[7px] has_fade_anim">
                {lists.map((list, i) => (
                  <Button
                    variant={active === list.key ? "primary" : "outline"}
                    size="sm"
                    key={`filter_btn-${i}`}
                    className="rounded-[6px] hover:bg-theme hover:text-btn-text-main"
                    onClick={() => setActive(list.key)}
                  >
                    {list.name}
                  </Button>
                ))}
              </div>
            )}
            {showData && showData.length && (
              <div className="grid gap-[30px] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pt-[50px] 2xl:mt-[70px]">
                {showData.slice(0, 6).map((item, i) => (
                  <div
                    key={item.slug}
                    className="has_fade_anim"
                    data-delay={delayTime2(i + 1)}
                  >
                    <IntegrationCard1 integration={item} btnText={btnText} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainIntegration;
