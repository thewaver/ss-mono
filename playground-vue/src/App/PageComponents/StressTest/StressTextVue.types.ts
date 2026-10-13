import type { VNodeChild } from "vue";

import type { StressTestDefs } from "@thewaver/ss-playground/App/PageComponents/StressTest/StressText.types";

export type { StressTestDefs } from "@thewaver/ss-playground/App/PageComponents/StressTest/StressText.types";

export type StressTestProps = {
    configs: StressTestDefs[];
    onShowModal?: () => void;
    onHideModal?: () => void;
};

export type StressTestSlots = {
    renderLabel: (props: { configIndex: number }) => VNodeChild;
    renderItem: (props: { configIndex: number; itemIndex: number }) => VNodeChild;
};
