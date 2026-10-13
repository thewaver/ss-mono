import type { CalendarRenderProps, InteractionFlags } from "@thewaver/ss-components";

export type BaseCalendarDayValues = {
    renderProps: InteractionFlags<CalendarRenderProps>;
};

export type BaseCalendarDayProps = BaseCalendarDayValues;

export type BaseCalendarTitleValues = {
    flags: InteractionFlags;
};

export type BaseCalendarTitleProps = BaseCalendarTitleValues;
