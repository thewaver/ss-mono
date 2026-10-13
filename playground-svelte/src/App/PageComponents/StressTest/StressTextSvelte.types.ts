import type { Snippet } from "svelte";

import type { StressTestDefs } from "@thewaver/ss-playground/App/PageComponents/StressTest/StressText.types";

export type { StressTestDefs } from "@thewaver/ss-playground/App/PageComponents/StressTest/StressText.types";

export type StressTestProps = {
    configs: StressTestDefs[];
    onShowModal?: () => void;
    onHideModal?: () => void;
    renderLabel: Snippet<[configIndex: number]>;
    renderItem: Snippet<[configIndex: number, itemIndex: number]>;
};
