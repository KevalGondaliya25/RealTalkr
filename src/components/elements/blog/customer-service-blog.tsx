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
      action_btn: ActionBtnType;
    };
  };
  blogs: SingleBlogType[];
};

const CustomerServiceBlog = ({ blog, blogs }: Props) => {
  const { home_title, action_btn } = blog.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[43px] md:pt-[73px] xl:pt-[103px] 2xl:pt-[173px] sec_space_bottom1">
      <div className="container">
        <div
          className="flex justify-between items-center gap-x-[50px] gap-y-[30px] flex-col md:flex-row"
          ref={containerRef}
        >
          <Title1
            text={home_title}
            html
            className="[&>br]:hidden md:[&>br]:block has_fade_anim"
          />
          {action_btn && action_btn.enable && (
            <div className="has_fade_anim">
              <Link
                href={action_btn.link}
                className={cn(buttonVariants({ variant: "primary" }))}
              >
                <span className="btn-span" data-text={action_btn.label}>
                  {action_btn.label}
                </span>
              </Link>
            </div>
          )}
        </div>
        <div className="mt-[28px] xl:mt-[38px] 2xl:mt-[58px]">
          <BlogItems blogs={blogs} />
        </div>
      </div>
    </section>
  );
};

export default CustomerServiceBlog;
