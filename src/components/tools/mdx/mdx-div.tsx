import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

const Div = ({ children, className, style }: Props) => {
  return (
    <>
      {children ? (
        <div className={cn(className)} style={style}>
          {children}
        </div>
      ) : (
        <div className={cn(className)} style={style} />
      )}
    </>
  );
};

export default Div;
