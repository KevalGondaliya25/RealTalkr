import { AssistantResponseType } from "./assistant";
import { CountryCode } from "libphonenumber-js";

export type LeadBodyType = {
  name: string;
  email: string;
  executionTime: string;
  countryCode: string;
  organizationId: number | null;
  phoneNumberId: string;
  firstMessage: string;
  assistantName: string;
  timezone: string;
  isExecutionPause: boolean;
  transcriberProvide: any;
  transcriberLanguage: any;
  transcriberModel: any;
  voiceModel: any;
  voiceId: any;
  voiceProvider: any;
  modelProvider: any;
  modelName: any;
  modelMessage: any;
  contact: string;
  transcriberServerUrl?: any;
  modelTemperature?: number;
  modelUrl?: any;
  voiceServerUrl?: any;
};

export type SingleLeadBodyType = {
  name: string;
  email?: string;
  phoneNumberId: string;
  timezone: string;
  organizationId: number | null;
  contact: string;
  countryCode: string;
  assistantId: number;
  executionTime: string;
};

export type LeadUpdateBodyType = {
  name: string;
  email: string;
  status: string;
  contact: string;
  executionTime: Date;
  assistantId: number;
  isExecutedSuccessfully: boolean;
};

export type ModelMessageType = {
  role: string;
  content: string;
};

export type LeadType = {
  provider(arg0: string, provider: any): unknown;
  number(arg0: string, number: any): unknown;
  twilioAccountSid: string;
  twilioAuthToken: string;
  credentialId(arg0: string, credentialId: any): unknown;
  id: number;
  name: string;
  email: string;
  contact: string;
  countryCode: string;
  assistantId: number;
  organizationId?: number;
  batchId?: number;
  phoneNumberId: string;
  userId: number;
  status: string;
  executionTime: string;
  timezone: string;
  executionCount: number;
  failExecutionCount: number;
  isExecutedSuccessfully: boolean;
  isExecutionPause: boolean;
  isShow: boolean;
  createdAt: Date;
  updatedAt: Date;
  assistant: AssistantResponseType;
  callLog: Array<any>;
  phoneNumber?: string;
  trackingStatus: string;
  notes: string;
};

export type BulkLead = {
  id: number;
  name: string;
  status: string;
  recipients: number;
  sentCount: number;
  pickedUpCount: number;
  successfulCount: number;
  lastSentBy?: Date | null;
  executionTime: string | null;
  phoneNumberId: string;
  assistantId: string;
  timezone: string | null;
  isSchedular: boolean;
  createdAt: Date;
  updatedAt: Date;
  organizationId: number | null;
  userId: number;
  phoneNumber: string;
  leads: Array<LeadType>;
};

export type GetAllLeadPayload = {
  page: number;
  limit: number;
  sort?: {
    key: keyof LeadType;
    direction: "asc" | "desc" | null;
  };
  organizationId?: number;
  userId?: number;
  status?: string | null;
  startDate?: string | null;
  search?: string | null;
};

export type SpreadsheetRowType = {
  id: number;
  email: string;
  name: string;
  contact: string;
  notes: string;
  message?: string | null;
  countryCode?: string;
};

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface SpreadsheetRowSuccessType extends SpreadsheetRowType {
  id: number;
  countryCode: string;
  leadId?: number; // Added to support existing lead tracking
}

export interface SpreadsheetRowErrorType extends SpreadsheetRowType {
  id: number;
  countryCode?: string;
  message?: string;
  possibleCountries?: CountryCode[];
}

export type LeadBulkBodyType = {
  leads: Array<{
    name: string;
    email: string;
    countryCode: string;
    contact?: string;
  }>;
  phoneNumberId: string;
  timezone?: string;
  organizationId: number | null;
  executionTime?: string;
  assistantId: number;
  name: string;
  isDraft?: boolean;
  isSchedular?: boolean;
};

export type FailLeadQueryType = {
  page: number;
  limit: number;
  search?: string | null;
  startDate?: string | null;
};

export type FailLeadType = {
  id: number;
  leadId: number;
  error: string;
  createdAt: Date;
  updatedAt: Date;
  lead: LeadType;
};
