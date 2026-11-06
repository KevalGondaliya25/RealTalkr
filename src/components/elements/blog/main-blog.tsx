"use client";

import { useRef } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// types
import { SingleBlogType } from "@/types";

// components
import TitleSection1 from "@/components/shared/title-section/title-section1";
import BlogItems from "./blog-items";

type Props = {
  blog: {
    data: {
      title: string;
      details: string;
    };
  };

  blogs: SingleBlogType[];
};

const MainBlog = ({ blog, blogs }: Props) => {
  const { title, details } = blog.data;

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
      <BlogItems blogs={blogs} />
    </section>
  );
};

export default MainBlog;
