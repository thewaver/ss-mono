export type TextSyncElement = HTMLInputElement | HTMLTextAreaElement;

export type TextSyncMaskResult = {
    text: string;
    caret: number;
};

export type TextSyncMaskFn = (
    previous: string,
    next: string,
    caret: number,
    isForwardDeletion: boolean,
) => TextSyncMaskResult;

export type TextSyncGroupDefs = {
    groupSizes: number[];
    groupSeparator: string;
    decimalSeparator: string;
    decimals: number;
    hasSign?: boolean;
};

export type TextSyncValueSync = {
    sync: (element: TextSyncElement) => void;
    handleInput: (element: TextSyncElement, inputType?: string) => void;
    handleCompositionStart: () => void;
    handleCompositionEnd: (element: TextSyncElement) => void;
};
