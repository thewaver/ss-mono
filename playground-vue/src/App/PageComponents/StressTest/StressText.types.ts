import type { VNodeChild } from "vue";

export type StressTestDefs = {
    count: number;
    cols: number;
    gap: number;
};

export type StressTestProps = {
    configs: StressTestDefs[];
    onShowModal?: () => void;
    onHideModal?: () => void;
};

export type StressTestSlots = {
    renderLabel: (props: { configIndex: number }) => VNodeChild;
    renderItem: (props: { configIndex: number; itemIndex: number }) => VNodeChild;
};
