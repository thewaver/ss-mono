import type { JSX } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { StressTestDefs } from "@thewaver/ss-playground/App/PageComponents/StressTest/StressText.types";

export type { StressTestDefs } from "@thewaver/ss-playground/App/PageComponents/StressTest/StressText.types";

export type StressTestProps = AccessorProps<{
    configs: StressTestDefs[];
    onShowModal?: () => void;
    onHideModal?: () => void;
    renderLabel: (getConfigIndex: () => number) => JSX.Element;
    renderItem: (getConfigIndex: () => number, getItemIndex: () => number) => JSX.Element;
}>;
