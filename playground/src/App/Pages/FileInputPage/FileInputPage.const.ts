import type { FileInputRejectReason } from "@thewaver/ss-components";

const BYTES_PER_KILOBYTE = 1024;
const DROP_ZONE_MAX_KILOBYTES = 200;

export const MAX_ATTACHMENT_BYTES = 1024;

export const DROP_ZONE_ACCEPT = "image/*";
export const DROP_ZONE_MAX_FILES = 3;
export const DROP_ZONE_MAX_SIZE_BYTES = DROP_ZONE_MAX_KILOBYTES * BYTES_PER_KILOBYTE;

export const DROP_ZONE_REASON_TEXT: Record<FileInputRejectReason, string> = {
    count: `over the limit of ${DROP_ZONE_MAX_FILES} files`,
    size: `larger than ${DROP_ZONE_MAX_KILOBYTES} KB`,
    type: "not an image",
};
