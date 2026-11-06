"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from "@/redux/query/notification";
import { TablePagination } from "@/types";
import { NotificationType } from "@/types/notification";
import { formatNotificationDate, successEvaluation } from "@/utils/functions";
import { NOTIFICATION_TYPE, STATUS_COLOR } from "@/utils/constant";
import { useRouter } from "next/navigation";
import { useSocket } from "@/components/component/tools/socketContext";
import _ from "lodash";
import {
  selectCurrentOrganizationId,
  selectCurrentUser,
} from "@/redux/slice/user";
import { useSelector } from "react-redux";
import { createTheme, Pagination, Stack, ThemeProvider } from "@mui/material";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation } from "@/redux/query/user";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import Loading from "@/components/component/Loading";

export default function Page() {
  const router = useRouter();
  const { socket } = useSocket();
  const { data: userData, update } = useSession();
  const user = useSelector(selectCurrentUser);
  const listRef = useRef(null);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#e6503a",
      },
    },
    components: {
      // Change the hover color for buttons
      MuiButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#e6503a", // Change this to your desired hover color
            },
          },
        },
      },
    },
  });

  const organizationId = useSelector(selectCurrentOrganizationId);

  const [scrolled, setScrolled] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePagination>({
    currentPage: 1,
    limit: 30,
    total: 1,
    totalPages: 1,
  });
  const [notifications, setNotifications] = useState<Array<NotificationType>>(
    []
  );
  const [notificationCount, setNotificationCont] = useState<number>(0);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [notificationEnableSettings, setNotificationEnableSettings] = useState<
    Array<string>
  >([]);

  const [readNotification] = useReadNotificationMutation();
  const {
    data: notificationData,
    refetch,
    isLoading: notificationLoading,
  } = useGetNotificationQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    organizationId: organizationId || undefined,
    search: notificationFilter,
  });

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message: MessageEvent) => {
        const data = JSON.parse(message.data);
        if (data.type === "notification") {
          setNotifications((pre) =>
            _.sortBy(
              _.unionBy([data.data, ...pre], "id"),
              "createdAt"
            ).reverse()
          );
          setNotificationCont((pre) => pre + 1);
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    if (notificationData && notificationData.data) {
      const { data } = notificationData;
      setNotifications(
        _.sortBy(
          _.unionBy(data.data.notifications, "id"),
          "createdAt"
        ).reverse()
      );
      setPagination({
        currentPage: data.currentPage,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      });
      setNotificationCont(data.data.unReadCount);

      setScrolled(true);
    }
  }, [notificationData]);

  useEffect(() => {
    if (userData && userData.user) {
      const { user } = userData;
      setNotificationEnableSettings(user.notificationSetting);
    }
  }, [userData]);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  async function onSubmit() {
    try {
      if (user && user.id) {
        const response = await updateUser({
          id: user.id,
          data: {
            notificationSetting: notificationEnableSettings,
          },
        }).unwrap();
        if (response.success) {
          await update({
            expires: userData?.expires,
            user: {
              ...userData?.user,
              notificationSetting: notificationEnableSettings,
            },
          });
          refetch();
        }
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }

  // const handleScroll = () => {
  //   if (!listRef.current || notificationLoading) return;

  //   const { scrollTop, scrollHeight, clientHeight } = listRef.current;

  //   // Check if user has scrolled to the bottom
  //   if (scrollTop + clientHeight >= scrollHeight - 10 && scrolled) {
  //     if (pagination.currentPage < pagination.totalPages) {
  //       setScrolled(false);
  //       setPagination((pre) => ({
  //         ...pre,
  //         currentPage: pre.currentPage + 1,
  //       }));
  //     }
  //   }
  // };
  return (
    <>
      <div className="flex flex-col flex-grow gap-4 max-md:overflow-x-auto max-md:max-w-full max-md:w-screen">
        <div className="flex justify-between items-center max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md overflow-x-auto">
          <span className="w-full">
            {notificationCount} Unread Notification
          </span>
          <div className="flex gap-2 items-center justify-end w-full">
            {Boolean(user && user?.notificationSetting?.length > 1) && (
              <Select
                value={notificationFilter}
                onValueChange={setNotificationFilter}
              >
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder="Select a notification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    {user?.notificationSetting?.map((status, index) => (
                      <SelectItem
                        key={index}
                        className="capitalize"
                        value={`${status}_lead`}
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex justify-center items-center bg-white border border-neutral-200 rounded-md w-10 h-10 cursor-pointer">
                  <Settings2 strokeWidth={1.5} />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-lg leading-none">
                      Notification Settings
                    </h4>
                  </div>
                  <Separator />
                  <div className="grid gap-2">
                    {["hot", "warm", "cold", "poor"].map(
                      (notificationStatus, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between space-x-2"
                        >
                          <Label
                            htmlFor="airplane-mode"
                            className="text-sm capitalize"
                          >
                            {notificationStatus} lead
                          </Label>
                          <Switch
                            id="airplane-mode"
                            className="h-6 w-11 [&>span]:size-4 [&>span]:data-[state=checked]:translate-x-5"
                            checked={notificationEnableSettings.includes(
                              notificationStatus
                            )}
                            onCheckedChange={(checked: boolean) => {
                              if (checked) {
                                setNotificationEnableSettings((pre) =>
                                  _.uniq([...pre, notificationStatus])
                                );
                              } else {
                                setNotificationEnableSettings((pre) =>
                                  _.uniq(
                                    [...pre].filter(
                                      (status) => status !== notificationStatus
                                    )
                                  )
                                );
                              }
                            }}
                          />
                        </div>
                      )
                    )}

                    <Button
                      variant="primary"
                      className="!p-0 w-full !h-[40px] rounded-md mt-4"
                      disabled={isLoading}
                      onClick={onSubmit}
                    >
                      {isLoading ? <Loading /> : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md overflow-x-auto">
          <div
            className="max-h-full overflow-y-auto disable-slider"
            // ref={listRef}
            // onScroll={handleScroll}
          >
            {Boolean(notifications.length > 0) ? (
              notifications.map((notification, index) => {
                const duration = formatNotificationDate(
                  new Date(notification.createdAt)
                );
                return (
                  <React.Fragment key={index}>
                    <div
                      className="text-sm py-2 font-normal flex  justify-between items-end cursor-pointer"
                      onClick={() => {
                        if (
                          notification.type === NOTIFICATION_TYPE.EXCELLENT_LEAD
                        ) {
                          readNotification({
                            ids: [notification.id],
                          });
                          setNotifications((pre) =>
                            pre.map((noti) => {
                              if (noti.id === notification.id) {
                                return {
                                  ...noti,
                                  isRead: true,
                                };
                              }
                              return noti;
                            })
                          );
                          setNotificationCont((pre) =>
                            pre > 0 ? pre - 1 : pre
                          );
                          router.push(`/lead/${notification.leadId}`);
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`size-1.5 rounded-full mt-2 ${
                            notification.isRead
                              ? "bg-white-2"
                              : STATUS_COLOR[
                                  successEvaluation(notification.message)
                                ]
                          }`}
                        />
                        <div>
                          <div>{notification.message}</div>
                          <div className="text-slate-500 text-xs">
                            {notification.subMessage}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col text-slate-500 text-xs">
                        {duration}
                      </div>
                    </div>
                    {index !== notifications.length - 1 && <Separator />}
                  </React.Fragment>
                );
              })
            ) : (
              <>
                <div className="text-theme text-center py-4 text-sm">
                  Not found.
                </div>
              </>
            )}
            {notifications.length > 0 && (
              <ThemeProvider theme={theme}>
                <div className="flex justify-end my-2">
                  <Stack spacing={2}>
                    <Pagination
                      count={pagination.totalPages}
                      defaultPage={pagination.currentPage}
                      shape="rounded"
                      color="primary"
                      onChange={(event, page) =>
                        setPagination((pre) => ({
                          ...pre,
                          currentPage: page,
                        }))
                      }
                    />
                  </Stack>
                </div>
              </ThemeProvider>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
