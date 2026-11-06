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

const PricingCard7 = ({ price }: Props) => {
  const {
    name,
    sub_title,
    key,
    price: mainPrice,
    features,
    action_btn,
  } = price;
  return (
    <div className="border border-border bg-[#051119] rounded-theme p-[30px] xl:px-[50px] xl:py-[40px] text-center">
      <p
        className={cn(
          "text-[18px] font-medium leading-none inline-block bg-[#121B21] text-white px-[27px] py-[11px] rounded-[24.5px]"
        )}
      >
        {name}
      </p>
      <p className="text-[40px] xl:text-[50px] 2xl:text-[60px] leading-0 text-primary mt-[27px]">
        {mainPrice}
      </p>
      <p className="text-[18px] leading-none mt-[13px]">{sub_title}</p>
      {features && features.length && (
        <div className="pt-[36px] mt-[32px] mb-[40px] text-center border-t border-border">
          <ul>
            {features.map((feature, i) => (
              <li
                className="flex items-center text-secondary text-[18px] leading-none mt-[10px]"
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
        </div>
      )}
      {action_btn && action_btn.enable && (
        <Link
          href={action_btn.link}
          className={cn(
            buttonVariants({
              variant: "primary5",
              size: "lg",
            }),
            "w-full before:mask-[url(/assets/imgs/shape/shape-s-62.png)]"
          )}
        >
          <span className="btn-span" data-text={action_btn.label}>
            {action_btn.label}
          </span>
        </Link>
      )}
    </div>
  );
};

export default PricingCard7;
