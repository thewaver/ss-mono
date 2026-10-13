export type BaseGlideFloaterValues = {
    kind: "selection" | "highlight";
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type BaseGlideFloaterProps = BaseGlideFloaterValues;

export type BaseGlideLabelValues = {
    isSelected: boolean;
    isDisabled?: boolean;
};

export type BaseGlideLabelProps = BaseGlideLabelValues;
