import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type TreeExampleProps = {
    "value": string | undefined;
    "onUpdate:value"?: (value: string | undefined) => void;
    "expanded": string[];
    "onUpdate:expanded"?: (value: string[]) => void;
};

export type TreeLeaningExampleProps = TreeExampleProps & {
    falloff: TreeFalloff;
};

export type TreeRecordExampleProps = {
    "value": Asset | undefined;
    "onUpdate:value"?: (value: Asset | undefined) => void;
    "expanded": Asset[];
    "onUpdate:expanded"?: (value: Asset[]) => void;
};
