"use client";

import { useEffect, useState } from "react";

// lib
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// types
import { MenuDataType } from "@/types";

// shadcn components
import { Button } from "@/components/ui/button";

// components
import Logo from "../common/logo";
import Menu1 from "../menu/menu1";
import Offcanvas1 from "../offcanvas/offcanvas1";
import Signin from "../signin";
import Signup from "../signup";
import { selectCurrentUser } from "@/redux/slice/user";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { DASHBOARD_PAGE } from "@/utils/constant";
import Forgot from "../forgot";
import Terms from "../terms";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

type Props = {
  headerNav: MenuDataType;
  signUpBtnClassName?: string;
  className?: string;
  loginBtnClassName?: string;
  children?: React.ReactNode;
};

const signUpFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be minimum 8 character" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be minimum 8 character" }),
    agree: z.boolean().default(false),
    next: z.boolean().default(false),
  })
  .refine(
    (data) => {
      return data.password === data.confirm_password;
    },
    {
      message: "Password and confirm password must be sam.",
      path: ["confirm_password"],
    }
  )
  .refine(
    (data) => {
      if (data.next) {
        return data.agree === true;
      }
      return true;
    },
    {
      // message: "You must agree to continue.",
      message: "",
      path: ["agree"],
    }
  );

export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;

const Header12 = ({
  headerNav,
  signUpBtnClassName,
  loginBtnClassName,
  className,
  children,
}: Props) => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);

  const [scroll, setScroll] = useState<boolean>(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);

  const signUpForm = useForm<SignUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirm_password: "",
      agree: false,
    },
  });

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);
  }, []);

  const closeSignUpDialog = () => {
    setIsSignUpOpen(!isSignUpOpen);
  };

  const closeSignInDialog = () => {
    setIsSignInOpen(!isSignInOpen);
  };

  const closeForgotDialog = () => {
    setIsForgotOpen(!isForgotOpen);
  };
  const closeTermsDialog = () => {
    setIsTermsOpen(!isTermsOpen);
  };

  const scrollHeader = () => {
    if (window.scrollY >= 20) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          // scroll ? "fixed backdrop-blur-md " : "absolute",
          className,
          "top-0 left-0 w-full z-[99] bg-btn-bg-hover fixed"
        )}
      >
        {children}
        <div className="container 2xl:max-w-[1750px]">
          <div className="flex justify-between gap-[50px] lg:gap-[100px] relative h-[100px] items-center">
            <div>
              <Logo light={false} />
            </div>
            <div className="flex-1">
              <div className="hidden xl:flex justify-center items-center">
                <Menu1
                  headerNav={headerNav}
                  navItemClassName="hover:text-theme text-charcoal"
                  dropdownClassName="hover:text-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-[10px]">
              {Boolean(user && Object.keys(user).length > 0) ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(DASHBOARD_PAGE)}
                  className={cn(
                    "hidden md:block bg-theme hover:bg-teal hover:text-charcoal",
                    signUpBtnClassName
                  )}
                >
                  <span className="" data-text="Dashboard">
                    Dashboard
                  </span>
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary1"
                    size="sm"
                    onClick={() => setIsSignInOpen(true)}
                    className={cn("", loginBtnClassName)}
                  >
                    <span className="" data-text="Login">
                      Login
                    </span>
                  </Button>
                  <Button
                    variant="primary1"
                    size="sm"
                    onClick={() => setIsSignUpOpen(true)}
                    className={cn(
                      "border-2 border-charcoal text-charcoal hover:text-charcoal hover:bg-charcoal-300 sm:block hidden",
                      signUpBtnClassName
                    )}
                  >
                    <span className="" data-text="Sign up">
                      Sign up
                    </span>
                  </Button>
                </>
              )}
              <div className="flex justify-end xl:hidden">
                <Offcanvas1
                  headerNav={headerNav}
                  actionBtnClassName="text-charcoal"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <Signup
        isOpen={isSignUpOpen}
        close={closeSignUpDialog}
        open={closeSignInDialog}
        next={closeTermsDialog}
        form={signUpForm}
      />
      <Terms
        isOpen={isTermsOpen}
        close={closeTermsDialog}
        open={closeSignUpDialog}
        form={signUpForm}
      />
      <Signin
        isOpen={isSignInOpen}
        close={closeSignInDialog}
        open={closeSignUpDialog}
        forgot={closeForgotDialog}
      />
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      >
        <Forgot
          isOpen={isForgotOpen}
          close={closeForgotDialog}
          open={closeSignInDialog}
        />
      </GoogleReCaptchaProvider>
    </>
  );
};

export default Header12;
