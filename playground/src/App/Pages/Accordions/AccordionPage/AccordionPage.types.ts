import type { AccordionOrientation } from "@thewaver/ss-components";

export type AccordionPolicy = "many" | "single" | "single_required";

export type BaseAccordionBasicDocsExampleValues = {
    gap: number;
    transitionDurationMs: number;
    isSingleExpand: boolean;
    isExpandRequired: boolean;
};

export type BaseAccordionScrolledDocsExampleValues = {
    isScrolledIntoViewOnExpand: boolean;
};

export type BaseAccordionOrientationDocsExampleValues = {
    orientation: AccordionOrientation;
};
