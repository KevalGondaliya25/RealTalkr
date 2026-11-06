import Image from "next/image";
import Link from "next/link";

// types
import { ServiceDetailsType } from "@/types";

type Props = {
  service: {
    data: ServiceDetailsType;
    slug: string;
  };
};

const ServiceCard2 = ({ service }: Props) => {
  const { title, short_description, image } = service.data;
  return (
    <div className="px-[20px] py-[30px] lg:py-[20px] xl:px-[30px] xl:py-[40px] border border-border rounded-[40px] text-center">
      <div className="pb-[16px] md:pb-[35px] w-[60px] mx-auto">
        <Image width={60} height={60} src={image} alt="icon" />
      </div>
      <Link href="#">
        <h3 className="text-[18px] xl:text-[24px] max-w-[182px] mx-auto pb-[10px] md:pb-[16px]">
          {title}
        </h3>
      </Link>
      <p className="pb-5 lg:pb-[32px]">{short_description}</p>
      <Link href="#" className="inline-block">
        <div className="rounded-full p-0 flex justify-center items-center w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-transparent border border-border hover:bg-theme">
          <Image
            width={19}
            height={14}
            src="/assets/imgs/icon/arrow.png"
            className="-rotate-45 rtl:-rotate-135"
            alt="icon"
          />
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard2;
