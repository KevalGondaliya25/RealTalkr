"use client";

import { Button } from "@/components/ui/button";
import { useVapiContext } from "@/components/component/Button/VapiButtonContext";
import { cn } from "@/lib/utils";

interface Props {
  firstMsg: string;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "primary"
    | "primary1"
    | "primary2"
    | "primary3"
    | "primary4"
    | "primary5"
    | "primary6"
    | "normal"
    | "normal2"
    | "outline"
    | "outline2"
    | "outline3"
    | "secondary"
    | "secondary2";
}

const VapiButton = ({ className, variant, firstMsg }: Props) => {
  const { vapiCallHandler, vapiBtnText } = useVapiContext();

  return (
    <>
      <Button
        type="submit"
        variant={variant || "primary"}
        size="lg"
        className={cn(
          "bg-theme text-white hover:bg-teal px-4 min-w-[251px]",
          className
        )}
        onClick={vapiCallHandler}
      >
        <span className="btn-span" data-text={vapiBtnText || firstMsg}>
          {vapiBtnText || firstMsg}
        </span>
      </Button>
    </>
  );
};

export default VapiButton;
