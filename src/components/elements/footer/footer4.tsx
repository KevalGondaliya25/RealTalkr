import Link from "next/link";
import siteConfig from "@/config/siteConfig.json";

// components
import { socialShare1 } from "@/components/tools/social";

type Props = {
  footerNav: {
    title: string;
    children?: {
      name: string;
      path: string;
    }[];
  }[];
};

const Footer4 = ({ footerNav }: Props) => {
  const { social, footer_info } = siteConfig;
  const { copyright } = footer_info;
  return (
    <footer className="bg-[#05111A]">
      <div className="container border-t border-border">
        <div className="flex flex-wrap justify-between gap-[50px] xl:gap-x-[60px] xl:gap-y-[50px] pt-[59px] md:pt-[79px] pb-[50px] md:pb-[70px] overflow-hidden">
          {footerNav &&
            footerNav.length &&
            footerNav.slice(0, 3).map((nav, i) => (
              <div key={`footer_nav-${i}`} className="max-w-[130px]">
                <p className="text-[16px] !text-white !font-bold uppercase !leading-none">
                  {nav.title}
                </p>
                {nav.children && nav.children.length && (
                  <ul className="mt-[27px]">
                    {nav.children.map((child, j) => (
                      <li
                        key={`child_nav-${i}${j}`}
                        className="text-[14px] text-white-2 leading-[30px] font-bold uppercase"
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
          <div className="min-w-[378px] 2xl:min-w-[434px] relative ps-0 lg:ps-[50px] xl:ps-[100px] before:hidden before:lg:block before:absolute before:content-[''] before:w-[1px] before:h-[calc(100%+300px)] before:-top-[150px] before:start-0 before:bg-border">
            <p className="max-w-[330px] text-white-2">
              Real talkr is a real early-stage software looking for an analytics
              platform that scales with you, check out our stage program.
            </p>
            {social && social.length && (
              <ul className="flex gap-[7px] mt-[45px]">
                {social.map((item, i) => (
                  <li
                    key={`social_share-${i}`}
                    className="group leading-none flex justify-center items-center w-[36px] h-[36px] border border-border rounded-[10px] hover:bg-white hover:border-transparent"
                  >
                    {socialShare1(
                      item,
                      "text-white-2 group-hover:text-[#051119]"
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {copyright && copyright.enable && (
          <div className="flex justify-center py-[25px] border-t border-border">
            <p className="text-[16px] font-bold text-white-2">
              {copyright.label}{" "}
              <Link href={copyright.link} className="text-white">
                {copyright.company}
              </Link>
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer4;
