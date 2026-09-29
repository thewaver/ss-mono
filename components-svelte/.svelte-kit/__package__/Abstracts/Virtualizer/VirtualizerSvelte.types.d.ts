import type { Attachment } from "svelte/attachments";
import type { VirtualizerRow } from "@thewaver/ss-components";
export type VirtualizerRowWindowOpts = {
    getIsDisabled: () => boolean;
    computeEstimatedSize: (index: number) => number;
    getPinnedRows?: () => number[];
    getOverscan?: () => number | undefined;
};
export type VirtualizerRowWindow = {
    getIsLive: () => boolean;
    getRows: () => VirtualizerRow[];
    getTotalSize: () => number;
    getRowStart: (row: VirtualizerRow) => number;
    measureRow: (index: number) => Attachment<HTMLElement>;
    scrollToRow: (index: number) => void;
};
