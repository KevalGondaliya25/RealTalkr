import { CSSProperties } from "react";
import Link from "next/link";

// lib
import { cn } from "@/lib/utils";

// types
import { ActionBtnType } from "@/types";

// shadcn components
import { buttonVariants } from "@/components/ui/button";

type Props = {
  price: {
    name: string;
    price: string;
    price_label: string;
    details: string;
    action_btn: ActionBtnType;
  };
  btnVariant?: "primary" | "primary2";
  btnClassName?: string;
  className?: string;
  style?: CSSProperties;
};

const PricingCard8 = ({
  price,
  btnVariant = "primary",
  btnClassName,
  className,
  style,
}: Props) => {
  const { name, price: mainPrice, price_label, details, action_btn } = price;
  return (
    <div
      className={cn(
        "border border-border rounded-theme max-w-[410px] p-[30px] 2xl:p-[50px]",
        className
      )}
      style={style}
    >
      <h3 className="text-[18px] !font-medium text-primary leading-none underline underline-offset-[10px]">
        {name}
      </h3>
      <h3 className="text-[30px] xl:text-[40px] mt-[29px] 2xl:mt-[70px] leading-none flex items-center gap-[10px]">
        {mainPrice}{" "}
        <span className="text-[16px] text-secondary font-medium">
          ({price_label})
        </span>
      </h3>
      <p className="pt-[10px] lg:pt-[25px] pb-[30px] lg:pb-[60px]">{details}</p>
      {action_btn && action_btn.enable && (
        <Link
          href={action_btn.link}
          className={cn(
            buttonVariants({ variant: btnVariant, size: "full" }),
            btnClassName
          )}
        >
          {action_btn.label}
        </Link>
      )}
    </div>
  );
};

export default PricingCard8;
