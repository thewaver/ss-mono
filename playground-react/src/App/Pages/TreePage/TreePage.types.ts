import type { Dispatch, SetStateAction } from "react";

import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type TreeExampleProps = {
    value: readonly [string | undefined, (value: string | undefined) => void];
    expanded: readonly [string[], Dispatch<SetStateAction<string[]>>];
};

export type TreeRecordExampleProps = {
    value: readonly [Asset | undefined, (value: Asset | undefined) => void];
    expanded: readonly [Asset[], (value: Asset[]) => void];
};
