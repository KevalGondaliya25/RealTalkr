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
import {
  useCreateLeadMutation,
  useGetOneLeadsQuery,
  useUpdateLeadMutation,
} from "@/redux/query/lead";
import { useLazyGetAllAssistantWithOutPaginationQuery } from "@/redux/query/assistant";
import { AssistantSelectType } from "@/types/assistant";

type Props = {
  isOpen: boolean;
  close: () => void;
  id: string;
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

const EditLead = ({ isOpen, close, id, fetchLead }: Props) => {
  const [assistant, setAssistant] = useState<Array<AssistantSelectType>>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<Array<VapiPhoneNumber>>([]);
  const [offSet, setOffSet] = useState<number>(0);

  const organizationId = useSelector(selectCurrentOrganizationId);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: null,
      contact: "",
      executionTime: "",
      timezone: "",
      phoneNumber: "",
      assistantId: "",
    },
  });
  const [preservedDate, setPreservedDate] = useState<Date | undefined>(
    undefined
  );

  const [getAssistants, { isLoading: getAssistantLoading }] =
    useLazyGetAllAssistantWithOutPaginationQuery();
  const {
    data: oneLeadData,
    isFetching: getOneLeadIsFetching,
    refetch: fetchLeadData,
  } = useGetOneLeadsQuery({ id: id });

  const [updateLead, { isLoading: updateLoading }] = useUpdateLeadMutation();

  useEffect(() => {
    fetchLeadData();
  }, [fetchLead]);

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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const phoneNumberId = phoneNumbers.find(
      (phone) => phone.number === data.phoneNumber
    )?.id;

    if (!phoneNumberId) {
      toast.error("Phone number not found.");
      return;
    }

    const parsedNumber = parsePhoneNumber(data.contact);

    if (!parsedNumber) {
      toast.error("Country code not found.");
      return;
    }

    const body: Partial<SingleLeadBodyType> = {
      name: data.name,
      email: data.email || undefined,
      contact: data.contact,
      countryCode: parsedNumber.country!,
      // executionTime: moment(new Date(data.executionTime))
      //   .subtract(offSet, "hours")
      //   .format("YYYY-MM-DDTHH:mm:ss[Z]"),
      executionTime: moment
        .utc(data.executionTime)
        .subtract(offSet * 60, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss[Z]"),
      timezone: data.timezone,
      phoneNumberId: phoneNumberId,
    };

    try {
      const result = await updateLead({
        id: Number(id),
        data: body,
      }).unwrap();
      if (result.success) {
        toast.success(result.message);
        fetchLead();
        close();
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
    form.reset();
    setPreservedDate(undefined);
    if (isOpen && id) {
      if (oneLeadData && oneLeadData.data) {
        const { data } = oneLeadData;

        // form data set
        form.setValue("email", data.email || null);
        form.setValue("name", data.name);
        form.setValue("contact", data.contact);
        form.setValue("phoneNumber", data.phoneNumber || "");
        const timeOffset = parseTimezone(data.timezone).offset || 0;
        setOffSet(timeOffset);
        const executionDate = moment
          .utc(data.executionTime)
          .add(timeOffset * 60, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss[Z]");
        form.setValue("executionTime", executionDate);
        const utcString = executionDate ? executionDate : undefined;
        const [datePart, timePart] = utcString
          ? utcString.split("T")
          : [undefined, undefined];
        const timeWithoutZ = timePart ? timePart.replace("Z", "") : undefined;
        const preservedDate =
          datePart && timeWithoutZ
            ? new Date(`${datePart}T${timeWithoutZ}`)
            : undefined;
        setPreservedDate(preservedDate);
        form.setValue("timezone", data.timezone);
        form.setValue("assistantId", data.assistantId.toString());
      }
    }
  }, [isOpen, id, oneLeadData]);

  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="px-[5px] md:px-[25px] pb-[60px] md:pb-[80px] pt-[50px] md:pt-[70px] z-[60] max-w-[calc(100%-20px)] md:max-w-[550px] max-h-[90vh] border-[0px] !rounded-md bg-white [&>button]:border [&>button]:border-border [&>button]:rounded-full [&>button]:p-3 [&>button]:top-2 [&>button]:right-2 [&>button]:text-primary"
      >
        <ScrollArea className="h-[75vh] w-full px-[20px]">
          {getOneLeadIsFetching && (
            <div className="fixed inset-0 flex items-center text-theme justify-center backdrop-blur-sm bg-white/50 z-[80]">
              <Loading />
            </div>
          )}
          <DialogHeader className="pb-[40px]">
            <h2 className="text-[30px] text-center text-primary font-colasta font-bold leading-none">
              <span className="font-normal">Update Lead</span>
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
                                    moment
                                      .utc(field.value)
                                      .format("DD-MM-yyyy HH:mm")
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
                                    form.setValue("executionTime", "");
                                    setPreservedDate(undefined);
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
                                preservedDate ? preservedDate : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  const preservedTime = preservedDate || date;

                                  const newTime = new Date(preservedTime);

                                  newTime.setFullYear(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate()
                                  );

                                  field.onChange(
                                    moment(newTime).format(
                                      "YYYY-MM-DDTHH:mm:ss[Z]"
                                    )
                                  );
                                  setPreservedDate(newTime);
                                } else {
                                  form.setValue("executionTime", "");
                                  setPreservedDate(undefined);
                                }
                              }}
                              // initialFocus
                            />
                            <div className="flex items-center gap-4 pl-4 mx-2 mb-2">
                              <div>Time : </div>
                              <TimePicker
                                // use12Hours
                                // defaultValue={
                                //   field.value
                                //     ? dayjs(
                                //         moment.utc(field.value).format("HH:mm"),
                                //         "HH:mm"
                                //       )
                                //     : null
                                // }
                                value={
                                  field.value
                                    ? dayjs(
                                        moment.utc(field.value).format("HH:mm"),
                                        "HH:mm"
                                      )
                                    : null
                                }
                                format="HH:mm"
                                onChange={(time, timeString) => {
                                  if (time) {
                                    const date = preservedDate || new Date();
                                    date.setHours(
                                      time.hour(),
                                      time.minute(),
                                      time.second()
                                    );
                                    field.onChange(
                                      moment(date).format(
                                        "YYYY-MM-DDTHH:mm:ss[Z]"
                                      )
                                    );
                                    setPreservedDate(date);
                                  } else {
                                    const date = preservedDate || new Date();
                                    date.setHours(0, 0, 0, 0);
                                    field.onChange(
                                      moment(date).format(
                                        "YYYY-MM-DDTHH:mm:ss[Z]"
                                      )
                                    );
                                    setPreservedDate(date);
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
                        value={field.value}
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
                  rules={{
                    required: "Phone number is required",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
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
                          value={field.value}
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
                  disabled={updateLoading}
                >
                  <span className="btn-span" data-text="Update">
                    {updateLoading ? <Loading /> : "Update"}
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

export default EditLead;
