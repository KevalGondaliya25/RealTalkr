"use client";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Loading from "@/components/component/Loading";
import { useVerifyMutation } from "@/redux/query/auth";

type Props = {
  className?: string;
};

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be minimum 8 character" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be minimum 8 character" }),
  })
  .refine(
    (data) => {
      return data.password === data.confirm_password;
    },
    {
      message: "Password do not match",
    }
  );

const ResetForm = ({ className }: Props) => {
  const searchParams = useSearchParams();
  const route = useRouter();
  const resetToken = searchParams.get("resetToken");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const [verify, { isLoading }] = useVerifyMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await verify({
        password: values.password,
        resetToken: resetToken || "",
      }).unwrap();
      if (result.success) {
        toast.success(result.message);
      }
      route.push("/");
    } catch (error) {
      toast.error("Your message has been sent unsuccessfully.");
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-5", className)}
      >
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
                    className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme"
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
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    {...field}
                    className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme"
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
        <Button
          variant="primary"
          type="submit"
          // onClick={doSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Loading /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default ResetForm;
