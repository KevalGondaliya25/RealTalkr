"use client";

import _ from "lodash";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useDeleteAssistantMutation,
  useGetAllAssistantQuery,
} from "@/redux/query/assistant";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorResponse } from "@/types/response";
import { Pagination, Stack } from "@mui/material";
import { Calendar } from "@/components/ui/calendar";
import Loading from "@/components/component/Loading";
import { TooltipContent } from "@/components/ui/tooltip";
import { AssistantResponseType } from "@/types/assistant";
import { PaginationType, TablePagination } from "@/types";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  CalendarIcon,
  CircleX,
  Eye,
  Pencil,
  Phone,
  Trash2,
} from "lucide-react";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  selectCurrentOrganizationId,
  selectCurrentUserId,
} from "@/redux/slice/user";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AvatarFallback, AvatarImage, Avatar } from "@radix-ui/react-avatar";
import Vapi from "@vapi-ai/web";
import moment from "moment";
import { VOICE_ID } from "@/utils/constant";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC!);

type SortDirection = "asc" | "desc" | null;
interface SortConfig {
  key: keyof AssistantResponseType;
  direction: SortDirection;
}

export default function Page() {
  const userId = useSelector(selectCurrentUserId);
  const theme = createTheme({
    palette: {
      primary: {
        main: "#e6503a",
      },
    },
    components: {
      // Change the hover color for buttons
      MuiButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#e6503a", // Change this to your desired hover color
            },
          },
        },
      },
    },
  });
  const [date, setDate] = useState<Date | undefined>();
  const router = useRouter();
  const [assistantData, setAssistantData] = useState<
    Array<AssistantResponseType>
  >([]);

  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isCallStarted, setIsCallStarted] = useState<boolean>(false);

  const handlePlayPause = (id: string) => {
    if (isPlaying && isPlaying !== id) {
      vapi.stop();
      setIsPlaying(id);
      return;
    }
    if (!isCallStarted) {
      setIsCallStarted(true);
      setIsPlaying(id);
    } else {
      vapi.stop();
      setIsCallStarted(false);
      setIsPlaying(null);
    }
  };

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("call started..");
    });
    vapi.on("speech-start", () => {
      console.log("speech started..");
    });
  }, []);

  useEffect(() => {
    if (isCallStarted && isPlaying) {
      vapi.start(isPlaying);
    }
  }, [isCallStarted, isPlaying]);

  const [pagination, setPagination] = useState<TablePagination>({
    currentPage: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  });

  const [startDate, setStartDate] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  const organizationId = useSelector(selectCurrentOrganizationId);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof AssistantResponseType;
    direction: "asc" | "desc" | null;
  } | null>(null);

  const { data, refetch, isFetching, isLoading } = useGetAllAssistantQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortConfig || undefined,
    startDate: startDate,
    userId: userId,
    search: search,
    organizationId: organizationId,
  });

  const [deleteAssistant, { isLoading: deleteLoading }] =
    useDeleteAssistantMutation();

  useEffect(() => {
    if (refetch) refetch();
  }, [refetch]);

  useEffect(() => {
    setPagination((pre) => ({
      ...pre,
      currentPage: 1,
    }));
  }, [startDate, search]);

  const handleAssistantDelete = async (id: number) => {
    try {
      const response = await deleteAssistant({ id }).unwrap();
      if (response.success) {
        setAssistantData([]);
        toast.success(response.message);
        refetch();
        setDeleteDialog(!deleteDialog);
        setDeleteId(0);
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  };

  useEffect(() => {
    if (data && data.data) {
      setAssistantData(data.data.data);
      setPagination({
        currentPage: data.data.currentPage,
        limit: data.data.limit,
        total: data.data.total,
        totalPages: data.data.totalPages,
      });
      refetch();
    }
  }, [data]);

  const requestSort = (key: keyof AssistantResponseType) => {
    setSortConfig((prev: SortConfig | null): SortConfig | null => {
      let newSortConfig: SortConfig | null;
      if (!prev || prev.key !== key) {
        newSortConfig = { key, direction: "asc" };
      } else if (prev.direction === "asc") {
        newSortConfig = { key, direction: "desc" };
      } else {
        newSortConfig = null;
      }
      return newSortConfig;
    });
  };

  const sortingIcon = (
    key: keyof AssistantResponseType,
    sortConfiguration: {
      key: keyof AssistantResponseType;
      direction: "asc" | "desc" | null;
    } | null
  ) => {
    if (sortConfiguration && sortConfiguration.key === key) {
      if (sortConfiguration.direction === "asc") {
        return <ArrowUp size={14} />;
      } else if (sortConfiguration.direction === "desc") {
        return <ArrowDown size={14} />;
      }
    }
    return <ArrowDownUp size={14} />;
  };

  return (
    <>
      <div className="flex max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md overflow-x-auto">
        <Input
          type="text"
          placeholder="Search"
          className="min-w-20 placeholder:text-gray-500"
          onChange={(event) => setSearch(event.target.value)}
        />
        <Popover>
          <div className="relative w-full flex justify-center md:max-w-96">
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "!p-0 !pl-3 text-charcoal bg-white w-full !gap-3 !h-[40px] justify-start !text-center font-light text-sm rounded-md",
                  !date && "text-charcoal",
                  "hover:bg-white hover:text-charcoal"
                )}
              >
                <CalendarIcon
                  className={`h-4 w-4 ${
                    date ? "text-charcoal" : "text-gray-500"
                  }`}
                />
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span className="text-gray-500 normal-case">Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            {Boolean(startDate) && (
              <div className="absolute right-0 top-0 z-10 text-charcoal">
                <CircleX
                  className="h-4 w-4  m-3"
                  onClick={() => {
                    setStartDate(null);
                    setDate(undefined);
                  }}
                />
              </div>
            )}
          </div>
          <PopoverContent className="w-full p-0 text-charcoal" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full text-charcoal"
              initialFocus
              onDayClick={(day: Date) =>
                setStartDate(
                  moment(format(day, "yyyy-MM-dd")).utc().toISOString()
                )
              }
            />
          </PopoverContent>
        </Popover>
        <Button
          className="!h-10 !py-2 border-2 border-theme text-theme hover:bg-theme-300"
          onClick={() => router.push("/assistant/create")}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-col justify-between flex-grow rounded-md bg-sidebar overflow-x-auto md:overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="text-center cursor-pointer flex items-center justify-center gap-2 text-charcoal"
                onClick={() => requestSort("id")}
              >
                <div className="flex items-center gap-2">
                  <span>Id</span> {sortingIcon("id", sortConfig)}
                </div>
              </TableHead>
              <TableHead
                className="text-center cursor-pointer text-charcoal  min-w-40"
                onClick={() => requestSort("name")}
              >
                <div className="w-full flex items-center justify-start gap-2 text-charcoal">
                  <span>Name</span>
                  {sortingIcon("name", sortConfig)}
                </div>
              </TableHead>
              <TableHead className="text-left w-[400px] text-charcoal">
                First Message
              </TableHead>
              <TableHead className="text-center text-charcoal">Voice</TableHead>
              <TableHead
                className="text-center cursor-pointer flex items-center justify-center gap-2 text-charcoal min-w-40"
                onClick={() => requestSort("updatedAt")}
              >
                Edited By {sortingIcon("updatedAt", sortConfig)}
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assistantData &&
              assistantData.length > 0 &&
              assistantData.map((assistants: AssistantResponseType) => (
                <TableRow key={assistants.id}>
                  <TableCell
                    className="font-medium text-center"
                    // onClick={() => router.push(`/assistant/${assistants.id}`)}
                  >
                    {assistants.id}
                  </TableCell>
                  <TableCell
                    className="text-left min-w-40"
                    // onClick={() => router.push(`/assistant/${assistants.id}`)}
                  >
                    {assistants.name}
                  </TableCell>
                  <TableCell
                    className="text-left"
                    // onClick={() => router.push(`/assistant/${assistants.id}`)}
                  >
                    <Tooltip>
                      <TooltipTrigger
                        asChild
                        className="relative max-w-xs overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                      >
                        <span>
                          {assistants.firstMessage
                            ? assistants.firstMessage &&
                              assistants.firstMessage.length > 50
                              ? `${assistants.firstMessage.slice(0, 50)}...`
                              : assistants.firstMessage
                            : ""}
                        </span>
                      </TooltipTrigger>
                      {assistants.firstMessage && (
                        <TooltipContent
                          side="bottom"
                          align="center"
                          className="rounded-lg shadow-lg max-w-xs"
                        >
                          <span>{assistants.firstMessage}</span>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TableCell>
                  {/* <TableCell
                    className="capitalize text-center"
                    onClick={() => router.push(`/assistant/${assistants.id}`)}
                  >
                    {assistants.type.toLowerCase()}
                  </TableCell> */}
                  <TableCell
                    className="capitalize text-center"
                    // onClick={() => router.push(`/assistant/${assistants.id}`)}
                  >
                    <div className="flex gap-2 items-center justify-center">
                      <Avatar>
                        <AvatarImage
                          className="object-cover size-8 rounded-full min-w-8"
                          src={
                            assistants.assistantImg ||
                            "/assets/images/assistant/assistant.png"
                          }
                        />
                        <AvatarFallback>RT</AvatarFallback>
                      </Avatar>
                      {Boolean(
                        !VOICE_ID[assistants.voiceProvider].includes(
                          assistants.voiceId
                        ) || VOICE_ID[assistants.voiceProvider].length <= 0
                      ) ? (
                        <span>Custom voice</span>
                      ) : (
                        <span>{assistants.voiceId.toLowerCase()}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    className="text-center min-w-40"
                    // onClick={() => router.push(`/assistant/${assistants.id}`)}
                  >
                    <div className="w-full flex flex-col items-center justify-center">
                      <div className="w-max">
                        {format(
                          new Date(assistants.updatedAt),
                          "dd MMM, yyyy hh:mm a"
                        )}
                      </div>
                      {/* <div className="text-[11px] text-center w-max">
                        {moment
                          .utc(assistants.updatedAt)
                          .format("DD MMM, yyyy hh:mm A")}{" "}
                        (UTC)
                      </div> */}
                    </div>
                  </TableCell>
                  <TableCell className="">
                    <div className="grid grid-cols-4 place-items-center justify-items-center gap-1 min-w-28 w-[72px]">
                      <Button
                        onClick={() =>
                          router.push(`/assistant/${assistants.id}`)
                        }
                        className="!p-0 "
                      >
                        <Eye className="p-0.5" />
                      </Button>
                      <Pencil
                        className="p-0.5 justify-self-center"
                        onClick={() =>
                          router.push(`/assistant/${assistants.id}`)
                        }
                      />
                      <Button
                        onClick={() =>
                          handlePlayPause(assistants.VapiAssistantId)
                        }
                        className="!p-0"
                      >
                        {Boolean(
                          isPlaying === assistants.VapiAssistantId &&
                            isCallStarted
                        ) ? (
                          <Phone className="p-0.5 justify-self-center text-red-600 rotate-135" />
                        ) : (
                          <Phone className="p-0.5 justify-self-center text-emerald-600" />
                        )}
                      </Button>
                      {assistants.type !== "LEAD" ? (
                        <Trash2
                          className="text-red-600 justify-self-center"
                          onClick={() => handleAssistantDelete(assistants.id)}
                        />
                      ) : (
                        <Trash2
                          className="text-red-600 justify-self-center opacity-25 cursor-not-allowed"
                          // onClick={() => handleAssistantDelete(assistants.id)}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {Boolean(
          isFetching ||
            isLoading ||
            (assistantData && assistantData.length <= 0)
        ) && (
          <div className="font-medium text-center text-btn-bg-main">
            {Boolean(isFetching || isLoading) ? (
              <div className="w-full flex justify-center">
                <Loading />
              </div>
            ) : (
              "No data found."
            )}
          </div>
        )}
        <ThemeProvider theme={theme}>
          <div className="flex justify-end m-5 ">
            <Stack spacing={2}>
              <Pagination
                count={pagination.totalPages}
                defaultPage={pagination.currentPage}
                shape="rounded"
                color="primary"
                onChange={(event, page) =>
                  setPagination((pre) => ({ ...pre, currentPage: page }))
                }
              />
            </Stack>
          </div>
        </ThemeProvider>
      </div>

      <Dialog
        open={deleteDialog}
        onOpenChange={(open) => setDeleteDialog(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-start">
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogClose onClick={() => setDeleteDialog(!deleteDialog)} />
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2">
            <Button
              type="submit"
              className="border-2 border-theme !h-7 text-theme hover:bg-theme-300 w-full"
              onClick={() => setDeleteDialog(!deleteDialog)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-theme !h-7 text-white w-full"
              onClick={() => handleAssistantDelete(deleteId)}
              disabled={deleteLoading}
            >
              {deleteLoading ? <Loading /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
