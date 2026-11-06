"use client";

import { useEffect, useRef } from "react";
import { useStopScrollTop } from "@/context/app.context";

import { FaArrowUp } from "react-icons/fa6";

const ScrollTop = () => {
  const { stopScrollTop } = useStopScrollTop();

  const topScroll = useRef<HTMLButtonElement>(null!);
  useEffect(() => {
    if (typeof window !== "undefined") {
      let scroll_top = topScroll.current;
      if (scroll_top) {
        window.onscroll = function () {
          if (
            document.body.scrollTop > 50 ||
            document.documentElement.scrollTop > 50
          ) {
            scroll_top.style.display = "block";
          } else {
            scroll_top.style.display = "none";
          }
        };
      }
    }
  }, []);

  if (stopScrollTop) return;

  const goToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  return (
    <button
      ref={topScroll}
      style={{ display: "none" }}
      className="fixed w-[50px] h-[50px] right-[5px] sm:right-[10px] md:right-[20px] bottom-[55px] sm:bottom-[60px] md:bottom-[80px] lg:bottom-[20px] z-[9991] rounded-full text-charcoal-500 hover:text-charcoal-800  bg-white hidden transition-all duration-300 mix-blend-exclusion"
      onClick={goToTop}
    >
      <FaArrowUp className="w-[14px] h-[16px] m-auto" />
    </button>
  );
};

export default ScrollTop;
