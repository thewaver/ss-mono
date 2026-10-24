import type {
    BaseCollapsibleBasicDocsExampleValues,
    BaseCollapsibleSideDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.types";

export type CollapsibleBasicDocsExampleProps = BaseCollapsibleBasicDocsExampleValues;

export type CollapsibleSideDocsExampleProps = BaseCollapsibleSideDocsExampleValues;

export type CollapsibleDeferredPanelProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    onBuild: () => void;
};
