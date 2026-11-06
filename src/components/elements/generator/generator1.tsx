"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Generator1 = () => {
  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <Tabs defaultValue="standard" ref={containerRef}>
      <TabsList className="flex justify-center gap-[6px]">
        <TabsTrigger
          value="standard"
          className="text-[18px] text-secondary data-[state=active]:shadow-none data-[state=active]:text-white data-[state=active]:underline underline-offset-4 cursor-pointer"
        >
          Standard
        </TabsTrigger>
        <TabsTrigger
          value="advance"
          className="text-[18px] text-secondary data-[state=active]:shadow-none data-[state=active]:text-white data-[state=active]:underline underline-offset-4 cursor-pointer"
        >
          Advance
        </TabsTrigger>
      </TabsList>
      <TabsContent value="standard" className="mt-[39px]">
        <form
          className="max-w-[860px] bg-white rounded-full flex gap-[10px] md:gap-[20px] mx-auto has_fade_anim"
          data-delay="0.60"
        >
          <span className="px-[15px] md:px-[30px] flex-[0_0_auto] inline-flex justify-center items-center w-auto border-e border-border">
            <Image
              width={23}
              height={18}
              src="/assets/imgs/icon/settings.png"
              alt="icon image"
            />
          </span>
          <Input
            type="text"
            placeholder="Start with description"
            className="border-0 p-0 bg-transparent text-charcoal w-full h-auto text-[14px] md:text-[18px] placeholder:font-light placeholder:text-[#A1A9AE]"
          />
          <Button
            variant="primary2"
            className="hover:bg-btn-bg-main m-[5px] text-[12px] md:text-[16px]"
          >
            <span className="btn-span" data-text="Generate">
              Generate
            </span>
          </Button>
        </form>
        <div className="flex justify-center items-start md:items-center gap-[20px] mt-[25px] has_fade_anim">
          <span className="text-secondary">Tags:</span>
          <ul className="flex gap-[10px] flex-wrap">
            <li className="text-[16px] font-medium leading-none text-white bg-[#ffffff1a] inline-block rounded-[35px] px-[13px] py-[9px]">
              Creative
            </li>
            <li className="text-[16px] font-medium leading-none text-white bg-[#ffffff1a] inline-block rounded-[35px] px-[13px] py-[9px]">
              Animation
            </li>
            <li className="text-[16px] font-medium leading-none text-white bg-[#ffffff1a] inline-block rounded-[35px] px-[13px] py-[9px]">
              Hyperreality
            </li>
            <li className="text-[16px] font-medium leading-none text-white bg-[#ffffff1a] inline-block rounded-[35px] px-[13px] py-[9px]">
              Steampunk
            </li>
          </ul>
        </div>
      </TabsContent>
      <TabsContent value="advance" className="mt-[39px]">
        <form
          className="max-w-[860px] bg-white rounded-full flex gap-[10px] md:gap-[20px] mx-auto has_fade_anim"
          data-delay="0.60"
        >
          <span className="px-[15px] md:px-[30px] flex-[0_0_auto] inline-flex justify-center items-center w-auto border-e border-border">
            <Image
              width={23}
              height={18}
              src="/assets/imgs/icon/settings.png"
              alt="icon image"
            />
          </span>
          <Input
            type="text"
            placeholder="Start with description"
            className="border-0 p-0 bg-transparent text-charcoal w-full h-auto text-[14px] md:text-[18px] placeholder:font-light placeholder:text-[#A1A9AE]"
          />
          <Button
            variant="primary2"
            className="hover:bg-btn-bg-main m-[5px] text-[12px] md:text-[16px]"
          >
            <span className="btn-span" data-text="Generate">
              Generate
            </span>
          </Button>
        </form>
        <div className="flex justify-center items-start md:items-center gap-[20px] mt-[25px] has_fade_anim">
          <span className="text-secondary">Tags:</span>
          <ul className="flex gap-[10px] flex-wrap">
            <li className="text-[16px] font-medium leading-none text-white bg-[#ffffff1a] inline-block rounded-[35px] px-[13px] py-[9px]">
              Creative
            </li>
            <li className="text-[16px] font-medium leading-none text-white bg-[#ffffff1a] inline-block rounded-[35px] px-[13px] py-[9px]">
              Animation
            </li>
            <li className="text-[16px] font-medium leading-none text-white bg-[#ffffff1a] inline-block rounded-[35px] px-[13px] py-[9px]">
              Hyperreality
            </li>
            <li className="text-[16px] font-medium leading-none text-white bg-[#ffffff1a] inline-block rounded-[35px] px-[13px] py-[9px]">
              Steampunk
            </li>
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default Generator1;
