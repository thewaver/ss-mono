import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type TreeExampleProps = {
    value: string | undefined;
    expanded: string[];
};

export type TreeLeaningExampleProps = TreeExampleProps & {
    falloff: TreeFalloff;
};

export type TreeRecordExampleProps = {
    value: Asset | undefined;
    expanded: Asset[];
};

export type TreeCheckboxExampleProps = {
    checked: string[];
    expanded: string[];
};
