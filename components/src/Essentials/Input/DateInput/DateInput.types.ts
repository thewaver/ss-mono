import type { DateValueEra } from "../../../Abstracts/DateValue/DateValue.types";

export type DateInputFormat = "iso" | "day-month-year" | "month-day-year";

export type DateInputPart = "year" | "month" | "day";

export type DateInputEra = {
    getValue: () => string;
    getOptions: () => DateValueEra[];
    set: (next: string) => void;
};
