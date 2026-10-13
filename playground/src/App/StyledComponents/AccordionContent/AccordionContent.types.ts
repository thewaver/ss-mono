import type { CollapsibleFlags, InteractionFlags } from "@thewaver/ss-components";

export type BaseAccordionHeaderValues = {
    flags: InteractionFlags<CollapsibleFlags>;
};

export type BaseAccordionHeaderProps = BaseAccordionHeaderValues;

export type BaseAccordionPanelValues = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type BaseAccordionPanelProps = BaseAccordionPanelValues;
