/**
 * @file page.tsx
 * @title Edit Batch Call Page Component
 * @description
 *   This file implements the "Edit Batch Call" feature for the RealTalkr platform.
 *   It enables users to view, edit, validate, and update a batch of contacts for automated calling.
 *   Core features include:
 *     - Fetching and displaying batch call details for editing
 *     - Uploading and parsing recipient spreadsheets
 *     - Validating phone numbers and emails, with duplicate detection
 *     - Batch processing with progress feedback
 *     - Editing, deleting, and downloading recipient data
 *     - Scheduling or sending batch calls using selected AI agents and phone numbers
 *     - User-friendly dialogs for error correction and confirmation
 *   The component provides a robust UI for managing bulk lead data and ensures data integrity before updating the batch.
 *
 * @author Ngeyen Victory, Keval Gondaliya
 * @copyright © 2025 RealTalkr. All rights reserved.
 * @license Proprietary
 * @keywords batch call, spreadsheet, validation, bulk lead, React, Next.js, copyright
 * @contact info@realtalkr.ai
 *
 * @created 2024-03-10
 * @lastmodified 2025-05-31
 *
 * @see See AUTHORS file for contributors.
 *
 * Note:
 *   This file is part of the RealTalkr application. Retain this header for attribution and legal compliance.
 */

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  CircleX,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SpreadsheetRowErrorType, SpreadsheetRowType, FileInfo, SpreadsheetRowSuccessType, LeadBulkBodyType } from "@/types/lead";
import parsePhoneNumberFromString from "libphonenumber-js";
import _ from "lodash";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetVapiPhoneNumbersQuery } from "@/redux/query/call";
import { selectCurrentOrganizationId } from "@/redux/slice/user";
import { useSelector } from "react-redux";
import { VapiPhoneNumber } from "@/types/call";
import { BATCH_STATUS_TYPE } from "@/utils/constant";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Loading from "@/components/component/Loading";
import {
  useDeleteLeadMutation,
  useGetOneBulkLeadsQuery,
  useLazyValidateBulkLeadQuery,
  useUpdateBulkLeadMutation,
} from "@/redux/query/lead";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { AssistantSelectType } from "@/types/assistant";
import { useLazyGetAllAssistantWithOutPaginationQuery } from "@/redux/query/assistant";
import CustomSpreadsheetReader from "@/components/component/SpreadsheetReader/CustomSpreadsheetReader";
import { SpreadsheetReaderRef } from "@/components/component/SpreadsheetReader/Interface";

// ===================
// Form and Data Handling Functions
// ===================

/**
 * Manages the form state and submission for the batch call configuration.
 *
 * @returns {Object} Form instance with methods and state
 */
const formSchema = z.object({
  executionTime: z.string().optional(),
  phoneNumber: z
    .string({
      required_error: "Please select a phone number.",
      message: "Please select a phone number.",
    })
    .min(1, { message: "Please select a phone number." }),
  timezone: z.string().optional(),
  assistantId: z
    .string({
      required_error: "Please select a assistant.",
      message: "Please select a assistant.",
    })
    .min(1, { message: "Please select a assistant." }),
  name: z.string().min(2, { message: "Name must be minimum 2 character" }),
});

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const spreadsheetReaderRef = useRef<SpreadsheetReaderRef>(null);

  // ===================
  // State Management
  // ===================

  /**
   * Manages the currently active tab ("current" or "new").
   * @type {"current" | "new"}
   */
  const [currentTab, setCurrentTab] = useState<"current" | "new">("current");

  /**
   * Stores successfully processed leads from the CSV.
   * @type {Array<SpreadsheetRowSuccessType>}
   */
  const [processedSuccessData, setProcessedSuccessData] = useState<Array<SpreadsheetRowSuccessType>>([]);
  /**
   * Stores leads with errors from the CSV processing.
   * @type {Array<SpreadsheetRowErrorType>}
   */
  const [processedErrorData, setProcessedErrorData] = useState<Array<SpreadsheetRowErrorType>>([]);
  /**
   * Stores metadata about the uploaded file.
   * @type {FileInfo | null}
   */
  const [processedFileInfo, setProcessedFileInfo] = useState<FileInfo | null>(null);
  /**
   * Stores existing lead data from the batch.
   * @type {Array<SpreadsheetRowSuccessType>}
   */
  const [leadData, setLeadData] = useState<Array<SpreadsheetRowSuccessType>>([]);

  // Pagination states
  /**
   * Current page number for pagination.
   * @type {number}
   */
  const [currentPage, setCurrentPage] = useState(1);
  /**
   * Number of items to display per page.
   * @type {number}
   */
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalItems = processedSuccessData.length + processedErrorData.length;
  const [totalPages, setTotalPages] = useState(Math.ceil(totalItems / itemsPerPage));

  const [modifiedLeadData, setModifiedLeadData] = useState<Map<number, SpreadsheetRowSuccessType>>(new Map());

  // Batch processing states
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [totalContactsToProcess, setTotalContactsToProcess] = useState(0);

  const {
    data: batchData,
    isFetching: getBatchFetching,
    refetch: getOneLeadRefetch,
  } = useGetOneBulkLeadsQuery({
    id: params.id,
  });
  const [preservedDate, setPreservedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (params.id) {
      getOneLeadRefetch();
    }
  }, [params.id, getOneLeadRefetch]);

  const [isUpdateDialog, setIsUpdateDialog] = useState<boolean>(false);
  const [editProcessedErrorData, setEditProcessedErrorData] = useState<SpreadsheetRowErrorType>({
    id: 0,
    email: "",
    name: "",
    contact: "",
    message: "",
    countryCode: "",
    notes: "",
  });
  const [loader, setLoader] = useState<boolean>(false);
  const [assistant, setAssistant] = useState<Array<AssistantSelectType>>([]);
  const organizationId = useSelector(selectCurrentOrganizationId);
  const [getAssistants, { isLoading: getAssistantLoading }] =
    useLazyGetAllAssistantWithOutPaginationQuery();

  const [radioValue, setRadioValue] = useState<string>("schedule");
  const [leadDataDialog, setLeadDataDialog] = useState<boolean>(false);
  const [successDialog, setSuccessDialog] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>();
  const [deleteId, setDeleteId] = useState<number>(0);
  const [errorDialog, setErrorDialog] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEditProcessedErrorData({ ...editProcessedErrorData, email: emailValue });

    if (emailValue && !isValidEmail(emailValue)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };

  useEffect(() => {
    const fetchAllAssistant = async () => {
      const res = await getAssistants({ organizationId: organizationId });
      if (res && res.data) setAssistant(res.data.data);
    };

    fetchAllAssistant();
  }, [getAssistants, organizationId]);

  const [validateBulkLead] = useLazyValidateBulkLeadQuery();

  // ===================
  // CSV Processing and Validation
  // ===================

  /**
   * Handles the processing of a loaded CSV file, validating leads and setting state.
   *
   * @param {Array<SpreadsheetRowType>} csvData - The parsed CSV data
   * @param {Array<SpreadsheetRowErrorType>} processedErrorData - Initial error data
   * @param {FileInfo} fileInfo - Metadata about the file
   * @param {File | null} file - The uploaded file object
   */
  const handleFileLoaded = async (
    csvData: Array<SpreadsheetRowType>,
    processedErrorData: Array<SpreadsheetRowErrorType>,
    fileInfo: FileInfo,
    file: File | null
  ) => {
    setLoader(true);
    setProcessedFileInfo(fileInfo);

    if (csvData.length > 0) {
      const firstRow = csvData[0];
      const requiredHeaders = ["email", "name", "contact"];

      const missingHeaders = requiredHeaders.filter(
        (header) => !Object.keys(firstRow).includes(header)
      );

      if (missingHeaders.length > 0) {
        toast.error(`Missing required columns: ${missingHeaders.join(", ")}`);
        setLoader(false);
        setProcessedFileInfo(null);
        setProcessedSuccessData([]);
        setProcessedErrorData([]);
        return;
      }
    }

    const emptyData: Array<SpreadsheetRowType> = csvData.filter(
      (data) =>
        data.contact === "" &&
        data.email === "" &&
        data.name === "" &&
        data.notes === ""
    );

    if (emptyData.length >= csvData.length) {
      toast.error(`Your csv file is empty.`);
      setLoader(false);
      setProcessedFileInfo(null);
      setProcessedSuccessData([]);
      setProcessedErrorData([]);
      return;
    }

    const fileMap = new Map();
    const res = await validateBulkLead({
      contacts: csvData.map((csv) => csv.contact.replaceAll(" ", "")),
      organizationId: organizationId || undefined,
    }).unwrap();

    console.log("Validation Response:", res);

    let alreadyUsedNumber: Array<string> = [];
    if (res && res.data) {
      alreadyUsedNumber = [...res.data];
      console.log("Already Used Numbers:", alreadyUsedNumber);
    }

    let success: Array<SpreadsheetRowSuccessType> = csvData.map((data, index) => ({
      ...data,
      id: index + 1,
      countryCode: "",
      contact: data.contact.replaceAll(" ", ""),
    }));
    const errors: Array<SpreadsheetRowErrorType> = processedErrorData;

    if (batchData?.data) {
      batchData.data.leads.forEach((lead) => {
        if (lead.contact) {
          fileMap.set(lead.contact, lead.id);
        }
      });
    }

    success = success.filter((data) => {
      const phone = parsePhoneNumberFromString(data.contact);
      if (!phone || !phone.isPossible()) {
        errors.push({
          ...data,
          id: data.id,
          message: "Phone number is incorrect. Please validate.",
        });
        return false;
      }

      if (alreadyUsedNumber.includes(data.contact)) {
        errors.push({
          ...data,
          id: data.id,
          message: "Phone number already in use in another batch.",
        });
        return false;
      }

      const existingLead = batchData?.data.leads.find((l) => l.contact === data.contact);
      if (existingLead) {
        const updatedLead = { ...existingLead, ...data, id: existingLead.id, countryCode: phone.country || "" };
        setLeadData((prev) => {
          const updated = prev.map((l) => (l.id === existingLead.id ? updatedLead : l));
          return updated;
        });
        return false;
      }

      fileMap.set(data.contact, data.id);
      data.countryCode = phone.country || "";
      return true;
    });

    console.log("Success Data:", success);
    console.log("Error Data:", errors);

    setProcessedSuccessData(_.uniqBy(success, "id"));
    setProcessedErrorData(_.uniqBy([...errors], "id"));
    setTotalContactsToProcess(success.length + errors.length);
    setProcessedCount(success.length + errors.length);
    setIsValidated(true);
    setLoader(false);
  };

  const handleSuccessDelete = (index: number | null) => {
    if (index === null) return;
    const filterData = processedSuccessData.filter((val) => val.id !== index);
    setProcessedSuccessData(filterData);
    setSuccessDialog(!successDialog);
    setDeleteId(0);
    setTotalContactsToProcess(filterData.length + processedErrorData.length);
    setProcessedCount(filterData.length + processedErrorData.length);
  };

  const handleErrorDelete = (index: number | null) => {
    const filterData = processedErrorData.filter((val) => val.id !== index);
    setProcessedErrorData(filterData);
    setErrorDialog(!errorDialog);
    setDeleteId(0);
    setTotalContactsToProcess(processedSuccessData.length + filterData.length);
    setProcessedCount(processedSuccessData.length + filterData.length);
  };


  const [isEditErrorLoading, setIsEditErrorLoading] = useState<boolean>(false);

  const handleSuccessEdit = (data: SpreadsheetRowSuccessType) => {
    setIsUpdateDialog(!isUpdateDialog);
    setEditProcessedErrorData({
      ...data,
      message: undefined,
    });
    setDialogTitle("Success");

    if (data.email && !isValidEmail(data.email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };

  // In onSubmitEditError, update modifiedLeadData when a lead is edited
  const onSubmitEditError = async () => {
    setIsEditErrorLoading(true);
    if (!editProcessedErrorData.contact) {
      toast.error("Phone number is incorrect. Please validate.");
      setIsEditErrorLoading(false);
      return;
    }

    const phone = parsePhoneNumberFromString(editProcessedErrorData.contact);
    if (!phone?.isPossible()) {
      toast.error("Phone number is incorrect. Please validate.");
      setIsEditErrorLoading(false);
      return;
    }

    const res = await validateBulkLead({
      contacts: [editProcessedErrorData.contact.replaceAll(" ", "")],
      organizationId: organizationId || undefined,
    }).unwrap();

    if (res && res.data.length > 0 && !leadData.some((l) => l.contact === editProcessedErrorData.contact)) {
      toast.error("Phone number already in use.");
      setIsEditErrorLoading(false);
      return;
    }

    if (dialogTitle === "Success") {
      const isExistingLead = leadData.some((l) => l.id === editProcessedErrorData.id);
      if (isExistingLead) {
        const updatedLead = {
          ...editProcessedErrorData,
          countryCode: phone.country || "",
          id: editProcessedErrorData.id,
        };
        setLeadData((prev) =>
          prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
        );
        setModifiedLeadData((prev) => {
          const newMap = new Map(prev);
          newMap.set(updatedLead.id, updatedLead);
          return newMap;
        });
        setIsUpdateDialog(false);

      } else {
        const processedSuccessDataNumbers = processedSuccessData.map((data) => data.contact);
        if (!processedSuccessDataNumbers.includes(editProcessedErrorData.contact)) {
          const updatedData = processedSuccessData.map((data) =>
            data.id === editProcessedErrorData.id
              ? { ...data, ...editProcessedErrorData, countryCode: phone.country || "" }
              : data
          );
          setProcessedSuccessData(updatedData);
          setIsUpdateDialog(false);

        } else {
          toast.error(`${editProcessedErrorData.contact} already in use.`);
        }
      }
    } else {
      const processedSuccessDataNumbers = processedSuccessData.map((data) => data.contact);
      if (!processedSuccessDataNumbers.includes(editProcessedErrorData.contact)) {
        const filterData = processedErrorData.filter((val) => val.id !== editProcessedErrorData.id);
        setProcessedErrorData(filterData);
        const updatedSuccessData = [
          ...processedSuccessData,
          {
            id: editProcessedErrorData.id,
            email: editProcessedErrorData.email,
            name: editProcessedErrorData.name,
            contact: editProcessedErrorData.contact,
            countryCode: phone.country || "",
            notes: editProcessedErrorData.notes || "",
          },
        ];
        setProcessedSuccessData(updatedSuccessData);
        setIsUpdateDialog(false);
        setTotalContactsToProcess(updatedSuccessData.length + filterData.length);
        setProcessedCount(updatedSuccessData.length + filterData.length);

      } else {
        toast.error(`${editProcessedErrorData.contact} already in use.`);
        setIsEditErrorLoading(false);
      }
    }
    setIsEditErrorLoading(false);
  };

  const handleDownloadCSV = () => {
    const allData = [
      ...processedSuccessData.map((item) => ({
        ...item,
        status: "Success",
        message: "",
      })),
      ...processedErrorData.map((item) => ({
        ...item,
        status: "Error",
      })),
    ];

    if (allData.length === 0) {
      toast.error("No data to download.");
      return;
    }

    const headers = ["status", "id", "name", "email", "contact", "countryCode", "notes", "message"];
    const csvRows = [
      headers.join(","),
      ...allData.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof typeof row] || "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cleaned_leads_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setProcessedSuccessData([]);
    setProcessedErrorData([]);
    setProcessedFileInfo(null);
    setCurrentPage(1);
    setItemsPerPage(10);
    setProgress(0);
    setProcessedCount(0);
    setIsBatchProcessing(false);
    setIsValidated(false);
    setDuplicateCount(0);
    setTotalContactsToProcess(0);
    if (spreadsheetReaderRef.current) {
      spreadsheetReaderRef.current.reset();
    }
  };

  const handleChildReset = () => {
    setProcessedSuccessData([]);
    setProcessedErrorData([]);
    setProcessedFileInfo(null);
    setCurrentPage(1);
    setItemsPerPage(10);
    setProgress(0);
    setProcessedCount(0);
    setIsBatchProcessing(false);
    setIsValidated(false);
    setDuplicateCount(0);
    setTotalContactsToProcess(0);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      executionTime: "",
      timezone: "",
      phoneNumber: "",
      assistantId: "",
      name: "",
    },
  });

  useEffect(() => {
    if (batchData?.data) {
      const { data } = batchData;
      form.setValue("name", data.name || "");
      if (data.timezone && data.executionTime) {
        const timeOffset = parseTimezone(data.timezone).offset || 0;
        form.setValue("timezone", data.timezone);
        setOffSet(timeOffset);
        const executionDate = moment
          .utc(data.executionTime)
          .add(timeOffset * 60, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss[Z]");
        form.setValue("executionTime", executionDate);
        const utcString = executionDate ? executionDate : undefined;
        const [datePart, timePart] = utcString
          ? utcString.split("T")
          : [undefined, undefined];
        const timeWithoutZ = timePart ? timePart.replace("Z", "") : undefined;
        const preservedDate =
          datePart && timeWithoutZ
            ? new Date(`${datePart}T${timeWithoutZ}`)
            : undefined;
        setPreservedDate(preservedDate);
      }
      form.setValue("phoneNumber", data.phoneNumber || "");
      form.setValue("assistantId", `${data.assistantId}` || "");
      setRadioValue(data.isSchedular ? "schedule" : "send");
      setStatus(data.status);
      setLeadData(
        data.leads
          .filter((lead) => lead.contact)
          .map((lead) => ({
            id: lead.id,
            email: lead.email || "",
            name: lead.name || "",
            contact: lead.contact!,
            notes: lead.notes || "",
            countryCode: lead.countryCode || "",
          }))
      );
      setProcessedSuccessData(
        data.leads
          .filter((lead) => lead.contact)
          .map((lead) => ({
            id: lead.id,
            email: lead.email || "",
            name: lead.name || "",
            contact: lead.contact!,
            notes: lead.notes || "",
            countryCode: lead.countryCode || "",
          }))
      );
      setTotalPages(Math.ceil(data.leads.length / itemsPerPage));
    }
  }, [batchData, getBatchFetching]);

  const labelStyle = "original";
  const timezones = {
    ...allTimezones,
  };

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const [offSet, setOffSet] = useState<number>(0);

  const { data: phoneNumbersData, isLoading: phoneNumberLoading } =
    useGetVapiPhoneNumbersQuery();

  const [phoneNumbers, setPhoneNumbers] = useState<Array<VapiPhoneNumber>>([]);

  useEffect(() => {
    if (phoneNumbersData && phoneNumbersData.data.length > 0) {
      setPhoneNumbers(phoneNumbersData.data);
    }
  }, [phoneNumbersData]);

  const [createUpdateLead, { isLoading }] = useUpdateBulkLeadMutation();
  const [draftLoading, setDraftLoading] = useState<boolean>(false);
  const [executeLoading, setExecuteLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  // ===================
  // Form Submission and Updates
  // ===================

  /**
   * Handles the submission of the batch form, either as draft or execution.
   *
   * @param {boolean | undefined} isDraft - Indicates if the submission is a draft
   */
  async function onSubmit(isDraft?: boolean) {
    const data: {
      phoneNumber: string;
      assistantId: string;
      name: string;
      executionTime?: string | undefined;
      timezone?: string | undefined;
    } = form.getValues();
    const phoneNumberId = phoneNumbers.find(
      (phone) => phone.number === data.phoneNumber
    )?.id;

    if (isDraft !== undefined) {
      if (isDraft) setDraftLoading(true);
      else setExecuteLoading(true);
    } else {
      setUpdateLoading(true);
    }

    if (!phoneNumberId) {
      toast.error("Phone number not found.");
      setDraftLoading(false);
      setExecuteLoading(false);
      setUpdateLoading(false);
      return;
    }

    if (processedErrorData.length > 0) {
      toast.error("The CSV data has errors. Please review and correct them.");
      setDraftLoading(false);
      setExecuteLoading(false);
      setUpdateLoading(false);
      return;
    }

    const body: LeadBulkBodyType = {
      leads: processedSuccessData,
      phoneNumberId: phoneNumberId,
      timezone:
        radioValue === "schedule" && data.timezone && data.timezone !== ""
          ? data.timezone
          : undefined,
      organizationId: organizationId,
      executionTime:
        radioValue === "schedule" &&
          data.executionTime &&
          data.executionTime !== ""
          ? moment
            .utc(data.executionTime)
            .subtract(offSet * 60, "minutes")
            .format("YYYY-MM-DDTHH:mm:ss[Z]")
          : undefined,
      assistantId: Number(data.assistantId),
      name: data.name,
      isDraft: isDraft !== undefined ? isDraft : undefined,
      isSchedular: radioValue === "schedule",
    };

    try {
      const result = await createUpdateLead({
        id: Number(params.id),
        data: body,
      }).unwrap();
      if (result.success) {
        toast.success(result.message);
        router.push("/lead/bulk");
      }
      setDraftLoading(false);
      setExecuteLoading(false);
      setUpdateLoading(false);
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
      setDraftLoading(false);
      setExecuteLoading(false);
      setUpdateLoading(false);
    }
  }
  const [deleteLead, { isLoading: leadDeleteLoading }] = useDeleteLeadMutation();

  const handleLeadDelete = async (id: number) => {
    try {
      const response = await deleteLead({ id }).unwrap();
      if (response.success) {
        toast.success(response.message);
        setLeadData((prev) => prev.filter((data) => data.id !== id));
        setLeadDataDialog(!leadDataDialog);
        setDeleteId(0);
      }
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  };

  // ===================
  // Pagination and UI Rendering
  // ===================

  /**
   * Combines success and error data for pagination.
   * @returns {Array<{ type: "success" | "error", ...SpreadsheetRowSuccessType }>}
   */
  const combinedData = [
    ...processedSuccessData.map((item) => ({ ...item, type: "success" as const })),
    ...processedErrorData.map((item) => ({ ...item, type: "error" as const })),
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = combinedData.slice(startIndex, endIndex);

  /**
   * Handles page change for pagination.
   *
   * @param {number} page - The target page number
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {getBatchFetching ? (
        <div className="h-full flex justify-center items-center text-theme">
          <Loading />
        </div>
      ) : (
        <>
          <div className="grid xl:grid-cols-2 lg:grid-cols-1 items-start xl:justify-center md:justify-normal gap-[20px] bulk-lead-screen">
            <div className="bulk-lead-screen">
              <div className="flex justify-between items-center">
                <h1 className="flex my-2 py-3 justify-start text-theme text-xl font-semibold">
                  Batch Call
                </h1>
                <Button
                  className="rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] shadow-md text-theme"
                  onClick={() => router.push("/lead/bulk")}
                >
                  Back
                </Button>
              </div>
              <Form {...form}>
                <form className="">
                  <div className="grid xl:grid-cols-1 items-center lg:grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: "Phone number is required" }}
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Batch Call Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter batch name"
                              {...field}
                              className="w-full !p-0 !pl-2 outline-0 rounded-md border border-border focus:border-theme"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      rules={{ required: "Phone number is required" }}
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>From number</FormLabel>
                          <Select
                            value={field.value}
                            defaultValue={field.value}
                            onValueChange={(value) => {
                              if (value !== "") field.onChange(value);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger
                                className="mt-2 "
                                disabled={phoneNumberLoading}
                              >
                                <SelectValue placeholder="Select caller number" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {phoneNumbers.map((phone) => (
                                <SelectItem key={phone.id} value={phone.number}>
                                  {phone.number}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assistantId"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Ai Agent</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              defaultValue={field.value}
                              onValueChange={(value) => {
                                if (value !== "") field.onChange(value);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className="mt-2 "
                                  disabled={getAssistantLoading}
                                >
                                  <SelectValue placeholder="Select Agent" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="z-[70]">
                                {assistant.map((assistant) => (
                                  <SelectItem
                                    key={assistant.id}
                                    value={assistant.id.toString()}
                                  >
                                    {assistant.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="relative">
                    <h1 className="my-4 text-theme text-md font-semibold items-center gap-4">
                      <span className="text-charcoal">Upload Recipients (Spreadsheet)</span>
                    </h1>

                    {processedSuccessData.length > 0 || processedErrorData.length > 0 ? (
                      <div className="border-2 border-dashed rounded-md p-4 bg-gray-100 relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">{processedFileInfo?.name}</span>
                          <div className="flex gap-2">
                            <span className="text-gray-700">
                              Cleaned Contacts: {processedSuccessData.length}
                            </span>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={handleDownloadCSV}
                            >
                              <ArrowDownToLine className="mr-2 h-4 w-4" /> Download CSV
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={clearAll}
                            >
                              Clear All
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <CustomSpreadsheetReader
                        ref={spreadsheetReaderRef}
                        handleFileLoaded={handleFileLoaded}
                        organizationId={organizationId?.toString()}
                        onReset={handleChildReset}
                      />
                    )}
                  </div>

                  <div className="pt-5">
                    <p className="mb-2 text-base">When to send the calls</p>
                    <RadioGroup
                      value={radioValue}
                      onValueChange={setRadioValue}
                      className="flex items-center justify-between w-full mb-2"
                    >
                      <Label
                        htmlFor="r1"
                        className="flex items-center justify-between space-x-2 border p-3 rounded-md w-full cursor-pointer"
                      >
                        Send Now
                        <RadioGroupItem
                          value="send"
                          id="r1"
                          className="checked:bg-orange-500 checked:border-orange-500"
                        />
                      </Label>
                      <Label
                        htmlFor="r2"
                        className="flex items-center justify-between space-x-2 border p-3 rounded-md w-full cursor-pointer"
                      >
                        Schedule
                        <RadioGroupItem
                          value="schedule"
                          id="r2"
                          className="checked:bg-orange-500 checked:border-orange-500"
                        />
                      </Label>
                    </RadioGroup>
                    {radioValue === "schedule" && (
                      <div className="flex items-center justify-between gap-2">
                        <FormField
                          control={form.control}
                          name="executionTime"
                          render={({ field }) => {
                            return (
                              <FormItem className="w-full">
                                <Popover>
                                  <div className="relative w-full flex justify-center">
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "!p-0 !pl-2 text-secondary bg-white w-full !gap-3 !h-[40px] justify-start !text-center font-light text-sm rounded-md",
                                            !field.value &&
                                            "text-muted-foreground",
                                            "hover:bg-white hover:text-charcoal"
                                          )}
                                        >
                                          {field.value ? (
                                            moment
                                              .utc(field.value)
                                              .format("DD-MM-yyyy HH:mm")
                                          ) : (
                                            <span className="text-gray-500 normal-case">Pick a date</span>
                                          )}
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    {Boolean(field.value) && (
                                      <div className="absolute right-0 top-0 z-10">
                                        <CircleX
                                          className="h-4 w-4 mb-3 mx-3 mt-3"
                                          onClick={() => {
                                            form.setValue("executionTime", "");
                                            setPreservedDate(undefined);
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={
                                        preservedDate
                                          ? preservedDate
                                          : undefined
                                      }
                                      onSelect={(date) => {
                                        if (date) {
                                          const preservedTime =
                                            preservedDate || date;
                                          const newTime = new Date(
                                            preservedTime
                                          );

                                          newTime.setFullYear(
                                            date.getFullYear(),
                                            date.getMonth(),
                                            date.getDate()
                                          );
                                          field.onChange(
                                            moment(newTime).format(
                                              "YYYY-MM-DDTHH:mm:ss[Z]"
                                            )
                                          );
                                          setPreservedDate(newTime);
                                        } else {
                                          form.setValue("executionTime", "");
                                          setPreservedDate(undefined);
                                        }
                                      }}
                                      initialFocus
                                    />
                                    <div className="flex items-center gap-4 pl-4 mx-2 mb-2">
                                      <div>Time : </div>
                                      <TimePicker
                                        value={
                                          field.value
                                            ? dayjs(
                                              moment
                                                .utc(field.value)
                                                .format("HH:mm"),
                                              "HH:mm"
                                            )
                                            : null
                                        }
                                        format="HH:mm"
                                        onChange={(time, timeString) => {
                                          if (time) {
                                            const date =
                                              preservedDate || new Date();
                                            date.setHours(
                                              time.hour(),
                                              time.minute(),
                                              time.second()
                                            );
                                            field.onChange(
                                              moment(date).format(
                                                "YYYY-MM-DDTHH:mm:ss[Z]"
                                              )
                                            );
                                            setPreservedDate(date);
                                          } else {
                                            const date =
                                              preservedDate || new Date();
                                            date.setHours(0, 0, 0, 0);
                                            field.onChange(
                                              moment(date).format(
                                                "YYYY-MM-DDTHH:mm:ss[Z]"
                                              )
                                            );
                                            setPreservedDate(date);
                                          }
                                        }}
                                      />
                                    </div>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <FormField
                          control={form.control}
                          name="timezone"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setOffSet(parseTimezone(value).offset || 0);
                                }}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger
                                    className="rounded-md"
                                    disabled={phoneNumberLoading}
                                  >
                                    <SelectValue placeholder="Select time zone" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {options.map((option, index) => (
                                    <SelectItem
                                      key={index}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-3 mt-[15px]">
                      <Button
                        className="rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] shadow-md text-theme"
                        onClick={() => onSubmit(true)}
                        disabled={
                          draftLoading || isLoading
                        }
                      >
                        {draftLoading ? <Loading /> : "Save as Draft"}
                      </Button>

                      <Button
                        className="border-2 border-theme bg-theme rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] text-white"
                        onClick={() => onSubmit(false)}
                        disabled={isLoading}
                      >
                        {executeLoading ? <Loading /> : "Update"}
                      </Button>

                    </div>
                  </div>
                </form>
              </Form>
            </div>

            <div className="bg-sidebar h-full p-6 bulk-lead-screen">
              <div className="flex justify-between items-center mb-4">
                <p className="">Recipients</p>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((item) => (
                      <SelectItem key={item} value={item.toString()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex border-b mb-2">
                <button
                  className={`px-4 py-2 ${currentTab === "current" ? "border-b-2 border-theme" : ""}`}
                  onClick={() => setCurrentTab("current")}
                >
                  Current Recipients
                </button>
                <button
                  className={`px-4 py-2 ${currentTab === "new" ? "border-b-2 border-theme" : ""}`}
                  onClick={() => setCurrentTab("new")}
                >
                  New Recipients
                </button>
              </div>
              {currentTab === "current" ? (
                <Table className="h-full pt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Name</TableHead>
                      <TableHead className="text-center max-w-[200px]">
                        Email
                      </TableHead>
                      <TableHead className="text-center">Contact</TableHead>
                      <TableHead className="text-center max-w-[200px]">
                        Notes
                      </TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadData.length <= 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-theme"
                        >
                          No Data Found
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {leadData
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((data) => (
                            <TableRow key={data.id} className="cursor-pointer">
                              <TableCell className="text-center">
                                {data.name}
                              </TableCell>
                              <TableCell className="text-center max-w-[200px]">
                                {data.email}
                              </TableCell>
                              <TableCell className="text-center">
                                {data.contact}
                              </TableCell>
                              <TableCell className="text-center max-w-[200px]">
                                {data.notes}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex gap-2 justify-center">
                                  <Pencil
                                    className="text-emerald-400 p-0.5"
                                    onClick={() => handleSuccessEdit(data)}
                                  />
                                  <Trash2
                                    className="text-red-600"
                                    onClick={() => {
                                      setLeadDataDialog(!leadDataDialog);
                                      setDeleteId(data.id);
                                    }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Table className="h-full pt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Name</TableHead>
                      <TableHead className="text-center max-w-[200px]">
                        Email
                      </TableHead>
                      <TableHead className="text-center">Contact</TableHead>
                      <TableHead className="text-center max-w-[200px]">
                        Notes
                      </TableHead>
                      <TableHead className="text-center">Error</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-theme"
                        >
                          No Data Found
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {paginatedData.map((data) => (
                          <TableRow
                            key={`${data.type}-${data.id}`}
                            className={`cursor-pointer ${data.type === "error" ? "text-red-600" : ""}`}
                            title={data.type === "error" ? data.message : undefined}
                          >
                            <TableCell className="text-center">
                              {data.name}
                            </TableCell>
                            <TableCell className="text-center max-w-[200px]">
                              {data.email}
                            </TableCell>
                            <TableCell className="text-center">
                              {data.contact}
                            </TableCell>
                            <TableCell className="text-center max-w-[200px]">
                              {data.notes}
                            </TableCell>
                            <TableCell className="text-center max-w-[200px]">
                              {data.message || ""}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex gap-2 justify-center">
                                <Trash2
                                  className="text-red-600"
                                  onClick={() => {
                                    if (data.type === "success") {
                                      setSuccessDialog(!successDialog);
                                      setDeleteId(data.id);
                                    } else {
                                      setErrorDialog(!errorDialog);
                                      setDeleteId(data.id);
                                    }
                                  }}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              )}
              {(leadData.length > itemsPerPage || totalItems > itemsPerPage) && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-md p-2"
                  >
                    Previous
                  </Button>
                  <span className="text-charcoal">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-md p-2"
                  >
                    Next
                  </Button>
                </div>

              )}
            </div>
          </div>
        </>
      )}

      <Dialog
        open={leadDataDialog}
        onOpenChange={(open) => setLeadDataDialog(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-start">
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogClose
              onClick={() => {
                setLeadDataDialog(!leadDataDialog);
                setDeleteId(0);
              }}
            />
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2">
            <Button
              type="submit"
              className="border-2 border-theme !h-7 text-theme hover:bg-theme-300 w-full"
              onClick={() => {
                setLeadDataDialog(!leadDataDialog);
                setDeleteId(0);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-theme !h-7 text-white w-full"
              onClick={() => handleLeadDelete(deleteId)}
              disabled={leadDeleteLoading}
            >
              {leadDeleteLoading ? <Loading /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={successDialog}
        onOpenChange={(open) => setSuccessDialog(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-start">
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogClose
              onClick={() => {
                setSuccessDialog(!successDialog);
                setDeleteId(0);
              }}
            />
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2">
            <Button
              type="submit"
              className="border-2 border-theme !h-7 text-theme hover:bg-theme-300 w-full"
              onClick={() => {
                setSuccessDialog(!successDialog);
                setDeleteId(0);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-theme !h-7 text-white w-full"
              onClick={() => handleSuccessDelete(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={errorDialog} onOpenChange={(open) => setErrorDialog(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-start">
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogClose
              onClick={() => {
                setErrorDialog(!errorDialog);
                setDeleteId(0);
              }}
            />
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="border-2 border-theme !h-7 text-theme hover:bg-theme-300 w-full"
              onClick={() => {
                setErrorDialog(!errorDialog);
                setDeleteId(0);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-theme !h-7 text-white w-full"
              onClick={() => handleErrorDelete(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isUpdateDialog}
        onOpenChange={(open) => setIsUpdateDialog(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Recipient Data</DialogTitle>
            <DialogClose
              onClick={() => {
                setIsUpdateDialog(!isUpdateDialog);
                setEmailError(null);
              }}
            />
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-center">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Name"
                value={editProcessedErrorData.name}
                className="col-span-3"
                onChange={(e) =>
                  setEditProcessedErrorData({ ...editProcessedErrorData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-center">
                Email
              </Label>
              <Input
                id="email"
                placeholder="Email"
                value={editProcessedErrorData.email}
                className="col-span-3"
                onChange={(e) => handleEmailChange(e)}
              />
              {emailError && (
                <p className="col-span-4 text-red-500 text-sm text-center pl-14">
                  {emailError}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-center">
                Contact
              </Label>
              <Input
                id="contact"
                placeholder="Contact number"
                value={editProcessedErrorData.contact}
                className="col-span-3"
                onChange={(e) =>
                  setEditProcessedErrorData({
                    ...editProcessedErrorData,
                    contact: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-theme !h-7 text-white sm:max-w-36 w-full"
              disabled={Boolean(
                !editProcessedErrorData.name ||
                Boolean(emailError) ||
                !editProcessedErrorData.contact
              )}
              onClick={onSubmitEditError}
            >
              {isEditErrorLoading ? <Loading /> : "Add to Batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}