"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// lib
import { cn } from "@/lib/utils";

type Props = {
  service: {
    data: {
      title: string;
      sub_title: string;
      image: string;
      bg_color?: string;
      border_color?: string;
    };
  };
};

const ServiceCard4 = ({ service }: Props) => {
  const { title, sub_title, image, bg_color, border_color } = service.data;

  const cardContainer = useRef<HTMLDivElement>(null!);

  const hoverBorderChanged = (type: string, borderColor?: string) => {
    if (borderColor) {
      if (type === "mouseEnter") {
        cardContainer.current.style.borderColor = borderColor;
      } else if (type === "mouseLeave") {
        cardContainer.current.style.borderColor = "transparent";
      }
    }
  };

  const hoverBgChanged = (type: string, bgColor?: string) => {
    if (bgColor) {
      if (type === "mouseEnter") {
        cardContainer.current.style.backgroundColor = "transparent";
      } else if (type === "mouseLeave") {
        cardContainer.current.style.backgroundColor = bgColor;
      }
    }
  };

  return (
    <div
      className={cn(
        "bg-white hover:bg-transparent h-full  border-2 border-transparent hover:border-secondary rounded-theme transition-all duration-500 pt-[27px] xl:pt-[37px] pb-[30px] xl:pb-[50px] px-[30px] xl:px-[50px] flex justify-between flex-col"
      )}
      style={{ backgroundColor: bg_color }}
      ref={cardContainer}
      onMouseEnter={() => {
        hoverBorderChanged("mouseEnter", border_color as string);
        hoverBgChanged("mouseEnter", bg_color as string);
      }}
      onMouseLeave={() => {
        hoverBorderChanged("mouseLeave", border_color as string);
        hoverBgChanged("mouseLeave", bg_color as string);
      }}
    >
      <Link href="#">
        <p className="text-[26px] xl:text-[30px] leading-[1.16] max-w-[300px] text-primary">
          {title}
        </p>
        <p className="mt-[13px]">{sub_title}</p>
      </Link>
      <Link href="#">
        <div className="mt-[73px] flex justify-center md:justify-end">
          <Image
            width={230}
            height={190}
            src={image}
            className="h-full"
            alt="service icon"
          />
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard4;
