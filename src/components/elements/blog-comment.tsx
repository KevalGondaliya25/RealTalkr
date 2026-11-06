"use client";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import validator from "validator";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// components
import Title1 from "../shared/title/title1";

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
  phone: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .refine(validator.isMobilePhone),
  subject: z.string().min(1, { message: "This field has to be filled." }),
  message: z.string().min(1, { message: "This field has to be filled." }),
});

const BlogComment = ({ className }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className={cn(className)}>
      <Title1 text="Leave a Comment" heading1 className="mb-[22px]" />
      <div className="text-wrapper">
        <p className="text">
          Your email address will not be published. Required fields are marked
        </p>
      </div>
      <div className="comment-form-wrapper">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-5 mt-[28px] 2xl:mt-[43px]")}
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
                      className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme placeholder:text-secondary text-primary text-lg placeholder:text-lg"
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
                      className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme placeholder:text-secondary text-primary text-lg placeholder:text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Phone"
                      {...field}
                      className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme placeholder:text-secondary text-primary text-lg placeholder:text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Type subject"
                      {...field}
                      className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme placeholder:text-secondary text-primary text-lg placeholder:text-lg"
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
                      placeholder="Write your comment..."
                      className="resize-none w-full h-[120px] md:h-[200px] py-[18px] px-[16px] md:px-[30px] outline-0 rounded-[10px] border border-border focus:border-theme placeholder:text-secondary text-primary text-lg placeholder:text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BlogComment;
