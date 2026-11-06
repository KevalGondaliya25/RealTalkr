import { Loader } from "lucide-react";

interface Props {
  size?: string;
}

const Loading = ({ size }: Props) => {
  return <Loader size={size} className="animate-[spin_2s_linear_infinite]" />;
};

export default Loading;
