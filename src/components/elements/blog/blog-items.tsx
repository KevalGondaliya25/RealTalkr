"use client";

import { useRef, useState } from "react";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// types
import { SingleBlogType } from "@/types";

// lib
import { delayTime2 } from "@/lib/helper/delayTime";

// shadcn components
import { Button } from "@/components/ui/button";

// components
import BlogCard1 from "./blog-card1";

type Props = {
  blogs: SingleBlogType[];
  allowLoad?: boolean;
  allowBtn?: boolean;
};

const BlogItems = ({ blogs, allowLoad = true, allowBtn }: Props) => {
  const [number, setNumber] = useState<number>(
    blogs && blogs.length > 6 ? 6 : blogs.length
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
      {blogs && blogs.length && (
        <div className="container" ref={containerRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-[30px] xl:gap-x-[40px] gap-y-[40px] xl:gap-y-[60px]">
            {blogs.slice(0, number).map((blog, i) => (
              <div
                key={blog.slug}
                className="has_fade_anim"
                data-delay={delayTime2(i + 1)}
              >
                <BlogCard1 blog={blog} allowBtn={allowBtn} />
              </div>
            ))}
          </div>

          {allowLoad && blogs && blogs.length > number && (
            <div className="mt-[40px] xl:mt-[50px] 2xl:mt-[70px] flex justify-center items-center">
              <Button variant="outline" onClick={() => setNumber(blogs.length)}>
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BlogItems;
