import type {
    CollapsibleFlags,
    CollapsibleSectionFlags,
    CollapsibleSide,
    InteractionFlags,
} from "@thewaver/ss-components";

export type BaseAccordionWrapperValues = {
    flags: CollapsibleSectionFlags;
};

export type BaseAccordionWrapperProps = BaseAccordionWrapperValues;

export type BaseAccordionHeaderValues = {
    flags: InteractionFlags<CollapsibleFlags>;
    side?: CollapsibleSide;
};

export type BaseAccordionHeaderProps = BaseAccordionHeaderValues;

export type BaseAccordionPanelValues = {
    side?: CollapsibleSide;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type BaseAccordionPanelProps = BaseAccordionPanelValues;
