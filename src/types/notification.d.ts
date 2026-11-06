export type NotificationType = {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  leadId: number | null;
  callLogId: number | null;
  organizationId: number | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  subMessage: string;
};
