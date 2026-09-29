import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type TreeExampleProps = {
    value: string | undefined;
    expanded: string[];
};

export type TreeRecordExampleProps = {
    value: Asset | undefined;
    expanded: Asset[];
};
