import Image from "next/image";
import Link from "next/link";

// lib
import { cn } from "@/lib/utils";

// types
import { PricingCardType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

type Props = {
  price: PricingCardType;
};

const PricingCard3 = ({ price }: Props) => {
  const {
    name,
    key,
    price: mainPrice,
    price_label,
    features,
    action_btn,
  } = price;
  return (
    <div className="p-[20px] xl:p-[40px] rounded-[40px] border border-border">
      <div className="flex justify-between pb-[30px] xl:pb-[60px] gap-[30px]">
        <div>
          <p
            className={cn(
              "text-primary text-[15px] md:text-[20px] mb-[16px] md:mb-[41px] w-[100px] md:w-[150px] py-[8px] xl:py-[16px] font-bold rounded-theme flex justify-center items-center ",
              key === "standard" && "bg-[#FFF2C3]",
              key === "premium" && "bg-[#ECE0FF]"
            )}
          >
            {name}
          </p>
          <h3 className="text-[30px] lg:text-[35px] xl:text-[40px] 2xl:text-[50px]">
            {mainPrice}
          </h3>
          <p className="text-[18px]">per {price_label}</p>
        </div>
        <div className="border-s border-border ps-[10px] xl:ps-[20px] 2xl:ps-[30px] ">
          {features && features.length && (
            <ul>
              {features.map((feature, i) => (
                <li
                  className="flex items-center text-[18px] leading-none mt-[10px]"
                  key={`feature_item-${i}${mainPrice}`}
                >
                  <Image
                    width={30}
                    height={30}
                    src={
                      feature.enable
                        ? "/assets/imgs/icon/check-border.png"
                        : "/assets/imgs/icon/cross-border.png"
                    }
                    className="me-[10px] w-[26px] 2xl:w-[30px]"
                    alt="icon image"
                  />
                  {feature.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {action_btn && action_btn.enable && (
        <Link
          href={action_btn.link}
          className={cn(
            buttonVariants({
              variant: "primary2",
              size: "full",
            })
          )}
        >
          {action_btn.label}
        </Link>
      )}
    </div>
  );
};

export default PricingCard3;
