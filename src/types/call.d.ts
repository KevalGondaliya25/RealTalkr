import { AssistantResponseType, LeadType } from "./lead";

export type VapiPhoneNumber = {
  id: string;
  number: string;
};

export type CallStatisticsCostType = {
  totalCost: number;
  engagedLeadRate: number;
  totalTransportCost: number;
  totalVapiCost: number;
  totalSttCost: number;
  totalLlmCost: number;
  totalTtsCost: number;
  finalTotalCost: number;
  totalDurationMs: number;
  statistics: Array<CallStatisticsType>;
  statusCount: {
    [key: string]: number;
  };
  scoreRanges: {
    [key: string]: number;
  };
};

export type CallStatisticsType = {
  id: number;
  cost: number;
  transportCost: number;
  vapiCost: number;
  sttCost: number;
  llmCost: number;
  ttsCost: number;
  totalCost: number;
  callStatus: string;
  durationMs: number;
  createdAt: string;
  durationMs: number;
  leadName: string;
  createdAt: Date;
  recordingUrl: string;
  evolutionScore: number | null;
  summary: string | null;
};

export type CallMessageType = {
  role: string;
  time: number;
  source: string | null;
  endTime: number;
  message: string;
  duration: number;
  secondsFromStart: number;
};

export type AllCallsResponseType = {
  id: number;
  assistantId: number | null;
  leadId: number | null;
  organizationId: number | null;
  messages: Array<CallMessageType>;
  VapiCallLogId: string;
  callStatus: string;
  evolutionStatus: string | null;
  endedReason: string;
  startedAt: Date;
  endedAt: Date;
  cost: number;
  recordingUrl: string;
  stereoRecordingUrl: string;
  transcript: string;
  summary: string | null;
  transportCost: number;
  vapiCost: number;
  sttCost: number;
  llmCost: number;
  ttsCost: number;
  totalCost: number;
  llmPromptTokens: number;
  llmCompletionTokens: number;
  ttsCharacters: number;
  durationMs: number;
  createdAt: Date;
  updatedAt: Date;
  assistant: AssistantResponseType;
  lead: LeadType | null;
};

export type GetAllCallPayload = {
  page: number;
  limit: number;
  organizationId?: number;
  search?: string;
  startDate?: string | null;
  status?: string;
  callDuration?: number;
  userId?: number;
  sort?: {
    key: keyof AllCallsResponseType;
    direction: "asc" | "desc" | null;
  };
};

export type CallType = {
  id: number;
  assistantId: number;
  leadId: number;
  messages: Array<oneCallMessage>;
  VapiCallLogId: number;
  callStatus: string;
  evolutionStatus: string;
  endedReason: string;
  startedAt: Date;
  endedAt: Date;
  recordingUrl: string;
  stereoRecordingUrl: string;
  notes: string;
  transcript: string;
  summary: string;
  transportCost: number;
  vapiCost: number;
  sttCost: number;
  llmCost: number;
  ttsCost: number;
  totalCost: number;
  llmPromptTokens: number;
  llmCompletionTokens: number;
  ttsCharacters: number;
  durationMs: number;
  createdAt: Date;
  updatedAt: Date;
  assistant: AssistantResponseType | null;
  lead: LeadType | null;
};

export type oneCallMessage = {
  role: string;
  time: number;
  message: string;
  secondsFromStart: number;
};

export type oneCallModalMessage = {
  role: string;
  content: string;
};
