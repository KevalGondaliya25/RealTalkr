"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import TitleSection1 from "@/components/shared/title-section/title-section1";
import ProjectFrame from "./project-frame";

type Props = {
  project: {
    data: {
      title: string;
      details: string;
      items: string[];
    };
  };
};

const AllProject = ({ project }: Props) => {
  const { title, details, items } = project.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[5px] xl:pt-[75px] 2xl:pt-[135px] sec_space_bottom1">
      <div className="container" ref={containerRef}>
        <TitleSection1 title={title} details={details} />
      </div>
      <ProjectFrame items={items} />
    </section>
  );
};

export default AllProject;
