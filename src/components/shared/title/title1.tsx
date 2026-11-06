import { markdownify } from "@/lib/helper/convert";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  html?: boolean;
  heading1?: boolean;
};

const Title1 = ({ text, className, html = false, heading1 = false }: Props) => {
  return (
    <>
      {heading1 ? (
        html ? (
          <h1
            className={cn(
              "text-[30px] md:text-[40px] lg:text-[60px] xl:text-[70px] 2xl:text-[90px] [&>img]:inline-block",
              className
            )}
            dangerouslySetInnerHTML={markdownify(text)}
          />
        ) : (
          <h1
            className={cn(
              "text-[30px] md:text-[40px] lg:text-[60px] xl:text-[70px] 2xl:text-[90px]",
              className
            )}
          >
            {text}
          </h1>
        )
      ) : html ? (
        <h2
          className={cn("sec_title1 [&>img]:inline-block", className)}
          dangerouslySetInnerHTML={markdownify(text)}
        />
      ) : (
        <h2 className={cn("sec_title1", className)}>{text}</h2>
      )}
    </>
  );
};

export default Title1;
