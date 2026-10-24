import type {
    BaseAccordionBasicDocsExampleValues,
    BaseAccordionOrientationDocsExampleValues,
    BaseAccordionScrolledDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.types";

export type AccordionBasicDocsExampleProps = BaseAccordionBasicDocsExampleValues;

export type AccordionScrolledDocsExampleProps = BaseAccordionScrolledDocsExampleValues;

export type AccordionOrientationDocsExampleProps = BaseAccordionOrientationDocsExampleValues;

export type AccordionDeferredPanelProps = {
    value: string;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    onBuild: (value: string) => void;
};
