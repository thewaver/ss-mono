import type { TextSyncGroupDefs } from "../../../Abstracts/TextSync/TextSync.types";

export type CurrencyInputFormatDefs = {
    locale?: string;
    groupSizes?: number[];
    decimals: number;
    hasSign: boolean;
};

export type CurrencyInputRuleDefs = {
    getGroupDefs: () => TextSyncGroupDefs;
    getDecimals: () => number;
    getHasSign: () => boolean;
    getMin: () => number | undefined;
    getMax: () => number | undefined;
};
