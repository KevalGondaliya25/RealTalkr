import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

const P = ({ children, className, style }: Props) => {
  return (
    <p className={cn(className)} style={style}>
      {children}
    </p>
  );
};

export default P;
