import type { DateValueCalendarId } from "../../../Abstracts/DateValue/DateValue.types";
import type { DateInputFormat } from "./DateInput.types";

export const DATE_INPUT_DEFAULTS = {
    format: "iso" as DateInputFormat,
    calendar: "gregory" as DateValueCalendarId,
};
