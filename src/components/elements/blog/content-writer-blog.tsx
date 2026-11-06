"use client";

import { useRef } from "react";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType, SingleBlogType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

// components
import Title1 from "@/components/shared/title/title1";
import BlogItems from "./blog-items";

type Props = {
  blog: {
    data: {
      home_title: string;
      details: string;
      action_btn: ActionBtnType;
    };
  };
  blogs: SingleBlogType[];
};

const ContentWriterBlog = ({ blog, blogs }: Props) => {
  const { home_title, details, action_btn } = blog.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[55px] md:pt-[80px] xl:pt-[106px] 2xl:pt-[131px]">
      <div className="container">
        <div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-x-[130px] gap-y-[20px]"
          ref={containerRef}
        >
          <Title1 text={home_title} className="max-w-[310px] has_fade_anim" />
          <div className="flex-1">
            <p className="max-w-[440px] has_fade_anim" data-delay="0.25">
              {details}
            </p>
          </div>
          {action_btn && action_btn.enable && (
            <div className="has_fade_anim" data-delay="0.35">
              <Link
                href={action_btn.link}
                className={cn(
                  buttonVariants({ variant: "link", size: "auto" })
                )}
              >
                <span className="btn-span" data-text={action_btn.label}>
                  {action_btn.label}
                </span>
              </Link>
            </div>
          )}
        </div>
        <div className="mt-[33px] xl:mt-[43px] 2xl:mt-[63px]">
          <BlogItems blogs={blogs} allowBtn={false} />
        </div>
      </div>
    </section>
  );
};

export default ContentWriterBlog;
