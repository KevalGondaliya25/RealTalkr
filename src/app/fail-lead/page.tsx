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
  CalendarIcon,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleX,
  MinusSquare,
  Pencil,
  PlusSquare,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TablePagination } from "@/types";
import Loading from "@/components/component/Loading";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Pagination, Stack } from "@mui/material";
import moment from "moment";
import { useGetFailLeadQuery } from "@/redux/query/lead";
import { FailLeadType } from "@/types/lead";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import EditLead from "@/components/elements/edit-lead";

export default function Page() {
  const [date, setDate] = useState<Date>();
  const [failLead, setFailLead] = useState<Array<FailLeadType>>([]);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>();

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

  const [pagination, setPagination] = useState<TablePagination>({
    currentPage: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  });
  const [search, setSearch] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [callables, setCallables] = useState<Array<number>>([]);

  const { data, isFetching, isLoading, refetch } = useGetFailLeadQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    startDate: startDate,
    search: search,
  });

  useEffect(() => {
    if (data && data?.data) {
      setFailLead(data.data.data);
      setPagination({
        currentPage: data.data.currentPage,
        limit: data.data.limit,
        total: data.data.total,
        totalPages: data.data.totalPages,
      });
    }
  }, [data]);

  useEffect(() => {
    setPagination((pre) => ({
      ...pre,
      currentPage: 1,
    }));
  }, [search, startDate]);

  return (
    <>
      <div className="flex flex-col flex-grow gap-4 max-md:overflow-x-auto max-md:max-w-full max-md:w-screen">
        <div className="flex max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md">
          <Input
            type="text"
            placeholder="Search"
            onChange={(event) => setSearch(event.target.value)}
            className="text-charcoal placeholder:text-gray-500"
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
                    <span className="text-gray-500 normal-case">
                      Pick a date
                    </span>
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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                onDayClick={(day: Date) =>
                  setStartDate(format(day, "yyyy-MM-dd"))
                }
                initialFocus
                className="text-charcoal"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col justify-between flex-grow rounded-md bg-sidebar">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="flex justify-center items-center cursor-pointer text-charcoal">
                  <div className="w-full flex items-center justify-center text-charcoal">
                    <Button
                      className="!h-7 !py-1  !px-2 shadow-md text-white bg-theme-800 hover:shadow-sm"
                      onClick={() => {
                        if (failLead.length === callables.length) {
                          setCallables([]);
                        } else {
                          setCallables(failLead.map((fail) => fail.id));
                        }
                      }}
                      title={
                        failLead.length === callables.length
                          ? "Collapse All"
                          : "Expand All"
                      }
                    >
                      {failLead.length === callables.length ? (
                        <MinusSquare className="h-4 w-4" />
                      ) : (
                        <PlusSquare className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="text-center cursor-pointer text-charcoal">
                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                    <span className="text-charcoal">Id</span>
                  </div>
                </TableHead>
                <TableHead className="text-center cursor-pointer text-charcoal">
                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                    <span className="text-charcoal">Name</span>
                  </div>
                </TableHead>
                <TableHead className="text-center cursor-pointer text-charcoal">
                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                    <span className="text-charcoal">Contact</span>
                  </div>
                </TableHead>
                <TableHead className="text-center cursor-pointer text-charcoal">
                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                    <span className="text-charcoal">Email</span>
                  </div>
                </TableHead>
                <TableHead className="text-center cursor-pointer text-charcoal">
                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                    <span className="text-charcoal">Execution time</span>
                  </div>
                </TableHead>
                <TableHead className="text-center cursor-pointer text-charcoal">
                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                    <span className="text-charcoal">Created</span>
                  </div>
                </TableHead>
                <TableHead className="text-center cursor-pointer text-charcoal">
                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                    <span className="text-charcoal">Action</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failLead.map((failLead) => (
                <React.Fragment key={failLead.id}>
                  <TableRow>
                    <TableCell className="flex justify-center">
                      <Collapsible
                        open={callables.includes(failLead.id)}
                        onOpenChange={(open) => {
                          setCallables((prev) =>
                            open
                              ? [...prev, failLead.id]
                              : prev.filter((n) => n !== failLead.id)
                          );
                        }}
                      >
                        <CollapsibleTrigger asChild>
                          <span className="flex items-center justify-center bg-theme-800 text-white rounded p-1 size-6 text-center">
                            {callables.includes(failLead.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </span>
                        </CollapsibleTrigger>
                        {/* The content will be rendered below */}
                      </Collapsible>
                    </TableCell>
                    <TableCell className="text-center">{failLead.id}</TableCell>
                    <TableCell className="text-center">
                      {failLead.lead?.name || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {failLead.lead?.contact || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {failLead.lead?.email || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {failLead.lead?.executionTime
                        ? format(
                            new Date(failLead.lead.executionTime),
                            "dd MMM, yyyy hh:mm a"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {failLead.createdAt
                        ? format(
                            new Date(failLead.createdAt),
                            "dd MMM, yyyy hh:mm a"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center p-0">
                      <Button
                        onClick={() => {
                          setIsOpenEdit(!isOpenEdit);
                          setEditId(failLead.lead.id.toString());
                        }}
                        className="!p-0 "
                      >
                        <Pencil className="p-0.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {/* This row is conditionally shown when open */}
                  {callables.includes(failLead.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50 ">
                        <pre className="bg-white rounded-lg shadow-lg border-dashed m-3 border-2  p-4 md:max-w-[calc(100vw-360px)] max-w-[calc(100vw-90px)] w-full overflow-x-scroll">
                          {failLead.error !== ""
                            ? JSON.stringify(
                                JSON.parse(failLead.error),
                                null,
                                2
                              )
                            : "No log found"}
                        </pre>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          {Boolean(
            isFetching || isLoading || (failLead && failLead.length <= 0)
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
      </div>
      {editId && (
        <EditLead
          isOpen={isOpenEdit}
          close={() => setIsOpenEdit(!isOpenEdit)}
          id={editId}
          fetchLead={() => refetch()}
        />
      )}
    </>
  );
}
