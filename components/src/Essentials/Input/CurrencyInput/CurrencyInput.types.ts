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

export type BaseCurrencyInputValues = {
    /** How many digits are kept after the decimal separator. */
    decimals?: number;
    /**
     * Which country's conventions the amount is written in, which decides the separators. The library draws no
     * currency symbol; a painter that draws one decides where it sits.
     */
    locale?: string;
    /** Whether negative amounts can be entered. */
    hasSign?: boolean;
    /** How the digits before the decimal point are grouped. Leave it out for the locale's own grouping. */
    groupSizes?: number[];
};

export type BaseCurrencyInputProps = BaseCurrencyInputValues;
