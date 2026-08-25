import type { AccessorProps, CalendarFlags, InteractionFlags } from "@thewaver/ss-components";

export type CalendarDayProps = AccessorProps<{
    flags: InteractionFlags<CalendarFlags>;
}>;

export type CalendarTitleProps = AccessorProps<{
    flags: InteractionFlags;
}>;
