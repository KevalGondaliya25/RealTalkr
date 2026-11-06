/**
 * @file page.tsx
 * @title Batch Call Page Component
 * @description
 *   This file implements the Batch Call feature for a React (Next.js) application.
 *   It allows users to upload, validate, and process contact spreadsheets for bulk calls.
 *   Features include: spreadsheet import, contact validation (including phone and email),
 *   batch duplicate checking, error correction, scheduling, and batch sending using
 *   selected AI agents and caller numbers. The UI supports editing, deleting, and
 *   downloading processed contacts, and provides real-time feedback on validation and
 *   processing status.
 *
 * @author Ngeyen Victory, Keval Gondaliya
 * @copyright © 2025 RealTalkr. All rights reserved.
 * @license Proprietary
 * @keywords batch call, spreadsheet, validation, bulk lead, React, Next.js, copyright
 * @contact [info@realtalkr.ai]
 *
 * @see See AUTHORS file for contributors.
 *
 * Note:
 *   This file is part of the RealTalkr application. Retain this header for attribution and legal compliance.
 */

"use client";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useRef, useState } from "react";
import { ArrowDownToLineIcon, CircleX, FileSpreadsheetIcon, Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Loading from "@/components/component/Loading";
import {
  useCreateBulkLeadMutation, useLazyValidateBulkLeadQuery
} from "@/redux/query/lead";
import { Input } from "@/components/ui/input";
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { AssistantSelectType } from "@/types/assistant";
import { useLazyGetAllAssistantWithOutPaginationQuery } from "@/redux/query/assistant";
import { TIMEZONE_OFFSET } from "@/utils/constant";
import CustomSpreadsheetReader from "@/components/component/SpreadsheetReader/CustomSpreadsheetReader";
import { Progress } from "@/components/ui/progress";
import { SpreadsheetReaderRef } from "@/components/component/SpreadsheetReader/Interface";

// Form Schema
const formSchema = z.object({
  executionTime: z.string().optional(),
  phoneNumber: z.string({
    required_error: "Please select a phone number.",
    message: "Please select a phone number.",
  }).min(1, { message: "Please select a phone number." }),
  timezone: z.string().optional(),
  assistantId: z.string({
    required_error: "Please select an assistant.",
    message: "Please select an assistant.",
  }).min(1, { message: "Please select an assistant." }),
  name: z.string().min(2, { message: "Name must be minimum 2 characters" }),
});

export default function Page() {
  const router = useRouter();
  const fileInputRef = useRef<SpreadsheetReaderRef>(null);

  // State: Data, Dialogs, and UI
  const [processedSuccessData, setProcessedSuccessData] = useState<Array<SpreadsheetRowSuccessType>>([]);
  const [processedErrorData, setProcessedErrorData] = useState<Array<SpreadsheetRowErrorType>>([]);
  const [processedFileInfo, setProcessedFileInfo] = useState<FileInfo | null>(null);

  // Dialogs and edit states
  const [isUpdateDialog, setIsUpdateDialog] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>();
  const [successDialog, setSuccessDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [errorDialog, setErrorDialog] = useState<boolean>(false);
  const [editErrorData, setEditErrorData] = useState<SpreadsheetRowErrorType>({
    id: 0, email: "", name: "", contact: "", message: "", countryCode: "", notes: "",
  });
  const [loader, setLoader] = useState<boolean>(false);

  // Assistant and org state
  const [assistant, setAssistant] = useState<Array<AssistantSelectType>>([]);
  const organizationId = useSelector(selectCurrentOrganizationId);
  const [getAssistants, { isLoading: getAssistantLoading }] =
    useLazyGetAllAssistantWithOutPaginationQuery();

  // Validation, sending, and duplicate states
  const [radioValue, setRadioValue] = useState<string>("send");
  const [saveDraft, setSaveDraft] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [duplicateCount, setDuplicateCount] = useState<number>(0);

  // Pagination and batch progress
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;
  const [progress, setProgress] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [totalContactsToProcess, setTotalContactsToProcess] = useState<number>(0);

  // Utility: Email Validation
  /**
   * Validates an email address using a regex pattern.
   * @param {string}
   * @returns {boolean} True if the email is valid, false otherwise.
   * */
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // Handler: Edit Dialog Email Change
  /**
   * Handles changes to the email input in the error editing dialog.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event from the input.
   * @returns {void}
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEditErrorData({ ...editErrorData, email: e.target.value });
    if (!(emailValue === "") && !isValidEmail(emailValue)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };

  // Effect: Fetch Assistants on Mount/Org Change
  // Fetch all assistants when the component mounts or organizationId changes
  useEffect(() => {
    const fetchAllAssistant = async () => {
      const res = await getAssistants({ organizationId: organizationId });
      if (res && res.data) setAssistant(res.data.data);
    };
    fetchAllAssistant();
  }, [getAssistants, organizationId]);

  // Redux Queries for Lead Validation and Creation
  const [validateBulkLead] = useLazyValidateBulkLeadQuery();
  const [createBulkLead] = useCreateBulkLeadMutation();

  // ===================
  // Handlers: Spreadsheet Import and Validation
  // ===================
  /**
   * Handles the loaded file data, processes it, and validates contacts.
   *
   * @param {Array<SpreadsheetRowType>} successDataParam - Successfully parsed contact data.
   * @param {Array<SpreadsheetRowErrorType>} errorDataParam - Errors encountered during parsing.
   * @param {FileInfo}
   * @param {File | null} file - The uploaded file object.
   * @returns {Promise<void>} A promise that resolves when processing is complete.
   * */
  const handleFileLoaded = async (
    successDataParam: Array<SpreadsheetRowType>,
    errorDataParam: Array<SpreadsheetRowErrorType>,
    fileInfo: FileInfo,
    file: File | null
  ) => {
    setLoader(true);
    setProgress(0);
    setProcessedCount(0);
    setTotalContactsToProcess(successDataParam.length);

    try {
      // -- Step 1: Clean and filter invalid contacts/emails --
      const cleanedContacts: Array<SpreadsheetRowType> = [];
      const initialErrors: Array<SpreadsheetRowErrorType> = [...errorDataParam];
      let globalIdCounter = processedSuccessData.length + processedErrorData.length + 1;

      successDataParam.forEach((data) => {
        const phone = parsePhoneNumberFromString(data.contact);
        const cleanedPhone = data.contact.replaceAll(" ", "").trim();
        if (!phone || !phone.isPossible()) {
          initialErrors.push({
            ...data,
            id: globalIdCounter++,
            message: "Phone number is incorrect. Please validate.",
            contact: cleanedPhone,
          });
          return;
        }
        if (data.email && !isValidEmail(data.email)) {
          initialErrors.push({
            ...data,
            id: globalIdCounter++,
            message: "Email is invalid.",
            contact: cleanedPhone,
          });
          return;
        }
        cleanedContacts.push({
          ...data,
          contact: cleanedPhone,
        });
      });

      // -- Step 2: Batch validate contacts for duplicates --
      const batchSize = 100;
      const totalContacts = cleanedContacts.length;
      setTotalContactsToProcess(totalContacts);
      const batches = Math.ceil(totalContacts / batchSize);
      let success: Array<SpreadsheetRowSuccessType> = [];
      let duplicateErrors: Array<SpreadsheetRowErrorType> = [];
      const organizationIdValue = organizationId ?? undefined;

      for (let i = 0; i < batches; i++) {
        const start = i * batchSize;
        const end = Math.min((i + 1) * batchSize, totalContacts);
        const batchContacts = cleanedContacts.slice(start, end).map((data) => data.contact);

        if (batchContacts.length === 0) continue;

        let res;
        try {
          res = await validateBulkLead({
            contacts: batchContacts,
            organizationId: organizationIdValue,
          }).unwrap();
        } catch (e) {
          console.error(`Error in validateBulkLead for batch ${i + 1}:`, e);
          toast.error(`Error validating batch ${i + 1}: ${e instanceof Error ? e.message : "Unknown error"}`);
          break;
        }

        const duplicates = res.data || [];

        // Process batch contacts into success
        const batchSuccess: Array<SpreadsheetRowSuccessType> = [];
        batchContacts.forEach((contact, index) => {
          const data = cleanedContacts[start + index];
          const phone = parsePhoneNumberFromString(contact);
          if (!success.some((s) => s.contact === contact) && !duplicateErrors.some((e) => e.contact === contact)) {
            batchSuccess.push({
              ...data,
              id: globalIdCounter++,
              countryCode: phone?.country || "",
              contact: contact,
            });
          }
        });

        // Add batch success to total success
        success = [...success, ...batchSuccess];

        // Remove duplicates from success and add to duplicateErrors
        duplicates.forEach((duplicateContact) => {
          const duplicateIndex = success.findIndex((s) => s.contact === duplicateContact);
          if (duplicateIndex !== -1) {
            const duplicateData = success[duplicateIndex];
            success.splice(duplicateIndex, 1);
            duplicateErrors.push({
              ...duplicateData,
              id: globalIdCounter++,
              message: "Phone number already in use.",
            });
          }
        });

        // Update processed data states after each batch
        setProcessedSuccessData((prev) => _.uniqBy([...prev, ...success], "contact"));
        setProcessedErrorData((prev) => _.uniqBy([...prev, ...duplicateErrors], "contact"));
        setProcessedFileInfo(fileInfo);

        // Update progress for UI feedback
        const processed = Math.min((i + 1) * batchSize, totalContacts);
        setProcessedCount(processed);
        setProgress((processed / totalContacts) * 100);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      // -- Step 3: Finalize validation state --
      const duplicatesCount = duplicateErrors.length;
      setDuplicateCount(duplicatesCount);
      setIsValidated(true);
      toast.success(`Validation complete! ${duplicatesCount} contacts already exist in the database.`);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error occurred.";
      toast.error(`Error processing file: ${errorMessage}`);
    } finally {
      setLoader(false); // End loading
      setProcessedCount(totalContactsToProcess); // Ensure count is final
      setProgress(100); // Ensure progress is 100%
    }
  };

  // ===================
  // Handlers: Success/Error List Management
  // ===================

  /**
   * Removes a contact from the success list.
   *
   * @param {number | null} index - The unique ID of the contact to delete.
   * @returns {void}
   */
  const handleSuccessDelete = (index: number | null) => {
    const filterData = processedSuccessData.filter((val) => val.id !== index);
    setProcessedSuccessData(filterData);
    setSuccessDialog(!successDialog);
    setDeleteId(null);
  };

  //===================
  // Handlers: Success/Error Dialogs
  //===================
  /**
   * Opens the success dialog for editing a contact.
   *
   * @param {SpreadsheetRowSuccessType}
   * @param {string} title - The title of the dialog (Success/Error).
   * @returns {void}
   */
  const handleSuccessEdit = (data: SpreadsheetRowErrorType) => {
    setIsUpdateDialog(!isUpdateDialog);
    setEditErrorData(data);
    setDialogTitle("Success");
    if (!(data.email === "") && !isValidEmail(data.email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };

  // =======================
  // Handlers: Error List Management
  // =======================
  /**
   * Deletes a contact from the error list.
   *
   * @param {number | null}
   * @param {SpreadsheetRowErrorType} index - The unique ID of the contact to delete.
   * @return {void}
   */
  const handleErrorDelete = (index: number | null) => {
    const filterData = processedErrorData.filter((val) => val.id !== index);
    setProcessedErrorData(filterData);
    setErrorDialog(!errorDialog);
    setDeleteId(null);
  };

  // =======================
  // Handlers: Error Dialogs
  // =======================
  /**
   * Opens the error dialog for editing a contact.
   *
   * @param {SpreadsheetRowErrorType}
   * @returns {void}
   */
  const handleErrorEdit = (data: SpreadsheetRowErrorType) => {
    setIsUpdateDialog(!isUpdateDialog);
    setEditErrorData(data);
    setDialogTitle("Error");
    if (!(data.email === "") && !isValidEmail(data.email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };

  const [isEditErrorLoading, setIsEditErrorLoading] = useState<boolean>(false);

  // =======================
  // Handler: Save Edits from Dialog
  // =======================
  /**
   * Submits the edited error data from the dialog.
   * Validates the phone number and updates the success or error lists accordingly.
   *
   * @returns {Promise<void>}
   */
  const onSubmitEditError = async () => {
    setIsEditErrorLoading(true);
    if (!editErrorData?.contact) {
      toast.error("Phone number is incorrect. Please validate.");
      setIsEditErrorLoading(false);
      return;
    }
    const phone = parsePhoneNumberFromString(editErrorData?.contact);
    if (!phone?.isPossible()) {
      toast.error("Phone number is incorrect. Please validate.");
      setIsEditErrorLoading(false);
      return;
    }

    if (dialogTitle === "Success") {
      // Edit in success list
      const successDataNumbers = processedSuccessData
        .filter((data) => data.id !== editErrorData.id)
        .map((data) => data.contact);

      if (!successDataNumbers.includes(editErrorData.contact)) {
        const updatedData = processedSuccessData.map((data) => {
          if (editErrorData.id === data.id) {
            return {
              ...data,
              email: editErrorData.email,
              name: editErrorData.name,
              contact: editErrorData.contact,
              countryCode: phone.country || "",
            };
          }
          return data;
        });
        setIsUpdateDialog(!isUpdateDialog);
        setProcessedSuccessData(updatedData);
      } else {
        toast.error(`${editErrorData.contact} already in use.`);
      }
    } else {
      // Move from error list to success list if valid
      const successDataNumbers = processedSuccessData.map((data) => data.contact);
      if (!successDataNumbers.includes(editErrorData.contact)) {
        const filterData = processedErrorData.filter(
          (val) => val.id !== editErrorData?.id
        );
        setProcessedErrorData(filterData);

        processedSuccessData.push({
          id: editErrorData.id,
          email: editErrorData.email,
          name: editErrorData.name,
          contact: editErrorData.contact,
          countryCode: phone.country || "",
          notes: editErrorData.notes || "",
        });
        setIsUpdateDialog(!isUpdateDialog);
      } else {
        toast.error(`${editErrorData.contact} already in use.`);
      }
    }
    setIsEditErrorLoading(false);
  };

  // React Hook Form Setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      executionTime: "",
      timezone: TIMEZONE_OFFSET.timezone,
      phoneNumber: "",
      assistantId: "",
      name: "",
    },
  });

  // Timezone and Phone Number Data
  const labelStyle = "original";
  const timezones = { ...allTimezones };
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const [offSet, setOffSet] = useState<number>(TIMEZONE_OFFSET.offset);

  // Fetch available phone numbers for the organization
  const { data: phoneNumbersData, isLoading: phoneNumberLoading } =
    useGetVapiPhoneNumbersQuery();
  const [phoneNumbers, setPhoneNumbers] = useState<Array<VapiPhoneNumber>>([]);
  useEffect(() => {
    if (phoneNumbersData && phoneNumbersData.data.length > 0) {
      setPhoneNumbers(phoneNumbersData.data);
    }
  }, [phoneNumbersData]);

  // ==================
  // Handlers: Download CSV
  // ==================
  /**
   * Downloads the processed contacts as a CSV file.
   * Combines success and error data, formats it, and triggers a download.
   *
   * @returns {void}
   */
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

    const headers = ["id", "name", "email", "contact", "countryCode", "notes",];
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

  // ==================
  // Handler: Send Batches
  // ==================
  /**
   * Sends batches of leads to the server.
   * Validates the form, prepares the payload, and calls the API to create bulk leads.
   *
   * @param {z.infer<typeof formSchema>} formData - The form data.
   * @param {boolean} isDraft - Whether to save as draft.
   * @param {boolean} isSchedular - Whether to schedule the batch.
   * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
   * */
  const sendBatches = async (formData: z.infer<typeof formSchema>, isDraft: boolean, isSchedular: boolean) => {
    const phoneNumberId = phoneNumbers.find((phone) => phone.number === formData.phoneNumber)?.id;

    if (!phoneNumberId) {
      toast.error("Phone number not found.");
      return false;
    }

    if (organizationId == null) {
      toast.error("Organization ID is missing.");
      return false;
    }

    // Determine valid leads based on action
    let validLeads = processedSuccessData;
    if (!isDraft) {
      validLeads = processedSuccessData.filter(
        (data) => !processedErrorData.some((err) => err.contact === data.contact)
      );
      if (validLeads.length === 0) {
        toast.error("No valid leads to send.");
        return false;
      }
    } else if (processedSuccessData.length <= 0 && processedErrorData.length <= 0) {
      toast.error("Spreadsheet data not found!");
      return false;
    } else if (processedErrorData.length > 0) {
      toast.error("The Spreadsheet data has errors. Please review and correct them.");
      return false;
    }

    if (isSchedular && (!formData.executionTime || formData.executionTime === "")) {
      toast.error("Please select a scheduler date.");
      return false;
    }

    setIsSending(true);
    // Batch size of 500
    const batchSize = 1000;
    const totalBatches = Math.ceil(validLeads.length / batchSize);

    try {
      for (let i = 0; i < totalBatches; i++) {
        const start = i * batchSize;
        const end = Math.min((i + 1) * batchSize, validLeads.length);
        const batchLeads = validLeads.slice(start, end);

        const batchName = i == 0 ? formData.name : `${formData.name}-0${i + 1}`;  // Append batch number

        const body: LeadBulkBodyType = {
          leads: batchLeads,
          phoneNumberId: phoneNumberId,
          timezone: formData.timezone && formData.timezone !== "" ? formData.timezone : undefined,
          organizationId: organizationId,
          executionTime: isSchedular && formData.executionTime && formData.executionTime !== ""
            ? moment(new Date(formData.executionTime))
              .subtract(offSet, "hours")
              .format("YYYY-MM-DDTHH:mm:ss[Z]")
            : undefined,
          assistantId: Number(formData.assistantId),
          name: batchName,
          isDraft: isDraft,
          isSchedular: isSchedular,
        };

        const result = await createBulkLead(body).unwrap();
        if (result.success) {
          toast.success(`Batch ${i + 1} of ${totalBatches} ${isDraft ? "saved as draft" : "sent"} successfully.`);
        } else {
          throw new Error(result.message || "Failed to process batch.");
        }
      }

      toast.success(`All ${totalBatches} ${isDraft ? "drafts" : "batches"} processed successfully.`);
      setProcessedSuccessData([]);
      setProcessedErrorData([]);
      router.push("/lead/bulk");
      return true;
    } catch (error) {
      toast.error((error as ErrorResponse).data?.message || `An error occurred while processing ${isDraft ? "drafts" : "batches"}.`);
      return false;
    } finally {
      setIsSending(false); // Reset loading state when done
    }
  };

  // ===================
  // Handler: Form Submission
  // ===================
  /**
   * Handles form submission for batch calls.
   * Validates the form, checks if contacts are processed, and sends batches.
   *
   * @param {z.infer<typeof formSchema>} data - The form data.
   * @returns {Promise<void>} A promise that resolves when the submission is complete.
   */
  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!isValidated) {
      toast.error("Please process and validate the contacts first.");
      return;
    }
    const isDraft = true;
    const isSchedular = radioValue === "schedule";
    await sendBatches(data, isDraft, isSchedular);
    setSaveDraft(false);
  }

  // ===================
  // Handler: Send Contacts
  // ===================
  /**
   * Handles sending the contacts after validation.
   * Checks if contacts are validated, prepares the form data, and sends batches.
   *
   * @returns {Promise<void>} A promise that resolves when the sending is complete.
   */
  const handleSend = async () => {
    if (!isValidated) {
      toast.error("Please process and validate the contacts first.");
      return;
    }
    const formData = form.getValues();
    const isDraft = false;
    const isSchedular = radioValue === "schedule";
    await sendBatches(formData, isDraft, isSchedular);
    setIsSending(false); // Ensure reset, though finally in sendBatches handles this
    setSaveDraft(false);
  }

  // ===================
  // Handler: Clear All Data and Reset UI
  // ===================
  /**
   * Clears all processed data, resets the form, and updates the UI state.
   *
   * @returns {void}
   */
  const clearAll = () => {
    setProcessedSuccessData([]);
    setProcessedErrorData([]);
    setProcessedFileInfo(null);
    setCurrentPage(1);
    setProgress(0);
    setProcessedCount(0);
    setIsValidated(false);
    setDuplicateCount(0);
    setTotalContactsToProcess(0);
    if (fileInputRef.current) {
      fileInputRef.current.reset();
    }
  };

  // ========================
  // Handler: Reset from Child Component
  // ========================
  /**
   * Resets the processed data and UI state when called from the child component.
   * This is useful for clearing data after processing or validation.
   *
   * @returns {void}
   */

  // Handle reset from child component
  const handleChildReset = () => {
    setProcessedSuccessData([]);
    setProcessedErrorData([]);
    setProcessedFileInfo(null);
    setCurrentPage(1);
    setProgress(0);
    setProcessedCount(0);
    setIsValidated(false);
    setDuplicateCount(0);
    setTotalContactsToProcess(0);
  };

  // Pagination Calculations
  const totalItems = processedSuccessData.length + processedErrorData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const paginatedSuccessData = processedSuccessData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const remainingSlots = rowsPerPage - paginatedSuccessData.length;
  const paginatedErrorData = processedErrorData.slice(
    (currentPage - 1) * rowsPerPage,
    (currentPage - 1) * rowsPerPage + remainingSlots
  );
  // ========================
  // Handler: Change Table Pagination Page
  // ========================
  /**
   * Handles page changes for pagination.
   * Updates the current page if within valid range.
   *
   * @param {number}
   * @returns {void}
   */
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="grid 2xl:grid-cols-2 lg:grid-cols-1 items-start xl:justify-center md:justify-normal gap-[20px] bulk-lead-screen">
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
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid xl:grid-cols-1 items-center lg:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
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
                  rules={{
                    required: "Phone number is required",
                  }}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>From number</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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

                {(processedSuccessData.length > 0 || processedErrorData.length > 0) && processedFileInfo ? (
                  <div className="border-2 border-dashed rounded-md p-4 bg-gray-100 relative">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div className="flex gap-2">
                        <FileSpreadsheetIcon className="h-16 w-16 text-gray" />

                        <div className="text-gray-700 text-sm">
                          <strong>{processedFileInfo.name}</strong> <br />
                          Processed Contacts: {processedSuccessData.length + processedErrorData.length} <br />
                          Valid Contacts: {processedSuccessData.length}
                        </div>
                      </div>


                      <div className="flex gap-2 ">
                        <Button variant="outline3" className="text-sm" size="sm" type="button" onClick={handleDownloadCSV}>
                          Download CSV <ArrowDownToLineIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="text-sm" type="button" size="sm" onClick={clearAll}>
                          Clear All <CircleX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                ) : (
                  <CustomSpreadsheetReader
                    ref={fileInputRef}
                    handleFileLoaded={handleFileLoaded}
                    organizationId={organizationId?.toString()}
                    onReset={handleChildReset}
                  />
                )}
              </div>

              <div className="pt-5">
                <p className="mb-2 text-base text-charcoal">
                  When to send the calls
                </p>
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
                {radioValue === "send" ? (
                  <></>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <FormField
                      control={form.control}
                      name="executionTime"
                      render={({ field }) => {
                        const time = field.value
                          ? format(new Date(field.value), "HH:mm")
                          : null;
                        return (
                          <FormItem className="w-full ">
                            <Popover>
                              <div className="relative w-full flex justify-center">
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "!p-0 !pl-2 text-secondary bg-white w-full !gap-3 !h-[40px] justify-start !text-center font-light text-sm rounded-md",
                                        !field.value && "text-muted-foreground",
                                        "hover:bg-white hover:text-charcoal"
                                      )}
                                    >
                                      {field.value ? (
                                        format(
                                          new Date(field.value),
                                          "dd-MM-yyyy HH:mm"
                                        )
                                      ) : (
                                        <span className="text-charcoal">
                                          Selected date
                                        </span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                {Boolean(field.value) && (
                                  <div className="absolute right-0 top-0 z-10">
                                    <CircleX
                                      className="h-4 w-4 mb-3 mx-3 mt-3"
                                      onClick={() => {
                                        field.onChange(undefined);
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
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    if (date) {
                                      const time = field.value
                                        ? new Date(field.value)
                                        : new Date();
                                      if (!Boolean(field.value)) {
                                        time.setHours(0, 0, 0, 0);
                                      }
                                      time.setFullYear(
                                        date.getFullYear(),
                                        date.getMonth(),
                                        date.getDate()
                                      );
                                      field.onChange(
                                        format(time, "yyyy-MM-dd HH:mm")
                                      );
                                    } else {
                                      field.onChange(undefined);
                                    }
                                  }}
                                  initialFocus
                                />
                                <div className="flex items-center gap-4 pl-4 mx-2 mb-2">
                                  <div>Time : </div>
                                  <TimePicker
                                    defaultValue={
                                      time ? dayjs(time, "HH:mm") : null
                                    }
                                    format="HH:mm"
                                    onChange={(time, timeString) => {
                                      if (field.value && time) {
                                        const date = new Date(field.value);
                                        date.setHours(
                                          time.hour(),
                                          time.minute(),
                                          time.second()
                                        );
                                        field.onChange(
                                          format(date, "yyyy-MM-dd HH:mm")
                                        );
                                      } else {
                                        const date = new Date();
                                        date.setHours(0, 0, 0, 0);
                                        field.onChange(
                                          moment(date).format(
                                            "YYYY-MM-DDTHH:mm:ss[Z]"
                                          )
                                        );
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
                          >
                            <FormControl>
                              <SelectTrigger
                                className="rounded-md text-charcoal"
                                disabled={phoneNumberLoading}
                              >
                                <SelectValue placeholder="Select time zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {options.map((option, index) => (
                                <SelectItem key={index} value={option.value}>
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
                    type="submit"
                    className="rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] shadow-md text-theme"
                    onClick={() => {
                      const formData = form.getValues();
                      if (
                        formData.name !== "" &&
                        formData.name &&
                        formData.assistantId !== "" &&
                        formData.assistantId &&
                        formData.phoneNumber !== "" &&
                        formData.phoneNumber
                      ) {
                        setSaveDraft(true);
                      } else setSaveDraft(false);
                    }}
                    disabled={(isValidating || isSending) || !isValidated || processedSuccessData.length === 0}
                  >
                    {(isValidating || isSending) && saveDraft ? <Loading /> : "Save as draft"}
                  </Button>
                  <Button
                    type="button"
                    className="border-2 border-theme bg-theme rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] text-white"
                    onClick={handleSend}
                    disabled={(isValidating || isSending) || !isValidated || processedSuccessData.length === 0}
                  >
                    {isSending ? <Loading /> : "Send"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="bg-sidebar w-full h-full p-6">
          <p className="text-charcoal">Recipients</p>
          {processedSuccessData.length === 0 && processedErrorData.length === 0 ? (
            <span className="flex items-center justify-center h-full text-theme">
              Please upload recipients as a spreadsheet.
            </span>
          ) : (
            <>
              <div className="mb-4">
                <Progress value={progress} className="w-full" />
                <div className="text-sm text-charcoal mt-2">
                  Status: {isValidated ? <span className="text-green-500 font-bold">Validated</span> : <span className="font-bold">Validating, Please wait...</span>}
                  <br />
                  Validation Progress: {progress}%
                  <br />
                  Processed Contacts: {processedCount} <br />
                  Duplicates: {duplicateCount} <br />
                  Errors: {processedErrorData.length} <br />
                  <span className="text-orange-500">
                    {processedErrorData.length > 0 ? "Please review errors before sending." : ""}
                  </span>
                </div>
              </div>
              <Table className="h-full pt-4 overflow-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">ID</TableHead>
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
                  {paginatedSuccessData.length === 0 && paginatedErrorData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-theme">
                        No Data Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {paginatedSuccessData.map((data) => (
                        <TableRow key={data.id} className="cursor-pointer">
                          <TableCell className="text-center">{data.id}</TableCell>
                          <TableCell className="text-center">{data.name}</TableCell>
                          <TableCell className="text-center max-w-[200px]">{data.email}</TableCell>
                          <TableCell className="text-center">{data.contact}</TableCell>
                          <TableCell className="text-center max-w-[200px]">{data.notes}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              <Pencil
                                className="text-emerald-400 p-0.5"
                                onClick={() =>
                                  handleSuccessEdit({
                                    ...data,
                                    message: undefined,
                                  })
                                }
                              />
                              <Trash2
                                className="text-red-600"
                                onClick={() => {
                                  setSuccessDialog(!successDialog);
                                  setDeleteId(data.id);
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedErrorData.map((data) => (
                        <TableRow key={data.id} className="cursor-pointer text-red-600" title={data.message || ""}>
                          <TableCell className="text-center">{data.id}</TableCell>
                          <TableCell className="text-center">{data.name}</TableCell>
                          <TableCell className="text-center max-w-[200px]">{data.email}</TableCell>
                          <TableCell className="text-center">{data.contact}</TableCell>
                          <TableCell className="text-center max-w-[200px]">{data.notes}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              <Pencil
                                className="text-emerald-400 p-0.5"
                                onClick={() => handleErrorEdit(data)}
                              />
                              <Trash2
                                className="text-red-600"
                                onClick={() => {
                                  setErrorDialog(!errorDialog);
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
              {duplicateCount > 0 && (
                <p className="text-gray-700 text-center font-semibold mt-4">
                  {duplicateCount} contacts already exist in the database.
                </p>
              )}
              {totalItems > rowsPerPage && (
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
            </>
          )}
        </div>
      </div>

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
                setDeleteId(null);
              }}
            />
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2">
            <Button
              type="submit"
              className="border-2 border-theme !h-7 text-theme hover:bg-theme-300 w-full"
              onClick={() => {
                setSuccessDialog(!successDialog);
                setDeleteId(null);
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
                setDeleteId(null);
              }}
            />
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="border-2 border-theme !h-7 text-theme hover:bg-theme-300 w-full"
              onClick={() => {
                setErrorDialog(!errorDialog);
                setDeleteId(null);
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
            <DialogClose onClick={() => setIsUpdateDialog(!isUpdateDialog)} />
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-center">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Name"
                value={editErrorData?.name}
                className="col-span-3"
                onChange={(e) =>
                  setEditErrorData({
                    ...editErrorData,
                    name: e.target.value,
                  })
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
                value={editErrorData?.email}
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
                value={editErrorData?.contact}
                className="col-span-3"
                onChange={(e) =>
                  setEditErrorData({
                    ...editErrorData,
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
              disabled={
                !editErrorData?.name ||
                Boolean(emailError) ||
                !editErrorData?.contact
              }
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