import type { ReactNode } from "react";

import type { StressTestDefs } from "@thewaver/ss-playground/App/PageComponents/StressTest/StressText.types";

export type { StressTestDefs } from "@thewaver/ss-playground/App/PageComponents/StressTest/StressText.types";

export type StressTestProps = {
    configs: StressTestDefs[];
    onShowModal?: () => void;
    onHideModal?: () => void;
    renderLabel: (configIndex: number) => ReactNode;
    renderItem: (configIndex: number, itemIndex: number) => ReactNode;
};
