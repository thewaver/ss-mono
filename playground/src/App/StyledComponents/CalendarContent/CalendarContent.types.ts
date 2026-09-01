import type { AccessorProps, CalendarRenderProps, InteractionFlags } from "@thewaver/ss-components";

export type CalendarDayProps = AccessorProps<{
    renderProps: InteractionFlags<CalendarRenderProps>;
}>;

export type CalendarTitleProps = AccessorProps<{
    flags: InteractionFlags;
}>;
