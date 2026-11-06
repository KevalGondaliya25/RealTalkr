"use client";

import React, { useEffect, useState } from "react";
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  useCreateOrganizationMutation,
  useGetOrganizationQuery,
} from "@/redux/query/organization";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import { OrganizationType } from "@/types/organization";
import {
  selectCurrentOrganizationId,
  selectCurrentUser,
  selectCurrentUserId,
  setOrganization,
} from "@/redux/slice/user";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import { USER_TYPE } from "@/utils/constant";

export function CampaignSwitcher() {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const userId = useSelector(selectCurrentUserId);
  const organizationId = useSelector(selectCurrentOrganizationId);
  const [isCreateOrgDialog, setIsCreateOrgDialog] = useState<boolean>(false);
  const [orgName, setOrgName] = useState<string>("");
  const [organizations, setOrganizations] = useState<Array<OrganizationType>>(
    []
  );

  const [createOrganization, { isLoading: organizationCreateLoading }] =
    useCreateOrganizationMutation();
  const {
    data,
    error,
    isFetching: isOrgLoading,
    refetch,
  } = useGetOrganizationQuery({
    userId:
      user && user.role === USER_TYPE.ADMIN && userId ? `${userId}` : undefined,
  });

  const [activeOrganization, setActiveOrganization] =
    useState<OrganizationType | null>(null);

  useEffect(() => {
    if (user && Object.keys(user).length > 0)
      if (user?.role === USER_TYPE.ADMIN) {
        // dispatch(setOrganization({ id: null }));

        if (data && data.data) {
          setOrganizations(data.data);
          if (data.data.length > 0)
            if (organizationId === null) {
              setActiveOrganization(data.data[0]);
              dispatch(setOrganization({ id: data.data[0].id }));
            } else {
              const org = data.data.find((org) => org.id === organizationId);
              if (org) {
                setActiveOrganization(org);
                dispatch(setOrganization({ id: org.id }));
              } else {
                setActiveOrganization(data.data[0]);
                dispatch(setOrganization({ id: data.data[0].id }));
              }
            }
          else {
            setActiveOrganization(null);
            dispatch(setOrganization({ id: null }));
          }
        }
      } else {
        if (data && data.data && data.data.length > 0) {
          setOrganizations(data.data);
          if (organizationId === null) {
            setActiveOrganization(data.data[0]);
            dispatch(setOrganization({ id: data.data[0].id }));
          } else {
            const org = data.data.find((org) => org.id === organizationId);
            if (org) {
              setActiveOrganization(org);
              dispatch(setOrganization({ id: org.id }));
            } else {
              setActiveOrganization(data.data[0]);
              dispatch(setOrganization({ id: data.data[0].id }));
            }
          }
        } else if (
          data &&
          data.data &&
          data.data.length <= 0 &&
          user &&
          user.role !== USER_TYPE.ADMIN
        ) {
          setIsCreateOrgDialog(true);
        }
      }
  }, [data, user, userId]);

  const onSubmit = async () => {
    try {
      const result = await createOrganization({
        name: orgName,
        userId: userId || undefined,
      }).unwrap();
      if (result.success) {
        toast.success(result.message);
        refetch();
      }
      setIsCreateOrgDialog(false);
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
      setIsCreateOrgDialog(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <span className="pl-2 text-charcoal text-base">Campaign</span>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-theme text-sidebar-primary-foreground">
                {isOrgLoading ? (
                  <Loading />
                ) : (
                  <GalleryVerticalEnd className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-base">
                  {activeOrganization?.name ? (
                    activeOrganization?.name
                  ) : (
                    <>
                      {isOrgLoading ? (
                        ""
                      ) : (
                        <span className="opacity-50 font-light">
                          Create campaign
                        </span>
                      )}
                    </>
                  )}
                </span>
                {/* <span className="truncate text-xs">
                                    {activeTeam.plan}
                                </span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-sm text-muted-foreground">
              Campaign
            </DropdownMenuLabel>
            {organizations.map((organization, index) => (
              <DropdownMenuItem
                key={index}
                className="gap-2 p-2"
                onClick={() => {
                  setActiveOrganization(organization);
                  dispatch(setOrganization({ id: organization.id }));
                }}
              >
                {organization.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setIsCreateOrgDialog(!isCreateOrgDialog)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Campaign
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog
          open={isCreateOrgDialog}
          onOpenChange={(open) => {
            if (organizations.length > 0) setIsCreateOrgDialog(open);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
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
                disabled={organizationCreateLoading || orgName === ""}
                onClick={onSubmit}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
