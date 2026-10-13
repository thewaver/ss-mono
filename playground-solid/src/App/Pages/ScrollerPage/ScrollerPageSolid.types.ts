import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseScrollerExampleValues,
    BaseScrollerTabbedExampleCbs,
    BaseScrollerTabbedExampleValues,
} from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.types";

export type ScrollerExampleProps = AccessorValues<BaseScrollerExampleValues>;

export type ScrollerTabbedExampleProps = AccessorValues<BaseScrollerTabbedExampleValues> & BaseScrollerTabbedExampleCbs;
