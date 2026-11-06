import Image from "next/image";
import Link from "next/link";

// icons
import { FaArrowRight } from "react-icons/fa6";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

type Props = {
  service: {
    data: {
      title: string;
      short_description: string;
      image: string;
    };
  };
};

const ServiceCard3 = ({ service }: Props) => {
  const { title, short_description, image } = service.data;
  return (
    <div className="bg-sec_bg-2 rounded-[22px] h-full text-center pt-[35px] 2xl:pt-[50px] pb-[38px] 2xl:pb-[48px] px-[20px] 2xl:px-[50px]">
      <div>
        <Image
          width={60}
          height={60}
          src={image}
          className="h-[60px] mx-auto"
          alt="feature icon"
        />
      </div>
      <div className="mt-[41px] 2xl:mt-[51px]">
        <h3 className="text-[26px] 2xl:text-[30px] leading-[1.16] max-w-[80%] mx-auto">
          {title}
        </h3>
        <p className="mt-[20px]">{short_description}</p>
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "normal", size: "auto" }),
            "mt-[31px] uppercase text-[14px]"
          )}
        >
          Read more{" "}
          <span className="rtl_y">
            <FaArrowRight className="w-[13px] h-[14px]" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard3;
