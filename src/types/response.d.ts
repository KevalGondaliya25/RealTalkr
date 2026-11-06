export type Response<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ErrorResponse = {
  status: number;
  data: {
    success: boolean;
    status: string;
    message: string;
    data: null;
  };
};
