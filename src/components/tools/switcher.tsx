"use client";

import { RefObject, useRef, useState } from "react";
import { useDirection, useLayout, useSwitcherDir } from "@/context/app.context";

// icons
import { FaGear, FaXmark } from "react-icons/fa6";

// lib
import { cn } from "@/lib/utils";

type SwitcherType = {
  cursor1: RefObject<HTMLDivElement>;
  cursor2: RefObject<HTMLDivElement>;
};

const Switcher = ({ cursor1, cursor2 }: SwitcherType) => {
  const { switcherDir } = useSwitcherDir();
  const { direction, setDirection } = useDirection();
  const { layout, setLayout } = useLayout();

  const [open, setOpen] = useState(false);

  const switcherIcon = useRef<HTMLDivElement>(null!);
  const switcherItems = useRef<HTMLDivElement>(null!);
  const switcherOpen = useRef<HTMLButtonElement>(null!);
  const switcherClose = useRef<HTMLButtonElement>(null!);
  const cursorStyle = useRef<HTMLSelectElement>(null!);

  const openSwitcher = () => {
    setOpen(true);
    switcherIcon.current.style[switcherDir as any] = "280px";
    switcherItems.current.style[switcherDir as any] = "0";
  };
  const closeSwitcher = () => {
    setOpen(false);
    switcherIcon.current.style[switcherDir as any] = "0";
    switcherItems.current.style[switcherDir as any] = "-280px";
  };
  const cursor = () => {
    let cursor_val = cursorStyle.current.value;

    if (cursor_val == "1" && cursor1.current && cursor2.current) {
      cursor1.current.style.display = "none";
      cursor2.current.style.display = "none";
    } else if (cursor1.current && cursor2.current) {
      cursor1.current.style.display = "";
      cursor2.current.style.display = "";
    }
  };

  return (
    <div className="relative hidden sm:block">
      <div
        className={cn(
          "fixed w-[50px] h-[50px] bg-white right-0 top-[40%] -translate-y-[50%] z-[1000] transition-all duration-300 mix-blend-exclusion",
          {
            "left-0": switcherDir === "left",
          }
        )}
        ref={switcherIcon}
      >
        {open ? (
          <button
            className="flex justify-center items-center text-[24px] text-charcoal-2 w-full h-full transition-all duration-300 hover:text-gray-2"
            ref={switcherClose}
            onClick={closeSwitcher}
          >
            <FaXmark className="w-[23px] h-[24px]" />
          </button>
        ) : (
          <button
            className="flex justify-center items-center text-[24px] text-charcoal-2 w-full h-full transition-all duration-300 hover:text-gray-2"
            ref={switcherOpen}
            onClick={openSwitcher}
          >
            <FaGear className="w-[23px] h-[24px]" />
          </button>
        )}
      </div>

      <div
        className={cn(
          "w-[280px] py-[50px] px-[30px] bg-black-old-2 fixed -right-[280px] top-[40%] z-[99] -translate-y-[50%] font-primary transition-all duration-300",
          {
            "-left-[280px]": switcherDir === "left",
          }
        )}
        style={{ zIndex: "1000" }}
        ref={switcherItems}
      >
        <div className="mb-[30px]">
          <h2 className="text-[20px] font-medium leading-normal !text-white capitalize pb-[10px]">
            Cursor
          </h2>
          <select
            defaultValue={2}
            className="text-[14px] font-normal leading-normal text-gray-2 w-full border-0 rounded py-[9px] px-[10px] bg-[#2b2b2f] capitalize outline-0 cursor-pointer"
            ref={cursorStyle}
            onChange={cursor}
          >
            <option value="1">default</option>
            <option value="2">animated</option>
          </select>
        </div>

        <div className="mb-[30px]">
          <h2 className="text-[20px] font-medium leading-normal !text-white capitalize pb-[10px]">
            Direction
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              className={cn(
                "inline-block text-[14px] font-medium leading-normal hover:text-white bg-[#2b2b2f] rounded capitalize py-[10px] px-[15px]",
                direction === "rtl" ? "text-gray-2" : "text-white"
              )}
              onClick={() => setDirection("")}
            >
              LTR
            </button>
            <button
              className={cn(
                "inline-block text-[14px] font-medium leading-normal hover:text-white bg-[#2b2b2f] rounded capitalize py-[10px] px-[15px]",
                direction === "rtl" ? "text-white" : "text-gray-2"
              )}
              onClick={() => setDirection("rtl")}
            >
              RTL
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-[20px] font-medium leading-normal !text-white capitalize pb-[10px]">
            Layout
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              className={cn(
                "inline-block text-[14px] font-medium leading-normal hover:text-white bg-[#2b2b2f] rounded capitalize py-[10px] px-[15px]",
                layout === "box" ? "text-white" : "text-gray-2"
              )}
              onClick={() => setLayout("box")}
            >
              Box
            </button>
            <button
              className={cn(
                "inline-block text-[14px] font-medium leading-normal hover:text-white bg-[#2b2b2f] rounded capitalize py-[10px] px-[15px]",
                layout === "box" ? "text-gray-2" : "text-white"
              )}
              onClick={() => setLayout("")}
            >
              Full
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Switcher;
