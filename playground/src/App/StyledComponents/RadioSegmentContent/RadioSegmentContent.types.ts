import type { AccessorProps, BinarySwitchFlags, InteractionFlags } from "@thewaver/ss-components";

export type RadioSegmentContentProps = AccessorProps<{
    flags: InteractionFlags<BinarySwitchFlags>;
}>;

export type RadioSegmentFloaterProps = AccessorProps<{
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
}>;
