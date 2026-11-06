export type OrganizationType = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationCreatePayload = {
  name: string;
  userId?: number;
};
