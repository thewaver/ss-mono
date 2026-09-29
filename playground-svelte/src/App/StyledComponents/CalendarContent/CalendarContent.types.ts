import type { HTMLAttributes } from "svelte/elements";

import type { CalendarRenderProps, InteractionFlags } from "@thewaver/ss-components-svelte";

export type CalendarDayProps = {
    renderProps: InteractionFlags<CalendarRenderProps>;
};

export type CalendarTitleProps = {
    flags: InteractionFlags;
};

export type CalendarCaptionFieldsProps = Omit<HTMLAttributes<HTMLDivElement>, "class"> & {
    ref?: HTMLDivElement;
};
