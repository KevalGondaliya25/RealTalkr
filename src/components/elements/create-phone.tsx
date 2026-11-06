"use client";

// form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { CalendarIcon, CircleX } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Loading from "../component/Loading";
import PhoneInput from "react-phone-number-input";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { useGetVapiPhoneNumbersQuery } from "@/redux/query/call";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";
import { useSelector } from "react-redux";
import { selectCurrentOrganizationId } from "@/redux/slice/user";
import { VapiPhoneNumber } from "@/types/call";
import { SingleLeadBodyType } from "@/types/lead";
import parsePhoneNumber from "libphonenumber-js";
import "react-phone-number-input/style.css";
import moment from "moment";
import { ErrorResponse } from "@/types/response";
import { useCreateLeadMutation } from "@/redux/query/lead";
import { useLazyGetAllAssistantWithOutPaginationQuery } from "@/redux/query/assistant";
import { AssistantSelectType } from "@/types/assistant";
import { TIMEZONE_OFFSET } from "@/utils/constant";
import { PhoneNumberBodyType } from "@/types/phone-number";
import { useCreatePhoneNumberMutation } from "@/redux/query/phonenumber";

type Props = {
  isOpen: boolean;
  close: () => void;
  fetchPhone: () => void;
};

const formSchema = z
  .object({
    twilioAccountSid: z.string().optional(),
    contact: z
      .string()
      .min(5, "Phone number must be at least 5 characters long"),
    assistantId: z.string({
      required_error: "Please select a assistant.",
      message: "Please select a assistant.",
    }),
    provider: z
      .string({
        required_error: "Please select a provider.",
      })
      .min(1, { message: "Please select a assistant." }),
    twilioAuthToken: z.string().optional(),
    credentialId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.provider.toLowerCase().trim() === "twilio") {
      if (!data.twilioAccountSid) {
        ctx.addIssue({
          path: ["twilioAccountSid"],
          code: z.ZodIssueCode.custom,
          message: "twilioAccountSid is required when provider is 'twilio'",
        });
      }
      if (!data.twilioAuthToken) {
        ctx.addIssue({
          path: ["twilioAuthToken"],
          code: z.ZodIssueCode.custom,
          message: "twilioAuthToken is required when provider is 'twilio'",
        });
      }
    } else {
      if (!data.credentialId) {
        ctx.addIssue({
          path: ["credentialId"],
          code: z.ZodIssueCode.custom,
          message: "credentialId is required when provider is not 'twilio'",
        });
      }
    }
  });

const CreatePhone = ({ isOpen, close, fetchPhone }: Props) => {
  const [assistant, setAssistant] = useState<Array<AssistantSelectType>>([]);
  // Lead useStates
  const [phoneNumbers, setPhoneNumbers] = useState<Array<VapiPhoneNumber>>([]);
  const [offSet, setOffSet] = useState<number>(TIMEZONE_OFFSET.offset);
  const organizationId = useSelector(selectCurrentOrganizationId);

  const [selectedProviderName, setSelectedProviderName] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      twilioAccountSid: "",
      twilioAuthToken: "",
      contact: "",
      assistantId: "",
      provider: "",
      credentialId: "",
    },
  });

  const labelStyle = "original";
  const timezones = {
    ...allTimezones,
  };

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const { data: phoneNumbersData, isLoading: phoneNumberLoading } =
    useGetVapiPhoneNumbersQuery();

  useEffect(() => {
    if (phoneNumbersData && phoneNumbersData.data.length > 0) {
      setPhoneNumbers(phoneNumbersData.data);
    }
  }, [phoneNumbersData]);

  const [getAssistants, { isLoading: getAssistantLoading }] =
    useLazyGetAllAssistantWithOutPaginationQuery();
  const [createPhoneNumber, { isLoading: createLeadLoading }] =
    useCreatePhoneNumberMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedNumber = parsePhoneNumber(values.contact);

    if (!parsedNumber) {
      toast.error("Country code not found.");
      return;
    }

    const body: PhoneNumberBodyType = {
      provider: values.provider,
      number: values.contact,
      twilioAccountSid: values.twilioAccountSid,
      twilioAuthToken: values.twilioAuthToken,
      credentialId: values.credentialId,
      assistantId: Number(values.assistantId),
      organizationId: organizationId,
    };

    try {
      const result = await createPhoneNumber(body).unwrap();
      if (result.success) {
        toast.success(result.message);
        close();
        fetchPhone();
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }

  useEffect(() => {
    const fetchAllAssistant = async () => {
      const res = await getAssistants({ organizationId: organizationId });
      if (res && res.data) setAssistant(res.data.data);
    };

    fetchAllAssistant();
  }, [getAssistants, organizationId]);

  useEffect(() => {
    if (!isOpen) form.reset();
  }, [isOpen]);

  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="px-[5px] md:px-[25px] pb-[60px] md:pb-[80px] pt-[50px] md:pt-[70px] z-[60] max-w-[calc(100%-20px)] md:max-w-[550px] max-h-[61vh] border-[0px] !rounded-md bg-white [&>button]:border [&>button]:border-border [&>button]:rounded-full [&>button]:p-3 [&>button]:top-2 [&>button]:right-2 [&>button]:text-primary"
      >
        <ScrollArea className="h-[75vh] w-full px-[20px]">
          <DialogHeader className="pb-[40px]">
            <h2 className="text-[30px] text-center text-primary font-colasta font-bold leading-none">
              <span className="font-normal">Phone Number</span>
            </h2>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("space-y-3 flex flex-col gap-1")}
              >
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            setSelectedProviderName(val);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="mt-2" disabled={false}>
                              <SelectValue placeholder="Select Provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[70]">
                            <SelectItem value="twilio">Twilio</SelectItem>
                            <SelectItem value="telnyx">Telnyx</SelectItem>
                            <SelectItem value="vonage">Vonage</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          defaultCountry="AE"
                          value={field.value}
                          className="w-full h-[40px] border-input"
                          onChange={(value) => field.onChange(value)}
                          countrySelectProps={{
                            unicodeFlags: true,
                          }}
                          inputStyle={{
                            padding: "10px",
                            fontSize: "16px",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedProviderName !== "twilio" ? (
                  <FormField
                    control={form.control}
                    name="credentialId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter your credential id"
                            {...field}
                            className="w-full !p-0 !pl-2 outline-0 rounded-md border border-border focus:border-theme"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="twilioAccountSid"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter your twilio account sid"
                              {...field}
                              className="w-full !p-0 !pl-2 outline-0 rounded-md border border-border focus:border-theme"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twilioAuthToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter your twilio auth token"
                              {...field}
                              value={field.value}
                              className="w-full !p-0 !pl-2 outline-0 rounded-md border border-border focus:border-theme"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="assistantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="mt-2 "
                              disabled={getAssistantLoading}
                            >
                              <SelectValue placeholder="Select Assistant" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[70]">
                            {assistant.map((assistant) => (
                              <SelectItem
                                key={assistant.id}
                                value={assistant.id.toString()}
                              >
                                {assistant.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  variant="primary"
                  type="submit"
                  className="w-full rounded-md"
                  disabled={createLeadLoading}
                >
                  <span className="btn-span" data-text="Create">
                    {createLeadLoading ? <Loading /> : "Create"}
                  </span>
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePhone;
