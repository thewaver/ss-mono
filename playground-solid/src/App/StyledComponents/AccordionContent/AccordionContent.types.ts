import type { AccessorProps, CollapsibleFlags, InteractionFlags } from "@thewaver/ss-components-solid";

export type AccordionHeaderProps = AccessorProps<{
    flags: InteractionFlags<CollapsibleFlags>;
}>;

export type AccordionPanelProps = AccessorProps<{
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
}>;
