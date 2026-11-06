"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { ChevronLeft, ChevronUp, ChevronDown, Info, Check } from "lucide-react";
import Loading from "@/components/component/Loading";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectCurrentOrganizationId,
  selectCurrentUser,
  selectCurrentUserId,
} from "@/redux/slice/user";
import { useGetVapiPhoneNumbersQuery } from "@/redux/query/call";
import { VapiPhoneNumber } from "@/types/call";

import { useUploadFileMutation } from "@/redux/query/upload";
import { useCreateAssistantMutation } from "@/redux/query/assistant";
import { AssistantBodyType } from "@/types/assistant";
import { ErrorResponse } from "@/types/response";
import { toast } from "sonner";

import { useGetModelsQuery } from "@/redux/query/model";
import { ModelPayload, Provider, Model } from "@/types/models";

import { CustomSlider } from "@/components/component/Slider/CustomSlider";
import { ToggleSwitch } from "@/components/component/ToggleSwitch/ToggleSwitch";
import IconImg from "@/components/component/IconImg";
import { prettifyPayload } from "@/utils/pretifyModel"; // <-- add this
import { USER_TYPE } from "@/utils/constant";

// Local replacements (were in constants before)
const LOWEST_TO_HIGHEST = [
  "low",
  "lower-mid",
  "mid",
  "upper-mid",
  "high",
] as const;
const PUNCTUATION_CHOICES = [",", ".", "!", "?", ";", ":"];

// Optional emotion list for playht
const PLAYHT_EMOTIONS = [
  { label: "None", value: "none" },
  { label: "Happy", value: "happy" },
  { label: "Sad", value: "sad" },
  { label: "Excited", value: "excited" },
  { label: "Calm", value: "calm" },
];

const formSchema = z.object({
  assistantName: z
    .string()
    .min(2, "Assistant name must be minimum 2 characters")
    .max(40, "Assistant name cannot be more than 40 characters"),
  firstMessage: z
    .string()
    .min(10, "First message must be at least 10 characters"),
  prompt: z.string().min(10, "System prompt must be at least 10 characters"),
  demo: z.boolean().default(false).optional(),
});

export default function Page() {
  const router = useRouter();
  const organizationId = useSelector(selectCurrentOrganizationId);
  const userId = useSelector(selectCurrentUserId);
  const user = useSelector(selectCurrentUser);

  // Queries
  const { data: phoneNumbersData } = useGetVapiPhoneNumbersQuery();
  const { data: modelPayload, isLoading: modelsLoading } = useGetModelsQuery();

  // Phone numbers
  const [phoneNumbers, setPhoneNumbers] = useState<VapiPhoneNumber[]>([]);
  useEffect(() => {
    if (phoneNumbersData?.data?.length) setPhoneNumbers(phoneNumbersData.data);
  }, [phoneNumbersData]);

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assistantName: "",
      demo: false,
      firstMessage: "",
      prompt: "",
    },
  });

  // Image upload
  const [assistantImg, setAssistantImg] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string | undefined>();
  const [uploadFile, { isLoading: uploadFileLoading }] =
    useUploadFileMutation();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const fd = new FormData();
    fd.append("file", e.target.files[0]);
    try {
      const result = await uploadFile(fd).unwrap();
      if (result.success) {
        const f = result.data.file[0];
        setAssistantImg(f.url);
        setFileName(f.fileName);
        setType(f.type);
      }
    } catch {
      /* ignore */
    }
  };

  // Model State (dynamic from API)
  const [modelProviderId, setModelProviderId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [modelTemperature, setModelTemperature] = useState<number>(0.7);

  // Transcriber State
  const [transcriberProviderId, setTranscriberProviderId] =
    useState<string>("");
  const [transcriberLanguageCode, setTranscriberLanguageCode] =
    useState<string>("");
  const [transcriberModelId, setTranscriberModelId] = useState<string>("");

  // Voice State
  const [voiceProviderId, setVoiceProviderId] = useState<string>("");
  const [voiceId, setVoiceId] = useState<string>("");
  const [voiceModelId, setVoiceModelId] = useState<string>("");
  const [isAddVoiceManually, setIsAddVoiceManually] = useState(false);
  const [manualVoiceId, setManualVoiceId] = useState("");
  const [manualVoiceIdError, setManualVoiceIdError] = useState("");

  // Additional / advanced voice config
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isStartCollapsed, setIsStartCollapsed] = useState(false);
  const [isStopCollapsed, setIsStopCollapsed] = useState(false);

  // Cartesia
  const [speedValue, setSpeedValue] = useState(4);
  const [customSpeedEnabled, setCustomSpeedEnabled] = useState(false);
  const [angerValue, setAngerValue] = useState(2);
  const [positivityValue, setPositivityValue] = useState(2);
  const [surpriseValue, setSurpriseValue] = useState(2);
  const [sadnessValue, setSadnessValue] = useState(2);
  const [curiosityValue, setCuriosityValue] = useState(2);

  // playht
  const [playhtSpeed, setPlayhtSpeed] = useState<number>(5);
  const [playhtTemperature, setPlayhtTemperature] = useState<number>(0.1);
  const [voiceGuidance, setVoiceGuidance] = useState<number | null>(null);
  const [styleGuidance, setStyleGuidance] = useState<number | null>(null);
  const [textGuidance, setTextGuidance] = useState<number | null>(null);
  const [voicePlayhtEmotion, setVoicePlayhtEmotion] = useState<
    string | undefined
  >();

  // 11labs
  const [stability, setStability] = useState(0.8);
  const [clarity, setClarity] = useState(0.7);
  const [speed, setSpeed] = useState(1.1);
  const [styleExaggeration, setStyleExaggeration] = useState(0.8);
  const [streamingLatency, setStreamingLatency] = useState<number | null>(null);
  const [speakerBoost, setSpeakerBoost] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  // Other voice providers
  const [lmntSpeed, setLmntSpeed] = useState(0.25);
  const [openAiSpeed, setOpenAiSpeed] = useState(0.25);
  const [azureSpeed, setAzureSpeed] = useState(0.5);
  const [smallestSpeed, setSmallestSpeed] = useState(0.5);
  const [remiSpeed, setRemiSpeed] = useState(0.5);
  const [humeDescription, setHumeDescription] = useState("");
  const [phoneMize, setPhoneMize] = useState(false);
  const [reduceSwitch, setReduceSwitch] = useState(false);
  const [inlineSwitch, setInlineSwitch] = useState(false);
  const [speedAlpha, setSpeedAlpha] = useState("");

  // Background sound & punctuation
  const [voiceBackgroundSound, setVoiceBackgroundSound] = useState("off");
  const [voiceUrl, setVoiceUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [voiceInputMinCharacters, setVoiceInputMinCharacters] = useState(0);
  const [punctuationSelected, setPunctuationSelected] = useState<string[]>([]);

  const togglePunctuation = (p: string) =>
    setPunctuationSelected((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  // Start speaking plan
  const [smartSelect, setSmartSelect] = useState<string>("off");
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [onPuncSeconds, setOnPuncSeconds] = useState(0);
  const [onNoPuncSeconds, setOnNoPuncSeconds] = useState(0);
  const [onNumberSeconds, setOnNumberSeconds] = useState(0);
  const [baseWaitFn, setBaseWaitFn] = useState(0);
  const [scalarWaitFn, setScalarWaitFn] = useState(1000);

  // Stop speaking plan
  const [stopNumWords, setStopNumWords] = useState(0);
  const [stopVoiceSeconds, setStopVoiceSeconds] = useState(0);
  const [stopBackoffSeconds, setStopBackoffSeconds] = useState(0);

  // Derive providers from API (avoids repeated null checks)
  const prettyModelPayload = useMemo(
    () => (modelPayload ? prettifyPayload(modelPayload) : undefined),
    [modelPayload]
  );

  // Hide all models marked as deleted
  const filteredModelPayload = useMemo(() => {
    if (!prettyModelPayload) return undefined;
    const stripDeleted = (providers: Provider[] = []) =>
      providers.map((p) => ({
        ...p,
        models: (p.models || []).filter((m) => !m.deleted),
      }));
    return {
      model: stripDeleted(prettyModelPayload.model || []),
      transcriber: stripDeleted(prettyModelPayload.transcriber || []),
      voice: stripDeleted(prettyModelPayload.voice || []),
    } as ModelPayload;
  }, [prettyModelPayload]);

  const modelProviders: Provider[] = filteredModelPayload?.model ?? [];
  const transcriberProviders: Provider[] =
    filteredModelPayload?.transcriber ?? [];
  const voiceProviders: Provider[] = filteredModelPayload?.voice ?? [];

  // Initialize defaults after data loads
  useEffect(() => {
    if (modelsLoading || !prettyModelPayload) return;

    if (!modelProviderId && modelProviders.length) {
      const p = modelProviders[0];
      setModelProviderId(p.id);
      if (p.models?.length) setModelId(p.models[0].id);
    }
    if (!transcriberProviderId && transcriberProviders.length) {
      const tp = transcriberProviders[0];
      setTranscriberProviderId(tp.id);
      if (tp.languages?.length)
        setTranscriberLanguageCode(tp.languages[0].code);
      if (tp.models?.length) setTranscriberModelId(tp.models[0].id);
    }
    if (!voiceProviderId && voiceProviders.length) {
      const vp = voiceProviders[0];
      setVoiceProviderId(vp.id);
      if (vp.voices?.length) setVoiceId(vp.voices[0]);
      if (vp.models?.length) setVoiceModelId(vp.models[0].id);
    }
  }, [
    modelsLoading,
    prettyModelPayload,
    modelProviders,
    transcriberProviders,
    voiceProviders,
    modelProviderId,
    transcriberProviderId,
    voiceProviderId,
  ]);

  // Update dependent selections on provider changes
  useEffect(() => {
    const p = modelProviders.find((m) => m.id === modelProviderId);
    if (p && p.models?.length) {
      if (!p.models.find((m) => m.id === modelId)) {
        setModelId(p.models[0].id);
      }
    } else {
      setModelId("");
    }
  }, [modelProviderId, modelProviders, modelId]);

  useEffect(() => {
    const p = transcriberProviders.find((t) => t.id === transcriberProviderId);

    if (p) {
      if (p.languages?.length) {
        if (!p.languages.find((l) => l.code === transcriberLanguageCode)) {
          setTranscriberLanguageCode(p.languages[0].code);
        }
      } else {
        setTranscriberLanguageCode("");
      }
      if (p.models?.length) {
        if (!p.models.find((m) => m.id === transcriberModelId)) {
          setTranscriberModelId(p.models[0].id);
        }
      } else {
        setTranscriberModelId("");
      }
    } else {
      setTranscriberLanguageCode("");
      setTranscriberModelId("");
    }
  }, [
    transcriberProviderId,
    transcriberProviders,
    transcriberLanguageCode,
    transcriberModelId,
  ]);

  useEffect(() => {
    const p = voiceProviders.find((v) => v.id === voiceProviderId);
    if (p) {
      if (p.voices?.length) {
        if (!p.voices.includes(voiceId)) setVoiceId(p.voices[0]);
      } else {
        setVoiceId("");
      }
      if (p.models?.length) {
        if (!p.models.find((m) => m.id === voiceModelId)) {
          setVoiceModelId(p.models[0].id);
        }
      } else {
        setVoiceModelId("");
      }
    } else {
      setVoiceId("");
      setVoiceModelId("");
    }
    setIsAddVoiceManually(false);
    setManualVoiceId("");
    setManualVoiceIdError("");
  }, [voiceProviderId, voiceProviders, voiceId, voiceModelId]);

  // URL validation
  const handleUrlChange = (val: string) => {
    try {
      new URL(val);
      setVoiceUrl(val);
      setUrlError("");
    } catch {
      setVoiceUrl(val);
      setUrlError("Please enter a valid URL.");
    }
  };

  // Punctuation list display data
  const punctuationDisplay = useMemo(
    () =>
      PUNCTUATION_CHOICES.map((p) => ({
        value: p,
        label: p,
      })),
    []
  );

  // Submit
  const [createAssistant, { isLoading: createLoading }] =
    useCreateAssistantMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const body: AssistantBodyType = {
      assistantName: values.assistantName,
      isDemo: values.demo,
      userId: user?.role === USER_TYPE.ADMIN ? userId || undefined : undefined,
      assistantImg,
      fileName: type,
      fileType: fileName,
      firstMessage: values.firstMessage,
      modelTemperature,

      modelProvider: modelProviderId,
      modelName: modelId,

      transcriberProvide: transcriberProviderId,
      transcriberLanguage: transcriberLanguageCode,
      transcriberModel: transcriberModelId || undefined,

      voiceProvider: voiceProviderId,
      voiceId:
        isAddVoiceManually ||
        (voiceProviders.find((p) => p.id === voiceProviderId)?.voices?.length ??
          0) === 0
          ? manualVoiceId
          : voiceId,
      voiceModel: voiceModelId || undefined,

      organizationId,
      modelMessage: [{ role: "system", content: values.prompt }],

      // Start plan
      startSpeakingPlanWaitSeconds: waitSeconds,
      startSpeakingPlanSmartEndpointingPlan: smartSelect,
      startSpeakingPlanOnPunctuationSeconds: onPuncSeconds,
      startSpeakingPlanOnNoPunctuationSeconds: onNoPuncSeconds,
      startSpeakingPlanOnNumberSeconds: onNumberSeconds,

      // Stop plan
      stopSpeakingPlanNumWords: stopNumWords,
      stopSpeakingPlanVoiceSeconds: stopVoiceSeconds,
      stopSpeakingPlanBackoffSeconds: stopBackoffSeconds,
    };

    if (smartSelect === "livekit") {
      body.startSpeakingPlanWaitFunctionBaseValue = baseWaitFn;
      body.startSpeakingPlanWaitFunctionScaleValue = scalarWaitFn;
    }

    if (voiceBackgroundSound !== "default") {
      body.voiceBackgroundSound =
        voiceBackgroundSound !== "custom" ? voiceBackgroundSound : voiceUrl;
    }
    if (voiceInputMinCharacters > 0) {
      body.voiceInputMinCharacters = voiceInputMinCharacters;
    }
    if (punctuationSelected.length > 0) {
      body.voiceInputPunctuationBoundaries = punctuationSelected;
    }

    // Voice provider specific
    if (voiceProviderId === "11labs") {
      body.voiceStability = stability;
      body.voiceSimilarityBoost = clarity;
      body.voiceSpeed = speed;
      body.voiceStyle = styleExaggeration;
      body.voiceOptimizeStreamingLatency = streamingLatency || undefined;
      body.voiceUseSpeakerBoost = speakerBoost;
      body.voiceAutoMode = autoMode;
    }
    if (voiceProviderId === "lmnt") body.voiceSpeed = lmntSpeed;
    if (voiceProviderId === "openai") body.voiceSpeed = openAiSpeed;
    if (voiceProviderId === "azure") body.voiceSpeed = azureSpeed;
    if (voiceProviderId === "smallest-ai") body.voiceSpeed = smallestSpeed;
    if (voiceProviderId === "rime-ai") {
      body.voiceSpeed = remiSpeed;
      body.voicePhonemizeBetweenBrackets = phoneMize;
      body.voiceReduceLatency = reduceSwitch;
      body.voicePauseBetweenBrackets = inlineSwitch;
      body.voiceInlineSpeedAlpha = speedAlpha;
    }
    if (voiceProviderId === "hume") {
      body.voiceDescription = humeDescription;
    }
    if (voiceProviderId === "cartesia") {
      const emo: string[] = [];
      if (angerValue !== 2) emo.push(`anger:${LOWEST_TO_HIGHEST[angerValue]}`);
      if (positivityValue !== 2)
        emo.push(`positivity:${LOWEST_TO_HIGHEST[positivityValue]}`);
      if (surpriseValue !== 2)
        emo.push(`surprise:${LOWEST_TO_HIGHEST[surpriseValue]}`);
      if (sadnessValue !== 2)
        emo.push(`sadness:${LOWEST_TO_HIGHEST[sadnessValue]}`);
      if (curiosityValue !== 2)
        emo.push(`curiosity:${LOWEST_TO_HIGHEST[curiosityValue]}`);
      body.voiceEmotion = emo;
      body.voiceSpeed = speedValue;
      body.voiceCustomSpeed = customSpeedEnabled;
    }
    if (voiceProviderId === "playht") {
      if (voicePlayhtEmotion) body.voicePlayhtEmotion = voicePlayhtEmotion;
      if (textGuidance !== null) body.voiceTextGuidance = textGuidance;
      if (styleGuidance !== null) body.voiceStyleGuidance = styleGuidance;
      if (voiceGuidance !== null) body.voiceVoiceGuidance = voiceGuidance;
      body.voiceTemperature = playhtTemperature;
      body.voiceSpeed = playhtSpeed;
    }

    try {
      const res = await createAssistant(body).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/assistant");
      }
    } catch (e) {
      toast.error((e as ErrorResponse).data?.message || "Error");
    }
  };

  // Manual voice id validation
  useEffect(() => {
    if (
      isAddVoiceManually ||
      (voiceProviders.find((p) => p.id === voiceProviderId)?.voices?.length ??
        0) === 0
    ) {
      if (!manualVoiceId.trim()) {
        setManualVoiceIdError("Voice ID is required when adding manually.");
      } else {
        setManualVoiceIdError("");
      }
    } else {
      setManualVoiceIdError("");
    }
  }, [isAddVoiceManually, manualVoiceId, voiceProviderId, voiceProviders]);

  const loadingAny = modelsLoading;

  return (
    <div className="flex-1 rounded-xl bg-sidebar">
      {loadingAny && (
        <div className="h-full w-full bg-white flex justify-center items-center absolute top-0 z-20">
          <Loading />
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="flex m-2 p-3 text-theme text-xl font-semibold">
              Create Assistant
            </h1>
            <div className="flex mr-2">
              <Button
                type="button"
                className="!h-10 !py-4 !px-5 max-[425px]:!px-3 my-2 bg-white text-theme shadow-md"
                disabled={createLoading}
                onClick={() => router.push("/assistant")}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="mr-1 max-[425px]:hidden">Back</span>
              </Button>
              <Button
                type="submit"
                className="!h-[40px] !pt-4 !pb-4 max-[425px]:!w-20 m-2 border-2 border-theme text-theme hover:bg-theme-300"
                disabled={createLoading || loadingAny}
              >
                {createLoading ? <Loading /> : "Create"}
              </Button>
            </div>
          </div>

          {/* Avatar + Name */}
          <div className="flex gap-4 ml-5 items-center">
            <div className="flex justify-center items-center">
              {!uploadFileLoading ? (
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-center"
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/svg"
                    className="hidden"
                    disabled={createLoading}
                    onChange={onFileChange}
                  />
                  <Avatar className="size-20">
                    <AvatarImage
                      className="object-cover"
                      src={
                        assistantImg || "/assets/images/assistant/assistant.png"
                      }
                    />
                    <AvatarFallback>RT</AvatarFallback>
                  </Avatar>
                </label>
              ) : (
                <div className="size-20 flex items-center justify-center bg-white rounded-full">
                  <Loading />
                </div>
              )}
            </div>
            <FormField
              control={form.control}
              name="assistantName"
              render={({ field }) => (
                <FormItem className="p-1 mr-4 w-full">
                  <FormLabel>Assistant Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter assistant name"
                      {...field}
                      className="mt-2 w-full max-w-52"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="m-4">
            <Tabs defaultValue="Model" className="mt-2">
              <TabsList className="grid grid-cols-4 h-[40px]">
                <TabsTrigger value="Model">Model</TabsTrigger>
                <TabsTrigger value="Transcriber">Transcriber</TabsTrigger>
                <TabsTrigger value="Voice">Voice</TabsTrigger>
                <TabsTrigger value="Advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* MODEL TAB */}
              <TabsContent value="Model">
                <Card>
                  <CardHeader>
                    <CardTitle>Model</CardTitle>
                    <CardDescription>
                      Configure the language model.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 flex">
                    <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 gap-5">
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
                                  placeholder="First message the assistant will say."
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
                                  placeholder="System instructions / persona."
                                  className="h-48"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-full mt-2">
                        <label>
                          Provider
                          <Select
                            value={modelProviderId}
                            onValueChange={setModelProviderId}
                            disabled={!modelProviders.length}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select Provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {modelProviders.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    <span className="flex items-center">
                                      <IconImg
                                        name={p.icon!}
                                        className="inline-block h-4 w-4 mr-2"
                                        alt={`${p.name} Provided by RealTalkr`}
                                      />
                                      {p.name}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </label>
                        <label className="mt-2">
                          Model
                          <Select
                            value={modelId}
                            onValueChange={setModelId}
                            disabled={
                              !modelProviders.find(
                                (p) => p.id === modelProviderId
                              )?.models?.length
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select Model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {modelProviders
                                  .find((p) => p.id === modelProviderId)
                                  ?.models?.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                      <span className="font-bold">
                                        {m.name}{" "}
                                        <span className="text-xs block font-normal">
                                          {m.id}
                                        </span>
                                      </span>
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </label>
                        <label className="mt-2">
                          Temperature
                          <span className="ml-2">
                            ({modelTemperature.toFixed(1)})
                          </span>
                          <Slider
                            value={[modelTemperature]}
                            min={0.1}
                            max={2}
                            step={0.1}
                            className="mt-2"
                            onValueChange={(v) => setModelTemperature(v[0])}
                          />
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TRANSCRIBER */}
              <TabsContent value="Transcriber">
                <Card>
                  <CardHeader>
                    <CardTitle>Transcriber</CardTitle>
                    <CardDescription>
                      Configure transcription settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      <div>
                        <Label>Provider</Label>
                        <Select
                          value={transcriberProviderId}
                          onValueChange={setTranscriberProviderId}
                          disabled={!transcriberProviders.length}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {transcriberProviders.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  <span className="flex items-center">
                                    <IconImg
                                      name={p.icon!}
                                      className="inline-block h-4 w-4 mr-2"
                                      alt={`${p.name} Provided by RealTalkr`}
                                    />
                                    {p.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Language</Label>
                        <Select
                          value={transcriberLanguageCode}
                          onValueChange={setTranscriberLanguageCode}
                          disabled={
                            !transcriberProviders.find(
                              (p) => p.id === transcriberProviderId
                            )?.languages?.length
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {transcriberProviders
                                .find((p) => p.id === transcriberProviderId)
                                ?.languages?.map((l) => (
                                  <SelectItem key={l.code} value={l.code}>
                                    {l.name || l.code}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Model</Label>
                        <Select
                          value={transcriberModelId}
                          onValueChange={setTranscriberModelId}
                          disabled={
                            !transcriberProviders.find(
                              (p) => p.id === transcriberProviderId
                            )?.models?.length
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {transcriberProviders
                                .find((p) => p.id === transcriberProviderId)
                                ?.models?.map((m) => (
                                  <SelectItem key={m.id} value={m.id}>
                                    <span className="font-bold">
                                      {m.name}{" "}
                                      <span className="text-xs block font-normal">
                                        {m.id}
                                      </span>
                                    </span>
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* VOICE */}
              <TabsContent value="Voice">
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Configuration</CardTitle>
                    <CardDescription>
                      Choose provider, voice ID and (optional) voice model.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                      <div>
                        <Label>Provider</Label>
                        <Select
                          value={voiceProviderId}
                          onValueChange={setVoiceProviderId}
                          disabled={!voiceProviders.length}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {voiceProviders.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  <span className="flex items-center">
                                    <IconImg
                                      name={p.icon!}
                                      className="inline-block h-4 w-4 mr-2"
                                      alt={`${p.name} Provided by RealTalkr`}
                                    />
                                    {p.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          className={cn(
                            (isAddVoiceManually && !manualVoiceId.trim()) ||
                              (voiceProviders.find(
                                (p) => p.id === voiceProviderId
                              )?.voices?.length === 0 &&
                                !manualVoiceId.trim())
                              ? "text-destructive"
                              : ""
                          )}
                        >
                          Voice
                        </Label>
                        {isAddVoiceManually ||
                        (voiceProviders.find((p) => p.id === voiceProviderId)
                          ?.voices?.length ?? 0) === 0 ? (
                          <>
                            <Input
                              className="mt-1"
                              placeholder="Enter Voice ID"
                              value={manualVoiceId}
                              onChange={(e) => setManualVoiceId(e.target.value)}
                            />
                            {manualVoiceIdError && (
                              <p className="text-destructive text-xs mt-1">
                                {manualVoiceIdError}
                              </p>
                            )}
                          </>
                        ) : (
                          <Select
                            value={voiceId}
                            onValueChange={setVoiceId}
                            disabled={
                              !voiceProviders.find(
                                (p) => p.id === voiceProviderId
                              )?.voices?.length
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select Voice" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {voiceProviders
                                  .find((p) => p.id === voiceProviderId)
                                  ?.voices?.map((v) => (
                                    <SelectItem key={v} value={v}>
                                      {v}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <div>
                        <Label>Model</Label>

                        <Select
                          value={voiceModelId}
                          onValueChange={setVoiceModelId}
                          disabled={
                            !voiceProviders.find(
                              (p) => p.id === voiceProviderId
                            )?.models?.length
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {voiceProviders
                                .find((p) => p.id === voiceProviderId)
                                ?.models?.map((m) => (
                                  <SelectItem key={m.id} value={m.id}>
                                    <span className="font-bold">
                                      {m.name}{" "}
                                      <span className="text-xs block font-normal">
                                        {m.id}
                                      </span>
                                    </span>
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {voiceProviderId === "11labs" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="manualVoice"
                          checked={isAddVoiceManually}
                          onCheckedChange={(c) =>
                            setIsAddVoiceManually(Boolean(c))
                          }
                        />
                        <label
                          htmlFor="manualVoice"
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          Add Voice ID Manually
                        </label>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Configuration */}
                <div className="flex-1 rounded-xl mt-2">
                  <Card>
                    <div className="w-full">
                      <div className="rounded-lg bg-white text-charcoal overflow-hidden">
                        <div className="p-6 pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <h2 className="text-xl font-semibold">
                              Additional Configuration
                            </h2>
                            <button
                              type="button"
                              onClick={() => setIsCollapsed(!isCollapsed)}
                              className="text-gray-400"
                            >
                              {isCollapsed ? (
                                <ChevronDown size={24} />
                              ) : (
                                <ChevronUp size={24} />
                              )}
                            </button>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">
                            Configure advanced voice settings.
                          </p>
                        </div>

                        {!isCollapsed && (
                          <div className="px-6 pb-6">
                            {/* Background sound + URL + Min chars */}
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <div className="flex items-center mb-1">
                                  <label className="text-sm font-medium">
                                    Background Sound
                                  </label>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info
                                          size={14}
                                          className="ml-2 text-gray-400 cursor-pointer"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent className="w-64">
                                        <p className="text-[12px]">
                                          Background sound ambience.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <Select
                                  value={voiceBackgroundSound}
                                  onValueChange={setVoiceBackgroundSound}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="off">Off</SelectItem>
                                    <SelectItem value="office">
                                      Office
                                    </SelectItem>
                                    <SelectItem value="default">
                                      Default
                                    </SelectItem>
                                    <SelectItem value="custom">
                                      Custom
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <div className="flex items-center mb-1">
                                  <label className="text-sm font-medium">
                                    Background Sound URL
                                  </label>
                                </div>
                                <Input
                                  placeholder="https://example.com/audio.mp3"
                                  value={voiceUrl}
                                  disabled={voiceBackgroundSound !== "custom"}
                                  onChange={(e) =>
                                    handleUrlChange(e.target.value)
                                  }
                                />
                                {urlError && (
                                  <p className="text-xs text-red-500 mt-1">
                                    {urlError}
                                  </p>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center mb-1">
                                  <label className="text-sm font-medium">
                                    Input Min Characters
                                  </label>
                                </div>
                                <Input
                                  type="number"
                                  value={voiceInputMinCharacters}
                                  onChange={(e) =>
                                    setVoiceInputMinCharacters(
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* Punctuation Boundaries */}
                            <div className="mb-6">
                              <label className="text-sm font-medium mb-1 block">
                                Punctuation Boundaries
                              </label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <div className="w-full border px-4 py-2 rounded-md flex justify-between items-center cursor-pointer">
                                    <div className="flex flex-wrap gap-1">
                                      {punctuationSelected.length > 0 ? (
                                        punctuationSelected.map((val) => (
                                          <span
                                            key={val}
                                            className="px-2 py-0.5 text-xs border rounded-md text-muted-foreground"
                                          >
                                            {val}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-sm text-muted-foreground">
                                          None selected
                                        </span>
                                      )}
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="p-2 w-[--radix-popover-trigger-width]"
                                  align="start"
                                  sideOffset={4}
                                >
                                  <div className="flex flex-col space-y-1">
                                    {punctuationDisplay.map((item) => (
                                      <div
                                        key={item.value}
                                        onClick={() =>
                                          togglePunctuation(item.value)
                                        }
                                        className={cn(
                                          "flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-theme hover:text-white",
                                          punctuationSelected.includes(
                                            item.value
                                          ) && "bg-theme text-white"
                                        )}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4",
                                            punctuationSelected.includes(
                                              item.value
                                            )
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <span>{item.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Provider-specific sections (subset) */}
                            {voiceProviderId === "11labs" && (
                              <div className="space-y-6">
                                <CustomSlider
                                  label="Stability"
                                  value={stability}
                                  min={0}
                                  max={1}
                                  step={0.1}
                                  valueDisplay={stability}
                                  leftLabel="Variable"
                                  rightLabel="Stable"
                                  onChange={setStability}
                                />
                                <CustomSlider
                                  label="Clarity + Similarity"
                                  value={clarity}
                                  min={0}
                                  max={1}
                                  step={0.1}
                                  valueDisplay={clarity}
                                  leftLabel="Low"
                                  rightLabel="High"
                                  onChange={setClarity}
                                />
                                <CustomSlider
                                  label="Speed"
                                  value={speed}
                                  min={0.7}
                                  max={1.2}
                                  step={0.1}
                                  valueDisplay={speed}
                                  leftLabel="Slower"
                                  rightLabel="Faster"
                                  onChange={setSpeed}
                                />
                                <CustomSlider
                                  label="Style Exaggeration"
                                  value={styleExaggeration}
                                  min={0}
                                  max={1}
                                  step={0.1}
                                  valueDisplay={styleExaggeration}
                                  leftLabel="None"
                                  rightLabel="Exaggerated"
                                  onChange={setStyleExaggeration}
                                />
                                <CustomSlider
                                  label="Optimize Streaming Latency"
                                  value={streamingLatency || 0}
                                  min={1}
                                  max={4}
                                  step={1}
                                  valueDisplay={
                                    streamingLatency !== null
                                      ? streamingLatency
                                      : "N/A"
                                  }
                                  leftLabel="More"
                                  rightLabel="Less"
                                  onChange={setStreamingLatency}
                                />
                                <ToggleSwitch
                                  title="Use Speaker Boost"
                                  description="Boost similarity to original voice."
                                  checked={speakerBoost}
                                  onCheckedChange={setSpeakerBoost}
                                />
                                <ToggleSwitch
                                  title="Auto Mode"
                                  description="Lower latency for full sentences."
                                  checked={autoMode}
                                  onCheckedChange={setAutoMode}
                                />
                              </div>
                            )}

                            {voiceProviderId === "playht" && (
                              <div className="space-y-6">
                                <div>
                                  <label className="text-sm font-medium">
                                    Emotion
                                  </label>
                                  <Select
                                    value={voicePlayhtEmotion}
                                    onValueChange={setVoicePlayhtEmotion}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select Emotion" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {PLAYHT_EMOTIONS.map((e) => (
                                        <SelectItem
                                          key={e.value}
                                          value={e.value}
                                        >
                                          {e.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {[
                                  {
                                    label: "Speed",
                                    value: playhtSpeed,
                                    setValue: setPlayhtSpeed,
                                    min: 0.1,
                                    max: 5,
                                  },
                                  {
                                    label: "Temperature",
                                    value: playhtTemperature,
                                    setValue: setPlayhtTemperature,
                                    min: 0.1,
                                    max: 2,
                                  },
                                ].map((s) => (
                                  <div key={s.label}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm font-medium">
                                        {s.label}
                                      </span>
                                      <span className="text-theme text-sm">
                                        {s.value}
                                      </span>
                                    </div>
                                    <Slider
                                      value={[s.value]}
                                      onValueChange={(v) => s.setValue(v[0])}
                                      min={s.min}
                                      max={s.max}
                                      step={0.1}
                                    />
                                  </div>
                                ))}
                                {/* Guidance sliders */}
                                {[
                                  {
                                    label: "Voice Guidance",
                                    value: voiceGuidance,
                                    set: setVoiceGuidance,
                                    min: 1,
                                    max: 6,
                                  },
                                  {
                                    label: "Style Guidance",
                                    value: styleGuidance,
                                    set: setStyleGuidance,
                                    min: 1,
                                    max: 30,
                                  },
                                  {
                                    label: "Text Guidance",
                                    value: textGuidance,
                                    set: setTextGuidance,
                                    min: 1,
                                    max: 2,
                                  },
                                ].map((g) => (
                                  <div key={g.label}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm font-medium">
                                        {g.label}
                                      </span>
                                      <span className="text-theme text-sm">
                                        {g.value ?? "N/A"}
                                      </span>
                                    </div>
                                    <Slider
                                      value={
                                        g.value !== null ? [g.value] : [g.min]
                                      }
                                      onValueChange={(v) => g.set(v[0])}
                                      min={g.min}
                                      max={g.max}
                                      step={1}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {voiceProviderId === "lmnt" && (
                              <CustomSlider
                                label="Speed"
                                value={lmntSpeed}
                                min={0.25}
                                max={2}
                                step={0.1}
                                valueDisplay={lmntSpeed}
                                leftLabel="Slow"
                                rightLabel="Fast"
                                onChange={setLmntSpeed}
                              />
                            )}

                            {voiceProviderId === "openai" && (
                              <CustomSlider
                                label="Speed"
                                value={openAiSpeed}
                                min={0.25}
                                max={2}
                                step={0.1}
                                valueDisplay={openAiSpeed}
                                leftLabel="Slow"
                                rightLabel="Fast"
                                onChange={setOpenAiSpeed}
                              />
                            )}

                            {voiceProviderId === "azure" && (
                              <CustomSlider
                                label="Speed"
                                value={azureSpeed}
                                min={0.5}
                                max={2}
                                step={0.1}
                                valueDisplay={azureSpeed}
                                leftLabel="Slow"
                                rightLabel="Fast"
                                onChange={setAzureSpeed}
                              />
                            )}

                            {voiceProviderId === "smallest-ai" && (
                              <CustomSlider
                                label="Speed"
                                value={smallestSpeed}
                                min={0.5}
                                max={2}
                                step={0.1}
                                valueDisplay={smallestSpeed}
                                leftLabel="Slow"
                                rightLabel="Fast"
                                onChange={setSmallestSpeed}
                              />
                            )}

                            {voiceProviderId === "rime-ai" && (
                              <div className="space-y-6">
                                <CustomSlider
                                  label="Speed"
                                  value={remiSpeed}
                                  min={0.5}
                                  max={2}
                                  step={0.1}
                                  valueDisplay={remiSpeed}
                                  leftLabel="Slow"
                                  rightLabel="Fast"
                                  onChange={setRemiSpeed}
                                />
                                <ToggleSwitch
                                  title="Phonemize Between Brackets"
                                  description="Add pauses with bracket values."
                                  checked={phoneMize}
                                  onCheckedChange={setPhoneMize}
                                />
                                <ToggleSwitch
                                  title="Reduce Latency"
                                  description="Slightly lower quality, faster."
                                  checked={reduceSwitch}
                                  onCheckedChange={setReduceSwitch}
                                />
                                <ToggleSwitch
                                  title="Inline Speed Alpha"
                                  description="Adjust speed via inline alpha."
                                  checked={inlineSwitch}
                                  onCheckedChange={setInlineSwitch}
                                />
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <p className="text-sm">
                                      Inline Speed Alpha
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Provide custom inline speed parameter.
                                    </p>
                                  </div>
                                  <Input
                                    className="w-40"
                                    value={speedAlpha}
                                    onChange={(e) =>
                                      setSpeedAlpha(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            )}

                            {voiceProviderId === "hume" && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Description
                                </label>
                                <Textarea
                                  value={humeDescription}
                                  onChange={(e) =>
                                    setHumeDescription(e.target.value)
                                  }
                                  placeholder="Describe desired voice style."
                                  className="min-h-[180px]"
                                />
                              </div>
                            )}

                            {voiceProviderId === "cartesia" && (
                              <div className="space-y-6">
                                {/* Emotion sliders */}
                                {[
                                  {
                                    label: "Anger",
                                    value: angerValue,
                                    set: setAngerValue,
                                  },
                                  {
                                    label: "Positivity",
                                    value: positivityValue,
                                    set: setPositivityValue,
                                  },
                                  {
                                    label: "Surprise",
                                    value: surpriseValue,
                                    set: setSurpriseValue,
                                  },
                                  {
                                    label: "Sadness",
                                    value: sadnessValue,
                                    set: setSadnessValue,
                                  },
                                  {
                                    label: "Curiosity",
                                    value: curiosityValue,
                                    set: setCuriosityValue,
                                  },
                                ].map((e) => (
                                  <div key={e.label}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm font-medium">
                                        {e.label} ({LOWEST_TO_HIGHEST[e.value]})
                                      </span>
                                    </div>
                                    <Slider
                                      value={[e.value]}
                                      min={0}
                                      max={4}
                                      step={1}
                                      onValueChange={(v) => e.set(v[0])}
                                    />
                                  </div>
                                ))}
                                <CustomSlider
                                  label="Speed"
                                  value={speedValue}
                                  min={0}
                                  max={8}
                                  step={1}
                                  valueDisplay={speedValue}
                                  leftLabel="Slow"
                                  rightLabel="Fast"
                                  onChange={setSpeedValue}
                                />
                                <ToggleSwitch
                                  title="Custom Speed Enabled"
                                  description="Enable custom speed adjustments."
                                  checked={customSpeedEnabled}
                                  onCheckedChange={setCustomSpeedEnabled}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* ADVANCED */}
              <TabsContent value="Advanced">
                <div className="flex-1 rounded-xl mt-2">
                  <Card>
                    <div className="w-full">
                      <div className="rounded-lg bg-white text-charcoal overflow-hidden">
                        <div className="p-6 pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <h2 className="text-xl font-semibold">
                              Start Speaking Plan
                            </h2>
                            <button
                              type="button"
                              onClick={() =>
                                setIsStartCollapsed(!isStartCollapsed)
                              }
                              className="text-gray-400"
                            >
                              {isStartCollapsed ? (
                                <ChevronDown size={24} />
                              ) : (
                                <ChevronUp size={24} />
                              )}
                            </button>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">
                            When should the assistant begin speaking?
                          </p>
                        </div>
                      </div>
                    </div>

                    {!isStartCollapsed && (
                      <div className="px-6 pb-6">
                        {/* Wait seconds */}
                        <div className="mb-6 flex items-center gap-5 max-md:flex-col max-md:items-start">
                          <div className="flex items-start gap-3">
                            <div>
                              <h4 className="text-sm font-medium">
                                Wait Seconds
                              </h4>
                              <p className="text-xs text-zinc-500">
                                Delay before speaking.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center w-full">
                            <span className="text-xs text-gray-400 mr-2">
                              0
                            </span>
                            <Slider
                              value={[waitSeconds]}
                              min={0}
                              max={2}
                              step={0.1}
                              onValueChange={(v) => setWaitSeconds(v[0])}
                            />
                            <span className="text-xs text-gray-400 ml-2">
                              2
                            </span>
                          </div>
                          <div className="min-w-[48px] px-3 py-2 rounded-md border border-[#ebedef] text-theme text-center">
                            {waitSeconds.toFixed(1)}
                          </div>
                        </div>

                        {/* Smart endpointing */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-3">
                            <div className="space-y-0.5">
                              <h4 className="text-sm">Smart Endpointing</h4>
                              <p className="text-xs text-gray-500">
                                More accurate detection. LiveKit English only.
                              </p>
                            </div>
                            <div className="w-32">
                              <Select
                                value={smartSelect}
                                onValueChange={setSmartSelect}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="off">Off</SelectItem>
                                  <SelectItem value="livekit">
                                    LiveKit
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {smartSelect === "livekit" ? (
                          <div className="space-y-6 mt-4">
                            <CustomSlider
                              label="Base value (ms)"
                              value={baseWaitFn}
                              min={0}
                              max={1000}
                              step={10}
                              valueDisplay={baseWaitFn}
                              leftLabel=""
                              rightLabel=""
                              onChange={setBaseWaitFn}
                            />
                            <CustomSlider
                              label="Scalar value"
                              value={scalarWaitFn}
                              min={0}
                              max={20000}
                              step={500}
                              valueDisplay={scalarWaitFn}
                              leftLabel=""
                              rightLabel=""
                              onChange={setScalarWaitFn}
                            />
                            <div className="bg-sidebar p-3 text-sm">
                              Function: {baseWaitFn} + {scalarWaitFn} * x
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="h-px bg-[#ebedef] my-6" />
                            {[
                              {
                                label: "On Punctuation Seconds",
                                value: onPuncSeconds,
                                set: setOnPuncSeconds,
                                max: 3,
                              },
                              {
                                label: "On No Punctuation Seconds",
                                value: onNoPuncSeconds,
                                set: setOnNoPuncSeconds,
                                max: 3,
                              },
                              {
                                label: "On Number Seconds",
                                value: onNumberSeconds,
                                set: setOnNumberSeconds,
                                max: 3,
                              },
                            ].map((cfg) => (
                              <div
                                key={cfg.label}
                                className="mb-6 flex items-center gap-5 max-md:flex-col max-md:items-start"
                              >
                                <div className="flex items-start gap-3">
                                  <div>
                                    <h4 className="text-sm font-medium">
                                      {cfg.label}
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                      Minimum seconds threshold.
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center w-full">
                                  <span className="text-xs text-gray-400 mr-2">
                                    0
                                  </span>
                                  <Slider
                                    value={[cfg.value]}
                                    min={0}
                                    max={cfg.max}
                                    step={0.1}
                                    onValueChange={(v) => cfg.set(v[0])}
                                  />
                                  <span className="text-xs text-gray-400 ml-2">
                                    {cfg.max}
                                  </span>
                                </div>
                                <div className="min-w-[48px] px-3 py-2 rounded-md border border-[#ebedef] text-theme text-center">
                                  {cfg.value.toFixed(1)}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </Card>

                  {/* Stop speaking plan */}
                  <Card className="mt-5">
                    <div className="w-full">
                      <div className="rounded-lg bg-white text-charcoal overflow-hidden">
                        <div className="p-6 pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <h2 className="text-xl font-semibold">
                              Stop Speaking Plan
                            </h2>
                            <button
                              type="button"
                              onClick={() =>
                                setIsStopCollapsed(!isStopCollapsed)
                              }
                              className="text-gray-400"
                            >
                              {isStopCollapsed ? (
                                <ChevronDown size={24} />
                              ) : (
                                <ChevronUp size={24} />
                              )}
                            </button>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">
                            When should the assistant stop speaking?
                          </p>
                        </div>
                      </div>
                    </div>

                    {!isStopCollapsed && (
                      <div className="px-6 pb-6">
                        {[
                          {
                            label: "Number of words",
                            value: stopNumWords,
                            set: setStopNumWords,
                            max: 10,
                            step: 1,
                          },
                          {
                            label: "Voice seconds",
                            value: stopVoiceSeconds,
                            set: setStopVoiceSeconds,
                            max: 0.5,
                            step: 0.1,
                          },
                          {
                            label: "Backoff seconds",
                            value: stopBackoffSeconds,
                            set: setStopBackoffSeconds,
                            max: 10,
                            step: 1,
                          },
                        ].map((cfg) => (
                          <div
                            key={cfg.label}
                            className="mb-6 flex items-center gap-5 max-md:flex-col max-md:items-start"
                          >
                            <div className="flex items-start gap-3">
                              <div>
                                <h4 className="text-sm font-medium">
                                  {cfg.label}
                                </h4>
                                <p className="text-xs text-zinc-500">
                                  Configure threshold.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center w-full">
                              <span className="text-xs text-gray-400 mr-2">
                                0
                              </span>
                              <Slider
                                value={[cfg.value]}
                                min={0}
                                max={cfg.max}
                                step={cfg.step}
                                onValueChange={(v) => cfg.set(v[0])}
                              />
                              <span className="text-xs text-gray-400 ml-2">
                                {cfg.max}
                              </span>
                            </div>
                            <div className="min-w-[48px] px-3 py-2 rounded-md border border-[#ebedef] text-theme text-center">
                              {cfg.value.toFixed(2).replace(/\.?0+$/, "")}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </Form>
    </div>
  );
}
