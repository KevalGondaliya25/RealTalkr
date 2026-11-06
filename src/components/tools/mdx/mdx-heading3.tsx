import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

const H3 = ({ children, className, style }: Props) => {
  return (
    <h3 className={cn("text-[24px] leading-tight", className)} style={style}>
      {children}
    </h3>
  );
};

export default H3;
