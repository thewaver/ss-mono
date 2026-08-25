import type { AccessorProps, InteractionFlags, SlideButtonFlags } from "@thewaver/ss-components";

export type SlideButtonContentProps = AccessorProps<{
    flags: InteractionFlags<SlideButtonFlags>;
    width?: number;
}>;
