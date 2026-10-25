import type { ScrollerProgress } from "@thewaver/ss-components-react";
import type {
    BaseScrollerBasicDocsExampleValues,
    BaseScrollerBothWaysDocsExampleValues,
    BaseScrollerFadingDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.types";

export type ScrollerBasicDocsExampleProps = BaseScrollerBasicDocsExampleValues;

export type ScrollerDrivenDocsExampleProps = {
    progress: readonly [ScrollerProgress, (progress: ScrollerProgress) => void];
};

export type ScrollerBothWaysDocsExampleProps = BaseScrollerBothWaysDocsExampleValues;

export type ScrollerFadingDocsExampleProps = BaseScrollerFadingDocsExampleValues;
