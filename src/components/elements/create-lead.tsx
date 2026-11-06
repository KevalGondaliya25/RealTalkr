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

type Props = {
  isOpen: boolean;
  close: () => void;
  fetchLead: () => void;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be minimum 2 character" }),
  contact: z
    .string({
      required_error: "Please enter a contact.",
    })
    .min(8, { message: "contact must be minimum 8 digit" }),
  executionTime: z
    .string({
      required_error: "Please select a execution date.",
    })
    .min(1, { message: "Please select a execution date." }),
  phoneNumber: z
    .string({
      required_error: "Please select a phone number.",
      message: "Please select a phone number.",
    })
    .min(1, { message: "Please select a phone number." }),
  timezone: z
    .string({
      required_error: "Please select a timezone.",
      message: "Please select a timezone.",
    })
    .min(1, { message: "Please select a timezone." }),
  assistantId: z
    .string({
      required_error: "Please select a assistant.",
      message: "Please select a assistant.",
    })
    .min(1, { message: "Please select a assistant." }),
  email: z.string().email().nullable(),
});

const CreateLead = ({ isOpen, close, fetchLead }: Props) => {
  const [assistant, setAssistant] = useState<Array<AssistantSelectType>>([]);
  // Lead useStates
  const [phoneNumbers, setPhoneNumbers] = useState<Array<VapiPhoneNumber>>([]);
  const [offSet, setOffSet] = useState<number>(TIMEZONE_OFFSET.offset);
  const organizationId = useSelector(selectCurrentOrganizationId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: null,
      contact: "",
      executionTime: "",
      timezone: TIMEZONE_OFFSET.timezone,
      phoneNumber: "",
      assistantId: "",
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
  const [createLead, { isLoading: createLeadLoading }] =
    useCreateLeadMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const phoneNumberId = phoneNumbers.find(
      (phone) => phone.number === values.phoneNumber
    )?.id;

    if (!phoneNumberId) {
      toast.error("Phone number not found.");
      return;
    }

    const parsedNumber = parsePhoneNumber(values.contact);

    if (!parsedNumber) {
      toast.error("Country code not found.");
      return;
    }

    const body: SingleLeadBodyType = {
      name: values.name,
      email: values.email || undefined,
      phoneNumberId: phoneNumberId,
      timezone: values.timezone,
      organizationId: organizationId,
      contact: values.contact,
      countryCode: parsedNumber.country!,
      assistantId: Number(values.assistantId),
      // executionTime: moment(new Date(values.executionTime))
      //   .subtract(offSet, "hours")
      //   .format("YYYY-MM-DDTHH:mm:ss[Z]"),
      executionTime: moment(new Date(values.executionTime))
        .subtract(offSet * 60, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss[Z]"),
    };

    try {
      const result = await createLead(body).unwrap();
      if (result.success) {
        toast.success(result.message);
        close();
        fetchLead();
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
        className="px-[5px] md:px-[25px] pb-[60px] md:pb-[80px] pt-[50px] md:pt-[70px] z-[60] max-w-[calc(100%-20px)] md:max-w-[550px] max-h-[90vh] border-[0px] !rounded-md bg-white [&>button]:border [&>button]:border-border [&>button]:rounded-full [&>button]:p-3 [&>button]:top-2 [&>button]:right-2 [&>button]:text-primary"
      >
        <ScrollArea className="h-[75vh] w-full px-[20px]">
          <DialogHeader className="pb-[40px]">
            <h2 className="text-[30px] text-center text-primary font-colasta font-bold leading-none">
              <span className="font-normal">Call Lead</span>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          value={field.value || undefined}
                          onChange={(e) => {
                            if (e.target.value && e.target.value !== "") {
                              field.onChange(e.target.value);
                            } else {
                              field.onChange(null);
                            }
                          }}
                          className="w-full !p-0 !pl-2 outline-0 rounded-md border border-border focus:border-theme"
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
                <FormField
                  control={form.control}
                  name="executionTime"
                  render={({ field }) => {
                    const time = field.value
                      ? format(new Date(field.value), "HH:mm")
                      : null;
                    return (
                      <FormItem>
                        <Popover>
                          <div className="relative w-full flex justify-center">
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "!p-0 !pl-2 text-secondary bg-white w-full !gap-3 !h-[40px] justify-start !text-center font-light text-sm rounded-md",
                                    !field.value && "text-muted-foreground",
                                    "hover:bg-white hover:text-charcoal"
                                  )}
                                >
                                  <CalendarIcon />
                                  {field.value ? (
                                    format(
                                      new Date(field.value),
                                      "dd-MM-yyyy HH:mm"
                                    )
                                  ) : (
                                    <span className="text-gray-500 normal-case">Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            {Boolean(field.value) && (
                              <div className="absolute right-0 top-0 z-[70]">
                                <CircleX
                                  className="h-4 w-4  mb-3 mx-3 mt-3"
                                  onClick={() => {
                                    field.onChange(undefined);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <PopoverContent
                            className="w-auto p-0 z-[70]"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              className="z-[70]"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  const time = new Date(field.value);
                                  time.setFullYear(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate()
                                  );
                                  field.onChange(
                                    format(time, "yyyy-MM-dd HH:mm")
                                  );
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                              initialFocus
                            />
                            <div className="flex items-center gap-4 pl-4 mx-2 mb-2">
                              <div>Time : </div>
                              <TimePicker
                                // use12Hours
                                defaultValue={
                                  time ? dayjs(time, "HH:mm") : null
                                }
                                value={time ? dayjs(time, "HH:mm") : null}
                                format="HH:mm"
                                onChange={(time, timeString) => {
                                  if (field.value && time) {
                                    const date = new Date(field.value);
                                    date.setHours(
                                      time.hour(),
                                      time.minute(),
                                      time.second()
                                    );
                                    field.onChange(
                                      format(date, "yyyy-MM-dd HH:mm")
                                    );
                                  } else {
                                    const date = new Date();
                                    date.setHours(0, 0, 0, 0);
                                    field.onChange(
                                      moment(date).format(
                                        "YYYY-MM-DDTHH:mm:ss[Z]"
                                      )
                                    );
                                  }
                                }}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setOffSet(parseTimezone(value).offset || 0);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="mt-2 "
                            disabled={phoneNumberLoading}
                          >
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[70]">
                          {options.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="mt-2 "
                            disabled={phoneNumberLoading}
                          >
                            <SelectValue placeholder="Select caller number" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[70]">
                          {phoneNumbers.map((phone) => (
                            <SelectItem key={phone.id} value={phone.number}>
                              {phone.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

export default CreateLead;
