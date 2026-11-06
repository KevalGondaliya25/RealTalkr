"use client";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// icons
import { FaRegEnvelope } from "react-icons/fa6";

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

type Props = {};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
});

const Newsletter4 = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-[10px] flex-col md:flex-row"
      >
        <div className="px-[20px] py-[15px] md:py-[22px] bg-white rounded-[10px] overflow-hidden flex-1 flex items-center gap-[10px]">
          <span className="">
            <FaRegEnvelope className="text-[#ABB1B6]" />
          </span>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter Your Email"
                    {...field}
                    className="border-0 p-0 h-full w-full placeholder:text-[16px] placeholder:font-normal placeholder:text-[#ABB1B6]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" variant="primary">
          <span className="btn-span" data-text="Get Started">
            Get Started
          </span>
        </Button>
      </form>
    </Form>
  );
};

export default Newsletter4;
