import type { HTMLAttributes, Ref } from "react";

import type {
    BaseCalendarDayProps,
    BaseCalendarTitleProps,
} from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.types";

export type CalendarDayProps = BaseCalendarDayProps;

export type CalendarTitleProps = BaseCalendarTitleProps;

export type CalendarCaptionFieldsProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
    ref?: Ref<HTMLDivElement>;
};
