import Image from "next/image";
import Link from "next/link";

// icons
import { FaArrowRight } from "react-icons/fa6";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

type Props = {
  integration: {
    data: {
      title: string;
      sub_title: string;
      short_description: string;
      image: string;
    };
    slug: string;
    content: string;
  };
  btnText?: string;
};

const IntegrationCard1 = ({
  integration,
  btnText = "Explore Integration",
}: Props) => {
  const { title, sub_title, image, short_description } = integration.data;
  return (
    <Link href={`/integration/${integration.slug}`}>
      <div className="pt-[35px] 2xl:pt-[50px] pb-[32px] 2xl:pb-[42px] px-[30px] 2xl:px-[60px] border border-border hover:border-theme bg-white rounded-theme text-center transition-all duration-500">
        <div className="max-w-[60px] lg:max-w-[80px] max-h-[60px] lg:max-h-[80px] mx-auto">
          {image && (
            <Image
              width={80}
              height={80}
              style={{ height: "auto" }}
              src={image}
              alt="icon image"
            />
          )}
        </div>
        <div className="mt-[40px]">
          <h3 className="text-[24px] !leading-tight">
            {title}
            <span className="block text-secondary font-normal">
              {sub_title}
            </span>
          </h3>
          <p className="mt-[23px]">{short_description}</p>
          <span
            className={cn(
              buttonVariants({ variant: "normal" }),
              "group mt-[46px] 2xl:mt-[66px]"
            )}
          >
            {btnText}
            <span className="rtl_y">
              <FaArrowRight className="group-hover:translate-x-[5px] duration-300 h-[14px]" />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default IntegrationCard1;
