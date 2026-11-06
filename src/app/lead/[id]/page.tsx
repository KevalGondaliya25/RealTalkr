"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useRef, useState } from "react";
import { format, intervalToDuration } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ChevronLeft,
  CircleX,
  Eye,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetVapiPhoneNumbersQuery } from "@/redux/query/call";
import { AllCallsResponseType, VapiPhoneNumber } from "@/types/call";
import {
  MODEL,
  MODEL_PROVIDER,
  STATUS_COLOR,
  TRANSCRIBER,
  TRANSCRIBER_LANGUAGE,
  TRANSCRIBER_MODEL,
  VOICE_ID,
  VOICE_MODEL,
  VOICE_PROVIDER,
} from "@/utils/constant";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import parsePhoneNumber from "libphonenumber-js";
import { toast } from "sonner";
import {
  useUpdateLeadMutation,
  useGetOneLeadsQuery,
  useDeleteLeadMutation,
} from "@/redux/query/lead";
import { LeadBodyType } from "@/types/lead";
import { useParams, useRouter } from "next/navigation";
import { ErrorResponse } from "@/types/response";
import Loading from "@/components/component/Loading";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useLazyGetAllAssistantWithOutPaginationQuery } from "@/redux/query/assistant";
import { useSelector } from "react-redux";
import { selectCurrentOrganizationId } from "@/redux/slice/user";
import { AssistantSelectType } from "@/types/assistant";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  name: z.string().min(2, { message: "Name must be minimum 2 character" }),
  contact: z
    .string({
      required_error: "Please enter a contact.",
    })
    .min(8, { message: "contact must be minimum 8 digit" }),
  executionTime: z.string({
    required_error: "Please select a execution date.",
  }),
  timezone: z
    .string({
      required_error: "Please select a timezone.",
      message: "Please select a timezone.",
    })
    .min(1, { message: "Please select a timezone." }),
  phoneNumber: z
    .string({
      required_error: "Please select a phone number.",
      message: "Please select a phone number.",
    })
    .min(1, { message: "Please select a phone number." }),
  assistantId: z
    .string({
      required_error: "Please select a assistant.",
      message: "Please select a assistant.",
    })
    .min(1, { message: "Please select a assistant." }),
});

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      executionTime: "",
      timezone: "",
      phoneNumber: "",
      assistantId: "",
    },
  });

  const organizationId = useSelector(selectCurrentOrganizationId);
  const [assistant, setAssistant] = useState<Array<AssistantSelectType>>([]);
  const [assistantName, setAssistantName] = useState<string>("");

  const {
    data: phoneNumbersData,
    isLoading: phoneNumberLoading,
    refetch: phoneNumberRefetch,
  } = useGetVapiPhoneNumbersQuery();

  const {
    data: oneLeadData,
    isLoading: getOneLeadLoading,
    refetch: getOneLeadRefetch,
  } = useGetOneLeadsQuery({
    id: params.id,
  });

  const labelStyle = "original";
  const timezones = {
    ...allTimezones,
  };

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const [offSet, setOffSet] = useState<number>(0);

  // Lead useStates
  const [phoneNumbers, setPhoneNumbers] = useState<Array<VapiPhoneNumber>>([]);
  const [callLogs, setCallLogs] = useState<Array<AllCallsResponseType>>([]);
  const [leadStatus, setLeadStatus] = useState<string | null>(null);
  const [isExecutionPause, setIsExecutionPause] = useState<boolean>(false);

  useEffect(() => {
    if (phoneNumbersData && phoneNumbersData.data.length > 0) {
      setPhoneNumbers(phoneNumbersData.data);
    }
  }, [phoneNumbersData]);

  // Model useStates
  const [modelProvider, setModelProvider] = useState<string>("openai");
  const [modelList, setModelList] = useState<Array<string>>(MODEL["openai"]);
  const [modelName, setModelName] = useState<string>(MODEL["openai"][0]);
  const [modelTemperature, setModelTemperature] = useState<number>(0.7);

  const handleSliderChange = (newValue: number[]) => {
    setModelTemperature(newValue[0]);
  };

  // Transcriber useStates
  const [transcriberProvide, setTranscriberProvide] =
    useState<string>("deepgram");
  const [transcriberLanguage, setTranscriberLanguage] = useState<string>(
    TRANSCRIBER_LANGUAGE["deepgram"][0]
  );
  const [transcriberModel, setTranscriberModel] = useState<string | undefined>(
    TRANSCRIBER_MODEL["deepgram"][0]
  );
  const [transcriberLanguageList, setTranscriberLanguageList] = useState<
    Array<string>
  >(TRANSCRIBER_LANGUAGE["deepgram"]);
  const [transcriberModelList, setTranscriberModelList] = useState<
    Array<string>
  >(TRANSCRIBER_MODEL["deepgram"]);

  // Voice useStates
  const [voiceProvider, setVoiceProvider] = useState<string>("11labs");
  const [voiceId, setVoiceId] = useState<string>(VOICE_ID["11labs"][0]);
  const [voiceModel, setVoiceModel] = useState<string | undefined>(
    VOICE_ID["11labs"][0]
  );
  const [voiceIdList, setVoiceIdList] = useState<Array<string>>(
    VOICE_ID["11labs"]
  );
  const [voiceModelList, setVoiceModelList] = useState<Array<string>>(
    VOICE_MODEL["11labs"]
  );
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  // const [getAssistants, { isLoading: getAssistantLoading }] =
  //   useLazyGetAllAssistantWithOutPaginationQuery();

  // useEffect(() => {
  //   const fetchAllAssistant = async () => {
  //     const res = await getAssistants({ organizationId: organizationId });
  //     if (res && res.data) setAssistant(res.data.data);
  //   };

  //   fetchAllAssistant();
  // }, [getAssistants, organizationId]);

  // Set data
  useEffect(() => {
    if (oneLeadData && oneLeadData.data) {
      const { data } = oneLeadData;

      // form data set
      form.setValue("email", data.email);
      form.setValue("name", data.name);
      form.setValue("contact", data.contact);
      form.setValue("phoneNumber", data.phoneNumber || "");
      form.setValue("executionTime", data.executionTime);
      form.setValue("timezone", data.timezone);
      setOffSet(parseTimezone(data.timezone).offset || 0);
      form.setValue("assistantId", `${data.assistantId}`);
      setAssistantName(data.assistant.name);

      // Model set
      setModelProvider(data.assistant.modelProvider);
      setModelList(MODEL[data.assistant.modelProvider]);
      setModelName(data.assistant.modelName);
      setModelTemperature(data.assistant.modelTemperature || 0.7);

      // Transcriber set
      setTranscriberProvide(data.assistant.transcriberProvide);
      setTranscriberLanguage(data.assistant.transcriberLanguage);
      setTranscriberModel(data.assistant.transcriberModel);
      setTranscriberLanguageList(
        TRANSCRIBER_LANGUAGE[data.assistant.transcriberProvide]
      );
      setTranscriberModelList(
        TRANSCRIBER_MODEL[data.assistant.transcriberProvide]
      );

      // Voice set
      setVoiceProvider(data.assistant.voiceProvider);
      setVoiceId(data.assistant.voiceId);
      setVoiceModel(data.assistant.voiceModel || undefined);
      setVoiceIdList(VOICE_ID[data.assistant.voiceProvider]);
      setVoiceModelList(VOICE_MODEL[data.assistant.voiceProvider]);

      // set lead Data
      setLeadStatus(data.status);
      setIsExecutionPause(data.isExecutionPause);
      setCallLogs(data.callLog);
    }
  }, [oneLeadData]);

  const [updateLead, { isLoading }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: deleteLeadLoading }] =
    useDeleteLeadMutation();

  const audioRefs = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<number>();

  const handlePlayPause = (id: number, recUrl: string) => {
    if (audioRefs.current) {
      if (isPlaying === id) {
        setIsPlaying(0);
        audioRefs.current.src = "";
        audioRefs.current.pause();
      } else {
        setIsPlaying(id);
        audioRefs.current.src = recUrl;
        audioRefs.current.load();

        audioRefs.current.oncanplaythrough = () => {
          audioRefs.current?.play().catch((err) => {
            toast.error("Error playing the audio:");
          });
        };
      }
    }
  };

  async function onDelete() {
    try {
      const result = await deleteLead({
        id: Number(params.id),
      }).unwrap();
      if (result.success) {
        toast.success(result.message);
        setDeleteDialog(!deleteDialog);
        router.push("/lead");
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }

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

    const body: Partial<LeadBodyType> = {
      name: data.name,
      email: data.email,
      phoneNumberId: phoneNumberId,
      timezone: data.timezone,
      contact: data.contact,
      countryCode: parsedNumber.country!,
      executionTime: moment(new Date(data.executionTime))
        .subtract(offSet, "hours")
        .format("YYYY-MM-DDTHH:mm:ss[Z]"),
    };

    try {
      const result = await updateLead({
        id: Number(params.id),
        data: body,
      }).unwrap();
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }

  return (
    <>
      <div className="flex-1 rounded-xl bg-sidebar relative">
        {Boolean(getOneLeadLoading || phoneNumberLoading) && (
          <div className="h-full w-full bg-white flex justify-center items-center absolute top-0 z-20 text-theme">
            <Loading />
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex  flex-wrap justify-between items-center mx-4">
              <div className="flex gap-4 items-center ml-1">
                <h1 className="flex my-2 mr-2 py-3 pr-3 text-xl font-semibold">
                  Lead Id : {params.id || ""}
                </h1>
                {leadStatus && (
                  <Badge
                    className={`${STATUS_COLOR[leadStatus]} capitalize text-center`}
                  >
                    {leadStatus}
                  </Badge>
                )}
              </div>
              <div className="flex ">
                <Button
                  type="button"
                  className="!h-[40px] !pt-4 !pb-4 !pl-5 !pr-5 m-2 bg-white text-theme shadow-md"
                  disabled={isLoading}
                  onClick={() => router.push("/lead")}
                >
                  <ChevronLeft className="w-5 h-5" />{" "}
                  <span className="mr-1 max-sm:hidden">Back</span>
                </Button>
                <Button
                  type="button"
                  className="!h-[40px] !pt-4 !pb-4 m-2 !px-3 bg-white text-theme shadow-md"
                  disabled={
                    phoneNumberLoading || isLoading || deleteLeadLoading
                  }
                  onClick={() => setDeleteDialog(!deleteDialog)}
                >
                  <Trash2 />
                </Button>
                {/* <Button
                  type="submit"
                  className="!h-[40px] !pt-4 !pb-4 m-2 bg-theme text-white shadow-md"
                  disabled={
                    phoneNumberLoading || isLoading || deleteLeadLoading
                  }
                >
                  {isLoading ? <Loading /> : "Publish"}
                </Button> */}
              </div>
            </div>
            <div className="grid xl:grid-cols-4 ml-5 items-center lg:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Lead Name</FormLabel>
                    <FormControl>
                      <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                        {field.value}
                      </div>
                      {/* <Input
                        placeholder="Enter a lead name"
                        {...field}
                        className="mt-2"
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Lead Email</FormLabel>
                    <FormControl>
                      <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                        {field.value}
                      </div>
                      {/* <Input
                        placeholder="Enter a email"
                        {...field}
                        className="mt-2 "
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Lead Contact</FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="AE"
                        disabled
                        value={field.value}
                        className="w-full h-[40px] border-input [&>input]:bg-white"
                        onChange={(value) => field.onChange(value)}
                        countrySelectProps={{
                          unicodeFlags: true,
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
                    ? moment
                        .utc(field.value)
                        .utcOffset(offSet * 60)
                        .format("HH:mm")
                    : null;

                  return (
                    <FormItem className="p-1 mr-4">
                      <FormLabel>Execution Date</FormLabel>
                      <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                        {field.value ? (
                          moment
                            .utc(field.value)
                            .utcOffset(offSet * 60)
                            .format("DD MMM, yyyy hh:mm a")
                        ) : (
                          <>-</>
                        )}
                      </div>
                      {/* <Popover>
                        <div className="relative w-full flex justify-center">
                          <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              type="button"
                              className={cn(
                                "!p-0  !pl-2 text-secondary bg-white w-full   !gap-3 !h-[40px] justify-start !text-center font-light text-sm rounded-md",
                                !field.value && "text-muted-foreground",
                                "hover:bg-white hover:text-charcoal"
                              )}
                            >
                              <CalendarIcon />
                              {field.value ? (
                                moment
                                  .utc(field.value)
                                  .utcOffset(offSet * 60)
                                  .format("DD-MM-yyyy HH:mm")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                          </PopoverTrigger>
                          {Boolean(field.value) && (
                            <div className="absolute right-0 top-0 z-10">
                              <CircleX
                                className="h-4 w-4  mb-3 mx-3 mt-3"
                                onClick={() => {
                                  field.onChange(undefined);
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date
                                  ? format(date, "yyyy-MM-dd HH:mm")
                                  : undefined
                              )
                            }
                            initialFocus
                          />
                          <div className="flex items-center gap-4 pl-4 mx-2 mb-2">
                            <div>Time : </div>
                            <TimePicker
                              // use12Hours
                              defaultValue={
                                time ? dayjs(time, "HH:mm") : null
                              }
                              format="HH:mm"
                              onChange={(time, timeString) => {
                                if (field.value && time) {
                                  const date = new Date(field.value);
                                  date.setHours(time.hour());
                                  date.setMinutes(time.minute());
                                  date.setSeconds(time.second());
                                  field.onChange(
                                    format(date, "yyyy-MM-dd HH:mm")
                                  );
                                }
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover> */}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Time Zone</FormLabel>
                    <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                      {field.value}
                    </div>
                    {/* <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOffSet(parseTimezone(value).offset || 0);
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="mt-2"
                          disabled={phoneNumberLoading}
                        >
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options.map((option, index) => (
                          <SelectItem key={index} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Caller Number</FormLabel>
                    <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                      {field.value}
                    </div>
                    {/* <Select
                      onValueChange={(value) => {
                        if (value !== "") field.onChange(value);
                      }}
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
                      <SelectContent>
                        {phoneNumbers.map((phone) => (
                          <SelectItem key={phone.id} value={phone.number}>
                            {phone.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assistantId"
                render={({ field }) => (
                  <FormItem className="p-1 mr-4 xl:col-span-2 lg:col-span-2">
                    <FormLabel>Assistant Name</FormLabel>
                    <FormItem>
                      <FormControl>
                        <div className="w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                          {assistantName}
                        </div>
                        {/* <Select
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
                        </Select> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* <div className="m-4">
              <Tabs defaultValue="Model" className="mt-2">
                <TabsList className="grid grid-cols-3 h-[40px]">
                  <TabsTrigger value="Model">Model</TabsTrigger>
                  <TabsTrigger value="Transcriber">Transcriber</TabsTrigger>
                  <TabsTrigger value="Voice">Voice</TabsTrigger>
                </TabsList>
                <TabsContent value="Model">
                  <Card>
                    <CardHeader>
                      <CardTitle>Model</CardTitle>
                      <CardDescription>
                        This section allows you to configure the model for the
                        assistant.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 flex">
                      <div className="w-full gap-5 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1">
                        <div className="flex flex-col">
                          <FormField
                            control={form.control}
                            name="firstMessage"
                            render={({ field }) => (
                              <FormItem className="space-y-1 mt-1">
                                <FormLabel className="text-base">
                                  First Message
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="This is the first message that the assistant will say."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                              <FormItem className="space-y-1 mt-3">
                                <FormLabel className="text-base">
                                  System Prompt
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="This is a blank template with minimal defaults, you can change the model, temperature, and messages."
                                    className="h-48"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-2 w-full justify-start mt-2">
                          <label className="">
                            Provider
                            <Select
                              value={modelProvider}
                              onValueChange={(value) => {
                                if (value !== "") {
                                  setModelProvider(value);
                                  setModelList(MODEL[value]);
                                  setModelName(MODEL[value][0]);
                                }
                              }}
                            >
                              <SelectTrigger className="mt-2 ">
                                <SelectValue placeholder="Select Provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {MODEL_PROVIDER.map((value) => (
                                    <SelectItem key={value} value={value}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </label>
                          <label className="mt-2">
                            Model
                            <Select
                              value={modelName}
                              onValueChange={(value) => {
                                if (value !== "") setModelName(value);
                              }}
                            >
                              <SelectTrigger className="mt-2 ">
                                <SelectValue placeholder="Select Model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {modelList.map((value) => (
                                    <SelectItem key={value} value={value}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </label>
                          <label className="mt-2">
                            {" "}
                            Temperature
                            <span className="cursor-pointer ml-2">
                              {`(${modelTemperature.toFixed(1)})`}{" "}
                            </span>
                            <Slider
                              value={[modelTemperature]}
                              min={0.1}
                              max={2.0}
                              step={0.1}
                              className={cn("w-[100%] mt-2")}
                              onValueChange={handleSliderChange}
                            />
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="Transcriber">
                  <Card>
                    <CardHeader>
                      <CardTitle>Transcriber</CardTitle>
                      <CardDescription>
                        This section allows you to configure the transcription
                        settings for the assistant.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid  lg:grid-cols-3 justify-start gap-8 items-center grid-cols-1 ">
                        <div>
                          <Label htmlFor="current">Provider</Label>
                          <Select
                            value={transcriberProvide}
                            onValueChange={(value) => {
                              if (value !== "") {
                                setTranscriberProvide(value);
                                setTranscriberLanguageList(
                                  TRANSCRIBER_LANGUAGE[value]
                                );
                                setTranscriberLanguage(
                                  TRANSCRIBER_LANGUAGE[value][0]
                                );
                                setTranscriberModelList(
                                  TRANSCRIBER_MODEL[value]
                                );
                                setTranscriberModel(
                                  TRANSCRIBER_MODEL[value][0] || undefined
                                );
                              }
                            }}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select a Provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {TRANSCRIBER.map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="current">Language</Label>
                          <Select
                            value={transcriberLanguage}
                            onValueChange={(value) => {
                              if (value !== "") setTranscriberLanguage(value);
                            }}
                          >
                            <SelectTrigger className="w-full mt-1 mb-1">
                              <SelectValue placeholder="Select a Language " />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {transcriberLanguageList.map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {transcriberModelList.length > 0 && (
                          <div>
                            <Label htmlFor="current">Model</Label>
                            <Select
                              value={transcriberModel}
                              onValueChange={(value) => {
                                if (value !== "") setTranscriberModel(value);
                              }}
                            >
                              <SelectTrigger className="mb-1 mt-1">
                                <SelectValue placeholder="Select a Model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {transcriberModelList.map((value) => (
                                    <SelectItem key={value} value={value}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="Voice">
                  <Card>
                    <CardHeader>
                      <CardTitle>Voice Configuration</CardTitle>
                      <CardDescription>
                        Choose from the list of voices, or sync your voice
                        library if you are&apos;t able to find your voice in the
                        dropdown. If you are still facing any error, you can
                        enable custom voice and add a voice ID manually.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid  lg:grid-cols-3 justify-start gap-8 items-center grid-cols-1  ">
                        <div>
                          <Label htmlFor="current">Provider</Label>
                          <Select
                            value={voiceProvider}
                            onValueChange={(value) => {
                              if (value !== "") {
                                setVoiceProvider(value);
                                setVoiceIdList(VOICE_ID[value]);
                                setVoiceId(VOICE_ID[value][0]);
                                setVoiceModelList(VOICE_MODEL[value]);
                                setVoiceModel(
                                  VOICE_MODEL[value][0] || undefined
                                );
                              }
                            }}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select a Provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {VOICE_PROVIDER.map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="current">Voice</Label>
                          <Select
                            value={voiceId}
                            onValueChange={(value) => {
                              if (value !== "") setVoiceId(value);
                            }}
                          >
                            <SelectTrigger className=" mt-1 mb-1 ">
                              <SelectValue
                                placeholder="Select a Language "
                                className="p-0"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="p-0">
                                {voiceIdList.map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {voiceModelList.length > 0 && (
                          <div>
                            <Label htmlFor="current">Model</Label>
                            <Select
                              value={voiceModel}
                              onValueChange={(value) => {
                                if (value !== "") setVoiceModel(value);
                              }}
                            >
                              <SelectTrigger className="mt-1 mb-1">
                                <SelectValue placeholder="Select a Model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {voiceModelList.map((value) => (
                                    <SelectItem key={value} value={value}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div> */}
          </form>
        </Form>
        <div className="m-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-charcoal">Call Logs</CardTitle>
            </CardHeader>{" "}
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="text-center">
                    <TableHead className="text-center text-charcoal">
                      Id
                    </TableHead>
                    <TableHead className="text-center text-charcoal">
                      Status
                    </TableHead>
                    <TableHead className="text-center text-charcoal">
                      Ended Reason
                    </TableHead>
                    <TableHead className="text-center text-charcoal">
                      Summary
                    </TableHead>
                    <TableHead className="text-center text-charcoal">
                      Recording
                    </TableHead>
                    <TableHead className="text-center text-charcoal">
                      Duration
                    </TableHead>
                    <TableHead className="text-center text-charcoal">
                      Created
                    </TableHead>
                    <TableHead className="text-center text-charcoal">
                      Action
                    </TableHead>
                    {/* <TableHead className="text-start">Action</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Boolean(callLogs.length > 0) &&
                    callLogs.map((logs: AllCallsResponseType) => {
                      const duration = intervalToDuration({
                        start: 0,
                        end: logs.durationMs,
                      });
                      const callDuration = logs.durationMs
                        ? `${
                            duration.minutes && duration.minutes > 0
                              ? `${duration.minutes} min`
                              : ""
                          } ${
                            duration.seconds && duration.seconds > 0
                              ? `${duration.seconds} sec`
                              : ""
                          }`
                        : "";
                      return (
                        <TableRow key={logs.id}>
                          <TableCell
                            // onClick={() => router.push(`/call-logs/${logs.id}`)}
                            className="font-medium text-center text-charcoal"
                          >
                            {logs.id}
                          </TableCell>
                          <TableCell
                            // onClick={() => router.push(`/call-logs/${logs.id}`)}
                            className="text-center text-charcoal"
                          >
                            <Badge
                              className={`${
                                STATUS_COLOR[logs.callStatus.toLowerCase()]
                              } capitalize text-center`}
                            >
                              {logs.callStatus}
                            </Badge>
                          </TableCell>
                          <TableCell
                            // onClick={() => router.push(`/call-logs/${logs.id}`)}
                            className="text-center text-charcoal"
                          >
                            <Tooltip>
                              <TooltipTrigger
                                asChild
                                className="relative max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-charcoal capitalize cursor-pointer"
                              >
                                <span>
                                  {logs.endedReason
                                    ? logs.endedReason &&
                                      logs.endedReason.length > 20
                                      ? `${logs.endedReason
                                          .replaceAll("-", " ")
                                          .toLowerCase()
                                          .slice(0, 20)}...`
                                      : logs.endedReason
                                          .replaceAll("-", " ")
                                          .toLowerCase()
                                    : ""}
                                </span>
                              </TooltipTrigger>
                              {logs.endedReason && (
                                <TooltipContent
                                  side="bottom"
                                  align="center"
                                  className="rounded-lg shadow-lg max-w-xs text-charcoal"
                                >
                                  <span className="capitalize">
                                    {logs.endedReason
                                      .replaceAll("-", " ")
                                      .toLowerCase()}
                                  </span>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            // onClick={() => router.push(`/call-logs/${logs.id}`)}
                            className="text-center text-charcoal"
                          >
                            <Tooltip>
                              <TooltipTrigger
                                asChild
                                className="relative max-w-xs overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                              >
                                <span>
                                  {logs.summary
                                    ? logs.summary && logs.summary.length > 30
                                      ? `${logs.summary.slice(0, 30)}...`
                                      : logs.summary
                                    : ""}
                                </span>
                              </TooltipTrigger>
                              {logs.summary && (
                                <TooltipContent
                                  side="bottom"
                                  align="center"
                                  className="rounded-lg shadow-lg max-w-xs text-charcoal"
                                >
                                  <span>{logs.summary}</span>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-center text-charcoal">
                            <Button
                              onClick={() =>
                                handlePlayPause(logs.id, logs.recordingUrl)
                              }
                              className="!p-0"
                              disabled={logs.durationMs <= 0}
                            >
                              {isPlaying === logs.id ? <Pause /> : <Play />}
                            </Button>
                          </TableCell>
                          <TableCell
                            // onClick={() => router.push(`/call-logs/${logs.id}`)}
                            className="text-center text-charcoal"
                          >
                            {callDuration}
                          </TableCell>
                          <TableCell
                            // onClick={() => router.push(`/call-logs/${logs.id}`)}
                            className="text-center text-charcoal"
                          >
                            {format(
                              new Date(logs.createdAt),
                              "dd-MMM-yyyy HH:mm a"
                            )}
                          </TableCell>
                          <TableCell
                            // onClick={() => router.push(`/call-logs/${logs.id}`)}
                            className="text-center text-charcoal"
                          >
                            <Button
                              onClick={() =>
                                router.push(`/call-logs/${logs.id}`)
                              }
                              className="!p-0 "
                            >
                              <Eye className="p-0.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <audio ref={audioRefs} src={audioRefs ? audioRefs?.current?.src : ""} />
      </div>

      <Dialog
        open={deleteDialog}
        onOpenChange={(open) => setDeleteDialog(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-start">
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogClose onClick={() => setDeleteDialog(!deleteDialog)} />
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2">
            <Button
              type="submit"
              className="border-2 border-theme !h-7 text-theme hover:bg-theme-300 w-full"
              onClick={() => setDeleteDialog(!deleteDialog)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-theme !h-7 text-white w-full"
              onClick={onDelete}
              disabled={deleteLeadLoading}
            >
              {deleteLeadLoading ? <Loading /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
