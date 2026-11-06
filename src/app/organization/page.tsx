"use client";

import _ from "lodash";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, PencilLine, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
} from "@/redux/query/organization";
import { OrganizationType } from "@/types/organization";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import { useRouter } from "next/navigation";

export default function Page() {
  const [organizationData, setOrganizationData] =
    useState<Array<OrganizationType> | null>(null);

  const [search, setSearch] = useState<string | null>(null);
  const [isUpdateOrgDialog, setIsUpdateOrgDialog] = useState<boolean>(false);
  const [orgName, setOrgName] = useState<string>("");
  const [orgId, setOrgId] = useState<number | null>(null);

  const { data, refetch } = useGetOrganizationQuery({
    search: search || undefined,
  });

  const handleSetDialogData = (orgData: OrganizationType) => {
    setIsUpdateOrgDialog(!isUpdateOrgDialog);
    setOrgName(orgData.name);
    setOrgId(orgData.id);
  };

  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();
  const [createOrganization, { isLoading: organizationCreateLoading }] =
    useCreateOrganizationMutation();

  const onSubmit = async () => {
    try {
      if (orgId) {
        const response = await updateOrganization({
          id: orgId,
          data: { name: orgName },
        }).unwrap();
        if (response.success) {
          toast.success(response.message);
          window.location.reload();
          refetch();
        }
        setIsUpdateOrgDialog(false);
        setOrgId(null);
        setOrgName("");
      } else {
        const result = await createOrganization({
          name: orgName,
        }).unwrap();
        if (result.success) {
          toast.success(result.message);
          window.location.reload();
          refetch();
        }
        setIsUpdateOrgDialog(false);
        setOrgId(null);
        setOrgName("");
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
      setIsUpdateOrgDialog(false);
      setOrgId(null);
      setOrgName("");
    }
  };

  const [deleteOrganization] = useDeleteOrganizationMutation();

  const handleOrgDelete = async (id: number) => {
    try {
      const response = await deleteOrganization({ id }).unwrap();
      if (response.success) {
        toast.success(response.message);
        refetch();
        window.location.reload();
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  };

  useEffect(() => {
    if (data && data.data) {
      setOrganizationData(data.data);
    }
  }, [data]);

  return (
    <>
      <div className="flex p-4 bg-sidebar gap-4 rounded-md overflow-x-auto md:overflow-auto">
        <Input
          type="text"
          placeholder="Search"
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button
          className="bg-theme text-white !h-4 !py-5"
          onClick={() => setIsUpdateOrgDialog(!isUpdateOrgDialog)}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-col justify-between flex-grow rounded-md bg-sidebar overflow-x-auto md:overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-start">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizationData && organizationData.length > 0 ? (
              organizationData?.map((organizations: OrganizationType) => (
                <TableRow key={organizations.id}>
                  <TableCell className="font-medium">
                    {organizations.id}
                  </TableCell>
                  <TableCell>{organizations.name}</TableCell>
                  <TableCell className="text-right flex gap-4">
                    <Pencil
                      className="p-0.5"
                      onClick={() => handleSetDialogData(organizations)}
                    />
                    <Trash2 onClick={() => handleOrgDelete(organizations.id)} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow key={"No data found"}>
                <TableCell
                  colSpan={7}
                  className="font-medium text-center text-btn-bg-main"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Dialog
          open={isUpdateOrgDialog}
          onOpenChange={(open) => setIsUpdateOrgDialog(open)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Campaign</DialogTitle>
              <DialogClose
                onClick={() => setIsUpdateOrgDialog(!isUpdateOrgDialog)}
              />
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-center">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter Campaign name"
                  value={orgName}
                  className="col-span-3"
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-theme !h-7 text-white"
                disabled={isLoading || orgName === ""}
                onClick={onSubmit}
              >
                {orgId ? "Edit" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
