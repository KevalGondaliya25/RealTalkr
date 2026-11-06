"use client";

import dynamic from "next/dynamic";
import Loading from "@/components/component/Loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteTermMutation, useGetTermsQuery } from "@/redux/query/terms";
import { TermsType } from "@/types/terms";
import { Eye, Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ErrorResponse } from "@/types/response";
import { toast } from "sonner";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function Page() {
  const router = useRouter();

  const [terms, setTerms] = useState<Array<TermsType>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [teemValue, setTermValue] = useState("");
  const { data, isLoading, refetch } = useGetTermsQuery();
  const [deleteTerm, { isLoading: isDeleting }] = useDeleteTermMutation();

  const handleDeleteTerm = async (id: number) => {
    try {
      setDeletedId(id);
      const result = await deleteTerm({ id: `${id}` }).unwrap();
      if (result.success) {
        toast.success(result.message);
        refetch();
      }
      setDeletedId(null);
    } catch (error) {
      toast.error(
        (error as ErrorResponse).data.message || "Internal Server Error"
      );
      setDeletedId(null);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data) {
      setTerms(data.data);
    }
  }, [data]);

  const dialogOpen = () => {
    if (isOpen) {
      setTermValue("");
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex flex-col flex-grow gap-4 max-md:overflow-x-auto max-md:max-w-full max-md:w-screen">
        <div className="flex items-center justify-between max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md">
          <span>All Terms of Conditions</span>
          <Button
            className="!h-10 !py-2 border-[2px] border-theme text-theme hover:bg-theme-300 rounded-md"
            onClick={() => router.push("/terms/create")}
          >
            Create Terms
          </Button>
        </div>
        <div
          className={`flex ${
            isLoading ? "justify-center items-center" : ""
          } max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md h-full`}
        >
          {isLoading ? (
            <div className="text-theme">
              <Loading />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left cursor-pointer center gap-2 text-charcoal">
                    Version
                  </TableHead>
                  {/* <TableHead className="text-center cursor-pointer text-charcoal">
                    Content
                  </TableHead> */}
                  <TableHead className="text-left text-charcoal">
                    Created At
                  </TableHead>
                  <TableHead className="text-center text-charcoal">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms.map((term: TermsType) => {
                  return (
                    <TableRow key={term.id} className="cursor-pointer">
                      <TableCell className="font-medium text-left">
                        {term.version}
                      </TableCell>
                      {/* <TableCell
                        className="font-medium text-center"
                        onClick={() => router.push(`/terms/${term.id}`)}
                      >
                        <ReactQuill
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
                          theme="bubble"
                          value={term.content}
                          readOnly={true}
                        />
                      </TableCell> */}
                      <TableCell className="text-left w-[200px]">
                        {moment
                          .utc(term.createdAt)
                          .format("DD MMM, yyyy hh:mm A")}
                      </TableCell>
                      <TableCell className="flex justify-center gap-2">
                        <Button
                          onClick={() => {
                            setIsOpen(!isOpen);
                            setTermValue(term.content);
                          }}
                          className="!p-0 "
                        >
                          <Eye className="p-0.5" />
                        </Button>
                        <Button
                          onClick={() => router.push(`/terms/${term.id}`)}
                          className="!p-0 "
                        >
                          <Pencil className="p-0.5" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTerm(term.id)}
                          disabled={deletedId === term.id && isDeleting}
                          className="!p-0"
                        >
                          <Trash2 className="text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
        <Dialog onOpenChange={dialogOpen} open={isOpen} modal>
          <DialogContent
            onEscapeKeyDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            className="px-[5px] md:px-[25px] pb-[60px] md:pb-[80px] pt-[50px] md:pt-[70px] max-w-[calc(100%-20px)] md:max-w-[550px] max-h-[90vh] border-[0px] !rounded-[30px] bg-white z-[999] [&>button]:border [&>button]:border-border [&>button]:rounded-full [&>button]:p-3 [&>button]:top-2 [&>button]:right-2 [&>button]:text-primary"
          >
            <ReactQuill
              className={`quill w-full h-fit 
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
              theme="bubble"
              value={teemValue}
              readOnly={true}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
