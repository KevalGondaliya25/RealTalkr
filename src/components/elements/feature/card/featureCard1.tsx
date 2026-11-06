import Image from "next/image";
import Link from "next/link";

// react icon
import { FaArrowRight } from "react-icons/fa6";

type Props = {
  feature: {
    data: {
      title: string;
      short_description: string;
      image: string;
    };
  };
};

const FeatureCard1 = ({ feature }: Props) => {
  const { title, short_description, image } = feature.data;
  return (
    <div className="p-[30px] xl:p-[40px] border border-[#19242B] rounded-theme">
      {image && (
        <div className="thumb">
          <Image width={30} height={30} src={image} alt="feature icon" />
        </div>
      )}
      <div className="mt-[38px] xl:mt-[48px]">
        <h3 className="text-[22px] xl:text-[24px] leading-tight xl:leading-[1.45]">
          {title}
        </h3>
        <p className="mt-[12px]">{short_description}</p>
        <Link
          href="#"
          className="group mt-[33px] xl:mt-[43px] text-white inline-block"
        >
          <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-all duration-300 text-[20px]" />
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard1;
