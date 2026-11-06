export type RandomAssistantRes = {
  id: string;
};

export type AssistantResponseType = {
  id: number;
  name: string;
  isDemo: boolean | undefined;
  assistantImg: string | undefined;
  fileName: string | undefined;
  fileType: string | undefined;
  VapiAssistantId: string;
  firstMessage: string;
  transcriberProvide: any;
  transcriberModel: any;
  transcriberLanguage: any;
  transcriberServerUrl?: any;
  voiceModel: any;
  voiceId: any;
  voiceProvider: any;
  voiceFillerInjectionEnabled: boolean;
  type: string;
  voiceServerUrl?: any;
  modelProvider: any;
  modelName: string;
  modelMessage: ModelMessageType;
  modelUrl?: any;
  serverMessages: Array<string>;
  clientMessages: Array<string>;
  modelTemperature?: number;
  backgroundDenoisingEnabled: false;
  backchannelingEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  //Additional
  voiceBackgroundSound?: string;
  voiceInputMinCharacters?: number;
  voiceInputPunctuationBoundaries?: Array<string>;
  //11labs
  voiceStability?: number;
  voiceSimilarityBoost?: number;
  voiceStyle?: number;
  voiceOptimizeStreamingLatency?: number;
  voiceUseSpeakerBoost?: boolean;
  voiceAutoMode?: boolean;
  // opneai, azure, lmnt, smallest-ai
  voiceSpeed?: number;
  // hume
  voiceDescription?: string;
  // rime-ai
  voicePhonemizeBetweenBrackets?: boolean;
  voiceReduceLatency?: boolean;
  voicePauseBetweenBrackets?: boolean;
  voiceInlineSpeedAlpha?: string;
  // cartesia
  voiceEmotion?: Array<string>;
  voiceSpeed?: number;
  voiceCustomSpeed?: boolean;
  // playht
  voicePlayhtEmotion?: string;
  voiceTextGuidance?: number;
  voiceStyleGuidance?: number;
  voiceVoiceGuidance?: number;
  voiceTemperature?: number;
  // start speaking plan
  startSpeakingPlanWaitSeconds?: number;
  startSpeakingPlanSmartEndpointingPlan?: string;
  startSpeakingPlanWaitFunctionBaseValue?: number;
  startSpeakingPlanWaitFunctionScaleValue?: number;
  startSpeakingPlanOnPunctuationSeconds?: number;
  startSpeakingPlanOnNoPunctuationSeconds?: number;
  startSpeakingPlanOnNumberSeconds?: number;
  //stop speaking plan
  stopSpeakingPlanNumWords?: number;
  stopSpeakingPlanVoiceSeconds?: number;
  stopSpeakingPlanBackoffSeconds?: number;
};

export type AssistantSelectType = {
  id: number;
  name: string;
  assistantImg: string;
  fileName: string;
  fileType: string;
  VapiAssistantId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AssistantBodyType = {
  assistantName: string;
  isDemo: boolean | undefined;
  userId?: number;
  assistantImg: string | undefined;
  fileName: string | undefined;
  fileType: string | undefined;
  firstMessage: string;
  transcriberProvide: any;
  transcriberModel: any;
  organizationId: number | null;
  transcriberLanguage: any;
  voiceModel: any;
  voiceId: any;
  voiceProvider: any;
  modelProvider: any;
  modelName: string;
  modelMessage: Array<ModelMessageType>;
  modelTemperature: number;
  //Additional
  voiceBackgroundSound?: string;
  voiceInputMinCharacters?: number;
  voiceInputPunctuationBoundaries?: Array<string>;
  //11labs
  voiceStability?: number;
  voiceSimilarityBoost?: number;
  voiceStyle?: number;
  voiceOptimizeStreamingLatency?: number;
  voiceUseSpeakerBoost?: boolean;
  voiceAutoMode?: boolean;
  // opneai, azure, lmnt, smallest-ai
  voiceSpeed?: number;
  // hume
  voiceDescription?: string;
  // rime-ai
  voicePhonemizeBetweenBrackets?: boolean;
  voiceReduceLatency?: boolean;
  voicePauseBetweenBrackets?: boolean;
  voiceInlineSpeedAlpha?: string;
  // cartesia
  voiceEmotion?: Array<string>;
  voiceSpeed?: number;
  voiceCustomSpeed?: boolean;
  // playht
  voicePlayhtEmotion?: string;
  voiceTextGuidance?: number;
  voiceStyleGuidance?: number;
  voiceVoiceGuidance?: number;
  voiceTemperature?: number;
  // start speaking plan
  startSpeakingPlanWaitSeconds?: number;
  startSpeakingPlanSmartEndpointingPlan?: string;
  startSpeakingPlanWaitFunctionBaseValue?: number;
  startSpeakingPlanWaitFunctionScaleValue?: number;
  startSpeakingPlanOnPunctuationSeconds?: number;
  startSpeakingPlanOnNoPunctuationSeconds?: number;
  startSpeakingPlanOnNumberSeconds?: number;
  //stop speaking plan
  stopSpeakingPlanNumWords?: number;
  stopSpeakingPlanVoiceSeconds?: number;
  stopSpeakingPlanBackoffSeconds?: number;
};

export type GetAllAssistantPayload = {
  page: number;
  limit: number;
  sort?: {
    key: keyof AssistantResponseType;
    direction: "asc" | "desc" | null;
  };
  organizationId?: number | null;
  userId?: number | null;
  status?: string | null;
  startDate?: string | null;
  search?: string | null;
};

export type GetAllAssistantWithOutPagination = {
  organizationId?: number | null;
  assistantType?: string;
};
