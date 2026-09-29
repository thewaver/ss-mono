import type { Snippet } from "svelte";

export type StressTestDefs = {
    count: number;
    cols: number;
    gap: number;
};

export type StressTestProps = {
    configs: StressTestDefs[];
    onShowModal?: () => void;
    onHideModal?: () => void;
    renderLabel: Snippet<[configIndex: number]>;
    renderItem: Snippet<[configIndex: number, itemIndex: number]>;
};
