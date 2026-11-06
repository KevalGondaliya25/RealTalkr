import Link from "next/link";

// icons
import {
  FaDribbble,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";

// lib
import { cn } from "@/lib/utils";

type SocialType = {
  name: string;
  link: string;
  value?: string;
};

export const socialShare1 = (item: SocialType, className: string) => {
  switch (item.name) {
    case "Fb":
      return (
        <Link
          href={item.link}
          target="_blank"
          key={item.link}
          className={cn("relative z-10", className)}
        >
          <FaFacebookF />
        </Link>
      );
    case "Tw":
      return (
        <Link
          href={item.link}
          target="_blank"
          key={item.link}
          className={cn("relative z-10", className)}
        >
          <FaTwitter />
        </Link>
      );
    case "In":
      return (
        <Link
          href={item.link}
          target="_blank"
          key={item.link}
          className={cn("relative z-10", className)}
        >
          <FaInstagram />
        </Link>
      );
    case "Db":
      return (
        <Link
          href={item.link}
          target="_blank"
          key={item.link}
          className={cn("relative z-10", className)}
        >
          <FaDribbble />
        </Link>
      );
    case "Li":
      return (
        <Link
          href={item.link}
          target="_blank"
          key={item.link}
          className={cn("relative z-10", className)}
        >
          <FaLinkedin />
        </Link>
      );
  }
};
