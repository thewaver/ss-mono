import type { ToastKind } from "../../StyledComponents/ToastContent/ToastContent.types";

export const NO_LIMIT = 0;

export const STICKY = 0;

export const BURST_SIZE = 5;

export const MESSAGES: Record<ToastKind, string> = {
    info: "Your export is being prepared.",
    success: "Settings saved.",
    error: "Upload failed — the file was larger than 25 MB.",
};

export const TOAST_ID_PREFIX = "toast";
