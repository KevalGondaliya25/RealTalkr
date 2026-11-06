"use client";

import { useRef } from "react";
import Image from "next/image";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// lib
import { markdownify } from "@/lib/helper/convert";

// components
import Newsletter5 from "../newsletter/newsletter5";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import VapiButton from "@/components/component/Button/vapiButton";

type Props = {
  hero: {
    data: {
      title: string;
      sub_title: string;
      details: string;
      requirement: string[];
      feature: {
        enable: boolean;
        image: string;
        title: string;
        shape: string;
        items: {
          name: string;
          details: string;
        }[];
      };
      profile: string[];
      social: string[];
    };
  };
};

const MarketingHero = ({ hero }: Props) => {
  const { title, sub_title, details, requirement, feature, profile, social } =
    hero.data;

  const containerRef = useRef<HTMLDivElement>(null!);
  const route = useRouter();

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef}>
      <div
        className="bg-btn-bg-hover relative overflow-hidden z-[2] mb-[15px] pt-[110px] md:pt-[130px] lg:pt-[125px] xl:pt-[130px] 2xl:pt-[235px] pb-20 
      "
      >
        <Image
          width={578}
          height={678}
          src="/assets/imgs/hero/marketing/bg-shape.png"
          className="hidden lg:block absolute top-0 start-0 rotate-180 -z-[2] rtl_y"
          alt="background shape"
        />
        <Image
          width={578}
          height={678}
          src="/assets/imgs/hero/marketing/bg-shape.png"
          className="hidden lg:block absolute end-0 top-[300px] -z-[2] rtl_y"
          alt="background shape"
        />
        {social[0] && (
          <div className="shape-design absolute !hidden lg:!flex start-[262px] lg:start-[50px] xl:start-[120px] 2xl:start-[284px] top-[360px] md:top-[240px] xl:top-[340px] 2xl:top-[236px]  wc-y-anim">
            <Image width={34} height={34} src={social[0]} alt="shape" />
          </div>
        )}

        {social[1] && (
          <div className="shape-design absolute !hidden lg:!flex start-[155px] lg:start-[310px] xl:start-[184px] 2xl:start-[362px] top-[115px] md:top-[560px] xl:top-[530px] 2xl:top-[444px] wc-y-anim">
            <Image width={34} height={34} src={social[1]} alt="shape" />
          </div>
        )}

        {social[2] && (
          <div className="shape-design absolute !hidden lg:!flex end-[8px] lg:end-[40px] xl:end-[120px] top-[309px] 2xl:top-[409px]  wc-y-anim">
            <Image width={34} height={34} src={social[2]} alt="shape" />
          </div>
        )}

        {social[3] && (
          <div className="shape-design absolute !hidden lg:!flex end-[209px] top-[533px] wc-y-anim">
            <Image width={34} height={34} src={social[3]} alt="shape" />
          </div>
        )}

        {/* {profile[0] && (
          <Image
            width={60}
            height={60}
            src={profile[0]}
            className="hidden lg:block absolute start-[20px] lg:start-[64px] xl:start-[120px] top-[250px] lg:top-[429px] wc-y-anim"
            alt="shape"
          />
        )}
        {profile[1] && (
          <Image
            width={60}
            height={60}
            src={profile[1]}
            className="hidden lg:block absolute start-[205px] top-[635px]"
            alt="shape"
          />
        )}
        {profile[2] && (
          <Image
            width={60}
            height={60}
            src={profile[2]}
            className="hidden lg:block absolute end-[50px] lg:end-[90px] xl:end-[137px] 2xl:end-[337px] top-[139px] lg:top-[206px] xl:top-[150px] 2xl:top-[256px] wc-y-anim"
            alt="shape"
          />
        )}
        {profile[3] && (
          <Image
            width={60}
            height={60}
            src={profile[3]}
            className="hidden lg:block absolute end-[165px] lg:end-[290px] xl:end-[202px] 2xl:end-[402px] top-[352px] lg:top-[490px] xl:top-[464px]"
            alt="shape"
          />
        )} */}
        {/* <Image
          width={851}
          height={1169}
          src="/assets/imgs/shape/shape-r-30.png"
          className="hidden lg:block absolute start-0 top-0 -z-[2] rtl_y"
          alt="shape"
        />
        <Image
          width={1089}
          height={1146}
          src="/assets/imgs/shape/shape-r-31.png"
          className="hidden lg:block absolute end-0 top-0 -z-[2] rtl_y"
          alt="shape"
        /> */}

        <div className="container text-center">
          <div className="pb-[15px] 2xl:pb-[33px]">
            <span className="text-[17px] md:text-[20px] font-medium has_fade_anim">
              {sub_title}
            </span>
          </div>
          <h1
            className="text-[40px] md:text-[55px] lg:text-[65px] xl:text-[90px] pb-5 xl:pb-[46px] has_fade_anim [&>span]:bg-transparent [&>span]:bg-[url('/assets/imgs/shape/shape-r-76.png')] [&>span]:bg-no-repeat [&>span]:md:inline [&>span]:md:pb-0 [&>span]:pb-2.5  [&>span]:bg-right-bottom [&>br]:hidden [&>br]:md:block"
            data-delay="0.25"
            dangerouslySetInnerHTML={markdownify(title)}
          />

          <p className="text-[22px] mb-[47px] has_fade_anim" data-delay="0.35">
            {details}
          </p>
          {/* <Newsletter5 /> */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 pb-4">
            <Button
              type="submit"
              variant="primary1"
              size="lg"
              onClick={() => route.push("/contact")}
              className="border-2 border-charcoal text-charcoal hover:text-charcoal hover:bg-charcoal-300"
            >
              <span className="btn-span" data-text="Book your demo">
                Book your demo
              </span>
            </Button>
            <VapiButton
              firstMsg={"Talk To Our Ai Agent"}
              className="border-2 border-theme bg-theme text-white hover:text-theme hover:bg-theme-300"
              variant="primary1"
            />

            {/* className={"hover:bg-white hover:text-charcoal"} */}
          </div>
          {/* {requirement && requirement.length && (
            <ul
              className="max-w-[690px] mx-auto has_fade_anim"
              data-delay="0.55"
            >
              {requirement.map((item, i) => (
                <li
                  key={`requirement_item-${i}`}
                  className="flex justify-center items-center gap-[7px] text-[18px]"
                >
                  <Image
                    width={15}
                    height={16}
                    src="/assets/imgs/icon/check-5.png"
                    className="h-[16px] rtl_y"
                    alt="icon image"
                  />{" "}
                  {item}
                </li>
              ))}
            </ul>
          )} */}

          {/* <div className="flex justify-center items-center pt-10">
            <div className="shape-design wc-y-anim !p-10">
              <Image
                width={34}
                height={34}
                src={"/assets/imgs/hero/marketing/play.svg"}
                alt="shape"
              />
            </div>
          </div> */}
        </div>
      </div>
      {feature && feature.enable && (
        <></>
        // <div
        //   className="-mt-[190px] md:-mt-[320px] relative z-[2] has_fade_anim"
        //   data-delay="0.65"
        //   data-on-scroll="0"
        // >
        //   <div className="container">
        //     <div className="bg-white p-[20px] rounded-[40px]">
        //       <div className="bg-[#F5F6FA] rounded-[30px] p-[28px] grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-x-[10px]">
        //         <div className="hidden xl:block bg-white rounded-[30px] p-[28px]">
        //           <div className="max-w-[103px] ms-auto pb-[24px]">
        //             {feature.shape && (
        //               <Image
        //                 width={103}
        //                 height={76}
        //                 src={feature.shape}
        //                 className="rtl_y"
        //                 alt="shape image"
        //               />
        //             )}
        //           </div>
        //           <h2 className="text-[28px] font-bold max-w-[171px] pb-[32px]">
        //             {feature.title}
        //           </h2>
        //           {feature.items && feature.items.length && (
        //             <div className="relative before:content-[' '] before:w-full before:h-full before:absolute before:start-[7px] before:top-[50px] before:bg-[url('/assets/imgs/shape/img-r-94.png')] before:bg-no-repeat before:rtl_y">
        //               {feature.items.map((item, i) => (
        //                 <div
        //                   key={`feature_item-${i}`}
        //                   className="pb-[24px] flex gap-[15px]"
        //                 >
        //                   <div>
        //                     <span className="text-[14px] w-[30px] h-[30px] rounded-full bg-[#FFEEC1] text-primary inline-flex justify-center items-center">
        //                       {i + 1 > 9 ? i + 1 : `0${i + 1}`}
        //                     </span>
        //                   </div>
        //                   <div>
        //                     <h3 className="text-[18px] pb-[9px] max-w-[106px]">
        //                       {item.name}
        //                     </h3>
        //                     <p className="text-[#07203261] max-w-[200px]">
        //                       {item.details}
        //                     </p>
        //                   </div>
        //                 </div>
        //               ))}
        //             </div>
        //           )}
        //         </div>
        //         <div className="flex justify-center items-center">
        //           <div className="shape-design !bg-theme-800 lg:!flex end-[8px] lg:end-[40px] xl:end-[120px] top-[309px] 2xl:top-[409px]">
        //             <Image width={34} height={34} src={social[3]} alt="shape" />
        //           </div>
        //           <div></div>
        //           {/* {feature.image && (
        //             <Image
        //               width={851}
        //               height={543}
        //               src={feature.image}
        //               className="rounded-[30px] h-full"
        //               alt="gif"
        //             />
        //           )} */}
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
      )}
    </section>
  );
};

export default MarketingHero;
