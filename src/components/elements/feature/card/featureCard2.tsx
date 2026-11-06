import Image from "next/image";

type Props = {
  feature: {
    name: string;
    details: string;
    icon: string;
  };
};

const FeatureCard2 = ({ feature }: Props) => {
  const { name, details, icon } = feature;
  return (
    <div className="h-full p-[30px] 2xl:px-[50px] 2xl:py-[43px] border border-border hover:border-[#4C9FFF] rounded-theme bg-transparent hover:bg-[#EDF5FF] transition duration-500 ">
      {icon && (
        <div className="pb-[29px]">
          <Image width={35} height={35} src={icon} alt="icon" />
        </div>
      )}
      <h2 className="mb-[20px] text-[24px]">{name}</h2>
      <p className="text">{details}</p>
    </div>
  );
};

export default FeatureCard2;
