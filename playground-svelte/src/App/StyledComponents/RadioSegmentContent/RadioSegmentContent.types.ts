import type { BinarySwitchFlags, InteractionFlags } from "@thewaver/ss-components-svelte";

export type RadioSegmentContentProps = {
    flags: InteractionFlags<BinarySwitchFlags>;
};

export type RadioSegmentFloaterProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};
