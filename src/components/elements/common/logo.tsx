"use client";

import Link from "next/link";
import Image from "next/image";
import siteConfig from "@/config/siteConfig.json";

type SiteInfo = {
  logo: string;
  logo_light?: string;
  logo_width: number;
  logo_height: number;
  logo_text?: string;
  title?: string;
};

type Props = {
  url?: string;
  className?: string;
  light?: true | false;
  customWidth?: number;
  customHeight?: number;
  href?: string;
};

export default function Logo({
  url,
  light = false,
  className,
  customWidth,
  customHeight,
  href = "/",
}: Props) {
  const {
    logo,
    logo_light,
    logo_width,
    logo_height,
    logo_text = "Logo",
    title = "Logo",
  } = siteConfig.site_info as SiteInfo;

  const path = url ? url : light ? logo_light || logo : logo;

  return (
    <>
      <Link href={href}>
        {path ? (
          <Image
            width={customWidth || logo_width * 2}
            height={customHeight || logo_height * 2}
            src={path}
            alt={title}
            priority
            style={{
              height: customHeight || logo_height + "px",
              width: customWidth || logo_width + "px",
            }}
            className={className}
          />
        ) : logo_text ? (
          logo_text
        ) : (
          title
        )}
      </Link>
    </>
  );
}
