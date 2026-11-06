import Image from "next/image";
import Link from "next/link";

// icons
import { FaArrowRight } from "react-icons/fa6";

// lib
import { cn } from "@/lib/utils";

// types
import { ServiceDetailsType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

type Props = {
  service: {
    data: ServiceDetailsType;
    slug: string;
  };
};

const ServiceCard1 = ({ service }: Props) => {
  const { title, short_description, image } = service.data;
  return (
    <div className="border border-border hover:border-theme rounded-theme bg-white text-center transition-all duration-300 pt-[40px] 2xl:pt-[50px] pb-[37px] 2xl:pb-[47px] px-[30px] 2xl:px-[60px]">
      <div className="thumb">
        <Image
          width={80}
          height={80}
          src={image}
          className="mx-auto"
          alt="feature icon"
        />
      </div>
      <div className="mt-[30px] 2xl:mt-[40px]">
        <h3 className="text-[20px] md:text-[24px] leading-[1.25]">{title}</h3>
        <p className="mt-[23px]">{short_description}</p>
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "normal" }),
            "group mt-[41px] 2xl:mt-[71px]"
          )}
        >
          Learn more{" "}
          <span className="rtl_y">
            <FaArrowRight className="group-hover:translate-x-[5px] duration-300 w-[13px] h-[14px]" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard1;
