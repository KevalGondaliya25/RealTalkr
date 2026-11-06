import { Star } from "lucide-react";

type Props = {
  number: number;
  starBgColor?: string;
  starColor?: string;
  strokeWidth?: number;
  starSize?: number;
};

const RattingStar2 = ({
  number,
  starBgColor = "white",
  starColor = "#FFB443",
  strokeWidth = 2,
  starSize = 16,
}: Props) => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>
          <Star
            size={starSize}
            color={starColor}
            fill={index + 1 <= number ? starColor : starBgColor}
            strokeWidth={strokeWidth}
          />
        </span>
      ))}
    </>
  );
};

export default RattingStar2;
