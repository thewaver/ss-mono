import type { CalendarRenderProps, InteractionFlags } from "@thewaver/ss-components-vue";

export type CalendarDayProps = {
    renderProps: InteractionFlags<CalendarRenderProps>;
};

export type CalendarTitleProps = {
    flags: InteractionFlags;
};
