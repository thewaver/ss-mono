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

export const DOCS_ROOT = "/src/App/Pages/ToastsPage/Docs";

export const FIELD_WIDTH = 140;

export const DRAFT_DELETED_MESSAGE = "Draft deleted.";

export const RIGHT_TO_LEFT_MESSAGE = "Your changes were published.";

export const FAR_DOWN_MESSAGE = "Profile saved.";

export const OUTSIDE_MESSAGE = "A sync finished in the background.";
