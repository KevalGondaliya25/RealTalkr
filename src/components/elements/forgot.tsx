"use client";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

import Loading from "@/components/component/Loading";
import {
  useForgotMutation,
  useVerifyCaptchaMutation,
} from "@/redux/query/auth";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { ErrorResponse } from "@/types/response";

type Props = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
});

const Forgot = ({ isOpen, close, open }: Props) => {
  const [forgot, { isLoading }] = useForgotMutation();
  const [verifyCaptcha, { isLoading: isVerifyLoading }] =
    useVerifyCaptchaMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!executeRecaptcha) {
        toast.error("Recaptcha not ready");
        return;
      }

      const captchaToken = await executeRecaptcha("form_submit");

      const captchaRes = await verifyCaptcha({
        token: captchaToken,
      }).unwrap();

      if (!captchaRes.success) {
        toast.error("Invalid captcha, please try again.");
        return;
      }
      const result = await forgot({
        email: values.email.toLowerCase(),
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

  useEffect(() => {
    if (!isOpen) form.reset();
  }, [isOpen]);

  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="px-[5px] md:px-[25px] pb-[60px] md:pb-[80px] pt-[50px] md:pt-[70px] z-[999] max-w-[calc(100%-20px)] md:max-w-[550px] max-h-[90vh] border-[0px] !rounded-[30px] bg-white [&>button]:border [&>button]:border-border [&>button]:rounded-full [&>button]:p-3 [&>button]:top-2 [&>button]:right-2 [&>button]:text-primary"
      >
        <ScrollArea className="h-auto w-full px-[20px]">
          <DialogHeader className="pb-[40px]">
            <h2 className="text-[30px] text-center text-primary font-colasta font-bold leading-none">
              <span className="font-normal">Forgot password.</span>
            </h2>
          </DialogHeader>
          <div className="h-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("space-y-3")}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[15px] border border-border focus:border-theme"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="w-full rounded-[15px] !mt-[42px]"
                  disabled={isLoading || isVerifyLoading}
                >
                  <span className="btn-span" data-text="Submit">
                    {isLoading || isVerifyLoading ? <Loading /> : "Submit"}
                  </span>
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-[15px] text-center">
            <p className="text-[14px]">
              Already have an account?{" "}
              <span
                className="font-semibold cursor-pointer"
                onClick={() => {
                  open();
                  close();
                }}
              >
                Login Here!
              </span>
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Forgot;
