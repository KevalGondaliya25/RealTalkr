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
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  CalendarIcon,
  Check,
  CircleX,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useGetUsersQuery, useUpdateUserMutation } from "@/redux/query/user";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import { UserType } from "@/types/user";
import { TablePagination } from "@/types";
import Loading from "@/components/component/Loading";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Pagination, Stack } from "@mui/material";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";

type SortDirection = "asc" | "desc" | null;
interface SortConfig {
  key: keyof UserType;
  direction: SortDirection;
}

export default function Page() {
  const [date, setDate] = useState<Date>();
  const [userData, setUserData] = useState<Array<UserType>>([]);

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

  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserType;
    direction: "asc" | "desc" | null;
  } | null>(null);

  const { data, isFetching, isLoading, refetch } = useGetUsersQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortConfig || undefined,
    startDate: startDate,
    search: search,
  });
  const [updateUser] = useUpdateUserMutation();

  const handleUpdateIsEnable = async (id: number, value: boolean) => {
    try {
      setUserData((prev: Array<UserType>) =>
        prev.map((user: UserType) =>
          user.id === id ? { ...user, isEnable: value } : user
        )
      );
      await updateUser({
        id: id,
        data: { isEnable: value },
      }).unwrap();
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  };

  useEffect(() => {
    if (data && data?.data) {
      setUserData(data.data.data.users);
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

  const requestSort = (key: keyof UserType) => {
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
    key: keyof UserType,
    sortConfiguration: {
      key: keyof UserType;
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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                onDayClick={(day: Date) =>
                  setStartDate(
                    moment(format(day, "yyyy-MM-dd")).utc().toISOString()
                  )
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
                    <span className="text-charcoal">Name</span>
                    {sortingIcon("name", sortConfig)}
                  </div>
                </TableHead>
                <TableHead
                  className="text-center cursor-pointer text-charcoal"
                  onClick={() => requestSort("email")}
                >
                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                    <span className="text-charcoal">Email</span>
                    {sortingIcon("email", sortConfig)}
                  </div>
                </TableHead>
                <TableHead
                  className="text-center cursor-pointer text-charcoal"
                  onClick={() => requestSort("role")}
                >
                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                    <span className="text-charcoal">Role</span>
                    {sortingIcon("role", sortConfig)}
                  </div>
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
                <TableHead className="text-center text-charcoal">
                  IsEnable
                </TableHead>
                <TableHead className="text-center text-charcoal">
                  Terms & Condition
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.map((users: UserType) => (
                <TableRow key={users.id}>
                  <TableCell className="font-medium text-center">
                    {users.id}
                  </TableCell>
                  <TableCell className="text-center">{users.name}</TableCell>
                  <TableCell className="text-center">{users.email}</TableCell>
                  <TableCell className="text-center">
                    <span className="capitalize">
                      {`${users.role}`.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {format(users.createdAt, "dd MMM, yyyy hh:mm a")}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <div className="flex items-center space-x-2 ">
                      <Switch
                        id="airplane-mode"
                        className="h-7"
                        checked={users.isEnable}
                        onCheckedChange={(value) =>
                          handleUpdateIsEnable(users.id, value)
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {users.termsAndCondition ? (
                        <Check className="text-theme" />
                      ) : (
                        <CircleX className="opacity-25" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {Boolean(
            isFetching || isLoading || (userData && userData.length <= 0)
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
    </>
  );
}
