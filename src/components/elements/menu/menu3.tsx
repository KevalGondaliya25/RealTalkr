"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// lib
import { cn } from "@/lib/utils";

// types
import { MenuDataType } from "@/types";

// shadcn components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

type Props = {
  headerNav: MenuDataType;
};

const Menu3 = ({ headerNav }: Props) => {
  const pathname = usePathname();

  if (!(headerNav && headerNav.length)) {
    return;
  }

  function onNavChange() {
    setTimeout(() => {
      const triggers = document.querySelectorAll(
        '.submenu-trigger[data-state="open"]'
      );
      if (triggers.length === 0) return;

      const firstTrigger = triggers[0] as HTMLElement;
      const viewports = document.getElementsByClassName("submenu-viewport");

      if (viewports.length > 0) {
        const viewport = viewports[0] as HTMLElement;
        viewport.style.left = `${firstTrigger.offsetLeft}px`;
      }
    });
  }
  return (
    <NavigationMenu onValueChange={onNavChange}>
      <NavigationMenuList className="flex-wrap gap-[10px]">
        {headerNav.map((menu, i) => (
          <NavigationMenuItem key={`menu_item-${i}`} className="">
            {menu.hasChildren ? (
              <>
                <NavigationMenuTrigger className="submenu-trigger hover:text-primary flex items-center font-bold text-[14px] leading-none text-secondary uppercase border border-border hover:border-primary px-[15px] py-[12px] rounded-full">
                  {menu.name}
                </NavigationMenuTrigger>
                {menu.children && menu.children.length && (
                  <NavigationMenuContent>
                    <NavigationMenuList className="bg-primary block py-[18px] w-[250px]">
                      {menu.children.map((childMenu, j) => (
                        <NavigationMenuItem key={`child_menu-${i}${j}`}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={childMenu.path}
                              className={cn(
                                "hover:text-[#FFDA59] flex items-center font-medium text-[16px] leading-none text-white px-[25px] py-[10px] capitalize",
                                pathname &&
                                  (pathname === childMenu.path + "/" ||
                                    pathname === childMenu.path)
                                  ? "text-[#FFDA59]"
                                  : ""
                              )}
                            >
                              {childMenu.name}
                            </Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenuContent>
                )}
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  href={menu.path}
                  className={cn(
                    "hover:text-primary flex items-center font-bold text-[14px] leading-none text-secondary  uppercase border border-border hover:border-primary px-[15px] py-[12px] rounded-full",
                    pathname &&
                      (pathname === menu.path + "/" || pathname === menu.path)
                      ? "text-primary"
                      : ""
                  )}
                >
                  {menu.name}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Menu3;
