import type { InteractionFlags, ScrollerAxis, ScrollerStep } from "@thewaver/ss-components";

export type BaseScrollerButtonContentValues = {
    flags: InteractionFlags;
    step: ScrollerStep;
    axis?: ScrollerAxis;
};

export type BaseScrollerButtonContentProps = BaseScrollerButtonContentValues;
