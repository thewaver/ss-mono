import type { AccessorProps, InteractionFlags, ScrollerStep } from "@thewaver/ss-components-solid";

export type ScrollerButtonContentProps = AccessorProps<{
    flags: InteractionFlags;
    step: ScrollerStep;
}>;
