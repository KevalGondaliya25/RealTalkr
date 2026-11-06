"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  useGetOneTermsQuery,
  useUpdateTermMutation,
} from "@/redux/query/terms";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { ErrorResponse } from "@/types/response";
import Loading from "@/components/component/Loading";
import { TermsType } from "@/types/terms";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [value, setValue] = useState<string>("");
  const [term, setTerm] = useState<TermsType | null>(null);

  const { data, isLoading, refetch } = useGetOneTermsQuery({
    id: params.id,
  });

  useEffect(() => {
    refetch();
  }, [params.id]);

  useEffect(() => {
    if (data) {
      setTerm(data.data);
      setValue(data.data.content);
    }
  }, [data]);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    ["link", "image", "video"],

    // [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    // [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];

  const [updateTerm, { isLoading: isUpdating }] = useUpdateTermMutation();

  const handleCreateTerm = async () => {
    if (!value || value === "<p><br></p>") {
      toast.error("Please enter the content");
      return;
    }
    try {
      const result = await updateTerm({
        content: value,
        id: params.id,
      }).unwrap();
      if (result.success) {
        toast.success(result.message);
        router.push("/terms");
      }
    } catch (error) {
      toast.error(
        (error as ErrorResponse).data.message || "Internal Server Error"
      );
    }
  };

  return (
    <>
      <div className="flex flex-col flex-grow gap-4 max-md:overflow-x-auto max-md:max-w-full max-md:w-screen">
        <div className="flex items-center justify-between max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md">
          <span>Terms and Condition ({term ? term.version : ""})</span>
          <Button
            className="!h-10 !py-2 border-[2px] border-theme text-theme hover:bg-theme-300 rounded-md"
            onClick={handleCreateTerm}
            disabled={isUpdating}
          >
            {isUpdating ? <Loading /> : "Publish"}
          </Button>
        </div>
        <div
          className={`flex ${
            isLoading ? "justify-center items-center" : ""
          } max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md h-full pb-4`}
        >
          {isLoading ? (
            <div className="text-theme">
              <Loading />
            </div>
          ) : (
            <ReactQuill
              modules={{
                toolbar: toolbarOptions,
              }}
              className={`quill w-full h-fit pt-4 
                [&>.ql-toolbar]:sticky 
                [&>.ql-toolbar]:top-0 
                [&>.ql-toolbar]:z-50 
                [&>.ql-toolbar]:bg-white 
                [&>.ql-container]:max-h-[calc(90vh-260px)] 
                [&>.ql-container]:overflow-y-auto 
                [&>.ql-container]:scrollbar-hide 
                [&>.ql-container]:text-charcoal 
                [&>.ql-container_.ql-clipboard]:hidden 
                [&>.ql-container_.ql-tooltip]:hidden 
                [&>.ql-container>.ql-editor>h1]:text-[32px] 
                [&>.ql-container>.ql-editor>h2]:text-[24px] 
                [&>.ql-container>.ql-editor>h3]:text-[18.72px] 
                [&>.ql-container>.ql-editor>h4]:text-[16px] 
                [&>.ql-container>.ql-editor>h5]:text-[13.28px] 
                [&>.ql-container>.ql-editor>h6]:text-[10.72px]
                [&>.ql-container>.ql-editor>p]:text-[14px]
                [&>.ql-container>.ql-editor>p]:text-charcoal 
                [&>.ql-container>.ql-editor>ul]:text-[14px]
                [&>.ql-container>.ql-editor>ul]:leading-5
                [&>.ql-container>.ql-editor>ul]:pl-0
                `}
              value={value}
              onChange={setValue}
            />
          )}
        </div>
      </div>
    </>
  );
}
