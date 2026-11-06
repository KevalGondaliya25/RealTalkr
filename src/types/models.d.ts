import type { ModelPayload, Provider, Language, Model } from '@/types/models';

export type ModelPayload = {
    transcriber: Provider[];
    voice: Provider[];
    model: Provider[];
}

export type Language = {
    name: string;   
    code: string;
}

export type Provider = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  models: Model[];
  languages?: Language[];
  voices?: string[];
  type: 'transcriber' | 'voice' | 'model';
};

export type Model = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  providerId: string;
deleted?: boolean; // soft-delete flag
};

export type ModelCache = {
  lastUpdated: string; 
  payload: ModelPayload;
};