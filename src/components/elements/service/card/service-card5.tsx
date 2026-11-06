import Image from "next/image";
import Link from "next/link";

// icons
import { FaArrowRight } from "react-icons/fa6";

// lib
import { cn } from "@/lib/utils";
import { markdownify } from "@/lib/helper/convert";
import { ServiceDetailsType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

type Props = {
  service: {
    data: ServiceDetailsType;
  };
};

const ServiceCard5 = ({ service }: Props) => {
  const { title, short_description, image } = service.data;
  return (
    <div className="px-[30px] xl:px-[60px] text-center">
      <div className="flex justify-center">
        {image && (
          <Image width={55} height={55} src={image} alt="feature icon" />
        )}
      </div>
      <div className="mt-[30px] xl:mt-[40px]">
        <h3
          className="text-[22px] xl:text-[24px] leading-tight xl:leading-[1.45]"
          dangerouslySetInnerHTML={markdownify(title)}
        />

        <p className="mt-[25px]">{short_description}</p>
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "normal" }),
            "group mt-[30px] xl:mt-[40px] text-white hover:text-white"
          )}
        >
          Learn more{" "}
          <span className="rtl_y">
            <FaArrowRight className="group-hover:translate-x-[5px] duration-300 h-[14px]" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard5;
