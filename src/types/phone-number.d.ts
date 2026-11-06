export type PhoneNnumberType = {
  provider: string;
  number: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  credentialId: string;
  assistantId: number;
  organizationId: number;
};

export type GetAllPhoneNumberPayload = {
  page: number;
  limit: number;
  search: string;
  organizationId?: number;
  userId?: number;
};

export type GetPhoneNumber = {
  id: number;
  provider: string;
  number: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  credentialId: string;
  vapiPhoneNumber: string;
  assistantId: number;
  organizationId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  assistant: any;
};

export type PhoneNumberBodyType = {
  provider: string;
  number: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  credentialId?: string;
  assistantId: number;
  organizationId: any;
};

export type PhoneNumberType = {
  contact(arg0: string, contact: any): unknown;
  id: string;
  provider: string;
  number: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  credentialId: string;
  vapiPhoneNumber: string;
  assistantId: number;
  organizationId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PhoneNumberEditBodyType = {
  provider: string;
  number: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  credentialId?: string;
  assistantId: number;
  organizationId: number;
};
