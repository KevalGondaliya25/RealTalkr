"use client";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import validator from "validator";
import { ErrorResponse } from "@/types/response";
// import ReCAPTCHA from "react-google-recaptcha";

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
import { Textarea } from "@/components/ui/textarea";
import { useCreateContactUsMutation } from "@/redux/query/contact";
import { toast } from "sonner";
import parsePhoneNumberFromString from "libphonenumber-js";
import { createRef, useEffect, useRef, useState } from "react";

import {
  loadCaptchaEnginge,
  validateCaptcha,
  LoadCanvasTemplate,
  LoadCanvasTemplateNoReload,
} from "react-simple-captcha";

type Props = {
  className?: string;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  contact: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .refine(validator.isMobilePhone),
  // service: z.string().min(1, { message: "This field has to be filled." }),
  message: z.string().min(1, { message: "This field has to be filled." }),
  captcha: z.string().min(1, { message: "This field has to be filled." }),
});

const ContactForm = ({ className }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      // service: "",
      message: "",
      captcha: "",
    },
  });

  const [createContact, { isLoading }] = useCreateContactUsMutation();
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaValid, setCaptchaValid] = useState<null | boolean>(false);
  const [isLoadings, setIsLoading] = useState(false);

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCaptchaInput(value);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const validate = validateCaptcha(values.captcha);

      if (!validate) {
        toast.error("Captcha Does Not Match");
        setCaptchaInput("");
        loadCaptchaEnginge(6);
        return;
      }
      const result = await createContact(values).unwrap();
      if (result.success) {
        toast.success("Your message has been sent successfully.");
        form.reset();
        setCaptchaInput("");
        loadCaptchaEnginge(6);
        toast.success("Captcha Matched");
      }
    } catch (error) {
      toast.error("Your message has been sent unsuccessfully.");
    }
  }

  const doSubmit = () => {
    if (validateCaptcha(captchaInput)) {
      loadCaptchaEnginge(6);
      setCaptchaInput("");
    } else {
      setCaptchaInput("");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-5", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Type your name"
                  {...field}
                  className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme"
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
                  className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter Phone"
                  {...field}
                  className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Type your message..."
                  className="resize-none w-full h-[120px] md:h-[200px] py-[18px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <ReCAPTCHA
    sitekey="Your client site key"
    onChange={onChange}
  /> */}

        <div className="flex items-center gap-5 w-full">
          <FormField
            control={form.control}
            name="captcha"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value);
                        field.onChange(e.target.value);
                      }}
                      placeholder="Enter CAPTCHA"
                      className={`w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <div className="flex items-center gap-2 border border-border rounded-[10px] px-4 py-3">
            <LoadCanvasTemplateNoReload />
            <button
              type="button"
              className="bg-theme text-white p-2 rounded-md"
              onClick={() => {
                loadCaptchaEnginge(6);
                setCaptchaInput("");
              }}
            >
              ↻
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          type="submit"
          // onClick={doSubmit}
          disabled={isLoading}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
