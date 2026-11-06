import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  text: string;
  author: string;
  className?: string;
};

const Quote = ({ text, author, className }: Props) => {
  return (
    <div
      className={cn(
        "flex gap-[30px] md:gap-[45px] mt-[33px] lg:mt-[63px] mb-[30px] lg:mb-[60px] pt-[42px] lg:pt-[62px] pb-[49px] lg:pb-[69px] px-[40px] lg:px-[60px] bg-sec_bg rounded-theme",
        className
      )}
    >
      <div className="mt-[7px]">
        <Image
          width={70}
          height={53}
          className="min-w-[50px] lg:min-w-[70px] w-[50px] lg:w-[70px] rtl_y"
          src="/assets/imgs/blog/details/quote.png"
          alt="icon"
        />
      </div>
      <div>
        <p className="text-[20px] xl:text-[26px] 2xl:text-[36px] leading-[1.16] font-medium mb-[2px]">
          {text}
        </p>
        <span className="inline-block relative ps-[50px] text-[18px] before:absolute before:content-[''] before:w-[40px] before:h-[1px] before:start-0 before:top-[50%] before:-translate-y-[50%] before:bg-[currentColor]">
          {author}
        </span>
      </div>
    </div>
  );
};

export default Quote;
