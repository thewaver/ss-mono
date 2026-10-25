import type {
    BaseSelectBasicDocsExampleValues,
    BaseSelectDisabledOptionsDocsExampleValues,
    BaseSelectGroupsDocsExampleValues,
    BaseSelectTooltipDocsExampleValues,
    BaseSelectVirtualizedDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.types";

export type SelectBasicDocsExampleProps = BaseSelectBasicDocsExampleValues;

export type SelectGroupsDocsExampleProps = BaseSelectGroupsDocsExampleValues;

export type SelectDisabledOptionsDocsExampleProps = BaseSelectDisabledOptionsDocsExampleValues;

export type SelectVirtualizedDocsExampleProps = BaseSelectVirtualizedDocsExampleValues & {
    visibility: boolean;
};

export type SelectTooltipDocsExampleProps = BaseSelectTooltipDocsExampleValues;
