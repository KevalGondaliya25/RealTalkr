"use client";

import Image from "next/image";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// lib
import { cn } from "@/lib/utils";
import CryptoJS from "crypto-js";

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
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";

import Loading from "@/components/component/Loading";
import { DASHBOARD_PAGE } from "@/utils/constant";

type Props = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  forgot: () => void;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(8, { message: "Password must be minimum 8 character" }),
  remember: z.boolean().default(false).optional(),
});

const Signin = ({ isOpen, close, open, forgot }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email.toLowerCase(),
        password: values.password,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        const encryptedPassword = CryptoJS.AES.encrypt(
          values.password,
          process.env.NEXT_PUBLIC_SECRET_KEY!
        ).toString();
        if (values.remember) {
          localStorage.setItem("rememberedEmail", values.email);
          localStorage.setItem("rememberedPassword", encryptedPassword);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        form.reset();
        toast.success("Login successfully.");
        router.push(DASHBOARD_PAGE);
        close();
      }
      setIsLoading(false);
    } catch (error) {
      toast.error((error as Error).message);
      setIsLoading(false);
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (!isOpen) form.reset();
  }, [isOpen]);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("remember", true);
    }
    const storedHash = localStorage.getItem("rememberedPassword");

    if (storedHash) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          storedHash,
          process.env.NEXT_PUBLIC_SECRET_KEY!
        );
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (decryptedPassword) {
          form.setValue("password", decryptedPassword);
        }
      } catch (error) {
        toast.error("Error decrypting password");
      }
    }
  }, [form, isOpen]);

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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter password"
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

                <div className="flex justify-between items-center !mt-5">
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Remember me</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p
                    className="text-[14px] text-theme underline cursor-pointer"
                    onClick={() => {
                      forgot();
                      close();
                    }}
                  >
                    Forgot your password?
                  </p>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-full rounded-[15px] !mt-[42px]"
                  disabled={isLoading}
                >
                  <span className="btn-span" data-text="Login">
                    {isLoading ? <Loading /> : "Login"}
                  </span>
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-[15px] text-center">
            <p className="text-[14px]">
              Don’t have an account?{" "}
              <span
                className="font-semibold cursor-pointer"
                onClick={() => {
                  open();
                  close();
                }}
              >
                Create Here!
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

export default Signin;
