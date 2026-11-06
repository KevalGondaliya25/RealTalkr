"use client";

import { Input } from "@/components/ui/input";
import {
  selectCurrentOrganizationId,
  selectCurrentUserId,
} from "@/redux/slice/user";
import _ from "lodash";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS, TRACKING_STATUS } from "@/utils/constant";
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
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  CalendarIcon,
  CircleX,
  Eye,
  Pause,
  Pencil,
  Play,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  useDeleteLeadMutation,
  useGetLeadsQuery,
  useUpdateLeadMutation,
} from "@/redux/query/lead";
import { useSelector } from "react-redux";
import { LeadType } from "@/types/lead";
import { TablePagination } from "@/types";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import { useRouter } from "next/navigation";
import Loading from "@/components/component/Loading";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Pagination, Stack } from "@mui/material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateLead from "@/components/elements/create-lead";
import moment from "moment";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";
import EditLead from "@/components/elements/edit-lead";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dayjs from "dayjs";

type SortDirection = "asc" | "desc" | null;
interface SortConfig {
  key: keyof LeadType;
  direction: SortDirection;
}

export default function Page() {
  const router = useRouter();
  const userId = useSelector(selectCurrentUserId);

  const labelStyle = "original";
  const timezones = {
    ...allTimezones,
  };

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

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
  const [leadData, setLeadData] = useState<Array<LeadType>>([]);

  const [pagination, setPagination] = useState<TablePagination>({
    currentPage: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  });

  const [startDate, setStartDate] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [status, setStatus] = useState<string>();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LeadType;
    direction: "asc" | "desc" | null;
  } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  const organizationId = useSelector(selectCurrentOrganizationId);

  const { data, refetch, isFetching, isLoading } = useGetLeadsQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortConfig || undefined,
    organizationId: organizationId || undefined,
    userId: userId || undefined,
    startDate: startDate || undefined,
    search: search || undefined,
    status: status || undefined,
  });

  const [deleteLead, { isLoading: deleteLoading }] = useDeleteLeadMutation();

  const [updateLead] = useUpdateLeadMutation();

  const handleLeadDelete = async (id: number) => {
    try {
      const response = await deleteLead({ id }).unwrap();
      if (response.success) {
        setLeadData([]);
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
    setPagination((pre) => ({
      ...pre,
      currentPage: 1,
    }));
  }, [search, startDate, status]);

  useEffect(() => {
    if (data && data.data) {
      setLeadData(data.data.data);
      setPagination({
        currentPage: data.data.currentPage,
        limit: data.data.limit,
        total: data.data.total,
        totalPages: data.data.totalPages,
      });
      refetch();
    }
  }, [organizationId, data]);

  const handleUpdateLead = async (
    id: number,
    isExecutionPause: boolean,
    lead: LeadType
  ) => {
    try {
      setLeadData((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, isExecutionPause } : lead
        )
      );
      const result = await updateLead({
        id: Number(id),
        data: {
          // ...lead,
          isExecutionPause: isExecutionPause,
          // assistantName: lead.assistant.name,
          // firstMessage: lead.assistant.firstMessage,
          // transcriberProvide: lead.assistant.transcriberProvide,
          // transcriberLanguage: lead.assistant.transcriberLanguage,
          // transcriberModel: lead.assistant.transcriberModel,
          // voiceModel: lead.assistant.voiceModel,
          // voiceId: lead.assistant.voiceId,
          // voiceProvider: lead.assistant.voiceProvider,
          // modelProvider: lead.assistant.modelProvider,
          // modelName: lead.assistant.modelName,
          // modelMessage: lead.assistant.modelMessage,
          // executionTime: format(new Date(lead.executionTime), "yyyy-MM-dd"),
        },
      }).unwrap();
      if (result.success) {
        refetch();
        // toast.success(result.message);
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  };

  const requestSort = (key: keyof LeadType) => {
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
    key: keyof LeadType,
    sortConfiguration: {
      key: keyof LeadType;
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
          className="min-w-20 text-charcoal placeholder:text-gray-500"
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
              <div className="absolute right-0 top-0 z-10">
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
                setStartDate(format(day, "yyyy-MM-dd"))
              }
            />
          </PopoverContent>
        </Popover>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger
            className={`max-w-64 ${status ? "text-charcoal" : "text-gray-500"}`}
          >
            <SelectValue placeholder="Select a status" />
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
              {Object.keys(TRACKING_STATUS).map(
                (value: string, index: number) => (
                  <SelectItem
                    key={index}
                    value={value}
                    className="capitalize text-charcoal"
                  >
                    {value?.replaceAll("_", " ")?.toLowerCase()}
                  </SelectItem>
                )
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="!h-10 !py-2 border-[2px] border-theme text-theme hover:bg-theme-300 rounded-md">
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setIsOpenCreate(!isOpenCreate)}
              className="text-charcoal text-sm"
            >
              Add Lead
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/lead/bulk")}
              className="text-charcoal text-sm"
            >
              Batch calls
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col justify-between flex-grow rounded-md bg-sidebar overflow-x-auto md:overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="text-center cursor-pointer flex items-center justify-center gap-2 text-charcoal"
                onClick={() => requestSort("id")}
              >
                Id {sortingIcon("id", sortConfig)}
              </TableHead>
              <TableHead
                className="text-center cursor-pointer text-charcoal"
                onClick={() => requestSort("name")}
              >
                <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                  <span>Name</span>
                  {sortingIcon("name", sortConfig)}
                </div>
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Assistant Name
              </TableHead>
              <TableHead
                className="text-center cursor-pointer flex items-center justify-center gap-2 text-charcoal"
                onClick={() => requestSort("trackingStatus")}
              >
                Status
                {sortingIcon("trackingStatus", sortConfig)}
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Contact
              </TableHead>
              <TableHead
                className="text-center cursor-pointer flex items-center justify-center gap-2 text-charcoal w-[200px]"
                onClick={() => requestSort("executionTime")}
              >
                Call Time
                {sortingIcon("executionTime", sortConfig)}
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Timezone
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leadData.map((leads: LeadType) => {
              const offset = parseTimezone(leads.timezone).offset || 0;
              return (
                <TableRow key={leads.id}>
                  <TableCell
                    className="font-medium text-center"
                    // onClick={() => router.push(`/lead/${leads.id}`)}
                  >
                    {leads.id}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    // onClick={() => router.push(`/lead/${leads.id}`)}
                  >
                    {leads.name}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    // onClick={() => router.push(`/lead/${leads.id}`)}
                  >
                    {leads.assistant.name}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    // onClick={() => router.push(`/lead/${leads.id}`)}
                  >
                    <Badge
                      className={`${
                        TRACKING_STATUS[leads.trackingStatus].color
                      } capitalize`}
                    >
                      {TRACKING_STATUS[leads.trackingStatus].label}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-center"
                    // onClick={() => router.push(`/lead/${leads.id}`)}
                  >
                    {leads.contact}
                  </TableCell>
                  <TableCell
                    className="text-center w-[200px]"
                    // onClick={() => router.push(`/lead/${leads.id}`)}
                  >
                    {/* {moment
                      .utc(leads.executionTime)
                      .utcOffset((parseTimezone(leads.timezone).offset || 0) * 60)
                      .format("DD-MM-YYYY HH:mm")} */}
                    {leads.executionTime && (
                      <div className=" flex flex-col items-center justify-center">
                        <div className="w-max">
                          {moment
                            .utc(leads.executionTime)
                            .add(offset * 60, "minutes")
                            .format("DD MMM, yyyy hh:mm A")}
                        </div>
                        <div className="text-[11px] w-max">
                          {moment
                            .utc(leads.executionTime)
                            .format("DD MMM, yyyy hh:mm A")}{" "}
                          (UTC)
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    // onClick={() => router.push(`/lead/${leads.id}`)}
                  >
                    {leads.timezone}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Button
                      onClick={() => router.push(`/lead/${leads.id}`)}
                      className="!p-0 "
                    >
                      <Eye className="p-0.5" />
                    </Button>
                    <Button
                      onClick={() => {
                        setIsOpenEdit(!isOpenEdit);
                        setEditId(leads.id.toString());
                      }}
                      className="!p-0 "
                    >
                      <Pencil className="p-0.5" />
                    </Button>
                    <Button
                      onClick={() =>
                        handleUpdateLead(
                          leads.id,
                          !leads.isExecutionPause,
                          leads
                        )
                      }
                      className="!p-0 "
                    >
                      {leads.isExecutionPause ? <Play /> : <Pause />}
                    </Button>
                    <Button
                      onClick={() => {
                        setDeleteDialog(!deleteDialog);
                        setDeleteId(leads.id);
                      }}
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
        {Boolean(
          isFetching || isLoading || (leadData && leadData.length <= 0)
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
      <CreateLead
        isOpen={isOpenCreate}
        close={() => setIsOpenCreate(!isOpenCreate)}
        fetchLead={() => refetch()}
      />
      {editId && (
        <EditLead
          isOpen={isOpenEdit}
          close={() => setIsOpenEdit(!isOpenEdit)}
          id={editId}
          fetchLead={() => refetch()}
        />
      )}

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
              onClick={() => handleLeadDelete(deleteId)}
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
