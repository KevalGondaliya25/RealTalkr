"use client";

import { Input } from "@/components/ui/input";
import _ from "lodash";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  CalendarIcon,
  CircleX,
  Eye,
  Pause,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, intervalToDuration } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetAllCallsQuery } from "@/redux/query/call";
import { AllCallsResponseType } from "@/types/call";
import { TablePagination } from "@/types";
import { toast } from "sonner";
import { STATUS } from "@/utils/constant";
import { useSelector } from "react-redux";
import {
  selectCurrentOrganizationId,
  selectCurrentUserId,
} from "@/redux/slice/user";
import Loading from "@/components/component/Loading";
import { STATUS_COLOR } from "@/utils/constant";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Pagination, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import moment from "moment";

type SortDirection = "asc" | "desc" | null;
interface SortConfig {
  key: keyof AllCallsResponseType;
  direction: SortDirection;
}

export default function Page() {
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
  const [callLogData, setCallLogData] = useState<Array<AllCallsResponseType>>(
    []
  );
  const router = useRouter();
  const userId = useSelector(selectCurrentUserId);

  const [pagination, setPagination] = useState<TablePagination>({
    currentPage: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  });
  const [startDate, setStartDate] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState<string | null>(null);
  const [callDurationFormate, setCallDurationFormate] = useState<string | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState<number>();
  const audioRefs = useRef<HTMLAudioElement | null>(null);

  const organizationId = useSelector(selectCurrentOrganizationId);
  const [status, setStatus] = useState<string>();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AllCallsResponseType;
    direction: "asc" | "desc" | null;
  } | null>(null);

  const { data, isFetching, isLoading, refetch } = useGetAllCallsQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    organizationId: organizationId || undefined,
    search: search ? search : undefined,
    startDate: startDate || undefined,
    callDuration: Number(callDuration) || undefined,
    userId: userId || undefined,
    status: status,
    sort: sortConfig || undefined,
  });

  // useEffect(() => {
  //   if (isFetching) {
  //     setCallLogData([]);
  //   }
  // }, [isFetching]);

  useEffect(() => {
    setPagination((pre) => ({
      ...pre,
      currentPage: 1,
    }));
    refetch();
  }, [search, startDate, callDuration, status]);

  const handlePlayPause = (id: number, recUrl: string) => {
    if (audioRefs.current) {
      if (isPlaying === id) {
        setIsPlaying(0);
        audioRefs.current.src = "";
        audioRefs.current.pause();
      } else {
        setIsPlaying(id);
        audioRefs.current.src = recUrl;
        audioRefs.current.load();

        audioRefs.current.oncanplaythrough = () => {
          audioRefs.current?.play().catch((err) => {
            toast.error("Error playing the audio:");
          });
        };
      }
    }
  };

  const requestSort = (key: keyof AllCallsResponseType) => {
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
    key: string,
    sortConfiguration: {
      key: keyof AllCallsResponseType;
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

  useEffect(() => {
    if (data && data.data) {
      setCallLogData(data.data.data);
      setPagination({
        currentPage: data.data.currentPage,
        limit: data.data.limit,
        total: data.data.total,
        totalPages: data.data.totalPages,
      });
    }
  }, [data]);

  return (
    <>
      <div className="flex max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md overflow-x-auto focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0">
        <Input
          type="text"
          placeholder="Search by lead name"
          className="text-charcoal placeholder:text-gray-500 min-w-60"
          onChange={(event) => setSearch(event.target.value)}
        />

        <Popover>
          <div className="relative w-full flex justify-center md:max-w-96 min-w-60">
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
              <div className="absolute right-0 top-0 z-10">
                <CircleX
                  className="h-4 w-4  m-3 text-charcoal"
                  onClick={() => {
                    setStartDate(null);
                    setDate(undefined);
                  }}
                />
              </div>
            )}
          </div>
          <PopoverContent className="w-full p-0" align="start">
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

        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger
            className={`max-w-full min-w-60 ${
              status ? "text-charcoal" : "text-gray-500"
            }`}
          >
            <SelectValue
              placeholder="Select a status"
              className="text-charcoal"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                key={STATUS.length}
                value={"All"}
                className="capitalize text-charcoal"
              >
                All
              </SelectItem>
              {STATUS.filter((status) => status !== "new")
                .map(
                  (value: string) =>
                    value.charAt(0).toUpperCase() + value.slice(1)
                )
                .map((value: string, index: number) => (
                  <SelectItem
                    key={index}
                    value={value}
                    className="capitalize text-charcoal"
                  >
                    {value}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="relative w-full min-w-60">
          <Input
            type="number"
            placeholder="Call duration"
            className="min-w-10 text-charcoal placeholder:text-gray-500"
            max={3600}
            onChange={(event) => {
              if (event.target.value) {
                setCallDuration(event.target.value);
                const duration = intervalToDuration({
                  start: 0,
                  end: parseInt(event.target.value, 0) * 1000,
                });
                setCallDurationFormate(
                  `${
                    duration.hours && duration.hours > 0
                      ? `${duration.hours} hour`
                      : ""
                  } ${
                    duration.minutes && duration.minutes > 0
                      ? `${duration.minutes} min`
                      : ""
                  } ${
                    duration.seconds && duration.seconds > 0
                      ? `${duration.seconds} sec`
                      : ""
                  }`
                );
              } else {
                setCallDurationFormate("");
                setCallDuration("");
              }
            }}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white min-w-28 h-9 py-1 mr-3 flex justify-end items-center">
            {callDurationFormate}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between flex-grow rounded-md bg-sidebar overflow-x-auto md:overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead
                className="text-center cursor-pointer flex items-center justify-center gap-2 text-charcoal"
                onClick={() => requestSort("id")}
              >
                Id {sortingIcon("id", sortConfig)}
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Lead Name
              </TableHead>
              {/* <TableHead className="text-center text-charcoal">Type</TableHead> */}
              <TableHead
                className="text-center cursor-pointer flex items-center justify-center gap-2 text-charcoal"
                onClick={() => requestSort("callStatus")}
              >
                Status {sortingIcon("callStatus", sortConfig)}
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Ended Reason
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Summary
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Recording
              </TableHead>
              <TableHead
                className="text-center cursor-pointer flex items-center justify-center gap-2 text-charcoal"
                onClick={() => requestSort("durationMs")}
              >
                Duration {sortingIcon("durationMs", sortConfig)}
              </TableHead>
              <TableHead
                className="text-center cursor-pointer text-charcoal"
                onClick={() => requestSort("createdAt")}
              >
                <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                  <span className="text-charcoal">Created</span>
                  {sortingIcon("createdAt", sortConfig)}
                </div>
              </TableHead>
              <TableHead
                className="text-center cursor-pointer text-charcoal"
                onClick={() => requestSort("createdAt")}
              >
                <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                  <span className="text-charcoal">Action</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {callLogData &&
              callLogData.length > 0 &&
              callLogData.map((logs: AllCallsResponseType) => {
                const duration = intervalToDuration({
                  start: 0,
                  end: logs.durationMs,
                });
                const callDuration = logs.durationMs
                  ? `${
                      duration.minutes && duration.minutes > 0
                        ? `${duration.minutes} min`
                        : ""
                    } ${
                      duration.seconds && duration.seconds > 0
                        ? `${duration.seconds} sec`
                        : ""
                    }`
                  : "0 sec";
                return (
                  <TableRow key={logs.id}>
                    <TableCell
                      className="font-medium text-center"
                      // onClick={() => router.push(`/call-logs/${logs.id}`)}
                    >
                      {logs.id}
                    </TableCell>
                    <TableCell
                      className="text-center cursor-pointer"
                      // onClick={() => router.push(`/call-logs/${logs.id}`)}
                    >
                      {logs.lead?.name || ""}
                    </TableCell>
                    {/* <TableCell
                      className="capitalize text-center cursor-pointer"
                      onClick={() => router.push(`/call-logs/${logs.id}`)}
                    >
                      {logs.assistant?.type.toLowerCase() || ""}
                    </TableCell> */}
                    <TableCell
                      className="text-center cursor-pointer"
                      // onClick={() => router.push(`/call-logs/${logs.id}`)}
                    >
                      <Badge
                        className={`${
                          STATUS_COLOR[logs.callStatus.toLowerCase()]
                        } capitalize text-center`}
                      >
                        {logs.callStatus}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-center cursor-pointer"
                      // onClick={() => router.push(`/call-logs/${logs.id}`)}
                    >
                      <Tooltip>
                        <TooltipTrigger
                          asChild
                          className="relative max-w-xs overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                        >
                          <span className="capitalize">
                            {logs.endedReason
                              ? logs.endedReason && logs.endedReason.length > 20
                                ? `${logs.endedReason
                                    .slice(0, 20)
                                    .replaceAll("-", " ")
                                    .toLowerCase()}...`
                                : logs.endedReason
                                    .replaceAll("-", " ")
                                    .toLowerCase()
                              : ""}
                          </span>
                        </TooltipTrigger>
                        {logs.endedReason && (
                          <TooltipContent
                            side="bottom"
                            align="center"
                            className="rounded-lg shadow-lg max-w-xs capitalize"
                          >
                            <span>
                              {logs.endedReason
                                .replaceAll("-", " ")
                                .toLowerCase()}
                            </span>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      className="text-center cursor-pointer"
                      // onClick={() => router.push(`/call-logs/${logs.id}`)}
                    >
                      <Tooltip>
                        <TooltipTrigger
                          asChild
                          className="relative max-w-xs overflow-hidden text-ellipsis whitespace-nowrap "
                        >
                          <span>
                            {logs.summary
                              ? logs.summary && logs.summary.length > 30
                                ? `${logs.summary.slice(0, 30)}...`
                                : logs.summary
                              : ""}
                          </span>
                        </TooltipTrigger>
                        {logs.summary && (
                          <TooltipContent
                            side="bottom"
                            align="center"
                            className="rounded-lg shadow-lg max-w-xs"
                          >
                            <span>{logs.summary}</span>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() =>
                          handlePlayPause(logs.id, logs.recordingUrl)
                        }
                        className="!p-0"
                        disabled={logs.durationMs <= 0}
                      >
                        {isPlaying === logs.id ? <Pause /> : <Play />}
                      </Button>
                    </TableCell>
                    <TableCell
                      className="text-center cursor-pointer"
                      // onClick={() => router.push(`/call-logs/${logs.id}`)}
                    >
                      {callDuration}
                    </TableCell>
                    <TableCell
                      className="text-center cursor-pointer"
                      // onClick={() => router.push(`/call-logs/${logs.id}`)}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-max">
                          {format(
                            new Date(logs.createdAt),
                            "dd MMM, yyyy hh:mm a"
                          )}
                        </div>
                        {/* <div className="text-[11px] w-max">
                          {moment
                            .utc(logs.createdAt)
                            .format("DD MMM, yyyy hh:mm A")}{" "}
                          (UTC)
                        </div> */}
                      </div>
                    </TableCell>
                    <TableCell className="text-center cursor-pointer">
                      <Button
                        onClick={() => router.push(`/call-logs/${logs.id}`)}
                        className="!p-0 "
                      >
                        <Eye className="p-0.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {Boolean(
          isFetching || isLoading || (callLogData && callLogData.length <= 0)
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
        <audio ref={audioRefs} src={audioRefs ? audioRefs?.current?.src : ""} />
      </div>
    </>
  );
}
