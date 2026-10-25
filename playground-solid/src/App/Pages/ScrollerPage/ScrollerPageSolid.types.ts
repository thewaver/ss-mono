import type { Signal } from "solid-js";

import type { AccessorValues, ScrollerProgress } from "@thewaver/ss-components-solid";
import type {
    BaseScrollerBasicDocsExampleValues,
    BaseScrollerBothWaysDocsExampleValues,
    BaseScrollerFadingDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.types";

export type ScrollerBasicDocsExampleProps = AccessorValues<BaseScrollerBasicDocsExampleValues>;

export type ScrollerDrivenDocsExampleProps = {
    progress: Signal<ScrollerProgress>;
};

export type ScrollerBothWaysDocsExampleProps = AccessorValues<BaseScrollerBothWaysDocsExampleValues>;

export type ScrollerFadingDocsExampleProps = AccessorValues<BaseScrollerFadingDocsExampleValues>;
