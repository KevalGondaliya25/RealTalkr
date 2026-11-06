"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// components
import TitleSection1 from "../shared/title-section/title-section1";
import TitleSection2 from "../shared/title-section/title-section2";

type Props = {
  team: {
    data: {
      title: string;
      details: string;
      items: {
        name: string;
        designation: string;
        image: string;
      }[];
    };
    content: string;
  };
  sliceItem?: number;
  className?: string;
};

const AllTeam = ({ team, sliceItem, className }: Props) => {
  const { title, details, items } = team.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className={cn("sec_space_bottom", className)}>
      <div className="container" ref={containerRef}>
        {sliceItem ? (
          <div className="mb-[63px]">
            <TitleSection2 title={title} details={details} />
          </div>
        ) : (
          <TitleSection1 title={title} details={details} />
        )}
        {items && items.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[17px] gap-y-[57px]">
            {(!!sliceItem ? items.slice(0, sliceItem) : items).map(
              (item, i) => (
                <div key={`team_item-${i}`} className="has_fade_anim">
                  <div
                    className={cn(
                      (i + 1) % 2 === 0 ? "rounded-[120px]" : "rounded-[170px]",
                      "overflow-hidden"
                    )}
                  >
                    <Image
                      width={310}
                      height={392}
                      style={{ width: "100%", height: "auto" }}
                      src={item.image}
                      alt="team image"
                    />
                  </div>
                  <div className="mt-[30px] text-center">
                    <h3 className="text-[24px] leading-[1.25] font-bold font-colasta">
                      {item.name}
                    </h3>
                    <p className="text-[18px] mt-[7px] leading-none">
                      {item.designation}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllTeam;
