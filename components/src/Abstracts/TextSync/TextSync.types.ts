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
