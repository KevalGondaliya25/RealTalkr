"use client";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

const Newsletter5 = (props: Props) => {
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
        className="flex justify-between items-center bg-[#ffffff1a] pe-[10px] rounded-[12px] max-w-[690px] mx-auto mb-[25px] border border-charcoal"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Type Your Email"
                  {...field}
                  className="border-0 px-[30px] h-[70px] w-full text-[16px] bg-transparent placeholder:text-[16px] placeholder:font-normal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="bg-theme text-white"
        >
          <span className="btn-span" data-text="Book your demo">
            Book your demo
          </span>
        </Button>
      </form>
    </Form>
  );
};

export default Newsletter5;
