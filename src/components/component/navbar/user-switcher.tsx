"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, UsersRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  selectCurrentUserId,
  selectCurrentUser,
  setUserId,
} from "@/redux/slice/user";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import { UserType } from "@/types/user";
import { TablePagination } from "@/types";
import { useGetUsersQuery } from "@/redux/query/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import _ from "lodash";
import { Input } from "@/components/ui/input";

export function UserSwitcher() {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const listRef = useRef(null);
  const user = useSelector(selectCurrentUser);
  const userId = useSelector(selectCurrentUserId);
  const [userData, setUserData] = useState<Array<UserType>>([]);
  const [activeUser, setActiveUser] = useState<UserType | null>(null);
  const [scrolled, setScrolled] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const [pagination, setPagination] = useState<TablePagination>({
    currentPage: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  });

  const { data, isFetching, isLoading } = useGetUsersQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    search: search,
    userId: userId ? `${userId}` : undefined,
  });

  useEffect(() => {
    if (user && Object.keys(user).length > 0)
      if (data && data?.data) {
        setUserData(_.unionBy([...userData, ...data.data.data.users], "id"));
        setPagination({
          currentPage: data.data.currentPage,
          limit: data.data.limit,
          total: data.data.total,
          totalPages: data.data.totalPages,
        });
        if (userId !== null) {
          // const userData = data.data.data.users.find(
          //   (user) => user.id === userId
          // );
          if (data.data.data.user) {
            setActiveUser(data.data.data.user);
            // dispatch(setUserId({ id: data.data.data.user.id }));
          }
        }
        setScrolled(true);
      }
  }, [data, userId]);

  const handleScroll = () => {
    if (!listRef.current || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    // Check if user has scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight - 10 && scrolled) {
      if (pagination.currentPage < pagination.totalPages) {
        setScrolled(false);
        setPagination((pre) => ({ ...pre, currentPage: pre.currentPage + 1 }));
      }
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <span className="pl-2 text-charcoal text-base">User</span>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="">
                {isLoading || isFetching ? (
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-theme text-sidebar-primary-foreground">
                    <Loading />
                  </div>
                ) : (
                  <>
                    {activeUser ? (
                      <>
                        <Avatar className="size-8">
                          <AvatarImage
                            className="object-cover"
                            src={
                              activeUser?.profileImg ||
                              "/assets/images/user/user.png"
                            }
                          />
                          <AvatarFallback>RT</AvatarFallback>
                        </Avatar>
                      </>
                    ) : (
                      <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-theme text-sidebar-primary-foreground">
                        <UsersRound className="size-4" />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-base">
                  {activeUser?.name || "No user selected"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg max-h-64 overflow-y-scroll scrollbar-hide"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
            ref={listRef}
            onScroll={handleScroll}
          >
            <DropdownMenuLabel className="flex flex-col gap-2">
              <div className="flex justify-between items-end text-sm text-muted-foreground">
                <span>User</span>
                <span
                  className="text-theme t ext-xs cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    setActiveUser(null);
                    dispatch(setUserId({ id: null }));
                  }}
                >
                  Clear
                </span>
              </div>
              {/* <Input
                type="text"
                placeholder="Search"
                className="w-full"
                onChange={(event) => {
                  setSearch(event.target.value);
                  setUserData([]);
                }}
              /> */}
            </DropdownMenuLabel>
            {userData.map((user, index) => (
              <DropdownMenuItem
                key={index}
                className="gap-2 p-2 cursor-pointer"
                onClick={() => {
                  setActiveUser(user);
                  dispatch(setUserId({ id: user.id }));
                }}
              >
                <Avatar className="size-5">
                  <AvatarImage
                    className="object-cover"
                    src={user?.profileImg || "/assets/images/user/user.png"}
                  />
                  <AvatarFallback>RT</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </DropdownMenuItem>
            ))}
            {isLoading ||
              (isFetching && (
                <div className="flex w-full size-8 items-center justify-center rounded-lg text-theme">
                  <Loading />
                </div>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
