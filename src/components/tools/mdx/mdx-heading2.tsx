import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

const H2 = ({ children, className, style }: Props) => {
  return (
    <h2
      className={cn("text-[30px] md:text-[36px] mb-[25px]", className)}
      style={style}
    >
      {children}
    </h2>
  );
};

export default H2;
