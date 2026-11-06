/**
 * @file CustomSpreadsheetReader.tsx
 * @title Custom Spreadsheet Reader Component
 * @description
 *   A robust React component for importing, parsing, normalizing, and previewing spreadsheet data (CSV, XLSX, XLS) in web applications.
 *   This component provides a user-friendly interface for uploading contact lists via drag-and-drop or file picker, supports header mapping,
 *   and performs advanced phone and email validation—including country code normalization and duplicate detection.
 *   Users can interactively resolve data errors before confirming import, preview cleaned and problematic rows, and apply bulk fixes.
 *   On confirmation, the cleaned and error-separated data is passed to a parent handler for further processing (such as validation or submission).
 *
 *   Key Features:
 *   - Accepts CSV, XLSX, and XLS files via drag-and-drop or file input.
 *   - Parses spreadsheet data using PapaParse (CSV) and xlsx.js (Excel).
 *   - Interactive header selection: users map spreadsheet columns to contact, name, email, and notes fields.
 *   - Advanced phone number normalization: handles international and local formats, country code inference, and ambiguity resolution.
 *   - Email validation and duplicate removal.
 *   - Error preview and inline correction: users can edit problematic rows or apply bulk country codes.
 *   - Responsive, accessible dialogs for header selection and data preview.
 *   - Cleaned and error-separated data is returned to the parent component via a callback.
 *
 *   Typical Usage:
 *     <CustomSpreadsheetReader handleFileLoaded={yourHandler} organizationId={orgId} />
 *
 * @author Ngeyen Victory
 * @copyright © 2025 RealTalkr. All rights reserved.
 * @license Proprietary
 * @keywords spreadsheet, import, CSV, XLSX, validation, normalization, React, contacts, phone, email
 * @contact info@realtalkr.ai
 *
 * @created 2025-05-24
 * @lastmodified 2025-05-31
 *
 * Note:
 *   - This file is part of the RealTalkr application. Retain this header for attribution and legal compliance.
 *   - For detailed function documentation, see inline JSDoc comments in the source.
 */
"use client";

import React, {
  ChangeEvent,
  DragEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Inbox, X, Maximize, Minimize, Check, FileSpreadsheetIcon, MoveRightIcon, MoveLeftIcon } from "lucide-react"; // Added Check icon
import { SpreadsheetRowType, SpreadsheetRowErrorType, FileInfo } from "@/types/lead";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SpreadsheetReaderRef, SpreadsheetReaderHeaderSelectionState, SpreadsheetReaderPhoneNormalizationResult, SpreadsheetReaderPreviewState } from "./Interface";

// ===================
// Constants & Types
// ===================

// List of countries for user to select from for local numbers
const TARGET_REGIONS: CountryCode[] = [
  "AE", "SA", "OM", "BH", "QA", "KW", "EG", "IN", "US", "GB", "NO", "LB", "KZ", "IR", "UA", "MM", "AU", "ES",
];

// Map of country codes to region codes for validation
const COUNTRY_CODE_TO_REGION: { [key: string]: CountryCode } = {
  "971": "AE", "966": "SA", "968": "OM", "973": "BH", "974": "QA", "965": "KW", "20": "EG", "91": "IN",
  "44": "GB", "1": "US", "47": "NO", "961": "LB", "77": "KZ", "98": "IR", "380": "UA", "95": "MM", "61": "AU", "34": "ES",
};

export interface Props {
  handleFileLoaded: (
    successData: Array<SpreadsheetRowType>,
    errorData: Array<SpreadsheetRowErrorType>,
    fileInfo: FileInfo,
    file: File | null
  ) => void;
  organizationId?: string;
  onReset?: () => void; // New prop to notify parent on reset
}

// ===================
// Component
// ===================

const CustomSpreadsheetReader = forwardRef<SpreadsheetReaderRef, Props>(
  ({ handleFileLoaded, organizationId, onReset }, ref) => {
    // ----- State and Refs -----
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Dialog state for header selection
    const [headerSelection, setHeaderSelection] = useState<SpreadsheetReaderHeaderSelectionState>({
      isOpen: false,
      headers: [],
      data: [],
      fileInfo: null,
      contactColumn: "",
      nameColumn: null,
      emailColumn: null,
      notesColumn: null,
    });

    // Preview state for cleaned/error data
    const [preview, setPreview] = useState<SpreadsheetReaderPreviewState>({
      isOpen: false,
      success: [],
      errors: [],
      fileInfo: null,
      isMaximized: false,
      currentPage: 1,
      rowsPerPage: 20,
      selectedRows: new Set(),
      bulkCountryCode: null,
    });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // ===================
    // Utility: Normalization & Validation
    // ===================

    /**
     * Normalizes a name string by trimming and capitalizing words.
     * @param {string} name - The name string.
     * @returns {string} Normalized name.
     */
    const normalizeName = (name: string) =>
      name ? name.trim().replace(/\b\w/g, (char) => char.toUpperCase()) : "";

    /**
     * Normalizes and validates a phone number string.
     * Handles country code detection, E.164 formatting, and ambiguity.
     *
     * @param {string} phone - Phone number as string.
     * @returns {SpreadsheetReaderPhoneNormalizationResult}
     */
    const normalizePhoneForList = (phone: string): SpreadsheetReaderPhoneNormalizationResult => {
      // Clean the number: remove all non-digits except for "+", and also remove quotes and whitespace
      let cleaned = phone
        .trim()
        .replace(/['"]/g, "") // Remove single and double quotes
        .replace(/[^0-9+]/g, ""); // Keep only digits and "+"

      // Early rejection of completely invalid numbers
      if (
        !cleaned ||
        cleaned.length < 7 ||
        cleaned === "null" ||
        cleaned === "0" ||
        /^[0-]+$/.test(cleaned) || // e.g., "0000", "00-00-00"
        cleaned.length > 15 || // Unreasonably long numbers
        cleaned === "+" // Just a "+" with no digits
      ) {
        return { normalized: null, countryCode: "", shouldDelete: true, isAmbiguous: false, possibleCountries: [] };
      }

      // Handle numbers starting with "+" or country codes (e.g., "971", "00968")
      let countryCodeFromNumber: CountryCode | undefined;
      let cleanedWithPlus: string | undefined;

      // Check for "00" prefix (e.g., "0096824501297" → Oman)
      if (cleaned.startsWith("00")) {
        const potentialCountryCode = Object.keys(COUNTRY_CODE_TO_REGION).find((code) =>
          cleaned.startsWith("00" + code)
        );
        if (potentialCountryCode) {
          cleanedWithPlus = "+" + cleaned.slice(2);
          countryCodeFromNumber = COUNTRY_CODE_TO_REGION[potentialCountryCode];
        }
      }

      // Check for numbers starting with a country code without "+" (e.g., "97144233100")
      if (!cleanedWithPlus) {
        const potentialCountryCode = Object.keys(COUNTRY_CODE_TO_REGION).find((code) =>
          cleaned.startsWith(code)
        );
        if (potentialCountryCode) {
          cleanedWithPlus = "+" + cleaned;
          countryCodeFromNumber = COUNTRY_CODE_TO_REGION[potentialCountryCode];
        }
      }

      // If the number already starts with "+"
      if (!cleanedWithPlus && cleaned.startsWith("+")) {
        cleanedWithPlus = cleaned;
        for (const countryCodePrefix of Object.keys(COUNTRY_CODE_TO_REGION)) {
          if (cleaned.startsWith("+" + countryCodePrefix)) {
            countryCodeFromNumber = COUNTRY_CODE_TO_REGION[countryCodePrefix];
            break;
          }
        }
      }

      // Process international numbers (with or without "+")
      if (cleanedWithPlus) {
        // Remove leading zeros after the country code
        const countryCodeLength = (countryCodeFromNumber && cleanedWithPlus.indexOf(countryCodeFromNumber) === 1)
          ? countryCodeFromNumber.length + 1
          : cleanedWithPlus.indexOf("+") + 1;
        const digitsAfterCountryCode = cleanedWithPlus.slice(countryCodeLength).replace(/^0+/, "");
        cleanedWithPlus = cleanedWithPlus.slice(0, countryCodeLength) + digitsAfterCountryCode;

        const phoneNumber = parsePhoneNumberFromString(cleanedWithPlus);
        if (phoneNumber && phoneNumber.isValid()) {
          const formattedNumber = phoneNumber.format("E.164");
          const countryCode = phoneNumber.country || countryCodeFromNumber || "";
          return {
            normalized: formattedNumber,
            countryCode,
            shouldDelete: false,
            isAmbiguous: false,
            possibleCountries: [],
          };
        } else {
          return {
            normalized: cleanedWithPlus,
            countryCode: countryCodeFromNumber || "",
            shouldDelete: false,
            isAmbiguous: true,
            possibleCountries: [],
            message: "Invalid phone number format.",
          };
        }
      }

      // Local numbers (no "+" or recognized country code) - remove leading zeros
      cleaned = cleaned.replace(/^0+/, "");
      if (cleaned.length < 7) {
        return { normalized: null, countryCode: "", shouldDelete: true, isAmbiguous: false, possibleCountries: [] };
      }

      return {
        normalized: cleaned,
        countryCode: "",
        shouldDelete: false,
        isAmbiguous: true,
        possibleCountries: TARGET_REGIONS,
        message: "Local number requires country code selection.",
      };
    };

    // ===================
    // File Processing Functions
    // ===================

    /**
     * Processes parsed spreadsheet data and triggers header selection.
     *
     * @param {Array<Record<string, any>>} data - Parsed spreadsheet rows.
     * @param {FileInfo} fileInfo - File metadata.
     * @param {File} file - The actual file object.
     * @returns {void}
     */
    const processData = useCallback(
      (data: Array<Record<string, any>>, fileInfo: FileInfo, file: File) => {
        if (data.length > 0 && Object.keys(data[0]).length > 0) {
          const validHeaders = Object.keys(data[0]).filter((key) => key.trim() !== "");
          if (validHeaders.length > 0) {
            const firstHeaderIsValid = !/^\d+$/.test(validHeaders[0]);
            if (!firstHeaderIsValid) {
              setErrorMessage("First column header appears invalid (e.g., a number). Please add valid headers.");
              setFile(null);
              return;
            }
            setHeaderSelection((prevState) => ({
              ...prevState,
              isOpen: true,
              headers: validHeaders,
              data,
              fileInfo,
            }));
            setFile(file);
            setErrorMessage(null);
          } else {
            setErrorMessage("No valid headers found in the file.");
            setFile(null);
          }
        } else {
          setErrorMessage("Uploaded file is empty or has no valid data.");
          setFile(null);
        }
      },
      []
    );

    /**
     * Processes a CSV file using PapaParse.
     *
     * @param {File} file - The CSV file to process.
     * @returns {void}
     */
    const processCSV = useCallback(
      (file: File) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          chunkSize: 1000,
          complete: (results) => {
            const parsedData = results.data as Array<Record<string, any>>;
            processData(parsedData, { name: file.name, size: file.size, type: file.type }, file);
            if (inputRef.current) inputRef.current.value = "";
          },
          error: (err) => {
            setErrorMessage("CSV Parsing error: " + err.message);
            setFile(null);
          },
        });
      },
      [processData]
    );

    /**
     * Processes an Excel file using XLSX library.
     *
     * @param {File} file - The Excel file to process.
     * @returns {void}
     */
    const processExcel = useCallback(
      (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          if (data) {
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1 });
            if (jsonData.length > 0 && jsonData[0].length > 0) {
              const headers = jsonData[0] as string[];
              const dataRows = jsonData.slice(1).map((row) =>
                headers.reduce((obj, header, index) => {
                  obj[header] = row[index];
                  return obj;
                }, {} as Record<string, any>)
              );
              processData(dataRows, { name: file.name, size: file.size, type: file.type }, file);
            } else {
              setErrorMessage("XLSX file is empty or has no headers.");
              setFile(null);
            }
          }
        };
        reader.onerror = () => {
          setErrorMessage("Error reading XLSX file.");
          setFile(null);
        };
        reader.readAsBinaryString(file);
      },
      [processData]
    );

    // ===================
    // Handlers for file input, drag-and-drop, and dialog actions
    // ===================

    /**
     * Handles file input change event for file upload.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - File input change event.
     * @returns {void}
     */
    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
        if (fileExtension === "csv") processCSV(selectedFile);
        else if (["xlsx", "xls"].includes(fileExtension || "")) processExcel(selectedFile);
        else {
          setErrorMessage("Unsupported file type. Please upload a CSV, XLSX, or XLS file.");
          setFile(null);
        }
      }
    };

    /**
     * Handles drag-and-drop events for file upload.
     *
     * @param {DragEvent<HTMLDivElement>} e - Drag event.
     * @param {boolean} [isDialogDrop] - Whether this is a dialog drop event.
     * @returns {void}
     */
    const handleDrop = (e: DragEvent<HTMLDivElement>, isDialogDrop?: boolean) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        const fileExtension = droppedFile.name.split(".").pop()?.toLowerCase();
        if (fileExtension === "csv") processCSV(droppedFile);
        else if (["xlsx", "xls"].includes(fileExtension || "")) processExcel(droppedFile);
        else {
          setErrorMessage("Unsupported file type. Please upload a CSV, XLSX, or XLS file.");
          setFile(null);
        }
        if (isDialogDrop && inputRef.current) inputRef.current.value = "";
      }
    };

    // ===================
    // Header Selection & Data Mapping
    // ===================

    /**
     * Handles confirmation of selected headers and processes the data.
     * Validates contact column and normalizes phone numbers.
     */
    const handleConfirmHeaders = () => {
      if (!headerSelection.contactColumn) {
        setErrorMessage("Please select a contact column.");
        return;
      }

      // Clean and normalize all contacts in the selected column first
      const cleanedContacts = headerSelection.data.map((row) => {
        const rawContact = row[headerSelection.contactColumn]?.toString() || "";
        const { normalized, shouldDelete } = normalizePhoneForList(rawContact);
        return { raw: rawContact, normalized, shouldDelete };
      });

      // Check if there are any valid (non-deleted) normalized contacts
      const hasValidContacts = cleanedContacts.some(
        (contact) => contact.normalized && !contact.shouldDelete
      );

      if (!hasValidContacts) {
        setErrorMessage("The selected column does not contain valid phone numbers. Are you sure this is the correct column?");
        return;
      }

      const fullData = headerSelection.data;
      const successData: SpreadsheetRowType[] = [];
      const errorData: SpreadsheetRowErrorType[] = [];
      const contactMap = new Map<string, number>(); // Track all contacts to remove duplicates

      fullData.forEach((row, index) => {
        const rowNum = index + 1;
        let errorMessage: string | undefined = undefined;

        const rawContact = row[headerSelection.contactColumn]?.toString() || "";
        const { normalized: contact, countryCode, shouldDelete, isAmbiguous, possibleCountries, message } = normalizePhoneForList(rawContact);

        if (shouldDelete) {
          return; // Completely ignore this row
        }

        if (contact && contactMap.has(contact)) {
          return; // Skip duplicates
        } else if (contact) {
          contactMap.set(contact, rowNum);
        }

        const email = headerSelection.emailColumn
          ? row[headerSelection.emailColumn]?.trim()
          : "";
        if (email && !emailRegex.test(email)) {
          errorMessage = errorMessage
            ? `${errorMessage} Invalid email.`
            : "Invalid email.";
        }

        if (contact && (isAmbiguous || message)) {
          errorMessage = errorMessage
            ? `${errorMessage} ${message || "Local number requires country code selection."}`
            : message || "Local number requires country code selection.";
        }

        const normalizedRow = {
          id: rowNum,
          name: headerSelection.nameColumn
            ? normalizeName(row[headerSelection.nameColumn])
            : "",
          email,
          contact: contact || rawContact,
          notes: headerSelection.notesColumn
            ? row[headerSelection.notesColumn]?.trim()
            : "",
          countryCode,
          possibleCountries,
        };

        if (errorMessage) {
          errorData.push({ ...normalizedRow, message: errorMessage });
        } else if (contact) {
          successData.push(normalizedRow);
        }
      });

      setPreview((prev) => ({
        ...prev,
        isOpen: true,
        success: successData,
        errors: errorData,
        fileInfo: headerSelection.fileInfo!,
        isMaximized: false,
        currentPage: 1,
        selectedRows: new Set(),
        bulkCountryCode: null,
      }));
      setHeaderSelection((prevState) => ({ ...prevState, isOpen: false }));
    };

    /**
     * Handles going back to the header selection dialog.
     * @returns {void}
     */
    const handleGoBack = () => {
      setPreview((prev) => ({ ...prev, isOpen: false, selectedRows: new Set(), bulkCountryCode: null }));
      setHeaderSelection((prev) => ({ ...prev, isOpen: true }));
    };

    /**
     * Handles confirmation of the import process.
     * Calls the provided callback with the cleaned data.
     * @returns {void}
     */
    const handleConfirmImport = () => {
      handleFileLoaded(preview.success, preview.errors, preview.fileInfo!, file);
      resetState();
    };

    /**
     * Resets the component state to initial values.
     * Clears file, header selection, preview, and error message.
     * @returns {void}
     */
    const resetState = () => {
      setFile(null);
      setHeaderSelection({
        isOpen: false,
        headers: [],
        data: [],
        fileInfo: null,
        contactColumn: "",
        nameColumn: null,
        emailColumn: null,
        notesColumn: null,
      });
      setPreview({
        isOpen: false,
        success: [],
        errors: [],
        fileInfo: null,
        isMaximized: false,
        currentPage: 1,
        rowsPerPage: 20,
        selectedRows: new Set(),
        bulkCountryCode: null,
      });
      setErrorMessage(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      form.reset({
        contactColumn: "",
        nameColumn: null,
        emailColumn: null,
        notesColumn: null,
      });
      if (onReset) {
        onReset();
      }
    };

    // Expose reset function via ref
    useImperativeHandle(ref, () => {
      return {
        reset: resetState,
      };
    });

    // ===================
    // Error Correction & Bulk Actions
    // ===================

    /**
     * Handles editing a contact or email in the error list.
     * Updates the contact/email and revalidates the row.
     * Allows email to be cleared completely when user deletes all characters.
     * Moves validated rows to preview.success after a delay (handled by useEffect).
     *
     * @param {number} id - The ID of the row to edit.
     * @param {string} newContact - The new contact value.
     * @param {string} [newEmail] - The new email value (optional, can be empty).
     * @returns {void}
     */
    const handleEditContact = (id: number, newContact: string, newEmail?: string) => {
      setPreview((prev) => {
        // Update the row with new contact and email values, allowing empty email
        const updatedErrors = prev.errors.map((row) =>
          row.id === id ? { ...row, contact: newContact, email: newEmail || "" } : row
        );
        const successData = prev.success;
        const contactMap = new Map([...successData, ...updatedErrors].map((r) => [r.contact, r.id]));

        // Revalidate the updated rows, ensuring invalid emails are flagged
        const errorData = updatedErrors.filter((row) => {
          const { normalized: normalizedContact, countryCode, shouldDelete, isAmbiguous, possibleCountries, message } = normalizePhoneForList(row.contact);
          let errorMessage = message;

          // Ensure invalid emails are flagged and kept in errors
          if (row.email && !emailRegex.test(row.email)) {
            errorMessage = errorMessage
              ? `${errorMessage} Invalid email.`
              : "Invalid email.";
          }

          if (shouldDelete) {
            return true; // Keep rows marked for deletion in errors for now
          }

          // Check for duplicates
          if (normalizedContact && contactMap.has(normalizedContact) && contactMap.get(normalizedContact) !== row.id) {
            errorMessage = errorMessage ? `${errorMessage} Duplicate contact.` : "Duplicate contact.";
            return true;
          }

          if (normalizedContact) {
            contactMap.set(normalizedContact, row.id);
          }

          if (isAmbiguous || errorMessage) {
            row.message = errorMessage || (isAmbiguous ? "Local number requires country code selection." : undefined);
            row.countryCode = countryCode;
            row.possibleCountries = possibleCountries;
            return true; // Keep row in errors if it has issues
          }

          // Mark as valid (no message), will be moved to success after delay
          row.message = undefined;
          row.countryCode = countryCode;
          row.possibleCountries = [];
          return true; // Keep in errors temporarily for visual feedback
        });

        return {
          ...prev,
          errors: errorData,
          success: successData, // Success data updated later by useEffect
        };
      });
    };

    /**
     * Handles selecting or deselecting a row in the error list.
     * Toggles the selection state of the row for bulk country code application.
     *
     * @param {number} id - The ID of the row to select/deselect.
     * @returns {void}
     */
    const handleSelectRow = (id: number) => {
      setPreview((prev) => {
        const newSelectedRows = new Set(prev.selectedRows);
        if (newSelectedRows.has(id)) {
          newSelectedRows.delete(id);
        } else {
          newSelectedRows.add(id);
        }
        return { ...prev, selectedRows: newSelectedRows };
      });
    };

    /**
     * Handles bulk applying a country code to selected rows.
     * Updates the contact numbers with the selected country code.
     * @returns {void}
     */
    const handleBulkApplyCountryCode = () => {
      if (!preview.bulkCountryCode || preview.selectedRows.size === 0) return;

      setPreview((prev) => {
        const updatedErrors = prev.errors.map((row) => {
          if (!prev.selectedRows.has(row.id) || row.contact.startsWith("+")) {
            return row;
          }

          const countryCallingCode = Object.keys(COUNTRY_CODE_TO_REGION).find(
            (key) => COUNTRY_CODE_TO_REGION[key] === preview.bulkCountryCode
          );
          if (!countryCallingCode) return row;

          const newContact = `+${countryCallingCode}${row.contact}`;
          const { normalized, countryCode, shouldDelete, isAmbiguous, possibleCountries, message } = normalizePhoneForList(newContact);
          let errorMessage = message;

          // Re-validate email
          if (row.email && !emailRegex.test(row.email)) {
            errorMessage = errorMessage
              ? `${errorMessage} Invalid email.`
              : "Invalid email.";
          }

          if (shouldDelete) return row;

          return {
            ...row,
            contact: normalized || newContact,
            countryCode: countryCode || preview.bulkCountryCode || "",
            message: errorMessage || (isAmbiguous ? "Local number requires country code selection." : undefined),
            possibleCountries: isAmbiguous ? possibleCountries : [],
          };
        });

        const successData = prev.success;
        const contactMap = new Map(
          [...successData, ...updatedErrors].map((r) => [r.contact, r.id])
        );

        const errorData = updatedErrors.filter((row) => {
          const { normalized: normalizedContact, countryCode, shouldDelete, isAmbiguous, possibleCountries, message } = normalizePhoneForList(row.contact);
          let errorMessage = message;

          if (row.email && !emailRegex.test(row.email)) {
            errorMessage = errorMessage
              ? `${errorMessage} Invalid email.`
              : "Invalid email.";
          }

          if (shouldDelete) return true;

          if (normalizedContact && contactMap.has(normalizedContact) && contactMap.get(normalizedContact) !== row.id) {
            errorMessage = errorMessage ? `${errorMessage} Duplicate contact.` : "Duplicate contact.";
            return true;
          }

          if (normalizedContact) {
            contactMap.set(normalizedContact, row.id);
          }

          if (isAmbiguous || errorMessage) {
            row.message = errorMessage || (isAmbiguous ? "Local number requires country code selection." : undefined);
            row.countryCode = countryCode;
            row.possibleCountries = possibleCountries;
            return true;
          }

          row.message = undefined;
          row.countryCode = countryCode;
          row.possibleCountries = [];
          return true; // Keep in errors temporarily for visual feedback
        });

        return {
          ...prev,
          errors: errorData,
          success: successData,
          selectedRows: new Set(),
          bulkCountryCode: null,
        };
      });
    };

    /**
     * Toggles preview dialog maximized/minimized state.
     * @returns {void}
     */
    const toggleMaximize = () => {
      setPreview((prev) => ({ ...prev, isMaximized: !prev.isMaximized }));
    };

    /**
     * Handles changing the number of rows per page in the preview.
     * Resets to the first page when changing rows per page.
     *
     * @param {string} value - The new number of rows per page.
     * @returns {void}
     */
    const handleRowsPerPageChange = (value: string) => {
      setPreview((prev) => ({
        ...prev,
        rowsPerPage: parseInt(value),
        currentPage: 1,
      }));
    };

    // Prepare paginated data for display in the preview 
    const paginatedErrors = preview.errors.slice(
      (preview.currentPage - 1) * preview.rowsPerPage,
      preview.currentPage * preview.rowsPerPage
    );

    // Calculate total pages for pagination
    const totalPages = Math.ceil(preview.errors.length / preview.rowsPerPage);
    const handlePageChange = (page: number) => {
      setPreview((prev) => ({ ...prev, currentPage: page }));
    };

    // Form setup for header selection
    const form = useForm({
      defaultValues: {
        contactColumn: headerSelection.contactColumn,
        nameColumn: headerSelection.nameColumn,
        emailColumn: headerSelection.emailColumn,
        notesColumn: headerSelection.notesColumn,
      },
    });

    const availableHeadersForName = headerSelection.headers.filter(
      (header) => header !== form.watch("contactColumn")
    );
    const availableHeadersForEmail = headerSelection.headers.filter(
      (header) =>
        header !== form.watch("contactColumn") && header !== form.watch("nameColumn")
    );
    const availableHeadersForNotes = headerSelection.headers.filter(
      (header) =>
        header !== form.watch("contactColumn") &&
        header !== form.watch("nameColumn") &&
        header !== form.watch("emailColumn")
    );

    const previewData = headerSelection.data.slice(0, 10);

    const totalRows = headerSelection.data.length;
    const cleanedRows = preview.success.length;
    const previewPercentage = (cleanedRows / totalRows) * 100 || 0;

    // ===================
    // Validation Feedback Handler
    // ===================

    /**
     * Delays the movement of validated rows from preview.errors to preview.success.
     * Provides visual feedback by keeping validated rows visible for 2 seconds with a checkmark.
     */
    useEffect(() => {
      // Identify rows that are now valid (no error message)
      const validatedRows = preview.errors.filter((row) => !row.message);
      if (validatedRows.length > 0) {
        // Delay moving to success for 2 seconds to allow user to see the change
        const timer = setTimeout(() => {
          setPreview((prev) => {
            const newSuccess = [...prev.success, ...validatedRows];
            const newErrors = prev.errors.filter((row) => row.message);
            return { ...prev, success: newSuccess, errors: newErrors };
          });
        }, 2000); // 2-second delay
        return () => clearTimeout(timer);
      }
    }, [preview.errors]);

    return (
      <>
        {file ? (
          <div
            key="file-uploaded"
            className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">{file.name}</span>
              <Button variant="default" size="sm" onClick={resetState}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-gray-700">Click or drag to change file</div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFile}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
          </div>
        ) : (
          <div
            key="file-initial"
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => {
              if (inputRef.current) inputRef.current.click();
            }}
            className={`border-2 border-dashed rounded-md px-4 py-4 text-center cursor-pointer ${dragOver ? "border-primary-500" : "border-gray-300"} relative`}
          >
            <Inbox className="mx-auto mb-2 text-gray-500" size={32} />
            <div className="text-gray-700">
              Click or drag{" "}
              <span className="font-semibold">CSV, XLSX, or XLS</span> file to this
              area to upload
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFile}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
          </div>
        )}
        {/* Header Selection Dialog */}
        <Transition appear show={headerSelection.isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => { }}
            open={headerSelection.isOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900 bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    as="div"
                    className="w-full max-w-6xl transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold leading-6 text-gray-900 mb-4"
                    >
                      Select Columns
                    </Dialog.Title>
                    <div className="flex gap-2 mb-2" >
                      <FileSpreadsheetIcon className="h-10 w-10" />
                      <div className="text-sm text-gray-500">
                        <strong>{headerSelection.fileInfo?.name || "No file selected"} </strong><br />
                        Total Leads: {totalRows}
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      Please select the column that corresponds to the contact
                      information. You can optionally select columns for name,
                      email, and notes. Drag and drop a new file to replace the current one.
                    </p>
                    <h4 className="font-bold text-theme mb-2">Replace File </h4>
                    <div
                      onDrop={(e) => handleDrop(e, true)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      className={`border-2 border-dashed rounded-md p-4 mb-4 text-center cursor-pointer ${dragOver ? "border-primary-500" : "border-gray-300"
                        } relative`}
                    >
                      <Inbox className="mx-auto mb-2 text-gray-500" size={32} />
                      <div className="text-gray-700">
                        Drag and drop a{" "}
                        <span className="font-semibold">CSV, XLSX, or XLS</span>{" "}
                        file here to replace
                      </div>
                      <input
                        ref={inputRef}
                        type="file"
                        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFile}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                    </div>
                    {errorMessage && (
                      <div className="my-2 p-2 bg-red-100 text-red-700 rounded-md text-center">
                        {errorMessage}
                      </div>
                    )}
                    <div className="mb-6 flex flex-wrap gap-4">
                      <FormField
                        control={form.control}
                        name="contactColumn"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[200px]">
                            <FormLabel>
                              Contact Column <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setHeaderSelection((prev) => ({
                                    ...prev,
                                    contactColumn: value,
                                  }));
                                }}
                                defaultValue={field.value ?? undefined}
                                onOpenChange={(open) => {
                                  if (!open) return;
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Contact Column" />
                                </SelectTrigger>
                                <SelectContent onClick={(e) => e.stopPropagation()}>
                                  {headerSelection.headers.map((header) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nameColumn"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[200px]">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setHeaderSelection((prev) => ({
                                    ...prev,
                                    nameColumn: value,
                                  }));
                                }}
                                defaultValue={field.value ?? undefined}
                                onOpenChange={(open) => {
                                  if (!open) return;
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Name Column (Optional)" />
                                </SelectTrigger>
                                <SelectContent onClick={(e) => e.stopPropagation()}>
                                  {availableHeadersForName.map((header) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emailColumn"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[200px]">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setHeaderSelection((prev) => ({
                                    ...prev,
                                    emailColumn: value,
                                  }));
                                }}
                                defaultValue={field.value ?? undefined}
                                onOpenChange={(open) => {
                                  if (!open) return;
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Email Column (Optional)" />
                                </SelectTrigger>
                                <SelectContent onClick={(e) => e.stopPropagation()}>
                                  {availableHeadersForEmail.map((header) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notesColumn"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[200px]">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setHeaderSelection((prev) => ({
                                    ...prev,
                                    notesColumn: value,
                                  }));
                                }}
                                defaultValue={field.value ?? undefined}
                                onOpenChange={(open) => {
                                  if (!open) return;
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Notes Column (Optional)" />
                                </SelectTrigger>
                                <SelectContent onClick={(e) => e.stopPropagation()}>
                                  {availableHeadersForNotes.map((header) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
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
                    <div className="h-[300px] overflow-y-auto border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {headerSelection.headers.map((header) => (
                              <TableHead
                                key={header}
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((row, index) => (
                            <TableRow key={index}>
                              {headerSelection.headers.map((header) => (
                                <TableCell
                                  key={header}
                                  className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                                >
                                  {row[header]?.toString()}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex justify-end gap-x-2">
                      <Button
                        className="rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] shadow-md text-theme"
                        type="reset"
                        onClick={() => {
                          setHeaderSelection((prev) => ({ ...prev, isOpen: false }));
                          resetState();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConfirmHeaders}
                        disabled={!form.watch("contactColumn")}
                        type="button"
                        className="border-2 border-theme bg-theme rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] text-white"
                      >
                        Next
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Preview Dialog */}
        <Transition appear show={preview.isOpen} as={Fragment}>
          <Dialog
            as="div"
            className={`relative z-50 ${preview.isMaximized ? "fixed inset-0" : ""}`}
            onClose={() => { }}
            open={preview.isOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* Background Overlay */}
              <div className="fixed inset-0 bg-gray-900 bg-opacity-25" />
            </Transition.Child>

            {/* This div positions the dialog panel in the center */}
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    as="div"
                    // Make Dialog.Panel a flex column when maximized
                    className={`w-full transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all
                      ${preview.isMaximized
                        ? "fixed inset-0 h-full w-full rounded-none flex flex-col"
                        : "max-w-6xl"
                      }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header section (title and buttons)  */}
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-bold leading-6 text-gray-900"
                      >
                        Review & Correct Data
                      </Dialog.Title>
                      <div className="flex gap-2">
                        {preview.isMaximized ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleMaximize}
                            className="ml-2"
                          >
                            <Minimize className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleMaximize}
                            className="ml-2"
                          >
                            <Maximize className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Info paragraphs */}
                    <div className="flex gap-2 mb-2" >
                      <FileSpreadsheetIcon className="h-10 w-10" />
                      <div className="text-sm text-gray-500">
                        <strong>{headerSelection.fileInfo?.name || "No file selected"} </strong>  <br />
                        Total Contacts: {totalRows} | Cleaned Contacts: {cleanedRows} | Problematic Contacts: {preview.errors.length} <br />
                      </div>
                    </div>

                    {/* Bulk actions section */}
                    <div className="flex justify-between items-center  my-4">
                      <div className="flex items-center gap-2">
                        <Select
                          onValueChange={handleRowsPerPageChange}
                          defaultValue={preview.rowsPerPage.toString()}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Rows per page" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20">20 rows</SelectItem>
                            <SelectItem value="50">50 rows</SelectItem>
                            <SelectItem value="100">100 rows</SelectItem>
                          </SelectContent>
                        </Select>

                        {preview.selectedRows.size > 0 && (
                          <div className="flex items-center gap-2">
                            <Select
                              onValueChange={(value) =>
                                setPreview((prev) => ({ ...prev, bulkCountryCode: value as CountryCode }))
                              }
                              value={preview.bulkCountryCode || undefined}
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select Country Code" />
                              </SelectTrigger>
                              <SelectContent>
                                {TARGET_REGIONS.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              className="rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] font-medium text-theme"
                              variant="outline3"
                              onClick={handleBulkApplyCountryCode}
                              disabled={!preview.bulkCountryCode}
                            >
                              Apply to Selected
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <h4>Showing <span className="text-theme">{preview.errors.length}</span> of {totalRows} problematic rows</h4>
                    <p className="font-bold text-sm my-2"><span className="font-bold text-theme"> {previewPercentage.toFixed(1)}% </span> Ready for import</p>

                    {/* Table Container */}
                    {/* In normal mode, it's fixed height. In maximized, it grows (flex-1) */}
                    <div
                      className={`border rounded-md mb-4 ${preview.isMaximized ? "flex-1 overflow-y-auto" : "h-[400px] overflow-y-auto"}`}
                    >
                      {preview.errors.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-center w-[50px]">Select</TableHead>
                              <TableHead className="text-center w-[50px]">Status</TableHead>
                              <TableHead className="text-center">Name</TableHead>
                              <TableHead className="text-center max-w-[200px]">Email</TableHead>
                              <TableHead className="text-center">Contact</TableHead>
                              <TableHead className="text-center max-w-[200px]">Notes</TableHead>
                              <TableHead className="text-center max-w-[200px]">Error</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedErrors.map((data) => (
                              <TableRow
                                key={data.id}
                                // Change row color based on validation status
                                className={data.message ? "text-red-600" : "text-green-600 bg-green-100"}
                                title={data.message || "Validated successfully"}
                              >
                                <TableCell className="text-center w-[50px]">
                                  <Checkbox
                                    checked={preview.selectedRows.has(data.id)}
                                    onCheckedChange={(checked) => handleSelectRow(data.id)}
                                  />
                                </TableCell>
                                <TableCell className="text-center w-[50px]">
                                  {/* Show checkmark for validated rows alongside checkbox */}
                                  {!data.message && <Check className="h-4 w-4 text-green-600 mx-auto" />}
                                </TableCell>
                                <TableCell className="text-center">{data.name}</TableCell>
                                <TableCell className="text-center max-w-[200px]">
                                  {/* Editable email field with validation */}
                                  <Input
                                    value={data.email || ""}
                                    onChange={(e) => handleEditContact(data.id, data.contact, e.target.value)}
                                    className="w-[150px]"
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Input
                                    value={data.contact}
                                    onChange={(e) => handleEditContact(data.id, e.target.value, data.email)}
                                    className="w-[150px]"
                                  />
                                </TableCell>
                                <TableCell className="text-center max-w-[200px]">
                                  {data.notes}
                                </TableCell>
                                <TableCell className="text-center max-w-[200px]">
                                  {data.message || "Valid"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500">
                            No problematic rows found. All {cleanedRows} rows are valid and ready to
                            import.
                          </TableCell>
                        </TableRow>
                      )}
                    </div>


                    {/* Pagination  */}
                    {preview.errors.length > 0 && (
                      <div className="flex justify-between gap-3 items-center mt-2">

                        <div className="flex justify-between items-center gap-3 mt-2">
                          <Button
                            className="rounded-md md:p-3 md:!h-[40px] xl:!h-[30px]"
                            variant="outline2"
                            onClick={() =>
                              handlePageChange(Math.max(1, preview.currentPage - 1))
                            }
                            disabled={preview.currentPage === 1}
                          >
                            <MoveLeftIcon />  Previous
                          </Button>
                          <span>
                            Page {preview.currentPage} of {totalPages}
                          </span>
                          <Button
                            className="rounded-md md:p-3 md:!h-[40px] xl:!h-[30px]"
                            variant="outline"
                            onClick={() =>
                              handlePageChange(Math.min(totalPages, preview.currentPage + 1))
                            }
                            disabled={preview.currentPage === totalPages}
                          >
                            Next  <MoveRightIcon />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Footer buttons  */}
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        className="rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] shadow-md text-theme"
                        onClick={handleGoBack}
                      >
                        Go Back
                      </Button>
                      <Button
                        onClick={handleConfirmImport}
                        className="border-2 border-theme bg-theme rounded-md md:p-3 md:!h-[40px] xl:!h-[30px] text-white"
                      >
                        Confirm Import ({preview.success.length} Rows)
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  }
);

CustomSpreadsheetReader.displayName = "CustomSpreadsheetReader";

export default CustomSpreadsheetReader;