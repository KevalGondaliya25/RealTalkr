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
import { useEffect, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Loading from "@/components/component/Loading";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { SignUpFormSchemaType } from "./header/header12";

type Props = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  next: () => void;
  form: UseFormReturn<SignUpFormSchemaType>;
};

const Signup = ({ isOpen, close, open, next, form }: Props) => {
  const [signup, { isLoading }] = useSignupMutation();

  async function onSubmit(values: SignUpFormSchemaType) {
    try {
      form.setValue("next", true);
      close();
      next();
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  useEffect(() => {
    if (isOpen) form.reset();
  }, [isOpen]);

  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="px-[5px] md:px-[25px] pb-[60px] md:pb-[80px] pt-[50px] md:pt-[70px] max-w-[calc(100%-20px)] md:max-w-[550px] max-h-[90vh] border-[0px] !rounded-[30px] bg-white z-[999] [&>button]:border [&>button]:border-border [&>button]:rounded-full [&>button]:p-3 [&>button]:top-2 [&>button]:right-2 [&>button]:text-primary"
      >
        <ScrollArea className="h-auto w-full px-[20px]">
          <DialogHeader className="pb-[40px]">
            <h2 className="text-[30px] text-center text-primary font-colasta font-bold leading-none">
              <span className="font-normal">Start Your Journey</span> with us.
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Type your name"
                          {...field}
                          className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[15px] border border-border focus:border-theme"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Type Email"
                          {...field}
                          className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[15px] border border-border focus:border-theme"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Type Password"
                            type={isPasswordVisible ? "text" : "password"}
                            {...field}
                            className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[15px] border border-border focus:border-theme"
                          />
                          <span
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          >
                            {isPasswordVisible ? (
                              <EyeClosed size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm Password"
                            type={
                              isConfirmPasswordVisible ? "text" : "password"
                            }
                            {...field}
                            className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[15px] border border-border focus:border-theme"
                          />
                          <span
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {isConfirmPasswordVisible ? (
                              <EyeClosed size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="agree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox
                          className={
                            form.formState.errors["agree"]
                              ? "border border-destructive"
                              : ""
                          }
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the{" "}
                          <Link href={"/"} className="underline">
                            Terms & Privacy
                          </Link>
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-full rounded-[15px] !mt-[42px]"
                  disabled={isLoading}
                >
                  <span className="btn-span" data-text="Next">
                    Next
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
          {/* <div className="relative flex mt-[38px] items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-[16px] text-primary font-bold leading-none font-colasta">
              OR
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>
          <div className="mt-[37px] flex justify-center items-center gap-[10px] ">
            <div>
              <Image
                width={60}
                height={60}
                src="/assets/imgs/icon/icon-apple.png"
                alt="Icon"
              />
            </div>
            <div>
              <Image
                width={60}
                height={60}
                src="/assets/imgs/icon/icon-google.png"
                alt="Icon"
              />
            </div>
            <div>
              <Image
                width={60}
                height={60}
                src="/assets/imgs/icon/icon-x.png"
                alt="Icon"
              />
            </div>
          </div> */}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Signup;
