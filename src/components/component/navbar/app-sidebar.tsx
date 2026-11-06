"use client";

import React, { useEffect, useState } from "react";
import {
  Bot,
  ChartSpline,
  Headset,
  Logs,
  UsersRound,
  Library,
  Phone,
  LogsIcon,
  Brain,
} from "lucide-react";

import { NavMain } from "@/components/component/navbar/nav-main";
import { NavUser } from "@/components/component/navbar/nav-user";
import { CampaignSwitcher } from "@/components/component/navbar/campaign-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { selectCurrentUser, selectCurrentUserId } from "@/redux/slice/user";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { USER_TYPE } from "@/utils/constant";
import { NavBarType } from "@/types/app-sidebar";
import _ from "lodash";
import Logo from "@/components/elements/common/logo";
import { UserSwitcher } from "@/components/component/navbar/user-switcher";

// This is sample data.

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  signOutLoading: boolean;
  handleSignOut: () => void;
}

export function AppSidebar({
  signOutLoading,
  handleSignOut,
  ...props
}: AppSidebarProps) {
  const pathName = usePathname();
  const userId = useSelector(selectCurrentUserId);

  const [navbar, setNavbar] = useState<Array<NavBarType>>([
    {
      id: 2,
      title: "Leads & Scheduling",
      url: "/lead",
      icon: Headset,
      isActive: pathName.startsWith("/lead"),
    },
    {
      id: 3,
      title: "Assistant",
      url: "/assistant",
      icon: Bot,
      isActive: pathName.startsWith("/assistant"),
    },
    {
      id: 4,
      title: "Call Logs",
      url: "/call-logs",
      icon: Logs,
      isActive: pathName.startsWith("/call-logs"),
    },
    {
      id: 1,
      title: "Dashboard",
      url: "/dashboard",
      icon: ChartSpline,
      isActive: pathName.startsWith("/dashboard"),
    },
    // {
    //   id: 7,
    //   title: "Phone Number",
    //   url: "/phone-number",
    //   icon: Phone,
    //   isActive: pathName.startsWith("/phone-number"),
    // },
    // {
    //   id: 6,
    //   title: "AI Agents",
    //   url: "/agent",
    //   icon: Bot,
    //   isActive: pathName.startsWith("/agent"),
    // },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   // items: [
    //   //   {
    //   //     title: "Genesis",
    //   //     url: "#",
    //   //   },
    //   //   {
    //   //     title: "Explorer",
    //   //     url: "#",
    //   //   },
    //   //   {
    //   //     title: "Quantum",
    //   //     url: "#",
    //   //   },
    //   // ],
    // },
  ]);

  // const navbar = {
  //   navMain: [
  //     {
  //       title: "Agent",
  //       url: "/dashboard",
  //       icon: Headset,
  //       isActive: pathName.startsWith("/dashboard"),
  //     },
  //     {
  //       title: "User",
  //       url: "/user",
  //       icon: UsersRound,
  //       isActive: pathName.startsWith("/user"),
  //     },
  //     // {
  //     //   title: "Models",
  //     //   url: "#",
  //     //   icon: Bot,
  //     //   // items: [
  //     //   //   {
  //     //   //     title: "Genesis",
  //     //   //     url: "#",
  //     //   //   },
  //     //   //   {
  //     //   //     title: "Explorer",
  //     //   //     url: "#",
  //     //   //   },
  //     //   //   {
  //     //   //     title: "Quantum",
  //     //   //     url: "#",
  //     //   //   },
  //     //   // ],
  //     // },
  //   ],
  //   // projects: [
  //   //     {
  //   //         name: "Design Engineering",
  //   //         url: "#",
  //   //         icon: Frame,
  //   //     },
  //   //     {
  //   //         name: "Sales & Marketing",
  //   //         url: "#",
  //   //         icon: PieChart,
  //   //     },
  //   //     {
  //   //         name: "Travel",
  //   //         url: "#",
  //   //         icon: Map,
  //   //     },
  //   // ],
  // };
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      if (user.role === USER_TYPE.ADMIN) {
        setNavbar((pre) =>
          _.unionBy(
            [
              ...pre,
              {
                id: 5,
                title: "User",
                url: "/user",
                icon: UsersRound,
                isActive: pathName.startsWith("/user"),
              },
              {
                id: 6,
                title: "Models",
                url: "/models",
                icon: Brain,
                isActive: pathName.startsWith("/models"),
              },
              {
                id: 7,
                title: "Terms & Conditions",
                url: "/terms",
                icon: Library,
                isActive: pathName.startsWith("/terms"),
              },
              {
                id: 7,
                title: "Error Logs",
                url: "/fail-lead",
                icon: LogsIcon,
                isActive: pathName.startsWith("/fail-lead"),
              },
            ],
            "id"
          )
        );
      }
    }
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo light={false} href={"/dashboard"} />
        {Boolean(user && user.role === USER_TYPE.ADMIN) ? (
          <>
            <UserSwitcher />
            {userId && <CampaignSwitcher />}
          </>
        ) : (
          Boolean(user && user.role === USER_TYPE.AGENT) && <CampaignSwitcher />
        )}
      </SidebarHeader>
      <SidebarContent className="text-charcoal text-[18px]">
        <NavMain items={navbar.sort((a, b) => a.id - b.id)} />
        {/* <NavProjects projects={navbar.projects} /> */}
      </SidebarContent>
      <SidebarFooter className="text-charcoal">
        {user && (
          <NavUser
            user={{
              name: user?.name,
              email: user?.email,
              role: user?.role,
              avatar: user?.profileImg || "/assets/images/user/user.png",
            }}
            signOutLoading={signOutLoading}
            handleSignOut={handleSignOut}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
