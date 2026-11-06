"use client";
import { AppSidebar } from "@/components/component/navbar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell, CircleX } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from "@/redux/query/notification";
import React, { use, useEffect, useRef, useState } from "react";
import {
  selectCurrentOrganizationId,
  selectCurrentUser,
} from "@/redux/slice/user";
import { useSelector } from "react-redux";
import { TablePagination } from "@/types";
import { NotificationType } from "@/types/notification";
import { formatNotificationDate } from "@/utils/functions";
import _ from "lodash";
import Loading from "../Loading";
import { HEADER_NAME, NOTIFICATION_TYPE } from "@/utils/constant";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "@/components/component/tools/socketContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ToolsComponent from "@/components/tools";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import {
  useAcceptTermsMutation,
  useGetLatestTermsQuery,
} from "@/redux/query/terms";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import { useSession } from "next-auth/react";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function Navbar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();
  const { socket } = useSocket();
  const listRef = useRef(null);
  const { data: user, update } = useSession();

  const formSchema = z
    .object({
      agree: z.boolean().default(false),
    })
    .refine(
      (data) => {
        return data.agree;
      },
      {
        message: "You must agree to continue.",
        path: ["agree"],
      }
    );

  const termForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agree: false,
    },
  });

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
  const organizationId = useSelector(selectCurrentOrganizationId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolledToBottom, setScrolledToBottom] = useState<boolean>(false);
  const [acceptTerms, { isLoading: isAcceptingTerms }] =
    useAcceptTermsMutation();

  const { data: terms, refetch: latestTermsRefetch } = useGetLatestTermsQuery();

  useEffect(() => {
    latestTermsRefetch();
  }, [latestTermsRefetch]);

  const {
    data: notificationData,
    refetch,
    isLoading: notificationLoading,
  } = useGetNotificationQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    organizationId: organizationId || undefined,
    search: "",
  });

  const [readNotification] = useReadNotificationMutation();

  const handleDeleteNotification = (id: number) => {
    const filterNotification = notifications.filter((value) => value.id !== id);
    setNotifications(filterNotification);
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const dialogOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (user && !user.user.termsAndCondition) {
      setIsOpen(!user.user.termsAndCondition);
    }
  }, [user]);

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
          _.unionBy([...data.data.notifications, ...notifications], "id"),
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

  const handleScroll = () => {
    if (!listRef.current || notificationLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    // Check if user has scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight - 10 && scrolled) {
      if (pagination.currentPage < pagination.totalPages) {
        setScrolled(false);
        setPagination((pre) => ({
          ...pre,
          currentPage: pre.currentPage + 1,
        }));
      }
    }
  };

  const handleSignOut = () => setIsLoading((pre) => !pre);

  async function onTermsSubmit(values: z.infer<typeof formSchema>) {
    if (!terms || (terms && !terms.data)) return;
    try {
      const result = await acceptTerms({
        id: `${terms.data.id}`,
      }).unwrap();
      if (result.success) {
        dialogOpen();
        await update({
          expires: user?.expires,
          user: { ...user?.user, termsAndCondition: true },
        });
        toast.success(result.message);
      }
      termForm.reset();
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }

  return (
    <SidebarProvider className="text-charcoal font-primary tracking-wide">
      {/* <ToolsComponent /> */}
      <AppSidebar signOutLoading={isLoading} handleSignOut={handleSignOut} />
      <SidebarInset
        className={`main-screen ${
          isLoading ? "backdrop-blur-sm bg-white/50" : ""
        }`}
      >
        <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 z-50 w-full max-w-full sticky top-0 w-fill bg-sidebar shadow-sm">
          <div className="flex items-center gap-2 pl-4">
            <SidebarTrigger className="-ml-1 z-0 hide block" />
            <Separator orientation="vertical" className="mr-2 h-4 hide block" />
          </div>
          <div className="flex justify-between w-full">
            <div className="flex items-center text-[22px] font-medium text-charcoal">
              {HEADER_NAME[pathName.split("/")[1]]}
            </div>
            <div className="flex items-center gap-2 px-8">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    {/* <Bell
                      onClick={() => router.push("/notification")}
                      className="text-charcoal"
                    /> */}
                    <Bell onClick={refetch} className="text-charcoal" />
                    {Boolean(notificationCount > 0) && (
                      <div className="absolute -top-2 -left-2 bg-theme p-1 w-5 text-center text-white rounded-full text-[12px]">
                        {notificationCount}
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 m-2">
                  <div className="flex justify-between items-center pb-2 pl-2">
                    <h1 className="font-semibold text-base">Notifications</h1>
                    {/* <div
                          className="text-xs text-right border rounded-xl py-1 px-1 cursor-pointer"
                          onClick={handleClearAll}
                      >
                          Clear All
                      </div> */}
                  </div>
                  <Separator />
                  {notificationLoading ? (
                    <Loading />
                  ) : (
                    <div
                      className="max-h-96 overflow-y-auto disable-slider"
                      ref={listRef}
                      onScroll={handleScroll}
                    >
                      {notifications.length > 0 ? (
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
                                    notification.type ===
                                    NOTIFICATION_TYPE.EXCELLENT_LEAD
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
                                        : "bg-theme"
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
                                  {/* <button
                                    onClick={() =>
                                      handleDeleteNotification(notification.id)
                                    }
                                    className="flex justify-end items-center"
                                  >
                                    <CircleX className="w-4 h-4" />
                                  </button> */}
                                  {duration}
                                </div>
                              </div>
                              {index !== notifications.length - 1 && (
                                <Separator />
                              )}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <>
                          <div className="text-theme text-center pt-4 text-sm">
                            Not found.
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 overflow-auto">
          {children}
        </div>
        <Dialog onOpenChange={() => {}} open={isOpen} modal>
          <DialogContent
            onEscapeKeyDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            className="px-[5px] md:px-[25px] pb-[60px] md:pb-[80px] pt-[40px] max-w-[calc(100%-20px)] md:max-w-[550px] max-h-[90vh] border-[0px] !rounded-[30px] bg-white z-[999] [&>button]:hidden"
          >
            <DialogHeader className="pt-2">
              <h2 className="text-[30px] max-sm:text-[22px] text-center text-primary font-colasta font-bold leading-none">
                <span className="font-normal">Terms and </span> Conditions.
              </h2>
            </DialogHeader>
            <ReactQuill
              className={`quill w-full h-fit pt-4 px-4 
                [&>.ql-toolbar]:sticky 
                [&>.ql-toolbar]:top-0 
                [&>.ql-toolbar]:z-50 
                [&>.ql-toolbar]:bg-white 
                [&>.ql-container]:max-h-[calc(90vh-260px)] 
                [&>.ql-container]:overflow-y-auto 
                [&>.ql-container]:scrollbar-hide 
                [&>.ql-container]:text-charcoal 
                [&>.ql-container_.ql-clipboard]:hidden 
                [&>.ql-container_.ql-tooltip]:hidden 
                [&>.ql-container>.ql-editor>h1]:text-[32px] 
                [&>.ql-container>.ql-editor>h2]:text-[24px] 
                [&>.ql-container>.ql-editor>h3]:text-[18.72px] 
                [&>.ql-container>.ql-editor>h4]:text-[16px] 
                [&>.ql-container>.ql-editor>h5]:text-[13.28px] 
                [&>.ql-container>.ql-editor>h6]:text-[10.72px]
                [&>.ql-container>.ql-editor>p]:text-[14px]
                [&>.ql-container>.ql-editor>p]:text-charcoal 
                [&>.ql-container>.ql-editor>ul]:text-[14px]
                [&>.ql-container>.ql-editor>ul]:leading-5
                [&>.ql-container>.ql-editor>ul]:pl-0
                `}
              theme="bubble"
              value={terms?.data?.content}
              readOnly={true}
            />
            <Form {...termForm}>
              <form
                onSubmit={termForm.handleSubmit(onTermsSubmit)}
                className={cn("space-y-3 px-4")}
              >
                <FormField
                  control={termForm.control}
                  name="agree"
                  render={({ field }) => (
                    <FormItem className="space-x-3 space-y-0 pt-2">
                      <div className="flex flex-row items-start">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className={
                              termForm.formState.errors["agree"]
                                ? "border border-destructive"
                                : ""
                            }
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none ml-2">
                          <FormLabel className="flex gap-2">
                            I agree to the{" "}
                            <div className="underline">Terms & Privacy</div>
                          </FormLabel>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="pt-2 flex justify-end">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full rounded-[15px]"
                    disabled={isAcceptingTerms}
                  >
                    <span className="btn-span" data-text="Submit">
                      {isAcceptingTerms ? <Loading /> : "Submit"}
                    </span>
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
