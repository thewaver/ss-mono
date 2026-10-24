import type { CollapsibleFlags, CollapsibleSide, InteractionFlags } from "@thewaver/ss-components";

export type BaseAccordionHeaderValues = {
    flags: InteractionFlags<CollapsibleFlags>;
    side?: CollapsibleSide;
};

export type BaseAccordionHeaderProps = BaseAccordionHeaderValues;

export type BaseAccordionPanelValues = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type BaseAccordionPanelProps = BaseAccordionPanelValues;
