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

const PricingCard4 = ({ price }: Props) => {
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
        "relative rounded-theme p-[30px] xl:py-[40px] text-start",
        popular ? "bg-primary" : "bg-white"
      )}
    >
      {popular && (
        <span className="text-[12px] font-bold uppercase inline-block leading-none absolute bg-[#FFDA59] rounded-[30px] px-[12px] py-[9px] end-[30px] top-[24px] xl:top-[30px] text-primary">
          Popular
        </span>
      )}
      <p
        className={cn(
          "text-[20px] text-primary font-medium leading-none",
          popular ? "text-white" : "text-primary"
        )}
      >
        {name}
      </p>
      <p className={cn("text-[18px] mt-[18px]", popular && "text-white")}>
        {sub_title}
      </p>
      <h3
        className={cn(
          "text-[40px] md:text-[50px] mt-[24px] leading-none",
          popular && "!text-white"
        )}
      >
        {mainPrice}{" "}
        <span className="text-[18px] text-secondary font-normal">
          /{price_label}
        </span>
      </h3>

      {features && features.length && (
        <div className="mt-[40px]">
          <p
            className={cn(
              "text-[18px] leading-none font-medium mb-[22px]",
              popular ? "text-white" : "text-primary"
            )}
          >
            Advantage:
          </p>
          <ul>
            {features.map((feature, i) => (
              <li
                key={`feature-item-${i}${mainPrice}`}
                className={cn(
                  feature.enable ? "" : "opacity-30",
                  "flex items-center text-[16px] leading-none mt-[15px] first:mt-0",
                  popular && "text-white"
                )}
              >
                <Image
                  width={15}
                  height={16}
                  src={`/assets/imgs/icon/check-${popular ? "5" : "3"}.png`}
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
              variant: popular ? "secondary2" : "outline2",
              size: "full",
            }),
            "mt-[20px]",
            popular && "hover:bg-[#FFDA59] hover:text-primary"
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

export default PricingCard4;
