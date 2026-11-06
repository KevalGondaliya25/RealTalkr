"use client";

import Image from "next/image";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useSignupMutation } from "@/redux/query/auth";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Loading from "@/components/component/Loading";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { SignUpFormSchemaType } from "./header/header12";
import { useGetLatestTermsQuery } from "@/redux/query/terms";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

type Props = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  form: UseFormReturn<SignUpFormSchemaType>;
};

const Terms = ({ isOpen, close, open, form }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState<boolean>(false);

  const [signup, { isLoading }] = useSignupMutation();
  const { data: terms, isLoading: isLatestTermLoading } =
    useGetLatestTermsQuery();
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;

    if (isBottom) {
      setScrolledToBottom(true);
    } else {
      setScrolledToBottom(false);
    }
  };
  async function onSubmit(values: SignUpFormSchemaType) {
    const currentTime = new Date();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const utcOffset = currentTime.getTimezoneOffset();

    try {
      const result = await signup({
        name: values.username,
        email: values.email.toLowerCase(),
        password: values.password,
        summaryNotificationTime: currentTime,
        offSet: utcOffset,
        timeZone: timeZone,
        agree: values.agree,
      }).unwrap();
      if (result.success) {
        close();
        toast.success(result.message);
      }
      form.reset();
      close();
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }

  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="px-[5px] max-sm:text-[22px] md:px-[25px] pb-[60px] md:pb-[80px] pt-[30px] max-w-[calc(100%-20px)] md:max-w-[550px] max-h-[90vh] border-[0px] !rounded-[30px] bg-white z-[999] [&>button]:border [&>button]:border-border [&>button]:rounded-full [&>button]:p-3 [&>button]:top-2 [&>button]:right-2 [&>button]:text-primary"
      >
        <ScrollArea className="h-auto w-full px-[20px]">
          <DialogHeader className="pt-2">
            <h2 className="text-[30px] text-center text-primary font-colasta font-bold leading-none">
              <span className="font-normal">Terms and </span> Conditions.
            </h2>
          </DialogHeader>
          {isLatestTermLoading ? (
            <div className="h-[calc(100vh-340px)] flex items-center justify-center text-theme">
              <Loading />
            </div>
          ) : (
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
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn("space-y-3 pt-2 px-4")}
            >
              <FormField
                control={form.control}
                name="agree"
                render={({ field }) => (
                  <FormItem className="space-x-3 space-y-0 py-2">
                    <div className="flex flex-row items-start">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={
                            form.formState.errors["agree"]
                              ? "border border-destructive"
                              : ""
                          }
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none ml-2">
                        <FormLabel>
                          I agree to the{" "}
                          <Link href={"/"} className="underline">
                            Terms & Privacy
                          </Link>
                        </FormLabel>
                      </div>
                    </div>
                    {/* <FormMessage className="ml-4" /> */}
                  </FormItem>
                )}
              />
              <Button
                variant="primary"
                type="submit"
                className="w-full rounded-[15px]"
                disabled={isLoading}
              >
                <span className="btn-span" data-text="Submit">
                  {isLoading ? <Loading /> : "Submit"}
                </span>
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Terms;
