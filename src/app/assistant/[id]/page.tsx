"use client";
import React, { useEffect, useMemo, useState } from "react";
import Vapi from "@vapi-ai/web";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ToggleSwitch } from "@/components/component/ToggleSwitch/ToggleSwitch";
import { CustomSlider } from "@/components/component/Slider/CustomSlider";
import Loading from "@/components/component/Loading";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Phone,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  useGetOneAssistantQuery,
  useUpdateAssistantMutation,
  useDeleteAssistantMutation,
} from "@/redux/query/assistant";
import { useUploadFileMutation } from "@/redux/query/upload";
import { useGetModelsQuery } from "@/redux/query/model";

import type { Provider, Language, ModelPayload } from "@/types/models";
import { ErrorResponse } from "@/types/response";
import { AssistantBodyType } from "@/types/assistant";

// Retain only neutral UI constants (not provider/model maps)
import {
  frameworksList,
  LowestToHighest,
  playhtEmotion,
  SlowestToFastest,
} from "@/utils/constant";
import IconImg from "@/components/component/IconImg";
import { prettifyPayload } from "@/utils/pretifyModel";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC!);

const formSchema = z.object({
  assistantName: z.string().min(2).max(40),
  firstMessage: z.string().min(10),
  prompt: z.string().min(10),
});

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { assistantName: "", firstMessage: "", prompt: "" },
  });

  // Assistant query
  const {
    data: oneAssistantData,
    isLoading: getOneAssistantLoading,
  } = useGetOneAssistantQuery({ id: Number(params.id) });

  // Models / Providers payload
  const { data: modelPayload, isLoading: modelsLoading } = useGetModelsQuery();

  // Audio preview
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isCallStarted, setIsCallStarted] = useState(false);

  // Assistant meta
  const [assistantStatus, setAssistantStatus] = useState<string | null>(null);
  const [vapiAssistantId, setVapiAssistantId] = useState<string | undefined>();

  // MODEL state
  const [modelProviderId, setModelProviderId] = useState("");
  const [modelId, setModelId] = useState("");
  const [modelTemperature, setModelTemperature] = useState(0.7);

  // TRANSCRIBER state
  const [transcriberProviderId, setTranscriberProviderId] = useState("");
  const [transcriberLanguageCode, setTranscriberLanguageCode] = useState("");
  const [transcriberModelId, setTranscriberModelId] = useState("");

  // VOICE state
  const [voiceProviderId, setVoiceProviderId] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [voiceModelId, setVoiceModelId] = useState("");

  // Manual voice
  const [isAddVoiceManually, setIsAddVoiceManually] = useState(false);
  const [addVoiceId, setAddVoiceId] = useState("");
  const [voiceIdError, setVoiceIdError] = useState("");

  // Upload
  const [assistantImg, setAssistantImg] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string | undefined>();

  // UI collapses
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isStartCollapsed, setIsStartCollapsed] = useState(false);
  const [isStopCollapsed, setIsStopCollapsed] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Shared config
  const [selected, setSelected] = useState<string[]>([]);
  const [voiceBackgroundSound, setVoiceBackgroundSound] = useState("off");
  const [voiceInputMinCharacters, setVoiceInputMinCharacters] = useState(0);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  // Cartesia / emotions
  const [speedValue, setSpeedValue] = useState(4);
  const [customSpeedEnabled, setCustomSpeedEnabled] = useState(false);
  const [angerValue, setAngerValue] = useState(2);
  const [positivityValue, setPositivityValue] = useState(2);
  const [surpriseValue, setSurpriseValue] = useState(2);
  const [sadnessValue, setSadnessValue] = useState(2);
  const [curiosityValue, setCuriosityValue] = useState(2);

  // playht
  const [speed2, setSpeed2] = useState(5);
  const [temperature, setTemperature] = useState(0.1);
  const [voiceGuidance, setVoiceGuidance] = useState<number | null>(null);
  const [styleGuidance, setStyleGuidance] = useState<number | null>(null);
  const [textGuidance, setTextGuidance] = useState<number | null>(null);
  const [voicePlayhtEmotion, setVoicePlayhtEmotion] = useState<string | undefined>();

  // 11labs
  const [stability, setStability] = useState(0.8);
  const [clarity, setClarity] = useState(0.7);
  const [speed, setSpeed] = useState(1.1);
  const [styleExaggeration, setStyleExaggeration] = useState(0.8);
  const [streamingLatency, setStreamingLatency] = useState<number | null>(null);
  const [speakerBoost, setSpeakerBoost] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  // Provider-specific speeds
  const [lmntSpeedsValue, setLmntSpeedsValue] = useState(0.25);
  const [openAiSpeedValue, setOpenAiSpeedValue] = useState(0.25);
  const [azureSpeedValue, setAzureSpeedValue] = useState(0.5);
  const [humeValue, setHumeValue] = useState("");
  const [smallestSpeedsValue, setSmallestSpeedsValue] = useState(0.5);
  const [remiSpeedValue, setRemiSpeedValue] = useState(0.5);
  const [phoneMize, setPhoneMize] = useState(false);
  const [reduceSwitch, setReduceSwitch] = useState(false);
  const [inlineSwitch, setInlineSwitch] = useState(false);
  const [speedAlpha, setSpeedAlpha] = useState("");

  // Start speaking
  const [smartSelect, setSmartSelect] = useState("off");
  const [secondSpeedValue, setSecondSpeedValue] = useState(0);
  const [punctuationSpeedValue, setPunctuationSpeedValue] = useState(0);
  const [punctuationSpeedValue2, setPunctuationSpeedValue2] = useState(0);
  const [onNumberSpeedValue, setOnNumberSpeedValue] = useState(0);
  const [baseSpeedValue, setBaseSpeedValue] = useState(0);
  const [scalarSpeedValue, setScalarSpeedValue] = useState(1000);

  // Stop speaking
  const [wordsSpeedValue, setWordsSpeedValue] = useState(0);
  const [voiceSecondSpeedValue, setVoiceSecondSpeedValue] = useState(0);
  const [backSecondSpeedValue, setBackSecondSpeedValue] = useState(0);

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
  const transcriberProviders: Provider[] = filteredModelPayload?.transcriber ?? [];
  const voiceProviders: Provider[] = filteredModelPayload?.voice ?? [];


  // Initialize defaults after data loads    

  const selectedModelProvider = useMemo(
    () => modelProviders.find(p => p.id === modelProviderId),
    [modelProviders, modelProviderId]
  );
  const selectedTranscriberProvider = useMemo(
    () => transcriberProviders.find(p => p.id === transcriberProviderId),
    [transcriberProviders, transcriberProviderId]
  );
  const selectedVoiceProvider = useMemo(
    () => voiceProviders.find(p => p.id === voiceProviderId),
    [voiceProviders, voiceProviderId]
  );

  const selectedModelList = selectedModelProvider?.models ?? [];
  const selectedTranscriberLanguages: Language[] =
    selectedTranscriberProvider?.languages ?? [];
  const selectedTranscriberModels = selectedTranscriberProvider?.models ?? [];
  const selectedVoiceIds = selectedVoiceProvider?.voices ?? [];
  const selectedVoiceModels = selectedVoiceProvider?.models ?? [];

  // Audio preview handlers
  const handlePlayPause = (id: string) => {
    if (isPlaying && isPlaying !== id) {
      vapi.stop();
      setIsPlaying(id);
      return;
    }
    if (!isCallStarted) {
      setIsCallStarted(true);
      setIsPlaying(id);
    } else {
      vapi.stop();
      setIsCallStarted(false);
      setIsPlaying(null);
    }
  };

  useEffect(() => {
    vapi.on("call-start", () => { });
    vapi.on("speech-start", () => { });
  }, []);

  useEffect(() => {
    if (isCallStarted && isPlaying) vapi.start(isPlaying);
  }, [isCallStarted, isPlaying]);

  // Hydration
  const [hydratedFromAssistant, setHydratedFromAssistant] = useState(false);
  useEffect(() => {
    const data = oneAssistantData?.data;
    if (!data || !modelPayload || hydratedFromAssistant) return;

    setAssistantStatus(data.type);
    form.setValue("assistantName", data.name);
    form.setValue("firstMessage", data.firstMessage);
    form.setValue("prompt", data.modelMessage?.[0]?.content || "");
    setAssistantImg(data.assistantImg);
    setType(data.fileType);
    setFileName(data.fileName);
    setVapiAssistantId(data.VapiAssistantId);

    // Model
    setModelProviderId(data.modelProvider || modelProviders[0]?.id || "");
    setModelId(data.modelName || "");
    if (typeof data.modelTemperature === "number")
      setModelTemperature(data.modelTemperature);

    // Transcriber
    setTranscriberProviderId(
      data.transcriberProvide || transcriberProviders[0]?.id || ""
    );
    setTranscriberLanguageCode(data.transcriberLanguage || "");
    setTranscriberModelId(data.transcriberModel || "");

    // Voice
    setVoiceProviderId(data.voiceProvider || voiceProviders[0]?.id || "");
    if (data.voiceInputPunctuationBoundaries)
      setSelected(data.voiceInputPunctuationBoundaries);
    setVoiceId(data.voiceId || "");
    setVoiceModelId(data.voiceModel || "");

    // Provider specific persisted fields
    if (data.voiceProvider === "lmnt" && data.voiceSpeed)
      setLmntSpeedsValue(data.voiceSpeed);
    if (data.voiceProvider === "openai" && data.voiceSpeed)
      setOpenAiSpeedValue(data.voiceSpeed);
    if (data.voiceProvider === "azure" && data.voiceSpeed)
      setAzureSpeedValue(data.voiceSpeed);
    if (data.voiceProvider === "hume" && data.voiceDescription)
      setHumeValue(data.voiceDescription);
    if (data.voiceProvider === "smallest-ai" && data.voiceSpeed)
      setSmallestSpeedsValue(data.voiceSpeed);
    if (data.voiceProvider === "rime-ai") {
      if (data.voiceSpeed) setRemiSpeedValue(data.voiceSpeed);
      if (data.voicePhonemizeBetweenBrackets)
        setPhoneMize(data.voicePhonemizeBetweenBrackets);
      if (data.voiceReduceLatency) setReduceSwitch(data.voiceReduceLatency);
      if (data.voicePauseBetweenBrackets)
        setInlineSwitch(data.voicePauseBetweenBrackets);
      if (data.voiceInlineSpeedAlpha) setSpeedAlpha(data.voiceInlineSpeedAlpha);
      // cartesia-like subset
      if (data.voiceSpeed) setSpeedValue(data.voiceSpeed);
      if (data.voiceCustomSpeed) setCustomSpeedEnabled(data.voiceCustomSpeed);
      if (data.voiceEmotion) {
        const emoScale = LowestToHighest;
        data.voiceEmotion.forEach(e => {
          const [k, v] = e.split(":");
          const idx = emoScale.indexOf(v);
          if (idx >= 0) {
            if (k === "anger") setAngerValue(idx);
            if (k === "positivity") setPositivityValue(idx);
            if (k === "surprise") setSurpriseValue(idx);
            if (k === "sadness") setSadnessValue(idx);
            if (k === "curiosity") setCuriosityValue(idx);
          }
        });
      }
      // 11labs style subset if mis-saved
      if (data.voiceStability) setStability(data.voiceStability);
      if (data.voiceSimilarityBoost) setClarity(data.voiceSimilarityBoost);
      if (data.voiceStyle) setStyleExaggeration(data.voiceStyle);
      if (data.voiceOptimizeStreamingLatency)
        setStreamingLatency(data.voiceOptimizeStreamingLatency);
      if (data.voiceUseSpeakerBoost) setSpeakerBoost(data.voiceUseSpeakerBoost);
      if (data.voiceAutoMode) setAutoMode(data.voiceAutoMode);
    }
    if (data.voiceProvider === "playht") {
      if (data.voicePlayhtEmotion) setVoicePlayhtEmotion(data.voicePlayhtEmotion);
      if (data.voiceTextGuidance) setTextGuidance(data.voiceTextGuidance);
      if (data.voiceStyleGuidance) setStyleGuidance(data.voiceStyleGuidance);
      if (data.voiceVoiceGuidance) setVoiceGuidance(data.voiceVoiceGuidance);
      if (data.voiceTemperature) setTemperature(data.voiceTemperature);
      if (data.voiceSpeed) setSpeed2(data.voiceSpeed);
    }
    if (data.voiceProvider === "11labs") {
      if (data.voiceStability) setStability(data.voiceStability);
      if (data.voiceSimilarityBoost) setClarity(data.voiceSimilarityBoost);
      if (data.voiceSpeed) setSpeed(data.voiceSpeed);
      if (data.voiceStyle) setStyleExaggeration(data.voiceStyle);
      if (data.voiceOptimizeStreamingLatency)
        setStreamingLatency(data.voiceOptimizeStreamingLatency);
      if (data.voiceUseSpeakerBoost) setSpeakerBoost(data.voiceUseSpeakerBoost);
      if (data.voiceAutoMode) setAutoMode(data.voiceAutoMode);
    }

    // Start speaking plan
    if (data.startSpeakingPlanWaitSeconds)
      setSecondSpeedValue(data.startSpeakingPlanWaitSeconds);
    if (data.startSpeakingPlanSmartEndpointingPlan)
      setSmartSelect(data.startSpeakingPlanSmartEndpointingPlan);
    if (data.startSpeakingPlanOnPunctuationSeconds)
      setPunctuationSpeedValue(data.startSpeakingPlanOnPunctuationSeconds);
    if (data.startSpeakingPlanOnNoPunctuationSeconds)
      setPunctuationSpeedValue2(data.startSpeakingPlanOnNoPunctuationSeconds);
    if (data.startSpeakingPlanOnNumberSeconds)
      setOnNumberSpeedValue(data.startSpeakingPlanOnNumberSeconds);
    if (data.startSpeakingPlanWaitFunctionBaseValue)
      setBaseSpeedValue(data.startSpeakingPlanWaitFunctionBaseValue);
    if (data.startSpeakingPlanWaitFunctionScaleValue)
      setScalarSpeedValue(data.startSpeakingPlanWaitFunctionScaleValue);

    // Stop speaking plan
    if (data.stopSpeakingPlanNumWords)
      setWordsSpeedValue(data.stopSpeakingPlanNumWords);
    if (data.stopSpeakingPlanVoiceSeconds)
      setVoiceSecondSpeedValue(data.stopSpeakingPlanVoiceSeconds);
    if (data.stopSpeakingPlanBackoffSeconds)
      setBackSecondSpeedValue(data.stopSpeakingPlanBackoffSeconds);

    setHydratedFromAssistant(true);
  }, [oneAssistantData, modelPayload, hydratedFromAssistant, modelProviders, transcriberProviders, voiceProviders, form]);

  // Guard selections against provider data changes
  useEffect(() => {
    if (!modelProviders.length) return;
    if (!modelProviderId) {
      setModelProviderId(modelProviders[0].id);
      if (modelProviders[0].models?.length)
        setModelId(modelProviders[0].models[0].id);
    } else {
      const prov = modelProviders.find(p => p.id === modelProviderId);
      if (!prov) {
        setModelProviderId(modelProviders[0].id);
        setModelId(modelProviders[0].models?.[0]?.id || "");
      } else if (prov.models?.length && !prov.models.find(m => m.id === modelId)) {
        setModelId(prov.models[0].id);
      }
    }
  }, [modelProviders, modelProviderId, modelId]);

  useEffect(() => {
    if (!transcriberProviders.length) return;
    if (!transcriberProviderId) {
      setTranscriberProviderId(transcriberProviders[0].id);
      const langs = transcriberProviders[0].languages ?? [];
      if (langs.length) setTranscriberLanguageCode(langs[0].code);
      if (transcriberProviders[0].models?.length)
        setTranscriberModelId(transcriberProviders[0].models[0].id);
    } else {
      const prov = transcriberProviders.find(p => p.id === transcriberProviderId);
      if (!prov) {
        setTranscriberProviderId(transcriberProviders[0].id);
        const langs = transcriberProviders[0].languages ?? [];
        if (langs.length) setTranscriberLanguageCode(langs[0].code);
        setTranscriberModelId(transcriberProviders[0].models?.[0]?.id || "");
      } else {
        const langs = prov.languages ?? [];
        if (langs.length && !langs.find(l => l.code === transcriberLanguageCode))
          setTranscriberLanguageCode(langs[0].code);
        if (prov.models?.length && !prov.models.find(m => m.id === transcriberModelId))
          setTranscriberModelId(prov.models[0].id);
      }
    }
  }, [
    transcriberProviders,
    transcriberProviderId,
    transcriberLanguageCode,
    transcriberModelId,
  ]);

  useEffect(() => {
    if (!voiceProviders.length) return;
    if (!voiceProviderId) {
      setVoiceProviderId(voiceProviders[0].id);
      if (voiceProviders[0].voices?.length)
        setVoiceId(voiceProviders[0].voices[0]);
      if (voiceProviders[0].models?.length)
        setVoiceModelId(voiceProviders[0].models[0].id);
    } else {
      const prov = voiceProviders.find(p => p.id === voiceProviderId);
      if (!prov) {
        setVoiceProviderId(voiceProviders[0].id);
        setVoiceId(voiceProviders[0].voices?.[0] || "");
        setVoiceModelId(voiceProviders[0].models?.[0]?.id || "");
      } else {
        if (prov.voices?.length && !prov.voices.includes(voiceId))
          setVoiceId(prov.voices[0]);
        if (prov.models?.length && !prov.models.find(m => m.id === voiceModelId))
          setVoiceModelId(prov.models[0].id);
      }
    }
  }, [voiceProviders, voiceProviderId, voiceId, voiceModelId]);

  const [updateAssistant, { isLoading }] = useUpdateAssistantMutation();
  const [deleteAssistant, { isLoading: deleteAssistantLoading }] =
    useDeleteAssistantMutation();
  const [uploadFile, { isLoading: uploadFileLoading }] =
    useUploadFileMutation();

  const handleModelTemp = (v: number[]) => setModelTemperature(v[0]);

  const toggleSelect = (value: string) =>
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );

  const handleUrlChange = (value: string) => {
    try {
      new URL(value);
      setVoiceUrl(value);
      setUrlError("");
    } catch {
      setVoiceUrl(value);
      setUrlError("Please enter a valid URL.");
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const result = await uploadFile(formData).unwrap();
      if (result.success) {
        setAssistantImg(result.data.file[0].url);
        setFileName(result.data.file[0].fileName);
        setType(result.data.file[0].type);
      }
    } catch { }
  };

  const getLabelOfSlider = (index: number, arr: string[]) => arr[index];

  async function onDelete() {
    try {
      const res = await deleteAssistant({ id: Number(params.id) }).unwrap();
      if (res.success) {
        toast.success(res.message);
        setDeleteDialog(false);
        router.push("/assistant");
      }
    } catch (e) {
      toast.error((e as ErrorResponse).data.message);
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isAddVoiceManually && voiceProviderId === "11labs" && voiceIdError) {
      toast.error("Please enter the voiceId");
      return;
    }

    const body: Partial<AssistantBodyType> = {
      assistantName: data.assistantName,
      firstMessage: data.firstMessage,
      assistantImg,
      fileName: type,
      fileType: fileName,
      modelProvider: modelProviderId,
      modelName: modelId,
      modelTemperature,
      modelMessage: [{ role: "system", content: data.prompt }],
      transcriberProvide: transcriberProviderId,
      transcriberLanguage: transcriberLanguageCode,
      transcriberModel: transcriberModelId || undefined,
      voiceProvider: voiceProviderId,
      voiceId:
        isAddVoiceManually || selectedVoiceIds.length === 0
          ? addVoiceId
          : voiceId,
      voiceModel: voiceModelId || undefined,

      startSpeakingPlanWaitSeconds: Number(secondSpeedValue),
      startSpeakingPlanSmartEndpointingPlan: smartSelect,
      startSpeakingPlanOnPunctuationSeconds: Number(punctuationSpeedValue),
      startSpeakingPlanOnNoPunctuationSeconds: Number(punctuationSpeedValue2),
      startSpeakingPlanOnNumberSeconds: Number(onNumberSpeedValue),

      stopSpeakingPlanNumWords: Number(wordsSpeedValue),
      stopSpeakingPlanVoiceSeconds: Number(voiceSecondSpeedValue),
      stopSpeakingPlanBackoffSeconds: Number(backSecondSpeedValue),
    };

    if (smartSelect === "livekit") {
      body.startSpeakingPlanWaitFunctionBaseValue = baseSpeedValue;
      body.startSpeakingPlanWaitFunctionScaleValue = scalarSpeedValue;
    }

    if (voiceBackgroundSound !== "default") {
      body.voiceBackgroundSound =
        voiceBackgroundSound !== "custom" ? voiceBackgroundSound : voiceUrl;
    }
    if (voiceInputMinCharacters > 0)
      body.voiceInputMinCharacters = Number(voiceInputMinCharacters);
    if (selected.length) body.voiceInputPunctuationBoundaries = selected;

    // Provider-specific assignments
    switch (voiceProviderId) {
      case "11labs":
        body.voiceStability = Number(stability);
        body.voiceSimilarityBoost = Number(clarity);
        body.voiceSpeed = Number(speed);
        body.voiceStyle = Number(styleExaggeration);
        body.voiceOptimizeStreamingLatency =
          streamingLatency !== null ? Number(streamingLatency) : undefined;
        body.voiceUseSpeakerBoost = speakerBoost;
        body.voiceAutoMode = autoMode;
        break;
      case "lmnt":
        body.voiceSpeed = Number(lmntSpeedsValue);
        break;
      case "openai":
        body.voiceSpeed = Number(openAiSpeedValue);
        break;
      case "azure":
        body.voiceSpeed = Number(azureSpeedValue);
        break;
      case "hume":
        body.voiceDescription = humeValue;
        break;
      case "smallest-ai":
        body.voiceSpeed = Number(smallestSpeedsValue);
        break;
      case "rime-ai":
        body.voiceSpeed = Number(remiSpeedValue);
        body.voicePhonemizeBetweenBrackets = phoneMize;
        body.voiceReduceLatency = reduceSwitch;
        body.voicePauseBetweenBrackets = inlineSwitch;
        body.voiceInlineSpeedAlpha = speedAlpha;
        break;
      case "cartesia": {
        const emoArr: string[] = [];
        const scale = LowestToHighest;
        if (angerValue !== 2) emoArr.push(`anger:${scale[angerValue]}`);
        if (positivityValue !== 2)
          emoArr.push(`positivity:${scale[positivityValue]}`);
        if (surpriseValue !== 2)
          emoArr.push(`surprise:${scale[surpriseValue]}`);
        if (sadnessValue !== 2)
          emoArr.push(`sadness:${scale[sadnessValue]}`);
        if (curiosityValue !== 2)
          emoArr.push(`curiosity:${scale[curiosityValue]}`);
        if (emoArr.length) body.voiceEmotion = emoArr;
        body.voiceSpeed = Number(speedValue);
        body.voiceCustomSpeed = customSpeedEnabled;
        break;
      }
      case "playht":
        if (voicePlayhtEmotion) body.voicePlayhtEmotion = voicePlayhtEmotion;
        if (textGuidance !== null) body.voiceTextGuidance = Number(textGuidance);
        if (styleGuidance !== null)
          body.voiceStyleGuidance = Number(styleGuidance);
        if (voiceGuidance !== null)
          body.voiceVoiceGuidance = Number(voiceGuidance);
        body.voiceTemperature = Number(temperature);
        body.voiceSpeed = Number(speed2);
        break;
      default:
        break;
    }

    try {
      const res = await updateAssistant({
        id: Number(params.id),
        data: body,
      }).unwrap();
      if (res.success) toast.success(res.message);
    } catch (e) {
      toast.error((e as ErrorResponse).data.message);
    }
  }

  return (
    <>
      <div className="flex-1 rounded-xl bg-sidebar relative">
        {(getOneAssistantLoading || modelsLoading) && (
          <div className="h-full w-full bg-white flex justify-center items-center absolute top-0 z-20">
            <Loading />
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-wrap justify-between items-center">
              <h1 className="m-2 p-3 text-xl font-semibold text-charcoal">
                Assistant Id : {params.id}
              </h1>
              <div className="flex flex-wrap">
                <Button
                  type="button"
                  className="!h-[40px] m-2 bg-white text-theme shadow-md"
                  onClick={() => router.push("/assistant")}
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="mr-1 max-md:hidden">Back</span>
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    vapiAssistantId && handlePlayPause(vapiAssistantId)
                  }
                  className="!h-[40px] m-2 !px-3 bg-white text-theme shadow-md"
                  disabled={!vapiAssistantId}
                >
                  {vapiAssistantId &&
                    isPlaying === vapiAssistantId &&
                    isCallStarted ? (
                    <Phone className="p-0.5 text-red-600 rotate-135" />
                  ) : (
                    <Phone className="p-0.5 text-emerald-600" />
                  )}
                </Button>
                <Button
                  type="button"
                  className="!h-[40px] m-2 !px-3 bg-white text-theme shadow-md"
                  onClick={() => setDeleteDialog(true)}
                  disabled={isLoading}
                >
                  <Trash2 />
                </Button>
                <Button
                  type="submit"
                  className="!h-[40px] m-2 bg-theme text-white shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? <Loading /> : "Publish"}
                </Button>
              </div>
            </div>

            <div className="flex gap-4 ml-5 items-center">
              <div>
                {!uploadFileLoading ? (
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/svg"
                      className="hidden"
                      onChange={onFileChange}
                      disabled={isLoading}
                    />
                    <Avatar className="size-20">
                      <AvatarImage
                        className="object-cover"
                        src={
                          assistantImg ||
                          "/assets/images/assistant/assistant.png"
                        }
                      />
                      <AvatarFallback>RT</AvatarFallback>
                    </Avatar>
                  </label>
                ) : (
                  <div className="size-20 flex justify-center items-center bg-white rounded-full">
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
                        placeholder="Enter your assistant name"
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
              <Tabs defaultValue="Model" className="mt-2 text-charcoal">
                <TabsList className="grid grid-cols-4 h-[40px]">
                  <TabsTrigger value="Model">Model</TabsTrigger>
                  <TabsTrigger value="Transcriber">Transcriber</TabsTrigger>
                  <TabsTrigger value="Voice">Voice</TabsTrigger>
                  <TabsTrigger value="Advanced">Advanced</TabsTrigger>
                </TabsList>

                {/* MODEL */}
                <TabsContent value="Model">
                  <Card>
                    <CardHeader>
                      <CardTitle>Model</CardTitle>
                      <CardDescription>
                        Configure the primary LLM.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 flex">
                      <div className="w-full gap-5 grid xl:grid-cols-2 md:grid-cols-1">
                        <div className="flex flex-col">
                          <FormField
                            control={form.control}
                            name="firstMessage"
                            render={({ field }) => (
                              <FormItem className="space-y-1 mt-1">
                                <FormLabel>First Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Greeting or opening line..."
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
                                <FormLabel>System Prompt</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Add system instructions..."
                                    className="h-48"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                          <label>
                            Provider
                            <Select
                              disabled={modelsLoading || !modelProviders.length}
                              value={modelProviderId}
                              onValueChange={v => setModelProviderId(v)}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select Provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {modelProviders.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                      <span className="text-sm">
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
                              disabled={!selectedModelList.length}
                              value={modelId}
                              onValueChange={v => setModelId(v)}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select Model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {selectedModelList.map(m => (
                                    <SelectItem key={m.id} value={m.id}>
                                      <span className="font-bold">
                                        {m.name} <span className="text-xs block font-normal">
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
                            Temperature ({modelTemperature.toFixed(1)})
                            <Slider
                              value={[modelTemperature]}
                              min={0.1}
                              max={2.0}
                              step={0.1}
                              className="mt-2"
                              onValueChange={handleModelTemp}
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
                        Configure streaming speech-to-text.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-3 gap-8">
                        <div>
                          <Label>Provider</Label>
                          <Select
                            value={transcriberProviderId}
                            onValueChange={v => setTranscriberProviderId(v)}
                            disabled={!transcriberProviders.length}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select Provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {transcriberProviders.map(p => (
                                  <SelectItem key={p.id} value={p.id}>
                                    <span className="text-sm">
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
                            onValueChange={v => setTranscriberLanguageCode(v)}
                            disabled={!selectedTranscriberLanguages.length}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {selectedTranscriberLanguages.map(l => (
                                  <SelectItem key={l.code} value={l.code}>
                                    {l.name || l.code}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {selectedTranscriberModels.length > 0 && (
                          <div>
                            <Label>Model</Label>
                            <Select
                              value={transcriberModelId}
                              onValueChange={v => setTranscriberModelId(v)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select Model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {selectedTranscriberModels.map(m => (
                                    <SelectItem key={m.id} value={m.id}>
                                      <span className="font-bold">
                                        {m.name} <span className="text-xs block font-normal">
                                          {m.id}
                                        </span>
                                      </span>
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

                {/* VOICE */}
                <TabsContent value="Voice">
                  <Card>
                    <CardHeader>
                      <CardTitle>Voice Configuration</CardTitle>
                      <CardDescription>
                        Select TTS provider and voice options.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-3 gap-8 items-baseline">
                        <div>
                          <Label>Provider</Label>
                          <Select
                            value={voiceProviderId}
                            onValueChange={v => {
                              setVoiceProviderId(v);
                              setIsAddVoiceManually(false);
                              setAddVoiceId("");
                              setVoiceIdError("");
                            }}
                            disabled={!voiceProviders.length}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select Provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {voiceProviders.map(p => (
                                  <SelectItem key={p.id} value={p.id}>
                                    <span className="text-sm">
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
                            className={
                              addVoiceId === "" &&
                                isAddVoiceManually &&
                                voiceProviderId === "11labs"
                                ? "text-destructive"
                                : ""
                            }
                          >
                            Voice
                          </Label>
                          {(isAddVoiceManually &&
                            voiceProviderId === "11labs") ||
                            selectedVoiceIds.length === 0 ? (
                            <>
                              <Input
                                type="text"
                                placeholder="Enter Voice ID"
                                className="mt-1"
                                value={addVoiceId}
                                onChange={e => {
                                  setAddVoiceId(e.target.value);
                                  if (e.target.value.trim() !== "")
                                    setVoiceIdError("");
                                  else
                                    setVoiceIdError(
                                      "Voice ID is required when adding manually."
                                    );
                                }}
                              />
                              {voiceIdError && (
                                <p className="text-destructive text-sm mt-1">
                                  {voiceIdError}
                                </p>
                              )}
                            </>
                          ) : (
                            <Select
                              value={voiceId}
                              onValueChange={v => setVoiceId(v)}
                              disabled={!selectedVoiceIds.length}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select Voice" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {selectedVoiceIds.map(v => (
                                    <SelectItem key={v} value={v}>
                                      {v}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        {selectedVoiceModels.length > 0 && (
                          <div>
                            <Label>Model</Label>
                            <Select
                              value={voiceModelId}
                              onValueChange={v => setVoiceModelId(v)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select Model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {selectedVoiceModels.map(m => (
                                    <SelectItem key={m.id} value={m.id}>
                                      <span className="font-bold">
                                        {m.name} <span className="text-xs block font-normal">
                                          {m.id}
                                        </span>
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {voiceProviderId === "11labs" && (
                        <div className="flex items-center space-x-2 mt-4">
                          <Checkbox
                            id="manual-voice"
                            checked={isAddVoiceManually}
                            onCheckedChange={checked => {
                              if (typeof checked === "boolean") {
                                setIsAddVoiceManually(checked);
                                if (checked && addVoiceId.trim() === "")
                                  setVoiceIdError(
                                    "Voice ID is required when adding manually."
                                  );
                                else setVoiceIdError("");
                              }
                            }}
                          />
                          <label
                            htmlFor="manual-voice"
                            className="text-sm font-medium cursor-pointer"
                          >
                            Add Voice ID Manually
                          </label>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Additional Config */}
                  <div className="flex-1 rounded-xl mt-2">
                    <Card>
                      <div className="w-full">
                        <div className="rounded-lg bg-white overflow-hidden">
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
                              Advanced voice options.
                            </p>
                          </div>

                          {!isCollapsed && (
                            <div className="px-6 pb-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Background Sound
                                  </label>
                                  <Select
                                    value={voiceBackgroundSound}
                                    onValueChange={setVoiceBackgroundSound}
                                  >
                                    <SelectTrigger className="mt-2">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="off">Off</SelectItem>
                                      <SelectItem value="office">
                                        Office
                                      </SelectItem>
                                      <SelectItem value="null">
                                        Default
                                      </SelectItem>
                                      <SelectItem value="custom">
                                        Custom
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Background Sound URL
                                  </label>
                                  <Input
                                    placeholder="https://..."
                                    className="mt-2"
                                    disabled={
                                      voiceBackgroundSound !== "custom"
                                    }
                                    value={voiceUrl}
                                    onChange={e =>
                                      handleUrlChange(e.target.value)
                                    }
                                  />
                                  {urlError && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {urlError}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Input Min Characters
                                  </label>
                                  <Input
                                    type="number"
                                    className="mt-2"
                                    value={voiceInputMinCharacters}
                                    onChange={e =>
                                      setVoiceInputMinCharacters(
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <div className="mb-6">
                                <label className="text-sm font-medium">
                                  Punctuation Boundaries
                                </label>
                                <p className="text-xs text-gray-400 mb-2">
                                  Marks treated as streaming chunk delimiters.
                                </p>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <div className="w-full border px-4 py-2 rounded-md flex justify-between items-center cursor-pointer">
                                      <div className="flex flex-wrap gap-1">
                                        {selected.length ? (
                                          selected.map(val => (
                                            <span
                                              key={val}
                                              className="px-2 py-0.5 text-xs border rounded-md text-muted-foreground"
                                            >
                                              {val}
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-sm text-muted-foreground">
                                            No Punctuation Boundaries Added
                                          </span>
                                        )}
                                      </div>
                                      <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="p-2 w-[--radix-popover-trigger-width]"
                                    align="start"
                                    sideOffset={4}
                                  >
                                    <div className="flex flex-col space-y-1">
                                      {frameworksList.map(item => (
                                        <div
                                          key={item.value}
                                          onClick={() =>
                                            toggleSelect(item.value)
                                          }
                                          className={cn(
                                            "flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-theme hover:text-white",
                                            selected.includes(item.value) &&
                                            "bg-theme text-white"
                                          )}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4",
                                              selected.includes(item.value)
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

                              {/* Cartesia */}
                              {voiceProviderId === "cartesia" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <div className="text-sm font-medium">
                                        Custom Speed Enabled
                                      </div>
                                      <p className="text-xs text-gray-400">
                                        Toggle preset vs fine-grained speed.
                                      </p>
                                    </div>
                                    <Switch
                                      checked={customSpeedEnabled}
                                      onCheckedChange={checked => {
                                        setCustomSpeedEnabled(checked);
                                        setSpeedValue(checked ? 0 : 2);
                                      }}
                                    />
                                  </div>
                                  <div className="mb-6 mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                      <label className="text-sm font-medium">
                                        Speed
                                      </label>
                                      <span className="text-theme text-sm">
                                        {customSpeedEnabled ? (
                                          <span className="border p-1.5 rounded-md">
                                            {speedValue}
                                          </span>
                                        ) : (
                                          getLabelOfSlider(
                                            speedValue,
                                            SlowestToFastest
                                          )
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-xs text-gray-400 mr-2">
                                        {customSpeedEnabled
                                          ? "-1.0"
                                          : "Slowest"}
                                      </span>
                                      <Slider
                                        value={[speedValue]}
                                        onValueChange={v =>
                                          setSpeedValue(v[0])
                                        }
                                        min={customSpeedEnabled ? -1 : 0}
                                        max={customSpeedEnabled ? 1 : 4}
                                        step={customSpeedEnabled ? 0.01 : 1}
                                        className="flex-1"
                                      />
                                      <span className="text-xs text-gray-400 ml-2">
                                        {customSpeedEnabled ? "1.0" : "Fastest"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="h-px bg-[#ebedef] my-6" />
                                  {[
                                    {
                                      label: "Anger",
                                      value: angerValue,
                                      setValue: setAngerValue,
                                    },
                                    {
                                      label: "Positivity",
                                      value: positivityValue,
                                      setValue: setPositivityValue,
                                    },
                                    {
                                      label: "Surprise",
                                      value: surpriseValue,
                                      setValue: setSurpriseValue,
                                    },
                                    {
                                      label: "Sadness",
                                      value: sadnessValue,
                                      setValue: setSadnessValue,
                                    },
                                    {
                                      label: "Curiosity",
                                      value: curiosityValue,
                                      setValue: setCuriosityValue,
                                    },
                                  ].map(e => (
                                    <div key={e.label} className="mb-6">
                                      <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium">
                                          {e.label}
                                        </label>
                                        <span className="text-theme text-sm">
                                          {getLabelOfSlider(
                                            e.value,
                                            LowestToHighest
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="text-xs text-gray-400 mr-2">
                                          Lowest
                                        </span>
                                        <Slider
                                          value={[e.value]}
                                          onValueChange={v =>
                                            e.setValue(v[0])
                                          }
                                          max={4}
                                          min={0}
                                          step={1}
                                          className="flex-1"
                                        />
                                        <span className="text-xs text-gray-400 ml-2">
                                          Highest
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}

                              {/* 11labs */}
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
                                    description="Improve similarity at slight speed cost."
                                    checked={speakerBoost}
                                    onCheckedChange={setSpeakerBoost}
                                  />
                                  <ToggleSwitch
                                    title="Auto Mode"
                                    description="Reduce latency on full sentences."
                                    checked={autoMode}
                                    onCheckedChange={setAutoMode}
                                  />
                                </div>
                              )}

                              {/* Rime AI */}
                              {voiceProviderId === "rime-ai" && (
                                <div className="space-y-6">
                                  <div className="flex items-center gap-5">
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium">
                                        Speed
                                      </h4>
                                      <p className="text-xs text-gray-400">
                                        Control playback rate.
                                      </p>
                                      <div className="flex items-center mt-2">
                                        <span className="text-xs text-gray-400 mr-2">
                                          Fast
                                        </span>
                                        <Slider
                                          value={[remiSpeedValue]}
                                          onValueChange={v =>
                                            setRemiSpeedValue(v[0])
                                          }
                                          max={2}
                                          min={0.5}
                                          step={0.1}
                                          className="flex-1"
                                        />
                                        <span className="text-xs text-gray-400 ml-2">
                                          Slow
                                        </span>
                                      </div>
                                    </div>
                                    <div className="px-3 py-3 border rounded-md">
                                      {remiSpeedValue}
                                    </div>
                                  </div>
                                  <ToggleSwitch
                                    title="Phonemize Between Brackets"
                                    description="Adds pauses within bracketed text."
                                    checked={phoneMize}
                                    onCheckedChange={setPhoneMize}
                                  />
                                  <ToggleSwitch
                                    title="Reduce Latency"
                                    description="Optimize for low latency."
                                    checked={reduceSwitch}
                                    onCheckedChange={setReduceSwitch}
                                  />
                                  <ToggleSwitch
                                    title="Inline Speed Alpha"
                                    description="Enable inline speed controls."
                                    checked={inlineSwitch}
                                    onCheckedChange={setInlineSwitch}
                                  />
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="space-y-0.5">
                                      <h4 className="text-sm">Speed Alpha</h4>
                                      <p className="text-xs text-gray-500">
                                        Inline speed override.
                                      </p>
                                    </div>
                                    <Input
                                      value={speedAlpha}
                                      onChange={e =>
                                        setSpeedAlpha(e.target.value)
                                      }
                                      placeholder="e.g. 1.2"
                                      className="w-[150px]"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* playht */}
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
                                        {playhtEmotion.map(e => (
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
                                      value: speed2,
                                      setter: setSpeed2,
                                      max: 5,
                                      min: 0.1,
                                    },
                                    {
                                      label: "Temperature",
                                      value: temperature,
                                      setter: setTemperature,
                                      max: 2,
                                      min: 0.1,
                                    },
                                    {
                                      label: "Voice Guidance",
                                      value: voiceGuidance,
                                      setter: setVoiceGuidance,
                                      max: 6,
                                      min: 1,
                                    },
                                    {
                                      label: "Style Guidance",
                                      value: styleGuidance,
                                      setter: setStyleGuidance,
                                      max: 30,
                                      min: 1,
                                    },
                                    {
                                      label: "Text Guidance",
                                      value: textGuidance,
                                      setter: setTextGuidance,
                                      max: 2,
                                      min: 1,
                                    },
                                  ].map(item => (
                                    <div key={item.label}>
                                      <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium">
                                          {item.label}
                                        </label>
                                        <span className="text-theme text-sm">
                                          {item.value !== null
                                            ? item.value
                                            : "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="text-xs text-gray-400 mr-2">
                                          Low
                                        </span>
                                        <Slider
                                          value={
                                            item.value !== null
                                              ? [item.value]
                                              : undefined
                                          }
                                          onValueChange={v =>
                                            item.setter(v[0])
                                          }
                                          max={item.max}
                                          min={item.min}
                                          step={0.1}
                                          className="flex-1"
                                        />
                                        <span className="text-xs text-gray-400 ml-2">
                                          High
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* lmnt */}
                              {voiceProviderId === "lmnt" && (
                                <div className="flex items-center gap-5">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium">
                                      Speed
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      Playback rate.
                                    </p>
                                    <div className="flex items-center mt-2">
                                      <span className="text-xs text-gray-400 mr-2">
                                        Slow
                                      </span>
                                      <Slider
                                        value={[lmntSpeedsValue]}
                                        onValueChange={v =>
                                          setLmntSpeedsValue(v[0])
                                        }
                                        min={0.25}
                                        max={2}
                                        step={0.1}
                                        className="flex-1"
                                      />
                                      <span className="text-xs text-gray-400 ml-2">
                                        Fast
                                      </span>
                                    </div>
                                  </div>
                                  <div className="px-3 py-3 border rounded-md">
                                    {lmntSpeedsValue}
                                  </div>
                                </div>
                              )}

                              {/* openai */}
                              {voiceProviderId === "openai" && (
                                <div className="flex items-center gap-5">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium">
                                      Speed
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      Playback rate.
                                    </p>
                                    <div className="flex items-center mt-2">
                                      <span className="text-xs text-gray-400 mr-2">
                                        Fast
                                      </span>
                                      <Slider
                                        value={[openAiSpeedValue]}
                                        onValueChange={v =>
                                          setOpenAiSpeedValue(v[0])
                                        }
                                        min={0.25}
                                        max={2}
                                        step={0.1}
                                        className="flex-1"
                                      />
                                      <span className="text-xs text-gray-400 ml-2">
                                        Slow
                                      </span>
                                    </div>
                                  </div>
                                  <div className="px-3 py-3 border rounded-md">
                                    {openAiSpeedValue}
                                  </div>
                                </div>
                              )}

                              {/* azure */}
                              {voiceProviderId === "azure" && (
                                <div className="flex items-center gap-5">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium">
                                      Speed
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      Playback rate.
                                    </p>
                                    <div className="flex items-center mt-2">
                                      <span className="text-xs text-gray-400 mr-2">
                                        Fast
                                      </span>
                                      <Slider
                                        value={[azureSpeedValue]}
                                        onValueChange={v =>
                                          setAzureSpeedValue(v[0])
                                        }
                                        min={0.5}
                                        max={2}
                                        step={0.1}
                                        className="flex-1"
                                      />
                                      <span className="text-xs text-gray-400 ml-2">
                                        Slow
                                      </span>
                                    </div>
                                  </div>
                                  <div className="px-3 py-3 border rounded-md">
                                    {azureSpeedValue}
                                  </div>
                                </div>
                              )}

                              {/* smallest-ai */}
                              {voiceProviderId === "smallest-ai" && (
                                <div className="flex items-center gap-5">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium">
                                      Speed
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      Playback rate.
                                    </p>
                                    <div className="flex items-center mt-2">
                                      <span className="text-xs text-gray-400 mr-2">
                                        Fast
                                      </span>
                                      <Slider
                                        value={[smallestSpeedsValue]}
                                        onValueChange={v =>
                                          setSmallestSpeedsValue(v[0])
                                        }
                                        min={0.5}
                                        max={2}
                                        step={0.1}
                                        className="flex-1"
                                      />
                                      <span className="text-xs text-gray-400 ml-2">
                                        Slow
                                      </span>
                                    </div>
                                  </div>
                                  <div className="px-3 py-3 border rounded-md">
                                    {smallestSpeedsValue}
                                  </div>
                                </div>
                              )}

                              {/* hume */}
                              {voiceProviderId === "hume" && (
                                <div>
                                  <label className="text-sm font-medium">
                                    Description
                                  </label>
                                  <textarea
                                    value={humeValue}
                                    onChange={e =>
                                      setHumeValue(e.target.value)
                                    }
                                    className="w-full p-2 mt-1 border rounded-md min-h-[200px]"
                                    placeholder="Describe target voice tone..."
                                  />
                                </div>
                              )}

                              {/* sesame (placeholder) */}
                              {voiceProviderId === "sesame" && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">
                                      Voice Name
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full p-2 border rounded-md mt-1"
                                      placeholder="Enter a name"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Audio File Upload
                                    </label>
                                    <input
                                      type="file"
                                      accept="audio/*"
                                      className="w-full mt-1 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Transcription
                                    </label>
                                    <textarea
                                      className="w-full p-2 border rounded-md mt-1 min-h-[160px]"
                                      placeholder="Exact words spoken in audio."
                                    />
                                  </div>
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
                        <div className="rounded-lg bg-white overflow-hidden">
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
                              Configure how quickly the assistant begins.
                            </p>
                          </div>
                        </div>
                      </div>

                      {!isStartCollapsed && (
                        <div className="px-6 pb-6">
                          <div className="h-px bg-[#ebedef] mb-6" />
                          {/* Wait seconds */}
                          <div className="mb-6 flex items-center gap-5 max-md:flex-col">
                            <div className="flex items-start gap-3 flex-1">
                              <div>
                                <h4 className="text-sm font-medium">
                                  Wait seconds
                                </h4>
                                <p className="text-xs text-gray-400">
                                  Delay before speaking.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center w-full">
                              <span className="text-xs text-gray-400 mr-2">
                                0
                              </span>
                              <Slider
                                value={[secondSpeedValue]}
                                onValueChange={v => setSecondSpeedValue(v[0])}
                                max={2}
                                min={0}
                                step={0.1}
                                className="flex-1"
                              />
                              <span className="text-xs text-gray-400 ml-2">
                                2
                              </span>
                            </div>
                            <div className="px-3 py-3 border rounded-md">
                              {secondSpeedValue}
                            </div>
                          </div>

                          <div className="h-px bg-[#ebedef]"></div>
                          <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <h4 className="text-sm">Smart Endpointing</h4>
                                <p className="text-xs text-gray-500">
                                  LiveKit supports English only.
                                </p>
                              </div>
                              <div className="w-28">
                                <Select
                                  value={smartSelect}
                                  onValueChange={setSmartSelect}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
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
                            <div className="space-y-6 mt-6">
                              <CustomSlider
                                label="Base value (ms)"
                                value={baseSpeedValue}
                                min={0}
                                max={1000}
                                step={1}
                                valueDisplay={baseSpeedValue}
                                leftLabel=""
                                rightLabel=""
                                onChange={setBaseSpeedValue}
                              />
                              <CustomSlider
                                label="Scalar value"
                                value={scalarSpeedValue}
                                min={0}
                                max={20000}
                                step={1000}
                                valueDisplay={scalarSpeedValue}
                                leftLabel=""
                                rightLabel=""
                                onChange={setScalarSpeedValue}
                              />
                              <div className="bg-sidebar p-3 text-sm">
                                Function: {baseSpeedValue} + {scalarSpeedValue} * x
                              </div>
                            </div>
                          ) : (
                            <div className="mt-6 space-y-8">
                              {[
                                {
                                  label: "On Punctuation Seconds",
                                  value: punctuationSpeedValue,
                                  setter: setPunctuationSpeedValue,
                                  max: 3,
                                },
                                {
                                  label: "On No Punctuation Seconds",
                                  value: punctuationSpeedValue2,
                                  setter: setPunctuationSpeedValue2,
                                  max: 3,
                                },
                                {
                                  label: "On Number Seconds",
                                  value: onNumberSpeedValue,
                                  setter: setOnNumberSpeedValue,
                                  max: 3,
                                },
                              ].map(item => (
                                <div
                                  key={item.label}
                                  className="flex items-center gap-5 max-md:flex-col"
                                >
                                  <div className="flex items-start gap-3 flex-1">
                                    <div>
                                      <h4 className="text-sm font-medium">
                                        {item.label}
                                      </h4>
                                      <p className="text-xs text-gray-400">
                                        Minimum delay threshold.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center w-full">
                                    <span className="text-xs text-gray-400 mr-2">
                                      0
                                    </span>
                                    <Slider
                                      value={[item.value]}
                                      onValueChange={v => item.setter(v[0])}
                                      max={item.max}
                                      min={0}
                                      step={0.1}
                                      className="flex-1"
                                    />
                                    <span className="text-xs text-gray-400 ml-2">
                                      {item.max}
                                    </span>
                                  </div>
                                  <div className="px-3 py-3 border rounded-md">
                                    {item.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Card>

                    {/* Stop Speaking */}
                    <Card className="mt-5">
                      <div className="w-full">
                        <div className="rounded-lg bg-white overflow-hidden">
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
                              Configure pause / interruption thresholds.
                            </p>
                          </div>
                        </div>
                      </div>

                      {!isStopCollapsed && (
                        <div className="px-6 pb-6">
                          <div className="h-px bg-[#ebedef] mb-6" />
                          {[
                            {
                              title: "Number of words",
                              value: wordsSpeedValue,
                              setter: setWordsSpeedValue,
                              max: 10,
                              step: 1,
                            },
                            {
                              title: "Voice seconds",
                              value: voiceSecondSpeedValue,
                              setter: setVoiceSecondSpeedValue,
                              max: 0.5,
                              step: 0.1,
                            },
                            {
                              title: "Back off seconds",
                              value: backSecondSpeedValue,
                              setter: setBackSecondSpeedValue,
                              max: 10,
                              step: 1,
                            },
                          ].map(item => (
                            <div
                              key={item.title}
                              className="mb-6 flex items-center gap-5 max-md:flex-col"
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <div>
                                  <h4 className="text-sm font-medium">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-gray-400">
                                    Adjust interruption sensitivity.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center w-full">
                                <span className="text-xs text-gray-400 mr-2">
                                  0
                                </span>
                                <Slider
                                  value={[item.value]}
                                  onValueChange={v => item.setter(v[0])}
                                  max={item.max}
                                  min={0}
                                  step={item.step}
                                  className="flex-1"
                                />
                                <span className="text-xs text-gray-400 ml-2">
                                  {item.max}
                                </span>
                              </div>
                              <div className="px-3 py-3 border rounded-md">
                                {item.value}
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

      <Dialog open={deleteDialog} onOpenChange={o => setDeleteDialog(o)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-start">
              Delete this assistant?
            </DialogTitle>
            <DialogClose onClick={() => setDeleteDialog(false)} />
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              className="border-2 border-theme !h-7 text-theme w-full"
              onClick={() => setDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-theme !h-7 text-white w-full"
              onClick={onDelete}
              disabled={deleteAssistantLoading}
            >
              {deleteAssistantLoading ? <Loading /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}