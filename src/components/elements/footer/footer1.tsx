import Link from "next/link";
import siteConfig from "@/config/siteConfig.json";

// components
import Logo from "../common/logo";
import { socialShare1 } from "@/components/tools/social";

import { FaLinkedin } from "react-icons/fa6";
import { markdownify } from "@/lib/helper/convert";

type Props = {
  footerNav: {
    title: string;
    children?: {
      name: string;
      path: string;
    }[];
  }[];
};

const Footer1 = ({ footerNav }: Props) => {
  const { site_info, footer_info, social } = siteConfig;
  const { copyright } = footer_info;
  const { description, sub_description, main_description } = site_info;
  return (
    <footer className="bg-charcoal">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-[50px] gap-x-[60px] justify-between pt-[58px] pb-[51px] lg:pt-[78px] lg:pb-[71px] 2xl:pt-[128px] 2xl:pb-[121px]">
          <div className="col-span-1 lg:col-span-2">
            <Logo light />
            <div className="mt-[21px] lg:mt-[31px] xl:mt-[31px] 2xl:mt-[41px]">
              <p className="max-w-[400px] lg:max-w-[300px] text-white-2">
                {description}
              </p>
              <p className="max-w-[400px] lg:max-w-[300px] text-white-2">
                {sub_description}
              </p>
              <p
                className="max-w-[400px] lg:max-w-[300px] text-white-2"
                dangerouslySetInnerHTML={markdownify(main_description)}
              />
            </div>
          </div>
          <div className="col-span-1 lg:col-span-3 flex justify-between flex-wrap gap-y-[50px] gap-x-[60px]">
            {footerNav &&
              footerNav.length &&
              footerNav.slice(0, 3).map((nav, i) => (
                <div key={`footer_nav-${i}`}>
                  <h2 className="text-[20px] xl:text-[24px] !text-white !font-normal">
                    {nav.title}
                  </h2>
                  {nav.children && nav.children.length && (
                    <ul className="mt-[24px]">
                      {nav.children.map((child, j) => (
                        <li
                          key={`child_nav-${i}${j}`}
                          className="text-[18px] text-white-2 leading-[30px]"
                        >
                          <Link href={child.path} className="hover:text-white">
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-x-[60px] gap-y-[10px] py-[38px] flex-col md:flex-row items-center md:items-start border-t border-[#ffffff1a]">
          {social && social.length && (
            <ul className="flex gap-[24px]">
              <Link
                href={"https://www.linkedin.com/company/realtalkr/about/"}
                target="_blank"
                // className={cn("relative z-10", className)}
                className="text-white-2 hover:text-white"
              >
                <FaLinkedin />
              </Link>
              {/* {social.map((item, i) => (
                <li key={`social_share-${i}`} className="leading-none">
                  {socialShare1(item, "text-white-2 hover:text-white")}
                </li>
              ))} */}
            </ul>
          )}
          {copyright && copyright.enable && (
            <p className="text-[16px] font-bold text-white-2">
              {copyright.label}{" "}
              <Link href={copyright.link} className="text-white">
                {copyright.company}
              </Link>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer1;
