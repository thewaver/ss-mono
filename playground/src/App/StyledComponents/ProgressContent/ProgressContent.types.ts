import type { ProgressState } from "@thewaver/ss-components";

export type ProgressContentOrientation = "horizontal" | "vertical";

export type BaseProgressContentValues = {
    state: ProgressState;
    orientation?: ProgressContentOrientation;
};

export type BaseProgressContentProps = BaseProgressContentValues;
