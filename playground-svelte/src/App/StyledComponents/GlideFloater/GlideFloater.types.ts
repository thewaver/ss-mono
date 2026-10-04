export type GlideFloaterProps = {
    kind: "selection" | "highlight";
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type GlideLabelProps = {
    isSelected: boolean;
};
