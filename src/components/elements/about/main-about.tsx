"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

type Props = {
  about: {
    data: {
      title: string;
      details: string;
      people: string[];
      project: string[];
    };
    content: string;
  };
};

const MainAbout = ({ about }: Props) => {
  const { title, details, people, project } = about.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-0 lg:pt-[50px] xl:pt-[140px] pb-[60px] lg:pb-[100px] xl:pb-[200px]">
      <div className="container" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[740px_auto] gap-5 xl:gap-[50px]">
          <h1 className="text-[40px] md:text-[50px] lg:text-[60px] xl:text-[90px] has_fade_anim">
            {title}
          </h1>
          <div
            className="max-w-[410px] ml-auto has_fade_anim"
            data-delay="0.30"
          >
            <p className="text-[21px] leading-[1.14]">{details}</p>
            {people && people.length && (
              <div className="flex pt-[15px]">
                {people.slice(0, 3).map((item, i) => (
                  <Image
                    key={`people_item-${i}`}
                    width={55}
                    height={55}
                    src={item}
                    className={cn(
                      "rounded-full w-[50px] lg:w-[55px] border-[3px] border-white",
                      i !== 0 && "-ms-[20px]"
                    )}
                    alt="people"
                  />
                ))}

                <div className="bg-theme rounded-full w-[50px] lg:w-[55px] border-[3px] border-white -ms-[20px] flex justify-center items-center text-white text-[20px] cursor-default">
                  +
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="flex pt-[40px] lg:pt-[60px] xl:pt-[126px] has_fade_anim"
          data-delay="0.45"
        >
          {project &&
            project.length &&
            project.map((item, i) => (
              <Image
                key={`project_item-${i}`}
                width={520}
                height={520}
                style={{ height: "auto" }}
                className={cn(
                  "rounded-full w-[150px] md:w-[220px] lg:w-[320px] xl:w-[420px] 2xl:w-[520px]",
                  i !== 0 && "-ms-[60px] lg:-ms-[110px]"
                )}
                src={item}
                alt="project"
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default MainAbout;
