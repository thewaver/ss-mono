import type { ScrollerProgress } from "@thewaver/ss-components-svelte";
import type {
    BaseScrollerBasicDocsExampleValues,
    BaseScrollerBothWaysDocsExampleValues,
    BaseScrollerFadingDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.types";

export type ScrollerBasicDocsExampleProps = BaseScrollerBasicDocsExampleValues;

export type ScrollerDrivenDocsExampleProps = {
    progress: ScrollerProgress;
};

export type ScrollerBothWaysDocsExampleProps = BaseScrollerBothWaysDocsExampleValues;

export type ScrollerFadingDocsExampleProps = BaseScrollerFadingDocsExampleValues;
