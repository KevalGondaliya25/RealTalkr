import Link from "next/link";
import siteConfig from "@/config/siteConfig.json";

// lib
import { cn } from "@/lib/utils";

// components
import Logo from "../common/logo";
import { socialShare1 } from "@/components/tools/social";
import Newsletter2 from "../newsletter/newsletter2";

type Props = {
  footerNav: {
    title: string;
    children?: {
      name: string;
      path: string;
    }[];
  }[];
  largeContainer?: boolean;
  className?: string;
};

const Footer2 = ({ footerNav, largeContainer = false, className }: Props) => {
  const { site_info, footer_info, social } = siteConfig;
  const { copyright } = footer_info;
  const { description } = site_info;
  return (
    <footer className={cn(className)}>
      <div className={cn("container", largeContainer && "2xl:max-w-[1630px]")}>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-y-[50px] gap-x-[60px] justify-between pt-[58px] pb-[51px] lg:pt-[78px] lg:pb-[71px] 2xl:pt-[128px] 2xl:pb-[121px]">
          <div className="col-span-1 lg:col-span-2">
            <Logo />
            <div className="mt-[21px] lg:mt-[31px] xl:mt-[31px] 2xl:mt-[41px]">
              <p className="max-w-[400px] lg:max-w-[300px]">{description}</p>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-3 grid grid-cols-2 gap-y-[50px] gap-x-[60px]">
            {footerNav &&
              footerNav.length &&
              footerNav.slice(0, 2).map((nav, i) => (
                <div key={`footer_nav-${i}`}>
                  <h2 className="text-[20px] xl:text-[24px]">{nav.title}</h2>
                  {nav.children && nav.children.length && (
                    <ul className="mt-[24px]">
                      {nav.children.map((child, j) => (
                        <li
                          key={`child_nav-${i}${j}`}
                          className="text-[18px] leading-[30px]"
                        >
                          <Link
                            href={child.path}
                            className="hover:text-primary hover:tracking-[0.4px] transition-all duration-300"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
          <div className="col-span-1 lg:col-span-2">
            <Newsletter2 />
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-x-[60px] gap-y-[10px] py-[38px] flex-col md:flex-row items-center md:items-start border-t border-[#07203214]">
          <div>
            {social && social.length && (
              <ul className="flex gap-[24px]">
                {social.map((item, i) => (
                  <li key={`social_share-${i}`} className="leading-none">
                    {socialShare1(item, " hover:text-primary")}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            {copyright && copyright.enable && (
              <p className="text-[16px]">
                {copyright.label}{" "}
                <Link
                  href={copyright.link}
                  className="text-primary font-semibold"
                >
                  {copyright.company}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer2;
