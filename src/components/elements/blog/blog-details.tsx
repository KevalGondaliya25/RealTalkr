"use client";

import { useRef } from "react";
import Image from "next/image";

// react icons
import { FaDribbble, FaInstagram, FaTwitter } from "react-icons/fa6";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// components
import Title1 from "@/components/shared/title/title1";
import BlogComment from "../blog-comment";

type Props = {
  blog: {
    data: {
      title: string;
      image: string;
      date: string;
      writer: string;
      comment: string;
      views: string;
      share: string;
      tags: string[];
    };
  };
  children?: React.ReactNode;
};

const BlogDetails = ({ blog, children }: Props) => {
  const { title, image, date, writer, comment, views, share, tags } = blog.data;

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
        <Title1
          text={title}
          heading1
          className="mb-[28px] md:mb-[36px] has_fade_anim"
        />
        <div
          className="mb-[20px] xl:mb-[40px] 2xl:mb-[70px] flex flex-wrap gap-y-[10px] has_fade_anim"
          data-delay="0.30"
        >
          <div className="flex gap-[15px] items-center pe-[20px] md:pe-[61px] relative after:absolute after:content-[''] after:w-[1px] after:h-[20px] after:bg-[#12121210] after:top-[50%] after:end-[30px] after:-translate-y-[50%] after:hidden after:md:block">
            <div className="w-[50px] h-[50px] bg-[#ff845d1a] flex justify-center items-center rounded-full">
              <Image
                width={15}
                height={20}
                src="/assets/imgs/icon/user-orange.png"
                alt="icon"
              />
            </div>
            <div>
              <p className="text-[14px] mb-[7px] leading-none">Written by</p>
              <p className="text-[18px] text-primary leading-none font-semibold">
                {writer}
              </p>
            </div>
          </div>
          <div className="flex gap-[15px] items-center pe-[20px] md:pe-[61px] relative after:absolute after:content-[''] after:w-[1px] after:h-[20px] after:bg-[#12121210] after:top-[50%] after:end-[30px] after:-translate-y-[50%] after:hidden after:md:block">
            <div className="w-[50px] h-[50px] bg-[#ff845d1a] flex justify-center items-center rounded-full">
              <Image
                width={20}
                height={20}
                src="/assets/imgs/icon/date-orange.png"
                alt="icon"
              />
            </div>
            <div>
              <p className="text-[14px] mb-[7px] leading-none">Post date</p>
              <p className="text-[18px] text-primary leading-none font-semibold">
                {date}
              </p>
            </div>
          </div>
          <div className="flex gap-[15px] items-center">
            <div className="w-[50px] h-[50px] bg-[#ff845d1a] flex justify-center items-center rounded-full">
              <Image
                width={20}
                height={20}
                src="/assets/imgs/icon/comment-orange.png"
                alt="icon"
              />
            </div>
            <div>
              <p className="text-[14px] mb-[7px] leading-none">Comments</p>
              <p className="text-[18px] text-primary leading-none font-semibold">
                {comment}
              </p>
            </div>
          </div>
        </div>
        <div
          className="rounded-[30px] overflow-hidden has_fade_anim"
          data-delay="0.45"
        >
          {image && (
            <Image
              width={1290}
              height={720}
              style={{ height: "auto" }}
              src={image}
              alt="blog image"
            />
          )}
        </div>
        <div className="flex items-start flex-col lg:flex-row gap-[30px] md:gap-[50px] xl:gap-[80px] 2xl:gap-[140px] mt-[30px] xl:mt-[50px] 2xl:mt-[60px]">
          <div className="border-e-0 lg:border-e border-b lg:border-b-0 border-[#e9e9e9] flex lg:block items-center ">
            <div className="w-[80px] pb-[5px] lg:pb-0 flex justify-center items-center flex-col">
              <Image
                width={18}
                height={17}
                src="/assets/imgs/icon/view-graph.png"
                className="mb-[7px]"
                alt="icon"
              />
              <p className="text-[12px] leading-none">{views}</p>
              <p className="text-[12px] leading-none">Views</p>
            </div>
            <div className="w-[80px] pb-[5px] lg:pb-0 flex justify-center items-center flex-col border-t-0 lg:border-t border-x lg:border-x-0 border-[#e9e9e9] pt-0 lg:pt-[20px] mt-0 lg:mt-[19px]">
              <Image
                width={17}
                height={19}
                src="/assets/imgs/icon/share.png"
                className="mb-[7px]"
                alt="icon"
              />
              <p className="text-[12px] leading-none">{share}</p>
              <p className="text-[12px] leading-none">Shares</p>
            </div>
            <ul className="flex flex-row lg:flex-col items-center gap-[20px] mt-0 lg:mt-[25px] ms-[25px] lg:ms-0">
              <li>
                <a href="#">
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="#">
                  <FaDribbble />
                </a>
              </li>
              <li>
                <a href="#">
                  <FaInstagram />
                </a>
              </li>
            </ul>
          </div>
          <div>
            {children}
            <div className="mt-[33px]">
              {tags && tags.length && (
                <div className="flex gap-[5px]">
                  {tags.map((tag, i) => (
                    <a
                      key={`blog_details-tag-${i}`}
                      href="#"
                      className="text-[12px] font-semibold text-primary bg-[#F0F0F0] rounded-[5px] px-[9px] py-[4px]"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <BlogComment className="mt-[31px] md:mt-[51px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
