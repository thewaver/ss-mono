import type { HTMLAttributes, Ref } from "react";

import type { CalendarRenderProps, InteractionFlags } from "@thewaver/ss-components-react";

export type CalendarDayProps = {
    renderProps: InteractionFlags<CalendarRenderProps>;
};

export type CalendarTitleProps = {
    flags: InteractionFlags;
};

export type CalendarCaptionFieldsProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
    ref?: Ref<HTMLDivElement>;
};
