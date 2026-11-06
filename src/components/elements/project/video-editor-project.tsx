"use client";

import { useRef } from "react";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

// components
import TitleSection2 from "@/components/shared/title-section/title-section2";
import ProjectFrame from "./project-frame";

type Props = {
  project: {
    data: {
      home_title: string;
      home_details: string;
      items: string[];
      action_btn: ActionBtnType;
    };
  };
};

const VideoEditorProject = ({ project }: Props) => {
  const { home_title, home_details, items, action_btn } = project.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="sec_space_top4">
      <div className="container">
        <div ref={containerRef}>
          <TitleSection2
            title={home_title}
            details={home_details}
            titleClassName="max-w-[670px]"
            detailsClassName="max-w-[670px]"
          />
        </div>
        <div className="mt-[60px]">
          <ProjectFrame items={items.slice(0, 6)} allowLoad={false} />
        </div>
        {action_btn && action_btn.enable && (
          <div className="flex justify-center mt-[40px] xl:mt-[70px]">
            <Link
              href={action_btn.link}
              className={cn(
                buttonVariants({ variant: "outline3", size: "xxl" })
              )}
            >
              {action_btn.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoEditorProject;
