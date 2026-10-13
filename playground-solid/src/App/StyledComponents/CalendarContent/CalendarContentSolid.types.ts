import type { JSX } from "solid-js";

import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseCalendarDayValues,
    BaseCalendarTitleValues,
} from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.types";

export type CalendarDayProps = AccessorValues<BaseCalendarDayValues>;

export type CalendarTitleProps = AccessorValues<BaseCalendarTitleValues>;

export type CalendarCaptionFieldsProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "class" | "classList">;
