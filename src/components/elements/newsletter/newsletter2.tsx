"use client";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// icons
import { FaPaperPlane, FaRegEnvelope } from "react-icons/fa6";

// shadcn components
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  agree: z.boolean().default(false).optional(),
});

const Newsletter2 = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      agree: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div>
      <h2 className="text-[20px] xl:text-[24px]">Newsletter</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[36px]">
          <div className="relative rounded-[10px] overflow-hidden">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Email"
                      {...field}
                      className="h-[50px] md:h-[60px] border-0 px-[50px] py-[19px] bg-white-3 w-full placeholder:text-[14px] placeholder:font-normal placeholder:text-[#ABB1B6]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="absolute end-[20px] top-[50%] -translate-y-[50%] rtl_y"
            >
              <FaPaperPlane className="text-primary" />
            </button>
            <span className="absolute start-[20px] top-[50%] -translate-y-[50%]">
              <FaRegEnvelope className="text-[#ABB1B6]" />
            </span>
          </div>

          <FormField
            control={form.control}
            name="agree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 mt-[20px]">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="ms-3 leading-none">
                  <FormLabel className="text-[14px] font-normal">
                    I agree with{" "}
                    <span className="text-primary font-medium">
                      privacy policy
                    </span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default Newsletter2;
