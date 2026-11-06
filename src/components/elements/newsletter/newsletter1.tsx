"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// components
import Title1 from "@/components/shared/title/title1";

const NewsLetter1 = () => {
  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );
  return (
    <section className="pt-[50px] md:pt-[80px] xl:pt-[100px] 2xl:pt-[180px] pb-[66px] md:pb-[96px] xl:pb-[126px] 2xl:pb-[196px]">
      <div className="container" ref={containerRef}>
        <div className="text-center">
          <Title1
            text="Join our 120k+ big community connect our newsletter"
            className="max-w-[880px] mx-auto has_fade_anim"
          />
          <div className="mt-[31px] xl:mt-[41px] 2xl:mt-[61px] has_fade_anim">
            <form className="max-w-[630px] mx-auto">
              <div className="flex items-center gap-5 p-2.5 ps-5 md:ps-[34px] border border-border rounded-[10px]">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="border-0 p-0 bg-transparent text-primary w-full"
                />
                <Button
                  type="submit"
                  className={cn(
                    buttonVariants({ variant: "primary", size: "sm" })
                  )}
                >
                  <span className="btn-span" data-text="Subscribe">
                    Subscribe
                  </span>
                </Button>
              </div>
            </form>
          </div>
          <div className="flex justify-center gap-x-[45px] mt-[32px] has_fade_anim">
            <div className="flex items-center gap-[9px]">
              <Image
                width={16}
                height={16}
                src="/assets/imgs/icon/check-8.png"
                alt="icon image"
              />
              <p className="text">Update offer</p>
            </div>
            <div className="flex items-center gap-[9px]">
              <Image
                width={16}
                height={16}
                src="/assets/imgs/icon/check-8.png"
                alt="icon image"
              />
              <p className="text">No spam</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter1;
