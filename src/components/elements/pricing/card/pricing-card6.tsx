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

const PricingCard6 = ({ price }: Props) => {
  const {
    name,
    sub_title,
    price: mainPrice,
    price_label,
    popular,
    features,
    action_btn,
  } = price;

  return (
    <div className="pt-[40px] px-[30px] pb-[30px] 2xl:p-[50px] rounded-theme relative text-start">
      {popular && (
        <span className="text-[10px] font-bold uppercase inline-block leading-none absolute bg-[#FFE37E] rounded-[11px] md:rounded-[0_0_11px_11px] px-[9px] py-[8px] end-[30px] md:end-auto start-auto xl:start-[30px] 2xl:start-[50px] top-[45pxx] md:top-0 text-[#051119]">
          Popular
        </span>
      )}
      <h3 className="text-[16px] font-semibold leading-none px-[22px] py-[12px] bg-[#1F272D] inline-block rounded-full">
        {name}
      </h3>
      <h3 className="text-[40px] xl:text-[50px] font-semibold leading-none mt-[33px]">
        {mainPrice}{" "}
        <span className="text-[18px] text-secondary font-normal">
          /{price_label}
        </span>
      </h3>
      <p className="text-[18px] mt-[15px]">{sub_title}</p>
      {features && features.length && (
        <div className="mt-[27px]">
          <p className="text-[18px] leading-none font-medium mb-[22px] text-white">
            Advantage:
          </p>
          <ul>
            {features.map((feature, i) => (
              <li
                key={`feature-item-${i}${mainPrice}`}
                className={cn(
                  feature.enable ? "" : "opacity-30",
                  "flex items-center text-[16px] leading-none mt-[15px] first:mt-0 text-white"
                )}
              >
                <Image
                  width={15}
                  height={16}
                  src="/assets/imgs/icon/check-5.png"
                  className="me-[10px] w-[15px]"
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
              variant: popular ? "primary4" : "outline2",
              size: "full",
            }),
            "mt-[40px]",
            !popular && "border-btn-border hover:border-0"
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

export default PricingCard6;
