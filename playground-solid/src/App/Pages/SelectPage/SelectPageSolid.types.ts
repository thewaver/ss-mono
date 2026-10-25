import type { Signal } from "solid-js";

import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseSelectBasicDocsExampleValues,
    BaseSelectDisabledOptionsDocsExampleValues,
    BaseSelectGroupsDocsExampleValues,
    BaseSelectTooltipDocsExampleValues,
    BaseSelectVirtualizedDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.types";

export type SelectBasicDocsExampleProps = AccessorValues<BaseSelectBasicDocsExampleValues>;

export type SelectGroupsDocsExampleProps = AccessorValues<BaseSelectGroupsDocsExampleValues>;

export type SelectDisabledOptionsDocsExampleProps = AccessorValues<BaseSelectDisabledOptionsDocsExampleValues>;

export type SelectVirtualizedDocsExampleProps = AccessorValues<BaseSelectVirtualizedDocsExampleValues> & {
    visibility: Signal<boolean>;
};

export type SelectTooltipDocsExampleProps = AccessorValues<BaseSelectTooltipDocsExampleValues>;
