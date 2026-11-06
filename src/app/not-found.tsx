"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import navigation from "@/config/navigation.json";

// shadcn components
import { Button } from "@/components/ui/button";

// Components
import Footer1 from "@/components/elements/footer/footer1";
import Header1 from "@/components/elements/header/header1";

export default function NotFound() {
  const router = useRouter();

  return (
    <main>
      <Header1 headerNav={navigation.header} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="absolute w-full h-[1100px] top-0 start-0 -z-[1] bg-gradient-180 from-[#FBF7F4] to-[#fbf7f400]" />
          <div className="pt-[150px] md:pt-[230px] sec_space_bottom1">
            <div className="container">
              <div className="relative">
                <div className="absolute bottom-[52px] end-[calc(100%+130px)] w-max">
                  <Image
                    width={60}
                    height={60}
                    src="/assets/imgs/shape/shape-s-59.png"
                    className="rtl_y"
                    alt="shape image"
                  />
                </div>
                <div className=" absolute top-[272px] start-[calc(100%-60px)] 2xl:start-[calc(100%-150px)] w-max z-[1] sm:block [@media(max-width:425px)]:hidden">
                  <Image
                    width={96}
                    height={96}
                    src="/assets/imgs/shape/shape-s-28.png"
                    className="rtl_y"
                    alt="shape image"
                  />
                </div>
                <div className="max-w-[1070px] mx-auto relative p-[80px] border border-border-2 rounded-[40px] ">
                  <h1 className="absolute inline-block text-[18px] top-0 start-[70px] px-[9px] bg-[#FCF9F7] -translate-y-[50%]">
                    Error page
                  </h1>
                  <div>
                    <Image
                      width={550}
                      height={305}
                      style={{ height: "auto" }}
                      src="/assets/imgs/error/error-404.png"
                      className="mx-auto"
                      alt="error image"
                    />
                  </div>
                </div>
                <div className="text-center mt-[61px]">
                  <h2 className="text-[36px] text-primary font-colasta font-bold leading-none">
                    We’ve lost this page
                  </h2>
                  <p className="mt-[28px] text-[21px] leading-[1.4]">
                    Sorry, the page you are looking for doesn’t exist or has
                    been moved.
                  </p>
                  <Button
                    variant="primary"
                    className="mt-[35px]"
                    onClick={() => router.back()}
                  >
                    Back to home
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Footer1 footerNav={navigation.footer1} />
        </div>
      </div>
    </main>
  );
}
