"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeft, CircleX } from "lucide-react";
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
import { VapiPhoneNumber } from "@/types/call";
import {
  MODEL,
  MODEL_PROVIDER,
  TIMEZONE_OFFSET,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCreateLeadMutation } from "@/redux/query/lead";
import { LeadBodyType } from "@/types/lead";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/types/response";
import { useSelector } from "react-redux";
import { selectCurrentOrganizationId } from "@/redux/slice/user";
import Loading from "@/components/component/Loading";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";

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
  assistantName: z
    .string()
    .min(2, { message: "Assistant name must be minimum 2 character" }),
  firstMessage: z.string().min(10, { message: "Please write first message." }),
  prompt: z
    .string()
    .min(10, { message: "Please write system prompt message." }),
});

export default function Page() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      executionTime: "",
      timezone: TIMEZONE_OFFSET.timezone,
      phoneNumber: "",
      assistantName: "",
      firstMessage: "",
      prompt: "",
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

  const [offSet, setOffSet] = useState<number>(TIMEZONE_OFFSET.offset);

  const { data: phoneNumbersData, isLoading: phoneNumberLoading } =
    useGetVapiPhoneNumbersQuery();

  const organizationId = useSelector(selectCurrentOrganizationId);

  // Lead useStates
  const [phoneNumbers, setPhoneNumbers] = useState<Array<VapiPhoneNumber>>([]);

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

  useEffect(() => {
    setModelList(MODEL[modelProvider]);
    setModelName(MODEL[modelProvider][0]);
  }, [modelProvider]);

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

  useEffect(() => {
    setTranscriberLanguageList(TRANSCRIBER_LANGUAGE[transcriberProvide]);
    setTranscriberLanguage(TRANSCRIBER_LANGUAGE[transcriberProvide][0]);
    setTranscriberModelList(TRANSCRIBER_MODEL[transcriberProvide]);
    setTranscriberModel(TRANSCRIBER_MODEL[transcriberProvide][0] || undefined);
  }, [transcriberProvide]);

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

  useEffect(() => {
    setVoiceIdList(VOICE_ID[voiceProvider]);
    setVoiceId(VOICE_ID[voiceProvider][0]);
    setVoiceModelList(VOICE_MODEL[voiceProvider]);
    setVoiceModel(VOICE_MODEL[voiceProvider][0] || undefined);
  }, [voiceProvider]);

  const [createLead, { isLoading }] = useCreateLeadMutation();

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

    const body: LeadBodyType = {
      name: data.name,
      email: data.email,
      contact: data.contact,
      countryCode: parsedNumber.country!,
      organizationId: organizationId,
      modelTemperature: modelTemperature,
      executionTime: moment(new Date(data.executionTime))
        .subtract(offSet, "hours")
        .format("YYYY-MM-DDTHH:mm:ss[Z]"),
      isExecutionPause: false,
      timezone: data.timezone,
      phoneNumberId: phoneNumberId,
      assistantName: data.assistantName,
      firstMessage: data.firstMessage,
      transcriberProvide: transcriberProvide,
      transcriberLanguage: transcriberLanguage,
      transcriberModel: transcriberModel,
      voiceModel: voiceModel,
      voiceId: voiceId,
      voiceProvider: voiceProvider,
      modelProvider: modelProvider,
      modelName: modelName,
      modelMessage: [
        {
          role: "system",
          content: data.prompt,
        },
      ],
    };

    try {
      // const result = await createLead(body).unwrap();
      // if (result.success) {
      //   toast.success(result.message);
      //   router.push("/lead");
      // }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }

  return (
    <>
      <div className="flex-1 rounded-xl bg-sidebar">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="flex justify-between items-center">
              <h1 className="flex m-2 p-3 text-theme text-xl font-semibold">
                Create Lead
              </h1>
              <div className="flex">
                <Button
                  type="button"
                  className="!h-[40px] !pt-4 !pb-4 !pl-5 !pr-5 m-2 bg-white text-theme shadow-md"
                  disabled={isLoading}
                  onClick={() => router.push("/lead")}
                >
                  <ChevronLeft className="w-5 h-5" />{" "}
                  <span className="mr-1">Back</span>
                </Button>
                <Button
                  type="submit"
                  className="!h-[40px] !pt-4 !pb-4 m-2 border-2 border-theme text-theme bg-theme-300"
                  disabled={phoneNumberLoading || isLoading}
                >
                  {isLoading ? <Loading /> : "Create"}
                </Button>
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
                      <Input
                        placeholder="Enter a lead name"
                        {...field}
                        className="mt-2 "
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
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Lead Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a email"
                        {...field}
                        className="mt-2 "
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
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Lead Contact</FormLabel>
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
                    <FormItem className="p-1 mr-4">
                      <FormLabel>Execution Date</FormLabel>
                      <Popover>
                        <div className="relative w-full flex justify-center">
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "!p-0  !pl-2 text-secondary bg-white w-full   !gap-3 !h-[40px] justify-start !text-center font-light text-sm rounded-md",
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
                              defaultValue={time ? dayjs(time, "HH:mm") : null}
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
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Select time zone</FormLabel>
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
                      <SelectContent>
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
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Select caller number</FormLabel>
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
                      <SelectContent>
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
                name="assistantName"
                render={({ field }) => (
                  <FormItem className="p-1 mr-4">
                    <FormLabel>Assistant Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your assistant name"
                        {...field}
                        className="mt-2 "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="m-4">
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
                              onValueChange={(value) => setModelProvider(value)}
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
                              onValueChange={(value) => setModelName(value)}
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
                            onValueChange={(value) =>
                              setTranscriberProvide(value)
                            }
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
                            onValueChange={(value) =>
                              setTranscriberLanguage(value)
                            }
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
                          {/* Pro tip: If you want to support both English and Spanish, you can set the language to multi and use ElevenLabs Turbo 2.5 in the Voice tab. */}
                        </div>
                        {transcriberModelList.length > 0 && (
                          <div>
                            <Label htmlFor="current">Model</Label>
                            <Select
                              value={transcriberModel}
                              onValueChange={(value) =>
                                setTranscriberModel(value)
                              }
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
                            onValueChange={(value) => setVoiceProvider(value)}
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
                            onValueChange={(value) => setVoiceId(value)}
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
                          {/* Pro tip: If you want to support both English and Spanish, you can set the language to multi and use ElevenLabs Turbo 2.5 in the Voice tab. */}
                        </div>
                        {voiceModelList.length > 0 && (
                          <div>
                            <Label htmlFor="current">Model</Label>
                            <Select
                              value={voiceModel}
                              onValueChange={(value) => setVoiceModel(value)}
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
                        {/* <div className="ml-1 flex gap-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms"> Add voice id manually</Label>
                  </div> */}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </form>
        </Form>
        {/* </Form> */}
      </div>
      <Dialog
      // open={isCreateLead}
      // onOpenChange={(open) => setIsCreateLead(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Lead</DialogTitle>
            {/* <DialogClose onClick={() => setIsCreateLead(!isCreateLead)} /> */}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={cn("space-y-3")}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            {...field}
                            className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[15px] border border-border focus:border-theme"
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
                            className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[15px] border border-border focus:border-theme"
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
                            className="w-full h-[50px] md:h-[60px] px-[16px] md:px-[30px] outline-0 rounded-[15px] border border-border focus:border-theme"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full rounded-[15px] !mt-[42px]"
                    disabled={isLoading}
                  >
                    <span className="btn-span" data-text="Login">
                      {isLoading ? <Loading /> : "Create"}
                    </span>
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          {/* <DialogFooter>
              <Button
                type="submit"
                className="bg-theme !h-7 text-white"
                disabled={isLoading || orgName === ""}
                onClick={onSubmit}
              >
                Create
              </Button>
            </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
