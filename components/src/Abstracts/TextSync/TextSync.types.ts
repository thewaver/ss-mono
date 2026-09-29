export type TextSyncElement = HTMLInputElement | HTMLTextAreaElement;

export type TextSyncMaskResult = {
    text: string;
    caret: number;
};

export type TextSyncGroupDefs = {
    groupSizes: number[];
    groupSeparator: string;
    decimalSeparator: string;
    decimals: number;
    hasSign?: boolean;
};

export type TextSyncValueSync = {
    sync: (element: TextSyncElement) => void;
    handleInput: (element: TextSyncElement) => void;
    handleCompositionStart: () => void;
    handleCompositionEnd: (element: TextSyncElement) => void;
};
