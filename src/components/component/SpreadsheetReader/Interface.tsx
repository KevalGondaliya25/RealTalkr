import { SpreadsheetRowErrorType, SpreadsheetRowType, FileInfo } from "@/types/lead";
import { CountryCode } from "libphonenumber-js";



export interface SpreadsheetReaderRef {
    reset: () => void; // Expose reset function
}

export interface SpreadsheetReaderHeaderSelectionState {
    isOpen: boolean;
    headers: string[];
    data: Array<Record<string, any>>;
    fileInfo: FileInfo | null;
    contactColumn: string;
    nameColumn: string | null;
    emailColumn: string | null;
    notesColumn: string | null;
}

export interface SpreadsheetReaderPreviewState {
    isOpen: boolean;
    success: Array<SpreadsheetRowType>;
    errors: Array<SpreadsheetRowErrorType>;
    fileInfo: FileInfo | null;
    isMaximized: boolean;
    currentPage: number;
    rowsPerPage: number;
    selectedRows: Set<number>;
    bulkCountryCode: CountryCode | null;
}

export interface SpreadsheetReaderPhoneNormalizationResult {
    normalized: string | null;
    countryCode: string;
    shouldDelete: boolean;
    isAmbiguous: boolean;
    possibleCountries: CountryCode[];
    message?: string;
}