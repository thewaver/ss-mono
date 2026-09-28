import type { Signal } from "solid-js";

import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type TreeExampleProps = {
    valueSignal: Signal<string | undefined>;
    expandedSignal: Signal<string[]>;
};

export type TreeRecordExampleProps = {
    valueSignal: Signal<Asset | undefined>;
    expandedSignal: Signal<Asset[]>;
};
