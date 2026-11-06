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
import CreatePhone from "@/components/elements/create-phone";
import {
  useDeletePhoneNumberMutation,
  useGetPhoneNumberQuery,
} from "@/redux/query/phonenumber";
import { GetPhoneNumber } from "@/types/phone-number";
import EditPhone from "@/components/elements/edit-phone";

type SortDirection = "asc" | "desc" | null;
interface SortConfig {
  key: keyof LeadType;
  direction: SortDirection;
}

export default function Page() {
  const router = useRouter();
  const userId = useSelector(selectCurrentUserId);
  const organizationId = useSelector(selectCurrentOrganizationId);

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
  const [phoneData, setPhoneData] = useState<Array<GetPhoneNumber>>([]);

  const [pagination, setPagination] = useState<TablePagination>({
    currentPage: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  });

  const [search, setSearch] = useState<string | null>(null);
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LeadType;
    direction: "asc" | "desc" | null;
  } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  const { data, refetch, isFetching, isLoading } = useGetPhoneNumberQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    search: search || "",
    organizationId: organizationId || undefined,
    userId: userId || undefined,
  });

  const [deletePhone, { isLoading: deleteLoading }] =
    useDeletePhoneNumberMutation();

  const handleLeadDelete = async (id: number) => {
    try {
      const response = await deletePhone({ id }).unwrap();
      if (response.success) {
        setPhoneData([]);
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
      setPhoneData(data.data.data);
      setPagination({
        currentPage: data.data.currentPage,
        limit: data.data.limit,
        total: data.data.total,
        totalPages: data.data.totalPages,
      });
      refetch();
    }
  }, [organizationId, data]);

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
          className="min-w-20 text-charcoal"
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button
          onClick={() => setIsOpenCreate(!isOpenCreate)}
          className="!h-10 !py-2 border-[2px] border-theme text-theme hover:bg-theme-300 rounded-md"
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
                // onClick={() => requestSort("id")}
              >
                Id
              </TableHead>
              <TableHead
                className="text-center cursor-pointer text-charcoal"
                // onClick={() => requestSort("name")}
              >
                <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                  <span>Provider</span>
                </div>
              </TableHead>
              <TableHead
                className="text-center cursor-pointer text-charcoal"
                // onClick={() => requestSort("name")}
              >
                <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                  <span>Number</span>
                </div>
              </TableHead>
              <TableHead
                className="text-center cursor-pointer text-charcoal"
                // onClick={() => requestSort("name")}
              >
                <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                  <span>Assistant Name</span>
                </div>
              </TableHead>
              <TableHead className="text-center text-charcoal">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phoneData.map((phone: GetPhoneNumber) => {
              return (
                <TableRow key={phone.id} className="cursor-pointer">
                  <TableCell
                    className="font-medium text-center"
                    // onClick={() => router.push(`/lead/${phone.id}`)}
                  >
                    {phone.id}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    // onClick={() => router.push(`/lead/${phone.id}`)}
                  >
                    {phone.provider}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    // onClick={() => router.push(`/lead/${phone.id}`)}
                  >
                    {phone.number}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={() => router.push(`/lead/${phone.id}`)}
                  >
                    {phone.assistant.name}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Button
                      onClick={() => {
                        setIsOpenEdit(!isOpenEdit);
                        setEditId(phone.id.toString());
                      }}
                      className="!p-0 "
                    >
                      <Pencil className="p-0.5" />
                    </Button>
                    <Button
                      onClick={() => {
                        setDeleteDialog(!deleteDialog);
                        setDeleteId(phone.id);
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
          isFetching || isLoading || (phoneData && phoneData.length <= 0)
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
      <CreatePhone
        isOpen={isOpenCreate}
        close={() => setIsOpenCreate(!isOpenCreate)}
        fetchPhone={() => refetch()}
      />
      {editId && (
        <EditPhone
          isOpen={isOpenEdit}
          close={() => setIsOpenEdit(!isOpenEdit)}
          id={editId}
          fetchPhone={() => refetch()}
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
