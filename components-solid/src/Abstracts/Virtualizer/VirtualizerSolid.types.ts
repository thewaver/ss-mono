import type { Accessor } from "solid-js";

import type { VirtualizerRow } from "@thewaver/ss-components";

export type VirtualizerRowWindowOpts = {
    getIsDisabled: Accessor<boolean>;
    computeEstimatedSize: (index: number) => number;
    getPinnedRows?: Accessor<number[]>;
    getOverscan?: Accessor<number>;
};

export type VirtualizerRowWindow = {
    getIsLive: Accessor<boolean>;
    getRows: Accessor<VirtualizerRow[]>;
    getTotalSize: Accessor<number>;
    getRowStart: (row: VirtualizerRow) => number;
    measureRow: (element: HTMLElement, index: number) => void;
    scrollToRow: (index: number) => void;
};
