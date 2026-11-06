export type UploadFileType = {
  total: number;
  file: Array<{
    fileName: string;
    type: string;
    url: string;
  }>;
};
