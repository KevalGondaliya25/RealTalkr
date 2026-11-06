import Image from "next/image";

// lib
import { cn } from "@/lib/utils";

// components
import Title1 from "../title/title1";

type Props = {
  title: string;
  details: string;
  className?: string;
};

const TitleSection1 = ({ title, details, className }: Props) => {
  return (
    <div className={cn("pb-[65px] xl:pb-[85px] 2xl:pb-[135px]", className)}>
      <div className="flex items-center gap-5 md:gap-[40px] flex-col md:flex-row mt-10 sm:mt-0">
        <Title1
          text={title}
          heading1
          className="max-w-[410px] 2xl:max-w-[520px] has_fade_anim text-center mx-auto sm:text-left"
        />
        <div className="hidden md:block mt-[58px] xl:mt-[93px] 2xl:mt-[123px] has_fade_anim">
          <Image
            width={331}
            height={42}
            style={{ height: "auto" }}
            src="/assets/imgs/shape/shape-s-56.png"
            className="rtl_y"
            alt="shape image"
          />
        </div>
        <div className="max-w-full md:max-w-[250px] lg:max-w-[410px] ms-auto mt-0 md:mt-[57px] lg:mt-[92px] xl:mt-[102px] 2xl:mt-[132px] has_fade_anim text-center mx-auto sm:text-left">
          <p>{details}</p>
        </div>
      </div>
    </div>
  );
};

export default TitleSection1;
