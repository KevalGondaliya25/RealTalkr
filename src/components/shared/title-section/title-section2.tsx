import React from "react";

// lib
import { cn } from "@/lib/utils";

// components
import Title1 from "../title/title1";
import VapiButton from "@/components/component/Button/vapiButton";

type Props = {
  title: string;
  sub_title?: string;
  details: string;
  heading?: boolean;
  html?: boolean;
  vapiButtonShow?: boolean;
  className?: string;
  titleClassName?: string;
  detailsClassName?: string;
  subTitleClassName?: string;
};

const TitleSection2 = ({
  title,
  sub_title,
  details,
  className,
  titleClassName,
  detailsClassName,
  subTitleClassName,
  heading = false,
  html = false,
  vapiButtonShow = false,
}: Props) => {
  return (
    <div className={cn("text-center", className)}>
      {sub_title && (
        <div>
          <span
            className={cn(
              "text-[12px] font-bold uppercase text-charcoal bg-[#EAFAF2] px-[16px] py-[8px] inline-block rounded-[10px] mb-[17px] has_fade_anim",
              subTitleClassName
            )}
          >
            {sub_title}
          </span>
        </div>
      )}
      <Title1
        text={title}
        heading1={heading}
        html={html}
        className={cn("max-w-[565px] mx-auto has_fade_anim", titleClassName)}
      />
      {vapiButtonShow && (
        <>
          <div className="pt-6 flex justify-center md:justify-start">
            <VapiButton
              className="border-2 border-charcoal bg-transparent text-charcoal hover:text-charcoal hover:bg-charcoal-300 w-full"
              variant="primary1"
              firstMsg="Say Hi"
            />
          </div>
        </>
      )}
      <p
        className={cn(
          "mt-[23px] lg:mt-[33px] max-w-[550px] mx-auto has_fade_anim text-base",
          detailsClassName
        )}
      >
        {details}
      </p>
    </div>
  );
};

export default TitleSection2;
