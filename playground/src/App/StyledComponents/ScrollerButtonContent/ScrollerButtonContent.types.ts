import type { AccessorProps, InteractionFlags, ScrollerStep } from "@thewaver/ss-components";

export type ScrollerButtonContentProps = AccessorProps<{
    flags: InteractionFlags;
    step: ScrollerStep;
}>;
