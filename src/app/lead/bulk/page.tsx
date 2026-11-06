"use client";

import { selectCurrentOrganizationId } from "@/redux/slice/user";
import _ from "lodash";
import { BATCH_STATUS, STATUS } from "@/utils/constant";
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
  PhoneOutgoing,
  PhoneCall,
  Phone,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  MinusSquare,
  PlusSquare,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

import {
  useDeleteBulkLeadMutation,
  useGetBulkLeadsQuery,
} from "@/redux/query/lead";
import { useSelector } from "react-redux";
import { BulkLead } from "@/types/lead";
import { TablePagination } from "@/types";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import { useRouter } from "next/navigation";
import Loading from "@/components/component/Loading";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Pagination, Stack } from "@mui/material";
import CreateLead from "@/components/elements/create-lead";
import moment from "moment";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";
import EditLead from "@/components/elements/edit-lead";
import { format } from "date-fns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

type SortDirection = "asc" | "desc" | null;
interface SortConfig {
  key: keyof BulkLead;
  direction: SortDirection;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Page() {
  const router = useRouter();


  const theme = createTheme({
    palette: {
      primary: {
        main: "#e6503a",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#e6503a",
            },
          },
        },
      },
    },
  });

  const [leadData, setLeadData] = useState<Array<BulkLead>>([]);
  const [groupedLeadData, setGroupedLeadData] = useState<Record<string, BulkLead[]>>({}); // Grouped by base name
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null); // Track expanded group

  const [pagination, setPagination] = useState<TablePagination>({
    currentPage: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
  });

  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  const organizationId = useSelector(selectCurrentOrganizationId);

  // Update the state variable to track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const { data, refetch, isFetching } = useGetBulkLeadsQuery({
    page: pagination.currentPage,
    limit: pagination.limit,
    organizationId: organizationId || undefined,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [deleteBulkLead, { isLoading: deleteLoading }] =
    useDeleteBulkLeadMutation();

  const handleLeadDelete = async (id: number) => {
    try {
      const response = await deleteBulkLead({ id }).unwrap();
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
  // Update the toggleExpand function
  const toggleExpand = (baseName: string) => {
    setExpandedGroups((prevExpandedGroups) => ({
      ...prevExpandedGroups,
      [baseName]: !prevExpandedGroups[baseName],
    }));
  };

  // Add a state variable to track whether all groups are expanded
  const [allExpanded, setAllExpanded] = useState(false);

  // Update the toggleAllGroups function
  const toggleAllGroups = () => {
    if (allExpanded) {
      collapseAllGroups();
    } else {
      expandAllGroups();
    }
    setAllExpanded(!allExpanded);
  };

  // Add a function to expand all groups
  const expandAllGroups = () => {
    const newExpandedGroups = Object.keys(groupedLeadData).reduce((acc, baseName) => {
      acc[baseName] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedGroups(newExpandedGroups);
  };

  // Add a function to collapse all groups
  const collapseAllGroups = () => {
    setExpandedGroups({});
  };

  useEffect(() => {
    if (data && data.data) {
      setLeadData(data.data.data);
      setPagination({
        currentPage: data.data.currentPage,
        limit: data.data.limit,
        total: data.data.total,
        totalPages: data.data.totalPages,
      });

      // Group batches by base name
      const grouped = _.groupBy(data.data.data, (lead) => {
        const baseName = lead.name.replace(/-\d{2}$/, ""); // Remove "-XX" suffix
        return baseName;
      });
      setGroupedLeadData(grouped);

      // Initialize expandedGroups with the first group as expanded
      const firstGroup = Object.keys(grouped)[0];
      if (firstGroup) {
        setExpandedGroups({ [firstGroup]: true });
        setAllExpanded(false);
      }
    }
  }, [organizationId, data]);
  const getGroupStatusDistribution = (batches: BulkLead[]) => {
    const statusCount = _.countBy(batches, "status");
    return Object.entries(statusCount)
      .map(([status, count]) => `${count} ${capitalize(BATCH_STATUS[status].label)}`)
      .join(", ");
  };

  return (
    <>
      <div className="flex justify-between items-center bg-sidebar rounded-md">
        <h1 className="flex m-2 p-3 text-charcoal text-xl font-semibold">
          Batch Calls
        </h1>
        <div className="flex mr-2">
          <Button
            className="!h-10 !py-4 !px-5 max-[425px]:!px-3 my-2 bg-white text-theme shadow-md"
            onClick={() => router.push("/lead")}
          >
            <ChevronLeft className="w-5 h-5" />{" "}
            <span className="mr-1 max-[425px]:hidden">Back</span>
          </Button>
          <Button
            className="!h-[40px] !pt-4 !pb-4 max-[425px]:!w-20 m-2 border-2 border-theme text-theme hover:bg-theme-300"
            onClick={() => router.push("/lead/bulk/create")}
          >
            <span className="mr-1 flex">
              {" "}
              Create <span className="sm:block hidden ps-1"> Batch Call</span>
            </span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-between flex-grow rounded-md bg-white overflow-x-auto md:overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center cursor-pointer  text-charcoal">
                <div className="flex justify-start items-center">
                  <Button
                    className="!h-7 !py-1 m me-3 !px-2 shadow-md text-white bg-theme-800 hover:shadow-sm"
                    onClick={toggleAllGroups}
                    title={allExpanded ? "Collapse All" : "Expand All"}
                  >
                    {allExpanded ? (
                      <MinusSquare className="h-4 w-4" />
                    ) : (
                      <PlusSquare className="h-4 w-4" />
                    )}
                  </Button>
                  <span>Group ID</span>
                </div>
              </TableHead>
              <TableHead className="text-center cursor-pointer  text-charcoal">Batch Count</TableHead>
              <TableHead className="text-center cursor-pointer  text-charcoal">Batch Call Name</TableHead>
              <TableHead className="text-center cursor-pointer  text-charcoal">Total Recipients</TableHead>
              <TableHead className="text-center cursor-pointer  text-charcoal">Total Call Status</TableHead>
              <TableHead className="text-center cursor-pointer  text-charcoal">Status Distribution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isFetching &&
              Object.entries(groupedLeadData).map(([baseName, batches], index) => (
                <React.Fragment key={baseName}>
                  <TableRow
                    className={expandedGroup === baseName ? "bg-gray-100" : "bg-white"}
                    onClick={() => toggleExpand(baseName)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="font-medium flex items-center justify-start gap-3">
                      <span className="flex items-center justify-center bg-theme-800 text-white rounded p-1 text-center">
                        {expandedGroups[baseName] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </span>
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-center ">
                      {batches.length == 0 ? "No Batch" : batches.length == 1 ? `${batches.length} Batch` : `${batches.length} Batches`}
                    </TableCell>
                    <TableCell className="text-center">{baseName}</TableCell>
                    <TableCell className="font-medium text-center">
                      {batches.reduce((sum, batch) => sum + batch.recipients, 0)}
                    </TableCell>
                    <TableCell className="flex items-center justify-center gap-4 text-center">
                      <span className="relative flex items-center p-2 rounded bg-gray-200">
                        <PhoneOutgoing size={16} />
                        <span className="absolute -top-2 px-1 right-4 font-bold bg-theme text-white text-xs rounded-full min-w-5 min-h-5 flex items-center justify-center">
                          {`${batches.reduce((sum, batch) => sum + batch.sentCount, 0)}`}</span>
                      </span>
                      <span className="relative flex items-center p-2 rounded bg-gray-200">
                        <Phone size={16} />
                        <span className="absolute -top-2 px-1 right-4 font-bold bg-theme text-white text-xs rounded-full min-w-5 min-h-5 flex items-center justify-center">
                          {`${batches.reduce((sum, batch) => sum + batch.pickedUpCount, 0)}`}
                        </span>
                      </span>
                      <span className="relative flex items-center p-2 rounded bg-gray-200">
                        <PhoneCall size={16} />
                        <span className="absolute -top-2 px-1 right-4 font-bold bg-theme text-white text-xs rounded-full min-w-5 min-h-5  flex items-center justify-center">
                          {`${batches.reduce((sum, batch) => sum + batch.successfulCount, 0)}`}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getGroupStatusDistribution(batches)}
                    </TableCell>
                    <TableCell className="text-center">
                      {/* No actions at group level */}
                    </TableCell>
                  </TableRow>

                  {expandedGroups[baseName] && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <div className="bg-white rounded-lg shadow-lg border-dashed m-3 border-2  pb-2">
                          <Table className="p-0">
                            <TableHeader className="bg-theme-100">
                              <TableRow>
                                <TableHead className="text-center flex items-center justify-center gap-2 text-charcoal">
                                  ID
                                </TableHead>
                                <TableHead className="text-center text-charcoal">
                                  <div className="w-full flex items-center justify-center gap-2 text-charcoal">
                                    <span>Batch Name</span>
                                  </div>
                                </TableHead>
                                <TableHead className="text-center flex items-center justify-center gap-2 text-charcoal">
                                  Status
                                </TableHead>
                                <TableHead className="text-center text-charcoal">
                                  Recipients
                                </TableHead>
                                <TableHead className="text-center text-charcoal">
                                  Sent | Picked Up | Successful
                                </TableHead>
                                <TableHead className="text-center text-charcoal">
                                  Last sent by
                                </TableHead>
                                <TableHead className="text-center text-charcoal">
                                  Action
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {batches.map((batch) => (
                                <TableRow key={batch.id} className="p-0 m-0">
                                  <TableCell
                                    className="font-medium text-center p-0">
                                    {batch.id}
                                  </TableCell>
                                  <TableCell
                                    className="text-center p-0">
                                    {batch.name}
                                  </TableCell>
                                  <TableCell
                                    className="text-center p-0">
                                    <Badge
                                      className={`${BATCH_STATUS[batch.status].color
                                        } capitalize`}
                                    >
                                      {BATCH_STATUS[batch.status].label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell
                                    className="text-center p-0">
                                    {batch.recipients}
                                  </TableCell>
                                  <TableCell
                                    className="text-center p-0">
                                    {`${batch.sentCount} > ${batch.pickedUpCount} > ${batch.successfulCount}`}
                                  </TableCell>
                                  <TableCell
                                    className="text-center p-0 w-[200px]">
                                    {batch.lastSentBy
                                      ? format(
                                        new Date(batch.lastSentBy),
                                        "dd MMM, yyyy hh:mm a"
                                      )
                                      : "-"}
                                  </TableCell>
                                  <TableCell className="flex justify-center gap-2 p-0 m-0">
                                    <Button
                                      onClick={() => router.push(`/lead/bulk/${batch.id}`)}
                                      className="!p-0 "
                                    >
                                      <Eye className="p-0.5" />
                                    </Button>
                                    <Button
                                      onClick={() => router.push(`/lead/bulk/${batch.id}`)}
                                      className="!p-0 "
                                    >
                                      <Pencil className="p-0.5" />
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setDeleteDialog(!deleteDialog);
                                        setDeleteId(batch.id);
                                      }}
                                      className="!p-0"
                                    >
                                      {<Trash2 className="text-red-600" />}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
        {Boolean(isFetching || leadData.length <= 0) && (
          <div className="font-medium text-center text-btn-bg-main">
            {Boolean(isFetching) ? (
              <div className="w-full flex justify-center">
                <Loading />
              </div>
            ) : (
              "No data found."
            )}
          </div>
        )}
        <ThemeProvider theme={theme}>
          <div className="flex justify-end m-5">
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