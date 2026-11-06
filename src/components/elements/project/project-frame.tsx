"use client";

import { useRef, useState } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { delayTime3 } from "@/lib/helper/delayTime";

// shadcn components
import { Button } from "@/components/ui/button";

type Props = {
  items: string[];
  allowLoad?: boolean;
};

const ProjectFrame = ({ items, allowLoad = true }: Props) => {
  const [number, setNumber] = useState<number>(
    items && items.length > 12 ? 12 : items.length
  );

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <>
      {items && items.length && (
        <div className="container" ref={containerRef}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-[30px]">
            {items.slice(0, number).map((item, i) => (
              <div
                key={`project_item-${i}`}
                className="[&:nth-child(7n+1)]:row-span-2 [&:nth-child(7n+3)]:row-span-2 h-[150px] md:h-[200px] xl:h-[260px] [&:nth-child(7n+1)]:h-[310px] [&:nth-child(7n+3)]:h-[310px] md:[&:nth-child(7n+1)]:h-[430px] md:[&:nth-child(7n+3)]:h-[430px] xl:[&:nth-child(7n+1)]:h-[550px] xl:[&:nth-child(7n+3)]:h-[550px] has_fade_anim"
                data-delay={delayTime3(i + 1)}
              >
                <video
                  src={item}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover rounded-theme"
                ></video>
              </div>
            ))}
          </div>

          {allowLoad && items && items.length > number && (
            <div className="flex justify-center mt-[40px] xl:mt-[70px]">
              <Button variant="outline" onClick={() => setNumber(items.length)}>
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProjectFrame;
