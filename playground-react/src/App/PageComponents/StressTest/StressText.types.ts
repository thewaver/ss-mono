import type { ReactNode } from "react";

export type StressTestDefs = {
    count: number;
    cols: number;
    gap: number;
};

export type StressTestProps = {
    configs: StressTestDefs[];
    onShowModal?: () => void;
    onHideModal?: () => void;
    renderLabel: (configIndex: number) => ReactNode;
    renderItem: (configIndex: number, itemIndex: number) => ReactNode;
};
