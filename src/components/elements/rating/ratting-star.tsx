import { Star, StarHalf } from "lucide-react";

type Props = {
  number: number;
  starBgColor?: string;
  starColor?: string;
};

const RattingStar = ({
  number,
  starBgColor = "#C8CDD2",
  starColor = "#FFB443",
}: Props) => {
  return (
    <div className="relative">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>
            <Star size={18} fill={starBgColor} strokeWidth={0} />
          </span>
        ))}
      </div>
      <div className="flex items-center absolute top-0">
        {Array.from({ length: Math.ceil(number) }).map((_, index) => (
          <span key={index}>
            {index + 1 <= number ? (
              <Star size={18} fill={starColor} strokeWidth={0} />
            ) : (
              <StarHalf size={18} fill={starColor} strokeWidth={0} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RattingStar;
