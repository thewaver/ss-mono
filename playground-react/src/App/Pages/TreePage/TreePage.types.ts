import type { Dispatch, SetStateAction } from "react";

import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type TreeExampleProps = {
    valueState: readonly [string | undefined, (value: string | undefined) => void];
    expandedState: readonly [string[], Dispatch<SetStateAction<string[]>>];
};

export type TreeRecordExampleProps = {
    valueState: readonly [Asset | undefined, (value: Asset | undefined) => void];
    expandedState: readonly [Asset[], (value: Asset[]) => void];
};
