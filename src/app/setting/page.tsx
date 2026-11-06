"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation } from "@/redux/query/user";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slice/user";
import Loading from "@/components/component/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUploadFileMutation } from "@/redux/query/upload";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import _ from "lodash";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  // notificationSetting: z.array(z.string()),
  // password: z
  //   .string()
  //   .min(8, { message: "Password must be minimum 8 character" }),
});

export default function Page() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const { data: userData, update } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      // notificationSetting: [],
      // password: "",
    },
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (user && user.id) {
        const response = await updateUser({
          id: user.id,
          data: values,
        }).unwrap();
        if (response.success) {
          toast.success(response.message);
          await update({
            expires: userData?.expires,
            user: {
              ...userData?.user,
              email: values.email,
              name: values.name,
              // notificationSetting: values.notificationSetting,
            },
          });
        }
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email);
      form.setValue("name", user.name);
      // form.setValue("notificationSetting", user.notificationSetting);
    }
  }, [user, form]);

  const [uploadFile, { isLoading: uploadFileLoading }] =
    useUploadFileMutation();

  const onFileChange = async (event: any) => {
    if (event.target.files.length === 0 || !user || (user && !user.id)) {
      return;
    }

    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try {
      const result = await uploadFile(formData).unwrap();
      if (result.success) {
        const response = await updateUser({
          id: user.id,
          data: {
            profileImg: result.data.file[0].url,
            fileName: result.data.file[0].fileName,
            fileType: result.data.file[0].type,
          },
        }).unwrap();
        await update({
          expires: userData?.expires,
          user: {
            ...userData?.user,
            profileImg: result.data.file[0].url,
            fileName: result.data.file[0].fileName,
            fileType: result.data.file[0].type,
          },
        });
        toast.success(result.message);
      }
    } catch (error) {
      console.log("error : ", error);
    }
  };

  return (
    <div className="!flex w-full h-full justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 max-w-[450px] w-full border rounded-lg p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl"
        >
          <div className="flex justify-center items-center">
            <p className="text-2xl font-bold">Update User</p>
          </div>
          <div className="flex justify-center mt-10">
            <label
              htmlFor="image-upload"
              className="cursor-pointer d-inline text-center"
            >
              <input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg, image/svg"
                className="hidden"
                onChange={onFileChange}
              />
              <Avatar className="size-20">
                <AvatarImage
                  className="object-cover"
                  src={user?.profileImg || "/assets/images/user/user.png"}
                />
                <AvatarFallback>RT</AvatarFallback>
              </Avatar>
            </label>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="!mt-5">
                <label>Name</label>
                <FormControl>
                  <Input
                    placeholder="Type your name"
                    {...field}
                    className="w-full md:h-10 px-[14px]  outline-0 rounded-md border border-border focus:border-theme"
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
              <FormItem className="!mt-5">
                <label>Email</label>
                <FormControl>
                  <Input
                    placeholder="Type Email"
                    disabled={true}
                    {...field}
                    className="w-full md:h-10 px-[14px]  outline-0 rounded-md border border-border focus:border-theme"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Separator className="!my-4" />
          <Label className="text-lg capitalize">notification setting</Label>
          <FormField
            control={form.control}
            name="notificationSetting"
            render={({ field }) => (
              <FormItem className="!mt-2">
                <FormControl>
                  <>
                    {["hot", "warm", "cold", "poor"].map(
                      (notificationStatus, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between space-x-2"
                        >
                          <Label
                            htmlFor="airplane-mode"
                            className="text-base capitalize"
                          >
                            {notificationStatus} lead
                          </Label>
                          <Switch
                            id="airplane-mode"
                            checked={field.value.includes(notificationStatus)}
                            onCheckedChange={(checked: boolean) => {
                              if (checked) {
                                field.onChange(
                                  _.uniq([...field.value, notificationStatus])
                                );
                              } else {
                                field.onChange(
                                  _.uniq(
                                    [...field.value].filter(
                                      (status) => status !== notificationStatus
                                    )
                                  )
                                );
                              }
                            }}
                          />
                        </div>
                      )
                    )}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/* <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative mt-[20px]">
                    <label>Password</label>
                    <Input
                      placeholder="Type Password"
                      type={isPasswordVisible ? "text" : "password"}
                      {...field}
                      className="w-full mt-[8px] md:h-[40px] px-[14px]  outline-0 rounded-md border border-border focus:border-theme"
                    />
                    <span
                      className="absolute top-[34px] sm:top-[35px] right-0 flex items-center pr-3 cursor-pointer"
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
          /> */}

          <Button
            variant="primary"
            type="submit"
            className="!p-0 w-full !h-[40px] rounded-md !mt-[40px]"
            disabled={isLoading}
          >
            <span className="btn-span" data-text="Submit">
              {isLoading ? <Loading /> : "Submit"}
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
