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

const PricingCard9 = ({ price }: Props) => {
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
    <div
      className={cn(
        "border relative rounded-theme p-[30px] xl:py-[40px] text-start",
        popular ? "bg-theme border-theme" : "border-border bg-white"
      )}
    >
      {popular && (
        <span className="text-[12px] font-bold uppercase inline-block leading-none absolute bg-white rounded-[30px] px-[12px] py-[9px] end-[30px] top-[24px] xl:top-[30px] text-primary">
          Popular
        </span>
      )}
      <p className="text-[20px] text-primary font-medium leading-none">
        {name}
      </p>
      <p className={cn("text-[18px] mt-[18px]", popular && "text-primary")}>
        {sub_title}
      </p>
      <h3 className="text-[40px] md:text-[50px] mt-[29px] 2xl:mt-[49px] leading-none">
        {mainPrice}{" "}
        <span className="text-[18px] text-secondary font-normal">
          /{price_label}
        </span>
      </h3>

      {action_btn && action_btn.enable && (
        <Link
          href={action_btn.link}
          className={cn(
            buttonVariants({
              variant: "primary6",
              size: "full",
            }),
            "mt-[20px] border-0 text-primary",
            popular
              ? "bg-white"
              : "bg-[#F7FAF9] hover:bg-btn-bg-main hover:text-primary"
          )}
        >
          <span className="btn-span" data-text={action_btn.label}>
            {action_btn.label}
          </span>
        </Link>
      )}
      {features && features.length && (
        <ul className="mt-[40px]">
          {features.map((feature, i) => (
            <li
              key={`feature-item-${i}${mainPrice}`}
              className={cn(
                feature.enable ? "" : "opacity-30",
                "flex items-center text-[16px] leading-none mt-[15px] first:mt-0",
                popular && "text-primary"
              )}
            >
              <Image
                width={15}
                height={16}
                src={
                  popular
                    ? "/assets/imgs/icon/check-4.png"
                    : "/assets/imgs/icon/check-3.png"
                }
                className="me-[10px] w-[15px]"
                alt="icon image"
              />
              {feature.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PricingCard9;
