"use client";

import { useRef } from "react";
import Image from "next/image";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// shadcn components
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
});

const Newsletter3 = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <section className="bg-theme bg-[url(/assets/imgs/shape/shape-r-5.png)] bg-no-repeat bg-cover sec_space2">
      <div className="container" ref={containerRef}>
        <div className="max-w-[618px] mx-auto text-center mb-[55px]">
          <Title1
            text="Let’s kick-start your collaboration to customers"
            className="pb-[15px] md:pb-[24px] has_fade_anim"
          />
          <p className="text-primary has_fade_anim">
            Optimize your impact this holiday season with an AI-driven,
            multichannel marketing strategy. Get all the tips and tricks in our
            free ebook.
          </p>
        </div>
        <div className="max-w-[910px] mx-auto has_fade_anim">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative flex items-center gap-[10px] ps-[30px] pe-[10px] bg-white rounded-full"
            >
              <Image
                width={18}
                height={13}
                src="/assets/imgs/icon/email.png"
                alt="icon"
              />
              <div className="grow">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter Your Email"
                          {...field}
                          className="h-[70px] border-0 ps-0 focus:bg-white"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button variant="primary2" size="sm" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter3;
