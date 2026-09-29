import type { Signal } from "solid-js";

import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

export type TreeExampleProps = {
    value: Signal<string | undefined>;
    expanded: Signal<string[]>;
};

export type TreeRecordExampleProps = {
    value: Signal<Asset | undefined>;
    expanded: Signal<Asset[]>;
};
