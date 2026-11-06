import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        primary:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-btn-text-main hover:text-btn-text-hover capitalize transition-all duration-300 bg-btn-bg-main hover:bg-btn-bg-hover rounded-[15px] perspective-1000 overflow-hidden z-[1] gap-[30px]",
        primary1:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-btn-text-main hover:text-btn-text-hover capitalize transition-all duration-300 border-2 border-theme text-theme hover:bg-theme-300 hover:text-theme rounded-[15px] perspective-1000 overflow-hidden z-[1] gap-[30px]",
        primary2:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-btn-text-main hover:text-btn-text-hover capitalize transition-all duration-300 bg-btn-bg-main hover:bg-btn-bg-hover rounded-full perspective-1000 overflow-hidden z-[1] gap-[30px]",
        primary3:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-btn-text-main hover:text-btn-text-hover capitalize transition-all duration-300 bg-btn-bg-main hover:bg-btn-bg-hover border border-border rounded-full perspective-1000 overflow-hidden z-[1] gap-[30px]",
        primary4:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-btn-text-main hover:text-btn-text-hover capitalize transition-all duration-300 bg-btn-bg-main hover:bg-btn-bg-hover border border-transparent hover:border-btn-border rounded-full perspective-1000 overflow-hidden z-[1] gap-[30px]",
        primary5:
          "group px-5 py-[18px] overflow-hidden relative z-[1] bg-transparent text-btn-text-main hover:text-btn-text-hover text-[14px] !font-bold hover:!font-bold uppercase btn_mask",
        primary6:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-btn-text-main hover:text-btn-text-hover capitalize transition-all duration-300 bg-btn-bg-main hover:bg-btn-bg-hover rounded-[4px] perspective-1000 overflow-hidden z-[1] gap-[30px]",
        normal:
          "relative text-[16px] font-medium gap-[5px] text-secondary hover:text-theme",
        normal2:
          "group px-5 py-[18px] overflow-hidden relative border !border-transparent z-[1] bg-transparent text-btn-text-main hover:text-btn-text-hover text-[14px] !font-bold hover:!font-bold uppercase",
        outline:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-primary hover:text-btn-text-hover2 capitalize transition-all duration-300 bg-transparent hover:bg-btn-bg-hover2 border border-border rounded-[15px] perspective-1000 overflow-hidden z-[1] gap-[30px]",
        outline2:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-primary hover:text-btn-text-hover2 capitalize transition-all duration-300 bg-transparent hover:bg-btn-bg-hover2 border border-border rounded-full perspective-1000 overflow-hidden z-[1] gap-[30px]",
        outline3:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-primary hover:text-btn-text-hover2 capitalize transition-all duration-300 bg-transparent hover:bg-btn-bg-hover2 border-2 border-theme rounded-[15px] perspective-1000 overflow-hidden z-[1] gap-[30px]",
        secondary:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-primary capitalize transition-all duration-300 bg-[#F4F6F6] hover:bg-theme hover:text-white rounded-[15px] perspective-1000 overflow-hidden z-[1] gap-[30px]",
        secondary2:
          "group px-5 py-[11px] lg:px-[25px] lg:py-[14px] text-[16px] font-bold leading-none text-primary capitalize transition-all duration-300 bg-[#F4F6F6] hover:bg-theme hover:text-white rounded-full perspective-1000 overflow-hidden z-[1] gap-[30px]",
        link: "group p-1 text-[16px] font-bold leading-none text-primary hover:text-theme capitalize transition-all duration-300 perspective-1000 overflow-hidden z-[1] gap-[30px] before:absolute before:content-[''] before:start-0 before:bottom-0 before:w-full hover:before:w-0 before:h-[1px] before:bg-primary before:duration-500",
      },
      size: {
        default:
          "h-[50px] md:h-[60px] px-[25px] lg:px-[30px] py-[16px] lg:py-[21px]",
        auto: "h-auto",
        sm: "h-10 md:h-[46px] px-4 py-2",
        lg: "h-[50px]",
        xxl: "h-[60px] 2xl:h-[70px] px-[28px] 2xl:px-[40px] py-[21px] 2xl:py-[27px]",
        icon: "h-10 w-10",
        full: "h-[50px] md:h-[60px] w-full",
        calendar: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
