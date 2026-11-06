"use client";

import { useEffect, useState } from "react";

// lib
import { cn } from "@/lib/utils";

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

type Props = {
  headerNav: MenuDataType;
};

const Header2 = ({ headerNav }: Props) => {
  const [scroll, setScroll] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpen2, setIsOpen2] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);
  }, []);

  const closeDialog = () => {
    setIsOpen(!isOpen);
  };

  const closeDialog2 = () => {
    setIsOpen2(!isOpen2);
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
          scroll ? "fixed backdrop-blur-md bg-[#ffffff61]" : "absolute",
          "top-0 left-0 w-full z-[99]"
        )}
      >
        <div className="container">
          <div className="grid grid-cols-9 xl:grid-cols-4 gap-1 xl:gap-5 relative h-[90px] items-center">
            <div className="col-span-4 xl:col-span-1">
              <Logo />
            </div>
            <div className="col-span-2 hidden xl:flex justify-center">
              <Menu1 headerNav={headerNav} />
            </div>
            <div className="col-span-5 xl:col-span-1 flex justify-end gap-5">
              <Button
                variant="primary2"
                size="sm"
                onClick={() => setIsOpen(true)}
              >
                <span className="btn-span" data-text="Sign up">
                  Sign up
                </span>
              </Button>
              <div className="flex justify-end xl:hidden">
                <Offcanvas1 headerNav={headerNav} />
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <Signup isOpen={isOpen} close={closeDialog} open={closeDialog2} /> */}
      <Signin
        isOpen={isOpen2}
        close={closeDialog2}
        open={closeDialog}
        forgot={() => {}}
      />
    </>
  );
};

export default Header2;
