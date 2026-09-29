import type { CollapsibleFlags, InteractionFlags } from "@thewaver/ss-components-svelte";

export type AccordionHeaderProps = {
    flags: InteractionFlags<CollapsibleFlags>;
};

export type AccordionPanelProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};
